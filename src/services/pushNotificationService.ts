import { LocalPushAlert, ResultType } from '../types';
import { storageService, SelectedLocation } from './storageService';

const PUSH_ALERTS_KEY = 'sabi_local_push_alerts';
const PUSH_PREFS_KEY = 'sabi_push_notifications_enabled';

class PushNotificationService {
  private alerts: LocalPushAlert[] = [];
  private listeners: Array<(alerts: LocalPushAlert[]) => void> = [];
  private audioContext: AudioContext | null = null;

  constructor() {
    this.loadAlerts();
    this.initSampleAlertsIfEmpty();
  }

  private loadAlerts() {
    try {
      const raw = localStorage.getItem(PUSH_ALERTS_KEY);
      if (raw) {
        this.alerts = JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Failed to parse local push alerts:', e);
      this.alerts = [];
    }
  }

  private saveAlerts() {
    try {
      localStorage.setItem(PUSH_ALERTS_KEY, JSON.stringify(this.alerts));
    } catch (e) {
      console.warn('Failed to persist local push alerts:', e);
    }
  }

  private initSampleAlertsIfEmpty() {
    if (this.alerts.length === 0) {
      this.alerts = [
        {
          id: 'alert_lagos_rice_fake',
          title: '🚨 Viral Plastic Rice Rumor Flagged in Ikeja LGA',
          message: 'A viral TikTok claim alleging artificial plastic rice distributed at computer village market has been debunked as FALSE.',
          state: 'Lagos',
          lga: 'Ikeja',
          area: 'Computer Village',
          category: 'rumor',
          verdict: 'FALSE',
          urgency: 'high',
          timestamp: '10 mins ago',
          read: false,
          sourcePlatform: 'tiktok'
        },
        {
          id: 'alert_abuja_fuel_panic',
          title: '⚠️ Suspicious Voice Note Circulating in Abuja Municipal',
          message: 'WhatsApp audio alleging immediate fuel queue scarcity across FCT is OUTDATED MEDIA from 2022.',
          state: 'FCT - Abuja',
          lga: 'Abuja Municipal',
          area: 'Central Business District',
          category: 'suspicious_media',
          verdict: 'OUTDATED MEDIA',
          urgency: 'urgent',
          timestamp: '25 mins ago',
          read: false,
          sourcePlatform: 'whatsapp'
        },
        {
          id: 'alert_osun_flood_warning',
          title: '📢 Flash Flood Misinformation in Osogbo LGA',
          message: 'Deepfake flood footage attributed to Osun river bridge verified as manipulated AI footage.',
          state: 'Osun',
          lga: 'Osogbo',
          area: 'Osogbo Central',
          category: 'deepfake_alert',
          verdict: 'FALSE',
          urgency: 'breaking',
          timestamp: '1 hour ago',
          read: true,
          sourcePlatform: 'twitter'
        },
        {
          id: 'alert_kano_market_alert',
          title: '🌾 Tomato Price Drop Confirmed at Dawanau Depot',
          message: 'Fresh basket price drop verified across Nassarawa LGA stalls (+18 spotter confirmations).',
          state: 'Kano',
          lga: 'Nassarawa',
          area: 'Dawanau Grain Depot',
          category: 'price_surge',
          verdict: 'TRUE',
          urgency: 'high',
          timestamp: '2 hours ago',
          read: true,
          sourcePlatform: 'local_spotter'
        },
        {
          id: 'alert_rivers_ph_rumor',
          title: '🛡️ Port Harcourt Night Curfew Claim Debunked',
          message: 'Social media post claiming mandatory state-wide curfew across Rivers LGA is UNVERIFIED & FALSE.',
          state: 'Rivers',
          lga: 'Port Harcourt',
          area: 'Old GRA',
          category: 'rumor',
          verdict: 'FALSE',
          urgency: 'urgent',
          timestamp: '3 hours ago',
          read: true,
          sourcePlatform: 'facebook'
        }
      ];
      this.saveAlerts();
    }
  }

  /**
   * Check if push notifications are enabled by user
   */
  public isPushEnabled(): boolean {
    const saved = localStorage.getItem(PUSH_PREFS_KEY);
    return saved === 'true';
  }

  /**
   * Toggle or set push notification preference
   */
  public async setPushEnabled(enabled: boolean): Promise<boolean> {
    if (enabled) {
      if ('Notification' in window) {
        if (Notification.permission === 'default') {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            localStorage.setItem(PUSH_PREFS_KEY, 'false');
            return false;
          }
        } else if (Notification.permission === 'denied') {
          localStorage.setItem(PUSH_PREFS_KEY, 'false');
          return false;
        }
      }
      localStorage.setItem(PUSH_PREFS_KEY, 'true');
      this.playAlertChime();
      return true;
    } else {
      localStorage.setItem(PUSH_PREFS_KEY, 'false');
      return false;
    }
  }

  /**
   * Play clean synthesized Web Audio alert chime
   */
  public playAlertChime() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      if (!this.audioContext) {
        this.audioContext = new AudioCtx();
      }
      
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const ctx = this.audioContext;
      const now = ctx.currentTime;
      
