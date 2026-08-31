import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ShieldCheck, 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  ShoppingBasket, 
  Users, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  ArrowRight,
  BookOpen,
  HelpCircle,
  Radio,
  Lightbulb,
  FileText,
  Bot,
  Flame,
  Check
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (tab: string, extraData?: any) => void;
}

interface RealLifeExample {
  scenario: string;
  actionTaken: string;
  outcome: string;
}

interface TutorialSlide {
  id: string;
  partNumber: string;
  partName: string;
  badge: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  whatItDoes: string;
  whyItMatters: string;
  keyFeatures: string[];
  howToUseSteps: string[];
  realLifeExample: RealLifeExample;
  illustrationType: 'welcome' | 'rumors' | 'market' | 'deepfake' | 'sabiers' | 'sabo' | 'rewards';
  actionButton?: {
    text: string;
    tab: string;
    icon: React.ElementType;
  };
}

const TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    id: 'welcome',
    partNumber: 'OVERVIEW',
    partName: 'The SABI Truth & Market Ecosystem',
    badge: '🇳🇬 What is SABI?',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    title: 'Nigeria’s Verified Truth, Market & Media Network',
    subtitle: 'A grassroots intelligence platform designed to eliminate panic-spreading misinformation, track authentic commodity prices, and build local consensus.',
    icon: ShieldCheck,
    illustrationType: 'welcome',
    whatItDoes: 'SABI connects everyday Nigerians across all 36 States & FCT to crowdsource factual truth. It integrates an automated rumor fact-checker, ground-truth food price tracker, AI deepfake detector, and verified local spotter chat.',
    whyItMatters: 'Viral WhatsApp broadcasts, doctored videos, and uncontrolled food price inflation create confusion. SABI provides instant, evidence-backed clarity straight from verified citizens on the ground.',
    keyFeatures: [
      'Crowdsourced Rumor Debunking with verified state-level evidence and community consensus.',
      'Daily Spot Market Commodity Tracker (50kg Rice, Garri, Palm Oil, Tomatoes, Fuel).',
      'AI Media Authenticity & Deepfake Scanner for images, voice notes, and screenshots.',
      'State-by-State Live Sabiers Chat network with embedded Sabo AI Assistant.',
      'Reputation tiers, verification streaks, and leaderboard rewards.'
    ],
    howToUseSteps: [
      'Browse verified claims and market rates in your current State and LGA.',
      'Submit suspicious social media claims or photos to verify their authenticity.',
      'Vote on claims using your local knowledge to earn Sabi Points.'
    ],
    realLifeExample: {
      scenario: 'You receive a scary WhatsApp broadcast claiming an abrupt nationwide fuel subsidy strike started 2 hours ago.',
      actionTaken: 'Instead of forwarding it to family group chats or rushing to panic-buy, you open SABI.',
      outcome: 'You see 18 verified spotters across Lagos, Abuja, and Port Harcourt confirming petrol stations are operating normally. The rumor is flagged FALSE with a 98% consensus score.'
    }
  },
  {
    id: 'rumors',
    partNumber: 'PART 1',
    partName: 'Rumor Debunker & Fact-Checking Engine',
    badge: '🔍 Rumor Fact-Checker',
    badgeColor: 'bg-red-100 text-red-900 border-red-300',
    title: 'Unmask Viral WhatsApp Broadcasts & News Claims',
    subtitle: 'Identify fake government grants, banking hoaxes, doctored audio, and sensational headlines before they cause harm.',
    icon: AlertTriangle,
    illustrationType: 'rumors',
    whatItDoes: 'Monitors breaking social media claims, viral broadcasts, and political news. Users vote on authenticity and attach official circulars, resulting in a community-verified ruling (TRUE, FALSE, MISLEADING, or OUTDATED MEDIA).',
    whyItMatters: 'Fake news spreads 6x faster than truth in Nigeria, leading to financial scams, phishing attacks, and avoidable public panic.',
    keyFeatures: [
      'Official Truth Status Badges: VERIFIED TRUE (Green), FALSE (Red), MISLEADING (Amber), OUTDATED (Blue).',
      'Source Citations & Evidence Quotes: Direct links to official gazettes, CBN circulars, or press statements.',
      'State & LGA Filtering: Track rumors specific to your local government or hometown.'
    ],
    howToUseSteps: [
      'Open the "Truth" tab to view trending claims in your state.',
      'Click on any rumor card to inspect the evidence logs and community vote breakdown.',
      'Tap "Submit Claim" (+) to submit any suspicious forward you received for crowd verification.'
    ],
    realLifeExample: {
      scenario: 'A message circulates: "CBN is distributing ₦100,000 grant to anyone who submits their BVN on this link: bit.ly/cbn-grant-2026".',
      actionTaken: 'You search SABI for "CBN grant" before clicking any link.',
      outcome: 'SABI highlights the claim with a prominent FALSE (99%) banner, quoting the official Central Bank of Nigeria disclaimer that CBN never requests BVNs via third-party web links.'
    },
    actionButton: {
      text: 'Explore Live Rumors',
      tab: 'truth',
      icon: ArrowRight
    }
  },
  {
    id: 'market',
    partNumber: 'PART 2',
    partName: 'Real-Time Market Commodity Price Tracker',
    badge: '🛒 Live Commodity Rates',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    title: 'Ground-Truth Food Commodity Rates Across Nigeria',
    subtitle: 'Track actual prices for essential foodstuffs across Mile 12, Bodija, Dawanau, Ogbete, Oil Mill & Central Markets.',
    icon: ShoppingBasket,
    illustrationType: 'market',
    whatItDoes: 'Provides daily crowd-verified commodity spot rates for 50kg Bags of Foreign/Local Rice, Paint Rubber Garri, 25L Palm Oil, Yam Tubers, Tomatoes, Eggs, and Fuel across all Nigerian wholesale and retail markets.',
    whyItMatters: 'Retail food prices fluctuate rapidly between markets and states. Sabi prevents shoppers from being overcharged and helps merchants find the best wholesale rates.',
    keyFeatures: [
      'Spot Price Badges with Trend Indicators: Surge (▲ Red), Stable (● Blue), Drop (▼ Green).',
      'Market-Specific Spotter Notes: Real-time updates like "Tomato trucks arrived from Kano this morning".',
      'Multi-Market Comparison: Compare Mile 12 (Lagos) vs Bodija (Ibadan) vs Dawanau (Kano).'
    ],
    howToUseSteps: [
      'Open the "Market" tab and select your state or target market.',
      'Check current rates and price trends for the food items on your shopping list.',
      'Tap "Report Price" when you visit a market to submit fresh receipt-verified prices and earn points.'
    ],
    realLifeExample: {
      scenario: 'You are planning monthly grocery shopping in Ibadan and want to buy 1 bag of white garri and 25L of Palm Oil.',
      actionTaken: 'You check SABI’s Market tab for Bodija Market vs Oja Oba.',
      outcome: 'You discover Bodija white garri dropped to ₦2,800 per paint rubber due to new cassava harvests, saving you over ₦5,000 on your total purchase.'
    },
    actionButton: {
      text: 'Check Market Prices',
      tab: 'market',
      icon: ArrowRight
    }
  },
  {
    id: 'deepfake',
    partNumber: 'PART 3',
    partName: 'AI Deepfake & Media Authenticity Scanner',
    badge: '🛡️ Forensic Media Scanner',
    badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    title: 'Detect AI Cloned Audio, Deepfake Images & Edited Receipts',
    subtitle: 'Upload any suspicious image, voice note, or screenshot to run a multi-layered AI forensic verification scan.',
    icon: Scan,
    illustrationType: 'deepfake',
    whatItDoes: 'Employs advanced multimodal computer vision to examine visual lighting vectors, boundary warping, pixel compression anomalies, cloned voice resonance, and metadata timestamps.',
    whyItMatters: 'Generative AI tools are now used to fake political speeches, fake bank transfer receipts, and create synthetic images designed to incite riots.',
    keyFeatures: [
      'Overall Authenticity Score: Instant percentage confidence (e.g., 94.2% AI Generated).',
      'Visual Anomaly Highlighting: "Show Me Why" breakdown pinpointing manipulated regions.',
      'Recycled Media Detection: Identifies old footage from 2020 falsely captioned as "happening right now in 2026".'
    ],
    howToUseSteps: [
      'Open the "AI Scanner" tab from the navigation bar.',
      'Upload a picture, voice note, or screenshot from your device.',
      'Click "Scan Media" to generate an immediate forensic analysis report.'
    ],
    realLifeExample: {
      scenario: 'A dramatic photo surfaces on Twitter claiming a major fire broke out at a critical bank headquarters in Marina, Lagos.',
      actionTaken: 'You save the photo and upload it into Sabi’s Deepfake X-Ray.',
      outcome: 'The scanner reveals that the image is an old 2019 warehouse fire from another country with edited text overlaid on the building. You share the verified debunk card on Twitter.'
    },
    actionButton: {
      text: 'Open AI Deepfake Scanner',
      tab: 'deepfake',
      icon: ArrowRight
    }
  },
  {
    id: 'sabiers',
    partNumber: 'PART 4',
    partName: 'The Sabiers Network & State Channels',
    badge: '👥 The Sabiers Hub',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    title: 'Connect Live with Verified Nigerian Spotters',
    subtitle: 'Join dedicated state channels to ask real-time questions, report local emergencies, and chat with verifiers.',
    icon: Users,
    illustrationType: 'sabiers',
    whatItDoes: 'A state-by-state communication hub connecting on-the-ground spotters ("Sabiers"). It includes accurate live presence tracking showing real verifiers currently active across Nigeria.',
    whyItMatters: 'Nothing beats verified human eyes on the ground when urgent situations arise (such as road blockades, market closures, or local weather events).',
    keyFeatures: [
      '36 State & FCT Channels: Dedicated chat rooms for Lagos, Abuja, Kano, Rivers, Oyo, Enugu, etc.',
      'Accurate Live Presence Tracking: View active spotters in your state.',
      'Quick Spotter Waves & Instant Local Updates: Direct interaction with community verifiers.'
    ],
    howToUseSteps: [
      'Open "The Sabiers" tab to view active state chat rooms.',
      'Select your state channel (e.g., #Lagos-State or #Kano-State).',
      'Ask a question about local conditions or share a verified breaking update.'
    ],
    realLifeExample: {
      scenario: 'You are commuting from the Lagos Mainland to the Island and hear a rumor that Third Mainland Bridge was closed for emergency repairs.',
      actionTaken: 'You post in the `#Lagos-State` Sabiers channel: "Is Third Mainland Bridge open right now?"',
      outcome: 'Within 2 minutes, verified spotter Adeola responds with a timestamped photo showing smooth traffic flow towards CMS.'
    },
    actionButton: {
      text: 'Join Sabiers Chat',
      tab: 'sabiers',
      icon: ArrowRight
    }
  },
  {
    id: 'sabo',
    partNumber: 'PART 5',
    partName: 'Sabo AI Assistant & Smart Copilot',
    badge: '🤖 Sabo AI Copilot',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    title: 'Your 24/7 Nigerian Intelligence Assistant',
    subtitle: 'Ask Sabo AI to fact-check rumors, budget food recipes in your state, or translate local news into Pidgin, Yoruba, Hausa, or Igbo.',
    icon: Bot,
    illustrationType: 'sabo',
    whatItDoes: 'An intelligent AI assistant built specifically for Nigeria. It understands local markets, currency values, state geography, cultural context, and Nigerian languages.',
    whyItMatters: 'Provides instant conversational answers without needing to search through lengthy articles or complex spreadsheets.',
    keyFeatures: [
      'Recipe & Dish Budgeting: "How much will it cost to cook Jollof Rice for 10 people in Abuja?"',
      'Instant Fact-Check Inquiries: "Is the news about CBN new policy true?"',
      'Multilingual Translation: Chat in English, Nigerian Pidgin, Yoruba, Hausa, or Igbo.'
    ],
    howToUseSteps: [
      'Tap the Sparkles icon (✨) in the top header or in the Sabiers Chat.',
      'Type any question about rumors, commodity prices, or local news.',
      'Get an immediate, localized answer tailored to your state.'
    ],
    realLifeExample: {
      scenario: 'You want to cook a large pot of Egusi soup for visitors this weekend in Port Harcourt and need an accurate budget.',
      actionTaken: 'You ask Sabo AI: "Calculate the exact market cost to cook Egusi soup for 8 people in Oil Mill Market PH."',
      outcome: 'Sabo AI provides an itemized grocery breakdown with current spot rates for Egusi, Palm Oil, Stockfish, and Goat Meat totaling ₦22,500.'
    }
  },
  {
    id: 'rewards',
    partNumber: 'PART 6',
    partName: 'Sabi Points, Streaks & Reputation Tiers',
    badge: '🏆 Gamified Rewards',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    title: 'Earn Points, Daily Streaks & Deluxe Privileges',
    subtitle: 'Get rewarded for maintaining high truth accuracy and keeping Nigerian communities informed.',
    icon: Award,
    illustrationType: 'rewards',
    whatItDoes: 'Tracks your accuracy score, daily activity streaks, and community contributions. As you verify claims and log market prices, you earn points and rank up.',
    whyItMatters: 'Incentivizes honest, high-quality crowd reporting while filtering out bad actors.',
    keyFeatures: [
      'Reputation Ranks: Community Spotter → Trusted Contributor → Truth Sentinel → Deluxe Sovereign.',
      'Daily Verification Streaks: Earn point multipliers by logging in and fact-checking daily.',
      'Exclusive Sentinel Badges: Display badges like "Market Authority" or "Consensus Guardian" on your profile.'
    ],
    howToUseSteps: [
      'Verify at least 3 claims or prices every day to maintain your streak.',
      'Submit high-quality evidence links and receipts to maximize your points.',
      'Check your rank on the national spotter leaderboard in the Profile tab.'
    ],
    realLifeExample: {
      scenario: 'You want to build your reputation as a trusted market reporter in your community.',
      actionTaken: 'You log market prices twice a week and vote on 3 community claims each morning.',
      outcome: 'You maintain a 14-day streak, earn +450 Sabi Points, and unlock the "Truth Sentinel" badge, giving your reports higher voting weight in community consensus.'
    },
    actionButton: {
      text: 'Start Exploring SABI',
      tab: 'home',
      icon: Sparkles
    }
  }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ 
  isOpen, 
  onClose,
  onNavigate 
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlideIndex]);

  if (!isOpen) return null;

  const currentSlide = TUTORIAL_SLIDES[currentSlideIndex];
  const isFirstSlide = currentSlideIndex === 0;
  const isLastSlide = currentSlideIndex === TUTORIAL_SLIDES.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onClose();
    } else {
      setDirection(1);
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstSlide) {
      setDirection(-1);
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleJumpToSlide = (index: number) => {
    setDirection(index > currentSlideIndex ? 1 : -1);
    setCurrentSlideIndex(index);
  };

  const handleActionButtonClick = (tab: string) => {
    onClose();
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-emerald-900/20 relative my-auto flex flex-col max-h-[94vh]"
        >
          {/* Header Bar */}
          <div className="bg-[#0A3D2E] text-white px-5 py-3.5 sm:py-4 flex items-center justify-between border-b border-emerald-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center font-black text-base shadow-sm">
                S
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight flex items-center gap-2 font-display">
                  <span>How SABI Works — Interactive Tour</span>
                  <span className="text-[10px] bg-white/20 text-emerald-100 font-bold px-2 py-0.5 rounded-full">
                    {currentSlide.partNumber}
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-200">
                  {currentSlide.partName} • Slide {currentSlideIndex + 1} of {TUTORIAL_SLIDES.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="text-xs text-emerald-200 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 transition-colors font-medium hidden sm:inline-block"
              >
                Skip Tour
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Close Tutorial"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Jump Bar */}
          <div className="bg-emerald-50/80 border-b border-emerald-100 px-3 sm:px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {TUTORIAL_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => handleJumpToSlide(idx)}
                className={`text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap transition-all flex items-center gap-1 ${
                  idx === currentSlideIndex
                    ? 'bg-[#0A3D2E] text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-emerald-100 border border-gray-200'
                }`}
              >
                <span>{idx + 1}.</span>
                <span>
                  {slide.id === 'welcome' ? 'Overview' : 
                   slide.id === 'rumors' ? 'Rumors' : 
                   slide.id === 'market' ? 'Market' : 
                   slide.id === 'deepfake' ? 'Deepfake' : 
                   slide.id === 'sabiers' ? 'Sabiers' : 
                   slide.id === 'sabo' ? 'Sabo AI' : 'Rewards'}
                </span>
              </button>
            ))}
          </div>

          {/* Slide Body */}
          <div className="p-5 sm:p-6 md:p-7 overflow-y-auto flex-1 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id}
                initial={{ opacity: 0, x: direction * 35 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -35 }}
                transition={{ duration: 0.22 }}
                className="space-y-6"
              >
                {/* Title & Badge */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2">
                    <span className={`text-[11px] font-black px-3 py-0.5 rounded-full border ${currentSlide.badgeColor}`}>
                      {currentSlide.badge}
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      {currentSlide.partName}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-display tracking-tight leading-snug">
                    {currentSlide.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                    {currentSlide.subtitle}
                  </p>
                </div>

                {/* Section 1: What It Does & Why It Matters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-[#0A3D2E] font-black text-xs uppercase tracking-wider font-display">
                      <Lightbulb className="w-4 h-4 text-emerald-700" />
                      <span>What This Part Does</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {currentSlide.whatItDoes}
                    </p>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase tracking-wider font-display">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>Why It Matters In Nigeria</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {currentSlide.whyItMatters}
                    </p>
                  </div>
                </div>

                {/* Section 2: Concrete Real-Life Practical Example Box */}
                <div className="bg-gradient-to-r from-emerald-950 via-[#0A3D2E] to-emerald-900 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-emerald-700/60 pb-2">
                    <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider font-display text-[#FFD60A]">
                      <FileText className="w-4 h-4" />
                      <span>Real-Life Practical Example</span>
                    </div>
                    <span className="text-[10px] bg-white/10 text-emerald-200 font-bold px-2 py-0.5 rounded-full">
                      Nigeria Scenario
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-amber-300 shrink-0">1. Scenario:</span>
                      <span className="text-emerald-50 leading-relaxed">{currentSlide.realLifeExample.scenario}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-emerald-300 shrink-0">2. How Sabi is used:</span>
                      <span className="text-emerald-100 leading-relaxed">{currentSlide.realLifeExample.actionTaken}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-[#FFD60A] shrink-0">3. Real Outcome:</span>
                      <span className="text-white font-medium leading-relaxed">{currentSlide.realLifeExample.outcome}</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Visual Graphic / Mock UI Showcase */}
                <div className="rounded-2xl p-4 sm:p-5 border border-gray-200 bg-gray-50/80 relative overflow-hidden shadow-2xs">
                  {currentSlide.illustrationType === 'welcome' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="bg-white p-3 rounded-xl border border-gray-200 text-center space-y-1 shadow-2xs">
                        <AlertTriangle className="w-5 h-5 text-red-500 mx-auto" />
                        <span className="text-xs font-black text-gray-900 block">Rumor Feed</span>
                        <span className="text-[10px] text-gray-500 block">Community votes</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-200 text-center space-y-1 shadow-2xs">
                        <ShoppingBasket className="w-5 h-5 text-amber-500 mx-auto" />
                        <span className="text-xs font-black text-gray-900 block">Market Prices</span>
                        <span className="text-[10px] text-gray-500 block">Rice, Garri, Oil</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-200 text-center space-y-1 shadow-2xs">
                        <Scan className="w-5 h-5 text-indigo-500 mx-auto" />
                        <span className="text-xs font-black text-gray-900 block">Deepfake X-Ray</span>
                        <span className="text-[10px] text-gray-500 block">AI Image & Audio</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-200 text-center space-y-1 shadow-2xs">
                        <Users className="w-5 h-5 text-emerald-600 mx-auto" />
                        <span className="text-xs font-black text-gray-900 block">The Sabiers</span>
                        <span className="text-[10px] text-gray-500 block">State spotters</span>
                      </div>
                    </div>
                  )}

                  {currentSlide.illustrationType === 'rumors' && (
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded-xl border border-red-200 flex items-center justify-between gap-3 shadow-2xs">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                            ✕
                          </div>
                          <div>
                            <span className="text-xs font-black text-gray-900 block">
                              "CBN Re-introduces Old ₦500 and ₦1000 Banknotes Deadline"
                            </span>
                            <span className="text-[10px] text-gray-500">Official CBN Statement: Both banknotes remain legal tender indefinitely</span>
                          </div>
                        </div>
                        <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap">
                          FALSE (99%)
                        </span>
                      </div>
                    </div>
                  )}

                  {currentSlide.illustrationType === 'market' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1 shadow-2xs">
                        <div className="flex justify-between items-center text-[10px] text-gray-500">
                          <span>Mile 12, Lagos</span>
                          <span className="text-red-500 font-bold">▲ Surge</span>
                        </div>
                        <span className="text-xs font-black text-gray-900 block">50kg Bag Rice</span>
                        <span className="text-sm font-black text-emerald-900 block">₦84,000</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1 shadow-2xs">
                        <div className="flex justify-between items-center text-[10px] text-gray-500">
                          <span>Bodija, Ibadan</span>
                          <span className="text-emerald-600 font-bold">▼ Drop</span>
                        </div>
                        <span className="text-xs font-black text-gray-900 block">Paint Rubber Garri</span>
                        <span className="text-sm font-black text-emerald-900 block">₦2,800</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-gray-200 space-y-1 shadow-2xs">
                        <div className="flex justify-between items-center text-[10px] text-gray-500">
                          <span>Oil Mill, Port Harcourt</span>
                          <span className="text-blue-500 font-bold">● Stable</span>
                        </div>
                        <span className="text-xs font-black text-gray-900 block">25L Palm Oil</span>
                        <span className="text-sm font-black text-emerald-900 block">₦34,500</span>
                      </div>
                    </div>
                  )}

                  {currentSlide.illustrationType === 'deepfake' && (
                    <div className="bg-white p-3.5 rounded-xl border border-indigo-100 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
                          <Scan className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-indigo-900 block">AI Deepfake Detection Engine</span>
                          <span className="text-[10px] text-gray-500">Scans pitch variance, facial boundaries, and metadata cloning</span>
                        </div>
                      </div>
                      <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap">
                        94.2% AI Generated
                      </span>
                    </div>
                  )}

                  {currentSlide.illustrationType === 'sabiers' && (
                    <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#0A3D2E] text-white flex items-center justify-center text-xs font-black">
                          🇳🇬
                        </div>
                        <div>
                          <span className="text-xs font-black text-gray-900 block">#Lagos-State Channel</span>
                          <span className="text-[10px] text-gray-500">Adeola: "Traffic flowing smoothly on Third Mainland Bridge"</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-900 font-black px-2 py-0.5 rounded-full">
                        Live Spotter
                      </span>
                    </div>
                  )}

                  {currentSlide.illustrationType === 'sabo' && (
                    <div className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black">
                          🤖
                        </div>
                        <div>
                          <span className="text-xs font-black text-gray-900 block">Sabo AI Recipe Budgeting</span>
                          <span className="text-[10px] text-gray-500">"Egusi soup for 8 people in Port Harcourt: Total ₦22,500"</span>
                        </div>
                      </div>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-black px-2 py-0.5 rounded-full">
                        Itemized
                      </span>
                    </div>
                  )}

                  {currentSlide.illustrationType === 'rewards' && (
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                        <span className="text-base">🔥</span>
                        <span className="text-xs font-black text-gray-900 block">7-Day Streak</span>
                        <span className="text-[10px] text-amber-600 font-bold block">+350 Points</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-2xs">
                        <span className="text-base">🛡️</span>
                        <span className="text-xs font-black text-gray-900 block">Truth Sentinel</span>
                        <span className="text-[10px] text-emerald-600 font-bold block">Top 5% Rank</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-indigo-200 shadow-2xs">
                        <span className="text-base">👑</span>
                        <span className="text-xs font-black text-gray-900 block">Deluxe Sovereign</span>
                        <span className="text-[10px] text-indigo-600 font-bold block">VIP Access</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Section 4: Key Features & How To Use */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Key Features */}
                  <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 space-y-2.5">
                    <h4 className="text-xs font-black text-[#0A3D2E] uppercase tracking-wider flex items-center gap-1.5 font-display">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Key Features</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {currentSlide.keyFeatures.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 leading-relaxed">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* How To Use */}
                  <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 space-y-2.5">
                    <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5 font-display">
                      <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                      <span>How To Use Step-by-Step</span>
                    </h4>
                    <ul className="space-y-2 text-xs text-gray-700">
                      {currentSlide.howToUseSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-2 leading-relaxed">
                          <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Action Link Button if Available */}
                {currentSlide.actionButton && (
                  <div className="pt-1 flex justify-center">
                    <button
                      onClick={() => handleActionButtonClick(currentSlide.actionButton!.tab)}
                      className="inline-flex items-center gap-2 text-xs font-black text-[#0A3D2E] bg-emerald-100/80 hover:bg-emerald-200/80 border border-emerald-300 px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-xs"
                    >
                      <currentSlide.actionButton.icon className="w-4 h-4 text-emerald-800" />
                      <span>Open: {currentSlide.actionButton.text}</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Controls: Dots & Navigation */}
          <div className="bg-gray-50 border-t border-gray-200 px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3">
            {/* Step Dots */}
            <div className="flex items-center gap-1.5">
              {TUTORIAL_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleJumpToSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentSlideIndex
                      ? 'w-6 bg-[#0A3D2E]'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  title={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Back & Next / Finish Buttons */}
            <div className="flex items-center gap-2">
              {!isFirstSlide && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1 bg-white hover:bg-gray-100 text-gray-700 px-3.5 py-2 rounded-xl text-xs font-bold border border-gray-300 transition-all active:scale-95"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              )}

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 bg-[#0A3D2E] hover:bg-[#082e22] text-white px-5 py-2 rounded-xl text-xs font-black shadow-md transition-all active:scale-95 font-display"
              >
                <span>{isLastSlide ? 'Complete Tour & Start SABI' : 'Next Part'}</span>
                {isLastSlide ? <Sparkles className="w-4 h-4 text-[#FFD60A]" /> : <ChevronRight className="w-4 h-4 text-emerald-200" />}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
