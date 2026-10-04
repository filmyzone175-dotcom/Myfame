import React, { useState } from 'react';
import {
  X,
  Lock,
  Unlock,
  Save,
  RotateCcw,
  Plus,
  Minus,
  Check,
  Search,
  Sliders,
  DollarSign,
  Package,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  Percent,
  CheckCircle2,
  Trash2,
  MessageCircle,
  AlertCircle,
  Eye,
  Heart,
  Users,
} from 'lucide-react';
import { ServiceOption, AdminContactInfo, OrderDetails, PlatformId } from '../types';
import { SERVICES, ADMIN_CONTACT } from '../data/servicesData';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceOption[];
  onUpdateServices: (updated: ServiceOption[]) => void;
  adminContact: AdminContactInfo;
  onUpdateContact: (contact: AdminContactInfo) => void;
  orders: OrderDetails[];
  onUpdateOrders: (orders: OrderDetails[]) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  services,
  onUpdateServices,
  adminContact,
  onUpdateContact,
  orders,
  onUpdateOrders,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('myfame_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'rates' | 'orders' | 'settings'>('rates');

  // Working copy of services for editing
  const [localServices, setLocalServices] = useState<ServiceOption[]>(services);

  // Filters for rates manager
  const [platformFilter, setPlatformFilter] = useState<'all' | PlatformId>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'views' | 'likes' | 'followers' | 'subscribers'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Save feedback state
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Contact settings local state
  const [localContact, setLocalContact] = useState<AdminContactInfo>(adminContact);

  // New PIN state
  const [newPin, setNewPin] = useState('');
  const [pinSaved, setPinSaved] = useState(false);

  if (!isOpen) return null;

  // Retrieve stored admin PIN or default to '7488'
  const getStoredPin = () => {
    return localStorage.getItem('myfame_admin_pin') || '7488';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = getStoredPin();
    if (pinInput.trim() === correctPin) {
      setIsAuthenticated(true);
      localStorage.setItem('myfame_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Incorrect PIN. Default PIN is 7488.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('myfame_admin_auth');
    setPinInput('');
  };

  // Modify individual service rate
  const handleRateChange = (serviceId: string, newRate: number) => {
    const updated = localServices.map((s) =>
      s.id === serviceId ? { ...s, pricePerUnit: Math.max(1, newRate) } : s
    );
    setLocalServices(updated);
  };

  const handleRateDelta = (serviceId: string, delta: number) => {
    const updated = localServices.map((s) => {
      if (s.id === serviceId) {
        const nextPrice = Math.max(1, s.pricePerUnit + delta);
        return { ...s, pricePerUnit: nextPrice };
      }
      return s;
    });
    setLocalServices(updated);
  };

  const handleToggleEnable = (serviceId: string) => {
    const updated = localServices.map((s) =>
      s.id === serviceId ? { ...s, enabled: s.enabled === false ? true : false } : s
    );
    setLocalServices(updated);
  };

  // Bulk rate adjustment (+10%, -10%, etc.)
  const handleBulkAdjustment = (percent: number) => {
    const updated = localServices.map((s) => {
      const multiplier = 1 + percent / 100;
      return {
        ...s,
        pricePerUnit: Math.max(1, Math.round(s.pricePerUnit * multiplier)),
      };
    });
    setLocalServices(updated);
  };

  // Reset to original default services
  const handleResetToDefaults = () => {
    if (window.confirm('Reset all service rates and settings back to original defaults?')) {
      setLocalServices(SERVICES);
      onUpdateServices(SERVICES);
      localStorage.removeItem('myfame_services_rates');
      triggerSaveToast();
    }
  };

  // Save all service rates
  const handleSaveRates = () => {
    onUpdateServices(localServices);
    localStorage.setItem('myfame_services_rates', JSON.stringify(localServices));
    triggerSaveToast();
  };

  // Save Contact settings
  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateContact(localContact);
    localStorage.setItem('myfame_contact_info', JSON.stringify(localContact));
    triggerSaveToast();
  };

  // Change PIN
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.trim().length >= 4) {
      localStorage.setItem('myfame_admin_pin', newPin.trim());
      setPinSaved(true);
      setNewPin('');
      setTimeout(() => setPinSaved(false), 3000);
    }
  };

  // Update order status
  const handleOrderStatusChange = (orderId: string, newStatus: OrderDetails['status']) => {
    const updated = orders.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o));
    onUpdateOrders(updated);
    localStorage.setItem('myfame_orders', JSON.stringify(updated));
  };

  // Delete an order
  const handleDeleteOrder = (orderId: string) => {
    const updated = orders.filter((o) => o.orderId !== orderId);
    onUpdateOrders(updated);
    localStorage.setItem('myfame_orders', JSON.stringify(updated));
  };

  const triggerSaveToast = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Filtered services for display
  const displayedServices = localServices.filter((s) => {
    if (platformFilter !== 'all' && s.platform !== platformFilter) return false;
    if (categoryFilter !== 'all') {
      if (categoryFilter === 'followers' && s.category !== 'followers' && s.category !== 'subscribers') return false;
      if (categoryFilter === 'subscribers' && s.category !== 'subscribers') return false;
      if (categoryFilter === 'views' && s.category !== 'views' && s.category !== 'watchtime') return false;
      if (categoryFilter === 'likes' && s.category !== 'likes' && s.category !== 'comments') return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.platform.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-950 text-white border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold">
              {isAuthenticated ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg text-white">
                  Owner Admin Control Panel
                </h3>
                {isAuthenticated && (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Authenticated
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400">
                Change rates of Views, Likes, Followers & Subscribers in real time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs text-neutral-400 hover:text-white px-2.5 py-1 rounded-lg border border-neutral-800 hover:border-neutral-700"
              >
                Lock
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6 my-auto">
            <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-xl font-black text-neutral-900">Admin Security Passcode</h4>
              <p className="text-xs text-neutral-500 mt-1">
                Enter your 4-digit admin PIN to access the rate configurator and customer orders.
              </p>
              <div className="mt-2 text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-xl inline-block">
                Default Owner PIN: <strong>7488</strong>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <input
                type="password"
                maxLength={8}
                autoFocus
                placeholder="Enter PIN (7488)"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  if (pinError) setPinError('');
                }}
                className="w-full px-4 py-3 rounded-2xl border border-neutral-300 text-center text-xl font-mono tracking-widest font-black focus:outline-none focus:ring-2 focus:ring-purple-600"
              />

              {pinError && <p className="text-xs text-rose-600 font-semibold">{pinError}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-neutral-950 hover:bg-neutral-800 text-white font-bold rounded-2xl text-sm shadow-md transition-all cursor-pointer"
              >
                Unlock Admin Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Navigation Tabs */}
            <div className="flex items-center justify-between px-6 pt-3 pb-2 bg-neutral-50 border-b border-neutral-200 shrink-0 overflow-x-auto gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('rates')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'rates'
                      ? 'bg-purple-700 text-white shadow-sm'
                      : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Rates & Pricing ({localServices.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-purple-700 text-white shadow-sm'
                      : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Customer Orders ({orders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    activeTab === 'settings'
                      ? 'bg-purple-700 text-white shadow-sm'
                      : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>UPI & WhatsApp Settings</span>
                </button>
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-full animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Changes Saved Live!</span>
                </div>
              )}
            </div>

            {/* TAB 1: RATES & PRICING CONFIGURATOR */}
            {activeTab === 'rates' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Control Bar: Filters & Quick Bulk Pricing */}
                <div className="p-4 sm:p-5 bg-white border-b border-neutral-200 space-y-3 shrink-0">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {/* Search */}
                    <div className="relative flex-1 max-w-xs">
                      <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search service by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                    </div>

                    {/* Bulk markup buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-bold text-neutral-500 flex items-center gap-1">
                        <Percent className="w-3 h-3" /> Bulk Adjust:
                      </span>
                      <button
                        onClick={() => handleBulkAdjustment(10)}
                        className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-bold text-neutral-700 cursor-pointer"
                        title="Increase all rates by 10%"
                      >
                        +10%
                      </button>
                      <button
                        onClick={() => handleBulkAdjustment(20)}
                        className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-bold text-neutral-700 cursor-pointer"
                        title="Increase all rates by 20%"
                      >
                        +20%
                      </button>
                      <button
                        onClick={() => handleBulkAdjustment(-10)}
                        className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-bold text-neutral-700 cursor-pointer"
                        title="Decrease all rates by 10%"
                      >
                        -10%
                      </button>
                      <button
                        onClick={handleResetToDefaults}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer border border-rose-200"
                        title="Reset all prices to initial defaults"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset Defaults</span>
                      </button>
                    </div>

                    {/* Primary Save Button */}
                    <button
                      onClick={handleSaveRates}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer active:scale-95"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Live Rates</span>
                    </button>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    <span className="text-neutral-400 font-semibold text-[11px] shrink-0">Platform:</span>
                    {(['all', 'instagram', 'youtube', 'facebook', 'telegram', 'twitter'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPlatformFilter(p)}
                        className={`px-2.5 py-1 rounded-lg font-bold capitalize shrink-0 cursor-pointer transition-colors ${
                          platformFilter === p
                            ? 'bg-neutral-900 text-white'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}

                    <span className="text-neutral-400 font-semibold text-[11px] shrink-0 ml-2">Type:</span>
                    {(['all', 'views', 'likes', 'followers', 'subscribers'] as const).map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategoryFilter(c)}
                        className={`px-2.5 py-1 rounded-lg font-bold capitalize shrink-0 cursor-pointer transition-colors ${
                          categoryFilter === c
                            ? 'bg-purple-700 text-white'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rates List / Table */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                  {displayedServices.map((service) => {
                    return (
                      <div
                        key={service.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          service.enabled === false
                            ? 'bg-neutral-50/60 border-dashed border-neutral-300 opacity-60'
                            : 'bg-white border-neutral-200/90 shadow-2xs hover:border-purple-300'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Service Details */}
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700">
                                {service.platform}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 capitalize">
                                {service.category}
                              </span>
                              <h4 className="font-bold text-neutral-900 text-sm sm:text-base">
                                {service.name}
                              </h4>
                            </div>
                            <p className="text-xs text-neutral-500">{service.description}</p>
                            <div className="flex items-center gap-3 text-[11px] text-neutral-400 pt-1">
                              <span>Min: {service.minQuantity.toLocaleString('en-IN')}</span>
                              <span>•</span>
                              <span>Max: {service.maxQuantity.toLocaleString('en-IN')}</span>
                              <span>•</span>
                              <span>Speed: {service.speed}</span>
                            </div>
                          </div>

                          {/* Rate Adjustment Controls */}
                          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                            <div className="text-right">
                              <span className="text-[10px] text-neutral-400 font-bold uppercase block">
                                Rate (INR {service.category === 'watchtime' ? 'per pack' : 'per 1,000'})
                              </span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="font-extrabold text-neutral-500 text-sm">₹</span>
                                <input
                                  type="number"
                                  min={1}
                                  step={1}
                                  value={service.pricePerUnit}
                                  onChange={(e) =>
                                    handleRateChange(service.id, parseInt(e.target.value) || 1)
                                  }
                                  className="w-24 px-2 py-1.5 rounded-xl border border-neutral-300 font-black text-base text-neutral-950 text-center focus:ring-2 focus:ring-purple-600 focus:outline-none bg-neutral-50"
                                />
                              </div>
                            </div>

                            {/* Quick delta buttons */}
                            <div className="flex flex-col gap-1">
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleRateDelta(service.id, 10)}
                                  className="w-7 h-6 rounded-lg bg-neutral-100 hover:bg-emerald-100 hover:text-emerald-700 text-neutral-600 text-[10px] font-bold flex items-center justify-center transition-colors"
                                  title="+₹10"
                                >
                                  +10
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRateDelta(service.id, 50)}
                                  className="w-7 h-6 rounded-lg bg-neutral-100 hover:bg-emerald-100 hover:text-emerald-700 text-neutral-600 text-[10px] font-bold flex items-center justify-center transition-colors"
                                  title="+₹50"
                                >
                                  +50
                                </button>
                              </div>
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleRateDelta(service.id, -10)}
                                  className="w-7 h-6 rounded-lg bg-neutral-100 hover:bg-rose-100 hover:text-rose-700 text-neutral-600 text-[10px] font-bold flex items-center justify-center transition-colors"
                                  title="-₹10"
                                >
                                  -10
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRateDelta(service.id, -50)}
                                  className="w-7 h-6 rounded-lg bg-neutral-100 hover:bg-rose-100 hover:text-rose-700 text-neutral-600 text-[10px] font-bold flex items-center justify-center transition-colors"
                                  title="-₹50"
                                >
                                  -50
                                </button>
                              </div>
                            </div>

                            {/* Toggle Enable/Disable */}
                            <button
                              type="button"
                              onClick={() => handleToggleEnable(service.id)}
                              className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors ${
                                service.enabled === false
                                  ? 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300'
                                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                              }`}
                            >
                              {service.enabled === false ? 'Disabled' : 'Active'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Sticky Action Bar */}
                <div className="p-4 bg-neutral-900 text-white flex items-center justify-between shrink-0">
                  <div className="text-xs text-neutral-400">
                    Showing <strong className="text-white">{displayedServices.length}</strong> services. Changes take effect on the store immediately when saved.
                  </div>
                  <button
                    onClick={handleSaveRates}
                    className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Apply & Save All Rates</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: CUSTOMER ORDERS */}
            {activeTab === 'orders' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-black text-neutral-900 text-base">Customer Orders</h4>
                    <p className="text-xs text-neutral-500">
                      Orders placed via PhonePe QR Code and WhatsApp
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-neutral-100 text-neutral-800 px-3 py-1 rounded-full">
                    Total: {orders.length}
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="p-12 text-center text-neutral-400 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300">
                    <Package className="w-10 h-10 mx-auto mb-2 text-neutral-300" />
                    <p className="text-sm font-semibold text-neutral-600">No customer orders yet</p>
                    <p className="text-xs text-neutral-400 mt-1">
                      When visitors configure an order and proceed to QR payment, their order will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((ord) => (
                      <div
                        key={ord.orderId}
                        className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 shadow-2xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-black bg-neutral-900 text-white px-2.5 py-1 rounded-lg">
                              #{ord.orderId}
                            </span>
                            <span className="text-xs font-bold text-neutral-900">{ord.serviceName}</span>
                          </div>
                          <div className="text-sm font-black text-neutral-900">
                            ₹{ord.totalPrice.toLocaleString('en-IN')}{' '}
                            <span className="text-xs font-normal text-neutral-500">
                              ({ord.quantity.toLocaleString('en-IN')} units)
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-neutral-400 block text-[11px]">Target Account / Link:</span>
                            <span className="font-mono font-bold text-neutral-800 break-all select-all">
                              {ord.targetUrl}
                            </span>
                          </div>
                          <div>
                            <span className="text-neutral-400 block text-[11px]">UTR / Transaction Ref:</span>
                            <span className="font-mono font-bold text-purple-700 select-all">
                              {ord.utrNumber || 'Not provided yet'}
                            </span>
                          </div>
                        </div>

                        {/* Status update selector & actions */}
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-neutral-100">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-neutral-500">Status:</span>
                            <select
                              value={ord.status}
                              onChange={(e) =>
                                handleOrderStatusChange(
                                  ord.orderId,
                                  e.target.value as OrderDetails['status']
                                )
                              }
                              className="text-xs font-bold px-2.5 py-1 rounded-lg border border-neutral-300 bg-neutral-50 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                            >
                              <option value="pending_payment">Pending Payment</option>
                              <option value="verifying">Verifying UTR</option>
                              <option value="processing">Processing</option>
                              <option value="in_progress">In Progress</option>
                              <option value="completed">Completed ✅</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* WhatsApp Direct Chat with prefilled reply */}
                            <a
                              href={`https://wa.me/91${adminContact.phone}?text=${encodeURIComponent(
                                `Hi! Regarding your Order #${ord.orderId} for ${ord.serviceName} (${ord.quantity} units):\nStatus: ${ord.status.toUpperCase()}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-white" />
                              <span>Reply on WhatsApp</span>
                            </a>

                            <button
                              onClick={() => handleDeleteOrder(ord.orderId)}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SETTINGS (UPI, WHATSAPP, PIN) */}
            {activeTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Contact & Payment Form */}
                <form onSubmit={handleSaveContact} className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-2xs space-y-4">
                  <h4 className="font-black text-neutral-900 text-sm sm:text-base flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-purple-600" />
                    <span>Payment & WhatsApp Contact Information</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">
                        WhatsApp Contact Number
                      </label>
                      <input
                        type="text"
                        value={localContact.phone}
                        onChange={(e) =>
                          setLocalContact({
                            ...localContact,
                            phone: e.target.value,
                            formattedPhone: `+91 ${e.target.value}`,
                            whatsappUrl: `https://wa.me/91${e.target.value}`,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono font-bold text-neutral-900"
                        placeholder="7488264269"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">
                        PhonePe UPI ID
                      </label>
                      <input
                        type="text"
                        value={localContact.upiId}
                        onChange={(e) =>
                          setLocalContact({ ...localContact, upiId: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono font-bold text-neutral-900"
                        placeholder="7488264269@ybl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">
                        Secondary UPI ID (Optional)
                      </label>
                      <input
                        type="text"
                        value={localContact.secondaryUpiId}
                        onChange={(e) =>
                          setLocalContact({ ...localContact, secondaryUpiId: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-mono font-bold text-neutral-900"
                        placeholder="7488264269@ibl"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-neutral-700 mb-1">
                        Merchant Display Name
                      </label>
                      <input
                        type="text"
                        value={localContact.merchantName}
                        onChange={(e) =>
                          setLocalContact({ ...localContact, merchantName: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 font-bold text-neutral-900"
                        placeholder="MyFame Growth Panel"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Contact & UPI Settings</span>
                  </button>
                </form>

                {/* Change Admin PIN Form */}
                <form onSubmit={handleChangePin} className="bg-white rounded-2xl p-5 border border-neutral-200/90 shadow-2xs space-y-4">
                  <h4 className="font-black text-neutral-900 text-sm sm:text-base flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-500" />
                    <span>Change Admin Passcode (PIN)</span>
                  </h4>

                  <div className="max-w-xs space-y-2">
                    <label className="block text-xs font-bold text-neutral-700">
                      Enter New 4-Digit PIN
                    </label>
                    <input
                      type="password"
                      maxLength={8}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="e.g. 7488"
                      className="w-full px-3.5 py-2 rounded-xl border border-neutral-300 text-sm font-mono font-bold"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={newPin.trim().length < 4}
                      className="py-2.5 px-5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Update Admin PIN</span>
                    </button>
                    {pinSaved && (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> PIN Updated!
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
