import React, { useState, useRef } from 'react';
import { 
  Sliders, 
  Eye, 
  ZoomIn, 
  ZoomOut, 
  Layers, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Download, 
  Upload, 
  Maximize2, 
  Info,
  ShieldCheck,
  Split
} from 'lucide-react';

interface ComparisonPreset {
  id: string;
  title: string;
  category: 'Price Tag Manipulation' | 'Deepfake Face Swap' | 'Cropped Context';
  manipulatedUrl: string;
  originalUrl: string;
  manipulatedLabel: string;
  originalLabel: string;
  detectedAlterations: string[];
  summary: string;
}

const COMPARISON_PRESETS: ComparisonPreset[] = [
  {
    id: 'preset-1',
    title: 'Edited Fuel Station Price Digital Display',
    category: 'Price Tag Manipulation',
    manipulatedUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?w=800&auto=format&fit=crop&q=80',
    manipulatedLabel: 'VIRAL EDIT: Digitally Changed to ₦1,850',
    originalLabel: 'AUTHENTIC: Official Price ₦650/L',
    detectedAlterations: [
      'Digital Font Inconsistency on Price Digit 8',
      'Pixel Compression Artifacts around LED Digits',
      'Unmatched Lighting Direction on Meter Display'
    ],
    summary: 'Error Level Analysis (ELA) reveals high-frequency compression localized exclusively around the fuel price digits, indicating digital clone stamping.'
  },
  {
    id: 'preset-2',
    title: 'Manipulated Press Release Letterhead',
    category: 'Cropped Context',
    manipulatedUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&auto=format&fit=crop&q=80',
    originalUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    manipulatedLabel: 'VIRAL CROP: Date Header Removed',
    originalLabel: 'AUTHENTIC UNCROPPED: Issued in 2021',
    detectedAlterations: [
      'Top Date Header Cropped Out',
      '2021 Stamp Re-used for 2026 Claim',
      'Original Signature Page Omitted'
    ],
    summary: 'A 2021 official emergency statement was cropped to remove the year timestamp and passed off as a current 2026 directive.'
  }
];

interface ForensicComparisonSliderProps {
  onShowToast?: (points: number, message: string) => void;
  className?: string;
}

