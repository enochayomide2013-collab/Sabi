import React, { useState } from 'react';
import { 
  Share2, 
  MessageCircle, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Edit3, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Send, 
  Eye, 
  Info,
  ExternalLink,
  Layers,
  FileText
} from 'lucide-react';

export type PreviewTemplateType = 'executive' | 'alert' | 'technical' | 'custom';

export interface ForensicReportShareProps {
  reportType: 'image' | 'video' | 'deepfake' | 'general';
  fileName?: string;
  thumbnailUrl?: string;
  verdict: string;
  verdictRiskLevel?: 'safe' | 'warning' | 'danger' | 'info';
  confidence: string;
  confidenceScore: number;
  summary: string;
  keyIndicators?: Array<{ name: string; observation: string; risk?: string }>;
  guidanceText?: string;
  technicalDetails?: Array<{ label: string; value: string }>;
  onShowToast?: (points: number, message: string) => void;
  className?: string;
}

export const ForensicReportShare: React.FC<ForensicReportShareProps> = ({
  reportType,
  fileName = 'Media_Evidence_Item',
  thumbnailUrl,
  verdict,
  verdictRiskLevel = 'info',
  confidence,
  confidenceScore,
  summary,
  keyIndicators = [],
  guidanceText,
  technicalDetails = [],
  onShowToast,
  className = ''
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<PreviewTemplateType>('executive');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [copiedType, setCopiedType] = useState<'text' | 'link' | null>(null);
  const [isCustomizing, setIsCustomizing] = useState<boolean>(false);

  // Verdict visual helpers
  const getVerdictIcon = () => {
    if (verdictRiskLevel === 'safe' || verdict.toLowerCase().includes('authentic') || verdict.toLowerCase().includes('no major')) {
      return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
    }
    if (verdictRiskLevel === 'danger' || verdict.toLowerCase().includes('manipulated') || verdict.toLowerCase().includes('potential manipulation')) {
      return <AlertTriangle className="w-5 h-5 text-rose-600" />;
    }
    return <HelpCircle className="w-5 h-5 text-amber-600" />;
  };

  const getVerdictBadgeColor = () => {
    if (verdictRiskLevel === 'safe' || verdict.toLowerCase().includes('authentic') || verdict.toLowerCase().includes('no major')) {
      return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
    if (verdictRiskLevel === 'danger' || verdict.toLowerCase().includes('manipulated') || verdict.toLowerCase().includes('potential manipulation')) {
      return 'bg-rose-100 text-rose-900 border-rose-300';
    }
    return 'bg-amber-100 text-amber-900 border-amber-300';
  };

  // Generate template texts
  const getExecutiveMessage = (): string => {
    const indicatorsSummary = keyIndicators.slice(0, 3).map(k => `• ${k.name}: ${k.observation}`).join('\n');
    return (
      `🔍 *SABI DELUXE FORENSIC VERIFICATION REPORT*\n\n` +
      `📁 *Asset:* ${fileName} (${reportType.toUpperCase()})\n` +
      `⚖️ *VERDICT:* *${verdict.toUpperCase()}*\n` +
      `📊 *Confidence Level:* ${confidence} (${confidenceScore}%)\n\n` +
      `📝 *Executive Findings:*\n${summary}\n\n` +
      (indicatorsSummary ? `🔬 *Key Indicators:*\n${indicatorsSummary}\n\n` : '') +
      (guidanceText ? `🛡️ *Fact-Checker Guidance:*\n${guidanceText}\n\n` : '') +
      `✅ Verified with SABI Deluxe Forensic Suite`
    );
  };

  const getAlertMessage = (): string => {
    const isManipulated = verdictRiskLevel === 'danger' || verdict.toLowerCase().includes('manipulated');
    return (
      `🚨 *SABI MEDIA FORENSICS ALERT: ${isManipulated ? 'MANIPULATION FLAGGED' : 'EVIDENCE REVIEWED'}*\n\n` +
      `*Verdict:* ${verdict}\n` +
      `*Confidence:* ${confidenceScore}% (${confidence})\n\n` +
      `*Summary:* ${summary}\n\n` +
      `Before sharing or forwarding this media, please verify the forensic findings.`
    );
  };

  const getTechnicalDossierMessage = (): string => {
    const techSpecs = technicalDetails.map(t => `${t.label}: ${t.value}`).join(' | ');
    const allIndicators = keyIndicators.map(k => `- [${k.risk ? k.risk.toUpperCase() : 'NOTE'}] ${k.name}: ${k.observation}`).join('\n');
    return (
      `=== SABI FORENSIC TECHNICAL DOSSIER ===\n` +
      `Target: ${fileName}\n` +
      `Type: ${reportType.toUpperCase()} MEDIA FORENSICS\n` +
      `Verdict: ${verdict}\n` +
      `Confidence Index: ${confidenceScore}%\n` +
      `Telemetry: ${techSpecs || 'Standard signal spectral analysis completed'}\n\n` +
      `Key Forensic Findings:\n${allIndicators || '- Clean baseline consistency observed across all tests'}\n\n` +
      `Analysis Summary:\n${summary}\n` +
      `=======================================`
    );
  };

  // Resolve current active message based on selected template
  const getActiveMessageText = (): string => {
    if (selectedTemplate === 'custom' && customMessage.trim().length > 0) {
      return customMessage;
    }
    switch (selectedTemplate) {
      case 'alert':
        return getAlertMessage();
      case 'technical':
        return getTechnicalDossierMessage();
      case 'executive':
      default:
        return getExecutiveMessage();
    }
  };

  // Twitter specific short preview
  const getTwitterText = (): string => {
    const verdictTag = verdict.toLowerCase().includes('manipulated') ? '⚠️ FLAGGED' : '✅ VERIFIED';
    const base = `${verdictTag}: Forensic Analysis for ${fileName}\n\nVerdict: ${verdict} (${confidenceScore}% Confidence)\n\n${summary.slice(0, 110)}...`;
    return base;
  };

  // Facebook specific quote
  const getFacebookQuote = (): string => {
    return `SABI Media Forensic Report: ${verdict} for ${fileName}. ${summary}`;
  };

  // Native Web Share API Handler
  const handleNativeShare = async () => {
    const shareUrl = window.location.href;
    const shareText = getActiveMessageText();
    const shareData = {
      title: `SABI Forensic Analysis: ${verdict}`,
      text: shareText,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        onShowToast?.(5, 'Report shared via native dialog!');
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          await handleCopyText();
        }
      }
    } else {
      // Fallback: Copy to clipboard and inform user
      await handleCopyText();
    }
  };

  // WhatsApp Handler
  const handleWhatsAppShare = () => {
    const text = getActiveMessageText() + `\n\n🔗 *Full Investigation Deep Link:* ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onShowToast?.(5, 'Opening WhatsApp Share...');
  };

  // Twitter (X) Handler
  const handleTwitterShare = () => {
    const text = getTwitterText();
    const url = window.location.href;
    const hashtags = 'SABIFactCheck,MediaForensics,DeluxeForensics';
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
    onShowToast?.(5, 'Opening Twitter (X) Share...');
  };

  // Facebook Handler
  const handleFacebookShare = () => {
    const url = window.location.href;
    const quote = getFacebookQuote();
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(quote)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer');
    onShowToast?.(5, 'Opening Facebook Share...');
  };

  // Copy Full Text Dossier
  const handleCopyText = async () => {
    const text = getActiveMessageText() + `\n\nDeep Link: ${window.location.href}`;
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setCopiedType('text');
      onShowToast?.(5, 'Forensic report copied to clipboard!');
      setTimeout(() => {
        setIsCopied(false);
        setCopiedType(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  // Copy Direct URL
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setCopiedType('link');
      onShowToast?.(5, 'Investigation URL copied!');
      setTimeout(() => {
        setIsCopied(false);
        setCopiedType(null);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy URL', err);
    }
  };

  // Download Markdown Report File
  const handleDownloadMarkdown = () => {
    const content = `# SABI Forensic Verification Report
Generated: ${new Date().toLocaleString()}
Asset: ${fileName}
Tool: ${reportType.toUpperCase()} Forensic Analysis

## Verdict: ${verdict}
Confidence: ${confidence} (${confidenceScore}%)

## Executive Summary
${summary}

## Technical Indicators
${keyIndicators.map(k => `- **${k.name}** [${k.risk || 'info'}]: ${k.observation}`).join('\n')}

## Technical Metadata
${technicalDetails.map(t => `- **${t.label}**: ${t.value}`).join('\n')}

## Guidance for Fact Checkers
${guidanceText || 'Follow standard double-source protocol before publishing.'}

---
*Verified via SABI Deluxe Forensic Suite*
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SABI_Forensic_Report_${fileName.replace(/[^a-zA-Z0-9]/g, '_')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onShowToast?.(5, 'Downloaded Markdown Report!');
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl p-5 sm:p-6 text-white border border-purple-500/30 shadow-2xl space-y-5 ${className}`} id="deluxe-forensic-share-component">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0A3D2E] text-[#FFD60A] border border-[#FFD60A]/30 flex items-center justify-center shrink-0 shadow-md">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-black uppercase tracking-wider text-white font-display">
                Share Forensic Analysis Report
              </h4>
              <span className="bg-[#FFD60A] text-[#0A3D2E] text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full">
                DELUXE
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Natively share verified media verdicts across WhatsApp, Twitter (X), Facebook, or download dossiers.
            </p>
          </div>
        </div>

        {/* Current Verdict Badge */}
        <div className="shrink-0 flex items-center gap-2">
          <span className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 shadow-xs ${getVerdictBadgeColor()}`}>
            {getVerdictIcon()}
            <span>{verdict}</span>
          </span>
        </div>
      </div>

      {/* Message Preview Style Selector Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-gray-300 font-display uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFD60A]" />
            <span>Select Preview Message Style:</span>
          </span>
          <span className="text-[11px] text-gray-400">
            {selectedTemplate === 'custom' ? 'Custom Editable Text' : 'Formatted for Fast Verification'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 bg-gray-950 p-1.5 rounded-2xl border border-gray-800">
          <button
            type="button"
            onClick={() => {
              setSelectedTemplate('executive');
              setIsCustomizing(false);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedTemplate === 'executive'
                ? 'bg-[#0A3D2E] text-[#FFD60A] border border-[#FFD60A]/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Executive Brief</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedTemplate('alert');
              setIsCustomizing(false);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedTemplate === 'alert'
                ? 'bg-rose-950 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Fact-Check Alert</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedTemplate('technical');
              setIsCustomizing(false);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedTemplate === 'technical'
                ? 'bg-purple-950 text-purple-200 border border-purple-500/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Tech Dossier</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (selectedTemplate !== 'custom') {
                setCustomMessage(getActiveMessageText());
              }
              setSelectedTemplate('custom');
              setIsCustomizing(true);
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
              selectedTemplate === 'custom'
                ? 'bg-amber-950 text-[#FFD60A] border border-[#FFD60A]/40 shadow-sm'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Custom Text</span>
          </button>
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-gray-400" />
            <span>Message Preview to Recipients:</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!isCustomizing) {
                setCustomMessage(getActiveMessageText());
                setSelectedTemplate('custom');
                setIsCustomizing(true);
              } else {
                setIsCustomizing(false);
              }
            }}
            className="text-[#FFD60A] hover:underline flex items-center gap-1 cursor-pointer font-bold"
          >
            <Edit3 className="w-3 h-3" />
            <span>{isCustomizing ? 'Lock Template' : 'Edit Message Text'}</span>
          </button>
        </div>

        {isCustomizing ? (
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={5}
            placeholder="Type your custom share message here..."
            className="w-full bg-black/80 border border-gray-700 rounded-2xl p-3.5 text-xs text-gray-200 font-mono focus:outline-hidden focus:border-[#FFD60A] focus:ring-1 focus:ring-[#FFD60A] leading-relaxed resize-y"
          />
        ) : (
          <div className="bg-black/60 border border-gray-800 rounded-2xl p-3.5 text-xs text-gray-300 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed scrollbar-thin">
            {getActiveMessageText()}
          </div>
        )}
      </div>

      {/* Main Native & Social Share Channels Grid */}
      <div className="space-y-2.5 pt-1">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block font-display">
          Dispatch Report via Channels:
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          
          {/* 1. WhatsApp Button */}
          <button
            type="button"
            id="share-forensic-whatsapp-btn"
            onClick={handleWhatsAppShare}
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer font-display"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          {/* 2. Twitter (X) Button */}
          <button
            type="button"
            id="share-forensic-twitter-btn"
            onClick={handleTwitterShare}
            className="bg-black hover:bg-gray-800 text-white border border-gray-700 hover:border-gray-500 p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer font-display"
          >
            <span className="font-serif font-black text-sm">𝕏</span>
            <span>Twitter (X)</span>
          </button>

          {/* 3. Facebook Button */}
          <button
            type="button"
            id="share-forensic-facebook-btn"
            onClick={handleFacebookShare}
            className="bg-[#1877F2] hover:bg-[#166fe5] text-white p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer font-display"
          >
            <span className="font-bold text-sm font-sans">f</span>
            <span>Facebook</span>
          </button>

          {/* 4. Native Web Share API Button */}
          <button
            type="button"
            id="share-forensic-native-btn"
            onClick={handleNativeShare}
            className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-[#FFD60A] border border-[#FFD60A]/30 p-3 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer font-display"
          >
            <Share2 className="w-4 h-4 text-[#FFD60A]" />
            <span>Native Share</span>
          </button>

        </div>
      </div>

      {/* Secondary Actions: Copy Full Report, Copy Link, Download Markdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-gray-800/80">
        
        <button
          type="button"
          onClick={handleCopyText}
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 hover:border-gray-500 p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          {isCopied && copiedType === 'text' ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
          <span>{isCopied && copiedType === 'text' ? 'Copied Dossier!' : 'Copy Full Report'}</span>
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 hover:border-gray-500 p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          {isCopied && copiedType === 'link' ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <ExternalLink className="w-4 h-4 text-gray-400" />
          )}
          <span>{isCopied && copiedType === 'link' ? 'Copied Deep Link!' : 'Copy URL Link'}</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadMarkdown}
          className="bg-purple-900/30 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30 hover:border-purple-500 p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4 text-purple-300" />
          <span>Export Markdown (.md)</span>
        </button>

      </div>

    </div>
  );
};
