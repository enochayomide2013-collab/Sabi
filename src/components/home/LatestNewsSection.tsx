import React, { useState } from 'react';
import { 
  Newspaper, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ChevronRight, 
  ShieldCheck, 
  TrendingUp, 
  AlertCircle,
  Share2
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { NewsArticle } from '../../types';

interface LatestNewsSectionProps {
  onShowToast?: (points: number, message: string) => void;
}

export const LatestNewsSection: React.FC<LatestNewsSectionProps> = ({ onShowToast }) => {
  const [news] = useState<NewsArticle[]>(storageService.getNewsArticles());
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const handleShare = (article: NewsArticle, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${article.title} - Verified on SABI Nigeria`);
      if (onShowToast) {
        onShowToast(5, 'News headline link copied to clipboard!');
      }
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'Market Intelligence':
      case 'Market Alerts':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Fact Check Alert':
      case 'Fact Check':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'National Food Security':
      case 'Food Supply':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'SABI Community':
      case 'Economy':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Consumer Rights':
      default:
        return 'bg-rose-100 text-rose-900 border-rose-300';
    }
  };

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-sm space-y-4" id="latest-news-section">
      
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#0A3D2E]/10 border border-[#0A3D2E]/20 flex items-center justify-center text-[#0A3D2E]">
            <Newspaper className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base sm:text-lg text-gray-900 font-display">
                Latest Verified News & Market Truths
              </h3>
              <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                <span>100% True & Verified</span>
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Current and vetted market updates, logistics bulletins, and food commodity intelligence across Nigeria.
            </p>
          </div>
        </div>
      </div>

      {/* News Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {news.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedArticle(item)}
            className="group bg-gray-50 hover:bg-emerald-50/40 rounded-2xl p-4 border border-gray-200 hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getCategoryBadge(item.category)}`}>
                  {item.category}
                </span>
                
                <div className="flex items-center gap-1 text-[11px] text-gray-500 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>{item.publishedTime}</span>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-[#0A3D2E] transition-colors leading-snug font-display">
                {item.title}
              </h4>

              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {item.summary}
              </p>
            </div>

            <div className="pt-2 border-t border-gray-200/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0A3D2E]" />
                <span className="text-[11px] font-semibold text-gray-700">{item.source}</span>
                <span className="text-gray-300">·</span>
                <span className="text-[10px] text-gray-500">{item.readTime}</span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => handleShare(item, e)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white transition-colors"
                  title="Share Article"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <span className="text-[#0A3D2E] font-bold text-xs flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  <span>Read</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-200 animate-scale-up max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase ${getCategoryBadge(selectedArticle.category)}`}>
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-gray-400 hover:text-gray-600 text-xs font-bold p-1 rounded-lg hover:bg-gray-100"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 font-display leading-snug">
                {selectedArticle.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-semibold text-gray-800">{selectedArticle.source}</span>
                <span>·</span>
                <span>{selectedArticle.publishedTime}</span>
                <span>·</span>
                <span>{selectedArticle.readTime}</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-[#0A3D2E] flex items-center gap-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified True by SABI Community Intelligence and Nigerian Market Consensus.</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              <p className="font-medium text-gray-900">
                {selectedArticle.summary}
              </p>
              <p>
                {selectedArticle.content}
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={(e) => {
                  handleShare(selectedArticle, e);
                  setSelectedArticle(null);
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Story</span>
              </button>

              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-[#0A3D2E] hover:bg-[#0c4b38] text-white font-bold text-xs px-5 py-2 rounded-xl shadow-sm transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
