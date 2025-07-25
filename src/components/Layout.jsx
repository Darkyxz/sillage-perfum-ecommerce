import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Layout = ({ children }) => {
  return (
    <div 
      className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 dark:bg-gradient-to-br dark:from-sillage-dark-lighter dark:to-sillage-dark w-full"
      style={{ margin: 0, padding: 0, width: '100vw', maxWidth: '100vw', overflowX: 'hidden' }}
    >
      <Header />
      <main className="flex-grow w-full" style={{ margin: 0, padding: 0, width: '100%', maxWidth: '100%' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
  