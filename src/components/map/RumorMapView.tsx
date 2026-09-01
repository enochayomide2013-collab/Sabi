import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  Eye,
  Navigation,
  Layers,
  Compass,
  Radio,
  BarChart2,
  Globe2
} from 'lucide-react';
import { storageService, SelectedLocation } from '../../services/storageService';
import { TruthResult } from '../../types';
import { ALL_36_NIGERIAN_STATES } from '../../data/nigerianStatesData';

interface RumorMapViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
}

export const RumorMapView: React.FC<RumorMapViewProps> = ({ onNavigate }) => {
  const [currentLocation, setCurrentLocation] = useState<SelectedLocation>(storageService.getLocation());
  const [truthResults, setTruthResults] = useState<TruthResult[]>(storageService.getTruthResults());
  
  // Filter state
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>(currentLocation.state || 'All');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPin, setSelectedPin] = useState<TruthResult | null>(null);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setCurrentLocation(storageService.getLocation());
      setTruthResults(storageService.getTruthResults());
    });
    return unsubscribe;
  }, []);

  // Filter rumors based on state & status & search
  const filteredRumors = truthResults.filter(tr => {
    const matchesState = selectedStateFilter === 'All' || tr.state.toLowerCase() === selectedStateFilter.toLowerCase();
    const matchesStatus = statusFilter === 'ALL' || tr.result === statusFilter;
    const matchesSearch = tr.claim.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tr.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tr.lga.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesStatus && matchesSearch;
  });

  const availableStates = ['All', ...ALL_36_NIGERIAN_STATES.map(s => s.name)];

  const getStatusBadge = (result: string) => {
    switch (result) {
      case 'TRUE':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">VERIFIED TRUE</span>;
      case 'FALSE':
        return <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">MISLEADING FALSE</span>;
      case 'OUTDATED MEDIA':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">OUTDATED MEDIA</span>;
      default:
        return <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">UNDER REVIEW</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 animate-fade-in" id="rumor-map-view-container">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-[#0A3D2E] via-[#0d4a38] to-[#06261c] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-[#0A3D2E]/40 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
          <Compass className="w-72 h-72 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-[#FFD60A] text-[#0A3D2E] px-3.5 py-1 rounded-full font-display">
                <Radio className="w-3.5 h-3.5 animate-pulse text-[#0A3D2E]" />
                <span>Live Community Radar Map</span>
              </div>
              <button
                onClick={() => onNavigate('stats')}
                className="inline-flex items-center gap-1.5 text-xs font-black bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border border-emerald-700/80 px-3.5 py-1 rounded-full transition-all shadow-sm"
              >
                <BarChart2 className="w-3.5 h-3.5 text-[#FFD60A]" />
                <span>Open D3 36-States Stats Dashboard →</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              Active Rumor Pins Across All 36 States ({selectedStateFilter === 'All' ? 'Nigeria' : selectedStateFilter})
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
              Explore community-reported rumors, viral claims, and local market intelligence pinned live across all 36 Nigerian states and the FCT. Click any pin to inspect the full SABI Evidence Report.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0 space-y-2">
            <div className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">Active Region Pin</div>
            <div className="flex items-center gap-2 text-white font-extrabold text-sm font-display">
              <MapPin className="w-4 h-4 text-[#FFD60A]" />
              <span>{currentLocation.area}, {currentLocation.state}</span>
            </div>
            <button
              onClick={() => setSelectedStateFilter(currentLocation.state)}
              className="w-full bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-extrabold text-xs py-2 px-3 rounded-xl transition-all shadow-sm font-display"
            >
              Center on My Region
            </button>
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH BAR */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-gray-200 space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* State Filter Selector Dropdown & Popular Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-500 shrink-0">State (36 States + FCT):</span>
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0A3D2E]"
            >
              {availableStates.map(st => (
                <option key={st} value={st}>{st === 'All' ? '🇳🇬 All 36 States + FCT' : st}</option>
              ))}
            </select>

            <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {['All', 'Lagos', 'Abuja (FCT)', 'Kano', 'Rivers', 'Oyo', 'Kaduna', 'Enugu', 'Edo', 'Delta'].map(st => (
                <button
                  key={st}
                  onClick={() => setSelectedStateFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all ${
                    selectedStateFilter === st
                      ? 'bg-[#0A3D2E] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0A3D2E]"
            >
              <option value="ALL">All Verdicts</option>
              <option value="TRUE">Verified True</option>
              <option value="FALSE">Misleading False</option>
              <option value="OUTDATED MEDIA">Outdated Media</option>
              <option value="NEEDS MORE VERIFICATION">Under Review</option>
            </select>
          </div>

        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search rumors by keyword, area (e.g. Yaba, Alaba, Lekki, Kano, Port Harcourt)..."
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3D2E]"
          />
        </div>

      </div>

      {/* INTERACTIVE MAP CONTAINER & PIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Visual Radar Map Canvas */}
        <div className="lg:col-span-2 bg-[#06261c] rounded-3xl p-6 shadow-xl border border-emerald-900/50 relative overflow-hidden min-h-[480px] flex flex-col justify-between">
          
          {/* Map Grid Background Pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Top Map Toolbar */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs font-semibold">
              <Layers className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>SABI Nigeria Vector Map · {filteredRumors.length} Active Pins</span>
            </div>

            <span className="text-[11px] font-bold text-emerald-300 animate-pulse">
              ● Live Radar Scanning
            </span>
          </div>

          {/* Map Canvas Center: Interactive Pins */}
          <div className="relative z-10 my-auto py-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {filteredRumors.length === 0 ? (
              <div className="text-center text-emerald-200/80 py-12 space-y-2">
                <MapPin className="w-12 h-12 mx-auto text-emerald-400/50" />
                <p className="font-bold text-sm">No rumors found matching this filter in {selectedStateFilter}.</p>
                <button
                  onClick={() => { setSelectedStateFilter('All'); setStatusFilter('ALL'); setSearchQuery(''); }}
                  className="text-xs text-[#FFD60A] underline font-bold"
                >
                  Reset all map filters
                </button>
              </div>
            ) : (
              filteredRumors.map((rumor, index) => {
                const isSelected = selectedPin?.id === rumor.id;
                return (
                  <div 
                    key={rumor.id}
                    onClick={() => setSelectedPin(rumor)}
                    className={`group relative cursor-pointer transition-all transform hover:scale-110 ${
                      isSelected ? 'scale-110 z-30' : 'z-10'
                    }`}
                  >
                    {/* Pulsing Radar Ring */}
                    <span className="absolute -inset-2 rounded-full bg-emerald-400/20 animate-ping pointer-events-none" />

                    <div className={`p-3 rounded-2xl shadow-xl flex items-center gap-2 border backdrop-blur-md transition-all ${
                      isSelected 
                        ? 'bg-[#FFD60A] text-[#0A3D2E] border-white ring-4 ring-white/30' 
                        : 'bg-black/80 text-white border-white/20 hover:border-[#FFD60A]'
                    }`}>
                      <MapPin className={`w-4 h-4 ${isSelected ? 'text-[#0A3D2E]' : 'text-emerald-400'}`} />
                      <div className="text-left">
                        <div className="text-[10px] font-black uppercase tracking-tight truncate max-w-[120px]">
                          {rumor.area}
                        </div>
                        <div className={`text-[9px] font-bold ${isSelected ? 'text-[#0A3D2E]' : 'text-gray-300'}`}>
                          {rumor.result}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Map Legend */}
          <div className="relative z-10 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-100">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> True</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" /> False</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Under Review</span>
            </div>
            <span className="text-gray-400">Click any pin to inspect evidence report</span>
          </div>

        </div>

        {/* Right 1 Col: Selected Pin Detail Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between space-y-4">
          
          {selectedPin ? (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-md">
                  Selected Rumor Pin
                </span>
                {getStatusBadge(selectedPin.result)}
              </div>

              <div className="space-y-2">
                <h3 className="font-black text-base text-gray-900 font-display">
                  "{selectedPin.claim}"
                </h3>
                
                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-semibold">
                  <MapPin className="w-4 h-4 text-[#0A3D2E]" />
                  <span>{selectedPin.area}, {selectedPin.lga}, {selectedPin.state}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-3.5 border border-gray-200/80 space-y-1.5 text-xs">
                <div className="font-bold text-gray-700">Community Findings:</div>
                <p className="text-gray-600 leading-relaxed">
                  {selectedPin.availableEvidenceQuote}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200 text-emerald-900">
                  <span className="text-[10px] font-bold block text-emerald-700 uppercase">Spotters</span>
                  <span className="font-extrabold text-sm">{selectedPin.contributorCount} Verified</span>
                </div>
                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-amber-900">
                  <span className="text-[10px] font-bold block text-amber-700 uppercase">AI Confidence</span>
                  <span className="font-extrabold text-sm">{selectedPin.aiMediaAnalysis.confidenceScore}%</span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('truth', { truthId: selectedPin.id })}
                className="w-full bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-extrabold text-xs py-3.5 px-4 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-display"
              >
                <span>View Full SABI Evidence Report</span>
                <ChevronRight className="w-4 h-4 text-[#FFD60A]" />
              </button>
            </div>
          ) : (
            <div className="my-auto text-center py-12 space-y-3">
              <Compass className="w-12 h-12 mx-auto text-gray-300 animate-spin-slow" />
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-gray-800 font-display">No Pin Selected</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Click on any interactive radar pin on the map to inspect community findings, AI media analysis, and full evidence reports.
                </p>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 text-center">
            <button
              onClick={() => onNavigate('report')}
              className="text-xs font-extrabold text-[#0A3D2E] hover:underline"
            >
              + Report a new rumor in your area
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
