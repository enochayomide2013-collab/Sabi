import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck, 
  ShoppingBasket, 
  MessageSquare, 
  ArrowRight, 
  RefreshCw, 
  Zap, 
  History, 
  Plus, 
  Trash2, 
  Clock, 
  ChevronRight,
  Check
} from 'lucide-react';
import { SaboAiMessage, SaboAiSession } from '../../types';
import { SaboAiService } from '../../services/saboAiService';
import { storageService } from '../../services/storageService';

interface SaboAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, extraData?: any) => void;
}

const INITIAL_MESSAGES: SaboAiMessage[] = [
  {
    id: 'sabo_init',
    sender: 'sabo',
    text: `**Hello! I am Sabo AI, your intelligent truth & market assistant for SABI Nigeria.**\n\nI can answer questions about:\n- 💡 **How SABI works & earning Stat Points**\n- 🍅 **Current Nigerian food and commodity prices** (Rice, Tomatoes, Palm Oil, Garri)\n- 🔍 **Fact-checking viral rumors & WhatsApp broadcasts**\n- 💬 **The Sabiers community group chat & verifiers**\n\nHow can I help you today?`,
    timestamp: 'Just now',
    suggestedActions: [
      { label: 'How do I earn Stat Points?', query: 'How do I earn stat points?' },
      { label: 'What are current food prices in Nigeria?', query: 'What are current food prices in Nigeria?' },
      { label: 'Tell me about The Sabiers chat', query: 'Tell me about The Sabiers group chat' },
      { label: 'What is the truth about fuel prices?', query: 'What is the truth about fuel prices in Nigeria?' }
    ],
    sources: ['SABI Intelligence Core', 'Community Verifier Consensus']
  }
];

