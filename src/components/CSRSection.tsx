import React from 'react';
import { GraduationCap } from 'lucide-react';
import { CSR_INITIATIVES } from '../data/giadData';

export const CSRSection: React.FC = () => {
  return (
    <section id="csr" className="py-24 bg-white text-[#0A1F36] relative scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs md:text-sm font-bold text-[#0084CA] tracking-wider uppercase block mb-2 font-sans">
            أثر مستدام في المجتمع والإنسان
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A1F36] tracking-tight font-sans">
            المسؤولية المجتمعية والتنمية
          </h2>
          <p className="text-base text-slate-600 mt-4 leading-relaxed font-sans">
            تؤمن مجموعة جياد بأن الصناعة الحقيقية تبدأ ببناء الإنسان وتنمية المجتمع. تمتد برامجنا ومبادراتنا لتشمل التدريب المهني، الخدمات الصحية، وإسناد المشاريع الحيوية في شتى ربوع الوطن.
          </p>
        </div>

        {/* Highlight Feature: The Human Impact Banner */}
        <div className="rounded-3xl overflow-hidden bg-[#F8FAFC] text-[#0A1F36] border border-slate-200 shadow-xl mb-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Image Column */}
            <div className="lg:col-span-6 relative h-72 sm:h-96 lg:h-[480px]">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
                alt="تدريب وتأهيل الكوادر الوطنية في معهد جياد"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-[#0A1F36]/80 via-transparent to-transparent" />
            </div>

            {/* Content Column */}
            <div className="lg:col-span-6 p-8 sm:p-12 space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-[#0084CA] border border-sky-100">
                <GraduationCap className="w-4 h-4" />
                <span>معهد جياد للتدريب الفني</span>
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold font-sans leading-snug text-[#0A1F36]">
                تأهيل أكثر من 25,000 كادر وطني لتمكين الشباب وبناء كفاءات الغد
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
                يقدم المعهد برامج تدريبية متخصصة ومجانية لأبناء المجتمعات المحلية في مجالات صيانة السيارات، الميكنة الزراعية، وتشكيل المعادن والكهرباء، مما ساهم في خلق آلاف فرص العمل المستدامة وتطوير المشروعات الصغيرة.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-[#004B87] font-sans">
                    25,000+
                  </span>
                  <span className="text-xs text-slate-500 block mt-1">خريج فني معتمد</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-[#0A1F36] font-sans">
                    100%
                  </span>
                  <span className="text-xs text-slate-500 block mt-1">تأهيل مجاني مستمر</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars of CSR Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CSR_INITIATIVES.map((init) => (
            <div
              key={init.id}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#0084CA]/40 transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="text-xs font-bold text-[#004B87] bg-sky-50 px-3 py-1 rounded-lg border border-sky-100 inline-block">
                  {init.categoryAr}
                </span>
                <h4 className="text-base font-bold text-[#0A1F36] leading-snug font-sans">
                  {init.titleAr}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {init.descriptionAr}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <span className="text-xl sm:text-2xl font-extrabold text-[#004B87] block font-sans">
                  {init.statValue}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {init.statLabelAr}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
