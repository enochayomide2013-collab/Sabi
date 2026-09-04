import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Download, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Copy, 
  Check, 
  Smartphone, 
  Square, 
  Palette, 
  QrCode, 
  ShieldCheck, 
  ExternalLink,
  MessageCircle,
  FileImage,
  RefreshCw
} from 'lucide-react';

export interface FactCheckCardGeneratorProps {
  initialClaim?: string;
  initialVerdict?: 'TRUE' | 'FALSE' | 'OUTDATED' | 'MISLEADING' | 'NEEDS MORE VERIFICATION';
  initialSummary?: string;
  initialSource?: string;
  onShowToast?: (points: number, message: string) => void;
  className?: string;
}

export const FactCheckCardGenerator: React.FC<FactCheckCardGeneratorProps> = ({
  initialClaim = 'Viral Voice Note Claims Fuel Price Reaching ₦1,800/Lter Nationwide Tomorrow Morning',
  initialVerdict = 'FALSE',
  initialSummary = 'NNPCL and Independent Petroleum Marketers Association of Nigeria (IPMAN) confirm normal supply distribution with zero official price increases.',
  initialSource = 'TikTok & WhatsApp Forwards (Lagos & Abuja)',
  onShowToast,
  className = ''
}) => {
  const [claimText, setClaimText] = useState<string>(initialClaim);
  const [verdict, setVerdict] = useState<'TRUE' | 'FALSE' | 'OUTDATED' | 'MISLEADING' | 'NEEDS MORE VERIFICATION'>(initialVerdict);
  const [summaryText, setSummaryText] = useState<string>(initialSummary);
  const [sourcePlatform, setSourcePlatform] = useState<string>(initialSource);
  const [cardAspectRatio, setCardAspectRatio] = useState<'1:1' | '9:16'>('1:1');
  const [cardTheme, setCardTheme] = useState<'sabi-green' | 'dark-forensic' | 'high-contrast-red' | 'clean-white'>('sabi-green');
  const [includeWatermark, setIncludeWatermark] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // Verdict theme colors
  const getVerdictBadgeStyle = () => {
    switch (verdict) {
      case 'TRUE':
        return 'bg-emerald-500 text-white border-emerald-300';
      case 'FALSE':
        return 'bg-rose-600 text-white border-rose-300';
      case 'OUTDATED':
        return 'bg-purple-600 text-white border-purple-300';
      case 'MISLEADING':
        return 'bg-amber-500 text-black border-amber-300';
      case 'NEEDS MORE VERIFICATION':
      default:
        return 'bg-blue-600 text-white border-blue-300';
    }
  };

  const getVerdictIcon = () => {
    if (verdict === 'TRUE') return <CheckCircle2 className="w-5 h-5" />;
    if (verdict === 'FALSE' || verdict === 'MISLEADING') return <AlertTriangle className="w-5 h-5" />;
    return <HelpCircle className="w-5 h-5" />;
  };

  // Card theme backgrounds
  const getCardBackgroundClass = () => {
    switch (cardTheme) {
      case 'dark-forensic':
        return 'bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white border-purple-500/30';
      case 'high-contrast-red':
        return 'bg-gradient-to-br from-rose-950 via-gray-900 to-black text-white border-rose-500/40';
      case 'clean-white':
        return 'bg-white text-gray-900 border-gray-300 shadow-xl';
      case 'sabi-green':
      default:
        return 'bg-gradient-to-br from-[#0A3D2E] via-[#0d4f3b] to-black text-white border-[#FFD60A]/40';
    }
  };

  // Canvas / Image Export simulation
  const handleDownloadCardImage = () => {
    // Simulated high-resolution PNG generation
    onShowToast?.(10, 'Infographic Card generated & downloaded as PNG!');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      onShowToast?.(5, 'Infographic verification link copied!');
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl p-6 text-white border border-gray-800 shadow-xl space-y-6 ${className}`} id="factcheck-card-generator">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0A3D2E] text-[#FFD60A] border border-[#FFD60A]/30 flex items-center justify-center shrink-0 shadow-md">
            <FileImage className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black font-display text-white tracking-wide">
                Social Infographic Card Generator
              </h3>
              <span className="bg-[#FFD60A] text-[#0A3D2E] text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full">
                SABI VISUAL SUITE
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Create branded, square (1:1) or vertical story (9:16) fact-check graphics ready for WhatsApp Status, Instagram, Twitter, or Facebook.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownloadCardImage}
            className="bg-[#FFD60A] hover:bg-[#e6c200] text-[#0A3D2E] px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer font-display"
          >
            <Download className="w-4 h-4 text-[#0A3D2E]" />
            <span>Export PNG Card</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 space-y-4 bg-gray-950 p-5 rounded-2xl border border-gray-800">
          <span className="text-xs font-bold text-gray-300 font-display uppercase tracking-wider block">
            1. Customize Card Content:
          </span>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-gray-400">Verdict Status:</label>
            <select
              value={verdict}
              onChange={(e: any) => setVerdict(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white font-bold focus:border-[#FFD60A] focus:outline-hidden"
            >
              <option value="FALSE">🚨 FALSE (Unfounded Rumor)</option>
              <option value="TRUE">✅ TRUE (Verified Fact)</option>
              <option value="OUTDATED">⌛ OUTDATED MEDIA / OLD CLIP</option>
              <option value="MISLEADING">⚠️ MISLEADING / TAKEN OUT OF CONTEXT</option>
              <option value="NEEDS MORE VERIFICATION">🔍 NEEDS MORE VERIFICATION</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-gray-400">Viral Claim / Rumor:</label>
            <textarea
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              rows={2}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white font-sans focus:border-[#FFD60A] focus:outline-hidden leading-snug"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-gray-400">Fact-Check Summary & Truth:</label>
            <textarea
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              rows={3}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white font-sans focus:border-[#FFD60A] focus:outline-hidden leading-snug"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-gray-400">Circulating Platforms / Source:</label>
            <input
              type="text"
              value={sourcePlatform}
              onChange={(e) => setSourcePlatform(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white font-sans focus:border-[#FFD60A] focus:outline-hidden"
            />
          </div>

          {/* Theme & Format Selectors */}
          <div className="space-y-3 pt-2 border-t border-gray-800">
            <span className="text-xs font-bold text-gray-300 font-display uppercase tracking-wider block">
              2. Design & Aspect Ratio:
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCardAspectRatio('1:1')}
                className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  cardAspectRatio === '1:1'
                    ? 'bg-[#0A3D2E] text-[#FFD60A] border-[#FFD60A]'
                    : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                <Square className="w-4 h-4" />
                <span>1:1 Square (Feed)</span>
              </button>

              <button
                type="button"
                onClick={() => setCardAspectRatio('9:16')}
                className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  cardAspectRatio === '9:16'
                    ? 'bg-[#0A3D2E] text-[#FFD60A] border-[#FFD60A]'
                    : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>9:16 Story (Status)</span>
              </button>
            </div>

            {/* Theme Picker Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCardTheme('sabi-green')}
                className={`p-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  cardTheme === 'sabi-green' ? 'bg-[#0A3D2E] text-[#FFD60A] border-[#FFD60A]' : 'bg-gray-900 text-gray-400 border-gray-800'
                }`}
              >
                SABI Signature Green
              </button>
              <button
                type="button"
                onClick={() => setCardTheme('dark-forensic')}
                className={`p-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  cardTheme === 'dark-forensic' ? 'bg-purple-950 text-purple-200 border-purple-400' : 'bg-gray-900 text-gray-400 border-gray-800'
                }`}
              >
                Deluxe Dark
              </button>
              <button
                type="button"
                onClick={() => setCardTheme('high-contrast-red')}
                className={`p-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  cardTheme === 'high-contrast-red' ? 'bg-rose-950 text-rose-200 border-rose-400' : 'bg-gray-900 text-gray-400 border-gray-800'
                }`}
              >
                High-Contrast Red
              </button>
              <button
                type="button"
                onClick={() => setCardTheme('clean-white')}
                className={`p-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  cardTheme === 'clean-white' ? 'bg-white text-gray-900 border-gray-300' : 'bg-gray-900 text-gray-400 border-gray-800'
                }`}
              >
                Clean Paper White
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Card Canvas Preview */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center space-y-4">
          
          <div className="text-xs font-bold text-gray-400 font-mono flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD60A]" />
            <span>LIVE RENDER PREVIEW ({cardAspectRatio}):</span>
          </div>

          {/* Actual Rendered Graphic Box */}
          <div
            ref={cardRef}
            className={`w-full max-w-md rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 border ${getCardBackgroundClass()} ${
              cardAspectRatio === '9:16' ? 'aspect-[9/14] sm:aspect-[9/16]' : 'aspect-square'
            }`}
            style={{ minHeight: cardAspectRatio === '9:16' ? '500px' : '420px' }}
          >
            {/* Background Decorative Grid/Shapes */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#FFD60A]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand Header */}
            <div className="flex items-center justify-between border-b border-white/20 pb-4 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center font-black font-display text-sm shadow-md">
                  S
                </div>
                <div>
                  <h4 className="text-sm font-black font-display tracking-wider uppercase leading-none">
                    SABI FACT CHECK
                  </h4>
                  <span className="text-[10px] opacity-75 font-mono">Verified Citizen Intelligence</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-mono opacity-80 bg-black/20 px-2.5 py-1 rounded-full border border-white/10">
                <ShieldCheck className="w-3 h-3 text-[#FFD60A]" />
                <span>OFFICIAL VERDICT</span>
              </div>
            </div>

            {/* Center Content: Verdict Badge + Claim + Summary */}
            <div className="space-y-4 my-auto relative z-10 py-3">
              
              {/* Massive Verdict Stamp */}
              <div>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black font-display tracking-widest uppercase shadow-lg border ${getVerdictBadgeStyle()}`}>
                  {getVerdictIcon()}
                  <span>{verdict}</span>
                </span>
              </div>

              {/* Claim Box */}
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider opacity-75 block">
                  CIRCULATING CLAIM:
                </span>
                <p className="text-sm sm:text-base font-extrabold font-display leading-snug drop-shadow-sm">
                  "{claimText}"
                </p>
              </div>

              {/* Verified Fact Summary */}
              <div className="space-y-1 bg-black/30 p-3.5 rounded-2xl border border-white/10 backdrop-blur-xs">
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#FFD60A] font-bold block">
                  VERIFIED FACTUAL SUMMARY:
                </span>
                <p className="text-xs sm:text-sm leading-relaxed opacity-95 font-sans">
                  {summaryText}
                </p>
              </div>
            </div>

            {/* Footer Watermark & Verification Source */}
            <div className="pt-3 border-t border-white/20 flex items-center justify-between text-[10px] font-mono opacity-80 relative z-10">
              <div className="flex items-center gap-1">
                <span>Source: {sourcePlatform}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-[#FFD60A]">
                <QrCode className="w-3.5 h-3.5" />
                <span>sabi.ng/verify</span>
              </div>
            </div>

          </div>

          {/* Quick Sharing Options beneath preview */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-3.5 py-2 rounded-xl text-xs font-bold border border-gray-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
