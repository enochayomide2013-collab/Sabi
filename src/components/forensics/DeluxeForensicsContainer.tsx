import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Image as ImageIcon, 
  Video, 
  Mic,
  FileImage,
  Crown, 
  Sparkles, 
  Layers, 
  Info, 
  CheckCircle2, 
  Lock, 
  ArrowRight,
  ExternalLink,
  Languages,
  Split
} from 'lucide-react';
import { UserProfile } from '../../types';
import { ImageAuthenticityCheck } from './ImageAuthenticityCheck';
import { VideoAnalysisTool } from './VideoAnalysisTool';
import { AudioForensicsTool } from './AudioForensicsTool';
import { FactCheckCardGenerator } from './FactCheckCardGenerator';
import { MultilingualVoiceDebunk } from './MultilingualVoiceDebunk';
import { ForensicComparisonSlider } from './ForensicComparisonSlider';
import { DeepfakeXRay } from '../truth/DeepfakeXRay';

interface DeluxeForensicsContainerProps {
  user: UserProfile;
  initialTool?: 'image' | 'video' | 'audio' | 'comparison' | 'multilingual' | 'card' | 'xray';
  onNavigate: (tab: string, extraData?: any) => void;
  onShowToast?: (points: number, message: string) => void;
}

export const DeluxeForensicsContainer: React.FC<DeluxeForensicsContainerProps> = ({
  user,
  initialTool = 'image',
  onNavigate,
  onShowToast
}) => {
  const [activeTool, setActiveTool] = useState<'image' | 'video' | 'audio' | 'comparison' | 'multilingual' | 'card' | 'xray'>(initialTool);
  const isDeluxe = user.userTier === 'Deluxe' || user.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-fade-in" id="deluxe-forensics-hub">
      
      {/* Deluxe VIP Forensics Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-[#0A3D2E] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-400/40 relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-[#FFD60A] text-[#0A3D2E] text-xs font-mono font-extrabold px-3 py-1 rounded-full shadow-sm font-display">
            <Crown className="w-3.5 h-3.5 text-[#0A3D2E]" />
            <span>DELUXE FORENSIC SUITE · {isDeluxe ? 'UNLOCKED & ACTIVE' : 'LOCKED'}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Deluxe Forensic & Media Suite
          </h1>

          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            Forensic suite for <strong>Deluxe</strong> members: Image & Video manipulation, <strong>WhatsApp Audio Voice Notes</strong>, <strong>Side-by-Side Comparison Slider</strong>, <strong>Multilingual Local Dialect Voice Debunker</strong>, and <strong>Social Infographic Cards</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="bg-white/10 text-white px-3 py-1 rounded-full font-bold border border-white/20 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Image</span>
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full font-bold border border-white/20 flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Video</span>
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full font-bold border border-white/20 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Voice Notes</span>
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full font-bold border border-white/20 flex items-center gap-1.5">
              <Split className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Compare Slider</span>
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full font-bold border border-white/20 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Multilingual</span>
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full font-bold border border-white/20 flex items-center gap-1.5">
              <FileImage className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Social Cards</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tool Navigation Selector */}
      <div className="flex flex-wrap bg-gray-100 p-1.5 rounded-2xl gap-1.5 border border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTool('image')}
          className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold font-display transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTool === 'image'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-[#FFD60A]" />
          <span>Image</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool('video')}
          className={`flex-1 min-w-[100px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold font-display transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTool === 'video'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <Video className="w-4 h-4 text-[#FFD60A]" />
          <span>Video</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool('audio')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold font-display transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTool === 'audio'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <Mic className="w-4 h-4 text-[#FFD60A]" />
          <span>Voice Notes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool('comparison')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold font-display transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTool === 'comparison'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <Split className="w-4 h-4 text-[#FFD60A]" />
          <span>Compare Slider</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool('multilingual')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold font-display transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTool === 'multilingual'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <Languages className="w-4 h-4 text-[#FFD60A]" />
          <span>Multilingual</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool('xray')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold font-display transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTool === 'xray'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-[#FFD60A]" />
          <span>Deepfake X-Ray</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool('card')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold font-display transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTool === 'card'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-700 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <FileImage className="w-4 h-4 text-[#FFD60A]" />
          <span>Social Cards</span>
        </button>
      </div>

      {/* ACTIVE TOOL VIEW */}
      {activeTool === 'image' && (
        <ImageAuthenticityCheck
          user={user}
          onNavigate={onNavigate}
          onShowToast={onShowToast}
        />
      )}

      {activeTool === 'video' && (
        <VideoAnalysisTool
          user={user}
          onNavigate={onNavigate}
          onShowToast={onShowToast}
        />
      )}

      {activeTool === 'audio' && (
        <AudioForensicsTool
          user={user}
          onNavigate={onNavigate}
          onShowToast={onShowToast}
        />
      )}

      {activeTool === 'comparison' && (
        <ForensicComparisonSlider
          onShowToast={onShowToast}
        />
      )}

      {activeTool === 'multilingual' && (
        <MultilingualVoiceDebunk
          onShowToast={onShowToast}
        />
      )}

      {activeTool === 'xray' && (
        <DeepfakeXRay />
      )}

      {activeTool === 'card' && (
        <FactCheckCardGenerator
          onShowToast={onShowToast}
        />
      )}

    </div>
  );
};


