import {
  VerificationTask,
  TruthResult,
  MarketItem,
  RecipeItem,
  UserProfile,
  AppNotification,
  NewsArticle,
  StreakRewardItem,
  SmartMarket,
  SmartMarketDeal,
  SocialTrend
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_chinedu_01',
  name: 'Chinedu Okafor',
  email: 'chinedu.okafor@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'contributor',
  trustLevel: 'Bronze',
  userTier: 'Member',
  sabiPoints: 1250,
  completedVerificationsCount: 23,
  submittedReportsCount: 6,
  accuracyRate: 96,
  joinedDate: 'November 2024',
  state: 'Lagos',
  lga: 'Lagos Mainland',
  badges: ['Local Sabi Eye', 'First Responder', 'Price Spotter', 'Community Sentinel'],
  unlockedTitles: ['Local Sabi Eye'],
  hasSabiationAccess: false,
  hasDeluxeVipService: false,
  streak: {
    currentDay: 1,
    lastClaimDate: '',
    totalClaimedPoints: 0,
    streakHistory: [
      { day: 1, points: 300, claimed: false },
      { day: 2, points: 350, claimed: false },
      { day: 3, points: 400, claimed: false },
      { day: 4, points: 450, claimed: false },
      { day: 5, points: 500, claimed: false },
      { day: 6, points: 600, claimed: false },
      { day: 7, points: 750, claimed: false },
      { day: 8, points: 850, claimed: false },
      { day: 9, points: 950, claimed: false },
      { day: 10, points: 1100, claimed: false },
      { day: 11, points: 1200, claimed: false },
      { day: 12, points: 1300, claimed: false },
      { day: 13, points: 1400, claimed: false },
      { day: 14, points: 2000, claimed: false }
    ]
  },
  recentActivity: [
    {
      id: 'act_01',
      type: 'verified_task',
      points: 25,
      description: 'Verified Rice Price Claim in Dei-Dei Market',
      timestamp: '2 hours ago'
    },
    {
      id: 'act_02',
      type: 'submitted_report',
      points: 10,
      description: 'Submitted fuel price video claim in Yaba',
      timestamp: 'Yesterday'
    },
    {
      id: 'act_03',
      type: 'approved_price',
      points: 15,
      description: 'Submitted fresh tomato market price at Mile 12',
      timestamp: '3 days ago'
    },
    {
      id: 'act_04',
      type: 'badge_earned',
      points: 50,
      description: 'Earned "Price Spotter" Community Badge',
      timestamp: '5 days ago'
    }
  ],
  hasSeenOnboarding: false
};

