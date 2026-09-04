import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  Clock,
  Trash2,
  Calendar,
  Building,
  User,
  Package,
  Save,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { QuotationRequest } from '../../types';
import { updateQuotationStatus, deleteQuotationRequest } from '../../lib/firestoreService';

interface AdminQuotationsProps {
  quotes: QuotationRequest[];
  onShowToast: (msg: string) => void;
}

export const AdminQuotations: React.FC<AdminQuotationsProps> = ({ quotes, onShowToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedQuote, setSelectedQuote] = useState<QuotationRequest | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredQuotes = quotes.filter((q) => {
    const matchesSearch =
      q.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (q.companyName && q.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      q.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (quoteId: string, newStatus: QuotationRequest['status']) => {
    setIsUpdating(true);
    try {
      await updateQuotationStatus(quoteId, newStatus);
      onShowToast('تم تحديث حالة طلب عرض السعر بنجاح');
    } catch (err) {
      console.error('Failed to update quote status:', err);
      onShowToast('حدث خطأ أثناء تحديث الحالة');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async (quoteId: string) => {
    setIsUpdating(true);
    try {
      await updateQuotationStatus(quoteId, selectedQuote?.status || 'pending', adminNoteInput);
      onShowToast('تم حفظ الملاحظات الإدارية');
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (quoteId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب نهائياً من قاعدة البيانات؟')) return;
    try {
      await deleteQuotationRequest(quoteId);
      if (selectedQuote?.id === quoteId) setSelectedQuote(null);
      onShowToast('تم حذف الطلب بنجاح');
    } catch (err) {
      console.error('Failed to delete quote:', err);
      onShowToast('تعذر حذف الطلب');
    }
  };

  // Helper to create clean WhatsApp URL
  const getWhatsAppUrl = (phone: string, clientName: string, productName: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `السلام عليكم ورحمة الله وبركاته، مرحباً أ/ ${clientName}، نتواصل معكم من الإدارة التجارية لمجموعة جياد للصناعات الهندسية بخصوص طلبكم لمنتج: ${productName}.`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#0A1F36]">استلام طلبات عروض الأسعار والتوريد</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {quotes.length} طلب
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            متابعة طلبات تسعير المنتجات الصناعية من الشركات والمشاريع والأفراد مباشرة
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'pending', label: 'قيد الانتظار' },
            { id: 'contacted', label: 'تم التواصل' },
            { id: 'completed', label: 'مكتمل' },
            { id: 'cancelled', label: 'ملغي' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-[#004B87] text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="البحث باسم المنتج، اسم العميل، الشركة أو رقم الهاتف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#004B87] shadow-xs"
        />
      </div>

      {/* Main Quotations List */}
      {filteredQuotes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0A1F36]">لا توجد طلبات عروض أسعار مطابقة</h3>
          <p className="text-xs text-slate-500 mt-1">جرّب تغيير فلاتر البحث أو انتظار طلبات جديدة من الزوار.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredQuotes.map((q) => {
            const isSelected = selectedQuote?.id === q.id;
            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl bg-white border transition shadow-xs space-y-4 ${
                  isSelected ? 'border-[#0084CA] ring-2 ring-[#0084CA]/10' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Row Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-[#0084CA] block">المنتج المطلوب:</span>
                      <h3 className="text-base font-bold text-[#0A1F36]">{q.productName}</h3>
                    </div>
                  </div>

                  {/* Status Dropdown & Date */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono" dir="ltr">
                      {new Date(q.createdAt).toLocaleString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    <select
                      value={q.status}
                      disabled={isUpdating}
                      onChange={(e) => handleStatusChange(q.id, e.target.value as QuotationRequest['status'])}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${
                        q.status === 'pending'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : q.status === 'in_progress'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : q.status === 'contacted'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : q.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      <option value="pending">قيد الانتظار ⏳</option>
                      <option value="in_progress">قيد الدراسة والمراجعة 📋</option>
                      <option value="contacted">تم التواصل مع العميل 📞</option>
                      <option value="completed">تم التوريد / مكتمل ✅</option>
                      <option value="cancelled">ملغي / غير متوفر ❌</option>
                    </select>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block">اسم المشتري / المسؤول:</span>
                    <span className="font-bold text-[#0A1F36] text-sm">{q.clientName}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 block">الجهة / المؤسسة:</span>
                    <span className="font-semibold text-slate-700">{q.companyName || 'فرد / جهة خاصة'}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 block">الكمية المقدرة:</span>
                    <span className="font-bold text-[#004B87]">{q.quantity || '1 وحدة'}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 block">رقم الاتصال:</span>
                    <span className="font-mono font-bold text-slate-800" dir="ltr">
                      {q.phone}
                    </span>
                  </div>
                </div>

                {/* Client Notes if any */}
                {q.notes && (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">ملاحظات ومواصفات العميل:</span>
                    <p className="text-slate-600 leading-relaxed">{q.notes}</p>
                  </div>
                )}

                {/* Actions & Communication Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Direct Call Button */}
                    <a
                      href={`tel:${q.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>اتصال هاتفي</span>
                    </a>

                    {/* Direct WhatsApp Button */}
                    <a
                      href={getWhatsAppUrl(q.phone, q.clientName, q.productName)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>محادثة واتساب</span>
                    </a>

                    {/* Email Button */}
                    {q.email && q.email !== 'غير مدخل' && (
                      <a
                        href={`mailto:${q.email}?subject=عرض سعر بخصوص ${q.productName} - مجموعة جياد للصناعات الهندسية`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#004B87] border border-sky-200 text-xs font-bold transition"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#0084CA]" />
                        <span>إرسال بريد رسمي</span>
                      </a>
                    )}
                  </div>

                  {/* Delete / Admin Note toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (isSelected) {
                          setSelectedQuote(null);
                        } else {
                          setSelectedQuote(q);
                          setAdminNoteInput(q.adminNotes || '');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 cursor-pointer"
                    >
                      {isSelected ? 'إغلاق الملاحظات' : 'ملاحظات الإدارة'}
                    </button>

                    <button
                      onClick={() => handleDelete(q.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="حذف الطلب"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded Admin Notes Area */}
                {isSelected && (
                  <div className="pt-3 border-t border-slate-100 space-y-2 animate-in fade-in duration-200">
                    <label className="block text-xs font-bold text-slate-700">
                      سجل المتابعة والملاحظات الإدارية الداخلية:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="مثال: تم إرسال الكتالوج عبر واتساب - بانتظار رد المالية..."
                        value={adminNoteInput}
                        onChange={(e) => setAdminNoteInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#004B87]"
                      />
                      <button
                        onClick={() => handleSaveNotes(q.id)}
                        disabled={isUpdating}
                        className="px-4 py-2 bg-[#004B87] hover:bg-[#003B6B] text-white text-xs font-bold rounded-xl transition cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>حفظ</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
