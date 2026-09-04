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
  Zap,
  BrainCircuit,
  Cpu,
  PenTool,
  Grid
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { UserProfile, SabiationResource } from '../../types';
import { FREE_SABIATION_RESOURCES } from '../../data/mockData';
import { AiImageGenerator } from './AiImageGenerator';
import { QuizationSection } from './QuizationSection';
import { NumaPromptEngine } from './NumaPromptEngine';
import { AvidEssaySection } from './AvidEssaySection';

interface SabiationViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onShowToast: (points: number, message: string) => void;
}

export const SabiationView: React.FC<SabiationViewProps> = ({ onNavigate, onShowToast }) => {
  const [user, setUser] = useState<UserProfile>(storageService.getUser());
  const [activeCapability, setActiveCapability] = useState<'all' | 'image' | 'quiz' | 'numa' | 'essay'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setUser(storageService.getUser());
    });
    return unsubscribe;
  }, []);

  const isDeluxeUnlocked = user.userTier === 'Deluxe' || user.role === 'admin';

  const categories = ['All', 'Image Generation', 'Creative Prompts', 'Video AI', 'Audio & Speech', 'Documents & OCR', 'Coding Sandbox'];

  const filteredResources = activeCategory === 'All' 
    ? FREE_SABIATION_RESOURCES 
    : FREE_SABIATION_RESOURCES.filter(r => r.category === activeCategory);

  // STRICT ACCESS CONTROL: Only Deluxe Sovereign VIP members can enter The Sabiation
  if (!isDeluxeUnlocked) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-24 animate-fade-in" id="sabiation-locked-view">
        {/* VIP Lock Hero Banner */}
        <div className="bg-gradient-to-br from-purple-950 via-indigo-950 to-[#0A3D2E] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border-2 border-purple-500/40 relative overflow-hidden text-center space-y-5">
          <div className="w-20 h-20 rounded-3xl bg-purple-900/60 border border-purple-400/40 text-amber-300 flex items-center justify-center mx-auto shadow-xl">
            <Lock className="w-10 h-10 text-[#FFD60A]" />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-[#FFD60A] text-[#0A3D2E] text-xs font-mono font-extrabold px-3.5 py-1 rounded-full shadow-sm font-display uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-[#0A3D2E]" />
            <span>Deluxe Sovereign VIP Exclusive Suite</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight">
            The Sabiation Access Locked
          </h1>

          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed max-w-xl mx-auto">
            The Sabiation is SABI's elite intelligence and generative creative suite. Access is strictly reserved for <strong>Deluxe Sovereign VIP</strong> titleholders.
          </p>

          <div className="p-4 bg-white/10 rounded-2xl border border-white/15 max-w-md mx-auto flex items-center justify-between text-xs">
            <div className="text-left">
              <span className="text-[10px] uppercase text-purple-200 block font-bold">Your Current Title</span>
              <span className="font-extrabold text-white text-sm">{user.userTier || 'Member'}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-amber-300 block font-bold">Required Title</span>
              <span className="font-extrabold text-[#FFD60A] text-sm">👑 Deluxe VIP (300,000 PTS)</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('profile')}
              className="w-full sm:w-auto bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-black text-sm px-8 py-3.5 rounded-2xl shadow-xl transition-all active:scale-95 font-display flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade to Deluxe Title in Store</span>
            </button>
          </div>
        </div>

        {/* Feature Preview Card */}
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-gray-900 font-display font-extrabold text-base">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>What Deluxe Sovereign VIP Unlocks in The Sabiation:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
              <div className="font-extrabold text-purple-950 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>1. AI Image Generator (720p · 1080p · 4K)</span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Generate high-resolution photorealistic imagery, diagrams, and artwork with downloadable outputs.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-1">
              <div className="font-extrabold text-indigo-950 flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-indigo-600" />
                <span>2. Quization Exam & Folders Engine</span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Create structured exams from text or uploaded documents with instant grading and organized folders.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 space-y-1">
              <div className="font-extrabold text-amber-950 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-amber-600" />
                <span>3. Numa Prompt Architect</span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Structure complex deep-investigation OSINT prompts with camera optics and lighting triangulation.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
              <div className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-emerald-600" />
                <span>4. Avid Essay & avidayo.created.app</span>
              </div>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                Full access to the Avid academic essay generator and the secret avidayo.created.app generative web portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-fade-in" id="sabiation-portal-view">
      
      {/* HERO BANNER */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-[#0A3D2E] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-400/40 relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-[#FFD60A] text-[#0A3D2E] text-xs font-mono font-extrabold px-3 py-1 rounded-full shadow-sm font-display">
            <Crown className="w-3.5 h-3.5 text-[#0A3D2E]" />
            <span>THE SABIATION · DELUXE VIP UNLOCKED</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            The Sabiation VIP Suite
          </h1>

          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            Welcome to the comprehensive creative & analytical AI suite: <strong>1. AI Image Generation (720p - 4K)</strong>, <strong>2. Quization (Interactive exams & files/folders)</strong>, <strong>3. Numa (Prompt structurer)</strong>, and <strong>4. Avid (Essay writer at avidayo.created.app/essay)</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="bg-white/10 text-white px-3 py-1 rounded-full font-bold border border-white/20 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Image Gen (720p · 1080p · 4K)</span>
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full font-bold border border-white/20 flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Quization Exam AI</span>
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full font-bold border border-white/20 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Numa Prompt Structurer</span>
            </span>
            <span className="bg-white/10 text-white px-3 py-1 rounded-full font-bold border border-white/20 flex items-center gap-1">
              <PenTool className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>Avid Essay Writer</span>
            </span>
          </div>
        </div>
      </div>

      {/* CAPABILITY NAVIGATION TABS */}
      <div className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveCapability('all')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
            activeCapability === 'all'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>All Capabilities</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCapability('image')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
            activeCapability === 'image'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-blue-500" />
          <span>1. Image Generation (720p - 4K)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCapability('quiz')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
            activeCapability === 'quiz'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-indigo-500" />
          <span>2. Quization AI & Files</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCapability('numa')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
            activeCapability === 'numa'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <Cpu className="w-4 h-4 text-amber-500" />
          <span>3. Numa Prompt Engine</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveCapability('essay')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 shrink-0 ${
            activeCapability === 'essay'
              ? 'bg-[#0A3D2E] text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          <PenTool className="w-4 h-4 text-emerald-500" />
          <span>4. Avid Essay Writer</span>
        </button>
      </div>

      {/* ACCESS STATUS & DELUXE VIP PORTAL LINK */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-[#0A3D2E] text-white rounded-3xl p-5 sm:p-6 shadow-lg border border-purple-400/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center shrink-0 shadow-sm font-black">
              <Crown className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFD60A] text-[#0A3D2E] px-2.5 py-0.5 rounded-full">
                  Deluxe Sovereign VIP Exclusive Link
                </span>
                <span className="text-xs font-black text-emerald-300">
                  Unlocked ✓
                </span>
              </div>
              <h3 className="font-extrabold text-lg sm:text-xl text-white font-display">
                Official VIP Portal: <span className="font-mono bg-white/15 px-2 py-0.5 rounded-lg border border-white/20">avidayo.created.app</span>
              </h3>
              <p className="text-xs text-purple-200 font-medium">
                Direct access to the secret full generative AI web creator, essay suite, & media forensic tools.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://avidayo.created.app"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                storageService.addPoints(10, 'Opened Deluxe Sovereign VIP Portal avidayo.created.app');
                onShowToast(10, 'Launched Deluxe Secret Web Portal (+10 PTS)!');
              }}
              className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md flex items-center gap-2 transition-all active:scale-95 font-display"
            >
              <span>Launch avidayo.created.app</span>
              <ExternalLink className="w-4 h-4 text-[#0A3D2E]" />
            </a>
          </div>
        </div>
      </div>

      {/* 1. IMAGE GENERATOR (720p · 1080p · 4K Engine) */}
      {(activeCapability === 'all' || activeCapability === 'image') && (
        <AiImageGenerator onShowToast={onShowToast} />
      )}

      {/* 2. QUIZATION EXAM & FILE/FOLDER AI */}
      {(activeCapability === 'all' || activeCapability === 'quiz') && (
        <QuizationSection onShowToast={onShowToast} />
      )}

      {/* 3. NUMA PROMPT STRUCTURER & OPTIMIZER */}
      {(activeCapability === 'all' || activeCapability === 'numa') && (
        <NumaPromptEngine onShowToast={onShowToast} />
      )}

      {/* 4. AVID ESSAY WRITER (Directing to avidayo.created.app/essay) */}
      {(activeCapability === 'all' || activeCapability === 'essay') && (
        <AvidEssaySection onShowToast={onShowToast} />
      )}

      {/* FREE WEB TOOLS DIRECTORY CATALOG */}
      {activeCapability === 'all' && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900 font-display flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Web AI Tool Catalog</span>
            </h3>
            <span className="text-xs text-gray-500">100% Free Tools</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
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
      )}

    </div>
  );
};
