import { AppLanguage } from '../types';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  home: string;
  market: string;
  report: string;
  verify: string;
  truth: string;
  truthEngine: string;
  marketPrices: string;
  avidResearch: string;
  sabiChat: string;
  sabiers: string;
  recipe: string;
  recipes: string;
  forensics: string;
  rumorMap: string;
  stats: string;
  about: string;
  creator: string;
  admin: string;
  signIn: string;
  signUp: string;
  signOut: string;
  profile: string;
  howItWorks: string;
  saboAi: string;
  liveGpsActive: string;
  gpsTracking: string;
  gpsLocked: string;
  gpsAccuracy: string;
  localAlerts: string;
  pushAlertsActive: string;
  enableAlerts: string;
  breakingNews: string;
  verifiedTruth: string;
  foodPrices: string;
  searchPlaceholder: string;
  reportRumor: string;
  reportPrice: string;
  deepfakeScanner: string;
  statusTitles: string;
  trustLevel: string;
  points: string;
  welcomeBack: string;
  languageSelect: string;
  nightMode: string;
  lightMode: string;
  liveSabiersTitle: string;
  liveSabiersSubtitle: string;
  chatNow: string;
  joinRoom: string;
  trendingRumors: string;
  termsAndPrivacy: string;
  agreeTerms: string;
  readTerms: string;
  allNigeria: string;
  browseFeed: string;
  spottersOnline: string;
  crossVerifyPrompt: string;
  rumorsToday: string;
  socialPlatforms: string;
  snapRumorBtn: string;
  heroHeadline: string;
  heroSubtitle: string;
  dailyRumorsTitle: string;
  dailyRumorsSubtitle: string;
  activeOnline: string;
  joinLiveChat: string;
  liveBadge: string;
  liveChatPrompt: string;
  umapTitle: string;
  umapSubtitle: string;
  tracingMode: string;
  tracingOn: string;
  tracingOff: string;
  tracingActiveDesc: string;
  tracingPausedDesc: string;
  proximityAlertTitle: string;
  proximityAlertNear: string;
  proximityAlertContextSafe: string;
  privacyDisclaimerTitle: string;
  privacyDisclaimerBody: string;
  socialMediaRumorFeedTitle: string;
  socialMediaRumorFeedSubtitle: string;
  inspectForensics: string;
  verifyOnGround: string;
  dismissAlert: string;
  snoozeAlert: string;
  radarLegendTrue: string;
  radarLegendFalse: string;
  radarLegendOutdated: string;
  exactStreetRoad: string;
  lgaLabel: string;
  stateCountryLabel: string;
  gpsCoordsLabel: string;
  copyCoordsBtn: string;
  snapStreetBtn: string;
}

export const LANGUAGE_NAMES: Record<AppLanguage, { name: string; nativeName: string; flag: string }> = {
  english: { name: 'English', nativeName: 'English', flag: '🇬🇧' },
  yoruba: { name: 'Yoruba', nativeName: 'Èdè Yorùbá', flag: '🇳🇬' },
  igbo: { name: 'Igbo', nativeName: 'Asụsụ Igbo', flag: '🇳🇬' },
  hausa: { name: 'Hausa', nativeName: 'Harshen Hausa', flag: '🇳🇬' },
  pidgin: { name: 'Pidgin', nativeName: 'Naija Pidgin', flag: '🇳🇬' }
};

