import { ThemeColors } from './types';

declare module '@/theme/utils' {
  /**
   * Get a color value from the theme
   * @param color - The color name (e.g., 'primary', 'secondary')
   * @param shade - The shade/variant (e.g., '500', '700')
   * @returns The CSS variable for the color
   */
  export function getColor<T extends keyof ThemeColors>(
    color: T,
    shade?: string
  ): string;

  /**
   * Get a color value with opacity
   * @param color - The color name (e.g., 'primary', 'secondary')
   * @param shade - The shade/variant (e.g., '500', '700')
   * @param opacity - The opacity value (0 to 1)
   * @returns The CSS color value with opacity
   */
  export function getColorWithOpacity<T extends keyof ThemeColors>(
    color: T,
    shade: string,
    opacity: number
  ): string;
  export function getColorWithOpacity<T extends keyof ThemeColors>(
    color: T,
    opacity: number
  ): string;

  /**
   * Get a text color class based on the background color
   * @param bgColor - The background color class
   * @returns The appropriate text color class
   */
  export function getTextColorClass(bgColor: string): string;

  /**
   * Get a border color class based on the theme
   * @param color - The base color name
   * @param opacity - The opacity value (e.g., '50', '100')
   * @returns The border color class
   */
  export function getBorderColorClass(
    color?: string,
    opacity?: string
  ): string;

  /**
   * Get a background color class with hover state
   * @param color - The base color name (e.g., 'primary', 'secondary')
   * @param shade - The shade/variant (e.g., '500', '700')
   * @returns The background color classes with hover state
   */
  export function getHoverBgClass(
    color: string,
    shade?: string
  ): string;

  /**
   * Get text color classes for different states
   * @param color - The base color name (e.g., 'primary', 'secondary')
   * @returns Text color classes for different states
   */
  export function getTextStateClasses(color: string): string;

  /**
   * Get a consistent shadow class based on the theme
   * @param size - The shadow size ('sm', 'md', 'lg', 'xl', '2xl')
   * @returns The shadow class
   */
  export function getShadowClass(size?: string): string;

  /**
   * Get a consistent transition class
   * @param property - The CSS property to transition
   * @param duration - The transition duration in ms
   * @param timing - The transition timing function
   * @returns The transition class
   */
  export function getTransitionClass(
    property?: string,
    duration?: string | number,
    timing?: string
  ): string;

  const utils: {
    getColor: typeof getColor;
    getColorWithOpacity: typeof getColorWithOpacity;
    getTextColorClass: typeof getTextColorClass;
    getBorderColorClass: typeof getBorderColorClass;
    getHoverBgClass: typeof getHoverBgClass;
    getTextStateClasses: typeof getTextStateClasses;
    getShadowClass: typeof getShadowClass;
    getTransitionClass: typeof getTransitionClass;
  };

  export default utils;
}
