import React, { useEffect } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsDetailModalProps {
  news: NewsItem | null;
  onClose: () => void;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ news, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (news) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [news, onClose]);

  if (!news) return null;

  return (
    <div
      id="news-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-y-auto text-[#0A1F36]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-48 sm:h-64 md:h-80 overflow-hidden bg-slate-100">
          <img
            src={news.image}
            alt={news.titleAr}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F36]/85 via-transparent to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md transition shadow-sm cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-6 text-white space-y-1.5 sm:space-y-2">
            <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md text-[11px] sm:text-xs font-bold bg-[#0084CA] text-white shadow-xs">
              {news.categoryAr}
            </span>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold font-sans leading-snug text-white">
              {news.titleAr}
            </h2>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-slate-200 text-xs text-slate-500">
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0084CA]" />
                <span>نُشر بتاريخ: {news.date}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0084CA]" />
                <span>{news.readTimeAr}</span>
              </span>
            </div>
            <span className="text-[#004B87] font-semibold">إعلام مجموعة جياد</span>
          </div>

          <div className="space-y-3.5 sm:space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
            <p className="font-semibold text-[#0A1F36] text-base sm:text-lg">
              {news.excerptAr}
            </p>
            <p>
              {news.contentAr}
            </p>
            <p className="text-xs sm:text-sm text-slate-500 pt-3 sm:pt-4 border-t border-slate-200">
              المصدر: الدائرة الإعلامية والعلاقات العامة — مجموعة جياد للصناعات الهندسية، جمهورية السودان.
            </p>
          </div>

          <div className="flex items-center justify-end pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition cursor-pointer text-center"
            >
              العودة للأخبار
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
