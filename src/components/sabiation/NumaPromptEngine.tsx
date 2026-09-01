import React, { useState } from 'react';
import { 
  Wand2, 
  Sparkles, 
  Copy, 
  Check, 
  Layers, 
  Sliders, 
  Zap, 
  ArrowRight, 
  Lightbulb, 
  MessageSquare, 
  Send,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { storageService } from '../../services/storageService';

interface NumaPromptEngineProps {
  onShowToast: (points: number, message: string) => void;
  onSendToImageGenerator?: (prompt: string) => void;
}

const NUMA_SUGGESTION_PRESETS = [
  {
    category: '🎨 AI Visual Art & Photography',
    title: 'Nigerian Cultural Heritage Portrait',
    rawIdea: 'A Yoruba woman wearing traditional gele and jewelry in Lagos',
    refinedPrompt: 'Cinematic portrait of a regal Yoruba woman in indigo Adire silk dress and elaborate golden yellow Gele head-tie, intricate beaded jewelry, soft warm studio lighting, 8k resolution, shot on 85mm f/1.2 lens, rich hyper-realistic textures, vibrant Lagos cultural aesthetics'
  },
  {
    category: '📊 Fact-Checking & Deep Forensic Analysis',
    title: 'Multi-Source Rumor & Deepfake Verification',
    rawIdea: 'Verify viral video of fuel price protest in Abuja',
    refinedPrompt: 'Act as an expert digital forensics analyst. Analyze the following media claim: "Viral video claiming fuel subsidy shutdown in Abuja". Perform: 1) Geolocation landmark analysis against FCT roads; 2) Error Level Analysis (ELA) for digital splicing; 3) Cross-verification with local independent market desks; 4) Output clear verdict rating (TRUE, FALSE, OUTDATED, or NEEDS MORE VERIFICATION) with cited social media source timestamps.'
  },
  {
    category: '🍲 Food Market Intelligence & Recipe',
    title: 'Budget-Optimized Nigerian Family Meal Plan',
    rawIdea: 'Cook healthy Nigerian meal with yam, egg, tomatoes for 3 people under 3500 naira',
    refinedPrompt: 'Act as an authentic Nigerian culinary chef and market economist. Design a delicious high-protein meal using Yam, Fresh Eggs, Tomatoes, and Peppers within a strict budget of ₦3,500 for a family of 3. Provide: 1) Estimated price per ingredient in Nigerian local markets; 2) 3-step concise cooking instructions with timing; 3) Nutritional breakdown and chef tips.'
  },
  {
    category: '📝 Academic & Analytical Essay Prompt',
    title: 'Impact of Mobile FinTech in Urban Nigerian Commerce',
    rawIdea: 'Write an essay about mobile banking in Alaba and Computer Village markets',
    refinedPrompt: 'Construct a rigorous analytical academic essay outline investigating the impact of mobile POS terminals and instant digital banking on informal traders in Alaba International and Computer Village, Lagos. Include: 1) Abstract; 2) Socio-economic thesis statement; 3) Literature review on cash vs cashless velocity; 4) Empirical risk factors (network downtime, fraud); 5) Concluding policy recommendations.'
  }
];

export const NumaPromptEngine: React.FC<NumaPromptEngineProps> = ({ onShowToast, onSendToImageGenerator }) => {
  const [rawIdea, setRawIdea] = useState<string>('Vibrant Nigerian marketplace with fresh agricultural produce and warm sunlight');
  const [promptGoal, setPromptGoal] = useState<'image' | 'analysis' | 'essay' | 'code'>('image');
  const [structuredPrompt, setStructuredPrompt] = useState<string>(
    'Hyper-realistic high-definition photograph of a bustling Nigerian food market stall in Lagos, woven wicker baskets overflowing with ripe red scotch bonnet peppers, golden yellow garri, and plantains, natural morning sunshine, shallow depth of field, 8k resolution, photorealistic cinematic lighting'
  );
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleEnhanceWithNuma = () => {
    if (!rawIdea.trim()) return;
    setIsEnhancing(true);

    setTimeout(() => {
      setIsEnhancing(false);
      let enhanced = '';
      const input = rawIdea.trim();

      if (promptGoal === 'image') {
        enhanced = `Photorealistic 8K ultra-detailed cinematic capture: ${input}. Rich natural lighting, authentic color grading, shot on Sony A7R IV with 85mm prime lens, volumetric atmospheric depth, lifelike textures, professional editorial framing.`;
      } else if (promptGoal === 'analysis') {
        enhanced = `Act as an expert data analyst and senior fact-checker. Investigate the subject: "${input}". 
1. Scope & Core Claim: Identify the fundamental assertion and provenance.
2. Forensic Verification: Examine audio/video metadata, geolocation clues, and cross-reference credible on-ground sources.
3. Consensus Assessment: Summarize verified evidence vs unverified speculation.
4. Structured Verdict: Provide a clear verdict (TRUE, FALSE, OUTDATED, MISLEADING) with action recommendations.`;
      } else if (promptGoal === 'essay') {
        enhanced = `Draft a comprehensive, highly persuasive, and well-structured essay on: "${input}".
- Introduction: Compelling hook, contextual background, and definitive thesis statement.
- Body Paragraphs: 3 major analytical arguments supported by empirical facts, case studies, and counter-argument refutations.
- Conclusion: Synthesis of key findings, broader implications, and forward-looking conclusions.
Tone: Academic, insightful, objective, and articulate.`;
      } else {
        enhanced = `Act as a senior full-stack software engineer. Provide a clean, production-ready TypeScript/React solution for: "${input}".
- Architecture: Modular components, strict type safety, zero runtime side-effects.
- Styling: Tailwind CSS utility classes with responsive design.
- Edge Cases: Graceful fallback states, loading spinners, error boundaries.`;
      }

      setStructuredPrompt(enhanced);
      storageService.addPoints(5, 'Used Numa Prompt Structuring Engine (+5 PTS)');
      onShowToast(5, 'Numa successfully structured and enhanced your prompt (+5 PTS)!');
    }, 600);
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(structuredPrompt);
      setCopied(true);
      onShowToast(5, 'Structured prompt copied to clipboard!');
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6" id="numa-prompt-engine">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full uppercase">
            <Cpu className="w-3.5 h-3.5 text-amber-700" />
            <span>Capability 3: Numa Prompt Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-display">
            Numa AI Prompt Structurer & Optimizer
          </h2>
          <p className="text-xs text-gray-600">
            Transform raw thoughts into perfectly structured, high-yield prompts for image generation, fact analysis, and writing.
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">Engine</span>
          <strong className="text-sm font-extrabold text-amber-950 font-display">
            Numa V2 Structurer
          </strong>
        </div>
      </div>

      {/* PROMPT GOAL SELECTOR */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
          Select Output Purpose
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
          {[
            { id: 'image', label: '🎨 Image Generation', icon: Sparkles },
            { id: 'analysis', label: '🔍 Fact Analysis', icon: Lightbulb },
            { id: 'essay', label: '📝 Essay Writing', icon: MessageSquare },
            { id: 'code', label: '💻 Code & Tech', icon: Wand2 }
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setPromptGoal(type.id as any)}
              className={`p-3 rounded-xl border text-center transition-all flex items-center justify-center gap-1.5 ${
                promptGoal === type.id
                  ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* RAW INPUT & STRUCTURING BUTTON */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
          Your Raw Idea / Request
        </label>
        <div className="flex gap-2">
          <textarea
            rows={2}
            value={rawIdea}
            onChange={(e) => setRawIdea(e.target.value)}
            placeholder="Type your brief idea here (e.g. Nigerian street market in Abuja, photo of jollof rice, essay on digital economy)..."
            className="flex-grow bg-gray-50 border border-gray-300 rounded-2xl p-3.5 text-xs text-gray-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleEnhanceWithNuma}
            disabled={isEnhancing || !rawIdea.trim()}
            className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-extrabold text-xs px-5 rounded-2xl shadow-md flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shrink-0 font-display"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>{isEnhancing ? 'Structuring...' : 'NUMA STRUCTURE'}</span>
          </button>
        </div>
      </div>

      {/* STRUCTURED RESULT DISPLAY */}
      <div className="bg-gray-900 text-white rounded-2xl p-5 shadow-md space-y-3 relative border border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider font-display">
              Numa Structured Output
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-1.5 transition-all active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-300" />}
              <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
            </button>
          </div>
        </div>

        <div className="bg-black/50 p-4 rounded-xl border border-white/10 font-mono text-xs text-emerald-300 leading-relaxed max-h-48 overflow-y-auto select-all">
          {structuredPrompt}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <span className="text-[11px] text-gray-400">
            {structuredPrompt.length} characters · {structuredPrompt.split(' ').length} words
          </span>

          {promptGoal === 'image' && onSendToImageGenerator && (
            <button
              type="button"
              onClick={() => onSendToImageGenerator(structuredPrompt)}
              className="bg-[#FFD60A] text-[#0A3D2E] font-black text-xs px-3.5 py-1.5 rounded-xl hover:bg-white transition-all shadow-xs flex items-center gap-1 font-display"
            >
              <span>Paste into Image Generator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* NUMA PRESET SUGGESTIONS CARDS */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>Curated Numa Suggestions & High-Yield Templates</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {NUMA_SUGGESTION_PRESETS.map((preset, pIdx) => (
            <div
              key={pIdx}
              className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-2 flex flex-col justify-between hover:border-amber-400 transition-all"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md font-display">
                  {preset.category}
                </span>
                <h5 className="font-bold text-xs text-gray-900 font-display">
                  {preset.title}
                </h5>
                <p className="text-[11px] text-gray-600 italic line-clamp-2">
                  "{preset.refinedPrompt}"
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setRawIdea(preset.rawIdea);
                  setStructuredPrompt(preset.refinedPrompt);
                  onShowToast(5, `Loaded "${preset.title}" into Numa!`);
                }}
                className="bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 font-bold text-[11px] px-3 py-1.5 rounded-xl flex items-center justify-center gap-1 transition-colors self-start mt-2"
              >
                <span>Use Template</span>
                <ArrowRight className="w-3 h-3 text-amber-700" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
