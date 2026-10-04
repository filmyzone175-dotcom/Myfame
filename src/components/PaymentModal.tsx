import React, { useState } from 'react';
import { X, CheckCircle2, MessageCircle, AlertCircle, Shield, Clock, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { OrderDetails, AdminContactInfo } from '../types';
import { ADMIN_CONTACT } from '../data/servicesData';
import { PhonePeQr } from './PhonePeQr';

interface PaymentModalProps {
  order: OrderDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onOrderConfirmed: (order: OrderDetails) => void;
  contact?: AdminContactInfo;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  order,
  isOpen,
  onClose,
  onOrderConfirmed,
  contact = ADMIN_CONTACT,
}) => {
  const [utrNumber, setUtrNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'pay' | 'success'>('pay');

  if (!isOpen || !order) return null;

  const handleSendToWhatsApp = () => {
    setIsSubmitting(true);

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const updatedOrder: OrderDetails = {
      ...order,
      utrNumber: utrNumber.trim() || 'Pending in Screenshot',
      status: 'verifying',
    };

    onOrderConfirmed(updatedOrder);

    // Save to local storage for tracking
    try {
      const existing = JSON.parse(localStorage.getItem('myfame_orders') || '[]');
      const filtered = existing.filter((o: OrderDetails) => o.orderId !== updatedOrder.orderId);
      localStorage.setItem('myfame_orders', JSON.stringify([updatedOrder, ...filtered]));
    } catch {
      // ignore
    }

    // Format WhatsApp message
    const msg = `🚀 *NEW ORDER: MyFame Boost*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🆔 *Order ID:* #${order.orderId}\n` +
      `📱 *Service:* ${order.serviceName}\n` +
      `🎯 *Quantity:* ${order.quantity.toLocaleString('en-IN')}\n` +
      `🔗 *Target Link/Handle:* ${order.targetUrl}\n` +
      `💰 *Amount Paid:* ₹${order.totalPrice.toLocaleString('en-IN')}\n` +
      `💳 *UTR / Trans ID:* ${utrNumber.trim() ? utrNumber.trim() : 'Attaching screenshot'}\n` +
      `⏰ *Time:* ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `I have made the payment via PhonePe QR Code. Please check the attached payment screenshot and start my delivery!`;

    const encoded = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/91${contact.phone}?text=${encoded}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    setStep('success');
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-neutral-100">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 text-white border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <h3 className="font-bold text-base sm:text-lg">
              {step === 'pay' ? 'Complete QR Payment' : 'Order Submitted!'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'pay' ? (
          <div className="p-5 sm:p-6 space-y-6 max-h-[82vh] overflow-y-auto">
            {/* Order Brief Summary Card */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded">
                      #{order.orderId}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Starts in 5-15 min
                    </span>
                  </div>
                  <h4 className="font-bold text-neutral-900 text-sm sm:text-base mt-1.5 leading-snug">
                    {order.serviceName}
                  </h4>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-neutral-500 block">Total Amount</span>
                  <span className="text-xl sm:text-2xl font-black text-neutral-950">
                    ₹{order.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-neutral-200 text-neutral-600">
                <div>
                  <span className="text-neutral-400 block text-[11px]">Quantity:</span>
                  <span className="font-bold text-neutral-800">{order.quantity.toLocaleString('en-IN')} units</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[11px]">Target Account / Link:</span>
                  <span className="font-mono text-neutral-800 font-semibold truncate block" title={order.targetUrl}>
                    {order.targetUrl}
                  </span>
                </div>
              </div>
            </div>

            {/* PhonePe QR Code Component */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-700">
                  Step 1: Scan & Pay via UPI
                </span>
                <span className="text-xs text-neutral-500">PhonePe / GPay / Paytm</span>
              </div>
              <PhonePeQr
                amount={order.totalPrice}
                orderId={order.orderId}
                serviceName={order.serviceName}
                contact={contact}
              />
            </div>

            {/* Step 2: Verification on WhatsApp */}
            <div className="bg-emerald-50/80 rounded-2xl p-4 sm:p-5 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <h5 className="font-bold text-emerald-950 text-sm sm:text-base">
                  Submit Payment & Confirm on WhatsApp
                </h5>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  UPI Reference No. / UTR (12 Digits) <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="e.g. 427918392104"
                  value={utrNumber}
                  onChange={(e) => setUtrNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono bg-white"
                />
                <p className="text-[11px] text-neutral-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-neutral-400" />
                  Found in your PhonePe / GPay payment receipt under "UTR" or "UPI Ref ID".
                </p>
              </div>

              {/* Big WhatsApp Confirm Button */}
              <button
                type="button"
                onClick={handleSendToWhatsApp}
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/25 transition-all text-sm sm:text-base cursor-pointer hover:shadow-xl active:scale-[0.99]"
              >
                <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                <span>Confirm Order on WhatsApp (+91 {contact.phone})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-start gap-2 pt-1 text-[11px] text-emerald-800">
                <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  After clicking, WhatsApp will open with your pre-filled order details. Simply attach your payment screenshot in the chat to begin delivery!
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                WhatsApp Opened
              </span>
              <h4 className="text-xl sm:text-2xl font-black text-neutral-900 mt-2">
                Order #{order.orderId} Created!
              </h4>
              <p className="text-sm text-neutral-600 mt-1 max-w-md mx-auto">
                Please send the pre-filled message and attach your payment screenshot to WhatsApp number{' '}
                <strong className="text-neutral-900">{contact.formattedPhone}</strong>.
              </p>
            </div>

            <div className="bg-neutral-50 rounded-2xl p-4 text-left border border-neutral-200 max-w-md mx-auto space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Service:</span>
                <span className="font-semibold text-neutral-900">{order.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Target:</span>
                <span className="font-mono text-neutral-900 font-medium truncate max-w-[200px]">{order.targetUrl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Amount Paid:</span>
                <span className="font-bold text-neutral-900">₹{order.totalPrice}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Estimated Start:</span>
                <span className="font-semibold text-emerald-600">Within 5-15 mins</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Re-open WhatsApp Chat</span>
              </a>
              <button
                onClick={onClose}
                className="py-3 px-5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-bold rounded-xl text-xs sm:text-sm transition-colors"
              >
                Done / Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