export const TRANSLATIONS: Record<AppLanguage, TranslationDictionary> = {
  english: {
    appName: 'SABI',
    tagline: 'Truth & Prices',
    home: 'Home',
    market: 'Market',
    report: 'Snap Rumor',
    verify: 'Verify',
    truth: 'Truth Feed',
    truthEngine: 'Truth Engine',
    marketPrices: 'Market Prices',
    avidResearch: 'Avid Research',
    sabiChat: 'Sabi Chat',
    sabiers: 'Live Sabiers',
    recipe: 'Recipes',
    recipes: 'Food Recipes',
    forensics: 'Forensics',
    rumorMap: 'Rumor Map',
    stats: 'Stats (D3)',
    about: 'Creator',
    creator: 'Creator',
    admin: 'Admin',
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    profile: 'Profile',
    howItWorks: 'How It Works',
    saboAi: 'Sabo AI',
    liveGpsActive: 'Live GPS Active',
    gpsTracking: 'Tracking Geolocation',
    gpsLocked: 'Location Locked',
    gpsAccuracy: 'Accuracy',
    localAlerts: 'Local Alerts',
    pushAlertsActive: 'Local Push Alerts Active',
    enableAlerts: 'Enable Push Alerts',
    breakingNews: 'Breaking Alert',
    verifiedTruth: 'Verified Truth',
    foodPrices: 'Foodstuff Prices',
    searchPlaceholder: 'Search viral rumors, market food prices, deepfakes...',
    reportRumor: 'Report Rumor',
    reportPrice: 'Report Market Price',
    deepfakeScanner: 'Deepfake Scanner',
    statusTitles: 'Status Titles',
    trustLevel: 'Trust Title',
    points: 'Points',
    welcomeBack: 'Welcome back',
    languageSelect: 'Change Language',
    nightMode: 'Dark Mode',
    lightMode: 'Light Mode',
    liveSabiersTitle: 'Live Sabiers & Spotters Online',
    liveSabiersSubtitle: 'Active community verifiers across 36 Nigerian states ready to cross-check claims.',
    chatNow: 'Chat Live',
    joinRoom: 'Join Room',
    trendingRumors: 'Today\'s Viral Rumor Bulletins (TikTok, X, Instagram, YouTube)',
    termsAndPrivacy: 'Terms of Service & Community Code of Conduct',
    agreeTerms: 'I agree to the SABI Community Terms, Privacy Policy & Verification Truth Guidelines',
    readTerms: 'Read Terms',
    allNigeria: 'All Nigeria',
    browseFeed: 'Browsing verification feed for',
    spottersOnline: 'Spotters Live Now',
    crossVerifyPrompt: 'Active spotters are online in Nigeria! Join the live room to cross-verify claims in real time.',
    rumorsToday: 'Today\'s Rumors',
    socialPlatforms: 'Social Media Feeds',
    snapRumorBtn: 'SNAP A RUMOR',
    heroHeadline: 'See something that does not look correct?',
    heroSubtitle: 'Submit suspicious claims, photos, market price rumors, or viral videos to SABI and help verify what is actually happening.',
    dailyRumorsTitle: 'Daily Social Media Rumors',
    dailyRumorsSubtitle: 'Live tracking viral claims from Instagram, YouTube, TikTok, and Twitter (X) across Nigeria.',
    activeOnline: 'Active Online',
    joinLiveChat: 'Join Live Sabiers Chat',
    liveBadge: 'LIVE NOW',
    liveChatPrompt: 'You are live! Chat with other spotters across Nigeria to confirm rumors in real-time.',
    umapTitle: 'UMap Street-Level Radar & Proximity Sentinel',
    umapSubtitle: 'High-precision Nigerian street tracing for verified rumor alerts, safety warnings, and live market intelligence.',
    tracingMode: 'Live Geolocation Tracing',
    tracingOn: 'Tracing: ON',
    tracingOff: 'Tracing: OFF',
    tracingActiveDesc: 'Real-time proximity safety radar is actively watching your Nigerian district for viral rumors and market panic.',
    tracingPausedDesc: 'Tracing is currently paused. Enable tracing to receive high-priority safety warnings when near rumor sites.',
    proximityAlertTitle: 'HIGH-PRIORITY SAFETY PROXIMITY ALERT',
    proximityAlertNear: 'You are physically near a reported suspicious rumor site!',
    proximityAlertContextSafe: 'Safety Guidance: Do not panic, avoid spreading unverified voice notes or forward messages. Public transport and markets operate normally unless verified on ground.',
    privacyDisclaimerTitle: 'SABI Privacy & Pure Safety Tracing Guarantee',
    privacyDisclaimerBody: 'Location data is processed exclusively on your device to calculate distance to community rumor incidents and send proximity safety warnings. SABI does not track your personal identity, store GPS movement logs on remote servers, or share location with third parties. Tracing is strictly for community awareness and physical safety.',
    socialMediaRumorFeedTitle: 'Live Social Media Rumors (TikTok, X, Instagram, YouTube)',
    socialMediaRumorFeedSubtitle: 'Current trending claims and viral videos originating from social platforms in your tracked Nigerian area.',
    inspectForensics: 'Inspect Forensics & Video',
    verifyOnGround: 'Verify on Ground (+50 PTS)',
    dismissAlert: 'Dismiss Warning',
    snoozeAlert: 'Snooze Alert',
    radarLegendTrue: 'Verified True',
    radarLegendFalse: 'Misleading / False',
    radarLegendOutdated: 'Recycled / Under Review',
    exactStreetRoad: 'Exact Street / Road',
    lgaLabel: 'Local Gov Area (LGA)',
    stateCountryLabel: 'State & Country',
    gpsCoordsLabel: 'GPS Coordinates',
    copyCoordsBtn: 'Copy Coordinates',
    snapStreetBtn: 'Snap Rumor from This Street (+25 PTS)'
  },
  yoruba: {
    appName: 'SABI',
    tagline: 'Òtítọ́ àti Iye Owó',
    home: 'Ilé',
    market: 'Ọjà',
    report: 'Ròyìn Òfófó',
    verify: 'Fìdí Rẹ Múlẹ̀',
    truth: 'Òtítọ́ Ọ̀rọ̀',
    truthEngine: 'Ẹ̀rọ Òtítọ́',
    marketPrices: 'Iye Owó Ọjà',
    avidResearch: 'Ìwádìí Ọ̀rọ̀',
    sabiChat: 'Ìfọ̀rọ̀wérọ̀ SABI',
    sabiers: 'Àwọn Spotter',
    recipe: 'Oúnjẹ',
    recipes: 'Àkójọ Oúnjẹ',
    forensics: 'Ayẹ̀wò Fídíò',
    rumorMap: 'Àwòrán Òfófó',
    stats: 'Àkọsílẹ̀ D3',
    about: 'Olùdásílẹ̀',
    creator: 'Olùdásílẹ̀',
    admin: 'Alábòójútó',
    signIn: 'Wọlé',
    signUp: 'Forúkọsílẹ̀',
    signOut: 'Jáde',
    profile: 'Ojúewé Mi',
    howItWorks: 'Bí Ó Ṣe Ń Ṣiṣẹ́',
    saboAi: 'Sabo AI',
    liveGpsActive: 'GPS Ń Ṣiṣẹ́ Lọ́wọ́',
    gpsTracking: 'Wíwá Ibùdó Rẹ',
    gpsLocked: 'Ibùdó Ti Wà Nípò',
    gpsAccuracy: 'Ìpéye',
    localAlerts: 'Ìkìlọ̀ Àdúgbò',
    pushAlertsActive: 'Ìkìlọ̀ Àdúgbò Ti Wà Lọ́wọ́',
    enableAlerts: 'Mú Ìkìlọ̀ Ṣiṣẹ́',
    breakingNews: 'Ìròyìn Pàjáwìrì',
    verifiedTruth: 'Òtítọ́ Tí A Ti Fìdí Rẹ̀ Múlẹ̀',
    foodPrices: 'Iye Owó Oúnjẹ',
    searchPlaceholder: 'Ṣàwárí òfófó, iye owó oúnjẹ, fídíò ayédèrú...',
    reportRumor: 'Ròyìn Òfófó',
    reportPrice: 'Ròyìn Iye Owó Ọjà',
    deepfakeScanner: 'Ayẹ̀wò Ayédèrú',
    statusTitles: 'Oyè Ipò',
    trustLevel: 'Oyè Ìgbẹ́kẹ̀lé',
    points: 'Àwọn Kókó',
    welcomeBack: 'Ẹ káàbọ̀ padà',
    languageSelect: 'Yí Èdè Padà',
    nightMode: 'Ipò Òkùnkùn',
    lightMode: 'Ipò Ìmọ́lẹ̀',
    liveSabiersTitle: 'Àwọn Spotter Tí Wọ́n Wà Lórí Ayélujára',
    liveSabiersSubtitle: 'Àwọn olùṣàyẹ̀wò ti wà lórí ayélujára ní gbogbo ìpínlẹ̀ Nàìjíríà láti fìdí ọ̀rọ̀ múlẹ̀.',
    chatNow: 'Sọ̀rọ̀ Lẹ́sẹ̀kẹsẹ̀',
    joinRoom: 'Wọ Yàrá',
    trendingRumors: 'Àwọn Òfófó Òde Òní (TikTok, X, Instagram, YouTube)',
    termsAndPrivacy: 'Àdéhùn Ìlò àti Ìlànà Àdúgbò SABI',
    agreeTerms: 'Mo gbà sí àwọn àdéhùn SABI, ìpamọ́ àti àwọn ìlànà ìmúṣẹ òtítọ́',
    readTerms: 'Ka Àdéhùn',
    allNigeria: 'Gbogbo Nàìjíríà',
    browseFeed: 'Wiwo ìfìdí-múlẹ̀ fún',
    spottersOnline: 'Àwọn Spotter Wà Lórí Ayélujára',
    crossVerifyPrompt: 'Àwọn olùṣàyẹ̀wò wà lórí ayélujára nísinsìnyí! Wọlé láti bá wọn sọ̀rọ̀.',
    rumorsToday: 'Òfófó Òde Òní',
    socialPlatforms: 'Àwọn Ayélujára',
    snapRumorBtn: 'RÒYÌN ÒFÓFÓ',
    heroHeadline: 'Ǹjẹ́ o rí ohun tí kò tọ̀nà?',
    heroSubtitle: 'Fi àwọn ọ̀rọ̀ afurasi, fọ́tò, iye owó ọjà, tàbí fídíò ránṣẹ́ sí SABI láti fìdí òtítọ́ múlẹ̀.',
    dailyRumorsTitle: 'Àwọn Òfófó Lórí Ayélujára Lóòjọ́',
    dailyRumorsSubtitle: 'Títọpinpin àwọn ọ̀rọ̀ afurasi láti Instagram, YouTube, TikTok, àti Twitter (X).',
    activeOnline: 'Wà Lórí Ayélujára',
    joinLiveChat: 'Darapọ̀ Mọ́ Ìjíròrò Sabiers',
    liveBadge: 'WÀ LÁÀYÈ',
    liveChatPrompt: 'O wà lórí ayélujára! Bá àwọn ọmọ ẹgbẹ́ sọ̀rọ̀ láti fìdí òfófó múlẹ̀.',
    umapTitle: 'UMap: Àwòrán Àdúgbò àti Ìkìlọ̀ Pàjáwìrì',
    umapSubtitle: 'Wíwá ibùdó tòótọ́ lórí pópónà Nàìjíríà fún ìkìlọ̀ ààbò àti òfófó tí a ti fìdí rẹ̀ múlẹ̀.',
    tracingMode: 'Wíwá Ibùdó Lẹ́sẹ̀kẹsẹ̀',
    tracingOn: 'Wíwá Ibùdó: Ń ṢIṢẸ́',
    tracingOff: 'Wíwá Ibùdó: TI PÀPÀṢẸ',
    tracingActiveDesc: 'Ẹ̀rọ ń ṣàyẹ̀wò àdúgbò rẹ fún àwọn ọ̀rọ̀ afurasi àti ìkìlọ̀ ààbò.',
    tracingPausedDesc: 'Wíwá ibùdó ti dákẹ́. Tàn-án kí o lè gba ìkìlọ̀ pàjáwìrì nígbà tí o bá súnmọ́ ibi tí òfófó wà.',
    proximityAlertTitle: 'ÌKÌLỌ̀ PÀJÁWÌRÌ PÀTÀKÌ LÓRÍ ÀÀBÒ',
    proximityAlertNear: 'O wà nítòsí ibi tí wọ́n ti ròyìn òfófó afurasi kan!',
    proximityAlertContextSafe: 'Ìmọ̀ràn Ààbò: Má ṣe bẹ̀rù, yẹra fún títan ohùn orí ayélujára kálẹ̀ tí a kò fìdí rẹ̀ múlẹ̀. Ọjà àti ọkọ̀ ń lọ déédéé.',
    privacyDisclaimerTitle: 'Ìlérí Ìpamọ́ àti Ààbò SABI',
    privacyDisclaimerBody: 'A ń lo ibùdó rẹ lórí fóònù rẹ nìkan láti ṣírò bí o ṣe súnmọ́ ibi tí òfófó wà. SABI kì í tọ́jú ibùdó rẹ sí orí ayélujára tàbí pín in pẹ̀lú ẹlòmíràn. Ààbò rẹ nìkan ni a wá.',
    socialMediaRumorFeedTitle: 'Òfófó Lórí Ayélujára Lóòjọ́ (TikTok, X, Instagram, YouTube)',
    socialMediaRumorFeedSubtitle: 'Àwọn ọ̀rọ̀ afurasi tí ń gbilẹ̀ láti orí ayélujára ní agbègbè rẹ ní Nàìjíríà.',
    inspectForensics: 'Wo Ayẹ̀wò Fídíò & Ẹ̀rí',
    verifyOnGround: 'Fìdí Rẹ Múlẹ̀ Ní Pópónà (+50 PTS)',
    dismissAlert: 'Pa Ìkìlọ̀ Rẹ́',
    snoozeAlert: 'Dádúró Fún Ìgbà Díẹ̀',
    radarLegendTrue: 'Òtítọ́ Tí A Fìdí Múlẹ̀',
    radarLegendFalse: 'Irọ́ / Ẹ̀tàn',
    radarLegendOutdated: 'Àtijọ́ / Ń Yẹ̀wò',
    exactStreetRoad: 'Pópónà / Ojú Ọ̀nà Tòótọ́',
    lgaLabel: 'Ijọba Ìbílẹ̀ (LGA)',
    stateCountryLabel: 'Ìpínlẹ̀ àti Orílẹ̀-Èdè',
    gpsCoordsLabel: 'Àkọsílẹ̀ GPS',
    copyCoordsBtn: 'Da Àkọsílẹ̀ Kọ',
    snapStreetBtn: 'Ròyìn Òfófó Lórí Pópónà Yìí (+25 PTS)'
  },
  igbo: {
    appName: 'SABI',
    tagline: 'Eziokwu na Ọnụahịa',
    home: 'Ụlọ',
    market: 'Ahịa',
    report: 'Kpesa Asịrị',
    verify: 'Nyochaa',
    truth: 'Nri Eziokwu',
    truthEngine: 'Ngwa Eziokwu',
    marketPrices: 'Ọnụahịa Ahịa',
    avidResearch: 'Nnyocha Miriela',
    sabiChat: 'Nkata SABI',
    sabiers: 'Ndị Sabier',
    recipe: 'Nri',
    recipes: 'Usoro Nri',
    forensics: 'Nnyocha Vidiyo',
    rumorMap: 'Maapụ Akụkọ Asịrị',
    stats: 'Ọnụọgụgụ D3',
    about: 'Onye Kere Ya',
    creator: 'Onye Kere Ya',
    admin: 'Onye Nlekọta',
    signIn: 'Banye',
    signUp: 'Debanye Aha',
    signOut: 'Pụọ',
    profile: 'Profaịlụ M',
    howItWorks: 'Otu O Si Arụ Ọrụ',
    saboAi: 'Sabo AI',
    liveGpsActive: 'GPS Na-arụ Ọrụ',
    gpsTracking: 'Nchọpụta Ebe Ị Nọ',
    gpsLocked: 'Achọtala Ebe Ị Nọ',
    gpsAccuracy: 'Ezi Ogo',
    localAlerts: 'Ịdọ Aka Ná Ntị Mpaghara',
    pushAlertsActive: 'Ịdọ Aka Ná Ntị Dị Njikere',
    enableAlerts: 'Gbanwuo Ịdọ Aka Ná Ntị',
    breakingNews: 'Akụkọ Dị Mkpa',
    verifiedTruth: 'Eziokwu E Gosipụtara',
    foodPrices: 'Ọnụahịa Nri',
    searchPlaceholder: 'Chọọ asịrị, ọnụahịa nri, vidiyo aghụghọ...',
    reportRumor: 'Kpesa Asịrị',
    reportPrice: 'Kpesa Ọnụahịa Ahịa',
    deepfakeScanner: 'Nnyocha Deepfake',
    statusTitles: 'Ọkwa Aha',
    trustLevel: 'Ọkwa Ntụkwasị Obi',
    points: 'Isi Ihe',
    welcomeBack: 'Nnọọ ọzọ',
    languageSelect: 'Gbanwee Asụsụ',
    nightMode: 'Ọnọdụ Abalị',
    lightMode: 'Ọnọdụ Ìhè',
    liveSabiersTitle: 'Ndị Spotter Dị Ndụ Ugbu A',
    liveSabiersSubtitle: 'Ndị na-enyocha akụkọ nọ n\'ọrụ n\'ofe steeti 36 nke Naịjirịa.',
    chatNow: 'Kpaa Nkata',
    joinRoom: 'Banye n\'Ọnụlọ',
    trendingRumors: 'Akụkọ Asịrị Taa (TikTok, X, Instagram, YouTube)',
    termsAndPrivacy: 'Usoro Ọrụ & Ntuziaka Obodo SABI',
    agreeTerms: 'Ekwenyere m na Usoro SABI, Iwu Nzuzo & Ntuziaka Eziokwu',
    readTerms: 'Gụọ Usoro',
    allNigeria: 'Naịjirịa Niile',
    browseFeed: 'Na-elele nnyocha maka',
    spottersOnline: 'Ndị Spotter Dị Ndụ',
    crossVerifyPrompt: 'Ndị nyocha nọ n\'ịntanetị ugbu a na Naịjirịa! Banye kparịta ụka.',
    rumorsToday: 'Asịrị Taa',
    socialPlatforms: 'Mgbasa Ozi Ọha',
    snapRumorBtn: 'KPESA ASỊRỊ',
    heroHeadline: 'Ị hụrụ ihe na-adịghị mma?',
    heroSubtitle: 'Zipu akụkọ na-enyo enyo, foto, ọnụahịa ahịa ma ọ bụ vidiyo na SABI iji nyochaa eziokwu.',
    dailyRumorsTitle: 'Akụkọ Asịrị Mgbasa Ozi Ọha Taa',
    dailyRumorsSubtitle: 'Nnyocha asịrị na-efe efe sitere na Instagram, YouTube, TikTok, na Twitter (X).',
    activeOnline: 'Dị Ndụ n\'Ịntanetị',
    joinLiveChat: 'Banye Nkata Sabiers Dị Ndụ',
    liveBadge: 'DỊ NDỤ',
    liveChatPrompt: 'Ị nọ n\'ịntanetị! Kparịta ụka na ndị ọzọ nọ na Naịjirịa iji kwado asịrị.',
    umapTitle: 'UMap: Maapụ Okporo Ámá na Ịdọ Aka Ná Ntị',
    umapSubtitle: 'Nchọpụta ebe dị elu n\'okporo ámá Naịjirịa maka nchekwa na asịrị e gosipụtara.',
    tracingMode: 'Nchọpụta Ebe Dị Ndụ',
    tracingOn: 'Nchọpụta: NA-ARỤ ỌRỤ',
    tracingOff: 'Nchọpụta: AKWỤSỊLA',
    tracingActiveDesc: 'Ngwa nchedo na-enyocha mpaghara gị maka asịrị na nsogbu ọnụahịa ahịa.',
    tracingPausedDesc: 'A kwụsịtụrụ nchọpụta ebe. Gbanwuo ya iji nata ịdọ aka ná ntị mgbe ị nọ nso asịrị.',
    proximityAlertTitle: 'ỊDỌ AKA NÁ NTỊ NCHEKWA DỊ MKPA',
    proximityAlertNear: 'Ị nọ nso ebe a kọrọ akụkọ asịrị na-enyo enyo!',
    proximityAlertContextSafe: 'Ntuziaka Nchekwa: Atụla ụjọ, zere iziga ozi olu a na-egozighị. Ahịa na njem na-aga nke ọma.',
    privacyDisclaimerTitle: 'Nkwa Nzuzo na Nchekwa SABI',
    privacyDisclaimerBody: 'A na-eji ebe ị nọ eme ihe naanị na ekwentị gị iji nyochaa anya gị na asịrị. SABI anaghị echekwa ebe ị gara na sava ma ọ bụ ree ya. Nchekwa obodo bụ naanị ihe mgbaru ọsọ anyị.',
    socialMediaRumorFeedTitle: 'Asịrị Mgbasa Ozi Ọha Taa (TikTok, X, Instagram, YouTube)',
    socialMediaRumorFeedSubtitle: 'Akụkọ asịrị na vidiyo na-efe efe sitere na mgbasa ozi ọha na mpaghara gị.',
    inspectForensics: 'Lee Nnyocha Vidiyo na Ihe Akaebe',
    verifyOnGround: 'Nyochaa n\'Okporo Ámá (+50 PTS)',
    dismissAlert: 'Wepụ Ịdọ Aka Ná Ntị',
    snoozeAlert: 'Kwụsịtụ Ntị',
    radarLegendTrue: 'Eziokwu E Gosipụtara',
    radarLegendFalse: 'Ụgha / Aghụghọ',
    radarLegendOutdated: 'Kekọtara Ochie / Na-enyocha',
    exactStreetRoad: 'Ezigbo Okporo Ámá',
    lgaLabel: 'Gọọmentị Mpaghara (LGA)',
    stateCountryLabel: 'Steeti na Obodo',
    gpsCoordsLabel: 'Ebe GPS',
    copyCoordsBtn: 'Depụtaghachi GPS',
    snapStreetBtn: 'Kpesa Asịrị n\'Okporo Ámá A (+25 PTS)'
  },
  hausa: {
    appName: 'SABI',
    tagline: 'Gaskiya da Farashin Kaya',
    home: 'Gida',
    market: 'Kasuwa',
    report: 'Ba da Rahoto',
    verify: 'Tabbatar',
    truth: 'Tabbatacciyar Gaskiya',
    truthEngine: 'Injin Gaskiya',
    marketPrices: 'Farashin Kasuwa',
    avidResearch: 'Bincike Mai Zurfi',
    sabiChat: 'Tattaunawar SABI',
    sabiers: 'Masu Sabiers',
    recipe: 'Girke-girke',
    recipes: 'Girke-girke',
    forensics: 'Binciken Bidiyo',
    rumorMap: 'Taswirar Jita-jita',
    stats: 'Kididdigar D3',
    about: 'Mahalicci',
    creator: 'Mahalicci',
    admin: 'Manaja',
    signIn: 'Shiga',
    signUp: 'Yi Rajista',
    signOut: 'Fita',
    profile: 'Bayanina',
    howItWorks: 'Yadda Yake Aiki',
    saboAi: 'Sabo AI',
    liveGpsActive: 'GPS Yana Aiki Kai Tsaye',
    gpsTracking: 'Ana Bin Wurin Da Kake',
    gpsLocked: 'An Tabbatar da Wuri',
    gpsAccuracy: 'Daidaito',
    localAlerts: 'Gargaɗin Wuri',
    pushAlertsActive: 'Gargaɗin Wuri Yana Aiki',
    enableAlerts: 'Kunna Gargaɗi',
    breakingNews: 'Labari Mai Zafi',
    verifiedTruth: 'Tabbatacciyar Gaskiya',
    foodPrices: 'Farashin Abinci',
    searchPlaceholder: 'Bincika jita-jita, farashin abinci, bidiyon jabu...',
    reportRumor: 'Ba da Rahoton Jita-jita',
    reportPrice: 'Ba da Rahoton Farashi',
    deepfakeScanner: 'Binciken Deepfake',
    statusTitles: 'Matsayin Suna',
    trustLevel: 'Matsayin Amana',
    points: 'Maki',
    welcomeBack: 'Barka da dawowa',
    languageSelect: 'Zaɓi Harshe',
    nightMode: 'Yanayin Dare',
    lightMode: 'Yanayin Rana',
    liveSabiersTitle: 'Masu Bibiyar Gaskiya Suna Kai Tsaye',
    liveSabiersSubtitle: 'Masu tabbatar da labarai a jihohin Najeriya 36 a shirye suke don aiki.',
    chatNow: 'Yi Magana Yanzu',
    joinRoom: 'Shiga Daki',
    trendingRumors: 'Jita-jitar Yau (TikTok, X, Instagram, YouTube)',
    termsAndPrivacy: 'Sharuɗɗan Sabis & Ka\'idojin Al\'ummar SABI',
    agreeTerms: 'Na amince da Sharuɗɗan SABI, Manufofin Sirri & Ka\'idojin Gaskiya',
    readTerms: 'Karanta Sharuɗɗa',
    allNigeria: 'Duk Najeriya',
    browseFeed: 'Ana duba binciken',
    spottersOnline: 'Masu Dubawa Suna Kai Tsaye',
    crossVerifyPrompt: 'Masu tabbatarwa suna kan layi yanzu a Najeriya! Shiga don tattaunawa.',
    rumorsToday: 'Jita-jitar Yau',
    socialPlatforms: 'Dandalin Sada Zumunta',
    snapRumorBtn: 'BA DA RAHOTON JITA-JITA',
    heroHeadline: 'Ka ga wani abu da ba daidai ba?',
    heroSubtitle: 'Aika da jita-jita, hotuna, farashin kasuwa ko bidiyo zuwa SABI don tabbatar da gaskiya.',
    dailyRumorsTitle: 'Jita-jitar Kafofin Sadarwa Ta Yau',
    dailyRumorsSubtitle: 'Bin diddigin jita-jita daga Instagram, YouTube, TikTok, da Twitter (X).',
    activeOnline: 'Yana Kan Layi',
    joinLiveChat: 'Shiga Tattaunawar Sabiers',
    liveBadge: 'KAI TSAYE',
    liveChatPrompt: 'Kana kan layi! Tattauna da sauran masu tabbatarwa a Najeriya yanzu.',
    umapTitle: 'UMap: Taswirar Tituna da Gargadin Tsaro',
    umapSubtitle: 'Babban binciken wurare a kan titunan Najeriya domin tsaro da tabbatar da jita-jita.',
    tracingMode: 'Binciken Wuri Kai Tsaye',
    tracingOn: 'Binciken Wuri: YANA AIKI',
    tracingOff: 'Binciken Wuri: AN TSAYA',
    tracingActiveDesc: 'Kayan tsaro yana duba yankinku don jita-jita da tashin farashin abinci.',
    tracingPausedDesc: 'An dakatar da binciken wuri. Kunna shi don samun gargaɗin tsaro kusa da jita-jita.',
    proximityAlertTitle: 'GARGAƊIN TSARO MAI MATUKAR MUHIMMANCI',
    proximityAlertNear: 'Kana kusa da wurin da aka bayar da rahoton wata jita-jita mai shakku!',
    proximityAlertContextSafe: 'Shawarar Tsaro: Kada ku firgita ko yada sautin murya da ba a tabbatar ba. Kasuwanni da motoci na tafiya yadda ya kamata.',
    privacyDisclaimerTitle: 'Alƙawarin Tsare Sirri da Tsaro na SABI',
    privacyDisclaimerBody: 'Ana amfani da wurinku a wayarku kawai domin lissafin nisan ku da jita-jita. SABI ba ya ajiye bayananku a kan sabobin waje ko sayar da su. Tsaron al\'umma shine babban burinmu.',
    socialMediaRumorFeedTitle: 'Jita-jitar Kafofin Sada Zumunta Ta Yau (TikTok, X, Instagram, YouTube)',
    socialMediaRumorFeedSubtitle: 'Jita-jita da bidiyon da ke yawo daga dandalin sada zumunta a yankinku a Najeriya.',
    inspectForensics: 'Duba Binciken Bidiyo da Shaidu',
    verifyOnGround: 'Tabbatar a Titin Kai Tsaye (+50 PTS)',
    dismissAlert: 'Cire Gargaɗi',
    snoozeAlert: 'Dakatar da Gargaɗi',
    radarLegendTrue: 'Tabbatacciyar Gaskiya',
    radarLegendFalse: 'Karya / Jabu',
    radarLegendOutdated: 'Tsohon Labari / Ana Dubawa',
    exactStreetRoad: 'Cikakken Titi / Hanya',
    lgaLabel: 'Karamar Hukuma (LGA)',
    stateCountryLabel: 'Jiha da Kasa',
    gpsCoordsLabel: 'Titin GPS',
    copyCoordsBtn: 'Kwafi GPS',
    snapStreetBtn: 'Ba da Rahoto a Kan Wannan Titi (+25 PTS)'
  },
  pidgin: {
    appName: 'SABI',
    tagline: 'Real Truth & Market Price',
    home: 'Home',
    market: 'Market',
    report: 'Snap Rumor',
    verify: 'Verify Gist',
    truth: 'Truth Room',
    truthEngine: 'Truth Engine',
    marketPrices: 'Market Price',
    avidResearch: 'Deep Gist Check',
    sabiChat: 'Sabi Chat Room',
    sabiers: 'Live Sabiers',
    recipe: 'Chow',
    recipes: 'Food Recipes',
    forensics: 'Video & Voice Forensics',
    rumorMap: 'Gossip Map',
    stats: 'Stats (D3)',
    about: 'The Creator',
    creator: 'The Creator',
    admin: 'Admin Oga',
    signIn: 'Sign In',
    signUp: 'Register / Sign Up',
    signOut: 'Sign Out',
    profile: 'My Profile',
    howItWorks: 'How E Dey Work',
    saboAi: 'Sabo AI',
    liveGpsActive: 'GPS Dey Live',
    gpsTracking: 'Dey Track Your Location',
    gpsLocked: 'Location Don Set',
    gpsAccuracy: 'Accuracy Meter',
    localAlerts: 'Area Alerts',
    pushAlertsActive: 'Local Push Alert Dey Active',
    enableAlerts: 'Turn On Push Alerts',
    breakingNews: 'Hot Gist Alert',
    verifiedTruth: 'Confirmed Original Truth',
    foodPrices: 'Foodstuff Market Price',
    searchPlaceholder: 'Search fake news, viral voice note, food prices...',
    reportRumor: 'Report New Rumor',
    reportPrice: 'Report Market Price',
    deepfakeScanner: 'Deepfake Scanner',
    statusTitles: 'Status Titles',
    trustLevel: 'Trust Rank',
    points: 'Points',
    welcomeBack: 'Welcome back bro/sis',
    languageSelect: 'Change Language',
    nightMode: 'Dark Mode (Night)',
    lightMode: 'Light Mode (Day)',
    liveSabiersTitle: 'Live Sabiers & Spotters Online Now',
    liveSabiersSubtitle: 'Real people across 36 Naija states dey online ready to verify any gist.',
    chatNow: 'Yarn Live',
    joinRoom: 'Enter Room',
    trendingRumors: 'Today Viral Rumors (TikTok, X, Instagram, YouTube)',
    termsAndPrivacy: 'SABI Terms of Service & Community Rules',
    agreeTerms: 'I agree to SABI Community Terms, Privacy Policy & Truth Rules',
    readTerms: 'Read Terms',
    allNigeria: 'All Naija',
    browseFeed: 'Dey check verification for',
    spottersOnline: 'Spotters Dey Live',
    crossVerifyPrompt: 'Active spotters dey online for Naija now! Enter live chat room make una cross-check gist.',
    rumorsToday: 'Today Gist',
    socialPlatforms: 'Social Media Channels',
    snapRumorBtn: 'SNAP A RUMOR',
    heroHeadline: 'You see something wey no clear you?',
    heroSubtitle: 'Send suspicious claims, photos, market price rumors, or viral videos to SABI make we verify wetin really dey happen.',
    dailyRumorsTitle: 'Today Viral Social Media Rumors',
    dailyRumorsSubtitle: 'Live gist check from Instagram, YouTube, TikTok, and Twitter (X) across Naija.',
    activeOnline: 'Dey Online',
    joinLiveChat: 'Enter Live Sabiers Chat',
    liveBadge: 'DEY LIVE',
    liveChatPrompt: 'You dey live! Yarn with other spotters across Naija to confirm rumors sharp sharp.',
    umapTitle: 'UMap: Street Proximity Radar & Alert Sentinel',
    umapSubtitle: 'Correct Naija street tracing for verified rumor alerts, safety warning, and live market gist.',
    tracingMode: 'Live Location Tracing',
    tracingOn: 'Tracing: ON',
    tracingOff: 'Tracing: OFF',
    tracingActiveDesc: 'Safety radar dey check your street and area 24/7 for fake news, fuel queues, and price panic.',
    tracingPausedDesc: 'Tracing dey paused now. Turn am on make you fit get instant safety warnings when you dey near rumor area.',
    proximityAlertTitle: 'HIGH-PRIORITY SAFETY PROXIMITY ALERT',
    proximityAlertNear: 'You dey very close to one fake gist or suspicious rumor location!',
    proximityAlertContextSafe: 'Safety Advice: No shake, no forward unverified voice notes or WhatsApp broadcast. Market and road dey move normal.',
    privacyDisclaimerTitle: 'SABI Privacy & Safe Tracing Guarantee',
    privacyDisclaimerBody: 'We only dey use your location inside your phone browser to calculate how close you dey to rumors. SABI no dey store your movement logs for outside server or sell your data. We strictly dey use am for your physical safety and community awareness.',
    socialMediaRumorFeedTitle: 'Live Social Media Rumors (TikTok, X, Instagram, YouTube)',
    socialMediaRumorFeedSubtitle: 'Trending gist, viral audio, and fake videos wey dey circulate inside your area for Naija.',
    inspectForensics: 'Check Forensics & Video Evidence',
    verifyOnGround: 'Verify for Ground (+50 PTS)',
    dismissAlert: 'Clear Warning',
    snoozeAlert: 'Snooze Warning',
    radarLegendTrue: 'Confirmed Truth',
    radarLegendFalse: 'Fake / Lie',
    radarLegendOutdated: 'Old Recycle / Dey Check',
    exactStreetRoad: 'Real Street / Road',
    lgaLabel: 'Local Gov Area (LGA)',
    stateCountryLabel: 'State & Country',
    gpsCoordsLabel: 'GPS Coordinates',
    copyCoordsBtn: 'Copy Coordinates',
    snapStreetBtn: 'Snap Rumor for this Street (+25 PTS)'
  }
};

const LANG_KEY = 'sabi_interface_language';

class LanguageService {
  private currentLanguage: AppLanguage = 'english';
  private listeners: Array<(lang: AppLanguage) => void> = [];

  constructor() {
    const saved = localStorage.getItem(LANG_KEY) as AppLanguage;
    if (saved && (saved in TRANSLATIONS)) {
      this.currentLanguage = saved;
    }
  }

  public getLanguage(): AppLanguage {
    return this.currentLanguage;
  }

  public setLanguage(lang: AppLanguage) {
    if (lang in TRANSLATIONS && lang !== this.currentLanguage) {
      this.currentLanguage = lang;
      localStorage.setItem(LANG_KEY, lang);
      this.notify();
      window.dispatchEvent(new CustomEvent('sabi_language_changed', { detail: lang }));
    }
  }

  public t(key: keyof TranslationDictionary): string {
    const dict = TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.english;
    return dict[key] || TRANSLATIONS.english[key] || String(key);
  }

  public getDictionary(): TranslationDictionary {
    return TRANSLATIONS[this.currentLanguage] || TRANSLATIONS.english;
  }

  public subscribe(listener: (lang: AppLanguage) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.currentLanguage));
  }
}

export const languageService = new LanguageService();

