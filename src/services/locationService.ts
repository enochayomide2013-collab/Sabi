import { storageService, SelectedLocation } from './storageService';
import { NIGERIAN_STATES } from '../data/nigerianLocations';

export interface GpsCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number | null;
  heading?: number | null;
  speed?: number | null;
  timestamp: number;
}

export interface GeocodedLocationResult {
  state: string;
  lga: string;
  area: string;
  street?: string;
  exactAddress?: string;
  country: string;
  displayName: string;
  isGpsDerived: boolean;
  latitude: number;
  longitude: number;
  accuracy: number;
}

// Coordinate centroids & bounding boxes for Nigerian States & FCT
interface StateCentroid {
  state: string;
  defaultLga: string;
  defaultArea: string;
  lat: number;
  lon: number;
}

const NIGERIA_STATE_CENTROIDS: StateCentroid[] = [
  { state: 'Abia', defaultLga: 'Umuahia North', defaultArea: 'Umuahia City', lat: 5.532, lon: 7.486 },
  { state: 'Adamawa', defaultLga: 'Yola North', defaultArea: 'Jimeta Yola', lat: 9.209, lon: 12.482 },
  { state: 'Akwa Ibom', defaultLga: 'Uyo', defaultArea: 'Uyo Metropolis', lat: 5.038, lon: 7.913 },
  { state: 'Anambra', defaultLga: 'Awka South', defaultArea: 'Awka City', lat: 6.221, lon: 7.068 },
  { state: 'Bauchi', defaultLga: 'Bauchi', defaultArea: 'Bauchi Township', lat: 10.315, lon: 9.844 },
  { state: 'Bayelsa', defaultLga: 'Yenagoa', defaultArea: 'Swali Yenagoa', lat: 4.927, lon: 6.265 },
  { state: 'Benue', defaultLga: 'Makurdi', defaultArea: 'Makurdi Metropolis', lat: 7.732, lon: 8.539 },
  { state: 'Borno', defaultLga: 'Maiduguri', defaultArea: 'Monday Market Area', lat: 11.833, lon: 13.151 },
  { state: 'Cross River', defaultLga: 'Calabar Municipal', defaultArea: 'Calabar Urban', lat: 4.958, lon: 8.327 },
  { state: 'Delta', defaultLga: 'Oshimili South', defaultArea: 'Asaba Metropolis', lat: 6.198, lon: 6.734 },
  { state: 'Ebonyi', defaultLga: 'Abakaliki', defaultArea: 'Abakaliki Township', lat: 6.325, lon: 8.113 },
  { state: 'Edo', defaultLga: 'Oredo', defaultArea: 'Ring Road Benin', lat: 6.335, lon: 5.626 },
  { state: 'Ekiti', defaultLga: 'Ado Ekiti', defaultArea: 'Ado Central', lat: 7.621, lon: 5.221 },
  { state: 'Enugu', defaultLga: 'Enugu North', defaultArea: 'Ogbete Market Zone', lat: 6.458, lon: 7.546 },
  { state: 'FCT - Abuja', defaultLga: 'Abuja Municipal', defaultArea: 'Central Business District', lat: 9.076, lon: 7.398 },
  { state: 'Gombe', defaultLga: 'Gombe', defaultArea: 'Gombe City', lat: 10.289, lon: 11.167 },
  { state: 'Imo', defaultLga: 'Owerri Municipal', defaultArea: 'Douglas Road Owerri', lat: 5.485, lon: 7.035 },
  { state: 'Jigawa', defaultLga: 'Dutse', defaultArea: 'Dutse Central', lat: 11.759, lon: 9.339 },
  { state: 'Kaduna', defaultLga: 'Kaduna North', defaultArea: 'Ahmadu Bello Way', lat: 10.510, lon: 7.416 },
  { state: 'Kano', defaultLga: 'Nassarawa', defaultArea: 'Sabon Gari Kano', lat: 12.002, lon: 8.591 },
  { state: 'Katsina', defaultLga: 'Katsina', defaultArea: 'Katsina City', lat: 12.990, lon: 7.600 },
  { state: 'Kebbi', defaultLga: 'Birnin Kebbi', defaultArea: 'Birnin Kebbi Town', lat: 12.453, lon: 4.197 },
  { state: 'Kogi', defaultLga: 'Lokoja', defaultArea: 'Lokoja Riverport Zone', lat: 7.797, lon: 6.740 },
  { state: 'Kwara', defaultLga: 'Ilorin South', defaultArea: 'Ilorin Central', lat: 8.479, lon: 4.542 },
  { state: 'Lagos', defaultLga: 'Ikeja', defaultArea: 'Alausa Ikeja', lat: 6.601, lon: 3.351 },
  { state: 'Nasarawa', defaultLga: 'Lafia', defaultArea: 'Lafia Township', lat: 8.493, lon: 8.515 },
  { state: 'Niger', defaultLga: 'Chanchaga', defaultArea: 'Minna Central', lat: 9.613, lon: 6.556 },
  { state: 'Ogun', defaultLga: 'Abeokuta South', defaultArea: 'Abeokuta Metropolis', lat: 7.147, lon: 3.361 },
  { state: 'Ondo', defaultLga: 'Akure South', defaultArea: 'Akure City', lat: 7.257, lon: 5.205 },
  { state: 'Osun', defaultLga: 'Osogbo', defaultArea: 'Osogbo Central', lat: 7.782, lon: 4.541 },
  { state: 'Oyo', defaultLga: 'Ibadan North', defaultArea: 'Bodija Ibadan', lat: 7.377, lon: 3.947 },
  { state: 'Plateau', defaultLga: 'Jos North', defaultArea: 'Jos Terminus', lat: 9.896, lon: 8.858 },
  { state: 'Rivers', defaultLga: 'Port Harcourt', defaultArea: 'Old GRA Port Harcourt', lat: 4.815, lon: 7.049 },
  { state: 'Sokoto', defaultLga: 'Sokoto North', defaultArea: 'Sokoto Central', lat: 13.005, lon: 5.247 },
  { state: 'Taraba', defaultLga: 'Jalingo', defaultArea: 'Jalingo Metropolis', lat: 8.893, lon: 11.360 },
  { state: 'Yobe', defaultLga: 'Damaturu', defaultArea: 'Damaturu Town', lat: 11.747, lon: 11.960 },
  { state: 'Zamfara', defaultLga: 'Gusau', defaultArea: 'Gusau City', lat: 12.162, lon: 6.661 }
];

