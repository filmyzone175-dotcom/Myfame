import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { ADMIN_CONTACT } from '../data/servicesData';
import { AdminContactInfo } from '../types';

interface FloatingWhatsAppProps {
  contact?: AdminContactInfo;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ contact = ADMIN_CONTACT }) => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-2">
      {/* Pop-up bubble */}
      {showTooltip && (
        <div className="bg-white rounded-2xl p-3.5 shadow-2xl border border-neutral-200 text-neutral-800 max-w-xs animate-in slide-in-from-bottom-3 duration-200 relative mb-1">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-700 p-0.5"
            title="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              24/7 WhatsApp Support
            </span>
          </div>
          <p className="text-xs text-neutral-700 font-medium leading-snug">
            Need help or have questions? Chat directly with us on WhatsApp!
          </p>
          <span className="text-[11px] font-mono font-bold text-neutral-900 mt-1 block">
            {contact.formattedPhone}
          </span>
        </div>
      )}

      {/* Floating button */}
      <a
        href={contact.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-600/40 hover:scale-110 active:scale-95 transition-all group relative cursor-pointer"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white text-emerald-600" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
        </span>
      </a>
    </div>
  );
};
