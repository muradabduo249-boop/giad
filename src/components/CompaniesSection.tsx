import React from 'react';
import { motion } from 'motion/react';
import { Building2, ArrowLeft, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { COMPANIES } from '../data/giadData';
import { Company } from '../types';

interface CompaniesSectionProps {
  onSelectCompany: (company: Company) => void;
}

export const CompaniesSection: React.FC<CompaniesSectionProps> = ({ onSelectCompany }) => {
  return (
    <section id="companies" className="py-20 sm:py-24 bg-white text-[#0A1F36] relative scroll-mt-20 sm:scroll-mt-24">
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
              محفظة الاستثمار الصناعي
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A1F36] tracking-tight font-sans">
              شركات المجموعة التابعة
            </h2>
          </div>
          <p className="text-sm md:text-base text-slate-600 max-w-md mt-4 md:mt-0 font-sans">
            منظومة متكاملة من الشركات الصناعية والخدمية المتخصصة، تعمل بتناغم هندسي لتغطية سلاسل القيمة الوطنية.
          </p>
        </motion.div>

        {/* Corporate Portfolio Editorial Grid with Staggered Motion */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {COMPANIES.map((company, index) => {
            return (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: 'easeOut' }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group relative bg-[#F8FAFC] hover:bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-[#0084CA]/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image & Logo Header */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={company.image}
                    alt={company.nameAr}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F36]/80 via-transparent to-transparent" />

                  {/* Logo / Monogram badge */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-xs font-black text-[#004B87] tracking-wider">
                      {company.logoText}
                    </span>
                  </div>

                  {/* Company Title */}
                  <div className="absolute bottom-4 right-4 left-4 text-white">
                    <span className="text-[11px] font-semibold text-sky-300 block mb-0.5">
                      {company.industryAr}
                    </span>
                    <h3 className="text-xl font-bold font-sans text-white">
                      {company.nameAr}
                    </h3>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-sm text-slate-600 leading-relaxed font-sans line-clamp-3">
                    {company.shortDescriptionAr}
                  </p>

                  <div className="pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-500">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#0084CA]" />
                        <span>تأسست: {company.establishedYear} م</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="line-clamp-1">{company.locationAr}</span>
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => onSelectCompany(company)}
                      className="inline-flex items-center gap-2 text-xs font-bold text-[#004B87] hover:text-[#0084CA] transition"
                    >
                      <span>الملف المؤسسي للشركة</span>
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    </button>

                    <a
                      href={company.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-[#004B87] hover:bg-slate-100 transition"
                      title="الموقع الرسمي"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
