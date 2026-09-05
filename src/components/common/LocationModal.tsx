import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Check, 
  Loader2, 
  AlertCircle,
  Building2,
  Globe,
  Compass
} from 'lucide-react';
import { NIGERIAN_STATES } from '../../data/nigerianLocations';
import { storageService, SelectedLocation } from '../../services/storageService';
import { locationService } from '../../services/locationService';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const currentLocation = storageService.getLocation();
  
  const [mode, setMode] = useState<'nigeria' | 'custom'>('nigeria');
  const [selectedState, setSelectedState] = useState<string>(currentLocation.state);
  const [selectedLga, setSelectedLga] = useState<string>(currentLocation.lga);
  const [areaInput, setAreaInput] = useState<string>(currentLocation.area);
  const [streetInput, setStreetInput] = useState<string>(currentLocation.street || '');
  const [countryInput, setCountryInput] = useState<string>(currentLocation.country || 'Nigeria');
  const [customPlaceInput, setCustomPlaceInput] = useState<string>(
    currentLocation.rawAddress || `${currentLocation.area}, ${currentLocation.state}`
  );
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);
  const [detectedCoords, setDetectedCoords] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [isTracing, setIsTracing] = useState<boolean>(storageService.isTracingEnabled());

  // Get LGAs for selected state
  const stateData = NIGERIAN_STATES.find(s => s.state.toLowerCase() === selectedState.toLowerCase()) || NIGERIAN_STATES[0];
  const lgaOptions = stateData.lgas;

  // When state changes, reset selected LGA to first LGA in that state if not valid
  useEffect(() => {
    if (!lgaOptions.some(l => l.name === selectedLga)) {
      setSelectedLga(lgaOptions[0]?.name || '');
    }
  }, [selectedState, lgaOptions, selectedLga]);

  if (!isOpen) return null;

  const handleUseGps = async () => {
    setIsLocating(true);
    setGpsStatus(null);

    try {
      const loc = await locationService.trackAndApplyUserLocation();
      if (loc) {
        setSelectedState(loc.state);
        setSelectedLga(loc.lga);
        setAreaInput(loc.area);
        setCountryInput(loc.country || 'Nigeria');
        setCustomPlaceInput(loc.rawAddress || `${loc.area}, ${loc.state}`);
        if (loc.latitude && loc.longitude) {
          setDetectedCoords({
            latitude: loc.latitude,
            longitude: loc.longitude,
            accuracy: loc.accuracyMeters || 15
          });
        }
        setGpsStatus(`📍 Accurate GPS Location Applied: ${loc.area || loc.lga}, ${loc.state} (${loc.country || 'Nigeria'}). Accuracy: ±${Math.round(loc.accuracyMeters || 15)}m`);
      } else {
        setGpsStatus('Could not determine exact location. Please select your location manually.');
      }
    } catch (err: any) {
      setGpsStatus('Location permission denied or unavailable. Please select your location manually.');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSave = () => {
    let loc: SelectedLocation;

    if (mode === 'custom' && customPlaceInput.trim()) {
      const parts = customPlaceInput.split(',').map(p => p.trim());
      const area = parts[0] || 'Custom Area';
      const state = parts[1] || parts[0] || 'Global';
      const country = parts[2] || countryInput || 'Worldwide';

      loc = {
        state: state,
        lga: area,
        area: area,
        country: country,
        rawAddress: customPlaceInput.trim(),
        isGpsDerived: !!gpsStatus,
        latitude: detectedCoords?.latitude,
        longitude: detectedCoords?.longitude,
        accuracyMeters: detectedCoords?.accuracy
      };
    } else {
      loc = {
        state: selectedState,
        lga: selectedLga,
        area: areaInput.trim() || selectedLga,
        street: streetInput.trim() || undefined,
        exactAddress: streetInput.trim() ? `${streetInput.trim()}, ${areaInput.trim() || selectedLga}, ${selectedState}` : undefined,
        country: countryInput || 'Nigeria',
        rawAddress: `${streetInput.trim() ? streetInput.trim() + ', ' : ''}${areaInput.trim() || selectedLga}, ${selectedLga}, ${selectedState}`,
        isGpsDerived: !!gpsStatus,
        latitude: detectedCoords?.latitude,
        longitude: detectedCoords?.longitude,
        accuracyMeters: detectedCoords?.accuracy
      };
    }

    storageService.setLocation(loc);
    onClose();
  };

  const currentLgaData = lgaOptions.find(l => l.name === selectedLga);
  const popularMarkets = currentLgaData?.majorMarkets || [];

  const POPULAR_GLOBAL_HUBS = [
    { label: 'Port Harcourt, Rivers', state: 'Rivers', lga: 'Port Harcourt', area: 'Mile 1 Market', country: 'Nigeria' },
    { label: 'Abuja (FCT)', state: 'Federal Capital Territory', lga: 'Municipal', area: 'Maitama / Wuse 2', country: 'Nigeria' },
    { label: 'Kano, Kano State', state: 'Kano', lga: 'Fagge', area: 'Dawanau Grain Market', country: 'Nigeria' },
    { label: 'Ibadan, Oyo State', state: 'Oyo', lga: 'Ibadan North', area: 'Bodija Market', country: 'Nigeria' },
    { label: 'London, United Kingdom', state: 'Greater London', lga: 'Westminster', area: 'Central London', country: 'United Kingdom' },
    { label: 'New York, USA', state: 'New York', lga: 'Manhattan', area: 'Midtown', country: 'United States' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="location-modal-container">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#0A3D2E] text-white">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#FFD60A]" />
            <h2 className="text-lg font-bold font-display">Set Your Location</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* REAL-TIME GEOLOCATION TRACING TOGGLE */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isTracing 
              ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800/40' 
              : 'bg-gray-50 border-gray-200 dark:bg-gray-800/40 dark:border-gray-700/60'
          }`}>
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${isTracing ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`} />
                  <span className="text-xs font-black uppercase tracking-wider text-gray-900 dark:text-white font-display">
                    Real-Time Geolocation Tracing
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-tight">
                  {isTracing 
                    ? 'Tracing mode is ON: High-priority proximity safety warnings & nearby rumor alerts are active.'
                    : 'Tracing mode is OFF: Automatic proximity rumor detection is paused.'}
                </p>
              </div>

              {/* TOGGLE SWITCH */}
              <button
                type="button"
                id="location-tracing-toggle-btn"
                onClick={() => {
                  const next = !isTracing;
                  setIsTracing(next);
                  storageService.setTracingEnabled(next);
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isTracing ? 'bg-emerald-600' : 'bg-gray-300 dark:bg-gray-700'
                }`}
                role="switch"
                aria-checked={isTracing}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isTracing ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="mt-2.5 pt-2 border-t border-gray-200/60 dark:border-gray-700/60 flex items-center justify-between text-[10px]">
              <span className={`font-black uppercase px-2 py-0.5 rounded-md ${
                isTracing 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                STATUS: {isTracing ? 'TRACING ACTIVE' : 'TRACING PAUSED'}
              </span>
              <span className="text-gray-400">Strictly on-device privacy guarantee</span>
            </div>
          </div>

          {/* GPS Location Button */}
          <div>
            <button
              id="detect-actual-location-btn"
              type="button"
              onClick={handleUseGps}
              disabled={isLocating}
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-[#0A3D2E] border border-emerald-200 font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4 text-[#0A3D2E]" />
              )}
              <span>{isLocating ? 'Detecting Your Actual Location...' : 'Use My Current Location (Show Actual GPS)'}</span>
            </button>

            {gpsStatus && (
              <p className="mt-2.5 text-xs text-emerald-900 bg-emerald-50/90 p-3 rounded-xl border border-emerald-300 flex items-start gap-2 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span className="font-medium leading-relaxed">{gpsStatus}</span>
              </p>
            )}
          </div>

          {/* Mode Selector Tabs: Nigeria States vs Custom/Global Place */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-2xl">
            <button
              type="button"
              onClick={() => setMode('nigeria')}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'nigeria'
                  ? 'bg-white text-[#0A3D2E] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Nigerian States</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('custom')}
              className={`py-2 px-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'custom'
                  ? 'bg-white text-[#0A3D2E] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Input Other Places</span>
            </button>
          </div>

          {mode === 'custom' ? (
            /* Custom Place / Any Global City Input */
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Input Any City, Town, State or Country
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    id="custom-place-input"
                    placeholder="e.g. Port Harcourt, Rivers State or London, UK..."
                    value={customPlaceInput}
                    onChange={(e) => setCustomPlaceInput(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-500">
                  Type any location worldwide or across Nigeria to see relevant local evidence and market truths.
                </p>
              </div>

              {/* Quick Hub Presets */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  Quick Select Hubs:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_GLOBAL_HUBS.map(hub => (
                    <button
                      key={hub.label}
                      type="button"
                      onClick={() => {
                        setCustomPlaceInput(`${hub.area}, ${hub.state}, ${hub.country}`);
                        setSelectedState(hub.state);
                        setSelectedLga(hub.lga);
                        setAreaInput(hub.area);
                        setCountryInput(hub.country);
                      }}
                      className="text-xs bg-gray-100 hover:bg-emerald-50 hover:border-emerald-300 border border-gray-200 text-gray-800 px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium"
                    >
                      {hub.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Nigerian States & LGAs */
            <div className="space-y-4">
              {/* State Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  State (36 States + FCT)
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none cursor-pointer"
                >
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s.state} value={s.state}>
                      {s.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* LGA Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Local Government Area (LGA)
                </label>
                <select
                  value={selectedLga}
                  onChange={(e) => setSelectedLga(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none cursor-pointer"
                >
                  {lgaOptions.map((lga) => (
                    <option key={lga.name} value={lga.name}>
                      {lga.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area / Landmark / Market */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Area / Market / Landmark
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Dei-Dei Market, Yaba, Bodija..."
                    value={areaInput}
                    onChange={(e) => setAreaInput(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                  />
                </div>

                {/* Popular suggestions */}
                {popularMarkets.length > 0 && (
                  <div className="mt-2">
                    <span className="text-[11px] text-gray-500 font-medium block mb-1">
                      Notable Hubs & Markets in {selectedLga}:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {popularMarkets.map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setAreaInput(m)}
                          className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Street / Exact Location Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Exact Street Name / Road (Optional)
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#0A3D2E] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    id="location-street-input"
                    placeholder="e.g. Herbert Macaulay Way, Awolowo Road..."
                    value={streetInput}
                    onChange={(e) => setStreetInput(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-500">
                  Adding your street enables instant proximity notifications whenever a rumor is spotted near you.
                </p>
              </div>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Your location allows SABI to show ground-truth evidence, state-specific social media rumors, and nearby verified food market prices.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 rounded-xl cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="save-location-btn"
            onClick={handleSave}
            className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Save Location
          </button>
        </div>

      </div>
    </div>
  );
};

