import React, { useState, useEffect } from 'react';
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
  Headphones,
  X,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Film
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { storageService } from '../../services/storageService';
import { UserProfile, UserTier } from '../../types';
import { TIER_DEFINITIONS } from '../../data/mockData';

interface TierUpgradeSectionProps {
  onShowToast: (points: number, message: string) => void;
  onNavigate: (tab: string, extraData?: any) => void;
}

interface CongratModalState {
  tierKey: 'Bronze' | 'Golden' | 'Deluxe';
  title: string;
  badge: string;
  bonusPoints?: number;
  multiplier: string;
  perks: string[];
}

export const TierUpgradeSection: React.FC<TierUpgradeSectionProps> = ({ onShowToast, onNavigate }) => {
  const [user, setUser] = useState<UserProfile>(storageService.getUser());
  const [purchasingTier, setPurchasingTier] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [congratModal, setCongratModal] = useState<CongratModalState | null>(null);

  useEffect(() => {
    const unsub = storageService.subscribe(() => {
      setUser(storageService.getUser());
    });
    return unsub;
  }, []);

  const launchConfetti = () => {
    try {
      confetti({
        particleCount: 130,
        spread: 90,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 65,
          origin: { x: 0.08, y: 0.65 }
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 65,
          origin: { x: 0.92, y: 0.65 }
        });
      }, 250);
    } catch {
      // Fallback safe
    }
  };

  const handleBuyTier = (tierKey: 'Bronze' | 'Golden' | 'Deluxe' | 'Admin Super') => {
    setPurchasingTier(tierKey);
    setTimeout(() => {
      setPurchasingTier(null);
      const res = storageService.purchaseTierUpgrade(tierKey);
      setMessage(res.message);
      
      if (res.success) {
        // Immediately sync user state
        const updated = storageService.getUser();
        setUser(updated);

        // Fire celebratory confetti!
        launchConfetti();

        // Show toast
        onShowToast(0, res.message);

        // Open Congratulatory Modal with full perks summary
        const config = TIER_DEFINITIONS[tierKey];
        const multiplierText = tierKey === 'Admin Super' ? 'MASTER ADMIN' : tierKey === 'Deluxe' ? '2.5x' : tierKey === 'Golden' ? '1.75x' : '1.25x';

        setCongratModal({
          tierKey: tierKey as any,
          title: config.title,
          badge: config.badge,
          bonusPoints: tierKey === 'Deluxe' ? config.instantBonusPoints : undefined,
          multiplier: multiplierText,
          perks: config.benefits || []
        });
      } else {
        onShowToast(0, res.message);
      }
      setTimeout(() => setMessage(null), 6000);
    }, 400);
  };

  const tiers: ('Bronze' | 'Golden' | 'Deluxe' | 'Admin Super')[] = ['Bronze', 'Golden', 'Deluxe', 'Admin Super'];

  // Tier hierarchy index map
  const TIER_RANKS: Record<string, number> = {
    'Member': 0,
    'Bronze': 1,
    'Golden': 2,
    'Gold': 2,
    'Deluxe': 3,
    'Admin Super': 4
  };

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

      {/* The 4 Tiers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tierKey) => {
          const config = TIER_DEFINITIONS[tierKey];
          const isCurrentTier = user.userTier === tierKey;
          const userRank = TIER_RANKS[user.userTier || 'Member'] || 0;
          const targetRank = TIER_RANKS[tierKey] || 0;
          const isLowerTier = userRank > targetRank;
          const hasEnoughPoints = user.sabiPoints >= config.pointsCost;

          return (
            <div
              key={tierKey}
              className={`rounded-3xl p-5 border flex flex-col justify-between space-y-4 transition-all relative overflow-hidden ${
                isCurrentTier
                  ? 'bg-gradient-to-b from-amber-500/10 to-transparent border-amber-400 shadow-md ring-2 ring-amber-400/40'
                  : tierKey === 'Admin Super'
                  ? 'bg-gradient-to-b from-rose-500/10 via-red-950/5 to-black border-red-500/40'
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
                    tierKey === 'Admin Super'
                      ? 'bg-red-100 text-red-800'
                      : tierKey === 'Deluxe' 
                      ? 'bg-purple-100 text-purple-800' 
                      : tierKey === 'Golden'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {tierKey === 'Admin Super' ? <Zap className="w-5 h-5 text-red-600" /> : tierKey === 'Deluxe' ? <Crown className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-gray-900 font-display">
                      {config.title}
                    </h4>
                    <span className="text-[11px] font-bold text-gray-500 block">
                      {config.badge}
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-2.5 bg-white rounded-2xl border border-gray-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">Upgrade Price</span>
                  <div className="text-lg sm:text-xl font-extrabold text-gray-900 font-display">
                    {config.pointsCost.toLocaleString()} <span className="text-xs font-bold text-[#0A3D2E]">SABI PTS</span>
                  </div>
                  {config.instantBonusPoints && (
                    <span className="text-[10px] font-extrabold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md inline-block mt-0.5">
                      + includes {config.instantBonusPoints.toLocaleString()} PTS instant bonus!
                    </span>
                  )}
                  {config.adminPasswordReveal && (isCurrentTier || user.role === 'admin') && (
                    <div className="mt-2 p-2 bg-red-950 text-red-200 rounded-xl border border-red-800 text-[11px] font-mono font-bold">
                      🔑 Master Admin Password: <span className="text-amber-300 font-black">{config.adminPasswordReveal}</span>
                    </div>
                  )}
                </div>

                {/* Feature Bullet List */}
                <ul className="space-y-1.5 text-xs text-gray-600">
                  {(config.benefits || []).map((perk, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-1.5">
                      <CheckCircle2 className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                        tierKey === 'Admin Super' ? 'text-red-600' : tierKey === 'Deluxe' ? 'text-purple-600' : tierKey === 'Golden' ? 'text-amber-600' : 'text-emerald-600'
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
                ) : isLowerTier ? (
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-400 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-not-allowed"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Previous Rank (Locked)</span>
                  </button>
                ) : (
                  <button
                    id={`buy-tier-${tierKey.toLowerCase().replace(/\s+/g, '-')}-btn`}
                    onClick={() => handleBuyTier(tierKey)}
                    disabled={purchasingTier === tierKey || !hasEnoughPoints}
                    className={`w-full font-bold text-xs py-3 px-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 font-display ${
                      hasEnoughPoints
                        ? tierKey === 'Admin Super'
                          ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white active:scale-95'
                          : tierKey === 'Deluxe'
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
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-[#0A3D2E] text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-purple-400/40">
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-[#FFD60A] text-[#0A3D2E] px-2.5 py-0.5 rounded-md font-display">
            <Crown className="w-3 h-3 text-[#0A3D2E]" />
            <span>Deluxe Sovereign VIP Exclusive Privilege</span>
          </div>
          <h4 className="text-lg font-extrabold text-white font-display">
            The Sabiation: AI Suite & Secret Web Portal
          </h4>
          <p className="text-xs text-purple-100 max-w-xl">
            {user.userTier === 'Deluxe' || user.role === 'admin'
              ? 'You have unlocked full Deluxe Sovereign VIP access! Secret link: avidayo.created.app'
              : 'Upgrade to Deluxe Sovereign VIP (300,000 PTS) to unlock exclusive direct access to The Sabiation AI generation tools & avidayo.created.app portal.'}
          </p>

          {/* Conditional Secret Link: ONLY show avidayo.created.app if user is Deluxe */}
          {(user.userTier === 'Deluxe' || user.role === 'admin') ? (
            <div className="mt-3 p-3 bg-purple-500/20 border border-purple-300/40 rounded-2xl flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#FFD60A] shrink-0" />
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#FFD60A] block">Deluxe VIP Secret Web Portal:</span>
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
            <div className="mt-2 p-2.5 bg-black/20 border border-white/10 rounded-xl text-[11px] text-purple-200/80 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Secret Deluxe VIP Link: <strong className="text-white/40 font-mono">•••••••••••••••••••••</strong> (Unlock Deluxe title to reveal)</span>
            </div>
          )}
        </div>

        <button
          id="open-sabiation-portal-btn"
          onClick={() => onNavigate('sabiation')}
          className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0 font-display mt-2 sm:mt-0 cursor-pointer"
        >
          <span>{(user.userTier === 'Deluxe' || user.role === 'admin') ? 'Enter The Sabiation' : 'Sabiation (Deluxe Only)'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Deluxe Forensic Tools Suite Feature Card */}
      <div className="bg-gradient-to-r from-[#0A3D2E] via-[#0f4a38] to-purple-950 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-400/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center shrink-0 font-black shadow-sm">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-[#FFD60A] text-[#0A3D2E] px-2.5 py-0.5 rounded-full font-mono">
                  Deluxe Unlocked Forensic Tools
                </span>
                <span className={`text-xs font-bold ${user.userTier === 'Deluxe' || user.role === 'admin' ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {user.userTier === 'Deluxe' || user.role === 'admin' ? 'Ready to Use ✓' : 'Requires Deluxe Title'}
                </span>
              </div>
              <h4 className="text-lg font-extrabold text-white font-display mt-0.5">
                Deluxe Forensic Evidence Suite
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => onNavigate('image-authenticity')}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer font-display"
            >
              <ImageIcon className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>1. 🖼️ Image Check</span>
            </button>
            <button
              onClick={() => onNavigate('video-analysis')}
              className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] text-xs font-black px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer font-display"
            >
              <Video className="w-3.5 h-3.5 text-[#0A3D2E]" />
              <span>2. 🎥 Video Analysis</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-emerald-100/90 leading-relaxed">
          Deep media investigations for SABI verifiers. Scan images for AI synthesis, camera metadata tampering, and compression artifacts; analyze video keyframes, jump-cut splice points, and audio-visual synchronization signals.
        </p>
      </div>

      {/* CELEBRATION CONGRATULATIONS MODAL */}
      {congratModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in"
          id="tier-congratulations-modal"
        >
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border-2 border-amber-400 shadow-2xl relative overflow-hidden space-y-5 animate-scale-up">
            
            {/* Top decorative badge */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
                {congratModal.tierKey === 'Deluxe' ? (
                  <Crown className="w-9 h-9 text-purple-950" />
                ) : congratModal.tierKey === 'Golden' ? (
                  <Award className="w-9 h-9 text-amber-950" />
                ) : (
                  <ShieldCheck className="w-9 h-9 text-amber-950" />
                )}
              </div>

              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Title Unlocked & Perks Activated Immediately</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-gray-950 font-display tracking-tight">
                Congratulations, {user.name}! 🎉
              </h2>

              <p className="text-xs sm:text-sm text-gray-600">
                You are now officially a verified <strong className="text-gray-950">{congratModal.title}</strong>! All perks have been granted to your account immediately with zero delay.
              </p>
            </div>

            {/* Perks list summary */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2.5">
              <span className="text-[10px] font-extrabold uppercase text-amber-900 tracking-wider block">
                Instant Active Perks & Benefits:
              </span>
              <ul className="space-y-2 text-xs text-gray-800">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>{congratModal.multiplier} Points Multiplier:</strong> Applied automatically to every task and price submission.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Special Group Chat Icon:</strong> Your messages in <em>The Sabiers</em> group chat now show your exclusive title icon and VIP flair!</span>
                </li>
                {congratModal.bonusPoints && congratModal.bonusPoints > 0 && (
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>+{congratModal.bonusPoints.toLocaleString()} Instant Bonus Points:</strong> Credited immediately to your balance!</span>
                  </li>
                )}
                {congratModal.tierKey === 'Deluxe' && (
                  <>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span><strong>Direct Sabi Founder VIP Access:</strong> Call or WhatsApp the founder directly at <span className="font-mono font-bold text-purple-900 bg-purple-100 px-1.5 py-0.5 rounded">+234 8032813855</span> for private high-level advisory.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span><strong>Exclusive Access to "The Sabiation":</strong> Full access to 4K Image Generation, Quization, Numa, Avid, and 1-Year VIP Concierge Support!</span>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => {
                  setCongratModal(null);
                  onNavigate('sabiers');
                }}
                className="w-full bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 font-display"
              >
                <MessageSquare className="w-4 h-4 text-[#FFD60A]" />
                <span>Go to Group Chat (See My New Icon)</span>
              </button>

              {congratModal.tierKey === 'Deluxe' && (
                <button
                  type="button"
                  onClick={() => {
                    setCongratModal(null);
                    onNavigate('sabiation');
                  }}
                  className="w-full bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-black text-xs py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 font-display"
                >
                  <Crown className="w-4 h-4" />
                  <span>Launch The Sabiation AI</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setCongratModal(null)}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs py-3 px-4 rounded-xl transition-all"
              >
                Awesome!
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
