// Type definitions for Tailwind CSS
declare module 'tailwindcss' {
  import { Config } from 'tailwindcss';
  const config: Config;
  export default config;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Add type definitions for CSS modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Add type definitions for CSS files
declare module '*.css' {
  const content: string;
  export default content;
}

// Add type definitions for @tailwind directives
declare module 'tailwindcss/plugin' {
  import { PluginCreator } from 'tailwindcss/types/config';
  const plugin: PluginCreator;
  export = plugin;
}

declare module 'tailwindcss/colors' {
  export const colors: {
    [key: string]: string | { [key: string]: string };
  };
  export default colors;
}

// Add type definitions for @apply directive
declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

// Add type definitions for @tailwind directives
declare module 'tailwindcss/tailwind' {
  const content: any;
  export default content;
}

// Add type definitions for @tailwind directives in CSS files
declare module 'postcss' {
  interface ProcessOptions {
    from?: string;
    to?: string;
    map?: boolean | { inline?: boolean; annotation?: boolean | string; };
  }

  interface Plugin {
    postcssPlugin: string;
    prepare?: (result: any) => any;
    Once?: (root: any, postcss: any) => void;
    Root?: (root: any, postcss: any) => void;
    Declaration?: (decl: any, postcss: any) => void;
    Rule?: (rule: any) => void;
    AtRule?: (atRule: any) => void;
    Comment?: (comment: any) => void;
  }

  interface Transformer {
    postcssPlugin: string;
    prepare?: (result: any) => any;
    Once?: (root: any, postcss: any) => void;
    Root?: (root: any, postcss: any) => void;
    Declaration?: (decl: any, postcss: any) => void;
    Rule?: (rule: any) => void;
    AtRule?: (atRule: any) => void;
    Comment?: (comment: any) => void;
  }

  function postcss(plugins?: Array<Plugin | Transformer | any>): any;
  function postcss(...plugins: Array<Plugin | Transformer | any>): any;
  namespace postcss {
    function parse(css: string, opts?: any): any;
    function plugin(name: string, initializer: (options?: any) => Plugin): any;
    function root(opts?: any): any;
    function rule(opts?: any): any;
    function atRule(opts?: any): any;
    function decl(opts?: any): any;
    function comment(opts?: any): any;
    function vendor: {
      prefix: (prop: string) => string;
      unprefixed: (prop: string) => string;
    };
    const list: {
      space: (str: string) => string[];
      comma: (str: string) => string[];
    };
  }
  export = postcss;
}
