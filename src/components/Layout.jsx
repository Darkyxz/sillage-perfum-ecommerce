import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import UrgencyBanner from '@/components/UrgencyBanner';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 dark:bg-gradient-to-br dark:from-sillage-dark-lighter dark:to-sillage-dark">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <UrgencyBanner />
    </div>
  );
};

export default Layout;
  