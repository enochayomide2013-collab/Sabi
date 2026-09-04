import React, { useState, useEffect } from 'react';
import { 
  Newspaper, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  ShieldCheck, 
  TrendingUp, 
  Share2, 
  Bot, 
  MapPin, 
  RefreshCw, 
  Globe, 
  Video, 
  Filter, 
  Eye, 
  Heart, 
  MessageSquare, 
  Flame,
  Play,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { NewsArticle, SocialTrend } from '../../types';
import { SOCIAL_TRENDS_DATA } from '../../data/mockData';
import { NewsAnchorSimulation } from './NewsAnchorSimulation';
import { SabiEvidenceModal } from '../evidence/SabiEvidenceModal';

interface LatestNewsSectionProps {
  onShowToast?: (points: number, message: string) => void;
}

const NIGERIAN_STATES = [
  'All',
  'Rivers',
  'Lagos',
  'Abuja (FCT)',
  'Kano',
  'Oyo',
  'Anambra',
  'Enugu',
  'Kaduna',
  'Benue',
  'Worldwide'
];

const PLATFORMS = [
  { id: 'all', label: 'All Feeds', icon: '🌐' },
  { id: 'youtube', label: 'YouTube', icon: '▶️', color: 'hover:border-red-400' },
  { id: 'tiktok', label: 'TikTok', icon: '🎵', color: 'hover:border-pink-500' },
  { id: 'twitter', label: 'Twitter (X)', icon: '🐦', color: 'hover:border-sky-400' },
  { id: 'instagram', label: 'Instagram', icon: '📸', color: 'hover:border-purple-400' }
];

export const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({ onShowToast }) => {
  const [news, setNews] = useState<NewsArticle[]>(storageService.getNewsArticles());
  const [trends, setTrends] = useState<SocialTrend[]>(SOCIAL_TRENDS_DATA);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [anchorArticle, setAnchorArticle] = useState<NewsArticle | null>(null);
  const [evidenceArticle, setEvidenceArticle] = useState<NewsArticle | null>(null);
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [activeTrendPlatform, setActiveTrendPlatform] = useState<string>('all');
  const [selectedTrend, setSelectedTrend] = useState<SocialTrend | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setNews(storageService.getNewsArticles());
    });
    
    // Fetch initial fresh trends
    fetchTrends();

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchTrends = async (platform?: string) => {
    try {
      const url = `/api/social-trends${platform && platform !== 'all' ? `?platform=${platform}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTrends(data);
        }
      }
    } catch {
      // Fallback already in initial state
    }
  };

  const handleRefreshNews = async () => {
    setIsRefreshing(true);
    try {
      const updated = await storageService.fetchSocialMediaNews(
        selectedState === 'All' ? 'all' : selectedState,
        selectedPlatform
      );
      setNews(updated);
      await fetchTrends(selectedPlatform);
      if (onShowToast) {
        onShowToast(5, `Refreshed live social feeds & trends across YouTube, TikTok, Twitter & Instagram!`);
      }
    } catch {
      // Fallback already handled
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleShare = (article: NewsArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${article.title} - Verified Video Evidence on SABI Nigeria: https://sabi.ng`);
      if (onShowToast) {
        onShowToast(5, 'News headline & video verification link copied to clipboard!');
      }
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Market Intelligence':
      case 'Market Alerts':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Fact Check Alert':
      case 'Fact Check':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'National Food Security':
      case 'Food Supply':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'SABI Community':
      case 'Economy':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Consumer Rights':
      default:
        return 'bg-rose-100 text-rose-900 border-rose-300';
    }
  };

  const getPlatformBadge = (platform?: string) => {
    switch (platform?.toLowerCase()) {
      case 'youtube':
        return {
          label: 'YouTube Feed',
          style: 'bg-red-50 text-red-700 border-red-200'
        };
      case 'tiktok':
        return {
          label: 'TikTok Viral',
          style: 'bg-black text-white border-pink-500/40'
        };
      case 'twitter':
      case 'twitter (x)':
        return {
          label: 'Twitter (X)',
          style: 'bg-slate-900 text-white border-sky-400/40'
        };
      case 'instagram':
        return {
          label: 'Instagram Reel',
          style: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent'
        };
      case 'facebook':
        return {
          label: 'Facebook Post',
          style: 'bg-blue-50 text-blue-900 border-blue-200'
        };
      default:
        return {
          label: 'SABI Verified',
          style: 'bg-emerald-50 text-[#0A3D2E] border-emerald-200'
        };
    }
  };

  // Filter news based on selected state and platform
  const filteredNews = news.filter(item => {
    const matchesState = 
      selectedState === 'All' ||
      (selectedState === 'Worldwide' && item.isWorldwide) ||
      (item.state && item.state.toLowerCase().includes(selectedState.toLowerCase()));

    const matchesPlatform = 
      selectedPlatform === 'all' ||
      (item.socialPlatform && item.socialPlatform.toLowerCase() === selectedPlatform);

    return matchesState && matchesPlatform;
  });

  const filteredTrends = trends.filter(t => 
    activeTrendPlatform === 'all' || t.platform.toLowerCase() === activeTrendPlatform
  );

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-6" id="latest-news-section">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#0A3D2E] border border-emerald-600 flex items-center justify-center text-[#FFD60A] shrink-0 shadow-xs">
            <Newspaper className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900 font-display">
                Social Media Feeds & Verified Video Evidence
              </h3>
              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                <span>YouTube · TikTok · Twitter · Instagram</span>
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Live rumors, market claims, and trends verified strictly with real on-ground video logs (TikTok, Facebook, Twitter).
            </p>
          </div>
        </div>

        <button
          id="fetch-social-media-news-btn"
          onClick={handleRefreshNews}
          disabled={isRefreshing}
          className="bg-emerald-50 hover:bg-emerald-100 text-[#0A3D2E] border border-emerald-300 px-4 py-2 rounded-xl text-xs font-bold font-display flex items-center gap-2 cursor-pointer self-start sm:self-auto transition-all active:scale-95 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#0A3D2E]' : ''}`} />
          <span>{isRefreshing ? 'Syncing Live Feeds...' : 'Refresh Social Feeds & Trends'}</span>
        </button>
      </div>

      {/* 🚀 LIVE SOCIAL TRENDS BAR (YouTube, TikTok, Twitter, Instagram) */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#0A3D2E] to-slate-900 rounded-2xl p-4 text-white shadow-md border border-emerald-800/40 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center font-black">
              <Flame className="w-4 h-4 fill-[#0A3D2E]" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#FFD60A] block">
                Live Viral Trends Tracker
              </span>
              <span className="text-[11px] text-gray-300">
                Trending topics across YouTube, TikTok, Twitter (X), and Instagram
              </span>
            </div>
          </div>

          {/* Trend Platform Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold">
            {PLATFORMS.map(p => (
              <button
                key={p.id}
                onClick={() => {
                  setActiveTrendPlatform(p.id);
                  fetchTrends(p.id);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  activeTrendPlatform === p.id
                    ? 'bg-[#FFD60A] text-[#0A3D2E] font-black shadow-xs'
                    : 'bg-white/10 text-gray-200 hover:bg-white/20'
                }`}
              >
                <span>{p.icon}</span>
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Scrolling / Interactive Trends Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {filteredTrends.map(trend => (
            <div
              key={trend.id}
              onClick={() => setSelectedTrend(trend)}
              className="bg-white/10 hover:bg-white/15 border border-white/10 hover:border-[#FFD60A]/50 rounded-xl p-3 transition-all cursor-pointer space-y-1.5 group"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="bg-white/20 text-[#FFD60A] px-2 py-0.5 rounded-full font-bold uppercase">
                  {trend.platform}
                </span>
                <span className="text-gray-300 font-semibold">{trend.volume}</span>
              </div>
              <h5 className="text-xs font-bold text-white group-hover:text-[#FFD60A] transition-colors line-clamp-1">
                {trend.hashtag}
              </h5>
              <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed">
                {trend.topic}
              </p>
              <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1 border-t border-white/10">
                <span>📍 {trend.state}</span>
                <span className="text-emerald-400 font-bold">{trend.verifiedStatus}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* State & Social Platform Filter Bar */}
      <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200 space-y-3">
        
        {/* Social Feed Platform Selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold font-display">
          <span className="text-gray-400 uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-[#0A3D2E]" />
            <span>Social Feed:</span>
          </span>
          {PLATFORMS.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPlatform(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedPlatform === p.id
                  ? 'bg-[#0A3D2E] text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span>{p.icon}</span>
              <span>{p.label}</span>
            </button>
          ))}
          <span className="text-[11px] text-gray-500 ml-auto hidden md:inline font-semibold">
            {filteredNews.length} verified social news items
          </span>
        </div>

        {/* State Selection */}
        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none text-xs font-bold font-display pt-2 border-t border-gray-200/70">
          <span className="text-gray-400 uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>State:</span>
          </span>
          {NIGERIAN_STATES.map(state => (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              className={`px-2.5 py-1 rounded-lg text-xs shrink-0 transition-all cursor-pointer ${
                selectedState === state
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              {state === 'Worldwide' ? '🌐 Worldwide' : state}
            </button>
          ))}
        </div>

      </div>

      {/* News Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredNews.map((item) => {
          const platformBadge = getPlatformBadge(item.socialPlatform);

          return (
            <div
              key={item.id}
              onClick={() => setSelectedArticle(item)}
              className="group bg-gray-50 hover:bg-emerald-50/40 rounded-2xl p-4 sm:p-5 border border-gray-200 hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getCategoryBadge(item.category)}`}>
                      {item.category}
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase ${platformBadge.style}`}>
                      {platformBadge.label}
                    </span>
                    {item.state && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 flex items-center gap-0.5">
                        <MapPin className="w-2.5 h-2.5 text-rose-500" />
                        <span>{item.state}</span>
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                    <Clock className="w-3 h-3" />
                    <span>{item.publishedTime || item.publishedAt}</span>
                  </div>
                </div>

                <h4 className="font-extrabold text-gray-900 text-sm sm:text-base group-hover:text-[#0A3D2E] transition-colors leading-snug font-display">
                  {item.title}
                </h4>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>

                {/* Social engagement metrics if available */}
                {(item.likesCount || item.viewsCount) && (
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 pt-1">
                    {item.viewsCount && (
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-blue-500" />
                        <span>{item.viewsCount} views</span>
                      </span>
                    )}
                    {item.likesCount && (
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-rose-500" />
                        <span>{item.likesCount} likes</span>
                      </span>
                    )}
                    {item.sharesCount && (
                      <span className="flex items-center gap-1">
                        <Share2 className="w-3 h-3 text-emerald-600" />
                        <span>{item.sharesCount} shares</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Action Bar with Pure Video Evidence Button */}
              <div className="pt-2.5 border-t border-gray-200/70 flex items-center justify-between gap-2 text-xs flex-wrap">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0A3D2E]" />
                  <span className="text-[11px] font-semibold text-gray-700 truncate max-w-[130px]">
                    {item.socialHandle || item.source || item.verifiedSource}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* VIDEO EVIDENCE BUTTON */}
                  <button
                    id={`view-evidence-${item.id}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEvidenceArticle(item);
                    }}
                    className="bg-purple-900 hover:bg-purple-950 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs active:scale-95 cursor-pointer font-display tracking-tight"
                    title="Watch Verified Video Evidence (TikTok, Facebook, Twitter)"
                  >
                    <Video className="w-3.5 h-3.5 text-[#FFD60A]" />
                    <span>
                      Video Evidence ({item.evidence?.videoPlatform || (item.socialPlatform === 'twitter' ? 'Twitter' : 'TikTok')})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleShare(item, e)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white transition-colors"
                    title="Share Article"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAnchorArticle(item);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-[#0A3D2E] font-bold text-[10px] px-2.5 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                    title="Watch AI News Anchor"
                  >
                    <Bot className="w-3 h-3 text-[#0A3D2E]" />
                    <span className="hidden sm:inline">Anchor</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNews.length === 0 && (
        <div className="p-8 bg-gray-50 rounded-2xl border border-gray-200 text-center space-y-2">
          <Newspaper className="w-8 h-8 text-gray-400 mx-auto" />
          <h4 className="font-bold text-sm text-gray-800 font-display">
            No social reports matching {selectedState} on {selectedPlatform}
          </h4>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Click "Refresh Social Feeds & Trends" or reset filters to view updates across Nigeria and worldwide.
          </p>
          <button
            onClick={() => {
              setSelectedState('All');
              setSelectedPlatform('all');
            }}
            className="text-xs font-bold text-[#0A3D2E] hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-200 animate-scale-up max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase ${getCategoryBadge(selectedArticle.category)}`}>
                  {selectedArticle.category}
                </span>
                {selectedArticle.state && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                    📍 {selectedArticle.state}
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 font-display leading-snug">
                {selectedArticle.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-semibold text-gray-800">{selectedArticle.source || selectedArticle.verifiedSource}</span>
                <span>·</span>
                <span>{selectedArticle.publishedTime || selectedArticle.publishedAt}</span>
                <span>·</span>
                <span>{selectedArticle.readTime}</span>
              </div>
            </div>

            {/* Inspect Ground Truth Video Evidence Banner */}
            <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 text-xs text-purple-950 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Video className="w-5 h-5 text-purple-700 shrink-0" />
                <div>
                  <strong className="block text-gray-900">Verified Video Evidence Attached</strong>
                  <span className="text-[11px] text-purple-800">
                    Direct on-ground footage from {selectedArticle.evidence?.videoPlatform || 'TikTok/Twitter'}.
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  const toInspect = selectedArticle;
                  setSelectedArticle(null);
                  setEvidenceArticle(toInspect);
                }}
                className="bg-purple-900 hover:bg-purple-950 text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-xl shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current text-[#FFD60A]" />
                <span>Watch Video</span>
              </button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              <p className="font-medium text-gray-900">
                {selectedArticle.summary}
              </p>
              <p>
                {selectedArticle.content}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={(e) => {
                  handleShare(selectedArticle, e);
                  setSelectedArticle(null);
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Story</span>
              </button>

              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-bold text-xs px-5 py-2 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Trend Detail Modal */}
      {selectedTrend && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-200 animate-scale-up">
            <div className="flex items-center justify-between">
              <span className="bg-[#0A3D2E] text-[#FFD60A] text-xs font-black px-3 py-1 rounded-full uppercase">
                {selectedTrend.platform} Trending Topic
              </span>
              <button
                onClick={() => setSelectedTrend(null)}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-black text-gray-900 font-display">
                {selectedTrend.hashtag}
              </h4>
              <p className="text-xs font-bold text-emerald-800">
                {selectedTrend.topic}
              </p>
            </div>

            <p className="text-xs text-gray-700 bg-gray-50 p-3.5 rounded-xl border border-gray-200 leading-relaxed">
              {selectedTrend.summary}
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-100 p-2.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Total Volume</span>
                <span className="font-black text-gray-900">{selectedTrend.volume}</span>
              </div>
              <div className="bg-gray-100 p-2.5 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-gray-400 block">Status</span>
                <span className="font-black text-emerald-800">{selectedTrend.verifiedStatus}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setSelectedTrend(null)}
                className="bg-[#0A3D2E] text-white font-bold text-xs px-5 py-2 rounded-xl"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI News Anchor Simulation Modal */}
      {anchorArticle && (
        <NewsAnchorSimulation
          isOpen={!!anchorArticle}
          onClose={() => setAnchorArticle(null)}
          article={anchorArticle}
        />
      )}

      {/* SABI Ground Truth Video Evidence Modal */}
      {evidenceArticle && (
        <SabiEvidenceModal
          isOpen={!!evidenceArticle}
          onClose={() => setEvidenceArticle(null)}
          article={evidenceArticle}
          onShowToast={onShowToast}
        />
      )}

    </section>
  );
};
