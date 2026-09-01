import { saveUserToFirestore } from './firestoreService';
import {
  UserProfile,
  UserAccount,
  VerificationTask,
  TruthResult,
  MarketItem,
  RecipeItem,
  AppNotification,
  VerifierResponse,
  EvidenceItem,
  SentEmailReport,
  SabiersChatMessage,
  NewsArticle,
  UserTier,
  StreakData,
  ResultType,
  OnlineSabier,
  SaboAiSession
} from '../types';
import {
  INITIAL_USER,
  INITIAL_TASKS,
  INITIAL_TRUTH_RESULTS,
  INITIAL_MARKET_ITEMS,
  INITIAL_RECIPES,
  INITIAL_NOTIFICATIONS,
  INITIAL_LEADERBOARD,
  INITIAL_SABIERS_MESSAGES,
  INITIAL_STREAK_REWARDS,
  INITIAL_ONLINE_SABIERS,
  TIER_DEFINITIONS,
  FREE_SABIATION_RESOURCES,
  LATEST_NEWS_ARTICLES
} from '../data/mockData';

const KEYS = {
  USER: 'sabi_user_profile',
  REGISTERED_USERS: 'sabi_registered_users',
  AUTH_SESSION: 'sabi_auth_session',
  TASKS: 'sabi_verification_tasks',
  TRUTH_RESULTS: 'sabi_truth_results',
  MARKET_ITEMS: 'sabi_market_items',
  RECIPES: 'sabi_recipes',
  SAVED_RECIPES: 'sabi_saved_recipes',
  NOTIFICATIONS: 'sabi_notifications',
  LOCATION: 'sabi_current_location',
  LEADERBOARD: 'sabi_leaderboard',
  SENT_EMAILS: 'sabi_sent_emails',
  SABIERS_MESSAGES: 'sabi_sabiers_chat_messages',
  NEWS: 'sabi_latest_news_articles',
  SABO_SESSIONS: 'sabi_sabo_ai_sessions',
  SABO_ACTIVE_SESSION_ID: 'sabi_sabo_ai_active_session_id'
};

export const ADMIN_MASTER_PASSWORD = '2013';
export const ADMIN_DEFAULT_EMAIL = 'enochayomide67@gmail.com';

const DEFAULT_ADMIN_USER: UserProfile = {
  id: 'usr_admin_master',
  name: 'Enoch Ayomide (SABI Admin)',
  email: 'enochayomide67@gmail.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'admin',
  trustLevel: 'Trusted Contributor',
  userTier: 'Deluxe',
  sabiPoints: 125000,
  completedVerificationsCount: 142,
  submittedReportsCount: 48,
  accuracyRate: 99,
  joinedDate: 'January 2024',
  state: 'Lagos',
  lga: 'Lagos Mainland',
  badges: ['Master Sentinel', 'Admin Verified', 'Consensus Guardian', 'Market Authority', 'Deluxe VIP'],
  unlockedTitles: ['Admin Sentinel', 'Deluxe Sovereign VIP'],
  hasSabiationAccess: true,
  hasDeluxeVipService: true,
  recentActivity: [
    {
      id: 'act_adm_1',
      type: 'approved_price',
      points: 50,
      description: 'System Verified 24 Community Reports',
      timestamp: 'Just now'
    }
  ]
};

export interface SelectedLocation {
  state: string;
  lga: string;
  area: string;
  isGpsDerived?: boolean;
}

const DEFAULT_LOCATION: SelectedLocation = {
  state: 'Lagos',
  lga: 'Lagos Mainland',
  area: 'Yaba',
  isGpsDerived: false
};

