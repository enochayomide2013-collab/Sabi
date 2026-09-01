import React, { useState } from 'react';
import {
  ALL_36_NIGERIAN_STATES,
  GLOBAL_RUMOR_REGIONS,
  NigerianStateInfo,
  GlobalRegionInfo,
  NIGERIA_ZONES_STATS,
  NIGERIA_NATIONAL_TOTALS
} from '../../data/nigerianStatesData';
import { D3NigeriaChoroplethMap } from './D3NigeriaChoroplethMap';
import { D3RankedBarChart } from './D3RankedBarChart';
import { D3DonutRegionalChart } from './D3DonutRegionalChart';
import { D3TimelineTrendChart } from './D3TimelineTrendChart';
import { D3PlatformViralityBubbleChart } from './D3PlatformViralityBubbleChart';
import {
  BarChart2,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Users,
  Search,
  Globe2,
  TrendingUp,
  Share2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Flame,
  ArrowRight,
  Download,
  Filter,
  X,
  Radio,
  FileSpreadsheet
} from 'lucide-react';

interface RumorStatsDashboardProps {
  onNavigate?: (tab: string, stateCode?: string) => void;
  onVerifyQuery?: (query: string) => void;
}

export const RumorStatsDashboard: React.FC<RumorStatsDashboardProps> = ({
  onNavigate,
  onVerifyQuery
}) => {
  const [activeView, setActiveView] = useState<'map' | 'ranked' | 'zones' | 'trends' | 'table'>('map');
  const [selectedState, setSelectedState] = useState<NigerianStateInfo | null>(ALL_36_NIGERIAN_STATES[0]); // Default Lagos
  const [activeZoneFilter, setActiveZoneFilter] = useState<string>('All Zones');
  const [tableSearch, setTableSearch] = useState('');
  const [tableCategory, setTableCategory] = useState<'all' | 'nigeria' | 'global'>('all');

  // Filtered table rows
  const getTableRows = () => {
    let list: Array<{
      id: string;
      code: string;
      name: string;
      zoneOrRegion: string;
      total: number;
      falseCount: number;
      trueCount: number;
      outdatedCount: number;
      spotters: number;
      topTopic: string;
      isGlobal: boolean;
      stateObj?: NigerianStateInfo;
    }> = [];

    if (tableCategory === 'all' || tableCategory === 'nigeria') {
      ALL_36_NIGERIAN_STATES.forEach(s => {
        list.push({
          id: s.code,
          code: s.code,
          name: s.name,
          zoneOrRegion: s.zone,
          total: s.totalRumorsCount,
          falseCount: s.falseClaimsCount,
          trueCount: s.trueClaimsCount,
          outdatedCount: s.outdatedMediaCount,
          spotters: s.spottersCount,
          topTopic: s.topRumorTopic,
          isGlobal: false,
          stateObj: s
        });
      });
    }

    if (tableCategory === 'all' || tableCategory === 'global') {
      GLOBAL_RUMOR_REGIONS.forEach(g => {
        list.push({
          id: g.id,
          code: g.flag,
          name: g.name,
          zoneOrRegion: g.category,
          total: g.totalRumorsCount,
          falseCount: g.falseClaimsCount,
          trueCount: g.trueClaimsCount,
          outdatedCount: g.outdatedMediaCount,
          spotters: g.spottersCount,
          topTopic: g.topRumorTopic || g.keyTopics?.[0] || g.sampleClaim,
          isGlobal: true
        });
      });
    }

    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      list = list.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.zoneOrRegion.toLowerCase().includes(q) || 
        (item.topTopic && item.topTopic.toLowerCase().includes(q))
      );
    }

    return list;
  };

  const handleInspectState = (state: NigerianStateInfo) => {
    setSelectedState(state);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-16" id="rumor-stats-dashboard-root">
      
      {/* Top Banner / Hero Summary */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#06261c] via-[#0A3D2E] to-[#041a13] text-white p-6 sm:p-8 border border-emerald-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#FFD60A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#FFD60A] text-[#0A3D2E] font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md">
                <BarChart2 className="w-3.5 h-3.5" /> D3.js Statistics Engine
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-emerald-200 font-bold text-xs border border-white/10 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> All 36 States + FCT Active
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('map')}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-xs font-black text-[#FFD60A] flex items-center gap-1.5 transition-all"
              >
                <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" /> Live Radar Map
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('search')}
                className="px-3.5 py-1.5 rounded-xl bg-[#FFD60A] hover:bg-amber-300 text-[#0A3D2E] text-xs font-black flex items-center gap-1.5 transition-all shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" /> AI Rumor Verifier
              </button>
            </div>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white leading-tight">
              National & Global Rumor Misinformation Dashboard
            </h1>
            <p className="text-sm sm:text-base text-emerald-100/90 mt-2 leading-relaxed">
              Comprehensive D3.js analytics monitoring virality, claim verification status, and on-ground spotter density across every Nigerian state and global diaspora community.
            </p>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3">
            <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Total Claims</div>
              <div className="text-2xl font-black font-display text-white mt-0.5">{NIGERIA_NATIONAL_TOTALS.totalRumors}</div>
              <div className="text-[10px] text-emerald-400 font-semibold mt-1">Across 36 States + Global</div>
            </div>

            <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <div className="text-[11px] font-bold text-red-300 uppercase tracking-wider">False Rate</div>
              <div className="text-2xl font-black font-display text-red-400 mt-0.5">{NIGERIA_NATIONAL_TOTALS.falseClaimsPercent}%</div>
              <div className="text-[10px] text-red-200 font-semibold mt-1">{NIGERIA_NATIONAL_TOTALS.falseClaims} debunked claims</div>
            </div>

            <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Active Spotters</div>
              <div className="text-2xl font-black font-display text-[#FFD60A] mt-0.5">{NIGERIA_NATIONAL_TOTALS.spotters}</div>
              <div className="text-[10px] text-emerald-200 font-semibold mt-1">Verified on-ground</div>
            </div>

            <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Outdated Media</div>
              <div className="text-2xl font-black font-display text-amber-300 mt-0.5">{NIGERIA_NATIONAL_TOTALS.outdatedMedia}</div>
              <div className="text-[10px] text-amber-200/80 font-semibold mt-1">Recycled clips</div>
            </div>

            <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">Debunk Speed</div>
              <div className="text-2xl font-black font-display text-emerald-300 mt-0.5">{NIGERIA_NATIONAL_TOTALS.avgDebunkTimeMinutes}m</div>
              <div className="text-[10px] text-emerald-200 font-semibold mt-1">Average turnaround</div>
            </div>

            <div className="bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
              <div className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">State Coverage</div>
              <div className="text-2xl font-black font-display text-cyan-300 mt-0.5">36/36</div>
              <div className="text-[10px] text-cyan-200 font-semibold mt-1">100% Geopolitical FCT</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main View Switcher Navigation */}
      <div className="flex items-center gap-2 bg-white dark:bg-emerald-950/80 p-1.5 rounded-2xl border border-gray-200 dark:border-emerald-800/80 shadow-sm overflow-x-auto scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveView('map')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
            activeView === 'map'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-600 dark:text-emerald-200 hover:bg-gray-100 dark:hover:bg-emerald-900/50'
          }`}
        >
          <MapPin className="w-4 h-4 text-[#FFD60A]" /> 36-State Choropleth Map (D3)
        </button>

        <button
          type="button"
          onClick={() => setActiveView('ranked')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
            activeView === 'ranked'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-600 dark:text-emerald-200 hover:bg-gray-100 dark:hover:bg-emerald-900/50'
          }`}
        >
          <BarChart2 className="w-4 h-4 text-[#FFD60A]" /> Ranked State & Global Chart (D3)
        </button>

        <button
          type="button"
          onClick={() => setActiveView('zones')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
            activeView === 'zones'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-600 dark:text-emerald-200 hover:bg-gray-100 dark:hover:bg-emerald-900/50'
          }`}
        >
          <Globe2 className="w-4 h-4 text-[#FFD60A]" /> 6 Geopolitical Zones Share (D3)
        </button>

        <button
          type="button"
          onClick={() => setActiveView('trends')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
            activeView === 'trends'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-600 dark:text-emerald-200 hover:bg-gray-100 dark:hover:bg-emerald-900/50'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-[#FFD60A]" /> Platform & Timeline Trends (D3)
        </button>

        <button
          type="button"
          onClick={() => setActiveView('table')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
            activeView === 'table'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-600 dark:text-emerald-200 hover:bg-gray-100 dark:hover:bg-emerald-900/50'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4 text-[#FFD60A]" /> All 36 States Matrix Data
        </button>
      </div>

      {/* Main Content Layout with Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left/Main Column: Selected D3 Visualizer */}
        <div className="lg:col-span-8 space-y-6">
          
          {activeView === 'map' && (
            <D3NigeriaChoroplethMap
              selectedState={selectedState}
              onSelectState={handleInspectState}
              activeZoneFilter={activeZoneFilter}
              onZoneFilterChange={setActiveZoneFilter}
            />
          )}

          {activeView === 'ranked' && (
            <D3RankedBarChart
              onSelectState={handleInspectState}
              selectedStateCode={selectedState?.code}
            />
          )}

          {activeView === 'zones' && (
            <div className="space-y-6">
              <D3DonutRegionalChart />
              <D3PlatformViralityBubbleChart />
            </div>
          )}

          {activeView === 'trends' && (
            <div className="space-y-6">
              <D3TimelineTrendChart />
              <D3PlatformViralityBubbleChart />
            </div>
          )}

          {activeView === 'table' && (
            <div className="bg-[#06261c] text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-900/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-800">
                <div>
                  <h3 className="font-black text-lg font-display text-white">
                    All 36 Nigerian States & Global Database
                  </h3>
                  <p className="text-xs text-emerald-200/80">
                    Search, filter, and inspect claim volumes across every jurisdiction.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative w-48">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={tableSearch}
                      onChange={(e) => setTableSearch(e.target.value)}
                      placeholder="Search..."
                      className="w-full bg-emerald-950 border border-emerald-800 text-xs rounded-xl pl-9 pr-3 py-1.5 text-white"
                    />
                  </div>

                  <div className="flex items-center bg-black/40 p-1 rounded-xl text-xs">
                    <button
                      type="button"
                      onClick={() => setTableCategory('all')}
                      className={`px-2.5 py-1 rounded-lg font-bold ${tableCategory === 'all' ? 'bg-[#FFD60A] text-[#0A3D2E]' : 'text-gray-300'}`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setTableCategory('nigeria')}
                      className={`px-2.5 py-1 rounded-lg font-bold ${tableCategory === 'nigeria' ? 'bg-[#FFD60A] text-[#0A3D2E]' : 'text-gray-300'}`}
                    >
                      36 States
                    </button>
                    <button
                      type="button"
                      onClick={() => setTableCategory('global')}
                      className={`px-2.5 py-1 rounded-lg font-bold ${tableCategory === 'global' ? 'bg-[#FFD60A] text-[#0A3D2E]' : 'text-gray-300'}`}
                    >
                      Global
                    </button>
                  </div>
                </div>
              </div>

              {/* Table Container */}
              <div className="overflow-x-auto max-h-[500px] scrollbar-thin">
                <table className="w-full text-left text-xs text-emerald-100">
                  <thead className="bg-emerald-950 text-emerald-300 uppercase text-[10px] font-black sticky top-0">
                    <tr>
                      <th className="p-3">State / Region</th>
                      <th className="p-3">Zone / Category</th>
                      <th className="p-3 text-right">Total</th>
                      <th className="p-3 text-right text-red-300">False</th>
                      <th className="p-3 text-right text-emerald-300">True</th>
                      <th className="p-3 text-right text-[#FFD60A]">Spotters</th>
                      <th className="p-3">Top Circulating Theme</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-900/60">
                    {getTableRows().map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => row.stateObj && handleInspectState(row.stateObj)}
                        className={`hover:bg-emerald-900/50 cursor-pointer transition-all ${
                          selectedState?.code === row.code ? 'bg-emerald-900/80 font-bold' : ''
                        }`}
                      >
                        <td className="p-3 font-extrabold text-white flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-[10px] text-[#FFD60A] border border-emerald-800">
                            {row.code}
                          </span>
                          {row.name}
                        </td>
                        <td className="p-3 text-gray-300">{row.zoneOrRegion}</td>
                        <td className="p-3 text-right font-black text-white">{row.total}</td>
                        <td className="p-3 text-right font-bold text-red-400">{row.falseCount}</td>
                        <td className="p-3 text-right font-bold text-emerald-400">{row.trueCount}</td>
                        <td className="p-3 text-right font-bold text-[#FFD60A]">{row.spotters}</td>
                        <td className="p-3 text-emerald-200/90 truncate max-w-[220px]" title={row.topTopic}>
                          {row.topTopic}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Selected State Dossier & Live Action Card */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* State Dossier Card */}
          {selectedState ? (
            <div className="bg-gradient-to-b from-[#06261c] to-[#0A3D2E] text-white rounded-3xl p-6 shadow-xl border border-emerald-800/80 space-y-4">
              
              <div className="flex items-start justify-between border-b border-emerald-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-[#FFD60A] text-[#0A3D2E] font-black text-xs">
                      {selectedState.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-300">
                      {selectedState.zone} Zone
                    </span>
                  </div>
                  <h3 className="text-2xl font-black font-display text-white mt-1">
                    {selectedState.name} State
                  </h3>
                  <p className="text-xs text-gray-300">
                    Capital: <strong className="text-white">{selectedState.capital}</strong>
                  </p>
                </div>

                <div className="p-2.5 rounded-2xl bg-emerald-950 border border-emerald-800 text-center">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">Spotters</div>
                  <div className="text-xl font-black text-[#FFD60A]">{selectedState.spottersCount}</div>
                </div>
              </div>

              {/* State Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-black/30 p-2.5 rounded-2xl border border-white/5">
                  <div className="text-[10px] text-gray-400 font-bold">Total</div>
                  <div className="text-lg font-black text-white">{selectedState.totalRumorsCount}</div>
                </div>
                <div className="bg-red-950/40 p-2.5 rounded-2xl border border-red-500/20">
                  <div className="text-[10px] text-red-300 font-bold">False</div>
                  <div className="text-lg font-black text-red-400">{selectedState.falseClaimsCount}</div>
                </div>
                <div className="bg-emerald-950/60 p-2.5 rounded-2xl border border-emerald-500/20">
                  <div className="text-[10px] text-emerald-300 font-bold">Verified True</div>
                  <div className="text-lg font-black text-emerald-400">{selectedState.trueClaimsCount}</div>
                </div>
              </div>

              {/* Top Circulating Misinformation Theme */}
              <div className="bg-emerald-950/80 rounded-2xl p-3.5 border border-emerald-800/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#FFD60A]">
                  <Flame className="w-4 h-4 text-red-400 animate-pulse" /> Top Viral Topic in {selectedState.name}:
                </div>
                <p className="text-xs text-emerald-100 font-medium leading-relaxed">
                  "{selectedState.topRumorTopic}"
                </p>
              </div>

              {/* Social Media Vectors Breakdown */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-gray-300 flex items-center justify-between">
                  <span>Viral Spread Origin Channels:</span>
                  <span className="text-[11px] text-[#FFD60A]">TikTok, Twitter, Facebook</span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-gray-300 bg-black/20 p-2 rounded-xl">
                    <span className="flex items-center gap-1.5">🎵 TikTok Audio & Video Clones</span>
                    <strong className="text-red-400">42% False Rate</strong>
                  </div>
                  <div className="flex items-center justify-between text-gray-300 bg-black/20 p-2 rounded-xl">
                    <span className="flex items-center gap-1.5">𝕏 Twitter Viral Screenshots</span>
                    <strong className="text-amber-400">31% False Rate</strong>
                  </div>
                  <div className="flex items-center justify-between text-gray-300 bg-black/20 p-2 rounded-xl">
                    <span className="flex items-center gap-1.5">👥 WhatsApp Audio & Broadcasts</span>
                    <strong className="text-emerald-400">27% False Rate</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons for Selected State */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => onVerifyQuery && onVerifyQuery(`${selectedState.name} ${selectedState.topRumorTopic}`)}
                  className="w-full py-2.5 rounded-xl bg-[#FFD60A] hover:bg-amber-300 text-[#0A3D2E] font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Sparkles className="w-4 h-4" /> Verify {selectedState.name} Rumors with AI
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('map')}
                  className="w-full py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <Radio className="w-4 h-4 text-emerald-400" /> View {selectedState.name} on Live Radar Map
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-[#06261c] text-white rounded-3xl p-6 border border-emerald-800 text-center space-y-3">
              <MapPin className="w-8 h-8 text-[#FFD60A] mx-auto opacity-70" />
              <h4 className="font-black text-sm text-white font-display">No State Selected</h4>
              <p className="text-xs text-gray-400">
                Click any state tile in the D3 Choropleth Map or row in the table to inspect detailed forensic dossiers.
              </p>
            </div>
          )}

          {/* Quick Zone Distribution Summary Box */}
          <div className="bg-emerald-950/60 rounded-3xl p-5 border border-emerald-800/80 text-white space-y-3">
            <h4 className="font-black text-xs uppercase tracking-wider text-emerald-300 font-display flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-[#FFD60A]" /> Nigerian Geopolitical Summary
            </h4>
            <div className="space-y-2 text-xs">
              {NIGERIA_ZONES_STATS.map(z => (
                <div
                  key={z.zone}
                  onClick={() => setActiveZoneFilter(z.zone)}
                  className="flex items-center justify-between p-2 rounded-xl bg-emerald-900/40 hover:bg-emerald-900/80 cursor-pointer transition-all border border-emerald-800/40"
                >
                  <div>
                    <div className="font-bold text-white">{z.zone}</div>
                    <div className="text-[10px] text-gray-400">{z.stateCount} States</div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-[#FFD60A]">{z.totalRumors} claims</div>
                    <div className="text-[10px] text-red-300">{z.falseRate}% False</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
