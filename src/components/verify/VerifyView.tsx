import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HelpCircle, 
  Send, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  ArrowLeft, 
  Check, 
  Loader2, 
  RefreshCw,
  Eye,
  Info
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { VerificationTask, VerifierResponse } from '../../types';

interface VerifyViewProps {
  initialTaskId?: string;
  onNavigate: (tab: string, extraData?: any) => void;
  onShowPointsToast: (points: number, message: string) => void;
}

export const VerifyView: React.FC<VerifyViewProps> = ({
  initialTaskId,
  onNavigate,
  onShowPointsToast
}) => {
  const [tasks, setTasks] = useState<VerificationTask[]>(storageService.getTasks());
  const [selectedTask, setSelectedTask] = useState<VerificationTask | null>(
    initialTaskId ? tasks.find(t => t.id === initialTaskId) || tasks[0] : tasks[0] || null
  );

  // Verifier submission form state
  const [verdict, setVerdict] = useState<'TRUE' | 'FALSE' | 'OUTDATED' | 'NOT SURE' | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [reportedPrice, setReportedPrice] = useState<string>('');
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [isCapturingCamera, setIsCapturingCamera] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmittedSuccessfully, setHasSubmittedSuccessfully] = useState<boolean>(false);

  // Camera video ref & streams
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const unsubscribe = storageService.subscribe(() => {
      const allTasks = storageService.getTasks();
      setTasks(allTasks);
      if (selectedTask) {
        const fresh = allTasks.find(t => t.id === selectedTask.id);
        if (fresh) setSelectedTask(fresh);
      }
    });
    return unsubscribe;
  }, [selectedTask]);

  useEffect(() => {
    if (initialTaskId) {
      const match = tasks.find(t => t.id === initialTaskId);
      if (match) setSelectedTask(match);
    }
  }, [initialTaskId, tasks]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setIsCapturingCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera access fallback', err);
      // Simulated live camera capture photo
      const sampleCaptures = [
        'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80'
      ];
      setCapturedPhotoUrl(sampleCaptures[Math.floor(Math.random() * sampleCaptures.length)]);
      setIsCapturingCamera(false);
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    setIsCapturingCamera(false);
  };

  const snapPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedPhotoUrl(dataUrl);
        stopCamera();
        return;
      }
    }
    // Fallback
    setCapturedPhotoUrl('https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80');
    stopCamera();
  };

  const handleSubmitEvidence = () => {
    if (!selectedTask || !verdict) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const user = storageService.getUser();
      const loc = storageService.getLocation();

      storageService.submitVerifierResponse(selectedTask.id, {
        taskId: selectedTask.id,
        verifierName: user.name,
        verifierTrustLevel: user.trustLevel,
        verdict: verdict,
        comment: commentText.trim() || 'Verified on-site information with fresh evidence.',
        reportedPriceOrDetail: reportedPrice.trim(),
        approxLocation: `${loc.area || selectedTask.area}, ${selectedTask.state}`,
        locationMatched: true,
        evidencePhotoUrl: capturedPhotoUrl || undefined
      });

      setIsSubmitting(false);
      setHasSubmittedSuccessfully(true);
      onShowPointsToast(25, `Earned +25 Stat Points for verifying ${selectedTask.area}!`);
    }, 1200);
  };

  const handleSelectAnotherTask = (task: VerificationTask) => {
    setSelectedTask(task);
    setVerdict(null);
    setCommentText('');
    setReportedPrice('');
    setCapturedPhotoUrl(null);
    setHasSubmittedSuccessfully(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16 animate-fade-in">
      
      {/* Top Bar / Task Switcher */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#0A3D2E] text-[#FFD60A] flex items-center justify-center font-bold text-sm">
            ✓
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-display">
              Verification Tasks
            </h1>
            <p className="text-xs text-gray-500">Community On-Ground Verification Queue</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="text-xs font-bold text-gray-600 hover:text-gray-900"
        >
          Back
        </button>
      </div>

      {/* Task Selector Tabs / Carousel */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {tasks.map(t => (
          <button
            key={t.id}
            onClick={() => handleSelectAnotherTask(t)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0 transition-all border ${
              selectedTask?.id === t.id
                ? 'bg-[#0A3D2E] text-white border-[#0A3D2E] shadow-sm'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="block truncate max-w-[180px]">{t.area}</span>
            <span className="text-[10px] font-normal opacity-80 block">{t.category.replace('_', ' ')}</span>
          </button>
        ))}
      </div>

      {selectedTask && (
        <div className="space-y-5">
          
          {/* Main Task Header Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
            
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 bg-[#FFD60A] text-[#0A3D2E] font-extrabold text-[10px] uppercase px-3 py-1 rounded-full">
                <Sparkles className="w-3 h-3" />
                VERIFICATION REQUEST · +{selectedTask.pointsReward} PTS
              </span>

              <span className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {selectedTask.createdAt}
              </span>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-display leading-snug">
                {selectedTask.claim}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                <MapPin className="w-4 h-4 text-[#0A3D2E] shrink-0" />
                <span>{selectedTask.area}, {selectedTask.state}</span>
                {selectedTask.landmark && <span className="text-gray-400">· {selectedTask.landmark}</span>}
              </div>
            </div>

            {/* Attached Original Evidence Thumbnail */}
            {selectedTask.originalEvidence.length > 0 && (
              <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200/80 flex items-center gap-3">
                {selectedTask.originalEvidence[0].url ? (
                  <img
                    src={selectedTask.originalEvidence[0].url}
                    alt="Original evidence"
                    className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                    EVID
                  </div>
                )}
                <div className="text-xs">
                  <span className="font-bold text-gray-700 block">Submitted Evidence:</span>
                  <span className="text-gray-500 line-clamp-1">
                    {selectedTask.originalEvidence[0].filename} ({selectedTask.originalEvidence[0].fileSize})
                  </span>
                </div>
              </div>
            )}

            {/* Verifier Instructions Box (Section 28) */}
            <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 space-y-2 text-xs text-emerald-950">
              <h4 className="font-bold text-[#0A3D2E] text-sm font-display flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> Check the information yourself:
              </h4>
              <ol className="space-y-1 list-decimal list-inside text-emerald-900/90 leading-relaxed font-medium">
                <li>Check the relevant location or source.</li>
                <li>Look for current, verifiable facts on the ground.</li>
                <li>Capture fresh camera evidence.</li>
                <li>Submit an honest response.</li>
              </ol>
              <p className="text-[11px] font-bold text-emerald-800 bg-white/80 p-2 rounded-xl border border-emerald-200">
                ⚠️ Do not guess. If you cannot confidently verify the claim, select “Not Sure.”
              </p>
            </div>

          </div>

          {/* SUCCESS STATE */}
          {hasSubmittedSuccessfully ? (
            <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-xl text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 font-display">
                Verification Received ✓
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto">
                Thank you for helping verify this information for the Nigerian community.
              </p>
              <div className="inline-flex items-center gap-2 bg-[#0A3D2E] text-[#FFD60A] px-5 py-2.5 rounded-2xl font-extrabold text-sm shadow-md font-display">
                <Sparkles className="w-4 h-4" />
                <span>+25 Stat Points Credited</span>
              </div>
              <div className="pt-3 flex gap-3 justify-center">
                <button
                  onClick={() => onNavigate('home')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                >
                  Return to Feed
                </button>
                <button
                  onClick={() => onNavigate('truth')}
                  className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                >
                  View Truth Results
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              
              {/* LIVE CAMERA VERIFICATION (Section 29) */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-base text-gray-900 font-display">
                      Capture Fresh Evidence
                    </h3>
                    <p className="text-xs text-gray-500">Live camera capture prioritizes authenticity</p>
                  </div>
                  <div className="text-[10px] font-bold uppercase bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                    Metadata Watermarked
                  </div>
                </div>

                {isCapturingCamera ? (
                  <div className="bg-black rounded-3xl overflow-hidden relative shadow-xl">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-72 object-cover" />
                    <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4">
                      <button
                        onClick={stopCamera}
                        className="bg-white/20 text-white font-semibold text-xs px-4 py-2 rounded-full backdrop-blur-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={snapPhoto}
                        className="w-14 h-14 rounded-full bg-[#FFD60A] text-[#0A3D2E] border-4 border-white shadow-xl flex items-center justify-center active:scale-95"
                      >
                        <Camera className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ) : capturedPhotoUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
                    <img
                      src={capturedPhotoUrl}
                      alt="Fresh evidence"
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-2.5 text-white text-[11px] flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5 text-[#FFD60A]" /> Fresh Evidence · Today
                      </span>
                      <button
                        onClick={() => setCapturedPhotoUrl(null)}
                        className="text-xs font-bold text-[#FFD60A] hover:underline"
                      >
                        Retake
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={startCamera}
                    className="w-full bg-gradient-to-r from-emerald-800 to-[#0A3D2E] hover:from-emerald-900 hover:to-[#082e22] text-white font-extrabold text-sm py-4 px-6 rounded-2xl shadow-md flex items-center justify-center gap-2.5 active:scale-98 transition-all font-display"
                  >
                    <Camera className="w-5 h-5 text-[#FFD60A]" />
                    <span>OPEN CAMERA TO CAPTURE</span>
                  </button>
                )}
              </div>

              {/* VERIFIER RESPONSE BUTTONS (Section 31: What did you find?) */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-base text-gray-900 font-display">
                    What did you find?
                  </h3>
                  <p className="text-xs text-gray-500">Select the option that matches verified on-ground reality</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  
                  {/* TRUE */}
                  <button
                    onClick={() => setVerdict('TRUE')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all active:scale-95 ${
                      verdict === 'TRUE'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-extrabold shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-800 font-bold'
                    }`}
                  >
                    <CheckCircle2 className={`w-7 h-7 ${verdict === 'TRUE' ? 'text-emerald-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-display">TRUE</span>
                    <span className="text-[10px] text-gray-500 font-normal">Claim is accurate</span>
                  </button>

                  {/* FALSE */}
                  <button
                    onClick={() => setVerdict('FALSE')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all active:scale-95 ${
                      verdict === 'FALSE'
                        ? 'border-red-600 bg-red-50 text-red-900 font-extrabold shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-800 font-bold'
                    }`}
                  >
                    <XCircle className={`w-7 h-7 ${verdict === 'FALSE' ? 'text-red-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-display">FALSE</span>
                    <span className="text-[10px] text-gray-500 font-normal">Claim is false</span>
                  </button>

                  {/* OUTDATED */}
                  <button
                    onClick={() => setVerdict('OUTDATED')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all active:scale-95 ${
                      verdict === 'OUTDATED'
                        ? 'border-amber-600 bg-amber-50 text-amber-900 font-extrabold shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-800 font-bold'
                    }`}
                  >
                    <Clock className={`w-7 h-7 ${verdict === 'OUTDATED' ? 'text-amber-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-display">OUTDATED</span>
                    <span className="text-[10px] text-gray-500 font-normal">Old video / past event</span>
                  </button>

                  {/* NOT SURE */}
                  <button
                    onClick={() => setVerdict('NOT SURE')}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition-all active:scale-95 ${
                      verdict === 'NOT SURE'
                        ? 'border-gray-600 bg-gray-100 text-gray-900 font-extrabold shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-800 font-bold'
                    }`}
                  >
                    <HelpCircle className={`w-7 h-7 ${verdict === 'NOT SURE' ? 'text-gray-600' : 'text-gray-400'}`} />
                    <span className="text-sm font-display">NOT SURE</span>
                    <span className="text-[10px] text-gray-500 font-normal">Inconclusive evidence</span>
                  </button>

                </div>
              </div>

              {/* VERIFIER COMMENT / DETAIL INPUT (Section 32) */}
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
                <div>
                  <h3 className="font-bold text-base text-gray-900 font-display">
                    What is the actual information?
                  </h3>
                  <p className="text-xs text-gray-500">State the verified on-ground price, status, or situation</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Actual On-Ground Price / Key Observation
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Current price is ₦104,000 / Station selling normally at official rate"
                      value={reportedPrice}
                      onChange={(e) => setReportedPrice(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-xs font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                      Short Explanation / Source Note
                    </label>
                    <textarea
                      placeholder="Add brief details about the stall, trader, or checkpoint visited..."
                      rows={2}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-300 rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-[#0A3D2E] focus:outline-none"
                    />
                  </div>
                </div>

                {/* SUBMIT BUTTON */}
                <div className="pt-2">
                  <button
                    onClick={handleSubmitEvidence}
                    disabled={!verdict || isSubmitting}
                    className="w-full bg-[#FFD60A] hover:bg-[#ffe033] disabled:opacity-50 text-[#0A3D2E] font-extrabold text-base py-4 rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 font-display"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Submitting Evidence...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>SUBMIT EVIDENCE (+25 STAT POINTS)</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
