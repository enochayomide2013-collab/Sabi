import React, { useState, useMemo } from 'react';
import {
  Store,
  MapPin,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Navigation,
  ShieldCheck,
  Star,
  DollarSign,
  Award,
  ChevronRight,
  Info,
  Heart,
  Share2,
  Flame,
  ArrowRight,
  ShoppingBag,
  SlidersHorizontal,
  Compass,
  Zap,
  Filter,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import { SmartMarket, SmartMarketDeal, MarketItem } from '../../types';
import { storageService } from '../../services/storageService';

interface SmartMarketFinderProps {
  onSelectItemForSpotter?: (itemId: string) => void;
  onOpenBasketComparator?: () => void;
}

export const SmartMarketFinder: React.FC<SmartMarketFinderProps> = ({
  onSelectItemForSpotter,
  onOpenBasketComparator
}) => {
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'savings' | 'quality' | 'distance' | 'rating'>('savings');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeMarketModal, setActiveMarketModal] = useState<SmartMarket | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => storageService.getFavoriteMarkets());
  const [activeTab, setActiveTab] = useState<'markets' | 'item-matrix' | 'ai-advisor'>('markets');
  const [advisorQuestion, setAdvisorQuestion] = useState<string>('');
  const [advisorAnswer, setAdvisorAnswer] = useState<string | null>(null);
  const [isAdvisorLoading, setIsAdvisorLoading] = useState<boolean>(false);

  const allMarkets = useMemo(() => storageService.getSmartMarkets(), []);
  const marketItems = useMemo(() => storageService.getMarketItems(), []);
  const userLocation = storageService.getLocation();

  // List of distinct states in the dataset
  const statesList = useMemo(() => {
    const states = Array.from(new Set(allMarkets.map(m => m.state)));
    return ['All', ...states];
  }, [allMarkets]);

  const categories = [
    { id: 'All', label: 'All Staples' },
    { id: 'Vegetables', label: 'Fresh Produce' },
    { id: 'Grains', label: 'Grains & Rice' },
    { id: 'Tubers', label: 'Tubers & Roots' },
    { id: 'Oils & Spices', label: 'Oils & Spices' },
    { id: 'Proteins', label: 'Seafood & Fish' }
  ];

  // Filtered & Sorted Markets
  const filteredMarkets = useMemo(() => {
    return allMarkets.filter(market => {
      // State filter
      if (selectedState !== 'All' && market.state !== selectedState) {
        return false;
      }

      // Search query filter (market name, area, specialties, deals)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = market.name.toLowerCase().includes(q);
        const matchesArea = market.area.toLowerCase().includes(q);
        const matchesSpecialty = market.specialties.some(s => s.toLowerCase().includes(q));
        const matchesDeal = market.topDeals.some(d => d.itemName.toLowerCase().includes(q));
        if (!matchesName && !matchesArea && !matchesSpecialty && !matchesDeal) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'All') {
        const hasCategory = market.topDeals.some(d => d.category === selectedCategory);
        if (!hasCategory) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'savings') return b.averageSavingsVsRetail - a.averageSavingsVsRetail;
      if (sortBy === 'quality') return b.qualityRatingScore - a.qualityRatingScore;
      if (sortBy === 'distance') return (a.distanceKm || 99) - (b.distanceKm || 99);
      return b.rating - a.rating;
    });
  }, [allMarkets, selectedState, searchQuery, selectedCategory, sortBy]);

  // Item Search Analysis (if user searched for an item)
  const itemMatchResult = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return storageService.findBestMarketsForItem(searchQuery, selectedState !== 'All' ? selectedState : undefined);
  }, [searchQuery, selectedState]);

  const toggleFavorite = (marketId: string) => {
    storageService.toggleFavoriteMarket(marketId);
    setFavoriteIds(storageService.getFavoriteMarkets());
  };

  const handleAskAdvisor = (query?: string) => {
    const q = query || advisorQuestion;
    if (!q.trim()) return;

    setIsAdvisorLoading(true);
    setAdvisorAnswer(null);

    setTimeout(() => {
      const lower = q.toLowerCase();
      let response = '';

      if (lower.includes('tomato') || lower.includes('pepper') || lower.includes('stew')) {
        response = `💡 **Best Value Recommendation for Fresh Tomatoes & Pepper:**
- **#1 Top Budget Hub:** **Bodija Market (Ibadan)** if you are in Oyo/Southwest, offering large rafia baskets at **₦28,000** (a massive 41.7% discount vs retail).
- **#2 Lagos Wholesale Champion:** **Mile 12 International Market (Gate 2 trailer park)** with fresh Kano/Jos baskets at **₦55,000** (saving ~₦21,000 per basket vs neighborhood supermarkets).
- 🕒 **Best Buying Window:** Arrive between **5:30 AM and 8:30 AM** on Tuesdays or Fridays right when the northern articulated trucks offload.`;
      } else if (lower.includes('rice') || lower.includes('grain') || lower.includes('50kg')) {
        response = `💡 **Best Value Recommendation for Rice & Grains:**
- **#1 Local Milled Pure Rice:** **Abakaliki Rice Mill Market** (Ebonyi) at **₦84,000** per 50kg de-stoned bag.
- **#2 Foreign Parboiled Rice (Lagos/West):** **Daleko & Idumota Grains Hub** at **₦102,000** per 50kg Royal Stallion / Mama Gold (saving ~₦20,000 vs retail).
- **#3 Northern Grains (Abuja/Kano):** **Dawanau Grain Market (Kano)** at **₦88,000** or **Dei-Dei Gate 3 (Abuja)** at **₦92,000**.
- 💡 **Spotter Tip:** Always inspect the factory stitching and watermark hologram to guarantee genuine mill bag weight.`;
      } else if (lower.includes('oil') || lower.includes('palm oil')) {
        response = `💡 **Best Value Recommendation for Pure Red Palm Oil:**
- **#1 Niger Delta Grade A Oil:** **Oil Mill Market (Port Harcourt)** on Wednesdays at **₦40,000** per 25L yellow keg.
- **#2 Southeast Nsukka Origin:** **Onitsha Ose Okwodu River Waterfront** at **₦38,000** per 25L keg with zero water dilution.
- **#3 Lagos Hub:** **Mushin Olosha Market** or **Oyingbo Ground Floor Sheds** at **₦42,000** per 25L keg.`;
      } else if (lower.includes('garri') || lower.includes('cassava') || lower.includes('eba')) {
        response = `💡 **Best Value Recommendation for Garri:**
- **#1 Crisp Ijebu Garri:** **Oyingbo Modern Market** (Lagos) or **Sagamu/Itoku Market** (Ogun) at **₦42,000** per 50kg bag (₦3,400 per 4L paint bucket).
- **#2 Yellow Delta Garri:** **New Benin Market** (Edo) at **₦38,000** per 50kg bag.`;
      } else {
        response = `💡 **SABI Smart Market Intelligence:**
Based on live price spotter tracking across 10 Nigerian wholesale agricultural hubs:
- **Mile 12 & Bodija** offer the highest savings (28%–41%) for fresh perishable produce (tomatoes, peppers, onions, yams).
- **Daleko & Dawanau** provide the lowest verified prices for grains and bulk bags (rice, beans, maize, sugar).
- **Oyingbo & Oil Mill Market** dominate for seafood, crayfish, and genuine unadulterated red palm oil.
- 💡 **General Rule:** Shopping directly at primary wholesale trailer depots before 9:00 AM saves average households **₦14,000 to ₦35,000** on monthly food expenses.`;
      }

      setAdvisorAnswer(response);
      setIsAdvisorLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-6" id="smart-market-finder-root">
      
      {/* 1. Header & Location Intelligence Banner */}
      <div className="bg-gradient-to-br from-[#0A3D2E] via-[#0d4f3b] to-[#135d46] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-[#FFD60A]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#FFD60A] border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SABI Smart Market Finder • AI Value & Quality Engine</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-400/30 text-emerald-200 flex items-center gap-1.5 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#FFD60A]" />
                <span>10 Verified Wholesale Depots</span>
              </span>
            </div>
          </div>

          <div className="max-w-2xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Find the Best Quality & Cheapest Food Markets
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Locate authentic wholesale farm depots, offloading trailer bays, and certified grain exchanges. Save up to <strong className="text-[#FFD60A]">40% on your weekly food budget</strong> with live spotter intelligence.
            </p>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">Avg. Household Savings</span>
              <span className="text-lg font-black text-white">28% – 42%</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">Current User Region</span>
              <span className="text-sm font-bold text-[#FFD60A] truncate block">{userLocation.area}, {userLocation.state}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">Quality Benchmark</span>
              <span className="text-lg font-black text-white">Grade A+ Direct</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">Price Verification</span>
              <span className="text-sm font-bold text-white flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Live Spotter Sync</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search, Quick Filters & State Selector */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Main Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by food item (e.g. Tomatoes, Rice 50kg, Beans, Yam, Garri, Palm Oil) or Market Name..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D2E] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* State Filter Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                aria-label="Filter markets by state"
                className="appearance-none bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 pr-8 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0A3D2E] cursor-pointer"
              >
                {statesList.map(st => (
                  <option key={st} value={st}>
                    {st === 'All' ? '📍 All States' : `📍 ${st}`}
                  </option>
                ))}
              </select>
              <MapPin className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Filter Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort markets by priority"
                className="appearance-none bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 pr-8 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0A3D2E] cursor-pointer"
              >
                <option value="savings">💰 Highest Savings</option>
                <option value="quality">🌿 Best Freshness & Quality</option>
                <option value="distance">📍 Closest to Me</option>
                <option value="rating">⭐ Highest Community Rating</option>
              </select>
              <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Category Filter Pills & Quick Staples */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-gray-400 font-bold text-[11px] shrink-0 uppercase tracking-wider">Categories:</span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#0A3D2E] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Quick Food Search Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
          <span className="text-gray-400 font-bold shrink-0">Popular:</span>
          {['Tomatoes', 'Parboiled Rice 50kg', 'Honey Beans', 'Ijebu Garri', 'Benue Yam', 'Palm Oil 25L', 'Smoked Fish', 'Plantains'].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSearchQuery(item)}
              className="bg-emerald-50 hover:bg-emerald-100 text-[#0A3D2E] px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap border border-emerald-200/60 transition-colors"
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('markets')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === 'markets'
                ? 'bg-[#0A3D2E] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Recommended Markets ({filteredMarkets.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('item-matrix')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === 'item-matrix'
                ? 'bg-[#0A3D2E] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Staples Price Comparison Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ai-advisor')}
            className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === 'ai-advisor'
                ? 'bg-[#0A3D2E] text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFD60A]" />
            <span>AI Market Advisor</span>
          </button>
        </div>

        {onOpenBasketComparator && (
          <button
            type="button"
            onClick={onOpenBasketComparator}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#0A3D2E] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Open Sabi Basket Saver</span>
          </button>
        )}
      </div>

      {/* 4. Tab 1: Recommended Markets Grid */}
      {activeTab === 'markets' && (
        <div className="space-y-6">
          
          {/* If there is an item search, show the Top Picks Summary Header */}
          {itemMatchResult && itemMatchResult.allMatches.length > 0 && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#0A3D2E] text-[#FFD60A] flex items-center justify-center font-bold">
                    ⚡
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-gray-900">
                      Smart Results for &ldquo;{searchQuery}&rdquo;
                    </h3>
                    <p className="text-[11px] text-gray-600">
                      Ranked by verified spotter prices & historical wholesale trends.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#0A3D2E] bg-white px-3 py-1 rounded-xl border border-emerald-200">
                  {itemMatchResult.allMatches.length} Markets Found
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {itemMatchResult.allMatches.slice(0, 3).map((match, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-3.5 border border-emerald-100 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        {idx === 0 ? '🏆 Lowest Price Pick' : idx === 1 ? '🌿 Top Freshness Pick' : '📦 Wholesale Hub'}
                      </span>
                      <span className="text-[11px] font-mono font-black text-emerald-700">
                        Save {match.deal.savingsPercent}%
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{match.market.name}</h4>
                      <p className="text-[10px] text-gray-500">{match.market.area}, {match.market.state}</p>
                    </div>

                    <div className="flex items-baseline justify-between border-t border-gray-100 pt-2">
                      <div>
                        <span className="text-xs text-gray-400 block text-[10px]">Spotter Price</span>
                        <span className="text-sm font-black text-[#0A3D2E] font-mono">
                          ₦{match.deal.currentPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block text-[10px]">vs Retail</span>
                        <span className="text-xs font-semibold text-gray-500 line-through font-mono">
                          ₦{match.deal.averageRegionalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveMarketModal(match.market)}
                      className="w-full mt-1 bg-gray-50 hover:bg-[#0A3D2E] hover:text-white text-gray-700 text-[11px] font-bold py-1.5 rounded-xl transition-all flex items-center justify-center gap-1"
                    >
                      <span>Inspect Market & Deals</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Grid of Markets */}
          {filteredMarkets.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 space-y-3">
              <Store className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No Markets Match Your Current Filters</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Try resetting your search query or selecting &ldquo;All States&rdquo; to view wholesale hubs across Nigeria.
              </p>
              <button
                type="button"
                onClick={() => { setSelectedState('All'); setSelectedCategory('All'); setSearchQuery(''); }}
                className="bg-[#0A3D2E] text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMarkets.map((market) => {
                const isFav = favoriteIds.includes(market.id);

                return (
                  <div
                    key={market.id}
                    className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Market Image & Badges */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                        <img
                          src={market.imageUrl}
                          alt={market.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-white/20">
                            {market.marketType}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(market.id);
                            }}
                            className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                              isFav
                                ? 'bg-red-500 text-white border-red-500 scale-110'
                                : 'bg-black/50 text-white border-white/30 hover:bg-black/70'
                            }`}
                            aria-label="Bookmark Market"
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        {/* Bottom Tagline & State */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mb-0.5">
                            <MapPin className="w-3.5 h-3.5 text-[#FFD60A]" />
                            <span>{market.area}, {market.state}</span>
                          </div>
                          <h3 className="text-base font-extrabold font-display leading-tight truncate">
                            {market.name}
                          </h3>
                        </div>
                      </div>

                      {/* Content Body */}
                      <div className="p-5 space-y-4">
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {market.description}
                        </p>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-2 bg-emerald-50/60 p-2.5 rounded-2xl border border-emerald-100/80 text-center">
                          <div>
                            <span className="text-[9px] font-bold text-gray-500 block uppercase">Avg. Savings</span>
                            <span className="text-xs font-black text-emerald-800">
                              ~{market.averageSavingsVsRetail}%
                            </span>
                          </div>
                          <div className="border-x border-emerald-200/60">
                            <span className="text-[9px] font-bold text-gray-500 block uppercase">Freshness</span>
                            <span className="text-xs font-black text-[#0A3D2E]">
                              {market.qualityRatingScore}% Grade
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-gray-500 block uppercase">Rating</span>
                            <span className="text-xs font-black text-amber-600 flex items-center justify-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span>{market.rating}</span>
                            </span>
                          </div>
                        </div>

                        {/* Specialties Tags */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Best Things To Buy Here:</span>
                          <div className="flex flex-wrap gap-1">
                            {market.specialties.map((spec, i) => (
                              <span
                                key={i}
                                className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg"
                              >
                                {spec}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Top Deal Teaser */}
                        {market.topDeals.length > 0 && (
                          <div className="border-t border-gray-100 pt-3 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-extrabold text-gray-900 flex items-center gap-1">
                                <Flame className="w-3 h-3 text-red-500" />
                                <span>Top Verified Deal:</span>
                              </span>
                              <span className="font-mono text-emerald-700 font-bold">
                                Save ₦{market.topDeals[0].savingsAmount.toLocaleString()}
                              </span>
                            </div>
                            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-gray-800 block truncate max-w-[180px]">
                                  {market.topDeals[0].itemName}
                                </span>
                                <span className="text-[10px] text-gray-500">
                                  {market.topDeals[0].unitName}
                                </span>
                              </div>
                              <span className="font-mono font-black text-[#0A3D2E]">
                                ₦{market.topDeals[0].currentPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="p-5 pt-0">
                      <button
                        type="button"
                        onClick={() => setActiveMarketModal(market)}
                        className="w-full bg-[#0A3D2E] hover:bg-[#0c4b38] text-white py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-98"
                      >
                        <span>View All Deals & Directions</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Tab 2: Staples Price Comparison Matrix */}
      {activeTab === 'item-matrix' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Cross-Market Staples Price Matrix
              </h3>
              <p className="text-xs text-gray-500">
                Side-by-side comparison of wholesale unit prices across primary Nigerian regional markets.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#0A3D2E] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              Updated Live from Spotter Feeds
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-gray-200 text-gray-500 font-extrabold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-3">Market & Location</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Avg. Savings</th>
                  <th className="py-3 px-3">Quality Score</th>
                  <th className="py-3 px-3">Top Commodity & Price</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allMarkets.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-gray-900">{m.name}</div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        <span>{m.area}, {m.state}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px] font-bold">
                        {m.marketType}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-extrabold text-emerald-700">
                      +{m.averageSavingsVsRetail}% vs Retail
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-gray-900">{m.qualityRatingScore}%</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      {m.topDeals[0] ? (
                        <div>
                          <span className="font-semibold text-gray-800">{m.topDeals[0].itemName}</span>
                          <span className="text-[10px] font-mono font-bold text-[#0A3D2E] block">
                            ₦{m.topDeals[0].currentPrice.toLocaleString()} ({m.topDeals[0].unitName})
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveMarketModal(m)}
                        className="bg-emerald-50 hover:bg-[#0A3D2E] hover:text-white text-[#0A3D2E] px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Tab 3: AI Market Advisor */}
      {activeTab === 'ai-advisor' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#0A3D2E] text-[#FFD60A] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                SABI Market Intelligence Advisor
              </h3>
              <p className="text-xs text-gray-500">
                Ask where to get the cheapest ingredients, best shopping hours, or how to bargain wholesale.
              </p>
            </div>
          </div>

          {/* Preset Questions */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-500">Quick inquiries:</span>
            <div className="flex flex-wrap gap-2">
              {[
                'Where should I buy my weekly stew ingredients (Tomatoes & Tatashe)?',
                'Where can I buy a 50kg bag of foreign and local rice at factory price?',
                'Which market has the best unadulterated pure red palm oil?',
                'Where to get the cheapest Ijebu Garri in Lagos/Ogun?'
              ].map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setAdvisorQuestion(preset);
                    handleAskAdvisor(preset);
                  }}
                  className="text-xs bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-[#0A3D2E] border border-gray-200 rounded-xl px-3 py-1.5 font-medium transition-all text-left"
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Ask Box */}
          <div className="flex gap-2">
            <input
              type="text"
              value={advisorQuestion}
              onChange={(e) => setAdvisorQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAdvisor()}
              placeholder="e.g. Which market in Lagos is best for bulk catfish and plantains?"
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D2E]"
            />
            <button
              type="button"
              onClick={() => handleAskAdvisor()}
              disabled={isAdvisorLoading || !advisorQuestion.trim()}
              className="bg-[#0A3D2E] hover:bg-[#0c4b38] disabled:opacity-50 text-white px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              {isAdvisorLoading ? 'Analyzing...' : 'Ask Advisor'}
            </button>
          </div>

          {/* Response Box */}
          {advisorAnswer && (
            <div className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#0A3D2E]">
                <Sparkles className="w-4 h-4 text-[#FFD60A]" />
                <span>Advisor Recommendation:</span>
              </div>
              <div className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-line font-normal">
                {advisorAnswer}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 7. Detailed Market Modal Drawer */}
      {activeMarketModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl p-6 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-emerald-100 text-[#0A3D2E] text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    {activeMarketModal.marketType}
                  </span>
                  <span className="text-xs font-bold text-gray-400">
                    ⭐ {activeMarketModal.rating} ({activeMarketModal.spotterReportsCount} Spotters)
                  </span>
                </div>
                <h2 className="text-xl font-black text-gray-900 font-display">
                  {activeMarketModal.name}
                </h2>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0A3D2E]" />
                  <span>{activeMarketModal.area}, {activeMarketModal.state}</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveMarketModal(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Logistics & Timings Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#0A3D2E]" />
                  <span>Best Visiting Times</span>
                </span>
                <p className="text-xs font-bold text-gray-900">{activeMarketModal.bestDaysToVisit}</p>
                <p className="text-[10px] text-gray-500">Hours: {activeMarketModal.openingHours}</p>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-emerald-600" />
                  <span>Bargaining Power</span>
                </span>
                <p className="text-xs font-bold text-emerald-800">{activeMarketModal.bargainingPower}</p>
                <p className="text-[10px] text-gray-500">Avg Savings vs Retail: ~{activeMarketModal.averageSavingsVsRetail}%</p>
              </div>
            </div>

            {/* Top Verified Deals */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-red-500" />
                <span>Verified Wholesale Commodity Deals ({activeMarketModal.topDeals.length})</span>
              </h3>

              <div className="space-y-2.5">
                {activeMarketModal.topDeals.map((deal, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border border-gray-200 bg-white hover:border-emerald-300 transition-all space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <span className="text-xs font-extrabold text-gray-900 block">{deal.itemName}</span>
                        <span className="text-[10px] text-gray-500 font-medium">{deal.unitName} • {deal.qualityGrade}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black font-mono text-[#0A3D2E] block">
                          ₦{deal.currentPrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          Save {deal.savingsPercent}% (₦{deal.savingsAmount.toLocaleString()})
                        </span>
                      </div>
                    </div>

                    {deal.bargainTip && (
                      <div className="bg-emerald-50/50 p-2 rounded-xl text-[11px] text-gray-700 border border-emerald-100 flex items-start gap-1.5">
                        <Info className="w-3.5 h-3.5 text-[#0A3D2E] shrink-0 mt-0.5" />
                        <span><strong>Bargain Tip:</strong> {deal.bargainTip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Directions & Logistics Guide */}
            <div className="space-y-2 bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
              <h4 className="text-xs font-extrabold text-[#0A3D2E] uppercase flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-[#0A3D2E]" />
                <span>Directions & Gate Access</span>
              </h4>
              <p className="text-xs text-gray-700 leading-relaxed">
                {activeMarketModal.directionsGuide}
              </p>
              <p className="text-[11px] text-gray-500 italic mt-1">
                🛡️ <strong>Sabier Safety Tip:</strong> {activeMarketModal.safetyAndLogisticsTip}
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => toggleFavorite(activeMarketModal.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  favoriteIds.includes(activeMarketModal.id)
                    ? 'bg-red-50 text-red-600 border border-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${favoriteIds.includes(activeMarketModal.id) ? 'fill-current' : ''}`} />
                <span>{favoriteIds.includes(activeMarketModal.id) ? 'Saved to Favorites' : 'Add to Favorites'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMarketModal(null)}
                className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white px-5 py-2.5 rounded-2xl text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
