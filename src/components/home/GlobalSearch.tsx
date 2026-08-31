import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  ArrowRight, 
  ShoppingBasket, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Users, 
  Play, 
  Sparkles,
  Filter,
  PlusCircle,
  Camera
} from 'lucide-react';
import { VerificationTask, TruthResult, MarketItem } from '../../types';
import { SelectedLocation } from '../../services/storageService';

export type SearchCategoryFilter = 'all' | 'truth' | 'tasks' | 'market';

interface GlobalSearchProps {
  tasks: VerificationTask[];
  truthResults: TruthResult[];
  marketItems: MarketItem[];
  location: SelectedLocation;
  onNavigate: (tab: string, extraData?: any) => void;
  onSelectCategory?: (cat: SearchCategoryFilter) => void;
}

const POPULAR_SEARCH_SUGGESTIONS = [
  'Tomatoes',
  'Rice 50kg',
  'Fuel Subsidy',
  'Third Mainland Bridge',
  'Garri',
  'Palm Oil',
  'Onions',
  'Lagos Market'
];

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  tasks,
  truthResults,
  marketItems,
  location,
  onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<SearchCategoryFilter>('all');
  const [filterByLocation, setFilterByLocation] = useState<boolean>(false);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  // Clean, normalized search query
  const query = searchQuery.trim().toLowerCase();

  // Search through Verified Truths
  const matchedTruths = useMemo(() => {
    if (!query) return [];
    return truthResults.filter(item => {
      const textPool = [
        item.claim,
        item.originalClaimQuote,
        item.availableEvidenceQuote,
        item.result,
        item.state,
        item.lga,
        item.area,
        item.aiMediaAnalysis?.details || '',
        ...(item.sources || [])
      ].join(' ').toLowerCase();

      const matchesText = textPool.includes(query);
      if (!matchesText) return false;

      if (filterByLocation) {
        return item.state.toLowerCase() === location.state.toLowerCase();
      }
      return true;
    });
  }, [truthResults, query, filterByLocation, location.state]);

  // Search through Active Reports / Verification Tasks
  const matchedTasks = useMemo(() => {
    if (!query) return [];
    return tasks.filter(task => {
      const responseTexts = task.responses?.map(r => r.comment + ' ' + (r.reportedPriceOrDetail || '')).join(' ') || '';
      const textPool = [
        task.claim,
        task.category,
        task.state,
        task.lga,
        task.area,
        task.landmark || '',
        task.status,
        responseTexts
      ].join(' ').toLowerCase();

      const matchesText = textPool.includes(query);
      if (!matchesText) return false;

      if (filterByLocation) {
        return task.state.toLowerCase() === location.state.toLowerCase();
      }
      return true;
    });
  }, [tasks, query, filterByLocation, location.state]);

  // Search through Market Price Data
  const matchedMarketItems = useMemo(() => {
    if (!query) return [];
    return marketItems.filter(item => {
      const otherLocsText = item.otherLocations?.map(l => `${l.state} ${l.area} ${l.largeUnitName} ${l.smallUnitName}`).join(' ') || '';
      const recipesText = item.relatedRecipes?.join(' ') || '';
      const textPool = [
        item.name,
        item.category,
        item.primaryLocation.state,
        item.primaryLocation.area,
        item.primaryLocation.largeUnitName,
        item.primaryLocation.smallUnitName,
        item.seasonalityNote || '',
        otherLocsText,
        recipesText
      ].join(' ').toLowerCase();

      const matchesText = textPool.includes(query);
      if (!matchesText) return false;

      if (filterByLocation) {
        const matchesPrimary = item.primaryLocation.state.toLowerCase() === location.state.toLowerCase();
        const matchesOther = item.otherLocations?.some(l => l.state.toLowerCase() === location.state.toLowerCase());
        return matchesPrimary || matchesOther;
      }
      return true;
    });
  }, [marketItems, query, filterByLocation, location.state]);

  const totalResultsCount = matchedTruths.length + matchedTasks.length + matchedMarketItems.length;

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleApplySuggestion = (text: string) => {
    setSearchQuery(text);
  };

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'TRUE':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-700 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" /> TRUE
          </span>
        );
      case 'FALSE':
        return (
          <span className="inline-flex items-center gap-1 bg-red-700 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-sm">
            <XCircle className="w-3.5 h-3.5" /> FALSE
          </span>
        );
      case 'OUTDATED MEDIA':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-sm">
            <Clock className="w-3.5 h-3.5" /> OUTDATED MEDIA
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-700 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5" /> NEEDS VERIFICATION
          </span>
        );
    }
  };

  return (
    <div className="space-y-4" id="home-global-search">
      {/* Search Input Box */}
      <div className="relative">
        <div className={`relative flex items-center bg-white rounded-2xl border-2 transition-all duration-200 shadow-sm ${
          isInputFocused ? 'border-[#0A3D2E] ring-4 ring-[#0A3D2E]/10 shadow-md' : 'border-gray-200 hover:border-gray-300'
        }`}>
          <div className="pl-4 pr-2 text-[#0A3D2E]">
            <Search className="w-5 h-5" />
          </div>
          
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder="Search reports, verified truths, or market prices (e.g. Tomatoes, Garri, Fuel)..."
            className="w-full py-3.5 pr-10 text-sm sm:text-base font-medium text-gray-900 placeholder:text-gray-400 bg-transparent focus:outline-none"
          />

          {searchQuery && (
            <button
              id="clear-search-btn"
              onClick={handleClear}
              className="absolute right-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Search Suggestions (shown when empty or focused) */}
        {!searchQuery && (
          <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-xs text-gray-500">
            <span className="font-semibold text-gray-600 shrink-0">Popular:</span>
            {POPULAR_SEARCH_SUGGESTIONS.map((item) => (
              <button
                key={item}
                onClick={() => handleApplySuggestion(item)}
                className="bg-white hover:bg-[#0A3D2E]/5 hover:text-[#0A3D2E] border border-gray-200 hover:border-[#0A3D2E]/30 px-2.5 py-1 rounded-lg text-gray-700 transition-all font-medium text-[11px]"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ACTIVE SEARCH RESULTS VIEW */}
      {query.length > 0 && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-md space-y-5 animate-fade-in" id="search-results-container">
          
          {/* Search Header Bar & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900 font-display flex items-center gap-2">
                <span>Search Results for</span>
                <span className="text-[#0A3D2E] bg-[#0A3D2E]/10 px-2.5 py-0.5 rounded-lg">"{searchQuery}"</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Found {totalResultsCount} matching record{totalResultsCount === 1 ? '' : 's'}
              </p>
            </div>

            {/* Location filter toggle */}
            <div className="flex items-center gap-2">
              <button
                id="toggle-location-filter-btn"
                onClick={() => setFilterByLocation(!filterByLocation)}
                className={`text-xs px-3 py-1.5 rounded-xl font-semibold border flex items-center gap-1.5 transition-all ${
                  filterByLocation 
                    ? 'bg-[#0A3D2E] text-white border-[#0A3D2E]' 
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{filterByLocation ? `Only ${location.state}` : 'All Nigeria'}</span>
              </button>

              <button
                id="reset-search-btn"
                onClick={handleClear}
                className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1"
              >
                Clear Search
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              id="filter-all-tab"
              onClick={() => setActiveCategory('all')}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl shrink-0 transition-all ${
                activeCategory === 'all'
                  ? 'bg-[#0A3D2E] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Results ({totalResultsCount})
            </button>
            <button
              id="filter-market-tab"
              onClick={() => setActiveCategory('market')}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl shrink-0 transition-all flex items-center gap-1.5 ${
                activeCategory === 'market'
                  ? 'bg-[#0A3D2E] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ShoppingBasket className="w-3.5 h-3.5" />
              <span>Market Prices ({matchedMarketItems.length})</span>
            </button>
            <button
              id="filter-truth-tab"
              onClick={() => setActiveCategory('truth')}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl shrink-0 transition-all flex items-center gap-1.5 ${
                activeCategory === 'truth'
                  ? 'bg-[#0A3D2E] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Truths ({matchedTruths.length})</span>
            </button>
            <button
              id="filter-tasks-tab"
              onClick={() => setActiveCategory('tasks')}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl shrink-0 transition-all flex items-center gap-1.5 ${
                activeCategory === 'tasks'
                  ? 'bg-[#0A3D2E] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Active Reports & Tasks ({matchedTasks.length})</span>
            </button>
          </div>

          {/* ZERO RESULTS STATE */}
          {totalResultsCount === 0 && (
            <div className="text-center py-10 px-4 space-y-4 bg-gray-50 rounded-2xl border border-gray-200" id="search-zero-results">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-gray-900 font-display">No matches found for "{searchQuery}"</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  We couldn't find any existing verification tasks, verified truths, or market prices matching this term.
                </p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  id="report-unfound-claim-btn"
                  onClick={() => onNavigate('report')}
                  className="w-full sm:w-auto bg-[#0A3D2E] hover:bg-[#0d4736] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  <Camera className="w-4 h-4 text-[#FFD60A]" />
                  <span>Report this rumor / claim to SABI</span>
                </button>
                <button
                  id="submit-unfound-price-btn"
                  onClick={() => onNavigate('market')}
                  className="w-full sm:w-auto bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 font-bold text-xs px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingBasket className="w-4 h-4 text-[#0A3D2E]" />
                  <span>Log a new market price</span>
                </button>
              </div>
            </div>
          )}

          {/* 1. MATCHED MARKET PRICES */}
          {(activeCategory === 'all' || activeCategory === 'market') && matchedMarketItems.length > 0 && (
            <div className="space-y-3" id="search-market-section">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                    <ShoppingBasket className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-display">
                    Market Prices ({matchedMarketItems.length})
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate('market')}
                  className="text-xs font-bold text-[#0A3D2E] hover:underline"
                >
                  View Market Hub
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {matchedMarketItems.map((item) => {
                  const loc = item.primaryLocation;
                  return (
                    <div
                      key={item.id}
                      id={`search-item-${item.id}`}
                      onClick={() => onNavigate('market', { itemId: item.id })}
                      className="bg-white rounded-2xl p-3.5 border border-gray-200 hover:border-[#0A3D2E] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-14 h-14 rounded-xl object-cover border border-gray-100 shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                              {item.category}
                            </span>
                            <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              loc.priceTrend === 'down' 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : loc.priceTrend === 'up' 
                                ? 'bg-red-50 text-red-700' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {loc.priceTrend === 'down' ? <TrendingDown className="w-3 h-3" /> : loc.priceTrend === 'up' ? <TrendingUp className="w-3 h-3" /> : null}
                              {loc.trendPercent}%
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-gray-900 truncate mt-1 group-hover:text-[#0A3D2E] transition-colors">
                            {item.name}
                          </h4>

                          <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                            <MapPin className="w-3 h-3 text-[#0A3D2E]" />
                            <span className="truncate">{loc.area}, {loc.state}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-xl p-2.5 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">{loc.largeUnitName}:</span>
                          <span className="font-extrabold text-[#0A3D2E]">₦{loc.largeUnitPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-gray-500">{loc.smallUnitName}:</span>
                          <span className="font-bold text-gray-800">₦{loc.smallUnitPrice.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-bold text-[#0A3D2E] pt-1">
                        <span>{item.totalReportsCount} verified reports</span>
                        <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                          Check Trend <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. MATCHED VERIFIED TRUTHS */}
          {(activeCategory === 'all' || activeCategory === 'truth') && matchedTruths.length > 0 && (
            <div className="space-y-3" id="search-truths-section">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-[#0A3D2E] flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-display">
                    Verified Truths ({matchedTruths.length})
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate('truth')}
                  className="text-xs font-bold text-[#0A3D2E] hover:underline"
                >
                  View All Truths
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {matchedTruths.map((truth) => (
                  <div
                    key={truth.id}
                    id={`search-truth-${truth.id}`}
                    onClick={() => onNavigate('truth', { truthId: truth.id })}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#0A3D2E] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col group"
                  >
                    <div className="relative aspect-[16/9] bg-gray-900 overflow-hidden">
                      <img
                        src={truth.videoThumbnail}
                        alt={truth.claim}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        {getResultBadge(truth.result)}
                        <span className="text-[10px] text-white/90 bg-black/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
                          {truth.verifiedAt}
                        </span>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                          <Play className="w-4 h-4 fill-white ml-0.5" />
                        </div>
                      </div>

                      <div className="absolute bottom-2 left-2.5 right-2.5 text-white">
                        <div className="flex items-center gap-1 text-[10px] text-gray-300">
                          <MapPin className="w-3 h-3 text-[#FFD60A]" />
                          <span>{truth.area}, {truth.state}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 space-y-2 flex-1 flex flex-col justify-between bg-gray-50">
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 font-display group-hover:text-[#0A3D2E] transition-colors">
                        {truth.claim}
                      </h4>
                      
                      <p className="text-[11px] text-gray-600 line-clamp-2 italic">
                        "{truth.availableEvidenceQuote}"
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-gray-500 pt-1.5 border-t border-gray-200">
                        <span>{truth.contributorCount} contributors</span>
                        <span className="font-bold text-[#0A3D2E] flex items-center gap-1">
                          Watch Truth Video <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. MATCHED ACTIVE REPORTS & TASKS */}
          {(activeCategory === 'all' || activeCategory === 'tasks') && matchedTasks.length > 0 && (
            <div className="space-y-3" id="search-tasks-section">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider font-display">
                    Active Reports & Verification Tasks ({matchedTasks.length})
                  </h3>
                </div>
                <button
                  onClick={() => onNavigate('verify')}
                  className="text-xs font-bold text-[#0A3D2E] hover:underline"
                >
                  View All Tasks
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {matchedTasks.map((task) => (
                  <div
                    key={task.id}
                    id={`search-task-${task.id}`}
                    onClick={() => onNavigate('verify', { taskId: task.id })}
                    className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-[#0A3D2E] shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                        <MapPin className="w-3 h-3 text-[#0A3D2E]" />
                        {task.area}, {task.state}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping" />
                        {task.status === 'urgent' ? 'URGENT TASK' : 'ACTIVE REPORT'}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-gray-900 line-clamp-2 group-hover:text-[#0A3D2E] transition-colors">
                      {task.claim}
                    </h4>

                    {task.originalEvidence?.length > 0 && (
                      <p className="text-xs text-gray-500 line-clamp-1">
                        Attached Evidence: {task.originalEvidence[0].filename}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                      <span className="flex items-center gap-1 font-medium">
                        <Users className="w-3.5 h-3.5 text-[#0A3D2E]" />
                        {task.currentVerifiersCount}/{task.requiredVerifiers} verifiers
                      </span>
                      <span className="font-bold text-[#0A3D2E] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                        Verify (+{task.pointsReward} pts) <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
