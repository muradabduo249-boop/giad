import React from 'react';
import { GiadLogo } from './GiadLogo';
import { GIAD_INFO, COMPANIES } from '../data/giadData';
import { Phone, Mail, MapPin, ArrowUp, Globe, Lock } from 'lucide-react';

interface FooterProps {
  onToggleLang: () => void;
  currentLang: 'ar' | 'en';
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onToggleLang, currentLang, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="giad-footer" className="bg-[#0A1F36] text-white pt-20 pb-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <GiadLogo className="h-11" isLight={true} />
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              مجموعة جياد للصناعات الهندسية — رائدة الصناعات الثقيلة، السيارات، الميكنة الزراعية، كابلات الطاقة، وتشكيل المعادن. نبني صروح الصناعة الوطنية ونواكب التطور التكنولوجي منذ 1993.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span>مدينة جياد الصناعية</span>
              <span>•</span>
              <span>جمهورية السودان</span>
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-[#00ADEF] tracking-wider uppercase">
              روابط البوابة
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li><a href="#about" className="hover:text-[#00ADEF] transition">عن جياد</a></li>
              <li><a href="#sectors" className="hover:text-[#00ADEF] transition">قطاعاتنا الصناعية</a></li>
              <li><a href="#companies" className="hover:text-[#00ADEF] transition">شركات المجموعة</a></li>
              <li><a href="#products" className="hover:text-[#00ADEF] transition">كتالوج المنتجات</a></li>
              <li><a href="#news" className="hover:text-[#00ADEF] transition">الأخبار والفعاليات</a></li>
              <li><a href="#csr" className="hover:text-[#00ADEF] transition">المسؤولية المجتمعية</a></li>
              <li><a href="#careers" className="hover:text-[#00ADEF] transition">الوظائف المهنية</a></li>
              <li><a href="#contact" className="hover:text-[#00ADEF] transition">تواصل معنا</a></li>
            </ul>
          </div>

          {/* Group Companies (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-[#00ADEF] tracking-wider uppercase">
              شركات المجموعة
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              {COMPANIES.map((c) => (
                <li key={c.id}>
                  <a href="#companies" className="hover:text-[#00ADEF] transition block">
                    {c.nameAr}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Direct (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-[#00ADEF] tracking-wider uppercase">
              الاتصال والدعم
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#00ADEF] mt-0.5 shrink-0" />
                <div className="font-mono">
                  <span>الرقم الموحد: 1993</span>
                  <div className="text-slate-400 text-xs mt-0.5">+249 183 234567</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#00ADEF] shrink-0" />
                <span className="font-mono">{GIAD_INFO.email}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#00ADEF] mt-0.5 shrink-0" />
                <span>برج جياد، الجريف غرب، الخرطوم</span>
              </div>
            </div>

            {/* Language & Scroll top */}
            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={onToggleLang}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold transition text-slate-200"
              >
                <Globe className="w-3.5 h-3.5 text-[#00ADEF]" />
                <span>{currentLang === 'ar' ? 'English (EN)' : 'العربية (AR)'}</span>
              </button>

              <button
                onClick={scrollToTop}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition"
                title="الرجوع للأعلى"
                aria-label="الرجوع لأعلى الصفحة"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} مجموعة جياد للصناعات الهندسية (GIAD Group). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4 sm:gap-6">
            <span>الصناعة قاطرة التنمية المستدامة</span>
            {onOpenAdmin && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenAdmin}
                  className="opacity-20 hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-white cursor-pointer rounded"
                  title="المدخل الإداري الداخلي (أو اضغط Alt+A)"
                  aria-label="المدخل الإداري"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
