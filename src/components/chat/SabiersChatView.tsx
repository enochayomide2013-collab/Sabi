import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  MessageSquare, 
  Send, 
  Tag, 
  MapPin, 
  ShieldCheck, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Hash, 
  Filter, 
  Smile, 
  PlusCircle, 
  Bot,
  Search,
  Zap,
  Info,
  Radio,
  UserCheck,
  Award,
  Crown,
  Hand
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { SabiersChatMessage, UserProfile, TrustLevel, OnlineSabier } from '../../types';

interface SabiersChatViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onShowPointsToast?: (points: number, message: string) => void;
  onOpenSaboAi?: () => void;
  onlineCount?: number;
}

const CHANNELS = [
  { id: 'all', label: 'All Channels', icon: Hash },
  { id: 'general', label: '#general', desc: 'Truth Discussions', icon: MessageSquare },
  { id: 'market-prices', label: '#market-prices', desc: 'Live Food Spotters', icon: TrendingUp },
  { id: 'rumor-alerts', label: '#rumor-alerts', desc: 'Breaking Rumors', icon: AlertTriangle },
  { id: 'lagos', label: '#lagos', desc: 'Lagos Spotters', icon: MapPin },
  { id: 'abuja-north', label: '#abuja-north', desc: 'Abuja & North', icon: MapPin },
  { id: 'east-south', label: '#east-south', desc: 'East & South-South', icon: MapPin }
] as const;

