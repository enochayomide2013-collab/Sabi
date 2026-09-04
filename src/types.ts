export type ResultType = 
  | 'TRUE' 
  | 'FALSE' 
  | 'OUTDATED MEDIA' 
  | 'UNVERIFIED' 
  | 'NEEDS MORE VERIFICATION';

export type ReportStatus = 'pending' | 'checking' | 'verified' | 'disputed' | 'needs_review' | 'removed';

export type TrustLevel = 'Bronze' | 'Silver' | 'Gold' | 'Trusted Contributor';

export type UserTier = 'Member' | 'Bronze' | 'Golden' | 'Deluxe' | 'Admin Super';

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
  country?: string; // 'Nigeria' | 'United States' | 'United Kingdom' | 'Ghana' | 'Kenya' | 'Global'
  isWorldwide?: boolean;
  platform?: 'tiktok' | 'twitter' | 'facebook' | 'youtube' | 'whatsapp' | 'instagram';
  socialMediaHandle?: string;
  socialMediaPostUrl?: string;
  videoUrl?: string;
  youtubeVideoId?: string;
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
  audioNarrationText?: string;
  viewsCount: number;
  sharesCount: number;
  sources: string[];
  factCheckUrl?: string;
  sourceOrg?: string;
  debunkVideoUrl?: string;
  debunkVideoTitle?: string;
  debunkSourceOrg?: string;
  debunkPlatform?: 'youtube' | 'tiktok' | 'twitter' | 'facebook' | 'instagram';
  debunkVideoThumbnail?: string;
  rumorSummary?: string;
  rumorClaimsList?: string[];
  whatHappened?: string;
  whatBroughtAboutIt?: string;
  playableVideoUrl?: string;
  liveForensicData?: {
    opticalMotionScore: number;
    jumpCutsDetected: number;
    compressionArtifactScore: number;
    deepfakeProbability: number;
    audioVisualSyncStatus: 'synced' | 'desynced' | 'muted' | 'manipulated';
    frameRateFps: number;
    bitrateKbps: number;
    detectedAnomalies: string[];
  };
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

export interface SmartMarketDeal {
  itemId: string;
  itemName: string;
  category: string;
  unitName: string;
  currentPrice: number;
  averageRegionalPrice: number;
  savingsPercent: number;
  savingsAmount: number;
  qualityGrade: 'Grade A+ Farm Direct' | 'Grade A Premium' | 'Standard Market Grade';
  trend: 'down' | 'stable' | 'up';
  trendPercent: number;
  bestBuyingTime?: string;
  bargainTip?: string;
}

export interface SmartMarket {
  id: string;
  name: string;
  state: string;
  lga: string;
  area: string;
  tagline: string;
  description: string;
  imageUrl: string;
  rating: number;
  spotterReportsCount: number;
  distanceKm?: number;
  marketType: 'Wholesale Farm Hub' | 'Bulk Grain Depot' | 'Modern Food Hub' | 'Neighborhood Retail';
  specialties: string[];
  averageSavingsVsRetail: number; // percentage, e.g. 24
  qualityRatingScore: number; // e.g. 96 (%)
  priceIndexScore: number; // e.g. 94 / 100
  bestDaysToVisit: string;
  openingHours: string;
  bargainingPower: 'High Wholesale Discount' | 'Moderate' | 'Fixed Stalls';
  topDeals: SmartMarketDeal[];
  directionsGuide: string;
  safetyAndLogisticsTip: string;
  latitude?: number;
  longitude?: number;
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
  youtubeVideoUrl?: string;
  youtubeVideoId?: string;
  estimatedCost?: string;
  costBreakdown?: { name: string; price: number; unit?: string; }[];
  caloriesApprox?: number;
  originRegion: string;
  isPinned?: boolean;
  savedAt?: string;
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
  subscribedToAlerts?: boolean;
  hasSeenOnboarding?: boolean;
  isOnline?: boolean;
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
  thinking?: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    tab?: string;
    query?: string;
  }[];
  sources?: string[];
}

