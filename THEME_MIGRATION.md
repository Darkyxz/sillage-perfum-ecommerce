# Theme Migration Guide

This guide will help you migrate your components to use the new theme system.

## Color Migration

### Before (Old Way)

```jsx
// Hardcoded colors
<div className="bg-amber-500 text-white">
  Button
</div>

// Inline styles
<div style={{ backgroundColor: '#F59E0B', color: 'white' }}>
  Button
</div>
```

### After (New Way)

```jsx
// Using theme variables
<div className="bg-primary text-primary-foreground">
  Button
</div>

// Using theme utility functions
import { getColor } from '@/theme/utils';

<div style={{ 
  backgroundColor: getColor('primary'),
  color: getColor('primary-foreground')
}}>
  Button
</div>
```

## Color Palette Reference

### Primary Colors (Gold Theme)

| Class Name | Light Mode | Dark Mode |
|------------|------------|-----------|
| `bg-primary` | #FFC107 | #FFC107 |
| `bg-primary-50` | #FFF9E6 | #FFF9E6 |
| `bg-primary-100` | #FFF0B3 | #FFF0B3 |
| `bg-primary-200` | #FFE680 | #FFE680 |
| `bg-primary-300` | #FFDB4D | #FFDB4D |
| `bg-primary-400` | #FFD11A | #FFD11A |
| `bg-primary-500` | #FFC107 | #FFC107 |
| `bg-primary-600` | #E6A500 | #E6A500 |
| `bg-primary-700` | #B38600 | #B38600 |
| `bg-primary-800` | #806000 | #806000 |
| `bg-primary-900` | #4D3A00 | #4D3A00 |

### Semantic Colors

| Class Name | Light Mode | Dark Mode |
|------------|------------|-----------|
| `bg-background` | #FFFFFF | #121212 |
| `bg-foreground` | #1A1A1A | #E0E0E0 |
| `bg-card` | #FFFFFF | #1E1E1E |
| `bg-popover` | #FFFFFF | #1E1E1E |
| `bg-secondary` | #F5F5F5 | #2D2D2D |
| `bg-muted` | #F5F5F5 | #2D2D2D |
| `bg-accent` | #F5F5F5 | #2D2D2D |
| `bg-destructive` | #EF4444 | #DC2626 |
| `text-foreground` | #1A1A1A | #E0E0E0 |
| `text-muted-foreground` | #737373 | #A3A3A3 |
| `border` | #E5E5E5 | #404040 |
| `ring` | #FFC107 | #FFC107 |

## Updating Components

1. **Replace Hardcoded Colors**
   - Replace `bg-amber-*` with `bg-primary-*`
   - Replace `text-amber-*` with `text-primary-*`
   - Replace `border-amber-*` with `border-primary-*`

2. **Use Semantic Variables**
   - Use `bg-background` for page backgrounds
   - Use `bg-card` for card backgrounds
   - Use `text-foreground` for primary text
   - Use `text-muted-foreground` for secondary text

3. **Dark Mode Support**
   - Use `dark:` variants for dark mode overrides
   - Test components in both light and dark modes

## Example Component Migration

### Before

```jsx
function Button({ children }) {
  return (
    <button className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded">
      {children}
    </button>
  );
}
```

### After

```jsx
function Button({ children }) {
  return (
    <button className="bg-primary hover:bg-primary-600 text-primary-foreground px-4 py-2 rounded">
      {children}
    </button>
  );
}
```

## Best Practices

1. **Use Theme Variables**
   Always use theme variables instead of hardcoded colors.

2. **Semantic Naming**
   Use semantic variable names that describe the purpose, not the color.

3. **Dark Mode**
   Always consider how your component will look in both light and dark modes.

4. **Accessibility**
   Ensure sufficient color contrast for text and interactive elements.

5. **Consistency**
   Use the same color variables for the same purposes throughout the app.

## Testing

After updating components:

1. Test in both light and dark modes
2. Check for proper contrast ratios
3. Verify interactive states (hover, focus, active)
4. Test on different devices and screen sizes

## Troubleshooting

### Colors not updating?
- Make sure the `ThemeProvider` is properly set up
- Check for hardcoded color values in your components
- Verify that the correct theme is being applied

### Dark mode not working?
- Ensure the `dark` class is being applied to the `html` element
- Check for any CSS overrides that might be affecting dark mode styles
- Verify that your dark mode media queries are correctly formatted

### Need to add a new color?
1. Add the color to `src/theme/index.js`
2. Update the type definitions if needed
3. Document the new color in this guide
