import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Zap, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  DownloadCloud,
  FileText
} from 'lucide-react';
import { isDataSaverEnabled, setDataSaverEnabled, getCachedFactChecks, CachedFactCheck } from '../../utils/offlineDataSaver';

interface DataSaverModeToggleProps {
  onShowToast?: (points: number, message: string) => void;
  className?: string;
}

export const DataSaverModeToggle: React.FC<DataSaverModeToggleProps> = ({
  onShowToast,
  className = ''
}) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(isDataSaverEnabled());
  const [cachedFacts, setCachedFacts] = useState<CachedFactCheck[]>(getCachedFactChecks());
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleToggle = () => {
    const nextState = !isEnabled;
    setIsEnabled(nextState);
    setDataSaverEnabled(nextState);
    onShowToast?.(5, nextState ? 'Low-Bandwidth Data-Saver Mode ENABLED (Text-Only & Offline Caching Active)' : 'Full Bandwidth Mode Restored');
  };

  const filteredCache = cachedFacts.filter((item) =>
    item.claim.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl p-5 text-white border border-gray-800 shadow-xl space-y-4 ${className}`} id="data-saver-mode-toggle">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
            isEnabled ? 'bg-amber-950 text-[#FFD60A] border border-[#FFD60A]/40' : 'bg-gray-800 text-gray-300'
          }`}>
            {isEnabled ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-extrabold font-display text-white">
                Low-Bandwidth & Offline Data-Saver Mode
              </h4>
              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                isEnabled ? 'bg-[#FFD60A] text-[#0A3D2E]' : 'bg-gray-800 text-gray-400'
              }`}>
                {isEnabled ? 'ACTIVE (DATA SAVED)' : 'DISABLED'}
              </span>
            </div>
            <p className="text-[11px] text-gray-300">
              Disables heavy video previews, compresses images to text dossiers, and caches verifications for offline viewing.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className={`px-4 py-2 rounded-2xl text-xs font-black font-display cursor-pointer transition-all border shadow-md shrink-0 ${
            isEnabled
              ? 'bg-[#FFD60A] text-[#0A3D2E] border-[#FFD60A]'
              : 'bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700'
          }`}
        >
          {isEnabled ? 'Disable Data Saver' : 'Enable Data Saver'}
        </button>
      </div>

      {/* Offline Cached Verification Search Index */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1.5 text-gray-300 font-bold">
            <Database className="w-3.5 h-3.5 text-[#FFD60A]" />
            <span>Offline Cached Verification Vault ({cachedFacts.length} Verifications Cached):</span>
          </span>
          <span className="text-[10px]">Zero Data Usage</span>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search offline cached rumor facts..."
            className="w-full bg-black/80 border border-gray-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:border-[#FFD60A] focus:outline-hidden"
          />
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {filteredCache.map((item) => (
            <div key={item.id} className="bg-black/60 border border-gray-800 p-3 rounded-xl space-y-1 text-xs">
              <div className="flex items-center justify-between font-bold text-white">
                <span className="line-clamp-1">"{item.claim}"</span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                  item.verdict === 'TRUE' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                }`}>
                  {item.verdict}
                </span>
              </div>
              <p className="text-[11px] text-gray-300 leading-snug">{item.summary}</p>
              <div className="flex justify-between text-[9px] text-gray-500 font-mono pt-1">
                <span>Source: {item.source}</span>
                <span>Cached: {item.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
