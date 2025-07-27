import { useState, useEffect } from 'react';

export const useBraveDetection = () => {
  const [browserInfo, setBrowserInfo] = useState({
    isBrave: false,
    isPrivateMode: false,
    hasStorageIssues: false,
    recommendations: []
  });

  useEffect(() => {
    const detectBrowser = async () => {
      const info = {
        isBrave: false,
        isPrivateMode: false,
        hasStorageIssues: false,
        recommendations: []
      };

      // Detectar Brave
      if (navigator.brave && navigator.brave.isBrave) {
        info.isBrave = true;
      } else if (navigator.userAgent.includes('Brave')) {
        info.isBrave = true;
      }

      // Detectar modo privado
      try {
        await new Promise((resolve, reject) => {
          const db = indexedDB.open('test');
          db.onerror = () => reject();
          db.onsuccess = () => resolve();
        });
      } catch (e) {
        info.isPrivateMode = true;
      }

      // Detectar problemas de storage
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
      } catch (e) {
        info.hasStorageIssues = true;
      }

      // Generar recomendaciones
      if (info.isBrave) {
        info.recommendations.push('Brave detectado: Considera ajustar la configuración de privacidad');
        
        if (info.hasStorageIssues) {
          info.recommendations.push('Ve a brave://settings/privacy y ajusta "Bloquear cookies"');
          info.recommendations.push('Asegúrate de que "Bloquear almacenamiento local" esté deshabilitado');
        }
      }

      if (info.isPrivateMode) {
        info.recommendations.push('Modo privado detectado: Algunas funciones pueden estar limitadas');
      }

      if (info.hasStorageIssues && !info.isBrave) {
        info.recommendations.push('Habilita las cookies en la configuración del navegador');
        info.recommendations.push('Desactiva extensiones que bloqueen almacenamiento');
      }

      setBrowserInfo(info);
    };

    detectBrowser();
  }, []);

  return browserInfo;
};