'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { theme } from './index';

const ThemeContext = createContext();

export function ThemeProvider({ children, defaultTheme = 'light' }) {
  const [currentTheme, setCurrentTheme] = useState(defaultTheme);
  
  // Apply theme class to root element
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove any existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(currentTheme);
    
    // Set CSS custom properties
    const themeColors = currentTheme === 'dark' ? { ...theme.colors, ...theme.dark } : theme.colors;
    
    Object.entries(themeColors).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([shade, color]) => {
          root.style.setProperty(`--${key}-${shade}`, color);
        });
      } else {
        root.style.setProperty(`--${key}`, value);
      }
    });
    
    // Set border radius and box shadow variables
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });
    
    Object.entries(theme.boxShadow).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
    
  }, [currentTheme]);
  
  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
