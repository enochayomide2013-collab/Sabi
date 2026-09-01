import React, { useState } from 'react';
import { 
  MapPin, 
  Sparkles, 
  HelpCircle, 
  Bell, 
  Flame, 
  Menu, 
  X, 
  BookOpen, 
  Share2, 
  Info,
  CheckCircle,
  MessageSquare,
  Sun,
  Moon,
  LogIn,
  LogOut,
  Map,
  Activity,
  BarChart2
} from 'lucide-react';
import { UserProfile } from '../../types';
import { storageService, SelectedLocation } from '../../services/storageService';
import { Tooltip } from './Tooltip';

interface HeaderProps {
  currentTab: string;
  activeLocation: SelectedLocation;
  onOpenLocationModal: () => void;
  onNavigate: (tab: string) => void;
  onOpenAuthModal: (mode: 'signin' | 'signup' | 'admin') => void;
  onOpenSaboAi: () => void;
  onOpenNotifications: () => void;
  onOpenTutorial: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
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
  
  const [user, setUser] = useState<UserProfile>(storageService.getUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(storageService.isUserLoggedIn());

  React.useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setUser(storageService.getUser());
      setIsLoggedIn(storageService.isUserLoggedIn());
    });
    return unsubscribe;
  }, []);

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

  return (
    <header className="sticky top-0 z-40 bg-[#0A3D2E] text-white shadow-md border-b border-emerald-800" id="sabi-main-header">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo & Location */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 group text-left transition-transform active:scale-95"
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
                Truth & Prices
              </span>
            </div>
          </button>

          {/* Location Selector Pill */}
          <Tooltip content={`Selected: ${activeLocation.state}. Click to switch state/LGA and see local foodstuff prices.`} position="bottom">
            <button
              onClick={onOpenLocationModal}
              className="flex items-center gap-1 bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-700 text-xs px-2.5 py-1.5 rounded-xl transition-colors font-medium text-emerald-100"
            >
              <MapPin className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span className="max-w-[80px] sm:max-w-[110px] truncate font-bold text-white">
                {activeLocation.state}
              </span>
            </button>
          </Tooltip>

          {/* Live Online Users Badge */}
          <Tooltip content={`${onlineCount} active Sabi spotters connected in the live network`} position="bottom">
            <div 
              onClick={() => onNavigate('sabiers')}
              className="cursor-pointer hidden md:flex items-center gap-1.5 bg-emerald-950/70 border border-emerald-800/80 px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-200 hover:bg-emerald-900 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{onlineCount} Live Spotters</span>
            </div>
          </Tooltip>
        </div>

        {/* Action Controls for Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {/* Map navigation */}
          <Tooltip content="Live Community Radar Map with active rumor pins" position="bottom">
            <button
              onClick={() => onNavigate('map')}
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all border ${
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
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all border ${
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
              className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all border relative ${
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
              className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0A3D2E]" />
              <span>Sabo AI</span>
            </button>
          </Tooltip>

          {/* How SABI Works */}
          <Tooltip content="Interactive Tour: Learn to spot fake news & report food prices" position="bottom">
            <button
              onClick={onOpenTutorial}
              className="bg-emerald-900/50 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>How It Works</span>
            </button>
          </Tooltip>

          {/* About Creator Page */}
          <Tooltip content="About the teenager creator from Ile-Ife, Osun State" position="bottom">
            <button
              onClick={() => onNavigate('about')}
              className={`text-xs px-2.5 py-1.5 rounded-xl font-bold border transition-colors ${
                currentTab === 'about'
                  ? 'bg-[#FFD60A] text-[#0A3D2E] border-[#FFD60A]'
                  : 'bg-emerald-900/50 hover:bg-emerald-800 text-emerald-100 border-emerald-700'
              }`}
            >
              Creator
            </button>
          </Tooltip>

          {/* Notifications Modal */}
          <Tooltip content="Breaking alert bulletins & verifications" position="bottom">
            <button
              onClick={onOpenNotifications}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-900/50 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 transition-colors relative"
              aria-label="Breaking Bulletins"
            >
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD60A] absolute top-2 right-2 animate-pulse" />
            </button>
          </Tooltip>

          {/* Dark Mode toggle */}
          <Tooltip content={isDarkMode ? 'Switch to Eye-Safe Light Mode' : 'Switch to Midnight Dark Mode'} position="bottom">
            <button
              onClick={onToggleDarkMode}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-900/50 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[#FFD60A]" /> : <Moon className="w-4 h-4 text-emerald-300" />}
            </button>
          </Tooltip>

          {/* Share App link */}
          <Tooltip content={copiedLink ? 'Verified link copied!' : 'Share SABI with your family on WhatsApp'} position="bottom">
            <button
              onClick={handleShareApp}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-emerald-900/50 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 transition-colors"
              aria-label="Share App"
            >
              <Share2 className="w-4 h-4 text-emerald-300" />
            </button>
          </Tooltip>

          {/* Auth Button or Profile */}
          {isLoggedIn ? (
            <Tooltip content={`${user.name} (${user.userTier || 'Member'}) - ${user.sabiPoints} PTS`} position="bottom">
              <button
                onClick={() => onNavigate('profile')}
                className="w-8 h-8 rounded-xl overflow-hidden border-2 border-[#FFD60A] hover:scale-105 transition-transform"
              >
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              </button>
            </Tooltip>
          ) : (
            <Tooltip content="Sign In to earn Sabi Points and verify local claims" position="bottom">
              <button
                onClick={() => onOpenAuthModal('signin')}
                className="bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 border border-emerald-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-[#FFD60A]" />
                <span>Sign In</span>
              </button>
            </Tooltip>
          )}
        </div>

        {/* Mobile Action Controls */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => onNavigate('stats')}
            className="p-2 rounded-xl bg-emerald-900/60 text-[#FFD60A] border border-emerald-700"
            aria-label="Rumor Stats"
          >
            <BarChart2 className="w-4 h-4" />
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
            className="p-2 rounded-xl bg-emerald-900 text-white"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A3D2E] border-t border-emerald-800 px-4 py-4 space-y-3 animate-fade-in shadow-2xl">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => { onNavigate('map'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-900/60 text-white font-bold text-xs"
            >
              <Map className="w-4 h-4 text-[#FFD60A]" />
              <span>Rumor Map</span>
            </button>

            <button
              onClick={() => { onNavigate('stats'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-900/60 text-[#FFD60A] font-bold text-xs"
            >
              <BarChart2 className="w-4 h-4 text-[#FFD60A]" />
              <span>36-State Stats (D3)</span>
            </button>

            <button
              onClick={() => { onNavigate('sabiers'); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-900/60 text-white font-bold text-xs"
            >
              <MessageSquare className="w-4 h-4 text-[#FFD60A]" />
              <span>Sabi Live Chat</span>
            </button>

            <button
              onClick={() => { onOpenTutorial(); setMobileMenuOpen(false); }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-900/60 text-white font-bold text-xs"
            >
              <BookOpen className="w-4 h-4 text-[#FFD60A]" />
              <span>How It Works</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-emerald-800 text-xs">
            <button
              onClick={onToggleDarkMode}
              className="flex items-center gap-2 text-emerald-200 font-bold"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[#FFD60A]" /> : <Moon className="w-4 h-4 text-emerald-300" />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
              className="text-emerald-200 font-bold hover:underline"
            >
              About Creator
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
                className="text-xs text-red-300 font-bold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => { onOpenAuthModal('signin'); setMobileMenuOpen(false); }}
              className="w-full bg-[#FFD60A] text-[#0A3D2E] py-2 rounded-xl text-xs font-black text-center"
            >
              Sign In to Sabi
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
