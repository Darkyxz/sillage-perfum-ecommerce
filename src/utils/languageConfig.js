// Configuración de idioma para la aplicación
export const LANGUAGE_CONFIG = {
  // Idioma principal de la aplicación
  primary: 'es-CL',
  
  // Configuración para metadatos
  htmlLang: 'es-CL',
  contentLanguage: 'es-CL',
  ogLocale: 'es_CL',
  languageName: 'Spanish',
  
  // Configuración regional
  country: 'Chile',
  region: 'CL',
  
  // Configuración para Google Translate
  googleTranslateSource: 'es',
  
  // Textos por defecto
  defaultTitle: 'Sillage-Perfum - Perfumes Premium',
  defaultDescription: 'Descubre nuestra exclusiva colección de perfumes de lujo. Fragancias únicas para cada ocasión especial.'
};

// Función para configurar el idioma en el documento
export const setDocumentLanguage = () => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = LANGUAGE_CONFIG.htmlLang;
    
    // Agregar atributo de dirección de texto (left-to-right para español)
    document.documentElement.dir = 'ltr';
    
    // Configurar metadatos dinámicamente si es necesario
    const existingContentLang = document.querySelector('meta[http-equiv="content-language"]');
    if (!existingContentLang) {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'content-language';
      meta.content = LANGUAGE_CONFIG.contentLanguage;
      document.head.appendChild(meta);
    }
  }
};

// Hook para usar en componentes React
export const useLanguageConfig = () => {
  return LANGUAGE_CONFIG;
};