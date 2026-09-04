import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  X, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  FileText,
  UserCheck
} from 'lucide-react';
import { UserProfile, TrustLevel } from '../../types';

interface TrustLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onNavigate: (tab: string, extraData?: any) => void;
}

export const TrustLevelModal: React.FC<TrustLevelModalProps> = ({
  isOpen,
  onClose,
  user,
  onNavigate
}) => {
  if (!isOpen) return null;

  const trustLevel: TrustLevel = user.trustLevel || 'Bronze';
  const accuracyRate = user.accuracyRate || 96;
  const verificationsCount = user.completedVerificationsCount || 0;
  const reportsCount = user.submittedReportsCount || 0;

  const getTrustBadgeStyle = () => {
    switch (trustLevel) {
      case 'Trusted Contributor':
        return 'bg-gradient-to-r from-purple-900 via-indigo-900 to-black text-purple-200 border-purple-500/50 shadow-purple-950/50';
      case 'Gold':
        return 'bg-gradient-to-r from-amber-900 via-yellow-900 to-black text-amber-200 border-amber-500/50 shadow-amber-950/50';
      case 'Silver':
        return 'bg-gradient-to-r from-slate-800 via-slate-900 to-black text-slate-200 border-slate-400/50 shadow-slate-950/50';
      case 'Bronze':
      default:
        return 'bg-gradient-to-r from-[#0A3D2E] via-[#0d4f3b] to-black text-emerald-100 border-emerald-500/50 shadow-emerald-950/50';
    }
  };

  const getTrustShieldIcon = () => {
    if (trustLevel === 'Trusted Contributor') return <ShieldCheck className="w-8 h-8 text-purple-400" />;
    if (trustLevel === 'Gold') return <ShieldCheck className="w-8 h-8 text-amber-400" />;
    if (trustLevel === 'Silver') return <ShieldCheck className="w-8 h-8 text-slate-300" />;
    return <ShieldCheck className="w-8 h-8 text-emerald-400" />;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      id="trust-level-modal-overlay"
      onClick={onClose}
    >
      <div 
        className="bg-gray-950 text-white rounded-3xl max-w-xl w-full p-6 sm:p-7 border border-gray-800 shadow-2xl relative overflow-hidden space-y-6 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-lg font-display">
              <ShieldCheck className="w-6 h-6 text-[#FFD60A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-display text-white tracking-wide">
                  Verified Trust Title & Level
                </h3>
                <span className="bg-emerald-500 text-black text-[10px] font-mono font-black px-2 py-0.5 rounded-full uppercase">
                  VERIFIED TRUST
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Community trust rating & fact-checking authority metrics across Nigeria.
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

        {/* Main Trust Card */}
        <div className={`p-5 rounded-2xl border shadow-xl relative z-10 space-y-4 ${getTrustBadgeStyle()}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {getTrustShieldIcon()}
              <div>
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#FFD60A] block">
                  CURRENT TRUST TITLE
                </span>
                <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
                  {trustLevel} Truth Spotter
                </h2>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-gray-300 block uppercase">Accuracy Rating</span>
              <span className="text-2xl font-black text-emerald-400 font-display">
                {accuracyRate}%
              </span>
            </div>
          </div>

          {/* Key Stats Row */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
            <div className="bg-black/30 p-2.5 rounded-xl border border-white/10 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#FFD60A] shrink-0" />
              <div>
                <span className="text-[10px] text-gray-300 block font-mono">Spotter Verifications</span>
                <span className="font-extrabold text-white font-display text-sm">{verificationsCount} Claims</span>
              </div>
            </div>

            <div className="bg-black/30 p-2.5 rounded-xl border border-white/10 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-[10px] text-gray-300 block font-mono">Submitted Reports</span>
                <span className="font-extrabold text-white font-display text-sm">{reportsCount} Reports</span>
              </div>
            </div>
          </div>
        </div>

        {/* What this Trust Level gives you */}
        <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 space-y-2.5 text-xs relative z-10">
          <span className="text-[10px] font-mono font-bold text-[#FFD60A] uppercase tracking-wider block">
            Trust Level Privileges & Authority:
          </span>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Consensus Voting Weight:</strong> High-priority weight assigned when voting on viral TikTok/WhatsApp claims.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Certified Spotter Stamp:</strong> Your market foodstuff price reports carry the Official Certified Spotter badge.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Priority Forensics Queue:</strong> Immediate access to Deepfake X-Ray scan lenses and social infographic generation.</span>
            </li>
          </ul>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 relative z-10">
          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('verify');
            }}
            className="w-full bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-black text-xs py-3 px-4 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-display cursor-pointer"
          >
            <Zap className="w-4 h-4 text-[#0A3D2E]" />
            <span>Verify Local Claims (Boost Trust Score)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigate('truth');
            }}
            className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs py-3 px-4 rounded-xl border border-gray-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-[#FFD60A]" />
            <span>View Fact Dossiers</span>
          </button>
        </div>

      </div>
    </div>
  );
};
