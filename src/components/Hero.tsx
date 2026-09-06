import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChevronDown, Layers, Award, ShieldCheck, Factory, PhoneCall } from 'lucide-react';
import { GIAD_INFO } from '../data/giadData';
import heroBgImage from '../assets/images/giad_hero_clear_1788678606374.jpg';

interface HeroProps {
  onExploreSectors: () => void;
  onAboutGiad: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreSectors, onAboutGiad }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-white text-[#0A1F36] pt-24 sm:pt-28 lg:pt-36 pb-12 sm:pb-16"
    >
      {/* Background Hero Image with Clean Light Overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0"
      >
        <img
          src={heroBgImage}
          alt="مجمع مصانع وخطوط التصنيع الهندسي في مجموعة جياد الصناعية"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center brightness-95 contrast-105"
        />
        {/* Directional gradient protecting text readability on right while keeping image clear and vivid on center/left */}
        <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/80 to-white/20 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
      </motion.div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto w-full">
        <div className="max-w-3xl space-y-5 sm:space-y-6 md:space-y-8">
          {/* Subtle Corporate Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0084CA]/10 border border-[#0084CA]/25 backdrop-blur-md shadow-xs"
          >
            <span className="w-2 h-2 rounded-full bg-[#0084CA] animate-pulse" />
            <span className="text-[11px] sm:text-xs md:text-sm font-bold text-[#004B87] font-sans">
              البوابة الرسمية لمجموعة جياد للصناعات الهندسية
            </span>
          </motion.div>

          {/* Primary Headline: نصنع الصناعة ونبني المستقبل */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight font-sans leading-[1.2] text-[#0A1F36]"
          >
            نصنع الصناعة <br />
            <span className="text-[#004B87] font-black">ونبني المستقبل</span>
          </motion.h1>

          {/* Concise Description */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: 'easeOut' }}
            className="text-sm sm:text-base md:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl font-sans"
          >
            منذ تأسيسها عام 1993، تقود مجموعة جياد قاطرة التنمية الصناعية كأكبر مجمع هندسي متكامل، متخصص في تجميع وتصنيع السيارات والشاحنات، الميكنة الزراعية، كابلات الطاقة، وتشكيل المعادن لترسيخ السيادة الصناعية.
          </motion.p>

          {/* CTAs with Full Mobile Friendliness */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.6, ease: 'easeOut' }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
          >
            {/* Primary CTA */}
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#sectors"
              onClick={onExploreSectors}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-[#004B87]/20 hover:shadow-xl cursor-pointer"
            >
              <span>اكتشف قطاعاتنا الصناعية</span>
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 -translate-x-0.5 group-hover:-translate-x-1.5 transition" />
            </motion.a>

            {/* Secondary CTA */}
            <motion.a
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              href="#about"
              onClick={onAboutGiad}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-white hover:bg-slate-50 text-[#0A1F36] font-semibold text-sm sm:text-base border border-slate-300 shadow-xs transition-all duration-200 hover:border-slate-400 cursor-pointer"
            >
              <span>نبذة عن جياد (1993)</span>
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Editorial Corporate Stats Strip with Motion Hover */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.75, ease: 'easeOut' }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10 sm:mt-12"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 p-4 sm:p-5 md:p-6 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-xl shadow-slate-200/50">
          {GIAD_INFO.stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-3 sm:p-4 rounded-xl bg-slate-50/70 sm:bg-transparent sm:border-r sm:border-slate-200 sm:first:border-r-0 flex flex-col justify-center text-center sm:text-right transition-colors hover:bg-sky-50/50"
            >
              <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#004B87] tracking-tight font-sans">
                {stat.value}
              </span>
              <span className="text-[11px] sm:text-xs md:text-sm text-slate-600 font-semibold mt-1">
                {stat.labelAr}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Subtle Scroll Indicator (hidden on small phone screens to save viewport space) */}
      <div className="relative z-10 hidden sm:flex justify-center mt-6">
        <a
          href="#about"
          className="text-slate-400 hover:text-[#004B87] transition p-2 rounded-full focus:outline-none"
          aria-label="النزول للأسفل"
        >
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </a>
      </div>
    </section>
  );
};
