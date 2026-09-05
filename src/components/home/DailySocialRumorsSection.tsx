import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Play, 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Share2, 
  ShieldCheck, 
  Eye, 
  ArrowRight,
  Sparkles,
  Layers,
  Filter
} from 'lucide-react';
import { TruthResult, AppLanguage } from '../../types';
import { storageService } from '../../services/storageService';
import { languageService } from '../../services/languageService';
import { rumorTranslationService } from '../../services/rumorTranslationService';

interface DailySocialRumorsSectionProps {
  truthResults: TruthResult[];
  onNavigate: (tab: string, extraData?: any) => void;
  onShowToast?: (points: number, message: string) => void;
}

export const DailySocialRumorsSection: React.FC<DailySocialRumorsSectionProps> = ({
  truthResults,
  onNavigate,
  onShowToast
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [lang, setLang] = useState<AppLanguage>(languageService.getLanguage());

  useEffect(() => {
    const unsub = languageService.subscribe((l) => setLang(l));
    return unsub;
  }, []);

  const t = languageService.getDictionary();

  // Curated list of today's social media rumors across TikTok, YouTube, Twitter, Instagram
  const rawTodaySocialRumors = [
    {
      id: 'rumor_insta_today_1',
      platform: 'instagram' as const,
      claim: 'Viral Instagram Reels alleging CBN issued new ₦5,000 banknote with portrait changes',
      sourceAccount: '@instablog9ja_updates',
      viralMetric: '1.4M views • 42k shares',
      location: 'Lagos & Abuja',
      result: 'FALSE' as const,
      timestamp: 'Today, 3 hours ago',
      evidenceSummary: 'CBN spokesperson confirmed no new currency denominations have been printed or authorized in 2026.',
      thumbnail: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=500&auto=format&fit=crop&q=80',
      mediaUrl: 'https://instagram.com/explore'
    },
    {
      id: 'rumor_tiktok_today_2',
      platform: 'tiktok' as const,
      claim: 'TikTok video claiming 50kg bag of foreign rice crashed to ₦32,000 in Bodija Market, Ibadan',
      sourceAccount: '@naija_market_gist',
      viralMetric: '890k views • 35k shares',
      location: 'Bodija, Oyo State',
      result: 'FALSE' as const,
      timestamp: 'Today, 5 hours ago',
      evidenceSummary: 'On-ground SABI spotters verified prevailing 50kg rice is ₦78,000 - ₦84,000 across Ibadan markets.',
      thumbnail: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80',
      mediaUrl: 'https://tiktok.com'
    },
    {
      id: 'rumor_twitter_today_3',
      platform: 'twitter' as const,
      claim: 'Trending X (Twitter) claim that Third Mainland Bridge is closed today due to structural repairs',
      sourceAccount: '@LagosTrafficAlerts',
      viralMetric: '450k impressions • 6.2k reposts',
      location: 'Lagos Mainland',
      result: 'FALSE' as const,
      timestamp: 'Today, 2 hours ago',
      evidenceSummary: 'Lagos State Ministry of Works and LASTMA confirmed bridge is fully open with smooth traffic flow.',
      thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=500&auto=format&fit=crop&q=80',
      mediaUrl: 'https://twitter.com'
    },
    {
      id: 'rumor_youtube_today_4',
      platform: 'youtube' as const,
      claim: 'YouTube documentary alleging massive chemical contamination in Kano tomato puree harvests',
      sourceAccount: 'Naija Agro Investigative TV',
      viralMetric: '310k views • 14k comments',
      location: 'Kano & Kaduna',
      result: 'OUTDATED MEDIA' as const,
      timestamp: 'Today, 6 hours ago',
      evidenceSummary: 'NAFDAC statement confirms video is recycled footage from a 2019 pesticide inspection case.',
      thumbnail: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
      mediaUrl: 'https://youtube.com'
    },
    {
      id: 'rumor_tiktok_today_5',
      platform: 'tiktok' as const,
      claim: 'TikTok audio memo claiming NNPC raised petrol pump price to ₦1,500/liter in Port Harcourt',
      sourceAccount: '@ph_city_vibes',
      viralMetric: '620k views • 28k shares',
      location: 'Port Harcourt, Rivers',
      result: 'FALSE' as const,
      timestamp: 'Today, 4 hours ago',
      evidenceSummary: 'NNPC retail outlets in PH and Rivers state are dispensing at official standard pump prices.',
      thumbnail: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=80',
      mediaUrl: 'https://tiktok.com'
    },
    {
      id: 'rumor_insta_today_6',
      platform: 'instagram' as const,
      claim: 'Instagram post showing free Federal Government educational tablets distributed to secondary students',
      sourceAccount: '@nigeria_edu_today',
      viralMetric: '520k views • 18k saves',
      location: 'Abuja & Nationwide',
      result: 'NEEDS MORE VERIFICATION' as const,
      timestamp: 'Today, 1 hour ago',
      evidenceSummary: 'Federal Ministry of Education pilot initiative is ongoing in select pilot schools; full rollout pending.',
      thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&auto=format&fit=crop&q=80',
      mediaUrl: 'https://instagram.com'
    }
  ];

  const todaySocialRumors = rumorTranslationService.localizeSocialRumors(rawTodaySocialRumors, lang);

  const filteredRumors = selectedPlatform === 'all' 
    ? todaySocialRumors 
    : todaySocialRumors.filter(r => r.platform === selectedPlatform);

  const getResultBadge = (result: string) => {
    switch (result) {
      case 'TRUE':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-700 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
            <CheckCircle2 className="w-3 h-3" /> TRUE
          </span>
        );
      case 'FALSE':
        return (
          <span className="inline-flex items-center gap-1 bg-red-700 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
            <XCircle className="w-3 h-3" /> FALSE
          </span>
        );
      case 'OUTDATED MEDIA':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-600 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
            <Clock className="w-3 h-3" /> OUTDATED MEDIA
          </span>
        );
      case 'NEEDS MORE VERIFICATION':
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-amber-700 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs">
            <AlertTriangle className="w-3 h-3" /> INVESTIGATING
          </span>
        );
    }
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return (
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
            Instagram
          </span>
        );
      case 'tiktok':
        return (
          <span className="bg-black text-[#00f2fe] font-extrabold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 border border-gray-700 shadow-xs">
            TikTok
          </span>
        );
      case 'twitter':
        return (
          <span className="bg-slate-900 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 border border-slate-700 shadow-xs">
            Twitter (X)
          </span>
        );
      case 'youtube':
        return (
          <span className="bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
            YouTube
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section className="space-y-4" id="daily-social-rumors-section">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0 shadow-xs">
            <Flame className="w-5 h-5 fill-red-500 text-red-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black font-display text-gray-900 dark:text-white">
                {t.dailyRumorsTitle}
              </h2>
              <span className="bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Live Today
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t.dailyRumorsSubtitle}
            </p>
          </div>
        </div>

        {/* Platform Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedPlatform('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedPlatform === 'all'
                ? 'bg-[#0A3D2E] text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            All Channels
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlatform('instagram')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedPlatform === 'instagram'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Instagram
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlatform('tiktok')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedPlatform === 'tiktok'
                ? 'bg-black text-white shadow-xs border border-gray-700'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            TikTok
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlatform('twitter')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedPlatform === 'twitter'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            Twitter (X)
          </button>
          <button
            type="button"
            onClick={() => setSelectedPlatform('youtube')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedPlatform === 'youtube'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            YouTube
          </button>
        </div>
      </div>

      {/* Rumor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRumors.map((rumor) => (
          <div
            key={rumor.id}
            className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
          >
            {/* Top Media Thumbnail Container */}
            <div className="relative aspect-video w-full bg-gray-950 overflow-hidden">
              <img
                src={rumor.thumbnail}
                alt={rumor.claim}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/60" />

              {/* Badges Overlay */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                {getPlatformBadge(rumor.platform)}
                {getResultBadge(rumor.result)}
              </div>

              {/* Bottom Details Overlay */}
              <div className="absolute bottom-3 left-3 right-3 space-y-1 text-white">
                <span className="text-[10px] text-gray-300 font-mono block">
                  {rumor.sourceAccount} • {rumor.viralMetric}
                </span>
                <h3 className="font-bold text-xs sm:text-sm text-white font-display line-clamp-2 leading-snug">
                  {rumor.claim}
                </h3>
              </div>
            </div>

            {/* Evidence & Forensic Verdict Body */}
            <div className="p-4 space-y-3 bg-gray-50/70 dark:bg-gray-850/50 flex-1 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                  <span className="font-bold text-emerald-800 dark:text-emerald-400 uppercase">
                    📍 {rumor.location}
                  </span>
                  <span>{rumor.timestamp}</span>
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed italic bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-150 dark:border-gray-700/60">
                  "{rumor.evidenceSummary}"
                </p>
              </div>

              {/* Card Actions */}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between gap-2">
                <a
                  href={rumor.mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white flex items-center gap-1 bg-gray-200/80 dark:bg-gray-750 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Source Media</span>
                </a>

                <button
                  type="button"
                  onClick={() => onNavigate('verify')}
                  className="text-[11px] font-extrabold text-[#0A3D2E] dark:text-[#FFD60A] hover:underline flex items-center gap-1 cursor-pointer font-display"
                >
                  <span>Verify Claim (+25 PTS)</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};

export default DailySocialRumorsSection;
