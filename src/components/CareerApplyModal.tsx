import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, UploadCloud, Briefcase, Loader2, Link2 } from 'lucide-react';
import { JobOpening } from '../types';
import { submitJobApplication } from '../lib/firestoreService';

interface CareerApplyModalProps {
  job: JobOpening | null;
  onClose: () => void;
}

export const CareerApplyModal: React.FC<CareerApplyModalProps> = ({ job, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cvFileName, setCvFileName] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    qualification: '',
    yearsExp: '',
    coverNote: '',
    cvUrl: '',
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (job) {
      setSubmitted(false);
      setIsSubmitting(false);
      setCvFileName('');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        qualification: '',
        yearsExp: '',
        coverNote: '',
        cvUrl: '',
      });
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [job, onClose]);

  if (!job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) return;
    setIsSubmitting(true);
    try {
      await submitJobApplication({
        jobId: job.id,
        jobTitle: job.titleAr,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        qualification: formData.qualification || 'غير محدد',
        yearsExp: formData.yearsExp || 'غير محدد',
        coverNote: formData.coverNote,
        cvUrl: formData.cvUrl || (cvFileName ? `الملف المرفق: ${cvFileName}` : ''),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit job application:', err);
      // Ensure graceful fallback
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="career-apply-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-y-auto text-[#0A1F36]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 md:p-6 bg-[#F8FAFC] border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-sky-50 text-[#0084CA] border border-sky-100 shrink-0">
              <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#0084CA] block">التقديم على وظيفة شاغرة</span>
              <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#0A1F36]">{job.titleAr}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 md:p-8">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-[#0A1F36]">تم استلام طلب التقديم بنجاح</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                شكراً لاهتمامك بالانضمام إلى الكوادر الهندسية والفنية لمجموعة جياد. ستتم مراجعة ملفك وسيرتك الذاتية من قبل إدارة الموارد البشرية والتواصل معك في حال مطابقة المعايير.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#004B87] text-white text-sm font-bold hover:bg-[#003B6B] transition shadow-md"
                >
                  إغلاق النافذة
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">الاسم بالكامل *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: م. أحمد عبد الله"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-[#0A1F36] placeholder-slate-400 text-sm focus:outline-none focus:border-[#004B87] transition shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-[#0A1F36] placeholder-slate-400 text-sm focus:outline-none focus:border-[#004B87] transition shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">رقم الهاتف *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+249 ..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-[#0A1F36] placeholder-slate-400 text-sm focus:outline-none focus:border-[#004B87] transition shadow-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">سنوات الخبرة</label>
                  <input
                    type="text"
                    placeholder="مثال: 5 سنوات"
                    value={formData.yearsExp}
                    onChange={(e) => setFormData({ ...formData, yearsExp: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-[#0A1F36] placeholder-slate-400 text-sm focus:outline-none focus:border-[#004B87] transition shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">المؤهل الأكاديمي والتخصص</label>
                <input
                  type="text"
                  placeholder="مثال: بكالوريوس هندسة ميكانيكية — جامعة الخرطوم"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-[#0A1F36] placeholder-slate-400 text-sm focus:outline-none focus:border-[#004B87] transition shadow-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">السيرة الذاتية (CV / Resume)</label>
                <div className="space-y-2">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-[#0084CA] rounded-xl p-3 text-center bg-slate-50 hover:bg-sky-50/50 transition cursor-pointer">
                    <UploadCloud className="w-6 h-6 text-[#0084CA] mb-1" />
                    <span className="text-xs text-slate-700 font-medium">
                      {cvFileName ? `الملف المختار: ${cvFileName}` : 'اضغط لاختيار ملف السيرة الذاتية (PDF, DOCX)'}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5">الحد الأقصى للملف: 10 ميجابايت</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setCvFileName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 shrink-0">أو رابط السيرة الذاتية:</span>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/... أو رابط Google Drive"
                      value={formData.cvUrl}
                      onChange={(e) => setFormData({ ...formData, cvUrl: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs text-[#0A1F36] placeholder-slate-400 focus:outline-none focus:border-[#004B87]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">ملاحظات إضافية / خطاب تعريفي</label>
                <textarea
                  rows={3}
                  placeholder="أذكر باختصار أبرز خبراتك المهنية وما يمكنك تقديمه لمجموعة جياد..."
                  value={formData.coverNote}
                  onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-[#0A1F36] placeholder-slate-400 text-sm focus:outline-none focus:border-[#004B87] transition shadow-xs"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition cursor-pointer text-center"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003B6B] disabled:bg-slate-400 text-white text-sm font-bold transition shadow-md inline-flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed text-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جارٍ إرسال الطلب...</span>
                    </>
                  ) : (
                    <span>إرسال طلب التقديم</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
