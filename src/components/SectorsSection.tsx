import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowUpLeft } from 'lucide-react';
import { SECTORS } from '../data/giadData';
import { Sector } from '../types';

interface SectorsSectionProps {
  onSelectSector: (sector: Sector) => void;
}

export const SectorsSection: React.FC<SectorsSectionProps> = ({ onSelectSector }) => {
  const [activeSectorId, setActiveSectorId] = useState<string>(SECTORS[0].id);

  const featuredSector = SECTORS.find((s) => s.id === activeSectorId) || SECTORS[0];

  return (
    <section id="sectors" className="py-20 sm:py-24 bg-[#F8FAFC] border-y border-slate-200 text-[#0A1F36] relative scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Motion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl mb-12 sm:mb-16"
        >
          <span className="text-xs md:text-sm font-bold text-[#0084CA] tracking-wider uppercase block mb-2 font-sans">
            المنظومة الصناعية المتخصصة
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A1F36] tracking-tight font-sans">
            قطاعاتنا الصناعية الرائدة
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 sm:mt-4 leading-relaxed font-sans">
            تتوزع أنشطة مجموعة جياد عبر 6 قطاعات حيوية تشكل البنية الأساسية للصناعة الثقيلة والنقل والزراعة والطاقة، مما يضمن تكامل سلاسل القيمة وتحقيق الاستقلالية التنموية.
          </p>
        </motion.div>

        {/* Dynamic Editorial Sector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Featured Sector Showcase (7 Columns) with AnimatePresence */}
          <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl flex flex-col justify-between group transition-all duration-300">
            <AnimatePresence mode="wait">
              <motion.div
                key={featuredSector.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex flex-col h-full justify-between"
              >
                {/* Visual Hero Image for Sector */}
                <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
                  <img
                    src={featuredSector.image}
                    alt={featuredSector.titleAr}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F36]/90 via-[#0A1F36]/40 to-transparent" />

                  <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
                    <span className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-bold bg-[#0084CA] text-white shadow-md">
                      {featuredSector.badgeAr}
                    </span>
                  </div>

                  <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-6 text-white">
                    <span className="text-xs text-sky-300 font-sans tracking-wide block mb-1">
                      {featuredSector.titleEn}
                    </span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold font-sans">
                      {featuredSector.titleAr}
                    </h3>
                  </div>
                </div>

                {/* Description & Capabilities */}
                <div className="p-5 sm:p-7 md:p-8 space-y-5 sm:space-y-6 flex-1 flex flex-col justify-between bg-white">
                  <div className="space-y-4">
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
                      {featuredSector.descriptionAr}
                    </p>

                    {/* Key products tags */}
                    <div className="pt-2">
                      <span className="text-xs font-bold text-slate-500 block mb-2 font-sans">
                        أبرز مجالات الإنتاج:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {featuredSector.keyProducts.map((prod, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 sm:px-3 py-1 rounded-lg bg-[#F1F5F9] text-xs font-semibold text-slate-700 border border-slate-200 font-sans"
                          >
                            {prod}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Button - Fully responsive, clean, no awkward ISO 9001 */}
                  <div className="pt-5 sm:pt-6 border-t border-slate-100 flex items-center justify-start">
                    <button
                      onClick={() => onSelectSector(featuredSector)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white text-sm sm:text-base font-bold transition-all duration-200 shadow-md shadow-[#004B87]/20 hover:shadow-lg active:scale-[0.98] cursor-pointer group"
                    >
                      <span>استكشف تفاصيل القطاع</span>
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:-translate-x-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Complementary Sectors Editorial Selector (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5 sm:space-y-3">
            <span className="text-xs font-bold text-slate-500 px-1 mb-1 block font-sans">
              اختر قطاعاً لاستعراض قدراته:
            </span>

            {SECTORS.map((sector, index) => {
              const isSelected = sector.id === activeSectorId;
              return (
                <motion.div
                  key={sector.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06, duration: 0.4 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setActiveSectorId(sector.id)}
                  className={`p-3 sm:p-4 rounded-2xl cursor-pointer transition-all duration-200 border flex items-center justify-between gap-3 sm:gap-4 ${
                    isSelected
                      ? 'bg-white border-[#004B87] shadow-md ring-2 ring-[#004B87]/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={sector.image}
                      alt={sector.titleAr}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                    />
                    <div>
                      <h4
                        className={`text-sm sm:text-base font-bold transition font-sans ${
                          isSelected ? 'text-[#004B87]' : 'text-[#0A1F36]'
                        }`}
                      >
                        {sector.titleAr}
                      </h4>
                      <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 mt-0.5 font-sans">
                        {sector.subtitleAr}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSector(sector);
                    }}
                    className={`p-2 rounded-xl transition cursor-pointer shrink-0 ${
                      isSelected
                        ? 'bg-[#004B87] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-[#0A1F36] hover:bg-slate-200'
                    }`}
                    title="فتح تفاصيل القطاع"
                  >
                    <ArrowUpLeft className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
