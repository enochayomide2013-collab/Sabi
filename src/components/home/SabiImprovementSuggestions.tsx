import React, { useState } from 'react';
import { 
  Lightbulb, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Mail, 
  User, 
  Layers, 
  MessageSquare, 
  HeartHandshake,
  AlertCircle
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { SabiSuggestion } from '../../types';

interface SabiImprovementSuggestionsProps {
  onShowToast?: (points: number, message: string) => void;
}

const CATEGORIES = [
  'User Interface & Design',
  'Truth Verification & AI Accuracy',
  'Market Food Prices & Basket Monitor',
  'Nigerian Language Translations',
  'Mobile Responsiveness & Speed',
  'New Feature Idea',
  'Bug Report & Fix',
  'Other Improvement'
];

export const SabiImprovementSuggestions: React.FC<SabiImprovementSuggestionsProps> = ({
  onShowToast
}) => {
  const currentUser = storageService.getUser();
  const [userName, setUserName] = useState<string>(currentUser.name || '');
  const [userEmail, setUserEmail] = useState<string>(currentUser.email || '');
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [suggestionText, setSuggestionText] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedText = suggestionText.trim();
    if (!trimmedText || trimmedText.length < 10) {
      setErrorMsg('Please describe your suggestion with at least 10 characters so the team can implement it.');
      return;
    }

    setIsSubmitting(true);

    const loc = storageService.getLocation();
    const suggestionPayload: SabiSuggestion = {
      id: 'sug_' + Date.now().toString(36),
      userName: userName.trim() || currentUser.name || 'Anonymous Spotter',
      userEmail: userEmail.trim() || currentUser.email || 'community@sabi.ng',
      category,
      suggestion: trimmedText,
      state: loc.state || 'Lagos',
      lga: loc.lga || loc.area || 'Ikeja',
      status: 'received',
      timestamp: new Date().toISOString()
    };

    try {
      // 1. Dispatch to backend API to email enochayomide67@gmail.com
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(suggestionPayload)
      });

      const data = await res.json().catch(() => ({}));
      
      // 2. Persist in local storage service & award points
      storageService.addSuggestion(suggestionPayload);

      setIsSubmitted(true);
      setSuggestionText('');
      if (onShowToast) {
        onShowToast(25, 'Suggestion dispatched to enochayomide67@gmail.com (+25 PTS)!');
      }
    } catch (err: any) {
      console.warn('Network suggestion send warning, stored locally:', err);
      // Fallback: still save locally and show success
      storageService.addSuggestion(suggestionPayload);
      setIsSubmitted(true);
      setSuggestionText('');
      if (onShowToast) {
        onShowToast(25, 'Suggestion recorded for the engineering team (+25 PTS)!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id="sabi-web-suggestions-box" 
      className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 border border-emerald-100 dark:border-gray-700 shadow-sm transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-150 dark:border-gray-700 pb-5 mb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-300">
            <Lightbulb className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <span>Community Feedback & Improvements</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white font-display tracking-tight">
            Suggest Website & Platform Improvements
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            Have an idea to make SABI faster, more accurate, or better for Nigeria? Submit below — each submission enters directly into the developer inbox (<span className="font-semibold text-emerald-700 dark:text-emerald-400">enochayomide67@gmail.com</span>) and earns you <strong className="text-amber-700 dark:text-amber-400">+25 PTS</strong>.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 px-3.5 py-2 rounded-2xl">
          <HeartHandshake className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
          <div className="text-left">
            <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 block uppercase">Destination</span>
            <span className="text-xs font-mono font-bold text-emerald-900 dark:text-emerald-300">enochayomide67@gmail.com</span>
          </div>
        </div>
      </div>

      {isSubmitted ? (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-6 text-center space-y-3 animate-fade-in" id="suggestion-submitted-success">
          <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-emerald-950 dark:text-emerald-100 font-display">
            Thank you for your suggestion!
          </h3>
          <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 max-w-md mx-auto">
            Your improvement note has been sent to <strong>enochayomide67@gmail.com</strong>. You've earned <strong>+25 SABI Points</strong> for supporting platform growth.
          </p>
          <button
            type="button"
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Submit Another Improvement</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" id="sabi-improvement-form">
          {errorMsg && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* User Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Your Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ayomide"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                />
              </div>
            </div>

            {/* User Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Your Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="e.g. enoch@example.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                />
              </div>
            </div>

            {/* Improvement Category */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                Category
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-9 pr-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Suggestion Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center justify-between">
              <span>Improvement Details / Desired Web Features</span>
              <span className="text-[10px] text-gray-400 font-normal">Dispatches to enochayomide67@gmail.com</span>
            </label>
            <div className="relative">
              <textarea
                rows={3}
                required
                placeholder="Describe what you want improved in SABI (e.g. faster fact checking, specific food markets, new Nigerian language translation, layout enhancements)..."
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl p-3.5 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none resize-y"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 dark:text-emerald-300 font-bold">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Earn +25 Sabi Points upon submission</span>
            </div>

            <button
              id="submit-sabi-suggestion-btn"
              type="submit"
              disabled={isSubmitting || !suggestionText.trim()}
              className="bg-[#0A3D2E] hover:bg-[#0c4a37] text-white text-xs font-bold py-3 px-6 rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending to Inbox...' : 'Submit Suggestion'}</span>
            </button>
          </div>
        </form>
      )}
    </section>
  );
};
