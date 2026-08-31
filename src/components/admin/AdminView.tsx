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
  Lock
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { VerificationTask, TruthResult, UserAccount, SentEmailReport, ResultType } from '../../types';

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
  const [tasks, setTasks] = useState<VerificationTask[]>(storageService.getTasks());
  const [truthResults, setTruthResults] = useState<TruthResult[]>(storageService.getTruthResults());
  const [registeredUsers, setRegisteredUsers] = useState<UserAccount[]>(storageService.getRegisteredUsers());
  const [sentEmails, setSentEmails] = useState<SentEmailReport[]>(storageService.getSentEmailReports());
  const [activeAdminTab, setActiveAdminTab] = useState<'reports' | 'email_dispatch' | 'users' | 'sent_logs'>('reports');

  // Custom Quick Email Dispatch form state
  const [customClaim, setCustomClaim] = useState<string>('Tomatoes price spike report in Mile 12 Market');
  const [customLocation, setCustomLocation] = useState<string>('Mile 12 Market, Kosofe, Lagos');
  const [customDetails, setCustomDetails] = useState<string>('Spotters confirmed price increase due to transport delays.');
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [emailSuccessMsg, setEmailSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setTasks(storageService.getTasks());
      setTruthResults(storageService.getTruthResults());
      setRegisteredUsers(storageService.getRegisteredUsers());
      setSentEmails(storageService.getSentEmailReports());
    });
    return unsubscribe;
  }, []);

  // Filter tasks to only show active pending tasks in moderation queue
  const pendingTasks = tasks.filter(t => t.status !== 'completed');

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
              Master control panel to moderate community reports, dispatch official audit reports, and inspect registered member accounts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="exit-admin-btn"
              onClick={onExitAdmin}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-white/30 flex items-center gap-1.5 transition-all shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Admin</span>
            </button>
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
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 ${
            activeAdminTab === 'reports'
              ? 'bg-[#0A3D2E] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Report Moderation ({pendingTasks.length})</span>
        </button>

        <button
          id="admin-tab-email"
          onClick={() => setActiveAdminTab('email_dispatch')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 ${
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
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 ${
            activeAdminTab === 'users'
              ? 'bg-[#0A3D2E] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users Directory ({registeredUsers.length})</span>
        </button>

        <button
          id="admin-tab-logs"
          onClick={() => setActiveAdminTab('sent_logs')}
          className={`flex-1 py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 ${
            activeAdminTab === 'sent_logs'
              ? 'bg-[#0A3D2E] text-white shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Dispatch Logs ({sentEmails.length})</span>
        </button>
      </div>

      {/* 1. REPORT MODERATION TAB */}
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
                      className="text-xs font-bold text-[#0A3D2E] bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1 transition-colors"
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
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1 transition-all active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve TRUE</span>
                      </button>
                      
                      <button
                        id={`mark-false-${task.id}`}
                        onClick={() => handleApproveVerdict(task, 'FALSE')}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1 transition-all active:scale-95"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Mark FALSE</span>
                      </button>

                      <button
                        id={`mark-outdated-${task.id}`}
                        onClick={() => handleApproveVerdict(task, 'OUTDATED MEDIA')}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1 transition-all active:scale-95"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>OUTDATED</span>
                      </button>

                      <button
                        onClick={() => handleDismissTask(task.id)}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 text-xs font-bold px-2 py-1.5 rounded-xl transition-colors"
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

      {/* 2. SEND REPORT TAB (No email address shown in UI) */}
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
                className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-bold text-sm px-7 py-3 rounded-2xl shadow-lg flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 font-display"
              >
                <Send className="w-4 h-4 text-[#FFD60A]" />
                <span>{isSendingEmail ? 'Sending...' : 'Send Report'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. REGISTERED USERS DIRECTORY TAB */}
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

      {/* 4. SENT EMAIL LOGS TAB */}
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
