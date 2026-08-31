import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Layers, 
  Maximize2, 
  RefreshCw, 
  Sliders, 
  Palette, 
  Image as ImageIcon,
  Zap,
  Info,
  ShieldCheck
} from 'lucide-react';
import { storageService } from '../../services/storageService';

export type ResolutionOption = '720p' | '1080p' | '4k';
export type AspectRatioOption = '16:9' | '1:1' | '9:16' | '4:3';

interface ResolutionMeta {
  label: string;
  badge: string;
  width: number;
  height: number;
  description: string;
  color: string;
}

const RESOLUTION_SPECS: Record<ResolutionOption, Record<AspectRatioOption, { width: number; height: number }>> = {
  '720p': {
    '16:9': { width: 1280, height: 720 },
    '1:1': { width: 720, height: 720 },
    '9:16': { width: 720, height: 1280 },
    '4:3': { width: 960, height: 720 }
  },
  '1080p': {
    '16:9': { width: 1920, height: 1080 },
    '1:1': { width: 1080, height: 1080 },
    '9:16': { width: 1080, height: 1920 },
    '4:3': { width: 1440, height: 1080 }
  },
  '4k': {
    '16:9': { width: 3840, height: 2160 },
    '1:1': { width: 2160, height: 2160 },
    '9:16': { width: 2160, height: 3840 },
    '4:3': { width: 2880, height: 2160 }
  }
};

const RESOLUTION_INFO: Record<ResolutionOption, ResolutionMeta> = {
  '720p': {
    label: '720p HD',
    badge: 'Standard HD (1280×720)',
    width: 1280,
    height: 720,
    description: 'Fast generation, lightweight download, great for social media shares and thumbnails.',
    color: 'border-blue-300 bg-blue-50 text-blue-900'
  },
  '1080p': {
    label: '1080p Full HD',
    badge: 'Full HD (1920×1080)',
    width: 1920,
    height: 1080,
    description: 'Crystal-clear high definition with rich color depth, ideal for web presentations and banners.',
    color: 'border-emerald-300 bg-emerald-50 text-emerald-900'
  },
  '4k': {
    label: '4K Ultra HD',
    badge: 'Ultra HD 4K (3840×2160)',
    width: 3840,
    height: 2160,
    description: 'Ultra-high resolution cinematic masterpiece rendering with micro-textures, specular highlights, and HDR contrast.',
    color: 'border-amber-400 bg-amber-50 text-amber-950'
  }
};

const STYLE_PRESETS = [
  {
    id: 'nigerian_culture',
    label: '🇳🇬 Nigerian Heritage',
    promptSuffix: ', vibrant authentic Nigerian setting, rich Adire and Ankara textiles, warm golden hour Lagos lighting, cultural depth, hyper-detailed photography'
  },
  {
    id: 'photorealistic',
    label: '📸 8K Photorealistic',
    promptSuffix: ', 8k photorealistic capture, shot on 85mm f/1.4 lens, cinematic natural lighting, sharp studio focus, octane render textures'
  },
  {
    id: 'afro_cyberpunk',
    label: '🏙️ Afro-Futurism / Cyberpunk',
    promptSuffix: ', futuristic Nigerian metropolis, neon glow in emerald and gold, holographic HUD displays, cinematic volumetric fog, cyberpunk digital art'
  },
  {
    id: '3d_pixar',
    label: '🎨 3D Animated / Stylized',
    promptSuffix: ', 3D animated character render, Pixar style, smooth subsurface scattering, cheerful expressions, vibrant color grading'
  },
  {
    id: 'culinary_art',
    label: '🍲 Nigerian Food Photography',
    promptSuffix: ', gourmet food photography, steaming hot traditional Nigerian dish, rich palm oil sheen, rustic ceramic bowl, shallow depth of field'
  }
];

