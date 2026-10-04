import React, { useState, useMemo } from 'react';
import {
  Instagram,
  Youtube,
  Facebook,
  Send,
  Twitter,
  Zap,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Tag,
  Lock,
} from 'lucide-react';
import { PlatformId, ServiceOption, OrderDetails } from '../types';
import { SERVICES, PLATFORMS } from '../data/servicesData';

interface OrderCalculatorProps {
  onStartOrder: (order: OrderDetails) => void;
  selectedPlatformProp?: PlatformId;
  services?: ServiceOption[];
}

export const OrderCalculator: React.FC<OrderCalculatorProps> = ({
  onStartOrder,
  selectedPlatformProp,
  services = SERVICES,
}) => {
  const [platform, setPlatform] = useState<PlatformId>(selectedPlatformProp || 'instagram');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('ig-followers-hq');
  const [quantity, setQuantity] = useState<number>(1000);
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [urlError, setUrlError] = useState<string>('');

  // Available services for the current platform (excluding disabled ones)
  const currentServices = useMemo(() => {
    return services.filter((s) => s.platform === platform && s.enabled !== false);
  }, [services, platform]);

  // Current active service
  const currentService = useMemo(() => {
    const found = currentServices.find((s) => s.id === selectedServiceId);
    return found || currentServices[0] || services[0];
  }, [currentServices, selectedServiceId, services]);

  // When platform changes, update selected service
  const handlePlatformChange = (p: PlatformId) => {
    setPlatform(p);
    const firstService = services.find((s) => s.platform === p && s.enabled !== false);
    if (firstService) {
      setSelectedServiceId(firstService.id);
      setQuantity(firstService.defaultQuantity);
    }
  };

  // When service changes, update default quantity
  const handleServiceChange = (id: string) => {
    setSelectedServiceId(id);
    const service = services.find((s) => s.id === id);
    if (service) {
      setQuantity(service.defaultQuantity);
    }
  };

  // Pricing calculations
  const calculateTotal = useMemo(() => {
    if (!currentService) return 0;
    if (currentService.category === 'watchtime') {
      return currentService.pricePerUnit * quantity;
    }
    const total = (currentService.pricePerUnit * quantity) / 1000;
    return Math.max(15, Math.round(total));
  }, [currentService, quantity]);

  const originalPrice = useMemo(() => {
    return Math.round(calculateTotal * 1.6);
  }, [calculateTotal]);

  const discountPercent = useMemo(() => {
    return Math.round(((originalPrice - calculateTotal) / originalPrice) * 100);
  }, [originalPrice, calculateTotal]);

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetUrl.trim()) {
      setUrlError('Please enter your username or link to proceed.');
      return;
    }
    setUrlError('');

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrder: OrderDetails = {
      orderId: `MF-${randomSuffix}`,
      serviceId: currentService.id,
      serviceName: currentService.name,
      platform: currentService.platform,
      quantity,
      targetUrl: targetUrl.trim(),
      totalPrice: calculateTotal,
      createdAt: new Date().toISOString(),
      status: 'pending_payment',
    };

    onStartOrder(newOrder);
  };

  const getPlatformIcon = (id: PlatformId) => {
    switch (id) {
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'youtube':
        return <Youtube className="w-4 h-4" />;
      case 'facebook':
        return <Facebook className="w-4 h-4" />;
      case 'telegram':
        return <Send className="w-4 h-4" />;
      case 'twitter':
        return <Twitter className="w-4 h-4" />;
    }
  };

  return (
    <div
      id="quick-order"
      className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-purple-500/5 border border-neutral-200/90 overflow-hidden"
    >
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-neutral-950 via-purple-950 to-neutral-900 text-white p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-purple-600/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3 text-rose-400" />
                Direct Instant Order
              </span>
              <span className="text-xs text-neutral-400 font-medium">Just like myfame.in</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Boost Your Social Media in 3 Simple Steps
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-purple-200 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 w-fit">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Safe • No Password Required</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleProceed} className="p-5 sm:p-8 space-y-7">
        {/* Step 1: Select Platform */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-black uppercase tracking-wider text-neutral-500 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">
                1
              </span>
              Select Platform
            </label>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Instant Start
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-2.5">
            {PLATFORMS.map((p) => {
              const isSelected = platform === p.id;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => handlePlatformChange(p.id)}
                  className={`relative p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col items-start gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/70 shadow-sm ring-2 ring-purple-600/20'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/60'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${p.color}`}
                  >
                    {getPlatformIcon(p.id)}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-neutral-900 block leading-tight">
                      {p.name}
                    </span>
                    <span className="text-[10px] text-neutral-500 leading-none">
                      {p.id === 'instagram' ? 'Followers/Views' : p.id === 'youtube' ? 'Subs/Views' : 'Growth'}
                    </span>
                  </div>
                  {p.popular && (
                    <span className="absolute top-2 right-2 text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                      HOT
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Service */}
        <div>
          <label className="text-xs font-black uppercase tracking-wider text-neutral-500 flex items-center gap-2 mb-3">
            <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">
              2
            </span>
            Choose Service Type
          </label>

          <div className="space-y-2">
            {currentServices.map((service) => {
              const isSelected = currentService.id === service.id;
              return (
                <div
                  key={service.id}
                  onClick={() => handleServiceChange(service.id)}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/40 shadow-sm ring-1 ring-purple-500'
                      : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm sm:text-base text-neutral-900">
                        {service.name}
                      </span>
                      {service.badge && (
                        <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 line-clamp-1">
                      {service.description}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-neutral-500 pt-0.5 flex-wrap">
                      <span className="flex items-center gap-1 text-emerald-700 font-medium">
                        <Clock className="w-3 h-3" />
                        {service.startTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium">
                        <TrendingUp className="w-3 h-3 text-neutral-400" />
                        {service.speed}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-purple-700 font-medium">
                        <ShieldCheck className="w-3 h-3" />
                        {service.guarantee}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-neutral-100">
                    <div className="text-right">
                      <span className="text-[11px] text-neutral-400 block">Starting at</span>
                      <span className="text-base font-extrabold text-neutral-900">
                        ₹{service.pricePerUnit}
                        <span className="text-xs font-normal text-neutral-500">
                          {service.category === 'watchtime' ? ' / pack' : ' / 1k'}
                        </span>
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-purple-600 bg-purple-600 text-white'
                          : 'border-neutral-300'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Quantity & Target Account Link */}
        <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200/90 space-y-5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-neutral-600 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">
                3
              </span>
              Select Quantity
            </label>
            <span className="text-xs font-bold text-purple-700">
              Selected: {quantity.toLocaleString('en-IN')}{' '}
              {currentService.category === 'watchtime' ? 'Packs' : 'Units'}
            </span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            {currentService.presetQuantities.map((preset) => {
              const active = quantity === preset;
              return (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setQuantity(preset)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-neutral-900 text-white shadow-sm ring-2 ring-neutral-900/20'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  {preset.toLocaleString('en-IN')}{' '}
                  {currentService.category === 'watchtime' ? 'Pack' : ''}
                </button>
              );
            })}
          </div>

          {/* Slider for fine adjustment (if not watchtime) */}
          {currentService.category !== 'watchtime' && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-neutral-400">
                <span>Min: {currentService.minQuantity.toLocaleString('en-IN')}</span>
                <span>Max: {currentService.maxQuantity.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={currentService.minQuantity}
                max={Math.min(currentService.maxQuantity, 25000)}
                step={currentService.minQuantity <= 100 ? 100 : 500}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-purple-600 h-2 bg-neutral-200 rounded-lg cursor-pointer"
              />
            </div>
          )}

          {/* Target Profile / Link Input */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              {currentService.inputLabel} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={targetUrl}
              onChange={(e) => {
                setTargetUrl(e.target.value);
                if (urlError) setUrlError('');
              }}
              placeholder={currentService.inputPlaceholder}
              className={`w-full px-4 py-3 rounded-xl border bg-white text-sm text-neutral-900 font-medium transition-all focus:outline-none focus:ring-2 ${
                urlError
                  ? 'border-rose-400 focus:ring-rose-500'
                  : 'border-neutral-300 focus:ring-purple-600 focus:border-purple-600'
              }`}
            />
            {urlError ? (
              <p className="text-xs text-rose-600 font-medium mt-1">{urlError}</p>
            ) : (
              <p className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-600" />
                Never enter passwords. Make sure your account / post is public.
              </p>
            )}
          </div>
        </div>

        {/* Pricing Summary & Proceed to Pay CTA */}
        <div className="bg-gradient-to-br from-purple-50 via-indigo-50/50 to-pink-50 p-5 sm:p-6 rounded-2xl border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Total Price (INR)
              </span>
              <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {discountPercent}% OFF Special
              </span>
            </div>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl font-black text-neutral-900">
                ₹{calculateTotal.toLocaleString('en-IN')}
              </span>
              <span className="text-base text-neutral-400 line-through font-semibold">
                ₹{originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-emerald-700 font-semibold">All Taxes Included</span>
            </div>
            <p className="text-xs text-neutral-600">
              Includes: <strong>{currentService.guarantee}</strong> + 24/7 WhatsApp Support
            </p>
          </div>

          <button
            type="submit"
            className="py-4 px-8 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-purple-600/25 flex items-center justify-center gap-3 transition-all hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] cursor-pointer"
          >
            <span>Proceed to QR Payment</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
