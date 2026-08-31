import React, { useState } from 'react';
import { Camera, AlertTriangle, CheckCircle2, XCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

export const DeepfakeScanner: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showWhy, setShowWhy] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const scanMedia = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      const base64Data = base64.split(',')[1];
      
      try {
        const response = await fetch('/api/scan-media', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            imageBase64: base64Data, 
            mimeType: file.type 
          }),
        });
        const data = await response.json();
        setResult(data);
      } catch (err) {
        console.error("Scan failed", err);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-4">
      <h3 className="text-lg font-extrabold text-gray-900 font-display flex items-center gap-2">
        <Camera className="w-5 h-5 text-emerald-700" /> Deepfake X-Ray
      </h3>
      <input type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
      <button 
        onClick={scanMedia} 
        disabled={!file || loading}
        className="w-full bg-[#0A3D2E] text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Camera className="w-5 h-5"/> Scan Media</>}
      </button>

      {result && (
        <div className="space-y-4 mt-6">
          <div className={`p-4 rounded-2xl border ${result.overallAssessment.includes('Strong') ? 'bg-red-50 border-red-200' : result.overallAssessment.includes('Possibly') ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <p className="font-bold">{result.overallAssessment}</p>
          </div>
          <button onClick={() => setShowWhy(!showWhy)} className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
            Show me why {showWhy ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
          </button>
          {showWhy && (
            <div className="text-sm space-y-2 bg-gray-50 p-4 rounded-xl">
              {result.regions.map((r: any, i: number) => (
                <p key={i}><strong>{r.area}:</strong> {r.reason} (Confidence: {r.confidence})</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