export const SaboAiModal: React.FC<SaboAiModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [sessions, setSessions] = useState<SaboAiSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [messages, setMessages] = useState<SaboAiMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize or restore saved sessions
  useEffect(() => {
    if (isOpen) {
      const savedSessions = storageService.getSaboSessions();
      setSessions(savedSessions);

      const activeId = storageService.getActiveSaboSessionId();
      const matchedSession = savedSessions.find(s => s.id === activeId);

      if (matchedSession) {
        setCurrentSessionId(matchedSession.id);
        setMessages(matchedSession.messages && matchedSession.messages.length > 0 ? matchedSession.messages : INITIAL_MESSAGES);
      } else if (savedSessions.length > 0) {
        // Fallback to the latest saved session
        const latest = savedSessions[0];
        setCurrentSessionId(latest.id);
        setMessages(latest.messages && latest.messages.length > 0 ? latest.messages : INITIAL_MESSAGES);
        storageService.setActiveSaboSessionId(latest.id);
      } else {
        // Create initial session
        const newSessionId = `sabo_session_${Date.now()}`;
        const newSession: SaboAiSession = {
          id: newSessionId,
          title: 'General Insights',
          messages: INITIAL_MESSAGES,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          snippet: 'Sabo AI welcome & guide'
        };
        storageService.saveSaboSession(newSession);
        setSessions([newSession]);
        setCurrentSessionId(newSessionId);
        setMessages(INITIAL_MESSAGES);
      }

      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, [isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const getSessionTitleFromQuery = (query: string) => {
    const clean = query.trim();
    if (!clean) return 'Investigation';
    return clean.length > 38 ? clean.slice(0, 38) + '...' : clean;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: SaboAiMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    // Determine session title
    let currentSession = sessions.find(s => s.id === currentSessionId);
    let sessionTitle = currentSession?.title || 'Investigation';
    if (!currentSession || currentSession.title === 'General Insights' || currentSession.title === 'New Investigation') {
      sessionTitle = getSessionTitleFromQuery(query);
    }

    // Save active state with user message
    const updatedSession: SaboAiSession = {
      id: currentSessionId || `sabo_session_${Date.now()}`,
      title: sessionTitle,
      messages: updatedMessages,
      createdAt: currentSession?.createdAt || Date.now(),
      updatedAt: Date.now(),
      snippet: query.slice(0, 60)
    };

    storageService.saveSaboSession(updatedSession);
    setSessions(storageService.getSaboSessions());

    try {
      const saboResponse = await SaboAiService.askSabo(query);
      const withBotMsg = [...updatedMessages, saboResponse];
      setMessages(withBotMsg);

      const finalSession: SaboAiSession = {
        ...updatedSession,
        messages: withBotMsg,
        updatedAt: Date.now()
      };
      storageService.saveSaboSession(finalSession);
      setSessions(storageService.getSaboSessions());
    } catch {
      const errorMsg: SaboAiMessage = {
        id: `sabo_err_${Date.now()}`,
        sender: 'sabo',
        text: "I'm having trouble processing that right now. Please ask again or check our verified Truth Feed.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [{ label: 'View Truth Feed', tab: 'truth' }]
      };
      const withErrorMsg = [...updatedMessages, errorMsg];
      setMessages(withErrorMsg);

      const errorSession: SaboAiSession = {
        ...updatedSession,
        messages: withErrorMsg,
        updatedAt: Date.now()
      };
      storageService.saveSaboSession(errorSession);
      setSessions(storageService.getSaboSessions());
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewSession = () => {
    // Check if the current session is already empty or just initial
    if (messages.length <= 1) {
      setShowHistoryPanel(false);
      return;
    }

    const newSessionId = `sabo_session_${Date.now()}`;
    const newSession: SaboAiSession = {
      id: newSessionId,
      title: 'New Investigation',
      messages: INITIAL_MESSAGES,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      snippet: 'Fresh fact-checking session'
    };

    storageService.saveSaboSession(newSession);
    const updated = storageService.getSaboSessions();
    setSessions(updated);
    setCurrentSessionId(newSessionId);
    setMessages(INITIAL_MESSAGES);
    setShowHistoryPanel(false);
  };

  const handleSelectSession = (session: SaboAiSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages && session.messages.length > 0 ? session.messages : INITIAL_MESSAGES);
    storageService.setActiveSaboSessionId(session.id);
    setShowHistoryPanel(false);
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    storageService.deleteSaboSession(sessionId);
    const remaining = storageService.getSaboSessions();
    setSessions(remaining);

    if (sessionId === currentSessionId) {
      if (remaining.length > 0) {
        handleSelectSession(remaining[0]);
      } else {
        const freshId = `sabo_session_${Date.now()}`;
        const fresh: SaboAiSession = {
          id: freshId,
          title: 'General Insights',
          messages: INITIAL_MESSAGES,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          snippet: 'Sabo AI welcome & guide'
        };
        storageService.saveSaboSession(fresh);
        setSessions([fresh]);
        setCurrentSessionId(freshId);
        setMessages(INITIAL_MESSAGES);
      }
    }
  };

  const handleClearAllHistory = () => {
    if (window.confirm('Are you sure you want to clear all saved Sabo AI conversation sessions?')) {
      storageService.clearAllSaboSessions();
      const freshId = `sabo_session_${Date.now()}`;
      const fresh: SaboAiSession = {
        id: freshId,
        title: 'General Insights',
        messages: INITIAL_MESSAGES,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      storageService.saveSaboSession(fresh);
      setSessions([fresh]);
      setCurrentSessionId(freshId);
      setMessages(INITIAL_MESSAGES);
      setShowHistoryPanel(false);
    }
  };

  const handleActionClick = (action: { label: string; tab?: string; query?: string }) => {
    if (action.tab) {
      onClose();
      onNavigate(action.tab);
    } else if (action.query) {
      handleSendMessage(action.query);
    }
  };

  const formatSessionTime = (timestamp: number) => {
    if (!timestamp) return 'Recent';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const activeSessionObj = sessions.find(s => s.id === currentSessionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in" id="sabo-ai-modal">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[92vh] sm:h-[84vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200 animate-scale-up relative">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#0A3D2E] via-[#0d4a38] to-[#072b20] text-white p-3.5 sm:p-4.5 flex items-center justify-between shadow-md shrink-0 border-b border-emerald-800">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center font-extrabold shadow-sm border border-white/20 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#0A3D2E]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-display tracking-tight text-white truncate">
                  Sabo AI
                </h2>
                <span className="bg-[#FFD60A] text-[#0A3D2E] text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                  ASSISTANT
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-100/90 font-medium truncate">
                {activeSessionObj ? activeSessionObj.title : 'Truth Fact-Checker & Food Prices Guide'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* New Chat Button */}
            <button
              onClick={handleCreateNewSession}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition-colors flex items-center gap-1 text-xs font-bold"
              title="Start New Conversation"
            >
              <Plus className="w-4 h-4 text-[#FFD60A]" />
              <span className="hidden sm:inline">New Chat</span>
            </button>

            {/* Session History Toggle Button */}
            <button
              onClick={() => setShowHistoryPanel(!showHistoryPanel)}
              className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                showHistoryPanel
                  ? 'bg-[#FFD60A] text-[#0A3D2E] border-[#FFD60A]'
                  : 'bg-white/10 hover:bg-white/20 text-emerald-100 border-white/15'
              }`}
              title="Recent Conversations (Last 3-5 Sessions)"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">
                History ({sessions.length})
              </span>
            </button>

            {/* Close Modal Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors ml-0.5"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Saved Sessions Drawer / Panel (Persisting 3-5 sessions) */}
        {showHistoryPanel && (
          <div className="bg-emerald-950 text-white p-3 sm:p-4 border-b border-emerald-800 animate-slide-down shrink-0 shadow-inner">
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-emerald-800/80">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#FFD60A]" />
                <span className="text-xs font-black uppercase tracking-wider text-emerald-200">
                  Recent Saved Sessions ({sessions.length}/5)
                </span>
              </div>
              <div className="flex items-center gap-2">
                {sessions.length > 0 && (
                  <button
                    onClick={handleClearAllHistory}
                    className="text-[10px] font-bold text-red-300 hover:text-red-200 transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowHistoryPanel(false)}
                  className="text-[10px] bg-emerald-900 hover:bg-emerald-800 px-2 py-0.5 rounded-lg text-emerald-200"
                >
                  Close Panel
                </button>
              </div>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {sessions.length === 0 ? (
                <p className="text-xs text-gray-400 py-2 text-center">No saved conversation history yet.</p>
              ) : (
                sessions.map((sess) => {
                  const isActive = sess.id === currentSessionId;
                  const messageCount = sess.messages ? sess.messages.length : 0;

                  return (
                    <div
                      key={sess.id}
                      onClick={() => handleSelectSession(sess)}
                      className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all ${
                        isActive
                          ? 'bg-emerald-800/90 border border-[#FFD60A]/60 shadow-xs'
                          : 'bg-emerald-900/50 hover:bg-emerald-900 border border-emerald-800/50 text-emerald-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#FFD60A]' : 'text-emerald-400'}`} />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate max-w-[240px] sm:max-w-[340px]">
                            {sess.title}
                          </p>
                          <p className="text-[10px] text-emerald-300/80 flex items-center gap-1.5">
                            <span>{formatSessionTime(sess.updatedAt)}</span>
                            <span>•</span>
                            <span>{messageCount} {messageCount === 1 ? 'msg' : 'msgs'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {isActive && (
                          <span className="text-[9px] font-black bg-[#FFD60A] text-[#0A3D2E] px-1.5 py-0.5 rounded-md uppercase">
                            Active
                          </span>
                        )}
                        <button
                          onClick={(e) => handleDeleteSession(e, sess.id)}
                          className="p-1 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-300 transition-colors"
                          title="Delete Session"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FDFBF7]" id="sabo-ai-chat-feed">
          
          {/* Active Session Info Pill */}
          <div className="flex items-center justify-between bg-emerald-50/80 border border-emerald-200/80 px-3 py-1.5 rounded-xl text-[11px] text-emerald-900">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
              <span className="font-bold truncate">
                Session: {activeSessionObj?.title || 'Current Investigation'}
              </span>
            </div>
            <button
              onClick={() => setShowHistoryPanel(true)}
              className="text-emerald-700 font-bold hover:underline shrink-0 ml-2 flex items-center gap-0.5"
            >
              <span>Past Sessions</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#0A3D2E] text-[#FFD60A] flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] space-y-2`}>
                  
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-[#0A3D2E] text-white rounded-tr-none shadow-sm'
                        : 'bg-white text-gray-900 border border-gray-200/90 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {/* Render message with line breaks and formatting */}
                    <div className="whitespace-pre-line space-y-1">
                      {msg.text.split('\n\n').map((paragraph, idx) => (
                        <p key={idx} className="leading-relaxed">
                          {paragraph.split('**').map((chunk, cIdx) => 
                            cIdx % 2 === 1 ? <strong key={cIdx} className={isUser ? 'text-[#FFD60A] font-bold' : 'text-[#0A3D2E] font-bold'}>{chunk}</strong> : chunk
                          )}
                        </p>
                      ))}
                    </div>

                    {/* Sources Badge */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="pt-2.5 mt-2 border-t border-gray-100 flex flex-wrap items-center gap-1.5 text-[10px] text-gray-500">
                        <span className="font-bold text-gray-700">Verified Sources:</span>
                        {msg.sources.map((s, sIdx) => (
                          <span key={sIdx} className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-medium border border-emerald-200/60">
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Interactive Action Chips */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestedActions.map((action, aIdx) => (
                        <button
                          key={aIdx}
                          onClick={() => handleActionClick(action)}
                          className="bg-white hover:bg-emerald-50 active:scale-95 text-[#0A3D2E] text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs transition-all flex items-center gap-1.5"
                        >
                          <Zap className="w-3 h-3 text-[#0A3D2E]" />
                          <span>{action.label}</span>
                          <ArrowRight className="w-3 h-3 text-gray-400" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className={`text-[10px] block px-1 ${isUser ? 'text-right text-gray-400' : 'text-gray-400'}`}>
                    {msg.timestamp}
                  </span>

                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-[#0A3D2E] text-[#FFD60A] flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-tl-none text-xs text-gray-500 font-medium flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-[#0A3D2E] animate-ping" />
                <span>Sabo AI is researching verified community facts...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-gray-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask Sabo AI about food prices, rumors, or stat points..."
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-2xl px-4 py-3 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:bg-white focus:outline-none transition-all placeholder:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="bg-[#0A3D2E] hover:bg-[#0d4a38] active:scale-95 disabled:opacity-40 text-white p-3 sm:px-5 sm:py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-md shrink-0 font-display"
            >
              <Send className="w-4 h-4 text-[#FFD60A]" />
              <span className="hidden sm:inline">Ask Sabo</span>
            </button>
          </form>

          <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-gray-400">
            <span className="truncate">Auto-saving verification sessions (up to 5) in localStorage</span>
            <span className="font-semibold text-emerald-800 shrink-0 ml-2">100% Verified</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SaboAiModal;
