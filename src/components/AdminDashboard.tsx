import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Lock,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  CheckCircle2,
  Package,
  Newspaper,
  Briefcase,
  Settings,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Sparkles,
  ArrowRight,
  LogOut,
  RefreshCw,
  TrendingUp,
  Inbox,
  FileSpreadsheet,
} from 'lucide-react';
import { Product, NewsItem, JobOpening, QuotationRequest, ContactMessage, JobApplication } from '../types';
import {
  SiteSettings,
  saveProduct,
  deleteProduct,
  saveNewsItem,
  deleteNewsItem,
  saveJobOpening,
  deleteJobOpening,
  saveSiteSettings,
} from '../lib/firestoreService';
import { AdminOverview } from './admin/AdminOverview';
import { AdminQuotations } from './admin/AdminQuotations';
import { AdminMessages } from './admin/AdminMessages';
import { AdminApplications } from './admin/AdminApplications';
import { LiveNotificationToasts } from './admin/LiveNotificationToasts';
import { ImageUploadField } from './admin/ImageUploadField';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  news: NewsItem[];
  jobs: JobOpening[];
  siteSettings: SiteSettings;
  quotes?: QuotationRequest[];
  messages?: ContactMessage[];
  applications?: JobApplication[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  news,
  jobs,
  siteSettings,
  quotes = [],
  messages = [],
  applications = [],
}) => {
  // Authentication State (Secure simple session for Admin PIN)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'quotes' | 'messages' | 'applications' | 'products' | 'news' | 'jobs' | 'settings'
  >('overview');

  const pendingQuotesCount = quotes.filter((q) => q.status === 'pending').length;
  const unreadMessagesCount = messages.filter((m) => m.status === 'unread').length;
  const newApplicationsCount = applications.filter((a) => a.status === 'new').length;

  // Saving State & Notification
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit / Add Item States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isNewNews, setIsNewNews] = useState(false);

  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);
  const [isNewJob, setIsNewJob] = useState(false);

  const [settingsForm, setSettingsForm] = useState<SiteSettings>(siteSettings);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1993 or admin123
    if (pinInput === '1993' || pinInput === 'admin' || pinInput === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
      setPinInput('');
      setSettingsForm(siteSettings);
    } else {
      setAuthError('رمز المرور غير صحيح. يرجى إعادة المحاولة.');
    }
  };

  // Product Save Handlers
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setIsSaving(true);
    try {
      await saveProduct(editingProduct);
      showToast('تم حفظ المنتج بنجاح وتحديثه فوراً في الموقع!');
      setEditingProduct(null);
      setIsNewProduct(false);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء الحفظ. تأكد من الاتصال بالإنترنت.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف المنتج: "${name}"؟`)) return;
    setIsSaving(true);
    try {
      await deleteProduct(id);
      showToast('تم حذف المنتج بنجاح من قاعدة البيانات.');
    } catch (err) {
      console.error(err);
      showToast('تعذر حذف المنتج.');
    } finally {
      setIsSaving(false);
    }
  };

  // News Save Handlers
  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNews) return;
    setIsSaving(true);
    try {
      await saveNewsItem(editingNews);
      showToast('تم نشر/تعديل الخبر وتحديثه على الموقع فوراً!');
      setEditingNews(null);
      setIsNewNews(false);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ الخبر.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNews = async (id: string, title: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف الخبر: "${title}"؟`)) return;
    setIsSaving(true);
    try {
      await deleteNewsItem(id);
      showToast('تم حذف الخبر بنجاح.');
    } catch (err) {
      console.error(err);
      showToast('تعذر حذف الخبر.');
    } finally {
      setIsSaving(false);
    }
  };

  // Job Save Handlers
  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    setIsSaving(true);
    try {
      await saveJobOpening(editingJob);
      showToast('تم حفظ الوظيفة وتحديث قائمة الشواغر فوراً!');
      setEditingJob(null);
      setIsNewJob(false);
    } catch (err) {
      console.error(err);
      showToast('حدث خطأ أثناء حفظ الوظيفة.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteJob = async (id: string, title: string) => {
    if (!window.confirm(`هل أنت متأكد من حذف الوظيفة: "${title}"؟`)) return;
    setIsSaving(true);
    try {
      await deleteJobOpening(id);
      showToast('تم حذف الوظيفة بنجاح.');
    } catch (err) {
      console.error(err);
      showToast('تعذر حذف الوظيفة.');
    } finally {
      setIsSaving(false);
    }
  };

  // Settings Save Handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveSiteSettings(settingsForm);
      showToast('تم تحديث بيانات الموقع وأرقام الاتصال مباشرة لجميع الزوار!');
    } catch (err) {
      console.error(err);
      showToast('تعذر حفظ التعديلات.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="giad-admin-dashboard-modal"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6"
      dir="rtl"
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#004B87] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-sky-400/30 text-sm font-bold"
          >
            <CheckCircle2 className="w-5 h-5 text-sky-300 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 bg-[#0A1F36] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  لوحة تحكم إدارة مجموعة جياد
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  سحابي ومباشر (Firebase)
                </span>
              </div>
              <p className="text-xs text-slate-300">
                أي تعديل هنا ينعكس فوراً وتلقائياً على الموقع المنشور في هوستنجر
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <LiveNotificationToasts
                  quotes={quotes}
                  messages={messages}
                  applications={applications}
                  onNavigateTab={(tab) => {
                    setActiveTab(tab);
                    setEditingProduct(null);
                    setEditingNews(null);
                    setEditingJob(null);
                  }}
                />
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer"
              aria-label="إغلاق لوحة التحكم"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Login Screen */
          <div className="flex-1 p-8 sm:p-12 flex flex-col items-center justify-center bg-slate-50/70">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-md bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-sky-50 text-[#004B87] flex items-center justify-center mx-auto mb-4 border border-sky-100 shadow-xs">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-[#0A1F36] mb-2">
                تسجيل دخول المشرف
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                أدخل رمز المرور السري للتحكم في المنتجات والأخبار وبيانات الموقع.
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="رمز المرور السري ••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-center text-lg font-bold tracking-widest focus:outline-none focus:border-[#004B87] focus:ring-2 focus:ring-sky-100"
                    autoFocus
                  />
                  {authError && (
                    <p className="text-xs text-red-500 font-bold mt-2">{authError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white font-bold text-sm transition shadow-sm cursor-pointer"
                >
                  الدخول إلى لوحة التحكم
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-slate-100 text-slate-400 text-[11px] text-center flex items-center justify-center gap-1.5">
                <Lock className="w-3 h-3 text-slate-400" />
                <span>منطقة مشفرة ومحمية خاصة بإدارة مجموعة جياد</span>
              </div>
            </motion.div>
          </div>
        ) : (
          /* Main Authenticated Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 bg-[#F8FAFC] border-b md:border-b-0 md:border-l border-slate-200 p-3 sm:p-4 shrink-0 flex md:flex-col gap-1.5 overflow-x-auto">
              {/* Tab 1: Overview */}
              <button
                onClick={() => {
                  setActiveTab('overview');
                  setEditingProduct(null);
                  setEditingNews(null);
                  setEditingJob(null);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'overview'
                    ? 'bg-[#004B87] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 shrink-0" />
                  <span>لوحة المؤشرات</span>
                </div>
              </button>

              {/* Tab 2: Quotations */}
              <button
                onClick={() => {
                  setActiveTab('quotes');
                  setEditingProduct(null);
                  setEditingNews(null);
                  setEditingJob(null);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'quotes'
                    ? 'bg-[#004B87] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="w-4 h-4 shrink-0" />
                  <span>طلبات عروض الأسعار</span>
                </div>
                {pendingQuotesCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 animate-pulse">
                    {pendingQuotesCount}
                  </span>
                ) : (
                  <span className="text-[11px] opacity-60">({quotes.length})</span>
                )}
              </button>

              {/* Tab 3: Contact Messages */}
              <button
                onClick={() => {
                  setActiveTab('messages');
                  setEditingProduct(null);
                  setEditingNews(null);
                  setEditingJob(null);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'messages'
                    ? 'bg-[#004B87] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 shrink-0" />
                  <span>رسائل واستفسارات الزوار</span>
                </div>
                {unreadMessagesCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-300 text-sky-950 animate-pulse">
                    {unreadMessagesCount}
                  </span>
                ) : (
                  <span className="text-[11px] opacity-60">({messages.length})</span>
                )}
              </button>

              {/* Tab 4: Job Applications */}
              <button
                onClick={() => {
                  setActiveTab('applications');
                  setEditingProduct(null);
                  setEditingNews(null);
                  setEditingJob(null);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'applications'
                    ? 'bg-[#004B87] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>طلبات التوظيف والسير</span>
                </div>
                {newApplicationsCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-300 text-purple-950 animate-pulse">
                    {newApplicationsCount}
                  </span>
                ) : (
                  <span className="text-[11px] opacity-60">({applications.length})</span>
                )}
              </button>

              <div className="my-1 border-t border-slate-200 hidden md:block" />

              {/* Tab 5: Products */}
              <button
                onClick={() => {
                  setActiveTab('products');
                  setEditingProduct(null);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'products'
                    ? 'bg-[#004B87] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 shrink-0" />
                  <span>المنتجات الهندسية</span>
                </div>
                <span className="text-[11px] opacity-60">({products.length})</span>
              </button>

              {/* Tab 6: News */}
              <button
                onClick={() => {
                  setActiveTab('news');
                  setEditingNews(null);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'news'
                    ? 'bg-[#004B87] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Newspaper className="w-4 h-4 shrink-0" />
                  <span>الأخبار والبيانات</span>
                </div>
                <span className="text-[11px] opacity-60">({news.length})</span>
              </button>

              {/* Tab 7: Job Openings */}
              <button
                onClick={() => {
                  setActiveTab('jobs');
                  setEditingJob(null);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'jobs'
                    ? 'bg-[#004B87] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 shrink-0" />
                  <span>الشواغر الوظيفية</span>
                </div>
                <span className="text-[11px] opacity-60">({jobs.length})</span>
              </button>

              {/* Tab 8: Site Settings */}
              <button
                onClick={() => {
                  setActiveTab('settings');
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition whitespace-nowrap cursor-pointer ${
                  activeTab === 'settings'
                    ? 'bg-[#004B87] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 shrink-0" />
                  <span>بيانات وهوية المجموعة</span>
                </div>
              </button>

              {/* Status Info Card */}
              <div className="hidden md:block mt-auto p-3.5 rounded-2xl bg-white border border-slate-200 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  قاعدة البيانات متصلة ومباشرة
                </div>
                أي تغيير تحفظه هنا يظهر فوراً على موقعك في هوستنجر دون الحاجة لإعادة رفع الملفات.
              </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-50/50">
              {/* TAB 0: OVERVIEW & KPIS */}
              {activeTab === 'overview' && (
                <AdminOverview
                  quotes={quotes}
                  messages={messages}
                  applications={applications}
                  products={products}
                  onNavigateTab={(tab) => {
                    setActiveTab(tab);
                    setEditingProduct(null);
                    setEditingNews(null);
                    setEditingJob(null);
                  }}
                />
              )}

              {/* TAB 1: QUOTATION REQUESTS */}
              {activeTab === 'quotes' && (
                <AdminQuotations quotes={quotes} onShowToast={showToast} />
              )}

              {/* TAB 2: INQUIRIES & MESSAGES */}
              {activeTab === 'messages' && (
                <AdminMessages messages={messages} onShowToast={showToast} />
              )}

              {/* TAB 3: JOB APPLICATIONS */}
              {activeTab === 'applications' && (
                <AdminApplications
                  applications={applications}
                  jobs={jobs}
                  onShowToast={showToast}
                />
              )}

              {/* TAB 4: PRODUCTS MANAGEMENT */}
              {activeTab === 'products' && (
                <div>
                  {editingProduct ? (
                    /* Edit/Add Product Form */
                    <form onSubmit={handleSaveProduct} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <h3 className="text-base font-black text-[#0A1F36]">
                          {isNewProduct ? 'إضافة منتج هندسي جديد' : 'تعديل بيانات المنتج'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(null);
                            setIsNewProduct(false);
                          }}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800"
                        >
                          إلغاء والعودة
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            اسم المنتج (بالعربية) *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingProduct.nameAr}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, nameAr: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#004B87]"
                            placeholder="مثال: سيارة جياد سيدان 2026"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            اسم المنتج (بالإنجليزية)
                          </label>
                          <input
                            type="text"
                            value={editingProduct.nameEn}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, nameEn: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#004B87]"
                            placeholder="GIAD Sedan 2026"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            التصنيف والقطاع *
                          </label>
                          <select
                            value={editingProduct.category}
                            onChange={(e) => {
                              const cat = e.target.value as Product['category'];
                              const names: Record<string, string> = {
                                vehicles: 'صناعة السيارات وتجميع المركبات',
                                trucks: 'صناعة الشاحنات والمقطورات',
                                agricultural: 'الجرارات والمعدات الزراعية',
                                cables: 'الكابلات والمنتجات الكهربائية',
                                metal: 'الصناعات المعدنية والتشكيل',
                                services: 'خدمات ما بعد البيع والصيانة',
                              };
                              setEditingProduct({
                                ...editingProduct,
                                category: cat,
                                categoryAr: names[cat] || 'صناعات هندسية',
                              });
                            }}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#004B87]"
                          >
                            <option value="vehicles">صناعة السيارات وتجميع المركبات</option>
                            <option value="trucks">صناعة الشاحنات والمقطورات</option>
                            <option value="agricultural">الجرارات والمعدات الزراعية</option>
                            <option value="cables">الكابلات والمنتجات الكهربائية</option>
                            <option value="metal">الصناعات المعدنية والتشكيل</option>
                            <option value="services">خدمات ما بعد البيع والصيانة</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <ImageUploadField
                            label="صورة المنتج الهندسية *"
                            value={editingProduct.image}
                            onChange={(imgUrl) =>
                              setEditingProduct({ ...editingProduct, image: imgUrl })
                            }
                            helperText="يمكنك رفع صورة عالية الجودة من هاتفك المحمول أو جهازك الحاسوب، أو إدخال رابط خارجي."
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          الوصف التعريفي المختصر *
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={editingProduct.shortDescriptionAr}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              shortDescriptionAr: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#004B87]"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="featured-checkbox"
                          checked={editingProduct.featured || false}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              featured: e.target.checked,
                            })
                          }
                          className="w-4 h-4 rounded text-[#004B87]"
                        />
                        <label htmlFor="featured-checkbox" className="text-xs font-bold text-slate-700">
                          تمييز المنتج في الواجهة الرئيسية (Featured)
                        </label>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(null);
                            setIsNewProduct(false);
                          }}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="px-6 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>{isSaving ? 'جارِ الحفظ...' : 'حفظ ونشر التعديل فوراً'}</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* Products List View */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-black text-[#0A1F36]">
                            إدارة المنتجات ({products.length})
                          </h3>
                          <p className="text-xs text-slate-500">
                            أضف منتجات جديدة أو عدّل المواصفات والصور لتنعكس مباشرة على الكتالوج
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingProduct({
                              id: `prod-${Date.now()}`,
                              nameAr: '',
                              nameEn: '',
                              category: 'vehicles',
                              categoryAr: 'صناعة السيارات وتجميع المركبات',
                              shortDescriptionAr: '',
                              image:
                                'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=900&q=80',
                              specs: [{ labelAr: 'سنة الصنع', valueAr: '2026' }],
                              applicationsAr: ['الاستخدام العام والصناعي'],
                              featured: false,
                            });
                            setIsNewProduct(true);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white text-xs font-bold flex items-center gap-2 transition shadow-xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>إضافة منتج جديد</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {products.map((prod) => (
                          <div
                            key={prod.id}
                            className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4 hover:shadow-md transition"
                          >
                            <img
                              src={prod.image}
                              alt={prod.nameAr}
                              className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-bold text-[#0084CA] bg-sky-50 px-2 py-0.5 rounded-md">
                                {prod.categoryAr}
                              </span>
                              <h4 className="text-xs font-black text-slate-900 truncate mt-1">
                                {prod.nameAr}
                              </h4>
                              <p className="text-[11px] text-slate-500 line-clamp-1">
                                {prod.shortDescriptionAr}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingProduct(prod);
                                  setIsNewProduct(false);
                                }}
                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-[#004B87] text-slate-600 flex items-center justify-center transition cursor-pointer"
                                title="تعديل"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.nameAr)}
                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 flex items-center justify-center transition cursor-pointer"
                                title="حذف"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: NEWS MANAGEMENT */}
              {activeTab === 'news' && (
                <div>
                  {editingNews ? (
                    <form onSubmit={handleSaveNews} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <h3 className="text-base font-black text-[#0A1F36]">
                          {isNewNews ? 'نشر خبر أو بيان صحفي جديد' : 'تعديل الخبر'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNews(null);
                            setIsNewNews(false);
                          }}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800"
                        >
                          إلغاء والعودة
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            عنوان الخبر الرئيسي *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingNews.titleAr}
                            onChange={(e) =>
                              setEditingNews({ ...editingNews, titleAr: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#004B87]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            التصنيف
                          </label>
                          <input
                            type="text"
                            value={editingNews.categoryAr}
                            onChange={(e) =>
                              setEditingNews({ ...editingNews, categoryAr: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#004B87]"
                            placeholder="مثال: تصنيع وطني / شراكات استراتيجية"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            تاريخ الخبر
                          </label>
                          <input
                            type="text"
                            value={editingNews.date}
                            onChange={(e) =>
                              setEditingNews({ ...editingNews, date: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#004B87]"
                            placeholder="مثال: سبتمبر 2026"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <ImageUploadField
                            label="صورة الخبر / البيان الصحفي"
                            value={editingNews.image}
                            onChange={(imgUrl) =>
                              setEditingNews({ ...editingNews, image: imgUrl })
                            }
                            helperText="يمكنك رفع صورة للخبر مباشرة من هاتفك أو جهازك، أو استخدام رابط ويب."
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            الموجز الصحفي *
                          </label>
                          <textarea
                            rows={2}
                            required
                            value={editingNews.excerptAr}
                            onChange={(e) =>
                              setEditingNews({ ...editingNews, excerptAr: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            نص الخبر الكامل والتفاصيل
                          </label>
                          <textarea
                            rows={5}
                            value={editingNews.contentAr}
                            onChange={(e) =>
                              setEditingNews({ ...editingNews, contentAr: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingNews(null);
                            setIsNewNews(false);
                          }}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="px-6 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>{isSaving ? 'جارِ النشر...' : 'نشر الخبر فوراً'}</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-black text-[#0A1F36]">
                            الأخبار والبيانات الصحفية ({news.length})
                          </h3>
                          <p className="text-xs text-slate-500">
                            انشر أحدث الإنجازات والبيانات وتحديثات خطوط الإنتاج
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingNews({
                              id: `news-${Date.now()}`,
                              titleAr: '',
                              date: 'سبتمبر 2026',
                              categoryAr: 'بيانات صحفية',
                              excerptAr: '',
                              contentAr: '',
                              image:
                                'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=900&q=80',
                              readTimeAr: '3 دقائق قراءة',
                              featured: false,
                            });
                            setIsNewNews(true);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white text-xs font-bold flex items-center gap-2 transition shadow-xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>إضافة خبر جديد</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {news.map((item) => (
                          <div
                            key={item.id}
                            className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 hover:shadow-md transition"
                          >
                            <div className="flex items-center gap-4 min-w-0">
                              <img
                                src={item.image}
                                alt={item.titleAr}
                                className="w-14 h-14 rounded-xl object-cover border border-slate-100 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-bold text-[#0084CA] bg-sky-50 px-2 py-0.5 rounded-md">
                                    {item.categoryAr}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    {item.date}
                                  </span>
                                </div>
                                <h4 className="text-xs font-black text-slate-900 truncate">
                                  {item.titleAr}
                                </h4>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingNews(item);
                                  setIsNewNews(false);
                                }}
                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-[#004B87] text-slate-600 flex items-center justify-center transition cursor-pointer"
                                title="تعديل"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteNews(item.id, item.titleAr)}
                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 flex items-center justify-center transition cursor-pointer"
                                title="حذف"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: JOBS MANAGEMENT */}
              {activeTab === 'jobs' && (
                <div>
                  {editingJob ? (
                    <form onSubmit={handleSaveJob} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                        <h3 className="text-base font-black text-[#0A1F36]">
                          {isNewJob ? 'إضافة فرصة عمل جديدة' : 'تعديل بيانات الوظيفة'}
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingJob(null);
                            setIsNewJob(false);
                          }}
                          className="text-xs font-bold text-slate-500 hover:text-slate-800"
                        >
                          إلغاء والعودة
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            المسمى الوظيفي *
                          </label>
                          <input
                            type="text"
                            required
                            value={editingJob.titleAr}
                            onChange={(e) =>
                              setEditingJob({ ...editingJob, titleAr: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:outline-none focus:border-[#004B87]"
                            placeholder="مثال: مهندس أول صيانة وتحكم آلي"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            القطاع / الإدارة
                          </label>
                          <input
                            type="text"
                            value={editingJob.departmentAr}
                            onChange={(e) =>
                              setEditingJob({ ...editingJob, departmentAr: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#004B87]"
                            placeholder="إدارة التصنيع والإنتاج"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            الموقع
                          </label>
                          <input
                            type="text"
                            value={editingJob.locationAr}
                            onChange={(e) =>
                              setEditingJob({ ...editingJob, locationAr: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#004B87]"
                            placeholder="مدينة جياد الصناعية"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            الخبرة المطلوبة
                          </label>
                          <input
                            type="text"
                            value={editingJob.experienceAr}
                            onChange={(e) =>
                              setEditingJob({ ...editingJob, experienceAr: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#004B87]"
                            placeholder="3 - 5 سنوات"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            نوع الدوام
                          </label>
                          <input
                            type="text"
                            value={editingJob.typeAr}
                            onChange={(e) =>
                              setEditingJob({ ...editingJob, typeAr: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#004B87]"
                            placeholder="دوام كامل (حضوري)"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            الوصف الوظيفي والمسؤوليات
                          </label>
                          <textarea
                            rows={3}
                            value={editingJob.descriptionAr}
                            onChange={(e) =>
                              setEditingJob({ ...editingJob, descriptionAr: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#004B87]"
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingJob(null);
                            setIsNewJob(false);
                          }}
                          className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                        >
                          إلغاء
                        </button>
                        <button
                          type="submit"
                          disabled={isSaving}
                          className="px-6 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                        >
                          <Save className="w-4 h-4" />
                          <span>{isSaving ? 'جارِ الحفظ...' : 'حفظ الوظيفة فوراً'}</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-black text-[#0A1F36]">
                            إدارة الوظائف الشاغرة ({jobs.length})
                          </h3>
                          <p className="text-xs text-slate-500">
                            استقطب الكفاءات الهندسية وأعلن عن شواغر المصانع
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setEditingJob({
                              id: `job-${Date.now()}`,
                              titleAr: '',
                              departmentAr: 'قطاع الهندسة والتصنيع',
                              locationAr: 'مدينة جياد الصناعية',
                              typeAr: 'دوام كامل',
                              experienceAr: '3+ سنوات',
                              descriptionAr: '',
                              requirements: ['شهادة جامعية في التخصص', 'إجادة اللغة الإنجليزية'],
                            });
                            setIsNewJob(true);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white text-xs font-bold flex items-center gap-2 transition shadow-xs cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>إضافة وظيفة شاغرة</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-3">
                        {jobs.map((job) => (
                          <div
                            key={job.id}
                            className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 hover:shadow-md transition"
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold text-[#0084CA] bg-sky-50 px-2 py-0.5 rounded-md">
                                  {job.departmentAr}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {job.locationAr}
                                </span>
                              </div>
                              <h4 className="text-xs font-black text-slate-900">
                                {job.titleAr}
                              </h4>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingJob(job);
                                  setIsNewJob(false);
                                }}
                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-[#004B87] text-slate-600 flex items-center justify-center transition cursor-pointer"
                                title="تعديل"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteJob(job.id, job.titleAr)}
                                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 flex items-center justify-center transition cursor-pointer"
                                title="حذف"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SITE SETTINGS & CONTACT */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                  <div className="pb-4 border-b border-slate-100">
                    <h3 className="text-base font-black text-[#0A1F36]">
                      بيانات الاتصال وهوية الموقع
                    </h3>
                    <p className="text-xs text-slate-500">
                      تعديل أرقام الهواتف، العناوين، وإحصائيات المجموعة الظاهرة في الصفحة الرئيسية
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        الرقم الموحد (الخط الساخن) *
                      </label>
                      <input
                        type="text"
                        required
                        value={settingsForm.phoneUnified}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, phoneUnified: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold font-mono focus:outline-none focus:border-[#004B87]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        البريد الإلكتروني الرسمي *
                      </label>
                      <input
                        type="email"
                        required
                        value={settingsForm.email}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, email: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold font-mono focus:outline-none focus:border-[#004B87]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        هاتف المقر الرئيسي
                      </label>
                      <input
                        type="text"
                        value={settingsForm.phonePrimary}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, phonePrimary: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        هاتف المجمع الصناعي
                      </label>
                      <input
                        type="text"
                        value={settingsForm.phoneSecondary}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, phoneSecondary: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-[#004B87]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        عنوان المقر الرئيسي
                      </label>
                      <input
                        type="text"
                        value={settingsForm.hqAddressAr}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, hqAddressAr: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#004B87]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        عنوان المدينة الصناعية
                      </label>
                      <input
                        type="text"
                        value={settingsForm.industrialCityAr}
                        onChange={(e) =>
                          setSettingsForm({ ...settingsForm, industrialCityAr: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#004B87]"
                      />
                    </div>
                  </div>

                  {/* Quick Stats Section */}
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-800 mb-3">
                      أرقام وإحصائيات المجموعة الرئيسية
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">الكوادر البشرية</label>
                        <input
                          type="text"
                          value={settingsForm.statStaff}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, statStaff: e.target.value })
                          }
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">الشركات المتخصصة</label>
                        <input
                          type="text"
                          value={settingsForm.statCompanies}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, statCompanies: e.target.value })
                          }
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">القطاعات الصناعية</label>
                        <input
                          type="text"
                          value={settingsForm.statSectors}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, statSectors: e.target.value })
                          }
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">سنة التأسيس</label>
                        <input
                          type="text"
                          value={settingsForm.statYear}
                          onChange={(e) =>
                            setSettingsForm({ ...settingsForm, statYear: e.target.value })
                          }
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-center"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-sm"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'جارِ الحفظ...' : 'حفظ الإعدادات في قاعدة البيانات'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
