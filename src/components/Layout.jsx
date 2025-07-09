
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UrgencyBanner from '@/components/UrgencyBanner';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 text-gray-900 dark:text-white">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <UrgencyBanner />
    </div>
  );
};

export default Layout;
  