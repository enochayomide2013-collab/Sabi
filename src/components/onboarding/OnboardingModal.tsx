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
  Check,
  Crown,
  Lock,
  Utensils,
  Map,
  CheckSquare,
  Image as ImageIcon,
  Play,
  Volume2
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
  illustrationType: 
    | 'welcome' 
    | 'anchor'
    | 'rumors' 
    | 'deepfake'
    | 'market' 
    | 'tasks'
    | 'sabiation' 
    | 'sabo' 
    | 'sabiers' 
    | 'heatmap' 
    | 'recipes' 
    | 'rewards' 
    | 'admin';
  actionButton?: {
    text: string;
    tab: string;
    icon: React.ElementType;
  };
}

const TUTORIAL_SLIDES: TutorialSlide[] = [
  {
    id: 'welcome',
    partNumber: 'PAGE 1 OF 13',
    partName: 'The SABI Grassroots Truth & Market Ecosystem',
    badge: '🇳🇬 Complete Overview',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    title: 'Nigeria’s Verified Truth, Market & Media Intelligence Hub',
    subtitle: 'A grassroots intelligence platform engineered to eradicate viral misinformation, track authentic market commodity prices, and build state-by-state consensus.',
    icon: ShieldCheck,
    illustrationType: 'welcome',
    whatItDoes: 'SABI connects everyday Nigerians across all 36 States & FCT to crowdsource factual truth. It integrates an automated rumor fact-checker, ground-truth food price tracker, AI deepfake detector, live news anchor simulation, recipe budgeter, and verified local spotter chat.',
    whyItMatters: 'Viral WhatsApp broadcasts, doctored videos, and uncontrolled food price inflation create confusion. SABI provides instant, evidence-backed clarity straight from verified citizens on the ground.',
    keyFeatures: [
      'Crowdsourced Rumor Debunking with verified state-level evidence and community consensus.',
      'Daily Spot Market Commodity Tracker (50kg Rice, Garri, Palm Oil, Tomatoes, Fuel).',
      'AI Media Authenticity & Deepfake Scanner for images, voice notes, and screenshots.',
      'The Sabiation AI creative studio with 720p, 1080p, and 4K image generation.',
      'State-by-State Live Sabiers Chat network with embedded multilingual Sabo AI Assistant.',
      '14-Day Streaks, Reputation tiers, and Leaderboard status.'
    ],
    howToUseSteps: [
      'Browse verified claims and market rates in your current State and LGA.',
      'Submit suspicious social media claims or photos to verify their authenticity.',
      'Vote on claims using your local knowledge to earn Sabi Points.'
    ],
    realLifeExample: {
      scenario: 'You receive a viral WhatsApp voice memo claiming a sudden fuel strike has shut down all filling stations in Lagos.',
      actionTaken: 'Instead of forwarding it to family group chats or rushing to panic-buy, you open SABI.',
      outcome: 'You see 18 verified spotters across Lagos Mainland, Ikeja, and Lekki confirming stations are operating normally. The rumor is flagged FALSE with a 98% consensus score.'
    },
    actionButton: {
      text: 'Explore Live Feed',
      tab: 'home',
      icon: ArrowRight
    }
  },
  {
    id: 'anchor',
    partNumber: 'PAGE 2 OF 13',
    partName: 'News Anchor Live Broadcast Simulation',
    badge: '📺 AI News Anchor',
    badgeColor: 'bg-red-100 text-red-900 border-red-300',
    title: 'Live Nigerian Truth & Breaking Headlines Broadcast',
    subtitle: 'Experience an interactive television-style news broadcast with real-time teleprompter captions, anchor simulation, and audio synthesis.',
    icon: Play,
    illustrationType: 'anchor',
    whatItDoes: 'Simulates a live Nigerian national news studio (SABI News Desk) presenting verified breaking reports, debunked claims, and market surges in real time with an animated anchor and live ticker.',
    whyItMatters: 'Audio-visual news formats help citizens quickly digest complex facts, state security bulletins, and commodity price changes in under 60 seconds.',
    keyFeatures: [
      'Interactive Live Studio Player with play, pause, seek, and volume audio controls.',
      'Synchronized Live Teleprompter displaying broadcast transcript word-by-word.',
      'Breaking News Lower-Third Ticker highlighting live state-by-state alerts.',
      'Toggleable Audio Speech Synth delivering clear Nigerian English narration.'
    ],
    howToUseSteps: [
      'Click the "News Anchor" button in the top navigation bar or banner.',
      'Press the green "Play Live Broadcast" button to start the studio broadcast.',
      'Read along with the synchronized live teleprompter as the news progresses.'
    ],
    realLifeExample: {
      scenario: 'You want a 2-minute morning summary of everything verified across Nigerian states before heading to work.',
      actionTaken: 'You open the News Anchor Live Simulation and hit Play while getting ready.',
      outcome: 'You hear verified updates on fuel prices in Abuja, food drops in Ibadan, and a debunk of a fake bank holiday circular.'
    },
    actionButton: {
      text: 'Watch Live News Anchor',
      tab: 'anchor',
      icon: Play
    }
  },
  {
    id: 'rumors',
    partNumber: 'PAGE 3 OF 13',
    partName: 'Rumor Debunker & Fact-Checking Engine',
    badge: '🔍 Rumor Fact-Checker',
    badgeColor: 'bg-red-100 text-red-900 border-red-300',
    title: 'Unmask Viral WhatsApp Broadcasts & Social Media Hoaxes',
    subtitle: 'Identify fake government grants, banking scams, doctored audio, and sensational political headlines before they cause panic.',
    icon: AlertTriangle,
    illustrationType: 'rumors',
    whatItDoes: 'Monitors breaking social media claims, viral broadcasts, and political news. Users vote on authenticity and attach official circulars, resulting in a community-verified ruling (TRUE, FALSE, MISLEADING, or OUTDATED MEDIA).',
    whyItMatters: 'Fake news spreads 6x faster than truth in Nigeria, leading to financial scams, phishing attacks, and avoidable public panic.',
    keyFeatures: [
      'Official Truth Status Badges: VERIFIED TRUE (Green), FALSE (Red), MISLEADING (Amber), OUTDATED (Blue).',
      'Source Citations & Evidence Quotes: Direct links to official gazettes, CBN circulars, or press statements.',
      'State & LGA Filtering: Track rumors specific to your local government or hometown.',
      'Social Platform Attribution: Explicitly flags whether a claim originated on TikTok, Twitter/X, or Facebook.'
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
    id: 'deepfake',
    partNumber: 'PAGE 4 OF 13',
    partName: 'AI Deepfake & Forensic Media Scanner',
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
    id: 'market',
    partNumber: 'PAGE 5 OF 13',
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
    id: 'tasks',
    partNumber: 'PAGE 6 OF 13',
    partName: 'On-Ground Verification Tasks & Verifier Missions',
    badge: '🎯 Missions & Tasks',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
    title: 'Earn Points by Completing Verified Ground Missions',
    subtitle: 'Participate in localized fact-checking tasks requested by the community and verify on-ground truth in your LGA.',
    icon: CheckSquare,
    illustrationType: 'tasks',
    whatItDoes: 'Displays open verification quests (e.g. confirming whether a petrol station in Ikeja is dispensing fuel at official rate or taking a photo of tomato basket prices in Mile 12).',
    whyItMatters: 'Empowers citizens to act as decentralised journalists, ensuring that rumors are answered with real physical proof within minutes.',
    keyFeatures: [
      'LGA Proximity Sorting: Filter tasks happening within 5km of your location.',
      'Evidence Photo & Receipt Upload: Attach geotagged photos to submit conclusive proof.',
      'High Points Payouts: Earn +25 to +100 Sabi Points per completed mission.'
    ],
    howToUseSteps: [
      'Open the "Tasks" tab to see open verification requests in your state.',
      'Select a task near your location (e.g., "Verify Bag of Rice Price in Dei-Dei Market").',
      'Upload your verdict and evidence photo to claim your points reward.'
    ],
    realLifeExample: {
      scenario: 'A user in Kaduna asks if foreign rice is really selling for ₦90,000 in Abuja Dei-Dei Market.',
      actionTaken: 'An Abuja spotter visiting Dei-Dei market uploads a photo of the seller’s price board showing ₦84,000.',
      outcome: 'The task is resolved, the claim is corrected for all users, and the spotter receives +35 Sabi Points.'
    },
    actionButton: {
      text: 'View Open Verification Tasks',
      tab: 'tasks',
      icon: CheckSquare
    }
  },
  {
    id: 'sabiation',
    partNumber: 'PAGE 7 OF 13',
    partName: 'The Sabiation AI Studio & 720p / 1080p / 4K Engine',
    badge: '✨ The Sabiation AI',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    title: 'Generative AI Image Creation in HD, Full HD & 4K',
    subtitle: 'An elite creative studio offering instant AI image generation with dedicated resolution buttons (720p, 1080p, 4K) and free web AI tools.',
    icon: Sparkles,
    illustrationType: 'sabiation',
    whatItDoes: 'Allows Golden Sovereign & Deluxe VIP members (and preview users) to generate hyper-realistic Nigerian and global digital artwork in customizable aspect ratios (16:9, 1:1, 9:16, 4:3) with downloadable high-res PNGs.',
    whyItMatters: 'Provides creators, small businesses, and students with powerful generative tools tailored to African culture without requiring expensive subscriptions.',
    keyFeatures: [
      'Resolution Selector Buttons: 720p HD, 1080p Full HD, and 4K Ultra HD.',
      'Nigerian Cultural & Aesthetic Presets (Lagos Cyberpunk, 8K Photography, Party Jollof Food Art).',
      'Instant PNG Download and Prompt Copier with one-click export.',
      'Curated Directory of 100% Free AI Web Tools & Prompts.'
    ],
    howToUseSteps: [
      'Navigate to the "Sabiation" portal from the top header or navigation menu.',
      'Select your desired resolution (720p, 1080p, or 4K) and aspect ratio.',
      'Type or pick a creative prompt and tap "Generate AI Image" to render and download.'
    ],
    realLifeExample: {
      scenario: 'You need an ultra-crisp 4K banner of modern Lagos Lekki bridge for a web project or presentation.',
      actionTaken: 'You open Sabiation, select "4K Ultra HD", choose the 16:9 aspect ratio, and click Generate.',
      outcome: 'The engine renders a 3840×2160 px masterpiece that you download with a single click.'
    },
    actionButton: {
      text: 'Launch Sabiation Studio',
      tab: 'sabiation',
      icon: Sparkles
    }
  },
  {
    id: 'sabo',
    partNumber: 'PAGE 8 OF 13',
    partName: 'Sabo AI Assistant & Multilingual Copilot',
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
      'Tap the Floating Sabo AI launcher button (🤖) in the bottom right corner.',
      'Type any question about rumors, commodity prices, or local news.',
      'Get an immediate, localized answer tailored to your state.'
    ],
    realLifeExample: {
      scenario: 'You want to cook a large pot of Egusi soup for visitors this weekend in Port Harcourt and need an accurate budget.',
      actionTaken: 'You ask Sabo AI: "Calculate the exact market cost to cook Egusi soup for 8 people in Oil Mill Market PH."',
      outcome: 'Sabo AI provides an itemized grocery breakdown with current spot rates for Egusi, Palm Oil, Stockfish, and Goat Meat totaling ₦22,500.'
    },
    actionButton: {
      text: 'Ask Sabo AI',
      tab: 'sabo_modal',
      icon: Bot
    }
  },
  {
    id: 'sabiers',
    partNumber: 'PAGE 9 OF 13',
    partName: 'The Sabiers 36-State Real-Time Community Chat',
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
    id: 'heatmap',
    partNumber: 'PAGE 10 OF 13',
    partName: 'Interactive Nigerian Rumor & Risk Heatmap',
    badge: '🗺️ National Heatmap',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300',
    title: 'Geographic Visualization of Circulating Claims & Hotspots',
    subtitle: 'Explore an interactive regional map displaying verified claim clusters, market surges, and misinformation activity.',
    icon: Map,
    illustrationType: 'heatmap',
    whatItDoes: 'Visualizes the geographic concentration of active rumors and price spikes across the 6 geopolitical zones of Nigeria with interactive state pins and severity filters.',
    whyItMatters: 'Enables researchers, journalists, and citizens to spot coordinated disinformation campaigns targeting specific states or borders.',
    keyFeatures: [
      'Geopolitical Zone Breakdown (South-West, South-South, North-Central, etc.).',
      'Live Hotspot Severity Rings indicating high rumor concentration.',
      'Interactive State Selector with instant local truth stats.'
    ],
    howToUseSteps: [
      'Open the "Heatmap" tab to load the interactive Nigerian map.',
      'Click on any state pin to view active rumors, debunk scores, and local commodity trends.',
      'Filter by category (Banking, Petrol, Food, Governance) to isolate specific trends.'
    ],
    realLifeExample: {
      scenario: 'You see a sudden flurry of posts about a market disturbance in the North-Central zone.',
      actionTaken: 'You check the SABI Heatmap for Abuja and Plateau state.',
      outcome: 'You see the area is calm and green, with local spotters debunking the claim as old 2021 video footage.'
    },
    actionButton: {
      text: 'Open National Heatmap',
      tab: 'heatmap',
      icon: Map
    }
  },
  {
    id: 'recipes',
    partNumber: 'PAGE 11 OF 13',
    partName: 'Authentic Nigerian Food Recipes & Live Market Budgeting',
    badge: '🍲 Recipe Budgeter',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    title: 'Cook Authentic Nigerian Dishes with Live Market Pricing',
    subtitle: 'Access authentic culinary recipes (Jollof Rice, Egusi, Afang, Banga, Fried Rice) linked with real-time local market costs.',
    icon: Utensils,
    illustrationType: 'recipes',
    whatItDoes: 'Connects traditional step-by-step Nigerian cooking recipes with live spot prices from markets like Mile 12, Bodija, and Dawanau, giving you an exact, itemized cooking budget per serving.',
    whyItMatters: 'Eliminates meal planning guesswork by calculating exactly what ingredients will cost before you step foot in the market.',
    keyFeatures: [
      'Complete Step-by-Step Cooking Guides for authentic Nigerian delicacies.',
      'Dynamic Market Cost Calculator based on current state commodity prices.',
      'Serving Size Adjuster (Cook for 2, 5, 10, or 20 people).'
    ],
    howToUseSteps: [
      'Open the "Recipes" tab to browse authentic dishes.',
      'Select a recipe (e.g., Party Jollof Rice or Egusi Soup).',
      'Adjust the serving slider to see the updated grocery budget at your local market.'
    ],
    realLifeExample: {
      scenario: 'You are organizing a birthday gathering for 12 guests and need to budget for smoky Nigerian Party Jollof.',
      actionTaken: 'You open the Recipe Budgeter, set servings to 12 in Lagos state.',
      outcome: 'SABI itemizes the cost of 4 cups of rice, tomato paste, scotch bonnets, chicken, and groundnut oil totaling ₦18,200.'
    },
    actionButton: {
      text: 'Explore Recipes & Budgets',
      tab: 'recipes',
      icon: Utensils
    }
  },
  {
    id: 'rewards',
    partNumber: 'PAGE 12 OF 13',
    partName: 'Sabi Points, 14-Day Streaks & VIP Title Perks',
    badge: '👑 Titles & Perks',
    badgeColor: 'bg-yellow-100 text-yellow-900 border-yellow-300',
    title: 'Earn Points, Daily Streaks & Unlock VIP Title Perks',
    subtitle: 'Get rewarded for maintaining high truth accuracy: unlock Bronze Sentinel, Golden Sovereign, and Deluxe Grandmaster privileges.',
    icon: Crown,
    illustrationType: 'rewards',
    whatItDoes: 'Tracks your accuracy score, daily activity streaks, and community contributions. Purchasing title tiers unlocks points multipliers (1.25x Bronze, 1.75x Golden, 2.5x Deluxe), full Sabiation AI access, and VIP customer service.',
    whyItMatters: 'Recognizes dedicated verifiers with tangible community status, point multipliers, and creative AI tools.',
    keyFeatures: [
      'Bronze Sentinel (8,000 PTS): 1.25x points multiplier + VIP Bronze badge.',
      'Golden Sovereign (28,000 PTS): 1.75x points multiplier + Full Sabiation AI Access + avidayo.created.app portal link.',
      'Deluxe Sovereign VIP (100,000 PTS): 2.5x multiplier + 1 Year 24/7 Concierge Support + Instant +60,000 Bonus Points!',
      '14-Day Daily Streak Rewards with growing daily bonuses up to +2,000 PTS.'
    ],
    howToUseSteps: [
      'Claim your daily streak reward every 24 hours in the Profile tab.',
      'Earn points by voting on claims, reporting market rates, and completing tasks.',
      'Upgrade your Title Tier in the Profile Store to activate your perks and multipliers.'
    ],
    realLifeExample: {
      scenario: 'You upgrade to the Golden Sovereign tier with your accumulated points.',
      actionTaken: 'Your profile is instantly crowned with the Golden Sovereign title badge.',
      outcome: 'Every task you complete now pays out 1.75x bonus points, and you gain full unrestricted access to the Sabiation AI generator!'
    },
    actionButton: {
      text: 'View Title Store & Profile',
      tab: 'profile',
      icon: Crown
    }
  },
  {
    id: 'admin',
    partNumber: 'PAGE 13 OF 13',
    partName: 'Master Admin Desk & Community Moderation',
    badge: '🔒 Admin Portal',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    title: 'PIN-Secured Governance & Verification Control Center',
    subtitle: 'Authorized administrators can access a dedicated PIN-protected dashboard to verify pending submissions and dispatch alerts.',
    icon: Lock,
    illustrationType: 'admin',
    whatItDoes: 'Provides a clean, dedicated Admin Login (Passcode PIN: 2013) that allows moderators to review flagged claims, approve submitted market prices, ban bad actors, and dispatch broadcast notifications.',
    whyItMatters: 'Ensures community safety and prevents malicious actors from poisoning the decentralized truth consensus.',
    keyFeatures: [
      'Dedicated Admin Login interface with focused 4-digit PIN security (no distracting sign-in clutter).',
      'One-Click Report Approval & Rejection workflow.',
      'System Broadcast Dispatcher sending instant alerts to all 36 state spotters.'
    ],
    howToUseSteps: [
      'Open your Profile and click "Admin Login" in the account section.',
      'Enter the master security passcode (2013) to unlock the Admin Console.',
      'Review pending community submissions and dispatch national alerts.'
    ],
    realLifeExample: {
      scenario: 'A breaking claim about a bridge collapse needs official confirmation before reaching the national live ticker.',
      actionTaken: 'An administrator logs in via Admin Mode, cross-checks spotter photos, and marks it verified.',
      outcome: 'A national verified broadcast is instantly dispatched to all active users.'
    },
    actionButton: {
      text: 'Go to Profile & Admin Access',
      tab: 'profile',
      icon: Lock
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
              <div className="w-8 h-8 rounded-xl bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center font-black text-base shadow-sm font-display">
                S
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight flex items-center gap-2 font-display">
                  <span>How SABI Works — Complete Feature Guide</span>
                  <span className="text-[10px] bg-white/20 text-emerald-100 font-bold px-2 py-0.5 rounded-full">
                    {currentSlide.partNumber}
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-200 truncate max-w-[280px] sm:max-w-md">
                  {currentSlide.partName} • {currentSlideIndex + 1} of {TUTORIAL_SLIDES.length}
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

          {/* Feature Selector Tabs / Quick Jump Bar */}
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
                   slide.id === 'anchor' ? 'News Anchor' :
                   slide.id === 'rumors' ? 'Rumors' : 
                   slide.id === 'deepfake' ? 'AI Scanner' : 
                   slide.id === 'market' ? 'Market' : 
                   slide.id === 'tasks' ? 'Missions' :
                   slide.id === 'sabiation' ? 'Sabiation' :
                   slide.id === 'sabo' ? 'Sabo AI' : 
                   slide.id === 'sabiers' ? 'Sabiers' :
                   slide.id === 'heatmap' ? 'Heatmap' :
                   slide.id === 'recipes' ? 'Recipes' :
                   slide.id === 'rewards' ? 'Titles & Perks' : 'Admin'}
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
                transition={{ duration: 0.2 }}
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
                      <span>What This Feature Does</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      {currentSlide.whatItDoes}
                    </p>
                  </div>

                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-900 font-black text-xs uppercase tracking-wider font-display">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      <span>Why It Matters in Nigeria</span>
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
                      <span>Real-Life Practical Scenario</span>
                    </div>
                    <span className="text-[10px] bg-white/10 text-emerald-200 font-bold px-2 py-0.5 rounded-full">
                      Nigerian Context
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
                        <span className="text-[10px] text-gray-500 block">Crowd voting</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-200 text-center space-y-1 shadow-2xs">
                        <ShoppingBasket className="w-5 h-5 text-amber-500 mx-auto" />
                        <span className="text-xs font-black text-gray-900 block">Market Prices</span>
                        <span className="text-[10px] text-gray-500 block">Mile 12, Bodija</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-200 text-center space-y-1 shadow-2xs">
                        <Sparkles className="w-5 h-5 text-amber-500 mx-auto" />
                        <span className="text-xs font-black text-gray-900 block">Sabiation AI</span>
                        <span className="text-[10px] text-gray-500 block">720p · 1080p · 4K</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-gray-200 text-center space-y-1 shadow-2xs">
                        <Users className="w-5 h-5 text-emerald-600 mx-auto" />
                        <span className="text-xs font-black text-gray-900 block">The Sabiers</span>
                        <span className="text-[10px] text-gray-500 block">36-State network</span>
                      </div>
                    </div>
                  )}

                  {currentSlide.illustrationType === 'anchor' && (
                    <div className="bg-gradient-to-r from-red-950 to-red-900 text-white p-4 rounded-xl space-y-2 border border-red-700 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-xs font-black uppercase tracking-wider text-red-200 font-display">
                            SABI NEWS DESK · LIVE ON AIR
                          </span>
                        </div>
                        <span className="text-[10px] bg-red-800 text-red-200 font-mono px-2 py-0.5 rounded">
                          02:14 / 04:30
                        </span>
                      </div>
                      <p className="text-xs text-red-100 font-medium italic">
                        "Good evening Nigeria, this is the SABI verified news desk. Food commodity prices in Bodija Market Ibadan have dropped by 12% following fresh harvest arrivals..."
                      </p>
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
                            <span className="text-[10px] text-gray-500">Official CBN Circular: Both banknotes remain legal tender indefinitely</span>
                          </div>
                        </div>
                        <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap">
                          FALSE (99%)
                        </span>
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

                  {currentSlide.illustrationType === 'tasks' && (
                    <div className="bg-white p-3.5 rounded-xl border border-blue-200 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          <CheckSquare className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-gray-900 block">Verify Fuel Price at NNPC Ikeja</span>
                          <span className="text-[10px] text-gray-500">Attach meter photo or POS receipt to claim reward</span>
                        </div>
                      </div>
                      <span className="bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full whitespace-nowrap">
                        +50 Sabi Points
                      </span>
                    </div>
                  )}

                  {currentSlide.illustrationType === 'sabiation' && (
                    <div className="bg-gradient-to-r from-amber-900 to-amber-950 text-white p-3.5 rounded-xl border border-amber-500/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#FFD60A]" />
                          <span className="text-xs font-black font-display text-[#FFD60A]">
                            SABIATION AI IMAGE ENGINE
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="bg-blue-900/80 text-blue-200 text-[9px] font-mono px-1.5 py-0.5 rounded">720p</span>
                          <span className="bg-emerald-900/80 text-emerald-200 text-[9px] font-mono px-1.5 py-0.5 rounded">1080p</span>
                          <span className="bg-[#FFD60A] text-black text-[9px] font-mono font-bold px-1.5 py-0.5 rounded">4K UHD</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-amber-100">
                        Select 720p, 1080p, or 4K buttons to generate ultra-clear Nigerian artwork and download instantly in full resolution!
                      </p>
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

                  {currentSlide.illustrationType === 'heatmap' && (
                    <div className="bg-white p-3 rounded-xl border border-rose-200 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs shrink-0">
                          <Map className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-gray-900 block">Interactive Regional Risk Map</span>
                          <span className="text-[10px] text-gray-500">Track 6 Geopolitical Zones with live rumor intensity indicators</span>
                        </div>
                      </div>
                      <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        36 States
                      </span>
                    </div>
                  )}

                  {currentSlide.illustrationType === 'recipes' && (
                    <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                          <Utensils className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-gray-900 block">Authentic Nigerian Recipe Pricing</span>
                          <span className="text-[10px] text-gray-500">Jollof Rice, Egusi & Banga Soup with live market ingredient costs</span>
                        </div>
                      </div>
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                        Live Budget
                      </span>
                    </div>
                  )}

                  {currentSlide.illustrationType === 'rewards' && (
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                        <span className="text-base">🥉</span>
                        <span className="text-xs font-black text-gray-900 block">Bronze Sentinel</span>
                        <span className="text-[10px] text-amber-600 font-bold block">1.25x Points</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-yellow-300 bg-yellow-50/50 shadow-2xs">
                        <span className="text-base">🥇</span>
                        <span className="text-xs font-black text-gray-900 block">Golden Sovereign</span>
                        <span className="text-[10px] text-amber-700 font-bold block">1.75x + Sabiation AI</span>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/50 shadow-2xs">
                        <span className="text-base">👑</span>
                        <span className="text-xs font-black text-gray-900 block">Deluxe Sovereign</span>
                        <span className="text-[10px] text-emerald-700 font-bold block">2.5x + VIP Support</span>
                      </div>
                    </div>
                  )}

                  {currentSlide.illustrationType === 'admin' && (
                    <div className="bg-white p-3 rounded-xl border border-emerald-200 flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-gray-900 block">Admin Passcode Login (PIN: 2013)</span>
                          <span className="text-[10px] text-gray-500">Dedicated PIN gateway with no distracting sign up clutter</span>
                        </div>
                      </div>
                      <span className="bg-[#0A3D2E] text-[#FFD60A] text-[10px] font-black px-2.5 py-1 rounded-full">
                        Admin Only
                      </span>
                    </div>
                  )}
                </div>

                {/* Section 4: Key Features & How To Use */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Key Features */}
                  <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 space-y-2.5">
                    <h4 className="text-xs font-black text-[#0A3D2E] uppercase tracking-wider flex items-center gap-1.5 font-display">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Key Highlights</span>
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
                      className="inline-flex items-center gap-2 text-xs font-black text-[#0A3D2E] bg-emerald-100/80 hover:bg-emerald-200/80 border border-emerald-300 px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-xs font-display"
                    >
                      <currentSlide.actionButton.icon className="w-4 h-4 text-emerald-800" />
                      <span>Try This Feature: {currentSlide.actionButton.text}</span>
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Controls: Dots & Navigation */}
          <div className="bg-gray-50 border-t border-gray-200 px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3">
            {/* Step Dots */}
            <div className="flex items-center gap-1 overflow-x-auto max-w-[160px] sm:max-w-none">
              {TUTORIAL_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleJumpToSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === currentSlideIndex
                      ? 'w-5 bg-[#0A3D2E]'
                      : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                  }`}
                  title={`Go to page ${i + 1}`}
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
                <span>{isLastSlide ? 'Complete Tour & Start SABI' : 'Next Feature'}</span>
                {isLastSlide ? <Sparkles className="w-4 h-4 text-[#FFD60A]" /> : <ChevronRight className="w-4 h-4 text-emerald-200" />}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
