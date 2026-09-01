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
  ExternalLink,
  Globe,
  Radio,
  Tv,
  Camera
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { TruthResult } from '../../types';
import { ReportContentModal } from '../common/ReportContentModal';
import { DeepfakeScanner } from './DeepfakeScanner';
import { DeepfakeXRay } from './DeepfakeXRay';
import { DirectEvidenceLinksGrid } from './DirectEvidenceLinksGrid';
import { AiService } from '../../services/aiService';

interface TruthViewProps {
  initialTruthId?: string;
  onNavigate: (tab: string, extraData?: any) => void;
}

export const TruthView: React.FC<TruthViewProps> = ({ initialTruthId, onNavigate }) => {
  const [activeMainTab, setActiveMainTab] = useState<'rumors' | 'xray'>('rumors');
  const [truthResults, setTruthResults] = useState<TruthResult[]>(storageService.getTruthResults());
  const [regionFilter, setRegionFilter] = useState<'ALL' | 'NIGERIA' | 'WORLDWIDE'>('ALL');
  const [platformFilter, setPlatformFilter] = useState<'ALL' | 'tiktok' | 'twitter' | 'facebook' | 'youtube' | 'instagram'>('ALL');
  const [isRefreshingRumors, setIsRefreshingRumors] = useState<boolean>(false);

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

  // View mode: 'evidence' vs 'video' vs 'social_clip'
  const [viewMode, setViewMode] = useState<'evidence' | 'video' | 'social_clip'>('evidence');

  // Video playback & 20s timeline chapter state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  const durationSec = 20;
  const progressTimerRef = useRef<any>(null);

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

  const handleWatchSocialMedia = (targetPlatform?: string) => {
    if (!selectedResult) return;
    
    // Check if user specifically requested a platform or if we have a direct debunking video URL
    if (!targetPlatform && selectedResult.debunkVideoUrl) {
      window.open(selectedResult.debunkVideoUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    const platformToUse = targetPlatform || selectedResult.debunkPlatform || selectedResult.platform || 'youtube';
    let targetUrl = '';

    // If platform matches the debunk platform, use debunkVideoUrl
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
    } else if (platformToUse === 'instagram') {
      if (selectedResult.debunkVideoUrl && selectedResult.debunkVideoUrl.includes('instagram.com')) {
        targetUrl = selectedResult.debunkVideoUrl;
      } else if (selectedResult.socialMediaPostUrl && selectedResult.socialMediaPostUrl.includes('instagram.com')) {
        targetUrl = selectedResult.socialMediaPostUrl;
      } else {
        targetUrl = `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(selectedResult.claim + ' fact check')}`;
      }
    }

    if (!targetUrl) {
      targetUrl = selectedResult.debunkVideoUrl || (selectedResult.youtubeVideoId ? `https://www.youtube.com/watch?v=${selectedResult.youtubeVideoId}` : `https://www.youtube.com/results?search_query=${encodeURIComponent(selectedResult.claim + ' debunk')}`);
    }

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const getPlatformBadge = (platform?: string) => {
    switch (platform) {
      case 'tiktok':
        return (
          <span className="inline-flex items-center gap-1 bg-black text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-display">
            <span>🎵</span> TikTok Viral Claim
          </span>
        );
      case 'twitter':
        return (
          <span className="inline-flex items-center gap-1 bg-sky-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-display">
            <span>𝕏</span> Twitter / X Broadcast
          </span>
        );
      case 'instagram':
        return (
          <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-display">
            <span>📸</span> Instagram Reel / Story
          </span>
        );
      case 'facebook':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-700 text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-display">
            <span>📘</span> Facebook Community Post
          </span>
        );
      case 'youtube':
        return (
          <span className="inline-flex items-center gap-1 bg-red-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-display">
            <span>▶️</span> YouTube Video / Short
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-700 text-white px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-display">
            <span>💬</span> Social Media Claim
          </span>
        );
    }
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
            Evidence Report & Social Video Tracker
          </h1>
          <p className="text-xs text-gray-600">
            Debunking viral rumors across TikTok, Twitter (X), Facebook, YouTube & 36 Nigerian States + Worldwide.
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
      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100/90 rounded-2xl border border-gray-200/80">
        <button
          type="button"
          onClick={() => setActiveMainTab('rumors')}
          className={`py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
            activeMainTab === 'rumors'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Tv className="w-4 h-4 text-[#FFD60A]" />
          <span>Rumor & Social Video Hub</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMainTab('xray')}
          className={`py-3 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all ${
            activeMainTab === 'xray'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Camera className="w-4 h-4 text-[#FFD60A]" />
          <span>Deepfake X-Ray Forensics</span>
        </button>
      </div>

      {activeMainTab === 'xray' ? (
        <DeepfakeXRay />
      ) : (
        <>
          {/* Quick Banner to Launch Deepfake X-Ray */}
          <div className="bg-gradient-to-r from-[#0A3D2E] to-[#14533f] text-white p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5 text-[#FFD60A]" />
              </div>
              <div>
                <h4 className="text-xs font-black font-display uppercase tracking-wide">
                  Deepfake X-Ray Media Forensics
                </h4>
                <p className="text-[11px] text-emerald-100">
                  Analyze suspect photos, voice memos, or video screenshots for AI face swaps and clone stamps.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveMainTab('xray')}
              className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] text-xs font-black px-3.5 py-2 rounded-xl shrink-0 shadow-sm transition-all"
            >
              Launch X-Ray
            </button>
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

              {/* Platform Filters */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                <span className="text-[11px] font-bold text-gray-500 mr-1">Source:</span>
                {[
                  { key: 'ALL', label: 'All Platforms' },
                  { key: 'tiktok', label: '🎵 TikTok' },
                  { key: 'youtube', label: '▶️ YouTube' },
                  { key: 'twitter', label: '𝕏 Twitter' },
                  { key: 'instagram', label: '📸 Instagram' },
                  { key: 'facebook', label: '📘 Facebook' }
                ].map(p => (
                  <button
                    key={p.key}
                    onClick={() => setPlatformFilter(p.key as any)}
                    className={`text-[11px] px-2 py-0.5 rounded-lg font-bold shrink-0 transition-all ${
                      platformFilter === p.key
                        ? 'bg-emerald-800 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

            </div>
          </div>
        </>
      )}

      {/* Result Selector Carousel */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {filteredResults.map(tr => (
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

      {/* MODE SWITCHER TAB: EVIDENCE REPORT vs SOCIAL MEDIA CLIP vs TRUTH VIDEO */}
      <div className="bg-gray-200 p-1.5 rounded-2xl flex items-center gap-1">
        <button
          onClick={() => setViewMode('evidence')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'evidence'
              ? 'bg-white text-[#0A3D2E] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4 text-[#0A3D2E]" />
          <span>Evidence Report</span>
        </button>

        <button
          onClick={() => setViewMode('social_clip')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'social_clip'
              ? 'bg-white text-red-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Tv className="w-4 h-4 text-red-600" />
          <span>Social Video Clip</span>
        </button>

        <button
          onClick={() => setViewMode('video')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
            viewMode === 'video'
              ? 'bg-[#0A3D2E] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Video className="w-4 h-4 text-[#FFD60A]" />
          <span>🎥 Truth Video</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. SABI EVIDENCE REPORT VIEW                             */}
      {/* ======================================================== */}
      {viewMode === 'evidence' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xl space-y-6 animate-fade-in" id="sabi-evidence-report-card">
          
          {/* Report Title & Verdict Banner */}
          <div className="border-b pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {getPlatformBadge(selectedResult.platform)}
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Official SABI Audit Trail
                </span>
              </div>
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
              {selectedResult.socialMediaHandle && (
                <div className="text-[11px] text-gray-500 pt-1 font-medium flex items-center gap-1.5">
                  <span>Originating Channel / Handle:</span>
                  <span className="font-bold text-gray-800 bg-gray-200/80 px-2 py-0.5 rounded">
                    {selectedResult.socialMediaHandle}
                  </span>
                </div>
              )}
            </div>

            {/* 2. LOCATION */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-1">
              <span className="text-[11px] font-extrabold uppercase text-gray-500 tracking-wider block font-display">
                📍 LOCATION (Where it was reported)
              </span>
              <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                <MapPin className="w-4 h-4 text-[#0A3D2E]" />
                <span>{selectedResult.area}, {selectedResult.lga}, {selectedResult.state} {selectedResult.country ? `(${selectedResult.country})` : ''}</span>
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
                🔍 MEDIA & SOCIAL FORENSICS (What AI detected)
              </span>
              <p className="text-sm font-semibold text-blue-950 leading-relaxed">
                {selectedResult.aiMediaAnalysis.details}
              </p>
              <div className="text-[11px] font-bold text-blue-800 pt-1">
                AI Confidence Score: {selectedResult.aiMediaAnalysis.confidenceScore}% ({selectedResult.aiMediaAnalysis.status})
                {selectedResult.aiMediaAnalysis.detectedOrigins && (
                  <span className="block mt-0.5 text-blue-900">
                    Origin Footprint: {selectedResult.aiMediaAnalysis.detectedOrigins}
                  </span>
                )}
              </div>
            </div>

            {/* 5. SOURCES & EXTERNAL FACT-CHECK LINKS */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase text-gray-500 tracking-wider block font-display">
                  🔗 SOURCES & ACCREDITED FACT-CHECKERS
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const q = encodeURIComponent(selectedResult.claim);
                    window.open(`https://toolbox.google.com/factcheck/explorer/search/list:recent;query=${q}`, '_blank');
                  }}
                  className="text-[11px] font-bold text-[#0A3D2E] hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Google Fact Check Explorer</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedResult.sources.map((src, idx) => (
                  <span key={idx} className="bg-white text-gray-800 text-xs font-semibold px-3 py-1 rounded-xl border border-gray-200">
                    {src}
                  </span>
                ))}
                {selectedResult.sourceOrg && (
                  <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-3 py-1 rounded-xl border border-emerald-200">
                    Verified by: {selectedResult.sourceOrg}
                  </span>
                )}
                {selectedResult.factCheckUrl && (
                  <a
                    href={selectedResult.factCheckUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#0A3D2E] text-white text-xs font-bold px-3 py-1 rounded-xl hover:bg-[#0c4b38] transition-all flex items-center gap-1"
                  >
                    <span>Read Full Debunk Report</span>
                    <ExternalLink className="w-3 h-3 text-[#FFD60A]" />
                  </a>
                )}
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

            {/* 9. AUTOMATED DIRECT EVIDENCE LINKS GRID (TikTok, YouTube, Twitter/X) */}
            <div className="pt-2">
              <DirectEvidenceLinksGrid 
                truthResult={selectedResult} 
                onRefresh={() => {
                  // Refresh truth list from local or remote
                  setTruthResults(storageService.getTruthResults());
                }}
              />
            </div>

            {/* 10. WATCH SOCIAL MEDIA INVESTIGATION VIDEO */}
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-2xl p-5 text-white border border-gray-700 space-y-3.5 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-white font-display">
                      Watch Social Media Debunk Video
                    </h4>
                    <p className="text-[11px] text-gray-300">
                      Watch how this claim was verified or exposed as {selectedResult.result}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  {getPlatformBadge(selectedResult.platform)}
                </div>
              </div>

              {/* Primary Direct Watch Button */}
              <button
                type="button"
                id="watch-social-media-main-btn"
                onClick={() => handleWatchSocialMedia()}
                className="w-full bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-black text-sm py-3.5 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-display"
              >
                <Play className="w-4 h-4 fill-[#0A3D2E]" />
                <span>Watch on {selectedResult.platform?.toUpperCase() || 'Social Media'} ({selectedResult.result})</span>
                <ExternalLink className="w-4 h-4 stroke-[2.5]" />
              </button>

              {/* Multi-Platform Selectors */}
              <div className="pt-1 border-t border-gray-700/80">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                  Or watch and verify across other platforms:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleWatchSocialMedia('youtube')}
                    className="bg-red-600/20 hover:bg-red-600 text-white border border-red-500/40 hover:border-red-500 text-[11px] font-bold py-2 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-all"
                  >
                    <span>▶️</span>
                    <span>YouTube</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWatchSocialMedia('tiktok')}
                    className="bg-gray-800 hover:bg-black text-white border border-gray-600 hover:border-white text-[11px] font-bold py-2 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-all"
                  >
                    <span>🎵</span>
                    <span>TikTok</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWatchSocialMedia('twitter')}
                    className="bg-sky-900/30 hover:bg-sky-600 text-white border border-sky-500/40 hover:border-sky-500 text-[11px] font-bold py-2 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-all"
                  >
                    <span>𝕏</span>
                    <span>Twitter (X)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleWatchSocialMedia('facebook')}
                    className="bg-blue-900/30 hover:bg-blue-700 text-white border border-blue-500/40 hover:border-blue-500 text-[11px] font-bold py-2 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-all"
                  >
                    <span>📘</span>
                    <span>Facebook</span>
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* TRANSITION BUTTONS */}
          <div className="pt-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-gray-500">
              Generated {selectedResult.verifiedAt} · {selectedResult.viewsCount.toLocaleString()} views
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                id="watch-social-media-tab-btn"
                onClick={() => handleWatchSocialMedia()}
                className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Watch Social Video</span>
                <ExternalLink className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={() => setViewMode('social_clip')}
                className="flex-1 sm:flex-initial bg-gray-100 hover:bg-gray-200 text-gray-900 font-extrabold text-xs px-3.5 py-3 rounded-2xl transition-all flex items-center justify-center gap-1.5"
              >
                <Tv className="w-3.5 h-3.5 text-gray-700" />
                <span>In-App Clip</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('video');
                  setIsPlaying(true);
                }}
                className="flex-1 sm:flex-initial bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 font-display"
              >
                <Film className="w-4 h-4" />
                <span>🎥 20s Truth Video</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 2. 📺 SOCIAL MEDIA SOURCE & VIDEO CLIP VIEW               */}
      {/* ======================================================== */}
      {viewMode === 'social_clip' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xl space-y-6 animate-fade-in" id="social-video-clip-card">
          
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {getPlatformBadge(selectedResult.platform)}
                <span className="text-xs font-bold text-gray-500">
                  {selectedResult.socialMediaHandle || 'Viral Social Post'}
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-gray-900 font-display">
                Originating Social Media Clip & Debunk Video
              </h3>
            </div>
            {getResultBadge(selectedResult.result)}
          </div>

          {/* Video Container */}
          <div className="relative bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 aspect-video max-w-lg mx-auto flex items-center justify-center text-white">
            {selectedResult.youtubeVideoId ? (
              <iframe 
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${selectedResult.youtubeVideoId}?autoplay=0&rel=0`}
                title={selectedResult.claim}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div 
                onClick={() => handleWatchSocialMedia()}
                className="relative w-full h-full cursor-pointer group"
              >
                <img 
                  src={selectedResult.videoThumbnail} 
                  alt={selectedResult.claim} 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-black/50">
                  <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-0.5 text-white" />
                  </div>
                  <span className="text-sm font-extrabold font-display max-w-xs text-white">
                    {selectedResult.claim}
                  </span>
                  <span className="text-xs text-gray-300 flex items-center gap-1">
                    <span>Click to Watch on {selectedResult.platform?.toUpperCase() || 'Social Media'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Social Video Summary & Direct Open Buttons */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-gray-600">Platform Sourced:</span>
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

            {/* Primary Watch Button */}
            <button
              type="button"
              id="watch-social-media-direct-btn"
              onClick={() => handleWatchSocialMedia()}
              className="w-full bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-extrabold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-[#FFD60A] text-[#FFD60A]" />
              <span>Watch Full Video on {selectedResult.platform?.toUpperCase() || 'Social Media'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Multi-Platform Alternative Quick Links */}
            <div className="pt-2 border-t border-gray-200">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Watch on alternative platform:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleWatchSocialMedia('youtube')}
                  className="bg-white hover:bg-red-50 text-gray-800 border border-gray-300 hover:border-red-500 text-[11px] font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  <span>▶️ YouTube</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleWatchSocialMedia('tiktok')}
                  className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 hover:border-black text-[11px] font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  <span>🎵 TikTok</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleWatchSocialMedia('twitter')}
                  className="bg-white hover:bg-sky-50 text-gray-800 border border-gray-300 hover:border-sky-500 text-[11px] font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  <span>𝕏 Twitter</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleWatchSocialMedia('facebook')}
                  className="bg-white hover:bg-blue-50 text-gray-800 border border-gray-300 hover:border-blue-500 text-[11px] font-bold py-2 px-2 rounded-lg flex items-center justify-center gap-1 transition-all"
                >
                  <span>📘 Facebook</span>
                </button>
              </div>
            </div>
          </div>

          {/* Full Evidence Links Grid in Social Clip Mode */}
          <DirectEvidenceLinksGrid 
            truthResult={selectedResult} 
            onRefresh={() => setTruthResults(storageService.getTruthResults())}
          />

          <div className="pt-2 flex items-center justify-between gap-2">
            <button
              onClick={() => {
                setViewMode('video');
                setIsPlaying(true);
              }}
              className="bg-[#FFD60A] text-[#0A3D2E] font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Watch 20s Truth Video</span>
            </button>

            <button
              onClick={() => setViewMode('evidence')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all"
            >
              Back to Evidence Report
            </button>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* 3. 🎥 TRUTH VIDEO ANIMATED PLAYER VIEW                   */}
      {/* ======================================================== */}
      {viewMode === 'video' && (
        <div className="space-y-6 animate-fade-in" id="truth-video-player-container">
          
          <div className="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 relative aspect-[9/13] max-w-sm mx-auto flex flex-col justify-between text-white select-none">
            
            {/* Background Image / Motion Simulation */}
            <div className="absolute inset-0 bg-gray-800">
                <div className="absolute inset-0 bg-[url('/news-studio-bg.jpg')] opacity-20"></div>
                {/* Simulated AI Anchor Persona */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-40 h-40 rounded-full bg-emerald-900 border-4 border-emerald-500 flex items-center justify-center text-6xl shadow-2xl">👨‍💼</div>
                </div>
            </div>

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
                  {chapter.stage}: {chapter.title} ({Math.floor(currentTimeSec)}s / 20s)
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

          {/* Video Control Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-gray-900 hover:bg-black text-white font-bold text-xs px-5 py-3 rounded-2xl transition-all flex items-center gap-2"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isPlaying ? 'Pause Clip' : 'Resume Clip'}</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="bg-[#0A3D2E] hover:bg-[#0d4a38] text-white font-bold text-xs px-5 py-3 rounded-2xl transition-all flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Truth Video</span>
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