class StorageService {
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    if (!localStorage.getItem(KEYS.USER)) {
      localStorage.setItem(KEYS.USER, JSON.stringify(INITIAL_USER));
    }
    if (!localStorage.getItem(KEYS.REGISTERED_USERS)) {
      const initialList: UserAccount[] = [
        {
          ...INITIAL_USER,
          passwordHash: 'user123',
          isRegistered: true
        },
        {
          ...DEFAULT_ADMIN_USER,
          passwordHash: '2013',
          isRegistered: true
        }
      ];
      localStorage.setItem(KEYS.REGISTERED_USERS, JSON.stringify(initialList));
    }
    if (!localStorage.getItem(KEYS.TASKS)) {
      localStorage.setItem(KEYS.TASKS, JSON.stringify(INITIAL_TASKS));
    }
    if (!localStorage.getItem(KEYS.TRUTH_RESULTS)) {
      localStorage.setItem(KEYS.TRUTH_RESULTS, JSON.stringify(INITIAL_TRUTH_RESULTS));
    }
    if (!localStorage.getItem(KEYS.MARKET_ITEMS)) {
      localStorage.setItem(KEYS.MARKET_ITEMS, JSON.stringify(INITIAL_MARKET_ITEMS));
    }
    if (!localStorage.getItem(KEYS.RECIPES)) {
      localStorage.setItem(KEYS.RECIPES, JSON.stringify(INITIAL_RECIPES));
    }
    if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
      localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(KEYS.LOCATION)) {
      localStorage.setItem(KEYS.LOCATION, JSON.stringify(DEFAULT_LOCATION));
    }
    if (!localStorage.getItem(KEYS.LEADERBOARD)) {
      localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(INITIAL_LEADERBOARD));
    }
    if (!localStorage.getItem(KEYS.SENT_EMAILS)) {
      localStorage.setItem(KEYS.SENT_EMAILS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.SABIERS_MESSAGES)) {
      localStorage.setItem(KEYS.SABIERS_MESSAGES, JSON.stringify(INITIAL_SABIERS_MESSAGES));
    }
    if (!localStorage.getItem(KEYS.NEWS)) {
      localStorage.setItem(KEYS.NEWS, JSON.stringify(LATEST_NEWS_ARTICLES));
    }
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // --- AUTHENTICATION & USER MANAGEMENT ---

  public getUser(): UserProfile {
    const raw = localStorage.getItem(KEYS.USER);
    if (!raw) return INITIAL_USER;
    const parsed: UserProfile = JSON.parse(raw);
    
    // Ensure streak structure is present
    if (!parsed.streak) {
      parsed.streak = INITIAL_USER.streak;
    }
    if (!parsed.unlockedTitles) {
      parsed.unlockedTitles = ['Community Spotter'];
    }
    if (!parsed.userTier) {
      parsed.userTier = 'Member';
    }
    return parsed;
  }

  public updateUser(user: UserProfile) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
    saveUserToFirestore(user);
    // Also sync in registered users list
    const users = this.getRegisteredUsers();
    const updatedUsers = users.map(u => u.id === user.id ? { ...u, ...user } : u);
    localStorage.setItem(KEYS.REGISTERED_USERS, JSON.stringify(updatedUsers));
    this.notify();
  }

  public getRegisteredUsers(): UserAccount[] {
    const raw = localStorage.getItem(KEYS.REGISTERED_USERS);
    return raw ? JSON.parse(raw) : [];
  }

  public signUp(data: {
    name: string;
    email: string;
    password: string;
    state?: string;
    lga?: string;
  }): { success: boolean; user?: UserProfile; message?: string } {
    const trimmedEmail = data.email.trim().toLowerCase();
    const users = this.getRegisteredUsers();

    // Check if email already registered
    const existing = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, message: 'This email is already registered. Please sign in instead.' };
    }

    const state = data.state || 'Lagos';
    const lga = data.lga || 'Lagos Mainland';

    const newUser: UserAccount = {
      id: 'usr_' + Date.now(),
      name: data.name.trim(),
      email: trimmedEmail,
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}&backgroundColor=0A3D2E`,
      role: data.password === ADMIN_MASTER_PASSWORD ? 'admin' : 'member',
      trustLevel: data.password === ADMIN_MASTER_PASSWORD ? 'Trusted Contributor' : 'Bronze',
      userTier: 'Member',
      sabiPoints: 100, // 100 welcome points!
      completedVerificationsCount: 0,
      submittedReportsCount: 0,
      accuracyRate: 100,
      joinedDate: 'Today',
      state: state,
      lga: lga,
      badges: ['New Contributor', 'SABI Pioneer'],
      unlockedTitles: ['Pioneer Member'],
      hasSabiationAccess: false,
      hasDeluxeVipService: false,
      streak: {
        currentDay: 1,
        lastClaimDate: '',
        totalClaimedPoints: 0,
        streakHistory: INITIAL_STREAK_REWARDS.map(r => ({
          day: r.day,
          points: r.points,
          claimed: false
        }))
      },
      passwordHash: data.password,
      isRegistered: true,
      recentActivity: [
        {
          id: 'act_signup_' + Date.now(),
          type: 'badge_earned',
          points: 100,
          description: 'Welcome Bonus: Joined SABI Community',
          timestamp: 'Just now'
        }
      ]
    };

    // Save to registered users list
    const updatedList = [...users, newUser];
    localStorage.setItem(KEYS.REGISTERED_USERS, JSON.stringify(updatedList));

    // Set as active user
    localStorage.setItem(KEYS.USER, JSON.stringify(newUser));

    // Update location to user's location
    this.setLocation({
      state,
      lga,
      area: lga,
      isGpsDerived: false
    });

    // Add welcome notification
    this.addNotification({
      id: 'notif_welcome_' + Date.now(),
      title: `Welcome to SABI, ${newUser.name}!`,
      message: `You received +100 Welcome Points. Start verifying local claims or claim your Day 1 300 Points streak reward!`,
      type: 'points_earned',
      timestamp: 'Just now',
      read: false,
      pointsAwarded: 100
    });

    this.notify();
    return { success: true, user: newUser };
  }

  public signIn(
    email: string,
    password: string
  ): { success: boolean; user?: UserProfile; message?: string; isAdmin?: boolean } {
    const trimmedEmail = email.trim().toLowerCase();

    // Check special admin master password "2013"
    if (password === ADMIN_MASTER_PASSWORD) {
      const adminUser: UserProfile = {
        ...DEFAULT_ADMIN_USER,
        email: trimmedEmail || ADMIN_DEFAULT_EMAIL
      };
      localStorage.setItem(KEYS.USER, JSON.stringify(adminUser));
      this.notify();
      return { success: true, user: adminUser, isAdmin: true };
    }

    const users = this.getRegisteredUsers();
    const userMatch = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (!userMatch) {
      return { 
        success: false, 
        message: 'No account found with this email. Please check your spelling or sign up for a new account.' 
      };
    }

    if (userMatch.passwordHash && userMatch.passwordHash !== password) {
      return { 
        success: false, 
        message: 'Incorrect password. Please try again.' 
      };
    }

    // Set as current active user
    localStorage.setItem(KEYS.USER, JSON.stringify(userMatch));
    
    // Sync location if set
    if (userMatch.state && userMatch.lga) {
      this.setLocation({
        state: userMatch.state,
        lga: userMatch.lga,
        area: userMatch.lga,
        isGpsDerived: false
      });
    }

    this.notify();
    return { success: true, user: userMatch, isAdmin: userMatch.role === 'admin' };
  }

  public signInWithGoogleUser(googleUser: {
    name: string;
    email: string;
    avatarUrl?: string;
    uid?: string;
  }): { success: boolean; user: UserProfile; isNewUser: boolean } {
    const trimmedEmail = googleUser.email.trim().toLowerCase();
    const users = this.getRegisteredUsers();
    let existing = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (existing) {
      // Update avatar if provided
      if (googleUser.avatarUrl && !existing.avatarUrl) {
        existing.avatarUrl = googleUser.avatarUrl;
      }
      localStorage.setItem(KEYS.USER, JSON.stringify(existing));
      this.notify();
      return { success: true, user: existing, isNewUser: false };
    }

    // Create new account with Google details
    const newUser: UserAccount = {
      id: googleUser.uid || 'usr_' + Date.now().toString(36),
      name: googleUser.name || 'Google Spotter',
      email: trimmedEmail,
      avatarUrl: googleUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: 'member',
      trustLevel: 'Bronze',
      userTier: 'Member',
      sabiPoints: 100, // 100 welcome points!
      completedVerificationsCount: 0,
      submittedReportsCount: 0,
      accuracyRate: 100,
      joinedDate: 'Today',
      state: 'Lagos',
      lga: 'Lagos Mainland',
      badges: ['New Contributor', 'Google Verified', 'SABI Pioneer'],
      unlockedTitles: ['Community Spotter', 'Google Verified Spotter'],
      hasSabiationAccess: false,
      hasDeluxeVipService: false,
      streak: {
        currentDay: 1,
        lastClaimDate: '',
        totalClaimedPoints: 0,
        streakHistory: INITIAL_STREAK_REWARDS.map(r => ({
          day: r.day,
          points: r.points,
          claimed: false
        }))
      },
      passwordHash: 'google_oauth_verified',
      isRegistered: true,
      recentActivity: [
        {
          id: 'act_signup_' + Date.now(),
          type: 'badge_earned',
          points: 100,
          description: 'Welcome Bonus: Joined SABI with Google Account',
          timestamp: 'Just now'
        }
      ]
    };

    const updatedList = [...users, newUser];
    localStorage.setItem(KEYS.REGISTERED_USERS, JSON.stringify(updatedList));
    localStorage.setItem(KEYS.USER, JSON.stringify(newUser));

    this.addNotification({
      id: 'notif_welcome_' + Date.now(),
      title: `Welcome to SABI, ${newUser.name}!`,
      message: `You received +100 Welcome Points. Start exploring local truth verification!`,
      type: 'points_earned',
      timestamp: 'Just now',
      read: false,
      pointsAwarded: 100
    });

    this.notify();
    return { success: true, user: newUser, isNewUser: true };
  }

  public adminSignIn(password: string): { success: boolean; user?: UserProfile; message?: string } {
    if (password === ADMIN_MASTER_PASSWORD) {
      localStorage.setItem(KEYS.USER, JSON.stringify(DEFAULT_ADMIN_USER));
      this.notify();
      return { success: true, user: DEFAULT_ADMIN_USER };
    }
    return { success: false, message: 'Invalid Admin Password. Access Denied.' };
  }

  public isUserLoggedIn(): boolean {
    const user = this.getUser();
    // User is logged in if they have signed in or signed up with valid email/admin, or registered
    return Boolean(user && user.id && user.id !== 'usr_guest' && user.email && user.email.includes('@'));
  }

  public updateUserAvatar(newAvatarUrl: string): UserProfile {
    const user = this.getUser();
    const updatedUser: UserProfile = {
      ...user,
      avatarUrl: newAvatarUrl
    };
    this.updateUser(updatedUser);
    this.addPoints(10, 'Updated Profile Photo with custom avatar (+10 PTS)');
    this.addNotification({
      id: 'notif_avatar_' + Date.now(),
      title: 'Profile Photo Updated!',
      message: 'Your new profile photo is now live across the SABI community and chat network (+10 PTS earned).',
      type: 'points_earned',
      timestamp: 'Just now',
      read: false,
      pointsAwarded: 10
    });
    this.notify();
    return updatedUser;
  }

  public signOut() {
    // Reset to default guest/starter profile
    localStorage.setItem(KEYS.USER, JSON.stringify(INITIAL_USER));
    this.notify();
  }

  // --- 14-DAY STREAK TIMER & REWARDS ---

  public claimStreakReward(): { success: boolean; pointsAwarded: number; day: number; message: string } {
    const user = this.getUser();
    const todayStr = new Date().toISOString().split('T')[0];
    
    const streak = user.streak || {
      currentDay: 1,
      lastClaimDate: '',
      totalClaimedPoints: 0,
      streakHistory: INITIAL_STREAK_REWARDS.map(r => ({ day: r.day, points: r.points, claimed: false }))
    };

    // Check if already claimed today
    if (streak.lastClaimDate === todayStr) {
      return {
        success: false,
        pointsAwarded: 0,
        day: streak.currentDay,
        message: 'You have already claimed today\'s streak reward! Come back tomorrow for the next bonus.'
      };
    }

    // Current day reward points (Day 1 = 300 PTS)
    const currentDay = Math.min(Math.max(streak.currentDay || 1, 1), 14);
    const rewardConfig = INITIAL_STREAK_REWARDS.find(r => r.day === currentDay) || INITIAL_STREAK_REWARDS[0];
    const pointsAwarded = rewardConfig.points;

    // Update streak data
    const nextDay = currentDay >= 14 ? 1 : currentDay + 1;
    const updatedHistory = streak.streakHistory.map(item => {
      if (item.day === currentDay) {
        return { ...item, claimed: true, claimedAt: new Date().toLocaleTimeString() };
      }
      return item;
    });

    const updatedStreak: StreakData = {
      currentDay: nextDay,
      lastClaimDate: todayStr,
      totalClaimedPoints: streak.totalClaimedPoints + pointsAwarded,
      streakHistory: updatedHistory
    };

    const newPoints = user.sabiPoints + pointsAwarded;
    const newActivity = [
      {
        id: 'act_streak_' + Date.now(),
        type: 'streak_reward' as const,
        points: pointsAwarded,
        description: `Claimed Day ${currentDay} Streak Reward (+${pointsAwarded} PTS)`,
        timestamp: 'Just now'
      },
      ...user.recentActivity
    ];

    const badges = [...user.badges];
    if (currentDay === 1 && !badges.includes('1-Day Starter Spark')) {
      badges.push('1-Day Starter Spark');
    }
    if (currentDay === 7 && !badges.includes('7-Day Streak Master')) {
      badges.push('7-Day Streak Master');
    }
    if (currentDay === 14 && !badges.includes('14-Day Streak Legend')) {
      badges.push('14-Day Streak Legend');
    }

    const updatedUser: UserProfile = {
      ...user,
      sabiPoints: newPoints,
      streak: updatedStreak,
      badges,
      recentActivity: newActivity
    };

    this.updateUser(updatedUser);

    this.addNotification({
      id: 'notif_streak_' + Date.now(),
      title: `🔥 Day ${currentDay} Streak Claimed! (+${pointsAwarded} PTS)`,
      message: `You earned ${pointsAwarded} SABI Points. Your streak is now active on Day ${nextDay} of 14!`,
      type: 'points_earned',
      timestamp: 'Just now',
      read: false,
      pointsAwarded
    });

    this.notify();

    return {
      success: true,
      pointsAwarded,
      day: currentDay,
      message: `Successfully claimed +${pointsAwarded} SABI points for Day ${currentDay}!`
    };
  }

  // --- TIER UPGRADES, TITLES & SABIATION PURCHASE ---

  public purchaseTierUpgrade(tierKey: 'Bronze' | 'Golden' | 'Deluxe'): {
    success: boolean;
    message: string;
    tier: string;
    newPoints: number;
  } {
    const user = this.getUser();
    const config = TIER_DEFINITIONS[tierKey];

    if (!config) {
      return { success: false, message: 'Invalid tier selection.', tier: tierKey, newPoints: user.sabiPoints };
    }

    // Check if already on this tier or higher
    if (user.userTier === tierKey) {
      return { success: false, message: `You have already unlocked the ${config.title} tier!`, tier: tierKey, newPoints: user.sabiPoints };
    }

    if (user.sabiPoints < config.pointsCost) {
      const shortage = config.pointsCost - user.sabiPoints;
      return {
        success: false,
        message: `Insufficient SABI points. You need ${config.pointsCost.toLocaleString()} PTS for ${config.title} (Short of ${shortage.toLocaleString()} PTS). Complete verification tasks or daily streaks to earn more!`,
        tier: tierKey,
        newPoints: user.sabiPoints
      };
    }

    // Deduct cost
    let balance = user.sabiPoints - config.pointsCost;

    // If Deluxe: user receives an immediate extra +60,000 SABI Points bonus!
    let bonusAdded = 0;
    if (tierKey === 'Deluxe' && config.instantBonusPoints) {
      balance += config.instantBonusPoints;
      bonusAdded = config.instantBonusPoints;
    }

    const unlockedTitles = user.unlockedTitles ? [...user.unlockedTitles] : ['Community Spotter'];
    if (!unlockedTitles.includes(config.title)) {
      unlockedTitles.push(config.title);
    }

    const badges = [...user.badges];
    if (!badges.includes(config.badge)) {
      badges.push(config.badge);
    }

    const updatedUser: UserProfile = {
      ...user,
      userTier: tierKey,
      sabiPoints: balance,
      badges,
      unlockedTitles,
      hasSabiationAccess: tierKey === 'Golden' || tierKey === 'Deluxe' || user.hasSabiationAccess,
      hasDeluxeVipService: tierKey === 'Deluxe' || user.hasDeluxeVipService,
      recentActivity: [
        {
          id: 'act_tier_' + Date.now(),
          type: 'tier_upgrade' as const,
          points: bonusAdded > 0 ? bonusAdded : -config.pointsCost,
          description: `Upgraded to ${config.title}${bonusAdded > 0 ? ` (+${bonusAdded.toLocaleString()} Bonus PTS!)` : ''}`,
          timestamp: 'Just now'
        },
        ...user.recentActivity
      ]
    };

    this.updateUser(updatedUser);

    this.addNotification({
      id: 'notif_tier_' + Date.now(),
      title: `🎉 Title & Tier Upgraded: ${config.title}!`,
      message: `You unlocked ${config.title}! ${config.unlocksSabiation ? 'You now have full access to "The Sabiation" AI tools.' : ''} ${bonusAdded > 0 ? `Plus +${bonusAdded.toLocaleString()} bonus points credited!` : ''}`,
      type: 'tier_upgrade',
      timestamp: 'Just now',
      read: false
    });

    this.notify();

    return {
      success: true,
      message: `Congratulations! You unlocked ${config.title}.${bonusAdded > 0 ? ` +${bonusAdded.toLocaleString()} bonus points credited!` : ''}`,
      tier: tierKey,
      newPoints: balance
    };
  }

  // --- EMAIL REPORT DISPATCH ---

  public getSentEmailReports(): SentEmailReport[] {
    const raw = localStorage.getItem(KEYS.SENT_EMAILS);
    return raw ? JSON.parse(raw) : [];
  }

  public sendReportToEmail(data: {
    claim: string;
    location: string;
    details?: string;
    evidenceName?: string;
    evidenceUrl?: string;
    submitterName?: string;
    submitterEmail?: string;
    targetEmail?: string;
  }): { success: boolean; mailtoUrl: string; report: SentEmailReport } {
    const target = data.targetEmail || ADMIN_DEFAULT_EMAIL;
    const user = this.getUser();
    const submitterName = data.submitterName || user.name || 'SABI Community Member';
    const submitterEmail = data.submitterEmail || user.email || 'user@sabi.ng';
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

    const subject = `[SABI Report] ${data.claim.slice(0, 60)} - ${data.location}`;
    const body = `--- SABI VERIFICATION REPORT ---
