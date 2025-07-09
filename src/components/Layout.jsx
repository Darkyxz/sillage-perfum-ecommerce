
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UrgencyBanner from '@/components/UrgencyBanner';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
      <UrgencyBanner />
    </div>
  );
};

export default Layout;
  