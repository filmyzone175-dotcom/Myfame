import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { OrderCalculator } from './components/OrderCalculator';
import { ServicesGrid } from './components/ServicesGrid';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Reviews } from './components/Reviews';
import { FaqSection } from './components/FaqSection';
import { PaymentModal } from './components/PaymentModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { AdminPanelModal } from './components/AdminPanelModal';
import { PlatformId, ServiceOption, OrderDetails, AdminContactInfo } from './types';
import { SERVICES, ADMIN_CONTACT } from './data/servicesData';

export default function App() {
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>('instagram');
  const [activeOrder, setActiveOrder] = useState<OrderDetails | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isTrackerModalOpen, setIsTrackerModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Dynamic services & rates loaded from localStorage or defaults
  const [services, setServices] = useState<ServiceOption[]>(() => {
    try {
      const saved = localStorage.getItem('myfame_services_rates');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return SERVICES;
  });

  // Dynamic admin contact info loaded from localStorage or defaults
  const [adminContact, setAdminContact] = useState<AdminContactInfo>(() => {
    try {
      const saved = localStorage.getItem('myfame_contact_info');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return ADMIN_CONTACT;
  });

  // Customer orders stored in browser session / storage
  const [orders, setOrders] = useState<OrderDetails[]>(() => {
    try {
      const saved = localStorage.getItem('myfame_orders');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Listen for storage changes across tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedServices = localStorage.getItem('myfame_services_rates');
        if (savedServices) setServices(JSON.parse(savedServices));

        const savedContact = localStorage.getItem('myfame_contact_info');
        if (savedContact) setAdminContact(JSON.parse(savedContact));

        const savedOrders = localStorage.getItem('myfame_orders');
        if (savedOrders) setOrders(JSON.parse(savedOrders));
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Triggered when user submits the order from calculator
  const handleStartOrder = (order: OrderDetails) => {
    setActiveOrder(order);
    setIsPaymentModalOpen(true);
  };

  // Triggered when user selects a service card from the grid
  const handleSelectServiceFromGrid = (service: ServiceOption) => {
    setSelectedPlatform(service.platform);
    // Smooth scroll to the order calculator
    const el = document.getElementById('quick-order');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderConfirmed = (confirmedOrder: OrderDetails) => {
    setActiveOrder(confirmedOrder);
    setOrders((prev) => {
      const filtered = prev.filter((o) => o.orderId !== confirmedOrder.orderId);
      const updated = [confirmedOrder, ...filtered];
      localStorage.setItem('myfame_orders', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUpdateServices = (updatedServices: ServiceOption[]) => {
    setServices(updatedServices);
  };

  const handleUpdateContact = (updatedContact: AdminContactInfo) => {
    setAdminContact(updatedContact);
  };

  const handleUpdateOrders = (updatedOrders: OrderDetails[]) => {
    setOrders(updatedOrders);
  };

  return (
    <div className="min-h-screen bg-neutral-100/60 font-sans text-neutral-900 selection:bg-purple-200 selection:text-purple-900">
      {/* Sticky Navigation */}
      <Navbar
        onOpenTracker={() => setIsTrackerModalOpen(true)}
        onSelectPlatform={(p) => setSelectedPlatform(p)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        contact={adminContact}
      />

      <main>
        {/* Hero with live ticker and value propositions */}
        <Hero contact={adminContact} />

        {/* Core Direct Order Configurator (just like myfame.in) */}
        <section className="px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-16 relative z-20">
          <OrderCalculator
            key={`${selectedPlatform}-${services.map((s) => s.pricePerUnit).join('-')}`}
            selectedPlatformProp={selectedPlatform}
            services={services}
            onStartOrder={handleStartOrder}
          />
        </section>

        {/* All Services & Packages Grid */}
        <ServicesGrid
          services={services}
          onSelectService={handleSelectServiceFromGrid}
        />

        {/* Guarantees & Features */}
        <WhyChooseUs />

        {/* Customer Testimonials & Reviews */}
        <Reviews />

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        onSelectPlatform={(p) => setSelectedPlatform(p)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        contact={adminContact}
      />

      {/* Payment & QR Modal with PhonePe QR Code & WhatsApp Confirmation */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        order={activeOrder}
        contact={adminContact}
        onClose={() => setIsPaymentModalOpen(false)}
        onOrderConfirmed={handleOrderConfirmed}
      />

      {/* Live Order Tracker Modal */}
      <OrderTrackerModal
        isOpen={isTrackerModalOpen}
        onClose={() => setIsTrackerModalOpen(false)}
      />

      {/* Admin Panel Modal to Change Rates & Manage Orders */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        services={services}
        onUpdateServices={handleUpdateServices}
        adminContact={adminContact}
        onUpdateContact={handleUpdateContact}
        orders={orders}
        onUpdateOrders={handleUpdateOrders}
      />

      {/* Floating 24/7 WhatsApp Support Button */}
      <FloatingWhatsApp contact={adminContact} />
    </div>
  );
}
