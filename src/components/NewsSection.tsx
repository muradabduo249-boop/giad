import React from 'react';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { NEWS_ITEMS } from '../data/giadData';
import { NewsItem } from '../types';

interface NewsSectionProps {
  onSelectNews: (news: NewsItem) => void;
  customNews?: NewsItem[];
}

export const NewsSection: React.FC<NewsSectionProps> = ({ onSelectNews, customNews }) => {
  const allNews = customNews && customNews.length > 0 ? customNews : NEWS_ITEMS;
  const featuredNews = allNews.find((n) => n.featured) || allNews[0];
  const sideNews = allNews.filter((n) => n.id !== featuredNews.id);

  return (
    <section id="news" className="py-24 bg-[#F8FAFC] border-y border-slate-200 text-[#0A1F36] relative scroll-mt-20 sm:scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-slate-200">
          <div>
            <span className="text-xs md:text-sm font-bold text-[#0084CA] tracking-wider uppercase block mb-2 font-sans">
              المركز الإعلامي والمستجدات
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A1F36] tracking-tight font-sans">
              الأخبار والفعاليات الرسمية
            </h2>
          </div>
          <p className="text-sm md:text-base text-slate-600 max-w-md mt-4 md:mt-0 font-sans">
            متابعة إعلامية دورية لتطورات خطوط الإنتاج، توقيع الشراكات الاستراتيجية، وأنشطة المجموعة الوطنية.
          </p>
        </div>

        {/* Editorial Layout: Large Featured Story + Smaller Side Stories */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Main Editorial Story (7 cols) */}
          <div
            onClick={() => onSelectNews(featuredNews)}
            className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl hover:border-[#0084CA]/50 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
          >
            <div className="relative h-72 sm:h-96 overflow-hidden">
              <img
                src={featuredNews.image}
                alt={featuredNews.titleAr}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F36]/90 via-[#0A1F36]/40 to-transparent" />

              <div className="absolute top-6 right-6">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0084CA] text-white shadow-md">
                  {featuredNews.categoryAr}
                </span>
              </div>

              <div className="absolute bottom-6 right-6 left-6 text-white space-y-2">
                <div className="flex items-center gap-4 text-xs text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-sky-300" />
                    <span>{featuredNews.date}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-300" />
                    <span>{featuredNews.readTimeAr}</span>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-sans leading-snug group-hover:text-sky-300 transition">
                  {featuredNews.titleAr}
                </h3>
              </div>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4 bg-white">
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-sans">
                {featuredNews.excerptAr}
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-bold text-[#004B87] group-hover:text-[#0084CA] transition flex items-center gap-2">
                  <span>قراءة البيان الإخباري كاملاً</span>
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </span>
                <span className="text-xs text-slate-400">إعلام جياد الرسمي</span>
              </div>
            </div>
          </div>

          {/* Side Editorial Articles (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            {sideNews.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectNews(item)}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#0084CA]/40 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div className="flex gap-4 items-start">
                  <img
                    src={item.image}
                    alt={item.titleAr}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 border border-slate-200 transition"
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-[#0084CA] font-bold">
                      <span>{item.categoryAr}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 font-normal">{item.date}</span>
                    </div>
                    <h4 className="text-sm font-bold text-[#0A1F36] group-hover:text-[#004B87] transition font-sans line-clamp-2 leading-snug">
                      {item.titleAr}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.excerptAr}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>{item.readTimeAr}</span>
                  <span className="text-[#004B87] group-hover:text-[#0084CA] font-bold flex items-center gap-1">
                    <span>التفاصيل</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
