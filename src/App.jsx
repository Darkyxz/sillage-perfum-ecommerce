import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { setDocumentLanguage, LANGUAGE_CONFIG } from '@/utils/languageConfig';
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
import Checkout from '@/pages/Checkout';
import OrderConfirmation from '@/pages/OrderConfirmation';
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

import TrackingPage from '@/pages/TrackingPage';
import MakeAdmin from '@/pages/MakeAdmin';
import ComoComprar from './components/ComoComprar';
import CookiesPolicy from './components/CookiesPolicy';
import TerminosCondiciones from './components/TerminosCondiciones';
import PoliticaPrivacidad from './components/PoliticaPrivacidad';
import CookieNotification from './components/CookieNotification';

import SimpleTest from './components/SimpleTest';
import MinimalApp from './components/MinimalApp';
import SafeContextWrapper from './components/SafeContextWrapper';
import AppLoader from './components/AppLoader';
import EmergencyFallback from './components/EmergencyFallback';
import CookieConsent from './components/CookieConsent';
import SEOStatus from './components/SEOStatus';
import safeStorage from './utils/storage';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  const isStorageError = error.message.includes('localStorage') ||
    error.message.includes('sessionStorage') ||
    error.message.includes('storage');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="bg-card border border-border rounded-lg p-8 max-w-2xl text-center shadow-lg">
        <h2 className="text-2xl font-bold text-sillage-gold mb-4">
          {isStorageError ? 'Problema de Compatibilidad' : 'Error en la aplicación'}
        </h2>

        {isStorageError ? (
          <div className="mb-6">
            <p className="text-muted-foreground mb-4">
              Tu navegador tiene configuraciones de privacidad que limitan algunas funciones.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-amber-800 text-sm">
                <strong>Sugerencias:</strong>
              </p>
              <ul className="text-amber-700 text-sm mt-2 space-y-1">
                <li>• Habilita las cookies en la configuración del navegador</li>
                <li>• Desactiva el modo de navegación privada</li>
                <li>• Prueba con otro navegador</li>
              </ul>
            </div>
          </div>
        ) : (
          <p className="mb-6 text-muted-foreground">{error.message}</p>
        )}

        <div className="space-x-4">
          <button
            onClick={resetErrorBoundary}
            className="bg-sillage-gold text-white px-6 py-2 rounded-lg hover:bg-sillage-gold-dark transition"
          >
            Intentar nuevamente
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Recargar página
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-4 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground">
              Detalles técnicos
            </summary>
            <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}

function App() {
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [showSimpleTest, setShowSimpleTest] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('light');

    // Configurar idioma del documento
    setDocumentLanguage();

    // Verificar storage y mostrar test simple si hay problemas críticos
    const checkStorage = () => {
      const available = safeStorage.isStorageAvailable();
      setStorageAvailable(available);

      // Si no hay storage disponible Y estamos en desarrollo, mostrar test simple
      if (!available && process.env.NODE_ENV === 'development') {
        console.warn('🚨 Storage no disponible - Mostrando test simple');
        // Comentar la siguiente línea para deshabilitar el test simple
        // setShowSimpleTest(true);
      }
    };

    checkStorage();
  }, []);

  // Test simple para verificar que React funciona
  if (showSimpleTest) {
    return <SimpleTest />;
  }

  // Si no hay storage disponible,   <SEOStatus />  usar aplicación mínima
  if (!storageAvailable) {
    console.warn('🚨 Storage no disponible - Usando aplicación mínima');
    return <MinimalApp />;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ContentProtection>
        <EmergencyFallback>
          <AppLoader>
            <HelmetProvider>
              <SafeContextWrapper contextName="AuthContext">
                <AuthProvider>
                  <SafeContextWrapper contextName="CartContext">
                    <CartProvider>
                      <SafeContextWrapper contextName="FavoritesContext">
                        <FavoritesProvider>
                          <Router>
                            <div className="min-h-screen transition-colors duration-300 bg-background text-foreground">
                              <Helmet>
                                <html lang={LANGUAGE_CONFIG.htmlLang} dir="ltr" />
                                <title>{LANGUAGE_CONFIG.defaultTitle}</title>
                                <meta name="description" content={LANGUAGE_CONFIG.defaultDescription} />
                                <meta name="theme-color" content="#FFC107" />
                                <meta http-equiv="content-language" content={LANGUAGE_CONFIG.contentLanguage} />
                                <meta name="language" content={LANGUAGE_CONFIG.languageName} />
                                <meta property="og:locale" content={LANGUAGE_CONFIG.ogLocale} />
                                <meta name="geo.region" content={LANGUAGE_CONFIG.region} />
                                <meta name="geo.country" content={LANGUAGE_CONFIG.country} />
                              </Helmet>

                              <Layout>
                                <ErrorBoundary FallbackComponent={ErrorFallback}>
                                  <Routes>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/productos" element={<Products />} />
                                    <Route path="/productos/:sku" element={<ProductDetail />} />
                                    <Route path="/carrito" element={<Cart />} />
                                    <Route path="/checkout" element={<Checkout />} />
                                    <Route path="/pedido-confirmado" element={<OrderConfirmation />} />
                                    <Route path="/favoritos" element={<Favorites />} />
                                    <Route path="/admin" element={<Admin />} />
                                    <Route path="/make-admin" element={<MakeAdmin />} />
                                    <Route path="/perfil" element={<Profile />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/contacto" element={<ContactForm />} />
                                    <Route path="/categoria/:categorySlug" element={<CategoryPage />} />
                                    <Route path="/pago-exitoso" element={<PaymentSuccessPage />} />
                                    <Route path="/pago-fallido" element={<PaymentFailurePage />} />
                                    <Route path="/pago-pendiente" element={<PaymentPendingPage />} />
                                    <Route path="/como-comprar" element={<ComoComprar />} />
                                    <Route path="/cookies" element={<CookiesPolicy />} />
                                    <Route path="/terminos" element={<TerminosCondiciones />} />
                                    <Route path="/privacidad" element={<PoliticaPrivacidad />} />
                                    <Route
                                      path="/seguimiento"
                                      element={
                                        <ContentProtection requiredAuthLevel="user">
                                          <TrackingPage />
                                        </ContentProtection>
                                      }
                                    />
                                  </Routes>
                                </ErrorBoundary>
                              </Layout>

                              <Toaster />
                              <CookieNotification />
                              <CookieConsent />

                            </div>
                          </Router>
                        </FavoritesProvider>
                      </SafeContextWrapper>
                    </CartProvider>
                  </SafeContextWrapper>
                </AuthProvider>
              </SafeContextWrapper>
            </HelmetProvider>
          </AppLoader>
        </EmergencyFallback>
      </ContentProtection>
    </ErrorBoundary>
  );
}

export default App;