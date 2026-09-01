import React, { useState } from 'react';
import { 
  FileText, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  PenTool, 
  ArrowRight, 
  Check, 
  Copy, 
  Award,
  Crown,
  Share2
} from 'lucide-react';
import { storageService } from '../../services/storageService';

interface AvidEssaySectionProps {
  onShowToast: (points: number, message: string) => void;
}

export const AvidEssaySection: React.FC<AvidEssaySectionProps> = ({ onShowToast }) => {
  const [essayTopic, setEssayTopic] = useState<string>('The Role of Community Fact-Checking in Combating Misinformation in West Africa');
  const [academicLevel, setAcademicLevel] = useState<'Undergraduate' | 'Secondary' | 'Postgraduate'>('Undergraduate');
  const [outline, setOutline] = useState<string>(
    `I. Title: The Role of Community Fact-Checking in Combating Misinformation in West Africa
II. Abstract: Examination of decentralized ground-truth verifier networks.
III. Introduction & Thesis Statement: In digital information ecosystems, participatory community verification desks surpass centralized authorities in real-time truth latency.
IV. Core Arguments:
   - Factor 1: Local linguistic nuance and pidgin/dialect forensic recognition.
   - Factor 2: On-ground commodity pricing corroboration eliminating false inflation panics.
   - Factor 3: Deepfake and synthetic voice note debunking protocols.
V. Policy Recommendations & Conclusion: Institutionalizing open consensus protocols.`
  );
  const [copied, setCopied] = useState<boolean>(false);

  const handleOpenAvidEssayApp = () => {
    storageService.addPoints(10, 'Opened Avid Essay Writer web app at avidayo.created.app/essay');
    onShowToast(10, 'Launching Avid Essay Writer at avidayo.created.app/essay (+10 PTS)!');
    window.open('https://avidayo.created.app/essay', '_blank', 'noopener,noreferrer');
  };

  const handleCopyOutline = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(outline);
      setCopied(true);
      onShowToast(5, 'Essay outline copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6" id="avid-essay-writer-capability">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full uppercase">
            <PenTool className="w-3.5 h-3.5 text-emerald-700" />
            <span>Capability 4: Avid Essay Writer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-display">
            Avid Academic & Professional Essay Writer
          </h2>
          <p className="text-xs text-gray-600">
            Generate scholarly outlines, thesis statements, citations, and launch the dedicated full Avid essay writing suite.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAvidEssayApp}
          className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md flex items-center gap-2 transition-all active:scale-95 shrink-0 font-display"
        >
          <span>Open Avid Essay Writer</span>
          <ExternalLink className="w-4 h-4 text-[#FFD60A]" />
        </button>
      </div>

      {/* PROMINENT DIRECT LINK / REDIRECT CARD */}
      <div 
        onClick={handleOpenAvidEssayApp}
        className="bg-gradient-to-r from-emerald-900 via-[#0A3D2E] to-teal-900 text-white rounded-3xl p-6 shadow-xl border border-emerald-500/40 cursor-pointer hover:border-[#FFD60A] transition-all group relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-[#FFD60A] text-[#0A3D2E] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full font-display">
              <Crown className="w-3 h-3 text-[#0A3D2E]" />
              <span>Direct Link Gateway</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold font-display text-white group-hover:text-[#FFD60A] transition-colors flex items-center gap-2">
              <span>https://avidayo.created.app/essay</span>
              <ExternalLink className="w-4 h-4 text-[#FFD60A]" />
            </h3>
            <p className="text-xs text-emerald-100/90 max-w-xl">
              Click anywhere on this card to directly launch the specialized Avid Essay Writer web application at <strong>avidayo.created.app/essay</strong>.
            </p>
          </div>

          <div className="bg-[#FFD60A] group-hover:bg-white text-[#0A3D2E] font-black text-xs px-5 py-3 rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 font-display">
            <span>Launch Web App ↗</span>
          </div>
        </div>
      </div>

      {/* QUICK OUTLINE PREVIEW & GENERATOR */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-700" />
            <span>Essay Outline & Structure Preview</span>
          </h4>
          <button
            type="button"
            onClick={handleCopyOutline}
            className="bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-gray-300 flex items-center gap-1 shadow-2xs transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gray-500" />}
            <span>{copied ? 'Copied' : 'Copy Outline'}</span>
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-gray-600 uppercase">
            Topic Title
          </label>
          <input
            type="text"
            value={essayTopic}
            onChange={(e) => setEssayTopic(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
        </div>

        <div className="bg-white p-4 rounded-xl border border-gray-200 font-mono text-xs text-gray-800 leading-relaxed whitespace-pre-wrap">
          {outline}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={handleOpenAvidEssayApp}
            className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all active:scale-95 font-display"
          >
            <span>Draft Full Paper on Avid Essay App</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#FFD60A]" />
          </button>
        </div>
      </div>

    </div>
  );
};
