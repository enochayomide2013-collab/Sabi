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
  Film,
  DollarSign,
  ExternalLink,
  Tv,
  ListOrdered,
  Bookmark,
  BookmarkCheck,
  Pin,
  Minus,
  RotateCcw,
  Search,
  Share2
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { AiService } from '../../services/aiService';
import { RecipeItem } from '../../types';
import { scaleIngredientQuantity, scaleEstimatedCost, scaleCalories } from '../../utils/recipeScaler';

interface RecipeViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onShowPointsToast: (points: number, message: string) => void;
}

export const RecipeView: React.FC<RecipeViewProps> = ({ onNavigate, onShowPointsToast }) => {
  const [activeTab, setActiveTab] = useState<'generator' | 'saved_library'>('generator');
  const [recipes, setRecipes] = useState<RecipeItem[]>(storageService.getRecipes());
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>(storageService.getSavedRecipeIds());
  const [savedRecipes, setSavedRecipes] = useState<RecipeItem[]>(storageService.getSavedRecipes());

  const [selectedRecipe, setSelectedRecipe] = useState<RecipeItem>(recipes[0] || {
    id: 'default',
    title: 'Yam and Egg Sauce',
    description: 'A classic Nigerian breakfast: boiled yam slices served with rich, aromatic peppered egg sauce.',
    prepTimeMinutes: 10,
    cookTimeMinutes: 15,
    servings: 2,
    difficulty: 'Easy',
    originRegion: 'Nationwide Classic',
    caloriesApprox: 420,
    videoDurationSec: 20,
    videoThumbnail: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=JcE_eWqYdkg',
    youtubeVideoId: 'JcE_eWqYdkg',
    estimatedCost: '₦2,800 - ₦3,500',
    ingredients: ['Yam', 'Eggs', 'Fresh Tomatoes', 'Scotch Bonnet', 'Onions', 'Vegetable Oil'],
    steps: []
  });

  // Serving sizes map per recipe id
  const [servingSizes, setServingSizes] = useState<Record<string, number>>({});

  // Saved recipes library search and category state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedCategory, setSavedCategory] = useState<'all' | 'classic' | 'ai'>('all');

  // Ingredients tag input / selection for AI generator
  const [ingredientTags, setIngredientTags] = useState<string[]>([
    'Yam', 'Eggs', 'Fresh Tomatoes', 'Scotch Bonnet (Atarodo)', 'Onions', 'Vegetable Oil'
  ]);
  const [newIngredientInput, setNewIngredientInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [videoMode, setVideoMode] = useState<'reel' | 'youtube'>('youtube');

  // 20-Second Recipe Video Timeline state
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [videoProgressSec, setVideoProgressSec] = useState<number>(0);
  const videoTimerRef = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      const all = storageService.getRecipes();
      setRecipes(all);
      setSavedRecipeIds(storageService.getSavedRecipeIds());
      setSavedRecipes(storageService.getSavedRecipes());
      if (all.length > 0 && !selectedRecipe) {
        setSelectedRecipe(all[0]);
      }
    });
    return unsubscribe;
  }, [selectedRecipe]);

  // 20-Second video timer loop
  useEffect(() => {
    if (isVideoPlaying && videoMode === 'reel') {
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
  }, [isVideoPlaying, videoMode]);

  // Serving size helpers
  const getServingsFor = (recipe: RecipeItem): number => {
    return servingSizes[recipe.id] ?? (recipe.servings || 2);
  };

  const setServingsFor = (recipeId: string, count: number) => {
    const validCount = Math.max(1, Math.min(20, count));
    setServingSizes(prev => ({ ...prev, [recipeId]: validCount }));
  };

  const handleTogglePin = (recipe: RecipeItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isNowSaved = storageService.toggleSaveRecipe(recipe.id, recipe);
    const updatedIds = storageService.getSavedRecipeIds();
    setSavedRecipeIds(updatedIds);
    setSavedRecipes(storageService.getSavedRecipes());

    if (isNowSaved) {
      onShowPointsToast(10, `Pinned "${recipe.title}" to your Saved Recipes library! (+10 PTS)`);
    } else {
      onShowPointsToast(0, `Removed "${recipe.title}" from Saved Recipes.`);
    }
  };

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
    onShowPointsToast(15, 'Generated fresh Nigerian recipe with step-by-step procedures and cooking video!');
  };

  const getVideoStepIndex = () => {
    if (videoProgressSec < 5) return 0;
    if (videoProgressSec < 12) return 1;
    return 2;
  };

  const activeVideoStep = selectedRecipe?.steps?.[getVideoStepIndex()] || selectedRecipe?.steps?.[0] || {
    stepNumber: 1,
    title: 'Preparation',
    instruction: 'Prepare ingredients and wash thoroughly.',
    imageUrl: selectedRecipe?.videoThumbnail || ''
  };

  // Scaled calculations for currently selected recipe
  const baseServings = selectedRecipe?.servings || 2;
  const currentServings = getServingsFor(selectedRecipe);
  const scaleFactor = currentServings / baseServings;
  const scaledIngredients = selectedRecipe?.ingredients.map(ing => scaleIngredientQuantity(ing, scaleFactor)) || [];
  const scaledCost = scaleEstimatedCost(selectedRecipe?.estimatedCost, scaleFactor);
  const scaledCalories = scaleCalories(selectedRecipe?.caloriesApprox, scaleFactor);
  const isSelectedRecipePinned = savedRecipeIds.includes(selectedRecipe?.id);

  // Filter saved recipes for Library tab
  const filteredSavedRecipes = savedRecipes.filter(rec => {
    const matchesSearch = 
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.originRegion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.ingredients.some(ing => ing.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (savedCategory === 'classic') {
      return rec.originRegion.toLowerCase().includes('classic') || rec.id === 'default';
    }
    if (savedCategory === 'ai') {
      return rec.id.startsWith('rec_gen_');
    }
    return true;
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 animate-fade-in" id="recipe-view-main">
      
      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A3D2E] bg-emerald-100 px-3 py-1 rounded-full uppercase font-display">
          <ChefHat className="w-3.5 h-3.5" />
          <span>Nigerian Food AI & Cooking Procedures</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">
          Recipe & Cost Estimator
        </h1>
        <p className="text-sm text-gray-600">
          Generate authentic Nigerian dishes, recalculate ingredient quantities by serving size, pin your favorite recipes, and watch cooking videos.
        </p>
      </div>

      {/* VIEW SUB-NAVIGATION TABS */}
      <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-1">
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold font-display transition-all flex items-center justify-center gap-2 ${
            activeTab === 'generator'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <ChefHat className="w-4 h-4" />
          <span>Recipe Generator & Cooking</span>
        </button>

        <button
          onClick={() => setActiveTab('saved_library')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold font-display transition-all flex items-center justify-center gap-2 relative ${
            activeTab === 'saved_library'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Bookmark className="w-4 h-4 text-[#FFD60A]" />
          <span>Saved Recipes Library</span>
          {savedRecipes.length > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
              activeTab === 'saved_library' ? 'bg-[#FFD60A] text-[#0A3D2E]' : 'bg-emerald-100 text-[#0A3D2E]'
            }`}>
              {savedRecipes.length}
            </span>
          )}
        </button>
      </div>

      {/* ==================== TAB 1: RECIPE GENERATOR & COOKING PROCEDURES ==================== */}
      {activeTab === 'generator' && (
        <div className="space-y-6 animate-fade-in">

          {/* DETECTED INGREDIENTS SCANNER & TAG BUILDER */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-gray-900 font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#0A3D2E]" />
                <span>Your Available Ingredients</span>
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
                placeholder="Type ingredient (e.g. Palm Oil, Smoked Fish, Crayfish, Plantain)..."
                value={newIngredientInput}
                onChange={(e) => setNewIngredientInput(e.target.value)}
                className="flex-grow px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D2E]"
              />
              <button
                type="submit"
                className="bg-[#0A3D2E] text-white px-4 py-2.5 rounded-xl text-xs font-bold font-display hover:bg-[#0c4b38] flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </form>

            {/* Generate Button */}
            <div className="pt-2">
              <button
                onClick={handleGenerateRecipe}
                disabled={isGenerating || ingredientTags.length === 0}
                className="w-full bg-[#0A3D2E] hover:bg-[#0c4b38] disabled:bg-gray-300 text-white font-extrabold text-sm py-3.5 px-6 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 font-display uppercase tracking-wider"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-[#FFD60A]" />
                    <span>Crafting Nigerian Dish & Steps...</span>
                  </>
                ) : (
                  <>
                    <ChefHat className="w-5 h-5 stroke-[2.5]" />
                    <span>GENERATE RECIPE & COOKING PROCEDURES</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RECIPE PICKER CAROUSEL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-gray-700 font-display">
              <span>Select Recipe to Cook & Adjust Servings</span>
              <span className="text-gray-500 font-medium">{recipes.length} available</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {recipes.map(rec => {
                const isPinned = savedRecipeIds.includes(rec.id);
                return (
                  <button
                    key={rec.id}
                    onClick={() => setSelectedRecipe(rec)}
                    className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all border text-left flex items-start justify-between gap-3 ${
                      selectedRecipe?.id === rec.id
                        ? 'bg-[#0A3D2E] text-white border-[#0A3D2E] shadow-md ring-2 ring-[#0A3D2E]/30'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <span className="block truncate max-w-[150px] font-display">{rec.title}</span>
                      <span className={`text-[10px] font-semibold block ${selectedRecipe?.id === rec.id ? 'text-[#FFD60A]' : 'text-emerald-700'}`}>
                        {rec.estimatedCost || '₦3,000 avg'}
                      </span>
                    </div>

                    {isPinned && (
                      <Bookmark className="w-3.5 h-3.5 text-[#FFD60A] fill-[#FFD60A] shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* RECIPE RESULT HEADER & META */}
          {selectedRecipe && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
              
              <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-[#FFD60A] text-[#0A3D2E] px-2.5 py-0.5 rounded-full font-display">
                      {selectedRecipe.originRegion}
                    </span>
                    {isSelectedRecipePinned && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-[#0A3D2E] px-2 py-0.5 rounded-full font-display">
                        <BookmarkCheck className="w-3 h-3 text-[#0A3D2E]" />
                        <span>Pinned in Library</span>
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-extrabold text-gray-900 font-display">
                    {selectedRecipe.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {/* Pin / Bookmark Action Button */}
                  <button
                    onClick={(e) => handleTogglePin(selectedRecipe, e)}
                    className={`px-3 py-2 rounded-2xl text-xs font-bold font-display flex items-center gap-1.5 transition-all shadow-sm ${
                      isSelectedRecipePinned
                        ? 'bg-[#FFD60A] text-[#0A3D2E] hover:bg-yellow-400'
                        : 'bg-gray-100 text-gray-800 hover:bg-emerald-50 hover:text-[#0A3D2E] border border-gray-200'
                    }`}
                  >
                    {isSelectedRecipePinned ? (
                      <>
                        <BookmarkCheck className="w-4 h-4 text-[#0A3D2E]" />
                        <span>Pinned</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-4 h-4 text-gray-500" />
                        <span>Pin Recipe</span>
                      </>
                    )}
                  </button>

                  {/* Estimated Market Cost Badge (Dynamically Scaled) */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2 text-right">
                    <span className="text-[10px] uppercase font-bold text-emerald-800 block">Est. Market Cost</span>
                    <strong className="text-sm sm:text-base text-[#0A3D2E] font-display">
                      {scaledCost}
                    </strong>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {selectedRecipe.description}
              </p>

              {/* SERVING SIZE RECALCULATOR & ADJUSTER BAR */}
              <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 border border-emerald-200 rounded-2xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-[#0A3D2E] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-xs sm:text-sm text-gray-900 font-display uppercase tracking-wide">
                          Serving Size Adjuster
                        </h4>
                        {scaleFactor !== 1 && (
                          <span className="text-[10px] font-extrabold bg-[#FFD60A] text-[#0A3D2E] px-2 py-0.5 rounded-full font-display">
                            {scaleFactor.toFixed(1)}x Multiplier
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-600">
                        Base recipe serves {baseServings} • Ingredients auto-scale instantly
                      </p>
                    </div>
                  </div>

                  {/* Portion Stepper Controls */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <div className="flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                      <button
                        type="button"
                        onClick={() => setServingsFor(selectedRecipe.id, currentServings - 1)}
                        disabled={currentServings <= 1}
                        className="px-2.5 py-1.5 hover:bg-gray-100 text-gray-700 disabled:opacity-30 transition-colors font-bold text-sm"
                        title="Decrease servings"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="px-3 py-1 text-xs font-black text-[#0A3D2E] font-display min-w-[70px] text-center border-x border-gray-100">
                        {currentServings} {currentServings === 1 ? 'Person' : 'People'}
                      </span>

                      <button
                        type="button"
                        onClick={() => setServingsFor(selectedRecipe.id, currentServings + 1)}
                        disabled={currentServings >= 20}
                        className="px-2.5 py-1.5 hover:bg-gray-100 text-gray-700 disabled:opacity-30 transition-colors font-bold text-sm"
                        title="Increase servings"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {scaleFactor !== 1 && (
                      <button
                        type="button"
                        onClick={() => setServingsFor(selectedRecipe.id, baseServings)}
                        className="p-1.5 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        title="Reset to original serving size"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick portion preset buttons */}
                <div className="flex items-center gap-1.5 pt-1 border-t border-emerald-100 text-xs">
                  <span className="text-[10px] font-bold text-emerald-900 uppercase font-display mr-1">Quick Portions:</span>
                  {[1, 2, 4, 6, 8, 12].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setServingsFor(selectedRecipe.id, num)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all font-display ${
                        currentServings === num
                          ? 'bg-[#0A3D2E] text-white shadow-sm'
                          : 'bg-white text-gray-700 border border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {num} {num === 1 ? 'person' : 'people'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recipe Badges (Dynamically Scaled) */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                <div className="bg-gray-50 rounded-xl p-2">
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Prep</span>
                  <strong className="text-gray-800 font-display">{selectedRecipe.prepTimeMinutes}m</strong>
                </div>
                <div className="bg-gray-50 rounded-xl p-2">
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Cook</span>
                  <strong className="text-gray-800 font-display">{selectedRecipe.cookTimeMinutes}m</strong>
                </div>
                <div className="bg-gray-50 rounded-xl p-2 border border-emerald-200">
                  <span className="text-emerald-800 text-[10px] uppercase font-bold block">Servings</span>
                  <strong className="text-[#0A3D2E] font-display">{currentServings}</strong>
                </div>
                <div className="bg-gray-50 rounded-xl p-2">
                  <span className="text-gray-400 text-[10px] uppercase font-bold block">Calories</span>
                  <strong className="text-gray-800 font-display">{scaledCalories} kcal</strong>
                </div>
              </div>

              {/* Recalculated Ingredients List */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-gray-900 font-display uppercase tracking-wide flex items-center gap-1.5">
                    <Utensils className="w-3.5 h-3.5 text-[#0A3D2E]" />
                    <span>Required Ingredients ({scaledIngredients.length})</span>
                  </h4>
                  {scaleFactor !== 1 && (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-display">
                      Quantities adjusted for {currentServings} people
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {scaledIngredients.map((ing, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-3 py-1.5 rounded-xl font-medium border transition-all ${
                        scaleFactor !== 1
                          ? 'bg-emerald-50 text-[#0A3D2E] border-emerald-200 font-bold'
                          : 'bg-white border-gray-200 text-gray-800'
                      }`}
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 3 LARGE VISUAL STEP CARDS & PROCEDURES */}
          {selectedRecipe && selectedRecipe.steps && selectedRecipe.steps.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-base text-gray-900 font-display flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-[#0A3D2E]" />
                <span>Step-by-Step Cooking Procedures</span>
              </h3>

              {selectedRecipe.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 p-5 hover:border-[#0A3D2E] transition-all"
                >
                  {/* Step Image */}
                  <div className="w-full sm:w-36 h-36 rounded-2xl overflow-hidden shrink-0 relative bg-gray-100">
                    <img
                      src={step.imageUrl || selectedRecipe.videoThumbnail}
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
          )}

          {/* YOUTUBE COOKING VIDEO & 20-SECOND REEL */}
          {selectedRecipe && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Film className="w-5 h-5 text-[#0A3D2E]" />
                  <h3 className="font-bold text-base text-gray-900 font-display">
                    Cooking Video & Demonstration
                  </h3>
                </div>
                
                {/* Mode Switcher */}
                <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setVideoMode('youtube')}
                    className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${
                      videoMode === 'youtube' ? 'bg-red-600 text-white shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    ▶️ YouTube Video
                  </button>
                  <button
                    onClick={() => setVideoMode('reel')}
                    className={`text-xs px-3 py-1 rounded-lg font-bold transition-all ${
                      videoMode === 'reel' ? 'bg-[#0A3D2E] text-white shadow-sm' : 'text-gray-600'
                    }`}
                  >
                    📱 20s Sabi Reel
                  </button>
                </div>
              </div>

              {videoMode === 'youtube' ? (
                <div className="space-y-3">
                  <div className="relative bg-black rounded-3xl overflow-hidden aspect-video shadow-lg border border-gray-800">
                    {selectedRecipe.youtubeVideoId ? (
                      <iframe 
                        className="w-full h-full"
                        src={`https://www.youtube-nocookie.com/embed/${selectedRecipe.youtubeVideoId}?autoplay=0&rel=0`}
                        title={`${selectedRecipe.title} Recipe Video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-gray-900 text-white">
                        <Tv className="w-10 h-10 text-red-500 mb-2" />
                        <p className="font-bold text-sm">YouTube Video Demonstration Available</p>
                        <a
                          href={selectedRecipe.youtubeVideoUrl || `https://www.youtube.com/results?search_query=how+to+cook+${encodeURIComponent(selectedRecipe.title)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-3 inline-flex items-center gap-1.5 bg-red-600 text-white text-xs px-4 py-2 rounded-xl font-bold font-display"
                        >
                          <span>Watch On YouTube</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  {selectedRecipe.youtubeVideoUrl && (
                    <div className="flex justify-end">
                      <a
                        href={selectedRecipe.youtubeVideoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                      >
                        <span>Open video in YouTube app</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Vertical Reel Video Canvas Box */}
                  <div className="relative bg-gray-950 rounded-3xl overflow-hidden aspect-[9/12] max-w-xs mx-auto text-white shadow-xl flex flex-col justify-between p-4">
                    <img
                      src={activeVideoStep.imageUrl || selectedRecipe.videoThumbnail}
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
                        <span className="text-[10px] font-extrabold text-[#FFD60A] uppercase block font-display">
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
              )}

            </div>
          )}

        </div>
      )}

      {/* ==================== TAB 2: SAVED RECIPES LIBRARY (PINBOARD) ==================== */}
      {activeTab === 'saved_library' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Library Header Card */}
          <div className="bg-[#0A3D2E] text-white rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="w-6 h-6 text-[#FFD60A] fill-[#FFD60A]" />
                <h2 className="text-xl font-extrabold font-display">
                  Your Saved Recipes Library
                </h2>
              </div>
              <span className="bg-[#FFD60A] text-[#0A3D2E] text-xs font-black px-3 py-1 rounded-full font-display">
                {savedRecipes.length} Pinned
              </span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Your personal Nigerian cookbook. Adjust serving portions to auto-recalculate ingredients, estimated market costs, and launch cooking procedures.
            </p>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search pinned recipes by name, ingredient, or region..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-emerald-200/60 focus:outline-none focus:ring-2 focus:ring-[#FFD60A]"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-2 text-xs pt-1">
              <button
                onClick={() => setSavedCategory('all')}
                className={`px-3 py-1.5 rounded-xl font-bold font-display transition-all ${
                  savedCategory === 'all'
                    ? 'bg-[#FFD60A] text-[#0A3D2E]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                All Pinned ({savedRecipes.length})
              </button>
              <button
                onClick={() => setSavedCategory('classic')}
                className={`px-3 py-1.5 rounded-xl font-bold font-display transition-all ${
                  savedCategory === 'classic'
                    ? 'bg-[#FFD60A] text-[#0A3D2E]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                Classic Dishes
              </button>
              <button
                onClick={() => setSavedCategory('ai')}
                className={`px-3 py-1.5 rounded-xl font-bold font-display transition-all ${
                  savedCategory === 'ai'
                    ? 'bg-[#FFD60A] text-[#0A3D2E]'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                AI Generated
              </button>
            </div>
          </div>

          {/* SAVED RECIPES CARDS LIST */}
          {filteredSavedRecipes.length > 0 ? (
            <div className="space-y-4">
              {filteredSavedRecipes.map((recipe) => {
                const bServings = recipe.servings || 2;
                const cServings = getServingsFor(recipe);
                const factor = cServings / bServings;
                const sIngredients = recipe.ingredients.map(ing => scaleIngredientQuantity(ing, factor));
                const sCost = scaleEstimatedCost(recipe.estimatedCost, factor);
                const sCalories = scaleCalories(recipe.caloriesApprox, factor);

                return (
                  <div
                    key={recipe.id}
                    className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4 hover:border-[#0A3D2E] transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase bg-[#FFD60A] text-[#0A3D2E] px-2.5 py-0.5 rounded-full font-display">
                            {recipe.originRegion}
                          </span>
                          <span className="text-[10px] text-gray-500 font-medium">
                            Prep: {recipe.prepTimeMinutes}m • Cook: {recipe.cookTimeMinutes}m
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-gray-900 font-display">
                          {recipe.title}
                        </h3>
                      </div>

                      {/* Unpin Button */}
                      <button
                        onClick={(e) => handleTogglePin(recipe, e)}
                        className="p-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors shrink-0"
                        title="Unpin / Remove from Saved Library"
                      >
                        <BookmarkCheck className="w-4 h-4 text-[#0A3D2E]" />
                      </button>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {recipe.description}
                    </p>

                    {/* Serving Portion Controls inside Saved Card */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#0A3D2E]" />
                        <span className="text-xs font-bold text-gray-800 font-display">
                          Adjust Servings:
                        </span>
                        <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                          <button
                            type="button"
                            onClick={() => setServingsFor(recipe.id, cServings - 1)}
                            disabled={cServings <= 1}
                            className="px-2 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-30 font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-xs font-black text-[#0A3D2E] font-display min-w-[50px] text-center">
                            {cServings} {cServings === 1 ? 'person' : 'people'}
                          </span>
                          <button
                            type="button"
                            onClick={() => setServingsFor(recipe.id, cServings + 1)}
                            disabled={cServings >= 20}
                            className="px-2 py-1 text-gray-700 hover:bg-gray-100 disabled:opacity-30 font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 font-bold block uppercase">Recalculated Cost</span>
                          <strong className="text-xs sm:text-sm text-[#0A3D2E] font-display">
                            {sCost}
                          </strong>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-gray-400 font-bold block uppercase">Calories</span>
                          <strong className="text-xs text-gray-800 font-display">
                            {sCalories} kcal
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Scaled Ingredients Summary */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
                        <span>Recalculated Ingredients ({sIngredients.length}):</span>
                        {factor !== 1 && (
                          <span className="text-emerald-700 font-bold font-display">
                            Scaled {factor.toFixed(1)}x
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {sIngredients.map((ing, idx) => (
                          <span
                            key={idx}
                            className="bg-emerald-50 text-[#0A3D2E] border border-emerald-100 text-[11px] font-medium px-2.5 py-1 rounded-xl"
                          >
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedRecipe(recipe);
                          setActiveTab('generator');
                        }}
                        className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl font-display flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <ChefHat className="w-4 h-4 text-[#FFD60A]" />
                        <span>Cook & View Procedures</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 text-center border border-gray-200 shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#0A3D2E] flex items-center justify-center mx-auto">
                <Bookmark className="w-7 h-7 text-[#0A3D2E]" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-lg font-bold text-gray-900 font-display">
                  {searchQuery ? 'No matching saved recipes' : 'Your Library is Empty'}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {searchQuery
                    ? `No pinned recipes found matching "${searchQuery}". Try clearing your search filters.`
                    : 'You haven\'t pinned any recipes yet. Generate or browse dishes in the Recipe Generator and click "Pin Recipe" to save them here!'}
                </p>
              </div>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setSavedCategory('all');
                  setActiveTab('generator');
                }}
                className="bg-[#0A3D2E] text-white text-xs font-bold px-5 py-2.5 rounded-xl font-display inline-flex items-center gap-2 hover:bg-[#0c4b38] transition-all"
              >
                <ChefHat className="w-4 h-4 text-[#FFD60A]" />
                <span>Explore Recipe Generator</span>
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
