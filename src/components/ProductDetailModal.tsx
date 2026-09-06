import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ShieldCheck, PhoneCall, FileText, Send, Loader2, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { submitQuotationRequest } from '../lib/firestoreService';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onContactProduct: (productName: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onContactProduct,
}) => {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    clientName: '',
    companyName: '',
    phone: '',
    email: '',
    quantity: '1',
    notes: '',
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      setShowQuoteForm(false);
      setQuoteSubmitted(false);
      setIsSubmitting(false);
      setQuoteForm({
        clientName: '',
        companyName: '',
        phone: '',
        email: '',
        quantity: '1',
        notes: '',
      });
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [product, onClose]);

  if (!product) return null;

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteForm.clientName || !quoteForm.phone) return;
    setIsSubmitting(true);
    try {
      await submitQuotationRequest({
        productName: product.nameAr,
        productId: product.id,
        clientName: quoteForm.clientName,
        companyName: quoteForm.companyName || 'فرد / جهة خاصة',
        phone: quoteForm.phone,
        email: quoteForm.email || 'غير مدخل',
        quantity: quoteForm.quantity || '1',
        notes: quoteForm.notes || 'طلب مواصفات وأسعار عبر الموقع',
      });
      setQuoteSubmitted(true);
    } catch (err) {
      console.error('Failed to submit quote request:', err);
      setQuoteSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="product-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-y-auto text-[#0A1F36]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Image */}
        <div className="relative h-52 sm:h-64 md:h-80 bg-slate-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.nameAr}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F36]/85 via-[#0A1F36]/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 sm:top-4 sm:left-4 p-2 sm:p-2.5 rounded-full bg-white/80 hover:bg-white text-slate-800 backdrop-blur-md transition shadow-sm cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Title tag on image */}
          <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-6 text-white">
            <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md text-[11px] sm:text-xs font-bold bg-[#0084CA] text-white mb-1.5 sm:mb-2 shadow-xs">
              {product.categoryAr}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-sans tracking-tight text-white">
              {product.nameAr}
            </h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-sky-200 font-sans tracking-wider mt-0.5">
              {product.nameEn}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
          {showQuoteForm ? (
            /* Direct Quotation Request Form */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowQuoteForm(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0084CA] hover:text-[#004B87] transition cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>العودة إلى المواصفات الفنية للمنتج</span>
                </button>
                <span className="text-xs bg-sky-100 text-[#004B87] px-2.5 py-1 rounded-full font-bold">
                  طلب رسمي مباشر
                </span>
              </div>

              {quoteSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0A1F36]">تم إرسال طلب عرض السعر بنجاح</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    شكراً لاهتمامكم بمنتج <span className="font-bold text-[#004B87]">"{product.nameAr}"</span>. سيقوم مستشارو المبيعات بمجموعة جياد بمراجعة طلبكم وإعداد عرض الأسعار الرسمي والجدول الزمني للتوريد.
                  </p>
                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 rounded-xl bg-[#004B87] text-white text-sm font-bold hover:bg-[#003B6B] transition shadow-md cursor-pointer"
                    >
                      إغلاق النافذة
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleQuoteSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0A1F36]">
                      طلب تسعير ومواصفات لمنتج: <span className="text-[#0084CA]">{product.nameAr}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      يتم إرسال هذا الطلب مباشرة إلى إدارة المبيعات المركزية لمجموعة جياد.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">الاسم الكريم / المسؤول *</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: م. مصطفى أحمد"
                        value={quoteForm.clientName}
                        onChange={(e) => setQuoteForm({ ...quoteForm, clientName: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#004B87]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">الجهة أو الشركة (إن وجدت)</label>
                      <input
                        type="text"
                        placeholder="مثال: شركة النيل للتعدين أو مشروع الجزيرة"
                        value={quoteForm.companyName}
                        onChange={(e) => setQuoteForm({ ...quoteForm, companyName: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#004B87]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">رقم الهاتف للتواصل *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+249 ..."
                        value={quoteForm.phone}
                        onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#004B87]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">البريد الإلكتروني</label>
                      <input
                        type="email"
                        placeholder="email@company.com"
                        value={quoteForm.email}
                        onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#004B87]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">الكمية المطلوبة (تقريباً)</label>
                      <input
                        type="text"
                        placeholder="مثال: وحدة واحدة أو 10 وحدات"
                        value={quoteForm.quantity}
                        onChange={(e) => setQuoteForm({ ...quoteForm, quantity: e.target.value })}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#004B87]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">ملاحظات أو مواصفات خاصة مطلوبة</label>
                    <textarea
                      rows={3}
                      placeholder="اذكر أي ملحقات إضافية أو شروط تسليم خاصة بالمشروع..."
                      value={quoteForm.notes}
                      onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#004B87]"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowQuoteForm(false)}
                      className="px-5 py-2 text-sm rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003B6B] disabled:bg-slate-400 text-white text-sm font-bold transition shadow-md inline-flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جارٍ إرسال الطلب...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>تأكيد إرسال طلب عرض السعر</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Standard Product Specs View */
            <>
              {/* Short Description */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 font-sans">
                  نظرة عامة على المنتج
                </h3>
                <p className="text-sm md:text-base text-slate-700 leading-relaxed font-sans">
                  {product.shortDescriptionAr}
                </p>
              </div>

              {/* Specifications Table */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-[#0084CA]" />
                  <h3 className="text-base font-bold text-[#0A1F36] font-sans">
                    المواصفات الفنية والهندسية
                  </h3>
                </div>
                <div className="bg-[#F8FAFC] rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-200">
                  {product.specs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:px-4 text-xs sm:text-sm"
                    >
                      <span className="font-semibold text-slate-700 font-sans">
                        {spec.labelAr}
                      </span>
                      <span className="text-[#004B87] font-bold font-sans mt-0.5 sm:mt-0">
                        {spec.valueAr}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applications & Uses */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-[#0084CA]" />
                  <h3 className="text-base font-bold text-[#0A1F36] font-sans">
                    مجالات الاستخدام والتطبيقات
                  </h3>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.applicationsAr.map((app, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-slate-600 font-sans"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0084CA] mt-2 shrink-0" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quality badge & Guarantee */}
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 flex items-center gap-4">
                <ShieldCheck className="w-8 h-8 text-[#004B87] shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-[#0A1F36]">ضمان المصنع ودعم ما بعد البيع من جياد</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    تخضع كافة منتجاتنا لاختبارات الجودة الصارمة بموجب المعايير القياسية العالمية مع توفير قطع الغيار الأصلية وضمان الصيانة المعتمد.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm font-medium transition cursor-pointer text-center"
                >
                  إغلاق
                </button>
                <button
                  onClick={() => setShowQuoteForm(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white text-sm font-bold transition shadow-md cursor-pointer text-center"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>طلب تسعير ومواصفات</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