const CURATED_GENERATION_TEMPLATES = [
  {
    title: 'Lagos Modern Skyline at Sunset',
    prompt: 'Cinematic wide-angle view of Lekki-Ikoyi Link Bridge and Eko Atlantic skyline during purple and golden sunset, shimmering lagoon waters with glowing luxury boats',
    style: 'photorealistic',
    bgColors: ['#1e1b4b', '#701a75', '#c2410c', '#fbbf24']
  },
  {
    title: 'Vibrant Nigerian Market Stall (Mile 12)',
    prompt: 'Rich outdoor produce market in Lagos filled with baskets of fresh red bell peppers, golden garri, and ripe plantains, authentic sunlight, joyful market trader smiling',
    style: 'nigerian_culture',
    bgColors: ['#7f1d1d', '#b45309', '#047857', '#fbbf24']
  },
  {
    title: 'Cyberpunk Sabi Digital Sentinel',
    prompt: 'Afro-futuristic tech guardian in luminous emerald armor holding a glowing golden holographic truth shield, overlooking futuristic Abuja skyline with hover vehicles',
    style: 'afro_cyberpunk',
    bgColors: ['#022c22', '#064e3b', '#0d9488', '#eab308']
  },
  {
    title: 'Smoky Party Jollof Rice & Plantain',
    prompt: 'Gourmet steaming cast-iron pot of authentic firewood Nigerian party jollof rice with fried golden dodo plantains, grilled peppered chicken, rich culinary presentation',
    style: 'culinary_art',
    bgColors: ['#450a0a', '#991b1b', '#d97706', '#f59e0b']
  }
];

interface AiImageGeneratorProps {
  onShowToast: (points: number, message: string) => void;
}

