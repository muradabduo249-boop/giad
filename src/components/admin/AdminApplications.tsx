import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Phone,
  Mail,
  MessageSquare,
  GraduationCap,
  Clock,
  Trash2,
  ExternalLink,
  Save,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';
import { JobApplication, JobOpening } from '../../types';
import { updateJobApplicationStatus, deleteJobApplication } from '../../lib/firestoreService';

interface AdminApplicationsProps {
  applications: JobApplication[];
  jobs: JobOpening[];
  onShowToast: (msg: string) => void;
}

export const AdminApplications: React.FC<AdminApplicationsProps> = ({
  applications,
  jobs,
  onShowToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.qualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.phone.includes(searchTerm) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesJob = jobFilter === 'all' || app.jobId === jobFilter || app.jobTitle === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const newCount = applications.filter((a) => a.status === 'new').length;

  const handleStatusChange = async (appId: string, newStatus: JobApplication['status']) => {
    setIsUpdating(true);
    try {
      await updateJobApplicationStatus(appId, newStatus);
      onShowToast('تم تحديث حالة طلب التوظيف');
    } catch (err) {
      console.error('Failed to update application status:', err);
      onShowToast('حدث خطأ أثناء تحديث الحالة');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async (appId: string) => {
    setIsUpdating(true);
    try {
      await updateJobApplicationStatus(appId, selectedApp?.status || 'new', adminNoteInput);
      onShowToast('تم حفظ ملاحظات الموارد البشرية');
    } catch (err) {
      console.error('Failed to save HR notes:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (appId: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الملف من سجلات المتقدمين؟')) return;
    try {
      await deleteJobApplication(appId);
      if (selectedApp?.id === appId) setSelectedApp(null);
      onShowToast('تم حذف طلب التقديم');
    } catch (err) {
      console.error('Failed to delete application:', err);
      onShowToast('تعذر الحذف');
    }
  };

  const getWhatsAppInterviewUrl = (phone: string, candidateName: string, jobTitle: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `السلام عليكم ورحمة الله، مرحباً أ/ ${candidateName}، نتواصل معك من إدارة الموارد البشرية بمجموعة جياد للصناعات الهندسية بخصوص طلبكم لشغل وظيفة (${jobTitle})...`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#0A1F36]">استلام طلبات التوظيف والسير الذاتية</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
              {applications.length} متقدم
            </span>
            {newCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 animate-pulse">
                {newCount} ملف جديد
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            فرز ومتابعة الكوادر الهندسية والفنية المتقدمة للعمل بمصانع وشركات مجموعة جياد
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'new', label: 'جديد 🌟' },
            { id: 'reviewed', label: 'تم الفرز 📋' },
            { id: 'interview', label: 'مقابلة 🎙️' },
            { id: 'accepted', label: 'مقبول ✅' },
            { id: 'rejected', label: 'مرفوض ❌' },
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

      {/* Search & Job Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="البحث باسم المرشح، الوظيفة، التخصص، أو الهاتف..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:border-[#004B87] shadow-xs"
          />
        </div>

        <div>
          <select
            value={jobFilter}
            onChange={(e) => setJobFilter(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#004B87] shadow-xs cursor-pointer"
          >
            <option value="all">كافة الشواغر الوظيفية</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.titleAr}>
                {j.titleAr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#0A1F36]">لا توجد طلبات توظيف تطابق البحث</h3>
          <p className="text-xs text-slate-500 mt-1">تأكد من اختيار الفلاتر المناسبة أو انتظار تقديمات جديدة.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredApps.map((app) => {
            const isSelected = selectedApp?.id === app.id;
            const isNew = app.status === 'new';

            return (
              <div
                key={app.id}
                className={`p-5 rounded-2xl bg-white border transition shadow-xs space-y-4 ${
                  isNew
                    ? 'border-purple-300 bg-purple-50/15'
                    : isSelected
                    ? 'border-[#0084CA] ring-2 ring-[#0084CA]/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-purple-700 block">الوظيفة المتقدم لها:</span>
                      <h3 className="text-base font-bold text-[#0A1F36]">{app.jobTitle}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono" dir="ltr">
                      {new Date(app.createdAt).toLocaleString('ar-EG', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>

                    <select
                      value={app.status}
                      disabled={isUpdating}
                      onChange={(e) => handleStatusChange(app.id, e.target.value as JobApplication['status'])}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer focus:outline-none ${
                        app.status === 'new'
                          ? 'bg-purple-50 text-purple-800 border-purple-200'
                          : app.status === 'reviewed'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : app.status === 'interview'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : app.status === 'accepted'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      <option value="new">جديد 🌟</option>
                      <option value="reviewed">تم الفرز الأولي 📋</option>
                      <option value="interview">مرشح للمقابلة 🎙️</option>
                      <option value="accepted">تم القبول النهائي ✅</option>
                      <option value="rejected">لم يجتز المعايير ❌</option>
                    </select>
                  </div>
                </div>

                {/* Candidate Credentials Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="space-y-0.5">
                    <span className="text-slate-400 block">اسم المتقدم:</span>
                    <span className="font-bold text-[#0A1F36] text-sm">{app.fullName}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 block">المؤهل والتخصص:</span>
                    <span className="font-semibold text-slate-700">{app.qualification}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 block">سنوات الخبرة:</span>
                    <span className="font-bold text-[#004B87]">{app.yearsExp}</span>
                  </div>

                  <div className="space-y-0.5">
                    <span className="text-slate-400 block">رقم الاتصال:</span>
                    <span className="font-mono font-bold text-slate-800" dir="ltr">{app.phone}</span>
                  </div>
                </div>

                {/* Cover Letter / Bio */}
                {app.coverNote && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">الخطاب التعريفي ونبذة الخبرة:</span>
                    <p className="text-slate-600 leading-relaxed">{app.coverNote}</p>
                  </div>
                )}

                {/* CV Link or File info */}
                {app.cvUrl && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-sky-50 text-xs text-[#004B87] border border-sky-200">
                    <FileText className="w-4 h-4 shrink-0 text-[#0084CA]" />
                    <span className="font-semibold">السيرة الذاتية (CV):</span>
                    {app.cvUrl.startsWith('http') ? (
                      <a
                        href={app.cvUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline font-bold inline-flex items-center gap-1 hover:text-[#003B6B]"
                      >
                        <span>فتح الرابط المرفق</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="font-mono">{app.cvUrl}</span>
                    )}
                  </div>
                )}

                {/* Communication & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Call Candidate */}
                    <a
                      href={`tel:${app.phone}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>اتصال</span>
                    </a>

                    {/* WhatsApp */}
                    <a
                      href={getWhatsAppInterviewUrl(app.phone, app.fullName, app.jobTitle)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>مراسلة واتساب</span>
                    </a>

                    {/* Email */}
                    <a
                      href={`mailto:${app.email}?subject=بخصوص طلب التوظيف: ${app.jobTitle} - مجموعة جياد للصناعات الهندسية`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#004B87] border border-sky-200 text-xs font-bold transition"
                    >
                      <Mail className="w-3.5 h-3.5 text-[#0084CA]" />
                      <span>إرسال بريد المقابلة</span>
                    </a>
                  </div>

                  {/* Notes & Delete */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (isSelected) {
                          setSelectedApp(null);
                        } else {
                          setSelectedApp(app);
                          setAdminNoteInput(app.adminNotes || '');
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600 cursor-pointer"
                    >
                      {isSelected ? 'إغلاق الملاحظات' : 'ملاحظات الموارد البشرية'}
                    </button>

                    <button
                      onClick={() => handleDelete(app.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="حذف الطلب"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Admin Internal HR Notes */}
                {isSelected && (
                  <div className="pt-3 border-t border-slate-100 space-y-2 animate-in fade-in duration-200">
                    <label className="block text-xs font-bold text-slate-700">
                      تقييم وملاحظات لجنة المقابلات والموارد البشرية:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="سجل نتائج المقابلة، التقييم الفني، أو الراتب المتوقع..."
                        value={adminNoteInput}
                        onChange={(e) => setAdminNoteInput(e.target.value)}
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:border-[#004B87]"
                      />
                      <button
                        onClick={() => handleSaveNotes(app.id)}
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
