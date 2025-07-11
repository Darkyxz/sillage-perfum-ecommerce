import 'react';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.module.sass' {
  const classes: { [key: string]: string };
  export default classes;
}

// Theme types
declare module '@/theme' {
  export interface ThemeColors {
    primary: string;
    'primary-foreground': string;
    'primary-50': string;
    'primary-100': string;
    'primary-200': string;
    'primary-300': string;
    'primary-400': string;
    'primary-500': string;
    'primary-600': string;
    'primary-700': string;
    'primary-800': string;
    'primary-900': string;
    secondary: string;
    'secondary-foreground': string;
    accent: string;
    'accent-foreground': string;
    destructive: string;
    'destructive-foreground': string;
    background: string;
    foreground: string;
    muted: string;
    'muted-foreground': string;
    card: string;
    'card-foreground': string;
    popover: string;
    'popover-foreground': string;
    border: string;
    input: string;
    ring: string;
  }

  export interface Theme {
    colors: ThemeColors;
    borderRadius: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      full: string;
    };
    boxShadow: {
      sm: string;
      DEFAULT: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      inner: string;
      none: string;
    };
    fontFamily: {
      sans: string[];
      serif: string[];
      mono: string[];
      display: string[];
      body: string[];
    };
    fontSize: {
      xs: [string, { lineHeight: string }];
      sm: [string, { lineHeight: string }];
      base: [string, { lineHeight: string }];
      lg: [string, { lineHeight: string }];
      xl: [string, { lineHeight: string }];
      '2xl': [string, { lineHeight: string }];
      '3xl': [string, { lineHeight: string }];
      '4xl': [string, { lineHeight: string }];
      '5xl': [string, { lineHeight: string }];
      '6xl': [string, { lineHeight: string }];
      '7xl': [string, { lineHeight: string }];
      '8xl': [string, { lineHeight: string }];
      '9xl': [string, { lineHeight: string }];
    };
    fontWeight: {
      thin: string;
      extralight: string;
      light: string;
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
      extrabold: string;
      black: string;
    };
    lineHeight: {
      none: string;
      tight: string;
      snug: string;
      normal: string;
      relaxed: string;
      loose: string;
    };
    letterSpacing: {
      tighter: string;
      tight: string;
      normal: string;
      wide: string;
      wider: string;
      widest: string;
    };
    spacing: {
      px: string;
      0: string;
      0.5: string;
      1: string;
      1.5: string;
      2: string;
      2.5: string;
      3: string;
      3.5: string;
      4: string;
      5: string;
      6: string;
      7: string;
      8: string;
      9: string;
      10: string;
      11: string;
      12: string;
      14: string;
      16: string;
      20: string;
      24: string;
      28: string;
      32: string;
      36: string;
      40: string;
      44: string;
      48: string;
      52: string;
      56: string;
      60: string;
      64: string;
      72: string;
      80: string;
      96: string;
    };
  }
}
