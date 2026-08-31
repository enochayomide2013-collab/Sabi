import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface ReportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentTitle: string;
}

export const ReportContentModal: React.FC<ReportContentModalProps> = ({
  isOpen,
  onClose,
  contentTitle
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const reasons = [
    'Manipulated evidence or deepfake',
    'Dangerous misinformation',
    'Outdated media represented as new',
    'Incorrect location or market tag',
    'Spam or advertising content',
    'Harassment or personal information leak',
    'Copyright or ownership concern',
    'Other concern'
  ];

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReason) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedReason('');
      setDetails('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-red-800 text-white">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-200" />
            <h2 className="text-base font-bold font-display">Report Content to SABI</h2>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 font-display">Report Received</h3>
            <p className="text-sm text-gray-600">
              Thank you for keeping SABI safe and reliable. Our community moderation team will review this item immediately.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <span className="text-xs text-gray-500 font-semibold block">Reporting Item:</span>
              <p className="text-sm font-bold text-gray-900 line-clamp-1">{contentTitle}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Why are you reporting this?
              </label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {reasons.map((reason) => (
                  <label 
                    key={reason}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      selectedReason === reason 
                        ? 'border-red-600 bg-red-50 text-red-900' 
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="reportReason" 
                      value={reason}
                      checked={selectedReason === reason}
                      onChange={() => setSelectedReason(reason)}
                      className="text-red-600 focus:ring-red-500"
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                Additional Details (Optional)
              </label>
              <textarea 
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide any context that helps our verification reviewers..."
                rows={2}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedReason}
                className="bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
