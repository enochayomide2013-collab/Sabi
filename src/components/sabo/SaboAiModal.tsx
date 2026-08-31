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
  Info
} from 'lucide-react';
import { SaboAiMessage } from '../../types';
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
  const [messages, setMessages] = useState<SaboAiMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: SaboAiMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const saboResponse = await SaboAiService.askSabo(query);
      setMessages(prev => [...prev, saboResponse]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `sabo_err_${Date.now()}`,
          sender: 'sabo',
          text: "I'm having trouble processing that right now. Please ask again or check our verified Truth Feed.",
          timestamp: 'Just now',
          suggestedActions: [{ label: 'View Truth Feed', tab: 'truth' }]
        }
      ]);
    } finally {
      setIsLoading(false);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in" id="sabo-ai-modal">
      <div className="bg-white rounded-3xl max-w-2xl w-full h-[90vh] sm:h-[82vh] flex flex-col overflow-hidden shadow-2xl border border-gray-200 animate-scale-up">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#0A3D2E] via-[#0d4a38] to-[#072b20] text-white p-4 sm:p-5 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center font-extrabold shadow-sm border border-white/20">
              <Sparkles className="w-5 h-5 text-[#0A3D2E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black font-display tracking-tight text-white">
                  Sabo AI
                </h2>
                <span className="bg-[#FFD60A] text-[#0A3D2E] text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  SABI Helper
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 font-medium">
                Truth Fact-Checker, Food Prices & Community Guide
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages(INITIAL_MESSAGES)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition-colors"
              title="Reset Conversation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FDFBF7]" id="sabo-ai-chat-feed">
          
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
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
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
            <span>Powered by SABI Community Intelligence & Forensics</span>
            <span className="font-semibold text-emerald-800">100% Free & Verified</span>
          </div>
        </div>

      </div>
    </div>
  );
};
