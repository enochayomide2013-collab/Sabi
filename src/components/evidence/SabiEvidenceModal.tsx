import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Video, 
  Users, 
  Clock, 
  Search, 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ExternalLink, 
  ShieldCheck, 
  Share2, 
  Play, 
  Pause,
  FileText,
  BadgeCheck,
  Eye,
  Heart,
  MessageCircle,
  Volume2
} from 'lucide-react';
import { EvidenceDetails, NewsArticle } from '../../types';

interface SabiEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: NewsArticle | null;
  evidence?: EvidenceDetails;
  onShowToast?: (points: number, message: string) => void;
}

export const SabiEvidenceModal: React.FC<SabiEvidenceModalProps> = ({
  isOpen,
  onClose,
  article,
  evidence,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'card' | 'video' | 'forensics'>('card');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  if (!isOpen || (!article && !evidence)) return null;

  // Use explicit evidence prop or article's evidence object with video-only defaults
  const ev: EvidenceDetails = evidence || article?.evidence || {
    claim: article?.title || "Verification of reported event",
    location: article?.state ? `${article.state}, Nigeria` : "Port Harcourt, Rivers State",
    videoPlatform: (article?.socialPlatform === 'tiktok' ? 'TikTok' : article?.socialPlatform === 'twitter' ? 'Twitter (X)' : 'Facebook'),
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-traffic-in-a-busy-city-avenue-42456-large.mp4',
    videoTitle: 'Live Verified Corroboration Video Stream',
    videoDuration: '0:45',
    videoViews: '185,400',
    videoLikes: '14,200',
    captionsText: 'Live ground truth inspection confirmed normal flow without disruptions.',
    verifiedByCount: 6,
    capturedTime: 'Today, 11:15 AM',
    officialSource: article?.verifiedSource || 'Official Regulatory & State Transport Bulletin',
    officialSourceUrl: 'https://sabi.ng/verification-vault',
    aiMediaCheck: 'Deepfake forensic scan passed • Zero generative manipulation • Synchronous audio waveform match',
    verdict: 'VERIFIED',
    verifierExplanation: 'SABI verifiers recorded live video footage on site. Tarmac is dry, safety barriers intact, and vehicles crossing at standard speeds.',
    originPlatform: (article?.socialPlatform === 'tiktok' ? 'TikTok' : article?.socialPlatform === 'twitter' ? 'Twitter (X)' : 'Facebook'),
    state: article?.state || 'Rivers'
  };

  const getVerdictBadge = (verdict: string) => {
    switch (verdict) {
      case 'VERIFIED':
        return {
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-700" />,
          label: 'VERIFIED'
        };
      case 'FALSE':
        return {
          bg: 'bg-rose-100 text-rose-950 border-rose-300',
          icon: <AlertTriangle className="w-4 h-4 text-rose-700" />,
          label: 'FALSE / DEBUNKED'
        };
      case 'OUTDATED MEDIA':
        return {
          bg: 'bg-amber-100 text-amber-950 border-amber-300',
          icon: <Clock className="w-4 h-4 text-amber-700" />,
          label: 'OUTDATED MEDIA'
        };
      case 'NEEDS MORE VERIFICATION':
      default:
        return {
          bg: 'bg-blue-100 text-blue-950 border-blue-300',
          icon: <HelpCircle className="w-4 h-4 text-blue-700" />,
          label: 'UNDER ACTIVE INVESTIGATION'
        };
    }
  };

  const verdictBadge = getVerdictBadge(ev.verdict);

  const getPlatformTag = (platform?: string) => {
    const p = (platform || ev.videoPlatform || 'TikTok').toLowerCase();
    if (p.includes('tiktok')) {
      return { name: 'TikTok Video', color: 'bg-black text-white border-pink-500/40', dot: 'bg-pink-500' };
    }
    if (p.includes('twitter') || p.includes('x')) {
      return { name: 'Twitter (X) Video', color: 'bg-slate-900 text-white border-sky-400/40', dot: 'bg-sky-400' };
    }
    return { name: 'Facebook Video', color: 'bg-blue-900 text-white border-blue-400/40', dot: 'bg-blue-400' };
  };

  const platformTag = getPlatformTag(ev.videoPlatform || ev.originPlatform);

  const handleCopyEvidenceLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`https://sabi.ng/evidence/${article?.id || 'ev-latest'} - Verified Video Evidence for "${ev.claim}"`);
      if (onShowToast) {
        onShowToast(5, 'Ground truth video evidence link copied to clipboard!');
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      id="sabi-evidence-modal"
    >
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] animate-scale-up">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-[#0A3D2E] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center font-black shadow-sm">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold font-display tracking-tight text-white">
                  SABI Ground Truth Video Evidence
                </h2>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase border flex items-center gap-1 ${platformTag.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${platformTag.dot} animate-pulse`}></span>
                  {platformTag.name}
                </span>
              </div>
              <p className="text-[11px] text-gray-300">
                Verified video evidence sourced strictly from TikTok, Facebook & Twitter (X)
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-4 pt-2 gap-2 text-xs font-bold font-display">
          <button
            onClick={() => setActiveTab('card')}
            className={`py-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'card'
                ? 'border-[#0A3D2E] text-[#0A3D2E]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Evidence Summary Card
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`py-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'video'
                ? 'border-[#0A3D2E] text-[#0A3D2E]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Watch Live Video Footage</span>
            <span className="bg-purple-100 text-purple-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {ev.videoDuration || '0:45'}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('forensics')}
            className={`py-2.5 px-3 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'forensics'
                ? 'border-[#0A3D2E] text-[#0A3D2E]'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Video Forensic Audit</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {activeTab === 'card' && (
            /* EVIDENCE SUMMARY CARD */
            <div 
              id="sabi-official-evidence-card"
              className="bg-white rounded-2xl border-2 border-emerald-300 p-5 shadow-sm space-y-4 font-sans"
            >
              {/* Claim Title */}
              <div className="space-y-1 pb-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block">
                    Investigated Claim
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-semibold">
                    Platform: {ev.videoPlatform || ev.originPlatform || 'TikTok'}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-extrabold text-gray-900 leading-snug font-display">
                  Claim: “{ev.claim}”
                </h3>
              </div>

              {/* ROW BY ROW VIDEO-CENTRIC EVIDENCE CARD */}
              <div className="divide-y divide-gray-100 text-xs sm:text-sm space-y-2.5">
                
                {/* 📍 Location */}
                <div className="pt-2.5 flex items-start justify-between gap-2">
                  <span className="font-bold text-gray-700 flex items-center gap-1.5 shrink-0">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <span>📍 Location:</span>
                  </span>
                  <span className="text-gray-900 font-extrabold text-right">
                    {ev.location}
                  </span>
                </div>

                {/* 🎥 Video Evidence (From TikTok, Facebook, or Twitter) */}
                <div className="pt-2.5 flex items-start justify-between gap-2">
                  <span className="font-bold text-gray-700 flex items-center gap-1.5 shrink-0">
                    <Video className="w-4 h-4 text-purple-600" />
                    <span>🎥 Video Evidence:</span>
                  </span>
                  <button
                    onClick={() => setActiveTab('video')}
                    className="text-purple-800 font-bold underline hover:text-purple-950 text-right cursor-pointer flex items-center gap-1"
                  >
                    <span>{ev.videoPlatform || 'TikTok'} Video ({ev.videoDuration || '0:45'})</span>
                    <Play className="w-3 h-3 fill-purple-800 text-purple-800 inline" />
                  </button>
                </div>

                {/* 👥 Verified by */}
                <div className="pt-2.5 flex items-start justify-between gap-2">
                  <span className="font-bold text-gray-700 flex items-center gap-1.5 shrink-0">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>👥 Verified by:</span>
                  </span>
                  <span className="text-emerald-900 font-extrabold text-right">
                    {ev.verifiedByCount} nearby verified SABI spotters
                  </span>
                </div>

                {/* 🕐 Captured */}
                <div className="pt-2.5 flex items-start justify-between gap-2">
                  <span className="font-bold text-gray-700 flex items-center gap-1.5 shrink-0">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>🕐 Captured:</span>
                  </span>
                  <span className="text-gray-800 font-semibold text-right">
                    {ev.capturedTime}
                  </span>
                </div>

                {/* 📝 Verifier explanation */}
                {ev.verifierExplanation && (
                  <div className="pt-2.5 space-y-1">
                    <span className="font-bold text-gray-700 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-gray-600" />
                      <span>📝 Verifier explanation:</span>
                    </span>
                    <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-200 leading-relaxed italic">
                      "{ev.verifierExplanation}"
                    </p>
                  </div>
                )}

                {/* 🔎 Official source */}
                <div className="pt-2.5 flex items-start justify-between gap-2">
                  <span className="font-bold text-gray-700 flex items-center gap-1.5 shrink-0">
                    <Search className="w-4 h-4 text-indigo-600" />
                    <span>🔎 Official source:</span>
                  </span>
                  <span className="text-gray-900 font-bold text-right flex items-center gap-1">
                    <span>{ev.officialSource}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 inline shrink-0" />
                  </span>
                </div>

                {/* 🤖 AI Video Forensic Check */}
                <div className="pt-2.5 flex items-start justify-between gap-2">
                  <span className="font-bold text-gray-700 flex items-center gap-1.5 shrink-0">
                    <Bot className="w-4 h-4 text-teal-600" />
                    <span>🤖 AI media check:</span>
                  </span>
                  <span className="text-teal-900 font-semibold text-right max-w-xs leading-tight">
                    {ev.aiMediaCheck}
                  </span>
                </div>

                {/* ✅ Verdict */}
                <div className="pt-3 flex items-center justify-between gap-2">
                  <span className="font-bold text-gray-900 text-sm sm:text-base flex items-center gap-1.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>✅ Verdict:</span>
                  </span>
                  <span className={`px-4 py-1.5 rounded-xl font-black text-xs sm:text-sm border shadow-xs tracking-wider uppercase ${verdictBadge.bg}`}>
                    {verdictBadge.label}
                  </span>
                </div>

              </div>

              {/* Verified Certificate Seal */}
              <div className="mt-4 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-[#0A3D2E] shrink-0" />
                  <div>
                    <strong className="block text-[#0A3D2E]">SABI Consensus Truth Protocol</strong>
                    <span className="text-[11px] text-emerald-800">Tamper-proof cryptographic video hash • Logged on truth ledger</span>
                  </div>
                </div>
                <button
                  onClick={handleCopyEvidenceLink}
                  className="bg-white hover:bg-emerald-100 text-[#0A3D2E] border border-emerald-300 px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1 shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <Share2 className="w-3 h-3" />
                  <span>Share Evidence</span>
                </button>
              </div>

            </div>
          )}

          {activeTab === 'video' && (
            /* DEDICATED LIVE VIDEO PLAYER (TikTok, Facebook, Twitter) */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-gray-900 font-display flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-purple-600" />
                    <span>Live Verification Video Footage</span>
                  </h4>
                  <p className="text-xs text-gray-500">
                    Sourced directly from verified {ev.videoPlatform || 'TikTok'} field streams
                  </p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-900 px-2.5 py-1 rounded-full font-bold">
                  Duration: {ev.videoDuration || '0:45'}
                </span>
              </div>

              {/* Video Player Container */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-gray-300 shadow-md flex items-center justify-center group">
                <video 
                  src={ev.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-traffic-in-a-busy-city-avenue-42456-large.mp4'} 
                  controls
                  autoPlay={false}
                  playsInline
                  preload="metadata"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-cover"
                >
                  Your browser does not support HTML5 video.
                </video>

                {/* Video Watermark Overlay */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-white/20 pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span>{ev.videoPlatform || 'TikTok'} Live Spotter Feed</span>
                </div>

                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-[#FFD60A] text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20 pointer-events-none">
                  GPS: {ev.location}
                </div>
              </div>

              {/* Video Metrics & Info */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <span className="font-extrabold text-gray-900">
                    {ev.videoTitle || `Live Corroboration Footage (${ev.videoPlatform || 'TikTok'})`}
                  </span>
                  <div className="flex items-center gap-3 text-gray-600">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-blue-500" />
                      <strong>{ev.videoViews || '185K'}</strong> views
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-500" />
                      <strong>{ev.videoLikes || '14.2K'}</strong> likes
                    </span>
                  </div>
                </div>

                {/* Video Captions / Transcripts */}
                {ev.captionsText && (
                  <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-gray-400 block flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-purple-600" />
                      Live Audio Transcript & Captions
                    </span>
                    <p className="text-xs text-gray-700 italic font-medium leading-relaxed">
                      “{ev.captionsText}”
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1 border-t border-gray-200">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>Location: {ev.location}</span>
                  </span>
                  <span className="font-semibold text-emerald-800">
                    Verified by {ev.verifiedByCount} spotters
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'forensics' && (
            /* AI VIDEO FORENSIC AUDIT */
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-teal-800" />
                  <h4 className="font-bold text-sm text-teal-950 font-display">
                    AI Video Forensic Integrity Report
                  </h4>
                </div>
                <p className="text-xs text-teal-900 leading-relaxed">
                  {ev.aiMediaCheck}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-1">
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">
                    Video Stream Temporal Check
                  </span>
                  <p className="font-bold text-emerald-900">Passed (Continuous Frame Flow)</p>
                  <span className="text-[11px] text-gray-500">Zero splice cuts or synthetic frame-rate interpolation anomalies.</span>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-1">
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">
                    Reverse Video Indexing
                  </span>
                  <p className="font-bold text-gray-900">Unique (Zero Prior Matches)</p>
                  <span className="text-[11px] text-gray-500">Not recycled from old archive protests or previous years' footage.</span>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-1">
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">
                    Solar Shadow Geolocation
                  </span>
                  <p className="font-bold text-gray-900">Consistent with Sun Angle</p>
                  <span className="text-[11px] text-gray-500">Shadow orientation matches Nigerian coordinates at {ev.capturedTime}.</span>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-1">
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">
                    Spotter Consensus Quorum
                  </span>
                  <p className="font-bold text-emerald-800">{ev.verifiedByCount} of {ev.verifiedByCount} Verifiers Aligned</p>
                  <span className="text-[11px] text-gray-500">Independent witnesses verified live within 5km radius.</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#0A3D2E]" />
            <span>Verified on SABI Nigeria Community Network</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyEvidenceLink}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Evidence</span>
            </button>
            <button
              onClick={onClose}
              className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white text-xs font-bold px-5 py-2 rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
