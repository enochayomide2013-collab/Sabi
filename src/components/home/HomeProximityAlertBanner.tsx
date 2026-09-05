import React, { useState, useEffect } from 'react';
import { AlertTriangle, MapPin, CheckCircle2, XCircle, Send, MessageSquare, ShieldCheck, Navigation } from 'lucide-react';
import { storageService, SelectedLocation } from '../../services/storageService';
import type { TruthResult, ResultType } from '../../types';
import { consensusVerificationService, ConsensusRecord } from '../../services/consensusVerificationService';

interface HomeProximityAlertBannerProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onShowToast?: (points: number, message: string) => void;
}

export const HomeProximityAlertBanner: React.FC<HomeProximityAlertBannerProps> = ({ onNavigate, onShowToast }) => {
  const [location, setLocation] = useState<SelectedLocation>(storageService.getLocation());
  const [isTracing, setIsTracing] = useState<boolean>(storageService.isTracingEnabled());
  const [truthResults, setTruthResults] = useState<TruthResult[]>(storageService.getTruthResults());
  const [activeRumor, setActiveRumor] = useState<TruthResult | null>(null);
  const [consensusRecord, setConsensusRecord] = useState<ConsensusRecord | null>(null);

  // Form states for street comment submission
  const [userVote, setUserVote] = useState<'TRUE' | 'FALSE'>('FALSE');
  const [streetAddressInput, setStreetAddressInput] = useState<string>(location.street || location.exactAddress || `${location.area}, ${location.state}`);
  const [commentInput, setCommentInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubStorage = storageService.subscribe(() => {
      const loc = storageService.getLocation();
      setLocation(loc);
      setIsTracing(storageService.isTracingEnabled());
      setTruthResults(storageService.getTruthResults());
    });
    const unsubConsensus = consensusVerificationService.subscribe(() => {
      if (activeRumor) {
        setConsensusRecord(consensusVerificationService.getRecord(activeRumor.id));
      }
    });
    return () => {
      unsubStorage();
      unsubConsensus();
    };
  }, [activeRumor]);

  // Match nearby rumor based on user state or area or street
  useEffect(() => {
    if (!isTracing) {
      setActiveRumor(null);
      return;
    }

    const locState = (location.state || '').toLowerCase();
    const locArea = (location.area || '').toLowerCase();
    const locStreet = (location.street || '').toLowerCase();

    // Find rumor matching location or default to first rumor if user state matches
    const match = truthResults.find(r => {
      const rState = (r.state || '').toLowerCase();
      const rArea = (r.area || '').toLowerCase();
      const rClaim = (r.claim || '').toLowerCase();

      return (
        (locState && rState.includes(locState)) ||
        (locArea && (rArea.includes(locArea) || rClaim.includes(locArea))) ||
        (locStreet && rClaim.includes(locStreet))
      );
    }) || truthResults[0];

    if (match) {
      setActiveRumor(match);
      setConsensusRecord(consensusVerificationService.getRecord(match.id));
      setStreetAddressInput(location.street || location.exactAddress || `${match.area || location.area}, ${match.state || location.state}`);
    }
  }, [location, isTracing, truthResults]);

  if (!isTracing || !activeRumor) return null;

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setIsSubmitting(true);
    const user = storageService.getUser();

    const res = consensusVerificationService.addVerificationComment({
      rumorId: activeRumor.id,
      userName: user.name || 'Community Spotter',
      userRole: user.trustLevel || 'Field Verifier',
      streetLocation: streetAddressInput.trim() || `${location.area}, ${location.state}`,
      vote: userVote,
      comment: commentInput.trim(),
      state: location.state,
      lga: location.lga
    });

    setIsSubmitting(false);
    setCommentInput('');
    setFeedbackMsg(res.message);

    if (onShowToast) {
      onShowToast(25, res.message);
    }

    // Refresh active rumor record
    setConsensusRecord(res.record);
  };

  const trueVotes = consensusRecord?.trueVotes || 0;
  const falseVotes = consensusRecord?.falseVotes || 0;
  const totalVotes = consensusRecord?.totalVotes || 0;
  const targetThreshold = consensusRecord?.requiredVotesForAutoVerdict || 8;

  return (
    <section id="proximity-rumor-street-verifier-banner" className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 text-white rounded-3xl p-5 sm:p-6 shadow-xl border-2 border-amber-300 relative overflow-hidden animate-fade-in space-y-4">
      
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header alert badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-amber-400/50 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-white text-amber-700 flex items-center justify-center font-black shadow-md shrink-0">
            <AlertTriangle className="w-5 h-5 animate-bounce text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-black/30 text-yellow-200 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border border-yellow-300/40">
                🚨 PROXIMITY RUMOR ALERT
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-100 font-bold">
                <Navigation className="w-3 h-3 text-yellow-300 animate-pulse" />
                Tracing Active
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-white font-display mt-0.5 leading-snug">
              You are near an unverified social media rumor!
            </h3>
          </div>
        </div>

        {/* Current User Street Location Display */}
        <div className="bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-xl border border-yellow-300/40 text-xs flex items-center gap-1.5 shrink-0">
          <MapPin className="w-4 h-4 text-yellow-300 shrink-0" />
          <span className="font-bold text-yellow-100 truncate max-w-[200px]">
            {location.street ? `Street: ${location.street}` : `${location.area}, ${location.state}`}
          </span>
        </div>
      </div>

      {/* Rumor details & current consensus state */}
      <div className="bg-black/25 backdrop-blur-sm rounded-2xl p-4 border border-white/20 space-y-3 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-200 uppercase tracking-wide">
              Target Claim in {activeRumor.state || location.state}:
            </p>
            <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug">
              "{activeRumor.claim}"
            </h4>
          </div>

          <div className="shrink-0">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black shadow-xs ${
              activeRumor.result === 'TRUE' 
                ? 'bg-emerald-500 text-white' 
                : activeRumor.result === 'FALSE' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-amber-300 text-amber-900'
            }`}>
              Status: {activeRumor.result}
            </span>
          </div>
        </div>

        {/* 8-VOTE CONSENSUS PROGRESS BAR */}
        <div className="bg-black/30 p-3 rounded-xl border border-amber-300/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-amber-100 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-yellow-300" />
              Community Street Consensus Meter ({totalVotes}/{targetThreshold} Votes)
            </span>
            <span className="text-yellow-300 font-extrabold">
              {Math.max(trueVotes, falseVotes)}/8 Votes (Need 8 for Auto Verdict)
            </span>
          </div>

          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden flex">
            <div 
              style={{ width: `${Math.min((falseVotes / targetThreshold) * 100, 100)}%` }} 
              className="bg-red-500 h-full transition-all duration-500" 
              title={`${falseVotes} FALSE votes`}
            />
            <div 
              style={{ width: `${Math.min((trueVotes / targetThreshold) * 100, 100)}%` }} 
              className="bg-emerald-400 h-full transition-all duration-500" 
              title={`${trueVotes} TRUE votes`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-amber-100 font-medium">
            <span className="text-red-200 font-bold">❌ {falseVotes} Debunked (FALSE)</span>
            <span className="text-emerald-200 font-bold">✅ {trueVotes} Confirmed (TRUE)</span>
          </div>
        </div>
      </div>

      {/* STREET VERIFICATION COMMENT FORM */}
      <form onSubmit={handleSubmitVerification} className="bg-white text-gray-900 rounded-2xl p-4 shadow-lg space-y-3 relative z-10" id="proximity-verification-comment-form">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold text-[#0A3D2E] uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-[#0A3D2E]" />
            Please Verify: Is this rumor TRUE or FALSE on your street?
          </label>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full">
            +25 PTS
          </span>
        </div>

        {/* Vote Selection Toggle Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setUserVote('FALSE')}
            className={`py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
              userVote === 'FALSE'
                ? 'bg-red-600 text-white border-red-700 shadow-md scale-[1.02]'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
            }`}
          >
            <XCircle className="w-4 h-4" />
            <span>It is FALSE / Fake</span>
          </button>

          <button
            type="button"
            onClick={() => setUserVote('TRUE')}
            className={`py-2.5 px-3 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
              userVote === 'TRUE'
                ? 'bg-emerald-700 text-white border-emerald-800 shadow-md scale-[1.02]'
                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>It is TRUE / Real</span>
          </button>
        </div>

        {/* Street location input */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-600">Your Street / Spot Location:</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={streetAddressInput}
              onChange={(e) => setStreetAddressInput(e.target.value)}
              placeholder="Enter street name (e.g., Herbert Macaulay Way, Yaba)"
              className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
            />
          </div>
        </div>

        {/* Comment Text Area */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-gray-600">Explain why it is {userVote}:</label>
          <textarea
            rows={2}
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder={`Explain what you see on ${streetAddressInput || 'your street'} right now...`}
            className="w-full bg-gray-50 border border-gray-300 rounded-xl p-2.5 text-xs font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
            required
          />
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <p className="text-[10px] text-gray-500 font-medium">
            At least 8 spotters' agreement automatically updates official rumor status.
          </p>

          <button
            type="submit"
            disabled={isSubmitting || !commentInput.trim()}
            className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit Verification</span>
          </button>
        </div>

        {feedbackMsg && (
          <p className="text-xs font-bold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 animate-fade-in">
            {feedbackMsg}
          </p>
        )}
      </form>

      {/* RECENT STREET VERIFICATION COMMENTS */}
      {consensusRecord && consensusRecord.comments.length > 0 && (
        <div className="space-y-2 relative z-10 pt-1">
          <h5 className="text-xs font-black text-yellow-200 uppercase tracking-wider flex items-center justify-between">
            <span>Recent Street Verifications ({consensusRecord.comments.length})</span>
            <span className="text-[10px] font-normal text-amber-100">Live UMap Stream</span>
          </h5>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {consensusRecord.comments.slice(0, 4).map(c => (
              <div key={c.id} className="bg-black/30 backdrop-blur-xs rounded-xl p-2.5 border border-amber-300/30 text-xs space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-extrabold text-white truncate">{c.userName}</span>
                    <span className="text-[9px] bg-yellow-300 text-amber-900 font-black px-1.5 py-0.2 rounded-md truncate">
                      📍 {c.streetLocation}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    c.vote === 'TRUE' ? 'bg-emerald-500 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {c.vote}
                  </span>
                </div>
                <p className="text-amber-100 text-[11px] leading-relaxed">"{c.comment}"</p>
                <p className="text-[9px] text-amber-200/80">{c.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </section>
  );
};
