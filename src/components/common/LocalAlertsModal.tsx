import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Send, 
  Radio, 
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { LocalPushAlert } from '../../types';
import { pushNotificationService } from '../../services/pushNotificationService';
import { SelectedLocation, storageService } from '../../services/storageService';
import { languageService } from '../../services/languageService';

interface LocalAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeLocation: SelectedLocation;
  onNavigateToTruth?: (claim: string) => void;
}

export const LocalAlertsModal: React.FC<LocalAlertsModalProps> = ({
  isOpen,
  onClose,
  activeLocation,
  onNavigateToTruth
}) => {
  const [alerts, setAlerts] = useState<LocalPushAlert[]>(pushNotificationService.getAllAlerts());
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(pushNotificationService.isPushEnabled());
  const [filterStateOnly, setFilterStateOnly] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = pushNotificationService.subscribe((updated) => {
      setAlerts(updated);
    });
    return unsubscribe;
  }, []);

  if (!isOpen) return null;

  const filteredAlerts = filterStateOnly
    ? pushNotificationService.getAlertsForLocation(activeLocation.state, activeLocation.lga)
    : alerts;

  const handleTogglePush = async () => {
    const nextState = !isPushEnabled;
    const success = await pushNotificationService.setPushEnabled(nextState);
    if (success) {
      setIsPushEnabled(true);
      setFeedbackMsg(`Push alerts activated for ${activeLocation.state}! You will receive instant notifications for local rumors.`);
    } else {
      setIsPushEnabled(false);
      setFeedbackMsg('Push alerts disabled or browser notification permission was denied.');
    }
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleTriggerTestAlert = () => {
    setIsSimulating(true);
    const newAlert = pushNotificationService.simulateStateRumorAlert(activeLocation);
    setIsSimulating(false);
    setFeedbackMsg(`Pushed live local alert for ${activeLocation.state} (${activeLocation.lga || 'Metropolis'})!`);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      id="local-alerts-modal"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-up flex flex-col max-h-[90vh]">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0A3D2E] to-[#0c4a37] text-white p-5 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD60A]"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFD60A] text-[#0A3D2E] px-2 py-0.5 rounded-md font-display">
              Hyper-Local Push Alerts
            </span>
          </div>

          <h2 className="text-xl font-bold font-display text-white">
            State & LGA Rumor Bulletins
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-emerald-200 mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#FFD60A]" />
            <span>Targeting: <strong className="text-white">{activeLocation.state}</strong> ({activeLocation.lga || 'All LGAs'})</span>
          </div>
        </div>

        {/* Push Notification Controls Bar */}
        <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isPushEnabled ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              <Radio className={`w-4 h-4 ${isPushEnabled ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <div className="text-xs font-bold text-gray-900">
                {isPushEnabled ? 'Push Alerts Active' : 'Push Alerts Disabled'}
              </div>
              <div className="text-[10px] text-gray-500">
                Instant browser & audio alerts for {activeLocation.state}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTogglePush}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                isPushEnabled
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E]'
              }`}
            >
              {isPushEnabled ? 'Turn Off' : 'Turn On Alerts'}
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        {feedbackMsg && (
          <div className="mx-4 mt-3 p-2.5 bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Filter Toggle */}
        <div className="px-5 pt-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-gray-700">
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            <span>Showing {filteredAlerts.length} Local Bulletins</span>
          </div>

          <button
            onClick={() => setFilterStateOnly(!filterStateOnly)}
            className="text-xs text-emerald-800 font-bold hover:underline cursor-pointer"
          >
            {filterStateOnly ? `Show All 36 States` : `Only ${activeLocation.state}`}
          </button>
        </div>

        {/* Alerts List */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShieldAlert className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-700">No Active Rumors in {activeLocation.state}</p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
                Your location currently has zero high-risk viral rumors flagged. SABI spotters continue monitoring 24/7.
              </p>
              <button
                onClick={handleTriggerTestAlert}
                className="mt-3 px-3 py-1.5 bg-[#0A3D2E] text-white text-xs font-bold rounded-xl"
              >
                Simulate Spotter Report
              </button>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  alert.read 
                    ? 'bg-gray-50/90 border-gray-200 text-gray-700' 
                    : 'bg-white border-emerald-300 shadow-sm text-gray-900 ring-1 ring-emerald-400/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      alert.verdict === 'FALSE'
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : alert.verdict === 'OUTDATED MEDIA'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : alert.verdict === 'TRUE'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-blue-100 text-blue-800 border border-blue-200'
                    }`}>
                      {alert.verdict || alert.category}
                    </span>

                    {alert.sourcePlatform && (
                      <span className="text-[10px] font-bold text-gray-500 capitalize bg-gray-100 px-1.5 py-0.5 rounded">
                        via {alert.sourcePlatform}
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] text-gray-400 font-medium">
                    {alert.timestamp}
                  </span>
                </div>

                <h4 className="text-xs font-bold font-display mt-2 text-gray-900 leading-snug">
                  {alert.title}
                </h4>

                <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                  {alert.message}
                </p>

                <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600" />
                    <span>{alert.area ? `${alert.area}, ` : ''}{alert.lga ? `${alert.lga}, ` : ''}{alert.state}</span>
                  </div>

                  <button
                    onClick={() => {
                      pushNotificationService.markAlertAsRead(alert.id);
                      if (onNavigateToTruth) {
                        onNavigateToTruth(alert.title);
                        onClose();
                      }
                    }}
                    className="text-emerald-800 font-bold hover:underline flex items-center gap-0.5"
                  >
                    <span>View Evidence</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs">
          <button
            onClick={() => pushNotificationService.markAllAsRead()}
            className="text-gray-500 hover:text-gray-800 font-bold"
          >
            Mark all read
          </button>

          <button
            onClick={onClose}
            className="bg-[#0A3D2E] hover:bg-[#0c4a37] text-white px-4 py-1.5 rounded-xl font-bold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
