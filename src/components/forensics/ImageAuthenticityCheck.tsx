import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ShieldCheck, 
  FileText, 
  Sparkles, 
  RefreshCw, 
  Lock, 
  Crown, 
  ExternalLink, 
  Share2, 
  Info, 
  ZoomIn, 
  Camera, 
  Layers, 
  Activity, 
  Cpu, 
  ArrowRight,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { UserProfile, ImageAuthenticityResult, ForensicTechnicalIndicator } from '../../types';
import { extractImageProperties, ClientImageExtraction } from '../../utils/forensicExtractors';
import { ForensicReportShare } from './ForensicReportShare';

interface ImageAuthenticityCheckProps {
  user: UserProfile;
  onNavigate?: (tab: string, extraData?: any) => void;
  onShowToast?: (points: number, message: string) => void;
}

const SAMPLE_PRESETS = [
  {
    name: 'Authentic Market Photo (Lagos)',
    description: 'Clean camera photograph with natural ambient sunlight and optical focus.',
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=900&auto=format&fit=crop&q=80',
    type: 'authentic'
  },
  {
    name: 'Diffusion AI Generated City',
    description: 'Synthetic generative landscape with characteristic texture smoothing.',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80',
    type: 'ai_sample'
  },
  {
    name: 'Social Media Forwarded Notice',
    description: 'Compressed screenshot with stripped EXIF and recompression grid.',
    url: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f0?w=900&auto=format&fit=crop&q=80',
    type: 'screenshot'
  }
];