export const ForensicComparisonSlider: React.FC<ForensicComparisonSliderProps> = ({
  onShowToast,
  className = ''
}) => {
  const [selectedPreset, setSelectedPreset] = useState<ComparisonPreset>(COMPARISON_PRESETS[0]);
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showElaHeatmap, setShowElaHeatmap] = useState<boolean>(false);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl p-6 text-white border border-gray-800 shadow-2xl space-y-5 ${className}`} id="forensic-comparison-slider">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0A3D2E] text-[#FFD60A] border border-[#FFD60A]/30 flex items-center justify-center shrink-0 shadow-md">
            <Split className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black font-display text-white tracking-wide">
                Side-by-Side Forensic Comparison Slider
              </h3>
              <span className="bg-[#FFD60A] text-[#0A3D2E] text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full">
                DELUXE INSPECTOR
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Drag the interactive split curtain to compare viral manipulated images directly against authenticated original footage.
            </p>
          </div>
        </div>

        {/* Preset Selector Dropdown */}
        <div className="shrink-0">
          <select
            value={selectedPreset.id}
            onChange={(e) => {
              const p = COMPARISON_PRESETS.find(item => item.id === e.target.value);
              if (p) {
                setSelectedPreset(p);
                onShowToast?.(5, `Loaded preset: ${p.title}`);
              }
            }}
            className="bg-gray-800 border border-gray-700 text-white rounded-2xl p-2.5 text-xs font-bold focus:border-[#FFD60A] focus:outline-hidden"
          >
            {COMPARISON_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} ({p.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Control Bar: Zoom & Heatmap Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-950 p-3 rounded-2xl border border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 font-mono">Zoom Loupe:</span>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer ${
              zoomLevel === 1 ? 'bg-[#0A3D2E] text-[#FFD60A]' : 'bg-gray-800 text-gray-400'
            }`}
          >
            1x
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1.5)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer ${
              zoomLevel === 1.5 ? 'bg-[#0A3D2E] text-[#FFD60A]' : 'bg-gray-800 text-gray-400'
            }`}
          >
            1.5x
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(2.5)}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold cursor-pointer ${
              zoomLevel === 2.5 ? 'bg-[#0A3D2E] text-[#FFD60A]' : 'bg-gray-800 text-gray-400'
            }`}
          >
            2.5x
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowElaHeatmap(!showElaHeatmap)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border ${
              showElaHeatmap
                ? 'bg-purple-950 text-purple-200 border-purple-400'
                : 'bg-gray-800 text-gray-400 border-gray-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>ELA Error Heatmap</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border ${
              showBoundingBoxes
                ? 'bg-amber-950 text-[#FFD60A] border-[#FFD60A]'
                : 'bg-gray-800 text-gray-400 border-gray-700'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Highlight Anomalies</span>
          </button>
        </div>
      </div>

      {/* Interactive Split Canvas View */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[320px] sm:h-[420px] rounded-2xl overflow-hidden border border-gray-800 select-none cursor-ew-resize bg-black"
      >
        {/* Layer 1: Authentic Original Image (Right Side) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={selectedPreset.originalUrl}
            alt="Original Authentic"
            className="w-full h-full object-cover transition-transform duration-100"
            style={{ transform: `scale(${zoomLevel})` }}
          />
          <div className="absolute top-4 right-4 bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md backdrop-blur-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{selectedPreset.originalLabel}</span>
          </div>
        </div>

        {/* Layer 2: Manipulated Image (Left Side clipped by sliderPosition) */}
        <div
          className="absolute inset-0 h-full overflow-hidden"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={selectedPreset.manipulatedUrl}
            alt="Manipulated Viral"
            className="absolute top-0 left-0 max-w-none h-full object-cover transition-transform duration-100"
            style={{ 
              width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%',
              transform: `scale(${zoomLevel})`,
              filter: showElaHeatmap ? 'contrast(200%) hue-rotate(90deg)' : 'none'
            }}
          />

          {/* Bounding Box Highlights overlay */}
          {showBoundingBoxes && (
            <div className="absolute top-1/3 left-1/3 w-32 h-20 border-2 border-rose-500 bg-rose-500/20 rounded-lg animate-pulse flex items-center justify-center">
              <span className="bg-rose-600 text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                ALTERED AREA
              </span>
            </div>
          )}

          <div className="absolute top-4 left-4 bg-rose-950/90 text-rose-300 border border-rose-500/40 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md backdrop-blur-xs">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{selectedPreset.manipulatedLabel}</span>
          </div>
        </div>

        {/* Vertical Divider Curtain Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-[#FFD60A] shadow-[0_0_15px_rgba(255,214,10,0.8)] z-20"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="w-8 h-8 rounded-full bg-[#0A3D2E] border-2 border-[#FFD60A] text-[#FFD60A] flex items-center justify-center absolute top-1/2 -translate-y-1/2 -translate-x-1/2 shadow-lg">
            <Sliders className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Range Slider Track for explicit accessibility */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono text-gray-400">
          <span className="text-rose-400 font-bold">◄ Manipulated ({Math.round(sliderPosition)}%)</span>
          <span className="text-emerald-400 font-bold">Authentic Original ({Math.round(100 - sliderPosition)}%) ►</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPosition}
          onChange={(e) => setSliderPosition(Number(e.target.value))}
          className="w-full accent-[#FFD60A] cursor-pointer"
        />
      </div>

      {/* Detected Alterations Checklist */}
      <div className="bg-gray-950 p-4 rounded-2xl border border-gray-800 space-y-2">
        <span className="text-xs font-bold text-gray-300 font-display uppercase tracking-wider block">
          Forensic Discrepancy Findings:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {selectedPreset.detectedAlterations.map((alt, i) => (
            <div key={i} className="bg-black/60 p-2.5 rounded-xl border border-gray-800 text-xs text-gray-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{alt}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 italic pt-1">
          {selectedPreset.summary}
        </p>
      </div>

    </div>
  );
};
