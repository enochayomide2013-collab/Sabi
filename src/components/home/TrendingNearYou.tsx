import React, { useMemo } from 'react';
import { Flame, ArrowRight, MapPin } from 'lucide-react';
import { TruthResult } from '../../types';
import { storageService, SelectedLocation } from '../../services/storageService';

interface TrendingNearYouProps {
  location: SelectedLocation;
  onNavigate: (tab: string, extraData?: any) => void;
}

export const TrendingNearYou: React.FC<TrendingNearYouProps> = ({ location, onNavigate }) => {
  const trendingRumors = useMemo(() => {
    const allTruths = storageService.getTruthResults();
    // Filter by state and sort by viewsCount/sharesCount to find "trending"
    return allTruths
      .filter((t) => t.state === location.state)
      .sort((a, b) => (b.viewsCount + b.sharesCount) - (a.viewsCount + a.sharesCount))
      .slice(0, 3); // Top 3
  }, [location]);

  if (trendingRumors.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
          <Flame className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 font-display">
            Trending Near {location.state}
          </h2>
          <p className="text-xs text-gray-500">
            Most discussed rumors in your region
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trendingRumors.map((item) => (
          <div
            key={item.id}
            onClick={() => onNavigate('truth-detail', item.id)}
            className="group bg-white rounded-3xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
          >
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
               <MapPin className="w-3 h-3 text-amber-500" />
               {item.area}
            </div>
            <h4 className="font-bold text-sm leading-snug line-clamp-2 text-gray-900 font-display">
              {item.claim}
            </h4>
            <div className="flex items-center justify-between text-[11px] text-gray-500">
              <span>{item.viewsCount} views</span>
              <span className="font-semibold text-amber-700">Trending</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
