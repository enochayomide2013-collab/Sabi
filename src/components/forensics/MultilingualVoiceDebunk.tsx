import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  Play, 
  Pause, 
  Languages, 
  Download, 
  Share2, 
  MessageCircle, 
  Sparkles, 
  Copy, 
  Check, 
  Radio, 
  FileAudio, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Mic, 
  Send
} from 'lucide-react';

export type LocalLanguage = 'pidgin' | 'yoruba' | 'hausa' | 'igbo' | 'english';

interface DebunkScript {
  language: LocalLanguage;
  displayName: string;
  nativeTitle: string;
  greeting: string;
  scriptText: string;
  audioDurationSeconds: number;
  voiceGender: 'male' | 'female';
}

const DEBUNK_TEMPLATES: Record<string, Record<LocalLanguage, DebunkScript>> = {
  fuel_price: {
    pidgin: {
      language: 'pidgin',
      displayName: 'Nigerian Pidgin',
      nativeTitle: 'Naija Pidgin Voice Note',
      greeting: 'Abeg make una listen well well!',
      scriptText: 'Wetin dey trend for WhatsApp say fuel price don jump go ₦1,800 na fake news o! NNPCL and IPMAN don confirm say fuel dey充足 and price remain normal. Make una no forward dat fake voice note again. Share dis truth give your people!',
      audioDurationSeconds: 16,
      voiceGender: 'male'
    },
    yoruba: {
      language: 'yoruba',
      displayName: 'Yoruba',
      nativeTitle: 'Gbo Ohun Otito Yi',
      greeting: 'E kaasan o gbogbo eniyan,',
      scriptText: 'Iro patapata ni iroyin ti o n lo lori WhatsApp pe owo epo ti di ₦1,800. Awon Ile-ise NNPCL ati IPMAN ti fidi re mule pe epo po to fun lilo ati pe ko si ifikun owo kankan. E jowo e ma sifi iroyin eke yi ranse si egbegbe yin.',
      audioDurationSeconds: 19,
      voiceGender: 'female'
    },
    hausa: {
      language: 'hausa',
      displayName: 'Hausa',
      nativeTitle: 'Muryar Gaskiya da Hausa',
      greeting: 'Sannunku yan uwa,',
      scriptText: 'Wannan jita-jitar da ke yawo a WhatsApp cewa farashin fetur ya koma ₦1,800 karya ne kwata-kwata! Hukumar NNPCL da IPMAN sun tabbatar da cewa akwai fetur wadatacce kuma babu karin farashi. Kada ku tura wannan labaran kanzon kurege.',
      audioDurationSeconds: 18,
      voiceGender: 'male'
    },
    igbo: {
      language: 'igbo',
      displayName: 'Igbo',
      nativeTitle: 'Ozi Eziokwu na Asusu Igbo',
      greeting: 'Keduni ndi Nne na Nna,',
      scriptText: 'Ozi ahu na-agba na WhatsApp na mmanụ pụtrọl abụrụla ₦1,800 bụ okwu asị kpamkpam! NNPCL na IPMAN emeliela ka amara na mmanụ dị nke ọma na verị price adịghị elu. Biko e zigakwala ozi asị ahụ na WhatsApp otu gị.',
      audioDurationSeconds: 17,
      voiceGender: 'female'
    },
    english: {
      language: 'english',
      displayName: 'Official Nigerian English',
      nativeTitle: 'Official Clarification Bulletin',
      greeting: 'Important Fact-Check Clarification:',
      scriptText: 'The viral WhatsApp voice memo claiming petrol prices have reached ₦1,800 per liter is entirely FALSE. Official statements from NNPCL and IPMAN confirm adequate supply and stable market pricing. Please double-check facts before sharing.',
      audioDurationSeconds: 15,
      voiceGender: 'female'
    }
  }
};

interface MultilingualVoiceDebunkProps {
  claimTitle?: string;
  claimId?: string;
  onShowToast?: (points: number, message: string) => void;
  className?: string;
}

