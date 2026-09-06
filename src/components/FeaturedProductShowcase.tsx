import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Check, ShieldCheck, Cpu } from 'lucide-react';
import { PRODUCTS } from '../data/giadData';
import { Product } from '../types';

interface FeaturedProductShowcaseProps {
  onViewProduct: (product: Product) => void;
  customProducts?: Product[];
}

export const FeaturedProductShowcase: React.FC<FeaturedProductShowcaseProps> = ({
  onViewProduct,
  customProducts,
}) => {
  const allProducts = customProducts && customProducts.length > 0 ? customProducts : PRODUCTS;
  const featuredProduct = allProducts.find((p) => p.featured) || allProducts[0];

  return (
    <section className="py-20 sm:py-24 bg-[#F1F5F9] text-[#0A1F36] relative overflow-hidden border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Visual Showcase (7 cols) with Motion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-7 relative group"
          >
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white">
              <img
                src={featuredProduct.image}
                alt={featuredProduct.nameAr}
                referrerPolicy="no-referrer"
                className="w-full h-[320px] sm:h-[450px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F36]/80 via-transparent to-transparent" />

              {/* Floating Badge */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6">
                <span className="px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs font-bold bg-[#0084CA] text-white shadow-lg backdrop-blur-md">
                  منتج هندسي متميز
                </span>
              </div>

              {/* Bottom spec ticker - Clean quality standard */}
              <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 left-4 sm:left-6 flex items-center justify-between text-xs text-slate-700 bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-md">
                <span className="font-semibold text-slate-700">معايير الجودة والتصنيع الهندسي</span>
                <span className="text-[#004B87] font-bold">جاهز للتسليم الفوري</span>
              </div>
            </div>
          </motion.div>

          {/* Details & Specs (5 cols) with Generous Whitespace */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-5 space-y-6 sm:space-y-8"
          >
            <div className="space-y-2 sm:space-y-3">
              <span className="text-xs font-bold tracking-widest text-[#0084CA] uppercase block font-sans">
                {featuredProduct.categoryAr}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0A1F36] leading-tight font-sans">
                {featuredProduct.nameAr}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-slate-500 font-sans tracking-wide">
                {featuredProduct.nameEn}
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
              {featuredProduct.shortDescriptionAr}
            </p>

            {/* Key Specs Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {featuredProduct.specs.slice(0, 4).map((spec, idx) => (
                <div
                  key={idx}
                  className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-center shadow-xs"
                >
                  <span className="text-[11px] text-slate-500">{spec.labelAr}</span>
                  <span className="text-xs sm:text-sm font-bold text-[#0A1F36] mt-1">{spec.valueAr}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="pt-2 sm:pt-4 flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onViewProduct(featuredProduct)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white font-bold text-sm sm:text-base transition-all duration-200 shadow-lg shadow-[#004B87]/20 hover:shadow-xl cursor-pointer"
              >
                <span>عرض المنتج والمواصفات</span>
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:-translate-x-1" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
