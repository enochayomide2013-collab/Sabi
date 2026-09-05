import React, { useState, useEffect, useRef } from 'react';
import { 
  MapPin, 
  Sparkles, 
  HelpCircle, 
  Flame, 
  Menu, 
  X, 
  BookOpen, 
  Share2, 
  Info,
  CheckCircle,
  MessageSquare,
  LogIn,
  LogOut,
  Map,
  Activity,
  BarChart2,
  ShieldCheck,
  Globe,
  Radio,
  Navigation,
  ChevronDown,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, AppLanguage, LocalPushAlert } from '../../types';
import { storageService, SelectedLocation } from '../../services/storageService';
import { locationService } from '../../services/locationService';
import { languageService, LANGUAGE_NAMES } from '../../services/languageService';
import { pushNotificationService } from '../../services/pushNotificationService';
import { Tooltip } from './Tooltip';
import { StatusTitleModal } from './StatusTitleModal';
import { TrustLevelModal } from './TrustLevelModal';
import { LocalAlertsModal } from './LocalAlertsModal';
import { SuggestionBoxModal } from './SuggestionBoxModal';

interface HeaderProps {
  currentTab: string;
  activeLocation: SelectedLocation;
  onOpenLocationModal: () => void;
  onNavigate: (tab: string) => void;
  onOpenAuthModal: (mode: 'signin' | 'signup' | 'admin') => void;
  onOpenSaboAi: () => void;
  onOpenNotifications: () => void;
  onOpenTutorial: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
  onlineCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  activeLocation,
  onOpenLocationModal,
  onNavigate,
  onOpenAuthModal,
  onOpenSaboAi,
  onOpenNotifications,
  onOpenTutorial,
  isDarkMode,
  onToggleDarkMode,
  onlineCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isTrustModalOpen, setIsTrustModalOpen] = useState(false);
  const [isLocalAlertsOpen, setIsLocalAlertsOpen] = useState(false);
  const [isSuggestionBoxOpen, setIsSuggestionBoxOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isLocatingNow, setIsLocatingNow] = useState(false);
  const [isTracing, setIsTracing] = useState<boolean>(storageService.isTracingEnabled());
  
  const [currentLang, setCurrentLang] = useState<AppLanguage>(languageService.getLanguage());
  const [user, setUser] = useState<UserProfile>(storageService.getUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(storageService.isUserLoggedIn());
  const [localAlerts, setLocalAlerts] = useState<LocalPushAlert[]>(pushNotificationService.getAlertsForLocation(activeLocation.state, activeLocation.lga));

  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubStorage = storageService.subscribe(() => {
      setUser(storageService.getUser());
      setIsLoggedIn(storageService.isUserLoggedIn());
      setIsTracing(storageService.isTracingEnabled());
    });

    const unsubLang = languageService.subscribe((lang) => {
      setCurrentLang(lang);
    });

    const unsubPush = pushNotificationService.subscribe(() => {
      setLocalAlerts(pushNotificationService.getAlertsForLocation(activeLocation.state, activeLocation.lga));
    });

    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubStorage();
      unsubLang();
      unsubPush();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeLocation.state, activeLocation.lga]);

  const handleShareApp = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleSignOut = () => {
    storageService.signOut();
    setUser(storageService.getUser());
    setIsLoggedIn(false);
    onNavigate('home');
    setMobileMenuOpen(false);
  };

  const handleRefreshGpsLocation = async () => {
    setIsLocatingNow(true);
    try {
      await locationService.trackAndApplyUserLocation();
    } catch (e) {
      console.warn('GPS detect error:', e);
      onOpenLocationModal();
    } finally {
      setIsLocatingNow(false);
    }
  };

  const t = languageService.getDictionary();
  const unreadAlertsCount = localAlerts.filter(a => !a.read).length;

  return (
    <header className="sticky top-0 z-40 bg-[#0A3D2E] text-white shadow-md border-b border-emerald-800" id="sabi-main-header">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Location & Geolocation Pulse */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group text-left transition-transform active:scale-95 cursor-pointer"
            aria-label="SABI Home"
          >
            <div className="w-9 h-9 rounded-xl bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform font-display">
              S
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight font-display text-white">SABI</span>
                <span className="text-[9px] font-black bg-[#FFD60A] text-[#0A3D2E] px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  LIVE
                </span>
              </div>
              <span className="text-[9px] text-emerald-200 font-medium block -mt-1 hidden sm:block">
                {t.tagline}
              </span>
            </div>
          </button>

          {/* Location Selector Pill */}
          <Tooltip content={`Selected: ${activeLocation.state}. Click to switch state/LGA and see local foodstuff prices.`} position="bottom">
            <button
              onClick={onOpenLocationModal}
              className="flex items-center gap-1 bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700 text-xs px-2.5 py-1.5 rounded-xl transition-colors font-medium text-emerald-100 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span className="max-w-[70px] sm:max-w-[110px] truncate font-bold text-white">
                {activeLocation.state}
              </span>
            </button>
          </Tooltip>

          {/* Subtle Geolocation Tracking Pulse Indicator */}
          <Tooltip 
            content={
              activeLocation.isGpsDerived 
                ? `🛰️ Geolocation is actively tracking (${activeLocation.state}, ±${activeLocation.accuracyMeters || 15}m). Click to refresh GPS lock.` 
                : `📍 Geolocation active for ${activeLocation.state}. Click to sync live GPS coordinates.`
            } 
            position="bottom"
          >
            <button
              onClick={handleRefreshGpsLocation}
              id="header-gps-pulse-indicator"
              className={`flex items-center gap-1.5 px-2 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                activeLocation.isGpsDerived
                  ? 'bg-emerald-950/90 border-emerald-500/80 text-emerald-300 hover:bg-emerald-900'
                  : 'bg-emerald-900/60 border-emerald-700/80 text-emerald-200 hover:bg-emerald-800'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isLocatingNow 
                    ? 'animate-ping bg-amber-400' 
                    : activeLocation.isGpsDerived 
                    ? 'animate-ping bg-emerald-400' 
                    : 'animate-pulse bg-emerald-500'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  isLocatingNow 
                    ? 'bg-amber-400' 
                    : activeLocation.isGpsDerived 
                    ? 'bg-emerald-400 shadow-sm shadow-emerald-400' 
                    : 'bg-emerald-500'
                }`}></span>
              </span>
              <span className="hidden lg:inline text-[10px] uppercase tracking-wider font-extrabold font-display">
                {isLocatingNow ? 'Locating...' : activeLocation.isGpsDerived ? 'GPS Live' : 'GPS Active'}
              </span>
              {activeLocation.accuracyMeters && (
                <span className="hidden xl:inline text-[9px] text-emerald-300 font-mono">
                  ±{activeLocation.accuracyMeters}m
                </span>
              )}
            </button>
          </Tooltip>

          {/* Quick Access Geolocation Tracing Toggle Button */}
          <Tooltip
            content={
              isTracing
                ? '🛰️ Tracing Mode: ON (ACTIVE). Real-time street proximity warnings are active. Click to toggle OFF.'
                : '⏸️ Tracing Mode: OFF (PAUSED). Proximity safety warnings are muted. Click to toggle ON.'
            }
            position="bottom"
          >
            <button
              onClick={() => {
                const next = !isTracing;
                setIsTracing(next);
                storageService.setTracingEnabled(next);
              }}
              id="header-tracing-mode-toggle-btn"
              className={`flex items-center gap-1.5 px-2 py-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                isTracing
                  ? 'bg-emerald-950/90 border-emerald-400 text-emerald-300 hover:bg-emerald-900 shadow-xs'
                  : 'bg-gray-800/80 border-gray-600 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isTracing ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <span className="hidden md:inline text-[10px] uppercase tracking-wider font-extrabold font-display">
                {isTracing ? t.tracingOn : t.tracingOff}
              </span>
            </button>
          </Tooltip>

          {/* Local Push Alert Indicator Button */}
          <Tooltip content={`Hyper-local push alerts for ${activeLocation.state}. Click to view local rumor bulletins or configure push alerts.`} position="bottom">
            <button
              onClick={() => setIsLocalAlertsOpen(true)}
              id="header-local-alerts-btn"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                unreadAlertsCount > 0 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                  : 'bg-emerald-950/60 text-emerald-200 border-emerald-800 hover:bg-emerald-900'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${unreadAlertsCount > 0 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`} />
              <span className="hidden sm:inline font-extrabold text-[11px]">
                {activeLocation.lga ? activeLocation.lga : activeLocation.state}
              </span>
              {unreadAlertsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-400 text-amber-950 text-[10px] font-black flex items-center justify-center">
                  {unreadAlertsCount}
                </span>
              )}
            </button>
          </Tooltip>

          {/* Live Online Users Badge */}
          <Tooltip content={`${onlineCount} active Sabi spotters connected in the live network. Click to join real-time chat!`} position="bottom">
            <button 
              onClick={() => onNavigate('sabiers')}
              className="cursor-pointer flex items-center gap-1.5 bg-emerald-950/90 hover:bg-emerald-900 border border-emerald-500/80 px-2.5 py-1 rounded-full text-[11px] font-black text-[#FFD60A] transition-all shadow-2xs shrink-0"
              title="Click to view live users and chat real-time"
              id="header-live-sabiers-count-btn"
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="whitespace-nowrap">{onlineCount > 0 ? onlineCount.toLocaleString() : 1} Live Sabiers</span>
            </button>
          </Tooltip>
        </div>

        {/* Action Controls for Desktop */}
        <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
          {/* Interface Language Switcher Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <Tooltip content="Switch application interface language (English, Yoruba, Igbo, Hausa, Pidgin)" position="bottom">
              <button
                id="header-language-switcher-btn"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/80 px-2.5 py-1.5 rounded-xl text-xs font-bold text-emerald-100 transition-colors cursor-pointer"
                aria-expanded={isLangDropdownOpen}
              >
                <Globe className="w-3.5 h-3.5 text-[#FFD60A]" />
                <span className="text-[11px]">{LANGUAGE_NAMES[currentLang].flag}</span>
                <span className="hidden lg:inline text-xs font-extrabold font-display">
                  {LANGUAGE_NAMES[currentLang].name}
                </span>
                <ChevronDown className="w-3 h-3 text-emerald-400" />
              </button>
            </Tooltip>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-48 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-200 py-1.5 z-50 animate-scale-up font-sans">
                <div className="px-3 py-1.5 text-[10px] font-black uppercase text-gray-400 tracking-wider border-b border-gray-100 font-display">
                  Select Language
                </div>
                {(Object.keys(LANGUAGE_NAMES) as AppLanguage[]).map((langKey) => {
                  const item = LANGUAGE_NAMES[langKey];
                  const isSelected = currentLang === langKey;
                  return (
                    <button
                      key={langKey}
                      onClick={() => {
                        languageService.setLanguage(langKey);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-emerald-50 text-[#0A3D2E] font-extrabold' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{item.flag}</span>
                        <div>
                          <div className="font-bold">{item.name}</div>
                          <div className="text-[10px] text-gray-400">{item.nativeName}</div>
                        </div>
                      </div>
                      {isSelected && <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links: Deepfake, Titles, Trust Title */}
          <div className="flex items-center gap-1 bg-emerald-950/80 p-1 rounded-xl border border-emerald-800 shrink-0">
            <Tooltip content="Quick Link: Deepfake Scanner & Audio/Video Forensics" position="bottom">
              <button
                onClick={() => onNavigate('forensics')}
                className={`px-2 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                  currentTab === 'forensics'
                    ? 'bg-[#FFD60A] text-[#0A3D2E]'
                    : 'text-emerald-100 hover:bg-emerald-800/80 hover:text-white'
                }`}
              >
                <span>🔬</span>
                <span className="hidden lg:inline">{t.forensics}</span>
              </button>
            </Tooltip>

            <Tooltip content={`Quick Link: Status Rank Title (Current Status: ${user.userTier || 'Bronze'})`} position="bottom">
              <button
                onClick={() => setIsStatusModalOpen(true)}
                className={`px-2 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                  currentTab === 'profile'
                    ? 'bg-[#FFD60A] text-[#0A3D2E]'
                    : 'text-emerald-100 hover:bg-emerald-800/80 hover:text-white'
                }`}
              >
                <span>📰</span>
                <span className="hidden lg:inline">Titles ({user.userTier || 'Bronze'})</span>
              </button>
            </Tooltip>

            <Tooltip content={`Quick Link: Verified Trust Title (Level: ${user.trustLevel || 'Bronze'})`} position="bottom">
              <button
                onClick={() => setIsTrustModalOpen(true)}
                className={`px-2 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1 cursor-pointer ${
                  currentTab === 'truth'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-200 hover:bg-emerald-800/80 hover:text-white'
                }`}
              >
                <span>🛡️</span>
                <span className="hidden lg:inline">Trust ({user.trustLevel || 'Bronze'})</span>
              </button>
            </Tooltip>
          </div>

          {/* Map navigation */}
          <Tooltip content="Live Community Radar Map with active rumor pins" position="bottom">
            <button
              onClick={() => onNavigate('map')}
              className={`w-8.5 h-8.5 flex items-center justify-center rounded-xl transition-all border cursor-pointer ${
                currentTab === 'map'
                  ? 'bg-[#FFD60A] text-[#0A3D2E] border-[#FFD60A]'
                  : 'bg-emerald-900/50 hover:bg-emerald-800 text-emerald-100 border-emerald-700'
              }`}
              aria-label="Rumor Map"
            >
              <Map className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* D3 Stats Dashboard navigation */}
          <Tooltip content="D3.js 36-State & Global Rumor Misinformation Dashboard" position="bottom">
            <button
              onClick={() => onNavigate('stats')}
              className={`w-8.5 h-8.5 flex items-center justify-center rounded-xl transition-all border cursor-pointer ${
                currentTab === 'stats'
                  ? 'bg-[#FFD60A] text-[#0A3D2E] border-[#FFD60A]'
                  : 'bg-emerald-900/50 hover:bg-emerald-800 text-emerald-100 border-emerald-700'
              }`}
              aria-label="Rumor Stats Dashboard"
            >
              <BarChart2 className="w-4 h-4" />
            </button>
          </Tooltip>

          {/* Sabi Live Chat Room navigation */}
          <Tooltip content="Join the live chat channels to verify claims in real-time" position="bottom">
            <button
              onClick={() => onNavigate('sabiers')}
              className={`w-8.5 h-8.5 flex items-center justify-center rounded-xl transition-all border relative cursor-pointer ${
                currentTab === 'sabiers'
                  ? 'bg-[#FFD60A] text-[#0A3D2E] border-[#FFD60A]'
                  : 'bg-emerald-900/50 hover:bg-emerald-800 text-emerald-100 border-emerald-700'
              }`}
              aria-label="Sabi Live Chat"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1.5 right-1.5 animate-ping" />
            </button>
          </Tooltip>

          {/* Sabo AI copilot */}
          <Tooltip content="Sabo AI Assistant: Fact-check files, analyze deepfakes, or optimize food budgets" position="bottom">
            <button
              onClick={onOpenSaboAi}
              className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] px-2.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0A3D2E]" />
              <span>Sabo</span>
            </button>
          </Tooltip>

          {/* How SABI Works */}
          <Tooltip content="Interactive Tour: Learn to spot fake news & report food prices" position="bottom">
            <button
              onClick={onOpenTutorial}
              className="bg-emerald-900/50 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span className="hidden xl:inline">{t.howItWorks}</span>
            </button>
          </Tooltip>

          {/* Suggestion Box & Owner Contact */}
          <Tooltip content="Suggestion Box & Owner Enoch Ayomide Contact Info (enochayomide67@gmail.com)" position="bottom">
            <button
              onClick={() => setIsSuggestionBoxOpen(true)}
              className="bg-[#0A3D2E] hover:bg-[#0d4a38] text-[#FFD60A] border border-[#FFD60A]/60 px-2.5 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Suggestion Box</span>
            </button>
          </Tooltip>

          {/* Admin Portal Navigation */}
          <Tooltip content="SABI Administrator Control Center & Telemetry" position="bottom">
            <button
              id="header-admin-portal-btn"
              onClick={() => onNavigate('admin')}
              className={`text-xs px-2.5 py-1.5 rounded-xl font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                currentTab === 'admin'
                  ? 'bg-amber-500 text-black border-amber-400'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border-amber-500/40'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.admin}</span>
            </button>
          </Tooltip>

          {/* Share App link */}
          <Tooltip content={copiedLink ? 'Verified link copied!' : 'Share SABI with your family on WhatsApp'} position="bottom">
            <button
              onClick={handleShareApp}
              className="w-8.5 h-8.5 flex items-center justify-center rounded-xl bg-emerald-900/50 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 transition-colors cursor-pointer"
              aria-label="Share App"
            >
              <Share2 className="w-4 h-4 text-emerald-300" />
            </button>
          </Tooltip>

          {/* Auth Button or Profile */}
          {isLoggedIn ? (
            <div className="flex items-center gap-1.5">
              <Tooltip content={`${user.name} (${user.userTier || 'Member'}) - ${user.sabiPoints} PTS`} position="bottom">
                <button
                  onClick={() => onNavigate('profile')}
                  className="w-8 h-8 rounded-xl overflow-hidden border-2 border-[#FFD60A] hover:scale-105 transition-transform cursor-pointer"
                >
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                </button>
              </Tooltip>
              <Tooltip content="Sign Out from SABI" position="bottom">
                <button
                  onClick={handleSignOut}
                  id="header-signout-btn"
                  className="p-1.5 rounded-xl bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-200 transition-colors cursor-pointer"
                  aria-label="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </Tooltip>
            </div>
          ) : (
            <Tooltip content="Sign In to earn Sabi Points and verify local claims" position="bottom">
              <button
                onClick={() => onOpenAuthModal('signin')}
                className="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5 text-[#FFD60A]" />
                <span>{t.signIn}</span>
              </button>
            </Tooltip>
          )}
        </div>

        {/* Mobile Action Controls */}
        <div className="flex md:hidden items-center gap-1.5">
          <button
            onClick={() => setIsLocalAlertsOpen(true)}
            className="p-1.5 rounded-xl bg-emerald-900/80 text-amber-300 border border-emerald-700 relative"
            aria-label="Local Alerts"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            {unreadAlertsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1 right-1" />
            )}
          </button>

          <button
            onClick={onOpenSaboAi}
            className="bg-[#FFD60A] text-[#0A3D2E] px-2.5 py-1.5 rounded-xl font-black text-xs flex items-center gap-1 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sabo</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-emerald-900 text-white cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A3D2E] border-t border-emerald-800 px-4 py-4 space-y-3 animate-fade-in shadow-2xl">
          
          {/* Mobile Tracing Mode Toggle */}
          <div className="bg-emerald-950/90 p-2.5 rounded-2xl border border-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${isTracing ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
              <div>
                <div className="text-xs font-black text-white font-display">
                  {t.tracingMode}
                </div>
                <div className="text-[10px] text-emerald-300">
                  {isTracing ? 'Active: Alerts for nearby rumors' : 'Paused: No proximity warnings'}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                const next = !isTracing;
                setIsTracing(next);
                storageService.setTracingEnabled(next);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                isTracing ? 'bg-emerald-500 text-black' : 'bg-gray-700 text-gray-200'
              }`}
            >
              {isTracing ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Mobile Language Switcher */}
          <div className="bg-emerald-950/90 p-2.5 rounded-2xl border border-emerald-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider flex items-center gap-1 font-display">
                <Globe className="w-3.5 h-3.5 text-[#FFD60A]" />
                <span>Interface Language</span>
              </span>
              <span className="text-[10px] font-bold text-amber-300">{LANGUAGE_NAMES[currentLang].flag} {LANGUAGE_NAMES[currentLang].name}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {(Object.keys(LANGUAGE_NAMES) as AppLanguage[]).map((langKey) => {
                const item = LANGUAGE_NAMES[langKey];
                const isSelected = currentLang === langKey;
                return (
                  <button
                    key={langKey}
                    onClick={() => {
                      languageService.setLanguage(langKey);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFD60A] text-[#0A3D2E] border-[#FFD60A] font-black'
                        : 'bg-emerald-900/70 text-emerald-100 border-emerald-700'
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="bg-emerald-950/80 p-2 rounded-2xl border border-emerald-800 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider block px-1 font-display">
              ⚡ Quick Links
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => { onNavigate('forensics'); setMobileMenuOpen(false); }}
                className="py-2 px-1.5 rounded-xl bg-emerald-900/90 text-white text-[11px] font-extrabold flex items-center justify-center gap-1 border border-emerald-700 cursor-pointer"
              >
                <span>🔬</span>
                <span>Deepfake</span>
              </button>
              <button
                onClick={() => { setIsStatusModalOpen(true); setMobileMenuOpen(false); }}
                className="py-2 px-1.5 rounded-xl bg-emerald-900/90 text-white text-[11px] font-extrabold flex items-center justify-center gap-1 border border-emerald-700 cursor-pointer"
              >
                <span>📰</span>
                <span>Titles</span>
              </button>
              <button
                onClick={() => { setIsTrustModalOpen(true); setMobileMenuOpen(false); }}
                className="py-2 px-1.5 rounded-xl bg-emerald-600 text-white text-[11px] font-extrabold flex items-center justify-center gap-1 shadow-sm cursor-pointer"
              >
                <span>🛡️</span>
                <span>Trust Title</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => { onNavigate('map'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-900/60 text-white font-bold text-xs cursor-pointer"
            >
              <Map className="w-4 h-4 text-[#FFD60A]" />
              <span>{t.rumorMap}</span>
            </button>

            <button
              onClick={() => { onNavigate('stats'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-900/60 text-[#FFD60A] font-bold text-xs cursor-pointer"
            >
              <BarChart2 className="w-4 h-4 text-[#FFD60A]" />
              <span>{t.stats}</span>
            </button>

            <button
              onClick={() => { onNavigate('sabiers'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-900/60 text-white font-bold text-xs cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#FFD60A]" />
              <span>{t.sabiChat}</span>
            </button>

            <button
              onClick={() => { onOpenTutorial(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-900/60 text-white font-bold text-xs cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#FFD60A]" />
              <span>{t.howItWorks}</span>
            </button>

            <button
              onClick={() => { setIsLocalAlertsOpen(true); setMobileMenuOpen(false); }}
              className="col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-800 text-white font-extrabold text-xs shadow-sm border border-emerald-600 cursor-pointer"
            >
              <Radio className="w-4 h-4 text-[#FFD60A] animate-pulse" />
              <span>Local Rumor Push Alerts ({activeLocation.state})</span>
            </button>

            <button
              onClick={() => { setIsSuggestionBoxOpen(true); setMobileMenuOpen(false); }}
              className="col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#0A3D2E] text-[#FFD60A] font-black text-xs shadow-sm border border-[#FFD60A]/50 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-[#FFD60A]" />
              <span>Suggestion Box & Owner Contact</span>
            </button>

            <button
              onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
              className="col-span-2 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs shadow-sm cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-black" />
              <span>SABI Admin Portal</span>
            </button>
          </div>

          {isLoggedIn ? (
            <div className="pt-2 border-t border-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={user.avatarUrl} alt={user.name} className="w-7 h-7 rounded-full object-cover" />
                <span className="text-xs font-bold text-white">{user.name}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="text-xs text-red-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t.signOut}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => { onOpenAuthModal('signin'); setMobileMenuOpen(false); }}
              className="w-full bg-[#FFD60A] text-[#0A3D2E] py-2 rounded-xl text-xs font-black text-center cursor-pointer"
            >
              {t.signIn}
            </button>
          )}
        </div>
      )}

      {/* Quick Link Status Title Modal (Bronze, Gold, Deluxe status) */}
      <StatusTitleModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        user={user}
        onNavigate={onNavigate}
      />

      {/* Quick Link Trust Title Modal (Trust level & rating) */}
      <TrustLevelModal
        isOpen={isTrustModalOpen}
        onClose={() => setIsTrustModalOpen(false)}
        user={user}
        onNavigate={onNavigate}
      />

      {/* Local Push Alerts & Rumor Bulletins Modal */}
      <LocalAlertsModal
        isOpen={isLocalAlertsOpen}
        onClose={() => setIsLocalAlertsOpen(false)}
        activeLocation={activeLocation}
        onNavigateToTruth={(claim) => {
          onNavigate('truth');
        }}
      />

      {/* Suggestion Box & Owner Contact Modal */}
      <SuggestionBoxModal
        isOpen={isSuggestionBoxOpen}
        onClose={() => setIsSuggestionBoxOpen(false)}
      />
    </header>
  );
};

export default Header;

