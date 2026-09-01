import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Users } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { sendChatMessageToFirestore, updatePresenceInFirestore } from '../../services/firestoreService';

export const LiveSabiersChat: React.FC = () => {
    const [messages, setMessages] = useState<string[]>(() => {
        return storageService.getSabiersMessages().map(m => `${m.senderName}: ${m.message}`);
    });
    const [input, setInput] = useState('');
    const [onlineCount, setOnlineCount] = useState(storageService.getOnlineUsersCount());

    useEffect(() => {
        const user = storageService.getUser();
        
        const syncChatAndCount = () => {
            const currentMsgs = storageService.getSabiersMessages();
            setMessages(currentMsgs.map(m => `${m.senderName}: ${m.message}`));
            setOnlineCount(storageService.getOnlineUsersCount());
        };

        syncChatAndCount();
        const unsubscribe = storageService.subscribe(syncChatAndCount);

        const fetchOnline = async () => {
            try {
                const response = await fetch(`/api/online-users?userId=${encodeURIComponent(user.id)}&name=${encodeURIComponent(user.name)}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.count) setOnlineCount(data.count);
                }
            } catch (e) {
                console.error('Failed to fetch online users', e);
            }
        };

        fetchOnline();
        const interval = setInterval(fetchOnline, 10000);

        return () => {
            unsubscribe();
            clearInterval(interval);
        };
    }, []);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const text = input.trim();
        const currentUser = storageService.getUser();

        // Send to storage and firestore
        storageService.addSabiersMessage({
            message: text,
            channel: 'general'
        });

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

        updatePresenceInFirestore(currentUser.id, currentUser.name, currentUser);

        setInput('');
    };

    return (
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-4" id="live-sabiers-chat-widget">
            <h3 className="font-bold text-lg flex items-center justify-between font-display text-gray-900">
                <span className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#0A3D2E]"/> 
                    <span>Live Sabiers Network Chat</span>
                </span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full flex items-center gap-1.5 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <Users className="w-3.5 h-3.5"/> 
                    <span>{onlineCount} Active Spotters</span>
                </span>
            </h3>

            <div className="h-64 overflow-y-auto bg-gray-50 rounded-2xl p-4 space-y-2 border border-gray-200">
                {messages.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-8">No messages yet. Be the first to start the conversation!</p>
                ) : (
                    messages.map((m, i) => (
                        <div key={i} className="text-xs bg-white p-3 rounded-xl border border-gray-100 shadow-2xs font-medium text-gray-800">
                            {m}
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={handleSend} className="flex gap-2">
                <input 
                    type="text"
                    value={input} 
                    onChange={e => setInput(e.target.value)} 
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#0A3D2E]" 
                    placeholder="Type a message to all live Sabiers..." 
                />
                <button 
                    type="submit" 
                    className="bg-[#0A3D2E] hover:bg-[#0c4a37] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                    <Send className="w-4 h-4 text-[#FFD60A]"/>
                    <span>Send</span>
                </button>
            </form>
        </div>
    );
};

