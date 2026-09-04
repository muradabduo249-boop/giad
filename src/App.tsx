import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { SectorsSection } from './components/SectorsSection';
import { CompaniesSection } from './components/CompaniesSection';
import { FeaturedProductShowcase } from './components/FeaturedProductShowcase';
import { ProductsSection } from './components/ProductsSection';
import { NewsSection } from './components/NewsSection';
import { CSRSection } from './components/CSRSection';
import { CareersSection } from './components/CareersSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

// Modals & Admin
import { SearchModal } from './components/SearchModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SectorDetailModal } from './components/SectorDetailModal';
import { CompanyDetailModal } from './components/CompanyDetailModal';
import { NewsDetailModal } from './components/NewsDetailModal';
import { CareerApplyModal } from './components/CareerApplyModal';
import { AdminDashboard } from './components/AdminDashboard';

// Data & Firebase Integration
import { SECTORS, COMPANIES, PRODUCTS as FALLBACK_PRODUCTS, NEWS_ITEMS as FALLBACK_NEWS, JOB_OPENINGS as FALLBACK_JOBS } from './data/giadData';
import { Sector, Company, Product, NewsItem, JobOpening, QuotationRequest, ContactMessage, JobApplication } from './types';
import {
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
  seedInitialDataIfEmpty,
  subscribeProducts,
  subscribeNews,
  subscribeJobs,
  subscribeSiteSettings,
  subscribeQuotationRequests,
  subscribeContactMessages,
  subscribeJobApplications,
} from './lib/firestoreService';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [searchOpen, setSearchOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // Dynamic Live State from Firestore
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [news, setNews] = useState<NewsItem[]>(FALLBACK_NEWS);
  const [jobs, setJobs] = useState<JobOpening[]>(FALLBACK_JOBS);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [quotes, setQuotes] = useState<QuotationRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);

  // Selected items for modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);

  // Contact form prefill
  const [contactSubject, setContactSubject] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');

  // Initialize and Subscribe to Firebase Firestore Live Data
  useEffect(() => {
    // Seed initial data if database collections are empty
    seedInitialDataIfEmpty().catch((err) => {
      console.warn('Initial seed check note:', err);
    });

    // Realtime listeners
    const unsubProducts = subscribeProducts((updatedProducts) => {
      if (updatedProducts && updatedProducts.length > 0) {
        setProducts(updatedProducts);
      }
    });

    const unsubNews = subscribeNews((updatedNews) => {
      if (updatedNews && updatedNews.length > 0) {
        setNews(updatedNews);
      }
    });

    const unsubJobs = subscribeJobs((updatedJobs) => {
      if (updatedJobs && updatedJobs.length > 0) {
        setJobs(updatedJobs);
      }
    });

    const unsubSettings = subscribeSiteSettings((updatedSettings) => {
      if (updatedSettings) {
        setSiteSettings(updatedSettings);
      }
    });

    const unsubQuotes = subscribeQuotationRequests((updatedQuotes) => {
      if (updatedQuotes) {
        setQuotes(updatedQuotes);
      }
    });

    const unsubMessages = subscribeContactMessages((updatedMessages) => {
      if (updatedMessages) {
        setMessages(updatedMessages);
      }
    });

    const unsubApps = subscribeJobApplications((updatedApps) => {
      if (updatedApps) {
        setApplications(updatedApps);
      }
    });

    return () => {
      unsubProducts();
      unsubNews();
      unsubJobs();
      unsubSettings();
      unsubQuotes();
      unsubMessages();
      unsubApps();
    };
  }, []);

  // Keyboard shortcut (Alt + A) to open Admin Dashboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isAltA = e.altKey && (e.key === 'a' || e.key === 'A' || e.key === 'ش');
      const isCtrlShiftA = (e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'a' || e.key === 'A' || e.key === 'ش');
      if (isAltA || isCtrlShiftA) {
        e.preventDefault();
        setAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Track active section during scroll
  useEffect(() => {
    const sections = ['hero', 'about', 'sectors', 'companies', 'products', 'news', 'csr', 'careers', 'contact'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const handleContactItem = (subject: string) => {
    setContactSubject(`طلب استفسار ومواصفات بخصوص: ${subject}`);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSectorCategoryFilter = (sectorId: string) => {
    const mapping: Record<string, string> = {
      automotive: 'vehicles',
      trucks: 'trucks',
      agricultural: 'agricultural',
      cables: 'cables',
      metal: 'metal',
    };
    if (mapping[sectorId]) {
      setProductCategoryFilter(mapping[sectorId]);
    }
  };

  const totalPendingCount =
    quotes.filter((q) => q.status === 'pending').length +
    messages.filter((m) => m.status === 'unread').length +
    applications.filter((a) => a.status === 'new').length;

  return (
    <div className="min-h-screen bg-white text-[#0A1F36] flex flex-col selection:bg-[#0084CA] selection:text-white font-sans">
      {/* Sticky Header Navbar with Admin trigger */}
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        currentLang={lang}
        onToggleLang={handleToggleLang}
        activeSection={activeSection}
        onOpenAdmin={() => setAdminOpen(true)}
        pendingCount={totalPendingCount}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onExploreSectors={() => {
            document.getElementById('sectors')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onAboutGiad={() => {
            document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. About GIAD (Editorial & 1993 Typography) */}
        <AboutSection />

        {/* 3. Industrial Sectors (Editorial Showcase) */}
        <SectorsSection onSelectSector={(sector) => setSelectedSector(sector)} />

        {/* 4. Group Companies (Corporate Portfolio) */}
        <CompaniesSection onSelectCompany={(comp) => setSelectedCompany(comp)} />

        {/* 5. Featured Grand Product Showcase */}
        <FeaturedProductShowcase
          onViewProduct={(prod) => setSelectedProduct(prod)}
          customProducts={products}
        />

        {/* 6. Products Catalog (Filterable & Searchable with Live Firestore updates) */}
        <ProductsSection
          onSelectProduct={(prod) => setSelectedProduct(prod)}
          initialCategory={productCategoryFilter}
          customProducts={products}
        />

        {/* 7. News & Events (Editorial layout with Live Firestore updates) */}
        <NewsSection
          onSelectNews={(newsItem) => setSelectedNews(newsItem)}
          customNews={news}
        />

        {/* 8. Corporate Social Responsibility (CSR) */}
        <CSRSection />

        {/* 9. Careers (Employer Branding with Live Firestore updates) */}
        <CareersSection
          onApplyJob={(job) => setSelectedJob(job)}
          customJobs={jobs}
        />

        {/* 10. Contact Section (Live Contact Details from Firestore) */}
        <ContactSection
          initialSubject={contactSubject}
          customSettings={siteSettings}
        />
      </main>

      {/* Corporate Footer with Admin trigger */}
      <Footer
        onToggleLang={handleToggleLang}
        currentLang={lang}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Interactive Global Modals */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        customProducts={products}
        customNews={news}
        onSelectSector={(id) => {
          const s = SECTORS.find((item) => item.id === id);
          if (s) setSelectedSector(s);
        }}
        onSelectCompany={(id) => {
          const c = COMPANIES.find((item) => item.id === id);
          if (c) setSelectedCompany(c);
        }}
        onSelectProduct={(id) => {
          const p = products.find((item) => item.id === id);
          if (p) setSelectedProduct(p);
        }}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onContactProduct={handleContactItem}
      />

      <SectorDetailModal
        sector={selectedSector}
        onClose={() => setSelectedSector(null)}
        onViewProductsByCategory={handleSectorCategoryFilter}
      />

      <CompanyDetailModal
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
        onContactCompany={handleContactItem}
      />

      <NewsDetailModal
        news={selectedNews}
        onClose={() => setSelectedNews(null)}
      />

      <CareerApplyModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
      />

      {/* Admin Dashboard Control Center */}
      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        products={products}
        news={news}
        jobs={jobs}
        siteSettings={siteSettings}
        quotes={quotes}
        messages={messages}
        applications={applications}
      />
    </div>
  );
}
