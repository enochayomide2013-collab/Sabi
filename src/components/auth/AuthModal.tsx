import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  MapPin, 
  ShieldCheck, 
  ArrowRight, 
  KeyRound, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { storageService, ADMIN_MASTER_PASSWORD, ADMIN_DEFAULT_EMAIL } from '../../services/storageService';
import { NIGERIAN_STATES } from '../../data/nigerianLocations';
import { UserProfile } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup' | 'admin';
  onClose: () => void;
  onSuccess: (user: UserProfile, isAdmin?: boolean) => void;
  onShowToast: (points: number, message: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  onClose,
  onSuccess,
  onShowToast
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'admin'>(initialMode);
  
  // Form fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedState, setSelectedState] = useState<string>('Lagos');
  const [selectedLga, setSelectedLga] = useState<string>('Lagos Mainland');
  const [adminPassword, setAdminPassword] = useState<string>('');
  
  // UI status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentStateData = NIGERIAN_STATES.find(s => s.state === selectedState) || NIGERIAN_STATES[0];

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const sData = NIGERIAN_STATES.find(s => s.state === stateName);
    if (sData && sData.lgas.length > 0) {
      setSelectedLga(sData.lgas[0].name);
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const res = storageService.signIn(email, password);
      if (res.success && res.user) {
        onSuccess(res.user, res.isAdmin);
        onShowToast(0, res.isAdmin ? 'Welcome Admin! Directed to Admin Portal.' : `Welcome back, ${res.user.name}!`);
        onClose();
      } else {
        setErrorMsg(res.message || 'Unable to sign in. Please try again.');
      }
    }, 400);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const res = storageService.signUp({
        name,
        email,
        password,
        state: selectedState,
        lga: selectedLga
      });

      if (res.success && res.user) {
        onSuccess(res.user, res.user.role === 'admin');
        onShowToast(100, `Account created! You received +100 Welcome Points.`);
        onClose();
      } else {
        setErrorMsg(res.message || 'Unable to create account.');
      }
    }, 500);
  };

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (adminPassword.trim() !== ADMIN_MASTER_PASSWORD) {
      setErrorMsg('Incorrect admin passcode.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const res = storageService.adminSignIn(adminPassword.trim());
      if (res.success && res.user) {
        onSuccess(res.user, true);
        onShowToast(50, 'Master Admin authenticated! Opening Admin Portal.');
        onClose();
      } else {
        setErrorMsg(res.message || 'Admin validation failed.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="auth-modal">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-up">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#0A3D2E] to-[#0e4f3c] text-white p-5 relative">
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center font-black font-display text-sm shadow-sm">
              S
            </div>
            <span className="font-extrabold tracking-wider text-xs uppercase text-[#FFD60A] font-display">
              SABI Nigeria
            </span>
          </div>

          <h2 className="text-xl font-bold font-display text-white">
            {mode === 'signup' 
              ? 'Join the SABI Community' 
              : mode === 'admin' 
              ? 'Admin Portal Access' 
              : 'Sign In to SABI'}
          </h2>
          <p className="text-xs text-emerald-100/80 mt-0.5">
            {mode === 'signup'
              ? 'Create an account to track food prices & earn verifier points'
              : mode === 'admin'
              ? 'Enter admin passkey to access administrative controls'
              : 'Access your profile, points, and localized community reports'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50 text-xs font-bold">
          <button
            id="tab-signin-btn"
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-center transition-all ${
              mode === 'signin'
                ? 'bg-white text-[#0A3D2E] border-b-2 border-[#0A3D2E]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>
          <button
            id="tab-signup-btn"
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-center transition-all ${
              mode === 'signup'
                ? 'bg-white text-[#0A3D2E] border-b-2 border-[#0A3D2E]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Sign Up (+100 PTS)
          </button>
          <button
            id="tab-admin-btn"
            type="button"
            onClick={() => { setMode('admin'); setErrorMsg(null); }}
            className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-1 ${
              mode === 'admin'
                ? 'bg-white text-[#0A3D2E] border-b-2 border-[#0A3D2E]'
                : 'text-amber-800 hover:text-amber-900 bg-amber-50/50'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-700" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-fade-in" id="auth-error-message">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-3.5" id="signin-form">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    id="signin-email-input"
                    type="email"
                    required
                    placeholder="e.g. enochayomide67@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    id="signin-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl pl-10 pr-10 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="submit-signin-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-[#0A3D2E] hover:bg-[#0c4a37] text-white font-bold text-sm py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setMode('signup'); setErrorMsg(null); }}
                  className="text-xs text-[#0A3D2E] font-bold hover:underline"
                >
                  Don't have an account? Sign Up (+100 PTS)
                </button>
              </div>
            </form>
          )}

          {/* SIGN UP FORM */}
          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3" id="signup-form">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    id="signup-name-input"
                    type="text"
                    required
                    placeholder="e.g. Enoch Ayomide"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    id="signup-email-input"
                    type="email"
                    required
                    placeholder="e.g. enochayomide2013@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Create Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    id="signup-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimum 4 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl pl-10 pr-10 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* State & LGA */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 uppercase">
                    State
                  </label>
                  <select
                    id="signup-state-select"
                    value={selectedState}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-2.5 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                  >
                    {NIGERIAN_STATES.map(s => (
                      <option key={s.state} value={s.state}>{s.state}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 uppercase">
                    LGA
                  </label>
                  <select
                    id="signup-lga-select"
                    value={selectedLga}
                    onChange={(e) => setSelectedLga(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-2.5 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                  >
                    {currentStateData.lgas.map(l => (
                      <option key={l.name} value={l.name}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-[#0A3D2E]">
                <Sparkles className="w-4 h-4 text-[#FFD60A] shrink-0" />
                <span>You will receive <strong>+100 Stat Points</strong> upon sign-up!</span>
              </div>

              <button
                id="submit-signup-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0A3D2E] hover:bg-[#0c4a37] text-white font-bold text-sm py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Creating Account...' : 'Create Account & Sign In'}</span>
                <CheckCircle2 className="w-4 h-4 text-[#FFD60A]" />
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setMode('signin'); setErrorMsg(null); }}
                  className="text-xs text-gray-600 hover:text-gray-900 font-medium"
                >
                  Already have an account? <span className="text-[#0A3D2E] font-bold underline">Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* ADMIN PASSKEY ACCESS */}
          {mode === 'admin' && (
            <form onSubmit={handleAdminAccess} className="space-y-4" id="admin-passkey-form">
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs uppercase">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                  <span>SABI Administrator Portal</span>
                </div>
                <p className="text-xs text-amber-800">
                  Enter administrative passcode to access the central moderator place and view dispatch tools.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Admin Passkey (Password)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-amber-700 absolute left-3.5 top-3" />
                  <input
                    id="admin-passkey-input"
                    type="password"
                    required
                    autoFocus
                    placeholder="Enter Admin Password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono font-bold tracking-widest focus:ring-2 focus:ring-amber-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-200">
                <p className="font-semibold text-gray-700">Master Admin Privileges:</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5 text-[11px]">
                  <li>Review all pending rumors & dispatch truth verdicts</li>
                  <li>View registered users and active verifiers</li>
                  <li>Directly dispatch reports to <strong className="text-gray-900">enochayomide67@gmail.com</strong></li>
                </ul>
              </div>

              <button
                id="submit-admin-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Authenticating...' : 'Enter Admin Portal'}</span>
                <ShieldCheck className="w-4 h-4 text-white" />
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
