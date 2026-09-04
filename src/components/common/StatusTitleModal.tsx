import React from 'react';
import { 
  Award, 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  X, 
  ArrowRight,
  TrendingUp,
  Lock
} from 'lucide-react';
import { UserProfile, UserTier } from '../../types';
import { TIER_DEFINITIONS } from '../../data/mockData';

interface StatusTitleModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onNavigate: (tab: string, extraData?: any) => void;
}

export const StatusTitleModal: React.FC<StatusTitleModalProps> = ({
  isOpen,
  onClose,
  user,
  onNavigate
}) => {
  if (!isOpen) return null;

  const currentTier: UserTier = user.userTier || 'Member';

  // Normalize tier name to standard keys: 'Bronze' | 'Golden' | 'Deluxe' | 'Admin Super'
  const tierStr = String(currentTier);
  const normalizedTier: 'Bronze' | 'Golden' | 'Deluxe' | 'Admin Super' = 
    tierStr === 'Admin Super' ? 'Admin Super' :
    tierStr === 'Deluxe' ? 'Deluxe' :
    (tierStr === 'Golden' || tierStr === 'Gold') ? 'Golden' : 'Bronze';

  const tierConfig = TIER_DEFINITIONS[normalizedTier] || TIER_DEFINITIONS['Bronze'];

  const getTierIcon = (tierKey: string) => {
    if (tierKey === 'Admin Super') return <Zap className="w-8 h-8 text-red-500 animate-pulse" />;
    if (tierKey === 'Deluxe') return <Crown className="w-8 h-8 text-purple-400" />;
    if (tierKey === 'Golden' || tierKey === 'Gold') return <Award className="w-8 h-8 text-amber-400" />;
    return <ShieldCheck className="w-8 h-8 text-emerald-400" />;
  };

  const getTierBadgeStyle = (tierKey: string) => {
    if (tierKey === 'Admin Super') return 'bg-gradient-to-r from-red-950 via-rose-950 to-black text-red-100 border-red-500/60 shadow-red-900/40';
    if (tierKey === 'Deluxe') return 'bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-200 border-purple-500/50 shadow-purple-900/30';
    if (tierKey === 'Golden' || tierKey === 'Gold') return 'bg-gradient-to-r from-amber-900 to-yellow-900 text-amber-200 border-amber-500/50 shadow-amber-900/30';
    return 'bg-gradient-to-r from-[#0A3D2E] to-emerald-900 text-emerald-100 border-emerald-500/50 shadow-emerald-900/30';
  };

  const statusTiers: ('Bronze' | 'Golden' | 'Deluxe' | 'Admin Super')[] = ['Bronze', 'Golden', 'Deluxe', 'Admin Super'];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      id="status-title-modal-overlay"
      onClick={onClose}
    >
      <div 
        className="bg-gray-950 text-white rounded-3xl max-w-xl w-full p-6 sm:p-7 border border-gray-800 shadow-2xl relative overflow-hidden space-y-6 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0A3D2E] text-[#FFD60A] border border-[#FFD60A]/40 flex items-center justify-center shrink-0 shadow-lg font-display">
              <Award className="w-6 h-6 text-[#FFD60A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-display text-white tracking-wide">
                  Your Current Status Title
                </h3>
                <span className="bg-[#FFD60A] text-[#0A3D2E] text-[10px] font-mono font-black px-2 py-0.5 rounded-full uppercase">
                  RANK STATUS
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Current status badge & unlocked privilege tier in the SABI Truth Network.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Active Status Display Box */}
        <div className={`p-5 rounded-2xl border shadow-xl relative z-10 space-y-3 ${getTierBadgeStyle(normalizedTier)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTierIcon(normalizedTier)}
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#FFD60A] block">
                  ACTIVE STATUS TITLE
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                  {tierConfig.title}
                </h2>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-gray-300 block uppercase">Sabi Balance</span>
              <span className="text-lg font-black text-[#FFD60A] font-display">
                {user.sabiPoints.toLocaleString()} <span className="text-xs">PTS</span>
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#FFD60A]" />
              <span className="font-bold">Point Multiplier: <span className="text-[#FFD60A] font-extrabold">{tierConfig.title.includes('Admin') ? 'MASTER ADMIN' : tierConfig.title.includes('Deluxe') ? '2.5x' : tierConfig.title.includes('Golden') ? '1.75x' : '1.25x'}</span></span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-300 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Status Verified ✓</span>
            </div>
          </div>
        </div>

        {/* Tier Comparison Breakdown */}
        <div className="space-y-3 relative z-10">
          <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider block">
            SABI Status Tiers & Progression:
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {statusTiers.map((key) => {
              const cfg = TIER_DEFINITIONS[key];
              const isSelected = normalizedTier === key;

              return (
                <div
                  key={key}
                  className={`p-2.5 rounded-2xl border text-center transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#0A3D2E]/90 border-[#FFD60A] text-white shadow-lg ring-2 ring-[#FFD60A]/40'
                      : 'bg-gray-900/60 border-gray-800 text-gray-400'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-base block">
                      {key === 'Admin Super' ? '⚡' : key === 'Deluxe' ? '💎' : key === 'Golden' ? '🥇' : '🥉'}
                    </span>
                    <h4 className={`text-[11px] font-black font-display leading-tight ${isSelected ? 'text-[#FFD60A]' : 'text-gray-200'}`}>
                      {key}
                    </h4>
                    <span className="text-[9px] font-mono block opacity-80 truncate">
                      {cfg.pointsCost.toLocaleString()} PTS
                    </span>
                  </div>

                  <div className="mt-2 pt-1.5 border-t border-white/10">
                    {isSelected ? (
                      <span className="text-[9px] font-extrabold text-[#FFD60A] bg-black/40 px-1.5 py-0.5 rounded-full uppercase">
                        Current
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-gray-400">
                        {user.sabiPoints >= cfg.pointsCost ? 'Unlocked' : 'Locked'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Perks list for active status */}
        <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 space-y-2 text-xs relative z-10">
          <span className="text-[10px] font-mono font-bold text-[#FFD60A] uppercase tracking-wider block">
            Included Perks for {tierConfig.title}:
          </span>
          <ul className="space-y-1.5 text-gray-300">
            {(tierConfig.benefits || []).map((benefit, bIdx) => (
              <li key={bIdx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 relative z-10">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('profile');
            }}
            className="w-full bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-black text-xs py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-display cursor-pointer"
          >
            <Crown className="w-4 h-4 text-[#0A3D2E]" />
            <span>Upgrade Status in Title Store</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('verify');
            }}
            className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs py-3 px-4 rounded-xl border border-gray-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#FFD60A]" />
            <span>Earn Sabi Points</span>
          </button>
        </div>

      </div>
    </div>
  );
};
