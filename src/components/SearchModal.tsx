import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ChevronLeft, ArrowRight, Layers, Building2, Package, Newspaper } from 'lucide-react';
import { SECTORS, COMPANIES, PRODUCTS, NEWS_ITEMS } from '../data/giadData';
import { Product, NewsItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSector: (sectorId: string) => void;
  onSelectCompany: (companyId: string) => void;
  onSelectProduct: (productId: string) => void;
  customProducts?: Product[];
  customNews?: NewsItem[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSector,
  onSelectCompany,
  onSelectProduct,
  customProducts,
  customNews,
}) => {
  const [query, setQuery] = useState('');

  const productsList = customProducts && customProducts.length > 0 ? customProducts : PRODUCTS;
  const newsList = customNews && customNews.length > 0 ? customNews : NEWS_ITEMS;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { sectors: [], companies: [], products: [], news: [] };

    return {
      sectors: SECTORS.filter(
        (s) =>
          s.titleAr.toLowerCase().includes(q) ||
          s.titleEn.toLowerCase().includes(q) ||
          s.descriptionAr.toLowerCase().includes(q)
      ),
      companies: COMPANIES.filter(
        (c) =>
          c.nameAr.toLowerCase().includes(q) ||
          c.nameEn.toLowerCase().includes(q) ||
          c.industryAr.toLowerCase().includes(q)
      ),
      products: productsList.filter(
        (p) =>
          p.nameAr.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.categoryAr.toLowerCase().includes(q)
      ),
      news: newsList.filter((n) => n.titleAr.toLowerCase().includes(q)),
    };
  }, [query, productsList, newsList]);

  const totalResults =
    results.sectors.length +
    results.companies.length +
    results.products.length +
    results.news.length;

  if (!isOpen) return null;

  return (
    <div
      id="giad-search-overlay"
      className="fixed inset-0 z-50 flex items-start justify-center pt-4 sm:pt-16 md:pt-20 px-3 sm:px-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#0A1F36]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <div className="flex items-center px-3.5 sm:px-4 py-3 sm:py-3.5 border-b border-slate-200 bg-[#F8FAFC]">
          <Search className="w-5 h-5 text-[#0084CA] shrink-0 ml-2.5 sm:ml-3" />
          <input
            id="giad-global-search-input"
            type="text"
            placeholder="ابحث في قطاعات، شركات، ومنتجات جياد..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-[#0A1F36] placeholder-slate-400 text-base focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1.5 bg-slate-200 rounded-lg mr-1 sm:mr-2 cursor-pointer font-bold shrink-0 flex items-center justify-center"
            aria-label="إغلاق البحث"
          >
            <span className="hidden sm:inline">Esc</span>
            <X className="w-4 h-4 sm:hidden" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[65vh] overflow-y-auto p-3 sm:p-4 space-y-4">
          {!query && (
            <div className="py-8 text-center text-slate-500">
              <p className="text-sm font-medium">اكتب كلمة للبحث في المنظومة الصناعية لمجموعة جياد</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                {['شاحنات', 'جرار زراعي', 'سيارات كهربائية', 'كابلات السويدي', 'تشكيل معادن'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 hover:bg-sky-50 hover:text-[#004B87] transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="py-12 text-center text-slate-500">
              <p className="text-base font-semibold text-[#0A1F36]">لم يتم العثور على نتائج مطابقة لـ "{query}"</p>
              <p className="text-sm text-slate-500 mt-1">يرجى التأكد من صحة الكلمات أو البحث بتصنيف آخر.</p>
            </div>
          )}

          {/* Sectors results */}
          {results.sectors.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0084CA] mb-2 px-1">
                <Layers className="w-3.5 h-3.5" />
                <span>القطاعات الصناعية ({results.sectors.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.sectors.map((sector) => (
                  <button
                    key={sector.id}
                    onClick={() => {
                      onSelectSector(sector.id);
                      onClose();
                    }}
                    className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-[#0A1F36] group-hover:text-[#0084CA] transition">
                        {sector.titleAr}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{sector.subtitleAr}</p>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-[#0084CA] -translate-x-1 group-hover:translate-x-0 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Companies results */}
          {results.companies.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0084CA] mb-2 px-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>شركات المجموعة ({results.companies.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.companies.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      onSelectCompany(comp.id);
                      onClose();
                    }}
                    className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-[#0A1F36] group-hover:text-[#0084CA] transition">
                        {comp.nameAr}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{comp.industryAr}</p>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-[#0084CA] -translate-x-1 group-hover:translate-x-0 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products results */}
          {results.products.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0084CA] mb-2 px-1">
                <Package className="w-3.5 h-3.5" />
                <span>المنتجات والمعدات ({results.products.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.products.map((prod) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      onSelectProduct(prod.id);
                      onClose();
                    }}
                    className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={prod.image}
                        alt={prod.nameAr}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-[#0A1F36] group-hover:text-[#0084CA] transition">
                          {prod.nameAr}
                        </h4>
                        <span className="text-[11px] text-[#0084CA] font-medium">{prod.categoryAr}</span>
                      </div>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-[#0084CA] -translate-x-1 group-hover:translate-x-0 transition" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* News results */}
          {results.news.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#0084CA] mb-2 px-1">
                <Newspaper className="w-3.5 h-3.5" />
                <span>الأخبار والفعاليات ({results.news.length})</span>
              </div>
              <div className="space-y-1.5">
                {results.news.map((item) => (
                  <a
                    key={item.id}
                    href="#news"
                    onClick={onClose}
                    className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition flex items-center justify-between group"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-[#0A1F36] group-hover:text-[#0084CA] transition">
                        {item.titleAr}
                      </h4>
                      <p className="text-xs text-slate-500">{item.date}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#0084CA] transition" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
