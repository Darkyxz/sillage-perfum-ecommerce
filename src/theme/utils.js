/**
 * Utility functions for working with the theme
 */

/**
 * Get a color value from the theme
 * @param {string} color - The color name (e.g., 'primary', 'secondary')
 * @param {string} [shade] - The shade/variant (e.g., '500', '700')
 * @returns {string} The CSS variable for the color
 */
export function getColor(color, shade) {
  if (shade) {
    return `var(--${color}-${shade})`;
  }
  return `var(--${color})`;
}

/**
 * Get a color value with opacity
 * @param {string} color - The color name (e.g., 'primary', 'secondary')
 * @param {string} [shade] - The shade/variant (e.g., '500', '700')
 * @param {number} [opacity=1] - The opacity value (0 to 1)
 * @returns {string} The CSS color value with opacity
 */
export function getColorWithOpacity(color, shade, opacity = 1) {
  const baseColor = shade ? `var(--${color}-${shade})` : `var(--${color})`;
  return `color-mix(in srgb, ${baseColor} ${opacity * 100}%, transparent)`;
}

/**
 * Get a text color class based on the background color
 * @param {string} bgColor - The background color class
 * @returns {string} The appropriate text color class
 */
export function getTextColorClass(bgColor) {
  if (bgColor.includes('primary')) {
    return 'text-primary-foreground';
  }
  if (bgColor.includes('secondary') || bgColor.includes('muted') || bgColor.includes('accent')) {
    return 'text-foreground';
  }
  if (bgColor.includes('dark') || bgColor.includes('black') || bgColor.includes('900') || bgColor.includes('800')) {
    return 'text-primary-50';
  }
  return 'text-foreground';
}

/**
 * Get a border color class based on the theme
 * @param {string} [color='border'] - The base color name
 * @param {string} [opacity=''] - The opacity value (e.g., '50', '100')
 * @returns {string} The border color class
 */
export function getBorderColorClass(color = 'border', opacity = '') {
  if (opacity) {
    return `border-${color}-${opacity}`;
  }
  return `border-${color}`;
}

/**
 * Get a background color class with hover state
 * @param {string} color - The base color name (e.g., 'primary', 'secondary')
 * @param {string} [shade='500'] - The shade/variant (e.g., '500', '700')
 * @returns {string} The background color classes with hover state
 */
export function getHoverBgClass(color, shade = '500') {
  const hoverShade = Math.min(parseInt(shade) + 100, 900);
  return `bg-${color}-${shade} hover:bg-${color}-${hoverShade}`;
}

/**
 * Get text color classes for different states
 * @param {string} color - The base color name (e.g., 'primary', 'secondary')
 * @returns {string} Text color classes for different states
 */
export function getTextStateClasses(color) {
  return `text-${color} hover:text-${color}-700 dark:text-${color}-300 dark:hover:text-${color}-200`;
}

/**
 * Get a consistent shadow class based on the theme
 * @param {string} [size='md'] - The shadow size ('sm', 'md', 'lg', 'xl', '2xl')
 * @returns {string} The shadow class
 */
export function getShadowClass(size = 'md') {
  return `shadow-${size} dark:shadow-${size}-dark`;
}

/**
 * Get a consistent transition class
 * @param {string} [property='all'] - The CSS property to transition
 * @param {string} [duration='300'] - The transition duration in ms
 * @param {string} [timing='ease-in-out'] - The transition timing function
 * @returns {string} The transition class
 */
export function getTransitionClass(property = 'all', duration = '300', timing = 'ease-in-out') {
  return `transition-${property} duration-${duration} ${timing}`;
}

// Export all utilities
export default {
  getColor,
  getColorWithOpacity,
  getTextColorClass,
  getBorderColorClass,
  getHoverBgClass,
  getTextStateClasses,
  getShadowClass,
  getTransitionClass,
};
