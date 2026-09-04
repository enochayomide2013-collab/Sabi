export interface CachedFactCheck {
  id: string;
  claim: string;
  verdict: 'TRUE' | 'FALSE' | 'OUTDATED' | 'MISLEADING';
  summary: string;
  source: string;
  timestamp: string;
}

const STORAGE_KEY_DATA_SAVER = 'sabi_data_saver_enabled';
const STORAGE_KEY_CACHED_FACTS = 'sabi_cached_fact_checks';

const INITIAL_CACHE: CachedFactCheck[] = [
  {
    id: 'cache-1',
    claim: 'Fuel Price Hike to ₦1,850/L Across Nigeria Tomorrow',
    verdict: 'FALSE',
    summary: 'NNPCL and IPMAN confirm adequate fuel supply and no price revisions.',
    source: 'WhatsApp Viral Voice Note',
    timestamp: '2026-09-03'
  },
  {
    id: 'cache-2',
    claim: 'Federal Government Grain Distribution Free Registration Link',
    verdict: 'FALSE',
    summary: 'Phishing website collecting bank details. Official distributions are handled via state ministries.',
    source: 'TikTok & Facebook Ads',
    timestamp: '2026-09-02'
  },
  {
    id: 'cache-3',
    claim: 'Kano Sabon Gari Market Rice Price Cap Announcement',
    verdict: 'TRUE',
    summary: 'Local traders association agreed on price stabilization for local rice.',
    source: 'Verified Field Spotter',
    timestamp: '2026-09-01'
  }
];

export const isDataSaverEnabled = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY_DATA_SAVER) === 'true';
  } catch (e) {
    return false;
  }
};

export const setDataSaverEnabled = (enabled: boolean): void => {
  try {
    localStorage.setItem(STORAGE_KEY_DATA_SAVER, enabled ? 'true' : 'false');
  } catch (e) {
    console.error(e);
  }
};

export const getCachedFactChecks = (): CachedFactCheck[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CACHED_FACTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_CACHED_FACTS, JSON.stringify(INITIAL_CACHE));
      return INITIAL_CACHE;
    }
    return JSON.parse(raw);
  } catch (e) {
    return INITIAL_CACHE;
  }
};

export const saveCachedFactCheck = (item: CachedFactCheck): void => {
  try {
    const existing = getCachedFactChecks();
    const updated = [item, ...existing.filter(i => i.id !== item.id)];
    localStorage.setItem(STORAGE_KEY_CACHED_FACTS, JSON.stringify(updated.slice(0, 20)));
  } catch (e) {
    console.error(e);
  }
};
