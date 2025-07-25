import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import Layout from '@/components/Layout';
import ContentProtection from '@/components/ContentProtection';
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Cart from '@/pages/Cart';
import Favorites from '@/pages/Favorites';
import Admin from '@/pages/Admin';
import Profile from '@/pages/Profile';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import PaymentSuccessPage from '@/pages/PaymentSuccessPage';
import PaymentFailurePage from '@/pages/PaymentFailurePage';
import PaymentPendingPage from '@/pages/PaymentPendingPage';
import ContactForm from '@/pages/ContactForm';
import CategoryPage from '@/pages/CategoryPage';
import AdminDebug from '@/components/AdminDebug';
import TrackingPage from '@/pages/TrackingPage';

function App() {
  useEffect(() => {
    document.documentElement.classList.add('light');
  }, []);

  return (
    <ContentProtection>
      <HelmetProvider>
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <Router>
                <div className="min-h-screen transition-colors duration-300 bg-background text-foreground">
                  <Helmet>
                    <title>Sillage-Perfum - Perfumes Premium</title>
                    <meta name="description" content="Descubre nuestra exclusiva colección de perfumes de lujo. Fragancias únicas para cada ocasión especial." />
                    <meta name="theme-color" content="#FFC107" />
                  </Helmet>
                  
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/productos" element={<Products />} />
                      <Route path="/productos/:sku" element={<ProductDetail />} />
                      <Route path="/carrito" element={<Cart />} />
                      <Route path="/favoritos" element={<Favorites />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="/perfil" element={<Profile />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/contacto" element={<ContactForm />} />
                      <Route path="/categoria/:categorySlug" element={<CategoryPage />} />
                      <Route path="/pago-exitoso" element={<PaymentSuccessPage />} />
                      <Route path="/pago-fallido" element={<PaymentFailurePage />} />
                      <Route path="/pago-pendiente" element={<PaymentPendingPage />} />
                      <Route 
                        path="/seguimiento" 
                        element={
                          <ContentProtection requiredAuthLevel="user">
                            <TrackingPage />
                          </ContentProtection>
                        } 
                      />
                    </Routes>
                  </Layout>
                  
                  <Toaster />
                  <AdminDebug />
                </div>
              </Router>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </HelmetProvider>
    </ContentProtection>
  );
}

export default App; 