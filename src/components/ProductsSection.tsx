import React, { useState, useMemo } from 'react';
import { Search, Filter, ArrowLeft, SlidersHorizontal, Check } from 'lucide-react';
import { PRODUCTS } from '../data/giadData';
import { Product } from '../types';

interface ProductsSectionProps {
  onSelectProduct: (product: Product) => void;
  initialCategory?: string;
  customProducts?: Product[];
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
  onSelectProduct,
  initialCategory = 'all',
  customProducts,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const allProducts = customProducts && customProducts.length > 0 ? customProducts : PRODUCTS;

  const categories = [
    { id: 'all', labelAr: 'كافة المنتجات' },
    { id: 'vehicles', labelAr: 'السيارات والمركبات' },
    { id: 'trucks', labelAr: 'الشاحنات والحافلات' },
    { id: 'agricultural', labelAr: 'الجرارات والميكنة' },
    { id: 'cables', labelAr: 'الكابلات والكهرباء' },
    { id: 'metal', labelAr: 'الهياكل والمعادن' },
  ];

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch =
        !searchTerm.trim() ||
        product.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoryAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shortDescriptionAr.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <section id="products" className="py-16 sm:py-24 bg-white text-[#0A1F36] relative scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs md:text-sm font-bold text-[#0084CA] tracking-wider uppercase block mb-2 font-sans">
              الكتالوج الصناعي المعتمد
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A1F36] tracking-tight font-sans">
              منتجاتنا الهندسية
            </h2>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 max-w-md mt-3 md:mt-0 font-sans">
            طيف واسع من الحلول الميكانيكية، المركبات الثقيلة، الكابلات عالية الاعتمادية، والآليات الزراعية المصممة لأقسى بيئات التشغيل.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 sm:gap-4 mb-8 sm:mb-12 p-3 sm:p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200">
          {/* Category Pills with smooth horizontal scrolling on mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-[#004B87] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.labelAr}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="البحث في الكتالوج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-white border border-slate-300 text-base sm:text-sm text-[#0A1F36] placeholder-slate-400 focus:outline-none focus:border-[#004B87] transition font-sans"
            />
          </div>
        </div>

        {/* Products Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-[#F8FAFC] rounded-3xl border border-dashed border-slate-300 p-6">
            <p className="text-base font-bold text-[#0A1F36]">لا توجد منتجات تطابق معايير البحث المحددة</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">جرب تغيير الفئة أو كتابة كلمة بحث أخرى.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchTerm('');
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#004B87] text-white text-xs font-bold"
            >
              عرض كافة المنتجات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct(product)}
                className="group cursor-pointer bg-white hover:bg-[#F8FAFC] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 hover:border-[#0084CA]/50 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product Image */}
                <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.nameAr}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/95 backdrop-blur-md text-[#004B87] border border-slate-200 shadow-sm">
                      {product.categoryAr}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#0A1F36] group-hover:text-[#004B87] transition line-clamp-1 font-sans">
                      {product.nameAr}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-sans tracking-wide">
                      {product.nameEn}
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                      {product.shortDescriptionAr}
                    </p>
                  </div>

                  {/* Top Spec Snippet */}
                  <div className="pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {product.specs[0]?.labelAr}:
                    </span>
                    <span className="font-bold text-[#0A1F36] line-clamp-1">
                      {product.specs[0]?.valueAr}
                    </span>
                  </div>

                  {/* Action Link */}
                  <div className="pt-1 flex items-center justify-between text-xs font-bold text-[#004B87] group-hover:text-[#0084CA] transition">
                    <span>عرض التفاصيل والمواصفات</span>
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
