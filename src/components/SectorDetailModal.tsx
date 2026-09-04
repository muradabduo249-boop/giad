import React, { useEffect } from 'react';
import { X, Layers, CheckCircle, ArrowLeft } from 'lucide-react';
import { Sector } from '../types';

interface SectorDetailModalProps {
  sector: Sector | null;
  onClose: () => void;
  onViewProductsByCategory?: (category: string) => void;
}

export const SectorDetailModal: React.FC<SectorDetailModalProps> = ({
  sector,
  onClose,
  onViewProductsByCategory,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (sector) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [sector, onClose]);

  if (!sector) return null;

  return (
    <div
      id="sector-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-y-auto text-[#0A1F36]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner */}
        <div className="relative h-48 sm:h-64 md:h-72 bg-slate-100 overflow-hidden">
          <img
            src={sector.image}
            alt={sector.titleAr}
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

          <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-6 text-white">
            <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md text-[11px] sm:text-xs font-bold bg-[#0084CA] text-white mb-1.5 sm:mb-2 shadow-xs">
              {sector.badgeAr}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-sans text-white">
              {sector.titleAr}
            </h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-sky-200 font-sans tracking-wide mt-0.5 sm:mt-1">
              {sector.titleEn}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-8">
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0084CA] mb-2">
              الرؤية الصناعية والنطاق التشغيلي
            </h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
              {sector.fullOverviewAr}
            </p>
          </div>

          {/* Capabilities */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#004B87]" />
              <h3 className="text-sm sm:text-base font-bold text-[#0A1F36]">القدرات والخطوط الإنتاجية</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {sector.capabilities.map((cap, i) => (
                <div
                  key={i}
                  className="p-3 sm:p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-start gap-2.5 sm:gap-3"
                >
                  <CheckCircle className="w-4 h-4 text-[#0084CA] mt-0.5 shrink-0" />
                  <span className="text-xs md:text-sm text-slate-700 font-medium">{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Output Products */}
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0A1F36] mb-3">أبرز مخرجات ومنتجات القطاع</h3>
            <div className="flex flex-wrap gap-2">
              {sector.keyProducts.map((p, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-lg bg-[#F1F5F9] text-xs sm:text-sm font-semibold text-slate-800 border border-slate-200"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-4 border-t border-slate-200">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition cursor-pointer text-center"
            >
              إغلاق
            </button>
            <a
              href="#products"
              onClick={() => {
                onClose();
                if (onViewProductsByCategory) {
                  onViewProductsByCategory(sector.id);
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white text-sm font-bold transition shadow-md cursor-pointer text-center"
            >
              <span>استعرض منتجات القطاع</span>
              <ArrowLeft className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
