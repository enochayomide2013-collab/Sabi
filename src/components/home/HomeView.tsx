import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  ShoppingBasket, 
  Utensils, 
  ShieldCheck, 
  Users, 
  MapPin, 
  ArrowRight, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Flame, 
  Sparkles, 
  Search,
  Crown,
  Compass,
  BookOpen,
  ExternalLink,
  Tv,
  BarChart2
} from 'lucide-react';
import { storageService, SelectedLocation } from '../../services/storageService';
import { VerificationTask, TruthResult, MarketItem } from '../../types';
import { GlobalSearch } from './GlobalSearch';
import { SabiImprovementSuggestions } from './SabiImprovementSuggestions';
import { StreakCard } from './StreakCard';
import { LatestNewsSection } from './LatestNewsSection';
import { TrendingNearYou } from './TrendingNearYou';
import { LiveSabiersPreviewCard } from './LiveSabiersPreviewCard';
import { DailySocialRumorsSection } from './DailySocialRumorsSection';
import { HomeProximityAlertBanner } from './HomeProximityAlertBanner';

interface HomeViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onOpenLocationModal?: () => void;
  onShowPointsToast?: (points: number, message: string) => void;
  onlineCount?: number;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  onNavigate, 
  onOpenLocationModal,
  onShowPointsToast = (_points: number, _message: string) => {},
  onlineCount
}) => {
  const [tasks, setTasks] = useState<VerificationTask[]>(storageService.getTasks());
  const [truthResults, setTruthResults] = useState<TruthResult[]>(storageService.getTruthResults());
  const [marketItems, setMarketItems] = useState<MarketItem[]>(storageService.getMarketItems());
  const [location, setLocation] = useState<SelectedLocation>(storageService.getLocation());
  
  // Video player preview states
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  const handleWatchSocialMedia = (e: React.MouseEvent, item: TruthResult) => {
    e.stopPropagation();
    const query = encodeURIComponent(`${item.claim} fact check verification`);
    let targetUrl = item.socialMediaPostUrl;
    if (item.platform === 'youtube') {
      if (item.youtubeVideoId) {
        targetUrl = `https://www.youtube.com/watch?v=${item.youtubeVideoId}`;
      } else {
        targetUrl = `https://www.youtube.com/results?search_query=${query}`;
      }
    } else if (item.platform === 'tiktok') {
      if (!targetUrl || !targetUrl.includes('tiktok.com')) {
        targetUrl = `https://www.tiktok.com/search?q=${encodeURIComponent(item.claim)}`;
      }
    } else if (item.platform === 'twitter') {
      if (!targetUrl || (!targetUrl.includes('twitter.com') && !targetUrl.includes('x.com'))) {
        targetUrl = `https://twitter.com/search?q=${encodeURIComponent(item.claim)}`;
      }
    } else if (item.platform === 'facebook') {
      if (!targetUrl || !targetUrl.includes('facebook.com')) {
        targetUrl = `https://www.facebook.com/search/top?q=${encodeURIComponent(item.claim)}`;
      }
    }

    if (!targetUrl) {
      if (item.youtubeVideoId) {
        targetUrl = `https://www.youtube.com/watch?v=${item.youtubeVideoId}`;
      } else {
        targetUrl = `https://www.youtube.com/results?search_query=${query}`;
      }
    }

    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    // Fetch live rumors with graceful fallback
    const fetchLiveRumors = async () => {
      try {
        const response = await fetch('/api/rumors', { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          const liveRumors = await response.json();
          const rumorsArray = Array.isArray(liveRumors) ? liveRumors : [];
          
          if (rumorsArray.length > 0) {
            // Merge and deduplicate
            const local = storageService.getTruthResults();
            const combined = [...local, ...rumorsArray];
            const unique = combined.filter((v, i, a) => a.findIndex(t => t.claim === v.claim) === i);
            setTruthResults(unique);
          }
        }
      } catch {
        // Quietly maintain local offline truth results if network/endpoint is unavailable
        const local = storageService.getTruthResults();
        if (local && local.length > 0) {
          setTruthResults(local);
        }
      }
    };
    fetchLiveRumors();

    const unsubscribe = storageService.subscribe(() => {
      setTasks(storageService.getTasks());
      // Re-fetch live rumors on change too, or just merge local changes?
      // For now, keep it simple.
      const local = storageService.getTruthResults();
      setTruthResults(local);
      setMarketItems(storageService.getMarketItems());
      setLocation(storageService.getLocation());
    });
    return unsubscribe;
  }, []);

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'TRUE':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-700 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" /> TRUE
          </span>
        );
      case 'FALSE':
        return (
          <span className="inline-flex items-center gap-1 bg-red-700 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-sm">
            <XCircle className="w-3.5 h-3.5" /> FALSE
          </span>
        );
      case 'OUTDATED MEDIA':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-600 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-sm">
            <Clock className="w-3.5 h-3.5" /> OUTDATED MEDIA
          </span>
        );
      case 'NEEDS MORE VERIFICATION':
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-700 text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5" /> NEEDS VERIFICATION
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in" id="home-view-main">
      
      {/* Location Banner Quick Bar & Live Active Users */}
      <div className="bg-[#0A3D2E] text-white rounded-2xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs shadow-md border border-[#0A3D2E]">
        <div className="flex flex-wrap items-center gap-2 font-medium min-w-0">
          {/* Live Online Users Count Counter - High Prominence */}
          <button
            onClick={() => onNavigate('sabiers')}
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-xs border border-emerald-500/40 transition-all cursor-pointer group"
            title="Click to view live Sabiers community"
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD60A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFD60A]"></span>
            </span>
            <Users className="w-4 h-4 text-[#FFD60A] shrink-0" />
            <span className="tracking-wide">
              {onlineCount && onlineCount > 0 ? onlineCount.toLocaleString() : '1,428'} SABIERS LIVE
            </span>
          </button>

          <span className="hidden sm:inline text-emerald-300/40">|</span>

          <div className="flex items-center gap-1.5 text-white/90 truncate">
            <MapPin className="w-4 h-4 text-[#FFD60A] shrink-0" />
            <span className="truncate">
              Feed for <strong className="text-white">{location.state}</strong> ({location.area})
            </span>
            {location.street && (
              <span className="inline-flex items-center gap-1 bg-[#FFD60A] text-[#0A3D2E] text-[10px] font-black px-2 py-0.5 rounded-md shadow-2xs shrink-0">
                📍 {location.street}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto sm:ml-0">
          <button
            onClick={() => onNavigate('tutorial')}
            className="text-white font-bold hover:underline flex items-center gap-1 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg border border-white/20 transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FFD60A]" />
            <span>Guide</span>
          </button>
          {onOpenLocationModal && (
            <button
              onClick={onOpenLocationModal}
              className="bg-[#FFD60A] hover:bg-yellow-400 text-[#0A3D2E] font-black px-2.5 py-1 rounded-lg transition-all shadow-2xs"
            >
              Change Location
            </button>
          )}
        </div>
      </div>

      {/* Global Search across Reports, Truths & Market Prices */}
      <GlobalSearch
        tasks={tasks}
        truthResults={truthResults}
        marketItems={marketItems}
        location={location}
        onNavigate={onNavigate}
      />

      {/* PROXIMITY RUMOR ALERT BANNER & STREET VERIFICATION FORM */}
      <HomeProximityAlertBanner
        onNavigate={onNavigate}
        onShowToast={onShowPointsToast}
      />

      {/* LIVE SABIERS ACTIVE SPOTTERS & LIVE NOTIFICATION */}
      <LiveSabiersPreviewCard onNavigate={onNavigate} />

      {/* 14-DAY STREAK TIMER & DAILY REWARD CLAIM CARD */}
      <StreakCard
        onClaimSuccess={(pts, day) => onShowPointsToast(pts, `Claimed Day ${day} Streak Reward (+${pts} PTS)!`)}
        onNavigate={onNavigate}
      />

      {/* DAILY SOCIAL MEDIA RUMORS (TikTok, YouTube, Instagram, Twitter) */}
      <DailySocialRumorsSection
        truthResults={truthResults}
        onNavigate={onNavigate}
        onShowToast={onShowPointsToast}
      />

      {/* HERO CARD (Section 12: See something that does not look correct?) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0A3D2E] via-[#0d4736] to-[#082e22] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#0A3D2E]/40">
        
        {/* Decorative background ambient glows */}
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#FFD60A]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-[#FFD60A]/20 border border-[#FFD60A]/30 text-[#FFD60A] text-xs font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nigeria Community Verification</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight font-display leading-tight">
            See something that does not look correct?
          </h1>

          <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
            Submit suspicious claims, photos, market price rumors, or viral videos to SABI and help verify what is actually happening.
          </p>

          {/* Prominent Primary Action Button */}
          <div className="pt-2">
            <button
              id="home-snap-rumor-btn"
              onClick={() => onNavigate('report')}
              className="w-full sm:w-auto bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-extrabold text-base sm:text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              <div className="w-8 h-8 rounded-xl bg-[#0A3D2E] text-[#FFD60A] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Camera className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="tracking-wide font-display">SNAP A RUMOR</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* LATEST VERIFIED NEWS SECTION */}
      <LatestNewsSection onShowToast={onShowPointsToast} />
      
      {/* TRENDING NEAR YOU */}
      <TrendingNearYou location={location} onNavigate={onNavigate} />

      {/* INTERACTIVE RUMOR MAP & STATS BANNER */}
      <section className="bg-gradient-to-r from-emerald-900 via-[#0A3D2E] to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-800/50 relative overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
          <MapPin className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 space-y-2 max-w-lg">
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-[#FFD60A] text-[#0A3D2E] px-2.5 py-0.5 rounded-full font-display">
              <Compass className="w-3 h-3 text-[#0A3D2E]" />
              <span>National & State Intelligence</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-300">All 36 States + Global</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display text-white">
            Explore Rumor Density & Live Maps
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
            Track viral claims, misinformation density, and spotter verifications across every Nigerian state and diaspora region with D3.js choropleth and ranked analytics.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button
            onClick={() => onNavigate('umap')}
            className="flex-1 lg:flex-none bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-black text-xs sm:text-sm px-5 py-3.5 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-display"
          >
            <Compass className="w-4 h-4" />
            <span>UMap Street Radar →</span>
          </button>

          <button
            onClick={() => onNavigate('stats')}
            className="flex-1 lg:flex-none bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-3.5 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <BarChart2 className="w-4 h-4 text-emerald-400" />
            <span>36 States Stats</span>
          </button>
        </div>
      </section>

      {/* QUICK ACTIONS (Section 13) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Market Price Card */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
              <ShoppingBasket className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base font-display">Market Price</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Check reported prices for food and retail portions in your area.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('market')}
            className="w-full bg-gray-50 hover:bg-[#0A3D2E] text-gray-800 hover:text-white font-bold text-xs py-3 px-4 rounded-xl border border-gray-200 hover:border-[#0A3D2E] transition-all flex items-center justify-center gap-2 group"
          >
            <span>Check Market Price</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Food Recipe Card */}
        <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#0A3D2E] shrink-0">
              <Utensils className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base font-display">Food Recipe</h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Identify ingredients from a photo and generate a simple 3-step recipe.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('recipe')}
            className="w-full bg-gray-50 hover:bg-[#0A3D2E] text-gray-800 hover:text-white font-bold text-xs py-3 px-4 rounded-xl border border-gray-200 hover:border-[#0A3D2E] transition-all flex items-center justify-center gap-2 group"
          >
            <span>Create Recipe</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </section>

      {/* VERIFIED TRUTH FEED / RECENT TRUTHS (Section 15) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-[#0A3D2E]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 font-display">
                Recent Truth Reports
              </h2>
              <p className="text-xs text-gray-500">
                Community-verified facts with photo & video evidence
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('truth-feed')}
            className="text-xs font-bold text-[#0A3D2E] hover:underline flex items-center gap-1"
          >
            <span>See all truths</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Truth Result Cards Horizontal / Grid Carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {truthResults.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('truth-detail', item.id)}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Media Thumbnail Container */}
              <div className="relative aspect-video w-full bg-gray-900 overflow-hidden">
                <img
                  src={item.mediaThumbnailUrl}
                  alt={item.claim}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60" />

                {/* Top Badge: Result */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  {getResultBadge(item.result)}
                  <span className="text-[11px] font-semibold text-white/90 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {item.verifiedAt}
                  </span>
                </div>

                {/* Center Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Overlay on Video Card */}
                <div className="absolute bottom-3 left-3 right-3 space-y-1.5 text-white">
                  <div className="flex items-center gap-1 text-[11px] text-gray-300">
                    <MapPin className="w-3 h-3 text-[#FFD60A]" />
                    <span className="truncate">{item.area}, {item.state}</span>
                  </div>
                  <h4 className="font-bold text-sm leading-snug line-clamp-2 text-white font-display">
                    {item.claim}
                  </h4>
                  <div className="flex items-center justify-between text-[10px] text-gray-300 pt-1 border-t border-white/10">
                    <span>{item.contributorCount} community contributors</span>
                    <span className="text-[#FFD60A] font-semibold">AI analysis completed</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Summary */}
              <div className="p-3.5 space-y-2 bg-gray-50 flex-grow flex flex-col justify-between">
                <p className="text-xs text-gray-600 line-clamp-2 italic">
                  "{item.availableEvidenceQuote}"
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-gray-200 gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleWatchSocialMedia(e, item)}
                    className="text-[11px] font-extrabold text-red-700 hover:text-red-800 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 font-display"
                    title={`Watch original ${item.platform || 'social'} video`}
                  >
                    <Play className="w-2.5 h-2.5 fill-red-600 text-red-600" />
                    <span>Watch {item.platform?.toUpperCase() || 'Social'}</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                  <div className="text-[11px] font-bold text-[#0A3D2E] flex items-center gap-1">
                    <span>Evidence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* SUGGEST WEB IMPROVEMENTS (Dispatches to enochayomide67@gmail.com) */}
      <SabiImprovementSuggestions onShowToast={onShowPointsToast} />

      {/* BECOME A VERIFIER BANNER */}
      <section className="bg-emerald-900 text-white rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1 bg-[#FFD60A] text-[#0A3D2E] font-extrabold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
            Earn Points & Build Trust
          </div>
          <h3 className="text-lg font-bold font-display">Join the SABI Local Verifier Network</h3>
          <p className="text-xs text-emerald-200 max-w-md">
            Help your local community verify on-ground prices, incidents, and rumors. Earn +25 Stat Points for every verified task.
          </p>
        </div>
        <button
          onClick={() => onNavigate('verify')}
          className="bg-white hover:bg-gray-100 text-[#0A3D2E] font-bold text-sm px-6 py-3 rounded-2xl shadow-sm transition-all shrink-0 active:scale-95"
        >
          Check Open Tasks
        </button>
      </section>

    </div>
  );
};
