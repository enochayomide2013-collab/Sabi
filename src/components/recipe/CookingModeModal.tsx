import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Hand, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  Play, 
  Pause, 
  Clock, 
  Utensils, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  ChefHat,
  Activity,
  Radio,
  Bell
} from 'lucide-react';
import { RecipeItem } from '../../types';
import { scaleIngredientQuantity } from '../../utils/recipeScaler';

interface CookingModeModalProps {
  recipe: RecipeItem;
  servings: number;
  onClose: () => void;
  onShowPointsToast: (points: number, message: string) => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({
  recipe,
  servings,
  onClose,
  onShowPointsToast
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true);
  const [isProximityActive, setIsProximityActive] = useState<boolean>(true);
  const [isTtsActive, setIsTtsActive] = useState<boolean>(true);
  const [voiceStatus, setVoiceStatus] = useState<string>('Listening for commands ("Next", "Back", "Repeat")...');
  const [lastCommand, setLastCommand] = useState<string>('');
  const [showIngredientsModal, setShowIngredientsModal] = useState<boolean>(false);

  // Proximity / Wave simulation state
  const [waveDetected, setWaveDetected] = useState<boolean>(false);
  const [waveCooldown, setWaveCooldown] = useState<boolean>(false);

  // Timer state for current step
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerRef = useRef<any>(null);

  // Recognition ref
  const recognitionRef = useRef<any>(null);

  const steps = recipe.steps && recipe.steps.length > 0 ? recipe.steps : [
    {
      stepNumber: 1,
      title: 'Prepare Ingredients',
      instruction: `Gather and wash all required ingredients for ${recipe.title}.`,
      imageUrl: recipe.videoThumbnail
    },
    {
      stepNumber: 2,
      title: 'Main Cooking Process',
      instruction: 'Follow main heat application and seasoning steps.',
      imageUrl: recipe.videoThumbnail
    },
    {
      stepNumber: 3,
      title: 'Plating & Serving',
      instruction: 'Serve hot with your favorite side or beverage.',
      imageUrl: recipe.videoThumbnail
    }
  ];

  const currentStep = steps[currentStepIdx];
  const baseServings = recipe.servings || 2;
  const scaleFactor = servings / baseServings;
  const scaledIngredients = recipe.ingredients.map(ing => scaleIngredientQuantity(ing, scaleFactor));

  // Speech Synthesis Helper
  const speakText = (text: string) => {
    if (!isTtsActive || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop prior speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Clear natural speed
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Announce step whenever index changes
  useEffect(() => {
    if (currentStep) {
      const speechMsg = `Step ${currentStep.stepNumber}. ${currentStep.title}. ${currentStep.instruction}`;
      speakText(speechMsg);
    }

    // Reset timer on step change
    setTimerSeconds(0);
    setIsTimerRunning(false);
  }, [currentStepIdx]);

  // Handle Speech Recognition (Voice Commands)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus('Speech recognition not natively supported on this browser. Use Wave Sensor or buttons.');
      return;
    }

    if (isVoiceActive) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setVoiceStatus('Voice Active: Say "Next", "Back", "Repeat", or "Ingredients"');
        };

        recognition.onresult = (event: any) => {
          const lastIndex = event.results.length - 1;
          const transcript = event.results[lastIndex][0].transcript.trim().toLowerCase();
          setLastCommand(transcript);

          if (transcript.includes('next') || transcript.includes('forward') || transcript.includes('continue') || transcript.includes('go next')) {
            handleNextStep('Voice: "Next"');
          } else if (transcript.includes('back') || transcript.includes('previous') || transcript.includes('go back')) {
            handlePrevStep('Voice: "Back"');
          } else if (transcript.includes('repeat') || transcript.includes('again') || transcript.includes('read')) {
            setVoiceStatus('Heard: "Repeat"');
            if (currentStep) {
              speakText(`Repeating Step ${currentStep.stepNumber}. ${currentStep.title}. ${currentStep.instruction}`);
            }
          } else if (transcript.includes('ingredient') || transcript.includes('ingredients')) {
            setVoiceStatus('Heard: "Ingredients"');
            setShowIngredientsModal(prev => !prev);
          } else if (transcript.includes('stop') || transcript.includes('exit') || transcript.includes('close')) {
            onClose();
          } else {
            setVoiceStatus(`Heard: "${transcript}". (Say "Next" or "Back")`);
          }
        };

        recognition.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
          setVoiceStatus('Listening active... (Say "Next" clearly)');
        };