export const SabiersChatView: React.FC<SabiersChatViewProps> = ({
  onNavigate,
  onShowPointsToast = (_points: number, _message: string) => {},
  onOpenSaboAi = () => {},
  onlineCount
}) => {
  const [user, setUser] = useState<UserProfile>(storageService.getUser());
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [messages, setMessages] = useState<SabiersChatMessage[]>(storageService.getSabiersMessages());
  const [onlineSabiers, setOnlineSabiers] = useState<OnlineSabier[]>(storageService.getOnlineSabiers());
  const [activeChatTab, setActiveChatTab] = useState<'chat' | 'online_sabiers'>('chat');
  const [messageInput, setMessageInput] = useState<string>('');
  const [targetChannel, setTargetChannel] = useState<SabiersChatMessage['channel']>('general');
  const [tagType, setTagType] = useState<'none' | 'market_price' | 'rumor_alert' | 'truth_verified'>('none');
  const [tagLabel, setTagLabel] = useState<string>('');
  const [showTagInput, setShowTagInput] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOnlineState, setSelectedOnlineState] = useState<string>('all');

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayOnlineCount = typeof onlineCount === 'number' && onlineCount > 0
    ? onlineCount
    : onlineSabiers.filter(s => s.isOnline).length || 1;

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      setUser(storageService.getUser());
      setMessages(storageService.getSabiersMessages());
      setOnlineSabiers(storageService.getOnlineSabiers());
    });
    return unsubscribe;
  }, []);

  const filteredMessages = messages.filter(m => {
    const matchesChannel = selectedChannel === 'all' || m.channel === selectedChannel;
    const matchesSearch = !searchQuery.trim() || 
      m.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.state.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChannel && matchesSearch;
  });

  const filteredOnlineSabiers = onlineSabiers.filter(s => {
    if (selectedOnlineState !== 'all' && s.state.toLowerCase() !== selectedOnlineState.toLowerCase()) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || 
           s.state.toLowerCase().includes(q) || 
           s.lga.toLowerCase().includes(q) ||
           s.currentActivity.toLowerCase().includes(q);
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    let attachedTag: SabiersChatMessage['attachedTag'] = undefined;
    if (tagType !== 'none' && tagLabel.trim()) {
      attachedTag = {
        type: tagType,
        label: tagLabel.trim()
      };
    }

    storageService.addSabiersMessage({
      message: messageInput.trim(),
      channel: targetChannel,
      attachedTag
    });

    setMessageInput('');
    setTagLabel('');
    setShowTagInput(false);
    setTagType('none');
    onShowPointsToast(5, 'Posted in The Sabiers chat (+5 PTS)!');

    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleMentionSabier = (sabier: OnlineSabier) => {
    setActiveChatTab('chat');
    const mentionTag = `@${sabier.name.replace(' (You)', '')} `;
    setMessageInput(prev => {
      if (prev.includes(mentionTag)) return prev;
      return `${mentionTag}${prev}`;
    });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleWaveAtSabier = (sabier: OnlineSabier) => {
    storageService.addSabiersMessage({
      message: `👋 *waves at ${sabier.name}* — Checking in from ${user.lga}, ${user.state}!`,
      channel: targetChannel
    });
    onShowPointsToast(5, `Waved at ${sabier.name} (+5 PTS)!`);
    setActiveChatTab('chat');
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    storageService.toggleSabiersReaction(messageId, emoji);
  };

  const getTrustBadgeClass = (trust: TrustLevel) => {
    switch (trust) {
      case 'Trusted Contributor':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Gold':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Silver':
        return 'bg-slate-200 text-slate-900 border-slate-300';
      case 'Bronze':
      default:
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-24 animate-fade-in" id="sabiers-group-chat-container">
      
      {/* THE SABIERS HERO HEADER & ACCURATE ONLINE STATS */}
      <div className="bg-gradient-to-br from-[#0A3D2E] via-[#0b4736] to-[#06291e] text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-[#0A3D2E]/40 relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
          <Users className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-[#FFD60A] text-[#0A3D2E] px-3 py-1 rounded-full font-display">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-600 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-700"></span>
              </span>
              <span>The Sabiers Network</span>
              <span className="bg-[#0A3D2E] text-white text-[10px] px-2 py-0.2 rounded-full">
                {displayOnlineCount} On Sabiers
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
              Nigeria's Live Verifiers & Chat Hub
            </h1>

            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed">
              Connect with fellow verifiers, market elders, and local fact-checkers online. Share live food commodity prices, debunk trending WhatsApp broadcasts, and build consensus in real time.
            </p>
          </div>

          {/* Assistant & Accurate Stats Capsule */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              id="open-sabo-ai-chat-btn"
              onClick={onOpenSaboAi}
              className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 font-display"
            >
              <Bot className="w-4 h-4" />
              <span>Ask Sabo AI</span>
            </button>

            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-center text-[11px] text-emerald-100 flex items-center justify-around gap-3">
              <div>
                <span className="font-black text-white block text-sm sm:text-base flex items-center justify-center gap-1">
                  <span className={`w-2 h-2 rounded-full inline-block ${displayOnlineCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'}`}></span>
                  {displayOnlineCount}
                </span>
                <span className="text-[10px] text-emerald-200">Online Sabiers</span>
              </div>
              <div className="w-px h-6 bg-white/20" />
              <div>
                <span className="font-extrabold text-[#FFD60A] block text-xs">98.4%</span>
                <span className="text-[10px] text-emerald-200">Truth Consensus</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOP NAVIGATION TABS: CHANNELS CHAT VS ONLINE SABIERS (ON SABIERS) */}
      <div className="flex items-center justify-between gap-2 bg-white rounded-2xl p-2 border border-gray-200 shadow-xs flex-wrap">
        <div className="flex items-center gap-2">
          <button
            id="tab-chat-channels-btn"
            onClick={() => setActiveChatTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
              activeChatTab === 'chat'
                ? 'bg-[#0A3D2E] text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Community Channels</span>
          </button>

          <button
            id="tab-online-sabiers-btn"
            onClick={() => setActiveChatTab('online_sabiers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-black transition-all relative ${
              activeChatTab === 'online_sabiers'
                ? 'bg-[#0A3D2E] text-white shadow-xs'
                : 'bg-emerald-50 hover:bg-emerald-100 text-[#0A3D2E] border border-emerald-200'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Users className="w-4 h-4" />
            <span>Online Sabiers (on sabiers)</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
              activeChatTab === 'online_sabiers' ? 'bg-[#FFD60A] text-[#0A3D2E]' : 'bg-[#0A3D2E] text-white'
            }`}>
              {displayOnlineCount}
            </span>
          </button>
        </div>

        {/* Global Chat / Sabiers Search */}
        <div className="relative w-full sm:w-56 mt-1 sm:mt-0">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeChatTab === 'chat' ? "Search messages or @users..." : "Search online sabiers..."}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:ring-1 focus:ring-[#0A3D2E] focus:outline-none"
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* VIEW A: ONLINE SABIERS SECTION ("ON SABIERS")           */}
      {/* ======================================================== */}
      {activeChatTab === 'online_sabiers' ? (
        <div className="space-y-4 animate-fade-in" id="online-sabiers-section">
          
          {/* Top Banner with Accurate Count */}
          <div className="bg-emerald-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-800 border border-emerald-600 flex items-center justify-center text-emerald-300 shrink-0">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black font-display text-white">
                    Live "On Sabiers" Directory
                  </h3>
                  <span className="bg-emerald-500 text-black text-xs font-black px-2 py-0.5 rounded-full">
                    {displayOnlineCount} Active Now
                  </span>
                </div>
                <p className="text-xs text-emerald-200 leading-relaxed mt-0.5">
                  Verified spotters and fact-checkers currently online across Nigeria. Click any member to chat or send a wave!
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveChatTab('chat')}
              className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0 flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Go to Group Chat</span>
            </button>
          </div>

          {/* Online Sabiers Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5" id="online-sabiers-grid">
            {filteredOnlineSabiers.map((sabier) => {
              const isCurrentUser = sabier.id === user.id || sabier.name.includes('(You)');

              return (
                <div
                  key={sabier.id}
                  className={`bg-white rounded-2xl p-4 border transition-all hover:shadow-md flex flex-col justify-between gap-3 ${
                    isCurrentUser 
                      ? 'border-emerald-400 ring-2 ring-emerald-300/40 bg-emerald-50/40' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar with Online Pulse */}
                    <div className="relative shrink-0">
                      <img
                        src={sabier.avatarUrl}
                        alt={sabier.name}
                        className={`w-12 h-12 rounded-2xl object-cover border-2 shadow-2xs ${sabier.isOnline ? 'border-emerald-500' : 'border-gray-200'}`}
                      />
                      {sabier.isOnline ? (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                        </span>
                      ) : (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-300 border-2 border-white rounded-full flex items-center justify-center"></span>
                      )}
                    </div>

                    {/* Sabier Details */}
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <h4 className="font-extrabold text-sm text-gray-900 font-display truncate">
                          {sabier.name}
                        </h4>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border shrink-0 ${getTrustBadgeClass(sabier.trustLevel)}`}>
                          {sabier.role === 'admin' ? '👑 Admin' : sabier.tier || sabier.trustLevel}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <MapPin className="w-3 h-3 text-[#0A3D2E] shrink-0" />
                        <span className="font-semibold text-gray-700 truncate">{sabier.lga}, {sabier.state}</span>
                      </div>

                      {/* Status Snippet */}
                      <p className="text-xs text-emerald-900 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 font-medium leading-tight">
                        {sabier.currentActivity}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Chat & Wave */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                    <span className="text-[10px] text-gray-400 font-medium">
                      {sabier.isOnline ? '🟢' : '⚫'} {sabier.lastActive}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {!isCurrentUser && (
                        <button
                          onClick={() => handleWaveAtSabier(sabier)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1.5 rounded-xl border border-amber-200 transition-all flex items-center gap-1 active:scale-95"
                          title="Send a wave greeting in chat"
                        >
                          <Hand className="w-3.5 h-3.5 text-amber-600" />
                          <span>Wave 👋</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleMentionSabier(sabier)}
                        className="bg-[#0A3D2E] hover:bg-[#0c4a37] text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-2xs flex items-center gap-1 active:scale-95"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#FFD60A]" />
                        <span>{isCurrentUser ? 'Post Update' : 'Chat'}</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        /* ======================================================== */
        /* VIEW B: CHAT CHANNELS & MESSAGING FEED                   */
        /* ======================================================== */
        <div className="space-y-4 animate-fade-in">
          
          {/* CHANNELS SELECTOR BAR */}
          <div className="bg-white rounded-2xl p-3 border border-gray-200 shadow-xs space-y-2">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {CHANNELS.map(ch => {
                const Icon = ch.icon;
                const isSelected = selectedChannel === ch.id;

                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedChannel(ch.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 ${
                      isSelected
                        ? 'bg-[#0A3D2E] text-white shadow-xs'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{ch.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* MESSAGES FEED CONTAINER */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200 shadow-sm min-h-[420px] flex flex-col justify-between space-y-4">
            
            {/* Messages Stream */}
            <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1" id="sabiers-messages-list">
              {filteredMessages.length === 0 ? (
                <div className="text-center py-12 text-gray-400 space-y-2">
                  <MessageSquare className="w-10 h-10 mx-auto text-gray-300" />
                  <p className="text-sm font-semibold">No messages in this channel yet.</p>
                  <p className="text-xs">Be the first to post a market update or verification alert!</p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isCurrentUser = msg.senderId === user.id || msg.senderName === user.name;

                  return (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isCurrentUser 
                          ? 'bg-emerald-50/60 border-emerald-200 ml-4 sm:ml-12' 
                          : 'bg-gray-50/80 border-gray-200/90 mr-4 sm:mr-12 hover:bg-gray-50'
                      }`}
                    >
                      {/* Sender Header */}
                      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={msg.senderAvatar}
                            alt={msg.senderName}
                            className="w-8 h-8 rounded-xl object-cover border border-gray-300 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-extrabold text-xs text-gray-900 font-display">
                                {msg.senderName} {isCurrentUser && '(You)'}
                              </h4>
                              <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${getTrustBadgeClass(msg.senderTrustLevel)}`}>
                                {msg.senderRole === 'admin' ? 'Master Admin' : msg.senderTrustLevel}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-gray-500">
                              <MapPin className="w-3 h-3 text-[#0A3D2E]" />
                              <span>{msg.lga}, {msg.state}</span>
                              <span>·</span>
                              <span className="font-semibold text-emerald-800">#{msg.channel}</span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[10px] text-gray-400 font-medium">
                          {msg.timestamp}
                        </span>
                      </div>

                      {/* Attached Tag (if any) */}
                      {msg.attachedTag && (
                        <div className="mb-2">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${
                            msg.attachedTag.type === 'market_price' 
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                              : msg.attachedTag.type === 'rumor_alert'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-blue-100 text-blue-900 border-blue-300'
                          }`}>
                            <Tag className="w-3 h-3" />
                            <span>{msg.attachedTag.label}</span>
                          </span>
                        </div>
                      )}

                      {/* Message Content */}
                      <p className="text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {msg.message}
                      </p>

                      {/* Reaction Buttons */}
                      <div className="flex items-center gap-1.5 pt-3 mt-2 border-t border-gray-200/60 flex-wrap">
                        {['👍', '🔥', '🇳🇬', '🎯', '💡', '👏'].map((emoji) => {
                          const existingReaction = msg.reactions.find(r => r.emoji === emoji);
                          const hasReacted = existingReaction?.userReacted;
                          const count = existingReaction?.count || 0;

                          return (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(msg.id, emoji)}
                              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold transition-all active:scale-90 ${
                                hasReacted
                                  ? 'bg-emerald-200 text-[#0A3D2E] font-bold border border-emerald-400 shadow-2xs'
                                  : count > 0
                                  ? 'bg-white text-gray-700 border border-gray-200'
                                  : 'hover:bg-gray-200/70 text-gray-400 opacity-60 hover:opacity-100'
                              }`}
                              title={`React with ${emoji}`}
                            >
                              <span>{emoji}</span>
                              {count > 0 && <span className="text-[10px]">{count}</span>}
                            </button>
                          );
                        })}
                      </div>

                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>

            {/* MESSAGE COMPOSER */}
            <div className="pt-3 border-t border-gray-200 space-y-2.5">
              
              {/* Optional Tag Accordion */}
              {showTagInput && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 animate-fade-in text-xs">
                  <div className="flex items-center justify-between font-bold text-[#0A3D2E]">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" /> Attach Verified Tag
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowTagInput(false)}
                      className="text-gray-400 hover:text-gray-600 text-xs"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-gray-600 block mb-1 uppercase">Tag Type</label>
                      <select
                        value={tagType}
                        onChange={(e) => setTagType(e.target.value as any)}
                        className="w-full bg-white border border-gray-300 rounded-xl px-2 py-1.5 text-xs font-semibold focus:outline-none"
                      >
                        <option value="none">No Tag</option>
                        <option value="market_price">Market Price Log</option>
                        <option value="rumor_alert">Rumor Buster Alert</option>
                        <option value="truth_verified">Truth Verified</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-gray-600 block mb-1 uppercase">Tag Label / Price Detail</label>
                      <input
                        type="text"
                        value={tagLabel}
                        onChange={(e) => setTagLabel(e.target.value)}
                        placeholder="e.g. Mile 12 Tomato: ₦52,000 / Rafia Basket"
                        className="w-full bg-white border border-gray-300 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSendMessage} className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  
                  {/* Channel Selector */}
                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-bold text-gray-600">Post in:</span>
                    <select
                      value={targetChannel}
                      onChange={(e) => setTargetChannel(e.target.value as any)}
                      className="bg-gray-100 border border-gray-300 text-gray-900 rounded-xl px-2.5 py-1 text-xs font-bold focus:ring-1 focus:ring-[#0A3D2E] focus:outline-none"
                    >
                      <option value="general">#general (Truth Feed)</option>
                      <option value="market-prices">#market-prices (Food Spotters)</option>
                      <option value="rumor-alerts">#rumor-alerts (Rumor Busters)</option>
                      <option value="lagos">#lagos (Lagos Spotters)</option>
                      <option value="abuja-north">#abuja-north (Abuja & North)</option>
                      <option value="east-south">#east-south (East & South-South)</option>
                    </select>
                  </div>

                  {/* Tag Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowTagInput(!showTagInput)}
                    className={`text-xs px-2.5 py-1 rounded-xl font-bold flex items-center gap-1 transition-all ${
                      showTagInput || tagType !== 'none'
                        ? 'bg-emerald-100 text-[#0A3D2E] border border-emerald-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Tag className="w-3 h-3 text-[#0A3D2E]" />
                    <span>{tagType !== 'none' ? 'Tag Attached' : '+ Add Price/Rumor Tag'}</span>
                  </button>

                  <span className="text-[11px] text-emerald-800 font-bold ml-auto hidden sm:inline">
                    +5 SABI PTS per post
                  </span>
                </div>

                {/* Input & Send Button */}
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={`Message the community as ${user.name} (${user.lga}, ${user.state})...`}
                    className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-2xl px-4 py-3 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:bg-white focus:outline-none"
                  />

                  <button
                    type="submit"
                    disabled={!messageInput.trim()}
                    className="bg-[#0A3D2E] hover:bg-[#0d4a38] text-white p-3 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all active:scale-95 disabled:opacity-40 shadow-md flex items-center justify-center gap-1.5 shrink-0 font-display"
                  >
                    <Send className="w-4 h-4 text-[#FFD60A]" />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </form>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
