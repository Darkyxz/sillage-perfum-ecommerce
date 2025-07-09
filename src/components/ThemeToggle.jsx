import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(false); // Iniciamos en modo claro (sin clase dark)

  useEffect(() => {
    // Verificar si hay una preferencia guardada
    const savedTheme = localStorage.getItem('theme');
    const hasInitialDarkClass = document.documentElement.classList.contains('dark');
    
    // Si hay tema guardado como 'dark' o si ya tiene la clase dark, activar modo oscuro
    if (savedTheme === 'dark' || hasInitialDarkClass) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    
    if (newIsDark) {
      // Activar modo oscuro (añadir clase dark)
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      // Activar modo claro (quitar clase dark)
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-yellow-800 hover:text-yellow-900 hover:bg-yellow-400/20 dark:text-yellow-100/80 dark:hover:text-yellow-50 dark:hover:bg-yellow-400/15"
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
};

export default ThemeToggle;
