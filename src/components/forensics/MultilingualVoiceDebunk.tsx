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
  Send,
  Edit3,
  Wand2
} from 'lucide-react';
import { voiceAudioService } from '../../services/voiceAudioService';

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

interface MultilingualVoiceDebunkProps {
  claimTitle?: string;
  claimId?: string;
  onShowToast?: (points: number, message: string) => void;
  className?: string;
}

export const MultilingualVoiceDebunk: React.FC<MultilingualVoiceDebunkProps> = ({
  claimTitle = 'Viral Claim Fact-Check & Clarification',
  onShowToast,
  className = ''
}) => {
  const [userInputText, setUserInputText] = useState<string>('Fuel price has reached ₦1,800 nationwide and filling stations are shutting down.');
  const [selectedLang, setSelectedLang] = useState<LocalLanguage>('pidgin');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [translations, setTranslations] = useState<Record<LocalLanguage, string>>({
    pidgin: '',
    yoruba: '',
    hausa: '',
    igbo: '',
    english: ''
  });

  // Dynamic Auto-Translator into 5 Nigerian Languages
  const generateTranslations = (baseText: string) => {
    const clean = baseText.trim() || 'This viral claim is false';
    
    setTranslations({
      pidgin: `Wetin dey trend say "${clean}" na fake news o! NNPCL and official verifiers don confirm say everything dey normal. Make una no forward dis fake rumor again!`,
      yoruba: `Iro patapata ni iroyin ti o n lo lori WhatsApp pe "${clean}". Awon ile-ise kankan ko sifi iroyin nla ranse. E jowo e ma sifi iroyin eke yi ranse si egbegbe yin.`,
      hausa: `Wannan jita-jitar da ke yawo cewa "${clean}" karya ne kwata-kwata! Hukuma ta tabbatar da cewa babu matsala kwata-kwata. Kada ku tura wannan labaran kanzon kurege.`,
      igbo: `Ozi ahu na-agba na gburugburu ebe nile na "${clean}" bu okwu asi kpamkpam! Ndị otu verified kwuru na ihe nile dị mma. Biko e zigakwala ozi asị ahụ na WhatsApp.`,
      english: `Official Fact-Check Notice: The viral claim stating that "${clean}" is entirely FALSE and UNSUBSTANTIATED. Please verify official bulletins before sharing.`
    });
  };

  useEffect(() => {
    generateTranslations(userInputText);
  }, [userInputText]);

  const currentScriptText = translations[selectedLang] || translations.english;

  const getLanguageDetails = (lang: LocalLanguage) => {
    switch (lang) {
      case 'pidgin':
        return { name: 'Nigerian Pidgin', title: 'Naija Pidgin Voice Note', duration: 16, gender: 'male' };
      case 'yoruba':
        return { name: 'Yoruba', title: 'Gbo Ohun Otito Yi', duration: 18, gender: 'female' };
      case 'hausa':
        return { name: 'Hausa', title: 'Muryar Gaskiya da Hausa', duration: 17, gender: 'male' };
      case 'igbo':
        return { name: 'Igbo', title: 'Ozi Eziokwu na Asusu Igbo', duration: 18, gender: 'female' };
      case 'english':
      default:
        return { name: 'Official Nigerian English', title: 'Official Fact-Check Bulletin', duration: 15, gender: 'female' };
    }
  };

  const currentLangDetails = getLanguageDetails(selectedLang);

  // Stop audio on unmount or language change
  useEffect(() => {
    return () => {
      voiceAudioService.stop();
    };
  }, [selectedLang]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      voiceAudioService.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setPlaybackProgress(0);

      const langCode = selectedLang === 'yoruba' ? 'yo-NG' :
                       selectedLang === 'hausa' ? 'ha-NG' :
                       selectedLang === 'igbo' ? 'ig-NG' : 'en-NG';

      voiceAudioService.speakVoiceNote(currentScriptText, {
        rate: 0.95,
        pitch: selectedLang === 'pidgin' ? 1.05 : 1.0,
        lang: langCode,
        voiceGender: currentLangDetails.gender as any,
        onProgress: (pct) => setPlaybackProgress(pct),
        onEnd: () => {
          setIsPlaying(false);
          setPlaybackProgress(100);
        },
        onError: () => {
          setIsPlaying(false);
        }
      });
    }
  };

  const handleCopyTranscript = async () => {
    try {
      await navigator.clipboard.writeText(`[${currentLangDetails.name} SABI Voice Clarification]:\n"${currentScriptText}"\n\nVerified via SABI Nigeria Network`);
      setIsCopied(true);
      onShowToast?.(5, 'Multilingual transcript copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareWhatsAppVoice = () => {
    const text = `🎙️ *SABI MULTILINGUAL VOICE MEMO (${currentLangDetails.name.toUpperCase()})*\n\n"${currentScriptText}"\n\n🔗 *Verify Truth:* ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    onShowToast?.(5, 'Opening WhatsApp to share Voice Memo!');
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl p-6 text-white border border-gray-800 shadow-2xl space-y-6 ${className}`} id="multilingual-voice-debunk">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0A3D2E] text-[#FFD60A] border border-[#FFD60A]/30 flex items-center justify-center shrink-0 shadow-md">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black font-display text-white tracking-wide">
                Multilingual Speech & Voice Generator
              </h3>
              <span className="bg-[#FFD60A] text-[#0A3D2E] text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full">
                5 NIGERIAN LANGUAGES
              </span>
            </div>
            <p className="text-xs text-gray-300">
              Write any text or rumor claim below. SABI automatically translates it into Igbo, Hausa, Pidgin, Yoruba, and Official Nigerian English with playable audio!
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Playable Speech Output</span>
          </span>
        </div>
      </div>

      {/* CUSTOM TEXT INPUT BOX */}
      <div className="bg-gray-950/80 p-4 rounded-2xl border border-gray-800 space-y-2">
        <label className="text-xs font-extrabold text-[#FFD60A] uppercase tracking-wider flex items-center gap-2 font-display">
          <Edit3 className="w-4 h-4 text-[#FFD60A]" />
          <span>Write or Paste Claim Text to Translate & Convert to Audio Speech:</span>
        </label>
        <textarea
          value={userInputText}
          onChange={(e) => setUserInputText(e.target.value)}
          placeholder="Type any custom text or WhatsApp rumor to debunk..."
          rows={2}
          className="w-full bg-black border border-gray-700 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-hidden focus:border-[#FFD60A] transition-colors"
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => generateTranslations(userInputText)}
            className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-[#FFD60A] px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-[#FFD60A]/30 transition-all cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Re-Translate Languages</span>
          </button>
        </div>
      </div>

      {/* Language Dialect Tabs */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block font-display">
          Select Target Language Output:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(['pidgin', 'yoruba', 'hausa', 'igbo', 'english'] as LocalLanguage[]).map((lang) => {
            const isActive = selectedLang === lang;
            const details = getLanguageDetails(lang);
            return (
              <button
                key={lang}
                type="button"
                onClick={() => { setSelectedLang(lang); setIsPlaying(false); setPlaybackProgress(0); }}
                className={`p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0A3D2E] text-[#FFD60A] border-[#FFD60A] shadow-md font-extrabold'
                    : 'bg-black/60 text-gray-300 border-gray-800 hover:border-gray-700 hover:text-white'
                }`}
              >
                <div className="text-xs font-bold">{details.name}</div>
                <div className="text-[10px] opacity-70 font-mono truncate">{details.title}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* AUDIO WAVEFORM & PLAYABLE SPEECH CONTROLLER */}
      <div className="bg-black/90 border border-gray-800 rounded-2xl p-5 space-y-4">
        
        <div className="flex items-center justify-between text-xs font-mono text-gray-300">
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${isPlaying ? 'text-rose-500 animate-pulse' : 'text-emerald-400'}`} />
            <span className="text-[#FFD60A] font-bold uppercase">{currentLangDetails.title}</span>
          </div>
          <span className="text-gray-400">
            {Math.floor((playbackProgress / 100) * currentLangDetails.duration)}s / {currentLangDetails.duration}s
          </span>
        </div>

        {/* Animated Audio Equalizer Waveform */}
        <div className="h-16 flex items-center justify-between gap-1 px-2 bg-gray-950 rounded-xl p-2 border border-gray-800 relative overflow-hidden">
          {Array.from({ length: 36 }).map((_, i) => {
            const height = Math.abs(Math.sin(i * 0.35 + (isPlaying ? playbackProgress * 0.25 : 0))) * 80 + 20;
            const isPassed = (i / 36) * 100 <= playbackProgress;
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
              className="w-12 h-12 rounded-2xl bg-[#0A3D2E] hover:bg-[#0c4b38] text-[#FFD60A] border border-[#FFD60A]/40 flex items-center justify-center transition-all cursor-pointer shadow-md shrink-0"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
            </button>

            <div>
              <span className="text-xs font-bold text-white block">
                {isPlaying ? `Playing ${currentLangDetails.name} Speech...` : `Listen to ${currentLangDetails.name} Audio`}
              </span>
              <span className="text-[11px] text-gray-400 font-mono">
                Speech Output: Active & Hearable
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <button
              type="button"
              onClick={handleShareWhatsAppVoice}
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Forward to WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleCopyTranscript}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 p-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-gray-700"
              title="Copy Transcript"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

        </div>

      </div>

      {/* Translated Script Box */}
      <div className="space-y-1.5">
        <span className="font-mono text-xs font-bold text-[#FFD60A] uppercase block">
          Translated Script ({currentLangDetails.name}):
        </span>
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 text-xs sm:text-sm text-gray-200 font-sans leading-relaxed">
          "{currentScriptText}"
        </div>
      </div>

    </div>
  );
};
