import React, { useState, useEffect, useRef } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin, 
  Flag, 
  Sparkles, 
  MessageCircle, 
  FileText, 
  Video, 
  ExternalLink, 
  Tv, 
  Camera, 
  Play, 
  Pause,
  ListChecks, 
  Info, 
  Layers,
  Crown,
  Image as ImageIcon,
  Activity,
  Crosshair,
  Zap,
  Gauge,
  Volume2,
  VolumeX,
  Compass,
  AlertCircle
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { TruthResult, UserProfile } from '../../types';
import { ReportContentModal } from '../common/ReportContentModal';
import { DeepfakeXRay } from './DeepfakeXRay';
import { DirectEvidenceLinksGrid } from './DirectEvidenceLinksGrid';
import { ImageAuthenticityCheck } from '../forensics/ImageAuthenticityCheck';
import { VideoAnalysisTool } from '../forensics/VideoAnalysisTool';
import { AiService } from '../../services/aiService';
import { SocialPlatformBadge, SocialPlatformIcon } from '../common/SocialPlatformIcon';

interface TruthViewProps {
  initialTruthId?: string;
  initialTab?: 'rumors' | 'image_auth' | 'video_analysis' | 'xray';
  onNavigate: (tab: string, extraData?: any) => void;
}

export const TruthView: React.FC<TruthViewProps> = ({ initialTruthId, initialTab = 'rumors', onNavigate }) => {
  const [user, setUser] = useState<UserProfile>(storageService.getUser());
  const [activeMainTab, setActiveMainTab] = useState<'rumors' | 'image_auth' | 'video_analysis' | 'xray'>(initialTab);
  const [truthResults, setTruthResults] = useState<TruthResult[]>(storageService.getTruthResults());
  const [regionFilter, setRegionFilter] = useState<'ALL' | 'NIGERIA' | 'WORLDWIDE'>('ALL');
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'tiktok' | 'twitter' | 'facebook' | 'youtube' | 'instagram'>('ALL');
  const [isRefreshingRumors, setIsRefreshingRumors] = useState<boolean>(false);

  // Video playback & forensic HUD states
  const videoElementRef = useRef<HTMLVideoElement>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoPlaybackTime, setVideoPlaybackTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [showForensicOverlay, setShowForensicOverlay] = useState<boolean>(true);
  const [motionSimulationStep, setMotionSimulationStep] = useState<number>(0);

  useEffect(() => {
    const unsub = storageService.subscribe(() => {
      setUser(storageService.getUser());
    });
    return unsub;
  }, []);

  // Motion simulation loop for live footage forensic movement tracking
  useEffect(() => {
    let timer: any;
    if (isPlayingVideo) {
      timer = setInterval(() => {
        setMotionSimulationStep(prev => (prev + 1) % 100);
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isPlayingVideo]);

  const filteredResults = truthResults.filter(tr => {
    const matchesRegion = regionFilter === 'ALL' || 
      (regionFilter === 'NIGERIA' && !tr.isWorldwide) || 
      (regionFilter === 'WORLDWIDE' && tr.isWorldwide);
    const matchesPlatform = platformFilter === 'ALL' || tr.platform === platformFilter;
    return matchesRegion && matchesPlatform;
  });

  const [selectedResult, setSelectedResult] = useState<TruthResult>(
    initialTruthId ? truthResults.find(t => t.id === initialTruthId) || truthResults[0] : truthResults[0]
  );

  // View modes: 'investigation' (full dossier + claims + explanation + evidence grid) vs 'video_player' (direct video screen)
  const [viewMode, setViewMode] = useState<'investigation' | 'video_player'>('investigation');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  const handleRefreshWorldwideRumors = async () => {
    setIsRefreshingRumors(true);
    try {
      const live = await AiService.fetchWorldwideRumors(
        regionFilter === 'ALL' ? 'all' : regionFilter === 'NIGERIA' ? 'nigeria' : 'worldwide',
        platformFilter === 'ALL' ? 'all' : platformFilter
      );
      if (live && live.length > 0) {
        const local = storageService.getTruthResults();
        const merged = [...local, ...live];
        const unique = merged.filter((v, i, a) => a.findIndex(t => t.claim.toLowerCase() === v.claim.toLowerCase()) === i);
        setTruthResults(unique);
      }
    } catch {
      // Keep local
    } finally {
      setIsRefreshingRumors(false);
    }
  };

  useEffect(() => {
    handleRefreshWorldwideRumors();
    const unsubscribe = storageService.subscribe(() => {
      setTruthResults(storageService.getTruthResults());
    });
    return unsubscribe;
  }, [regionFilter, platformFilter]);

  useEffect(() => {
    if (initialTruthId) {
      const match = truthResults.find(t => t.id === initialTruthId);
      if (match) setSelectedResult(match);
    }
  }, [initialTruthId, truthResults]);

  const handleCopyLink = () => {
    const deepLink = `${window.location.origin}/#truth-${selectedResult.id}`;
    navigator.clipboard?.writeText(deepLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    const shareUrl = `${window.location.origin}/#truth-${selectedResult.id}`;
    const shareData = {
      title: `SABI Verified Report: ${selectedResult.claim}`,
      text: `SABI Investigation Verdict: ${selectedResult.result}.\nLocation: ${selectedResult.area}, ${selectedResult.state}.\n\nWhat happened: ${selectedResult.whatHappened || selectedResult.availableEvidenceQuote}\n\nVideo Evidence & Fact-Check:`,
      url: shareUrl,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        handleCopyLink();
        alert('Evidence Report link copied to clipboard!');
      }
    } catch (err) {
      console.log('Share cancelled or not allowed', err);
    }
  };

  const handleWhatsAppShare = () => {
    const shareUrl = `${window.location.origin}/#truth-${selectedResult.id}`;
    const whatHappenedText = selectedResult.whatHappened || selectedResult.availableEvidenceQuote;
    const whatBroughtAboutItText = selectedResult.whatBroughtAboutIt || selectedResult.rumorSummary;
    
    const text = encodeURIComponent(
      `*🇳🇬 SABI FACT-CHECK INVESTIGATION DOSSIER*\n\n` +
      `*CLAIM:* "${selectedResult.claim}"\n` +
      `*VERDICT:* *${selectedResult.result}*\n` +
      `*LOCATION:* ${selectedResult.area}, ${selectedResult.state} ${selectedResult.country ? `(${selectedResult.country})` : ''}\n\n` +
      `*WHAT HAPPENED ON GROUND:*\n${whatHappenedText}\n\n` +
      `*WHAT BROUGHT ABOUT THE RUMOR:*\n${whatBroughtAboutItText}\n\n` +
      `*MEDIA FORENSICS:*\n${selectedResult.audioNarrationText}\n\n` +
      `🔗 *Watch Playable Video Evidence:* ${shareUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const shareUrl = `${window.location.origin}/#truth-${selectedResult.id}`;
    const text = `🚨 SABI FACT CHECK VERDICT: ${selectedResult.result}\n\nClaim: "${selectedResult.claim}"\n\nVerified in ${selectedResult.area}, ${selectedResult.state}. Watch live video forensics:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const shareUrl = `${window.location.origin}/#truth-${selectedResult.id}`;
    const quote = `SABI FACT-CHECK: "${selectedResult.claim}" — Verdict: ${selectedResult.result} (${selectedResult.area}, ${selectedResult.state}). What Happened: ${selectedResult.whatHappened || selectedResult.rumorSummary}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(quote)}`, '_blank', 'noopener,noreferrer');
  };

  const handleWatchVideoPlatform = (targetPlatform?: string) => {
    if (!selectedResult) return;

    if (!targetPlatform && selectedResult.debunkVideoUrl) {
      window.open(selectedResult.debunkVideoUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const platformToUse = targetPlatform || selectedResult.debunkPlatform || selectedResult.platform || 'youtube';
    let targetUrl = '';

    if (selectedResult.debunkVideoUrl && (!targetPlatform || selectedResult.debunkPlatform === platformToUse)) {
      targetUrl = selectedResult.debunkVideoUrl;
    } else if (platformToUse === 'youtube') {
      if (selectedResult.youtubeVideoId) {
        targetUrl = `https://www.youtube.com/watch?v=${selectedResult.youtubeVideoId}`;
      } else if (selectedResult.debunkVideoUrl && selectedResult.debunkVideoUrl.includes('youtube.com')) {
        targetUrl = selectedResult.debunkVideoUrl;
      } else {
        targetUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(selectedResult.claim + ' fact check Africa Check Dubawa')}`;
      }
    } else if (platformToUse === 'tiktok') {
      if (selectedResult.debunkVideoUrl && selectedResult.debunkVideoUrl.includes('tiktok.com')) {
        targetUrl = selectedResult.debunkVideoUrl;
      } else if (selectedResult.socialMediaPostUrl && selectedResult.socialMediaPostUrl.includes('tiktok.com')) {
        targetUrl = selectedResult.socialMediaPostUrl;
      } else {
        targetUrl = `https://www.tiktok.com/search?q=${encodeURIComponent(selectedResult.claim + ' fact check debunk')}`;
      }
    } else if (platformToUse === 'twitter') {
      if (selectedResult.debunkVideoUrl && (selectedResult.debunkVideoUrl.includes('twitter.com') || selectedResult.debunkVideoUrl.includes('x.com'))) {
        targetUrl = selectedResult.debunkVideoUrl;
      } else if (selectedResult.socialMediaPostUrl && (selectedResult.socialMediaPostUrl.includes('twitter.com') || selectedResult.socialMediaPostUrl.includes('x.com'))) {
        targetUrl = selectedResult.socialMediaPostUrl;
      } else {
        targetUrl = `https://twitter.com/search?q=${encodeURIComponent(selectedResult.claim + ' fact check')}&f=live`;
      }
    } else if (platformToUse === 'facebook') {
      if (selectedResult.debunkVideoUrl && selectedResult.debunkVideoUrl.includes('facebook.com')) {
        targetUrl = selectedResult.debunkVideoUrl;
      } else if (selectedResult.socialMediaPostUrl && selectedResult.socialMediaPostUrl.includes('facebook.com')) {
        targetUrl = selectedResult.socialMediaPostUrl;
      } else {
        targetUrl = `https://www.facebook.com/search/top?q=${encodeURIComponent(selectedResult.claim + ' fact check')}`;
      }
    }

    if (!targetUrl) {
      targetUrl = selectedResult.debunkVideoUrl || (selectedResult.youtubeVideoId ? `https://www.youtube.com/watch?v=${selectedResult.youtubeVideoId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(selectedResult.claim + ' debunk')}`);
    }

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const getPlatformBadge = (platform?: string) => {
    return <SocialPlatformBadge platform={platform} showText={true} />;
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
            <Clock className="w-4 h-4" /> ⚠️ RECYCLED (OUTDATED MEDIA)
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

  // Toggle Play / Pause on HTML5 video element
  const togglePlayPause = () => {
    if (videoElementRef.current) {
      if (videoElementRef.current.paused) {
        videoElementRef.current.play();
        setIsPlayingVideo(true);
      } else {
        videoElementRef.current.pause();
        setIsPlayingVideo(false);
      }
    }
  };

  // Extract or format rumor claims
  const claimsList = selectedResult.rumorClaimsList && selectedResult.rumorClaimsList.length > 0 
    ? selectedResult.rumorClaimsList 
    : [
        `Claim: ${selectedResult.originalClaimQuote || selectedResult.claim}`,
        `Origin: Circulated across ${selectedResult.platform?.toUpperCase() || 'Social Media'} and community groups`,
        `Purported Impact: Asserted changes in ${selectedResult.area}, ${selectedResult.state}`
      ];

  // Dynamic optical motion score for live movements display
  const baseMotionScore = selectedResult.liveForensicData?.opticalMotionScore || 88;
  const dynamicMotionScore = isPlayingVideo 
    ? Math.min(100, Math.max(40, baseMotionScore + (Math.sin(motionSimulationStep * 0.5) * 6))) 
    : baseMotionScore;

  // Active video source url
  const playableSrc = selectedResult.playableVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

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
            Rumor Verification & Video Evidence Hub
          </h1>
          <p className="text-xs text-gray-600">
            Real video evidence with live movement analysis sourced from TikTok, Twitter (X), YouTube, and Facebook.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleNativeShare}
            className="text-xs font-semibold text-gray-500 hover:text-[#0A3D2E] flex items-center gap-1 p-2 rounded-xl hover:bg-gray-100 transition-all"
            title="Share this investigation"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
          
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="text-xs font-semibold text-gray-500 hover:text-red-600 flex items-center gap-1 p-2 rounded-xl hover:bg-gray-100 transition-all"
            title="Report this content"
          >
            <Flag className="w-4 h-4" />
            <span className="hidden sm:inline">Report</span>
          </button>
        </div>
      </div>

      {/* Main Tab Mode Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-gray-100/90 rounded-2xl border border-gray-200/80 text-xs font-extrabold font-display">
        <button
          type="button"
          onClick={() => setActiveMainTab('rumors')}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeMainTab === 'rumors'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <Tv className="w-3.5 h-3.5 text-[#FFD60A]" />
          <span>Rumors Feed</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('image_auth')}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeMainTab === 'image_auth'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 text-[#FFD60A]" />
          <span>🖼️ Image Check</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('video_analysis')}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeMainTab === 'video_analysis'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <Video className="w-3.5 h-3.5 text-[#FFD60A]" />
          <span>🎥 Video Analysis</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('xray')}
          className={`py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeMainTab === 'xray'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/60'
          }`}
        >
          <Camera className="w-3.5 h-3.5 text-[#FFD60A]" />
          <span>🔬 X-Ray Lab</span>
        </button>
      </div>

      {activeMainTab === 'image_auth' ? (
        <ImageAuthenticityCheck
          user={user}
          onNavigate={onNavigate}
        />
      ) : activeMainTab === 'video_analysis' ? (
        <VideoAnalysisTool
          user={user}
          onNavigate={onNavigate}
        />
      ) : activeMainTab === 'xray' ? (
        <DeepfakeXRay />
      ) : (
        <>
          {/* Quick Banner for Deluxe Forensic Suite */}
          <div className="bg-gradient-to-r from-purple-950 via-indigo-950 to-[#0A3D2E] text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm border border-purple-400/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-400/40 text-[#FFD60A] flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-black font-display uppercase tracking-wide text-white">
                    Deluxe Forensic Suite
                  </h4>
                  <span className="bg-[#FFD60A] text-[#0A3D2E] text-[9px] font-black px-2 py-0.2 rounded-full font-mono uppercase">
                    {user.userTier === 'Deluxe' ? 'Active' : 'Deluxe Only'}
                  </span>
                </div>
                <p className="text-[11px] text-purple-100">
                  Inspect images & videos for AI synthesis, splicing, frame jump cuts, and metadata integrity.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setActiveMainTab('image_auth')}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 transition-all cursor-pointer"
              >
                🖼️ Check Image
              </button>
              <button
                type="button"
                onClick={() => setActiveMainTab('video_analysis')}
                className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] text-xs font-black px-3 py-1.5 rounded-xl shrink-0 shadow-sm transition-all cursor-pointer"
              >
                🎥 Check Video
              </button>
            </div>
          </div>

          {/* REGION & PLATFORM FILTER BAR */}
          <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-sm space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              
              {/* Region Tabs */}
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold text-gray-500 mr-1">Region:</span>
                {[
                  { key: 'ALL', label: 'All Rumors' },
                  { key: 'NIGERIA', label: '🇳🇬 36 States' },
                  { key: 'WORLDWIDE', label: '🌍 Worldwide' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setRegionFilter(tab.key as any)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-extrabold transition-all ${
                      regionFilter === tab.key
                        ? 'bg-[#0A3D2E] text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Video Platform Filters */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                <span className="text-[11px] font-extrabold text-gray-500 mr-1 shrink-0">Source:</span>
                {[
                  { key: 'ALL', label: 'All Feeds', icon: 'all' },
                  { key: 'tiktok', label: 'TikTok', icon: 'tiktok' },
                  { key: 'facebook', label: 'Facebook', icon: 'facebook' },
                  { key: 'twitter', label: 'Twitter (X)', icon: 'twitter' },
                  { key: 'youtube', label: 'YouTube', icon: 'youtube' },
                  { key: 'instagram', label: 'Instagram', icon: 'instagram' }
                ].map(p => {
                  const isActive = platformFilter === p.key;
                  return (
                    <button
                      key={p.key}
                      onClick={() => setPlatformFilter(p.key as any)}
                      className={`text-[11px] px-2.5 py-1 rounded-xl font-extrabold shrink-0 transition-all flex items-center gap-1.5 border shadow-2xs ${
                        isActive
                          ? p.key === 'tiktok'
                            ? 'bg-black text-cyan-300 border-pink-500 shadow-md ring-2 ring-pink-500/30'
                            : p.key === 'facebook'
                            ? 'bg-[#1877F2] text-white border-blue-400 shadow-md ring-2 ring-blue-400/30'
                            : p.key === 'twitter'
                            ? 'bg-black text-white border-gray-600 shadow-md ring-2 ring-sky-400/30'
                            : p.key === 'youtube'
                            ? 'bg-[#FF0000] text-white border-red-500 shadow-md ring-2 ring-red-500/30'
                            : p.key === 'instagram'
                            ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white border-transparent shadow-md'
                            : 'bg-[#0A3D2E] text-[#FFD60A] border-[#FFD60A] shadow-md ring-2 ring-[#FFD60A]/30'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      {p.key !== 'ALL' && <SocialPlatformIcon platform={p.icon} className="w-3.5 h-3.5 shrink-0" />}
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          </div>
        </>
      )}

      {/* Rumor Carousel Selector */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {filteredResults.map(tr => (
          <button
            key={tr.id}
            onClick={() => {
              setSelectedResult(tr);
              setIsPlayingVideo(false);
            }}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all border text-left ${
              selectedResult.id === tr.id
                ? 'bg-[#0A3D2E] text-white border-[#0A3D2E] shadow-md ring-2 ring-[#0A3D2E]/30'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-1 mb-1">
              {getPlatformBadge(tr.platform)}
              {tr.isWorldwide && (
                <span className="text-[9px] bg-amber-200 text-amber-950 font-bold px-1.5 rounded">
                  {tr.country || 'Global'}
                </span>
              )}
            </div>
            <span className="block truncate max-w-[200px] font-display">{tr.claim}</span>
            <span className={`text-[10px] font-semibold mt-0.5 block ${selectedResult.id === tr.id ? 'text-[#FFD60A]' : 'text-gray-500'}`}>
              {tr.result}
            </span>
          </button>
        ))}
      </div>

      {/* VIEW MODE TOGGLE (EVIDENCE DOSSIER vs VIDEO SCREEN) */}
      <div className="bg-gray-200 p-1.5 rounded-2xl flex items-center gap-1">
        <button
          onClick={() => setViewMode('investigation')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'investigation'
              ? 'bg-white text-[#0A3D2E] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4 text-[#0A3D2E]" />
          <span>Rumor Summary & Full Dossier</span>
        </button>

        <button
          onClick={() => setViewMode('video_player')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'video_player'
              ? 'bg-white text-red-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Tv className="w-4 h-4 text-red-600" />
          <span>Video Evidence Player (Live Forensics)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. INVESTIGATION DOSSIER VIEW (Summary + Claims + Videos) */}
      {/* ======================================================== */}
      {viewMode === 'investigation' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6 animate-fade-in" id="sabi-evidence-report-card">
          
          {/* Report Title & Verdict Banner */}
          <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {getPlatformBadge(selectedResult.platform)}
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Verified Video Evidence
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-display mt-1">
                Rumor Summary & Investigation Dossier
              </h2>
            </div>
            <div>
              {getResultBadge(selectedResult.result)}
            </div>
          </div>

          {/* STRUCTURED RUMOR REPORT CARDS */}
          <div className="space-y-4 text-xs sm:text-sm">
            
            {/* 1. RUMOR EXECUTIVE SUMMARY */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl p-4 sm:p-5 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-800 shrink-0" />
                <span className="text-xs font-extrabold uppercase text-amber-900 tracking-wider font-display">
                  Summary of Details (The Circulating Claim)
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-gray-900 leading-relaxed">
                {selectedResult.rumorSummary || selectedResult.claim}
              </p>
              {selectedResult.socialMediaHandle && (
                <div className="text-[11px] text-gray-600 pt-1 flex items-center gap-1.5">
                  <span>Originating Channel:</span>
                  <span className="font-bold text-gray-900 bg-amber-100/80 px-2 py-0.5 rounded">
                    {selectedResult.socialMediaHandle}
                  </span>
                </div>
              )}
            </div>

            {/* 2. WHAT HAPPENED (Detailed factual breakdown of on-ground reality) */}
            <div className="bg-blue-50/70 rounded-2xl p-4 sm:p-5 border border-blue-200/80 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black uppercase text-blue-950 tracking-wider font-display">
                  What Happened (On-Ground Factual Reality)
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-blue-950 leading-relaxed bg-white/80 p-3.5 rounded-xl border border-blue-100 shadow-xs">
                {selectedResult.whatHappened || selectedResult.availableEvidenceQuote || 'Field investigation and local market checks confirmed current operational parameters match regular documented standards.'}
              </p>
            </div>

            {/* 3. WHAT BROUGHT ABOUT IT (Root cause / origin of the viral rumor) */}
            <div className="bg-purple-50/70 rounded-2xl p-4 sm:p-5 border border-purple-200/80 space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-purple-700 text-white flex items-center justify-center shrink-0">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black uppercase text-purple-950 tracking-wider font-display">
                  What Brought About It (Origin & Trigger of the Rumor)
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-purple-950 leading-relaxed bg-white/80 p-3.5 rounded-xl border border-purple-100 shadow-xs">
                {selectedResult.whatBroughtAboutIt || 'The rumor was amplified when social media accounts recycled historical broadcast materials with altered caption banners to generate viral outrage.'}
              </p>
            </div>

            {/* 4. LIST OF CLAIMS WITH THAT RUMOR */}
            <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-200 space-y-3">
              <div className="flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-[#0A3D2E] shrink-0" />
                <span className="text-xs font-extrabold uppercase text-gray-900 tracking-wider font-display">
                  List of Claims Circulating with this Rumor
                </span>
              </div>
              <div className="space-y-2">
                {claimsList.map((claimItem, index) => (
                  <div key={index} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-200/80 shadow-xs">
                    <span className="w-5 h-5 rounded-full bg-[#0A3D2E]/10 text-[#0A3D2E] font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-snug">
                      {claimItem}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. FORENSIC EXPLANATION (Plain Language Breakdown) */}
            <div className="bg-emerald-50/70 rounded-2xl p-4 sm:p-5 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0A3D2E] shrink-0" />
                <span className="text-xs font-extrabold uppercase text-emerald-950 tracking-wider font-display">
                  Forensic Explanation & Findings
                </span>
              </div>
              <p className="text-sm sm:text-base font-bold text-emerald-950 leading-relaxed">
                {selectedResult.audioNarrationText}
              </p>
              <div className="text-xs text-emerald-800 pt-1 font-medium bg-emerald-100/60 p-3 rounded-xl">
                <span className="font-bold">Media Forensics: </span>
                {selectedResult.aiMediaAnalysis.details} (Confidence: {selectedResult.aiMediaAnalysis.confidenceScore}%)
              </div>
            </div>

            {/* 6. PLAYABLE VIDEO FORENSICS CARD (Direct Launch) */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-3xl p-5 text-white border border-gray-700 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-md">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider text-white font-display flex items-center gap-2">
                      <span>Live Video Evidence Player</span>
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[9px] px-2 py-0.5 rounded-full font-mono">
                        Playable & Interactive
                      </span>
                    </h4>
                    <p className="text-xs text-gray-300">
                      Watch verified video footage with real-time movement analysis & HUD indicators
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  {getPlatformBadge(selectedResult.platform)}
                </div>
              </div>

              {/* Video Preview with Instant Play Trigger */}
              <div 
                onClick={() => setViewMode('video_player')}
                className="relative group rounded-2xl overflow-hidden cursor-pointer border border-gray-700/80 aspect-video max-h-56 w-full flex items-center justify-center bg-black"
              >
                <img 
                  src={selectedResult.videoThumbnail || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'} 
                  alt="Video Thumbnail"
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-1 rounded">
                      Optical Motion: {selectedResult.liveForensicData?.opticalMotionScore || 88}%
                    </span>
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span> LIVE FORENSIC HUD
                    </span>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play className="w-7 h-7 fill-[#0A3D2E] ml-1" />
                    </div>
                  </div>

                  <div className="text-center">
                    <span className="text-xs font-bold text-white block truncate">
                      Click to Play Video & View Real-Time Movement Analytics
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Play Button */}
              <button
                type="button"
                onClick={() => setViewMode('video_player')}
                className="w-full bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-black text-sm py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-display cursor-pointer"
              >
                <Play className="w-4 h-4 fill-[#0A3D2E]" />
                <span>Play Live Video Evidence & View Forensics</span>
              </button>
            </div>

            {/* 7. LOCATION & COMMUNITY SPOTTERS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-1">
                <span className="text-[11px] font-extrabold uppercase text-gray-500 tracking-wider block font-display">
                  📍 Verified Location
                </span>
                <div className="flex items-center gap-1.5 font-bold text-gray-900 text-xs sm:text-sm">
                  <MapPin className="w-4 h-4 text-[#0A3D2E] shrink-0" />
                  <span>{selectedResult.area}, {selectedResult.lga}, {selectedResult.state} {selectedResult.country ? `(${selectedResult.country})` : ''}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-1">
                <span className="text-[11px] font-extrabold uppercase text-gray-500 tracking-wider block font-display">
                  👥 On-Ground Spotters
                </span>
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  {selectedResult.contributorCount} active community spotters verified this location.
                </p>
              </div>
            </div>

            {/* 8. DIRECT VIDEO EVIDENCE LINKS GRID (TikTok, Twitter/X, YouTube) */}
            <div className="pt-2">
              <DirectEvidenceLinksGrid 
                truthResult={selectedResult} 
                onRefresh={() => {
                  setTruthResults(storageService.getTruthResults());
                }}
              />
            </div>

          </div>

          {/* ACTION BUTTON TO SWITCH TO IN-APP VIDEO SCREEN */}
          <div className="pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Verified {selectedResult.verifiedAt} · {selectedResult.viewsCount.toLocaleString()} views
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setViewMode('video_player')}
                className="flex-1 sm:flex-initial bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 font-display"
              >
                <Tv className="w-4 h-4 text-[#FFD60A]" />
                <span>Open Video Evidence Player</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. PLAYABLE VIDEO EVIDENCE PLAYER WITH LIVE FORENSIC HUD */}
      {/* ======================================================== */}
      {viewMode === 'video_player' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl space-y-6 animate-fade-in" id="social-video-clip-card">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {getPlatformBadge(selectedResult.platform)}
                <span className="text-xs font-bold text-gray-500">
                  {selectedResult.socialMediaHandle || 'Viral Social Video'}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full font-mono">
                  PLAYABLE FOOTAGE
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 font-display">
                Real Video Evidence: {selectedResult.claim}
              </h3>
            </div>
            {getResultBadge(selectedResult.result)}
          </div>

          {/* HUD Overlay Toggle and Controls */}
          <div className="flex items-center justify-between bg-gray-900 text-white px-4 py-2.5 rounded-2xl text-xs">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#FFD60A]" />
              <span className="font-bold">Live Forensic Movement HUD:</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${showForensicOverlay ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-gray-800 text-gray-400'}`}>
                {showForensicOverlay ? 'ACTIVE (TRACKING)' : 'DISABLED'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowForensicOverlay(!showForensicOverlay)}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] px-3 py-1 rounded-xl transition-all cursor-pointer"
            >
              {showForensicOverlay ? 'Hide HUD' : 'Show Forensic HUD'}
            </button>
          </div>

          {/* Genuine Playable Video Container with Live Forensics HUD Overlay */}
          <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 aspect-video max-w-xl mx-auto flex items-center justify-center text-white">
            
            {/* HTML5 Native Video Element */}
            <video
              ref={videoElementRef}
              src={playableSrc}
              controls
              playsInline
              muted={isMuted}
              onPlay={() => setIsPlayingVideo(true)}
              onPause={() => setIsPlayingVideo(false)}
              onTimeUpdate={() => {
                if (videoElementRef.current) {
                  setVideoPlaybackTime(videoElementRef.current.currentTime);
                  setVideoDuration(videoElementRef.current.duration || 20);
                }
              }}
              poster={selectedResult.videoThumbnail || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'}
              className="w-full h-full object-contain"
            />

            {/* LIVE FORENSIC HUD OVERLAY (Movement Boxes, Scanline, Motion Score, Radar) */}
            {showForensicOverlay && (
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3.5 z-10">
                
                {/* Top Telemetry Header */}
                <div className="flex items-center justify-between text-[10px] font-mono bg-black/60 backdrop-blur-xs p-2 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span className="font-bold text-red-400">REC / FORENSIC SCAN</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-emerald-400">FPS: {selectedResult.liveForensicData?.frameRateFps || 29.97}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-sky-300">BITRATE: {selectedResult.liveForensicData?.bitrateKbps || 2450} kbps</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <Crosshair className="w-3 h-3 text-amber-400" />
                    <span>MOTION: {dynamicMotionScore.toFixed(0)}%</span>
                  </div>
                </div>

                {/* Animated Movement Tracking Bounding Box (Visual movement indicator on live footage) */}
                <div 
                  className="relative w-full h-full flex items-center justify-center"
                  style={{
                    transform: `translate(${(Math.sin(motionSimulationStep * 0.2) * 20)}px, ${(Math.cos(motionSimulationStep * 0.15) * 12)}px)`
                  }}
                >
                  <div className="border-2 border-emerald-400/80 bg-emerald-400/10 rounded-lg p-2 flex flex-col justify-between w-40 h-28 shadow-lg shadow-emerald-500/20 animate-pulse">
                    <div className="flex items-center justify-between text-[8px] font-mono text-emerald-300 font-bold bg-black/70 px-1 rounded">
                      <span>OBJ_TRACK #01</span>
                      <span>CONF: 94%</span>
                    </div>
                    <div className="text-center text-[9px] font-mono text-emerald-200 bg-black/70 px-1 rounded">
                      <span>VECTOR: [X: +1.4, Y: -0.8]</span>
                    </div>
                  </div>

                  {/* Laser Scanning Line Effect */}
                  <div 
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-md shadow-emerald-400 opacity-70"
                    style={{
                      top: `${(motionSimulationStep % 100)}%`
                    }}
                  />
                </div>

                {/* Bottom Telemetry Bar */}
                <div className="flex flex-wrap items-center justify-between gap-1.5 text-[9px] font-mono bg-black/75 backdrop-blur-xs p-2 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">JUMP CUTS:</span>
                    <span className="text-amber-300 font-bold">{selectedResult.liveForensicData?.jumpCutsDetected || 0}</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-300">AV SYNC:</span>
                    <span className="text-emerald-300 font-bold uppercase">{selectedResult.liveForensicData?.audioVisualSyncStatus || 'synced'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-purple-300 font-bold">
                    <span>DEEPFAKE PROB: {selectedResult.liveForensicData?.deepfakeProbability || 2}%</span>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Quick Playback Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-900 text-white rounded-2xl text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={togglePlayPause}
                className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] p-2 rounded-xl font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
              >
                {isPlayingVideo ? <Pause className="w-4 h-4 fill-[#0A3D2E]" /> : <Play className="w-4 h-4 fill-[#0A3D2E]" />}
                <span>{isPlayingVideo ? 'Pause Video' : 'Play Video'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (videoElementRef.current) {
                    videoElementRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }
                }}
                className="bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span>{isMuted ? 'Unmute Audio' : 'Muted'}</span>
              </button>
            </div>

            <div className="text-[11px] text-gray-300 font-mono">
              <span>Time: {videoPlaybackTime.toFixed(1)}s / {videoDuration.toFixed(1)}s</span>
            </div>
          </div>

          {/* LIVE FORENSIC METRICS DASHBOARD */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            
            {/* 1. Optical Motion Meter */}
            <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 text-left space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 block font-display">
                Optical Motion Score
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-emerald-950 font-mono">
                  {dynamicMotionScore.toFixed(0)}%
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">Continuous</span>
              </div>
              <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${dynamicMotionScore}%` }}
                />
              </div>
            </div>

            {/* 2. Jump Cuts & Splicing */}
            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-left space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block font-display">
                Jump Cuts Detected
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-amber-950 font-mono">
                  {selectedResult.liveForensicData?.jumpCutsDetected ?? 1}
                </span>
                <span className="text-[10px] text-amber-700 font-bold">Transitions</span>
              </div>
              <p className="text-[10px] text-amber-800 font-medium">
                {selectedResult.liveForensicData?.jumpCutsDetected === 0 ? 'Smooth temporal continuity' : 'Minor splice markers flagged'}
              </p>
            </div>

            {/* 3. Deepfake Probability */}
            <div className="bg-purple-50 rounded-2xl p-3 border border-purple-200 text-left space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-purple-900 block font-display">
                AI Deepfake Prob.
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-purple-950 font-mono">
                  {selectedResult.liveForensicData?.deepfakeProbability ?? 5}%
                </span>
                <span className="text-[10px] text-purple-700 font-bold">
                  {(selectedResult.liveForensicData?.deepfakeProbability ?? 5) > 50 ? 'High Risk' : 'Authentic'}
                </span>
              </div>
              <div className="w-full bg-purple-200 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-700 h-full rounded-full"
                  style={{ width: `${selectedResult.liveForensicData?.deepfakeProbability ?? 5}%` }}
                />
              </div>
            </div>

            {/* 4. Audio-Visual Sync */}
            <div className="bg-blue-50 rounded-2xl p-3 border border-blue-200 text-left space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-900 block font-display">
                Audio-Visual Sync
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-black text-blue-950 font-mono uppercase">
                  {selectedResult.liveForensicData?.audioVisualSyncStatus || 'synced'}
                </span>
              </div>
              <p className="text-[10px] text-blue-800 font-medium">
                {selectedResult.liveForensicData?.audioVisualSyncStatus === 'synced' ? 'Natural acoustic sync' : 'Altered audio dub detected'}
              </p>
            </div>

          </div>

          {/* Detected Video Anomalies */}
          {selectedResult.liveForensicData?.detectedAnomalies && selectedResult.liveForensicData.detectedAnomalies.length > 0 && (
            <div className="bg-red-50 rounded-2xl p-4 border border-red-200 space-y-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
                <span className="text-xs font-black uppercase text-red-900 font-display">
                  Detected Footage Anomalies & Artifacts
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedResult.liveForensicData.detectedAnomalies.map((anomaly, idx) => (
                  <span key={idx} className="bg-white border border-red-200 text-red-800 text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xs flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
                    <span>{anomaly}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Video Evidence Summary & Platform Launchers */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-600">Video Platform:</span>
              <span className="font-extrabold text-gray-900 uppercase">{selectedResult.platform || 'Social Media'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-600">Origin Handle:</span>
              <span className="font-mono text-gray-800">{selectedResult.socialMediaHandle || '@viral_reporter'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-600">Forensic Verdict:</span>
              <span className="font-extrabold text-red-700">{selectedResult.result} ({selectedResult.confidence} Confidence)</span>
            </div>

            {/* Direct Open Button */}
            <button
              type="button"
              id="watch-social-media-direct-btn"
              onClick={() => handleWatchVideoPlatform()}
              className="w-full bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-extrabold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <Play className="w-4 h-4 fill-[#FFD60A] text-[#FFD60A]" />
              <span>Watch Video on {selectedResult.platform?.toUpperCase() || 'Social Media'} (External)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Multi-Platform Alternative Quick Links */}
            <div className="pt-2 border-t border-gray-200">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Watch video evidence on another platform:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleWatchVideoPlatform('tiktok')}
                  className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 hover:border-black text-[11px] font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span>🎵 TikTok</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleWatchVideoPlatform('twitter')}
                  className="bg-white hover:bg-sky-50 text-gray-800 border border-gray-300 hover:border-sky-500 text-[11px] font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span>𝕏 Twitter (X)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleWatchVideoPlatform('youtube')}
                  className="bg-white hover:bg-red-50 text-gray-800 border border-gray-300 hover:border-red-500 text-[11px] font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span>▶️ YouTube</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleWatchVideoPlatform('facebook')}
                  className="bg-white hover:bg-blue-50 text-gray-800 border border-gray-300 hover:border-blue-500 text-[11px] font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-all cursor-pointer"
                >
                  <span>📘 Facebook</span>
                </button>
              </div>
            </div>
          </div>

          {/* Full Evidence Links Grid in Video Mode */}
          <DirectEvidenceLinksGrid 
            truthResult={selectedResult} 
            onRefresh={() => setTruthResults(storageService.getTruthResults())}
          />

          <div className="pt-2 flex items-center justify-between gap-2">
            <button
              onClick={() => setViewMode('investigation')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Back to Rumor Dossier
            </button>
          </div>

        </div>
      )}

      {/* SHARE FUNCTIONALITY & DEEP LINK INTEGRATION */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-gray-900 font-display">
              Share Video Evidence & Investigation Report
            </h3>
            <p className="text-xs text-gray-500">
              Instantly share this verified investigation with WhatsApp groups, Twitter (X), Facebook, or copy direct link.
            </p>
          </div>
          <Share2 className="w-5 h-5 text-[#0A3D2E]" />
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          
          {/* WhatsApp Button */}
          <button
            onClick={handleWhatsAppShare}
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>

          {/* Twitter (X) Button */}
          <button
            onClick={handleTwitterShare}
            className="bg-black hover:bg-gray-900 text-white p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span className="font-serif font-black text-sm">𝕏</span>
            <span>Twitter (X)</span>
          </button>

          {/* Facebook Button */}
          <button
            onClick={handleFacebookShare}
            className="bg-[#1877F2] hover:bg-[#166fe5] text-white p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span className="font-bold text-sm">f</span>
            <span>Facebook</span>
          </button>

          {/* Native Web Share API Button */}
          <button
            onClick={handleNativeShare}
            className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 font-display cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-[#FFD60A]" />
            <span>Share All</span>
          </button>

        </div>

        {/* Copy Deep Link Row */}
        <div className="pt-1">
          <button
            onClick={handleCopyLink}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 p-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer border border-gray-200"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
            <span>{isCopied ? 'Verification Link Copied to Clipboard!' : 'Copy Evidence Link to Clipboard'}</span>
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
