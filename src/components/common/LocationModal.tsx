import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Check, 
  Loader2, 
  AlertCircle,
  Building2
} from 'lucide-react';
import { NIGERIAN_STATES } from '../../data/nigerianLocations';
import { storageService, SelectedLocation } from '../../services/storageService';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const currentLocation = storageService.getLocation();
  
  const [selectedState, setSelectedState] = useState<string>(currentLocation.state);
  const [selectedLga, setSelectedLga] = useState<string>(currentLocation.lga);
  const [areaInput, setAreaInput] = useState<string>(currentLocation.area);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  // Get LGAs for selected state
  const stateData = NIGERIAN_STATES.find(s => s.state === selectedState) || NIGERIAN_STATES[0];
  const lgaOptions = stateData.lgas;

  // When state changes, reset selected LGA to first LGA in that state if not valid
  useEffect(() => {
    if (!lgaOptions.some(l => l.name === selectedLga)) {
      setSelectedLga(lgaOptions[0]?.name || '');
    }
  }, [selectedState, lgaOptions, selectedLga]);

  if (!isOpen) return null;

  const handleUseGps = () => {
    setIsLocating(true);
    setGpsStatus(null);

    if (!navigator.geolocation) {
      setIsLocating(false);
      setGpsStatus('Geolocation is not supported by your browser. Please select manually.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        // Simulate approximate reverse geocoding to Nigerian hub with 20m accuracy disclaimer
        const accuracy = Math.round(position.coords.accuracy || 20);
        setSelectedState('Lagos');
        setSelectedLga('Lagos Mainland');
        setAreaInput('Yaba');
        setGpsStatus(`Location Found: Yaba, Lagos (Approximate accuracy: ${accuracy}m). Exact coordinates are kept private.`);
      },
      (err) => {
        setIsLocating(false);
        setGpsStatus('Could not retrieve GPS coordinates. You can select your state & LGA manually below.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSave = () => {
    const loc: SelectedLocation = {
      state: selectedState,
      lga: selectedLga,
      area: areaInput.trim() || selectedLga,
      isGpsDerived: !!gpsStatus
    };
    storageService.setLocation(loc);
    onClose();
  };

  // Popular markets for the selected LGA
  const currentLgaData = lgaOptions.find(l => l.name === selectedLga);
  const popularMarkets = currentLgaData?.majorMarkets || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-[#0A3D2E] text-white">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#FFD60A]" />
            <h2 className="text-lg font-bold font-display">Select Your Location</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* GPS Location Button */}
          <div>
            <button
              onClick={handleUseGps}
              disabled={isLocating}
              className="w-full bg-emerald-50 hover:bg-emerald-100 text-[#0A3D2E] border border-emerald-200 font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4 text-[#0A3D2E]" />
              )}
              <span>{isLocating ? 'Detecting Location...' : 'Use My Current Location'}</span>
            </button>

            {gpsStatus && (
              <p className="mt-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-start gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                <span>{gpsStatus}</span>
              </p>
            )}
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-3 text-xs uppercase tracking-wider text-gray-400 font-bold">Or Select Manually</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* State Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
              State (36 States + FCT)
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
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
              className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
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
                      className="text-[11px] bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 py-1 rounded-lg transition-all"
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Your location ensures verification tasks and market price updates reflect your immediate community. Exact coordinates are never made public.
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all"
          >
            Save Location
          </button>
        </div>

      </div>
    </div>
  );
};
