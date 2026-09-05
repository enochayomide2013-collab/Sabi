import React from 'react';
import { X, ShieldCheck, Check, FileText, AlertTriangle, Users, Lock } from 'lucide-react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
  isOpen,
  onClose,
  onAccept
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      id="terms-of-service-modal"
    >
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 text-white bg-gradient-to-r from-[#0A3D2E] to-[#0e4f3c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center font-black">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold font-display leading-tight">
                SABI Terms of Service & Community Rules
              </h2>
              <p className="text-xs text-emerald-200">
                Nigeria Truth Network & Code of Conduct
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close Terms"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs text-gray-700 dark:text-gray-300 flex-1 leading-relaxed">
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 rounded-2xl flex items-start gap-2.5 text-emerald-900 dark:text-emerald-200">
            <Check className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-xs font-bold">Welcome to SABI Nigeria</strong>
              <span>By signing up, logging in, and using SABI, you agree to uphold truth, report accurate commodity prices, and maintain respectful community verification.</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-sm text-[#0A3D2E] dark:text-[#FFD60A] flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              1. Truth & Evidence Standard
            </h3>
            <p>
              All submissions, reports, photos, and voice notes must reflect genuine eyewitness observations or official verifiable sources. Intentional fabrication or spreading of deepfakes and doctored receipts is strictly prohibited and results in immediate account suspension.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-sm text-[#0A3D2E] dark:text-[#FFD60A] flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              2. Privacy & Geolocation Transparency
            </h3>
            <p>
              Your geolocation is used solely to provide relevant local market prices and safety rumors within your state and LGA. We do not sell your personal data or track your background location without explicit permissions.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-sm text-[#0A3D2E] dark:text-[#FFD60A] flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              3. Live Sabiers Community Guidelines
            </h3>
            <p>
              The Live Sabiers chat is dedicated to peaceful, constructive cross-verification and mutual help. Harassment, tribalism, political disinformation, hate speech, and spamming are strictly forbidden under our zero-tolerance moderation policy.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-extrabold text-sm text-[#0A3D2E] dark:text-[#FFD60A] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              4. Disclaimer of Liability
            </h3>
            <p>
              SABI provides real-time community-driven crowdsourced data and AI media forensics for public awareness. Community members should independently corroborate emergency advisories with official state and federal authorities.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-850 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
          {onAccept && (
            <button
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="px-5 py-2.5 bg-[#0A3D2E] hover:bg-[#0c4a37] text-[#FFD60A] text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>I Agree & Accept</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default TermsOfServiceModal;
