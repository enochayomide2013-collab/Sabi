import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Camera, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Trash2, 
  RefreshCw, 
  Check, 
  AlertCircle, 
  Loader2, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Edit3, 
  Send, 
  FileText,
  Building2,
  Navigation,
  CheckCircle2,
  Info,
  Mail
} from 'lucide-react';
import { NIGERIAN_STATES } from '../../data/nigerianLocations';
import { storageService, ADMIN_DEFAULT_EMAIL } from '../../services/storageService';
import { AiService, ClaimExtractionResult } from '../../services/aiService';
import { EvidenceItem, VerificationTask } from '../../types';
import { EmailNotificationService } from '../../services/emailNotificationService';
import { NigerianLanguageTranslator } from './NigerianLanguageTranslator';

interface ReportViewProps {
  onNavigate: (tab: string, extraData?: any) => void;
  onShowPointsToast: (points: number, message: string) => void;
}

export const ReportView: React.FC<ReportViewProps> = ({ onNavigate, onShowPointsToast }) => {
  const defaultLoc = storageService.getLocation();

  // Multi-step form tracking
  const [currentStep, setCurrentStep] = useState<number>(1); // 1: Upload, 2: AI Claim & Edit, 3: Location, 4: Summary & Dispatch

  // Evidence state
  const [uploadedEvidence, setUploadedEvidence] = useState<EvidenceItem | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState<boolean>(false);
  const [audioRecordingTime, setAudioRecordingTime] = useState<number>(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioPlayCurrentTime, setAudioPlayCurrentTime] = useState<number>(0);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayAudio = () => {
    if (!audioPlayerRef.current) return;
    if (isPlayingAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioPlayerRef.current.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((e) => {
        console.warn('Audio play failed:', e);
      });
    }
  };

  // AI Extraction state
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [extractedData, setExtractedData] = useState<ClaimExtractionResult | null>(null);
  const [claimText, setClaimText] = useState<string>('');
  const [isEditingClaim, setIsEditingClaim] = useState<boolean>(false);

  // Location state
  const [selectedState, setSelectedState] = useState<string>(defaultLoc.state);
  const [selectedLga, setSelectedLga] = useState<string>(defaultLoc.lga);
  const [areaInput, setAreaInput] = useState<string>(defaultLoc.area);
  const [isLocatingGps, setIsLocatingGps] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<string | null>(null);

  // Dispatching animation state
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchProgress, setDispatchProgress] = useState<string[]>([]);
  const [isDispatchedComplete, setIsDispatchedComplete] = useState<boolean>(false);

  // Camera video ref & streams
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dynamic LGAs
  const stateData = NIGERIAN_STATES.find(s => s.state === selectedState) || NIGERIAN_STATES[0];
  const lgaOptions = stateData.lgas;

  useEffect(() => {
    if (!lgaOptions.some(l => l.name === selectedLga)) {
      setSelectedLga(lgaOptions[0]?.name || '');
    }
  }, [selectedState, lgaOptions, selectedLga]);

  // Clean up streams on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable; fallback to simulated capture', err);
      // Fallback sample snapshot
      captureSimulatedPhoto();
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const takeCameraPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        const item: EvidenceItem = {
          id: 'ev_' + Date.now(),
          type: 'image',
          url: dataUrl,
          filename: 'camera_capture_' + Date.now() + '.jpg',
          fileSize: '1.4 MB',
          timestamp: 'Just now',
          isFresh: true,
          approxLocation: `${selectedState} (${areaInput || selectedLga})`
        };
        setUploadedEvidence(item);
        stopCamera();
        runAiAnalysis(item);
        return;
      }
    }
    captureSimulatedPhoto();
  };

  const captureSimulatedPhoto = () => {
    stopCamera();
    const sampleUrls = [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80'
    ];
    const picked = sampleUrls[Math.floor(Math.random() * sampleUrls.length)];
    const item: EvidenceItem = {
      id: 'ev_' + Date.now(),
      type: 'image',
      url: picked,
      filename: 'live_verification_capture.jpg',
      fileSize: '2.1 MB',
      timestamp: 'Just now',
      isFresh: true,
      approxLocation: `${selectedState} (${areaInput || selectedLga})`
    };
    setUploadedEvidence(item);
    runAiAnalysis(item);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isVideo = file.type.startsWith('video');
    const isAudio = file.type.startsWith('audio');
    const isImage = file.type.startsWith('image');

    const fileUrl = URL.createObjectURL(file);
    const item: EvidenceItem = {
      id: 'ev_' + Date.now(),
      type: isVideo ? 'video' : isAudio ? 'audio' : isImage ? 'image' : 'screenshot',
      url: fileUrl,
      filename: file.name,
      fileSize: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
      timestamp: 'Just now',
      approxLocation: `${selectedState} (${areaInput || selectedLga})`
    };
    setUploadedEvidence(item);
    runAiAnalysis(item);
  };

  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
        const item: EvidenceItem = {
          id: 'ev_rec_' + Date.now(),
          type: 'audio',
          url: url,
          filename: 'voice_claim_note.wav',
          fileSize: '820 KB',
          timestamp: 'Just now',
          audioDuration: audioRecordingTime
        };
        setUploadedEvidence(item);
        runAiAnalysis(item);
      };

      recorder.start();
      setIsRecordingAudio(true);
      setAudioRecordingTime(0);

      timerRef.current = setInterval(() => {
        setAudioRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone not available, using demo audio recording', err);
      simulateAudioRecording();
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    }
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecordingAudio(false);
  };

  const simulateAudioRecording = () => {
    setIsRecordingAudio(true);
    setAudioRecordingTime(1);
    setTimeout(() => {
      setIsRecordingAudio(false);
      const item: EvidenceItem = {
        id: 'ev_sim_audio_' + Date.now(),
        type: 'audio',
        url: '',
        filename: 'market_trader_audio_note.wav',
        fileSize: '650 KB',
        timestamp: 'Just now',
        audioDuration: 12
      };
      setUploadedEvidence(item);
      runAiAnalysis(item);
    }, 2000);
  };

  const runAiAnalysis = async (item: EvidenceItem) => {
    setIsAnalyzing(true);
    setCurrentStep(2);

    const result = await AiService.analyzeEvidence(item.filename, item.type);
    setExtractedData(result);
    setClaimText(result.extractedClaim);

    if (result.detectedLocation) {
      if (result.detectedLocation.state) setSelectedState(result.detectedLocation.state);
      if (result.detectedLocation.lga) setSelectedLga(result.detectedLocation.lga);
      if (result.detectedLocation.area) setAreaInput(result.detectedLocation.area);
    }

    setIsAnalyzing(false);
  };

  const handleUseGps = () => {
    setIsLocatingGps(true);
    setGpsStatus(null);
    if (!navigator.geolocation) {
      setIsLocatingGps(false);
      setGpsStatus('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        try {
          const res = await fetch(`/api/reverse-geocode?lat=${latitude}&lon=${longitude}`);
          if (res.ok) {
            const geocoded = await res.json();
            const detectedArea = geocoded.area || 'Detected Area';
            const detectedLga = geocoded.lga || detectedArea;
            const detectedState = geocoded.state || 'Lagos';

            const matchedState = NIGERIAN_STATES.find(
              s => s.state.toLowerCase().includes(detectedState.toLowerCase()) ||
                   detectedState.toLowerCase().includes(s.state.toLowerCase())
            );

            if (matchedState) {
              setSelectedState(matchedState.state);
              const matchedLga = matchedState.lgas.find(
                l => l.name.toLowerCase().includes(detectedLga.toLowerCase()) ||
                     detectedLga.toLowerCase().includes(l.name.toLowerCase())
              );
              setSelectedLga(matchedLga ? matchedLga.name : matchedState.lgas[0]?.name || detectedLga);
            } else {
              setSelectedState(detectedState);
              setSelectedLga(detectedLga);
            }

            setAreaInput(detectedArea);
            setGpsStatus(`📍 Accurate Location Verified: ${detectedArea}, ${detectedState} (Accuracy: ±${Math.round(accuracy)}m)`);
          } else {
            setGpsStatus(`📍 Coordinates Detected (${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E).`);
          }
        } catch (e) {
          setGpsStatus(`📍 Coordinates Detected (${latitude.toFixed(3)}°N, ${longitude.toFixed(3)}°E).`);
        } finally {
          setIsLocatingGps(false);
        }
      },
      () => {
        setIsLocatingGps(false);
        setGpsStatus('GPS permission unavailable. Please select your location manually.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const handleSendToVerifiers = () => {
    setIsDispatching(true);
    setDispatchProgress(['Finding nearby contributors...', 'Checking location within 5 km...']);

    setTimeout(() => {
      setDispatchProgress(prev => [...prev, 'Contributor 1 found (Gold) ✓']);
    }, 700);

    setTimeout(() => {
      setDispatchProgress(prev => [...prev, 'Contributor 2 found (Silver) ✓']);
    }, 1300);

    setTimeout(() => {
      setDispatchProgress(prev => [...prev, 'Contributor 3 found (Local Spotter) ✓']);
    }, 1900);

    setTimeout(() => {
      setIsDispatching(false);
      setIsDispatchedComplete(true);

      // Create new verification task
      const newTask: VerificationTask = {
        id: 'task_' + Date.now(),
        reportId: 'rep_' + Date.now(),
        claim: claimText,
        category: extractedData?.category || 'rumor',
        state: selectedState,
        lga: selectedLga,
        area: areaInput || selectedLga,
        radiusKm: 5,
        requiredVerifiers: 3,
        currentVerifiersCount: 0,
        status: 'active',
        createdAt: 'Just now',
        pointsReward: 25,
        originalEvidence: uploadedEvidence ? [uploadedEvidence] : [],
        responses: []
      };

      storageService.addTask(newTask);
      storageService.addPoints(10, 'Submitted new verification report to community');
      onShowPointsToast(10, 'Your report has been dispatched to 3 nearby verifiers!');

      // Send confirmation email to the user upon report submission
      const currentUser = storageService.getUser();
      if (currentUser && currentUser.email) {
        EmailNotificationService.sendReportSubmissionNotification(
          { email: currentUser.email, name: currentUser.name },
          { claim: newTask.claim, location: `${newTask.area || newTask.lga}, ${newTask.state}`, reportId: newTask.id }
        );
      }
    }, 2600);
  };

  const handleSendDirectEmailReport = () => {
    const claimToSend = claimText || 'General Market & Food Price Verification Report';
    const locToSend = `${areaInput || selectedLga}, ${selectedState}`;
    
    storageService.sendReportToEmail({
      claim: claimToSend,
      location: locToSend,
      details: extractedData?.claimDetails || 'Submitted via SABI Report View',
      evidenceName: uploadedEvidence?.filename,
      evidenceUrl: uploadedEvidence?.url,
      targetEmail: ADMIN_DEFAULT_EMAIL
    });

    onShowPointsToast(15, `Report dispatched to ${ADMIN_DEFAULT_EMAIL}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16 animate-fade-in">
      
      {/* DIRECT EMAIL REPORT BANNER */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0A3D2E] text-[#FFD60A] flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[#0A3D2E]">Send Direct Report to Admin</p>
            <p className="text-gray-600 text-[11px]">Dispatches directly to <strong>{ADMIN_DEFAULT_EMAIL}</strong></p>
          </div>
        </div>
        <button
          id="top-direct-email-report-btn"
          type="button"
          onClick={handleSendDirectEmailReport}
          className="w-full sm:w-auto bg-[#0A3D2E] hover:bg-[#0c4a37] text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm shrink-0"
        >
          <Send className="w-3.5 h-3.5 text-[#FFD60A]" />
          <span>Send Report to {ADMIN_DEFAULT_EMAIL}</span>
        </button>
      </div>

      {/* Page Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A3D2E] bg-[#0A3D2E]/10 px-3 py-1 rounded-full uppercase">
          <FileText className="w-3.5 h-3.5" />
          <span>Report Information</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-display">
          What do you want us to check?
        </h1>
        <p className="text-sm text-gray-600">
          Upload the information or media containing the claim. SABI will analyze it and coordinate on-ground community verification.
        </p>
      </div>

      {/* STEP INDICATOR */}
      <div className="bg-white rounded-2xl p-3.5 border border-gray-200 shadow-sm flex items-center justify-between text-xs font-semibold">
        <div className={`flex items-center gap-1.5 ${currentStep >= 1 ? 'text-[#0A3D2E] font-bold' : 'text-gray-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            currentStep >= 1 ? 'bg-[#0A3D2E] text-white' : 'bg-gray-100 text-gray-500'
          }`}>1</span>
          <span>Upload</span>
        </div>
        <div className="w-6 h-0.5 bg-gray-200" />
        <div className={`flex items-center gap-1.5 ${currentStep >= 2 ? 'text-[#0A3D2E] font-bold' : 'text-gray-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            currentStep >= 2 ? 'bg-[#0A3D2E] text-white' : 'bg-gray-100 text-gray-500'
          }`}>2</span>
          <span>Claim</span>
        </div>
        <div className="w-6 h-0.5 bg-gray-200" />
        <div className={`flex items-center gap-1.5 ${currentStep >= 3 ? 'text-[#0A3D2E] font-bold' : 'text-gray-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            currentStep >= 3 ? 'bg-[#0A3D2E] text-white' : 'bg-gray-100 text-gray-500'
          }`}>3</span>
          <span>Location</span>
        </div>
        <div className="w-6 h-0.5 bg-gray-200" />
        <div className={`flex items-center gap-1.5 ${currentStep >= 4 ? 'text-[#0A3D2E] font-bold' : 'text-gray-400'}`}>
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
            currentStep >= 4 ? 'bg-[#0A3D2E] text-white' : 'bg-gray-100 text-gray-500'
          }`}>4</span>
          <span>Summary</span>
        </div>
      </div>

      {/* DISPATCH COMPLETE VIEW */}
      {isDispatchedComplete ? (
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl text-center space-y-5 animate-fade-in">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-gray-900 font-display">
              Verification Request Sent!
            </h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Your verification request has been dispatched to <strong>3 nearby community contributors</strong> within 5 km of <strong>{areaInput || selectedLga}, {selectedState}</strong>.
            </p>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 text-xs text-emerald-900 border border-emerald-200 text-left space-y-1.5 max-w-md mx-auto">
            <div className="font-bold flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-[#0A3D2E]" />
              <span>What happens next:</span>
            </div>
            <p>1. Local verifiers in the area will capture fresh camera evidence.</p>
            <p>2. SABI AI will perform cross-evidence & outdated-media comparisons.</p>
            <p>3. You will receive a notification as soon as the 20-second Truth Video is ready.</p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => onNavigate('home')}
              className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-md transition-all"
            >
              Back to Home Feed
            </button>
            <button
              onClick={() => onNavigate('verify')}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm px-6 py-3 rounded-2xl transition-all"
            >
              View Verification Pool
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* STEP 1: UPLOAD EVIDENCE */}
          {currentStep === 1 && (
            <div className="space-y-4">
              
              {/* Live Camera Viewfinder Modal/Section */}
              {isCameraActive ? (
                <div className="bg-black rounded-3xl overflow-hidden relative shadow-2xl space-y-3">
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
                    <button
                      onClick={stopCamera}
                      className="bg-white/20 hover:bg-white/30 text-white font-semibold text-xs px-4 py-2 rounded-full backdrop-blur-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={takeCameraPhoto}
                      className="w-16 h-16 rounded-full bg-[#FFD60A] text-[#0A3D2E] border-4 border-white shadow-xl flex items-center justify-center active:scale-95 transition-transform"
                      title="Snap photo"
                    >
                      <Camera className="w-7 h-7" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-gray-300 hover:border-[#0A3D2E] transition-all space-y-5 text-center">
                  
                  <div className="w-16 h-16 rounded-3xl bg-[#0A3D2E]/10 text-[#0A3D2E] flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 stroke-[2.2]" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-gray-900 font-display">
                      Upload Screenshot, Image or Video Evidence
                    </h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                      Supports JPG, PNG, WEBP, MP4, MOV (Max 50MB)
                    </p>
                  </div>

                  {/* 2 Action Buttons: Camera and Upload */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 max-w-md mx-auto">
                    
                    {/* Take Photo */}
                    <button
                      onClick={startCamera}
                      className="bg-emerald-50 hover:bg-emerald-100 text-[#0A3D2E] border border-emerald-200 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      <Camera className="w-7 h-7" />
                      <span className="text-xs font-bold font-display">Take Live Photo</span>
                    </button>

                    {/* Upload File */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 p-4 rounded-2xl flex flex-col items-center gap-2 transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      <Upload className="w-7 h-7" />
                      <span className="text-xs font-bold font-display">Upload Screenshot / Video</span>
                    </button>

                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*,audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* Sample Quick Testing Claims */}
              <div className="bg-gray-100/70 rounded-2xl p-3.5 text-xs text-gray-600 space-y-2">
                <span className="font-bold text-gray-700 block">Or try a sample trending claim to test flow:</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      const item: EvidenceItem = {
                        id: 'ev_sample_rice',
                        type: 'screenshot',
                        url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
                        filename: 'rice_price_broadcast_deidei.jpg',
                        fileSize: '1.2 MB',
                        timestamp: 'Just now'
                      };
                      setUploadedEvidence(item);
                      runAiAnalysis(item);
                    }}
                    className="bg-white hover:bg-[#0A3D2E] hover:text-white border border-gray-300 text-gray-800 px-3 py-1.5 rounded-xl font-medium transition-all"
                  >
                    Rice ₦90k in Dei-Dei
                  </button>
                  <button
                    onClick={() => {
                      const item: EvidenceItem = {
                        id: 'ev_sample_fuel',
                        type: 'video',
                        url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
                        filename: 'yaba_fuel_scarcity_video.mp4',
                        fileSize: '3.8 MB',
                        timestamp: 'Just now'
                      };
                      setUploadedEvidence(item);
                      runAiAnalysis(item);
                    }}
                    className="bg-white hover:bg-[#0A3D2E] hover:text-white border border-gray-300 text-gray-800 px-3 py-1.5 rounded-xl font-medium transition-all"
                  >
                    Fuel Queue in Yaba
                  </button>
                  <button
                    onClick={() => {
                      const item: EvidenceItem = {
                        id: 'ev_sample_tomatoes',
                        type: 'image',
                        url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
                        filename: 'bodija_tomato_price_drop.jpg',
                        fileSize: '2.0 MB',
                        timestamp: 'Just now'
                      };
                      setUploadedEvidence(item);
                      runAiAnalysis(item);
                    }}
                    className="bg-white hover:bg-[#0A3D2E] hover:text-white border border-gray-300 text-gray-800 px-3 py-1.5 rounded-xl font-medium transition-all"
                  >
                    Tomato Price in Bodija
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STEP 2: EVIDENCE PREVIEW & AI CLAIM EXTRACTION */}
          {currentStep === 2 && (
            <div className="space-y-4">
              
              {/* Evidence Uploaded Card */}
              {uploadedEvidence && (
                <>
                  <div className="bg-white rounded-3xl p-4 border border-gray-200 shadow-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {uploadedEvidence.type === 'image' || uploadedEvidence.type === 'screenshot' ? (
                      <img
                        src={uploadedEvidence.url}
                        alt="Evidence"
                        className="w-14 h-14 rounded-2xl object-cover border border-gray-200 shrink-0"
                      />
                    ) : uploadedEvidence.type === 'audio' ? (
                      <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                        <Mic className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                        <Camera className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Evidence Uploaded
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1 mt-0.5">
                        {uploadedEvidence.filename}
                      </h4>
                      <p className="text-[11px] text-gray-500">{uploadedEvidence.fileSize || '2.4 MB'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setUploadedEvidence(null);
                        setCurrentStep(1);
                      }}
                      className="p-2 text-gray-500 hover:text-red-600 rounded-xl hover:bg-gray-100 transition-all text-xs font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>

                {/* Audible Voice Note Player */}
                {uploadedEvidence.type === 'audio' && (
                  <div className="bg-[#0A3D2E] text-white rounded-3xl p-4.5 border border-emerald-500/40 shadow-md space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#FFD60A] text-[#0A3D2E] flex items-center justify-center font-black">
                          <Mic className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">Voice Note Audio Player</p>
                          <p className="text-[10px] text-emerald-200">Hearable speech playback & waveform verification</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={togglePlayAudio}
                        className="bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer"
                      >
                        {isPlayingAudio ? (
                          <>
                            <Pause className="w-4 h-4" />
                            <span>Pause Audio</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            <span>Listen to Voice Note</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Waveform indicator */}
                    <div className="flex items-center gap-1 h-8 bg-black/30 rounded-xl px-3 py-1">
                      {[35, 75, 45, 90, 60, 30, 85, 95, 50, 40, 80, 65, 45, 90, 70, 40, 85, 60, 30, 75].map((h, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-all duration-150 ${
                            isPlayingAudio ? 'bg-[#FFD60A]' : 'bg-emerald-300/40'
                          }`}
                          style={{
                            height: isPlayingAudio ? `${Math.max(20, (h + (i % 3) * 10) % 100)}%` : `${h * 0.4}%`
                          }}
                        />
                      ))}
                    </div>

                    <audio
                      ref={audioPlayerRef}
                      src={uploadedEvidence.url}
                      onTimeUpdate={(e) => setAudioPlayCurrentTime(Math.round(e.currentTarget.currentTime))}
                      onEnded={() => {
                        setIsPlayingAudio(false);
                        setAudioPlayCurrentTime(0);
                      }}
                      className="hidden"
                    />
                  </div>
                )}
              </>
            )}

            {/* AI CLAIM EXTRACTION SECTION */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#0A3D2E]" />
                    <h3 className="font-bold text-base text-gray-900 font-display">
                      Extracted Claim
                    </h3>
                  </div>
                  {isAnalyzing && (
                    <span className="text-xs font-semibold text-[#0A3D2E] flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Analyzing evidence...
                    </span>
                  )}
                </div>

                {isAnalyzing ? (
                  <div className="py-8 text-center space-y-3">
                    <Loader2 className="w-8 h-8 animate-spin text-[#0A3D2E] mx-auto" />
                    <p className="text-sm font-semibold text-gray-700">
                      Reading OCR text and extracting verifiable statement...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    
                    {/* Duplicate Detection Alert if triggered */}
                    {extractedData?.duplicateFound && extractedData.duplicateInfo && (
                      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold">This claim is already being investigated:</strong>
                          <p className="italic mt-0.5">"{extractedData.duplicateInfo.existingClaim}"</p>
                          <button
                            onClick={() => onNavigate('verify', { taskId: extractedData.duplicateInfo?.existingTaskId })}
                            className="mt-2 text-xs font-bold text-[#0A3D2E] bg-white border border-amber-300 px-3 py-1 rounded-lg hover:bg-amber-100 transition-all inline-block"
                          >
                            View Existing Verification
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Outdated Media Indicator Flag */}
                    {extractedData?.outdatedIndicators?.isOutdatedLikely && (
                      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-3.5 text-xs text-orange-900 flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold">AI Outdated Media Signal:</strong>
                          <p>{extractedData.outdatedIndicators.reason}</p>
                        </div>
                      </div>
                    )}

                    {/* Editable Claim Input Card */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                          Claim Statement
                        </span>
                        <button
                          onClick={() => setIsEditingClaim(!isEditingClaim)}
                          className="text-xs font-bold text-[#0A3D2E] hover:underline flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isEditingClaim ? 'Done' : 'Edit Claim'}</span>
                        </button>
                      </div>

                      {isEditingClaim ? (
                        <textarea
                          value={claimText}
                          onChange={(e) => setClaimText(e.target.value)}
                          rows={3}
                          className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm font-semibold text-gray-900 focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                        />
                      ) : (
                        <p className="text-base font-bold text-gray-900 leading-snug">
                          “{claimText}”
                        </p>
                      )}
                    </div>

                    {/* Nigerian Language Translation (Yoruba, Igbo, Hausa, Pidgin & English) */}
                    <NigerianLanguageTranslator 
                      claimText={claimText}
                      onApplyTranslation={(translated) => {
                        setClaimText(translated);
                        onShowPointsToast(10, 'Applied Nigerian language translation to claim (+10 PTS)!');
                      }}
                      onShowToast={onShowPointsToast}
                    />

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setCurrentStep(3)}
                        disabled={!claimText.trim()}
                        className="bg-[#0A3D2E] hover:bg-[#0c4b38] disabled:opacity-50 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-md flex items-center gap-2 transition-all active:scale-95"
                      >
                        <span>Next: Confirm Location</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>
                )}

              </div>

            </div>
          )}

          {/* STEP 3: REPORT LOCATION */}
          {currentStep === 3 && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#0A3D2E]" />
                  <h3 className="font-bold text-lg text-gray-900 font-display">
                    Where did this happen?
                  </h3>
                </div>
                <p className="text-xs text-gray-500">
                  Select the Nigerian State, LGA, and specific market or landmark to dispatch local contributors.
                </p>
              </div>

              {/* GPS Auto-detector */}
              <div>
                <button
                  type="button"
                  onClick={handleUseGps}
                  disabled={isLocatingGps}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-[#0A3D2E] border border-emerald-200 font-semibold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50 text-xs"
                >
                  {isLocatingGps ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Navigation className="w-4 h-4 text-[#0A3D2E]" />
                  )}
                  <span>{isLocatingGps ? 'Finding location...' : 'Use My Current Location'}</span>
                </button>

                {gpsStatus && (
                  <p className="mt-2 text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-start gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{gpsStatus}</span>
                  </p>
                )}
              </div>

              {/* State */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  State (36 States + FCT)
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                >
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s.state} value={s.state}>
                      {s.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* LGA */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  LGA (Local Government Area)
                </label>
                <select
                  value={selectedLga}
                  onChange={(e) => setSelectedLga(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                >
                  {lgaOptions.map((lga) => (
                    <option key={lga.name} value={lga.name}>
                      {lga.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area / Landmark */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                  Area / Market / Landmark
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Dei-Dei Grain Section, Mile 12, Bodija Market..."
                    value={areaInput}
                    onChange={(e) => setAreaInput(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 text-gray-900 rounded-xl pl-10 pr-3.5 py-2.5 text-sm font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-md flex items-center gap-2 transition-all active:scale-95"
                >
                  <span>Review Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* STEP 4: REPORT SUMMARY & SEND TO VERIFIERS */}
          {currentStep === 4 && (
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
              
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                  Report Summary
                </div>
                <h3 className="font-bold text-lg text-gray-900 font-display">
                  Ready to send to verifiers?
                </h3>
              </div>

              {/* Summary Details Card */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200 space-y-3 text-sm">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide block">
                    Claim:
                  </span>
                  <p className="font-bold text-gray-900 text-base">“{claimText}”</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200 text-xs">
                  <div>
                    <span className="text-gray-500 font-medium">Target Location:</span>
                    <p className="font-bold text-gray-900">{areaInput || selectedLga}, {selectedState}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Attached Evidence:</span>
                    <p className="font-bold text-gray-900">{uploadedEvidence ? uploadedEvidence.filename : '1 file'}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 text-xs text-gray-600">
                  <span>Search Radius: <strong>Up to 5 km</strong> · Contributor details remain anonymous</span>
                </div>
              </div>

              {/* Animated Dispatching Radar UI */}
              {isDispatching ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 animate-fade-in">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="w-16 h-16 rounded-full bg-[#0A3D2E] text-[#FFD60A] flex items-center justify-center">
                      <Send className="w-7 h-7 animate-bounce" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#0A3D2E] animate-ping opacity-25" />
                  </div>

                  <div className="space-y-1 text-xs text-emerald-950 font-semibold">
                    {dispatchProgress.map((msg, idx) => (
                      <p key={idx} className="animate-fade-in">{msg}</p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 order-3 sm:order-1"
                  >
                    Edit Details
                  </button>

                  <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto order-1 sm:order-2">
                    <button
                      id="step4-send-email-report-btn"
                      type="button"
                      onClick={handleSendDirectEmailReport}
                      className="w-full sm:w-auto bg-emerald-50 hover:bg-emerald-100 text-[#0A3D2E] border border-emerald-300 font-bold text-xs px-5 py-3.5 rounded-2xl shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4 text-[#0A3D2E]" />
                      <span>Send Report to {ADMIN_DEFAULT_EMAIL}</span>
                    </button>

                    <button
                      id="step4-send-verifiers-btn"
                      type="button"
                      onClick={handleSendToVerifiers}
                      className="w-full sm:w-auto bg-[#FFD60A] hover:bg-[#ffe033] text-[#0A3D2E] font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 font-display"
                    >
                      <Send className="w-5 h-5" />
                      <span>SEND TO COMMUNITY VERIFIERS</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </>
      )}

    </div>
  );
};
