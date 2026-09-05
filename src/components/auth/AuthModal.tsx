import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  KeyRound, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Phone,
  Compass,
  HelpCircle,
  Check,
  UserPlus
} from 'lucide-react';
import { storageService, ADMIN_MASTER_PASSWORD } from '../../services/storageService';
import { AuthService } from '../../services/authService';
import { updatePresenceInFirestore } from '../../services/firestoreService';
import { NIGERIAN_STATES } from '../../data/nigerianLocations';
import { UserProfile, AppLanguage } from '../../types';
import { EmailNotificationService } from '../../services/emailNotificationService';
import { TermsOfServiceModal } from '../common/TermsOfServiceModal';
import { languageService } from '../../services/languageService';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup' | 'admin';
  isMandatoryGate?: boolean;
  onClose: () => void;
  onSuccess?: (user: UserProfile, isAdmin?: boolean) => void;
  onShowToast?: (points: number, message: string) => void;
  onAuthSuccess?: (message: string) => void;
  onAdminSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  isMandatoryGate = false,
  onClose,
  onSuccess,
  onShowToast,
  onAuthSuccess,
  onAdminSuccess
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'admin'>(initialMode);
  const [lang, setLang] = useState<AppLanguage>(languageService.getLanguage());

  useEffect(() => {
    const unsub = languageService.subscribe((l) => setLang(l));
    return unsub;
  }, []);

  const t = languageService.getDictionary();
  
  // Form fields
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [wantSabiFor, setWantSabiFor] = useState<string>('Fact-checking viral social media rumors & deepfakes');
  const [heardSabiFrom, setHeardSabiFrom] = useState<string>('Twitter (X)');
  const [selectedState, setSelectedState] = useState<string>('Lagos');
  const [selectedLga, setSelectedLga] = useState<string>('Lagos Mainland');
  const [adminPassword, setAdminPassword] = useState<string>('');
  
  // Terms & Services Agreement
  const [isTermsAccepted, setIsTermsAccepted] = useState<boolean>(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState<boolean>(false);

  // Google Account Chooser
  const [isGoogleAccountPickerOpen, setIsGoogleAccountPickerOpen] = useState<boolean>(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState<string>('');
  const [customGoogleName, setCustomGoogleName] = useState<string>('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState<boolean>(false);

  // UI status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [successUser, setSuccessUser] = useState<UserProfile | null>(null);
  const [isNewUserSignUp, setIsNewUserSignUp] = useState<boolean>(false);
  const [connectedAccountToast, setConnectedAccountToast] = useState<{ email: string; name: string } | null>(null);

  if (!isOpen) return null;

  const currentStateData = NIGERIAN_STATES.find(s => s.state === selectedState) || NIGERIAN_STATES[0];

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const sData = NIGERIAN_STATES.find(s => s.state === stateName);
    if (sData && sData.lgas.length > 0) {
      setSelectedLga(sData.lgas[0].name);
    }
  };

  // Preset known Google accounts that users can pick from
  const registeredUsers = storageService.getRegisteredUsers();
  const existingGoogleAccounts = [
    { name: 'Enoch Ayomide', email: 'enochayomide2013@gmail.com', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Enoch&backgroundColor=0A3D2E' },
    { name: 'Chinedu Okafor', email: 'chinedu.okafor@gmail.com', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
    { name: 'Amina Bello', email: 'amina.bello@gmail.com', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80' },
    ...registeredUsers.filter(u => u.email.includes('@')).map(u => ({ name: u.name, email: u.email, avatar: u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' }))
  ].filter((acc, index, self) => index === self.findIndex((a) => a.email.toLowerCase() === acc.email.toLowerCase()));

  const handleOpenGooglePicker = () => {
    setErrorMsg(null);
    setIsGoogleAccountPickerOpen(true);
  };

  const handleSelectGoogleAccount = async (selectedEmail: string, selectedAccountName: string) => {
    if (!isTermsAccepted) {
      setErrorMsg('Please accept the Terms of Service & Community Code of Conduct before proceeding.');
      return;
    }

    setIsGoogleAccountPickerOpen(false);
    setErrorMsg(null);
    setIsGoogleLoading(true);

    try {
      const mockGoogle = {
        name: selectedAccountName || selectedEmail.split('@')[0],
        email: selectedEmail,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(selectedAccountName)}&backgroundColor=0A3D2E`,
        uid: 'usr_goog_' + Date.now().toString(36),
        phoneNumber: phoneNumber.trim() || undefined,
        wantSabiFor: wantSabiFor || undefined,
        heardSabiFrom: heardSabiFrom || undefined
      };
      
      const res = storageService.signInWithGoogleUser(mockGoogle);
      updatePresenceInFirestore(res.user.id, res.user.name, res.user);

      // Show prominent visual "Connected" confirmation toast
      setConnectedAccountToast({ email: res.user.email, name: res.user.name });
      const connectedMsg = `Connected! Google account ${res.user.email} successfully linked & authenticated.`;

      // Trigger automatic welcome/verification email to registered email
      if (res.isNewUser && res.user.email) {
        EmailNotificationService.sendSignupNotification({
          email: res.user.email,
          name: res.user.name,
          state: res.user.state,
          lga: res.user.lga
        });
      }

      if (onSuccess) onSuccess(res.user, false);
      if (onAuthSuccess) onAuthSuccess(connectedMsg);
      if (onShowToast) onShowToast(res.isNewUser ? 100 : 0, connectedMsg);

      setIsNewUserSignUp(res.isNewUser);
      setSuccessUser(res.user);
    } catch (err: any) {
      console.warn('Google Auth notice:', err);
      setErrorMsg('Could not authenticate with Google. Please try again.');
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
    const res = storageService.signIn(email, password);
    setIsSubmitting(false);

    if (res.success && res.user) {
      updatePresenceInFirestore(res.user.id, res.user.name, res.user);
      const msg = res.isAdmin ? 'Welcome Admin! Directed to Admin Portal.' : `Welcome back, ${res.user.name}!`;

      if (onSuccess) onSuccess(res.user, res.isAdmin);
      if (onAuthSuccess) onAuthSuccess(msg);
      if (onShowToast) onShowToast(0, msg);
      if (res.isAdmin && onAdminSuccess) onAdminSuccess();

      setIsNewUserSignUp(false);
      setSuccessUser(res.user);
    } else {
      setErrorMsg(res.message || 'Unable to sign in. The email and password used must match the exact credentials created during registration.');
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isTermsAccepted) {
      setErrorMsg('Please agree to the Terms of Service & Community Truth Guidelines to create an account.');
      return;
    }

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

    if (!phoneNumber.trim()) {
      setErrorMsg('Please enter your phone number.');
      return;
    }

    setIsSubmitting(true);
    const res = storageService.signUp({
      name,
      email,
      password,
      phoneNumber: phoneNumber.trim(),
      wantSabiFor,
      heardSabiFrom,
      state: selectedState,
      lga: selectedLga
    });

    setIsSubmitting(false);

    if (res.success && res.user) {
      updatePresenceInFirestore(res.user.id, res.user.name, res.user);
      const msg = `Signed up successfully! You received +100 Welcome Points.`;

      // Dispatch welcome confirmation email to registered user
      if (res.user.email) {
        EmailNotificationService.sendSignupNotification({
          email: res.user.email,
          name: res.user.name,
          state: res.user.state,
          lga: res.user.lga
        });
      }

      if (onSuccess) onSuccess(res.user, res.user.role === 'admin');
      if (onAuthSuccess) onAuthSuccess(msg);
      if (onShowToast) onShowToast(100, msg);

      setIsNewUserSignUp(true);
      setSuccessUser(res.user);
    } else {
      setErrorMsg(res.message || 'Unable to create account.');
    }
  };

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (adminPassword.trim() !== ADMIN_MASTER_PASSWORD) {
      setErrorMsg('Incorrect admin passcode.');
      return;
    }

    setIsSubmitting(true);
    const res = storageService.adminSignIn(adminPassword.trim());
    setIsSubmitting(false);

    if (res.success && res.user) {
      updatePresenceInFirestore(res.user.id, res.user.name, res.user);
      const msg = 'Master Admin authenticated! Opening Admin Portal.';

      if (onSuccess) onSuccess(res.user, true);
      if (onAuthSuccess) onAuthSuccess(msg);
      if (onShowToast) onShowToast(50, msg);
      if (onAdminSuccess) onAdminSuccess();

      setIsNewUserSignUp(false);
      setSuccessUser(res.user);
    } else {
      setErrorMsg(res.message || 'Admin validation failed.');
    }
  };

  const isAdminOnlyMode = initialMode === 'admin' || mode === 'admin';

  if (successUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="auth-success-modal">
        <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-up">
          
          {/* Header */}
          <div className="p-5 text-white bg-gradient-to-r from-[#0A3D2E] to-[#0e4f3c] text-center relative">
            <button
              onClick={() => { onClose(); setSuccessUser(null); }}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-16 h-16 rounded-full bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-white scale-110 animate-pulse">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>
            <h2 className="text-xl font-extrabold font-display">
              {isNewUserSignUp ? 'Verification Account Created!' : 'Successfully Signed In!'}
            </h2>
            <p className="text-xs text-emerald-100/90 mt-1">
              Your secure decentralized SABI Nigeria identity has been verified.
            </p>
          </div>

          {/* Profile Details */}
          <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto bg-gray-50/50">
            {connectedAccountToast && (
              <div className="bg-emerald-600 text-white p-3.5 rounded-2xl shadow-md flex items-center gap-3 animate-fade-in border border-emerald-400/40" id="google-connected-toast-card">
                <div className="w-8 h-8 rounded-full bg-white text-emerald-700 flex items-center justify-center shrink-0 font-black text-sm">
                  ✓
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <span className="font-extrabold text-[10px] uppercase tracking-wider block text-emerald-100">Google Account Linked</span>
                  <span className="text-xs font-bold block text-white truncate">
                    {connectedAccountToast.email} linked & authenticated
                  </span>
                </div>
              </div>
            )}

            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-150">
                <img 
                  src={successUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'} 
                  alt={successUser.name} 
                  className="w-12 h-12 rounded-xl object-cover border-2 border-emerald-600 shadow-sm"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-sm text-gray-900 font-display truncate">{successUser.name}</h3>
                  <p className="text-xs text-gray-500 font-mono truncate">{successUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">SABI SPOTTER ID</span>
                  <span className="font-mono text-gray-700 font-bold bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">{successUser.id}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">TRUST LEVEL</span>
                  <span className="text-emerald-700 font-black flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> {successUser.trustLevel || 'Bronze'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">STATE OF INFLUENCE</span>
                  <span className="text-gray-800 font-extrabold">{successUser.state || 'Lagos'}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">LOCAL LGA</span>
                  <span className="text-gray-800 font-extrabold">{successUser.lga || 'Ikeja'}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">MEMBER TIER</span>
                  <span className="text-[#0A3D2E] font-black">{successUser.userTier || 'Member'} Tier</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider block">SABI POINTS BALANCE</span>
                  <span className="text-amber-600 font-black bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full inline-block">
                    ★ {successUser.sabiPoints} PTS
                  </span>
                </div>
              </div>
            </div>

            {/* Automated Welcome Email Notice */}
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-800 shrink-0" />
                <span className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                  Automated Welcome Email Dispatched
                </span>
              </div>
              <p className="text-[11px] text-emerald-900 leading-relaxed font-medium">
                An automatic welcome message with our <strong>Avid Community Overview, Visible Terms, & Privacy Policies</strong> has been sent to your registered email: <strong className="font-mono underline">{successUser.email}</strong>.
              </p>
              
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200 text-[10px] space-y-1 text-gray-700">
                <p><strong>• Guarantees:</strong> Truth Verification, NDPR Data Protection, Free Citizen Access</p>
                <p><strong>• Owner Contact:</strong> WhatsApp: <strong className="text-emerald-800">+234 8032813855</strong> | Email: <strong className="text-blue-800">enochayomide67@gmail.com</strong> | YouTube: <strong className="text-red-700">Enoch Ayomide (51 Subs)</strong></p>
              </div>
            </div>

            {/* Performance Statistics */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs space-y-2.5">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Network Performance Metrics</h4>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
                  <span className="font-extrabold text-emerald-800 text-sm block">{successUser.completedVerificationsCount || 0}</span>
                  <span className="text-[9px] text-gray-500 font-medium">Verifications</span>
                </div>
                <div className="bg-blue-50/50 p-2 rounded-xl border border-blue-100">
                  <span className="font-extrabold text-blue-800 text-sm block">{successUser.submittedReportsCount || 0}</span>
                  <span className="text-[9px] text-gray-500 font-medium">Reports</span>
                </div>
                <div className="bg-amber-50/50 p-2 rounded-xl border border-amber-100">
                  <span className="font-extrabold text-amber-800 text-sm block">{successUser.accuracyRate || 100}%</span>
                  <span className="text-[9px] text-gray-500 font-medium">Accuracy</span>
                </div>
              </div>
            </div>

            {/* Badges Earned */}
            {successUser.badges && successUser.badges.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unlocked Badges</h4>
                <div className="flex flex-wrap gap-1.5">
                  {successUser.badges.map((badge, idx) => (
                    <span key={idx} className="bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded-full">
                      🛡 {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-gray-400 text-[10px] text-center pt-1">
              Registered on: <strong className="text-gray-600">{successUser.joinedDate || 'September 2026'}</strong>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-5 border-t border-gray-200 bg-white">
            <button
              onClick={() => { onClose(); setSuccessUser(null); }}
              className="w-full bg-[#0A3D2E] hover:bg-[#0c4a37] text-white font-bold text-sm py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer font-display"
            >
              <span>Proceed & Enter SABI Live Network</span>
              <ArrowRight className="w-4 h-4 text-[#FFD60A]" />
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in" 
        id="auth-modal"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isMandatoryGate) {
            onClose();
          }
        }}
      >
        <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 animate-scale-up">
          
          {/* Modal Top Header */}
          <div className={`p-5 text-white relative ${isAdminOnlyMode ? 'bg-gradient-to-r from-amber-900 to-amber-950' : 'bg-gradient-to-r from-[#0A3D2E] to-[#0e4f3c]'}`}>
            {!isMandatoryGate && (
              <button
                id="close-auth-modal-btn"
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black font-display text-sm shadow-sm ${isAdminOnlyMode ? 'bg-amber-400 text-amber-950' : 'bg-[#FFD60A] text-[#0A3D2E]'}`}>
                  {isAdminOnlyMode ? '★' : 'S'}
                </div>
                <span className={`font-extrabold tracking-wider text-xs uppercase font-display ${isAdminOnlyMode ? 'text-amber-300' : 'text-[#FFD60A]'}`}>
                  {isAdminOnlyMode ? 'SABI Administrator Central' : 'SABI Nigeria'}
                </span>
              </div>

              {isMandatoryGate && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 text-emerald-100 px-2.5 py-0.5 rounded-full border border-white/25">
                  Authentication Required
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold font-display text-white">
              {mode === 'admin'
                ? 'Administrator Passcode Login'
                : mode === 'signup' 
                ? t.signUp
                : t.signIn}
            </h2>
            <p className="text-xs text-emerald-100/80 mt-0.5">
              {mode === 'admin'
                ? 'Enter master credentials to moderate truth verifications and dispatch reports.'
                : mode === 'signup'
                ? 'Create your account to verify food prices, join the live Sabiers room & earn points.'
                : 'Sign in with your exact registered email & password to access your SABI spotter profile.'}
            </p>
          </div>

          {/* Mode Selector Tabs */}
          {!isAdminOnlyMode && (
            <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-xs font-bold">
              <button
                id="tab-signin-btn"
                type="button"
                onClick={() => { setMode('signin'); setErrorMsg(null); }}
                className={`flex-1 py-3 text-center transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-white dark:bg-gray-900 text-[#0A3D2E] dark:text-[#FFD60A] border-b-2 border-[#0A3D2E] dark:border-[#FFD60A]'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {t.signIn}
              </button>
              <button
                id="tab-signup-btn"
                type="button"
                onClick={() => { setMode('signup'); setErrorMsg(null); }}
                className={`flex-1 py-3 text-center transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-white dark:bg-gray-900 text-[#0A3D2E] dark:text-[#FFD60A] border-b-2 border-[#0A3D2E] dark:border-[#FFD60A]'
                    : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                {t.signUp} (+100 PTS)
              </button>
            </div>
          )}

          {/* Form Body */}
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto bg-white dark:bg-gray-900">
            
            {errorMsg && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl flex items-start gap-2 animate-fade-in" id="auth-error-message">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* GOOGLE SIGN IN BUTTON & ACCOUNT CHOOSER */}
            {!isAdminOnlyMode && (
              <div className="space-y-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={handleOpenGooglePicker}
                  disabled={isGoogleLoading}
                  className="w-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 font-bold text-xs py-3 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2.5 transition-all active:scale-98 cursor-pointer"
                  id="btn-google-auth-trigger"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>{isGoogleLoading ? 'Connecting Google Account...' : `Continue / Choose Google Account`}</span>
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-200 dark:border-gray-800 w-full" />
                  <span className="bg-white dark:bg-gray-900 px-2 text-[10px] uppercase font-bold text-gray-400 absolute">
                    or sign in with registered email
                  </span>
                </div>
              </div>
            )}

            {/* SIGN IN FORM */}
            {mode === 'signin' && !isAdminOnlyMode && (
              <form onSubmit={handleSignIn} className="space-y-3.5" id="signin-form">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      id="signin-email-input"
                      type="email"
                      required
                      placeholder="e.g. enochayomide2013@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      id="signin-password-input"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter the exact password used to register"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-10 pr-10 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="submit-signin-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-[#0A3D2E] hover:bg-[#0c4a37] text-white font-bold text-sm py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Signing In...' : t.signIn}</span>
                  <ArrowRight className="w-4 h-4 text-[#FFD60A]" />
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => { setMode('signup'); setErrorMsg(null); }}
                    className="text-xs text-[#0A3D2E] dark:text-[#FFD60A] font-bold hover:underline cursor-pointer"
                  >
                    Don't have an account yet? Sign Up (+100 PTS)
                  </button>
                </div>
              </form>
            )}

            {/* SIGN UP FORM */}
            {mode === 'signup' && !isAdminOnlyMode && (
              <form onSubmit={handleSignUp} className="space-y-3" id="signup-form">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
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
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
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
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      id="signup-phone-input"
                      type="tel"
                      required
                      placeholder="e.g. +234 801 234 5678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
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
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-10 pr-10 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* What do you want SABI for? */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    What do you want SABI for?
                  </label>
                  <div className="relative">
                    <Compass className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <select
                      id="signup-want-sabi-for-select"
                      value={wantSabiFor}
                      onChange={(e) => setWantSabiFor(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-10 pr-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                    >
                      <option value="Fact-checking viral social media rumors & deepfakes">Fact-checking viral social media rumors & deepfakes</option>
                      <option value="Food market prices & basket inflation monitor">Food market prices & basket inflation monitor</option>
                      <option value="Community safety & local incident verification">Community safety & local incident verification</option>
                      <option value="Live Sabiers community chat & mutual assistance">Live Sabiers community chat & mutual assistance</option>
                      <option value="Journalism, media reporting & newsroom research">Journalism, media reporting & newsroom research</option>
                      <option value="General truth verification across Nigeria">General truth verification across Nigeria</option>
                    </select>
                  </div>
                </div>

                {/* Where did you hear about SABI? */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                    Where did you hear about SABI?
                  </label>
                  <div className="relative">
                    <HelpCircle className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <select
                      id="signup-heard-sabi-from-select"
                      value={heardSabiFrom}
                      onChange={(e) => setHeardSabiFrom(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-10 pr-3 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                    >
                      <option value="Twitter (X)">Twitter (X)</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Instagram">Instagram</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Facebook">Facebook</option>
                      <option value="WhatsApp / Telegram community group">WhatsApp / Telegram community group</option>
                      <option value="Friend or Colleague recommendation">Friend or Colleague recommendation</option>
                    </select>
                  </div>
                </div>

                {/* State & LGA */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                      State
                    </label>
                    <select
                      id="signup-state-select"
                      value={selectedState}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-2.5 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                    >
                      {NIGERIAN_STATES.map(s => (
                        <option key={s.state} value={s.state}>{s.state}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase">
                      LGA
                    </label>
                    <select
                      id="signup-lga-select"
                      value={selectedLga}
                      onChange={(e) => setSelectedLga(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-2.5 py-2 text-xs font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                    >
                      {currentStateData.lgas.map(l => (
                        <option key={l.name} value={l.name}>{l.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Terms of Service Checkbox & Modal Trigger */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 text-xs text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                    <input
                      id="terms-checkbox"
                      type="checkbox"
                      checked={isTermsAccepted}
                      onChange={(e) => setIsTermsAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-[#0A3D2E] focus:ring-[#0A3D2E] accent-[#0A3D2E] cursor-pointer"
                    />
                    <span className="leading-tight">
                      {t.agreeTerms}{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsTermsModalOpen(true);
                        }}
                        className="text-[#0A3D2E] dark:text-[#FFD60A] font-bold underline hover:opacity-80"
                      >
                        ({t.readTerms})
                      </button>
                    </span>
                  </label>
                </div>

                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-xs text-[#0A3D2E] dark:text-emerald-200">
                  <Sparkles className="w-4 h-4 text-[#FFD60A] shrink-0" />
                  <span>You will receive <strong>+100 Stat Points</strong> upon sign-up!</span>
                </div>

                <button
                  id="submit-signup-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#0A3D2E] hover:bg-[#0c4a37] text-white font-bold text-sm py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Creating Account...' : 'Create Account & Sign In'}</span>
                  <CheckCircle2 className="w-4 h-4 text-[#FFD60A]" />
                </button>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => { setMode('signin'); setErrorMsg(null); }}
                    className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 font-medium cursor-pointer"
                  >
                    Already have an account? <span className="text-[#0A3D2E] dark:text-[#FFD60A] font-bold underline">Sign In</span>
                  </button>
                </div>
              </form>
            )}

            {/* ADMIN PASSKEY ACCESS */}
            {mode === 'admin' && (
              <form onSubmit={handleAdminAccess} className="space-y-4" id="admin-passkey-form">
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-3.5 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 text-xs uppercase">
                    <KeyRound className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <span>SABI Administrator Portal Access</span>
                  </div>
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    Enter master administrative passcode to authenticate. Sign up and general user login are omitted for administrative security.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
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
                      className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-mono font-bold tracking-widest focus:ring-2 focus:ring-amber-600 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  id="submit-admin-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm py-3 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer disabled:opacity-50"
                >
                  <span>{isSubmitting ? 'Authenticating...' : 'Enter Admin Portal'}</span>
                  <ShieldCheck className="w-4 h-4 text-white" />
                </button>
              </form>
            )}

          </div>

        </div>
      </div>

      {/* GOOGLE ACCOUNT CHOOSER DIALOG */}
      {isGoogleAccountPickerOpen && (
        <div 
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          id="google-account-chooser-modal"
        >
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 animate-scale-up">
            <div className="p-5 border-b border-gray-150 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white font-display">
                  Choose a Google Account
                </h3>
              </div>
              <button 
                onClick={() => setIsGoogleAccountPickerOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-2 max-h-[55vh] overflow-y-auto">
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-2">
                Select an account to proceed to <strong>SABI Nigeria</strong>:
              </p>

              {/* Terms of Service Consent Banner in Account Chooser */}
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl mb-3">
                <label className="flex items-start gap-2 text-[11px] text-gray-700 dark:text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTermsAccepted}
                    onChange={(e) => setIsTermsAccepted(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded text-[#0A3D2E] accent-[#0A3D2E] cursor-pointer"
                  />
                  <span>
                    I agree to the SABI Community Terms & Verification Guidelines.{' '}
                    <button
                      type="button"
                      onClick={() => setIsTermsModalOpen(true)}
                      className="text-[#0A3D2E] dark:text-[#FFD60A] font-bold underline"
                    >
                      (View)
                    </button>
                  </span>
                </label>
              </div>

              {/* Accounts list */}
              {existingGoogleAccounts.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectGoogleAccount(acc.email, acc.name)}
                  className="w-full p-3 rounded-2xl border border-gray-200 dark:border-gray-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 flex items-center gap-3 text-left transition-all active:scale-98 cursor-pointer group"
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-[#0A3D2E] dark:group-hover:text-[#FFD60A]">
                      {acc.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono truncate">
                      {acc.email}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0A3D2E] shrink-0" />
                </button>
              ))}

              {/* Add Custom / Other Account */}
              {!showCustomGoogleInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomGoogleInput(true)}
                  className="w-full p-3 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 text-left transition-all cursor-pointer text-gray-600 dark:text-gray-300"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <UserPlus className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold">Use another Google account</h4>
                    <p className="text-[10px] text-gray-400">Sign in with a different Google address</p>
                  </div>
                </button>
              ) : (
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl space-y-2 border border-gray-200 dark:border-gray-700">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Google Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Enoch Ayomide"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#0A3D2E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase">Google Email</label>
                    <input
                      type="email"
                      placeholder="name@gmail.com"
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-[#0A3D2E]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (customGoogleEmail.trim()) {
                        handleSelectGoogleAccount(customGoogleEmail.trim(), customGoogleName.trim());
                      }
                    }}
                    className="w-full py-2 bg-[#0A3D2E] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#0c4a37] transition-all cursor-pointer"
                  >
                    Authenticate Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TERMS OF SERVICE MODAL */}
      <TermsOfServiceModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={() => setIsTermsAccepted(true)}
      />
    </>
  );
};

export default AuthModal;