// Haversine formula to compute distance in km
function computeHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Find nearest Nigerian state by spatial distance
function matchNearestNigerianState(lat: number, lon: number): StateCentroid {
  let nearest = NIGERIA_STATE_CENTROIDS[0];
  let minDistance = Infinity;

  for (const item of NIGERIA_STATE_CENTROIDS) {
    const d = computeHaversineDistance(lat, lon, item.lat, item.lon);
    if (d < minDistance) {
      minDistance = d;
      nearest = item;
    }
  }

  return nearest;
}

// Check if coordinates roughly fall inside Nigeria: lat 4.0 to 14.0, lon 2.5 to 15.0
export function isCoordinatesInNigeria(lat: number, lon: number): boolean {
  return lat >= 4.0 && lat <= 14.2 && lon >= 2.6 && lon <= 14.9;
}

class LocationService {
  private activeWatchId: number | null = null;
  private lastKnownPosition: GpsCoordinates | null = null;

  /**
   * Request live GPS position with high accuracy
   */
  public async getLiveGpsCoordinates(): Promise<GpsCoordinates> {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by your browser.');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: GpsCoordinates = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: Math.round(pos.coords.accuracy || 15),
            altitude: pos.coords.altitude,
            heading: pos.coords.heading,
            speed: pos.coords.speed,
            timestamp: pos.timestamp || Date.now()
          };
          this.lastKnownPosition = coords;
          resolve(coords);
        },
        (err) => {
          let message = 'Unable to retrieve your location.';
          if (err.code === err.PERMISSION_DENIED) {
            message = 'Location permission was denied. Please allow location access in your browser settings.';
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            message = 'Location position is currently unavailable.';
          } else if (err.code === err.TIMEOUT) {
            message = 'Location request timed out. Retrying with network location.';
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0
        }
      );
    });
  }

  /**
   * Reverse geocodes coordinates to State, LGA, Area, and Country
   */
  public async reverseGeocode(lat: number, lon: number, accuracy = 15): Promise<GeocodedLocationResult> {
    try {
      const response = await fetch(`/api/reverse-geocode?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`);
      if (response.ok) {
        const data = await response.json();
        
        let resolvedState = data.state || '';
        let resolvedLga = data.lga || '';
        let resolvedArea = data.area || '';
        const resolvedCountry = data.country || (isCoordinatesInNigeria(lat, lon) ? 'Nigeria' : 'Global');

        // Match against Nigerian states if inside Nigeria
        if (resolvedCountry.toLowerCase().includes('nigeria') || isCoordinatesInNigeria(lat, lon)) {
          const matched = NIGERIA_STATE_CENTROIDS.find(
            s => s.state.toLowerCase() === resolvedState.toLowerCase() ||
                 resolvedState.toLowerCase().includes(s.state.toLowerCase()) ||
                 s.state.toLowerCase().includes(resolvedState.toLowerCase())
          );

          if (matched) {
            resolvedState = matched.state;
            resolvedLga = resolvedLga || matched.defaultLga;
            resolvedArea = resolvedArea || matched.defaultArea;
          } else {
            // Nearest coordinate spatial fallback
            const nearest = matchNearestNigerianState(lat, lon);
            resolvedState = nearest.state;
            resolvedLga = resolvedLga || nearest.defaultLga;
            resolvedArea = resolvedArea || nearest.defaultArea;
          }
        }

        return {
          state: resolvedState || 'Lagos',
          lga: resolvedLga || 'Ikeja',
          area: resolvedArea || resolvedLga || 'Local Area',
          street: data.street || 'Current Street',
          exactAddress: data.exactAddress || data.displayName || `${data.street ? data.street + ', ' : ''}${resolvedArea || resolvedLga}, ${resolvedState}, ${resolvedCountry}`,
          country: resolvedCountry,
          displayName: data.displayName || `${resolvedArea || resolvedLga}, ${resolvedState}, ${resolvedCountry}`,
          isGpsDerived: true,
          latitude: lat,
          longitude: lon,
          accuracy
        };
      }
    } catch (e) {
      console.warn('Backend reverse-geocode failed, applying spatial fallback', e);
    }

    // Spatial fallback
    if (isCoordinatesInNigeria(lat, lon)) {
      const nearest = matchNearestNigerianState(lat, lon);
      const fallbackStreet = 'Main Access Road';
      const exact = `${fallbackStreet}, ${nearest.defaultArea}, ${nearest.defaultLga}, ${nearest.state} State, Nigeria`;
      return {
        state: nearest.state,
        lga: nearest.defaultLga,
        area: nearest.defaultArea,
        street: fallbackStreet,
        exactAddress: exact,
        country: 'Nigeria',
        displayName: exact,
        isGpsDerived: true,
        latitude: lat,
        longitude: lon,
        accuracy
      };
    }

    const internationalExact = `Street Coordinates (${lat.toFixed(4)}°, ${lon.toFixed(4)}°), Global Region`;
    return {
      state: 'International',
      lga: 'City Region',
      area: `Coordinates (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
      street: `Lat ${lat.toFixed(4)}°, Lon ${lon.toFixed(4)}°`,
      exactAddress: internationalExact,
      country: 'Global',
      displayName: `GPS: ${lat.toFixed(3)}°N, ${lon.toFixed(3)}°E`,
      isGpsDerived: true,
      latitude: lat,
      longitude: lon,
      accuracy
    };
  }

  /**
   * Calculates Haversine distance in meters between two lat/lon points
   */
  public calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
  }

  /**
   * Formats distance nicely (e.g. "250 m" or "3.4 km")
   */
  public formatDistance(meters: number): string {
    if (meters < 1000) {
      return `${meters} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  }

  /**
   * Full one-tap GPS detect and save to application state
   */
  public async trackAndApplyUserLocation(): Promise<SelectedLocation> {
    const coords = await this.getLiveGpsCoordinates();
    const geocoded = await this.reverseGeocode(coords.latitude, coords.longitude, coords.accuracy);

    const newLocation: SelectedLocation = {
      state: geocoded.state,
      lga: geocoded.lga,
      area: geocoded.area,
      street: geocoded.street || 'Current Street / Landmark',
      exactAddress: geocoded.exactAddress || geocoded.displayName,
      country: geocoded.country,
      isGpsDerived: true,
      rawAddress: geocoded.displayName,
      latitude: coords.latitude,
      longitude: coords.longitude,
      accuracyMeters: coords.accuracy,
      accuracy: coords.accuracy,
      timestamp: coords.timestamp,
      trackedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    storageService.setLocation(newLocation);
    window.dispatchEvent(new CustomEvent('sabi_location_changed', { detail: newLocation }));
    return newLocation;
  }

  /**
   * Start watching location in real-time
   */
  public startLiveTracking(
    onLocationUpdate: (loc: SelectedLocation) => void,
    onError?: (err: Error) => void
  ): boolean {
    if (!navigator.geolocation) return false;
    this.stopLiveTracking();

    this.activeWatchId = navigator.geolocation.watchPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const accuracy = Math.round(pos.coords.accuracy || 15);
          const geocoded = await this.reverseGeocode(lat, lon, accuracy);

          const loc: SelectedLocation = {
            state: geocoded.state,
            lga: geocoded.lga,
            area: geocoded.area,
            country: geocoded.country,
            isGpsDerived: true,
            rawAddress: geocoded.displayName,
            latitude: lat,
            longitude: lon,
            accuracyMeters: accuracy,
            accuracy,
            timestamp: pos.timestamp || Date.now(),
            trackedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          };

          storageService.setLocation(loc);
          onLocationUpdate(loc);
          window.dispatchEvent(new CustomEvent('sabi_location_changed', { detail: loc }));
        } catch (e: any) {
          onError?.(e);
        }
      },
      (err) => {
        onError?.(new Error(err.message));
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 15000
      }
    );

    return true;
  }

  public stopLiveTracking() {
    if (this.activeWatchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.activeWatchId);
      this.activeWatchId = null;
    }
  }

  public isTrackingActive(): boolean {
    return this.activeWatchId !== null;
  }

  public getLastKnownPosition(): GpsCoordinates | null {
    return this.lastKnownPosition;
  }
}

export const locationService = new LocationService();
