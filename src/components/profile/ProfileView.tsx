import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  MapPin, 
  Clock, 
  ArrowUpRight, 
  CheckCircle2, 
  TrendingUp, 
  Flame, 
  Medal,
  ChevronRight,
  Info,
  Mail,
  KeyRound,
  LogOut,
  UserPlus,
  LogIn,
  Send,
  Crown,
  Camera,
  Upload,
  X,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { UserProfile } from '../../types';
import { AuthModal } from '../auth/AuthModal';
import { TierUpgradeSection } from './TierUpgradeSection';

interface ProfileViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onShowPointsToast?: (points: number, message: string) => void;
}

const PRESET_AVATARS = [
  { id: 'av1', label: 'Lagos Spotter (Male)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { id: 'av2', label: 'Abuja Verifier (Female)', url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80' },
  { id: 'av3', label: 'Market Elder (Ibadan)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { id: 'av4', label: 'Kano Fact Checker', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
  { id: 'av5', label: 'Port Harcourt Sentinel', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
  { id: 'av6', label: 'Enugu Community Voice', url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80' }
];

export const ProfileView: React.FC<ProfileViewProps> = ({ 
  onNavigate,
  onShowPointsToast = (_points: number, _message: string) => {}
}) => {
  const [user, setUser] = useState<UserProfile>(storageService.getUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(storageService.isUserLoggedIn());
  const [leaderboard, setLeaderboard] = useState(storageService.getLeaderboard());
  const [leaderboardFilter, setLeaderboardFilter] = useState<'Nigeria' | 'State' | 'LGA'>('Nigeria');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup' | 'admin'>('signin');
  
  // Avatar Photo Upload / Change State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);
  const [previewAvatarUrl, setPreviewAvatarUrl] = useState<string>(user.avatarUrl);
  const [customAvatarInput, setCustomAvatarInput] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      const u = storageService.getUser();
      setUser(u);
      setIsLoggedIn(storageService.isUserLoggedIn());
      setLeaderboard(storageService.getLeaderboard());
    });
    return unsubscribe;
  }, []);

  const getTrustBadgeColor = (trust: string) => {
    switch (trust) {
      case 'Trusted Contributor':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Gold':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Silver':
        return 'bg-slate-200 text-slate-900 border-slate-300';
      case 'Bronze':
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  const filteredLeaderboard = leaderboard.filter(item => {
    if (leaderboardFilter === 'State') return item.state === user.state || item.state.includes('Lagos');
    if (leaderboardFilter === 'LGA') return item.lga === user.lga || item.state === user.state;
    return true;
  });

  const handleSignOut = () => {
    storageService.signOut();
    onShowPointsToast(0, 'Signed out of your SABI account');
  };

  const handleSendEmailReport = () => {
    storageService.sendReportToEmail({
      claim: `Verified market and food price summary submitted from ${user.lga}, ${user.state}`,
      location: `${user.lga}, ${user.state}`,
      details: `Dispatched by ${user.name} (${user.trustLevel} · ${user.sabiPoints} pts)`
    });
    onShowPointsToast(15, `Prepared and dispatched report to verification desk`);
  };

  // Handle Photo File Upload
  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image file is too large (max 5MB). Please choose a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewAvatarUrl(result);
      setUploadError(null);
    };
    reader.onerror = () => {
      setUploadError('Failed to read photo file. Please try another image.');
    };
    reader.readAsDataURL(file);
  };

  // Save selected or uploaded avatar
  const handleSaveAvatar = () => {
    const newUrl = customAvatarInput.trim() || previewAvatarUrl;
    if (!newUrl) return;

    storageService.updateUserAvatar(newUrl);
    setIsAvatarModalOpen(false);
    setCustomAvatarInput('');
    onShowPointsToast(10, 'Profile photo updated (+10 PTS)!');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-fade-in" id="profile-view-container">
      
      {/* PROFILE HEADER & ACCOUNT DETAILS CARD */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5" id="user-details-card">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          
          {/* Avatar with Camera Overlay */}
          <div className="relative group shrink-0">
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-[#0A3D2E] shadow-md transition-all group-hover:opacity-90"
            />
            
            {/* Clickable change photo button */}
            <button
              id="change-profile-photo-btn"
              onClick={() => {
                setPreviewAvatarUrl(user.avatarUrl);
                setIsAvatarModalOpen(true);
              }}
              className="absolute -bottom-1.5 -right-1.5 bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] p-2 rounded-xl shadow-md border-2 border-white transition-transform active:scale-90 flex items-center justify-center cursor-pointer"
              title="Add or Change your Profile Photo"
            >
              <Camera className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="space-y-1.5 flex-grow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-display flex items-center justify-center sm:justify-start gap-2">
                  <span>{user.name}</span>
                  {isLoggedIn && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                      Signed In
                    </span>
                  )}
                </h1>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-gray-600 font-medium">
                  <Mail className="w-3.5 h-3.5 text-[#0A3D2E]" />
                  <span className="font-semibold text-gray-900">{user.email}</span>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full border self-center sm:self-auto ${getTrustBadgeColor(user.trustLevel)} font-display`}>
                  ★ {user.role === 'admin' ? 'Master Admin' : `Trust: ${user.trustLevel}`}
                </span>
                {user.userTier && (
                  <span className="text-[10px] font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md self-center sm:self-auto flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-700" />
                    <span>{user.userTier} Tier Member</span>
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs text-gray-600">
              <span className="flex items-center gap-1 bg-gray-100 px-2.5 py-1 rounded-lg font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#0A3D2E]" /> {user.lga}, {user.state}
              </span>
              <span className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg font-bold">
                ✓ {user.accuracyRate}% Accuracy
              </span>
              <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg">
                Joined {user.joinedDate}
              </span>
            </div>

            {/* Quick Change Photo Link */}
            <div className="pt-1">
              <button
                onClick={() => {
                  setPreviewAvatarUrl(user.avatarUrl);
                  setIsAvatarModalOpen(true);
                }}
                className="text-xs font-bold text-[#0A3D2E] hover:underline flex items-center gap-1 mx-auto sm:mx-0"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Add / Update Profile Photo (+10 PTS)</span>
              </button>
            </div>
          </div>

        </div>

        {/* ACCOUNT ACTION BUTTONS */}
        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {isLoggedIn ? (
              /* When user is signed in: DO NOT show Sign Up button. Replace with clean Sign Out button */
              <button
                id="profile-logged-in-signout-btn"
                onClick={handleSignOut}
                className="bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold px-4 py-2 rounded-xl border border-red-200 flex items-center gap-1.5 transition-colors active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5 text-red-600" />
                <span>Sign Out</span>
              </button>
            ) : (
              /* When user is signed out: Show Sign In and Sign Up buttons */
              <>
                <button
                  id="switch-account-btn"
                  onClick={() => { setAuthInitialMode('signin'); setIsAuthModalOpen(true); }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#0A3D2E]" />
                  <span>Sign In</span>
                </button>

                <button
                  id="register-new-account-btn"
                  onClick={() => { setAuthInitialMode('signup'); setIsAuthModalOpen(true); }}
                  className="bg-emerald-50 hover:bg-emerald-100 text-[#0A3D2E] text-xs font-bold px-3.5 py-2 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[#0A3D2E]" />
                  <span>Sign Up (+100 PTS)</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {user.role === 'admin' ? (
              <button
                id="enter-admin-portal-profile-btn"
                onClick={() => onNavigate('admin')}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                <KeyRound className="w-3.5 h-3.5 text-white" />
                <span>Open Admin Portal</span>
              </button>
            ) : (
              <button
                id="admin-login-passkey-btn"
                onClick={() => { setAuthInitialMode('admin'); setIsAuthModalOpen(true); }}
                className="bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold px-3.5 py-2 rounded-xl border border-amber-200 flex items-center gap-1.5 transition-colors"
                title="Administrator Portal Access"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-700" />
                <span>Admin Login</span>
              </button>
            )}

            {isLoggedIn && (
              <button
                id="profile-signout-icon-btn"
                onClick={handleSignOut}
                className="text-gray-400 hover:text-red-600 text-xs p-2 rounded-xl hover:bg-red-50 transition-colors"
                title="Sign Out of Account"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* QUICK SEND REPORT DISPATCH ACTION CARD */}
      <div className="bg-gradient-to-r from-emerald-900 to-[#0A3D2E] text-white rounded-3xl p-5 sm:p-6 shadow-md space-y-3 border border-emerald-700/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-[#FFD60A] text-[#0A3D2E] px-2 py-0.5 rounded-md">
              <Send className="w-3 h-3" />
              <span>Direct Verification & Report Dispatch</span>
            </div>
            <h3 className="text-base font-bold font-display text-white">
              Send Report
            </h3>
            <p className="text-xs text-emerald-100/80">
              Submit custom verified prices, local news alerts, or system inquiries directly to the official admin desk.
            </p>
          </div>

          <button
            id="profile-send-report-email-btn"
            onClick={handleSendEmailReport}
            className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0 font-display"
          >
            <Mail className="w-4 h-4" />
            <span>Send Report</span>
          </button>
        </div>
      </div>

      {/* SABI POINTS DISPLAY CARD */}
      <div className="bg-gradient-to-br from-[#0A3D2E] to-[#072b20] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#0A3D2E]/40 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase text-[#FFD60A] tracking-wider font-display">
            Stat Points
          </span>
          <div className="w-8 h-8 rounded-xl bg-[#FFD60A]/20 flex items-center justify-center text-[#FFD60A]">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        <div className="space-y-1">
          <div className="text-4xl sm:text-5xl font-extrabold font-display tracking-tight text-white">
            {user.sabiPoints.toLocaleString()} <span className="text-xl font-bold text-[#FFD60A]">PTS</span>
          </div>
          <p className="text-xs text-gray-300 max-w-md leading-relaxed">
            Stat Points represent your contribution and credibility in verifying information across Nigeria. <strong>Points are not cash.</strong>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/15 text-center text-xs">
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <span className="text-[#FFD60A] font-bold block">+25</span>
            <span className="text-[10px] text-gray-300">Verified Task</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <span className="text-[#FFD60A] font-bold block">+10</span>
            <span className="text-[10px] text-gray-300">Reported Claim</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <span className="text-[#FFD60A] font-bold block">+15</span>
            <span className="text-[10px] text-gray-300">Market Price Log</span>
          </div>
          <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
            <span className="text-[#FFD60A] font-bold block">+100</span>
            <span className="text-[10px] text-gray-300">Sign Up Bonus</span>
          </div>
        </div>
      </div>

      {/* DAILY STREAK & DAILY MISSIONS HUB */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm space-y-5" id="daily-streak-missions-hub">
        
        {/* Streak Counter Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shadow-xs shrink-0">
              <Flame className="w-7 h-7 animate-pulse text-amber-500 fill-amber-500/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-gray-100 font-display">
                  Daily Contribution Streak
                </h3>
                <span className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 text-xs font-extrabold px-2.5 py-0.5 rounded-full font-display">
                  🔥 {user.streak?.consecutiveStreakDays || 1} Day Streak
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Contribute daily by verifying rumors or logging market prices to keep your streak burning!
              </p>
            </div>
          </div>
        </div>

        {/* Daily Missions Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-700 dark:text-gray-300 font-display flex items-center gap-1.5">
              <span>🎯 SABI Daily Missions</span>
              <span className="bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Resets Daily
              </span>
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Earn Stat Points & Boost Streak
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Mission 1: Verify Rumor */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
              user.streak?.missionsCompletedToday?.rumorVerified 
                ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800' 
                : 'bg-gray-50 border-gray-200 hover:border-gray-300 dark:bg-gray-800/50 dark:border-gray-700'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100 font-display">Verify On-Ground Rumor</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-extrabold px-1.5 py-0.2 rounded">+25 PTS</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Examine and verify claims or media.</p>
              </div>
              {user.streak?.missionsCompletedToday?.rumorVerified ? (
                <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Done
                </span>
              ) : (
                <button
                  onClick={() => onNavigate('verify')}
                  className="bg-[#0A3D2E] hover:bg-[#072b20] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shrink-0 active:scale-95 flex items-center gap-1 font-display cursor-pointer"
                >
                  <span>Go Verify</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mission 2: Log Market Price */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
              user.streak?.missionsCompletedToday?.marketReported 
                ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800' 
                : 'bg-gray-50 border-gray-200 hover:border-gray-300 dark:bg-gray-800/50 dark:border-gray-700'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100 font-display">Log Market Price Data</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-extrabold px-1.5 py-0.2 rounded">+10 PTS</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Report current food/commodity prices.</p>
              </div>
              {user.streak?.missionsCompletedToday?.marketReported ? (
                <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Done
                </span>
              ) : (
                <button
                  onClick={() => onNavigate('market')}
                  className="bg-[#0A3D2E] hover:bg-[#072b20] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shrink-0 active:scale-95 flex items-center gap-1 font-display cursor-pointer"
                >
                  <span>Go Market</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mission 3: Sabiers Chat */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
              user.streak?.missionsCompletedToday?.chatParticipated 
                ? 'bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800' 
                : 'bg-gray-50 border-gray-200 hover:border-gray-300 dark:bg-gray-800/50 dark:border-gray-700'
            }`}>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-gray-900 dark:text-gray-100 font-display">Join Sabiers Chat Discussion</span>
                  <span className="text-[10px] bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-extrabold px-1.5 py-0.2 rounded">+5 PTS</span>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">Chat with other verified spotters.</p>
              </div>
              {user.streak?.missionsCompletedToday?.chatParticipated ? (
                <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Done
                </span>
              ) : (
                <button
                  onClick={() => onNavigate('sabiers')}
                  className="bg-[#0A3D2E] hover:bg-[#072b20] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shrink-0 active:scale-95 flex items-center gap-1 font-display cursor-pointer"
                >
                  <span>Open Chat</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mission 4: Daily Check-in */}
            <div className="p-4 rounded-2xl border bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-300 dark:border-amber-800 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-amber-900 dark:text-amber-200 font-display">Claim 14-Day Streak Bonus</span>
                  <span className="text-[10px] bg-amber-500 text-white font-extrabold px-1.5 py-0.2 rounded">Daily Reward</span>
                </div>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">Check in daily for progressive bonus points.</p>
              </div>
              <button
                onClick={() => onNavigate('home')}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-sm transition-all shrink-0 active:scale-95 flex items-center gap-1 font-display cursor-pointer"
              >
                <span>Check-in Hub</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* TIER UPGRADE & TITLE PURCHASE STORE (Bronze 8,000, Golden 28,000, Deluxe 100,000) */}
      <TierUpgradeSection
        onShowToast={onShowPointsToast}
        onNavigate={onNavigate}
      />

      {/* TRUST SYSTEM & BADGES */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-gray-900 font-display">
              Trust Level Progression
            </h3>
            <p className="text-xs text-gray-500">
              Calculated using consensus consistency, fresh evidence quality, and on-ground reports.
            </p>
          </div>
          <ShieldCheck className="w-5 h-5 text-[#0A3D2E]" />
        </div>

        {/* Level Steps */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { name: 'Bronze', pts: '0+', active: true },
            { name: 'Silver', pts: '1,500+', active: user.sabiPoints >= 1500 },
            { name: 'Gold', pts: '2,500+', active: user.sabiPoints >= 2500 },
            { name: 'Trusted', pts: '4,000+', active: user.sabiPoints >= 4000 }
          ].map(lvl => (
            <div
              key={lvl.name}
              className={`p-3 rounded-2xl border text-center transition-all ${
                lvl.active 
                  ? 'bg-emerald-50 border-emerald-400 text-[#0A3D2E] font-bold' 
                  : 'bg-gray-50 border-gray-200 text-gray-400'
              }`}
            >
              <div className="text-xs font-display">{lvl.name}</div>
              <span className="text-[10px] opacity-75 block mt-0.5">{lvl.pts} pts</span>
            </div>
          ))}
        </div>

        {/* User Badges */}
        <div className="pt-2 border-t border-gray-100">
          <span className="text-xs font-bold text-gray-700 block mb-2 font-display">
            Earned Community Badges:
          </span>
          <div className="flex flex-wrap gap-2">
            {user.badges.map(b => (
              <span
                key={b}
                className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-gray-200 flex items-center gap-1.5"
              >
                <Medal className="w-3.5 h-3.5 text-[#0A3D2E]" />
                <span>{b}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* LEADERBOARD */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-base text-gray-900 font-display">
              Top Community Contributors
            </h3>
          </div>

          {/* Leaderboard Filters */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl text-xs font-bold">
            {(['Nigeria', 'State', 'LGA'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setLeaderboardFilter(tab)}
                className={`px-3 py-1 rounded-lg transition-all ${
                  leaderboardFilter === tab
                    ? 'bg-white text-[#0A3D2E] shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab === 'Nigeria' ? 'Nigeria' : tab === 'State' ? 'My State' : 'My LGA'}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          {filteredLeaderboard.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-all ${
                item.name.includes('(You)') || item.name === user.name
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-gray-50 border-gray-200/80 hover:bg-gray-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[11px] ${
                  idx === 0 
                    ? 'bg-amber-400 text-[#0A3D2E]' 
                    : idx === 1 
                    ? 'bg-slate-300 text-slate-800' 
                    : idx === 2 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}>
                  {idx + 1}
                </span>

                <div>
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <p className="text-[11px] text-gray-500">{item.lga}, {item.state}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-extrabold text-[#0A3D2E] text-xs font-display">
                  {item.points.toLocaleString()} PTS
                </span>
                <span className="text-[10px] text-gray-400 block">{item.badge}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* AVATAR PHOTO UPLOAD & SELECTION MODAL                    */}
      {/* ======================================================== */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-[#0A3D2E]" />
                <h3 className="font-extrabold text-base sm:text-lg text-gray-900 font-display">
                  Add Your Profile Photo
                </h3>
              </div>
              <button
                onClick={() => setIsAvatarModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Current / New Photo Live Preview */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/80">
              <img
                src={previewAvatarUrl}
                alt="Avatar preview"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover border-2 border-[#0A3D2E] shadow-md"
              />
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-extrabold text-sm text-gray-900 font-display">
                  Live Photo Preview
                </h4>
                <p className="text-xs text-gray-600">
                  Upload any photo from your phone or PC, or choose one of the Nigerian community avatars below.
                </p>
                <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md mt-1">
                  Earn +10 Stat Points on update!
                </span>
              </div>
            </div>

            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {uploadError}
              </div>
            )}

            {/* Option 1: Upload from Device */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                Option 1: Upload From Your Device / Camera
              </label>
              
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileUpload}
                  className="hidden"
                />
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs"
                >
                  <Upload className="w-4 h-4 text-[#FFD60A]" />
                  <span>Choose Photo / Take Selfie</span>
                </button>
              </div>
            </div>

            {/* Option 2: Choose from Nigerian Sabiers Preset Avatars */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                Option 2: Choose Verified Community Avatar
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      setPreviewAvatarUrl(av.url);
                      setCustomAvatarInput('');
                    }}
                    className={`p-2 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 relative ${
                      previewAvatarUrl === av.url
                        ? 'border-[#0A3D2E] bg-emerald-50 ring-2 ring-[#0A3D2E]/40'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    }`}
                  >
                    <img
                      src={av.url}
                      alt={av.label}
                      className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shadow-2xs"
                    />
                    <span className="text-[10px] font-bold text-gray-700 leading-tight block truncate w-full">
                      {av.label}
                    </span>
                    {previewAvatarUrl === av.url && (
                      <div className="absolute top-1 right-1 bg-[#0A3D2E] text-white p-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Option 3: Direct Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                Option 3: Or Paste Image Web Link
              </label>
              <input
                type="url"
                value={customAvatarInput}
                onChange={(e) => {
                  setCustomAvatarInput(e.target.value);
                  if (e.target.value.startsWith('http')) {
                    setPreviewAvatarUrl(e.target.value);
                  }
                }}
                placeholder="https://example.com/my-photo.jpg"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-[#0A3D2E] focus:outline-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(false)}
                className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveAvatar}
                className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-black text-xs px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 font-display"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save Photo (+10 PTS)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ABOUT SABI PLATFORM LINK CARD */}
      <div className="bg-gradient-to-r from-[#0A3D2E] to-[#0d4a38] text-white rounded-3xl p-6 shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase text-[#FFD60A] tracking-wider block font-display">
            SABI Community Project
          </span>
          <h3 className="text-base sm:text-lg font-extrabold font-display">
            About SABI Fact-Checking & Market Transparency
          </h3>
          <p className="text-xs text-gray-200">
            Learn about our community spotters, AI media verification, and price transparency pillars across Nigeria.
          </p>
        </div>
        <button
          onClick={() => onNavigate('about')}
          className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 ml-4 font-display"
        >
          View About →
        </button>
      </div>

      {/* AUTH MODAL FOR SIGN IN / SIGN UP / ADMIN */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authInitialMode}
        onAuthSuccess={(msg) => onShowPointsToast(msg.includes('Signed up') ? 100 : 0, msg)}
        onAdminSuccess={() => onNavigate('admin')}
      />

    </div>
  );
};