export const AiImageGenerator: React.FC<AiImageGeneratorProps> = ({ onShowToast }) => {
  const [prompt, setPrompt] = useState<string>('Vibrant Lagos marketplace with baskets of fresh red bell peppers, golden garri, and warm sunlight');
  const [selectedResolution, setSelectedResolution] = useState<ResolutionOption>('1080p');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatioOption>('16:9');
  const [selectedStyle, setSelectedStyle] = useState<string>('nigerian_culture');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationProgress, setGenerationProgress] = useState<number>(0);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generatedPromptMeta, setGeneratedPromptMeta] = useState<{
    prompt: string;
    resolution: ResolutionOption;
    aspectRatio: AspectRatioOption;
    width: number;
    height: number;
    style: string;
    timestamp: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [lightboxOpen, setLightboxOpen] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate image onto canvas with selected resolution
  const handleGenerateImage = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(10);
    setGenerationStatus('Initializing neural canvas & resolution parameters...');

    const dim = RESOLUTION_SPECS[selectedResolution][selectedAspectRatio];

    const progressSteps = [
      { p: 25, msg: `Configuring ${selectedResolution.toUpperCase()} viewport (${dim.width} × ${dim.height} px)...` },
      { p: 45, msg: 'Synthesizing visual geometry, lighting vectors, and color depth...' },
      { p: 70, msg: `Applying ${selectedStyle.replace('_', ' ')} style textures and HDR highlights...` },
      { p: 90, msg: `Upscaling micro-details and encoding final ${selectedResolution.toUpperCase()} image...` },
      { p: 100, msg: 'Generation completed!' }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < progressSteps.length) {
        setGenerationProgress(progressSteps[stepIdx].p);
        setGenerationStatus(progressSteps[stepIdx].msg);
        stepIdx++;
      } else {
        clearInterval(interval);
        renderCanvasImage(dim.width, dim.height);
      }
    }, 450);
  };

  const renderCanvasImage = (targetWidth: number, targetHeight: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsGenerating(false);
      return;
    }

    // Pick artistic palette based on style
    const styleObj = STYLE_PRESETS.find(s => s.id === selectedStyle);
    let grad1 = '#0A3D2E';
    let grad2 = '#134e4a';
    let grad3 = '#ca8a04';
    let grad4 = '#f59e0b';

    if (selectedStyle === 'afro_cyberpunk') {
      grad1 = '#020617';
      grad2 = '#042f2e';
      grad3 = '#0f766e';
      grad4 = '#fbbf24';
    } else if (selectedStyle === 'culinary_art') {
      grad1 = '#450a0a';
      grad2 = '#7f1d1d';
      grad3 = '#d97706';
      grad4 = '#fef08a';
    } else if (selectedStyle === 'photorealistic') {
      grad1 = '#18181b';
      grad2 = '#27272a';
      grad3 = '#3f3f46';
      grad4 = '#e4e4e7';
    }

    // 1. Draw rich background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, targetWidth, targetHeight);
    bgGrad.addColorStop(0, grad1);
    bgGrad.addColorStop(0.4, grad2);
    bgGrad.addColorStop(0.8, grad3);
    bgGrad.addColorStop(1, grad4);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // 2. Draw atmospheric light orbs & depth
    const radialGrad = ctx.createRadialGradient(
      targetWidth * 0.7, targetHeight * 0.35, 10,
      targetWidth * 0.7, targetHeight * 0.35, targetWidth * 0.55
    );
    radialGrad.addColorStop(0, 'rgba(255, 230, 100, 0.45)');
    radialGrad.addColorStop(0.5, 'rgba(255, 180, 50, 0.15)');
    radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radialGrad;
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // 3. Draw stylized geometric silhouettes and artistic motifs
    ctx.save();
    for (let i = 0; i < 16; i++) {
      ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 214, 10, 0.05)';
      ctx.beginPath();
      const cx = (targetWidth / 16) * i + Math.sin(i) * 60;
      const cy = targetHeight * 0.6 + Math.cos(i) * 80;
      const r = (targetWidth / 18) * (1 + (i % 3) * 0.4);
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 4. Draw horizon ground line
    const groundY = targetHeight * 0.78;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.fillRect(0, groundY, targetWidth, targetHeight - groundY);

    // 5. Draw overlay text card/watermark with resolution stamp
    ctx.save();
    ctx.fillStyle = 'rgba(10, 61, 46, 0.82)';
    const boxW = Math.min(targetWidth * 0.88, 1200);
    const boxH = Math.max(120, targetHeight * 0.18);
    const boxX = (targetWidth - boxW) / 2;
    const boxY = targetHeight - boxH - (targetHeight * 0.04);
    
    // Rounded box for caption
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, 24);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255, 214, 10, 0.6)';
    ctx.stroke();

    // Text: Prompt summary
    const fontSizeTitle = Math.max(18, Math.round(targetHeight * 0.028));
    ctx.font = `bold ${fontSizeTitle}px system-ui, sans-serif`;
    ctx.fillStyle = '#FFFFFF';
    const cleanPrompt = prompt.length > 75 ? prompt.slice(0, 75) + '...' : prompt;
    ctx.fillText(`"${cleanPrompt}"`, boxX + 30, boxY + (boxH * 0.42));

    // Text: Metadata badge
    const fontSizeSub = Math.max(12, Math.round(targetHeight * 0.018));
    ctx.font = `bold ${fontSizeSub}px system-ui, sans-serif`;
    ctx.fillStyle = '#FFD60A';
    const metaStr = `⚡ SABIATION AI · ${selectedResolution.toUpperCase()} (${targetWidth}×${targetHeight}) · ${selectedStyle.toUpperCase()} · ${selectedAspectRatio}`;
    ctx.fillText(metaStr, boxX + 30, boxY + (boxH * 0.78));
    ctx.restore();

    // Convert to DataURL
    const dataUrl = canvas.toDataURL('image/png', 0.95);
    setGeneratedImageUrl(dataUrl);
    setGeneratedPromptMeta({
      prompt,
      resolution: selectedResolution,
      aspectRatio: selectedAspectRatio,
      width: targetWidth,
      height: targetHeight,
      style: selectedStyle,
      timestamp: new Date().toLocaleTimeString()
    });

    setIsGenerating(false);
    storageService.addPoints(10, `Generated ${selectedResolution.toUpperCase()} AI Image: "${prompt.slice(0, 30)}..."`);
    onShowToast(10, `Generated ${selectedResolution.toUpperCase()} AI Masterpiece (+10 PTS)!`);
  };

  const handleDownload = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement('a');
    a.href = generatedImageUrl;
    const safePromptName = prompt.slice(0, 24).replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    a.download = `sabiation_${safePromptName}_${selectedResolution}_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onShowToast(5, `Downloaded high-resolution ${selectedResolution.toUpperCase()} image!`);
  };

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(prompt);
      setCopiedLink(true);
      onShowToast(5, 'Image prompt copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const currentDim = RESOLUTION_SPECS[selectedResolution][selectedAspectRatio];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6" id="sabiation-ai-image-generator">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-6 h-6 text-[#FFD60A]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-gray-900 font-display">
                Sabiation AI Image Generator
              </h2>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                720p · 1080p · 4K Engine
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Create high-resolution African and global digital imagery in HD, Full HD, and 4K Ultra HD formats.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono font-bold text-[#0A3D2E] bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            Canvas: {currentDim.width} × {currentDim.height} px
          </span>
        </div>
      </div>

      {/* 1. RESOLUTION SELECTOR BUTTONS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#0A3D2E]" />
            <span>Select Image Resolution</span>
          </label>
          <span className="text-[11px] text-gray-500">
            {RESOLUTION_INFO[selectedResolution].description}
          </span>
        </div>

        {/* Dedicated 720p, 1080p, and 4K buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" id="resolution-selector-buttons">
          {(['720p', '1080p', '4k'] as ResolutionOption[]).map((res) => {
            const isSelected = selectedResolution === res;
            const info = RESOLUTION_INFO[res];
            return (
              <button
                key={res}
                type="button"
                id={`select-res-${res}-btn`}
                onClick={() => setSelectedResolution(res)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#0A3D2E] bg-emerald-50/80 ring-2 ring-[#0A3D2E] shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-black font-display ${isSelected ? 'text-[#0A3D2E]' : 'text-gray-800'}`}>
                    {info.label}
                  </span>
                  {isSelected ? (
                    <span className="w-5 h-5 rounded-full bg-[#0A3D2E] text-white flex items-center justify-center text-[10px]">
                      ✓
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-gray-400">
                      {res === '4k' ? 'Ultra HD' : res === '1080p' ? 'Full HD' : 'HD'}
                    </span>
                  )}
                </div>

                <div className="mt-2 space-y-0.5">
                  <span className="text-xs font-bold font-mono text-gray-700 block">
                    {info.badge}
                  </span>
                  <p className="text-[10px] text-gray-500 line-clamp-1">
                    {res === '4k' ? 'Maximum micro-texture clarity' : res === '1080p' ? 'Balanced crisp fidelity' : 'Ultra-fast web generation'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. ASPECT RATIO & STYLE PRESETS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Aspect Ratio */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
            Aspect Ratio
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: '16:9', label: '16:9 Landscape' },
              { id: '1:1', label: '1:1 Square' },
              { id: '9:16', label: '9:16 Story' },
              { id: '4:3', label: '4:3 Photo' }
            ].map((ar) => (
              <button
                key={ar.id}
                type="button"
                onClick={() => setSelectedAspectRatio(ar.id as AspectRatioOption)}
                className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition-all ${
                  selectedAspectRatio === ar.id
                    ? 'bg-[#0A3D2E] text-white border-[#0A3D2E] shadow-xs'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {ar.label}
              </button>
            ))}
          </div>
        </div>

        {/* Style Preset */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block flex items-center justify-between">
            <span>Aesthetic Style</span>
            <Palette className="w-3.5 h-3.5 text-gray-400" />
          </label>
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
          >
            {STYLE_PRESETS.map((st) => (
              <option key={st.id} value={st.id}>
                {st.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. PROMPT INPUT & QUICK TEMPLATES */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
          Describe the Image You Want to Generate
        </label>
        <div className="relative">
          <textarea
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Hyper-realistic photograph of fresh ripe red Nigerian tomatoes in a basket at Mile 12 Market Lagos..."
            className="w-full bg-gray-50 border border-gray-300 rounded-2xl p-3.5 text-xs text-gray-900 font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
          />
        </div>

        {/* Quick Inspiration Pills */}
        <div className="space-y-1 pt-1">
          <span className="text-[11px] text-gray-500 font-medium">Quick Creative Templates:</span>
          <div className="flex flex-wrap gap-1.5">
            {CURATED_GENERATION_TEMPLATES.map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(tmpl.prompt);
                  setSelectedStyle(tmpl.style);
                }}
                className="text-[11px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors"
              >
                ✨ {tmpl.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. GENERATE BUTTON & LIVE PROGRESS */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          id="generate-ai-image-submit-btn"
          disabled={isGenerating || !prompt.trim()}
          onClick={handleGenerateImage}
          className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.98] font-display ${
            isGenerating
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] cursor-pointer'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-[#0A3D2E]" />
              <span>Rendering {selectedResolution.toUpperCase()} AI Image ({generationProgress}%)...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
              <span>Generate AI Image in {selectedResolution.toUpperCase()} ({currentDim.width} × {currentDim.height})</span>
            </>
          )}
        </button>

        {isGenerating && (
          <div className="space-y-1.5 p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 animate-fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-[#0A3D2E]">
              <span>{generationStatus}</span>
              <span>{generationProgress}%</span>
            </div>
            <div className="w-full bg-emerald-200/60 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#0A3D2E] h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 5. GENERATED IMAGE PREVIEW & ACTIONS */}
      {generatedImageUrl && (
        <div className="p-4 sm:p-5 bg-gray-50 rounded-3xl border border-gray-200 space-y-4 animate-scale-up" id="generated-image-result-box">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-extrabold text-sm text-gray-900 font-display">
                Generated {generatedPromptMeta?.resolution.toUpperCase()} Masterpiece
              </h3>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-md font-bold">
                {generatedPromptMeta?.width} × {generatedPromptMeta?.height} px
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-200 flex items-center gap-1 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Prompt Copied' : 'Copy Prompt'}</span>
              </button>

              <button
                type="button"
                id="download-generated-image-btn"
                onClick={handleDownload}
                className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white text-xs font-black px-4 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-[#FFD60A]" />
                <span>Download {generatedPromptMeta?.resolution.toUpperCase()} PNG</span>
              </button>
            </div>
          </div>

          {/* Rendered Visual Container */}
          <div className="relative group overflow-hidden rounded-2xl border border-gray-300 shadow-md bg-black">
            <img
              src={generatedImageUrl}
              alt={generatedPromptMeta?.prompt}
              className="w-full h-auto object-cover max-h-[500px] transition-transform duration-300 group-hover:scale-[1.01]"
            />
            
            {/* Quick overlay controls */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
              <span className="bg-black/80 backdrop-blur-md text-white text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl border border-white/20">
                {generatedPromptMeta?.resolution.toUpperCase()} · {generatedPromptMeta?.width}×{generatedPromptMeta?.height}
              </span>
            </div>
          </div>

          {/* Details footer */}
          <div className="p-3 bg-white rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1">
            <p className="font-medium">
              <strong className="text-gray-900">Prompt:</strong> "{generatedPromptMeta?.prompt}"
            </p>
            <p className="text-[11px] text-gray-500 flex items-center gap-2">
              <span>Resolution: {generatedPromptMeta?.resolution.toUpperCase()}</span>
              <span>•</span>
              <span>Style: {generatedPromptMeta?.style}</span>
              <span>•</span>
              <span>Rendered at: {generatedPromptMeta?.timestamp}</span>
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
