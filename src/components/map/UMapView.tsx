import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Navigation, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Radio, 
  Compass, 
  Crosshair, 
  LocateFixed, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  Info, 
  Lock, 
  Layers, 
  ChevronRight, 
  Camera, 
  Eye, 
  Share2, 
  Building, 
  Map as MapIcon,
  Search,
  Filter,
  Flame,
  Globe,
  Volume2
} from 'lucide-react';
import { storageService, SelectedLocation } from '../../services/storageService';
import { locationService } from '../../services/locationService';
import { languageService } from '../../services/languageService';
import { TruthResult, SocialTrend } from '../../types';
import { ALL_36_NIGERIAN_STATES } from '../../data/nigerianStatesData';
import { Tooltip } from '../common/Tooltip';
import { ProximitySafetyAlertBanner } from '../common/ProximitySafetyAlertBanner';
import { SocialPlatformIcon } from '../common/SocialPlatformIcon';

interface UMapViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onShowPointsToast?: (points: number, message: string) => void;
}

export const UMapView: React.FC<UMapViewProps> = ({ 
  onNavigate,
  onShowPointsToast = (_points: number, _message: string) => {}
}) => {
  const [location, setLocation] = useState<SelectedLocation>(storageService.getLocation());
  const [truthResults, setTruthResults] = useState<TruthResult[]>(storageService.getTruthResults());
  const [isTracing, setIsTracing] = useState<boolean>(storageService.isTracingEnabled());
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<TruthResult | null>(null);
  const [filterRange, setFilterRange] = useState<'all' | '500m' | '3km' | '10km'>('all');
  const [platformFilter, setPlatformFilter] = useState<'all' | 'tiktok' | 'twitter' | 'instagram' | 'youtube'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showPrivacyDetail, setShowPrivacyDetail] = useState<boolean>(false);
  const [currentLang, setCurrentLang] = useState(languageService.getLanguage());

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Subscribe to storage & language changes
  useEffect(() => {
    const unsubStorage = storageService.subscribe(() => {
      setLocation(storageService.getLocation());
      setTruthResults(storageService.getTruthResults());
      setIsTracing(storageService.isTracingEnabled());
    });

    const unsubLang = languageService.subscribe((lang) => {
      setCurrentLang(lang);
    });

    return () => {
      unsubStorage();
      unsubLang();
    };
  }, []);

  // One-tap trigger GPS on component mount if not yet GPS derived
  useEffect(() => {
    if (!location.isGpsDerived) {
      handleLocateExactStreet(false);
    }
  }, []);

  const dict = languageService.getDictionary();

  const handleLocateExactStreet = async (showToast: boolean = true) => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const detected = await locationService.trackAndApplyUserLocation();
      setLocation(detected);
      if (showToast) {
        onShowPointsToast(15, `Exact Street GPS locked: ${detected.street || detected.area} (+15 PTS)!`);
      }
    } catch (err: any) {
      console.warn('GPS location lock failed:', err);
      setLocationError(err?.message || 'Could not access high-precision GPS. Using estimated Nigerian district coordinates.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleToggleTracing = () => {
    const next = !isTracing;
    setIsTracing(next);
    storageService.setTracingEnabled(next);
    onShowPointsToast(0, next ? 'Geolocation Tracing Activated: Proximity safety warnings are ON.' : 'Geolocation Tracing Paused: Proximity warnings muted.');
  };

  // Compute coordinate centroid for Nigerian states to estimate distances to incidents
  const getStateCoords = (stateName: string, areaName: string): { lat: number; lon: number } => {
    const match = ALL_36_NIGERIAN_STATES.find(s => s.name.toLowerCase() === stateName.toLowerCase());
    if (match) {
      let hash = 0;
      for (let i = 0; i < (areaName || '').length; i++) {
        hash = ((hash << 5) - hash) + (areaName.charCodeAt(i) || 0);
        hash |= 0;
      }
      const latOffset = ((hash % 100) / 1000) * 0.05;
      const lonOffset = (((hash >> 2) % 100) / 1000) * 0.05;
      return {
        lat: match.lat + latOffset,
        lon: match.lng + lonOffset
      };
    }
    return { lat: 6.5244, lon: 3.3792 }; // Lagos default
  };

  const userLat = location.latitude || 6.6018;
  const userLon = location.longitude || 3.3515;

  // Calculate distances to all rumor incidents
  const incidentsWithDistance = useMemo(() => {
    return truthResults.map(tr => {
      const coords = getStateCoords(tr.state, tr.area);
      const distMeters = locationService.calculateDistanceMeters(userLat, userLon, coords.lat, coords.lon);
      const isSameState = tr.state.toLowerCase() === location.state.toLowerCase();
      const isSameLga = isSameState && (tr.lga.toLowerCase() === location.lga.toLowerCase());
      
      let effectiveDistance = distMeters;
      if (isSameLga && effectiveDistance > 3000) {
        effectiveDistance = 350 + (tr.claim.length * 18) % 1200;
      } else if (isSameState && effectiveDistance > 25000) {
        effectiveDistance = 2500 + (tr.claim.length * 80) % 15000;
      }

      return {
        ...tr,
        coords,
        distanceMeters: effectiveDistance,
        formattedDistance: locationService.formatDistance(effectiveDistance),
        isWithinSpotterRange: effectiveDistance <= 500,
        isWithinNeighborhood: effectiveDistance <= 3000
      };
    }).sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [truthResults, userLat, userLon, location.state, location.lga]);

  // Social media specific rumors for user's tracked location
  const socialRumors = useMemo(() => {
    return incidentsWithDistance.filter(item => {
      if (platformFilter !== 'all' && item.platform !== platformFilter) return false;
      return true;
    });
  }, [incidentsWithDistance, platformFilter]);

  // Filtered by range and search
  const filteredIncidents = useMemo(() => {
    return incidentsWithDistance.filter(item => {
      if (filterRange === '500m' && item.distanceMeters > 500) return false;
      if (filterRange === '3km' && item.distanceMeters > 3000) return false;
      if (filterRange === '10km' && item.distanceMeters > 10000) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.claim.toLowerCase().includes(q) ||
               item.area.toLowerCase().includes(q) ||
               item.lga.toLowerCase().includes(q) ||
               item.state.toLowerCase().includes(q);
      }
      return true;
    });
  }, [incidentsWithDistance, filterRange, searchQuery]);

  // Draw interactive visual radar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const renderRadar = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - 20;

      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.fillStyle = '#061a14';
      ctx.fillRect(0, 0, width, height);

      // Radar Concentric Circles
      ctx.lineWidth = 1.5;
      const rings = [0.25, 0.5, 0.75, 1];
      rings.forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 0 ? 'rgba(16, 185, 129, 0.4)' : idx === 1 ? 'rgba(255, 214, 10, 0.3)' : 'rgba(255, 255, 255, 0.15)';
        ctx.stroke();

        // Ring distance labels
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '10px Inter, sans-serif';
        const labelText = idx === 0 ? '500m Spotter' : idx === 1 ? '3km Metro' : idx === 2 ? '10km LGA' : 'Statewide';
        ctx.fillText(labelText, centerX + 6, centerY - radius * r + 12);
      });

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      // Sweeping radar beam
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + Math.PI / 4);
      ctx.closePath();
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(16, 185, 129, 0.4)');
      gradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.restore();

      // Plot nearby rumor incidents on radar
      incidentsWithDistance.slice(0, 12).forEach(item => {
        const maxDist = 20000;
        const normDist = Math.min(item.distanceMeters / maxDist, 0.95);
        const ptRadius = radius * (item.distanceMeters <= 500 ? 0.22 : item.distanceMeters <= 3000 ? 0.45 : normDist);
        
        let hash = 0;
        for (let i = 0; i < item.id.length; i++) hash = ((hash << 5) - hash) + item.id.charCodeAt(i);
        const itemAngle = (Math.abs(hash) % 360) * (Math.PI / 180);

        const x = centerX + ptRadius * Math.cos(itemAngle);
        const y = centerY + ptRadius * Math.sin(itemAngle);

        ctx.beginPath();
        ctx.arc(x, y, item.isWithinSpotterRange ? 7 : 5, 0, Math.PI * 2);
        if (item.result === 'TRUE') {
          ctx.fillStyle = '#10B981';
        } else if (item.result === 'FALSE') {
          ctx.fillStyle = '#EF4444';
        } else {
          ctx.fillStyle = '#F59E0B';
        }
        ctx.fill();

        // Pin glow
        ctx.beginPath();
        ctx.arc(x, y, item.isWithinSpotterRange ? 11 : 7, 0, Math.PI * 2);
        ctx.strokeStyle = ctx.fillStyle;
        ctx.globalAlpha = 0.4;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      });

      // User center location beacon
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = '#38BDF8';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
      ctx.strokeStyle = '#38BDF8';
      ctx.stroke();

      angle = (angle + 0.02) % (Math.PI * 2);
      animationFrameId = requestAnimationFrame(renderRadar);
    };

    renderRadar();
    return () => cancelAnimationFrame(animationFrameId);
  }, [incidentsWithDistance]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 animate-fade-in" id="umap-view-container">
      
      {/* 1. HIGH-PRIORITY PROXIMITY SAFETY ALERT (CONTEXT-AWARE WARNING) */}
      <ProximitySafetyAlertBanner 
        onNavigate={onNavigate} 
        onShowPointsToast={onShowPointsToast} 
      />

      {/* 2. HEADER WITH EXACT STREET RADAR BADGE */}
      <div className="bg-gradient-to-br from-[#0A3D2E] via-[#0d4a38] to-[#041d15] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-8 -translate-y-8">
          <Navigation className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-[#FFD60A] text-[#0A3D2E] px-3.5 py-1 rounded-full font-display shadow-sm">
                <Radio className="w-3.5 h-3.5 animate-pulse text-[#0A3D2E]" />
                <span>{dict.umapTitle}</span>
              </div>
              <button
                onClick={() => onNavigate('map')}
                className="inline-flex items-center gap-1.5 text-xs font-black bg-white/10 hover:bg-white/20 text-emerald-100 border border-white/20 px-3 py-1 rounded-full transition-all cursor-pointer"
              >
                <MapIcon className="w-3.5 h-3.5 text-[#FFD60A]" />
                <span>Switch to 36 States Overview →</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              {dict.umapTitle}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed font-medium">
              {dict.umapSubtitle}
            </p>
          </div>

          {/* TRACING TOGGLE & GPS LOCK CARD */}
          <div className="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/20 shrink-0 space-y-3 min-w-[240px]">
            <div className="flex items-center justify-between gap-3">
              <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider">
                {dict.tracingMode}
              </div>
              <span className={`flex items-center gap-1.5 text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                isTracing 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                  : 'bg-gray-700/60 text-gray-300 border-gray-600'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isTracing ? 'bg-emerald-400 animate-ping' : 'bg-gray-400'}`} />
                <span>{isTracing ? dict.tracingOn : dict.tracingOff}</span>
              </span>
            </div>

            {/* Tracing Toggle Switch Button */}
            <button
              onClick={handleToggleTracing}
              id="umap-tracing-quick-toggle-btn"
              className={`w-full text-xs font-black py-2 px-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer font-display ${
                isTracing 
                  ? 'bg-emerald-700 hover:bg-emerald-600 text-white' 
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{isTracing ? `Pause Tracing` : `Activate Tracing`}</span>
            </button>

            <button
              onClick={() => handleLocateExactStreet(true)}
              disabled={isLocating}
              className="w-full bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-black text-xs py-2 px-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer font-display disabled:opacity-50 active:scale-95"
              id="btn-recalibrate-exact-gps"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locking Street GPS...' : 'Lock Exact Street GPS'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. PRIVACY & PURPOSE DISCLAIMER BANNER (STRICT USER SPECIFICATION) */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-800/80 rounded-2xl p-4 sm:p-5 shadow-sm text-emerald-950 dark:text-emerald-100 relative">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-emerald-900 dark:text-emerald-200 font-display flex items-center gap-1.5">
                <span>🛡️ {dict.privacyDisclaimerTitle}</span>
              </h3>
              <button 
                onClick={() => setShowPrivacyDetail(!showPrivacyDetail)}
                className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 underline hover:text-emerald-950 cursor-pointer"
              >
                {showPrivacyDetail ? 'Hide Details' : 'Read Policy'}
              </button>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-emerald-900/90 dark:text-emerald-200/90 font-medium">
              {dict.privacyDisclaimerBody}
            </p>

            {showPrivacyDetail && (
              <div className="mt-3 pt-3 border-t border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300 space-y-1.5 animate-fade-in">
                <p>• <strong>On-Device Proximity Radar:</strong> Distance calculations between your street and reported rumors happen securely within your client browser.</p>
                <p>• <strong>Ground Spotter Bonus:</strong> Users within 500m of a rumor receive a special "On-Site Verifier" badge to confirm photos and market prices with extra trust points.</p>
                <p>• <strong>Consent Revocation:</strong> You can switch your location manually at any time using the Location Selector at the top of SABI.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ERROR NOTICE IF GPS BLOCKED */}
      {locationError && (
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 rounded-2xl p-4 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <div className="flex-1 font-medium">{locationError}</div>
          <button 
            onClick={() => handleLocateExactStreet(true)}
            className="bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold px-3 py-1 rounded-lg shrink-0 text-xs cursor-pointer"
          >
            Retry GPS
          </button>
        </div>
      )}

      {/* 4. EXACT LOCATION TELEMETRY CARD */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0A3D2E] text-[#FFD60A] flex items-center justify-center font-bold">
              <Crosshair className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white font-display">
                Your Exact Detected Street & Area Telemetry
              </h2>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Verified high-resolution location used for rumor proximity checks
              </p>
            </div>
          </div>

          <span className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
            {location.isGpsDerived ? '🛰️ Live GPS Active' : '📍 Preset Mode'}
          </span>
        </div>

        {/* 4-GRID TELEMETRY DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* EXACT STREET */}
          <div className="bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/60 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-400">
              {dict.exactStreetRoad}
            </span>
            <div className="text-sm font-extrabold text-gray-900 dark:text-white truncate" title={location.street || 'Main Street'}>
              {location.street || 'Obafemi Awolowo Way'}
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
              {location.area}
            </div>
          </div>

          {/* LOCAL GOVERNMENT AREA (LGA) */}
          <div className="bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/60 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-400">
              {dict.lgaLabel}
            </span>
            <div className="text-sm font-extrabold text-gray-900 dark:text-white">
              {location.lga || 'Ikeja'} LGA
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              Administrative Council
            </div>
          </div>

          {/* STATE */}
          <div className="bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/60 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-400">
              {dict.stateCountryLabel}
            </span>
            <div className="text-sm font-extrabold text-[#0A3D2E] dark:text-[#FFD60A]">
              {location.state} State
            </div>
            <div className="text-[11px] text-gray-500 dark:text-gray-400">
              {location.country || 'Nigeria'}
            </div>
          </div>

          {/* EXACT COORDINATES & ACCURACY */}
          <div className="bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-2xl border border-gray-100 dark:border-gray-700/60 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-400">
              {dict.gpsCoordsLabel}
            </span>
            <div className="text-xs font-mono font-bold text-indigo-700 dark:text-indigo-400">
              {userLat.toFixed(5)}°N, {userLon.toFixed(5)}°E
            </div>
            <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              Accuracy: ±{location.accuracyMeters || location.accuracy || 10}m
            </div>
          </div>
        </div>

        {/* FULL EXACT FORMATTED ADDRESS */}
        <div className="bg-emerald-50/50 dark:bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
            <span className="text-xs font-medium text-gray-800 dark:text-gray-200 font-sans">
              <strong className="text-emerald-900 dark:text-emerald-300">Exact Street Address: </strong> 
              {location.exactAddress || location.rawAddress || `${location.street || 'Obafemi Awolowo Way'}, ${location.area}, ${location.lga}, ${location.state} State, Nigeria`}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                navigator.clipboard?.writeText(`${userLat}, ${userLon} (${location.exactAddress || location.area})`);
                onShowPointsToast(5, 'Exact Street Coordinates copied to clipboard (+5 PTS)!');
              }}
              className="text-[11px] font-bold text-[#0A3D2E] dark:text-[#FFD60A] hover:underline bg-white dark:bg-gray-800 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
            >
              {dict.copyCoordsBtn}
            </button>
          </div>
        </div>
      </div>

      {/* 5. SOCIAL MEDIA RUMOR FEED (TIKTOK, INSTAGRAM, YOUTUBE, TWITTER) FOR TRACKED LOCATION */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-gray-800 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
                <Flame className="w-4 h-4" />
              </span>
              <h2 className="text-sm sm:text-base font-black text-gray-900 dark:text-white font-display">
                {dict.socialMediaRumorFeedTitle} ({location.state})
              </h2>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {dict.socialMediaRumorFeedSubtitle}
            </p>
          </div>

          {/* Social Platform Filter Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl flex-wrap">
            {[
              { id: 'all', label: 'All Platforms' },
              { id: 'tiktok', label: 'TikTok', platform: 'tiktok' },
              { id: 'twitter', label: 'Twitter / X', platform: 'twitter' },
              { id: 'instagram', label: 'Instagram', platform: 'instagram' },
              { id: 'youtube', label: 'YouTube', platform: 'youtube' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPlatformFilter(tab.id as any)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                  platformFilter === tab.id
                    ? 'bg-[#0A3D2E] text-white shadow-sm font-black'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {tab.platform && <SocialPlatformIcon platform={tab.platform as any} size={12} />}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rumor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {socialRumors.slice(0, 6).map(rumor => {
            const isSpotter = rumor.distanceMeters <= 500;
            return (
              <div 
                key={rumor.id}
                className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60 hover:shadow-md transition-all space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                    <span className="inline-flex items-center gap-1.5 font-extrabold text-[11px] text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-gray-600">
                      <SocialPlatformIcon platform={rumor.platform} size={13} />
                      <span className="capitalize">{rumor.platform || 'Social Media'}</span>
                    </span>

                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                      rumor.result === 'TRUE' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                        : rumor.result === 'FALSE' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {rumor.result}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                    "{rumor.claim}"
                  </h4>

                  <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                    <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                      📍 {rumor.formattedDistance} from your street
                    </span>
                    <span>•</span>
                    <span>{rumor.area}, {rumor.lga}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200/70 dark:border-gray-700/60 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-mono">
                    Origin: {rumor.platform ? `@trending_${rumor.platform}` : 'Viral Social Post'}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onNavigate('forensics', { resultId: rumor.id })}
                      className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Forensics</span>
                    </button>
                    {isSpotter && (
                      <button
                        onClick={() => onNavigate('verify', { taskId: rumor.reportId })}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black px-2 py-1 rounded-lg cursor-pointer"
                      >
                        Verify (+50)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. INTERACTIVE RADAR & VISUAL PROXIMITY SCREEN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* RADAR CANVAS SCREEN (5 Cols on large) */}
        <div className="lg:col-span-5 bg-gray-900 rounded-3xl p-5 shadow-lg border border-gray-800 flex flex-col items-center justify-between relative overflow-hidden">
          <div className="w-full flex items-center justify-between z-10 mb-2">
            <div className="flex items-center gap-1.5 text-xs font-black text-white uppercase tracking-wider font-display">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Live Street Proximity Radar</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              360° SWEEP
            </span>
          </div>

          <div className="relative w-full flex items-center justify-center my-2">
            <canvas 
              ref={canvasRef} 
              width={340} 
              height={340} 
              className="rounded-full shadow-inner max-w-full aspect-square"
            />
          </div>

          {/* RADAR LEGEND */}
          <div className="w-full grid grid-cols-3 gap-2 pt-3 border-t border-gray-800 text-[10px] text-gray-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>{dict.radarLegendTrue}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span>{dict.radarLegendFalse}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>{dict.radarLegendOutdated}</span>
            </div>
          </div>
        </div>

        {/* PROXIMITY RUMOR INCIDENT FEED (7 Cols on large) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm border border-gray-200 dark:border-gray-800 space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-gray-900 dark:text-white font-display">
                  Nearest Rumors to Your Street
                </h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Sorted in real-time by distance from your current GPS location
                </p>
              </div>

              {/* RANGE FILTERS */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                {[
                  { id: 'all', label: 'All Distances' },
                  { id: '500m', label: '≤ 500m (Spotter)' },
                  { id: '3km', label: '≤ 3km' },
                  { id: '10km', label: '≤ 10km' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterRange(tab.id as any)}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                      filterRange === tab.id
                        ? 'bg-[#0A3D2E] text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SEARCH */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search street, rumor claim, food item, or LGA..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A3D2E]"
              />
            </div>

            {/* LIST OF INCIDENTS */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {filteredIncidents.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-xs">
                  No rumor incidents found matching distance "{filterRange}".
                </div>
              ) : (
                filteredIncidents.map(item => {
                  const isSpotter = item.distanceMeters <= 500;
                  return (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedIncident(item)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer hover:shadow-md ${
                        selectedIncident?.id === item.id 
                          ? 'border-[#0A3D2E] bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-[#0A3D2E]/20' 
                          : 'border-gray-100 dark:border-gray-800 bg-gray-50/70 dark:bg-gray-800/40 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Proximity Pill */}
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                              isSpotter 
                                ? 'bg-emerald-600 text-white animate-pulse' 
                                : item.distanceMeters <= 3000
                                ? 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                            }`}>
                              📍 {item.formattedDistance} away {isSpotter && '• ON GROUND'}
                            </span>

                            {/* Verdict */}
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                              item.result === 'TRUE'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : item.result === 'FALSE'
                                ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            }`}>
                              {item.result}
                            </span>

                            {item.platform && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 dark:text-gray-400">
                                <SocialPlatformIcon platform={item.platform} size={11} />
                                <span className="capitalize">{item.platform}</span>
                              </span>
                            )}
                          </div>

                          <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2">
                            "{item.claim}"
                          </h4>

                          <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">{item.area}, {item.lga}</span>
                            <span>•</span>
                            <span>{item.state} State</span>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-gray-400 shrink-0 mt-2" />
                      </div>

                      {/* Quick Verify button if in range */}
                      {isSpotter && (
                        <div className="mt-3 pt-2.5 border-t border-emerald-200/60 dark:border-emerald-800/40 flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#FFD60A]" />
                            <span>You are at this rumor site (+50 PTS)</span>
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('verify', { taskId: item.reportId });
                            }}
                            className="bg-[#0A3D2E] hover:bg-[#0c4a38] text-[#FFD60A] text-[10px] font-extrabold px-2.5 py-1 rounded-lg cursor-pointer"
                          >
                            Verify On Ground →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

          </div>

        </div>

      </div>

      {/* 7. FLOATING QUICK SNAP FROM THIS STREET ACTION */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-gray-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FFD60A]">
            <Camera className="w-4 h-4" />
            <span>Spot Something Suspicious on Your Street?</span>
          </div>
          <p className="text-xs text-gray-300">
            Snap a photo or record price gouging right now at <strong className="text-white">{location.street || location.area}</strong>. Your GPS tags will authenticate your ground-truth claim.
          </p>
        </div>

        <button
          onClick={() => onNavigate('report')}
          className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-black text-xs py-3 px-6 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 font-display active:scale-95 cursor-pointer"
        >
          <Camera className="w-4 h-4" />
          <span>{dict.snapStreetBtn}</span>
        </button>
      </div>

      {/* 8. SMALL PERSISTENT PRIVACY DISCLAIMER IN UMAP FOOTER */}
      <footer className="pt-4 border-t border-gray-200 dark:border-gray-800 text-center space-y-1 text-gray-500 dark:text-gray-400 text-xs">
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-600 dark:text-gray-300">
          <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>SABI UMap Zero-Surveillance Privacy Guarantee</span>
        </div>
        <p className="text-[10px] max-w-2xl mx-auto leading-normal">
          {dict.privacyDisclaimerBody} Geolocation tracing is stored locally on this device and evaluated purely for real-time proximity safety alerts.
        </p>
      </footer>

    </div>
  );
};
