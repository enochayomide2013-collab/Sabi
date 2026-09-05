import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Camera, 
  ShoppingBasket, 
  MapPin, 
  Navigation,
  Users,
  Info,
  Bell,
  Moon,
  Sun
} from 'lucide-react';
import { Tooltip } from './Tooltip';
import { languageService } from '../../services/languageService';
import { AppLanguage } from '../../types';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenNotifications?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  currentTab, 
  onNavigate,
  onOpenNotifications,
  isDarkMode = false,
  onToggleDarkMode
}) => {
  const [lang, setLang] = useState<AppLanguage>(languageService.getLanguage());

  useEffect(() => {
    const unsub = languageService.subscribe((l) => setLang(l));
    return unsub;
  }, []);

  const LABELS: Record<AppLanguage, { 
    home: string; 
    market: string; 
    umap: string;
    map: string;
    report: string; 
    sabiers: string; 
    alerts: string;
    creator: string; 
    nightMode: string;
    lightMode: string;
  }> = {
    english: { home: 'Home', market: 'Market', umap: 'UMap', map: 'Map', report: 'Snap', sabiers: 'Sabiers', alerts: 'Alerts', creator: 'Creator', nightMode: 'Night', lightMode: 'Day' },
    yoruba: { home: 'Ilé', market: 'Ọjà', umap: 'UMap', map: 'Àwòrán', report: 'Ròyìn', sabiers: 'Spotter', alerts: 'Ìkìlọ̀', creator: 'Olùdásílẹ̀', nightMode: 'Òkùnkùn', lightMode: 'Ìmọ́lẹ̀' },
    igbo: { home: 'Ụlọ', market: 'Ahịa', umap: 'UMap', map: 'Maapụ', report: 'Kpesa', sabiers: 'Sabiers', alerts: 'Ọkwa', creator: 'Onye Kere', nightMode: 'Abalị', lightMode: 'Ìhè' },
    hausa: { home: 'Gida', market: 'Kasuwa', umap: 'UMap', map: 'Taswira', report: 'Rahoto', sabiers: 'Sabiers', alerts: 'Fadakarwa', creator: 'Mahalicci', nightMode: 'Dare', lightMode: 'Rana' },
    pidgin: { home: 'Home', market: 'Market', umap: 'UMap', map: 'Map', report: 'Snap', sabiers: 'Sabiers', alerts: 'Alerts', creator: 'Creator', nightMode: 'Night', lightMode: 'Day' }
  };

  const currentLabels = LABELS[lang] || LABELS.english;

  const navItems = [
    { id: 'home', label: currentLabels.home, icon: Home, tooltip: 'Home Dashboard & Breaking Rumors' },
    { id: 'market', label: currentLabels.market, icon: ShoppingBasket, tooltip: 'Market Prices & Foodstuff Spotter' },
    { id: 'umap', label: currentLabels.umap, icon: Navigation, tooltip: 'UMap: Exact Street & Proximity Tracing' },
    { id: 'report', label: currentLabels.report, icon: Camera, isCenter: true, tooltip: 'Snap a Suspicious Rumor or Price' },
    { id: 'sabiers', label: currentLabels.sabiers, icon: Users, tooltip: 'Live Sabiers Chat & Spotter Rooms' },
    { id: 'about', label: currentLabels.creator, icon: Info, tooltip: 'About SABI Creator & Mission' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 pb-safe shadow-lg transition-colors" id="sabi-bottom-navigation">
      <div className="max-w-xl mx-auto px-1 sm:px-3 py-1 flex items-center justify-between">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          if (item.isCenter) {
            return (
              <Tooltip key={item.id} content={item.tooltip} position="top">
                <button
                  onClick={() => onNavigate(item.id)}
                  className="relative -top-3 flex flex-col items-center group focus:outline-none shrink-0 active:scale-90 transition-transform cursor-pointer px-1"
                  aria-label="Snap Rumor or Report Price"
                  id="btn-nav-snap-center"
                >
                  <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isActive 
                      ? 'bg-[#FFD60A] text-[#0A3D2E] ring-4 ring-[#0A3D2E]/20' 
                      : 'bg-[#0A3D2E] text-[#FFD60A] hover:bg-[#0c4b38] hover:scale-105'
                  }`}>
                    <Icon className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.5]" />
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-extrabold mt-0.5 tracking-tight ${
                    isActive ? 'text-[#0A3D2E] dark:text-[#FFD60A]' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {item.label}
                  </span>
                </button>
              </Tooltip>
            );
          }

          return (
            <Tooltip key={item.id} content={item.tooltip} position="top">
              <button
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center py-1 px-1 sm:px-2 rounded-xl transition-all active:scale-95 shrink-0 cursor-pointer ${
                  isActive ? 'text-[#0A3D2E] dark:text-[#FFD60A]' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
                aria-label={item.label}
                id={`btn-nav-${item.id}`}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0A3D2E] dark:bg-[#FFD60A] rounded-full" />
                  )}
                </div>
                <span className={`text-[9px] sm:text-[10px] mt-0.5 font-medium leading-none ${isActive ? 'font-extrabold text-[#0A3D2E] dark:text-[#FFD60A]' : 'text-gray-500 dark:text-gray-400'}`}>
                  {item.label}
                </span>
              </button>
            </Tooltip>
          );
        })}

        {/* Notifications / Alerts Button in Bottom Nav */}
        <Tooltip content="Breaking alert bulletins & verifications" position="top">
          <button
            onClick={() => {
              if (onOpenNotifications) {
                onOpenNotifications();
              }
            }}
            className="flex flex-col items-center py-1 px-1 sm:px-2 rounded-xl transition-all active:scale-95 shrink-0 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-amber-500 dark:hover:text-amber-300"
            aria-label="Breaking Bulletins & Notifications"
            id="btn-nav-notifications"
          >
            <div className="relative p-0.5">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD60A] absolute top-0 right-0 animate-pulse" />
            </div>
            <span className="text-[9px] sm:text-[10px] mt-0.5 font-medium leading-none text-gray-500 dark:text-gray-400">
              {currentLabels.alerts}
            </span>
          </button>
        </Tooltip>

        {/* Night Time Mode Switcher */}
        <Tooltip content={isDarkMode ? 'Switch to Light Mode' : 'Switch to Night Mode'} position="top">
          <button
            onClick={() => {
              if (onToggleDarkMode) {
                onToggleDarkMode();
              } else {
                const current = localStorage.getItem('sabi_dark_mode') === 'true';
                localStorage.setItem('sabi_dark_mode', String(!current));
                if (!current) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              }
            }}
            className="flex flex-col items-center py-1 px-1 sm:px-2 rounded-xl transition-all active:scale-95 shrink-0 cursor-pointer text-gray-500 dark:text-gray-300 hover:text-amber-500 dark:hover:text-amber-300"
            aria-label="Toggle Night Mode"
            id="btn-nav-night-mode"
          >
            <div className="relative p-0.5">
              {isDarkMode ? (
                <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse stroke-[2.2]" />
              ) : (
                <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400 stroke-[2.2]" />
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] mt-0.5 font-bold text-gray-600 dark:text-gray-300 leading-none">
              {isDarkMode ? currentLabels.lightMode : currentLabels.nightMode}
            </span>
          </button>
        </Tooltip>
      </div>
    </nav>
  );
};

export default BottomNav;


