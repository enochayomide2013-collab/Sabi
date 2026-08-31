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
  Compass
} from 'lucide-react';
import { storageService, SelectedLocation } from '../../services/storageService';
import { VerificationTask, TruthResult, MarketItem } from '../../types';
import { GlobalSearch } from './GlobalSearch';
import { StreakCard } from './StreakCard';
import { LatestNewsSection } from './LatestNewsSection';

interface HomeViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onOpenLocationModal?: () => void;
  onShowPointsToast?: (points: number, message: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ 
  onNavigate, 
  onOpenLocationModal,
  onShowPointsToast = (_points: number, _message: string) => {}
}) => {
  const [tasks, setTasks] = useState<VerificationTask[]>(storageService.getTasks());
  const [truthResults, setTruthResults] = useState<TruthResult[]>(storageService.getTruthResults());
  const [marketItems, setMarketItems] = useState<MarketItem[]>(storageService.getMarketItems());
  const [location, setLocation] = useState<SelectedLocation>(storageService.getLocation());
  
  // Video player preview states
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setTasks(storageService.getTasks());
      setTruthResults(storageService.getTruthResults());
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
      
      {/* Location Banner Quick Bar */}
      <div className="bg-[#0A3D2E]/5 border border-[#0A3D2E]/15 rounded-2xl p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[#0A3D2E] font-medium truncate">
          <MapPin className="w-4 h-4 text-[#0A3D2E] shrink-0" />
          <span className="truncate">
            Browsing verification feed for <strong>{location.state}</strong> ({location.area})
          </span>
        </div>
        {onOpenLocationModal && (
          <button
            onClick={onOpenLocationModal}
            className="text-[#0A3D2E] font-bold hover:underline shrink-0 ml-2"
          >
            Change
          </button>
        )}
      </div>

      {/* Global Search across Reports, Truths & Market Prices */}
      <GlobalSearch
        tasks={tasks}
        truthResults={truthResults}
        marketItems={marketItems}
        location={location}
        onNavigate={onNavigate}
      />

      {/* 14-DAY STREAK TIMER & DAILY REWARD CLAIM CARD */}
      <StreakCard
        onClaimSuccess={(pts, day) => onShowPointsToast(pts, `Claimed Day ${day} Streak Reward (+${pts} PTS)!`)}
        onNavigate={onNavigate}
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

      {/* INTERACTIVE RUMOR MAP BANNER */}
      <section className="bg-gradient-to-r from-emerald-900 via-[#0A3D2E] to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-800/50 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-12 translate-y-12">
          <MapPin className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 space-y-2 max-w-lg">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider bg-[#FFD60A] text-[#0A3D2E] px-2.5 py-0.5 rounded-full font-display">
            <Compass className="w-3 h-3 text-[#0A3D2E]" />
            <span>Interactive Map Radar</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display text-white">
            Explore Active Rumor Pins in {location.state}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100/90 font-medium leading-relaxed">
            Pinpoint viral community claims, price alerts, and verified investigations across your region in real time.
          </p>
        </div>
        <button
          onClick={() => onNavigate('map')}
          className="relative z-10 bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 flex items-center gap-2 font-display"
        >
          <MapPin className="w-4 h-4" />
          <span>Open Rumor Map →</span>
        </button>
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
                <div className="text-[11px] font-bold text-[#0A3D2E] flex items-center justify-end gap-1">
                  <span>View Truth Video</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

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