export const INITIAL_LEADERBOARD = [
  { rank: 1, name: 'Amina Bello', state: 'Kano', lga: 'Fagge', points: 4820, verifications: 94, trust: 'Trusted Contributor', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80' },
  { rank: 2, name: 'Emeka Nwosu', state: 'Anambra', lga: 'Onitsha North', points: 4510, verifications: 88, trust: 'Gold', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80' },
  { rank: 3, name: 'Babajide Adeleke', state: 'Lagos', lga: 'Kosofe', points: 4180, verifications: 82, trust: 'Gold', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80' },
  { rank: 4, name: 'Blessing Udoh', state: 'Rivers', lga: 'Port Harcourt City', points: 3620, verifications: 71, trust: 'Silver', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80' },
  { rank: 5, name: 'Fatima Garba', state: 'FCT - Abuja', lga: 'Bwari', points: 3140, verifications: 60, trust: 'Silver', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80' },
  { rank: 6, name: 'Chinedu Okafor (You)', state: 'Lagos', lga: 'Lagos Mainland', points: 1250, verifications: 23, trust: 'Bronze', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80' }
];

export const INITIAL_TASKS: VerificationTask[] = [
  {
    id: 'task_001',
    reportId: 'rep_001',
    claim: 'Is a 50kg bag of foreign rice really selling for ₦90,000 in Dei-Dei Market?',
    category: 'market_price',
    state: 'FCT - Abuja',
    lga: 'Bwari',
    area: 'Dei-Dei Building & Food Market',
    landmark: 'Grain Section, Gate 3',
    radiusKm: 5,
    requiredVerifiers: 3,
    currentVerifiersCount: 2,
    status: 'urgent',
    createdAt: '45 mins ago',
    pointsReward: 25,
    urgencyLevel: 'trending',
    originalEvidence: [
      {
        id: 'ev_01',
        type: 'screenshot',
        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
        filename: 'whatsapp_deidei_rice_broadcast.jpg',
        fileSize: '1.8 MB',
        timestamp: 'Today, 11:30 AM',
        ocrExtractedText: 'ALERT: Foreign parboiled rice 50kg bag crash to N90,000 today in Dei Dei market Abuja!'
      }
    ],
    responses: [
      {
        id: 'resp_01',
        taskId: 'task_001',
        verifierName: 'Musa I.',
        verifierTrustLevel: 'Gold',
        verdict: 'FALSE',
        comment: 'I visited the main grains stall at Dei-Dei today. Foreign rice is ₦104,000 while local polished rice is ₦92,000.',
        reportedPriceOrDetail: '₦104,000 (Foreign) / ₦92,000 (Local)',
        timestamp: '25 mins ago',
        approxLocation: 'Dei-Dei, FCT',
        locationMatched: true,
        evidencePhotoUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'resp_02',
        taskId: 'task_001',
        verifierName: 'Halima K.',
        verifierTrustLevel: 'Silver',
        verdict: 'FALSE',
        comment: 'Price checked at Alh. Sani grain depot. Standard royal stallion brand is ₦105,000.',
        reportedPriceOrDetail: '₦105,000',
        timestamp: '10 mins ago',
        approxLocation: 'Dei-Dei, FCT',
        locationMatched: true
      }
    ]
  },
  {
    id: 'task_002',
    reportId: 'rep_002',
    claim: 'Viral video claiming major fuel scarcity and ₦1,400/L pump price at Yaba filling stations',
    category: 'rumor',
    state: 'Lagos',
    lga: 'Lagos Mainland',
    area: 'Yaba',
    landmark: 'TotalEnergies & NNPC Stations, Herbert Macaulay Way',
    radiusKm: 4,
    requiredVerifiers: 4,
    currentVerifiersCount: 3,
    status: 'active',
    createdAt: '1 hour ago',
    pointsReward: 25,
    urgencyLevel: 'trending',
    originalEvidence: [
      {
        id: 'ev_02',
        type: 'video',
        url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
        filename: 'fuel_queue_yaba_alleged.mp4',
        fileSize: '4.2 MB',
        timestamp: 'Today, 9:45 AM',
        ocrExtractedText: 'Heavy queues in Yaba right now, pump price spiked to 1400/litre'
      }
    ],
    responses: [
      {
        id: 'resp_03',
        taskId: 'task_002',
        verifierName: 'Tunde O.',
        verifierTrustLevel: 'Bronze',
        verdict: 'OUTDATED',
        comment: 'The video circulating is from the May 2024 gridlock. As of 12 PM today, Herbert Macaulay NNPC is selling at official ₦895 with no lines.',
        reportedPriceOrDetail: 'Official ₦895/L, Zero Queue',
        timestamp: '30 mins ago',
        approxLocation: 'Yaba, Lagos',
        locationMatched: true
      },
      {
        id: 'resp_04',
        taskId: 'task_002',
        verifierName: 'Kemi A.',
        verifierTrustLevel: 'Gold',
        verdict: 'OUTDATED',
        comment: 'Live camera capture shows clear driveway at Total station on Commercial Avenue.',
        reportedPriceOrDetail: 'Normal Operations',
        timestamp: '15 mins ago',
        approxLocation: 'Yaba, Lagos',
        locationMatched: true
      }
    ]
  },
  {
    id: 'task_003',
    reportId: 'rep_003',
    claim: 'Claim that Onitsha River Niger Bridge is temporarily closed for unscheduled structural tests',
    category: 'local_event',
    state: 'Anambra',
    lga: 'Onitsha South',
    area: 'Bridgehead Market',
    landmark: 'Second Niger Bridge / Asaba-Onitsha Toll Link',
    radiusKm: 6,
    requiredVerifiers: 3,
    currentVerifiersCount: 1,
    status: 'active',
    createdAt: '2 hours ago',
    pointsReward: 25,
    urgencyLevel: 'normal',
    originalEvidence: [
      {
        id: 'ev_03',
        type: 'screenshot',
        url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
        filename: 'bridge_closure_rumor.png',
        fileSize: '950 KB',
        timestamp: 'Today, 8:15 AM'
      }
    ],
    responses: [
      {
        id: 'resp_05',
        taskId: 'task_003',
        verifierName: 'Obinna E.',
        verifierTrustLevel: 'Trusted Contributor',
        verdict: 'FALSE',
        comment: 'I crossed both bridges this morning. Traffic is flowing completely freely in both Asaba and Onitsha directions.',
        reportedPriceOrDetail: 'Free flow traffic',
        timestamp: '1 hour ago',
        approxLocation: 'Bridgehead, Anambra',
        locationMatched: true
      }
    ]
  },
  {
    id: 'task_004',
    reportId: 'rep_004',
    claim: 'Is fresh tomato basket price dropping to ₦25,000 at Bodija Market due to high northern arrivals?',
    category: 'market_price',
    state: 'Oyo',
    lga: 'Ibadan North',
    area: 'Bodija International Market',
    landmark: 'Vegetable Offloading Bay',
    radiusKm: 5,
    requiredVerifiers: 3,
    currentVerifiersCount: 2,
    status: 'active',
    createdAt: '3 hours ago',
    pointsReward: 25,
    urgencyLevel: 'normal',
    originalEvidence: [
      {
        id: 'ev_04',
        type: 'audio',
        url: '',
        filename: 'bodija_trader_voicenote.mp3',
        fileSize: '1.2 MB',
        timestamp: 'Today, 7:30 AM',
        audioDuration: 18,
        ocrExtractedText: 'Voice note: Tomatoes from Kano arrived in 15 trailers today, basket is 25k.'
      }
    ],
    responses: [
      {
        id: 'resp_06',
        taskId: 'task_004',
        verifierName: 'Adeola M.',
        verifierTrustLevel: 'Silver',
        verdict: 'TRUE',
        comment: 'Confirmed at Bodija vegetable bay. Grade B basket is ₦25,000 to ₦28,000, while Grade A firm paste basket is ₦32,000.',
        reportedPriceOrDetail: '₦25,000 - ₦32,000 basket',
        timestamp: '1 hour ago',
        approxLocation: 'Bodija, Oyo',
        locationMatched: true
      }
    ]
  },
  {
    id: 'task_005',
    reportId: 'rep_005',
    claim: 'Is Garri price stable at Oyingbo Market?',
    category: 'market_price',
    state: 'Lagos',
    lga: 'Lagos Mainland',
    area: 'Oyingbo Modern Market',
    landmark: 'Cassava Section',
    radiusKm: 3,
    requiredVerifiers: 3,
    currentVerifiersCount: 1,
    status: 'active',
    createdAt: '5 hours ago',
    pointsReward: 20,
    urgencyLevel: 'normal',
    originalEvidence: [],
    responses: []
  },
  {
    id: 'task_006',
    reportId: 'rep_006',
    claim: 'Rumor of fuel station price hike in Kano Sabon Gari Market area.',
    category: 'rumor',
    state: 'Kano',
    lga: 'Fagge',
    area: 'Sabon Gari Market',
    landmark: 'NNPC Filling Station',
    radiusKm: 2,
    requiredVerifiers: 3,
    currentVerifiersCount: 0,
    status: 'active',
    createdAt: '2 hours ago',
    pointsReward: 30,
    urgencyLevel: 'high',
    originalEvidence: [],
    responses: []
  },
  {
    id: 'task_007',
    reportId: 'rep_007',
    claim: 'Is rice price dropping at Dawanau market?',
    category: 'market_price',
    state: 'Kano',
    lga: 'Dawakin Tofa',
    area: 'Dawanau International Grains Market',
    landmark: 'Grains Gate',
    radiusKm: 10,
    requiredVerifiers: 5,
    currentVerifiersCount: 2,
    status: 'active',
    createdAt: '1 hour ago',
    pointsReward: 25,
    urgencyLevel: 'normal',
    originalEvidence: [],
    responses: []
  },
  {
    id: 'task_008',
    reportId: 'rep_008',
    claim: 'Road closure reported on Onitsha-Asaba road.',
    category: 'local_event',
    state: 'Anambra',
    lga: 'Onitsha North',
    area: 'Onitsha',
    landmark: 'Niger Bridge',
    radiusKm: 4,
    requiredVerifiers: 4,
    currentVerifiersCount: 1,
    status: 'active',
    createdAt: '30 mins ago',
    pointsReward: 35,
    urgencyLevel: 'high',
    originalEvidence: [],
    responses: []
  },
  {
    id: 'task_009',
    reportId: 'rep_009',
    claim: 'New yam festival prices at Wurukum Market.',
    category: 'market_price',
    state: 'Benue',
    lga: 'Makurdi',
    area: 'Wurukum Market',
    landmark: 'Yam Bay',
    radiusKm: 3,
    requiredVerifiers: 3,
    currentVerifiersCount: 0,
    status: 'active',
    createdAt: '4 hours ago',
    pointsReward: 20,
    urgencyLevel: 'normal',
    originalEvidence: [],
    responses: []
  },
  {
    id: 'task_010',
    reportId: 'rep_010',
    claim: 'Reported shortage of tomatoes at Mile 3 Market.',
    category: 'market_price',
    state: 'Rivers',
    lga: 'Port Harcourt City',
    area: 'Mile 3 Food Market',
    landmark: 'Vegetable Section',
    radiusKm: 2,
    requiredVerifiers: 3,
    currentVerifiersCount: 1,
    status: 'active',
    createdAt: '2 hours ago',
    pointsReward: 25,
    urgencyLevel: 'normal',
    originalEvidence: [],
    responses: []
  }
];

export const INITIAL_TRUTH_RESULTS: TruthResult[] = [
  {
    id: 'truth_001',
    reportId: 'rep_rice_deidei',
    claim: 'Rice Price in Dei-Dei Market crashed to ₦90,000 per 50kg bag',
    originalClaimQuote: 'Foreign parboiled rice 50kg bag crashed to ₦90,000 today in Dei-Dei Market Abuja after massive border container clearances.',
    availableEvidenceQuote: 'Three on-ground community verifiers and receipt checks confirmed foreign parboiled rice sells between ₦104,000 and ₦107,000. Only local unprocessed rice sells around ₦92,000.',
    result: 'FALSE',
    state: 'FCT - Abuja',
    lga: 'Bwari',
    area: 'Dei-Dei Building & Food Market',
    country: 'Nigeria',
    isWorldwide: false,
    platform: 'tiktok',
    socialMediaHandle: '@abuja_market_gist',
    socialMediaPostUrl: 'https://tiktok.com/@abuja_market_gist/video/73910294821',
    youtubeVideoId: 'dQw4w9WgXcQ',
    videoUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    playableVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    verifiedAt: '2 hours ago',
    contributorCount: 3,
    rumorSummary: 'Viral TikTok and WhatsApp audio claiming 50kg foreign parboiled rice dropped drastically to ₦90,000 following an alleged emergency customs waiver in Abuja.',
    whatHappened: 'Foreign parboiled rice (Royal Stallion, Caprice, Mama Gold) is actively selling across Dei-Dei Market at wholesale prices between ₦104,000 and ₦107,000 per 50kg bag. Local Nigerian short-grain rice is trading at ₦92,000. Normal trading is occurring with standard stock volumes and no emergency discounting.',
    whatBroughtAboutIt: 'The rumor originated when an anonymous food deal aggregator on TikTok clipped an old broadcast from March 2024 discussing proposed temporary food tariffs. The creator added sensationalized captions claiming a ₦90,000 crash. The clip was forwarded across multiple Abuja neighborhood WhatsApp groups, causing buyers to flood stores asking for nonexistent discounts.',
    rumorClaimsList: [
      'Claimed foreign 50kg parboiled rice (Royal Stallion, Caprice) sells at ₦90,000 flat.',
      'Claimed customs opened land borders releasing 500 subsidized food trailers into Dei-Dei.',
      'Claimed retailers are mandated to sell local short grain rice at ₦65,000.'
    ],
    aiMediaAnalysis: {
      status: 'completed',
      details: 'OCR and reverse-claim match completed. Broadcast flyer matches recycled TikTok viral template from Q1 2024 with altered timestamp banner.',
      isOutdatedMedia: true,
      confidenceScore: 94,
      detectedOrigins: 'TikTok Viral Clip Archive (March 2024)'
    },
    liveForensicData: {
      opticalMotionScore: 88,
      jumpCutsDetected: 3,
      compressionArtifactScore: 72,
      deepfakeProbability: 12,
      audioVisualSyncStatus: 'synced',
      frameRateFps: 29.97,
      bitrateKbps: 2450,
      detectedAnomalies: ['Recycled 2024 On-Screen Text Overlay', 'Audio re-dubbed over stock footage', 'WhatsApp Compression Grid']
    },
    confidence: 'High',
    videoDurationSec: 20,
    videoThumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    audioNarrationText: 'SABI Verification: Social media claims that 50kg foreign rice crashed to 90,000 Naira in Dei-Dei Market are FALSE. Community verifiers at the market confirmed prices remain between 104,000 and 107,000 Naira.',
    viewsCount: 14200,
    sharesCount: 1850,
    sources: ['Dei-Dei Grains Market Association', '3 Verified On-Ground Community Spotters', 'SABI Price Log'],
    factCheckUrl: 'https://dubawa.org/fact-check-did-rice-prices-drop-to-90k-in-abuja',
    sourceOrg: 'Dubawa Nigeria & Channels TV',
    debunkVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    debunkVideoTitle: 'Channels TV & Dubawa: Fact-Checking Abuja Food Market Price Crash Claims',
    debunkSourceOrg: 'Channels TV Fact Check Desk',
    debunkPlatform: 'youtube',
    debunkVideoThumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'truth_002',
    reportId: 'rep_fuel_lagos',
    claim: 'Video showing severe fuel scarcity and ₦1,400/L queues in Yaba',
    originalClaimQuote: 'Massive vehicle queues paralyze Yaba as fuel stations hike pump price to ₦1,400 per litre.',
    availableEvidenceQuote: 'Live camera evidence and spotter checks at Herbert Macaulay Way stations show normal operations, zero waiting lines, and official pricing at ₦895/L.',
    result: 'OUTDATED MEDIA',
    state: 'Lagos',
    lga: 'Lagos Mainland',
    area: 'Yaba',
    country: 'Nigeria',
    isWorldwide: false,
    platform: 'twitter',
    socialMediaHandle: '@LagosTrafficGist',
    socialMediaPostUrl: 'https://x.com/LagosTrafficGist/status/181294819028',
    youtubeVideoId: 'M7lc1UVf-VE',
    videoUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    playableVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    verifiedAt: '3 hours ago',
    contributorCount: 4,
    rumorSummary: 'Circulating Twitter (X) video depicting massive vehicle gridlock and panic buying queues at filling stations in Yaba, claiming pumps jumped to ₦1,400/L.',
    whatHappened: 'Fuel stations along Herbert Macaulay Way, Commercial Avenue, and Murtala Muhammed Way in Yaba are dispensing premium motor spirit smoothly at official regulated rates (₦895/L). No queues or vehicular gridlocks exist on the corridor.',
    whatBroughtAboutIt: 'An engagement farming account on Twitter (X) reposted old footage recorded during the severe May 2024 supply disruption in Lagos. In the background of the video, a billboard advertising a May 2024 music concert is clearly visible. The uploader presented the archived video as a breaking morning event to gain retweets and panic interactions.',
    rumorClaimsList: [
      'Claimed all major fuel marketers along Herbert Macaulay Way closed pumps.',
      'Claimed remaining independent filling stations are charging ₦1,400 per litre.',
      'Claimed vehicle queues have shut down interstate transport from Yaba.'
    ],
    aiMediaAnalysis: {
      status: 'outdated_flagged',
      details: 'Video frame analysis on X/Twitter post identified billboard campaign from May 2024 in the background. The video authenticates historical footage repurposed as current news.',
      isOutdatedMedia: true,
      confidenceScore: 98,
      detectedOrigins: 'Twitter/X Archive May 2024 Fuel Disruption'
    },
    liveForensicData: {
      opticalMotionScore: 92,
      jumpCutsDetected: 1,
      compressionArtifactScore: 65,
      deepfakeProbability: 4,
      audioVisualSyncStatus: 'synced',
      frameRateFps: 30,
      bitrateKbps: 3100,
      detectedAnomalies: ['Archived May 2024 Outdoor Billboard Matched', 'Temporal Discrepancy with current weather log']
    },
    confidence: 'High',
    videoDurationSec: 20,
    videoThumbnail: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    audioNarrationText: 'SABI Media Check: The viral video depicting long queues in Yaba is OUTDATED MEDIA. Analysis confirms the footage dates back to May 2024. Current stations in Yaba are operating normally.',
    viewsCount: 22800,
    sharesCount: 4120,
    sources: ['SABI Live Camera Verifiers', 'Frame Timestamp Analysis', 'Lagos Traffic Sentinel'],
    factCheckUrl: 'https://africacheck.org/fact-checks/reports/fuel-scarcity-video-yaba-lagos-recycled-archive',
    sourceOrg: 'Africa Check Nigeria',
    debunkVideoUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    debunkVideoTitle: 'Africa Check Forensics: Debunking Viral Recycled Fuel Queue Video in Lagos',
    debunkSourceOrg: 'Africa Check Video Forensics',
    debunkPlatform: 'youtube',
    debunkVideoThumbnail: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'truth_003',
    reportId: 'rep_tomato_bodija',
    claim: 'Tomato prices at Bodija Market dropped below ₦30,000 per basket',
    originalClaimQuote: 'Huge truck arrivals from Kano force Bodija fresh tomato basket down to ₦25,000 today.',
    availableEvidenceQuote: 'On-site market spotters confirmed fresh arrivals resulted in basket prices between ₦25,000 and ₦30,000 depending on grade.',
    result: 'TRUE',
    state: 'Oyo',
    lga: 'Ibadan North',
    area: 'Bodija International Market',
    country: 'Nigeria',
    isWorldwide: false,
    platform: 'facebook',
    socialMediaHandle: 'Ibadan Market Express Community',
    socialMediaPostUrl: 'https://facebook.com/groups/ibadanmarket/posts/9912048201',
    youtubeVideoId: 'fJ9rUzIMcZQ',
    videoUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
    playableVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    verifiedAt: '5 hours ago',
    contributorCount: 3,
    rumorSummary: 'Facebook live video and audio updates reporting major price drops in fresh produce baskets at Bodija Market after 14 heavy trailers arrived overnight from Northern farms.',
    whatHappened: 'Large baskets of fresh tomatoes from Kano and Jos farms are selling between ₦25,000 and ₦30,000 at the Bodija Market perishable bay. Retail 4L paint bucket measures are also down to ₦2,000–₦2,500.',
    whatBroughtAboutIt: 'A harvest bumper crop in Northern irrigation corridors coincided with improved transport logistics, leading 14 articulated trucks to arrive simultaneously at Bodija Market at 4 AM. Traders initiated rapid discounting to clear perishable stock before the afternoon heat.',
    rumorClaimsList: [
      'Claimed large rafia baskets of fresh Jos and Kano tomatoes dropped to ₦25,000 - ₦30,000.',
      'Claimed retail 4L paint bucket portions are now selling around ₦2,000.',
      'Confirmed high inventory supply available directly at the perishable section.'
    ],
    aiMediaAnalysis: {
      status: 'completed',
      details: 'Audio transcription and Facebook live trader receipt corroboration matched. High supply influx verified.',
      isOutdatedMedia: false,
      confidenceScore: 91,
      detectedOrigins: 'Facebook Live Stream Traders Bodija'
    },
    liveForensicData: {
      opticalMotionScore: 95,
      jumpCutsDetected: 0,
      compressionArtifactScore: 30,
      deepfakeProbability: 1,
      audioVisualSyncStatus: 'synced',
      frameRateFps: 30,
      bitrateKbps: 2800,
      detectedAnomalies: []
    },
    confidence: 'High',
    videoDurationSec: 20,
    videoThumbnail: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
    audioNarrationText: 'SABI Verified: Reports that tomato basket prices dropped to 25,000 Naira at Bodija Market are TRUE, driven by heavy supply from Kano.',
    viewsCount: 9400,
    sharesCount: 890,
    sources: ['Bodija Perishable Traders Union', '3 Community Spotters'],
    factCheckUrl: 'https://factcheckhub.com/bodija-market-tomato-price-verification',
    sourceOrg: 'FactCheckHub Nigeria',
    debunkVideoUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    debunkVideoTitle: 'Oyo Market Watch: On-Ground Video Verification of Bodija Produce Drop',
    debunkSourceOrg: 'FactCheckHub & Oyo Market Watch',
    debunkPlatform: 'youtube',
    debunkVideoThumbnail: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'truth_004',
    reportId: 'rep_cement_port_harcourt',
    claim: 'Rumor that Dangote Cement factory price announced at ₦5,200 nationwide',
    originalClaimQuote: 'Press release claiming factory direct cement supply at ₦5,200 per 50kg bag starting this week.',
    availableEvidenceQuote: 'Depot managers in Port Harcourt, Lagos, and Kano confirmed no price adjustment notice was issued. Retail remains ₦8,400 to ₦9,000.',
    result: 'FALSE',
    state: 'Rivers',
    lga: 'Port Harcourt City',
    area: 'Mile 1 Market',
    country: 'Nigeria',
    isWorldwide: false,
    platform: 'youtube',
    socialMediaHandle: 'Naija Business Pulse YouTube',
    socialMediaPostUrl: 'https://youtube.com/shorts/cement_price_reduction_2026',
    youtubeVideoId: 'L_LUpnjgPso',
    videoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
    playableVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    verifiedAt: 'Yesterday',
    contributorCount: 5,
    rumorSummary: 'Circulating YouTube Shorts and WhatsApp letter claiming Dangote Industries announced an emergency factory price reduction to ₦5,200 per 50kg bag.',
    whatHappened: 'Wholesale and retail cement prices across Port Harcourt, Lagos, Abuja, and Kano remain steady at ₦8,400–₦9,000 per 50kg bag. Factory direct gates continue distributing under existing commercial price lists.',
    whatBroughtAboutIt: 'A fraudulent YouTube channel created an edited corporate flyer with a fake Dangote letterhead to drive clicks and solicit unauthorized direct payments for fictitious wholesale allocations. The fake document was screenshot and shared rapidly in builder and real estate forums.',
    rumorClaimsList: [
      'Claimed Dangote Cement issued a circular pegging ex-factory depot cost at ₦5,200.',
      'Claimed all retail building material distributors are obligated to sell at ₦5,500.',
      'Claimed port offloaders in Port Harcourt and Lagos started direct retail distribution.'
    ],
    aiMediaAnalysis: {
      status: 'completed',
      details: 'YouTube Shorts clip uses altered graphic banner over old 2023 press video. Document typography analysis shows fake corporate header.',
      isOutdatedMedia: false,
      confidenceScore: 97,
      detectedOrigins: 'YouTube Clickbait Short Video Channel'
    },
    liveForensicData: {
      opticalMotionScore: 84,
      jumpCutsDetected: 4,
      compressionArtifactScore: 78,
      deepfakeProbability: 8,
      audioVisualSyncStatus: 'synced',
      frameRateFps: 24,
      bitrateKbps: 1900,
      detectedAnomalies: ['Forged Corporate Letterhead Typography', 'Manipulated Text Box Inconsistencies']
    },
    confidence: 'High',
    videoDurationSec: 20,
    videoThumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80',
    audioNarrationText: 'SABI Alert: The circulated letter claiming Dangote Cement has reduced prices to 5,200 Naira is FALSE. No official price reduction has occurred.',
    viewsCount: 31000,
    sharesCount: 6500,
    sources: ['Distributor Depot Logs', 'Corporate Verification Desk'],
    factCheckUrl: 'https://dubawa.org/factcheck-fake-memo-claims-cement-price-crashed',
    sourceOrg: 'Dubawa Nigeria',
    debunkVideoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    debunkVideoTitle: 'Dubawa FactCheck: Debunking Viral Fake Memo on Cement Price Reductions',
    debunkSourceOrg: 'Dubawa Fact-Check Team',
    debunkPlatform: 'youtube',
    debunkVideoThumbnail: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'truth_005',
    reportId: 'rep_bridge_onitsha',
    claim: 'Second Niger Bridge closed to interstate transport for urgent repairs',
    originalClaimQuote: 'Urgent advisory: Second Niger Bridge closed until Monday morning for expansion joint maintenance.',
    availableEvidenceQuote: 'Community verifiers on-site captured live video showing open toll corridors and continuous vehicle flow with no construction barriers.',
    result: 'FALSE',
    state: 'Anambra',
    lga: 'Onitsha South',
    area: 'Bridgehead Market',
    country: 'Nigeria',
    isWorldwide: false,
    platform: 'tiktok',
    socialMediaHandle: '@east_nigeria_vibes',
    socialMediaPostUrl: 'https://tiktok.com/@east_nigeria_vibes/video/7399812903',
    youtubeVideoId: '9bZkp7q19f0',
    videoUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    playableVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    verifiedAt: '1 day ago',
    contributorCount: 4,
    rumorSummary: 'Viral TikTok broadcast claiming the Second Niger Bridge connecting Asaba and Onitsha was shut down indefinitely by the Ministry of Works for emergency repairs.',
    whatHappened: 'The Second Niger Bridge toll link and expressway bypass between Asaba (Delta) and Onitsha (Anambra) are fully open to all commercial and private vehicles with smooth traffic flow.',
    whatBroughtAboutIt: 'A routine 15-minute roadside sweeping and line-marking operation conducted early in the morning by road maintenance personnel was misconstrued by a passerby who recorded a 10-second TikTok clip shouting that the bridge had been shut down.',
    rumorClaimsList: [
      'Claimed toll plazas and expressway bypass were blocked with concrete barricades.',
      'Claimed commercial buses were diverted back to the old Niger Bridge.',
      'Claimed joint expansion repairs will take 3 weeks to complete.'
    ],
    aiMediaAnalysis: {
      status: 'completed',
      details: 'No official ministry notice found. TikTok video footage from verified contributors confirmed open roadway.',
      isOutdatedMedia: false,
      confidenceScore: 99,
      detectedOrigins: 'TikTok Onitsha Community Live Stream'
    },
    liveForensicData: {
      opticalMotionScore: 96,
      jumpCutsDetected: 0,
      compressionArtifactScore: 35,
      deepfakeProbability: 1,
      audioVisualSyncStatus: 'synced',
      frameRateFps: 30,
      bitrateKbps: 3400,
      detectedAnomalies: []
    },
    confidence: 'High',
    videoDurationSec: 20,
    videoThumbnail: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    audioNarrationText: 'SABI Verification: The Second Niger Bridge remains open and accessible. Reports of bridge closure are completely FALSE.',
    viewsCount: 18400,
    sharesCount: 3200,
    sources: ['Federal Ministry of Works Liaison', 'Onitsha Spotters', 'Asaba Highway Patrol'],
    factCheckUrl: 'https://africacheck.org/fact-checks/reports/second-niger-bridge-remains-open',
    sourceOrg: 'Africa Check & Channels TV',
    debunkVideoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    debunkVideoTitle: 'Live Highway Verification: Second Niger Bridge Open & Free Flowing',
    debunkSourceOrg: 'Channels TV Southeast Bureau',
    debunkPlatform: 'youtube',
    debunkVideoThumbnail: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'truth_006',
    reportId: 'rep_uk_visa_global',
    claim: 'UK Home Office Abolishes Health and Care Worker Visa Sponsorship for Africans',
    originalClaimQuote: 'Viral broadcast stating the UK Government has banned all health worker applications from Africa effective immediately.',
    availableEvidenceQuote: 'UK Home Office published official immigration rules showing visa routes remain active with updated salary thresholds and certified sponsor requirements.',
    result: 'FALSE',
    state: 'London',
    lga: 'Westminster',
    area: 'Global Diaspora Desk',
    country: 'United Kingdom',
    isWorldwide: true,
    platform: 'twitter',
    socialMediaHandle: '@GlobalDiasporaAlert',
    socialMediaPostUrl: 'https://x.com/GlobalDiasporaAlert/status/183920192839',
    youtubeVideoId: 'kJQP7kiw5Fk',
    videoUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80',
    playableVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    verifiedAt: '6 hours ago',
    contributorCount: 7,
    rumorSummary: 'Twitter (X) viral thread alleging the UK Home Office has completely halted and banned all health and social care worker visa sponsorships originating from Africa.',
    whatHappened: 'The UK Health and Care Worker visa route remains actively open for qualified applicants globally, subject to standard CQC registration and updated sponsorship salary rules. No nationality-based or continental ban exists.',
    whatBroughtAboutIt: 'A panic-inducing thread on Twitter (X) took changes restricting dependents for certain social care workers and exaggerated them into an outright ban on African healthcare personnel. The thread went viral across diaspora migration discussion groups.',
    rumorClaimsList: [
      'Claimed complete ban on NHS and care home Certificates of Sponsorship (CoS) for Africans.',
      'Claimed pending visa applications at TLScontact and VFS centres were automatically cancelled.',
      'Claimed immediate deportation order for existing carers.'
    ],
    aiMediaAnalysis: {
      status: 'completed',
      details: 'Analysis of viral X / Twitter thread showed distortion of routine policy updates on dependent visas, not a complete ban.',
      isOutdatedMedia: false,
      confidenceScore: 96,
      detectedOrigins: 'X/Twitter Viral Visa Thread'
    },
    liveForensicData: {
      opticalMotionScore: 91,
      jumpCutsDetected: 2,
      compressionArtifactScore: 45,
      deepfakeProbability: 3,
      audioVisualSyncStatus: 'synced',
      frameRateFps: 25,
      bitrateKbps: 2200,
      detectedAnomalies: ['Unverified Graphic Card Template', 'Misleading Headline Banner']
    },
    confidence: 'High',
    videoDurationSec: 20,
    videoThumbnail: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80',
    audioNarrationText: 'SABI Worldwide Check: Claims that the UK has banned health worker visa sponsorship for African citizens are FALSE. The visa route remains open under standard Home Office rules.',
    viewsCount: 45000,
    sharesCount: 9200,
    sources: ['UK Home Office Guidance Portal', 'British High Commission Media Desk', 'Diaspora Fact Alliance'],
    factCheckUrl: 'https://fullfact.org/immigration/uk-health-care-visa-africa-claims',
    sourceOrg: 'Full Fact UK & BBC News',
    debunkVideoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    debunkVideoTitle: 'BBC Global News: Fact-Checking Claims on UK Health Worker Visa Bans',
    debunkSourceOrg: 'BBC News Verify',
    debunkPlatform: 'youtube',
    debunkVideoThumbnail: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'truth_007',
    reportId: 'rep_ghana_cedi_global',
    claim: 'Bank of Ghana Halts All Physical Dollar Transactions in Commercial Banks',
    originalClaimQuote: 'Viral TikTok memo alleging Ghana Central Bank ordered an instant freeze on foreign currency withdrawals across Accra.',
    availableEvidenceQuote: 'Bank of Ghana press release and commercial banking checks in Accra confirmed foreign exchange transactions and withdrawals continue as regulated.',
    result: 'FALSE',
    state: 'Greater Accra',
    lga: 'Accra Central',
    area: 'Makola Market Financial Corridor',
    country: 'Ghana',
    isWorldwide: true,
    platform: 'tiktok',
    socialMediaHandle: '@AccraVibesNews',
    socialMediaPostUrl: 'https://tiktok.com/@AccraVibesNews/video/73829104812',
    youtubeVideoId: 'kXYiU_JCYtU',
    videoUrl: 'https://images.unsplash.com/photo-1579621970588-a35d0e7bb9b6?w=800&auto=format&fit=crop&q=80',
    playableVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    verifiedAt: '12 hours ago',
    contributorCount: 4,
    rumorSummary: 'TikTok memo claiming the Bank of Ghana has banned all over-the-counter and ATM USD cash withdrawals for personal and commercial accounts across Accra.',
    whatHappened: 'Commercial banks and licensed forex bureaus across Accra, Kumasi, and Takoradi are executing standard foreign currency deposits, transfers, and cash disbursements under established foreign exchange directives.',
    whatBroughtAboutIt: 'A speculative TikTok page paired old 2022 macroeconomic press conference clips with an AI-generated synthetic voice claiming that all foreign exchange accounts had been forcibly converted to Cedis.',
    rumorClaimsList: [
      'Claimed all foreign exchange accounts (FCA) are forcibly converted to Ghanaian Cedis at fixed rate.',
      'Claimed forex bureaus at Makola and Airport Residential are prohibited from selling foreign currency.',
      'Claimed commercial banks are barred from handling offshore wire transfers.'
    ],
    aiMediaAnalysis: {
      status: 'completed',
      details: 'TikTok voiceover matched with automated synthetic voice generator overlaid on 2022 macroeconomic press conference.',
      isOutdatedMedia: true,
      confidenceScore: 98,
      detectedOrigins: 'TikTok AI Voiceover Over 2022 Archive'
    },
    liveForensicData: {
      opticalMotionScore: 89,
      jumpCutsDetected: 3,
      compressionArtifactScore: 70,
      deepfakeProbability: 86,
      audioVisualSyncStatus: 'desynced',
      frameRateFps: 29.97,
      bitrateKbps: 2100,
      detectedAnomalies: ['Synthetic AI Voiceover Detected', 'Recycled 2022 Central Bank Video Track', 'Desynchronized Lip Movements']
    },
    confidence: 'High',
    videoDurationSec: 20,
    videoThumbnail: 'https://images.unsplash.com/photo-1579621970588-a35d0e7bb9b6?w=800&auto=format&fit=crop&q=80',
    audioNarrationText: 'SABI Africa Radar: Viral TikTok claims claiming the Bank of Ghana banned foreign currency withdrawals are FALSE and based on recycled 2022 media.',
    viewsCount: 28400,
    sharesCount: 5100,
    sources: ['Bank of Ghana Regulatory Desk', 'Ghana Association of Bankers'],
    factCheckUrl: 'https://fact-checkghana.com/bog-dollar-freeze-claim-false',
    sourceOrg: 'Fact-Check Ghana',
    debunkVideoUrl: 'https://www.youtube.com/watch?v=kXYiU_JCYtU',
    debunkVideoTitle: 'JoyNews & Fact-Check Ghana: Debunking Bank of Ghana Dollar Ban Rumors',
    debunkSourceOrg: 'JoyNews Fact Check',
    debunkPlatform: 'youtube',
    debunkVideoThumbnail: 'https://images.unsplash.com/photo-1579621970588-a35d0e7bb9b6?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'truth_008',
    reportId: 'rep_deepfake_celeb_global',
    claim: 'AI Video of Tech Billionaire Giving Out $5,000 Crypto Grants to Everyone',
    originalClaimQuote: 'Deepfake video clip of tech founder speaking on live television promising instant cryptocurrency payouts to anyone who connects their wallet.',
    availableEvidenceQuote: 'Spectral audio forensics and lip-sync lattice analysis confirmed 99.4% artificial generation using a deepfake clone model.',
    result: 'FALSE',
    state: 'California',
    lga: 'San Francisco',
    area: 'Worldwide Tech Stream',
    country: 'United States',
    isWorldwide: true,
    platform: 'youtube',
    socialMediaHandle: 'Crypto Stream 24/7 Global',
    socialMediaPostUrl: 'https://youtube.com/watch?v=deepfake_crypto_scam',
    youtubeVideoId: '2Vv-BfVoq4g',
    videoUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80',
    playableVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    verifiedAt: '1 day ago',
    contributorCount: 12,
    rumorSummary: 'Hijacked YouTube live stream featuring a deepfake synthetic clone of a tech CEO promising a 2x crypto token return for sending Ethereum or Bitcoin to a scam address.',
    whatHappened: 'A malicious cyber actor compromised a verified YouTube channel and broadcast an AI deepfake avatar loop with a fake donation wallet address to steal cryptocurrency.',
    whatBroughtAboutIt: 'The scammers created a real-time voice-cloned model trained on recent interview footage and spoofed official keynote graphics to deceive viewers into sending funds.',
    rumorClaimsList: [
      'Claimed $5,000 instant crypto giveaway to celebrate product launch.',
      'Claimed viewers must send crypto to a smart contract address to receive double back.',
      'Claimed live stream was broadcast from an official keynote conference.'
    ],
    aiMediaAnalysis: {
      status: 'manipulation_check_passed',
      details: 'Deepfake visual artifact detector flagged unnatural boundary blending around jawline and synthetic voice pitch modulation.',
      isOutdatedMedia: false,
      confidenceScore: 99,
      detectedOrigins: 'Rogue YouTube Hijacked Channel Stream'
    },
    liveForensicData: {
      opticalMotionScore: 76,
      jumpCutsDetected: 6,
      compressionArtifactScore: 84,
      deepfakeProbability: 99.4,
      audioVisualSyncStatus: 'manipulated',
      frameRateFps: 29.97,
      bitrateKbps: 3200,
      detectedAnomalies: ['Deepfake Facial Boundary Blending', 'Synthetic Voice Pitch Modulation', 'Compromised Channel Stream Re-broadcast']
    },
    confidence: 'High',
    videoDurationSec: 20,
    videoThumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80',
    audioNarrationText: 'SABI Deepfake Sentinel: The viral video of a tech CEO promising crypto giveaways is a 99% DEEPFAKE SCAM. Do not connect your crypto wallet.',
    viewsCount: 78000,
    sharesCount: 16400,
    sources: ['SABI Deepfake AI Forensics', 'Global AI Safety Network', 'YouTube Security Team'],
    factCheckUrl: 'https://www.snopes.com/fact-check/elon-musk-crypto-giveaway-deepfake',
    sourceOrg: 'Snopes & Reuters Fact Check',
    debunkVideoUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
    debunkVideoTitle: 'Snopes & Reuters Forensic Breakdown: How AI Deepfake Crypto Scams Operate',
    debunkSourceOrg: 'Reuters Video Forensics',
    debunkPlatform: 'youtube',
    debunkVideoThumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'truth_009',
    reportId: 'rep_us_fed_crypto_worldwide',
    claim: 'US Federal Reserve Mandating Instant Conversion of Checking Accounts to Digital Dollar',
    originalClaimQuote: 'Viral YouTube Shorts video claiming Federal Reserve executive order requires all banks to forcibly liquidate cash into digital currency tokens by month end.',
    availableEvidenceQuote: 'Reuters Fact Check and official Federal Reserve Board notices confirmed no digital dollar mandate exists. The Federal Reserve continues to issue and back traditional physical currency.',
    result: 'FALSE',
    state: 'Washington DC',
    lga: 'Financial District',
    area: 'Global Economic Desk',
    country: 'United States',
    isWorldwide: true,
    platform: 'youtube',
    socialMediaHandle: '@GlobalEconWatch',
    socialMediaPostUrl: 'https://youtube.com/shorts/fed_reserve_digital_currency',
    youtubeVideoId: 'dQw4w9WgXcQ',
    videoUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&auto=format&fit=crop&q=80',
    verifiedAt: '3 hours ago',
    contributorCount: 18,
    rumorSummary: 'Viral YouTube shorts alleging the US Federal Reserve signed a covert executive order forcing all commercial banks to convert fiat cash deposits into digital tokens.',
    rumorClaimsList: [
      'Claimed physical banknotes and cheques will be invalid by end of month.',
      'Claimed central bank CBDC wallet mandatory for ATM transactions.',
      'Claimed personal bank balances over $10,000 face immediate conversion tax.'
    ],
    aiMediaAnalysis: {
      status: 'completed',
      details: 'Video frame OCR matched text overlay with known AI financial conspiracy template. Official Federal Reserve press releases contradict all claims.',
      isOutdatedMedia: false,
      confidenceScore: 99,
      detectedOrigins: 'YouTube Viral Conspiracy Stream'
    },
    confidence: 'High',
    videoDurationSec: 20,
    videoThumbnail: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&auto=format&fit=crop&q=80',
    audioNarrationText: 'SABI Worldwide Verification: Claims that the US Federal Reserve is forcibly converting bank checking accounts to digital currency tokens are FALSE. Reuters confirmed traditional currency standards remain unchanged.',
    viewsCount: 62000,
    sharesCount: 14200,
    sources: ['Reuters Fact Check', 'Federal Reserve Press Office', 'AP Fact Check'],
    factCheckUrl: 'https://www.reuters.com/fact-check/us-federal-reserve-digital-currency-claims-false',
    sourceOrg: 'Reuters Fact Check & AP News',
    debunkVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    debunkVideoTitle: 'AP & Reuters Video Analysis: Federal Reserve Digital Dollar Myths Debunked',
    debunkSourceOrg: 'AP News Fact Check Video',
    debunkPlatform: 'youtube',
    debunkVideoThumbnail: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'truth_010',
    reportId: 'rep_who_travel_worldwide',
    claim: 'WHO Declares Global Airport Lockdown and Travel Curbs for New Variant',
    originalClaimQuote: 'Circulating Facebook broadcast claiming the World Health Organization instituted emergency cross-border flight bans across all continents.',
    availableEvidenceQuote: 'AFP Fact Check and official WHO International Health Regulations bulletins verified that zero airport closures or emergency travel bans have been ordered.',
    result: 'FALSE',
    state: 'Geneva',
    lga: 'International Quarter',
    area: 'Worldwide Health Desk',
    country: 'Global',
    isWorldwide: true,
    platform: 'facebook',
    socialMediaHandle: 'Global Travelers Community FB',
    socialMediaPostUrl: 'https://facebook.com/groups/globaltravelers/posts/7781920491',
    youtubeVideoId: 'L_LUpnjgPso',
    videoUrl: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&auto=format&fit=crop&q=80',
    verifiedAt: '1 day ago',
    contributorCount: 15,
    rumorSummary: 'Circulating Facebook and WhatsApp audio message alleging the World Health Organization ordered immediate airport border closures across Europe, Africa, and North America.',
    rumorClaimsList: [
      'Claimed international passenger flights grounded starting midnight.',
      'Claimed mandatory 14-day institutional quarantine reinstated at all entry ports.',
      'Claimed emergency pandemic protocols activated worldwide.'
    ],
    aiMediaAnalysis: {
      status: 'completed',
      details: 'Recycled 2020 pandemic news footage with altered lower-third graphics and misleading sensational caption overlay.',
      isOutdatedMedia: true,
      confidenceScore: 97,
      detectedOrigins: 'Facebook Recycled 2020 Broadcast Video'
    },
    confidence: 'High',
    videoDurationSec: 20,
    videoThumbnail: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&auto=format&fit=crop&q=80',
    audioNarrationText: 'SABI Global Health Sentinel: Facebook posts claiming WHO declared airport lockdowns are FALSE. The footage is recycled from 2020 and debunked by AFP Fact Check.',
    viewsCount: 54000,
    sharesCount: 11200,
    sources: ['AFP Fact Check', 'World Health Organization Media Centre', 'IFCN Database'],
    factCheckUrl: 'https://factcheck.afp.com/doc.afp.com.34KV8NM',
    sourceOrg: 'AFP Fact Check Worldwide',
    debunkVideoUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    debunkVideoTitle: 'AFP Fact Check Video: Debunking Recycled WHO Airport Lockdown Rumors',
    debunkSourceOrg: 'AFP Fact Check International',
    debunkPlatform: 'youtube',
    debunkVideoThumbnail: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_MARKET_ITEMS: MarketItem[] = [
  {
    id: 'mkt_tomato',
    name: 'Fresh Tomatoes & Tatashe',
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    baseConfidence: 84,
    totalReportsCount: 42,
    seasonalityNote: 'Peak harvest influx from Kano & Plateau; prices stabilizing downward.',
    relatedRecipes: ['Yam and Egg Sauce', 'Party Jollof Rice', 'Efo Riro'],
    retailPortions: [
      { name: 'Sachet Tomato Paste (70g)', unit: '1 Sachet (Gino/De Rica)', price: 220, description: 'Everyday quick single cooking sachet', popularBrand: 'Gino / Sonia' },
      { name: 'Roll of Tomato Sachets (5 pcs)', unit: '5-pack strip', price: 1050, description: 'Affordable household meal prep strip', popularBrand: 'De Rica' },
      { name: 'Small Market Heap (4-5 big fresh tomatoes)', unit: '1 Small Heap', price: 500, description: 'Fresh raw plum tomatoes sorted on tray' },
      { name: 'Medium Bowl / Paint Bucket (4L)', unit: '4L Paint Rubber', price: 3200, description: 'Standard family weekly soup basket' }
    ],
    primaryLocation: {
      state: 'Lagos',
      area: 'Mile 12 International Food Market',
      largeUnitName: 'Large Rafia Basket',
      largeUnitPrice: 55000,
      smallUnitName: 'Small Plastic Paint Bucket (4L)',
      smallUnitPrice: 3200,
      retailPortions: [
        { name: 'Sachet Tomato (70g)', unit: '1 Sachet', price: 220, description: 'Wholesale shop retail price' },
        { name: 'Small Market Heap (Fresh)', unit: '1 Heap (5 pcs)', price: 500, description: 'Retail stall display' }
      ],
      lastUpdated: '1 hour ago',
      reportsCount: 18,
      priceTrend: 'down',
      trendPercent: 12
    },
    otherLocations: [
      {
        state: 'FCT - Abuja',
        area: 'Dei-Dei / Utako Market',
        largeUnitName: 'Large Rafia Basket',
        largeUnitPrice: 48000,
        smallUnitName: 'Small Container (4L)',
        smallUnitPrice: 2800,
        retailPortions: [
          { name: 'Sachet Tomato Paste', unit: '1 Sachet', price: 200, description: 'Dei-Dei provisions stall' }
        ],
        lastUpdated: '3 hours ago',
        reportsCount: 9,
        priceTrend: 'down',
        trendPercent: 15
      },
      {
        state: 'Oyo',
        area: 'Bodija Market (Ibadan)',
        largeUnitName: 'Large Rafia Basket',
        largeUnitPrice: 28000,
        smallUnitName: 'Small Container',
        smallUnitPrice: 2000,
        retailPortions: [
          { name: 'Sachet Tomato Paste', unit: '1 Sachet', price: 180, description: 'Bodija local market rate' }
        ],
        lastUpdated: '2 hours ago',
        reportsCount: 11,
        priceTrend: 'down',
        trendPercent: 22
      },
      {
        state: 'Anambra',
        area: 'Ose Okwodu / Onitsha Market',
        largeUnitName: 'Large Basket',
        largeUnitPrice: 58000,
        smallUnitName: 'Paint Bucket',
        smallUnitPrice: 3500,
        lastUpdated: '5 hours ago',
        reportsCount: 7,
        priceTrend: 'stable',
        trendPercent: 0
      },
      {
        state: 'Rivers',
        area: 'Mile 3 Food Market (Port Harcourt)',
        largeUnitName: 'Large Basket',
        largeUnitPrice: 62000,
        smallUnitName: 'Paint Bucket',
        smallUnitPrice: 3800,
        lastUpdated: 'Today',
        reportsCount: 6,
        priceTrend: 'up',
        trendPercent: 4
      },
      {
        state: 'Kano',
        area: 'Yankaba Food Market',
        largeUnitName: 'Farm Basket',
        largeUnitPrice: 22000,
        smallUnitName: 'Small Bucket',
        smallUnitPrice: 1500,
        lastUpdated: '4 hours ago',
        reportsCount: 14,
        priceTrend: 'down',
        trendPercent: 18
      }
    ],
    history: {
      '7Days': [
        { date: 'Mon', price: 62000, reportsCount: 5, locationName: 'Mile 12' },
        { date: 'Tue', price: 60000, reportsCount: 7, locationName: 'Mile 12' },
        { date: 'Wed', price: 58000, reportsCount: 6, locationName: 'Mile 12' },
        { date: 'Thu', price: 56000, reportsCount: 8, locationName: 'Mile 12' },
        { date: 'Fri', price: 55000, reportsCount: 10, locationName: 'Mile 12' },
        { date: 'Sat', price: 55000, reportsCount: 12, locationName: 'Mile 12' },
        { date: 'Today', price: 55000, reportsCount: 18, locationName: 'Mile 12' }
      ],
      '30Days': [
        { date: 'Week 1', price: 85000, reportsCount: 22, locationName: 'Mile 12' },
        { date: 'Week 2', price: 74000, reportsCount: 29, locationName: 'Mile 12' },
        { date: 'Week 3', price: 65000, reportsCount: 34, locationName: 'Mile 12' },
        { date: 'Week 4', price: 55000, reportsCount: 42, locationName: 'Mile 12' }
      ],
      '6Months': [
        { date: 'Mar', price: 35000, reportsCount: 60, locationName: 'Mile 12' },
        { date: 'Apr', price: 52000, reportsCount: 85, locationName: 'Mile 12' },
        { date: 'May', price: 95000, reportsCount: 110, locationName: 'Mile 12' },
        { date: 'Jun', price: 115000, reportsCount: 140, locationName: 'Mile 12' },
        { date: 'Jul', price: 78000, reportsCount: 95, locationName: 'Mile 12' },
        { date: 'Aug', price: 55000, reportsCount: 80, locationName: 'Mile 12' }
      ]
    }
  },
  {
    id: 'mkt_rice',
    name: 'Parboiled Rice (Foreign & Local)',
    category: 'Grains',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    baseConfidence: 92,
    totalReportsCount: 78,
    seasonalityNote: 'Stable international shipping & local mill output in Ebonyi & Kebbi.',
    relatedRecipes: ['Party Jollof Rice', 'Fried Rice', 'Coconut Rice'],
    retailPortions: [
      { name: '1 Small Milk Tin Cup of Rice', unit: '1 Milk Tin Cup (~170g)', price: 480, description: 'Single student/bachelor portion cup' },
      { name: '1 Derica Cup of Rice', unit: '1 Derica (~850g / 5 cups)', price: 1750, description: 'Most popular Nigerian market standard measurement', popularBrand: 'Royal Stallion / Mama Gold' },
      { name: '1 Mudu Measure of Rice', unit: '1 Mudu (~1.2kg)', price: 2400, description: 'Northern & Middle Belt standard bowl' },
      { name: '4L Paint Bucket of Rice', unit: '1 Paint Rubber (~3.5kg)', price: 7200, description: 'Weekly family staple' }
    ],
    primaryLocation: {
      state: 'Lagos',
      area: 'Idumota / Daleko Market',
      largeUnitName: '50kg Bag (Foreign)',
      largeUnitPrice: 102000,
      smallUnitName: 'Derica Cup (approx. 0.85kg)',
      smallUnitPrice: 1750,
      retailPortions: [
        { name: 'Milk Tin Cup', unit: '1 Cup', price: 480, description: 'Everyday small measure' },
        { name: 'Derica Cup', unit: '1 Derica', price: 1750, description: 'Standard measure' }
      ],
      lastUpdated: '45 mins ago',
      reportsCount: 31,
      priceTrend: 'stable',
      trendPercent: 1
    },
    otherLocations: [
      {
        state: 'FCT - Abuja',
        area: 'Dei-Dei Grain Market',
        largeUnitName: '50kg Bag (Foreign)',
        largeUnitPrice: 104000,
        smallUnitName: 'Mudu Measure',
        smallUnitPrice: 2400,
        retailPortions: [
          { name: '1 Milk Tin Cup', unit: '1 Cup', price: 500, description: 'Dei-Dei small retail' },
          { name: '1 Mudu Measure', unit: '1 Mudu', price: 2400, description: 'Abuja standard' }
        ],
        lastUpdated: '1 hour ago',
        reportsCount: 16,
        priceTrend: 'stable',
        trendPercent: 0
      },
      {
        state: 'Kano',
        area: 'Dawanau Grains Market',
        largeUnitName: '50kg Bag (Local Polished)',
        largeUnitPrice: 88000,
        smallUnitName: 'Mudu Measure',
        smallUnitPrice: 1950,
        retailPortions: [
          { name: '1 Mudu Measure', unit: '1 Mudu', price: 1950, description: 'Dawanau local white rice' }
        ],
        lastUpdated: '2 hours ago',
        reportsCount: 22,
        priceTrend: 'down',
        trendPercent: 3
      },
      {
        state: 'Ebonyi',
        area: 'Abakaliki Rice Mill Market',
        largeUnitName: '50kg Bag (Abakaliki Standard)',
        largeUnitPrice: 84000,
        smallUnitName: 'Custard Bucket (4L)',
        smallUnitPrice: 7200,
        lastUpdated: 'Yesterday',
        reportsCount: 14,
        priceTrend: 'down',
        trendPercent: 5
      }
    ],
    history: {
      '7Days': [
        { date: 'Mon', price: 103000, reportsCount: 12, locationName: 'Daleko' },
        { date: 'Tue', price: 103000, reportsCount: 14, locationName: 'Daleko' },
        { date: 'Wed', price: 102500, reportsCount: 15, locationName: 'Daleko' },
        { date: 'Thu', price: 102000, reportsCount: 18, locationName: 'Daleko' },
        { date: 'Fri', price: 102000, reportsCount: 24, locationName: 'Daleko' },
        { date: 'Sat', price: 102000, reportsCount: 28, locationName: 'Daleko' },
        { date: 'Today', price: 102000, reportsCount: 31, locationName: 'Daleko' }
      ],
      '30Days': [
        { date: 'Week 1', price: 106000, reportsCount: 45, locationName: 'Daleko' },
        { date: 'Week 2', price: 104500, reportsCount: 50, locationName: 'Daleko' },
        { date: 'Week 3', price: 103000, reportsCount: 62, locationName: 'Daleko' },
        { date: 'Week 4', price: 102000, reportsCount: 78, locationName: 'Daleko' }
      ],
      '6Months': [
        { date: 'Mar', price: 72000, reportsCount: 90, locationName: 'Daleko' },
        { date: 'Apr', price: 84000, reportsCount: 110, locationName: 'Daleko' },
        { date: 'May', price: 92000, reportsCount: 130, locationName: 'Daleko' },
        { date: 'Jun', price: 99000, reportsCount: 145, locationName: 'Daleko' },
        { date: 'Jul', price: 105000, reportsCount: 160, locationName: 'Daleko' },
        { date: 'Aug', price: 102000, reportsCount: 175, locationName: 'Daleko' }
      ]
    }
  },
  {
    id: 'mkt_garri',
    name: 'White & Yellow Garri (Ijebu & Delta)',
    category: 'Tubers',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
    baseConfidence: 89,
    totalReportsCount: 54,
    seasonalityNote: 'New cassava harvests in Ogun, Edo and Benue easing pricing pressures.',
    relatedRecipes: ['Eba with Vegetable Soup', 'Afang Soup with Garri'],
    retailPortions: [
      { name: '1 Milk Tin Cup of Garri', unit: '1 Cup (~150g)', price: 150, description: 'Single drinking garri cup' },
      { name: '1 Derica Cup of Garri', unit: '1 Derica (~800g)', price: 650, description: 'Family eba dinner measure' },
      { name: '4L Paint Bucket of Garri', unit: '1 Paint Rubber (~3kg)', price: 3400, description: 'Crispy sour Ijebu or yellow Delta garri' }
    ],
    primaryLocation: {
      state: 'Lagos',
      area: 'Oyingbo Modern Market',
      largeUnitName: '50kg Bag (Ijebu Garri)',
      largeUnitPrice: 42000,
      smallUnitName: 'Paint Bucket (4L)',
      smallUnitPrice: 3400,
      retailPortions: [
        { name: '1 Milk Cup', unit: '1 Cup', price: 150, description: 'Everyday small retail' },
        { name: '1 Derica', unit: '1 Derica', price: 650, description: 'Market cup' }
      ],
      lastUpdated: '2 hours ago',
      reportsCount: 22,
      priceTrend: 'down',
      trendPercent: 8
    },
    otherLocations: [
      {
        state: 'Ogun',
        area: 'Itoku / Sagamu Market',
        largeUnitName: '50kg Bag (Ijebu Garri)',
        largeUnitPrice: 36000,
        smallUnitName: 'Paint Bucket (4L)',
        smallUnitPrice: 2800,
        lastUpdated: '4 hours ago',
        reportsCount: 15,
        priceTrend: 'down',
        trendPercent: 10
      },
      {
        state: 'Edo',
        area: 'New Benin Market (Yellow Delta)',
        largeUnitName: '50kg Bag (Yellow)',
        largeUnitPrice: 38000,
        smallUnitName: 'Custard Bucket',
        smallUnitPrice: 3000,
        lastUpdated: 'Today',
        reportsCount: 11,
        priceTrend: 'stable',
        trendPercent: 0
      }
    ],
    history: {
      '7Days': [
        { date: 'Mon', price: 45000, reportsCount: 8, locationName: 'Oyingbo' },
        { date: 'Tue', price: 44000, reportsCount: 10, locationName: 'Oyingbo' },
        { date: 'Wed', price: 43500, reportsCount: 14, locationName: 'Oyingbo' },
        { date: 'Thu', price: 43000, reportsCount: 17, locationName: 'Oyingbo' },
        { date: 'Fri', price: 42000, reportsCount: 19, locationName: 'Oyingbo' },
        { date: 'Sat', price: 42000, reportsCount: 20, locationName: 'Oyingbo' },
        { date: 'Today', price: 42000, reportsCount: 22, locationName: 'Oyingbo' }
      ],
      '30Days': [
        { date: 'Week 1', price: 52000, reportsCount: 30, locationName: 'Oyingbo' },
        { date: 'Week 2', price: 48000, reportsCount: 35, locationName: 'Oyingbo' },
        { date: 'Week 3', price: 45000, reportsCount: 44, locationName: 'Oyingbo' },
        { date: 'Week 4', price: 42000, reportsCount: 54, locationName: 'Oyingbo' }
      ],
      '6Months': [
        { date: 'Mar', price: 28000, reportsCount: 40, locationName: 'Oyingbo' },
        { date: 'Apr', price: 34000, reportsCount: 55, locationName: 'Oyingbo' },
        { date: 'May', price: 48000, reportsCount: 75, locationName: 'Oyingbo' },
        { date: 'Jun', price: 56000, reportsCount: 90, locationName: 'Oyingbo' },
        { date: 'Jul', price: 50000, reportsCount: 80, locationName: 'Oyingbo' },
        { date: 'Aug', price: 42000, reportsCount: 70, locationName: 'Oyingbo' }
      ]
    }
  },
  {
    id: 'mkt_beans',
    name: 'Brown & Honey Beans (Oloyin / Drum)',
    category: 'Grains',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    baseConfidence: 88,
    totalReportsCount: 49,
    seasonalityNote: 'New harvest bean wagons reaching southern depots from Borno and Sokoto.',
    relatedRecipes: ['Ewa Aganyin', 'Moi Moi Special', 'Akara'],
    retailPortions: [
      { name: '1 Milk Tin Cup of Beans', unit: '1 Cup (~160g)', price: 500, description: 'Single meal portion' },
      { name: '1 Derica Cup of Honey Beans (Oloyin)', unit: '1 Derica (~850g)', price: 1800, description: 'Sweet Nigerian Oloyin beans measure' },
      { name: '1 Mudu Measure of Beans', unit: '1 Mudu (~1.2kg)', price: 2600, description: 'Northern / Abuja standard measure' },
      { name: '4L Paint Bucket of Beans', unit: '1 Paint Rubber (~3.5kg)', price: 7600, description: 'Full week household supply' }
    ],
    primaryLocation: {
      state: 'Lagos',
      area: 'Idumota / Mile 12 Beans Depot',
      largeUnitName: '100kg Bag (Oloyin)',
      largeUnitPrice: 135000,
      smallUnitName: 'Derica Cup (approx. 0.85kg)',
      smallUnitPrice: 1800,
      retailPortions: [
        { name: '1 Milk Tin Cup', unit: '1 Cup', price: 500, description: 'Everyday stall measure' },
        { name: '1 Derica Cup', unit: '1 Derica', price: 1800, description: 'Sweet Oloyin standard' }
      ],
      lastUpdated: '2 hours ago',
      reportsCount: 20,
      priceTrend: 'down',
      trendPercent: 6
    },
    otherLocations: [
      {
        state: 'FCT - Abuja',
        area: 'Utako Market',
        largeUnitName: '100kg Bag',
        largeUnitPrice: 125000,
        smallUnitName: 'Mudu Measure',
        smallUnitPrice: 2400,
        lastUpdated: '3 hours ago',
        reportsCount: 14,
        priceTrend: 'down',
        trendPercent: 7
      }
    ],
    history: {
      '7Days': [
        { date: 'Mon', price: 142000, reportsCount: 6, locationName: 'Idumota' },
        { date: 'Tue', price: 140000, reportsCount: 8, locationName: 'Idumota' },
        { date: 'Wed', price: 138000, reportsCount: 10, locationName: 'Idumota' },
        { date: 'Thu', price: 136000, reportsCount: 13, locationName: 'Idumota' },
        { date: 'Fri', price: 135000, reportsCount: 17, locationName: 'Idumota' },
        { date: 'Sat', price: 135000, reportsCount: 19, locationName: 'Idumota' },
        { date: 'Today', price: 135000, reportsCount: 20, locationName: 'Idumota' }
      ],
      '30Days': [
        { date: 'Week 1', price: 155000, reportsCount: 30, locationName: 'Idumota' },
        { date: 'Week 2', price: 148000, reportsCount: 35, locationName: 'Idumota' },
        { date: 'Week 3', price: 140000, reportsCount: 42, locationName: 'Idumota' },
        { date: 'Week 4', price: 135000, reportsCount: 49, locationName: 'Idumota' }
      ],
      '6Months': [
        { date: 'Mar', price: 75000, reportsCount: 35, locationName: 'Idumota' },
        { date: 'Apr', price: 92000, reportsCount: 45, locationName: 'Idumota' },
        { date: 'May', price: 118000, reportsCount: 60, locationName: 'Idumota' },
        { date: 'Jun', price: 145000, reportsCount: 80, locationName: 'Idumota' },
        { date: 'Jul', price: 140000, reportsCount: 75, locationName: 'Idumota' },
        { date: 'Aug', price: 135000, reportsCount: 65, locationName: 'Idumota' }
      ]
    }
  },
  {
    id: 'mkt_onions',
    name: 'Red & White Onions (Kano & Sokoto)',
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    baseConfidence: 87,
    totalReportsCount: 35,
    seasonalityNote: 'Heavy harvest supplies arriving at southern transit points.',
    relatedRecipes: ['Party Jollof Rice', 'Yam and Egg Sauce', 'Fried Rice'],
    retailPortions: [
      { name: '1 Single Large Onion Bulb', unit: '1 Large Bulb', price: 200, description: 'Single cooking bulb' },
      { name: 'Small Market Heap (4 Medium Bulbs)', unit: '1 Heap', price: 600, description: 'Classic wooden table market heap' },
      { name: 'Medium Basket / Paint Rubber (4L)', unit: '4L Rubber', price: 4200, description: 'Monthly household store portion' }
    ],
    primaryLocation: {
      state: 'Lagos',
      area: 'Mile 12 Onion Market',
      largeUnitName: '100kg Jute Bag',
      largeUnitPrice: 82000,
      smallUnitName: 'Small Paint Bucket',
      smallUnitPrice: 4200,
      retailPortions: [
        { name: '1 Large Bulb', unit: '1 Bulb', price: 200, description: 'Single retail' },
        { name: 'Small 4-piece Heap', unit: '1 Heap', price: 600, description: 'Retail stall' }
      ],
      lastUpdated: '1 hour ago',
      reportsCount: 15,
      priceTrend: 'down',
      trendPercent: 10
    },
    otherLocations: [
      {
        state: 'Kano',
        area: 'Dawanau Wholesale',
        largeUnitName: '100kg Jute Bag',
        largeUnitPrice: 52000,
        smallUnitName: 'Paint Bucket',
        smallUnitPrice: 2400,
        lastUpdated: '3 hours ago',
        reportsCount: 12,
        priceTrend: 'down',
        trendPercent: 15
      }
    ],
    history: {
      '7Days': [
        { date: 'Mon', price: 92000, reportsCount: 5, locationName: 'Mile 12' },
        { date: 'Tue', price: 90000, reportsCount: 7, locationName: 'Mile 12' },
        { date: 'Wed', price: 88000, reportsCount: 8, locationName: 'Mile 12' },
        { date: 'Thu', price: 85000, reportsCount: 10, locationName: 'Mile 12' },
        { date: 'Fri', price: 83000, reportsCount: 12, locationName: 'Mile 12' },
        { date: 'Sat', price: 82000, reportsCount: 14, locationName: 'Mile 12' },
        { date: 'Today', price: 82000, reportsCount: 15, locationName: 'Mile 12' }
      ],
      '30Days': [
        { date: 'Week 1', price: 105000, reportsCount: 20, locationName: 'Mile 12' },
        { date: 'Week 2', price: 98000, reportsCount: 25, locationName: 'Mile 12' },
        { date: 'Week 3', price: 90000, reportsCount: 29, locationName: 'Mile 12' },
        { date: 'Week 4', price: 82000, reportsCount: 35, locationName: 'Mile 12' }
      ],
      '6Months': [
        { date: 'Mar', price: 42000, reportsCount: 30, locationName: 'Mile 12' },
        { date: 'Apr', price: 55000, reportsCount: 40, locationName: 'Mile 12' },
        { date: 'May', price: 78000, reportsCount: 55, locationName: 'Mile 12' },
        { date: 'Jun', price: 95000, reportsCount: 65, locationName: 'Mile 12' },
        { date: 'Jul', price: 88000, reportsCount: 50, locationName: 'Mile 12' },
        { date: 'Aug', price: 82000, reportsCount: 45, locationName: 'Mile 12' }
      ]
    }
  },
  {
    id: 'mkt_yam',
    name: 'Tubers of Yam (Benue / Abuja)',
    category: 'Tubers',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
    baseConfidence: 86,
    totalReportsCount: 38,
    seasonalityNote: 'New Yam festival season ongoing; large supply arrival in southern hubs.',
    relatedRecipes: ['Yam and Egg Sauce', 'Pounded Yam with Egusi', 'Yam Porridge (Asaro)'],
    retailPortions: [
      { name: '1 Medium Single Tuber of Yam', unit: '1 Tuber (~2.5kg)', price: 2400, description: 'Ideal for 3 family meals or yam and egg' },
      { name: '1 Big Premium Tuber of Yam', unit: '1 Large Tuber (~4.5kg)', price: 3800, description: 'Large sweet white Benue yam tuber' },
      { name: 'Set of 3 Selected Medium Tubers', unit: '3 Tubers', price: 6800, description: 'Economical family bundle' }
    ],
    primaryLocation: {
      state: 'Lagos',
      area: 'Mile 12 / Ketu Yam Market',
      largeUnitName: 'Set of 5 Large Tubers',
      largeUnitPrice: 24000,
      smallUnitName: '1 Medium Tuber',
      smallUnitPrice: 4500,
      retailPortions: [
        { name: '1 Medium Tuber', unit: '1 Tuber', price: 2400, description: 'Direct market stall' },
        { name: '1 Large Tuber', unit: '1 Tuber', price: 3800, description: 'Selected Benue tuber' }
      ],
      lastUpdated: '3 hours ago',
      reportsCount: 16,
      priceTrend: 'down',
      trendPercent: 14
    },
    otherLocations: [
      {
        state: 'Benue',
        area: 'Wurukum Market (Makurdi)',
        largeUnitName: 'Set of 5 Large Tubers',
        largeUnitPrice: 14000,
        smallUnitName: '1 Medium Tuber',
        smallUnitPrice: 2500,
        lastUpdated: '1 hour ago',
        reportsCount: 12,
        priceTrend: 'down',
        trendPercent: 20
      },
      {
        state: 'FCT - Abuja',
        area: 'Garki 2 Market',
        largeUnitName: 'Set of 5 Large Tubers',
        largeUnitPrice: 21000,
        smallUnitName: '1 Medium Tuber',
        smallUnitPrice: 4000,
        lastUpdated: '2 hours ago',
        reportsCount: 10,
        priceTrend: 'down',
        trendPercent: 11
      }
    ],
    history: {
      '7Days': [
        { date: 'Mon', price: 28000, reportsCount: 6, locationName: 'Mile 12' },
        { date: 'Tue', price: 27000, reportsCount: 8, locationName: 'Mile 12' },
        { date: 'Wed', price: 26000, reportsCount: 9, locationName: 'Mile 12' },
        { date: 'Thu', price: 25000, reportsCount: 11, locationName: 'Mile 12' },
        { date: 'Fri', price: 24500, reportsCount: 13, locationName: 'Mile 12' },
        { date: 'Sat', price: 24000, reportsCount: 15, locationName: 'Mile 12' },
        { date: 'Today', price: 24000, reportsCount: 16, locationName: 'Mile 12' }
      ],
      '30Days': [
        { date: 'Week 1', price: 34000, reportsCount: 22, locationName: 'Mile 12' },
        { date: 'Week 2', price: 30000, reportsCount: 28, locationName: 'Mile 12' },
        { date: 'Week 3', price: 27000, reportsCount: 32, locationName: 'Mile 12' },
        { date: 'Week 4', price: 24000, reportsCount: 38, locationName: 'Mile 12' }
      ],
      '6Months': [
        { date: 'Mar', price: 20000, reportsCount: 30, locationName: 'Mile 12' },
        { date: 'Apr', price: 25000, reportsCount: 40, locationName: 'Mile 12' },
        { date: 'May', price: 38000, reportsCount: 50, locationName: 'Mile 12' },
        { date: 'Jun', price: 45000, reportsCount: 65, locationName: 'Mile 12' },
        { date: 'Jul', price: 35000, reportsCount: 55, locationName: 'Mile 12' },
        { date: 'Aug', price: 24000, reportsCount: 45, locationName: 'Mile 12' }
      ]
    }
  },
  {
    id: 'mkt_palmoil',
    name: 'Red Palm Oil (Unadulterated Pure Nsukka/Delta)',
    category: 'Oils & Spices',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
    baseConfidence: 91,
    totalReportsCount: 46,
    seasonalityNote: 'Steady processing in Edo, Imo, and Cross River mills.',
    relatedRecipes: ['Efo Riro', 'Banga Soup', 'Egusi Soup'],
    retailPortions: [
      { name: '1 Sachet Pure Palm Oil (100ml)', unit: '1 Sachet', price: 300, description: 'Single soup preparation sachet' },
      { name: '1 Small Bottle (750ml / Ragolis Bottle)', unit: '750ml Bottle', price: 1800, description: 'Everyday household cooking bottle' },
      { name: '1 Litre Sealed Bottle of Palm Oil', unit: '1L Bottle', price: 2100, description: 'Pure Grade A red oil' },
      { name: '5-Litre Jerrycan of Palm Oil', unit: '5L Jerrycan', price: 9800, description: 'Family cooking can' }
    ],
    primaryLocation: {
      state: 'Lagos',
      area: 'Mushin Foodstuff Market',
      largeUnitName: '25-Litre Jerrycan',
      largeUnitPrice: 46000,
      smallUnitName: '1-Litre Bottle',
      smallUnitPrice: 2100,
      retailPortions: [
        { name: '100ml Sachet', unit: '1 Sachet', price: 300, description: 'Single portion' },
        { name: '750ml Bottle', unit: '1 Bottle', price: 1800, description: 'Everyday bottle' }
      ],
      lastUpdated: '1 hour ago',
      reportsCount: 19,
      priceTrend: 'stable',
      trendPercent: 0
    },
    otherLocations: [
      {
        state: 'Imo',
        area: 'Relief Market (Owerri)',
        largeUnitName: '25-Litre Jerrycan',
        largeUnitPrice: 38000,
        smallUnitName: '1-Litre Bottle',
        smallUnitPrice: 1700,
        lastUpdated: '3 hours ago',
        reportsCount: 14,
        priceTrend: 'stable',
        trendPercent: 1
      },
      {
        state: 'Edo',
        area: 'Ikpoba Hill Market (Benin)',
        largeUnitName: '25-Litre Jerrycan',
        largeUnitPrice: 39000,
        smallUnitName: '1-Litre Bottle',
        smallUnitPrice: 1750,
        lastUpdated: '2 hours ago',
        reportsCount: 13,
        priceTrend: 'stable',
        trendPercent: 0
      }
    ],
    history: {
      '7Days': [
        { date: 'Mon', price: 46000, reportsCount: 10, locationName: 'Mushin' },
        { date: 'Tue', price: 46000, reportsCount: 11, locationName: 'Mushin' },
        { date: 'Wed', price: 46000, reportsCount: 14, locationName: 'Mushin' },
        { date: 'Thu', price: 46000, reportsCount: 15, locationName: 'Mushin' },
        { date: 'Fri', price: 46000, reportsCount: 17, locationName: 'Mushin' },
        { date: 'Sat', price: 46000, reportsCount: 18, locationName: 'Mushin' },
        { date: 'Today', price: 46000, reportsCount: 19, locationName: 'Mushin' }
      ],
      '30Days': [
        { date: 'Week 1', price: 48000, reportsCount: 30, locationName: 'Mushin' },
        { date: 'Week 2', price: 47000, reportsCount: 35, locationName: 'Mushin' },
        { date: 'Week 3', price: 46500, reportsCount: 40, locationName: 'Mushin' },
        { date: 'Week 4', price: 46000, reportsCount: 46, locationName: 'Mushin' }
      ],
      '6Months': [
        { date: 'Mar', price: 34000, reportsCount: 35, locationName: 'Mushin' },
        { date: 'Apr', price: 38000, reportsCount: 45, locationName: 'Mushin' },
        { date: 'May', price: 42000, reportsCount: 60, locationName: 'Mushin' },
        { date: 'Jun', price: 45000, reportsCount: 70, locationName: 'Mushin' },
        { date: 'Jul', price: 47000, reportsCount: 80, locationName: 'Mushin' },
        { date: 'Aug', price: 46000, reportsCount: 75, locationName: 'Mushin' }
      ]
    }
  }
];

export const INITIAL_STREAK_REWARDS = [
  { day: 1, points: 300, label: 'Day 1 Starter Spark', icon: '⚡', description: 'Immediate 300 SABI Points Welcome Boost' },
  { day: 2, points: 350, label: 'Day 2 Daily Check', icon: '🔥', description: '350 SABI Points added to balance' },
  { day: 3, points: 400, label: 'Day 3 Fact Keeper', icon: '🎯', description: '400 SABI Points bonus' },
  { day: 4, points: 450, label: 'Day 4 Pulse Monitor', icon: '📈', description: '450 SABI Points bonus' },
  { day: 5, points: 500, label: 'Day 5 Truth Sentinel', icon: '🛡️', description: '500 SABI Points milestone' },
  { day: 6, points: 600, label: 'Day 6 Market Scout', icon: '🛒', description: '600 SABI Points reward' },
  { day: 7, points: 750, label: 'Day 7 Week 1 Champion', icon: '🏆', description: '750 SABI Points + 7-Day Streak Badge' },
  { day: 8, points: 850, label: 'Day 8 Sabi Master', icon: '✨', description: '850 SABI Points reward' },
  { day: 9, points: 950, label: 'Day 9 Community Pillar', icon: '🌟', description: '950 SABI Points reward' },
  { day: 10, points: 1100, label: 'Day 10 Double Digits', icon: '💎', description: '1,100 SABI Points milestone' },
  { day: 11, points: 1200, label: 'Day 11 Vanguard', icon: '🚀', description: '1,200 SABI Points reward' },
  { day: 12, points: 1300, label: 'Day 12 Sovereign Eye', icon: '👁️', description: '1,300 SABI Points reward' },
  { day: 13, points: 1400, label: 'Day 13 Final Stretch', icon: '👑', description: '1,400 SABI Points reward' },
  { day: 14, points: 2000, label: 'Day 14 Legend Master', icon: '🥇', description: '2,000 SABI Points + 14-Day Streak Legend Badge' }
];

export interface TierConfig {
  tier: 'Bronze' | 'Golden' | 'Deluxe' | 'Admin Super';
  title: string;
  pointsCost: number;
  badge: string;
  color: string;
  glowColor: string;
  description: string;
  benefits: string[];
  instantBonusPoints?: number;
  unlocksSabiation?: boolean;
  hasCustomerService?: boolean;
  founderPhone?: string;
  founderWhatsAppUrl?: string;
  secretAppDomain?: string;
  secretAppUrl?: string;
  adminPasswordReveal?: string;
}

export const TIER_DEFINITIONS: Record<string, TierConfig> = {
  Bronze: {
    tier: 'Bronze',
    title: 'Bronze Sentinel',
    pointsCost: 8000,
    badge: '🥉 Bronze Sentinel',
    color: 'from-amber-700 to-amber-500',
    glowColor: 'amber',
    description: 'Upgrade your experience with high-priority verification routing and boosted community status.',
    benefits: [
      'Much better app and verification experience',
      'Bronze Sentinel VIP verified badge on profile and chat',
      '1.25x SABI points multiplier on all submitted market price reports',
      'Early access to localized price drop alerts in your LGA'
    ]
  },
  Golden: {
    tier: 'Golden',
    title: 'Golden Sovereign',
    pointsCost: 150000,
    badge: '🥇 Golden Sovereign',
    color: 'from-yellow-600 via-amber-500 to-yellow-400',
    glowColor: 'yellow',
    description: 'Elevate your credibility with the prestigious Golden Sovereign title, enhanced points boost, and exclusive golden flair in the group chat.',
    unlocksSabiation: false,
    benefits: [
      'Golden Sovereign title badge and 1.75x SABI points boost on all activities',
      'Exclusive Golden Sovereign special icon (🥇) and glowing flair in The Sabiers group chat',
      'High-priority verification consensus voting weight in your state',
      'Priority localized price drop and market rumor alerts in your LGA'
    ]
  },
  Deluxe: {
    tier: 'Deluxe',
    title: 'Deluxe Sovereign VIP',
    pointsCost: 300000,
    badge: '👑 Deluxe Sovereign VIP',
    color: 'from-purple-600 via-indigo-600 to-cyan-500',
    glowColor: 'purple',
    description: 'The supreme pinnacle of SABI mastery: unlocks full access to "The Sabiation" AI suite, direct line to SABI Founder (+234 8032813855), plus 1 Full Year VIP Concierge Support & instant 100k bonus points!',
    unlocksSabiation: true,
    hasCustomerService: true,
    founderPhone: '+234 8032813855',
    founderWhatsAppUrl: 'https://wa.me/2348032813855',
    instantBonusPoints: 100000,
    secretAppDomain: 'avidayo.created.app',
    secretAppUrl: 'https://avidayo.created.app',
    benefits: [
      'Exclusive full lifetime access to "The Sabiation" AI suite (Image Gen 4K, Quization, Numa, Avid)',
      'Special Deluxe Royal Crown icon (👑) & illuminated VIP avatar flair in The Sabiers group chat',
      'Direct VIP Line & WhatsApp to SABI Founder: +234 8032813855 (Priority Founder Hotline)',
      'Instant extra +100,000 SABI Points bonus credited immediately to your balance',
      '1 Full Year of Priority 24/7 Concierge Customer Service & VIP advisory channel',
      '2.5x supreme points multiplier on all community verifications and price submissions'
    ]
  },
  'Admin Super': {
    tier: 'Admin Super',
    title: 'Admin Super Supreme',
    pointsCost: 20500000,
    badge: '⚡ Admin Super Supreme',
    color: 'from-red-600 via-rose-600 to-amber-500',
    glowColor: 'red',
    description: 'The absolute master key title: Unlocks official Master Admin Access, system override tools, and reveals the official SABI Admin Master Access Code.',
    unlocksSabiation: true,
    hasCustomerService: true,
    adminPasswordReveal: 'SABI2026_MASTER_ADMIN_SECRET',
    benefits: [
      'Reveals Official Master Admin Access Password (SABI2026_MASTER_ADMIN_SECRET)',
      'Full System Admin Command Privilege across all verification & market moderation dashboards',
      'Exclusive Admin Super Supreme badge (⚡) & supreme aura across all global feeds',
      'Infinite voting authority & immediate truth consensus override rights',
      'Includes all Deluxe Sovereign VIP perks + Sabiation AI Suite access'
    ]
  }
};

export interface SabiationResource {
  id: string;
  name: string;
  category: 'Image Generation' | 'AI Tools' | 'Media Forensics' | 'Productivity';
  url: string;
  badge: string;
  description: string;
  freeTierDetails: string;
  iconName: string;
  promptExample?: string;
}

export const FREE_SABIATION_RESOURCES: SabiationResource[] = [
  {
    id: 'tool_pollinations',
    name: 'Pollinations.ai Free Image Creator',
    category: 'Image Generation',
    url: 'https://pollinations.ai',
    badge: '100% Free • No Sign-In Needed',
    description: 'Instant open-source generative AI images from natural language text prompts with zero cost or credits required.',
    freeTierDetails: 'Unlimited free image generation via Flux, Stable Diffusion and Turbo engines.',
    iconName: 'Image',
    promptExample: 'Vibrant Nigerian market stall at sunset with fresh tomatoes and red peppers, hyper-realistic 8k'
  },
  {
    id: 'tool_craiyon',
    name: 'Craiyon Free AI Art',
    category: 'Image Generation',
    url: 'https://www.craiyon.com',
    badge: 'Free Web Tool',
    description: 'Create unique AI art and photographic renders simply by typing what you want to see.',
    freeTierDetails: 'Completely free generation supported by ad-free fast rendering options.',
    iconName: 'Sparkles',
    promptExample: 'Modern Lagos skyline illuminated at dusk, digital art style'
  },
  {
    id: 'tool_designer',
    name: 'Microsoft Designer / Bing Image Creator (DALL-E 3)',
    category: 'Image Generation',
    url: 'https://designer.microsoft.com/image-creator',
    badge: 'Free with Microsoft Account',
    description: 'State-of-the-art DALL-E 3 image generation engine for stunning photographic visuals and marketing graphics.',
    freeTierDetails: '15 free daily boosts for instant generation, followed by unlimited standard generations.',
    iconName: 'Palette'
  },
  {
    id: 'tool_forensically',
    name: 'Forensically Photo & Metadata Inspector',
    category: 'Media Forensics',
    url: 'https://29a.ch/sandbox/2012/imageerrorlevelanalysis/',
    badge: '100% Free Open Web',
    description: 'Analyze digital images for clone detection, Error Level Analysis (ELA), noise analysis, and EXIF geolocation data.',
    freeTierDetails: 'Browser-based zero server upload fact-checking forensics suite.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'tool_factcheck',
    name: 'Google Fact Check Explorer',
    category: 'Media Forensics',
    url: 'https://toolbox.google.com/factcheck/explorer',
    badge: 'Free Global Registry',
    description: 'Search over 200,000 verified fact checks globally by keyword, topic, or public claim statement.',
    freeTierDetails: 'Public and free database access backed by international fact-checking networks.',
    iconName: 'Search'
  },
  {
    id: 'tool_whisper',
    name: 'Hugging Face Whisper Free Audio Transcriber',
    category: 'AI Tools',
    url: 'https://huggingface.co/spaces/openai/whisper',
    badge: 'Open Source AI',
    description: 'Transcribe WhatsApp audio voice notes, radio clips, and market interviews in seconds into clean text.',
    freeTierDetails: 'Free open inference engine running OpenAI Whisper Large.',
    iconName: 'Mic'
  }
];

export const SOCIAL_TRENDS_DATA: SocialTrend[] = [
  {
    id: 'trend_yt_01',
    topic: 'CBN FX & Remittance Policy Full Breakdown',
    hashtag: '#CBNPolicy2026',
    category: 'Finance & Economy',
    platform: 'youtube',
    volume: '342K views',
    viralityScore: 98,
    state: 'Nationwide',
    summary: 'Viral in-depth YouTube financial documentaries explaining new interbank rules and electronic clearing stabilization.',
    postCount: '1.2K discussions',
    verifiedStatus: 'VERIFIED',
    url: 'https://youtube.com'
  },
  {
    id: 'trend_tk_01',
    topic: 'Mile 12 Tomato Crash: ₦22k Basket Wholesale Live',
    hashtag: '#Mile12Prices',
    category: 'Food Markets',
    platform: 'tiktok',
    volume: '890K views',
    viralityScore: 99,
    state: 'Lagos',
    summary: 'TikTok creators livestreaming from Mile 12 market as over 150 northern trailers offload fresh tomato and pepper baskets.',
    postCount: '14.5K clips',
    verifiedStatus: 'VERIFIED',
    url: 'https://tiktok.com'
  },
  {
    id: 'trend_tw_01',
    topic: 'Third Mainland & Eko Bridge Traffic Corridor Status',
    hashtag: '#LagosTraffic',
    category: 'Transit & Infrastructure',
    platform: 'twitter',
    volume: '210K tweets',
    viralityScore: 94,
    state: 'Lagos',
    summary: 'Live commute reports on Twitter (X) tracking seamless movement and newly deployed electronic surveillance monitors.',
    postCount: '18.2K posts',
    verifiedStatus: 'VERIFIED',
    url: 'https://twitter.com'
  },
  {
    id: 'trend_ig_01',
    topic: 'NAFDAC Quality Sweep on Imported Edible Oils',
    hashtag: '#NAFDACVerified',
    category: 'Consumer Safety',
    platform: 'instagram',
    volume: '480K reels',
    viralityScore: 96,
    state: 'Nationwide',
    summary: 'Viral Instagram Reels and visual carousel alerts debunking fake cooking oil claims with laboratory test certifications.',
    postCount: '8.4K reels',
    verifiedStatus: 'VERIFIED',
    url: 'https://instagram.com'
  },
  {
    id: 'trend_yt_02',
    topic: 'Benue & Taraba Bumper Harvest Logistics Dispatch',
    hashtag: '#AgricNigeria',
    category: 'National Food Security',
    platform: 'youtube',
    volume: '175K views',
    viralityScore: 89,
    state: 'Benue',
    summary: 'YouTube agriculture vloggers capturing massive yam and grain freight trains departing Makurdi terminals for southern depots.',
    postCount: '650 videos',
    verifiedStatus: 'VERIFIED',
    url: 'https://youtube.com'
  },
  {
    id: 'trend_tk_02',
    topic: 'Bodija Ibadan Pepper Challenge & Real-Time Bargaining',
    hashtag: '#BodijaMarket',
    category: 'Market Intelligence',
    platform: 'tiktok',
    volume: '620K views',
    viralityScore: 92,
    state: 'Oyo',
    summary: 'Viral TikTok bargaining reels demonstrating how to purchase bulk Scotch Bonnet (Atarodo) at direct farm-gate discounts.',
    postCount: '7.8K clips',
    verifiedStatus: 'VERIFIED',
    url: 'https://tiktok.com'
  },
  {
    id: 'trend_tw_02',
    topic: 'NNPC Downstream Supply & Port Discharge Schedule',
    hashtag: '#FuelUpdatesNG',
    category: 'Energy & Commodities',
    platform: 'twitter',
    volume: '155K tweets',
    viralityScore: 91,
    state: 'Abuja (FCT)',
    summary: 'Real-time Twitter verification threads confirming 24-hour dispensing operations and constant supply in FCT and Lagos.',
    postCount: '12.1K posts',
    verifiedStatus: 'VERIFIED',
    url: 'https://twitter.com'
  },
  {
    id: 'trend_ig_02',
    topic: 'Port Harcourt Woji-Aleto Link Bridge Free Flow Commute',
    hashtag: '#PHCityPulse',
    category: 'Local Updates',
    platform: 'instagram',
    volume: '290K reels',
    viralityScore: 88,
    state: 'Rivers',
    summary: 'Instagram stories and video posts confirming smooth traffic flow across Trans-Amadi and Peter Odili link roads.',
    postCount: '4.3K reels',
    verifiedStatus: 'VERIFIED',
    url: 'https://instagram.com'
  }
];

export const LATEST_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news_001_ph_bridge',
    title: 'Port Harcourt Woji-Aleto Bridge Live Corridor Verification',
    summary: 'Viral TikTok and Twitter claims asserted that the key link bridge in Port Harcourt was blocked. Verified video logs show free-flowing transit.',
    content: 'Viral TikTok videos and Twitter threads claimed that the Port Harcourt connecting bridge had suffered major collapse or roadblock, triggering panic across Trans-Amadi. SABI spotters inspected the location with live video capture, confirming passenger and commercial traffic is moving safely under normal speed parameters.',
    category: 'Fact Check Alert',
    author: 'SABI On-Ground Verifier Network',
    publishedAt: '8 mins ago',
    publishedTime: '11:15 AM Today',
    readTime: '2 min read',
    imageUrl: 'https://images.unsplash.com/photo-1545459720-aac8509eb02c?w=800&auto=format&fit=crop&q=80',
    verifiedSource: 'Rivers State Ministry of Works & Traffic Corps Field Bulletin',
    tags: ['Rivers', 'Port Harcourt', 'Bridge', 'Traffic', 'TikTok Video'],
    trendingScore: 99,
    state: 'Rivers',
    isWorldwide: false,
    socialPlatform: 'tiktok',
    socialHandle: '@ph_city_reports',
    likesCount: '14.2K',
    viewsCount: '185K',
    sharesCount: '3.8K',
    evidence: {
      claim: '“Woji-Aleto link bridge is collapsed and completely impassable.”',
      location: 'Port Harcourt (Woji-Aleto Link Bridge)',
      videoPlatform: 'TikTok',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-traffic-in-a-busy-city-avenue-42456-large.mp4',
      videoTitle: 'Live Corroborated Bridge Transit Footage (TikTok Verifier #402)',
      videoDuration: '0:45',
      videoViews: '185,400',
      videoLikes: '14,200',
      captionsText: 'Traffic is completely normal on both lanes of Woji-Aleto link as at 11:15 AM. No structural blockage observed.',
      verifiedByCount: 6,
      capturedTime: 'Today, 11:15 AM',
      officialSource: 'Rivers State Ministry of Works & Traffic Corps Field Bulletin',
      officialSourceUrl: 'https://sabi.ng/verification-vault',
      aiMediaCheck: 'No deepfake anomalies • Temporal motion vector coherence 99.4% • Optical shadow integrity confirmed',
      verdict: 'VERIFIED',
      verifierExplanation: 'SABI verifiers recorded live video footage on site. Tarmac is dry, safety barriers intact, and vehicles crossing at standard speeds.',
      originPlatform: 'TikTok',
      state: 'Rivers'
    }
  },
  {
    id: 'news_002_lagos_tmb',
    title: 'Third Mainland Bridge Commute: Tanker Explosion Rumor Debunked',
    summary: 'A viral video circulated on Twitter (X) claiming an active petroleum fire blocked Island traffic on the Third Mainland Bridge.',
    content: 'Multiple tweets accompanied by dramatic footage claimed an ongoing fire near Adekunle junction. Two SABI Lagos spotters recorded real-time high-definition video from Adeniji Adele showing clean tarmac and smooth morning traffic.',
    category: 'Fact Check Alert',
    author: 'SABI Media Forensic Team',
    publishedAt: '18 mins ago',
    publishedTime: '10:45 AM Today',
    readTime: '2 min read',
    imageUrl: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&auto=format&fit=crop&q=80',
    verifiedSource: 'LASTMA & Lagos State Emergency Management Agency (LASEMA)',
    tags: ['Lagos', 'Third Mainland Bridge', 'LASTMA', 'Twitter Misinformation'],
    trendingScore: 97,
    state: 'Lagos',
    isWorldwide: false,
    socialPlatform: 'twitter',
    socialHandle: '@lagos_alerts_x',
    likesCount: '8.9K',
    viewsCount: '124K',
    sharesCount: '5.1K',
    evidence: {
      claim: '“Third Mainland Bridge is currently on fire due to a tanker explosion.”',
      location: 'Lagos (Adekunle / Adeniji)',
      videoPlatform: 'Twitter (X)',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-highway-traffic-during-rush-hour-42457-large.mp4',
      videoTitle: 'Live Corridor Video Stream from Adeniji Overpass (Twitter @lagos_alerts_x)',
      videoDuration: '0:38',
      videoViews: '124,000',
      videoLikes: '8,900',
      captionsText: 'Clear roadway on Third Mainland Bridge. Recycled 2021 video identified and debunked.',
      verifiedByCount: 8,
      capturedTime: 'Today, 10:45 AM',
      officialSource: 'LASTMA Special Media Release & Emergency Command Bulletin',
      officialSourceUrl: 'https://lastma.lagosstate.gov.ng',
      aiMediaCheck: 'Recycled footage detected: Video matches archive broadcast from November 2021. Live spotter stream is verified authentic.',
      verdict: 'OUTDATED MEDIA',
      verifierExplanation: 'Spotters on Third Mainland Bridge recorded live unobstructed movement. The viral claim used old archival fire footage.',
      originPlatform: 'Twitter (X)',
      state: 'Lagos'
    }
  },
  {
    id: 'news_003_youtube_market',
    title: 'YouTube Investigative Channel Tracks Wholesale Grains Supply Chain',
    summary: 'A widely watched YouTube documentary demonstrates how direct farm-gate supplies to Dawanau and Bodija are reducing bag costs.',
    content: 'An in-depth video report published on YouTube tracked 120 freight trailers transporting white maize, sorghum, and millet across northern agrarian corridors directly into southwestern consumer hubs. The report confirmed agricultural logistics corridors are operating efficiently with zero state transit embargoes.',
    category: 'Market Intelligence',
    author: 'SABI National Logistics Bureau',
    publishedAt: '45 mins ago',
    publishedTime: '10:00 AM Today',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    verifiedSource: 'Dawanau Market Traders Association & Kano Chamber of Commerce',
    tags: ['YouTube', 'Kano', 'Dawanau', 'Grain Supply', 'Food Logistics'],
    trendingScore: 95,
    state: 'Kano',
    isWorldwide: false,
    socialPlatform: 'youtube',
    socialHandle: '@nigerian_market_pulse',
    likesCount: '22.5K',
    viewsCount: '310K',
    sharesCount: '7.4K',
    evidence: {
      claim: '“Grain merchants have stopped supply trailers to southern wholesale depots.”',
      location: 'Kano (Dawanau International Grain Market)',
      videoPlatform: 'Twitter (X)',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-trucks-driving-on-a-country-highway-42458-large.mp4',
      videoTitle: 'Trailer Freight Departures from Dawanau Depot (Live Video)',
      videoDuration: '1:12',
      videoViews: '310,000',
      videoLikes: '22,500',
      captionsText: 'Over 120 trailers loaded with fresh grain dispatched smoothly to Bodija and Mile 12 without interruption.',
      verifiedByCount: 10,
      capturedTime: 'Today, 10:00 AM',
      officialSource: 'Dawanau Market Executive Council Joint Statement',
      officialSourceUrl: 'https://sabi.ng/grain-audit',
      aiMediaCheck: 'Authentic 4K footage verified with matching solar altitude and GPS coordinates',
      verdict: 'VERIFIED',
      verifierExplanation: 'Verifiers watched freight loading and departure. Inter-state commodity transit remains fully operational.',
      originPlatform: 'Twitter (X)',
      state: 'Kano'
    }
  },
  {
    id: 'news_004_ig_nafdac',
    title: 'Instagram Viral Claim on "Plastic Rice" in Southeast Debunked with NAFDAC Lab Tests',
    summary: 'A viral video on Instagram claiming imported bags contained artificial rice was examined and certified genuine local grain.',
    content: 'Following a widely shared Instagram Reel showing uncooked rice floating on water, NAFDAC laboratory field inspectors and SABI spotters sampled sacks across Onitsha Main Market and Ariaria Aba. Iodine and heat testing confirmed 100% organic starch composition with zero synthetic polymers.',
    category: 'Fact Check Alert',
    author: 'SABI Food Safety Taskforce',
    publishedAt: '1 hour ago',
    publishedTime: '9:30 AM Today',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    verifiedSource: 'NAFDAC Food Safety Inspectorate & Onitsha Traders Union',
    tags: ['Instagram', 'Anambra', 'NAFDAC', 'Food Safety', 'Fact Check'],
    trendingScore: 94,
    state: 'Anambra',
    isWorldwide: false,
    socialPlatform: 'instagram',
    socialHandle: '@food_safety_ng',
    likesCount: '19.8K',
    viewsCount: '240K',
    sharesCount: '9.2K',
    evidence: {
      claim: '“Plastic artificial rice is being sold in Onitsha wholesale stalls.”',
      location: 'Onitsha (Main Market Relief Market)',
      videoPlatform: 'Facebook',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-and-showing-fresh-rice-grains-42459-large.mp4',
      videoTitle: 'Live Iodine & Heat Dissolution Test on Sampled Grains (Facebook Live)',
      videoDuration: '0:55',
      videoViews: '240,000',
      videoLikes: '19,800',
      captionsText: 'NAFDAC scientific field assay shows standard carbohydrate gelatinization. Zero plastic polymer detected.',
      verifiedByCount: 7,
      capturedTime: 'Today, 9:30 AM',
      officialSource: 'NAFDAC Special Food Laboratory Communiqué',
      officialSourceUrl: 'https://nafdac.gov.ng',
      aiMediaCheck: 'Spectral analysis of testing video confirms authentic unaltered continuous footage',
      verdict: 'FALSE',
      verifierExplanation: 'Testing confirmed rice buoyancy in the viral video was caused by standard moisture density variations, not synthetic plastic.',
      originPlatform: 'Facebook',
      state: 'Anambra'
    }
  },
  {
    id: 'news_005_abuja_fuel',
    title: 'Abuja Fuel Stations Dispensing at Full Capacity: Capping Rumor Debunked',
    summary: 'A viral voice note on Facebook and WhatsApp alleged petrol pumps were restricted to 10 liters. Spotters verified unlimited dispensing.',
    content: 'Panic buying started across Wuse II, Maitama, and Gwarinpa after Facebook posts alleged rationing rules. SABI verifiers conducted spot video tests at 7 major filling stations across the CBD and airport road, buying full tank loads without restrictions.',
    category: 'Market Intelligence',
    author: 'SABI Northern Bureau',
    publishedAt: '2 hours ago',
    publishedTime: '8:45 AM Today',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&auto=format&fit=crop&q=80',
    verifiedSource: 'Nigerian Midstream and Downstream Petroleum Regulatory Authority (NMDPRA)',
    tags: ['Facebook', 'Abuja', 'FCT', 'Fuel Supply', 'NMDPRA'],
    trendingScore: 92,
    state: 'Abuja (FCT)',
    isWorldwide: false,
    socialPlatform: 'facebook',
    socialHandle: '@abuja_market_gist',
    likesCount: '11.4K',
    viewsCount: '160K',
    sharesCount: '4.5K',
    evidence: {
      claim: '“Filling stations in Abuja are restricted to dispensing only 10 litres per vehicle.”',
      location: 'Abuja FCT (Central Business District & Wuse II)',
      videoPlatform: 'Facebook',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cars-refueling-at-a-modern-gas-station-42460-large.mp4',
      videoTitle: 'Live Dispensing & Zero Queue Verification at Central Stations (Facebook Stream)',
      videoDuration: '0:42',
      videoViews: '160,000',
      videoLikes: '11,400',
      captionsText: 'Pumps dispensing full capacity at official rates across NNPC and TotalEnergies stations in Wuse II.',
      verifiedByCount: 6,
      capturedTime: 'Today, 8:45 AM',
      officialSource: 'NMDPRA Public Assurance Notice & Major Marketers Manifest',
      officialSourceUrl: 'https://nmdpra.gov.ng',
      aiMediaCheck: 'Audio analysis confirms viral voice note used synthetic voice clone with acoustic pitch jitter',
      verdict: 'FALSE',
      verifierExplanation: 'Verifiers fueled vehicles up to 60 liters with no queues or artificial purchase quotas.',
      originPlatform: 'Facebook',
      state: 'Abuja (FCT)'
    }
  },
  {
    id: 'news_006_tiktok_bodija',
    title: 'TikTok Viral Pepper & Tomato Sourcing Trend at Bodija Market Ibadan',
    summary: 'Viral TikTok videos showing dramatic wholesale price drops for fresh plum tomatoes and Scotch Bonnet confirmed accurate.',
    content: 'Fresh consignments of Scotch Bonnet (Atarodo) and plum tomatoes from northern agrarian belts arrived at Bodija Market this morning. TikTok spotters filmed live crate pricing, recording large baskets retailing between ₦22,000 and ₦26,000, down from last month’s highs.',
    category: 'Market Intelligence',
    author: 'SABI Southwest Field Unit',
    publishedAt: '3 hours ago',
    publishedTime: '7:30 AM Today',
    readTime: '2 min read',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
    verifiedSource: 'Bodija Foodstuff Traders Association & Oyo State Ministry of Trade',
    tags: ['TikTok', 'Oyo', 'Ibadan', 'Bodija', 'Tomatoes', 'Price Drop'],
    trendingScore: 90,
    state: 'Oyo',
    isWorldwide: false,
    socialPlatform: 'tiktok',
    socialHandle: '@ibadan_market_radar',
    likesCount: '27.3K',
    viewsCount: '410K',
    sharesCount: '8.6K',
    evidence: {
      claim: '“Fresh tomato baskets in Bodija have dropped below ₦25,000 following bumper northern truck arrivals.”',
      location: 'Ibadan, Oyo State (Bodija International Market)',
      videoPlatform: 'TikTok',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vegetables-and-fruits-arranged-in-a-market-stall-42461-large.mp4',
      videoTitle: 'Live Bodija Wholesale Shed Crate Pricing (TikTok @ibadan_market_radar)',
      videoDuration: '0:50',
      videoViews: '410,000',
      videoLikes: '27,300',
      captionsText: 'Direct wholesale rates for ripe tomato baskets confirmed between ₦22,000 and ₦25,500 at Bodija shed 4.',
      verifiedByCount: 9,
      capturedTime: 'Today, 7:30 AM',
      officialSource: 'Oyo State Market Board Joint Communiqué',
      officialSourceUrl: 'https://oyostate.gov.ng',
      aiMediaCheck: 'Optical metadata verified: Camera captured at Bodija 07:30 AM today with matching natural light',
      verdict: 'VERIFIED',
      verifierExplanation: 'Live video shows high supply volume with over 40 trailer arrivals. Traders confirming heavy discount sales.',
      originPlatform: 'TikTok',
      state: 'Oyo'
    }
  }
];

export const INITIAL_RECIPES: RecipeItem[] = [
  {
    id: 'rec_001',
    title: 'Yam and Egg Sauce',
    description: 'A classic Nigerian hearty breakfast: sweet boiled white yam slices served with rich, aromatic peppered egg sauce.',
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
    ingredients: ['Yam (4 slices)', 'Eggs (3 large)', 'Fresh Tomatoes (3 plum)', 'Scotch Bonnet Pepper (Atarodo 2 pcs)', 'Red Onions (1 medium)', 'Vegetable Oil (2 tbsp)', 'Seasoning Cube (1)', 'Pinch of Salt'],
    steps: [
      {
        stepNumber: 1,
        title: 'Prepare and Boil the Yam',
        instruction: 'Peel the yam, cut into round rings or halves, and wash thoroughly. Place in a pot with water and a pinch of salt. Boil on medium heat for 12–15 minutes until tender when pierced with a fork.',
        durationSec: 5,
        imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&auto=format&fit=crop&q=80',
        tips: 'Do not overboil to prevent yam from getting soggy.'
      },
      {
        stepNumber: 2,
        title: 'Fry the Pepper and Onion Base',
        instruction: 'Heat vegetable oil in a frying pan on medium heat. Sauté finely chopped onions for 1 minute, then add diced fresh tomatoes and scotch bonnet peppers. Fry gently for 3–4 minutes until oil separates.',
        durationSec: 7,
        imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
        tips: 'Add your seasoning cube and a pinch of curry/thyme for deep aroma.'
      },
      {
        stepNumber: 3,
        title: 'Pour Eggs, Scramble & Serve',
        instruction: 'Whisk 3 eggs with a pinch of salt. Pour slowly into the simmering tomato sauce. Allow to set for 30 seconds, then gently fold and scramble until fluffy. Serve hot alongside the boiled yam.',
        durationSec: 8,
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
        tips: 'Keep heat low when pouring eggs for velvety texture.'
      }
    ]
  },
  {
    id: 'rec_002',
    title: 'Smoky Nigerian Party Jollof Rice',
    description: 'The world-famous Nigerian celebration dish: fragrant long grain parboiled rice simmered in rich, roasted tomato-pepper reduction with signature firewood aroma.',
    prepTimeMinutes: 20,
    cookTimeMinutes: 45,
    servings: 6,
    difficulty: 'Medium',
    originRegion: 'National Treasure',
    caloriesApprox: 550,
    videoDurationSec: 20,
    videoThumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=kYJzXv5V7xY',
    youtubeVideoId: 'kYJzXv5V7xY',
    estimatedCost: '₦6,500 - ₦8,000',
    ingredients: ['Long Grain Parboiled Rice (3 cups)', 'Fresh Tomatoes & Tatashe (Bell pepper blend)', 'Scotch Bonnet (Atarodo)', 'Onions (2 large)', 'Tomato Paste (100g tin)', 'Chicken Stock', 'Bay Leaves (3)', 'Butter / Oil', 'Thyme & Curry Powder'],
    steps: [
      {
        stepNumber: 1,
        title: 'Roast and Blend the Pepper Base',
        instruction: 'Roast bell peppers, scotch bonnets, tomatoes, and onions lightly in an oven or dry pan. Blend smoothly and boil down the puree until thick and concentrated.',
        durationSec: 5,
        imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
        tips: 'Boiling off excess water prevents sour tomato taste.'
      },
      {
        stepNumber: 2,
        title: 'Fry the Rich Tomato Stew Base',
        instruction: 'Heat vegetable oil and butter in a heavy-bottomed pot. Fry sliced onions and tomato paste for 5 minutes, then add the boiled pepper puree, bay leaves, curry, thyme, and seasoned chicken stock. Simmer for 10 minutes.',
        durationSec: 7,
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
        tips: 'The stew base should be well-seasoned and vibrant red.'
      },
      {
        stepNumber: 3,
        title: 'Steam Rice on Low Flame for Party Smoke',
        instruction: 'Add washed parboiled rice into the stew base (sauce should just level with rice). Cover tightly with foil and pot lid. Cook on very low heat for 30 minutes, allowing steam to cook each grain until fluffy and lightly scorched at the bottom.',
        durationSec: 8,
        imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
        tips: 'Foil traps steam, ensuring no soggy grains and authentic smoky flavor.'
      }
    ]
  },
  {
    id: 'rec_003',
    title: 'Efo Riro (Rich Spinach & Pepper Soup)',
    description: 'A deeply flavorful Yoruba heritage vegetable soup loaded with dried fish, ponmo, crayfish, and locust beans (iru).',
    prepTimeMinutes: 15,
    cookTimeMinutes: 20,
    servings: 4,
    difficulty: 'Medium',
    originRegion: 'South-West Nigeria',
    caloriesApprox: 380,
    videoDurationSec: 20,
    videoThumbnail: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
    youtubeVideoUrl: 'https://www.youtube.com/watch?v=qX3zW7rVf9E',
    youtubeVideoId: 'qX3zW7rVf9E',
    estimatedCost: '₦4,500 - ₦6,000',
    ingredients: ['Fresh Spinach / Shoko or Tete leaves (1 bunch)', 'Palm Oil (1/2 cup)', 'Coarsely Coarse Bell Pepper & Scotch Bonnet Blend', 'Locust Beans (Iru Woro)', 'Smoked Catfish / Stockfish', 'Ground Crayfish (2 tbsp)', 'Diced Cooked Ponmo', 'Seasoning & Salt'],
    steps: [
      {
        stepNumber: 1,
        title: 'Blanch and Drain the Greens',
        instruction: 'Chop spinach leaves, immerse in hot salted water for 1 minute, then transfer immediately to cold water and squeeze out all excess moisture thoroughly.',
        durationSec: 5,
        imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
        tips: 'Squeezing out water prevents watery vegetable soup.'
      },
      {
        stepNumber: 2,
        title: 'Fry Palm Oil, Iru, and Proteins',
        instruction: 'Bleach palm oil slightly, toss in chopped onions and locust beans (iru) until fragrant. Add coarse pepper blend, ground crayfish, deboned smoked fish, and ponmo. Fry until oil floats on top.',
        durationSec: 7,
        imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80',
        tips: 'Locust beans give Efo Riro its signature traditional aroma.'
      },
      {
        stepNumber: 3,
        title: 'Combine Squeezed Greens and Steam',
        instruction: 'Turn off the direct high heat. Add the blanched greens into the rich pepper-protein sauce. Stir well to coat every leaf and leave pot open to preserve bright green color.',
        durationSec: 8,
        imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
        tips: 'Do not cover the pot after adding greens so vegetables stay green.'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    title: 'New Verification Request Near You',
    message: 'A verification task for "Rice price in Dei-Dei Market" is open within 5 km of your location.',
    type: 'verification_request',
    timestamp: '15 mins ago',
    read: false,
    targetId: 'task_001',
    actionUrl: '/verify'
  },
  {
    id: 'notif_02',
    title: 'Your Report Has Been Verified ✓',
    message: 'The fuel price claim video in Yaba was reviewed by 4 contributors. Verdict: OUTDATED MEDIA.',
    type: 'report_verified',
    timestamp: '2 hours ago',
    read: false,
    targetId: 'truth_002',
    actionUrl: '/truth'
  },
  {
    id: 'notif_03',
    title: 'You Earned +25 SABI Points!',
    message: 'Your verification submission for Bodija Market tomatoes was approved by community consensus.',
    type: 'points_earned',
    timestamp: '5 hours ago',
    read: true,
    pointsAwarded: 25
  },
  {
    id: 'notif_04',
    title: 'Market Price Alert',
    message: 'Tomato prices dropped by 14% at Mile 12 Market today. View comparative price cards.',
    type: 'system_alert',
    timestamp: 'Yesterday',
    read: true,
    actionUrl: '/market'
  }
];

export const INITIAL_SABIERS_MESSAGES = [
  {
    id: 'msg_001',
    senderId: 'usr_amina',
    senderName: 'Amina Bello',
    senderAvatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80',
    senderTrustLevel: 'Trusted Contributor' as const,
    state: 'Kano',
    lga: 'Fagge',
    channel: 'general' as const,
    message: 'Salam Sabiers! We just completed on-site verification at Dawanau Grain Market Kano. Local white rice supplies are abundant, wholesale 50kg bag is stable at ₦88,000–₦92,000.',
    timestamp: '15 mins ago',
    reactions: [
      { emoji: '🔥', count: 12, userReacted: false },
      { emoji: '🇳🇬', count: 8, userReacted: false },
      { emoji: '👍', count: 15, userReacted: true }
    ],
    attachedTag: {
      type: 'market_price' as const,
      label: 'Dawanau Grain Market: ₦88,000'
    }
  },
  {
    id: 'msg_002',
    senderId: 'usr_emeka',
    senderName: 'Emeka Nwosu',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    senderTrustLevel: 'Gold' as const,
    state: 'Anambra',
    lga: 'Onitsha North',
    channel: 'rumor-alerts' as const,
    message: 'Heads up! That viral TikTok video claiming the Second Niger Bridge is blocked is 100% OUTDATED MEDIA from 2023 flood period. I just crossed it 20 mins ago, traffic is crystal clear!',
    timestamp: '32 mins ago',
    reactions: [
      { emoji: '🎯', count: 19, userReacted: true },
      { emoji: '👏', count: 11, userReacted: false }
    ],
    attachedTag: {
      type: 'truth_verified' as const,
      label: 'Second Niger Bridge: OPEN'
    }
  },
  {
    id: 'msg_003',
    senderId: 'usr_babajide',
    senderName: 'Babajide Adeleke',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    senderTrustLevel: 'Gold' as const,
    state: 'Lagos',
    lga: 'Kosofe',
    channel: 'lagos' as const,
    message: 'Mile 12 market spotters: 14 articulated trailers of fresh tomatoes and tatashe arrived from Jos and Zaria this morning. Big rafia basket dropped to ₦52,000–₦55,000!',
    timestamp: '1 hour ago',
    reactions: [
      { emoji: '💡', count: 9, userReacted: false },
      { emoji: '🔥', count: 14, userReacted: true }
    ],
    attachedTag: {
      type: 'market_price' as const,
      label: 'Mile 12 Tomatoes: ₦52,000'
    }
  },
  {
    id: 'msg_004',
    senderId: 'usr_blessing',
    senderName: 'Blessing Udoh',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    senderTrustLevel: 'Silver' as const,
    state: 'Rivers',
    lga: 'Port Harcourt City',
    channel: 'east-south' as const,
    message: 'Oil Mill Market update for PH Sabiers: 25L pure palm oil keg is steady at ₦42,000. Grade A red oil with zero water adulteration verified with 4 depot dealers.',
    timestamp: '2 hours ago',
    reactions: [
      { emoji: '👍', count: 7, userReacted: false }
    ],
    attachedTag: {
      type: 'market_price' as const,
      label: 'PH Oil Mill: ₦42,000 / 25L'
    }
  },
  {
    id: 'msg_005',
    senderId: 'usr_fatima',
    senderName: 'Fatima Garba',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
    senderTrustLevel: 'Silver' as const,
    state: 'FCT - Abuja',
    lga: 'Bwari',
    channel: 'abuja-north' as const,
    message: 'Verified price check at Dei-Dei and Wuse Market: Foreign Parboiled Rice (Royal Stallion, Mama Gold) is ₦104,000 to ₦106,000. Please debunk the WhatsApp voice note claiming ₦90k.',
    timestamp: '3 hours ago',
    reactions: [
      { emoji: '🎯', count: 16, userReacted: false },
      { emoji: '🇳🇬', count: 10, userReacted: false }
    ],
    attachedTag: {
      type: 'rumor_alert' as const,
      label: 'Dei-Dei Rice False Claim'
    }
  }
];

export const INITIAL_ONLINE_SABIERS = [];

export const INITIAL_SMART_MARKETS: SmartMarket[] = [
  {
    id: 'mkt_smart_mile12',
    name: 'Mile 12 International Food Market',
    state: 'Lagos',
    lga: 'Kosofe',
    area: 'Ketu - Mile 12 Corridor, Ikorodu Road',
    tagline: 'Lagos #1 Fresh Farm-Produce Wholesale Hub',
    description: 'The largest wholesale hub in Southwest Nigeria for direct farm trucks carrying fresh tomatoes, peppers, onions, yams, and northern grains. Farm consignments arrive nightly between 3:00 AM and 6:00 AM.',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    spotterReportsCount: 248,
    distanceKm: 4.2,
    marketType: 'Wholesale Farm Hub',
    specialties: ['Fresh Tomatoes & Tatashe', 'Spring & Red Onions', 'Yam Tubers', 'Grains & Rice', 'Groundnut Oil'],
    averageSavingsVsRetail: 28,
    qualityRatingScore: 96,
    priceIndexScore: 95,
    bestDaysToVisit: 'Tuesdays & Fridays (5:30 AM - 9:30 AM)',
    openingHours: '5:00 AM - 7:00 PM Daily',
    bargainingPower: 'High Wholesale Discount',
    directionsGuide: 'Take Ikorodu Expressway towards Mile 12 Underbridge. Access wholesale trailer offloading bays via Gate 2.',
    safetyAndLogisticsTip: 'Arrive early before 8:30 AM for off-truck prices. Hire verified Sabier porters wearing green vests for bulk carriage.',
    latitude: 6.6083,
    longitude: 3.3981,
    topDeals: [
      {
        itemId: 'mkt_tomato',
        itemName: 'Fresh Tomatoes (Large Rafia Basket)',
        category: 'Vegetables',
        unitName: 'Large Rafia Basket',
        currentPrice: 55000,
        averageRegionalPrice: 76000,
        savingsPercent: 27.6,
        savingsAmount: 21000,
        qualityGrade: 'Grade A+ Farm Direct',
        trend: 'down',
        trendPercent: 12,
        bestBuyingTime: 'Early dawn trailer offload (Gate 2)',
        bargainTip: 'Buy together with neighbors to split full baskets directly from trailer drivers.'
      },
      {
        itemId: 'mkt_pepper',
        itemName: 'Fresh Rodo (Scotch Bonnet Pepper)',
        category: 'Vegetables',
        unitName: 'Big Bag',
        currentPrice: 38000,
        averageRegionalPrice: 52000,
        savingsPercent: 26.9,
        savingsAmount: 14000,
        qualityGrade: 'Grade A+ Farm Direct',
        trend: 'down',
        trendPercent: 10,
        bestBuyingTime: 'Morning 6 AM - 8 AM',
        bargainTip: 'Dry, crisp peppers located at middle farm stalls.'
      },
      {
        itemId: 'mkt_yam',
        itemName: 'Benue Medium-Large Yam (5 Tubers)',
        category: 'Tubers',
        unitName: 'Set of 5 Big Tubers',
        currentPrice: 16500,
        averageRegionalPrice: 24000,
        savingsPercent: 31.2,
        savingsAmount: 7500,
        qualityGrade: 'Grade A+ Farm Direct',
        trend: 'down',
        trendPercent: 15,
        bestBuyingTime: 'Wednesday mornings',
        bargainTip: 'Inspect tuber head for dry sap to guarantee sweet pounded yam texture.'
      }
    ]
  },
  {
    id: 'mkt_smart_oyingbo',
    name: 'Oyingbo Modern Market',
    state: 'Lagos',
    lga: 'Lagos Mainland',
    area: 'Ebute Metta / Oyingbo Railway Terminal',
    tagline: 'Seafood, Garri, Fresh Plantain & Soup Ingredients Depot',
    description: 'Premier food market for fresh catfish, croaker, crayfish, genuine Ijebu & Delta garri, plantains, and traditional soup vegetables arriving directly from Ondo, Delta, and Riverine ports.',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    spotterReportsCount: 194,
    distanceKm: 2.1,
    marketType: 'Modern Food Hub',
    specialties: ['Ijebu & Delta Garri', 'Smoked & Fresh Fish', 'Plantains', 'Palm Oil', 'Waterleaf & Ugwu'],
    averageSavingsVsRetail: 22,
    qualityRatingScore: 94,
    priceIndexScore: 91,
    bestDaysToVisit: 'Thursdays & Saturdays (6:00 AM - 11:00 AM)',
    openingHours: '6:00 AM - 8:00 PM Daily',
    bargainingPower: 'High Wholesale Discount',
    directionsGuide: 'Located opposite Oyingbo BRT station / Railway corridor. Ground floor holds seafood & garri rows.',
    safetyAndLogisticsTip: 'Head directly to the ground floor inner sheds for wholesale garri bag sellers rather than exterior stalls.',
    latitude: 6.4782,
    longitude: 3.3842,
    topDeals: [
      {
        itemId: 'mkt_garri',
        itemName: 'Authentic Ijebu Garri (50kg Bag)',
        category: 'Tubers',
        unitName: '50kg Bag',
        currentPrice: 42000,
        averageRegionalPrice: 54000,
        savingsPercent: 22.2,
        savingsAmount: 12000,
        qualityGrade: 'Grade A+ Farm Direct',
        trend: 'down',
        trendPercent: 8,
        bestBuyingTime: 'Morning hours',
        bargainTip: 'Ask for "Ogun-Ondo origin" garri; test crispness before bagging.'
      },
      {
        itemId: 'mkt_plantain',
        itemName: 'Fresh Green/Ripe Plantains (Big Bunch)',
        category: 'Tubers',
        unitName: '1 Massive Bunch',
        currentPrice: 6500,
        averageRegionalPrice: 9500,
        savingsPercent: 31.5,
        savingsAmount: 3000,
        qualityGrade: 'Grade A+ Farm Direct',
        trend: 'down',
        trendPercent: 12,
        bestBuyingTime: 'Thursday farm arrivals',
        bargainTip: 'Buy green plantains if storing for 1-2 weeks; ripens naturally.'
      },
      {
        itemId: 'mkt_fish',
        itemName: 'Smoked Catfish & Mangrove Mangala Fish',
        category: 'Proteins',
        unitName: 'Large Basket (12 pcs)',
        currentPrice: 14000,
        averageRegionalPrice: 19500,
        savingsPercent: 28.2,
        savingsAmount: 5500,
        qualityGrade: 'Grade A Premium',
        trend: 'stable',
        trendPercent: 0,
        bestBuyingTime: 'Mid-morning',
        bargainTip: 'Inner riverine shed fish are sun-dried and oven-smoked without kerosene smell.'
      }
    ]
  },
  {
    id: 'mkt_smart_daleko',
    name: 'Daleko & Idumota Grains Hub',
    state: 'Lagos',
    lga: 'Mushin / Lagos Island',
    area: 'Daleko Grain Market, Isolo Road & Idumota Terminal',
    tagline: 'West Africa Largest Wholesale Rice & Grains Exchange',
    description: 'The definitive center for 50kg rice bags (Royal Stallion, Mama Gold, Abakaliki), beans (Oloyin & White), flour, sugar, and factory-direct vegetable oils. The benchmark for Nigerian grain pricing.',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    spotterReportsCount: 312,
    distanceKm: 5.6,
    marketType: 'Bulk Grain Depot',
    specialties: ['50kg Foreign & Local Rice', 'Honey Beans (Oloyin)', '25L Vegetable Oil', 'Flour & Sugar'],
    averageSavingsVsRetail: 25,
    qualityRatingScore: 98,
    priceIndexScore: 97,
    bestDaysToVisit: 'Mondays & Wednesdays (7:00 AM - 1:00 PM)',
    openingHours: '6:30 AM - 6:00 PM (Mon-Sat)',
    bargainingPower: 'High Wholesale Discount',
    directionsGuide: 'Accessible via Mushin Isolo expressway. Daleko depot gate leads straight to primary importers warehouses.',
    safetyAndLogisticsTip: 'Check bag seal and brand hologram on 50kg sacks to ensure genuine mill packaging.',
    latitude: 6.5291,
    longitude: 3.3482,
    topDeals: [
      {
        itemId: 'mkt_rice',
        itemName: 'Foreign Parboiled Rice (50kg Royal Stallion / Mama Gold)',
        category: 'Grains',
        unitName: '50kg Sealed Sack',
        currentPrice: 102000,
        averageRegionalPrice: 122000,
        savingsPercent: 16.4,
        savingsAmount: 20000,
        qualityGrade: 'Grade A Premium',
        trend: 'stable',
        trendPercent: 1,
        bestBuyingTime: 'Morning warehouse shifts',
        bargainTip: 'Buy from first-line distributors along Line 3 for ex-depot rate.'
      },
      {
        itemId: 'mkt_beans',
        itemName: 'Honey Beans - Oloyin Sweet (100kg Bag)',
        category: 'Grains',
        unitName: '100kg Bag',
        currentPrice: 135000,
        averageRegionalPrice: 165000,
        savingsPercent: 18.2,
        savingsAmount: 30000,
        qualityGrade: 'Grade A+ Farm Direct',
        trend: 'down',
        trendPercent: 6,
        bestBuyingTime: 'Tuesday delivery batches',
        bargainTip: 'Spotters check for clean weevil-free sorting at Line 5.'
      }
    ]
  },
  {
    id: 'mkt_smart_bodija',
    name: 'Bodija International Market (Ibadan)',
    state: 'Oyo',
    lga: 'Ibadan North',
    area: 'Bodija Express Corridor, Ibadan',
    tagline: 'The Southwest Mega Agricultural Gateway',
    description: 'Renowned as the most cost-effective food market in Southern Nigeria. Direct offloader for Northern farm produce, cattle consignments, Kano plum tomatoes, and Oyo yams at unbeatable farm-gate margins.',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    spotterReportsCount: 220,
    distanceKm: 8.5,
    marketType: 'Wholesale Farm Hub',
    specialties: ['Kano Fresh Tomatoes', 'Tatashe & Shombo', 'Saki Yam Tubers', 'Grains & Soya', 'Pure Palm Oil'],
    averageSavingsVsRetail: 34,
    qualityRatingScore: 97,
    priceIndexScore: 98,
    bestDaysToVisit: 'Wednesdays & Fridays (5:00 AM - 10:00 AM)',
    openingHours: '5:00 AM - 7:30 PM Daily',
    bargainingPower: 'High Wholesale Discount',
    directionsGuide: 'Take Bodija market road opposite the Railway siding. Northern produce sheds are located at the rear trailer park.',
    safetyAndLogisticsTip: 'Tomato baskets here are typically 40% cheaper than Lagos retail. Perfect for group family buying.',
    latitude: 7.4241,
    longitude: 3.9056,
    topDeals: [
      {
        itemId: 'mkt_tomato',
        itemName: 'Farm Fresh Tomatoes (Large Rafia Basket)',
        category: 'Vegetables',
        unitName: 'Large Rafia Basket',
        currentPrice: 28000,
        averageRegionalPrice: 48000,
        savingsPercent: 41.7,
        savingsAmount: 20000,
        qualityGrade: 'Grade A+ Farm Direct',
        trend: 'down',
        trendPercent: 22,
        bestBuyingTime: 'Early morning trailer park',
        bargainTip: 'Purchase directly behind the railway tracks where northern trucks unload.'
      },
      {
        itemId: 'mkt_pepper',
        itemName: 'Fresh Tatashe & Rodo Mix',
        category: 'Vegetables',
        unitName: 'Medium Basket',
        currentPrice: 12000,
        averageRegionalPrice: 19000,
        savingsPercent: 36.8,
        savingsAmount: 7000,
        qualityGrade: 'Grade A+ Farm Direct',
        trend: 'down',
        trendPercent: 18,
        bestBuyingTime: 'Morning hours',
        bargainTip: 'Ask for direct Kano baskets for thick, fleshy pepper.'
      }
    ]
  },
  {
    id: 'mkt_smart_deidei',
    name: 'Dei-Dei Building & Grains Market',
    state: 'FCT - Abuja',
    lga: 'Bwari',
    area: 'Dei-Dei Regional Interchange, Zuba-Kubwa Expressway',
    tagline: 'Abuja Primary Grains, Tubers & Wholesale Hub',
    description: 'The largest wholesale food depot in the Federal Capital Territory. Supplies residential Abuja markets (Wuse, Utako, Garki) with grains, yam trucks from Niger/Benue, and truckloads of northern produce.',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    spotterReportsCount: 185,
    distanceKm: 6.8,
    marketType: 'Bulk Grain Depot',
    specialties: ['Foreign & Local Rice', 'Benue Yam Trucks', 'Mudu Measures', 'Groundnut Oil', 'Dry Peppers'],
    averageSavingsVsRetail: 26,
    qualityRatingScore: 95,
    priceIndexScore: 94,
    bestDaysToVisit: 'Mondays & Thursdays (6:30 AM - 12:00 PM)',
    openingHours: '6:00 AM - 6:30 PM Daily',
    bargainingPower: 'High Wholesale Discount',
    directionsGuide: 'Located along Kubwa-Zuba Expressway at Dei-Dei junction. Grain section is at Gate 3.',
    safetyAndLogisticsTip: 'Wholesale prices are measured in standard Mudu and full 50kg/100kg sacks. Bargaining is standard.',
    latitude: 9.1172,
    longitude: 7.2721,
    topDeals: [
      {
        itemId: 'mkt_rice',
        itemName: 'Local Polished Grains (50kg Sack)',
        category: 'Grains',
        unitName: '50kg Sack',
        currentPrice: 92000,
        averageRegionalPrice: 112000,
        savingsPercent: 17.8,
        savingsAmount: 20000,
        qualityGrade: 'Grade A Premium',
        trend: 'down',
        trendPercent: 4,
        bestBuyingTime: 'Morning hours Gate 3',
        bargainTip: 'Stone-free certified polishers operate right inside Shed 4.'
      },
      {
        itemId: 'mkt_yam',
        itemName: 'Zakibiam Big Yams (10 Tubers)',
        category: 'Tubers',
        unitName: '10 Huge Tubers',
        currentPrice: 26000,
        averageRegionalPrice: 38000,
        savingsPercent: 31.6,
        savingsAmount: 12000,
        qualityGrade: 'Grade A+ Farm Direct',
        trend: 'down',
        trendPercent: 12,
        bestBuyingTime: 'Thursday Benue trailer arrival',
        bargainTip: 'Ask for direct Benue farm batch with clean brown skin.'
      }
    ]
  },
  {
    id: 'mkt_smart_dawanau',
    name: 'Dawanau International Grain Market',
    state: 'Kano',
    lga: 'Dawakin Tofa',
    area: 'Dawanau Commercial Zone, Katsina Road, Kano',
    tagline: 'The Grain Capital of West Africa',
    description: 'The largest grain market in the whole of West Africa. Ships thousands of metric tons of local rice, sorghum, millet, beans, soybeans, and sesame seeds across Africa daily at producer prices.',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    rating: 5.0,
    spotterReportsCount: 380,
    distanceKm: 12.0,
    marketType: 'Bulk Grain Depot',
    specialties: ['White & Brown Beans', 'Local Parboiled Rice', 'Millet & Sorghum', 'Soybeans & Maize'],
    averageSavingsVsRetail: 38,
    qualityRatingScore: 99,
    priceIndexScore: 99,
    bestDaysToVisit: 'Tuesdays & Saturdays (6:00 AM - 2:00 PM)',
    openingHours: '6:00 AM - 6:00 PM Daily',
    bargainingPower: 'High Wholesale Discount',
    directionsGuide: 'Katsina Road out of Kano City Centre. Massive logistics truck terminals with licensed grain aggregators.',
    safetyAndLogisticsTip: 'Standard bulk transactions happen in 50kg/100kg bags or full truck consignments. Minimum retail is 1 Mudu.',
    latitude: 12.0833,
    longitude: 8.4167,
    topDeals: [
      {
        itemId: 'mkt_rice',
        itemName: 'Polished Local Farm Rice (50kg Bag)',
        category: 'Grains',
        unitName: '50kg Bag',
        currentPrice: 88000,
        averageRegionalPrice: 110000,
        savingsPercent: 20.0,
        savingsAmount: 22000,
        qualityGrade: 'Grade A+ Farm Direct',
        trend: 'down',
        trendPercent: 5,
        bestBuyingTime: 'Daily morning sessions',
        bargainTip: 'Purchase from certified cooperative associations for purity certification.'
      },
      {
        itemId: 'mkt_beans',
        itemName: 'Clean White / Brown Beans (100kg Bag)',
        category: 'Grains',
        unitName: '100kg Bag',
        currentPrice: 115000,
        averageRegionalPrice: 155000,
        savingsPercent: 25.8,
        savingsAmount: 40000,
        qualityGrade: 'Grade A+ Farm Direct',
        trend: 'down',
        trendPercent: 8,
        bestBuyingTime: 'Weekend aggregation auctions',
        bargainTip: 'Direct farm aggregation without intermediary markup.'
      }
    ]
  },
  {
    id: 'mkt_smart_onitsha',
    name: 'Onitsha Main Market & Ose Okwodu',
    state: 'Anambra',
    lga: 'Onitsha North',
    area: 'Marine Road & River Niger Waterfront, Onitsha',
    tagline: 'Southeast Nigeria Commercial Powerhouse',
    description: 'Massive commercial waterfront depot combining Ose Okwodu fresh produce, riverine fish offloading, and Onitsha Main Market wholesale provisions, spices, and palm oil.',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    spotterReportsCount: 260,
    distanceKm: 3.5,
    marketType: 'Wholesale Farm Hub',
    specialties: ['Pure Palm Oil (25L Kegs)', 'Dry Mangala Fish & Stockfish', 'Abakaliki Rice', 'Tubers & Cassava'],
    averageSavingsVsRetail: 29,
    qualityRatingScore: 96,
    priceIndexScore: 95,
    bestDaysToVisit: 'Mondays & Thursdays (6:00 AM - 11:30 AM)',
    openingHours: '6:30 AM - 6:30 PM (Mon-Sat)',
    bargainingPower: 'High Wholesale Discount',
    directionsGuide: 'Accessible via Marine Road near River Niger port. Ose Okwodu section handles perishables directly from boats.',
    safetyAndLogisticsTip: 'For pure unadulterated red palm oil, buy directly at Ose Okwodu river landing berths.',
    latitude: 6.1558,
    longitude: 6.7794,
    topDeals: [
      {
        itemId: 'mkt_palmoil',
        itemName: 'Pure Red Palm Oil - Nsukka/Enugu Origin (25L Keg)',
        category: 'Oils & Spices',
        unitName: '25L Yellow Keg',
        currentPrice: 38000,
        averageRegionalPrice: 48000,
        savingsPercent: 20.8,
        savingsAmount: 10000,
        qualityGrade: 'Grade A+ Farm Direct',
        trend: 'stable',
        trendPercent: 0,
        bestBuyingTime: 'Early morning river offload',
        bargainTip: 'High density, sweet aroma with zero water blending.'
      },
      {
        itemId: 'mkt_fish',
        itemName: 'Original Norwegian & Scottish Stockfish Cuts',
        category: 'Proteins',
        unitName: 'Medium Bundle',
        currentPrice: 18000,
        averageRegionalPrice: 25000,
        savingsPercent: 28.0,
        savingsAmount: 7000,
        qualityGrade: 'Grade A Premium',
        trend: 'stable',
        trendPercent: 0,
        bestBuyingTime: 'Midday wholesale line',
        bargainTip: 'Inspect ear-cuts and skin thickness along Line 8.'
      }
    ]
  },
  {
    id: 'mkt_smart_oilmill',
    name: 'Oil Mill Market (Port Harcourt)',
    state: 'Rivers',
    lga: 'Obio-Akpor',
    area: 'Eleme Junction / Aba Road Corridor, Port Harcourt',
    tagline: 'Niger Delta Mega Midweek Agricultural Fair',
    description: 'Famous Wednesday mega market drawing farmers, fishermen, and oil millers from across Rivers, Abia, Imo, and Akwa Ibom. Incredible bargains on seafood, snails, garri, and pure palm oil.',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    spotterReportsCount: 215,
    distanceKm: 5.0,
    marketType: 'Wholesale Farm Hub',
    specialties: ['Seafood & Crayfish Bags', 'Jumbo Forest Snails', '25L Palm Oil', 'Fresh Plantains & Cocoa Yam'],
    averageSavingsVsRetail: 32,
    qualityRatingScore: 97,
    priceIndexScore: 96,
    bestDaysToVisit: 'Wednesdays Only (5:30 AM - 2:00 PM)',
    openingHours: '5:30 AM - 7:00 PM (Peak on Wednesdays)',
    bargainingPower: 'High Wholesale Discount',
    directionsGuide: 'Aba Expressway by Eleme flyover junction. Arrive before 7:30 AM for farm gate prices.',
    safetyAndLogisticsTip: 'Wednesday is the super market day; prices drop by 30-40% compared to everyday Port Harcourt retail shops.',
    latitude: 4.8396,
    longitude: 7.0498,
    topDeals: [
      {
        itemId: 'mkt_palmoil',
        itemName: 'Pure Niger Delta Palm Oil (25L Keg)',
        category: 'Oils & Spices',
        unitName: '25L Keg',
        currentPrice: 40000,
        averageRegionalPrice: 52000,
        savingsPercent: 23.1,
        savingsAmount: 12000,
        qualityGrade: 'Grade A+ Farm Direct',
        trend: 'stable',
        trendPercent: 0,
        bestBuyingTime: 'Wednesday early arrival',
        bargainTip: 'Direct from Ikwerre and Etche farm presses.'
      },
      {
        itemId: 'mkt_fish',
        itemName: 'Oron Crayfish (Full Big Sack)',
        category: 'Proteins',
        unitName: 'Large Poly Bag',
        currentPrice: 48000,
        averageRegionalPrice: 68000,
        savingsPercent: 29.4,
        savingsAmount: 20000,
        qualityGrade: 'Grade A+ Farm Direct',
        trend: 'down',
        trendPercent: 5,
        bestBuyingTime: 'Wednesday dawn offloading',
        bargainTip: 'Sweet, sand-free red crayfish directly from Akwa Ibom boats.'
      }
    ]
  },
  {
    id: 'mkt_smart_abakaliki',
    name: 'Abakaliki Rice Mill Market',
    state: 'Ebonyi',
    lga: 'Abakaliki',
    area: 'Ogoja Road Industrial Rice Corridor, Abakaliki',
    tagline: 'Nigeria Rice Milling Capital',
    description: 'Over 2,500 functional rice milling units. Source of genuine stone-free, fragrant short and long grain Nigerian rice directly from millers at genuine ex-factory rates.',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
    rating: 4.9,
    spotterReportsCount: 160,
    distanceKm: 14.0,
    marketType: 'Bulk Grain Depot',
    specialties: ['Abakaliki Polished Rice (50kg)', 'De-stoned Brown Rice', 'Rice Husks & Bran'],
    averageSavingsVsRetail: 33,
    qualityRatingScore: 98,
    priceIndexScore: 98,
    bestDaysToVisit: 'Daily except Sunday (7:00 AM - 4:00 PM)',
    openingHours: '7:00 AM - 6:00 PM Daily',
    bargainingPower: 'High Wholesale Discount',
    directionsGuide: 'Located along Ogoja Road in Abakaliki. Enter central processing sheds for live bag weighing.',
    safetyAndLogisticsTip: 'You can request on-the-spot de-stoning and polishing into branded 50kg, 25kg, or 10kg bags.',
    latitude: 6.3249,
    longitude: 8.1137,
    topDeals: [
      {
        itemId: 'mkt_rice',
        itemName: 'Genuine Abakaliki 100% De-stoned Rice (50kg Bag)',
        category: 'Grains',
        unitName: '50kg Bag',
        currentPrice: 84000,
        averageRegionalPrice: 115000,
        savingsPercent: 27.0,
        savingsAmount: 31000,
        qualityGrade: 'Grade A+ Farm Direct',
        trend: 'down',
        trendPercent: 6,
        bestBuyingTime: 'Morning milling batch',
        bargainTip: 'Taste and texture match foreign rice with superior natural nutrient value.'
      }
    ]
  },
  {
    id: 'mkt_smart_ketu',
    name: 'Ketu Fruit & Produce Market',
    state: 'Lagos',
    lga: 'Kosofe',
    area: 'Ketu Interchange, Ikorodu Road',
    tagline: 'Lagos Premier Fresh Fruit & Plantain Terminal',
    description: 'Major receiving hub for whole plantain bunches, pineapples, oranges, pawpaw, and vegetables shipped from Ogun, Edo, and Osun farms.',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    spotterReportsCount: 142,
    distanceKm: 3.8,
    marketType: 'Wholesale Farm Hub',
    specialties: ['Plantains', 'Pineapples', 'Citrus & Watermelons', 'Fresh Leafy Greens'],
    averageSavingsVsRetail: 26,
    qualityRatingScore: 93,
    priceIndexScore: 92,
    bestDaysToVisit: 'Tuesdays, Thursdays & Saturdays (5:30 AM - 10:00 AM)',
    openingHours: '5:30 AM - 7:00 PM Daily',
    bargainingPower: 'High Wholesale Discount',
    directionsGuide: 'Directly off Ketu Bus Stop before Mile 12. Plantain trucks park in inner line.',
    safetyAndLogisticsTip: 'Purchase whole bunches of green plantain to save 35% compared to sliced retail bunches.',
    latitude: 6.5982,
    longitude: 3.3891,
    topDeals: [
      {
        itemId: 'mkt_plantain',
        itemName: 'Wholesale Farm Plantain (Huge Full Bunch)',
        category: 'Tubers',
        unitName: '1 Huge Bunch',
        currentPrice: 6000,
        averageRegionalPrice: 9000,
        savingsPercent: 33.3,
        savingsAmount: 3000,
        qualityGrade: 'Grade A+ Farm Direct',
        trend: 'down',
        trendPercent: 10,
        bestBuyingTime: 'Tuesday morning farm trailer',
        bargainTip: 'Buy straight from trailer drivers before retail shed middle-men.'
      }
    ]
  }
];