      // Dual-tone harmonic chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880.00, now + 0.12); // A5

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(440.00, now); // A4
      osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio chime notice:', e);
    }
  }

  /**
   * Get all alerts matching a specific State and optional LGA
   */
  public getAlertsForLocation(state: string, lga?: string): LocalPushAlert[] {
    return this.alerts.filter(a => {
      const stateMatch = a.state.toLowerCase() === state.toLowerCase() ||
        a.state.toLowerCase().includes(state.toLowerCase()) ||
        state.toLowerCase().includes(a.state.toLowerCase());
      
      if (!stateMatch) return false;
      if (!lga) return true;

      return !a.lga || a.lga.toLowerCase() === lga.toLowerCase() ||
        a.lga.toLowerCase().includes(lga.toLowerCase()) ||
        lga.toLowerCase().includes(a.lga.toLowerCase());
    });
  }

  /**
   * Get all alerts in chronological order
   */
  public getAllAlerts(): LocalPushAlert[] {
    return [...this.alerts];
  }

  /**
   * Push a new local alert to users in the specified State/LGA
   */
  public pushLocalAlert(alert: Omit<LocalPushAlert, 'id' | 'timestamp' | 'read'>): LocalPushAlert {
    const newAlert: LocalPushAlert = {
      ...alert,
      id: 'alert_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      timestamp: 'Just now',
      read: false
    };

    this.alerts.unshift(newAlert);
    this.saveAlerts();
    this.notify();

    // Check if the current user is in this state/LGA
    const activeLoc = storageService.getLocation();
    const isUserLocationMatch = 
      activeLoc.state.toLowerCase() === newAlert.state.toLowerCase() ||
      newAlert.state.toLowerCase().includes(activeLoc.state.toLowerCase());

    if (isUserLocationMatch) {
      this.playAlertChime();

      // Send native browser push notification if permitted
      if ('Notification' in window && Notification.permission === 'granted' && this.isPushEnabled()) {
        try {
          const notif = new Notification(`🚨 SABI Alert: ${newAlert.state}${newAlert.lga ? ` (${newAlert.lga})` : ''}`, {
            body: `${newAlert.title}\n${newAlert.message}`,
            icon: '/icon.png',
            badge: '/icon.png',
            tag: newAlert.id
          });
          notif.onclick = () => {
            window.focus();
          };
        } catch (e) {
          console.warn('Native notification push error:', e);
        }
      }

      // Also add to app notifications
      storageService.addNotification({
        id: 'notif_' + newAlert.id,
        title: `🚨 Local Alert (${newAlert.state}): ${newAlert.title}`,
        message: newAlert.message,
        type: 'local_alert',
        timestamp: 'Just now',
        read: false
      });
    }

    return newAlert;
  }

  /**
   * Simulate a live local verification alert for the user's active state
   */
  public simulateStateRumorAlert(location: SelectedLocation): LocalPushAlert {
    const claims = [
      {
        title: `🚨 Viral Fuel Subsidy Audio in ${location.lga || location.state}`,
        message: `Circulating WhatsApp audio alleging shutdown of petrol stations in ${location.area || location.lga || location.state} verified as OUTDATED MEDIA.`,
        category: 'suspicious_media' as const,
        verdict: 'OUTDATED MEDIA' as ResultType,
        sourcePlatform: 'whatsapp' as const
      },
      {
        title: `⚠️ Deepfake Video Claim in ${location.state}`,
        message: `Viral TikTok video claiming collapsed infrastructure in ${location.lga || location.state} identified as AI-generated deepfake.`,
        category: 'deepfake_alert' as const,
        verdict: 'FALSE' as ResultType,
        sourcePlatform: 'tiktok' as const
      },
      {
        title: `📢 Market Price Surge Report at ${location.area || location.lga || location.state}`,
        message: `Spike in garri & palm oil prices reported in ${location.lga}. Sabi spotters have verified local retail prices.`,
        category: 'price_surge' as const,
        verdict: 'TRUE' as ResultType,
        sourcePlatform: 'local_spotter' as const
      }
    ];

    const randomClaim = claims[Math.floor(Math.random() * claims.length)];

    return this.pushLocalAlert({
      title: randomClaim.title,
      message: randomClaim.message,
      state: location.state,
      lga: location.lga,
      area: location.area,
      category: randomClaim.category,
      verdict: randomClaim.verdict,
      urgency: 'high',
      sourcePlatform: randomClaim.sourcePlatform
    });
  }

  public markAlertAsRead(id: string) {
    this.alerts = this.alerts.map(a => a.id === id ? { ...a, read: true } : a);
    this.saveAlerts();
    this.notify();
  }

  public markAllAsRead() {
    this.alerts = this.alerts.map(a => ({ ...a, read: true }));
    this.saveAlerts();
    this.notify();
  }

  public subscribe(listener: (alerts: LocalPushAlert[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l([...this.alerts]));
  }
}

export const pushNotificationService = new PushNotificationService();
