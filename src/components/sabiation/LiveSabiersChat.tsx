import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, Send, Users } from 'lucide-react';
import { storageService } from '../../services/storageService';

export const LiveSabiersChat: React.FC = () => {
    const [isOnline, setIsOnline] = useState<boolean | null>(null);
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [onlineCount, setOnlineCount] = useState(0);

    useEffect(() => {
        if (isOnline) {
            const user = storageService.getUser();
            const fetchOnline = async () => {
                try {
                    const response = await fetch(`/api/online-users?userId=${user.id}`);
                    const data = await response.json();
                    setOnlineCount(data.count);
                } catch (e) {
                    console.error('Failed to fetch online users', e);
                }
            };
            fetchOnline();
            const interval = setInterval(fetchOnline, 5000);
            return () => clearInterval(interval);
        }
    }, [isOnline]);

    if (isOnline === null) {
        return (
            <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm text-center space-y-4">
                <h3 className="font-bold text-lg">Are you online right now?</h3>
                <div className="flex justify-center gap-3">
                    <button onClick={() => setIsOnline(true)} className="bg-emerald-600 text-white px-6 py-2 rounded-full font-bold">Yes</button>
                    <button onClick={() => setIsOnline(false)} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full font-bold">No</button>
                </div>
            </div>
        );
    }

    if (!isOnline) return <div className="p-6 bg-gray-100 rounded-3xl text-center">You are currently offline.</div>;

    return (
        <div className="p-6 bg-white rounded-3xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-lg flex items-center justify-between">
                <span className="flex items-center gap-2"><MessageSquare className="w-5 h-5 text-emerald-600"/> Live Chat</span>
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full flex items-center gap-1">
                    <Users className="w-3 h-3"/> {onlineCount} Active
                </span>
            </h3>
            <div className="h-64 overflow-y-auto bg-gray-50 rounded-xl p-4 space-y-2">
                {messages.map((m, i) => <p key={i} className="text-sm bg-white p-2 rounded-lg">{m}</p>)}
            </div>
            <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 border rounded-lg p-2" placeholder="Chat with Sabiers..." />
                <button onClick={() => { setMessages([...messages, input]); setInput(''); }} className="bg-emerald-600 text-white p-2 rounded-lg"><Send className="w-5 h-5"/></button>
            </div>
        </div>
    );
};