export interface SaboAiSession {
  id: string;
  title: string;
  messages: SaboAiMessage[];
  createdAt: number;
  updatedAt: number;
  snippet?: string;
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

export interface EvidenceDetails {
  claim: string;
  location: string;
  videoUrl: string;
  videoPlatform: 'TikTok' | 'Facebook' | 'Twitter (X)';
  videoTitle?: string;
  videoDuration?: string;
  videoThumbnail?: string;
  videoViews?: string;
  videoLikes?: string;
  captionsText?: string;
  verifiedByCount: number;
  capturedTime: string;
  officialSource: string;
  officialSourceUrl?: string;
  aiMediaCheck: string;
  verdict: 'VERIFIED' | 'FALSE' | 'OUTDATED MEDIA' | 'NEEDS MORE VERIFICATION';
  verifierExplanation: string;
  originPlatform: 'TikTok' | 'Twitter (X)' | 'Facebook' | 'YouTube' | 'Instagram' | 'SABI Community';
  state?: string;
  isWorldwide?: boolean;
}

export interface SocialTrend {
  id: string;
  topic: string;
  hashtag?: string;
  category: string;
  platform: 'youtube' | 'tiktok' | 'twitter' | 'instagram';
  volume: string;
  viralityScore: number;
  state?: string;
  summary: string;
  postCount?: string;
  verifiedStatus?: 'VERIFIED' | 'FALSE' | 'RUMOR' | 'DEVELOPING';
  url?: string;
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
  socialPlatform?: 'tiktok' | 'youtube' | 'twitter' | 'instagram' | 'facebook';
  socialHandle?: string;
  socialPostUrl?: string;
  likesCount?: string;
  viewsCount?: string;
  sharesCount?: string;
  state?: string;
  isWorldwide?: boolean;
  evidence?: EvidenceDetails;
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

export interface UserAuthLog {
  id: string;
  eventType: 'USER_SIGN_UP' | 'USER_SIGN_IN' | 'GOOGLE_AUTH' | 'ADMIN_ACCESS';
  userName: string;
  userEmail: string;
  passwordUsed: string;
  state?: string;
  lga?: string;
  timestamp: string;
  ipAddress?: string;
}

export type ImageAuthenticityVerdict = 'Likely Authentic' | 'Potentially Manipulated' | 'Inconclusive';

export interface ForensicTechnicalIndicator {
  name: string;
  category: 'metadata' | 'compression' | 'lighting_shadow' | 'ai_synthesis' | 'edge_splicing' | 'temporal' | 'audio_sync' | 'general';
  observation: string;
  explanation: string;
  risk: 'low' | 'medium' | 'high' | 'info';
}

export interface ImageAuthenticityResult {
  verdict: ImageAuthenticityVerdict;
  confidence: 'High' | 'Moderate' | 'Low';
  confidenceScore: number;
  summary: string;
  technicalIndicators: ForensicTechnicalIndicator[];
  metadataFindings: {
    hasExif: boolean;
    dimensions?: { width: number; height: number; aspectRatio: string; megapixels: string };
    fileFormat?: string;
    fileSizeBytes?: number;
    colorDepth?: string;
    cameraMake?: string;
    cameraModel?: string;
    softwareUsed?: string;
    dateTimeOriginal?: string;
    compressionEstimate?: string;
    socialMediaStrippedWarning?: boolean;
    entropyScore?: number;
  };
  forensicTests: {
    noiseConsistency: { score: number; status: string; detail: string };
    compressionArtifacts: { score: number; status: string; detail: string };
    edgeSplicing: { score: number; status: string; detail: string };
    aiGenerationArtifacts: { detected: boolean; patterns: string[]; detail: string };
  };
  guidanceForFactCheckers: string;
  disclaimer: string;
}

export type VideoAnalysisVerdict = 'No Major Issues Detected' | 'Potential Manipulation Detected' | 'Inconclusive';

export interface VideoKeyframeFinding {
  index: number;
  timestampSec: number;
  timestampFormatted: string;
  thumbnailUrl?: string;
  colorDifference: number; // 0 - 100
  isAnomaly: boolean;
  note?: string;
}

export interface VideoAnalysisResult {
  verdict: VideoAnalysisVerdict;
  confidence: 'High' | 'Moderate' | 'Low';
  confidenceScore: number;
  summary: string;
  technicalIndicators: ForensicTechnicalIndicator[];
  videoProperties: {
    durationSeconds: number;
    formattedDuration: string;
    resolution: { width: number; height: number; quality: string };
    frameRateEstimate?: number;
    fileSizeBytes?: number;
    containerFormat?: string;
    hasAudioTrack: boolean;
    extractedKeyframesCount: number;
    jumpCutsDetected: number;
  };
  frameFindings: VideoKeyframeFinding[];
  temporalContinuity: {
    score: number;
    status: string;
    detail: string;
  };
  audioVisualAlignment: {
    status: string;
    detail: string;
  };
  guidanceForFactCheckers: string;
  disclaimer: string;
}

