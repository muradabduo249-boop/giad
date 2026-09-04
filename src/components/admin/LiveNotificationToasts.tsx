import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileSpreadsheet,
  Inbox,
  Briefcase,
  X,
  ArrowLeft,
  Bell,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { QuotationRequest, ContactMessage, JobApplication } from '../../types';

export interface LiveNotificationItem {
  id: string;
  type: 'quote' | 'message' | 'application';
  title: string;
  subtitle: string;
  detail: string;
  date: Date;
  targetTab: 'quotes' | 'messages' | 'applications';
}

interface LiveNotificationToastsProps {
  quotes: QuotationRequest[];
  messages: ContactMessage[];
  applications: JobApplication[];
  onNavigateTab: (tab: 'quotes' | 'messages' | 'applications') => void;
}

// Gentle Web Audio API synthesizer for clean professional chime
const playNotificationSound = () => {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Two-tone pleasant chime
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12); // G5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // AudioContext not allowed before user gesture, safely ignore
  }
};

export const LiveNotificationToasts: React.FC<LiveNotificationToastsProps> = ({
  quotes,
  messages,
  applications,
  onNavigateTab,
}) => {
  const [toasts, setToasts] = useState<LiveNotificationItem[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Keep track of known item IDs to only notify on genuinely new items
  const knownQuoteIds = useRef<Set<string>>(new Set());
  const knownMessageIds = useRef<Set<string>>(new Set());
  const knownAppIds = useRef<Set<string>>(new Set());
  const isInitialMount = useRef<boolean>(true);

  // Initial population of existing items
  useEffect(() => {
    if (isInitialMount.current) {
      quotes.forEach((q) => knownQuoteIds.current.add(q.id));
      messages.forEach((m) => knownMessageIds.current.add(m.id));
      applications.forEach((a) => knownAppIds.current.add(a.id));
      isInitialMount.current = false;
      return;
    }

    const newNotifications: LiveNotificationItem[] = [];

    // Check new Quotation Requests
    quotes.forEach((q) => {
      if (!knownQuoteIds.current.has(q.id)) {
        knownQuoteIds.current.add(q.id);
        newNotifications.push({
          id: `quote-${q.id}`,
          type: 'quote',
          title: 'طلب عرض سعر وتوريد جديد 📥',
          subtitle: q.productName || 'طلب تسعير منتج',
          detail: `العميل: ${q.clientName} (${q.companyName || 'فردي'}) • الكمية: ${q.quantity || 1}`,
          date: new Date(),
          targetTab: 'quotes',
        });
      }
    });

    // Check new Contact Messages / Inquiries
    messages.forEach((m) => {
      if (!knownMessageIds.current.has(m.id)) {
        knownMessageIds.current.add(m.id);
        newNotifications.push({
          id: `msg-${m.id}`,
          type: 'message',
          title: 'استفسار عميل / زائر جديد ✉️',
          subtitle: m.name,
          detail: `الموضوع: ${m.subject || 'استفسار عام'}`,
          date: new Date(),
          targetTab: 'messages',
        });
      }
    });

    // Check new Job Applications
    applications.forEach((a) => {
      if (!knownAppIds.current.has(a.id)) {
        knownAppIds.current.add(a.id);
        newNotifications.push({
          id: `app-${a.id}`,
          type: 'application',
          title: 'طلب تقديم وظيفي وسيرة ذاتية 💼',
          subtitle: a.fullName,
          detail: `الوظيفة: ${a.jobTitle} • التخصص: ${a.qualification || 'مؤهل جامعي'}`,
          date: new Date(),
          targetTab: 'applications',
        });
      }
    });

    if (newNotifications.length > 0) {
      if (soundEnabled) {
        playNotificationSound();
      }
      setToasts((prev) => [...newNotifications, ...prev].slice(0, 5));
    }
  }, [quotes, messages, applications, soundEnabled]);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToastClick = (toast: LiveNotificationItem) => {
    onNavigateTab(toast.targetTab);
    dismissToast(toast.id);
  };

  // Optional test trigger for the admin to verify notifications
  const triggerTestNotification = () => {
    playNotificationSound();
    const testToast: LiveNotificationItem = {
      id: `test-${Date.now()}`,
      type: 'quote',
      title: 'إشعار تجريبي لاختبار التنبيهات 🔔',
      subtitle: 'نظام المتابعة الفورية لمجموعة جياد',
      detail: 'تنبيه وصول طلب تجريبي يعمل بنجاح!',
      date: new Date(),
      targetTab: 'overview' as unknown as 'quotes',
    };
    setToasts((prev) => [testToast, ...prev]);
  };

  return (
    <>
      {/* Sound & Controls Bar Widget inside Dashboard */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
            soundEnabled
              ? 'bg-sky-50 text-[#004B87] border-sky-200'
              : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
          title={soundEnabled ? 'صوت التنبيهات الفورية مفعل' : 'صوت التنبيهات مكتوم'}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">
            {soundEnabled ? 'صوت التنبيه: مفعّل' : 'صوت التنبيه: صامت'}
          </span>
        </button>

        <button
          onClick={triggerTestNotification}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 hover:text-[#004B87] bg-white border border-slate-200 hover:bg-slate-50 transition cursor-pointer"
          title="اختبار ظهور الإشعار الفوري"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">اختبار إشعار</span>
        </button>
      </div>

      {/* Floating Real-Time Toast Container (Top Left/Right in RTL) */}
      <div
        className="fixed bottom-5 left-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none"
        dir="rtl"
      >
        <AnimatePresence>
          {toasts.map((toast) => {
            const isQuote = toast.type === 'quote';
            const isMessage = toast.type === 'message';
            const isApp = toast.type === 'application';

            const borderColor = isQuote
              ? 'border-amber-400 bg-amber-50/95'
              : isMessage
              ? 'border-blue-400 bg-blue-50/95'
              : 'border-emerald-400 bg-emerald-50/95';

            const iconBg = isQuote
              ? 'bg-amber-500 text-white'
              : isMessage
              ? 'bg-blue-600 text-white'
              : 'bg-emerald-600 text-white';

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className={`pointer-events-auto shadow-xl backdrop-blur-md rounded-2xl border p-4 transition-all duration-200 ${borderColor}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${iconBg}`}>
                    {isQuote && <FileSpreadsheet className="w-5 h-5" />}
                    {isMessage && <Inbox className="w-5 h-5" />}
                    {isApp && <Briefcase className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <h4 className="text-xs font-bold text-slate-900 leading-tight">
                          {toast.title}
                        </h4>
                      </div>
                      <button
                        onClick={() => dismissToast(toast.id)}
                        className="text-slate-400 hover:text-slate-700 p-0.5 rounded-md transition cursor-pointer"
                        aria-label="إغلاق التنبيه"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs font-bold text-slate-800 mt-1 truncate">
                      {toast.subtitle}
                    </p>

                    <p className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">
                      {toast.detail}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">
                        الآن (تحديث مباشر)
                      </span>

                      <button
                        onClick={() => handleToastClick(toast)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#004B87] hover:bg-[#003B6B] text-white text-[11px] font-bold transition shadow-xs cursor-pointer"
                      >
                        <span>متابعة الطلب</span>
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </>
  );
};
