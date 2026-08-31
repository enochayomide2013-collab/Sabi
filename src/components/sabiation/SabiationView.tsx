import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  ExternalLink, 
  Wand2, 
  Lock, 
  CheckCircle2, 
  Crown, 
  Copy, 
  Check, 
  Video, 
  Mic, 
  FileText, 
  Code, 
  Search,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { UserProfile, SabiationResource } from '../../types';
import { FREE_SABIATION_RESOURCES } from '../../data/mockData';
import { AiImageGenerator } from './AiImageGenerator';

interface SabiationViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onShowToast: (points: number, message: string) => void;
}

export const SabiationView: React.FC<SabiationViewProps> = ({ onNavigate, onShowToast }) => {
  const [user, setUser] = useState<UserProfile>(storageService.getUser());
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [customPrompt, setCustomPrompt] = useState<string>('Hyper-realistic photograph of fresh ripe red Nigerian tomatoes in a woven cane basket at Mile 12 Market Lagos, morning sunshine, cinematic lighting, 8k resolution');
  const [copiedCustom, setCopiedCustom] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setUser(storageService.getUser());
    });
    return unsubscribe;
  }, []);

  const isUnlocked = user.hasSabiationAccess || user.userTier === 'Golden' || user.userTier === 'Deluxe' || user.role === 'admin';

  const categories = ['All', 'Image Generation', 'Creative Prompts', 'Video AI', 'Audio & Speech', 'Documents & OCR', 'Coding Sandbox'];

  const filteredResources = activeCategory === 'All' 
    ? FREE_SABIATION_RESOURCES 
    : FREE_SABIATION_RESOURCES.filter(r => r.category === activeCategory);

  const handleCopyPrompt = (promptText: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(promptText);
      setCopiedPromptId(id);
      onShowToast(5, 'Prompt copied to clipboard! Ready to paste in the AI tool.');
      setTimeout(() => setCopiedPromptId(null), 3000);
    }
  };

  const handleCopyCustomPrompt = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(customPrompt);
      setCopiedCustom(true);
      onShowToast(5, 'Custom prompt copied!');
      setTimeout(() => setCopiedCustom(false), 3000);
    }
  };

  const samplePrompts = [
    {
      id: 'p1',
      title: 'Nigerian Market Produce Photography',
      prompt: 'Vibrant outdoor market stall in Lagos, sacks of golden garri and red chili peppers, shallow depth of field, authentic daylight, ultra detailed photography.'
    },
    {
      id: 'p2',
      title: 'Modern Sabi Tech Sentinel Character',
      prompt: 'African digital sentinel hero holding a luminous emerald tablet with golden truth shield, futuristic cyberpunk African metropolis background, 3D render style.'
    },
    {
      id: 'p3',
      title: 'Traditional Jollof Rice Cooking Scene',
      prompt: 'Cast iron pot of smoky Nigerian party jollof rice steaming with fire wood coals, fried plantains on the side, rich warm colors, culinary food photography.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in" id="sabiation-portal-view">
      
      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-900 to-[#0A3D2E] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/40 relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-[#FFD60A] text-[#0A3D2E] text-xs font-mono font-extrabold px-3 py-1 rounded-full shadow-sm font-display">
            <Crown className="w-3.5 h-3.5 text-[#0A3D2E]" />
            <span>THE SABIATION PORTAL · FREE CREATIVE SUITE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            The Sabiation
          </h1>

          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
            Exclusive creative & AI gateway for Golden and Deluxe SABI members. Discover the web's best 100% free image generation platforms, prompt builders, audio transcribers, and AI toolkits without requiring a credit card.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="bg-white/10 text-white px-3 py-1 rounded-full font-bold border border-white/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Free Image Generation URLs</span>
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full font-bold border border-white/20 flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Free AI Tool Catalog</span>
            </span>
          </div>
        </div>
      </div>

      {/* ACCESS STATUS & GOLDEN LINK SECTION */}
      {isUnlocked ? (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 text-gray-950 rounded-3xl p-5 sm:p-6 shadow-lg border border-amber-300 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-black text-[#FFD60A] flex items-center justify-center shrink-0 shadow-sm">
                <Crown className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-black text-[#FFD60A] px-2.5 py-0.5 rounded-full">
                    Golden Member Exclusive Web Link
                  </span>
                  <span className="text-xs font-black text-amber-950">
                    Unlocked ✓
                  </span>
                </div>
                <h3 className="font-extrabold text-lg sm:text-xl text-black font-display">
                  Official Golden Web: <span className="font-mono bg-white/60 px-2 py-0.5 rounded-lg border border-black/10">avidayo.created.app</span>
                </h3>
                <p className="text-xs text-amber-950/90 font-medium">
                  Direct access to the secret full generative AI web creator & media suite.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href="https://avidayo.created.app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  storageService.addPoints(10, 'Opened Golden Sovereign VIP Portal avidayo.created.app');
                  onShowToast(10, 'Launched Golden Secret Web Portal (+10 PTS)!');
                }}
                className="bg-[#0A3D2E] hover:bg-[#06291e] text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md flex items-center gap-2 transition-all active:scale-95 font-display"
              >
                <span>Launch avidayo.created.app</span>
                <ExternalLink className="w-4 h-4 text-[#FFD60A]" />
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-300 rounded-3xl p-5 shadow-sm space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-grow">
              <h3 className="font-bold text-base text-gray-900 font-display">
                You are currently in Preview Mode
              </h3>
              <p className="text-xs text-gray-600">
                Unlock the secret Golden web link and full active link routing by purchasing the <strong>Golden Sovereign Tier (28,000 PTS)</strong> or <strong>Deluxe VIP (100,000 PTS)</strong> in your Profile Title Store.
              </p>
              <div className="p-2 bg-amber-100/60 rounded-xl text-[11px] text-amber-900 font-semibold inline-flex items-center gap-1.5 mt-1">
                <Lock className="w-3 h-3 text-amber-700" />
                <span>Golden Member Link: <strong>[Locked • Secret link revealed after purchase]</strong></span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('profile')}
              className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all active:scale-95 shrink-0"
            >
              Upgrade Tier
            </button>
          </div>
        </div>
      )}

      {/* AI IMAGE GENERATOR (720p · 1080p · 4K Engine) */}
      <AiImageGenerator onShowToast={onShowToast} />

      {/* QUICK PROMPT COPIER & GENERATOR */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base text-gray-900 font-display">
              Ready-Made AI Image Prompts
            </h3>
          </div>
          <span className="text-xs text-gray-500">Copy & paste into free generators below</span>
        </div>

        {/* Custom prompt composer box */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
            Custom Visual Prompt Builder
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 rounded-2xl p-3.5 text-xs text-gray-900 font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
              placeholder="Type your desired image description..."
            />
            <button
              onClick={handleCopyCustomPrompt}
              className="absolute right-3 bottom-3 bg-[#0A3D2E] hover:bg-[#0c4b38] text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-sm transition-all"
            >
              {copiedCustom ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#FFD60A]" />}
              <span>{copiedCustom ? 'Copied!' : 'Copy Prompt'}</span>
            </button>
          </div>
        </div>

        {/* Sample prompt cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
          {samplePrompts.map((sp) => (
            <div key={sp.id} className="p-3 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5 text-xs flex flex-col justify-between">
              <div>
                <span className="font-bold text-gray-900 block font-display">{sp.title}</span>
                <p className="text-[11px] text-gray-600 line-clamp-3 italic mt-0.5">"{sp.prompt}"</p>
              </div>
              <button
                onClick={() => handleCopyPrompt(sp.prompt, sp.id)}
                className="text-[11px] font-bold text-[#0A3D2E] hover:text-emerald-700 bg-white hover:bg-emerald-50 border border-gray-200 px-2.5 py-1 rounded-lg flex items-center justify-center gap-1 transition-colors self-start mt-2"
              >
                {copiedPromptId === sp.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPromptId === sp.id ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-2 rounded-xl transition-all shrink-0 ${
              activeCategory === cat
                ? 'bg-[#0A3D2E] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FREE AI WEB TOOLS DIRECTORY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="sabiation-tools-grid">
        {filteredResources.map((tool) => (
          <div
            key={tool.id}
            className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase">
                  {tool.category}
                </span>
                <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                  {tool.badge || 'Free Web Tool'}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-base text-gray-900 font-display">
                  {tool.name}
                </h4>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="p-2.5 bg-gray-50 rounded-xl text-[11px] text-gray-700 border border-gray-150">
                <strong className="text-[#0A3D2E]">Free Features:</strong> {tool.freeTierDetails}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
              <span className="text-[10px] text-gray-400 truncate max-w-[120px]">
                {tool.url.replace('https://', '')}
              </span>

              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  storageService.addPoints(5, `Opened Sabiation tool: ${tool.name}`);
                  onShowToast(5, `Launched ${tool.name} (+5 PTS)`);
                }}
                className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all active:scale-95 shrink-0"
              >
                <span>Open Free Tool</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#FFD60A]" />
              </a>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