export const ImageAuthenticityCheck: React.FC<ImageAuthenticityCheckProps> = ({
  user,
  onNavigate,
  onShowToast
}) => {
  const isDeluxe = user.userTier === 'Deluxe' || user.role === 'admin';

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedClientData, setExtractedClientData] = useState<ClientImageExtraction | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<ImageAuthenticityResult | null>(null);
  const [activeTab, setActiveTab] = useState<'verdict' | 'indicators' | 'metadata' | 'tests'>('verdict');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // If user is not Deluxe, show the Deluxe unlock gatekeeper
  if (!isDeluxe) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-sm text-center space-y-6 max-w-2xl mx-auto animate-fade-in" id="image-authenticity-locked">
        <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-900 border border-purple-300 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8 text-purple-800" />
        </div>

        <div className="inline-flex items-center gap-1.5 bg-[#FFD60A] text-[#0A3D2E] text-xs font-mono font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
          <Crown className="w-3.5 h-3.5" />
          <span>Deluxe Title Exclusive Forensic Tool</span>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 font-display">
            Image Authenticity Checks
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
            Deep forensic analysis for uploaded images to detect AI generation, editing, copy-move splicing, and compression anomalies before submitting or accepting evidence.
          </p>
        </div>

        <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200 text-xs text-purple-950 text-left space-y-2 max-w-md mx-auto">
          <strong className="block font-bold text-purple-900">What Image Authenticity Checks provides:</strong>
          <ul className="space-y-1.5 text-[11px] text-purple-900/90 list-disc list-inside">
            <li>Neural diffusion & synthetic AI generation pattern scan</li>
            <li>Error Level Analysis (ELA) and edge haloing detection</li>
            <li>Metadata & EXIF integrity evaluation (without false assumptions)</li>
            <li>Clear verdicts: <strong>Likely Authentic</strong>, <strong>Potentially Manipulated</strong>, or <strong>Inconclusive</strong></li>
          </ul>
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => onNavigate && onNavigate('profile')}
            className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer font-display"
          >
            <Crown className="w-4 h-4 text-[#FFD60A]" />
            <span>Upgrade to Deluxe Title in Store</span>
          </button>
        </div>
      </div>
    );
  }

  const handleFileDrop = async (file: File) => {
    setErrorMessage(null);
    setResult(null);
    setSelectedFile(file);
    setIsProcessing(true);

    try {
      setAnalysisStep('1/5: Validating image binary and headers...');
      const clientData = await extractImageProperties(file);
      setExtractedClientData(clientData);

      setAnalysisStep('2/5: Extracting EXIF and canvas dimensions...');
      await new Promise(r => setTimeout(r, 400));

      setAnalysisStep('3/5: Calculating noise entropy & edge gradients...');
      await new Promise(r => setTimeout(r, 400));

      setAnalysisStep('4/5: Running neural authenticity & manipulation scan...');

      // Call backend API
      const response = await fetch('/api/forensics/image-authenticity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: clientData.base64Data,
          mimeType: clientData.mimeType,
          fileName: clientData.fileName,
          fileSizeBytes: clientData.fileSizeBytes,
          clientProperties: {
            hasExif: clientData.hasExif,
            exifData: clientData.exifData,
            dimensions: clientData.dimensions,
            entropyScore: clientData.entropyScore,
            sharpnessVariance: clientData.sharpnessVariance
          }
        })
      });

      setAnalysisStep('5/5: Synthesizing forensic report...');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `Server responded with status ${response.status}`);
      }

      const forensicData: ImageAuthenticityResult = await response.json();
      setResult(forensicData);

      if (onShowToast) {
        onShowToast(15, `Image Authenticity check complete: ${forensicData.verdict}`);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to analyze the image. Please try another file.');
    } finally {
      setIsProcessing(false);
      setAnalysisStep('');
    }
  };

  const handlePresetSelect = async (presetUrl: string, name: string) => {
    setErrorMessage(null);
    setResult(null);
    setIsProcessing(true);
    setAnalysisStep('Fetching sample image for forensic check...');

    try {
      const res = await fetch(presetUrl);
      const blob = await res.blob();
      const file = new File([blob], `${name.toLowerCase().replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });
      await handleFileDrop(file);
    } catch {
      setErrorMessage('Could not load preset sample. Please try uploading a local image.');
      setIsProcessing(false);
      setAnalysisStep('');
    }
  };

  const getVerdictBadge = (verdict: ImageAuthenticityResult['verdict']) => {
    switch (verdict) {
      case 'Likely Authentic':
        return {
          bg: 'bg-emerald-100 text-emerald-950 border-emerald-300',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-700" />,
          label: 'Likely Authentic',
          sub: 'No significant technical anomalies detected.'
        };
      case 'Potentially Manipulated':
        return {
          bg: 'bg-rose-100 text-rose-950 border-rose-300',
          icon: <AlertTriangle className="w-5 h-5 text-rose-700" />,
          label: 'Potentially Manipulated',
          sub: 'Technical signals suggest possible editing or AI synthesis.'
        };
      case 'Inconclusive':
      default:
        return {
          bg: 'bg-blue-100 text-blue-950 border-blue-300',
          icon: <HelpCircle className="w-5 h-5 text-blue-700" />,
          label: 'Inconclusive',
          sub: 'Available technical evidence is insufficient for a definitive assessment.'
        };
    }
  };

  const getRiskPill = (risk: ForensicTechnicalIndicator['risk']) => {
    switch (risk) {
      case 'high':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'medium':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'low':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-900 border-blue-300';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200 shadow-sm space-y-6" id="image-authenticity-tool">
      
      {/* Tool Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#0A3D2E] text-[#FFD60A] flex items-center justify-center shadow-xs font-black shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900 font-display">
                Image Authenticity Checks
              </h3>
              <span className="bg-[#FFD60A] text-[#0A3D2E] text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 font-mono">
                <Crown className="w-3 h-3" />
                <span>Deluxe Unlocked</span>
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Forensic inspection for AI synthesis, splicing, and camera metadata integrity without false bias.
            </p>
          </div>
        </div>

        {result && (
          <button
            onClick={() => {
              setResult(null);
              setSelectedFile(null);
              setExtractedClientData(null);
              setErrorMessage(null);
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check Another Image</span>
          </button>
        )}
      </div>

      {/* ERROR BANNER */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-1 animate-fade-in flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="block font-bold text-rose-950">Image Processing Error</strong>
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* UPLOAD & DROPZONE AREA (If not currently showing completed results) */}
      {!result && !isProcessing && (
        <div className="space-y-4">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileDrop(e.dataTransfer.files[0]);
              }
            }}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-[#0A3D2E] bg-emerald-50/50 scale-[0.99]'
                : 'border-gray-300 hover:border-emerald-500 bg-gray-50/70 hover:bg-emerald-50/20'
            }`}
            onClick={() => document.getElementById('image-forensic-input')?.click()}
          >
            <input
              type="file"
              id="image-forensic-input"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif,image/bmp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileDrop(e.target.files[0]);
                }
              }}
            />

            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 text-[#0A3D2E] flex items-center justify-center mx-auto shadow-xs mb-3">
              <Upload className="w-6 h-6" />
            </div>

            <h4 className="text-sm sm:text-base font-extrabold text-gray-900 font-display">
              Drag & Drop Image or Click to Upload
            </h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 leading-relaxed">
              Supports JPEG, PNG, WEBP, and AVIF up to 25MB. Analyzes technical markers, noise profiles, and metadata.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 text-[11px] font-bold text-[#0A3D2E] bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>SABI Safe Forensic Sandbox · Zero Data Leakage</span>
            </div>
          </div>

          {/* Quick Preset Samples */}
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              Or test with sample image:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {SAMPLE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetSelect(p.url, p.name)}
                  className="p-3 bg-white hover:bg-gray-50 border border-gray-200 hover:border-emerald-300 rounded-2xl text-left transition-all cursor-pointer space-y-1 group shadow-2xs"
                >
                  <div className="flex items-center justify-between text-xs">
                    <strong className="font-bold text-gray-900 group-hover:text-[#0A3D2E] transition-colors line-clamp-1">
                      {p.name}
                    </strong>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#0A3D2E] transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-2 leading-tight">
                    {p.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE LOADING / PROGRESS STATE */}
      {isProcessing && (
        <div className="p-8 sm:p-12 bg-gray-50 rounded-3xl border border-gray-200 text-center space-y-5 animate-fade-in">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-[#0A3D2E] animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#0A3D2E]" />
            </div>
          </div>

          <div className="space-y-1.5 max-w-sm mx-auto">
            <h4 className="font-extrabold text-sm sm:text-base text-gray-900 font-display">
              Analyzing Image Authenticity...
            </h4>
            <p className="text-xs text-emerald-800 font-medium animate-pulse font-mono">
              {analysisStep || 'Evaluating forensic signals...'}
            </p>
          </div>

          <div className="max-w-xs mx-auto bg-gray-200 h-2 rounded-full overflow-hidden">
            <div className="bg-[#0A3D2E] h-full animate-pulse w-3/4 rounded-full"></div>
          </div>
        </div>
      )}

      {/* COMPREHENSIVE ANALYSIS RESULTS DOSSIER */}
      {result && extractedClientData && (
        <div className="space-y-6 animate-scale-up" id="image-authenticity-results">
          
          {/* Top Result Banner */}
          {(() => {
            const badge = getVerdictBadge(result.verdict);
            return (
              <div className={`rounded-3xl p-5 sm:p-6 border-2 shadow-xs space-y-3 ${badge.bg}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xs shrink-0">
                      {badge.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          Forensic Assessment
                        </span>
                        <span className="bg-white/80 px-2 py-0.5 rounded-full text-[10px] font-black border">
                          Confidence: {result.confidence} ({result.confidenceScore}%)
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-black font-display tracking-tight text-gray-900">
                        {badge.label}
                      </h3>
                    </div>
                  </div>

                  <div className="text-left sm:text-right text-xs">
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">File Inspected</span>
                    <strong className="font-mono text-gray-900 text-[11px] truncate block max-w-[200px]">
                      {extractedClientData.fileName}
                    </strong>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed bg-white/70 p-3.5 rounded-2xl border border-black/5">
                  <strong>Analysis Summary:</strong> {result.summary}
                </p>
              </div>
            );
          })()}

          {/* Visual Preview & Quick Metadata Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Image Preview Box */}
            <div className="md:col-span-1 rounded-2xl overflow-hidden border border-gray-200 bg-black/90 aspect-square flex items-center justify-center relative group">
              <img
                src={extractedClientData.previewDataUrl}
                alt="Inspected File"
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-1 rounded-lg">
                {extractedClientData.dimensions.width} × {extractedClientData.dimensions.height} ({extractedClientData.dimensions.aspectRatio})
              </div>
            </div>

            {/* Quick Properties Table */}
            <div className="md:col-span-2 bg-gray-50 rounded-2xl p-4 border border-gray-200 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 font-display flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#0A3D2E]" />
                  <span>Image Hardware & Technical Properties</span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Resolution</span>
                    <strong className="font-bold text-gray-900">{extractedClientData.dimensions.megapixels} MP</strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">File Size</span>
                    <strong className="font-bold text-gray-900">{extractedClientData.fileSizeFormatted}</strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">EXIF Metadata</span>
                    <strong className={`font-bold ${extractedClientData.hasExif ? 'text-emerald-800' : 'text-gray-600'}`}>
                      {extractedClientData.hasExif ? 'Present' : 'Not Present'}
                    </strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Entropy Spread</span>
                    <strong className="font-bold text-gray-900">{extractedClientData.entropyScore} / 100</strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">Sharpness / Noise</span>
                    <strong className="font-bold text-gray-900">{extractedClientData.sharpnessVariance} / 100</strong>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                    <span className="text-[10px] text-gray-400 uppercase font-bold block">MIME Container</span>
                    <strong className="font-bold text-gray-900 font-mono text-[11px]">{extractedClientData.mimeType}</strong>
                  </div>
                </div>
              </div>

              {/* Social Media Warning Note */}
              {!extractedClientData.hasExif && (
                <div className="p-2.5 bg-blue-50 rounded-xl border border-blue-200 flex items-start gap-2 text-[11px] text-blue-950">
                  <Info className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
                  <p>
                    <strong>Metadata note:</strong> EXIF tags are absent. This is standard behavior for screenshots or images forwarded on WhatsApp, X, and Facebook, and is <strong>not</strong> treated as proof of tampering.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Tab Navigation for In-Depth Findings */}
          <div className="flex border-b border-gray-200 bg-gray-50 px-3 pt-2 rounded-2xl gap-2 text-xs font-bold font-display">
            <button
              onClick={() => setActiveTab('verdict')}
              className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'verdict'
                  ? 'border-[#0A3D2E] text-[#0A3D2E]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Technical Indicators ({result.technicalIndicators.length})
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'tests'
                  ? 'border-[#0A3D2E] text-[#0A3D2E]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Forensic Tests Breakdown
            </button>
            <button
              onClick={() => setActiveTab('metadata')}
              className={`py-2 px-3 border-b-2 transition-all cursor-pointer ${
                activeTab === 'metadata'
                  ? 'border-[#0A3D2E] text-[#0A3D2E]'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              Fact-Checker Guidance
            </button>
          </div>

          {/* TAB 1: TECHNICAL INDICATORS */}
          {activeTab === 'verdict' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-500 font-display">
                  Detected Technical Signals & Explanations
                </h4>
                <span className="text-[11px] text-gray-500">
                  Plain language breakdown for community verifiers
                </span>
              </div>

              <div className="space-y-2.5">
                {result.technicalIndicators.map((ind, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gray-50 hover:bg-gray-100/80 rounded-2xl border border-gray-200 space-y-2 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase border ${getRiskPill(ind.risk)}`}>
                          {ind.risk} Risk
                        </span>
                        <strong className="font-bold text-gray-900 text-xs sm:text-sm font-display">
                          {ind.name}
                        </strong>
                      </div>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-md font-mono text-gray-500 border border-gray-200 uppercase">
                        {ind.category}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                      <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Observation</span>
                        <p className="text-gray-800 font-medium leading-relaxed">{ind.observation}</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-xl border border-gray-200">
                        <span className="text-[10px] text-gray-400 uppercase font-bold block">Plain Meaning</span>
                        <p className="text-gray-700 leading-relaxed">{ind.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: FORENSIC TESTS */}
          {activeTab === 'tests' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="font-bold text-gray-900 font-display">Sensor Noise Consistency</strong>
                  <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-md text-[10px]">
                    Score: {result.forensicTests.noiseConsistency.score}/100
                  </span>
                </div>
                <p className="text-gray-700">{result.forensicTests.noiseConsistency.detail}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="font-bold text-gray-900 font-display">Compression & Grid Quantization</strong>
                  <span className="bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-md text-[10px]">
                    Score: {result.forensicTests.compressionArtifacts.score}/100
                  </span>
                </div>
                <p className="text-gray-700">{result.forensicTests.compressionArtifacts.detail}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="font-bold text-gray-900 font-display">Edge Splicing & Halos</strong>
                  <span className="bg-purple-100 text-purple-900 font-bold px-2 py-0.5 rounded-md text-[10px]">
                    Score: {result.forensicTests.edgeSplicing.score}/100
                  </span>
                </div>
                <p className="text-gray-700">{result.forensicTests.edgeSplicing.detail}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <strong className="font-bold text-gray-900 font-display">Synthetic AI Diffusion Artifacts</strong>
                  <span className={`font-bold px-2 py-0.5 rounded-md text-[10px] ${
                    result.forensicTests.aiGenerationArtifacts.detected
                      ? 'bg-rose-100 text-rose-900'
                      : 'bg-emerald-100 text-emerald-900'
                  }`}>
                    {result.forensicTests.aiGenerationArtifacts.detected ? 'Detected' : 'Not Detected'}
                  </span>
                </div>
                <p className="text-gray-700">{result.forensicTests.aiGenerationArtifacts.detail}</p>
              </div>
            </div>
          )}

          {/* TAB 3: GUIDANCE FOR FACT CHECKERS */}
          {activeTab === 'metadata' && (
            <div className="space-y-3 text-xs">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-800" />
                  <strong className="font-bold text-emerald-950 font-display text-sm">
                    Recommended Investigative Protocol for Verifiers
                  </strong>
                </div>
                <p className="text-emerald-900 leading-relaxed">
                  {result.guidanceForFactCheckers}
                </p>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-950 space-y-1 text-[11px]">
                <strong className="block font-bold">Standard Forensic Disclaimer:</strong>
                <p className="leading-relaxed">
                  {result.disclaimer}
                </p>
              </div>
            </div>
          )}

          {/* DELUXE FORENSIC REPORT SHARE COMPONENT */}
          <ForensicReportShare
            reportType="image"
            fileName={extractedClientData.fileName}
            thumbnailUrl={extractedClientData.previewDataUrl}
            verdict={result.verdict}
            verdictRiskLevel={
              result.verdict === 'Likely Authentic' ? 'safe' :
              result.verdict === 'Potentially Manipulated' ? 'danger' : 'warning'
            }
            confidence={result.confidence}
            confidenceScore={result.confidenceScore}
            summary={result.summary}
            keyIndicators={result.technicalIndicators.map(t => ({
              name: t.name,
              observation: t.observation,
              risk: t.risk
            }))}
            guidanceText={result.guidanceForFactCheckers}
            technicalDetails={[
              { label: 'Resolution', value: `${extractedClientData.dimensions.width}x${extractedClientData.dimensions.height} (${extractedClientData.dimensions.megapixels} MP)` },
              { label: 'File Size', value: extractedClientData.fileSizeFormatted },
              { label: 'EXIF Header', value: extractedClientData.hasExif ? 'Intact EXIF Metadata' : 'Stripped / Clean' },
              { label: 'Sensor Noise Consistency', value: `${result.forensicTests.noiseConsistency.score}/100 (${result.forensicTests.noiseConsistency.status})` },
              { label: 'Compression Grid Artifacts', value: `${result.forensicTests.compressionArtifacts.score}/100` },
              { label: 'Edge Splicing Risk', value: `${result.forensicTests.edgeSplicing.score}/100` },
              { label: 'AI Diffusion Synthesis', value: result.forensicTests.aiGenerationArtifacts.detected ? 'Positive Markers Detected' : 'No AI Synthesis Detected' }
            ]}
            onShowToast={onShowToast}
          />

        </div>
      )}

    </div>
  );
};
