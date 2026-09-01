import {
  VerificationTask,
  TruthResult,
  MarketItem,
  RecipeItem,
  UserProfile,
  AppNotification,
  NewsArticle,
  StreakRewardItem
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
    verifiedAt: '2 hours ago',
    contributorCount: 3,
    aiMediaAnalysis: {
      status: 'completed',
      details: 'OCR and reverse-claim match completed. Broadcast flyer matches recycled TikTok viral template from Q1 2024 with altered timestamp banner.',
      isOutdatedMedia: true,
      confidenceScore: 94,
      detectedOrigins: 'TikTok Viral Clip Archive (March 2024)'
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
    verifiedAt: '3 hours ago',
    contributorCount: 4,
    aiMediaAnalysis: {
      status: 'outdated_flagged',
      details: 'Video frame analysis on X/Twitter post identified billboard campaign from May 2024 in the background. The video authenticates historical footage repurposed as current news.',
      isOutdatedMedia: true,
      confidenceScore: 98,
      detectedOrigins: 'Twitter/X Archive May 2024 Fuel Disruption'
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
    verifiedAt: '5 hours ago',
    contributorCount: 3,
    aiMediaAnalysis: {
      status: 'completed',
      details: 'Audio transcription and Facebook live trader receipt corroboration matched. High supply influx verified.',
      isOutdatedMedia: false,
      confidenceScore: 91,
      detectedOrigins: 'Facebook Live Stream Traders Bodija'
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
    verifiedAt: 'Yesterday',
    contributorCount: 5,
    aiMediaAnalysis: {
      status: 'completed',
      details: 'YouTube Shorts clip uses altered graphic banner over old 2023 press video. Document typography analysis shows fake corporate header.',
      isOutdatedMedia: false,
      confidenceScore: 97,
      detectedOrigins: 'YouTube Clickbait Short Video Channel'
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
    verifiedAt: '1 day ago',
    contributorCount: 4,
    aiMediaAnalysis: {
      status: 'completed',
      details: 'No official ministry notice found. TikTok video footage from verified contributors confirmed open roadway.',
      isOutdatedMedia: false,
      confidenceScore: 99,
      detectedOrigins: 'TikTok Onitsha Community Live Stream'
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
    verifiedAt: '6 hours ago',
    contributorCount: 7,
    aiMediaAnalysis: {
      status: 'completed',
      details: 'Analysis of viral X / Twitter thread showed distortion of routine policy updates on dependent visas, not a complete ban.',
      isOutdatedMedia: false,
      confidenceScore: 96,
      detectedOrigins: 'X/Twitter Viral Visa Thread'
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
    verifiedAt: '12 hours ago',
    contributorCount: 4,
    aiMediaAnalysis: {
      status: 'completed',
      details: 'TikTok voiceover matched with automated synthetic voice generator overlaid on 2022 macroeconomic press conference.',
      isOutdatedMedia: true,
      confidenceScore: 98,
      detectedOrigins: 'TikTok AI Voiceover Over 2022 Archive'
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
    verifiedAt: '1 day ago',
    contributorCount: 12,
    aiMediaAnalysis: {
      status: 'manipulation_check_passed',
      details: 'Deepfake visual artifact detector flagged unnatural boundary blending around jawline and synthetic voice pitch modulation.',
      isOutdatedMedia: false,
      confidenceScore: 99,
      detectedOrigins: 'Rogue YouTube Hijacked Channel Stream'
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
  tier: 'Bronze' | 'Golden' | 'Deluxe';
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
  secretAppDomain?: string;
  secretAppUrl?: string;
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
    pointsCost: 28000,
    badge: '🥇 Golden Sovereign',
    color: 'from-yellow-600 via-amber-500 to-yellow-400',
    glowColor: 'yellow',
    description: 'Unlocks "The Sabiation" portal giving you direct URLs and free access to generative AI image creation and advanced utility tools.',
    unlocksSabiation: true,
    secretAppDomain: 'avidayo.created.app',
    secretAppUrl: 'https://avidayo.created.app',
    benefits: [
      'Full Lifetime Access to "The Sabiation" free AI tools portal',
      'Direct URLs to 100% free web image generation, OCR & fact forensics tools',
      'Golden Sovereign title badge and 1.5x SABI points boost',
      'Priority verification consensus voting weight in your state'
    ]
  },
  Deluxe: {
    tier: 'Deluxe',
    title: 'Deluxe Sovereign VIP',
    pointsCost: 100000,
    badge: '👑 Deluxe Sovereign VIP',
    color: 'from-emerald-600 via-teal-500 to-cyan-500',
    glowColor: 'emerald',
    description: 'The pinnacle of SABI mastery: includes 1 Full Year of First-Class Customer Service plus an immediate extra +60,000 SABI Points reward!',
    unlocksSabiation: true,
    hasCustomerService: true,
    instantBonusPoints: 60000,
    secretAppDomain: 'avidayo.created.app',
    secretAppUrl: 'https://avidayo.created.app',
    benefits: [
      '1 Full Year of Priority 24/7 Concierge Customer Service & Direct WhatsApp channel with SABI founders',
      'Instant Extra +60,000 SABI Points bonus credited immediately to your balance',
      'All "The Sabiation" elite AI generation tools and premium prompt workflows',
      'Deluxe Sovereign badge with 2x vote power and instant task validation privilege'
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

export const LATEST_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news_001',
    title: 'President Tinubu Commences Three-Week Vacation in Europe',
    summary: 'President Bola Tinubu has begun a three-week vacation in Europe to rest ahead of the 2027 political season.',
    content: 'President Bola Tinubu has commenced a three-week vacation in Europe, described by his media aide as an opportunity to rest and re-energize ahead of the demanding political season leading up to the January 2027 presidential election.',
    category: 'Political News',
    author: 'SABI News Desk',
    publishedAt: 'Just now',
    readTime: '2 min read',
    imageUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=800&auto=format&fit=crop&q=80',
    verifiedSource: 'Official Presidency Media Aide',
    tags: ['Politics', 'President Tinubu', '2027 Election'],
    trendingScore: 99
  },
  {
    id: 'news_002',
    title: 'Central Bank Reports Record High Overseas Remittances',
    summary: 'Nigeria\'s Central Bank reported a record monthly high in overseas remittances, reaching $947 million in July 2026.',
    content: 'Nigeria\'s Central Bank reported a record monthly high in overseas remittances, reaching $947 million in July 2026. This marks a 50.2% increase compared to the same period in 2025 and is nearing the CBN\'s $1 billion monthly target, attributed to reforms aimed at making formal remittance channels more competitive.',
    category: 'Economy',
    author: 'SABI Economic Analyst',
    publishedAt: '2 hours ago',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1579621970588-a35d0e7bb9b6?w=800&auto=format&fit=crop&q=80',
    verifiedSource: 'Central Bank of Nigeria',
    tags: ['Economy', 'Remittances', 'CBN'],
    trendingScore: 95
  },
  {
    id: 'news_003',
    title: 'Nigerian Army Secures Official X Account After Unauthorized Access',
    summary: 'The Nigerian Army reported an attempted unauthorized access to its official X account and urged the public to disregard unverified content.',
    content: 'The Nigerian Army\'s official X (formerly Twitter) account experienced an attempted unauthorized access, leading to the publication of memecoin-related updates. The Army has initiated measures to secure the account and urged the public to disregard unverified content.',
    category: 'Security Alert',
    author: 'SABI Security Desk',
    publishedAt: '4 hours ago',
    readTime: '1 min read',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
    verifiedSource: 'Nigerian Army Official',
    tags: ['Security', 'Cybersecurity', 'Army'],
    trendingScore: 92
  },
  {
    id: 'news_004',
    title: 'Experts Warn of Potential Misinformation Risks for 2027 Elections',
    summary: 'Peacebuilders and experts have warned that misinformation could deepen political tensions as Nigeria approaches the 2027 general elections.',
    content: 'There are warnings from peacebuilders and experts that misinformation could deepen political tensions and incite violence as Nigeria approaches the 2027 general elections. The public is encouraged to cross-reference rumors with verified platforms like SABI.',
    category: 'Fact Check Alert',
    author: 'SABI Truth Sentinel',
    publishedAt: '6 hours ago',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80',
    verifiedSource: 'Democracy & Peace Experts',
    tags: ['Election', 'Misinformation', 'Fact Check'],
    trendingScore: 90
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


