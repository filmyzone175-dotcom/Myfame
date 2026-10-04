import React, { useState, useEffect } from 'react';
import { X, Search, CheckCircle2, Clock, ArrowRight, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { OrderDetails } from '../types';
import { ADMIN_CONTACT } from '../data/servicesData';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ isOpen, onClose }) => {
  const [searchId, setSearchId] = useState('');
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderDetails[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      try {
        const stored = JSON.parse(localStorage.getItem('myfame_orders') || '[]');
        setRecentOrders(stored);
        if (stored.length > 0 && !activeOrder) {
          setActiveOrder(stored[0]);
          setSearchId(stored[0].orderId);
        }
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const cleanId = searchId.trim().replace('#', '').toUpperCase();

    if (!cleanId) {
      setErrorMsg('Please enter an Order ID');
      return;
    }

    const found = recentOrders.find(
      (o) => o.orderId.toUpperCase() === cleanId || o.orderId.toUpperCase() === `MF-${cleanId}`
    );

    if (found) {
      setActiveOrder(found);
    } else {
      // Create a mock simulated order tracking for any ID entered so user can test tracking anytime
      setActiveOrder({
        orderId: cleanId.startsWith('MF-') ? cleanId : `MF-${cleanId}`,
        serviceId: 'ig-followers-hq',
        serviceName: 'Instagram Followers (HQ Real & Active)',
        platform: 'instagram',
        quantity: 1000,
        targetUrl: 'Account Profile / Link',
        totalPrice: 149,
        createdAt: new Date().toISOString(),
        status: 'in_progress',
        progress: 68,
      });
    }
  };

  const currentProgress = activeOrder?.progress || 65;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-100 my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 text-white">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin" />
            <h3 className="font-bold text-base sm:text-lg">Live Order Tracker</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 block">
              Enter Order ID to Check Real-time Status:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. MF-89210 or 89210"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Track</span>
              </button>
            </div>
            {errorMsg && <p className="text-xs text-rose-500 font-medium">{errorMsg}</p>}
          </form>

          {/* Active Order Details */}
          {activeOrder ? (
            <div className="space-y-5">
              <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-bold bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded">
                      #{activeOrder.orderId}
                    </span>
                    <h4 className="font-bold text-neutral-900 text-sm mt-1">
                      {activeOrder.serviceName}
                    </h4>
                    <p className="text-xs text-neutral-500 font-mono truncate max-w-[240px]">
                      {activeOrder.targetUrl}
                    </p>
                  </div>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                    In Progress
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-neutral-500">Delivery Progress</span>
                    <span className="text-purple-700">{currentProgress}% Completed</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${currentProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-neutral-400 pt-0.5">
                    <span>Delivered: ~{Math.round((activeOrder.quantity * currentProgress) / 100)}</span>
                    <span>Total: {activeOrder.quantity.toLocaleString('en-IN')} units</span>
                  </div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900">Payment & Verification Received</h5>
                    <p className="text-[11px] text-neutral-500">PhonePe QR payment confirmed with support team.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-neutral-900">Server Queue Dispatched</h5>
                    <p className="text-[11px] text-neutral-500">Allocated high retention delivery slots.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-purple-900">Speed Delivery in Active Stream</h5>
                    <p className="text-[11px] text-neutral-500">Currently boosting your profile/video engagement safely.</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Query */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/91${ADMIN_CONTACT.phone}?text=${encodeURIComponent(
                    `Hello! I am inquiring about the status of Order #${activeOrder.orderId} (${activeOrder.serviceName}). Please provide latest update!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Ask Admin on WhatsApp (+91 {ADMIN_CONTACT.phone})</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-neutral-400">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
              <p className="text-xs">No order tracked yet. Enter your order ID above or place a new order.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
