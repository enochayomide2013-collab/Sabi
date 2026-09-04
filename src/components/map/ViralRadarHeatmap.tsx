import React, { useState } from 'react';
import { 
  Radar, 
  MapPin, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Radio, 
  Eye, 
  CheckCircle2, 
  HelpCircle, 
  MessageSquare, 
  Share2, 
  Search, 
  BellRing,
  Sparkles
} from 'lucide-react';

interface StateRumorHeat {
  stateName: string;
  region: 'South West' | 'North West' | 'North Central' | 'South South' | 'South East' | 'North East';
  threatLevel: 'HIGH THREAT' | 'MODERATE' | 'LOW' | 'CLEAR';
  velocityScore: number; // 0 - 100
  topCirculatingRumor: string;
  channels: string[];
  spotterCount: number;
  lastUpdated: string;
  verdict: 'FALSE' | 'UNVERIFIED' | 'TRUE';
}

const NIGERIAN_STATES_HEAT: StateRumorHeat[] = [
  {
    stateName: 'Lagos State',
    region: 'South West',
    threatLevel: 'HIGH THREAT',
    velocityScore: 92,
    topCirculatingRumor: 'Fake Voice Memo: Fuel Price Hike to ₦1,850/L Across Ikeja & Lekki Stations',
    channels: ['WhatsApp Groups', 'TikTok Viral Clips', 'Twitter/X Trends'],
    spotterCount: 142,
    lastUpdated: '12 mins ago',
    verdict: 'FALSE'
  },
  {
    stateName: 'Abuja (FCT)',
    region: 'North Central',
    threatLevel: 'HIGH THREAT',
    velocityScore: 88,
    topCirculatingRumor: 'Circulating Claim: NNPCL Headquarters Announcing Emergency Toll Adjustments',
    channels: ['WhatsApp Broadcasts', 'Facebook Posts'],
    spotterCount: 98,
    lastUpdated: '25 mins ago',
    verdict: 'FALSE'
  },
  {
    stateName: 'Kano State',
    region: 'North West',
    threatLevel: 'MODERATE',
    velocityScore: 65,
    topCirculatingRumor: 'Grain Price Stabilization Decree in Sabon Gari Market',
    channels: ['WhatsApp Audio Memos', 'Local Radio Transcripts'],
    spotterCount: 76,
    lastUpdated: '40 mins ago',
    verdict: 'TRUE'
  },
  {
    stateName: 'Rivers State (Port Harcourt)',
    region: 'South South',
    threatLevel: 'MODERATE',
    velocityScore: 58,
    topCirculatingRumor: 'Barge Crude Price Discount Claim at Jetty Terminals',
    channels: ['WhatsApp Forwards', 'Telegram Channels'],
    spotterCount: 64,
    lastUpdated: '1 hour ago',
    verdict: 'FALSE'
  },
  {
    stateName: 'Oyo State (Ibadan)',
    region: 'South West',
    threatLevel: 'LOW',
    velocityScore: 32,
    topCirculatingRumor: 'Bodija Market Food Stuff Distribution Registration Hoax',
    channels: ['WhatsApp Groups'],
    spotterCount: 45,
    lastUpdated: '2 hours ago',
    verdict: 'FALSE'
  },
  {
    stateName: 'Enugu State',
    region: 'South East',
    threatLevel: 'LOW',
    velocityScore: 28,
    topCirculatingRumor: 'Interstate Transport Fare Cap Mandate Hoax',
    channels: ['Facebook Posts'],
    spotterCount: 38,
    lastUpdated: '3 hours ago',
    verdict: 'FALSE'
  }
];

interface ViralRadarHeatmapProps {
  onShowToast?: (points: number, message: string) => void;
  className?: string;
}

