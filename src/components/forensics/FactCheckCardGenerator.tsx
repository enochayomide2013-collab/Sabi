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
  initialClaim = 'Viral Voice Note Claims Fuel Price Reaching ₦1,800/Liter Nationwide Tomorrow Morning',
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
  const [cardAspectRatio, setCardAspectRatio] = useState<'1:1' | '9:16' | '16:9' | '4:5'>('1:1');
  const [cardTheme, setCardTheme] = useState<'sabi-green' | 'dark-forensic' | 'high-contrast-red' | 'clean-white' | 'tiktok-viral' | 'whatsapp-green'>('sabi-green');
  const [languageBadge, setLanguageBadge] = useState<string>('Naija Pidgin & English');
  const [verifierCount, setVerifierCount] = useState<number>(384);
  const [includeWatermark, setIncludeWatermark] = useState<boolean>(true);
  const [includeQrCode, setIncludeQrCode] = useState<boolean>(true);
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
        return 'bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white border-purple-500/40 shadow-2xl';
      case 'high-contrast-red':
        return 'bg-gradient-to-br from-rose-950 via-gray-900 to-black text-white border-rose-500/50 shadow-2xl';
      case 'clean-white':
        return 'bg-white text-gray-900 border-gray-300 shadow-2xl';
      case 'tiktok-viral':
        return 'bg-gradient-to-br from-slate-950 via-purple-950 to-pink-950 text-white border-pink-500/50 shadow-2xl';
      case 'whatsapp-green':
        return 'bg-gradient-to-br from-[#075E54] via-[#128C7E] to-[#052923] text-white border-[#25D366]/50 shadow-2xl';
      case 'sabi-green':
      default:
        return 'bg-gradient-to-br from-[#0A3D2E] via-[#0d4f3b] to-black text-white border-[#FFD60A]/50 shadow-2xl';
    }
  };

  // Canvas / Image Export simulation
  const handleDownloadCardImage = () => {
    onShowToast?.(10, 'Infographic Card generated & downloaded as high-res PNG!');
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

  const handleShareToWhatsApp = () => {
    const shareText = `🚨 *SABI FACT-CHECK CARD*\n\n📌 *Claim:* "${claimText}"\n⚖️ *Verdict:* ${verdict}\n\n🔍 *Summary:* ${summaryText}\n\n📍 *Source:* ${sourcePlatform}\n\n🔗 *Verify Fact:* ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onShowToast?.(5, 'Opening WhatsApp with Fact-Check Card caption!');
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
              Create branded, square (1:1), portrait (4:5), banner (16:9), or story (9:16) fact-check graphics ready for WhatsApp Status, TikTok, Instagram, Twitter/X, or Facebook.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleShareToWhatsApp}
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-3.5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Share to WhatsApp</span>
          </button>

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
            <label className="text-[11px] font-mono text-gray-400">Viral Claim / Rumor Text:</label>
            <textarea
              value={claimText}
              onChange={(e) => setClaimText(e.target.value)}
              rows={2}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white font-sans focus:border-[#FFD60A] focus:outline-hidden leading-snug"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-gray-400">Fact-Check Summary & Ground Truth:</label>
            <textarea
              value={summaryText}
              onChange={(e) => setSummaryText(e.target.value)}
              rows={3}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2.5 text-xs text-white font-sans focus:border-[#FFD60A] focus:outline-hidden leading-snug"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-mono text-gray-400">Circulating Platforms:</label>
              <input
                type="text"
                value={sourcePlatform}
                onChange={(e) => setSourcePlatform(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2 text-xs text-white focus:border-[#FFD60A] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-mono text-gray-400">Language Tag:</label>
              <input
                type="text"
                value={languageBadge}
                onChange={(e) => setLanguageBadge(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-2 text-xs text-white focus:border-[#FFD60A] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Aspect Ratio Options */}
          <div className="space-y-2 pt-2 border-t border-gray-800">
            <span className="text-xs font-bold text-gray-300 font-display uppercase tracking-wider block">
              2. Aspect Ratio & Dimensions:
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setCardAspectRatio('1:1')}
                className={`p-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center border transition-all cursor-pointer ${
                  cardAspectRatio === '1:1'
                    ? 'bg-[#0A3D2E] text-[#FFD60A] border-[#FFD60A]'
                    : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                <Square className="w-3.5 h-3.5 mb-0.5" />
                <span>1:1 Feed</span>
              </button>

              <button
                type="button"
                onClick={() => setCardAspectRatio('4:5')}
                className={`p-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center border transition-all cursor-pointer ${
                  cardAspectRatio === '4:5'
                    ? 'bg-[#0A3D2E] text-[#FFD60A] border-[#FFD60A]'
                    : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 mb-0.5" />
                <span>4:5 Portrait</span>
              </button>

              <button
                type="button"
                onClick={() => setCardAspectRatio('9:16')}
                className={`p-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center border transition-all cursor-pointer ${
                  cardAspectRatio === '9:16'
                    ? 'bg-[#0A3D2E] text-[#FFD60A] border-[#FFD60A]'
                    : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 mb-0.5" />
                <span>9:16 Story</span>
              </button>

              <button
                type="button"
                onClick={() => setCardAspectRatio('16:9')}
                className={`p-2 rounded-xl text-[11px] font-bold flex flex-col items-center justify-center border transition-all cursor-pointer ${
                  cardAspectRatio === '16:9'
                    ? 'bg-[#0A3D2E] text-[#FFD60A] border-[#FFD60A]'
                    : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'
                }`}
              >
                <Square className="w-3.5 h-3.5 mb-0.5 rotate-90" />
                <span>16:9 Banner</span>
              </button>
            </div>
          </div>

          {/* Social Themes Selection */}
          <div className="space-y-2 pt-2 border-t border-gray-800">
            <span className="text-xs font-bold text-gray-300 font-display uppercase tracking-wider block">
              3. Visual Styling & Color Themes:
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setCardTheme('sabi-green')}
                className={`p-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-center ${
                  cardTheme === 'sabi-green' ? 'bg-[#0A3D2E] text-[#FFD60A] border-[#FFD60A]' : 'bg-gray-900 text-gray-400 border-gray-800'
                }`}
              >
                SABI Emerald
              </button>

              <button
                type="button"
                onClick={() => setCardTheme('tiktok-viral')}
                className={`p-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-center ${
                  cardTheme === 'tiktok-viral' ? 'bg-pink-900 text-pink-300 border-pink-400' : 'bg-gray-900 text-gray-400 border-gray-800'
                }`}
              >
                TikTok Neon
              </button>

              <button
                type="button"
                onClick={() => setCardTheme('whatsapp-green')}
                className={`p-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-center ${
                  cardTheme === 'whatsapp-green' ? 'bg-[#075E54] text-[#25D366] border-[#25D366]' : 'bg-gray-900 text-gray-400 border-gray-800'
                }`}
              >
                WhatsApp Teal
              </button>

              <button
                type="button"
                onClick={() => setCardTheme('dark-forensic')}
                className={`p-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-center ${
                  cardTheme === 'dark-forensic' ? 'bg-purple-900 text-purple-300 border-purple-400' : 'bg-gray-900 text-gray-400 border-gray-800'
                }`}
              >
                Cyber Dark
              </button>

              <button
                type="button"
                onClick={() => setCardTheme('high-contrast-red')}
                className={`p-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-center ${
                  cardTheme === 'high-contrast-red' ? 'bg-rose-900 text-rose-300 border-rose-400' : 'bg-gray-900 text-gray-400 border-gray-800'
                }`}
              >
                Alert Red
              </button>

              <button
                type="button"
                onClick={() => setCardTheme('clean-white')}
                className={`p-2 rounded-xl text-[10px] font-bold border transition-all cursor-pointer text-center ${
                  cardTheme === 'clean-white' ? 'bg-white text-gray-900 border-gray-400' : 'bg-gray-900 text-gray-400 border-gray-800'
                }`}
              >
                Clean Paper
              </button>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-800 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeWatermark}
                onChange={(e) => setIncludeWatermark(e.target.checked)}
                className="rounded-sm text-[#FFD60A] focus:ring-0 cursor-pointer"
              />
              <span className="text-gray-300 font-mono">Include SABI Watermark</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeQrCode}
                onChange={(e) => setIncludeQrCode(e.target.checked)}
                className="rounded-sm text-[#FFD60A] focus:ring-0 cursor-pointer"
              />
              <span className="text-gray-300 font-mono">Include QR Code</span>
            </label>
          </div>

        </div>

        {/* Right Column: Live Rendered Card Preview Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-black/60 p-6 rounded-2xl border border-gray-800 min-h-[420px]">
          
          <div className="text-xs text-gray-400 font-mono mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FFD60A]" />
            <span>Live Card Preview ({cardAspectRatio} • {cardTheme.toUpperCase()})</span>
          </div>

          {/* Card Container */}
          <div
            ref={cardRef}
            className={`w-full max-w-md p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${getCardBackgroundClass()} ${
              cardAspectRatio === '9:16' ? 'aspect-[9/16] max-w-xs' : cardAspectRatio === '4:5' ? 'aspect-[4/5] max-w-sm' : cardAspectRatio === '16:9' ? 'aspect-[16/9] max-w-lg' : 'aspect-square max-w-md'
            }`}
          >
            
            {/* Top Card Header */}
            <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-3 z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#0A3D2E] text-[#FFD60A] border border-[#FFD60A] flex items-center justify-center font-black text-xs font-display">
                  SABI
                </div>
                <div>
                  <div className="text-xs font-black tracking-wider uppercase font-display">SABI Nigeria Fact-Check</div>
                  <div className="text-[10px] opacity-80 font-mono">{sourcePlatform}</div>
                </div>
              </div>

              {languageBadge && (
                <span className="bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border border-white/30">
                  {languageBadge}
                </span>
              )}
            </div>

            {/* Verdict Badge & Claim Text */}
            <div className="my-auto space-y-3 z-10 py-2">
              
              <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider border shadow-lg font-display ${getVerdictBadgeStyle()}`}>
                {getVerdictIcon()}
                <span>{verdict}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono font-extrabold opacity-70 block">Viral Claim:</span>
                <h4 className="text-sm sm:text-base font-black font-display leading-tight line-clamp-3">
                  "{claimText}"
                </h4>
              </div>

              <div className="space-y-1 bg-black/40 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                <span className="text-[10px] uppercase font-mono font-extrabold text-[#FFD60A] block">Verified Truth:</span>
                <p className="text-xs opacity-90 leading-snug line-clamp-4 font-sans">
                  {summaryText}
                </p>
              </div>

            </div>

            {/* Card Footer */}
            <div className="flex items-end justify-between border-t border-white/20 pt-3 z-10 text-[10px]">
              <div>
                <div className="font-bold flex items-center gap-1 text-[#FFD60A]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified by {verifierCount} SABI Spotters</span>
                </div>
                {includeWatermark && (
                  <div className="opacity-70 font-mono mt-0.5">SABI • Official Nigerian Truth Network</div>
                )}
              </div>

              {includeQrCode && (
                <div className="bg-white p-1 rounded-lg text-black shrink-0 flex items-center justify-center">
                  <QrCode className="w-6 h-6" />
                </div>
              )}
            </div>

          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="text-xs text-gray-300 hover:text-white flex items-center gap-1.5 font-mono underline cursor-pointer"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Link Copied!' : 'Copy Verification Link'}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
