// Theme configuration
export const theme = {
  colors: {
    // Primary colors (gold theme)
    primary: {
      50: '#FFFAF0',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B', // Main gold color
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    
    // Neutral colors
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    
    // Success colors
    success: {
      100: '#DCFCE7',
      500: '#22C55E',
      900: '#14532D',
    },
    
    // Warning colors
    warning: {
      100: '#FEF3C7',
      500: '#F59E0B',
      900: '#78350F',
    },
    
    // Error colors
    error: {
      100: '#FEE2E2',
      500: '#EF4444',
      900: '#7F1D1D',
    },
    
    // Background and foreground
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(240 10% 3.9%)',
    
    // Card colors
    card: 'hsl(0 0% 100%)',
    'card-foreground': 'hsl(240 10% 3.9%)',
    
    // Popover colors
    popover: 'hsl(0 0% 100%)',
    'popover-foreground': 'hsl(240 10% 3.9%)',
    
    // Primary colors (semantic)
    primary: 'hsl(43 96% 50%)', // Gold
    'primary-foreground': 'hsl(0 0% 100%)',
    
    // Secondary colors
    secondary: 'hsl(240 4.8% 95.9%)',
    'secondary-foreground': 'hsl(240 5.9% 10%)',
    
    // Muted colors
    muted: 'hsl(240 4.8% 95.9%)',
    'muted-foreground': 'hsl(240 3.8% 46.1%)',
    
    // Accent colors
    accent: 'hsl(240 4.8% 95.9%)',
    'accent-foreground': 'hsl(240 5.9% 10%)',
    
    // Destructive colors
    destructive: 'hsl(0 84.2% 60.2%)',
    'destructive-foreground': 'hsl(0 0% 98%)',
    
    // Border and input
    border: 'hsl(240 5.9% 90%)',
    input: 'hsl(240 5.9% 90%)',
    
    // Ring
    ring: 'hsl(43 96% 50%)', // Gold ring
  },
  
  // Dark mode overrides
  dark: {
    background: 'hsl(20 14.3% 4.1%)',
    foreground: 'hsl(0 0% 95%)',
    
    card: 'hsl(24 9.8% 10%)',
    'card-foreground': 'hsl(0 0% 95%)',
    
    popover: 'hsl(0 0% 9%)',
    'popover-foreground': 'hsl(0 0% 95%)',
    
    primary: 'hsl(43 96% 50%)', // Gold
    'primary-foreground': 'hsl(0 0% 100%)',
    
    secondary: 'hsl(240 3.7% 15.9%)',
    'secondary-foreground': 'hsl(0 0% 98%)',
    
    muted: 'hsl(0 0% 14.9%)',
    'muted-foreground': 'hsl(240 5% 64.9%)',
    
    accent: 'hsl(12 6.5% 15.1%)',
    'accent-foreground': 'hsl(0 0% 98%)',
    
    destructive: 'hsl(0 62.8% 30.6%)',
    'destructive-foreground': 'hsl(0 85.7% 97.3%)',
    
    border: 'hsl(240 3.7% 15.9%)',
    input: 'hsl(240 3.7% 15.9%)',
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
