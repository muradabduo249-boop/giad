import React, { useEffect } from 'react';
import { X, Building2, MapPin, Calendar, CheckSquare, ExternalLink } from 'lucide-react';
import { Company } from '../types';

interface CompanyDetailModalProps {
  company: Company | null;
  onClose: () => void;
  onContactCompany: (companyName: string) => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  company,
  onClose,
  onContactCompany,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (company) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [company, onClose]);

  if (!company) return null;

  return (
    <div
      id="company-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-y-auto text-[#0A1F36]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover */}
        <div className="relative h-48 sm:h-60 md:h-72 bg-slate-100 overflow-hidden">
          <img
            src={company.image}
            alt={company.nameAr}
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
              {company.logoText}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-sans tracking-tight text-white">
              {company.nameAr}
            </h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-sky-200 font-sans tracking-wide mt-0.5 sm:mt-1">
              {company.nameEn}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-7">
          {/* Quick Meta Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center gap-3">
              <Building2 className="w-5 h-5 text-[#004B87] shrink-0" />
              <div>
                <span className="text-[11px] text-slate-500 block">مجال النشاط</span>
                <span className="text-xs md:text-sm font-bold text-[#0A1F36]">{company.industryAr}</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#004B87] shrink-0" />
              <div>
                <span className="text-[11px] text-slate-500 block">سنة التأسيس</span>
                <span className="text-xs md:text-sm font-bold text-[#0A1F36]">{company.establishedYear} م</span>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#004B87] shrink-0" />
              <div>
                <span className="text-[11px] text-slate-500 block">الموقع الصناعي</span>
                <span className="text-xs md:text-sm font-bold text-[#0A1F36]">{company.locationAr}</span>
              </div>
            </div>
          </div>

          {/* Full Bio */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0084CA] mb-2">
              نبذة مؤسسية وتاريخية
            </h3>
            <p className="text-base text-slate-600 leading-relaxed font-sans">
              {company.fullBioAr}
            </p>
          </div>

          {/* Strategic Projects */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CheckSquare className="w-5 h-5 text-[#004B87]" />
              <h3 className="text-base font-bold text-[#0A1F36]">أبرز المشاريع والإنجازات الوطنية</h3>
            </div>
            <ul className="space-y-2.5">
              {company.keyProjects.map((proj, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm text-slate-700"
                >
                  <span className="w-2 h-2 rounded-full bg-[#0084CA] mt-2 shrink-0" />
                  <span>{proj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-200">
            <a
              href="https://giadengineering.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-slate-500 hover:text-[#004B87] transition py-1"
            >
              <ExternalLink className="w-4 h-4" />
              <span>زيارة الموقع الرسمي عبر giadengineering.com</span>
            </a>
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition cursor-pointer text-center"
              >
                إغلاق
              </button>
              <button
                onClick={() => {
                  onContactCompany(company.nameAr);
                  onClose();
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white text-sm font-bold transition shadow-md cursor-pointer text-center"
              >
                تواصل مع إدارة الشركة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
