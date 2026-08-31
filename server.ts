import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/scan-media", async (req, res) => {
    const { imageBase64, mimeType } = req.body;
    
    if (!imageBase64 || !mimeType) {
      return res.status(400).json({ error: "Missing image or mime type" });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY!,
        httpOptions: {
            headers: {
            'User-Agent': 'aistudio-build',
            }
        }
      });

      const prompt = `Analyze this image for signs of AI-generation or manipulation. 
      Provide a response in JSON format with the following fields:
      - isManipulated: boolean
      - confidence: "High" | "Moderate" | "Low"
      - analysis: string (a short plain-english explanation)
      - regions: Array<{ area: string, reason: string, confidence: "High" | "Moderate" | "Low" }>
      - overallAssessment: "No strong manipulation indicators" | "Possibly manipulated — needs review" | "Strong indicators of manipulation"
      
      Do not include any other text in the response, only the JSON object.`;

      const imagePart = {
        inlineData: {
          mimeType,
          data: imageBase64,
        },
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: { parts: [imagePart, { text: prompt }] },
        config: {
          responseMimeType: "application/json",
        },
      });

      const data = JSON.parse(response.text || "{}");
      res.json(data);
    } catch (error) {
      console.error("Error scanning media:", error);
      res.status(500).json({ error: "Failed to scan media" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
