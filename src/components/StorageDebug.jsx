import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, XCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import safeStorage from '@/utils/storage';

const StorageDebug = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    // Solo mostrar en desarrollo o si hay problemas
    const shouldShow = process.env.NODE_ENV === 'development' || 
                      !safeStorage.isStorageAvailable();
    setShowDebug(shouldShow);
    
    if (shouldShow) {
      runDiagnostics();
    }
  }, []);

  const runDiagnostics = () => {
    const info = safeStorage.getStorageInfo();
    setDebugInfo(info);

    // Ejecutar tests
    const tests = {
      localStorage: testLocalStorage(),
      sessionStorage: testSessionStorage(),
      cookies: testCookies(),
      userAgent: getUserAgentInfo(),
      permissions: testPermissions()
    };
    
    setTestResults(tests);
  };

  const testLocalStorage = () => {
    try {
      const test = 'test_' + Date.now();
      localStorage.setItem(test, 'value');
      const result = localStorage.getItem(test) === 'value';
      localStorage.removeItem(test);
      return { status: result ? 'success' : 'error', message: result ? 'Funciona' : 'No funciona' };
    } catch (e) {
      return { status: 'error', message: e.message };
    }
  };

  const testSessionStorage = () => {
    try {
      const test = 'test_' + Date.now();
      sessionStorage.setItem(test, 'value');
      const result = sessionStorage.getItem(test) === 'value';
      sessionStorage.removeItem(test);
      return { status: result ? 'success' : 'error', message: result ? 'Funciona' : 'No funciona' };
    } catch (e) {
      return { status: 'error', message: e.message };
    }
  };

  const testCookies = () => {
    try {
      document.cookie = 'test_cookie=1; SameSite=Lax; path=/';
      const result = document.cookie.includes('test_cookie');
      document.cookie = 'test_cookie=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      return { status: result ? 'success' : 'error', message: result ? 'Habilitadas' : 'Deshabilitadas' };
    } catch (e) {
      return { status: 'error', message: e.message };
    }
  };

  const getUserAgentInfo = () => {
    const ua = navigator.userAgent;
    const isBrave = ua.includes('Brave') || (navigator.brave && navigator.brave.isBrave);
    const isChrome = ua.includes('Chrome');
    const isFirefox = ua.includes('Firefox');
    const isSafari = ua.includes('Safari') && !ua.includes('Chrome');
    
    let browser = 'Desconocido';
    if (isBrave) browser = 'Brave';
    else if (isChrome) browser = 'Chrome';
    else if (isFirefox) browser = 'Firefox';
    else if (isSafari) browser = 'Safari';
    
    return { 
      status: 'info', 
      message: `${browser} - ${ua.substring(0, 50)}...` 
    };
  };

  const testPermissions = () => {
    const permissions = [];
    
    // Test de APIs disponibles
    if (typeof Storage !== 'undefined') permissions.push('Storage API');
    if (typeof IndexedDB !== 'undefined') permissions.push('IndexedDB');
    if (typeof navigator.serviceWorker !== 'undefined') permissions.push('Service Worker');
    
    return { 
      status: 'info', 
      message: permissions.length > 0 ? permissions.join(', ') : 'APIs limitadas' 
    };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  if (!showDebug) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50 max-w-md"
    >
      <div className="bg-gray-900 text-white rounded-lg p-4 shadow-xl border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <h3 className="font-semibold">Diagnóstico de Storage</h3>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowDebug(false)}
            className="text-gray-400 hover:text-white"
          >
            ×
          </Button>
        </div>

        <div className="space-y-2 text-sm">
          {Object.entries(testResults).map(([test, result]) => (
            <div key={test} className="flex items-center justify-between">
              <span className="capitalize">{test.replace(/([A-Z])/g, ' $1')}:</span>
              <div className="flex items-center space-x-1">
                {getStatusIcon(result.status)}
                <span className="text-xs">{result.message}</span>
              </div>
            </div>
          ))}
        </div>

        {debugInfo && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              <div>Fallback items: {debugInfo.fallbackSize}</div>
              <div>Storage OK: {debugInfo.localStorage || debugInfo.sessionStorage ? 'Sí' : 'No'}</div>
            </div>
          </div>
        )}

        <div className="mt-3 flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={runDiagnostics}
            className="text-xs"
          >
            Retest
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => console.log('Storage Debug:', { debugInfo, testResults })}
            className="text-xs"
          >
            Log Info
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default StorageDebug;