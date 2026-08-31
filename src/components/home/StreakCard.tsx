import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Award, 
  ChevronRight, 
  Zap,
  Gift,
  ShieldAlert
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { UserProfile, StreakRewardItem } from '../../types';
import { INITIAL_STREAK_REWARDS } from '../../data/mockData';

interface StreakCardProps {
  onClaimSuccess?: (points: number, day: number) => void;
  onNavigate?: (tab: string) => void;
}

export const StreakCard: React.FC<StreakCardProps> = ({ onClaimSuccess, onNavigate }) => {
  const [user, setUser] = useState<UserProfile>(storageService.getUser());
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isClaiming, setIsClaiming] = useState<boolean>(false);
  const [claimFeedback, setClaimFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setUser(storageService.getUser());
    });
    return unsubscribe;
  }, []);

  // Calculate live countdown timer until midnight Lagos time
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      // Calculate remaining time until next UTC midnight (or local day reset)
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      const diffMs = tomorrow.getTime() - now.getTime();
      
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
      const seconds = Math.floor((diffMs / 1000) % 60);

      setTimeLeft(`${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const streak = user.streak || {
    currentDay: 1,
    lastClaimDate: '',
    totalClaimedPoints: 0,
    streakHistory: INITIAL_STREAK_REWARDS.map(r => ({ day: r.day, points: r.points, claimed: false }))
  };

  const isClaimedToday = streak.lastClaimDate === todayStr;
  const currentDayNumber = Math.min(Math.max(streak.currentDay || 1, 1), 14);
  const currentDayReward = INITIAL_STREAK_REWARDS.find(r => r.day === currentDayNumber) || INITIAL_STREAK_REWARDS[0];

  const handleClaim = () => {
    if (isClaimedToday || isClaiming) return;

    setIsClaiming(true);
    setTimeout(() => {
      const res = storageService.claimStreakReward();
      setIsClaiming(false);

      if (res.success) {
        setClaimFeedback(`+${res.pointsAwarded} PTS Claimed! Day ${res.day} Active 🔥`);
        if (onClaimSuccess) {
          onClaimSuccess(res.pointsAwarded, res.day);
        }
        setTimeout(() => setClaimFeedback(null), 6000);
      } else {
        setClaimFeedback(res.message);
        setTimeout(() => setClaimFeedback(null), 4000);
      }
    }, 400);
  };

  // Calculate progress towards next tier
  const points = user.sabiPoints;
  const nextTarget = points < 8000 
    ? { name: 'Bronze Title', pts: 8000, left: 8000 - points, key: 'Bronze' }
    : points < 28000 
    ? { name: 'Golden (Sabiation)', pts: 28000, left: 28000 - points, key: 'Golden' }
    : { name: 'Deluxe VIP', pts: 100000, left: Math.max(0, 100000 - points), key: 'Deluxe' };

  const progressPercent = Math.min(100, Math.round((points / nextTarget.pts) * 100));

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-4 relative overflow-hidden" id="streak-timer-hub">
      
      {/* Header with Flame & Points Tracker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0 shadow-xs">
            <Flame className="w-6 h-6 animate-pulse text-amber-500 fill-amber-500/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900 font-display">
                14-Day Streak Timer
              </h3>
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Day {currentDayNumber} of 14
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Claim daily rewards to earn up to <strong>15,000+ Stat Points</strong> and unlock higher titles!
            </p>
          </div>
        </div>

        {/* Current Total Balance Pill */}
        <div className="text-left sm:text-right bg-emerald-50 sm:bg-transparent px-3 py-1.5 sm:p-0 rounded-xl border border-emerald-100 sm:border-0 flex items-center justify-between sm:block">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Your Balance</span>
          <div className="text-lg sm:text-xl font-extrabold text-[#0A3D2E] font-display">
            {user.sabiPoints.toLocaleString()} <span className="text-xs font-bold text-emerald-700">PTS</span>
          </div>
        </div>
      </div>

      {/* Daily Claim Banner Box */}
      <div className="bg-gradient-to-r from-[#0A3D2E] to-[#125844] text-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md relative overflow-hidden">
        <div className="space-y-1 text-center sm:text-left z-10">
          <div className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#FFD60A] text-[#0A3D2E] px-2.5 py-0.5 rounded-md uppercase font-display">
            <Zap className="w-3 h-3 fill-[#0A3D2E]" />
            <span>Today's Reward: +{currentDayReward.points} Points</span>
          </div>
          <h4 className="text-lg sm:text-xl font-extrabold text-white font-display">
            {isClaimedToday ? `Day ${currentDayNumber} Claimed ✓` : `Ready to Claim Day ${currentDayNumber}?`}
          </h4>
          <p className="text-xs text-emerald-100/90 flex items-center justify-center sm:justify-start gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Next reset in: <strong className="text-[#FFD60A] font-mono">{timeLeft}</strong></span>
          </p>
        </div>

        <div className="z-10 w-full sm:w-auto">
          <button
            id="claim-streak-reward-btn"
            onClick={handleClaim}
            disabled={isClaimedToday || isClaiming}
            className={`w-full sm:w-auto font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 font-display ${
              isClaimedToday
                ? 'bg-emerald-800/80 text-emerald-200 border border-emerald-600/50 cursor-not-allowed'
                : 'bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] active:scale-95 cursor-pointer shadow-amber-500/20'
            }`}
          >
            {isClaimedToday ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Claimed for Today</span>
              </>
            ) : isClaiming ? (
              <span>Claiming...</span>
            ) : (
              <>
                <Gift className="w-4 h-4 text-[#0A3D2E]" />
                <span>Claim +{currentDayReward.points} PTS Now</span>
              </>
            )}
          </button>
        </div>
      </div>

      {claimFeedback && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#0A3D2E] text-xs rounded-xl flex items-center gap-2 font-bold animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{claimFeedback}</span>
        </div>
      )}

      {/* 14-Day Visual Progression Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span className="font-bold font-display">14-Day Calendar Tracker</span>
          <span className="text-[11px] text-gray-500">First day gives +300 PTS</span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 sm:gap-2">
          {INITIAL_STREAK_REWARDS.map((reward) => {
            const isCompleted = streak.streakHistory.find(h => h.day === reward.day)?.claimed || (reward.day < currentDayNumber);
            const isCurrent = reward.day === currentDayNumber;

            return (
              <div
                key={reward.day}
                className={`p-1.5 sm:p-2 rounded-xl text-center border transition-all flex flex-col items-center justify-between min-h-[58px] sm:min-h-[64px] ${
                  isCompleted
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                    : isCurrent
                    ? 'bg-amber-50 border-amber-400 text-amber-950 font-extrabold ring-2 ring-amber-400/50 shadow-xs'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
              >
                <span className="text-[9px] sm:text-[10px] font-bold block uppercase">
                  D{reward.day}
                </span>

                <div className="my-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : isCurrent ? (
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-gray-400">+{reward.points}</span>
                  )}
                </div>

                <span className={`text-[8px] sm:text-[9px] font-bold truncate ${
                  isCompleted ? 'text-emerald-700' : isCurrent ? 'text-amber-800' : 'text-gray-400'
                }`}>
                  +{reward.points}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress towards Next Tier / Title Upgrade */}
      <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-gray-800">
              Next Goal: {nextTarget.name} ({nextTarget.pts.toLocaleString()} PTS)
            </span>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('profile')}
              className="text-[#0A3D2E] font-bold hover:underline flex items-center gap-0.5 text-[11px]"
            >
              <span>View Titles & Tiers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-[#0A3D2E] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500">
          <span>{user.sabiPoints.toLocaleString()} PTS ({progressPercent}%)</span>
          <span>{nextTarget.left > 0 ? `${nextTarget.left.toLocaleString()} PTS needed` : 'Goal achieved!'}</span>
        </div>
      </div>

    </div>
  );
};