export const MultilingualVoiceDebunk: React.FC<MultilingualVoiceDebunkProps> = ({
  claimTitle = 'Viral Voice Memo Claims Fuel Price Spike to ₦1,800/L',
  claimId = 'fuel_price',
  onShowToast,
  className = ''
}) => {
  const [selectedLang, setSelectedLang] = useState<LocalLanguage>('pidgin');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [customizedScriptText, setCustomizedScriptText] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const currentTemplateSet = DEBUNK_TEMPLATES[claimId] || DEBUNK_TEMPLATES.fuel_price;
  const currentScript = currentTemplateSet[selectedLang];

  useEffect(() => {
    setCustomizedScriptText(currentScript.scriptText);
    setIsPlaying(false);
    setPlaybackProgress(0);
  }, [selectedLang, claimId]);

  // Speech Synthesis & Audio Simulation
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      // Check if browser Web Speech API is supported
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(customizedScriptText);
        utterance.rate = 0.95;
        utterance.pitch = selectedLang === 'pidgin' ? 1.05 : 1.0;
        
        // Match lang if available
        if (selectedLang === 'yoruba') utterance.lang = 'yo-NG';
        else if (selectedLang === 'hausa') utterance.lang = 'ha-NG';
        else if (selectedLang === 'igbo') utterance.lang = 'ig-NG';
        else utterance.lang = 'en-NG';

        utterance.onend = () => {
          setIsPlaying(false);
          setPlaybackProgress(100);
        };

        window.speechSynthesis.speak(utterance);
      }

      timer = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 3;
        });
      }, (currentScript.audioDurationSeconds * 1000) / 33);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (timer) clearInterval(timer);
    }

    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, customizedScriptText, selectedLang, currentScript]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCopyTranscript = async () => {
    try {
      await navigator.clipboard.writeText(`[${currentScript.displayName} Debunk Audio Transcript]:\n"${customizedScriptText}"\n\nVerified via SABI Fact Check`);
      setIsCopied(true);
      onShowToast?.(5, 'Local language transcript copied!');
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareWhatsAppVoice = () => {
    const text = `🎙️ *SABI MULTILINGUAL DEBUNK MEMO (${currentScript.displayName.toUpperCase()})*\n\n"${customizedScriptText}"\n\n🔗 *Verify Truth:* ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onShowToast?.(5, 'Opening WhatsApp to send Voice Clarification!');
  };

  const handleDownloadSimulatedAudio = () => {
    const blob = new Blob([`SABI MULTILINGUAL VOICE NOTE\nLanguage: ${currentScript.displayName}\nScript:\n${customizedScriptText}`], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SABI_Voice_Debunk_${selectedLang}_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast?.(5, 'Downloaded voice note transcript file!');
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl p-6 text-white border border-gray-800 shadow-2xl space-y-5 ${className}`} id="multilingual-voice-debunk">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0A3D2E] text-[#FFD60A] border border-[#FFD60A]/30 flex items-center justify-center shrink-0 shadow-md">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black font-display text-white tracking-wide">
                Multilingual Voice Note Debunk Generator
              </h3>
              <span className="bg-[#FFD60A] text-[#0A3D2E] text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full">
                LOCAL DIALECTS
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Generate audio voice memos in Pidgin, Yoruba, Hausa, Igbo, or English to forward directly into WhatsApp groups to debunk rumors.
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Audio Verified</span>
          </span>
        </div>
      </div>

      {/* Language Dialect Tabs */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block font-display">
          Select Target Community Language:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(['pidgin', 'yoruba', 'hausa', 'igbo', 'english'] as LocalLanguage[]).map((lang) => {
            const data = currentTemplateSet[lang];
            const isActive = selectedLang === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => setSelectedLang(lang)}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0A3D2E] text-[#FFD60A] border-[#FFD60A] shadow-md font-extrabold'
                    : 'bg-black/60 text-gray-300 border-gray-800 hover:border-gray-700 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{data.displayName}</div>
                <div className="text-[10px] opacity-70 font-mono truncate">{data.nativeTitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Audio Waveform & Speech Synthesizer Player */}
      <div className="bg-black/80 border border-gray-800 rounded-2xl p-5 space-y-4">
        
        <div className="flex items-center justify-between text-xs font-mono text-gray-300">
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${isPlaying ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`} />
            <span className="text-[#FFD60A] font-bold uppercase">{currentScript.nativeTitle}</span>
          </div>
          <span className="text-gray-400">
            {Math.floor((playbackProgress / 100) * currentScript.audioDurationSeconds)}s / {currentScript.audioDurationSeconds}s
          </span>
        </div>

        {/* Animated Audio Equalizer Bar */}
        <div className="h-16 flex items-center justify-between gap-1 px-1 bg-gray-950 rounded-xl p-2 border border-gray-800 relative overflow-hidden">
          {Array.from({ length: 32 }).map((_, i) => {
            const height = Math.abs(Math.sin(i * 0.4 + (isPlaying ? playbackProgress * 0.2 : 0))) * 80 + 20;
            const isPassed = (i / 32) * 100 <= playbackProgress;
            return (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all duration-150 ${
                  isPassed ? 'bg-[#FFD60A]' : 'bg-gray-800'
                }`}
                style={{ height: `${height}%` }}
              />
            );
          })}
        </div>

        {/* Playback Controls & Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="w-12 h-12 rounded-2xl bg-[#0A3D2E] hover:bg-[#0c4b38] text-[#FFD60A] border border-[#FFD60A]/40 flex items-center justify-center transition-all cursor-pointer shadow-md"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>

            <div>
              <span className="text-xs font-bold text-white block">
                {isPlaying ? 'Synthesizing Local Speech...' : 'Listen to Voice Memo'}
              </span>
              <span className="text-[11px] text-gray-400 font-mono">
                Dialect: {currentScript.displayName} ({currentScript.voiceGender})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleShareWhatsAppVoice}
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Forward to WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopyTranscript}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-gray-700"
              title="Copy Script Transcript"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleDownloadSimulatedAudio}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-gray-700"
              title="Download Audio Transcript File"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* Script Transcript Box */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span className="font-mono font-bold text-gray-300 uppercase">Spoken Voice Script ({currentScript.displayName}):</span>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="text-[#FFD60A] hover:underline font-bold"
          >
            {isEditing ? 'Save Script' : 'Customize Text'}
          </button>
        </div>

        {isEditing ? (
          <textarea
            value={customizedScriptText}
            onChange={(e) => setCustomizedScriptText(e.target.value)}
            rows={3}
            className="w-full bg-black/90 border border-gray-700 rounded-2xl p-3 text-xs text-white font-sans focus:outline-hidden focus:border-[#FFD60A]"
          />
        ) : (
          <p className="bg-gray-950 border border-gray-800 rounded-2xl p-3.5 text-xs text-gray-200 font-sans italic leading-relaxed">
            "{customizedScriptText}"
          </p>
        )}
      </div>

    </div>
  );
};
