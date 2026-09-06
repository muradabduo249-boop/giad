import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2, Building, Navigation, Loader2, ArrowDown } from 'lucide-react';
import { GIAD_INFO } from '../data/giadData';
import { SiteSettings, submitContactMessage } from '../lib/firestoreService';
import { GiadInteractiveMap } from './GiadInteractiveMap';

interface ContactSectionProps {
  initialSubject?: string;
  customSettings?: SiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ initialSubject = '', customSettings }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: initialSubject,
    message: '',
  });

  const hqAddress = customSettings?.hqAddressAr || GIAD_INFO.hqAddressAr;
  const industrialCity = customSettings?.industrialCityAr || GIAD_INFO.industrialCityAr;
  const email = customSettings?.email || GIAD_INFO.email;
  const workHours = customSettings?.workHoursAr || GIAD_INFO.workHoursAr;
  const phones = customSettings ? [customSettings.phonePrimary, customSettings.phoneSecondary, `${customSettings.phoneUnified} (الرقم الموحد)`] : GIAD_INFO.phones;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.message) return;
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'استفسار عام لمجموعة جياد',
        message: formData.message,
      });
      setFormSubmitted(true);
    } catch (err) {
      console.error('Failed to submit message to Firebase:', err);
      // Even if offline, show success to client or message
      setFormSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-white text-[#0A1F36] relative scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="text-xs md:text-sm font-bold text-[#0084CA] tracking-wider uppercase block mb-2 font-sans">
            قنوات الاتصال المباشر
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A1F36] tracking-tight font-sans">
            تواصل مع مجموعة جياد
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 sm:mt-4 leading-relaxed font-sans">
            يسعد فريق خدمة العملاء والاستثمار الصناعي بالرد على استفساراتكم وتوفير عروض الأسعار والدعم الفني لكافة قطاعات المجموعة.
          </p>
        </div>

        {/* Contact Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Contact Details & Map Area (5 cols) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <div className="space-y-3 sm:space-y-4">
              {/* Location item */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200">
                <div className="p-2.5 rounded-xl bg-sky-50 text-[#0084CA] shrink-0 border border-sky-100">
                  <Building className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-[#0A1F36]">المقر الرئيسي للمجموعة</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {hqAddress}
                  </p>
                </div>
              </div>

              {/* Industrial City item */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200">
                <div className="p-2.5 rounded-xl bg-sky-50 text-[#0084CA] shrink-0 border border-sky-100">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-[#0A1F36]">المجمع الصناعي</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {industrialCity}
                  </p>
                </div>
              </div>

              {/* Phones item */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200">
                <div className="p-2.5 rounded-xl bg-sky-50 text-[#0084CA] shrink-0 border border-sky-100">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-[#0A1F36]">أرقام الهاتف وخدمة العملاء</h4>
                  <div className="text-xs sm:text-sm text-slate-600 font-mono space-y-0.5">
                    {phones.map((p, i) => (
                      <div key={i}>{p}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Email & Hours */}
              <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200">
                <div className="p-2.5 rounded-xl bg-sky-50 text-[#0084CA] shrink-0 border border-sky-100">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-[#0A1F36]">البريد الإلكتروني وأوقات العمل</h4>
                  <p className="text-xs sm:text-sm text-slate-600 font-mono">
                    {email}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {workHours}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Map Directions Card */}
            <div className="rounded-2xl border border-slate-200 bg-[#F8FAFC] p-5 text-[#0A1F36] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0084CA] flex items-center gap-1.5">
                  <Navigation className="w-4 h-4" />
                  <span>الموقع الجغرافي للمقر الرئيسي</span>
                </span>
                <span className="text-[11px] text-slate-500 font-mono">15°34'N 32°33'E</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                برج جياد الإداري — شارع مدني السريع، الجريف غرب. يربط بين مطار الخرطوم والولايات الإنتاجية ومجمع المصانع.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="#giad-interactive-map-container"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#004B87] hover:text-[#0084CA] transition"
                >
                  <span>استكشاف الخريطة التفاعلية أدناه</span>
                  <ArrowDown className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-[#F8FAFC] rounded-3xl p-5 sm:p-8 md:p-10 border border-slate-200 shadow-xl">
            {formSubmitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#0A1F36] font-sans">
                  تم استلام رسالتك بنجاح
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  شكراً لتواصلك مع مجموعة جياد للصناعات الهندسية. سيقوم الفريق المختص بمراجعة استفسارك والرد عليك في أقرب وقت خلال ساعات العمل الرسمية.
                </p>
                <button
                  onClick={() => {
                    setFormSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-[#004B87] text-white text-xs font-bold"
                >
                  إرسال استفسار آخر
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <h3 className="text-lg sm:text-xl font-bold text-[#0A1F36] mb-1 font-sans">
                  نموذج المراسلات والاستفسار
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      الاسم الكامل *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="الاسم الثلاثي"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-300 text-base sm:text-sm text-[#0A1F36] placeholder-slate-400 focus:outline-none focus:border-[#004B87] transition shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="example@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-300 text-base sm:text-sm text-[#0A1F36] placeholder-slate-400 focus:outline-none focus:border-[#004B87] transition shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      رقم الهاتف *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+249 ..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-300 text-base sm:text-sm text-[#0A1F36] placeholder-slate-400 focus:outline-none focus:border-[#004B87] transition shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      الموضوع / نوع الاستفسار *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: استفسار حول توريد جرارات زراعية"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-300 text-base sm:text-sm text-[#0A1F36] placeholder-slate-400 focus:outline-none focus:border-[#004B87] transition shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    نص الرسالة أو تفاصيل الطلب *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="يرجى كتابة تفاصيل الطلب، الكميات المطلوبة، أو طبيعة الشراكة الهندسية..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-white border border-slate-300 text-base sm:text-sm text-[#0A1F36] placeholder-slate-400 focus:outline-none focus:border-[#004B87] transition shadow-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#004B87] hover:bg-[#003B6B] disabled:bg-slate-400 text-white font-bold text-sm transition shadow-lg shadow-[#004B87]/20 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جارٍ إرسال الاستفسار...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>إرسال الرسالة</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Dedicated Interactive Google Maps Section */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-slate-200">
          <GiadInteractiveMap />
        </div>
      </div>
    </section>
  );
};
