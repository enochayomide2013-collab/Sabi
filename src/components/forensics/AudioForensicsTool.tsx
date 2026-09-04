import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  FileAudio, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Activity, 
  Clock, 
  CheckCircle2, 
  HelpCircle, 
  Upload, 
  Crown, 
  Radio, 
  Zap, 
  BarChart2, 
  Info,
  RotateCcw,
  Sliders,
  Share2
} from 'lucide-react';
import { UserProfile } from '../../types';
import { ForensicReportShare } from './ForensicReportShare';

interface AudioForensicsToolProps {
  user: UserProfile;
  onNavigate?: (tab: string, extraData?: any) => void;
  onShowToast?: (points: number, message: string) => void;
}

interface AudioSample {
  id: string;
  name: string;
  source: string;
  durationSeconds: number;
  verdict: 'Likely Authentic Voice Note' | 'Potential AI Voice Clone' | 'Spliced / Edited Audio';
  verdictRiskLevel: 'safe' | 'danger' | 'warning';
  confidenceScore: number;
  syntheticProbability: number;
  acousticConsistencyScore: number;
  audioCadenceScore: number;
  splicingPointsCount: number;
  backgroundProfile: string;
  summary: string;
  technicalIndicators: Array<{ name: string; observation: string; risk: 'safe' | 'warning' | 'danger' }>;
  guidanceText: string;
  waveformData: number[];
}

const SAMPLE_VOICE_NOTES: AudioSample[] = [
  {
    id: 'sample-1',
    name: 'Viral WhatsApp Voice Memo: Fuel Price Emergency Hike',
    source: 'WhatsApp Forward (Circulating in Lagos)',
    durationSeconds: 18,
    verdict: 'Potential AI Voice Clone',
    verdictRiskLevel: 'danger',
    confidenceScore: 94,
    syntheticProbability: 89,
    acousticConsistencyScore: 32,
    audioCadenceScore: 41,
    splicingPointsCount: 3,
    backgroundProfile: 'Unnatural Room Silence (Zero Ambient Noise Baseline)',
    summary: 'Acoustic spectrum analysis detected robotic formants, missing natural breath pauses, and a completely flat background noise floor characteristic of neural text-to-speech synthesis.',
    technicalIndicators: [
      { name: 'Neural Speech Formants', observation: 'Over-smoothed frequency transitions in upper harmonics', risk: 'danger' },
      { name: 'Breath Pause Density', observation: '0 breath sounds detected across 18 seconds of rapid speech', risk: 'danger' },
      { name: 'Background Noise Floor', observation: 'Digital silence (-90dB) beneath voice signal, typical of ElevenLabs synthesis', risk: 'danger' },
      { name: 'Phase Glitches', observation: '3 micro-discontinuities at frame boundaries', risk: 'warning' }
    ],
    guidanceText: 'Do not forward this voice note on WhatsApp. Compare with official NNPCL press releases before taking financial decisions.',
    waveformData: [12, 45, 78, 65, 89, 95, 40, 20, 85, 90, 70, 30, 15, 60, 80, 95, 88, 50, 25, 75, 92, 85, 40, 10, 65, 88, 92, 60, 30, 80, 95, 70]
  },
  {
    id: 'sample-2',
    name: 'Authentic Audio Memo: Kano Market Trade Association Announcement',
    source: 'Verified WhatsApp Community Group (Kano)',
    durationSeconds: 24,
    verdict: 'Likely Authentic Voice Note',
    verdictRiskLevel: 'safe',
    confidenceScore: 96,
    syntheticProbability: 6,
    acousticConsistencyScore: 92,
    audioCadenceScore: 89,
    splicingPointsCount: 0,
    backgroundProfile: 'Genuine Outdoor Ambient (Market Chatter & Distant Generator Hum)',
    summary: 'Organic acoustic signature verified with natural human vocal jitter, chest resonance, breath pauses, and consistent ambient background noise across the entire recording.',
    technicalIndicators: [
      { name: 'Acoustic Background', observation: 'Continuous ~45dB ambient noise floor with spatial reverberation', risk: 'safe' },
      { name: 'Vocal Micro-Jitter', observation: 'Normal human vocal cord frequency micro-variations present', risk: 'safe' },
      { name: 'Temporal Phase', observation: 'Unbroken phase alignment with zero frame splicing artifacts', risk: 'safe' }
    ],
    guidanceText: 'Audio matches authentic vocal dynamics. Originates from verified association leader in Sabon Gari Market.',
    waveformData: [25, 50, 40, 65, 70, 55, 80, 60, 45, 75, 85, 60, 50, 70, 65, 80, 75, 50, 40, 60, 75, 80, 65, 45, 55, 70, 60, 50, 40, 65, 50, 30]
  },
  {
    id: 'sample-3',
    name: 'Edited Audio Recording: Political Rally Excerpt Splicing',
    source: 'Twitter (X) Audio Clip (Viral Post)',
    durationSeconds: 15,
    verdict: 'Spliced / Edited Audio',
    verdictRiskLevel: 'warning',
    confidenceScore: 88,
    syntheticProbability: 35,
    acousticConsistencyScore: 48,
    audioCadenceScore: 52,
    splicingPointsCount: 4,
    backgroundProfile: 'Abrupt Background Noise Jumps (Crowd Noise Cut Mid-Sentence)',
    summary: 'While the voice is genuine, two separate sentences have been spliced out of order, creating a misleading sentence structure that alters the speaker\'s original meaning.',
    technicalIndicators: [
      { name: 'Acoustic Environment Jump', observation: 'Abrupt 12dB drop in crowd background noise at timestamp 0:07', risk: 'danger' },
      { name: 'Sentence Pitch Discontinuity', observation: 'Unnatural fundamental frequency (F0) jump from 140Hz to 210Hz', risk: 'warning' },
      { name: 'Audio Edit Crossfades', observation: '4 mechanical crossfade envelopes detected', risk: 'warning' }
    ],
    guidanceText: 'This audio has been manipulated through selective editing. Request full unedited video footage before citing.',
    waveformData: [35, 70, 85, 90, 40, 10, 85, 90, 30, 20, 80, 95, 20, 10, 70, 85, 90, 40, 10, 75, 90, 80, 30, 10, 60, 80, 75, 30, 15, 50, 40, 20]
  }
];

