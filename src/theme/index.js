// Theme configuration centralizada para Sillage Perfume
export const theme = {
  colors: {
    // Colores principales de Sillage (dorado/oro)
    'sillage-gold': {
      50: '#FFFAF0',
      100: '#FEF3C7', 
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#DAA520', // Goldenrod principal
      600: '#c4965a', // Dorado oscuro usado en build
      700: '#b8864f', // Dorado profundo
      800: '#92400E',
      900: '#78350F',
      'warm': '#daaf60', // Dorado cálido
      'bright': '#f0c674', // Dorado brillante usado en build
      'warm-bright': '#e6b960',
    },
    
    // Colores neutros oscuros para el tema
    'sillage-dark': {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626', // Usado para fondos oscuros
      900: '#171717', // Slate-900 equivalente
      'lighter': '#3C2415',
      'light': '#2D1810',
      'DEFAULT': '#1F0F0A',
    },
    
    // Colores crema para fondos suaves
    'sillage-cream': {
      50: '#FCFCFC',
      100: '#FAFAFA',
      200: '#F7F7F7',
      300: '#F0F0F0',
      400: '#E8E8E8',
      500: '#E0E0E0',
      'DEFAULT': 'rgba(252, 248, 237, 0.95)',
      'warm': 'rgba(254, 252, 237, 0.95)',
      'light': 'rgba(253, 250, 243, 0.9)',
      'subtle': 'rgba(245, 241, 232, 0.9)',
    },
    
    // Colores de gradientes para botones y elementos especiales
    'sillage-gradient': {
      'purple-pink': 'linear-gradient(to right,rgb(247, 196, 85),rgb(201, 171, 40))',
      'purple-to-pink': 'linear-gradient(to right,rgb(246, 218, 92),rgb(236, 192, 72))',
      'gold-warm': 'linear-gradient(to right, #DAA520, #c4965a)',
      'gold-bright': 'linear-gradient(to right, #f0c674, #DAA520)',
    },
    
    // Status colors
    success: {
      100: '#DCFCE7',
      500: '#22C55E',
      900: '#14532D',
    },
    
    warning: {
      100: '#FEF3C7',
      500: '#F59E0B',
      900: '#78350F',
    },
    
    error: {
      100: '#FEE2E2',
      500: '#EF4444',
      900: '#7F1D1D',
    },
    
    // Semantic colors (modo claro)
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(240 10% 3.9%)',
    
    card: 'hsl(0 0% 100%)',
    'card-foreground': 'hsl(240 10% 3.9%)',
    
    popover: 'hsl(0 0% 100%)',
    'popover-foreground': 'hsl(240 10% 3.9%)',
    
    // Primary usa sillage-gold
    primary: 'hsl(43 96% 50%)', // Gold
    'primary-foreground': 'hsl(0 0% 100%)',
    
    secondary: 'hsl(240 4.8% 95.9%)',
    'secondary-foreground': 'hsl(240 5.9% 10%)',
    
    muted: 'hsl(240 4.8% 95.9%)',
    'muted-foreground': 'hsl(240 3.8% 46.1%)',
    
    accent: 'hsl(240 4.8% 95.9%)',
    'accent-foreground': 'hsl(240 5.9% 10%)',
    
    destructive: 'hsl(0 84.2% 60.2%)',
    'destructive-foreground': 'hsl(0 0% 98%)',
    
    border: 'hsl(240 5.9% 90%)',
    input: 'hsl(240 5.9% 90%)',
    ring: 'hsl(43 96% 50%)', // Gold ring
  },
  
  // Dark mode overrides
  dark: {
    background: 'hsl(222 84% 4.9%)', // Slate-900 equivalente
    foreground: 'hsl(210 40% 98%)',
    
    card: 'hsl(222 84% 4.9%)',
    'card-foreground': 'hsl(210 40% 98%)',
    
    popover: 'hsl(222 84% 4.9%)',
    'popover-foreground': 'hsl(210 40% 98%)',
    
    primary: 'hsl(43 96% 50%)', // Gold se mantiene
    'primary-foreground': 'hsl(0 0% 100%)',
    
    secondary: 'hsl(217 32% 17%)',
    'secondary-foreground': 'hsl(210 40% 98%)',
    
    muted: 'hsl(217 32% 17%)',
    'muted-foreground': 'hsl(215 20% 65%)',
    
    accent: 'hsl(217 32% 17%)',
    'accent-foreground': 'hsl(210 40% 98%)',
    
    destructive: 'hsl(0 62.8% 30.6%)',
    'destructive-foreground': 'hsl(0 85.7% 97.3%)',
    
    border: 'hsl(217 32% 17%)',
    input: 'hsl(217 32% 17%)',
    ring: 'hsl(43 96% 50%)', // Gold ring
  },
  
  // Border radius
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
  },
  
  // Box shadow
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },
};

export default theme;
