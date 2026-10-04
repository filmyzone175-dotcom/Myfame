import React, { useState } from 'react';
import {
  Instagram,
  Youtube,
  Facebook,
  Send,
  Twitter,
  CheckCircle,
  Clock,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ServiceOption, PlatformId } from '../types';
import { SERVICES, PLATFORMS } from '../data/servicesData';

interface ServicesGridProps {
  onSelectService: (service: ServiceOption) => void;
  services?: ServiceOption[];
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onSelectService, services = SERVICES }) => {
  const [activeTab, setActiveTab] = useState<'all' | PlatformId>('all');

  const availableServices = services.filter((s) => s.enabled !== false);

  const filteredServices = activeTab === 'all'
    ? availableServices
    : availableServices.filter((s) => s.platform === activeTab);

  const getPlatformIcon = (platform: PlatformId) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-600" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-600" />;
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-600" />;
      case 'telegram':
        return <Send className="w-4 h-4 text-sky-500" />;
      case 'twitter':
        return <Twitter className="w-4 h-4 text-neutral-800" />;
    }
  };

  return (
    <section id="services-catalog" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <span className="text-xs uppercase tracking-wider font-extrabold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
          Transparent Pricing
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-neutral-900">
          Explore All Growth Packages
        </h2>
        <p className="text-sm text-neutral-500">
          Pick any package below to instantly load into our direct order calculator. All payments supported via PhonePe QR code.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-4 mb-6">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === 'all'
              ? 'bg-neutral-900 text-white shadow-sm'
              : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
          }`}
        >
          All Services ({SERVICES.length})
        </button>

        {PLATFORMS.map((p) => {
          const isSelected = activeTab === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setActiveTab(p.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {getPlatformIcon(p.id)}
              <span>{p.name}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-3xl p-6 border border-neutral-200/90 hover:border-purple-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
          >
            {service.badge && (
              <div className="absolute top-4 right-4 text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                {service.badge}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center">
                  {getPlatformIcon(service.platform)}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  {service.platform} • {service.category}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-base sm:text-lg text-neutral-900 group-hover:text-purple-700 transition-colors leading-snug">
                  {service.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-100 text-xs text-neutral-600">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" /> Start Time:
                  </span>
                  <span className="font-semibold text-emerald-700">{service.startTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-neutral-500" /> Delivery Speed:
                  </span>
                  <span className="font-semibold text-neutral-800">{service.speed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" /> Guarantee:
                  </span>
                  <span className="font-semibold text-purple-700">{service.guarantee}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Price</span>
                <div className="text-xl font-black text-neutral-900">
                  ₹{service.pricePerUnit}
                  <span className="text-xs font-normal text-neutral-500">
                    {service.category === 'watchtime' ? ' / pack' : ' / 1k'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectService(service)}
                className="py-2.5 px-4 rounded-xl bg-neutral-900 group-hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <span>Order Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
