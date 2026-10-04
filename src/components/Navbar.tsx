import React, { useState } from 'react';
import { Flame, MessageCircle, Search, Menu, X, Shield, Phone, SlidersHorizontal, Lock } from 'lucide-react';
import { ADMIN_CONTACT } from '../data/servicesData';
import { PlatformId, AdminContactInfo } from '../types';

interface NavbarProps {
  onOpenTracker: () => void;
  onSelectPlatform: (platform: PlatformId) => void;
  onOpenAdmin: () => void;
  contact?: AdminContactInfo;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTracker,
  onSelectPlatform,
  onOpenAdmin,
  contact = ADMIN_CONTACT,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePlatformClick = (platform: PlatformId) => {
    onSelectPlatform(platform);
    scrollToSection('quick-order');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Top Notification Strip */}
      <div className="bg-neutral-950 text-white text-[11px] py-1.5 px-4 text-center flex items-center justify-center gap-3">
        <span className="flex items-center gap-1 text-emerald-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          24/7 WhatsApp Live Support:
        </span>
        <a
          href={contact.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-amber-300 hover:text-amber-200 underline flex items-center gap-1"
        >
          <Phone className="w-3 h-3" />
          {contact.formattedPhone}
        </a>
        <span className="hidden sm:inline text-neutral-400">• PhonePe / GPay QR Payment Accepted</span>
      </div>

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-tight text-neutral-900">
                My<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-rose-600">Fame</span>
              </span>
              <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 tracking-wide">
                Boost
              </span>
            </div>
            <p className="text-[10px] font-semibold text-neutral-400 leading-none">
              Like myfame.in
            </p>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-neutral-600">
          <button
            onClick={() => handlePlatformClick('instagram')}
            className="hover:text-purple-600 transition-colors cursor-pointer"
          >
            Instagram
          </button>
          <button
            onClick={() => handlePlatformClick('youtube')}
            className="hover:text-red-600 transition-colors cursor-pointer"
          >
            YouTube
          </button>
          <button
            onClick={() => handlePlatformClick('facebook')}
            className="hover:text-blue-600 transition-colors cursor-pointer"
          >
            Facebook
          </button>
          <button
            onClick={() => scrollToSection('services-catalog')}
            className="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            All Packages
          </button>
          <button
            onClick={() => scrollToSection('reviews')}
            className="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            Reviews
          </button>
          <button
            onClick={() => scrollToSection('faqs')}
            className="hover:text-neutral-900 transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Admin Panel Access Button */}
          <button
            onClick={onOpenAdmin}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
            title="Open Admin Rate Manager & Orders"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden md:inline">Admin Rates</span>
            <span className="md:hidden">Admin</span>
          </button>

          <button
            onClick={onOpenTracker}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl border border-neutral-300 hover:border-neutral-400 text-neutral-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-neutral-50 transition-colors shadow-2xs"
            title="Track Existing Order"
          >
            <Search className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden sm:inline">Track Order</span>
          </button>

          {/* WhatsApp Direct Chat Button */}
          <a
            href={contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm shadow-emerald-600/30 transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span className="hidden sm:inline">WhatsApp Help</span>
            <span className="sm:hidden">{contact.phone}</span>
          </a>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-neutral-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150">
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handlePlatformClick('instagram')}
              className="p-2.5 rounded-xl bg-purple-50 text-purple-800 text-xs font-bold text-center border border-purple-200"
            >
              Instagram
            </button>
            <button
              onClick={() => handlePlatformClick('youtube')}
              className="p-2.5 rounded-xl bg-red-50 text-red-800 text-xs font-bold text-center border border-red-200"
            >
              YouTube
            </button>
            <button
              onClick={() => handlePlatformClick('facebook')}
              className="p-2.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold text-center border border-blue-200"
            >
              Facebook
            </button>
          </div>
          <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2 text-sm font-semibold text-neutral-700">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-left py-2 text-purple-700 font-bold flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Admin Rate Configurator (Change Rates)</span>
            </button>
            <button
              onClick={() => scrollToSection('quick-order')}
              className="text-left py-2 hover:text-purple-600"
            >
              🚀 Quick Order Widget
            </button>
            <button
              onClick={() => scrollToSection('services-catalog')}
              className="text-left py-2 hover:text-purple-600"
            >
              📦 All Pricing & Packages
            </button>
            <button
              onClick={() => scrollToSection('reviews')}
              className="text-left py-2 hover:text-purple-600"
            >
              ⭐ Customer Reviews
            </button>
            <button
              onClick={() => scrollToSection('faqs')}
              className="text-left py-2 hover:text-purple-600"
            >
              ❓ FAQ & Questions
            </button>
          </div>
          <div className="pt-2 border-t border-neutral-100">
            <a
              href={contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-center text-xs flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chat with Us on WhatsApp ({contact.phone})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

