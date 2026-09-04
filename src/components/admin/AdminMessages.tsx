import React, { useState } from 'react';
import {
  Inbox,
  Search,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle2,
  Trash2,
  Clock,
  Archive,
  User,
  Save,
  ArrowRight,
} from 'lucide-react';
import { ContactMessage } from '../../types';
import { updateContactMessageStatus, deleteContactMessage } from '../../lib/firestoreService';

interface AdminMessagesProps {
  messages: ContactMessage[];
  onShowToast: (msg: string) => void;
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({ messages, onShowToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  const handleStatusChange = async (msgId: string, newStatus: ContactMessage['status']) => {
    setIsUpdating(true);
    try {
      await updateContactMessageStatus(msgId, newStatus);
      onShowToast('تم تحديث حالة الرسالة بنجاح');
    } catch (err) {
      console.error('Failed to update message status:', err);
      onShowToast('حدث خطأ أثناء تحديث حالة الرسالة');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async (msgId: string) => {
    setIsUpdating(true);
    try {
      await updateContactMessageStatus(msgId, activeMessage?.status || 'read', adminNoteInput);
      onShowToast('تم حفظ ملاحظات الإدارة');
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (msgId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الرسالة نهائياً؟')) return;
    try {
      await deleteContactMessage(msgId);
      if (activeMessage?.id === msgId) setActiveMessage(null);
      onShowToast('تم حذف الرسالة بنجاح');
    } catch (err) {
      console.error('Failed to delete message:', err);
      onShowToast('تعذر حذف الرسالة');
    }
  };

  const getWhatsAppUrl = (phone: string, clientName: string, subject: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `السلام عليكم ورحمة الله، مرحباً أ/ ${clientName}، رداً على استفساركم الوارد لمجموعة جياد للصناعات الهندسية بعنوان: (${subject})...`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#0A1F36]">صندوق استفسارات ومراسلات العملاء</h2>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-[#004B87]">
                {unreadCount} رسالة غير مقروءة
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            إدارة الاستفسارات العامة وطلبات الدعم والشراكات الواردة عبر نموذج الاتصال بالموقع
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: `الكل (${messages.length})` },
            { id: 'unread', label: `جديد (${unreadCount})` },
            { id: 'replied', label: 'تم الرد' },
            { id: 'archived', label: 'مؤرشف' },
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
          placeholder="البحث باسم المرسل، الموضوع، نص الرسالة أو رقم الهاتف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#004B87] shadow-xs"
        />
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0A1F36]">صندوق الرسائل فارغ حالياً</h3>
          <p className="text-xs text-slate-500 mt-1">لا توجد رسائل تطابق معايير الفلترة المحددة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((msg) => {
            const isSelected = activeMessage?.id === msg.id;
            const isUnread = msg.status === 'unread';

            return (
              <div
                key={msg.id}
                className={`p-5 rounded-2xl bg-white border transition shadow-xs space-y-3 ${
                  isUnread
                    ? 'border-sky-300 bg-sky-50/20'
                    : isSelected
                    ? 'border-[#0084CA] ring-2 ring-[#0084CA]/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl shrink-0 ${
                        isUnread
                          ? 'bg-[#0084CA] text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#0A1F36]">{msg.name}</h3>
                        {isUnread && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-[#004B87]">
                            جديد
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-[#004B87] block">{msg.subject}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono" dir="ltr">
                      {new Date(msg.createdAt).toLocaleString('ar-EG', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    <select
                      value={msg.status}
                      disabled={isUpdating}
                      onChange={(e) => handleStatusChange(msg.id, e.target.value as ContactMessage['status'])}
                      className="text-xs font-bold px-2.5 py-1 rounded-xl border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none"
                    >
                      <option value="unread">غير مقروء 📩</option>
                      <option value="read">تمت القراءة 👁️</option>
                      <option value="replied">تم الرد ✅</option>
                      <option value="archived">مؤرشف 📁</option>
                    </select>
                  </div>
                </div>

                {/* Sender Contact Info */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>
                    الهاتف: <strong className="font-mono text-slate-800" dir="ltr">{msg.phone}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    البريد: <strong className="font-mono text-slate-800">{msg.email}</strong>
                  </span>
                </div>

                {/* Message Body */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {msg.message}
                </div>

                {/* Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Call Phone */}
                    <a
                      href={`tel:${msg.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>اتصال</span>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href={getWhatsAppUrl(msg.phone, msg.name, msg.subject)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>رد واتساب</span>
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${msg.email}?subject=بخصوص: ${msg.subject} - مجموعة جياد للصناعات الهندسية`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#004B87] border border-sky-200 text-xs font-bold transition"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#0084CA]" />
                      <span>رد عبر البريد</span>
                    </a>

                    {/* Quick Mark Replied */}
                    {msg.status !== 'replied' && (
                      <button
                        onClick={() => handleStatusChange(msg.id, 'replied')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>تحديد كتم الرد</span>
                      </button>
                    )}
                  </div>

                  {/* Notes and Delete */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (isSelected) {
                          setActiveMessage(null);
                        } else {
                          setActiveMessage(msg);
                          setAdminNoteInput(msg.adminNotes || '');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 cursor-pointer"
                    >
                      {isSelected ? 'إغلاق الملاحظات' : 'ملاحظات المتابعة'}
                    </button>

                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="حذف الرسالة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Admin Internal Notes input */}
                {isSelected && (
                  <div className="pt-3 border-t border-slate-100 space-y-2 animate-in fade-in duration-200">
                    <label className="block text-xs font-bold text-slate-700">
                      ملاحظات الإدارة وفريق خدمة العملاء:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="سجل أي تفاصيل عن الرد أو الإجراء المتخذ..."
                        value={adminNoteInput}
                        onChange={(e) => setAdminNoteInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#004B87]"
                      />
                      <button
                        onClick={() => handleSaveNotes(msg.id)}
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
