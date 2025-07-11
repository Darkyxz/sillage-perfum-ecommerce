# Sillage Perfum Theming System

This directory contains the theming system for the Sillage Perfum e-commerce application. The theming system is built on top of Tailwind CSS and provides a consistent way to manage colors, typography, and other design tokens.

## File Structure

```
src/theme/
├── index.js          # Theme configuration and color definitions
├── ThemeProvider.jsx # React context provider for theme management
├── utils.js         # Utility functions for working with the theme
└── README.md        # This file
```

## Color System

The color system is based on a set of semantic color variables that adapt to light and dark modes. The primary color palette is based on gold tones, with additional semantic colors for UI elements.

### Primary Colors (Gold Theme)

| Shade | Light Mode | Dark Mode |
|-------|------------|-----------|
| 50    | #FFF9E6   | #FFF9E6   |
| 100   | #FFF0B3   | #FFF0B3   |
| 200   | #FFE680   | #FFE680   |
| 300   | #FFDB4D   | #FFDB4D   |
| 400   | #FFD11A   | #FFD11A   |
| 500   | #FFC107   | #FFC107   | (Main Gold)
| 600   | #E6A500   | #E6A500   |
| 700   | #B38600   | #B38600   |
| 800   | #806000   | #806000   |
| 900   | #4D3A00   | #4D3A00   |

### Semantic Colors

- `primary`: Main brand color (gold)
- `secondary`: Secondary brand color
- `accent`: Accent color for interactive elements
- `destructive`: For error states and destructive actions
- `background`: Page background
- `foreground`: Primary text color
- `muted`: Muted text color
- `border`: Border color
- `input`: Input field background
- `ring`: Focus ring color

## Usage

### Using ThemeProvider

Wrap your application with the `ThemeProvider` component:

```jsx
import { ThemeProvider } from './theme/ThemeProvider';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      {/* Your app */}
    </ThemeProvider>
  );
}
```

### Using Theme Hooks

Use the `useTheme` hook to access the current theme and toggle between themes:

```jsx
import { useTheme } from '../theme/ThemeProvider';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
}
```

### Using Theme Variables

Use the theme variables in your components:

```jsx
// Using Tailwind classes
function Button({ children }) {
  return (
    <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded">
      {children}
    </button>
  );
}

// Using CSS variables
const styles = {
  button: {
    backgroundColor: 'var(--primary-500)',
    color: 'var(--primary-foreground)',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    '&:hover': {
      backgroundColor: 'var(--primary-600)',
    },
  },
};
```

### Using Theme Utilities

Import and use the theme utilities for more complex theming:

```jsx
import { getColor, getHoverBgClass } from '../theme/utils';

function ThemedComponent() {
  return (
    <div 
      style={{
        backgroundColor: getColor('primary', '500'),
        color: getColor('primary-foreground'),
      }}
      className={getHoverBgClass('primary', '500')}
    >
      Hover me
    </div>
  );
}
```

## Best Practices

1. **Use Semantic Colors**: Always use semantic color variables (e.g., `primary`, `secondary`) instead of hardcoded colors.
2. **Respect User Preferences**: Respect the user's system color scheme preference and provide a way to toggle between themes.
3. **Test Contrast**: Ensure text has sufficient contrast with its background for accessibility.
4. **Use Theme Utilities**: Use the provided utility functions for consistent theming across components.
5. **Keep It Simple**: Don't overcomplicate the theming system. Add new colors and tokens only when necessary.

## Adding New Colors

To add a new color to the theme:

1. Add the color to the `colors` object in `theme/index.js`
2. Add dark mode overrides if needed
3. Document the new color in this README
4. Use the new color in your components using the theme variables

## License

MIT
