import React, { useState } from 'react';
import { 
  Award, 
  Crown, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  ExternalLink,
  Gift,
  Headphones
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { UserProfile, UserTier } from '../../types';
import { TIER_DEFINITIONS } from '../../data/mockData';

interface TierUpgradeSectionProps {
  onShowToast: (points: number, message: string) => void;
  onNavigate: (tab: string, extraData?: any) => void;
}

export const TierUpgradeSection: React.FC<TierUpgradeSectionProps> = ({ onShowToast, onNavigate }) => {
  const [user, setUser] = useState<UserProfile>(storageService.getUser());
  const [purchasingTier, setPurchasingTier] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleBuyTier = (tierKey: 'Bronze' | 'Golden' | 'Deluxe') => {
    setPurchasingTier(tierKey);
    setTimeout(() => {
      setPurchasingTier(null);
      const res = storageService.purchaseTierUpgrade(tierKey);
      setMessage(res.message);
      
      if (res.success) {
        onShowToast(0, res.message);
      } else {
        onShowToast(0, res.message);
      }
      setTimeout(() => setMessage(null), 6000);
    }, 500);
  };

  const tiers: ('Bronze' | 'Golden' | 'Deluxe')[] = ['Bronze', 'Golden', 'Deluxe'];

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5" id="tier-upgrade-hub">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full uppercase">
            <Crown className="w-3.5 h-3.5 text-amber-600" />
            <span>Title Store & Progression Tiers</span>
          </div>
          <h3 className="font-extrabold text-lg sm:text-xl text-gray-900 font-display">
            Buy Titles & Upgrade Your Status
          </h3>
          <p className="text-xs text-gray-500">
            Spend earned Stat points to purchase verified titles, unlock "The Sabiation" AI suite, and VIP perks.
          </p>
        </div>

        <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-200 text-right">
          <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">Available Balance</span>
          <div className="text-lg font-extrabold text-[#0A3D2E] font-display">
            {user.sabiPoints.toLocaleString()} <span className="text-xs font-bold">PTS</span>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#0A3D2E] text-xs rounded-xl flex items-center gap-2 font-bold animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* The 3 Major Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map((tierKey) => {
          const config = TIER_DEFINITIONS[tierKey];
          const isCurrentTier = user.userTier === tierKey;
          const isPurchased = (user.unlockedTitles || []).includes(config.title) || isCurrentTier;
          const hasEnoughPoints = user.sabiPoints >= config.pointsCost;

          return (
            <div
              key={tierKey}
              className={`rounded-3xl p-5 border flex flex-col justify-between space-y-4 transition-all relative overflow-hidden ${
                isCurrentTier
                  ? 'bg-gradient-to-b from-amber-500/10 to-transparent border-amber-400 shadow-md ring-2 ring-amber-400/40'
                  : tierKey === 'Deluxe'
                  ? 'bg-gradient-to-b from-purple-500/5 to-transparent border-purple-200'
                  : tierKey === 'Golden'
                  ? 'bg-gradient-to-b from-amber-500/5 to-transparent border-amber-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {/* Highlight ribbon */}
              {isCurrentTier && (
                <div className="absolute top-0 right-0 bg-[#0A3D2E] text-[#FFD60A] text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider font-display">
                  Current Tier ✓
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold ${
                    tierKey === 'Deluxe' 
                      ? 'bg-purple-100 text-purple-800' 
                      : tierKey === 'Golden'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {tierKey === 'Deluxe' ? <Crown className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-gray-900 font-display">
                      {config.title}
                    </h4>
                    <span className="text-[11px] font-bold text-gray-500">
                      {config.badge}
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-2.5 bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Upgrade Price</span>
                  <div className="text-xl font-extrabold text-gray-900 font-display">
                    {config.pointsCost.toLocaleString()} <span className="text-xs font-bold text-[#0A3D2E]">SABI PTS</span>
                  </div>
                  {config.instantBonusPoints && (
                    <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                      + includes {config.instantBonusPoints.toLocaleString()} PTS instant bonus!
                    </span>
                  )}
                </div>

                {/* Feature Bullet List */}
                <ul className="space-y-1.5 text-xs text-gray-600">
                  {(config.benefits || []).map((perk, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-1.5">
                      <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                        tierKey === 'Deluxe' ? 'text-purple-600' : tierKey === 'Golden' ? 'text-amber-600' : 'text-emerald-600'
                      }`} />
                      <span className="leading-tight">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {isCurrentTier ? (
                  <button
                    disabled
                    className="w-full bg-emerald-100 text-emerald-900 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Unlocked & Active</span>
                  </button>
                ) : (
                  <button
                    id={`buy-tier-${tierKey.toLowerCase()}-btn`}
                    onClick={() => handleBuyTier(tierKey)}
                    disabled={purchasingTier === tierKey || !hasEnoughPoints}
                    className={`w-full font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 font-display ${
                      hasEnoughPoints
                        ? tierKey === 'Deluxe'
                          ? 'bg-purple-900 hover:bg-purple-800 text-white active:scale-95'
                          : tierKey === 'Golden'
                          ? 'bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] active:scale-95'
                          : 'bg-[#0A3D2E] hover:bg-[#0c4b38] text-white active:scale-95'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {purchasingTier === tierKey ? (
                      <span>Upgrading...</span>
                    ) : hasEnoughPoints ? (
                      <>
                        <Zap className="w-3.5 h-3.5" />
                        <span>Buy Title ({config.pointsCost.toLocaleString()} PTS)</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 text-gray-400" />
                        <span>Need {(config.pointsCost - user.sabiPoints).toLocaleString()} More PTS</span>
                      </>
                    )}
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* The Sabiation Portal & Secret Link Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-amber-800 to-[#0A3D2E] text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-amber-500/30">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-[#FFD60A] text-[#0A3D2E] px-2.5 py-0.5 rounded-md font-display">
            <Sparkles className="w-3 h-3 text-[#0A3D2E]" />
            <span>Golden & Deluxe Special Privilege</span>
          </div>
          <h4 className="text-lg font-extrabold text-white font-display">
            The Sabiation: Free AI Suite & Image Generation
          </h4>
          <p className="text-xs text-amber-100 max-w-xl">
            {user.hasSabiationAccess || user.userTier === 'Golden' || user.userTier === 'Deluxe'
              ? 'You have unlocked full Golden Sovereign access! Direct link: avidayo.created.app'
              : 'Upgrade to Golden (28,000 PTS) or Deluxe (100,000 PTS) to unlock direct access to the secret AI portal and image generation web tools.'}
          </p>

          {/* Conditional Secret Link: ONLY show avidayo.created.app if user is Golden or Deluxe */}
          {(user.hasSabiationAccess || user.userTier === 'Golden' || user.userTier === 'Deluxe') ? (
            <div className="mt-3 p-3 bg-amber-500/20 border border-[#FFD60A]/40 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#FFD60A] shrink-0" />
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#FFD60A] block">Golden Member Secret Web Portal:</span>
                  <a 
                    href="https://avidayo.created.app" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-mono font-bold text-white hover:text-[#FFD60A] underline flex items-center gap-1"
                  >
                    avidayo.created.app
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <a
                href="https://avidayo.created.app"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FFD60A] text-[#0A3D2E] font-black text-xs px-3 py-1.5 rounded-xl hover:bg-white transition-all shadow-xs shrink-0"
              >
                Open Portal ↗
              </a>
            </div>
          ) : (
            <div className="mt-2 p-2.5 bg-black/20 border border-white/10 rounded-xl text-[11px] text-amber-200/80 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Secret Golden Sovereign Link: <strong className="text-white/40 font-mono">•••••••••••••••••••••</strong> (Buy Golden tier to reveal)</span>
            </div>
          )}
        </div>

        <button
          id="open-sabiation-portal-btn"
          onClick={() => onNavigate('sabiation')}
          className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0 font-display mt-2 sm:mt-0"
        >
          <span>{(user.hasSabiationAccess || user.userTier === 'Golden' || user.userTier === 'Deluxe') ? 'Enter The Sabiation' : 'Preview Sabiation'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
