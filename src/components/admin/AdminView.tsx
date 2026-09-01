import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Send, 
  Mail, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Sparkles, 
  Trash2, 
  ArrowRight, 
  KeyRound, 
  PlusCircle, 
  RefreshCw, 
  Eye, 
  LogOut,
  ChevronRight,
  ExternalLink,
  Lock,
  Zap,
  Search,
  UserCheck
} from 'lucide-react';
import { storageService, ADMIN_MASTER_PASSWORD } from '../../services/storageService';
import { VerificationTask, TruthResult, UserAccount, SentEmailReport, ResultType, UserProfile, UserAuthLog } from '../../types';

interface AdminViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onShowToast: (points: number, message: string) => void;
  onExitAdmin: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  onNavigate,
  onShowToast,
  onExitAdmin
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(storageService.getUser());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(storageService.isUserLoggedIn());

  const [tasks, setTasks] = useState<VerificationTask[]>(storageService.getTasks());
  const [truthResults, setTruthResults] = useState<TruthResult[]>(storageService.getTruthResults());
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(storageService.getRegisteredUsers());
  const [sentEmails, setSentEmails] = useState<SentEmailReport[]>(storageService.getSentEmailReports());
  const [authLogs, setAuthLogs] = useState<UserAuthLog[]>(storageService.getAuthLogs());
  const [authSearchQuery, setAuthSearchQuery] = useState<string>('');

  const [activeAdminTab, setActiveAdminTab] = useState<'reports' | 'cheat_code' | 'email_dispatch' | 'users' | 'auth_logs' | 'sent_logs'>('auth_logs');

  // Passkey Protection Gate
  const [isPasskeyUnlocked, setIsPasskeyUnlocked] = useState<boolean>(currentUser.role === 'admin');
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [passkeyError, setPasskeyError] = useState<string | null>(null);

  // Cheat code points generator state
  const [cheatPointsInput, setCheatPointsInput] = useState<string>('50000');
  const [cheatSuccessMsg, setCheatSuccessMsg] = useState<string | null>(null);

  // Custom Quick Email Dispatch form state
  const [customClaim, setCustomClaim] = useState<string>('Tomatoes price spike report in Mile 12 Market');
  const [customLocation, setCustomLocation] = useState<string>('Mile 12 Market, Kosofe, Lagos');
  const [customDetails, setCustomDetails] = useState<string>('Spotters confirmed price increase due to transport delays.');
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      const u = storageService.getUser();
      setCurrentUser(u);
      setIsLoggedIn(storageService.isUserLoggedIn());
      setTasks(storageService.getTasks());
      setTruthResults(storageService.getTruthResults());
      setRegisteredUsers(storageService.getRegisteredUsers());
      setSentEmails(storageService.getSentEmailReports());
      setAuthLogs(storageService.getAuthLogs());
      if (u.role === 'admin') {
        setIsPasskeyUnlocked(true);
      }
    });
    return unsubscribe;
  }, []);

  const handleUnlockPasskey = (e: React.FormEvent) => {
    e.preventDefault();
    setPasskeyError(null);
    if (passkeyInput.trim() === ADMIN_MASTER_PASSWORD) {
      setIsPasskeyUnlocked(true);
      onShowToast(50, 'Master Admin Passkey Verified! Admin Access Unlocked.');
    } else {
      setPasskeyError('Incorrect Admin Passkey. Please enter the valid administrator password.');
    }
  };

  // Filter tasks to only show active pending tasks in moderation queue
  const pendingTasks = tasks.filter(t => t.status !== 'completed');

  const filteredAuthLogs = authLogs.filter(log => {
    if (!authSearchQuery.trim()) return true;
    const q = authSearchQuery.toLowerCase();
    return (
      log.userName.toLowerCase().includes(q) ||
      log.userEmail.toLowerCase().includes(q) ||
      log.eventType.toLowerCase().includes(q) ||
      (log.state && log.state.toLowerCase().includes(q))
    );
  });

  if (!isPasskeyUnlocked) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white rounded-3xl border border-amber-300 shadow-2xl space-y-6 text-center animate-scale-up" id="admin-passkey-gate">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-800 text-white flex items-center justify-center mx-auto shadow-lg">
          <Lock className="w-8 h-8 text-amber-200" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-bold text-[10px] uppercase px-3 py-1 rounded-full border border-amber-200">
            <KeyRound className="w-3 h-3 text-amber-700" />
            <span>SABI Master Passkey Protection</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold font-display text-gray-900">
            Admin Portal Locked
          </h2>
          <p className="text-xs text-gray-600 max-w-sm mx-auto">
            Please enter the administrator master passkey to access moderation controls, user authentication logs, and system telemetries.
          </p>
        </div>

        <form onSubmit={handleUnlockPasskey} className="space-y-4 text-left">
          {passkeyError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2 animate-fade-in" id="passkey-error-alert">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{passkeyError}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              Administrator Passkey
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-amber-600 absolute left-3.5 top-3.5" />
              <input
                id="admin-passkey-gate-input"
                type="password"
                required
                autoFocus
                placeholder="Enter Master Passkey"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 rounded-xl pl-10 pr-4 py-3 text-sm font-mono font-bold tracking-widest text-gray-900 focus:ring-2 focus:ring-amber-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            id="unlock-admin-gate-btn"
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer font-display"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Unlock Admin Portal</span>
          </button>
        </form>

        <div className="text-[11px] text-gray-400 pt-2 border-t border-gray-100">
          Tip: Enter password <code className="bg-gray-100 px-1.5 py-0.5 rounded text-amber-800 font-mono font-bold">2013</code> to authenticate master administrator privileges.
        </div>
      </div>
    );
  }

  // Handle Injecting Cheat Code Points
  const handleInjectPoints = (amountToInject: number) => {
    if (!amountToInject || amountToInject <= 0) return;

    const updated = storageService.injectCheatPoints(amountToInject);
    setCurrentUser(updated);
    setCheatSuccessMsg(`⚡ Cheat Code Success! Injected +${amountToInject.toLocaleString()} SABI Points into ${updated.name}'s account.`);
    onShowToast(amountToInject, `⚡ Cheat Code Activated: +${amountToInject.toLocaleString()} SABI Points credited!`);

    setTimeout(() => {
      setCheatSuccessMsg(null);
    }, 6000);
  };

  const handleSendCustomReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customClaim.trim()) return;

    setIsSendingEmail(true);
    setTimeout(() => {
      setIsSendingEmail(false);
      storageService.sendReportToEmail({
        claim: customClaim,
        location: customLocation,
        details: customDetails
      });

      setEmailSuccessMsg(`Report successfully dispatched to the verification desk!`);
      onShowToast(15, `Verification report dispatched`);
      setTimeout(() => setEmailSuccessMsg(null), 5000);
    }, 600);
  };

  const handleApproveVerdict = (task: VerificationTask, verdict: ResultType) => {
    storageService.resolveAdminTask(
      task.id,
      verdict === 'NEEDS MORE VERIFICATION' ? 'DISMISSED' : verdict,
      `Official Admin consensus verdict reached: Marked as ${verdict} and published to Public Truth Feed.`
    );
    onShowToast(50, `Verdict "${verdict}" published to Verified Truth Feed!`);
  };

  const handleDismissTask = (taskId: string) => {
    storageService.resolveAdminTask(taskId, 'DISMISSED', 'Task dismissed by admin moderation.');
    onShowToast(0, 'Task archived from active moderation queue.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-fade-in" id="admin-portal-view">
      
      {/* ADMIN HERO BANNER */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-amber-500/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-black/40 text-[#FFD60A] text-xs font-mono font-bold px-3 py-1 rounded-full border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFD60A]" />
              <span>ADMINISTRATOR HUB · VERIFIED AUTHORITY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              SABI Central Admin Portal
            </h1>
            <p className="text-xs text-amber-100 max-w-xl">
              Master control panel to moderate community reports, inject points via cheat codes, dispatch official audit reports, and manage user telemetry.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="exit-admin-btn"
              onClick={onExitAdmin}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/30 flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* SIGNED IN USER DETECTION & TELEMETRY CARD */}
      <div className="bg-white rounded-3xl p-5 border border-amber-200 shadow-sm space-y-3" id="admin-user-detection-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-13 h-13 rounded-2xl object-cover border-2 border-[#0A3D2E] shadow"
              />
              <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isLoggedIn ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-extrabold text-gray-900 text-base font-display">{currentUser.name}</span>
                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${isLoggedIn ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-amber-100 text-amber-900 border border-amber-300'}`}>
                  {isLoggedIn ? '✓ User Signed In' : 'Guest Account Mode'}
                </span>
                {currentUser.role === 'admin' && (
                  <span className="text-[10px] font-black uppercase bg-amber-500 text-white px-2 py-0.5 rounded-full">
                    ★ Master Admin
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                <Mail className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-semibold text-gray-800">{currentUser.email}</span>
                <span>·</span>
                <MapPin className="w-3.5 h-3.5 text-[#0A3D2E]" />
                <span className="font-semibold text-emerald-800">{currentUser.lga}, {currentUser.state}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-emerald-50 px-4 py-3 rounded-2xl border border-emerald-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-800 block tracking-wider">SABI Points</span>
              <span className="text-xl font-black text-[#0A3D2E] font-display">{currentUser.sabiPoints?.toLocaleString() || 0} PTS</span>
            </div>
            <div className="border-l border-emerald-300 pl-3">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block tracking-wider">Account Tier</span>
              <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md inline-block">
                {currentUser.userTier || 'Member'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ADMIN STATS SUMMARY CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Pending Queue</span>
          <div className="text-2xl font-extrabold text-amber-900 font-display mt-1">{pendingTasks.length}</div>
          <span className="text-[10px] text-amber-700 font-semibold">Awaiting review</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Verified Truths</span>
          <div className="text-2xl font-extrabold text-emerald-800 font-display mt-1">{truthResults.length}</div>
          <span className="text-[10px] text-emerald-700 font-semibold">Published live</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Registered Users</span>
          <div className="text-2xl font-extrabold text-blue-900 font-display mt-1">{registeredUsers.length}</div>
          <span className="text-[10px] text-blue-700 font-semibold">Active accounts</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Dispatched Reports</span>
          <div className="text-2xl font-extrabold text-purple-900 font-display mt-1">{sentEmails.length}</div>
          <span className="text-[10px] text-purple-700 font-semibold">Official dispatches</span>
        </div>
      </div>

      {/* ADMIN NAVIGATION TABS */}
      <div className="flex border-b border-gray-200 bg-white rounded-2xl p-1 shadow-sm gap-1 overflow-x-auto text-xs font-bold">
        <button
          id="admin-tab-reports"
          onClick={() => setActiveAdminTab('reports')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
            activeAdminTab === 'reports'
              ? 'bg-[#0A3D2E] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Moderation Queue ({pendingTasks.length})</span>
        </button>

        <button
          id="admin-tab-cheat-code"
          onClick={() => setActiveAdminTab('cheat_code')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
            activeAdminTab === 'cheat_code'
              ? 'bg-[#FFD60A] text-[#0A3D2E] shadow-sm font-black'
              : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
          }`}
        >
          <Zap className="w-4 h-4 fill-current text-amber-600" />
          <span>⚡ SABI Cheat Code</span>
        </button>

        <button
          id="admin-tab-email"
          onClick={() => setActiveAdminTab('email_dispatch')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
            activeAdminTab === 'email_dispatch'
              ? 'bg-[#0A3D2E] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Send className="w-4 h-4 text-[#FFD60A]" />
          <span>Send Report</span>
        </button>

        <button
          id="admin-tab-users"
          onClick={() => setActiveAdminTab('users')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
            activeAdminTab === 'users'
              ? 'bg-[#0A3D2E] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users Directory ({registeredUsers.length})</span>
        </button>

        <button
          id="admin-tab-auth-logs"
          onClick={() => setActiveAdminTab('auth_logs')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
            activeAdminTab === 'auth_logs'
              ? 'bg-[#0A3D2E] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <KeyRound className="w-4 h-4 text-[#FFD60A]" />
          <span>Auth & Credential Logs ({authLogs.length})</span>
        </button>

        <button
          id="admin-tab-logs"
          onClick={() => setActiveAdminTab('sent_logs')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
            activeAdminTab === 'sent_logs'
              ? 'bg-[#0A3D2E] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Dispatch Logs ({sentEmails.length})</span>
        </button>
      </div>

      {/* 1. SABI CHEAT CODE & POINTS INJECTOR TAB */}
      {activeAdminTab === 'cheat_code' && (
        <div className="bg-gradient-to-br from-[#0A3D2E] via-[#0d4c39] to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-500/40 space-y-6" id="cheat-code-injector-panel">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/80 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-[#FFD60A] text-[#0A3D2E] text-xs font-black uppercase px-3 py-1 rounded-full shadow-sm font-display">
                <Zap className="w-4 h-4 fill-current text-[#0A3D2E]" />
                <span>SABI Cheat Code & Instant Points Injector</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold font-display text-white">
                Instant Point Generator (50,000+ PTS/Day)
              </h2>
              <p className="text-xs text-emerald-200 max-w-lg">
                Enter any custom amount of SABI points or select a preset to credit the active signed-in user instantly.
              </p>
            </div>

            <div className="bg-emerald-900/90 border border-emerald-700/80 px-4 py-3 rounded-2xl text-right shrink-0">
              <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-bold block">Target Account</span>
              <span className="text-sm font-black text-[#FFD60A] block">{currentUser.name}</span>
              <span className="text-[11px] text-white font-mono font-bold">{currentUser.sabiPoints?.toLocaleString()} PTS Current</span>
            </div>
          </div>

          {cheatSuccessMsg && (
            <div className="p-4 bg-[#FFD60A] text-[#0A3D2E] text-xs sm:text-sm font-black rounded-2xl flex items-center gap-2 shadow-lg animate-bounce">
              <Sparkles className="w-5 h-5 shrink-0 fill-current text-[#0A3D2E]" />
              <span>{cheatSuccessMsg}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-emerald-200 mb-2 uppercase tracking-wider">
                Custom SABI Points Injection Input:
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <div className="relative flex-grow">
                  <input
                    id="custom-cheat-points-input"
                    type="number"
                    min="1"
                    max="1000000"
                    value={cheatPointsInput}
                    onChange={(e) => setCheatPointsInput(e.target.value)}
                    placeholder="e.g. 50000"
                    className="w-full bg-emerald-950/90 border-2 border-emerald-400/80 rounded-2xl px-4 py-3 text-white font-mono font-black text-xl focus:outline-none focus:border-[#FFD60A] transition-colors placeholder:text-emerald-700 shadow-inner"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-black text-[#FFD60A]">PTS</span>
                </div>
                <button
                  id="apply-cheat-code-btn"
                  onClick={() => handleInjectPoints(Number(cheatPointsInput) || 50000)}
                  className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-black text-sm px-7 py-3.5 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 shrink-0 font-display cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-current" />
                  <span>Inject Points Now</span>
                </button>
              </div>
            </div>

            {/* PRESET BUTTONS GRID */}
            <div>
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block mb-2.5">
                ⚡ Instant Preset Cheat Buttons:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                <button
                  onClick={() => handleInjectPoints(1000)}
                  className="bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600/80 text-emerald-100 p-3 rounded-2xl text-xs font-bold transition-all text-center hover:scale-105 active:scale-95 cursor-pointer"
                >
                  +1,000 PTS
                  <span className="block text-[9px] text-emerald-300 font-normal">Starter Boost</span>
                </button>

                <button
                  onClick={() => handleInjectPoints(5000)}
                  className="bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600/80 text-emerald-100 p-3 rounded-2xl text-xs font-bold transition-all text-center hover:scale-105 active:scale-95 cursor-pointer"
                >
                  +5,000 PTS
                  <span className="block text-[9px] text-emerald-300 font-normal">Spotter Surge</span>
                </button>

                <button
                  onClick={() => handleInjectPoints(10000)}
                  className="bg-amber-900/80 hover:bg-amber-800 border border-amber-500/80 text-amber-200 p-3 rounded-2xl text-xs font-bold transition-all text-center hover:scale-105 active:scale-95 cursor-pointer"
                >
                  +10,000 PTS
                  <span className="block text-[9px] text-amber-300 font-normal">Gold Verifier</span>
                </button>

                <button
                  onClick={() => handleInjectPoints(25000)}
                  className="bg-purple-900/80 hover:bg-purple-800 border border-purple-500/80 text-purple-200 p-3 rounded-2xl text-xs font-bold transition-all text-center hover:scale-105 active:scale-95 cursor-pointer"
                >
                  +25,000 PTS
                  <span className="block text-[9px] text-purple-300 font-normal">Sabi Master</span>
                </button>

                <button
                  onClick={() => handleInjectPoints(50000)}
                  className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] p-3 rounded-2xl text-xs font-black transition-all text-center shadow-lg hover:scale-105 active:scale-95 border-2 border-white col-span-2 sm:col-span-1 cursor-pointer"
                >
                  🔥 +50,000 PTS
                  <span className="block text-[9px] font-black uppercase">Daily Max Cheat</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-emerald-900/40 rounded-2xl border border-emerald-700/60 text-xs text-emerald-200 flex items-center justify-between">
              <span>Cheat Code Allowance: Unlimited (50,000+ PTS per injection supported)</span>
              <span className="font-bold text-[#FFD60A]">Instant Sync</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. REPORT MODERATION TAB */}
      {activeAdminTab === 'reports' && (
        <div className="space-y-4" id="admin-reports-section">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900 font-display">
              Pending Community Reports & Verification Queue
            </h3>
            <span className="text-xs text-gray-500">
              Approving a report publishes it live to the Home feed and clears it from this queue
            </span>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-200 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base text-gray-900 font-display">All Reports Moderated!</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                The community moderation queue is all clear. All verified reports are published to the live Truth Feed.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-lg">
                        Task #{task.id.slice(-6)}
                      </span>
                      <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#0A3D2E]" />
                        {task.area}, {task.state}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        storageService.sendReportToEmail({
                          claim: task.claim,
                          location: `${task.area}, ${task.state}`,
                          details: `Task Category: ${task.category}. Current verifiers: ${task.currentVerifiersCount}`
                        });
                        onShowToast(15, 'Dispatched report to official inbox');
                      }}
                      className="text-xs font-bold text-[#0A3D2E] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Report</span>
                    </button>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 text-sm sm:text-base font-display">
                      "{task.claim}"
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Category: <strong className="capitalize">{task.category.replace('_', ' ')}</strong> · Verifiers: {task.currentVerifiersCount}/{task.requiredVerifiers}
                    </p>
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-gray-600">
                      Publish Official Verdict:
                    </span>
                    
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        id={`approve-true-${task.id}`}
                        onClick={() => handleApproveVerdict(task, 'TRUE')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve TRUE</span>
                      </button>
                      
                      <button
                        id={`mark-false-${task.id}`}
                        onClick={() => handleApproveVerdict(task, 'FALSE')}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Mark FALSE</span>
                      </button>

                      <button
                        id={`mark-outdated-${task.id}`}
                        onClick={() => handleApproveVerdict(task, 'OUTDATED MEDIA')}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>OUTDATED</span>
                      </button>

                      <button
                        onClick={() => handleDismissTask(task.id)}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-xs font-bold px-2 py-1.5 rounded-xl transition-colors cursor-pointer"
                        title="Dismiss / Archive"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. SEND REPORT TAB */}
      {activeAdminTab === 'email_dispatch' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5" id="admin-email-dispatch-section">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A3D2E] bg-[#0A3D2E]/10 px-3 py-1 rounded-full uppercase">
              <Mail className="w-3.5 h-3.5" />
              <span>Official Verification Dispatch</span>
            </div>
            <h3 className="font-bold text-lg text-gray-900 font-display">
              Send Report
            </h3>
            <p className="text-xs text-gray-500">
              Formulate a structured verification summary and dispatch directly with pre-formatted evidence details.
            </p>
          </div>

          {emailSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-[#0A3D2E] text-xs rounded-xl flex items-center gap-2 font-semibold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{emailSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSendCustomReport} className="space-y-4" id="custom-email-dispatch-form">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Claim / Rumor Title
              </label>
              <input
                id="custom-claim-input"
                type="text"
                required
                placeholder="e.g. Fuel price increase at Mobil filling station"
                value={customClaim}
                onChange={(e) => setCustomClaim(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Location (Market / Landmark / State)
              </label>
              <input
                id="custom-location-input"
                type="text"
                required
                placeholder="e.g. Bodija Market, Ibadan, Oyo State"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Verification Details & Context
              </label>
              <textarea
                id="custom-details-input"
                rows={4}
                required
                placeholder="Enter detailed facts, spotter quotes, price points, and video/photo analysis..."
                value={customDetails}
                onChange={(e) => setCustomDetails(e.target.value)}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500">
                Dispatches immediately via system trigger and logs to audit stream.
              </span>

              <button
                id="dispatch-report-btn"
                type="submit"
                disabled={isSendingEmail}
                className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-bold text-sm px-7 py-3 rounded-2xl shadow-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 font-display cursor-pointer"
              >
                <Send className="w-4 h-4 text-[#FFD60A]" />
                <span>{isSendingEmail ? 'Sending...' : 'Send Report'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. REGISTERED USERS DIRECTORY TAB */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4" id="admin-users-section">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-gray-900 font-display">
                Registered Community Users & Verifiers
              </h3>
              <p className="text-xs text-gray-500">
                Showing all accounts stored in the SABI user registry.
              </p>
            </div>
            <span className="text-xs font-bold text-[#0A3D2E] bg-emerald-50 px-3 py-1 rounded-xl">
              {registeredUsers.length} Users Total
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {registeredUsers.map((u) => (
              <div key={u.id} className="py-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatarUrl}
                    alt={u.name}
                    className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-gray-900">{u.name}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.role === 'admin' 
                          ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {u.role === 'admin' ? '★ Master Admin' : u.trustLevel}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-gray-400" />
                      <span>{u.email}</span>
                      <span>·</span>
                      <MapPin className="w-3 h-3 text-[#0A3D2E]" />
                      <span>{u.lga}, {u.state}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-extrabold text-[#0A3D2E]">
                    {u.sabiPoints.toLocaleString()} PTS
                  </div>
                  <span className="text-[10px] text-gray-400">
                    Joined {u.joinedDate}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. USER AUTHENTICATION & CREDENTIAL LOGS TAB */}
      {activeAdminTab === 'auth_logs' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5" id="admin-auth-logs-section">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Live Auth Telemetry & Credential Verification</span>
              </div>
              <h3 className="font-extrabold text-lg text-gray-900 font-display">
                User Sign-Up & Sign-In Audit Logs
              </h3>
              <p className="text-xs text-gray-500">
                Live stream recording user registration and sign-in entries with name, email, credentials, and timestamps.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="clear-auth-logs-btn"
                onClick={() => {
                  storageService.clearAuthLogs();
                  setAuthLogs([]);
                  onShowToast(0, 'Auth audit logs cleared.');
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Logs</span>
              </button>
            </div>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              id="auth-logs-search-input"
              type="text"
              placeholder="Filter logs by user name, email, or event type..."
              value={authSearchQuery}
              onChange={(e) => setAuthSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0A3D2E]"
            />
          </div>

          {filteredAuthLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-xs space-y-2 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <UserCheck className="w-8 h-8 mx-auto text-gray-300" />
              <p>No authentication logs found matching your filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAuthLogs.map((log) => {
                const isSignUp = log.eventType === 'USER_SIGN_UP';
                const isGoogle = log.eventType === 'GOOGLE_AUTH';
                const isAdmin = log.eventType === 'ADMIN_ACCESS';

                return (
                  <div key={log.id} className="p-4 rounded-2xl bg-gray-50/80 border border-gray-200 hover:border-gray-300 transition-all space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                          isSignUp
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : isGoogle
                            ? 'bg-blue-100 text-blue-900 border-blue-300'
                            : isAdmin
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-indigo-100 text-indigo-900 border-indigo-300'
                        }`}>
                          {isSignUp ? '✓ USER SIGN UP' : isGoogle ? '🌐 GOOGLE AUTH' : isAdmin ? '★ ADMIN ACCESS' : '🔐 USER SIGN IN'}
                        </span>
                        <span className="font-extrabold text-sm text-gray-900 font-display">
                          {log.userName}
                        </span>
                      </div>

                      <div className="text-xs text-gray-500 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{log.timestamp}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="bg-white p-2.5 rounded-xl border border-gray-200 space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Email Address</span>
                        <div className="font-bold text-gray-800 flex items-center gap-1.5 overflow-hidden text-ellipsis">
                          <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                          <span className="truncate">{log.userEmail}</span>
                        </div>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-gray-200 space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Password / Credential</span>
                        <div className="font-mono font-bold text-emerald-900 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200 inline-block text-[11px] max-w-full truncate">
                          {log.passwordUsed}
                        </div>
                      </div>
                    </div>

                    {log.state && (
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 pt-1">
                        <MapPin className="w-3 h-3 text-[#0A3D2E]" />
                        <span>Region: {log.lga || 'Mainland'}, {log.state}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. SENT EMAIL LOGS TAB */}
      {activeAdminTab === 'sent_logs' && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4" id="admin-sent-logs-section">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900 font-display">
              Dispatched Verification Reports
            </h3>
            <span className="text-xs text-gray-500">
              {sentEmails.length} dispatched
            </span>
          </div>

          {sentEmails.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-xs space-y-2">
              <Mail className="w-8 h-8 mx-auto text-gray-300" />
              <p>No reports sent yet. Use the "Send Report" tab or the report button to dispatch reports!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sentEmails.map((eml) => (
                <div key={eml.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-gray-900 font-display text-sm">
                      {eml.subject}
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                      Sent ✓
                    </span>
                  </div>

                  <p className="text-gray-700 font-medium">
                    Claim: "{eml.claim}" · Location: {eml.location}
                  </p>

                  <div className="p-2.5 bg-white rounded-xl border border-gray-200 font-mono text-[11px] text-gray-600 whitespace-pre-wrap">
                    {eml.body}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                    <span>Status: Verified Dispatch</span>
                    <span>Sent: {eml.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AdminView;
