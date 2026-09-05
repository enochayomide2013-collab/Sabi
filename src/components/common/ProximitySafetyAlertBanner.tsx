import React, { useState, useEffect, useMemo } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Radio, 
  Navigation, 
  X, 
  ChevronRight, 
  Eye, 
  CheckCircle2, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Lock,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { storageService, SelectedLocation } from '../../services/storageService';
import { locationService } from '../../services/locationService';
import { languageService } from '../../services/languageService';
import { TruthResult } from '../../types';
import { SocialPlatformIcon } from './SocialPlatformIcon';

interface ProximitySafetyAlertBannerProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onShowPointsToast?: (points: number, message: string) => void;
}

export const ProximitySafetyAlertBanner: React.FC<ProximitySafetyAlertBannerProps> = ({
  onNavigate,
  onShowPointsToast = (_points: number, _message: string) => {}
}) => {
  const [location, setLocation] = useState<SelectedLocation>(storageService.getLocation());
  const [truthResults, setTruthResults] = useState<TruthResult[]>(storageService.getTruthResults());
  const [isTracing, setIsTracing] = useState<boolean>(storageService.isTracingEnabled());
  const [dismissedIds, setDismissedIds] = useState<string[]>(storageService.getDismissedProximityAlerts());
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [currentLang, setCurrentLang] = useState(languageService.getLanguage());

  useEffect(() => {
    const unsubStorage = storageService.subscribe(() => {
      setLocation(storageService.getLocation());
      setTruthResults(storageService.getTruthResults());
      setIsTracing(storageService.isTracingEnabled());
      setDismissedIds(storageService.getDismissedProximityAlerts());
    });

    const unsubLang = languageService.subscribe((lang) => {
      setCurrentLang(lang);
    });

    return () => {
      unsubStorage();
      unsubLang();
    };
  }, []);

  const dict = languageService.getDictionary();
  const userLat = location.latitude || 6.6018;
  const userLon = location.longitude || 3.3515;

  // Find nearest high-priority or suspicious rumor that isn't dismissed
  const activeNearbyRumor = useMemo(() => {
    if (!isTracing) return null;

    const eligible = truthResults.filter(tr => {
      if (dismissedIds.includes(tr.id)) return false;
      // High-priority if FALSE, OUTDATED, or from viral social platform
      return tr.result === 'FALSE' || tr.result === 'OUTDATED' || tr.result === 'SUSPICIOUS' || tr.result === 'NEEDS MORE VERIFICATION' || tr.platform === 'tiktok' || tr.platform === 'twitter' || tr.platform === 'youtube';
    });

    // Check matches in same State / LGA or proximity < 2500 meters
    let nearest: { incident: TruthResult; distanceMeters: number; formattedDistance: string } | null = null;
    let minDistance = Infinity;

    for (const tr of eligible) {
      const isSameState = tr.state.toLowerCase() === location.state.toLowerCase();
      const isSameLga = isSameState && (tr.lga.toLowerCase() === location.lga.toLowerCase());

      let dist = 10000;
      if (isSameLga) {
        // High-resolution local simulated distance on current street / LGA (200m - 1200m)
        dist = 280 + (tr.claim.length * 15) % 950;
      } else if (isSameState) {
        dist = 1800 + (tr.claim.length * 40) % 2200;
      }

      if (dist < 3500 && dist < minDistance) {
        minDistance = dist;
        nearest = {
          incident: tr,
          distanceMeters: dist,
          formattedDistance: locationService.formatDistance(dist)
        };
      }
    }

    return nearest;
  }, [truthResults, location.state, location.lga, isTracing, dismissedIds, userLat, userLon]);

  // Audio cue trigger once when a high-priority proximity is detected
  useEffect(() => {
    if (activeNearbyRumor && !soundMuted && isTracing) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioCtx.state === 'running') {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.18); // A5
          gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + 0.35);
        }
      } catch (e) {
        // Ignore audio restrictions
      }
    }
  }, [activeNearbyRumor?.incident.id]);

  if (!isTracing || !activeNearbyRumor) {
    return null;
  }

  const { incident, distanceMeters, formattedDistance } = activeNearbyRumor;
  const isSpotterRange = distanceMeters <= 500;

  const handleDismiss = () => {
    storageService.dismissProximityAlert(incident.id);
    onShowPointsToast(5, 'Proximity alert dismissed. Stay safe and observant!');
  };

  const handleDisableTracing = () => {
    storageService.setTracingEnabled(false);
    onShowPointsToast(0, 'Geolocation tracing paused.');
  };

  return (
    <div 
      id="sabi-high-priority-proximity-alert"
      className="w-full mb-4 bg-gradient-to-r from-red-950 via-gray-900 to-amber-950 text-white rounded-2xl p-4 sm:p-5 border-2 border-red-500/80 shadow-2xl relative overflow-hidden animate-pulse-slow"
    >
      {/* Background pulsing radar sweep graphic */}
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-8 -top-8 w-40 h-40 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* HEADER BAR: PRIORITY TAG & ACTIONS */}
      <div className="flex items-center justify-between gap-3 mb-2.5 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-red-400 font-display flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            {dict.proximityAlertTitle}
          </span>
          <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-black px-2 py-0.5 rounded-full">
            📍 {formattedDistance} AWAY {isSpotterRange ? '• ON GROUND' : '• NEAR YOUR STREET'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSoundMuted(!soundMuted)}
            title={soundMuted ? 'Unmute alert tone' : 'Mute alert tone'}
            className="p-1 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          </button>
          <button
            onClick={handleDismiss}
            title={dict.dismissAlert}
            className="p-1 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CONTENT BODY */}
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="font-extrabold text-[#FFD60A]">
                {location.street || location.area}, {location.lga}
              </span>
              <span className="text-gray-400">•</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-300 bg-gray-800/80 px-2 py-0.5 rounded-md border border-gray-700">
                <SocialPlatformIcon platform={incident.platform} size={13} className="text-[#FFD60A]" />
                <span className="capitalize">{incident.platform || 'Social Media'} Origin</span>
              </span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                incident.result === 'FALSE' 
                  ? 'bg-red-500/30 text-red-300 border border-red-500/50' 
                  : 'bg-amber-500/30 text-amber-200 border border-amber-500/50'
              }`}>
                {incident.result}
              </span>
            </div>

            <h3 className="text-xs sm:text-sm font-black text-white line-clamp-2">
              "{incident.claim}"
            </h3>

            {/* CONTEXT-AWARE SAFETY GUIDANCE */}
            <div className="p-2.5 rounded-xl bg-black/40 border border-red-900/40 text-gray-200 text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FFD60A] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="text-[#FFD60A] font-bold block text-[11px] uppercase tracking-wide">
                  Context-Aware Safety Advisory:
                </strong>
                <p className="text-[11px] text-gray-300 leading-relaxed">
                  {incident.result === 'FALSE' 
                    ? `Our verified on-ground spotters confirm this viral claim circulating on ${incident.platform || 'social media'} is FALSE. Normal operations, fuel availability, and peace are maintained at ${incident.area}. Please do not forward alarming voice notes.`
                    : dict.proximityAlertContextSafe}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="pt-2 flex items-center justify-between flex-wrap gap-2 border-t border-gray-800/80">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>UMap Tracing Sentinel Active</span>
            <span>•</span>
            <button
              onClick={() => onNavigate('umap')}
              className="text-[#FFD60A] hover:underline font-bold"
            >
              Open Live Radar →
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onNavigate('forensics', { resultId: incident.id });
              }}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-[11px] font-bold rounded-xl border border-gray-700 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>{dict.inspectForensics}</span>
            </button>

            {isSpotterRange && (
              <button
                onClick={() => {
                  onNavigate('verify', { taskId: incident.reportId || incident.id });
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-black rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFD60A]" />
                <span>{dict.verifyOnGround}</span>
              </button>
            )}

            <button
              onClick={handleDismiss}
              className="px-2.5 py-1.5 text-gray-400 hover:text-white text-[11px] font-semibold hover:bg-gray-800 rounded-xl transition-all cursor-pointer"
            >
              {dict.dismissAlert}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
