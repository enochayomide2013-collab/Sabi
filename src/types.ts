export type ResultType = 
  | 'TRUE' 
  | 'FALSE' 
  | 'OUTDATED MEDIA' 
  | 'UNVERIFIED' 
  | 'NEEDS MORE VERIFICATION';

export type ReportStatus = 'pending' | 'checking' | 'verified' | 'disputed' | 'needs_review' | 'removed';

export type TrustLevel = 'Bronze' | 'Silver' | 'Gold' | 'Trusted Contributor';

export type UserTier = 'Member' | 'Bronze' | 'Golden' | 'Deluxe';

export type MediaType = 'image' | 'video' | 'audio' | 'screenshot';

export interface EvidenceItem {
  id: string;
  type: MediaType;
  url: string;
  filename: string;
  fileSize?: string;
  timestamp: string;
  isFresh?: boolean;
  approxLocation?: string;
  sessionId?: string;
  ocrExtractedText?: string;
  audioDuration?: number;
}

export interface VerifierResponse {
  id: string;
  taskId: string;
  verifierName: string;
  verifierTrustLevel: TrustLevel;
  verdict: 'TRUE' | 'FALSE' | 'OUTDATED' | 'NOT SURE';
  comment: string;
  reportedPriceOrDetail?: string;
  timestamp: string;
  evidencePhotoUrl?: string;
  approxLocation: string;
  locationMatched: boolean;
}

export interface VerificationTask {
  id: string;
  reportId: string;
  claim: string;
  category: 'market_price' | 'rumor' | 'outdated_media' | 'local_event' | 'food_recipe';
  state: string;
  lga: string;
  area: string;
  landmark?: string;
  radiusKm: number;
  requiredVerifiers: number;
  currentVerifiersCount: number;
  status: 'active' | 'completed' | 'urgent';
  createdAt: string;
  originalEvidence: EvidenceItem[];
  responses: VerifierResponse[];
  pointsReward: number;
  urgencyLevel?: 'normal' | 'high' | 'trending';
}

export interface TruthResult {
  id: string;
  reportId: string;
  claim: string;
  originalClaimQuote: string;
  availableEvidenceQuote: string;
  result: ResultType;
  state: string;
  lga: string;
  area: string;
  verifiedAt: string;
  contributorCount: number;
  aiMediaAnalysis: {
    status: 'completed' | 'outdated_flagged' | 'manipulation_check_passed';
    details: string;
    isOutdatedMedia: boolean;
    confidenceScore: number;
    detectedOrigins?: string;
  };
  confidence: 'High' | 'Medium' | 'Needs Investigation';
  videoDurationSec: number;
  videoThumbnail: string;
  videoUrl?: string;
  audioNarrationText?: string;
  viewsCount: number;
  sharesCount: number;
  sources: string[];
}

export interface MarketPricePoint {
  date: string;
  price: number;
  reportsCount: number;
  locationName: string;
}

export interface RetailPortion {
  name: string; // e.g. "Sachet (70g)", "Cup (Milk Tin)", "Derica", "Single Big Bulb", "Single Tuber"
  unit: string;
  price: number;
  description: string;
  popularBrand?: string;
}

export interface MarketItemLocationPrice {
  state: string;
  area: string;
  largeUnitName: string; // e.g. "Large Basket", "50kg Bag", "25L Keg"
  largeUnitPrice: number;
  smallUnitName: string; // e.g. "Small Container", "Derica / Mudus", "1L Bottle"
  smallUnitPrice: number;
  retailPortions?: RetailPortion[];
  lastUpdated: string;
  reportsCount: number;
  priceTrend: 'up' | 'down' | 'stable';
  trendPercent: number;
}

export interface MarketItem {
  id: string;
  name: string;
  category: 'Vegetables' | 'Grains' | 'Tubers' | 'Oils & Spices' | 'Proteins' | 'Essentials';
  imageUrl: string;
  baseConfidence: number; // e.g. 85%
  totalReportsCount: number;
  primaryLocation: MarketItemLocationPrice;
  otherLocations: MarketItemLocationPrice[];
  retailPortions?: RetailPortion[]; // small quantities for fast everyday buying
  history: {
    '7Days': MarketPricePoint[];
    '30Days': MarketPricePoint[];
    '6Months': MarketPricePoint[];
  };
  seasonalityNote: string;
  relatedRecipes: string[];
}

export interface RecipeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  durationSec: number;
  imageUrl: string;
  tips?: string;
}

