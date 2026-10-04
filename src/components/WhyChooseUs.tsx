import React from 'react';
import { ShieldCheck, Zap, RefreshCw, Headphones, Award, Lock, Sparkles } from 'lucide-react';
import { ADMIN_CONTACT } from '../data/servicesData';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: <Lock className="w-6 h-6 text-emerald-600" />,
      title: 'Zero Password Required',
      desc: 'We strictly only need your public Instagram username, YouTube link or Facebook page URL. We will never ask for your private passwords.',
      bg: 'bg-emerald-50',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: 'Lightning Fast Start (5-15 Mins)',
      desc: 'As soon as your payment is confirmed on WhatsApp, our automated high-velocity server queue starts dispatching your growth.',
      bg: 'bg-amber-50',
    },
    {
      icon: <RefreshCw className="w-6 h-6 text-purple-600" />,
      title: '30-Day Free Auto Refill',
      desc: 'Worried about follower or view drops? Every standard order comes with 30-day automatic refill protection and lifetime refill on non-drop tiers.',
      bg: 'bg-purple-50',
    },
    {
      icon: <Headphones className="w-6 h-6 text-blue-600" />,
      title: '24/7 WhatsApp Human Support',
      desc: `Direct personal assistance from real engineers on WhatsApp (${ADMIN_CONTACT.formattedPhone}) for order tracking, customized packages, and questions.`,
      bg: 'bg-blue-50',
    },
    {
      icon: <Award className="w-6 h-6 text-rose-600" />,
      title: '100% Monetization & AdSense Safe',
      desc: 'Our YouTube watch time, views, and subscribers comply with platform policy so you can monetize with complete peace of mind.',
      bg: 'bg-rose-50',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      title: 'Instant PhonePe UPI QR Checkout',
      desc: 'Pay effortlessly with PhonePe, Google Pay, Paytm, or BHIM. Zero payment gateway charges, instant verification, and zero hassle.',
      bg: 'bg-indigo-50',
    },
  ];

  return (
    <section className="py-16 bg-neutral-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-950/80 border border-purple-800/80 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>The MyFame Quality Guarantee</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Why 18,000+ Creators Trust Our Panel
          </h2>
          <p className="text-sm text-neutral-400">
            Engineered for real influencers, brands, businesses, and creators who need authentic social credibility without risking their profiles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-neutral-800/70 border border-neutral-700/80 rounded-3xl p-6 hover:border-purple-500/60 transition-all hover:bg-neutral-800 space-y-3"
            >
              <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center`}>
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{f.title}</h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
