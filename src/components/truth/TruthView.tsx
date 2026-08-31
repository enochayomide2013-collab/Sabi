import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Share2, 
  Copy, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Flag, 
  Sparkles, 
  Check,
  ChevronRight,
  MessageCircle,
  Film,
  FileText,
  Video,
  ExternalLink
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { TruthResult } from '../../types';
import { ReportContentModal } from '../common/ReportContentModal';
import { DeepfakeScanner } from './DeepfakeScanner';

interface TruthViewProps {
  initialTruthId?: string;
  onNavigate: (tab: string, extraData?: any) => void;
}

export const TruthView: React.FC<TruthViewProps> = ({ initialTruthId, onNavigate }) => {
  const [truthResults, setTruthResults] = useState<TruthResult[]>(storageService.getTruthResults());
  const [selectedResult, setSelectedResult] = useState<TruthResult>(
    initialTruthId ? truthResults.find(t => t.id === initialTruthId) || truthResults[0] : truthResults[0]
  );

  // View mode: 'evidence' vs 'video'
  const [viewMode, setViewMode] = useState<'evidence' | 'video'>('evidence');

  // Video playback & 20s timeline chapter state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  const durationSec = 20;
  const progressTimerRef = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setTruthResults(storageService.getTruthResults());
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (initialTruthId) {
      const match = truthResults.find(t => t.id === initialTruthId);
      if (match) setSelectedResult(match);
    }
  }, [initialTruthId, truthResults]);

  // Video timeline loop (0 to 20 seconds)
  useEffect(() => {
    if (isPlaying && viewMode === 'video') {
      progressTimerRef.current = setInterval(() => {
        setCurrentTimeSec(prev => {
          if (prev >= durationSec) {
            return 0; // loop
          }
          return Number((prev + 0.2).toFixed(1));
        });
      }, 200);
    } else {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [isPlaying, viewMode]);

  // Timeline Chapter Logic:
  const getCurrentChapter = () => {
    if (currentTimeSec < 3) {
      return {
        stage: 'HOOK',
        title: 'VERIFYING COMMUNITY CLAIM',
        caption: 'Did this actually happen in ' + selectedResult.area + '?'
      };
    } else if (currentTimeSec < 7) {
      return {
        stage: 'CLAIM',
        title: 'ORIGINAL CLAIM',
        caption: `“${selectedResult.originalClaimQuote}”`
      };
    } else if (currentTimeSec < 15) {
      return {
        stage: 'EVIDENCE',
        title: 'COMMUNITY EVIDENCE',
        caption: selectedResult.availableEvidenceQuote
      };
    } else {
      return {
        stage: 'RESULT',
        title: 'SABI VERDICT',
        caption: `VERDICT: ${selectedResult.result} — Confirmed by ${selectedResult.contributorCount} local verifiers`
      };
    }
  };

  const chapter = getCurrentChapter();

  const handleCopyLink = () => {
    const deepLink = `${window.location.origin}/#truth-${selectedResult.id}`;
    navigator.clipboard?.writeText(deepLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    const shareUrl = `${window.location.origin}/#truth-${selectedResult.id}`;
    const shareData = {
      title: `SABI Evidence Report: ${selectedResult.claim}`,
      text: `SABI Investigation Verdict: ${selectedResult.result}. Location: ${selectedResult.area}, ${selectedResult.state}. Check out the verified evidence report!`,
      url: shareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        handleCopyLink();
        alert('Deep link copied to clipboard for sharing!');
      }
    } catch (err) {
      console.log('Share cancelled or not allowed', err);
    }
  };

  const handleWhatsAppShare = () => {
    const shareUrl = `${window.location.origin}/#truth-${selectedResult.id}`;
    const text = encodeURIComponent(
      `*SABI EVIDENCE REPORT*\n\nCLAIM: "${selectedResult.claim}"\nVERDICT: *${selectedResult.result}*\nLOCATION: ${selectedResult.area}, ${selectedResult.state}\n\nEXPLANATION: ${selectedResult.audioNarrationText}\n\n🔗 Deep Link: ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleTikTokShare = () => {
    handleCopyLink();
    alert('Truth Video link copied! You can now paste and share this investigation clip to TikTok.');
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'TRUE':
        return (
          <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-md font-display">
            <CheckCircle2 className="w-4 h-4" /> ✅ VERIFIED (TRUE)
          </span>
        );
      case 'FALSE':
        return (
          <span className="inline-flex items-center gap-1.5 bg-red-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-md font-display">
            <XCircle className="w-4 h-4" /> ❌ MISLEADING (FALSE)
          </span>
        );
      case 'OUTDATED MEDIA':
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-600 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-md font-display">
            <Clock className="w-4 h-4" /> ⚠️ UNCERTAIN (OUTDATED MEDIA)
          </span>
        );
      case 'NEEDS MORE VERIFICATION':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 bg-amber-700 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-md font-display">
            <AlertTriangle className="w-4 h-4" /> ⚠️ UNCERTAIN (NEEDS REVIEW)
          </span>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 animate-fade-in" id="truth-view-main">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A3D2E] bg-[#0A3D2E]/10 px-3 py-1 rounded-full uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SABI Investigation Center</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-display mt-1">
            Evidence Report & Truth Video
          </h1>
        </div>

        <button
          onClick={() => setIsReportModalOpen(true)}
          className="text-xs font-semibold text-gray-500 hover:text-red-600 flex items-center gap-1 p-2 rounded-xl hover:bg-gray-100 transition-all"
          title="Report this content"
        >
          <Flag className="w-4 h-4" />
          <span className="hidden sm:inline">Report</span>
        </button>
      </div>

      <DeepfakeScanner />

      {/* Result Selector Carousel */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {truthResults.map(tr => (
          <button
            key={tr.id}
            onClick={() => {
              setSelectedResult(tr);
              setCurrentTimeSec(0);
              setIsPlaying(true);
            }}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all border text-left ${
              selectedResult.id === tr.id
                ? 'bg-[#0A3D2E] text-white border-[#0A3D2E] shadow-md ring-2 ring-[#0A3D2E]/30'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="block truncate max-w-[190px] font-display">{tr.claim}</span>
            <span className={`text-[10px] font-semibold mt-0.5 block ${selectedResult.id === tr.id ? 'text-[#FFD60A]' : 'text-gray-500'}`}>
              {tr.result}
            </span>
          </button>
        ))}
      </div>

      {/* MODE SWITCHER TAB: EVIDENCE REPORT vs TRUTH VIDEO */}
      <div className="bg-gray-200 p-1.5 rounded-2xl flex items-center gap-1">
        <button
          onClick={() => setViewMode('evidence')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            viewMode === 'evidence'
              ? 'bg-white text-[#0A3D2E] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4 text-[#0A3D2E]" />
          <span>SABI Evidence Report</span>
        </button>

        <button
          onClick={() => setViewMode('video')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
            viewMode === 'video'
              ? 'bg-[#0A3D2E] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Video className="w-4 h-4 text-[#FFD60A]" />
          <span>🎥 Turn into Truth Video</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. SABI EVIDENCE REPORT VIEW (The Killer Feature)        */}
      {/* ======================================================== */}
      {viewMode === 'evidence' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6 animate-fade-in" id="sabi-evidence-report-card">
          
          {/* Report Title & Verdict Banner */}
          <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                Official SABI Audit Trail
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-display mt-1">
                Investigation Result & Fact Sheet
              </h2>
            </div>
            <div>
              {getResultBadge(selectedResult.result)}
            </div>
          </div>

          {/* 8 SPECIFIED EVIDENCE REPORT ITEMS */}
          <div className="space-y-4 text-xs sm:text-sm">
            
            {/* 1. CLAIM */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-1">
              <span className="text-[11px] font-extrabold uppercase text-gray-500 tracking-wider block font-display">
                📋 CLAIM (What the rumor says)
              </span>
              <p className="text-sm sm:text-base font-bold text-gray-900 leading-snug">
                "{selectedResult.originalClaimQuote}"
              </p>
            </div>

            {/* 2. LOCATION */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-1">
              <span className="text-[11px] font-extrabold uppercase text-gray-500 tracking-wider block font-display">
                📍 LOCATION (Where it was reported)
              </span>
              <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                <MapPin className="w-4 h-4 text-[#0A3D2E]" />
                <span>{selectedResult.area}, {selectedResult.lga}, {selectedResult.state}</span>
              </div>
            </div>

            {/* 3. COMMUNITY */}
            <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200 space-y-1">
              <span className="text-[11px] font-extrabold uppercase text-emerald-900 tracking-wider block font-display">
                👥 COMMUNITY (What nearby people found)
              </span>
              <p className="text-sm font-semibold text-emerald-950 leading-relaxed">
                {selectedResult.availableEvidenceQuote}
              </p>
              <div className="text-[11px] font-bold text-emerald-800 pt-1">
                Verified by {selectedResult.contributorCount} active on-ground community spotters.
              </div>
            </div>

            {/* 4. MEDIA */}
            <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 space-y-1">
              <span className="text-[11px] font-extrabold uppercase text-blue-900 tracking-wider block font-display">
                🔍 MEDIA (What AI detected)
              </span>
              <p className="text-sm font-semibold text-blue-950 leading-relaxed">
                {selectedResult.aiMediaAnalysis.details}
              </p>
              <div className="text-[11px] font-bold text-blue-800 pt-1">
                AI Confidence Score: {selectedResult.aiMediaAnalysis.confidenceScore}% ({selectedResult.aiMediaAnalysis.status})
              </div>
            </div>

            {/* 5. SOURCES */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-1">
              <span className="text-[11px] font-extrabold uppercase text-gray-500 tracking-wider block font-display">
                🔗 SOURCES (Supporting & contextual information)
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedResult.sources.map((src, idx) => (
                  <span key={idx} className="bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-xl border border-gray-200">
                    {src}
                  </span>
                ))}
              </div>
            </div>

            {/* 6. VERDICT */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-1">
              <span className="text-[11px] font-extrabold uppercase text-gray-500 tracking-wider block font-display">
                ⚖️ VERDICT
              </span>
              <div className="pt-1">
                {getResultBadge(selectedResult.result)}
              </div>
            </div>

            {/* 7. CONFIDENCE */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-1">
              <span className="text-[11px] font-extrabold uppercase text-gray-500 tracking-wider block font-display">
                ⭐ CONFIDENCE (AI & community consensus)
              </span>
              <div className="flex items-center gap-2 font-bold text-gray-900">
                <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs">
                  {selectedResult.confidence} Confidence ({selectedResult.aiMediaAnalysis.confidenceScore}%)
                </span>
                <span className="text-xs text-gray-500">Consensus threshold successfully met</span>
              </div>
            </div>

            {/* 8. EXPLANATION */}
            <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200 space-y-1">
              <span className="text-[11px] font-extrabold uppercase text-amber-900 tracking-wider block font-display">
                💡 EXPLANATION (Simple explanation anyone can understand)
              </span>
              <p className="text-sm font-bold text-amber-950 leading-relaxed">
                {selectedResult.audioNarrationText}
              </p>
            </div>

          </div>

          {/* TRANSITION TO TRUTH VIDEO BUTTON */}
          <div className="pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Generated {selectedResult.verifiedAt} · {selectedResult.viewsCount.toLocaleString()} views
            </span>

            <button
              onClick={() => {
                setViewMode('video');
                setIsPlaying(true);
              }}
              className="w-full sm:w-auto bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-extrabold text-xs px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-display"
            >
              <Film className="w-4 h-4" />
              <span>🎥 Turn Result Into Truth Video</span>
            </button>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. 🎥 TRUTH VIDEO ANIMATED PLAYER VIEW                   */}
      {/* ======================================================== */}
      {viewMode === 'video' && (
        <div className="space-y-6 animate-fade-in" id="truth-video-player-container">
          
          <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative aspect-[9/13] max-w-sm mx-auto flex flex-col justify-between text-white select-none">
            
            {/* Background Image / Motion Simulation */}
            <img
              src={selectedResult.videoThumbnail}
              alt={selectedResult.claim}
              className="absolute inset-0 w-full h-full object-cover opacity-65 scale-105 transition-transform duration-1000"
            />

            {/* Dynamic Dark Gradient Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/95 pointer-events-none" />

            {/* Top Video Overlay: Logo, Result Badge & Audio Control */}
            <div className="relative z-10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#0A3D2E] flex items-center justify-center border border-[#FFD60A]">
                  <span className="text-[#FFD60A] font-extrabold text-xs">S</span>
                </div>
                <span className="text-xs font-bold text-white font-display tracking-wider">SABI TRUTH VIDEO</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Center Tap-to-Play/Pause Controller */}
            <div 
              onClick={() => setIsPlaying(!isPlaying)}
              className="relative z-10 flex-grow flex items-center justify-center cursor-pointer"
            >
              {!isPlaying && (
                <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
              )}
            </div>

            {/* Dynamic Captions & Chapter Breakdown */}
            <div className="relative z-10 p-5 space-y-3">
              
              <div className="flex items-center justify-between">
                <span className="inline-block bg-[#FFD60A] text-[#0A3D2E] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-display">
                  {chapter.title} ({Math.floor(currentTimeSec)}s / 20s)
                </span>
                <span className="text-[11px] text-gray-300">
                  {selectedResult.area}, {selectedResult.state}
                </span>
              </div>

              <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 min-h-[90px] flex items-center">
                <p className="text-base sm:text-lg font-extrabold leading-snug text-white font-display text-center w-full">
                  {chapter.caption}
                </p>
              </div>

              {/* 20-Second Progress Bar */}
              <div className="space-y-1.5 pt-1">
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#FFD60A] h-full transition-all duration-200"
                    style={{ width: `${(currentTimeSec / durationSec) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-gray-400 font-semibold px-0.5">
                  <span>0s Hook</span>
                  <span>3s Claim</span>
                  <span>7s Evidence</span>
                  <span>15s Verdict</span>
                </div>
              </div>

            </div>

          </div>

          <div className="text-center">
            <button
              onClick={() => setViewMode('evidence')}
              className="text-xs font-bold text-[#0A3D2E] hover:underline"
            >
              ← Back to Full SABI Evidence Report
            </button>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SHARE FUNCTIONALITY & DEEP LINK INTEGRATION              */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-gray-900 font-display">
              Share Evidence Report & Deep Link
            </h3>
            <p className="text-xs text-gray-500">
              Instantly share this verified investigation with family, WhatsApp groups, or social media.
            </p>
          </div>
          <Share2 className="w-5 h-5 text-[#0A3D2E]" />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          {/* Native Web Share API Button */}
          <button
            onClick={handleNativeShare}
            className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 font-display col-span-2 sm:col-span-1"
          >
            <Share2 className="w-4 h-4 text-[#FFD60A]" />
            <span>Native Share</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={handleWhatsAppShare}
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          {/* TikTok Clip */}
          <button
            onClick={handleTikTokShare}
            className="bg-black hover:bg-gray-800 text-white p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
          >
            <Film className="w-4 h-4" />
            <span>TikTok Clip</span>
          </button>

          {/* Copy Deep Link */}
          <button
            onClick={handleCopyLink}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Link Copied!' : 'Copy Deep Link'}</span>
          </button>

        </div>
      </div>

      {/* REPORT CONTENT MODAL */}
      <ReportContentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        contentTitle={selectedResult.claim}
      />

    </div>
  );
};
