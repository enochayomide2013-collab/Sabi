import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Sparkles, MapPin, ArrowRight, ShieldCheck, Radio, Flame } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { SabiersChatMessage, UserProfile, AppLanguage } from '../../types';
import { languageService } from '../../services/languageService';

interface LiveSabiersPreviewCardProps {
  onNavigate: (tab: string, extraData?: any) => void;
}

export const LiveSabiersPreviewCard: React.FC<LiveSabiersPreviewCardProps> = ({ onNavigate }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(storageService.getUser());
  const [messages, setMessages] = useState<SabiersChatMessage[]>(storageService.getSabiersMessages());
  const [lang, setLang] = useState<AppLanguage>(languageService.getLanguage());

  useEffect(() => {
    const unsubLang = languageService.subscribe((l) => setLang(l));
    const unsubStorage = storageService.subscribe(() => {
      setCurrentUser(storageService.getUser());
      setMessages(storageService.getSabiersMessages());
    });
    return () => {
      unsubLang();
      unsubStorage();
    };
  }, []);

  const t = languageService.getDictionary();

  // Active online sabiers data
  const onlineSabiers = [
    {
      id: 'usr_live_1',
      name: 'Chinedu O.',
      location: 'Ikeja, Lagos',
      role: 'Market Spotter',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'Verifying Mile 12 Yam Prices'
    },
    {
      id: 'usr_live_2',
      name: 'Amina B.',
      location: 'Wuse 2, Abuja',
      role: 'Truth Sentinel',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&auto=format&fit=crop&q=80',
      status: 'Debunking Fuel Subsidy Rumor'
    },
    {
      id: 'usr_live_3',
      name: 'Emeka N.',
      location: 'Port Harcourt, Rivers',
      role: 'Pioneer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
      status: 'Confirmed Petrol Station Rates'
    },
    {
      id: 'usr_live_4',
      name: 'Fatima D.',
      location: 'Kano Municipal, Kano',
      role: 'Community Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80',
      status: 'Live on Kurmi Market Prices'
    },
    {
      id: 'usr_live_5',
      name: 'Tunde A.',
      location: 'Bodija, Oyo',
      role: 'Senior Verifier',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
      status: 'Cross-checking viral video'
    }
  ];

  const recentMessage = messages[messages.length - 1];

  return (
    <section className="bg-gradient-to-br from-[#0A3D2E] via-[#0d4d3a] to-[#082e22] text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-700/50 space-y-4 relative overflow-hidden" id="live-sabiers-home-section">
      
      {/* Decorative ambient background */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFD60A]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center font-black shadow-md shrink-0">
            <Radio className="w-5 h-5 animate-pulse text-[#0A3D2E]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black font-display text-white">
                {t.liveSabiersTitle}
              </h2>
              <span className="flex items-center gap-1 bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                {t.activeOnline}
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 mt-0.5">
              {t.liveSabiersSubtitle}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('sabiers')}
          className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0 font-display cursor-pointer"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{t.joinLiveChat}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* USER LIVE NOTIFICATION BANNER */}
      {currentUser.isAuthenticated && (
        <div className="bg-emerald-950/70 border border-emerald-400/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 animate-fade-in relative z-10" id="live-user-notification-banner">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-[#FFD60A]"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#0A3D2E] rounded-full" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white truncate">
                  {currentUser.name}
                </span>
                <span className="text-[9px] bg-[#FFD60A] text-[#0A3D2E] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                  {t.liveBadge}
                </span>
              </div>
              <p className="text-[11px] text-emerald-200 truncate">
                {t.liveChatPrompt}
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('sabiers')}
            className="bg-white hover:bg-gray-100 text-[#0A3D2E] font-extrabold text-[11px] px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer shadow-xs"
          >
            Chat Now
          </button>
        </div>
      )}

      {/* Online Sabiers Avatars Grid / Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 relative z-10">
        {onlineSabiers.map((sabier) => (
          <div
            key={sabier.id}
            onClick={() => onNavigate('sabiers')}
            className="bg-black/20 hover:bg-black/30 border border-white/10 hover:border-[#FFD60A]/40 rounded-2xl p-2.5 flex flex-col items-center text-center transition-all cursor-pointer group"
          >
            <div className="relative mb-1.5">
              <img
                src={sabier.avatar}
                alt={sabier.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400/60 group-hover:border-[#FFD60A] transition-colors"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0A3D2E] rounded-full animate-pulse" />
            </div>
            <h4 className="text-xs font-bold text-white truncate w-full group-hover:text-[#FFD60A] transition-colors">
              {sabier.name}
            </h4>
            <span className="text-[10px] text-emerald-200 truncate w-full flex items-center justify-center gap-0.5">
              <MapPin className="w-2.5 h-2.5 text-[#FFD60A] shrink-0" />
              <span className="truncate">{sabier.location}</span>
            </span>
            <span className="text-[9px] text-gray-300 mt-1 line-clamp-1 italic bg-white/10 px-1.5 py-0.5 rounded-md w-full">
              {sabier.status}
            </span>
          </div>
        ))}
      </div>

      {/* Latest Live Chat Snippet */}
      {recentMessage && (
        <div 
          onClick={() => onNavigate('sabiers')}
          className="bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-3 text-xs transition-colors cursor-pointer relative z-10"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-extrabold text-[#FFD60A] truncate shrink-0">
              {recentMessage.senderName}:
            </span>
            <span className="text-gray-200 truncate">
              "{recentMessage.message}"
            </span>
          </div>
          <span className="text-[10px] text-emerald-300 shrink-0 flex items-center gap-1 font-mono">
            {recentMessage.timestamp} <ArrowRight className="w-3 h-3" />
          </span>
        </div>
      )}

    </section>
  );
};

export default LiveSabiersPreviewCard;
