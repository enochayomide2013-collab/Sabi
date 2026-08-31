import React from 'react';
import { 
  Home, 
  Camera, 
  ShoppingBasket, 
  Utensils, 
  User,
  Users
} from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'market', label: 'Market', icon: ShoppingBasket },
    { id: 'report', label: 'Report', icon: Camera, isCenter: true },
    { id: 'sabiers', label: 'Sabiers', icon: Users },
    { id: 'recipe', label: 'Recipe', icon: Utensils },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 pb-safe">
      <div className="max-w-lg mx-auto px-2 py-1.5 flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative -top-3.5 flex flex-col items-center group focus:outline-none shrink-0"
              >
                <div className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
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
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center py-1 px-1.5 sm:px-2 rounded-xl transition-all active:scale-95 shrink-0 ${
                isActive ? 'text-[#0A3D2E]' : 'text-gray-500 hover:text-gray-900'
              }`}
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
          );
        })}
      </div>
    </nav>
  );
};
