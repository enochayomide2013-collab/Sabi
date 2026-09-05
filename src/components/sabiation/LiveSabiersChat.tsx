import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Users, MapPin, Sparkles } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { 
  sendChatMessageToFirestore, 
  subscribeToChatMessages, 
  subscribeToPresenceList, 
  updatePresenceInFirestore 
} from '../../services/firestoreService';
import { SabiersChatMessage, UserProfile } from '../../types';

export const LiveSabiersChat: React.FC = () => {
    const [messages, setMessages] = useState<SabiersChatMessage[]>(() => {
        return storageService.getSabiersMessages();
    });
    const [input, setInput] = useState('');
    const [onlineCount, setOnlineCount] = useState<number>(storageService.getOnlineUsersCount());
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const user = storageService.getUser();
        
        // Sync local storage state
        const syncLocal = () => {
            setMessages(storageService.getSabiersMessages());
            setOnlineCount(storageService.getOnlineUsersCount());
        };

        const unsubscribeLocal = storageService.subscribe(syncLocal);

        // Real-time Firestore chat sync for cross-user live messages
        const unsubscribeChat = subscribeToChatMessages((firestoreMsgs) => {
            if (firestoreMsgs && firestoreMsgs.length > 0) {
                storageService.syncSabiersMessages(firestoreMsgs);
                setMessages(firestoreMsgs);
            }
        });

        // Presence listener
        const unsubscribePresence = subscribeToPresenceList((list) => {
            if (list && list.length > 0) {
                const liveCount = list.filter(s => s.isOnline).length;
                setOnlineCount(Math.max(liveCount, 1));
            }
        });

        // Online count polling fallback
        const fetchOnline = async () => {
            try {
                const response = await fetch(`/api/online-users?userId=${encodeURIComponent(user.id)}&name=${encodeURIComponent(user.name)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.count) setOnlineCount(data.count);
                }
            } catch {
                // Silently tolerate
            }
        };

        fetchOnline();
        const interval = setInterval(fetchOnline, 15000);

        return () => {
            unsubscribeLocal();
            if (unsubscribeChat) unsubscribeChat();
            if (unsubscribePresence) unsubscribePresence();
            clearInterval(interval);
        };
    }, []);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const text = input.trim();
        const currentUser = storageService.getUser();

        // 1. Send to local storage
        const newLocalMsg = storageService.addSabiersMessage({
            message: text,
            channel: 'general'
        });

        setMessages(prev => [newLocalMsg, ...prev.filter(m => m.id !== newLocalMsg.id)]);

        // 2. Publish to Firestore real-time collection so all other live & offline users see it
        sendChatMessageToFirestore({
            senderId: currentUser.id,
            senderName: currentUser.name,
            senderAvatar: currentUser.avatarUrl,
            senderTrustLevel: currentUser.trustLevel,
            senderRole: currentUser.role,
            senderTier: currentUser.userTier,
            state: currentUser.state || 'Lagos',
            lga: currentUser.lga || 'Ikeja',
            channel: 'general',
            message: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            reactions: []
        });

        updatePresenceInFirestore(currentUser.id, currentUser.name, {
            ...currentUser,
            currentActivity: `Chatting: "${text.slice(0, 30)}..."`
        } as Partial<UserProfile>);

        setInput('');
    };

    return (
        <div className="p-5 sm:p-6 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4" id="live-sabiers-chat-widget">
            <div className="flex items-center justify-between font-display">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#0A3D2E] text-[#FFD60A] flex items-center justify-center font-bold">
                        <MessageSquare className="w-4 h-4"/> 
                    </div>
                    <div>
                        <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
                            Live Sabiers Network Chat
                        </h3>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Real-time spotter chat visible to all online & community members
                        </p>
                    </div>
                </div>

                <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <Users className="w-3.5 h-3.5"/> 
                    <span>{onlineCount} Active Spotters</span>
                </span>
            </div>

            <div className="h-72 overflow-y-auto bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-2.5 border border-gray-100 dark:border-gray-800 flex flex-col-reverse">
                <div ref={chatEndRef} />
                {messages.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-8">
                        No messages yet. Be the first to start the conversation!
                    </p>
                ) : (
                    messages.map((m) => (
                        <div key={m.id} className="text-xs bg-white dark:bg-gray-800 p-3 rounded-2xl border border-gray-100 dark:border-gray-700/60 shadow-2xs font-medium text-gray-800 dark:text-gray-200 space-y-1">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <img 
                                        src={m.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'} 
                                        alt={m.senderName} 
                                        className="w-5 h-5 rounded-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                    <span className="font-bold text-gray-900 dark:text-white">{m.senderName}</span>
                                    {m.senderTrustLevel === 'Trusted Contributor' && (
                                        <span className="text-[9px] font-black bg-[#FFD60A] text-[#0A3D2E] px-1.5 py-0.2 rounded-md">
                                            TRUSTED
                                        </span>
                                    )}
                                </div>
                                <span className="text-[10px] text-gray-400">{m.timestamp}</span>
                            </div>
                            <p className="text-xs text-gray-700 dark:text-gray-300 pl-7 leading-relaxed">
                                {m.message}
                            </p>
                            <div className="pl-7 flex items-center gap-2 text-[10px] text-gray-400">
                                <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{m.state}</span>
                                {m.channel && <span className="font-mono text-emerald-600 dark:text-emerald-400">#{m.channel}</span>}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSend} className="flex gap-2">
                <input 
                    type="text"
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-xs font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0A3D2E]" 
                    placeholder="Type a message to all live Sabiers..." 
                />
                <button 
                    type="submit" 
                    className="bg-[#0A3D2E] hover:bg-[#0c4a37] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                >
                    <Send className="w-4 h-4 text-[#FFD60A]"/>
                    <span>Send</span>
                </button>
            </form>
        </div>
    );
};