Report Date: ${timestamp}
Location: ${data.location}

CLAIM TO VERIFY:
"${data.claim}"

DETAILS / CONTEXT:
${data.details || 'Submitted via SABI Verification Platform'}

ATTACHED EVIDENCE:
${data.evidenceName || 'Standard media attachment'}
${data.evidenceUrl ? `Media URL: ${data.evidenceUrl}` : ''}

SUBMITTED BY:
Name: ${submitterName}
Email: ${submitterEmail}
Trust Level: ${user.trustLevel} (${user.sabiPoints} pts)

---
Dispatched to: ${target}
Platform: SABI Nigeria`;

    const mailtoUrl = `mailto:${encodeURIComponent(target)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    const newReport: SentEmailReport = {
      id: 'eml_' + Date.now(),
      recipient: target,
      subject,
      body,
      claim: data.claim,
      location: data.location,
      timestamp: 'Just now',
      submitterEmail,
      status: 'sent'
    };

    // Save sent email in local dispatch store
    const existingEmails = this.getSentEmailReports();
    const updated = [newReport, ...existingEmails];
    localStorage.setItem(KEYS.SENT_EMAILS, JSON.stringify(updated));

    // Award +15 SABI Points for sending a verified email report
    this.addPoints(15, `Sent official verification report`);

    // Add notification
    this.addNotification({
      id: 'notif_eml_' + Date.now(),
      title: `Official Report Dispatched`,
      message: `Your report on "${data.claim.slice(0, 40)}..." has been prepared and sent for review!`,
      type: 'system_alert',
      timestamp: 'Just now',
      read: false
    });

    this.notify();

    try {
      window.location.href = mailtoUrl;
    } catch (e) {
      console.warn('Mailto link navigation caught:', e);
    }

    return { success: true, mailtoUrl, report: newReport };
  }

  // --- POINTS & ACTIVITY ---

  public injectCheatPoints(amount: number): UserProfile {
    const user = this.getUser();
    const cleanAmount = Math.max(1, Math.round(amount));
    const newPoints = user.sabiPoints + cleanAmount;

    let newTrust = user.trustLevel;
    if (newPoints >= 10000) newTrust = 'Trusted Contributor';
    else if (newPoints >= 4000) newTrust = 'Gold';
    else if (newPoints >= 1500) newTrust = 'Silver';

    let userTier = user.userTier;
    if (newPoints >= 50000 && userTier !== 'Deluxe') {
      userTier = 'Deluxe';
    } else if (newPoints >= 10000 && userTier === 'Member') {
      userTier = 'Golden';
    }

    const updatedUser: UserProfile = {
      ...user,
      sabiPoints: newPoints,
      trustLevel: newTrust,
      userTier: userTier,
      hasSabiationAccess: newPoints >= 10000 || user.hasSabiationAccess,
      hasDeluxeVipService: newPoints >= 50000 || user.hasDeluxeVipService,
      recentActivity: [
        {
          id: 'cheat_' + Date.now(),
          type: 'verified_task',
          points: cleanAmount,
          description: `⚡ CHEAT CODE ACTIVATED: +${cleanAmount.toLocaleString()} SABI Points Injected`,
          timestamp: 'Just now'
        },
        ...(user.recentActivity || [])
      ]
    };

    this.updateUser(updatedUser);
    this.addNotification({
      id: 'notif_cheat_' + Date.now(),
      title: `⚡ Cheat Code Activated: +${cleanAmount.toLocaleString()} PTS!`,
      message: `Admin cheat code executed. ${cleanAmount.toLocaleString()} SABI Points have been credited instantly to your account.`,
      type: 'points_earned',
      timestamp: 'Just now',
      read: false,
      pointsAwarded: cleanAmount
    });

    this.notify();
    return updatedUser;
  }

  public addPoints(amount: number, reason: string) {
    if (amount <= 0) return;
    const user = this.getUser();
    
    // Apply title tier multiplier
    let multiplier = 1;
    if (user.userTier === 'Bronze') multiplier = 1.25;
    else if (user.userTier === 'Golden') multiplier = 1.75;
    else if (user.userTier === 'Deluxe') multiplier = 2.5;

    const multipliedAmount = Math.round(amount * multiplier);
    const newPoints = user.sabiPoints + multipliedAmount;
    
    let newTrust = user.trustLevel;
    if (newPoints >= 4000) newTrust = 'Trusted Contributor';
    else if (newPoints >= 2500) newTrust = 'Gold';
    else if (newPoints >= 1500) newTrust = 'Silver';

    const perkText = multiplier > 1 ? ` (${multiplier}x ${user.userTier} Tier Bonus)` : '';

    const updatedUser: UserProfile = {
      ...user,
      sabiPoints: newPoints,
      trustLevel: newTrust,
      recentActivity: [
        {
          id: 'act_' + Date.now(),
          type: 'verified_task',
          points: multipliedAmount,
          description: `${reason}${perkText}`,
          timestamp: 'Just now'
        },
        ...user.recentActivity
      ]
    };

    this.updateUser(updatedUser);

    this.addNotification({
      id: 'notif_' + Date.now(),
      title: `You Earned +${multipliedAmount} Stat Points!`,
      message: `${reason}${perkText}`,
      type: 'points_earned',
      timestamp: 'Just now',
      read: false,
      pointsAwarded: multipliedAmount
    });
  }

  public recordContribution(type: 'rumor_verify' | 'market_report' | 'chat') {
    const user = this.getUser();
    const today = new Date().toISOString().split('T')[0];
    const streak = user.streak || {
      currentDay: 1,
      lastClaimDate: '',
      totalClaimedPoints: 0,
      streakHistory: []
    };

    const missions = streak.missionsCompletedToday || {
      rumorVerified: false,
      marketReported: false,
      chatParticipated: false
    };

    let updatedMissions = { ...missions };
    if (type === 'rumor_verify') updatedMissions.rumorVerified = true;
    if (type === 'market_report') updatedMissions.marketReported = true;
    if (type === 'chat') updatedMissions.chatParticipated = true;

    let newStreakDays = streak.consecutiveStreakDays || 1;
    if (streak.lastContributionDate !== today) {
      if (streak.lastContributionDate) {
        const lastDate = new Date(streak.lastContributionDate);
        const currDate = new Date(today);
        const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          newStreakDays += 1;
        } else if (diffDays > 1) {
          newStreakDays = 1;
        }
      } else {
        newStreakDays = 1;
      }
    }

    const updatedUser: UserProfile = {
      ...user,
      streak: {
        ...streak,
        lastContributionDate: today,
        consecutiveStreakDays: newStreakDays,
        missionsCompletedToday: updatedMissions
      }
    };

    this.updateUser(updatedUser);
    this.notify();
  }

  public getLocation(): SelectedLocation {
    const raw = localStorage.getItem(KEYS.LOCATION);
    return raw ? JSON.parse(raw) : DEFAULT_LOCATION;
  }

  public setLocation(loc: SelectedLocation) {
    localStorage.setItem(KEYS.LOCATION, JSON.stringify(loc));
    this.notify();
  }

  // --- TASKS & ADMIN ACTIONS ---

  public getTasks(): VerificationTask[] {
    const raw = localStorage.getItem(KEYS.TASKS);
    return raw ? JSON.parse(raw) : INITIAL_TASKS;
  }

  public addTask(task: VerificationTask) {
    const tasks = this.getTasks();
    const updated = [task, ...tasks];
    localStorage.setItem(KEYS.TASKS, JSON.stringify(updated));
    this.notify();
  }

  public submitVerifierResponse(
    taskId: string,
    response: Omit<VerifierResponse, 'id' | 'timestamp'>
  ) {
    const tasks = this.getTasks();
    const user = this.getUser();
    const newResponse: VerifierResponse = {
      ...response,
      id: 'resp_' + Date.now(),
      timestamp: 'Just now'
    };

    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        const updatedResponses = [newResponse, ...t.responses];
        const newCount = updatedResponses.length;
        const isComplete = newCount >= t.requiredVerifiers;
        return {
          ...t,
          responses: updatedResponses,
          currentVerifiersCount: newCount,
          status: isComplete ? ('completed' as const) : t.status
        };
      }
      return t;
    });

    localStorage.setItem(KEYS.TASKS, JSON.stringify(updatedTasks));

    // Award +25 SABI points
    this.addPoints(25, `Submitted verified evidence for task #${taskId.slice(-4)}`);
    this.recordContribution('rumor_verify');

    // Increment completed verifications count
    this.updateUser({
      ...user,
      completedVerificationsCount: user.completedVerificationsCount + 1
    });

    this.notify();
    return newResponse;
  }

  /**
   * Resolves an administrative task.
   * If verdict is TRUE, FALSE, or OUTDATED MEDIA, creates/updates the TruthResult 
   * so it appears in the public feed, and marks the task as completed/removed so 
   * it disappears from the Admin pending queue.
   */
  public resolveAdminTask(
    taskId: string,
    verdict: ResultType | 'DISMISSED' | string,
    details?: string
  ) {
    const tasks = this.getTasks();
    const targetTask = tasks.find(t => t.id === taskId);

    if (targetTask && verdict !== 'DISMISSED') {
      const newTruthResult: TruthResult = {
        id: 'truth_adm_' + Date.now(),
        reportId: targetTask.reportId || 'rep_' + Date.now(),
        claim: targetTask.claim,
        originalClaimQuote: targetTask.claim,
        availableEvidenceQuote: details || `Verified by SABI Admin: Claim marked as ${verdict}.`,
        result: verdict as ResultType,
        state: targetTask.state,
        lga: targetTask.lga,
        area: targetTask.area,
        verifiedAt: 'Just now',
        contributorCount: Math.max(targetTask.currentVerifiersCount, 1),
        aiMediaAnalysis: {
          status: verdict === 'OUTDATED MEDIA' ? 'outdated_flagged' : 'completed',
          details: details || `Admin verification concluded verdict: ${verdict}`,
          isOutdatedMedia: verdict === 'OUTDATED MEDIA',
          confidenceScore: 98
        },
        confidence: 'High',
        videoDurationSec: 20,
        videoThumbnail: targetTask.originalEvidence[0]?.url || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80',
        viewsCount: 120,
        sharesCount: 18,
        sources: ['SABI Community Verifiers', 'Official Admin Review']
      };

      this.addTruthResult(newTruthResult);
    }

    // Mark task as completed or remove from active queue
    const updatedTasks = tasks.map(t => {
      if (t.id === taskId) {
        return { ...t, status: 'completed' as const };
      }
      return t;
    });

    localStorage.setItem(KEYS.TASKS, JSON.stringify(updatedTasks));

    this.addNotification({
      id: 'notif_adm_' + Date.now(),
      title: `Task #${taskId.slice(-4)} Resolved (${verdict})`,
      message: `Admin finalized report verdict as ${verdict}. Published to Public Truth Feed.`,
      type: 'report_verified',
      timestamp: 'Just now',
      read: false
    });

    this.notify();
  }

  public deleteAdminTask(taskId: string) {
    const tasks = this.getTasks();
    const updated = tasks.filter(t => t.id !== taskId);
    localStorage.setItem(KEYS.TASKS, JSON.stringify(updated));
    this.notify();
  }

  // --- TRUTH RESULTS ---

  public getTruthResults(): TruthResult[] {
    const raw = localStorage.getItem(KEYS.TRUTH_RESULTS);
    return raw ? JSON.parse(raw) : INITIAL_TRUTH_RESULTS;
  }

  public addTruthResult(result: TruthResult) {
    const results = this.getTruthResults();
    const updated = [result, ...results];
    localStorage.setItem(KEYS.TRUTH_RESULTS, JSON.stringify(updated));
    
    // Trigger notification if user is subscribed
    const user = this.getUser();
    if (user.subscribedToAlerts && Notification.permission === 'granted') {
      new Notification(`Truth Alert: New ${result.result} status for ${result.claim}`, {
        body: `A rumor in ${result.state} has been ${result.result}.`,
      });
    }

    this.notify();
  }

  public deleteTruthResult(id: string) {
    const results = this.getTruthResults();
    const updated = results.filter(r => r.id !== id);
    localStorage.setItem(KEYS.TRUTH_RESULTS, JSON.stringify(updated));
    this.notify();
  }

  public updateTruthResult(result: TruthResult) {
    const results = this.getTruthResults();
    const updated = results.map(r => r.id === result.id ? result : r);
    localStorage.setItem(KEYS.TRUTH_RESULTS, JSON.stringify(updated));
    this.notify();
  }

  public updateAlertPreference(subscribed: boolean) {
    const user = this.getUser();
    this.updateUser({ ...user, subscribedToAlerts: subscribed });
  }

  // --- MARKET ITEMS ---

  public getMarketItems(): MarketItem[] {
    const raw = localStorage.getItem(KEYS.MARKET_ITEMS);
    return raw ? JSON.parse(raw) : INITIAL_MARKET_ITEMS;
  }

  public addMarketPriceReport(itemId: string, state: string, area: string, price: number, unitName: string) {
    const items = this.getMarketItems();
    const updated = items.map(item => {
      if (item.id === itemId) {
        const newTotal = item.totalReportsCount + 1;
        const updatedHistory = {
          ...item.history,
          '7Days': [
            ...item.history['7Days'].slice(1),
            { date: 'Today', price, reportsCount: 1, locationName: area }
          ]
        };
        return {
          ...item,
          totalReportsCount: newTotal,
          history: updatedHistory
        };
      }
      return item;
    });

    localStorage.setItem(KEYS.MARKET_ITEMS, JSON.stringify(updated));
    this.addPoints(10, `Submitted verified market price at ${area}, ${state}`);
    this.recordContribution('market_report');
    this.notify();
  }

  // --- RECIPES ---

  public getRecipes(): RecipeItem[] {
    const raw = localStorage.getItem(KEYS.RECIPES);
    return raw ? JSON.parse(raw) : INITIAL_RECIPES;
  }

  public addRecipe(recipe: RecipeItem) {
    const recipes = this.getRecipes();
    const updated = [recipe, ...recipes];
    localStorage.setItem(KEYS.RECIPES, JSON.stringify(updated));
    this.notify();
  }

  public getSavedRecipeIds(): string[] {
    const raw = localStorage.getItem(KEYS.SAVED_RECIPES);
    if (!raw) {
      // Default initial saved recipe is the first classic recipe
      const defaults = ['default'];
      localStorage.setItem(KEYS.SAVED_RECIPES, JSON.stringify(defaults));
      return defaults;
    }
    return JSON.parse(raw);
  }

  public isRecipeSaved(recipeId: string): boolean {
    const saved = this.getSavedRecipeIds();
    return saved.includes(recipeId);
  }

  public toggleSaveRecipe(recipeId: string, recipeObj?: RecipeItem): boolean {
    const saved = this.getSavedRecipeIds();
    const recipes = this.getRecipes();

    let isSavedNow = false;
    let updatedSaved: string[] = [];

    if (saved.includes(recipeId)) {
      updatedSaved = saved.filter(id => id !== recipeId);
      isSavedNow = false;
    } else {
      updatedSaved = [recipeId, ...saved];
      isSavedNow = true;

      // Ensure full recipe item exists in storage
      if (recipeObj && !recipes.some(r => r.id === recipeId)) {
        const updatedRecipes = [recipeObj, ...recipes];
        localStorage.setItem(KEYS.RECIPES, JSON.stringify(updatedRecipes));
      }
    }

    localStorage.setItem(KEYS.SAVED_RECIPES, JSON.stringify(updatedSaved));
    this.notify();
    return isSavedNow;
  }

  public getSavedRecipes(): RecipeItem[] {
    const savedIds = this.getSavedRecipeIds();
    const allRecipes = this.getRecipes();
    return savedIds
      .map(id => allRecipes.find(r => r.id === id))
      .filter((r): r is RecipeItem => Boolean(r));
  }

  // --- NOTIFICATIONS ---

  public getNotifications(): AppNotification[] {
    const raw = localStorage.getItem(KEYS.NOTIFICATIONS);
    return raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
  }

  public markNotificationAsRead(id: string) {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    this.notify();
  }

  public markAllNotificationsAsRead() {
    const notifs = this.getNotifications();
    const updated = notifs.map(n => ({ ...n, read: true }));
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    this.notify();
  }

  public deleteNotification(id: string) {
    const notifs = this.getNotifications();
    const updated = notifs.filter(n => n.id !== id);
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    this.notify();
  }

  public clearAllNotifications() {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([]));
    this.notify();
  }

  public addNotification(notif: AppNotification) {
    const notifs = this.getNotifications();
    const updated = [notif, ...notifs];
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
    this.notify();
  }

  public getLeaderboard() {
    const raw = localStorage.getItem(KEYS.LEADERBOARD);
    return raw ? JSON.parse(raw) : INITIAL_LEADERBOARD;
  }

  // --- ONLINE SABIERS ROSTER & LIVE COUNTER ---

  public getOnlineSabiers(): OnlineSabier[] {
    const currentUser = this.getUser();
    
    // User is always actively listed online at the top
    const userAsOnlineSabier: OnlineSabier = {
      id: currentUser.id,
      name: `${currentUser.name} (You)`,
      avatarUrl: currentUser.avatarUrl,
      trustLevel: currentUser.trustLevel,
      tier: currentUser.userTier || 'Member',
      role: currentUser.role,
      state: currentUser.state,
      lga: currentUser.lga,
      currentActivity: currentUser.role === 'admin' 
        ? 'Admin Command: Live Moderation & Verification' 
        : `Active now in ${currentUser.lga}, ${currentUser.state}`,
      isOnline: true,
      lastActive: 'Online now',
      statusMessage: '🟢 Active in Nigeria truth network'
    };

    // Filter out duplicate if user has same ID as one of the presets
    const others = INITIAL_ONLINE_SABIERS.filter(s => s.name !== currentUser.name && s.id !== currentUser.id);

    return [userAsOnlineSabier, ...others];
  }

  public getOnlineUsersCount(): number {
    return this.getOnlineSabiers().filter(s => s.isOnline).length;
  }

  // --- THE SABIERS COMMUNITY GROUP CHAT ---

  public getSabiersMessages(channel?: string): SabiersChatMessage[] {
    const raw = localStorage.getItem(KEYS.SABIERS_MESSAGES);
    const messages: SabiersChatMessage[] = raw ? JSON.parse(raw) : INITIAL_SABIERS_MESSAGES;
    if (!channel || channel === 'all') {
      return messages;
    }
    return messages.filter(m => m.channel === channel);
  }

  public addSabiersMessage(data: {
    message: string;
    channel: SabiersChatMessage['channel'];
    attachedTag?: SabiersChatMessage['attachedTag'];
  }): SabiersChatMessage {
    const user = this.getUser();
    const existing = this.getSabiersMessages();

    const newMsg: SabiersChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatarUrl,
      senderTrustLevel: user.trustLevel,
      senderRole: user.role,
      senderTier: user.userTier,
      state: user.state,
      lga: user.lga,
      channel: data.channel,
      message: data.message,
      timestamp: 'Just now',
      reactions: [
        { emoji: '👍', count: 1, userReacted: true }
      ],
      attachedTag: data.attachedTag
    };

    const updated = [newMsg, ...existing];
    localStorage.setItem(KEYS.SABIERS_MESSAGES, JSON.stringify(updated));
    this.addPoints(5, 'Engaged in The Sabiers Community Chat');
    this.recordContribution('chat');
    this.notify();
    return newMsg;
  }

  public toggleSabiersReaction(messageId: string, emoji: string) {
    const messages = this.getSabiersMessages();
    const updated = messages.map(msg => {
      if (msg.id === messageId) {
        let reactionFound = false;
        const newReactions = msg.reactions.map(r => {
          if (r.emoji === emoji) {
            reactionFound = true;
            const userReacted = !r.userReacted;
            const count = userReacted ? r.count + 1 : Math.max(0, r.count - 1);
            return { ...r, count, userReacted };
          }
          return r;
        }).filter(r => r.count > 0);

        if (!reactionFound) {
          newReactions.push({ emoji, count: 1, userReacted: true });
        }

        return { ...msg, reactions: newReactions };
      }
      return msg;
    });

    localStorage.setItem(KEYS.SABIERS_MESSAGES, JSON.stringify(updated));
    this.notify();
  }

  // --- LATEST NEWS & SABIATION ---

  public getNewsArticles(): NewsArticle[] {
    const raw = localStorage.getItem(KEYS.NEWS);
    return raw ? JSON.parse(raw) : LATEST_NEWS_ARTICLES;
  }

  public addNewsArticle(article: NewsArticle) {
    const articles = this.getNewsArticles();
    const updated = [article, ...articles];
    localStorage.setItem(KEYS.NEWS, JSON.stringify(updated));
    this.notify();
  }

  public addNewsArticles(articles: NewsArticle[]) {
    const existing = this.getNewsArticles();
    const updated = [...articles, ...existing];
    localStorage.setItem(KEYS.NEWS, JSON.stringify(updated));
    this.notify();
  }

  public getSabiationResources() {
    return FREE_SABIATION_RESOURCES;
  }

  // --- SABO AI CONVERSATION SESSIONS (PERSIST LAST 3-5 SESSIONS) ---

  public getSaboSessions(): SaboAiSession[] {
    try {
      const raw = localStorage.getItem(KEYS.SABO_SESSIONS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.slice(0, 5) : [];
    } catch (e) {
      console.error('Failed to get Sabo AI sessions from localStorage', e);
      return [];
    }
  }

  public saveSaboSession(session: SaboAiSession): void {
    try {
      const sessions = this.getSaboSessions();
      const existingIndex = sessions.findIndex(s => s.id === session.id);
      let updated: SaboAiSession[];
      if (existingIndex >= 0) {
        updated = [...sessions];
        updated[existingIndex] = { ...session, updatedAt: Date.now() };
      } else {
        updated = [{ ...session, updatedAt: session.updatedAt || Date.now() }, ...sessions];
      }
      // Sort by latest update and keep the last 5 sessions
      updated.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      const trimmed = updated.slice(0, 5);
      localStorage.setItem(KEYS.SABO_SESSIONS, JSON.stringify(trimmed));
      this.setActiveSaboSessionId(session.id);
      this.notify();
    } catch (e) {
      console.error('Failed to save Sabo AI session', e);
    }
  }

  public deleteSaboSession(sessionId: string): void {
    try {
      const sessions = this.getSaboSessions().filter(s => s.id !== sessionId);
      localStorage.setItem(KEYS.SABO_SESSIONS, JSON.stringify(sessions));
      const activeId = this.getActiveSaboSessionId();
      if (activeId === sessionId) {
        if (sessions.length > 0) {
          this.setActiveSaboSessionId(sessions[0].id);
        } else {
          localStorage.removeItem(KEYS.SABO_ACTIVE_SESSION_ID);
        }
      }
      this.notify();
    } catch (e) {
      console.error('Failed to delete Sabo AI session', e);
    }
  }

  public clearAllSaboSessions(): void {
    try {
      localStorage.removeItem(KEYS.SABO_SESSIONS);
      localStorage.removeItem(KEYS.SABO_ACTIVE_SESSION_ID);
      this.notify();
    } catch (e) {
      console.error('Failed to clear Sabo AI sessions', e);
    }
  }

  public getActiveSaboSessionId(): string | null {
    try {
      return localStorage.getItem(KEYS.SABO_ACTIVE_SESSION_ID);
    } catch {
      return null;
    }
  }

  public setActiveSaboSessionId(sessionId: string): void {
    try {
      localStorage.setItem(KEYS.SABO_ACTIVE_SESSION_ID, sessionId);
    } catch (e) {
      console.error('Failed to set active Sabo session ID', e);
    }
  }
}

export const storageService = new StorageService();
