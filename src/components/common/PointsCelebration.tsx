import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Sparkles, X } from 'lucide-react';

interface PointsCelebrationProps {
  points: number;
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

    // Launch celebratory confetti
    confetti({
      particleCount: 75,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#0A3D2E', '#FFD60A', '#16A34A', '#FFFFFF']
    });

    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [points, onClose]);

  if (points === null || points === undefined) {
    return null;
  }

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 animate-bounce-short">
      <div className="bg-[#0A3D2E] text-white p-4 rounded-2xl shadow-2xl border-2 border-[#FFD60A] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center font-extrabold text-lg shadow-inner">
            +{points}
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-[#FFD60A]" />
              <span className="font-bold text-sm text-[#FFD60A] font-display">Stat Points Earned!</span>
            </div>
            <p className="text-xs text-gray-200 line-clamp-1">{message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
