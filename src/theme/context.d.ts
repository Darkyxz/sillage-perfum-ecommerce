import { Theme } from './types';

declare module '@/theme/ThemeProvider' {
  export interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
    resolvedTheme: 'light' | 'dark' | undefined;
    systemTheme: 'light' | 'dark' | 'no-preference';
  }

  export function useTheme(): ThemeContextType;
  
  export interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: 'light' | 'dark' | 'system';
    enableSystem?: boolean;
    enableColorScheme?: boolean;
    disableTransitionOnChange?: boolean;
    storageKey?: string;
    attribute?: string | false;
    value?: {
      light?: string;
      dark?: string;
    };
    nonce?: string;
  }

  export function ThemeProvider({
    children,
    defaultTheme = 'system',
    enableSystem = true,
    enableColorScheme = true,
    disableTransitionOnChange = false,
    storageKey = 'theme',
    attribute = 'class',
    value,
    nonce,
  }: ThemeProviderProps): JSX.Element;
}

// Extend the Window interface to include theme-related methods
declare global {
  interface Window {
    __theme: 'light' | 'dark';
    __setPreferredTheme: (theme: 'light' | 'dark') => void;
    __onThemeChange: (theme: 'light' | 'dark') => void;
    __themeListeners: Array<(theme: 'light' | 'dark') => void>;
  }
}
