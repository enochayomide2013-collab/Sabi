import React, { useState, useEffect } from 'react';
import { X, Play, Volume2, Bot, Laugh } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewsAnchorSimulationProps {
  title: string;
  summary: string;
  onClose: () => void;
}

export const NewsAnchorSimulation: React.FC<NewsAnchorSimulationProps> = ({ title, summary, onClose }) => {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (playing) {
      const interval = setInterval(() => {
        setProgress(prev => prev >= 100 ? 100 : prev + 2);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [playing]);

  const humorousScript = `Breaking news, Sabiers! ${title.split(' ').slice(0, 5).join(' ')}... or so the rumours say. The official story is: ${summary.substring(0, 100)}... but honestly, who even knows anymore? This is your AI Anchor, keeping it real while the market keeps it... well, expensive. Back to you!`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 rounded-3xl p-6 w-full max-w-2xl text-white shadow-2xl space-y-4"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-extrabold text-lg flex items-center gap-2">
            <Bot className="w-6 h-6 text-emerald-400" /> SABI AI News Studio
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full"><X /></button>
        </div>

        <div className="aspect-video bg-black rounded-2xl relative overflow-hidden flex items-center justify-center">
            {/* Simulated AI Anchor Persona */}
            <div className="text-6xl animate-pulse">🤖</div>
            {!playing && (
                <button onClick={() => setPlaying(true)} className="absolute bg-white/20 p-4 rounded-full backdrop-blur-sm">
                    <Play className="w-12 h-12 text-white fill-white" />
                </button>
            )}
        </div>

        <div className="bg-gray-800 p-4 rounded-xl text-sm leading-relaxed">
            <Laugh className="w-4 h-4 inline text-amber-400 mb-1" /> <span className="font-semibold text-amber-400">Anchor Insight:</span> {humorousScript}
        </div>
        
        {playing && (
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${progress}%` }}></div>
            </div>
        )}
      </motion.div>
    </div>
  );
};
