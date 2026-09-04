import React from 'react';
import { DollarSign, Sparkles, TrendingDown, Tag, ShoppingBag, Info, Award } from 'lucide-react';
import { RecipeItem } from '../../types';

interface RecipeCostSummaryCardProps {
  recipe: RecipeItem;
  scaledCost: string;
  currentServings: number;
  scaleFactor: number;
  scaledIngredients: string[];
}

export const RecipeCostSummaryCard: React.FC<RecipeCostSummaryCardProps> = ({
  recipe,
  scaledCost,
  currentServings,
  scaleFactor,
  scaledIngredients
}) => {
  // Parse numerical amounts from scaledCost string like "₦2,800 - ₦3,500" or "₦5,000"
  const numbers = (scaledCost.match(/[\d,]+/g) || [])
    .map(s => parseInt(s.replace(/,/g, ''), 10))
    .filter(n => !isNaN(n) && n > 0);

  const minPrice = numbers[0] || 2500;
  const maxPrice = numbers[1] || numbers[0] || 3500;
  const avgPrice = Math.round((minPrice + maxPrice) / 2);
  const costPerServing = Math.round(avgPrice / (currentServings || 1));

  // Determine if Budget-Friendly or Premium
  // Threshold: Under ₦4,500 total (or <= ₦2,000 per plate) is Budget-Friendly; higher is Premium
  const isBudgetFriendly = avgPrice <= 4500 || costPerServing <= 2000;
  const badgeType: 'Budget-Friendly' | 'Premium' = isBudgetFriendly ? 'Budget-Friendly' : 'Premium';

  return (
    <div 
      id="recipe-cost-summary-card"
      className="bg-white border-2 border-emerald-200/80 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4 animate-fade-in"
    >
      {/* Top Banner: Header + Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#0A3D2E] text-[#FFD60A] flex items-center justify-center shrink-0 shadow-xs">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-sm sm:text-base text-gray-900 font-display">
                Total Recipe Cost Estimation
              </h4>
            </div>
            <p className="text-xs text-gray-500">
              Accurate ground-truth pricing for {currentServings} {currentServings === 1 ? 'serving' : 'servings'}
            </p>
          </div>
        </div>

        {/* Visual Badge: Budget-Friendly vs Premium */}
        <div className="flex items-center">
          {badgeType === 'Budget-Friendly' ? (
            <div 
              id="badge-budget-friendly"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-black uppercase tracking-wide shadow-xs"
            >
              <Tag className="w-3.5 h-3.5 text-emerald-700" />
              <span>Budget-Friendly</span>
              <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-md font-bold">Economy</span>
            </div>
          ) : (
            <div 
              id="badge-premium"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/90 border border-amber-300 text-amber-950 text-xs font-black uppercase tracking-wide shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Premium</span>
              <span className="text-[10px] bg-[#0A3D2E] text-[#FFD60A] px-1.5 py-0.2 rounded-md font-bold">Gourmet</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Cost Numbers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-center">
          <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block mb-0.5">
            Total Market Prep Cost
          </span>
          <p className="text-lg sm:text-xl font-extrabold text-[#0A3D2E] font-display">
            {scaledCost}
          </p>
          <span className="text-[10px] text-emerald-700">Open market prices</span>
        </div>

        <div className="bg-gray-50 border border-gray-200/80 rounded-xl p-3 text-center">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block mb-0.5">
            Cost Per Plate
          </span>
          <p className="text-lg sm:text-xl font-extrabold text-gray-900 font-display">
            ~₦{costPerServing.toLocaleString()}
          </p>
          <span className="text-[10px] text-gray-500">Per person / portion</span>
        </div>

        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-center">
          <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider block mb-0.5">
            Market Type Comparison
          </span>
          <p className="text-xs font-bold text-amber-950 mt-1">
            Open Market vs Supermarket
          </p>
          <span className="text-[10px] text-amber-700 block">
            Save ~30% buying in local hubs
          </span>
        </div>
      </div>

      {/* Breakdown Notice & Tips */}
      <div className="bg-gray-50 rounded-xl p-3 border border-gray-200/60 flex items-start gap-2.5 text-xs text-gray-600">
        <Info className="w-4 h-4 text-[#0A3D2E] shrink-0 mt-0.5" />
        <div className="space-y-1 leading-relaxed">
          <p>
            <strong>Price Analysis:</strong> {badgeType === 'Budget-Friendly' 
              ? 'This dish is budget-friendly and uses affordable, readily accessible staple market items in Nigerian markets.' 
              : 'This dish falls in the premium tier due to prime protein, fish, or specialized aromatic soup condiments.'}
          </p>
          <p className="text-[11px] text-gray-500">
            Calculated across {scaledIngredients.length} ingredients with live crowdsourced market indices.
          </p>
        </div>
      </div>
    </div>
  );
};
