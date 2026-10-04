import React from 'react';
import { Flame, MessageCircle, Phone, ShieldCheck, Heart, SlidersHorizontal } from 'lucide-react';
import { ADMIN_CONTACT } from '../data/servicesData';
import { PlatformId, AdminContactInfo } from '../types';

interface FooterProps {
  onSelectPlatform: (platform: PlatformId) => void;
  onOpenAdmin?: () => void;
  contact?: AdminContactInfo;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectPlatform,
  onOpenAdmin,
  contact = ADMIN_CONTACT,
}) => {
  const scrollToOrder = (p: PlatformId) => {
    onSelectPlatform(p);
    document.getElementById('quick-order')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 pt-16 pb-12 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-700 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                <Flame className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                My<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-rose-400">Fame</span>
                <span className="text-[10px] uppercase font-bold text-purple-300 ml-1.5 px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800">
                  Boost
                </span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              India's premier social media growth portal inspired by myfame.in. Instant Instagram followers & reel views, YouTube subscribers, and Facebook engagement with zero passwords needed.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Safe Algorithm Delivery</span>
            </div>
          </div>

          {/* Quick Platform Services */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">
              Top Services
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => scrollToOrder('instagram')}
                  className="hover:text-purple-400 transition-colors text-left"
                >
                  Instagram Real Followers
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToOrder('instagram')}
                  className="hover:text-purple-400 transition-colors text-left"
                >
                  Instagram Viral Reel Views
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToOrder('youtube')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  YouTube Monetization Subscribers
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToOrder('youtube')}
                  className="hover:text-red-400 transition-colors text-left"
                >
                  YouTube 4,000 Hours Watch Time
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToOrder('facebook')}
                  className="hover:text-blue-400 transition-colors text-left"
                >
                  Facebook Page Likes & Followers
                </button>
              </li>
            </ul>
          </div>

          {/* Payment & QR Info */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">
              Payment Methods
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed mb-3">
              We accept direct PhonePe UPI QR payments. Scan with any UPI app on your phone:
            </p>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold text-neutral-300">
              <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 rounded-lg">PhonePe</span>
              <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 rounded-lg">Google Pay</span>
              <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 rounded-lg">Paytm</span>
              <span className="px-2.5 py-1 bg-neutral-900 border border-neutral-700 rounded-lg">BHIM UPI</span>
            </div>
            <div className="mt-3 text-xs text-neutral-400">
              UPI ID: <span className="font-mono text-white font-bold select-all">{contact.upiId}</span>
            </div>
          </div>

          {/* Contact & WhatsApp */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-white mb-3">
              Direct Contact & Support
            </h4>
            <div className="space-y-2 text-xs text-neutral-400">
              <p>For custom inquiries, bulk SMM orders, and instant confirmation:</p>
              <a
                href={contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold hover:bg-emerald-600/30 transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-emerald-400 text-transparent" />
                <span>WhatsApp: {contact.formattedPhone}</span>
              </a>
              <div className="flex items-center gap-2 pt-1 text-neutral-400">
                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                <span>Mobile: {contact.formattedPhone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-4 flex-wrap">
            <p>© {new Date().getFullYear()} MyFame Boost. Inspired by myfame.in. All rights reserved.</p>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-purple-950 border border-neutral-800 text-purple-300 font-bold hover:text-purple-200 transition-colors cursor-pointer"
              >
                <SlidersHorizontal className="w-3 h-3 text-purple-400" />
                <span>Admin Rates Panel</span>
              </button>
            )}
          </div>
          <p className="text-[11px] text-neutral-400 text-center sm:text-right max-w-md">
            Disclaimer: We are an independent promotion panel and are not affiliated, associated, or endorsed by Instagram, Meta, YouTube, or Google LLC.
          </p>
        </div>
      </div>
    </footer>
  );
};
