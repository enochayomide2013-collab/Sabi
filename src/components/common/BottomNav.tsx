import React from 'react';
import { 
  Home, 
  Camera, 
  ShoppingBasket, 
  Utensils, 
  User,
  Users
} from 'lucide-react';
import { Tooltip } from './Tooltip';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, tooltip: 'Dashboard, trending rumors & breaking alerts' },
    { id: 'market', label: 'Market', icon: ShoppingBasket, tooltip: 'Daily foodstuff & commodity spot prices' },
    { id: 'report', label: 'Report', icon: Camera, isCenter: true, tooltip: 'Submit a suspicious rumor or log fresh market prices' },
    { id: 'sabiers', label: 'Sabiers', icon: Users, tooltip: 'Live state channels & spotters network' },
    { id: 'recipe', label: 'Recipe', icon: Utensils, tooltip: 'Budget recipes & meal planners' },
    { id: 'profile', label: 'Profile', icon: User, tooltip: 'Your Sabi Points, badges & rank tiers' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 pb-safe shadow-lg" id="sabi-bottom-navigation">
      <div className="max-w-lg mx-auto px-2 py-1.5 flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          if (item.isCenter) {
            return (
              <Tooltip key={item.id} content={item.tooltip} position="top">
                <button
                  onClick={() => onNavigate(item.id)}
                  className="relative -top-3.5 flex flex-col items-center group focus:outline-none shrink-0 active:scale-90 transition-transform"
                  aria-label="Snap Rumor or Report Price"
                >
                  <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition-transform ${
                    isActive 
                      ? 'bg-[#FFD60A] text-[#0A3D2E] ring-4 ring-[#0A3D2E]/20' 
                      : 'bg-[#0A3D2E] text-[#FFD60A] hover:bg-[#0c4b38]'
                  }`}>
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                  </div>
                  <span className={`text-[10px] sm:text-[11px] font-extrabold mt-0.5 tracking-tight ${
                    isActive ? 'text-[#0A3D2E]' : 'text-gray-600'
                  }`}>
                    Snap Rumor
                  </span>
                </button>
              </Tooltip>
            );
          }

          return (
            <Tooltip key={item.id} content={item.tooltip} position="top">
              <button
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center py-1 px-1.5 sm:px-2 rounded-xl transition-all active:scale-95 shrink-0 ${
                  isActive ? 'text-[#0A3D2E]' : 'text-gray-500 hover:text-gray-900'
                }`}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#0A3D2E] rounded-full" />
                  )}
                </div>
                <span className={`text-[10px] sm:text-[11px] mt-0.5 font-medium ${isActive ? 'font-extrabold text-[#0A3D2E]' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </button>
            </Tooltip>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