export const ViralRadarHeatmap: React.FC<ViralRadarHeatmapProps> = ({
  onShowToast,
  className = ''
}) => {
  const [selectedState, setSelectedState] = useState<StateRumorHeat>(NIGERIAN_STATES_HEAT[0]);
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [threatFilter, setThreatFilter] = useState<string>('ALL');

  const filteredStates = NIGERIAN_STATES_HEAT.filter((item) => {
    const matchesRegion = selectedRegion === 'ALL' || item.region === selectedRegion;
    const matchesThreat = threatFilter === 'ALL' || item.threatLevel === threatFilter;
    const matchesSearch = item.stateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.topCirculatingRumor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesThreat && matchesSearch;
  });

  const getThreatBadgeClass = (level: StateRumorHeat['threatLevel']) => {
    switch (level) {
      case 'HIGH THREAT':
        return 'bg-rose-950 text-rose-300 border-rose-500/40';
      case 'MODERATE':
        return 'bg-amber-950 text-amber-300 border-amber-500/40';
      case 'LOW':
        return 'bg-blue-950 text-blue-300 border-blue-500/40';
      case 'CLEAR':
      default:
        return 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
    }
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl p-6 text-white border border-gray-800 shadow-2xl space-y-6 ${className}`} id="viral-radar-heatmap">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0A3D2E] text-[#FFD60A] border border-[#FFD60A]/30 flex items-center justify-center shrink-0 shadow-md">
            <Radar className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black font-display text-white tracking-wide">
                Viral Misinformation Early Warning Radar
              </h3>
              <span className="bg-[#FFD60A] text-[#0A3D2E] text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full">
                GEOSPATIAL HEATMAP
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Track state-by-state rumor velocity, social media channels, and field spotter reports across Nigeria in real time.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onShowToast?.(5, 'Subscribed to state rumor push notifications!')}
            className="bg-[#0A3D2E] hover:bg-[#0c4a38] text-[#FFD60A] border border-[#FFD60A]/30 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <BellRing className="w-4 h-4" />
            <span>Set Radar Alert</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-gray-950 p-3 rounded-2xl border border-gray-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search state or rumor topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-xl pl-9 pr-3 py-2 text-xs focus:border-[#FFD60A] focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <select
            value={threatFilter}
            onChange={(e) => setThreatFilter(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white rounded-xl p-2 text-xs font-bold focus:border-[#FFD60A] focus:outline-hidden"
          >
            <option value="ALL">All Threat Levels</option>
            <option value="HIGH THREAT">🚨 High Threat</option>
            <option value="MODERATE">⚠️ Moderate</option>
            <option value="LOW">🔵 Low</option>
          </select>

          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white rounded-xl p-2 text-xs font-bold focus:border-[#FFD60A] focus:outline-hidden"
          >
            <option value="ALL">All Geopolitical Zones</option>
            <option value="South West">South West</option>
            <option value="North Central">North Central (FCT)</option>
            <option value="North West">North West</option>
            <option value="South South">South South</option>
            <option value="South East">South East</option>
          </select>
        </div>
      </div>

      {/* Radar Main Grid: State Cards + Radar Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left State Cards Grid */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono block">
            Monitored Nigerian States ({filteredStates.length}):
          </span>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {filteredStates.map((st) => (
              <div
                key={st.stateName}
                onClick={() => setSelectedState(st)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  selectedState.stateName === st.stateName
                    ? 'bg-[#0A3D2E] border-[#FFD60A] shadow-lg text-white'
                    : 'bg-gray-950 border-gray-800 hover:border-gray-700 text-gray-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#FFD60A]" />
                    <span className="text-sm font-extrabold font-display text-white">
                      {st.stateName}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">({st.region})</span>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getThreatBadgeClass(st.threatLevel)}`}>
                    {st.threatLevel}
                  </span>
                </div>

                <p className="text-xs font-medium text-gray-200 line-clamp-2 mb-2 font-sans">
                  "{st.topCirculatingRumor}"
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 pt-1 border-t border-gray-800/60">
                  <div className="flex items-center gap-2">
                    <span className="text-[#FFD60A] font-bold">Rumor Velocity: {st.velocityScore}%</span>
                    <span>· {st.spotterCount} Active Spotters</span>
                  </div>
                  <span>{st.lastUpdated}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Active State Detail Box */}
        <div className="lg:col-span-5 bg-gray-950 border border-gray-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div>
              <span className="text-[10px] text-[#FFD60A] font-mono uppercase font-bold block">
                STATE RADAR DOSSIER
              </span>
              <h4 className="text-lg font-black font-display text-white">
                {selectedState.stateName}
              </h4>
            </div>
            <span className={`px-3 py-1 rounded-xl text-xs font-bold border ${getThreatBadgeClass(selectedState.threatLevel)}`}>
              {selectedState.threatLevel}
            </span>
          </div>

          {/* Velocity Progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-gray-400">Viral Velocity Gauge:</span>
              <span className="text-[#FFD60A] font-extrabold">{selectedState.velocityScore} / 100</span>
            </div>
            <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  selectedState.velocityScore > 80 ? 'bg-rose-500' : selectedState.velocityScore > 50 ? 'bg-amber-500' : 'bg-blue-500'
                }`}
                style={{ width: `${selectedState.velocityScore}%` }}
              />
            </div>
          </div>

          {/* Primary Circulating Rumor */}
          <div className="space-y-1 bg-black/60 p-3.5 rounded-xl border border-gray-800">
            <span className="text-[10px] text-rose-400 font-mono font-bold uppercase block">
              TOP CIRCULATING CLAIM:
            </span>
            <p className="text-xs font-bold text-white font-sans leading-snug">
              "{selectedState.topCirculatingRumor}"
            </p>
          </div>

          {/* Primary Vectors / Channels */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-300 font-display uppercase tracking-wider block">
              Primary Vectors & Social Channels:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedState.channels.map((ch, i) => (
                <span key={i} className="bg-gray-900 text-gray-300 px-2.5 py-1 rounded-lg text-[11px] font-mono border border-gray-800">
                  {ch}
                </span>
              ))}
            </div>
          </div>

          {/* Verified Spotter Count */}
          <div className="bg-[#0A3D2E]/40 border border-[#0A3D2E] p-3 rounded-xl flex items-center justify-between text-xs text-gray-200">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FFD60A]" />
              <span>Verified On-Ground Spotters:</span>
            </div>
            <span className="text-sm font-extrabold font-mono text-[#FFD60A]">
              {selectedState.spotterCount} Spotters
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => onShowToast?.(10, `Submitted pre-emptive debunk alert for ${selectedState.stateName}!`)}
              className="w-full bg-[#FFD60A] hover:bg-[#e6c200] text-[#0A3D2E] font-extrabold font-display py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <BellRing className="w-4 h-4" />
              <span>Issue Preemptive Debunk Alert</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