export interface RecipeItem {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  ingredients: string[];
  steps: RecipeStep[];
  videoDurationSec: number;
  videoThumbnail: string;
  caloriesApprox?: number;
  originRegion: string;
}

export interface StreakData {
  currentDay: number; // 1 - 14
  lastClaimDate: string; // YYYY-MM-DD
  totalClaimedPoints: number;
  lastContributionDate?: string;
  consecutiveStreakDays?: number;
  missionsCompletedToday?: {
    rumorVerified: boolean;
    marketReported: boolean;
    chatParticipated: boolean;
  };
  streakHistory: {
    day: number;
    points: number;
    claimed: boolean;
    claimedAt?: string;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'member' | 'contributor' | 'verifier' | 'admin';
  trustLevel: TrustLevel;
  userTier?: UserTier; // 'Member' | 'Bronze' | 'Golden' | 'Deluxe'
  sabiPoints: number;
  completedVerificationsCount: number;
  submittedReportsCount: number;
  accuracyRate: number; // e.g. 96%
  joinedDate: string;
  state: string;
  lga: string;
  badges: string[];
  unlockedTitles?: string[];
  hasSabiationAccess?: boolean;
  hasDeluxeVipService?: boolean;
  streak?: StreakData;
  recentActivity: {
    id: string;
    type: 'verified_task' | 'submitted_report' | 'approved_price' | 'badge_earned' | 'tier_upgrade' | 'streak_reward';
    points: number;
    description: string;
    timestamp: string;
  }[];
}

export interface UserAccount extends UserProfile {
  passwordHash?: string;
  isRegistered?: boolean;
}

export interface SentEmailReport {
  id: string;
  recipient: string;
  subject: string;
  body: string;
  claim: string;
  location: string;
  timestamp: string;
  submitterEmail: string;
  status: 'sent' | 'opened_in_client';
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'verification_request' | 'report_verified' | 'points_earned' | 'system_alert' | 'tier_upgrade';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  targetId?: string;
  pointsAwarded?: number;
}

export interface NigerianLGA {
  name: string;
  majorMarkets: string[];
}

export interface NigerianStateData {
  state: string;
  capital: string;
  lgas: NigerianLGA[];
}

export interface SabiersChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderTrustLevel: TrustLevel;
  senderRole?: 'member' | 'contributor' | 'verifier' | 'admin';
  senderTier?: UserTier;
  state: string;
  lga: string;
  channel: 'general' | 'market-prices' | 'rumor-alerts' | 'lagos' | 'abuja-north' | 'east-south';
  message: string;
  timestamp: string;
  reactions: {
    emoji: string;
    count: number;
    userReacted?: boolean;
  }[];
  attachedTag?: {
    type: 'market_price' | 'rumor_alert' | 'truth_verified';
    label: string;
  };
}

export interface SaboAiMessage {
  id: string;
  sender: 'user' | 'sabo';
  text: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    tab?: string;
    query?: string;
  }[];
  sources?: string[];
}

export interface StreakRewardItem {
  day: number;
  points: number;
  badge?: string;
  bonusTitle?: string;
}

export interface TierConfig {
  tier: UserTier;
  title: string;
  tierName?: string;
  pointsCost: number;
  badge: string;
  color: string;
  glowColor: string;
  description: string;
  benefits?: string[];
  perks?: string[];
  unlocksSabiation?: boolean;
  hasCustomerService?: boolean;
  instantBonusPoints?: number;
}

export interface SabiationResource {
  id: string;
  name: string;
  category: string;
  url: string;
  badge?: string;
  description: string;
  freeTierDetails: string;
  iconName: string;
  promptExample?: string;
  isFree?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Market Intelligence' | 'Fact Check Alert' | 'National Food Security' | 'SABI Community' | 'Market Alerts' | 'Fact Check' | 'Food Supply' | 'Economy' | 'Consumer Rights' | string;
  author?: string;
  publishedAt?: string;
  publishedTime?: string;
  readTime: string;
  imageUrl?: string;
  verifiedSource?: string;
  source?: string;
  tags?: string[];
  trendingScore?: number;
}

export interface OnlineSabier {
  id: string;
  name: string;
  avatarUrl: string;
  trustLevel: TrustLevel;
  tier?: UserTier;
  role?: 'member' | 'contributor' | 'verifier' | 'admin';
  state: string;
  lga: string;
  currentActivity: string;
  isOnline: boolean;
  lastActive: string;
  statusMessage?: string;
}
