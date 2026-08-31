import React, { useState, useEffect, useRef } from 'react';
import { 
  Utensils, 
  Sparkles, 
  Camera, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  Clock, 
  Users, 
  Flame, 
  ChefHat, 
  Check, 
  Loader2, 
  ArrowRight,
  Film
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { AiService } from '../../services/aiService';
import { RecipeItem } from '../../types';

interface RecipeViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onShowPointsToast: (points: number, message: string) => void;
}

export const RecipeView: React.FC<RecipeViewProps> = ({ onNavigate, onShowPointsToast }) => {
  const [recipes, setRecipes] = useState<RecipeItem[]>(storageService.getRecipes());
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem>(recipes[0]);

  // Ingredients tag input / selection
  const [ingredientTags, setIngredientTags] = useState<string[]>([
    'Yam', 'Eggs', 'Fresh Tomatoes', 'Scotch Bonnet (Atarodo)', 'Onions', 'Vegetable Oil'
  ]);
  const [newIngredientInput, setNewIngredientInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // 20-Second Recipe Video Timeline state
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoProgressSec, setVideoProgressSec] = useState<number>(0);
  const videoTimerRef = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setRecipes(storageService.getRecipes());
    });
    return unsubscribe;
  }, []);

  // 20-Second video timer loop
  useEffect(() => {
    if (isVideoPlaying) {
      videoTimerRef.current = setInterval(() => {
        setVideoProgressSec(prev => {
          if (prev >= 20) {
            return 0;
          }
          return Number((prev + 0.2).toFixed(1));
        });
      }, 200);
    } else {
      if (videoTimerRef.current) clearInterval(videoTimerRef.current);
    }
    return () => {
      if (videoTimerRef.current) clearInterval(videoTimerRef.current);
    };
  }, [isVideoPlaying]);

  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIngredientInput.trim()) return;
    if (!ingredientTags.includes(newIngredientInput.trim())) {
      setIngredientTags(prev => [...prev, newIngredientInput.trim()]);
    }
    setNewIngredientInput('');
  };

  const handleRemoveIngredient = (tag: string) => {
    setIngredientTags(prev => prev.filter(t => t !== tag));
  };

  const handleGenerateRecipe = async () => {
    if (ingredientTags.length === 0) return;
    setIsGenerating(true);
    const newRec = await AiService.generateRecipeFromIngredients(ingredientTags);
    setIsGenerating(false);
    setSelectedRecipe(newRec);
    storageService.addRecipe(newRec);
    onShowPointsToast(15, 'Generated fresh Nigerian recipe with SABI AI!');
  };

  // Determine current active step in 20-second video:
  // 0-5s: Step 1 (Prep)
  // 5-12s: Step 2 (Cook Sauce)
  // 12-17s: Step 3 (Combine)
  // 17-20s: Serve & Garnish
  const getVideoStepIndex = () => {
    if (videoProgressSec < 5) return 0;
    if (videoProgressSec < 12) return 1;
    return 2;
  };

  const activeVideoStep = selectedRecipe.steps[getVideoStepIndex()] || selectedRecipe.steps[0];

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16 animate-fade-in">
      
      {/* Header (Section 46) */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A3D2E] bg-emerald-100 px-3 py-1 rounded-full uppercase">
          <ChefHat className="w-3.5 h-3.5" />
          <span>Nigerian Food AI</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">
          Recipe Generator
        </h1>
        <p className="text-sm text-gray-600">
          Enter or detect available ingredients to generate authentic, concise 3-step Nigerian recipes and 20-second cooking clips.
        </p>
      </div>

      {/* DETECTED INGREDIENTS SCANNER & TAG BUILDER (Section 46) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-gray-900 font-display flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#0A3D2E]" />
            <span>Detected Ingredients</span>
          </h3>
          <span className="text-xs text-gray-500 font-medium">
            {ingredientTags.length} items listed
          </span>
        </div>

        {/* Tag chips */}
        <div className="flex flex-wrap gap-2">
          {ingredientTags.map(tag => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#0A3D2E] border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold font-display"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => handleRemoveIngredient(tag)}
                className="hover:text-red-600 rounded-full"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add ingredient input */}
        <form onSubmit={handleAddIngredient} className="flex gap-2">
          <input
            type="text"
            placeholder="Add another ingredient (e.g. Palm Oil, Fish, Crayfish)..."
            value={newIngredientInput}
            onChange={(e) => setNewIngredientInput(e.target.value)}
            className="flex-grow bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
          />
          <button
            type="submit"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </form>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-1.5 pt-1 text-xs text-gray-500">
          <span className="font-medium text-[11px] mr-1">Quick Add:</span>
          {['Garri', 'Spinach', 'Catfish', 'Rice', 'Locust Beans', 'Beef', 'Plantain'].map(item => (
            <button
              key={item}
              type="button"
              onClick={() => {
                if (!ingredientTags.includes(item)) setIngredientTags(prev => [...prev, item]);
              }}
              className="bg-gray-100 hover:bg-emerald-100 hover:text-[#0A3D2E] text-gray-700 px-2.5 py-1 rounded-lg text-[11px] transition-colors"
            >
              +{item}
            </button>
          ))}
        </div>

        {/* GENERATE RECIPE BUTTON */}
        <div className="pt-2">
          <button
            onClick={handleGenerateRecipe}
            disabled={isGenerating || ingredientTags.length === 0}
            className="w-full bg-[#0A3D2E] hover:bg-[#0c4b38] disabled:opacity-50 text-[#FFD60A] font-extrabold text-base py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2.5 font-display"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Crafting Nigerian Recipe...</span>
              </>
            ) : (
              <>
                <ChefHat className="w-5 h-5 stroke-[2.5]" />
                <span>GENERATE RECIPE</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* RECIPE RESULT HEADER & META (Section 47) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-[#FFD60A] text-[#0A3D2E] px-2.5 py-0.5 rounded-full font-display">
            {selectedRecipe.originRegion}
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 font-display">
            {selectedRecipe.title}
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            {selectedRecipe.description}
          </p>
        </div>

        {/* Recipe Badges */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-2.5">
            <span className="text-gray-400 text-[10px] uppercase font-bold block">Prep Time</span>
            <strong className="text-gray-800 font-display">{selectedRecipe.prepTimeMinutes} mins</strong>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5">
            <span className="text-gray-400 text-[10px] uppercase font-bold block">Cook Time</span>
            <strong className="text-gray-800 font-display">{selectedRecipe.cookTimeMinutes} mins</strong>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5">
            <span className="text-gray-400 text-[10px] uppercase font-bold block">Servings</span>
            <strong className="text-gray-800 font-display">{selectedRecipe.servings} portions</strong>
          </div>
        </div>

      </div>

      {/* 3 LARGE VISUAL STEP CARDS (Section 47) */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-gray-900 font-display">
          3-Step Simple Cooking Guide
        </h3>

        {selectedRecipe.steps.map((step) => (
          <div
            key={step.stepNumber}
            className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 p-5 hover:border-[#0A3D2E] transition-all"
          >
            {/* Step Image */}
            <div className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden shrink-0 relative bg-gray-100">
              <img
                src={step.imageUrl}
                alt={step.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 w-7 h-7 rounded-xl bg-[#0A3D2E] text-[#FFD60A] font-extrabold text-xs flex items-center justify-center shadow-md font-display">
                {step.stepNumber}
              </div>
            </div>

            {/* Step Content */}
            <div className="space-y-2 flex-grow flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-emerald-800 block font-display">
                  Step {step.stepNumber}
                </span>
                <h4 className="font-bold text-base text-gray-900 font-display">
                  {step.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {step.instruction}
                </p>
              </div>

              {step.tips && (
                <div className="bg-amber-50 rounded-xl p-2.5 text-[11px] text-amber-900 border border-amber-200">
                  <strong>Chef Tip:</strong> {step.tips}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 20-SECOND RECIPE VIDEO PLAYER (Section 48) */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-[#0A3D2E]" />
            <h3 className="font-bold text-base text-gray-900 font-display">
              20-Second Recipe Video Guide
            </h3>
          </div>
          <span className="text-xs font-semibold text-[#0A3D2E] bg-emerald-50 px-2.5 py-1 rounded-lg">
            Vertical 9:16 Format
          </span>
        </div>

        {/* Video Canvas Box */}
        <div className="relative bg-gray-950 rounded-3xl overflow-hidden aspect-[9/12] max-w-xs mx-auto text-white shadow-xl flex flex-col justify-between p-4">
          <img
            src={activeVideoStep.imageUrl}
            alt="Cooking step"
            className="absolute inset-0 w-full h-full object-cover opacity-70 scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/70 pointer-events-none" />

          {/* Top Tag */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="bg-[#0A3D2E] text-[#FFD60A] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase font-display">
              SABI RECIPE REEL
            </span>
            <span className="text-xs text-white/90 font-bold font-display">
              {Math.floor(videoProgressSec)}s / 20s
            </span>
          </div>

          {/* Center Play Button */}
          <div
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            className="relative z-10 flex-grow flex items-center justify-center cursor-pointer"
          >
            {!isVideoPlaying && (
              <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                <Play className="w-7 h-7 fill-white ml-1" />
              </div>
            )}
          </div>

          {/* Bottom Captions & Step Breakdown */}
          <div className="relative z-10 space-y-2">
            <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-xl p-3">
              <span className="text-[10px] font-extrabold text-[#FFD60A] uppercase block">
                STEP {activeVideoStep.stepNumber}: {activeVideoStep.title}
              </span>
              <p className="text-xs font-bold text-white mt-0.5 line-clamp-2">
                {activeVideoStep.instruction}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#FFD60A] h-full transition-all duration-200"
                style={{ width: `${(videoProgressSec / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsVideoPlaying(!isVideoPlaying)}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
        >
          {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isVideoPlaying ? 'Pause Recipe Clip' : 'Play 20-Second Cooking Guide'}</span>
        </button>

      </div>

    </div>
  );
};
