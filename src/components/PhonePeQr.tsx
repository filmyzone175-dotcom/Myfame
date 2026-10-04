import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, ExternalLink, ShieldCheck, Smartphone, QrCode } from 'lucide-react';
import { ADMIN_CONTACT } from '../data/servicesData';
import { AdminContactInfo } from '../types';

interface PhonePeQrProps {
  amount: number;
  orderId: string;
  serviceName: string;
  contact?: AdminContactInfo;
}

export const PhonePeQr: React.FC<PhonePeQrProps> = ({
  amount,
  orderId,
  serviceName,
  contact = ADMIN_CONTACT,
}) => {
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Exact UPI intent string compatible with PhonePe, Google Pay, Paytm, BHIM
  const upiIntentUrl = `upi://pay?pa=${contact.upiId}&pn=${encodeURIComponent(
    contact.merchantName || 'MyFame Services'
  )}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Order ${orderId}`)}`;

  const copyToClipboard = (text: string, type: 'upi' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'upi') {
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  // SVG Data URI for the PhonePe "पे" emblem matching user uploaded screenshot
  const phonepeCenterLogo = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <circle cx="50" cy="50" r="47" fill="#000000" stroke="#ffffff" stroke-width="6"/>
      <text x="50" y="66" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="52" fill="#ffffff" text-anchor="middle">पे</text>
    </svg>
  `)}`;

  return (
    <div className="bg-white rounded-2xl p-5 border border-purple-100 shadow-xl relative overflow-hidden">
      {/* Top PhonePe Branded Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-purple-950 -mx-5 -mt-5 px-5 py-3 text-white flex items-center justify-between mb-4 shadow-sm">
        <div className="flex items-center gap-2">
          {/* PhonePe "पे" Icon */}
          <div className="w-8 h-8 rounded-full bg-white text-purple-900 font-extrabold flex items-center justify-center text-lg shadow-sm border border-purple-200">
            पे
          </div>
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-purple-200 block">Official UPI Payment</span>
            <span className="text-sm font-bold text-white tracking-wide">PhonePe • GPay • Paytm</span>
          </div>
        </div>
        <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Verified Merchant</span>
        </div>
      </div>

      {/* QR Code Container */}
      <div className="flex flex-col items-center">
        <div className="text-center mb-2">
          <p className="text-xs text-neutral-500 font-medium">Scan to pay exact amount</p>
          <div className="text-2xl font-black text-neutral-900 flex items-center justify-center gap-1 mt-0.5">
            <span className="text-lg font-bold text-neutral-500">₹</span>
            <span>{amount.toLocaleString('en-IN')}</span>
            <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold ml-1">
              Zero Extra Fee
            </span>
          </div>
        </div>

        {/* The PhonePe QR Frame */}
        <div className="relative p-3.5 bg-white rounded-2xl border-2 border-neutral-800 shadow-md">
          <QRCodeSVG
            value={upiIntentUrl}
            size={200}
            level="H"
            includeMargin={false}
            imageSettings={{
              src: phonepeCenterLogo,
              height: 44,
              width: 44,
              excavate: true,
            }}
          />
        </div>

        {/* Accepted UPI Apps logos / text */}
        <div className="flex items-center justify-center gap-2 mt-3 text-[11px] font-semibold text-neutral-600 bg-neutral-50 px-3 py-1.5 rounded-full border border-neutral-200">
          <span className="text-purple-700">PhonePe</span>
          <span>•</span>
          <span className="text-blue-600">Google Pay</span>
          <span>•</span>
          <span className="text-sky-600">Paytm</span>
          <span>•</span>
          <span className="text-orange-600">BHIM UPI</span>
        </div>

        {/* Quick Mobile UPI Intent Button (Only clickable on mobile/UPI supported devices) */}
        <div className="w-full mt-4">
          <a
            href={upiIntentUrl}
            className="w-full py-2.5 px-4 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-all active:scale-[0.98]"
          >
            <Smartphone className="w-4 h-4" />
            <span>Pay ₹{amount} via PhonePe / GPay / Paytm</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>
          <p className="text-[10px] text-center text-neutral-400 mt-1">
            (Tap above on mobile to directly open PhonePe or Google Pay)
          </p>
        </div>

        {/* Copy UPI ID & Phone */}
        <div className="w-full mt-4 space-y-2 pt-3 border-t border-dashed border-neutral-200">
          <div className="flex items-center justify-between bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 text-xs">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">PhonePe UPI ID</span>
              <span className="font-mono font-bold text-neutral-800 select-all">{contact.upiId}</span>
            </div>
            <button
              onClick={() => copyToClipboard(contact.upiId, 'upi')}
              type="button"
              className="px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-neutral-700 font-semibold text-xs flex items-center gap-1 hover:bg-neutral-100 transition-colors shadow-2xs"
            >
              {copiedUpi ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Copy UPI</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-between bg-neutral-50 p-2.5 rounded-xl border border-neutral-200 text-xs">
            <div>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider block">Admin WhatsApp / Contact</span>
              <span className="font-mono font-bold text-neutral-800">{contact.formattedPhone}</span>
            </div>
            <button
              onClick={() => copyToClipboard(contact.phone, 'phone')}
              type="button"
              className="px-2.5 py-1.5 bg-white border border-neutral-300 rounded-lg text-neutral-700 font-semibold text-xs flex items-center gap-1 hover:bg-neutral-100 transition-colors shadow-2xs"
            >
              {copiedPhone ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Copy No.</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
