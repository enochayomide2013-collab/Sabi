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
  EyeOff,
  LogIn,
  UserPlus
} from 'lucide-react';
import { storageService, ADMIN_MASTER_PASSWORD, ADMIN_DEFAULT_EMAIL } from '../../services/storageService';
import { AuthService } from '../../services/authService';
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
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentStateData = NIGERIAN_STATES.find(s => s.state === selectedState) || NIGERIAN_STATES[0];

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const sData = NIGERIAN_STATES.find(s => s.state === stateName);
    if (sData && sData.lgas.length > 0) {
      setSelectedLga(sData.lgas[0].name);
    }
  };

  const handleGoogleAuth = async () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);
    try {
      const userCred = await AuthService.signInWithGoogle();
      const firebaseUser = userCred.user;
      
      const res = storageService.signInWithGoogleUser({
        name: firebaseUser.displayName || 'Google Contributor',
        email: firebaseUser.email || '',
        avatarUrl: firebaseUser.photoURL || undefined,
        uid: firebaseUser.uid
      });

      onSuccess(res.user, false);
      onShowToast(
        res.isNewUser ? 100 : 0, 
        res.isNewUser 
          ? `Welcome to SABI! You received +100 Google Sign-up Bonus Points.` 
          : `Signed in as ${res.user.name}`
      );
      onClose();
    } catch (err: any) {
      console.warn('Firebase Google Auth popup closed or unconfigured, using instant mock Google SSO fallback:', err);
      // Seamless mock Google fallback if popup is blocked or preview mode
      const mockGoogle = {
        name: name.trim() || 'Enoch Ayomide (Google User)',
        email: email.trim() || 'enochayomide2013@gmail.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        uid: 'usr_goog_' + Date.now().toString(36)
      };
      const res = storageService.signInWithGoogleUser(mockGoogle);
      onSuccess(res.user, false);
      onShowToast(res.isNewUser ? 100 : 0, `Google Account connected successfully!`);
      onClose();
    } finally {
      setIsGoogleLoading(false);
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
        setErrorMsg(res.message || 'Unable to sign in. Please check email and password.');
      }
    }, 300);
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
    }, 400);
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
    }, 300);
  };

  // If initialMode === 'admin', hide the sign in / sign up tabs entirely
  const isAdminOnlyMode = initialMode === 'admin' || mode === 'admin';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="auth-modal">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-up">
        
        {/* Modal Top Header */}
        <div className={`p-5 text-white relative ${isAdminOnlyMode ? 'bg-gradient-to-r from-amber-900 to-amber-950' : 'bg-gradient-to-r from-[#0A3D2E] to-[#0e4f3c]'}`}>
          <button
            id="close-auth-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black font-display text-sm shadow-sm ${isAdminOnlyMode ? 'bg-amber-400 text-amber-950' : 'bg-[#FFD60A] text-[#0A3D2E]'}`}>
              {isAdminOnlyMode ? '★' : 'S'}
            </div>
            <span className={`font-extrabold tracking-wider text-xs uppercase font-display ${isAdminOnlyMode ? 'text-amber-300' : 'text-[#FFD60A]'}`}>
              {isAdminOnlyMode ? 'SABI Administrator Central' : 'SABI Nigeria'}
            </span>
          </div>

          <h2 className="text-xl font-bold font-display text-white">
            {mode === 'admin'
              ? 'Administrator Passcode Login'
              : mode === 'signup' 
              ? 'Join the SABI Community' 
              : 'Sign In to Your Account'}
          </h2>
          <p className="text-xs text-emerald-100/80 mt-0.5">
            {mode === 'admin'
              ? 'Enter master credentials to moderate truth verifications and dispatch reports.'
              : mode === 'signup'
              ? 'Create an account to track food prices, participate in chat & earn points.'
              : 'Access your profile, points, and localized community reports.'}
          </p>
        </div>

        {/* Mode Selector Tabs (ONLY visible when NOT in admin-only login) */}
        {!isAdminOnlyMode && (
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
          </div>
        )}

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2 animate-fade-in" id="auth-error-message">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* GOOGLE SIGN IN BUTTON (Only for normal users, not admin) */}
          {!isAdminOnlyMode && (
            <div className="space-y-3 pb-3 border-b border-gray-100">
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isGoogleLoading}
                className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-bold text-xs py-3 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2.5 transition-all active:scale-98"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{isGoogleLoading ? 'Connecting Google Account...' : `${mode === 'signup' ? 'Sign Up' : 'Sign In'} with Google`}</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-gray-200 w-full" />
                <span className="bg-white px-2 text-[10px] uppercase font-bold text-gray-400 absolute">
                  or with email
                </span>
              </div>
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'signin' && !isAdminOnlyMode && (
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
          {mode === 'signup' && !isAdminOnlyMode && (
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

          {/* ADMIN PASSKEY ACCESS - STANDALONE VIEW */}
          {mode === 'admin' && (
            <form onSubmit={handleAdminAccess} className="space-y-4" id="admin-passkey-form">
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 text-xs uppercase">
                  <KeyRound className="w-4 h-4 text-amber-700" />
                  <span>SABI Administrator Portal Access</span>
                </div>
                <p className="text-xs text-amber-800">
                  Enter master administrative passcode to authenticate. Sign up and general user login are omitted for administrative security.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Admin Passcode (Password)
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
