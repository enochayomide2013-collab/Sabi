import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Bell, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronDown,
  ShieldAlert,
  User,
  KeyRound,
  LogIn,
  LogOut,
  UserPlus,
  Bot,
  Users,
  MessageSquare,
  Sparkles,
  Radio,
  Compass,
  Sun,
  Moon
} from 'lucide-react';
import { storageService, SelectedLocation } from '../../services/storageService';
import { AppNotification, UserProfile } from '../../types';

interface HeaderProps {
  currentTab?: string;
  activeLocation?: SelectedLocation;
  onNavigate: (tab: string, extraData?: any) => void;
  onOpenLocationModal: () => void;
  onOpenAuthModal?: (mode?: 'signin' | 'signup' | 'admin') => void;
  onOpenSaboAi?: () => void;
  onOpenNotifications?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab = 'home',
  activeLocation,
  onNavigate,
  onOpenLocationModal,
  onOpenAuthModal = (_mode?: 'signin' | 'signup' | 'admin') => {},
  onOpenSaboAi = () => {},
  onOpenNotifications,
  isDarkMode = false,
  onToggleDarkMode = () => {}
}) => {
  const [location, setLocation] = useState<SelectedLocation>(activeLocation || storageService.getLocation());
  const [notifications, setNotifications] = useState<AppNotification[]>(storageService.getNotifications());
  const [user, setUser] = useState<UserProfile>(storageService.getUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(storageService.isUserLoggedIn());
  const [onlineCount, setOnlineCount] = useState<number>(storageService.getOnlineUsersCount());

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (activeLocation) {
      setLocation(activeLocation);
    }
  }, [activeLocation]);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setLocation(storageService.getLocation());
      setNotifications(storageService.getNotifications());
      setUser(storageService.getUser());
      setIsLoggedIn(storageService.isUserLoggedIn());
      setOnlineCount(storageService.getOnlineUsersCount());
    });
    return unsubscribe;
  }, []);

  const handleSignOut = () => {
    storageService.signOut();
    onNavigate('home');
  };

  const handleBellClick = () => {
    if (onOpenNotifications) {
      onOpenNotifications();
    } else {
      onNavigate('notifications');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 transition-all">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none shrink-0" 
          onClick={() => onNavigate('home')}
          id="header-brand-logo"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#0A3D2E] flex items-center justify-center shadow-sm border border-[#0A3D2E]/20">
            <span className="text-[#FFD60A] font-extrabold text-lg sm:text-xl tracking-tight font-display">S</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#0A3D2E] font-display">SABI</span>
              <span className="w-2 h-2 rounded-full bg-[#FFD60A] inline-block animate-pulse"></span>
            </div>
            <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-gray-500 tracking-wider block -mt-1">
              Community Truth
            </span>
          </div>
        </div>

        {/* Location Selector Capsule */}
        <button
          id="header-location-btn"
          onClick={onOpenLocationModal}
          className="hidden lg:flex items-center gap-1.5 bg-[#F5F5F5] hover:bg-gray-200/80 active:scale-95 text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold border border-gray-200/70 transition-all max-w-[170px] truncate"
          title="Change location"
        >
          <MapPin className="w-3.5 h-3.5 text-[#0A3D2E] shrink-0" />
          <span className="truncate">
            {location.state} · {location.area || location.lga}
          </span>
          <ChevronDown className="w-3 h-3 text-gray-400 shrink-0" />
        </button>

        {/* Right Actions: Sabo AI, Online Sabiers, Admin Access, Sign Up / Sign Out, Search, Notifications, Profile */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          
          {/* Sabo AI Quick Assistant Button */}
          <button
            id="header-sabo-ai-btn"
            onClick={onOpenSaboAi}
            className="flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 text-[#0A3D2E] text-xs font-black px-2.5 py-1.5 rounded-xl border border-emerald-200 shadow-2xs transition-all active:scale-95 font-display"
            title="Ask Sabo AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="text-[11px]">Sabo AI</span>
          </button>

          {/* Rumor Map View Button */}
          <button
            id="header-map-btn"
            onClick={() => onNavigate('map')}
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all active:scale-95 ${
              currentTab === 'map'
                ? 'bg-[#0A3D2E] text-white border-[#0A3D2E] shadow-xs'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}
            title="Interactive Rumor Map"
          >
            <Compass className="w-3.5 h-3.5 text-[#0A3D2E]" />
            <span className="hidden sm:inline">Map</span>
          </button>

          {/* The Sabiers Community Chat & Live On Sabiers Count */}
          <button
            id="header-sabiers-chat-btn"
            onClick={() => onNavigate('sabiers')}
            className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all active:scale-95 ${
              currentTab === 'sabiers'
                ? 'bg-[#0A3D2E] text-white border-[#0A3D2E] shadow-xs'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
            }`}
            title="The Sabiers Chat & Online Users"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Users className="w-3.5 h-3.5 text-[#0A3D2E] shrink-0" />
            <span className="hidden md:inline text-[11px] font-extrabold">{onlineCount} on sabiers</span>
            <span className="md:hidden text-[11px]">Sabiers</span>
          </button>

          {/* Admin Place Direct Access */}
          <button
            id="header-admin-btn"
            onClick={() => {
              if (user.role === 'admin') {
                onNavigate('admin');
              } else {
                onOpenAuthModal('admin');
              }
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 active:scale-95 ${
              currentTab === 'admin' || user.role === 'admin'
                ? 'bg-amber-100 text-amber-950 border border-amber-300 shadow-sm' 
                : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200/80'
            }`}
            title="Administrator Portal"
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span className="text-[11px] font-bold">Admin</span>
          </button>

          {/* DYNAMIC AUTH BUTTONS: When Signed In -> Sign Out, When Not Signed In -> Sign In & Sign Up */}
          {isLoggedIn ? (
            <button
              id="header-signout-btn"
              onClick={handleSignOut}
              className="hidden sm:flex items-center gap-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-2xs transition-all active:scale-95"
              title="Sign Out of account"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span className="text-[11px]">Sign Out</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                id="header-signin-btn"
                onClick={() => onOpenAuthModal('signin')}
                className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-gray-200 transition-all active:scale-95"
                title="Sign In to your account"
              >
                <LogIn className="w-3.5 h-3.5 text-[#0A3D2E]" />
                <span className="text-[11px]">Sign In</span>
              </button>
              <button
                id="header-signup-btn"
                onClick={() => onOpenAuthModal('signup')}
                className="flex items-center gap-1 bg-[#0A3D2E] hover:bg-[#0c4a37] text-white text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-sm transition-all active:scale-95"
                title="Sign Up for a free SABI account"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#FFD60A]" />
                <span className="text-[11px]">Sign Up</span>
              </button>
            </div>
          )}

          {/* User Profile Capsule */}
          <button
            id="header-profile-btn"
            onClick={() => onNavigate('profile')}
            className={`flex items-center gap-1.5 p-1 sm:px-2.5 sm:py-1 rounded-xl transition-all border ${
              currentTab === 'profile'
                ? 'bg-[#0A3D2E] text-white border-[#0A3D2E]'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200'
            }`}
            title={`Profile: ${user.name} (${user.email})`}
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-7 h-7 rounded-lg object-cover border border-white/40"
            />
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold leading-tight truncate max-w-[90px]">
                {user.name.split(' ')[0]}
              </span>
              <span className="text-[10px] text-emerald-700 font-extrabold leading-none">
                {user.sabiPoints} pts
              </span>
            </div>
          </button>

          {/* Dark Mode Toggle Button */}
          <button
            id="header-dark-mode-btn"
            onClick={onToggleDarkMode}
            className="p-2 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 active:scale-95"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode (Nighttime usage)"}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
            )}
          </button>

          {/* Search Button */}
          <button
            id="header-search-btn"
            onClick={() => {
              onNavigate('home');
              setTimeout(() => {
                const el = document.getElementById('global-search-input');
                if (el) {
                  el.focus();
                  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 100);
            }}
            className="p-2 rounded-full transition-all hover:bg-gray-100 text-gray-700 active:scale-95"
            title="Search SABI reports, truths, and market prices"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Notifications / Info Bell Button */}
          <button
            id="header-notifs-btn"
            onClick={handleBellClick}
            className={`p-2 rounded-full relative transition-all ${
              currentTab === 'notifications' 
                ? 'bg-[#0A3D2E] text-white' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="View Messages & Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

        </div>

      </div>
    </header>
  );
};

