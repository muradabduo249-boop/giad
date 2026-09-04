import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  ChevronLeft,
  ShieldCheck,
  Home,
  Info,
  Layers,
  Building2,
  Package,
  Newspaper,
  Briefcase,
  PhoneCall,
} from 'lucide-react';
import { GiadLogo } from './GiadLogo';
import { GIAD_INFO } from '../data/giadData';

interface NavbarProps {
  onOpenSearch: () => void;
  currentLang: 'ar' | 'en';
  onToggleLang: () => void;
  activeSection: string;
  onOpenAdmin?: () => void;
  pendingCount?: number;
}

interface NavItem {
  id: string;
  labelAr: string;
  labelEn: string;
  href: string;
  icon: React.ElementType;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  currentLang,
  onToggleLang,
  activeSection,
  onOpenAdmin,
  pendingCount = 0,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Detect scroll state for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll strictly when full-screen mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Exactly 6 items requested: الرئيسية, من نحن, القطاعات, الشركات, المنتجات, تواصل
  const navLinks: NavItem[] = [
    { id: 'hero', labelAr: 'الرئيسية', labelEn: 'Home', href: '#hero', icon: Home },
    { id: 'about', labelAr: 'من نحن', labelEn: 'About', href: '#about', icon: Info },
    { id: 'sectors', labelAr: 'القطاعات', labelEn: 'Sectors', href: '#sectors', icon: Layers },
    { id: 'companies', labelAr: 'الشركات', labelEn: 'Companies', href: '#companies', icon: Building2 },
    { id: 'products', labelAr: 'المنتجات', labelEn: 'Products', href: '#products', icon: Package },
    { id: 'contact', labelAr: 'تواصل', labelEn: 'Contact', href: '#contact', icon: PhoneCall },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Fixed Transparent & Blurry Header on Desktop and Mobile */}
      <header
        id="giad-main-header"
        className={`fixed top-0 left-0 right-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-xs'
            : 'bg-white/75 backdrop-blur-md border-b border-slate-200/50'
        }`}
      >
        {/* Institutional Utility Bar (Desktop Only) */}
        <div className="hidden lg:block bg-[#0A1F36]/95 backdrop-blur-md text-slate-300 text-[11px] font-sans border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
            {/* Right: Contact details */}
            <div className="flex items-center gap-6">
              <a
                href="tel:1993"
                className="flex items-center gap-1.5 hover:text-white transition font-bold text-sky-400 font-mono"
              >
                <Phone className="w-3 h-3 text-[#0084CA]" />
                <span>الرقم الموحد: 1993</span>
              </a>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>مدينة جياد الصناعية — الكيلو 50 طريق الخرطوم مدني</span>
              </span>
            </div>

            {/* Left: Quick Links */}
            <div className="flex items-center gap-5">
              <a
                href="mailto:info@giadengineering.com"
                className="flex items-center gap-1.5 hover:text-white transition text-slate-300"
              >
                <Mail className="w-3 h-3 text-slate-400" />
                <span>info@giadengineering.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
            {/* 1. Brand Logo */}
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#hero');
              }}
              className="flex items-center focus:outline-none shrink-0"
              aria-label="الرئيسية - مجموعة جياد للصناعات الهندسية"
            >
              <GiadLogo className="h-8 sm:h-9 md:h-10" isLight={false} />
            </a>

            {/* 2. Desktop Navigation Menu: Single straight line, concise single words, NO overlap */}
            <nav
              id="desktop-nav-menu"
              className="hidden lg:flex items-center flex-nowrap gap-1 xl:gap-2 whitespace-nowrap"
              aria-label="القائمة الرئيسية"
            >
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                    className={`px-2.5 xl:px-3 py-1.5 rounded-xl text-xs xl:text-[13px] font-bold transition-all duration-150 whitespace-nowrap relative select-none ${
                      isActive
                        ? 'text-[#004B87] bg-sky-50 font-extrabold shadow-xs'
                        : 'text-slate-700 hover:text-[#004B87] hover:bg-slate-100/70'
                    }`}
                  >
                    {currentLang === 'ar' ? link.labelAr : link.labelEn}
                    {isActive && (
                      <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#004B87] rounded-full" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* 3. Action Cluster */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Search Button */}
              <button
                id="header-search-btn"
                onClick={onOpenSearch}
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-[#F8FAFC] hover:bg-slate-100 hover:border-slate-300 text-slate-600 transition text-xs font-sans cursor-pointer min-h-[40px]"
                title="البحث في الموقع / Search"
                aria-label="فتح البحث"
              >
                <Search className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="hidden xl:inline text-slate-500 font-normal">
                  بحث...
                </span>
              </button>

              {/* Direct Hotline / CTA (Desktop) */}
              <a
                href="tel:1993"
                className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 text-[#004B87] hover:bg-sky-100 border border-sky-200 text-xs font-bold transition font-mono min-h-[40px]"
              >
                <Phone className="w-3.5 h-3.5 text-[#0084CA]" />
                <span>1993</span>
              </a>

              {/* Mobile Hamburger Button (44px min touch target) */}
              <button
                id="mobile-hamburger-btn"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden w-11 h-11 flex items-center justify-center rounded-xl border border-slate-200 bg-[#F8FAFC] text-[#0A1F36] hover:text-[#004B87] hover:bg-slate-100 transition focus:outline-none cursor-pointer"
                aria-label="فتح القائمة الرئيسية"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-fullscreen-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-white flex flex-col justify-between overflow-hidden lg:hidden"
          >
            {/* Top Bar inside Menu */}
            <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-slate-100 bg-white shrink-0">
              {/* Brand Logo */}
              <GiadLogo className="h-8" isLight={false} />

              {/* Round Elegant Close Button (44px touch target) */}
              <button
                id="mobile-menu-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-[#0A1F36] active:scale-95 transition cursor-pointer"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation List: Clean, Right-Aligned with Icons & Safe Scroll */}
            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block px-3 py-1 font-sans">
                أقسام البوابة الرسمية
              </span>
              <nav className="space-y-1">
                {navLinks.map((link) => {
                  const isActive = activeSection === link.id;
                  const Icon = link.icon;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleLinkClick(link.href)}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-all text-right cursor-pointer ${
                        isActive
                          ? 'text-[#004B87] bg-sky-50 font-black border border-sky-100 shadow-2xs'
                          : 'text-slate-700 hover:text-[#004B87] hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isActive ? 'bg-[#004B87] text-white' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-sans">{link.labelAr}</span>
                      </div>
                      <ChevronLeft className={`w-4 h-4 ${isActive ? 'text-[#004B87]' : 'text-slate-300'}`} />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions: Pinned, Fixed Height, Guaranteed Visibility on ALL Screen Heights */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0 space-y-2">
              <div className="grid grid-cols-2 gap-2.5">
                {/* Search in Menu Button */}
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenSearch();
                  }}
                  className="py-3 px-3 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-[#004B87] hover:border-slate-300 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-2xs cursor-pointer min-h-[44px]"
                >
                  <Search className="w-4 h-4 text-[#0084CA]" />
                  <span>بحث في الكتالوج</span>
                </button>

                {/* Direct Call Hotline */}
                <a
                  href="tel:1993"
                  className="py-3 px-3 rounded-xl bg-[#004B87] hover:bg-[#003B6B] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer min-h-[44px]"
                >
                  <Phone className="w-4 h-4" />
                  <span>الخط الموحد 1993</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
