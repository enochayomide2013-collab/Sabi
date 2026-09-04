import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, X, CheckCircle, ShieldCheck } from 'lucide-react';

interface PointsCelebrationProps {
  points: number | null;
  message: string;
  onClose: () => void;
}

export const PointsCelebration: React.FC<PointsCelebrationProps> = ({
  points,
  message,
  onClose
}) => {
  useEffect(() => {
    if (points === null || points === undefined) return;

    // Only launch celebratory confetti when points are actually earned (> 0)
    if (points > 0) {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0A3D2E', '#FFD60A', '#16A34A', '#FFFFFF']
      });
    }

    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [points, onClose]);

  if (points === null || points === undefined) {
    return null;
  }

  const isConnectedMessage = message.toLowerCase().includes('connected');

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 animate-bounce-short" id="global-celebration-toast">
      <div className={`text-white p-4 rounded-2xl shadow-2xl border-2 flex items-center justify-between gap-3 ${
        isConnectedMessage 
          ? 'bg-emerald-900 border-emerald-400' 
          : 'bg-[#0A3D2E] border-[#FFD60A]'
      }`}>
        <div className="flex items-center gap-3">
          {isConnectedMessage ? (
            <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-extrabold text-lg shadow-inner shrink-0">
              <CheckCircle className="w-6 h-6 text-[#FFD60A]" />
            </div>
          ) : points > 0 ? (
            <div className="w-11 h-11 rounded-xl bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center font-extrabold text-base shadow-inner shrink-0">
              +{points}
            </div>
          ) : (
            <div className="w-11 h-11 rounded-xl bg-emerald-800 text-emerald-200 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#FFD60A]" />
            </div>
          )}
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              {isConnectedMessage ? (
                <>
                  <Sparkles className="w-4 h-4 text-[#FFD60A]" />
                  <span className="font-extrabold text-sm text-[#FFD60A] font-display">Account Connected</span>
                </>
              ) : points > 0 ? (
                <>
                  <Sparkles className="w-4 h-4 text-[#FFD60A]" />
                  <span className="font-extrabold text-sm text-[#FFD60A] font-display">Stat Points Earned!</span>
                </>
              ) : (
                <span className="font-bold text-sm text-emerald-200 font-display">SABI Notification</span>
              )}
            </div>
            <p className="text-xs text-gray-100 line-clamp-2 mt-0.5">{message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 shrink-0 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