export const AudioForensicsTool: React.FC<AudioForensicsToolProps> = ({
  user,
  onNavigate,
  onShowToast
}) => {
  const isDeluxe = user.userTier === 'Deluxe' || user.role === 'admin';

  const [selectedSample, setSelectedSample] = useState<AudioSample>(SAMPLE_VOICE_NOTES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackProgress, setPlaybackProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'spectrogram' | 'telemetry'>('overview');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);

  const playbackTimerRef = useRef<any>(null);
  const recordTimerRef = useRef<any>(null);

  // Playback Simulation Effect
  useEffect(() => {
    if (isPlaying) {
      playbackTimerRef.current = setInterval(() => {
        setPlaybackProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 2;
        });
      }, (selectedSample.durationSeconds * 1000) / 50);
    } else {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    }
    return () => {
      if (playbackTimerRef.current) clearInterval(playbackTimerRef.current);
    };
  }, [isPlaying, selectedSample]);

  // Audio Recording Simulation Effect
  useEffect(() => {
    if (isRecording) {
      recordTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
    };
  }, [isRecording]);

  const handleSelectSample = (sample: AudioSample) => {
    setIsPlaying(false);
    setPlaybackProgress(0);
    setSelectedSample(sample);
    setIsAnalyzing(true);
    setAnalysisComplete(false);

    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      onShowToast?.(5, `Audio spectrum analysis completed for ${sample.name}`);
    }, 1200);
  };

  const handleSimulateRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setIsAnalyzing(true);
      setAnalysisComplete(false);
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisComplete(true);
        onShowToast?.(10, 'Live voice memo captured and analyzed!');
      }, 1500);
    } else {
      setIsRecording(true);
    }
  };

  const getVerdictBadgeClass = () => {
    if (selectedSample.verdictRiskLevel === 'safe') {
      return 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
    }
    if (selectedSample.verdictRiskLevel === 'danger') {
      return 'bg-rose-950 text-rose-300 border-rose-500/40';
    }
    return 'bg-amber-950 text-amber-300 border-amber-500/40';
  };

  return (
    <div className="space-y-6" id="audio-forensics-tool-component">
      
      {/* Top Header Box */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black rounded-3xl p-6 text-white border border-gray-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0A3D2E] text-[#FFD60A] border border-[#FFD60A]/30 flex items-center justify-center shrink-0 shadow-md">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-display text-white tracking-wide">
                  WhatsApp Voice Note & Audio Forensics
                </h3>
                <span className="bg-[#FFD60A] text-[#0A3D2E] text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full">
                  DELUXE TOOL
                </span>
              </div>
              <p className="text-xs text-gray-300">
                Analyze viral voice notes, WhatsApp audio memos, and speech recordings for AI voice cloning (ElevenLabs), audio splicing, and acoustic room signatures.
              </p>
            </div>
          </div>

          {/* Quick Record Button */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={handleSimulateRecording}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold font-display flex items-center gap-2 border transition-all cursor-pointer shadow-md ${
                isRecording
                  ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-400 animate-pulse'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700'
              }`}
            >
              <Mic className={`w-4 h-4 ${isRecording ? 'text-white' : 'text-rose-400'}`} />
              <span>{isRecording ? `Recording... (${recordingSeconds}s)` : 'Capture Audio Memo'}</span>
            </button>
          </div>
        </div>

        {/* Sample Voice Notes Carousel Selector */}
        <div className="space-y-2 pt-2 border-t border-gray-800">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block font-display">
            Select Sample Voice Note or Upload File:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SAMPLE_VOICE_NOTES.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => handleSelectSample(sample)}
                className={`p-3 rounded-2xl text-left transition-all border cursor-pointer ${
                  selectedSample.id === sample.id
                    ? 'bg-[#0A3D2E] text-white border-[#FFD60A] shadow-md'
                    : 'bg-black/60 text-gray-300 border-gray-800 hover:border-gray-700 hover:bg-gray-900'
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-[11px] font-bold mb-1">
                  <span className="truncate text-[#FFD60A]">{sample.source}</span>
                  <span className="text-[10px] text-gray-400 shrink-0">{sample.durationSeconds}s</span>
                </div>
                <div className="text-xs font-semibold text-white line-clamp-1 mb-1">
                  {sample.name}
                </div>
                <div className="text-[10px] font-mono text-gray-400 flex items-center justify-between">
                  <span>Synthetic Risk: {sample.syntheticProbability}%</span>
                  <span className={sample.verdictRiskLevel === 'danger' ? 'text-rose-400 font-bold' : sample.verdictRiskLevel === 'safe' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {sample.verdictRiskLevel === 'danger' ? 'AI CLONE' : sample.verdictRiskLevel === 'safe' ? 'AUTHENTIC' : 'EDITED'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Waveform Player & Real-time Spectral HUD */}
      <div className="bg-gray-950 rounded-3xl p-6 text-white border border-gray-800 shadow-xl space-y-5">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-4">
          <div>
            <span className="text-xs text-[#FFD60A] font-mono font-bold uppercase tracking-wider block">
              Active Audio Spectrum Analyzer
            </span>
            <h4 className="text-base font-bold text-white font-display">
              {selectedSample.name}
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5 ${getVerdictBadgeClass()}`}>
              {selectedSample.verdictRiskLevel === 'safe' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : selectedSample.verdictRiskLevel === 'danger' ? (
                <AlertTriangle className="w-4 h-4 text-rose-400" />
              ) : (
                <HelpCircle className="w-4 h-4 text-amber-400" />
              )}
              <span>{selectedSample.verdict}</span>
            </span>
          </div>
        </div>

        {/* Audio Waveform Visualization Canvas / Bars */}
        <div className="bg-black border border-gray-800 rounded-2xl p-5 space-y-4 relative overflow-hidden">
          
          <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
            <div className="flex items-center gap-2">
              <Radio className={`w-4 h-4 ${isPlaying ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`} />
              <span>SPECTRAL HARMONICS ENGINE · 44.1 kHz 16-BIT PCM</span>
            </div>
            <span>
              {Math.floor((playbackProgress / 100) * selectedSample.durationSeconds)}s / {selectedSample.durationSeconds}s
            </span>
          </div>

          {/* Waveform Equalizer Bars */}
          <div className="h-28 flex items-center justify-between gap-1 px-2 pt-2 pb-1 relative">
            {selectedSample.waveformData.map((height, idx) => {
              const isActive = (idx / selectedSample.waveformData.length) * 100 <= playbackProgress;
              const isAnomaly = selectedSample.verdictRiskLevel === 'danger' && idx > 12 && idx < 18;
              return (
                <div key={idx} className="flex-1 h-full flex items-end justify-center group relative">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-150 ${
                      isAnomaly
                        ? 'bg-rose-500 border-t-2 border-rose-300'
                        : isActive
                        ? 'bg-[#FFD60A]'
                        : 'bg-gray-800 group-hover:bg-gray-700'
                    }`}
                    style={{
                      height: `${isPlaying ? Math.min(100, Math.max(15, height + (Math.sin(idx + playbackProgress) * 20))) : height}%`
                    }}
                  />
                </div>
              );
            })}

            {/* Scrubber Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)] z-10 transition-all duration-75"
              style={{ left: `${playbackProgress}%` }}
            />
          </div>

          {/* Player Controls Bar */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-gray-800/80">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-xl bg-[#0A3D2E] hover:bg-[#0d4f3b] text-[#FFD60A] border border-[#FFD60A]/40 flex items-center justify-center transition-all cursor-pointer shadow-md"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => setPlaybackProgress(0)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all cursor-pointer"
                title="Reset Playback"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Real-time Telemetry Metrics */}
            <div className="flex items-center gap-3 text-[11px] font-mono text-gray-300">
              <div className="hidden sm:flex items-center gap-1.5 bg-gray-900 px-2.5 py-1 rounded-lg border border-gray-800">
                <span className="text-gray-400">Pitch Jitter:</span>
                <span className="font-bold text-white">0.04 Hz</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-gray-900 px-2.5 py-1 rounded-lg border border-gray-800">
                <span className="text-gray-400">Background Noise:</span>
                <span className={selectedSample.verdictRiskLevel === 'danger' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                  {selectedSample.verdictRiskLevel === 'danger' ? '-90 dB (Flat)' : '-45 dB (Organic)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Forensic Scores Matrix Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-3.5 space-y-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block">
              AI Voice Clone Risk
            </span>
            <div className="flex items-baseline justify-between">
              <span className={`text-xl font-extrabold font-mono ${selectedSample.syntheticProbability > 70 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {selectedSample.syntheticProbability}%
              </span>
              <span className="text-[10px] text-gray-500 font-mono">ElevenLabs / VITS</span>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${selectedSample.syntheticProbability > 70 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${selectedSample.syntheticProbability}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-3.5 space-y-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block">
              Acoustic Floor Score
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold font-mono text-white">
                {selectedSample.acousticConsistencyScore}/100
              </span>
              <span className="text-[10px] text-gray-500 font-mono">Room Signature</span>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${selectedSample.acousticConsistencyScore}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-3.5 space-y-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block">
              Cadence & Breath Sync
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-extrabold font-mono text-white">
                {selectedSample.audioCadenceScore}/100
              </span>
              <span className="text-[10px] text-gray-500 font-mono">Micro-pauses</span>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${selectedSample.audioCadenceScore}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-3.5 space-y-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block">
              Splicing Cut Points
            </span>
            <div className="flex items-baseline justify-between">
              <span className={`text-xl font-extrabold font-mono ${selectedSample.splicingPointsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {selectedSample.splicingPointsCount} Cuts
              </span>
              <span className="text-[10px] text-gray-500 font-mono">Frame Jumps</span>
            </div>
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${selectedSample.splicingPointsCount > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${Math.min(100, selectedSample.splicingPointsCount * 25)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Technical Findings List */}
        <div className="space-y-3 bg-gray-900 p-4 rounded-2xl border border-gray-800">
          <span className="text-xs font-bold text-gray-300 font-display uppercase tracking-wider block">
            Key Acoustic Findings & Signals
          </span>
          <div className="space-y-2">
            {selectedSample.technicalIndicators.map((indicator, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs bg-black/50 p-2.5 rounded-xl border border-gray-800">
                {indicator.risk === 'danger' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : indicator.risk === 'warning' ? (
                  <Activity className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold text-white">{indicator.name}: </span>
                  <span className="text-gray-300">{indicator.observation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integrated Native & Social Share Component */}
        <ForensicReportShare
          reportType="general"
          fileName={selectedSample.name}
          verdict={selectedSample.verdict}
          verdictRiskLevel={selectedSample.verdictRiskLevel}
          confidence={`${selectedSample.confidenceScore}% Certainty`}
          confidenceScore={selectedSample.confidenceScore}
          summary={selectedSample.summary}
          keyIndicators={selectedSample.technicalIndicators}
          guidanceText={selectedSample.guidanceText}
          technicalDetails={[
            { label: 'Synthetic Voice Probability', value: `${selectedSample.syntheticProbability}%` },
            { label: 'Acoustic Background Profile', value: selectedSample.backgroundProfile },
            { label: 'Cadence Score', value: `${selectedSample.audioCadenceScore}/100` },
            { label: 'Splicing Anomaly Count', value: `${selectedSample.splicingPointsCount} edit points` }
          ]}
          onShowToast={onShowToast}
        />

      </div>

    </div>
  );
};
