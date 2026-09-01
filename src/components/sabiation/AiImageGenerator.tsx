import React from 'react';
import { Sparkles, ExternalLink, Image as ImageIcon, Zap, ShieldCheck, Wand2 } from 'lucide-react';
import { storageService } from '../../services/storageService';

interface AiImageGeneratorProps {
  onShowToast: (points: number, message: string) => void;
}

export const AiImageGenerator: React.FC<AiImageGeneratorProps> = ({ onShowToast }) => {
  const handleLaunchImageGenerator = () => {
    storageService.addPoints(10, 'Opened AI Image Generator');
    onShowToast(10, 'Launched Image Generator (+10 PTS)!');
    window.open('https://avidayo.created.app/photo', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-gradient-to-r from-[#0A3D2E] via-emerald-900 to-[#0A3D2E] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-700/50 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-[#FFD60A] text-[#0A3D2E] text-xs font-mono font-extrabold px-3 py-1 rounded-full shadow-sm font-display">
            <Sparkles className="w-3.5 h-3.5 text-[#0A3D2E]" />
            <span>AI CREATIVE SUITE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight flex items-center gap-2">
            <ImageIcon className="w-7 h-7 text-[#FFD60A]" />
            <span>AI Image Generator</span>
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
            Transform text prompts and concepts into high-definition realistic visual art, 8K photography, cultural art, and 3D renders with maximum detail precision.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-emerald-200">
            <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 font-bold flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Ultra HD Quality</span>
            </span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Fast Render Engine</span>
            </span>
            <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 font-bold flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Multiple Styles</span>
            </span>
          </div>
        </div>

        <div className="shrink-0 w-full md:w-auto">
          <button
            id="launch-image-generator-btn"
            onClick={handleLaunchImageGenerator}
            className="w-full md:w-auto bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-black text-sm px-6 py-4 rounded-2xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 transition-all active:scale-95 cursor-pointer font-display border-2 border-[#FFD60A]"
          >
            <ImageIcon className="w-5 h-5 text-[#0A3D2E]" />
            <span>Image Generator</span>
            <ExternalLink className="w-4 h-4 text-[#0A3D2E]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiImageGenerator;