        recognition.onend = () => {
          // Restart if still active
          if (isVoiceActive) {
            try {
              recognition.start();
            } catch (e) {
              // ignore
            }
          }
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Error starting speech recognition:', e);
      }
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [isVoiceActive, currentStepIdx]);

  // Proximity Event Listener for devices with hardware proximity sensors
  useEffect(() => {
    if (!isProximityActive) return;

    const handleProximity = (event: any) => {
      // Hardware proximity triggers when hand is close (< 5cm or near=true)
      if (event.near || (event.value !== undefined && event.value < 5)) {
        triggerWaveSensor();
      }
    };

    window.addEventListener('deviceproximity', handleProximity);
    window.addEventListener('userproximity', handleProximity);

    return () => {
      window.removeEventListener('deviceproximity', handleProximity);
      window.removeEventListener('userproximity', handleProximity);
    };
  }, [isProximityActive, currentStepIdx, waveCooldown]);

  // Timer loop
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  const triggerWaveSensor = () => {
    if (waveCooldown) return;

    setWaveDetected(true);
    setWaveCooldown(true);
    handleNextStep('Proximity Sensor / Hand Wave');

    setTimeout(() => {
      setWaveDetected(false);
    }, 1200);

    // Cooldown to prevent double triggers
    setTimeout(() => {
      setWaveCooldown(false);
    }, 2000);
  };

  const handleNextStep = (source?: string) => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      if (source) setVoiceStatus(`Advanced via ${source}`);
    } else {
      onShowPointsToast(20, `Congratulations! Completed cooking ${recipe.title}! (+20 PTS)`);
      speakText(`Congratulations! You have completed all steps for ${recipe.title}. Enjoy your meal!`);
      setVoiceStatus('Recipe Completed!');
    }
  };

  const handlePrevStep = (source?: string) => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
      if (source) setVoiceStatus(`Went back via ${source}`);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-950/95 backdrop-blur-xl text-white flex flex-col justify-between overflow-y-auto animate-fade-in p-4 sm:p-6 font-sans">
      
      {/* TOP HANDS-FREE BAR & TOGGLES */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center font-extrabold shadow-md font-display">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full font-display tracking-wide animate-pulse">
                Hands-Free Cooking Mode
              </span>
              <span className="text-xs text-gray-400 font-medium">
                {servings} {servings === 1 ? 'Person' : 'People'}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-white font-display line-clamp-1">
              {recipe.title}
            </h2>
          </div>
        </div>

        {/* Control Toggles */}
        <div className="flex items-center gap-2">
          {/* Audio Reading Toggle */}
          <button
            onClick={() => {
              const nextState = !isTtsActive;
              setIsTtsActive(nextState);
              if (!nextState) window.speechSynthesis.cancel();
            }}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all ${
              isTtsActive ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50' : 'bg-white/10 text-gray-400'
            }`}
            title="Read Steps Aloud"
          >
            {isTtsActive ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">Read Aloud</span>
          </button>

          {/* Voice Command Toggle */}
          <button
            onClick={() => setIsVoiceActive(!isVoiceActive)}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all ${
              isVoiceActive ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50' : 'bg-white/10 text-gray-400'
            }`}
            title="Voice Commands (Next / Back / Repeat)"
          >
            {isVoiceActive ? <Mic className="w-4 h-4 text-amber-400 animate-pulse" /> : <MicOff className="w-4 h-4" />}
            <span className="hidden sm:inline">Voice Control</span>
          </button>

          {/* Proximity Wave Sensor Toggle */}
          <button
            onClick={() => setIsProximityActive(!isProximityActive)}
            className={`px-3 py-2 rounded-xl text-xs font-bold font-display flex items-center gap-1.5 transition-all ${
              isProximityActive ? 'bg-teal-500/30 text-teal-300 border border-teal-500/50' : 'bg-white/10 text-gray-400'
            }`}
            title="Wave Sensor / Hand Gesture"
          >
            <Hand className="w-4 h-4 text-teal-400" />
            <span className="hidden sm:inline">Wave Sensor</span>
          </button>

          {/* Ingredients quick drawer toggle */}
          <button
            onClick={() => setShowIngredientsModal(!showIngredientsModal)}
            className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-display flex items-center gap-1.5"
          >
            <Utensils className="w-4 h-4 text-[#FFD60A]" />
            <span className="hidden sm:inline">Ingredients</span>
          </button>

          {/* Close Hands-Free Mode */}
          <button
            onClick={() => {
              window.speechSynthesis.cancel();
              onClose();
            }}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-red-500/20 text-gray-300 hover:text-white transition-colors"
            title="Exit Hands-Free Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* SENSOR / VOICE STATUS FEEDBACK BAR */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-3 my-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-300">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
          <span className="font-display font-bold text-white">Sensor Status:</span>
          <span className="text-gray-300 truncate max-w-md">{voiceStatus}</span>
        </div>

        {lastCommand && (
          <div className="bg-amber-500/20 border border-amber-500/40 text-amber-200 px-3 py-1 rounded-xl text-[11px] font-bold font-display shrink-0">
            Voice Detected: "{lastCommand}"
          </div>
        )}
      </div>

      {/* MAIN STEP CAROUSEL & HUGE DISPLAY */}
      <div className="flex-grow flex flex-col justify-center max-w-3xl mx-auto w-full space-y-6 my-4">
        
        {/* Step Progress Tracker */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold font-display">
            <span className="text-[#FFD60A]">
              STEP {currentStepIdx + 1} OF {steps.length}
            </span>
            <span className="text-gray-400">
              {Math.round(((currentStepIdx + 1) / steps.length) * 100)}% Completed
            </span>
          </div>

          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-[#FFD60A] h-full transition-all duration-500"
              style={{ width: `${((currentStepIdx + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP FOCUS CARD */}
        <div className="bg-gradient-to-b from-white/10 to-white/5 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          
          {waveDetected && (
            <div className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm z-20 flex items-center justify-center animate-fade-in">
              <div className="bg-emerald-900 border border-emerald-400 text-emerald-200 px-6 py-4 rounded-3xl font-extrabold text-lg flex items-center gap-3 shadow-2xl">
                <Hand className="w-8 h-8 text-[#FFD60A] animate-bounce" />
                <span>Hand Wave Detected! Advancing Step...</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-[#FFD60A] font-display tracking-widest block">
                {currentStep.title || `Instruction ${currentStepIdx + 1}`}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-display">
                Step {currentStep.stepNumber}: {currentStep.title}
              </h3>
            </div>

            {/* Step Kitchen Timer */}
            <div className="bg-black/40 border border-white/20 rounded-2xl p-3 flex items-center gap-3 shrink-0">
              <Clock className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-[10px] text-gray-400 uppercase font-bold block">Kitchen Timer</span>
                <span className="text-lg font-black font-display text-white">{formatTimer(timerSeconds)}</span>
              </div>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`p-2 rounded-xl text-xs font-bold transition-all ${
                  isTimerRunning ? 'bg-amber-500 text-black' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Huge Readable Instruction Text */}
          <div className="text-lg sm:text-xl text-gray-100 font-medium leading-relaxed sm:leading-loose">
            {currentStep.instruction}
          </div>

          {/* Chef Tips if available */}
          {currentStep.tips && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs sm:text-sm text-amber-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-display block">Sabi Chef Tip:</strong>
                {currentStep.tips}
              </div>
            </div>
          )}

          {/* Step Image Illustration */}
          {currentStep.imageUrl && (
            <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-white/10 relative">
              <img
                src={currentStep.imageUrl}
                alt={currentStep.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

        </div>

        {/* TOUCHLESS PROXIMITY WAVE SENSOR SIMULATION ZONE */}
        {isProximityActive && (
          <div className="bg-teal-950/40 border border-teal-500/30 rounded-3xl p-5 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-teal-300 text-xs font-extrabold uppercase font-display tracking-wider">
              <Hand className="w-4 h-4 text-teal-400" />
              <span>Touchless Proximity Wave Zone</span>
            </div>
            <p className="text-xs text-gray-300">
              Wave your palm over your device sensor or tap the wave target below with messy kitchen hands to advance without touching the screen!
            </p>

            <button
              onClick={triggerWaveSensor}
              disabled={waveCooldown}
              className="mt-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 disabled:opacity-50 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 font-display uppercase tracking-wider active:scale-95 transition-all"
            >
              <Hand className="w-5 h-5 text-[#FFD60A]" />
              <span>Wave Palm Here To Advance Step 👋</span>
            </button>
          </div>
        )}

      </div>

      {/* BOTTOM CONTROLS & NAVIGATION BUTTONS */}
      <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Voice Cue Cheatsheet */}
        <div className="text-xs text-gray-400 space-x-2 hidden sm:block">
          <span className="font-bold text-white font-display">Voice Commands:</span>
          <span className="bg-white/10 px-2 py-1 rounded-md text-emerald-300">"Next"</span>
          <span className="bg-white/10 px-2 py-1 rounded-md text-emerald-300">"Back"</span>
          <span className="bg-white/10 px-2 py-1 rounded-md text-emerald-300">"Repeat"</span>
          <span className="bg-white/10 px-2 py-1 rounded-md text-emerald-300">"Ingredients"</span>
        </div>

        {/* Step Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => handlePrevStep('Manual Button')}
            disabled={currentStepIdx === 0}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-xs sm:text-sm font-extrabold font-display flex items-center justify-center gap-2 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous Step</span>
          </button>

          <button
            onClick={() => handleNextStep('Manual Button')}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-extrabold font-display flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <span>{currentStepIdx === steps.length - 1 ? 'Finish Cooking 🎉' : 'Next Step'}</span>
            <ChevronRight className="w-5 h-5 text-[#FFD60A]" />
          </button>
        </div>

      </div>

      {/* INGREDIENTS QUICK DRAWER MODAL */}
      {showIngredientsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-white/20 rounded-3xl max-w-md w-full p-6 space-y-4 text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#FFD60A]" />
                <h3 className="font-extrabold text-lg font-display">
                  Ingredients ({servings} {servings === 1 ? 'person' : 'people'})
                </h3>
              </div>
              <button
                onClick={() => setShowIngredientsModal(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {scaledIngredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-2 text-sm bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{ing}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowIngredientsModal(false)}
              className="w-full bg-[#FFD60A] text-[#0A3D2E] font-extrabold py-3 rounded-2xl text-xs font-display uppercase tracking-wider"
            >
              Back to Cooking Mode
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
