import React from 'react';
import {
  TrendingUp,
  Inbox,
  FileSpreadsheet,
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  PhoneCall,
  Mail,
  ChevronLeft,
} from 'lucide-react';
import { QuotationRequest, ContactMessage, JobApplication, Product } from '../../types';

interface AdminOverviewProps {
  quotes: QuotationRequest[];
  messages: ContactMessage[];
  applications: JobApplication[];
  products: Product[];
  onNavigateTab: (tab: 'quotes' | 'messages' | 'applications' | 'products') => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  quotes,
  messages,
  applications,
  products,
  onNavigateTab,
}) => {
  const pendingQuotes = quotes.filter((q) => q.status === 'pending');
  const unreadMessages = messages.filter((m) => m.status === 'unread');
  const newApplications = applications.filter((a) => a.status === 'new');

  const recentQuotes = quotes.slice(0, 4);
  const recentMessages = messages.slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#004B87] to-[#0084CA] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-[#004B87]/15">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-sky-200 uppercase tracking-wider">نظام الإدارة المركزي المتصل</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-sans">
            مرحباً بكم في مركز العمليات واستقبال الطلبات — مجموعة جياد
          </h2>
          <p className="text-xs text-sky-100 max-w-2xl leading-relaxed">
            تتم مزامنة كافة استفسارات العملاء، طلبات عروض أسعار المنتجات، وطلبات التوظيف مباشرة وبشكل فوري مع قاعدة بيانات Firebase السحابية.
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-center shrink-0 border border-white/20">
          <span className="text-xs text-sky-100 block">إجمالي المعاملات الواردة</span>
          <span className="text-2xl font-black font-mono">{quotes.length + messages.length + applications.length}</span>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Quotations */}
        <div
          onClick={() => onNavigateTab('quotes')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#0084CA] hover:shadow-md transition cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">طلبات عروض الأسعار</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0A1F36] font-mono">{quotes.length}</span>
            {pendingQuotes.length > 0 ? (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 animate-pulse">
                {pendingQuotes.length} بانتظار الرد
              </span>
            ) : (
              <span className="text-xs text-slate-400">مكتملة</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">طلبات تسعير المنتجات الصناعية من المشترين</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0084CA] group-hover:text-[#004B87]">
            <span>عرض ومتابعة الطلبات</span>
            <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition" />
          </div>
        </div>

        {/* KPI 2: Messages */}
        <div
          onClick={() => onNavigateTab('messages')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#0084CA] hover:shadow-md transition cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">استفسارات الزوار والعملاء</span>
            <div className="p-2.5 rounded-xl bg-sky-50 text-[#0084CA] border border-sky-200">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0A1F36] font-mono">{messages.length}</span>
            {unreadMessages.length > 0 ? (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-[#004B87]">
                {unreadMessages.length} رسالة جديدة
              </span>
            ) : (
              <span className="text-xs text-slate-400">تمت قراءة الجميع</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">صندوق البريد والمراسلات الواردة من الموقع</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#0084CA] group-hover:text-[#004B87]">
            <span>فتح صندوق الرسائل</span>
            <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition" />
          </div>
        </div>

        {/* KPI 3: Job Applications */}
        <div
          onClick={() => onNavigateTab('applications')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#0084CA] hover:shadow-md transition cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">طلبات التوظيف والسير</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0A1F36] font-mono">{applications.length}</span>
            {newApplications.length > 0 ? (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                {newApplications.length} مرشح جديد
              </span>
            ) : (
              <span className="text-xs text-slate-400">قيد الأرشفة</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">سير ذاتية وملفات متقدمين للكادر الهندسي</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600 group-hover:text-purple-800">
            <span>مراجعة المتقدمين</span>
            <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition" />
          </div>
        </div>

        {/* KPI 4: Industrial Catalog */}
        <div
          onClick={() => onNavigateTab('products')}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#0084CA] hover:shadow-md transition cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500">الكتالوج والمنتجات</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#0A1F36] font-mono">{products.length}</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              نشطة للعرض
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">مركبات، شاحنات، جرارات، كابلات، ومعادن</p>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600 group-hover:text-emerald-800">
            <span>إدارة المنتجات</span>
            <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition" />
          </div>
        </div>
      </div>

      {/* Recent Activity Split Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quotation Requests */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-[#0A1F36]">أحدث طلبات عروض الأسعار</h3>
            </div>
            <button
              onClick={() => onNavigateTab('quotes')}
              className="text-xs font-bold text-[#0084CA] hover:underline cursor-pointer"
            >
              عرض الكل ({quotes.length})
            </button>
          </div>

          {recentQuotes.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">لا توجد طلبات عروض أسعار مسجلة حتى الآن.</p>
          ) : (
            <div className="space-y-3">
              {recentQuotes.map((q) => (
                <div
                  key={q.id}
                  onClick={() => onNavigateTab('quotes')}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-sky-50/50 border border-slate-200/80 transition cursor-pointer space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-[#0A1F36]">{q.productName}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        q.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : q.status === 'contacted'
                          ? 'bg-blue-100 text-blue-800'
                          : q.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {q.status === 'pending'
                        ? 'قيد الانتظار'
                        : q.status === 'contacted'
                        ? 'تم التواصل'
                        : q.status === 'completed'
                        ? 'مكتمل'
                        : q.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">{q.clientName}</span>
                    {q.companyName && <span>• {q.companyName}</span>}
                    <span className="font-mono" dir="ltr">{q.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Contact Inquiries */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-[#0084CA]" />
              <h3 className="text-base font-bold text-[#0A1F36]">أحدث رسائل واستفسارات الزوار</h3>
            </div>
            <button
              onClick={() => onNavigateTab('messages')}
              className="text-xs font-bold text-[#0084CA] hover:underline cursor-pointer"
            >
              عرض الكل ({messages.length})
            </button>
          </div>

          {recentMessages.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">لا توجد رسائل واردة حتى الآن.</p>
          ) : (
            <div className="space-y-3">
              {recentMessages.map((m) => (
                <div
                  key={m.id}
                  onClick={() => onNavigateTab('messages')}
                  className="p-3.5 rounded-xl bg-slate-50 hover:bg-sky-50/50 border border-slate-200/80 transition cursor-pointer space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-[#0A1F36] truncate">{m.subject}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        m.status === 'unread'
                          ? 'bg-sky-100 text-[#004B87] font-extrabold'
                          : m.status === 'replied'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {m.status === 'unread' ? 'جديدة غير مقروءة' : m.status === 'replied' ? 'تم الرد' : 'مؤرشفة'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-1">{m.message}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>{m.name}</span>
                    <span dir="ltr">{new Date(m.createdAt).toLocaleDateString('ar-EG')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
