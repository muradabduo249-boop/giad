import React, { useState } from 'react';
import { Briefcase, ArrowLeft, CheckCircle, MapPin, Clock, Users } from 'lucide-react';
import { JOB_OPENINGS } from '../data/giadData';
import { JobOpening } from '../types';
import giadEngineersImage from '../assets/images/giad_engineers_team_1788691480452.jpg';

interface CareersSectionProps {
  onApplyJob: (job: JobOpening) => void;
  customJobs?: JobOpening[];
}

export const CareersSection: React.FC<CareersSectionProps> = ({ onApplyJob, customJobs }) => {
  const [showOpenings, setShowOpenings] = useState(false);
  const allJobs = customJobs && customJobs.length > 0 ? customJobs : JOB_OPENINGS;

  return (
    <section id="careers" className="py-12 sm:py-16 md:py-24 bg-[#F8FAFC] border-y border-slate-200 relative text-[#0A1F36] scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Executive Employer CTA Card */}
        <div className="rounded-3xl overflow-hidden bg-white text-[#0A1F36] shadow-xl border border-slate-200 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* Content Column */}
            <div className="lg:col-span-7 p-5 sm:p-8 md:p-12 lg:p-16 space-y-4 sm:space-y-6">
              <span className="text-[11px] sm:text-xs md:text-sm font-bold tracking-wider text-[#0084CA] uppercase block font-sans">
                الفرص الوظيفية وبيئة العمل الهندسية
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0A1F36] font-sans leading-snug sm:leading-tight tracking-tight">
                كن جزءاً من مستقبل الصناعة
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed font-sans max-w-xl">
                نستثمر في العقول الهندسية والكفاءات الفنية الطموحة. نوفر في مجموعة جياد بيئة عمل محفزة، برامج تدريب مهني مستمرة، وفرصاً واعدة لقيادة كبرى مشروعات التصنيع في المنطقة.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 sm:pt-4">
                <button
                  onClick={() => setShowOpenings(!showOpenings)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-md shadow-[#004B87]/20 active:scale-[0.98] cursor-pointer"
                >
                  <span>استكشف فرص العمل المتاحة ({allJobs.length})</span>
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform" />
                </button>

                <button
                  onClick={() => onApplyJob(allJobs[0])}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0A1F36] font-semibold text-xs sm:text-sm border border-slate-200 transition active:scale-[0.98] cursor-pointer"
                >
                  <span>إرسال سيرة ذاتية عامة</span>
                </button>
              </div>
            </div>

            {/* Image Column */}
            <div className="lg:col-span-5 relative h-56 sm:h-80 lg:h-[480px]">
              <img
                src={giadEngineersImage}
                alt="فريق المهندسين والفنيين في مجموعة جياد"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#0A1F36]/80 via-transparent to-transparent" />

              <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-6 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 text-xs text-slate-700 shadow-sm">
                <span className="font-bold text-[#0A1F36] block mb-0.5">تطوير مستمر للمسار المهني</span>
                <span className="text-[11px] sm:text-xs">برامج تأهيل فني متقدمة بالتعاون مع بيوت الخبرة الدولية</span>
              </div>
            </div>
          </div>
        </div>

        {/* Expandable Open Positions Section */}
        {showOpenings && (
          <div className="mt-12 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xl font-bold text-[#0A1F36] font-sans">
                الوظائف الشاغرة حالياً ({allJobs.length})
              </h3>
              <span className="text-xs text-slate-500">تم التحديث مؤخراً</span>
            </div>

            {allJobs.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-sm font-bold text-[#0A1F36]">لا توجد وظائف شاغرة معلنة في الوقت الحالي</p>
                <p className="text-xs text-slate-500 mt-1">يمكنك إرسال سيرتك الذاتية لنحتفظ بها في قاعدة بيانات المواهب لمجموعتنا.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {allJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#0084CA]/40 transition flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-[#004B87] bg-sky-50 border border-sky-100 px-2.5 py-1 rounded-md inline-block">
                        {job.departmentAr}
                      </span>
                      <h4 className="text-base font-bold text-[#0A1F36] font-sans">
                        {job.titleAr}
                      </h4>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {job.descriptionAr}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-500">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#0084CA]" />
                          <span>{job.locationAr}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#0084CA]" />
                          <span>{job.experienceAr}</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onApplyJob(job)}
                      className="w-full py-2.5 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white text-xs font-bold transition text-center"
                    >
                      تقديم الطلب
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
