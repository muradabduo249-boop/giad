import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Factory, History, Globe2, Compass, ShieldCheck, Award } from 'lucide-react';
import { TIMELINE, GIAD_INFO } from '../data/giadData';

export const AboutSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline'>('overview');

  return (
    <section id="about" className="py-16 sm:py-24 bg-white text-[#0A1F36] relative overflow-hidden scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 pb-6 border-b border-slate-200"
        >
          <div>
            <span className="text-xs md:text-sm font-bold text-[#0084CA] tracking-wider uppercase block mb-2 font-sans">
              عن المجموعة وريادتها الصناعية
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A1F36] tracking-tight font-sans">
              مجموعة جياد للصناعات الهندسية
            </h2>
          </div>

          <div className="mt-4 md:mt-0 w-full sm:w-auto grid grid-cols-2 sm:flex items-center gap-1.5 bg-[#F1F5F9] p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition text-center cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#004B87] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-[#0A1F36]'
              }`}
            >
              الرؤية والنشأة
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition text-center cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-[#004B87] text-white shadow-sm font-bold'
                  : 'text-slate-600 hover:text-[#0A1F36]'
              }`}
            >
              مسيرة الإنجازات (Timeline)
            </button>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' ? (
            /* Editorial Split Layout with Motion */
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
            >
              {/* Left/Image column with Architectural 1993 Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-6 relative"
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-[#F8FAFC]">
                  <img
                    src="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
                    alt="مجمع مدينة جياد الصناعية وورش التصنيع الثقيل"
                    className="w-full h-80 sm:h-[420px] md:h-[500px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F36]/80 via-transparent to-transparent" />

                  {/* Floating Architectural 1993 Badge */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-6 p-4 sm:p-5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl flex items-center justify-between text-[#0A1F36]"
                  >
                    <div>
                      <span className="text-xs font-bold text-[#0084CA] uppercase tracking-wider block">
                        انطلاق القاعدة الصناعية
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-[#0A1F36] mt-0.5 block">
                        مدينة جياد الصناعية — الكيلو 50
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[#004B87] font-sans tracking-tighter">
                        1993
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right/Text Editorial Narrative */}
              <div className="lg:col-span-6 space-y-5 sm:space-y-6">
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0A1F36] leading-snug font-sans">
                    منظومة تصنيع متكاملة تُؤسس للبنية التحتية، وتواكب متطلبات الثورة الصناعية الحديثة.
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-sans">
                    تعد مجموعة جياد للصناعات الهندسية إحدى أضخم القلاع الصناعية في المنطقة الإفريقية والعربية. تأسست المجموعة بهدف توطين الصناعات الاستراتيجية وبناء قاعدة هندسية قادرة على تلبية متطلبات النهضة الشاملة.
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-slate-500 leading-relaxed font-sans">
                    يمتد مجمع مدينة جياد الصناعية على مساحة شاسعة تضم مصانع السيارات والشاحنات، مسبوكات الحديد والصلب، خطوط إنتاج الكابلات الكهربائية المعزولة، والمعدات الزراعية المتطورة، بإشراف آلاف المهندسين والفنيين المؤهلين على أعلى المستويات.
                  </p>
                </div>

                {/* Pillars list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-slate-200">
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 transition-all hover:border-[#0084CA]/30"
                  >
                    <div className="p-2 rounded-lg bg-sky-50 text-[#0084CA] shrink-0 border border-sky-100">
                      <Factory className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0A1F36]">بنية تصنيع وطنية</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">تغطية سلاسل التوريد والإنتاج الثقيل</p>
                    </div>
                  </motion.div>

                  <motion.div
                    whileHover={{ y: -3 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200 transition-all hover:border-[#0084CA]/30"
                  >
                    <div className="p-2 rounded-lg bg-sky-50 text-[#0084CA] shrink-0 border border-sky-100">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0A1F36]">معايير الجودة العالمية</h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">شهادات الأيزو والاعتماد الهندسي</p>
                    </div>
                  </motion.div>
                </div>

                {/* Quote Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 shadow-xs">
                  <p className="text-xs sm:text-sm font-medium text-slate-700 italic leading-relaxed">
                    "التزامنا الراسخ هو أن تكون الصناعة الوطنية شريان التنمية الدائم، وأن نحول الموارد الخام إلى ثروة هندسية مستدامة للأجيال القادمة."
                  </p>
                  <span className="block text-xs font-bold text-[#004B87] mt-2">
                    — مجلس إدارة مجموعة جياد للصناعات الهندسية
                  </span>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Historical Timeline View with Motion */
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto py-4 sm:py-6"
            >
              <div className="text-center mb-8 sm:mb-12">
                <h3 className="text-xl sm:text-2xl font-bold text-[#0A1F36]">محطات فارقة في مسيرة جياد الهندسية</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">أكثر من ثلاثة عقود من الريادة والتطوير المستمر منذ 1993</p>
              </div>

              <div className="relative border-r-2 border-[#0084CA]/30 mr-2 sm:mr-28 space-y-6 sm:space-y-8">
                {TIMELINE.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.5 }}
                    className="relative pr-6 sm:pr-8"
                  >
                    {/* Timeline point */}
                    <span className="absolute -right-[9px] top-2 w-4 h-4 rounded-full bg-[#0084CA] border-4 border-white ring-2 ring-[#0084CA]/30" />

                    {/* Year Tag */}
                    <div className="sm:absolute sm:-right-28 sm:top-1 mb-1 sm:mb-0 text-right">
                      <span className="text-sm sm:text-lg font-black text-[#004B87] font-sans">
                        {item.year}
                      </span>
                    </div>

                    {/* Card Content */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="p-4 sm:p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <h4 className="text-sm sm:text-base font-bold text-[#0A1F36] mb-1 font-sans">
                        {item.titleAr}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                        {item.descriptionAr}
                      </p>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
