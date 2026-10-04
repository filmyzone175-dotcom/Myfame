import React, { useState, useEffect } from 'react';
import {
  Flame,
  ShieldCheck,
  Zap,
  Star,
  Users,
  CheckCircle2,
  ArrowDown,
  Sparkles,
  Phone,
  QrCode,
} from 'lucide-react';
import { RECENT_ORDERS_STREAM, ADMIN_CONTACT } from '../data/servicesData';
import { AdminContactInfo } from '../types';

interface HeroProps {
  contact?: AdminContactInfo;
}

export const Hero: React.FC<HeroProps> = ({ contact = ADMIN_CONTACT }) => {
  const [tickerIndex, setTickerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % RECENT_ORDERS_STREAM.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  const currentTicker = RECENT_ORDERS_STREAM[tickerIndex];

  const scrollToOrder = () => {
    document.getElementById('quick-order')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-12 bg-gradient-to-b from-purple-50/60 via-white to-neutral-50/50">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-400/15 via-rose-300/15 to-amber-200/15 blur-3xl pointer-events-none rounded-full"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Live Recent Order Ticker */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2.5 bg-white/90 backdrop-blur-md border border-purple-200/80 px-4 py-2 rounded-full shadow-sm text-xs text-neutral-700 animate-in fade-in duration-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-bold text-neutral-900 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Live Order:
            </span>
            <span className="text-neutral-600">
              <strong className="text-neutral-900">{currentTicker.user}</strong> ({currentTicker.city}) ordered{' '}
              <strong className="text-purple-700">{currentTicker.service}</strong>
            </span>
            <span className="text-neutral-400 text-[10px]">({currentTicker.time})</span>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-rose-100 text-purple-900 text-xs font-bold border border-purple-200 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>India's Most Trusted Social Media Booster • Like myfame.in</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-neutral-950 tracking-tight leading-[1.15]">
            Grow Instagram, YouTube & Facebook{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-rose-600 to-amber-500">
              Directly with 1-Click
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 max-w-2xl mx-auto leading-relaxed">
            Get real & non-drop <strong>Instagram Views, Likes & Followers</strong>,{' '}
            <strong>YouTube Subscribers & Watch Time</strong>, and <strong>Facebook Growth</strong>.
            Instant start, secure PhonePe UPI QR payment, and 24/7 WhatsApp confirmation at{' '}
            <span className="font-bold text-neutral-900">{contact.phone}</span>.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={scrollToOrder}
              className="w-full sm:w-auto px-7 py-3.5 bg-neutral-950 hover:bg-neutral-800 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-neutral-950/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <span>Select Service & Order Now</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>
            <a
              href={contact.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp: {contact.formattedPhone}</span>
            </a>
          </div>

          {/* Trust Guarantees Row */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-neutral-200/80 text-left shadow-2xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 mb-1" />
              <h4 className="text-xs font-bold text-neutral-900">100% Safe</h4>
              <p className="text-[10px] text-neutral-500">No passwords needed</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-neutral-200/80 text-left shadow-2xs">
              <Zap className="w-5 h-5 text-amber-500 mb-1" />
              <h4 className="text-xs font-bold text-neutral-900">5-15 Min Start</h4>
              <p className="text-[10px] text-neutral-500">Instant automated queue</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-neutral-200/80 text-left shadow-2xs">
              <QrCode className="w-5 h-5 text-purple-600 mb-1" />
              <h4 className="text-xs font-bold text-neutral-900">UPI QR Pay</h4>
              <p className="text-[10px] text-neutral-500">PhonePe, GPay, Paytm</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-2xl border border-neutral-200/80 text-left shadow-2xs">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400 mb-1" />
              <h4 className="text-xs font-bold text-neutral-900">30-Day Refill</h4>
              <p className="text-[10px] text-neutral-500">Free replacement guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
