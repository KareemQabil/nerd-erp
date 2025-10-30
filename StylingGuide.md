# Styling Guide for Multi-Theme React Project

This guide provides best practices and conventions for styling components within this React application, specifically focusing on seamless integration with both dark and light themes. Adhering to these guidelines will ensure a consistent and maintainable visual experience across the application.

## 1. Core Principles

-   **Theme Agnostic by Default:** Strive to write styles that are theme-agnostic as much as possible. Leverage Tailwind CSS's theming capabilities rather than hardcoding colors or values.
-   **Utility-First with Tailwind CSS:** Utilize Tailwind CSS utility classes for the majority of your styling. This promotes consistency, reduces custom CSS, and simplifies responsive design.
-   **Semantic Naming (when custom CSS is necessary):** If custom CSS is unavoidable, use semantic class names that describe the purpose of the element rather than its appearance.
-   **Prioritize Readability and Maintainability:** Styles should be easy to understand, modify, and debug.

## 2. Tailwind CSS Best Practices for Theming

Tailwind CSS is configured to support dark mode out-of-the-box using the `class` strategy. This means the `dark` class is applied to the `html` element when the dark theme is active.

-   **Use `dark:` Variant:** For styles that should change in dark mode, prefix your Tailwind classes with `dark:`.

    ```html
    <!-- Light mode: text-gray-800, Dark mode: text-gray-200 -->
    <p class="text-gray-800 dark:text-gray-200">Hello World</p>

    <!-- Light mode: bg-white, Dark mode: bg-gray-800 -->
    <div class="bg-white dark:bg-gray-800 p-4">Card Content</div>
    ```

-   **Default to Light Mode:** Design your components primarily for light mode, then apply `dark:` variants for adjustments. This often leads to cleaner code.

-   **Leverage CSS Variables (if extending Tailwind):** For more complex theming scenarios or when defining custom color palettes, extend Tailwind's configuration to use CSS variables. This allows for dynamic theme changes without recompiling CSS.

    *Example (in `tailwind.config.js` - conceptual):*
    ```javascript
    // This project might already have a similar setup or can be extended.
    module.exports = {
      theme: {
        extend: {
          colors: {
            primary: 'rgb(var(--color-primary) / <alpha-value>)',
            secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
            // ... other theme-aware colors
          },
        },
      },
    };
    ```
    Then, define these CSS variables in your global CSS (`src/styles/global.css`):
    ```css
    /* src/styles/global.css */
    :root {
      --color-primary: 59 130 246; /* blue-500 */
      --color-secondary: 107 114 128; /* gray-500 */
    }

    .dark {
      --color-primary: 147 197 253; /* blue-300 */
      --color-secondary: 156 163 175; /* gray-400 */
    }
    ```

## 3. Customizing Themes

-   **`tailwind.config.js`:** All theme-related customizations (colors, fonts, spacing, etc.) should be defined or extended in `tailwind.config.js`. Avoid hardcoding values directly in components.
-   **Global CSS Variables:** For dynamic values that need to change based on the theme, define CSS variables in `src/styles/global.css` and use them within your Tailwind configuration or directly in custom CSS.

## 4. Theme Switching Mechanism

-   **`ThemeProvider` (`src/contexts/ThemeProvider.tsx`):** This context manages the current theme state (light/dark) and applies the `dark` class to the `html` element as needed.
-   **`useTheme` Hook:** Components should use the `useTheme` hook (provided by `ThemeProvider`) to access the current theme and the function to toggle it.

    ```typescript
    import { useTheme } from '@/contexts/ThemeProvider';

    function ThemeToggle() {
      const { theme, toggleTheme } = useTheme();

      return (
        <button onClick={toggleTheme}>
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      );
    }
    ```

## 5. Component-Specific Styling

-   **UI Components (`src/components/ui/`):** These foundational components (e.g., Button, Card, Dialog) should be highly reusable and theme-aware. They should primarily use Tailwind classes and, if necessary, CSS variables defined in `global.css`.
-   **Feature-Specific Components (`src/features/[feature-name]/components/`):** These components can use Tailwind classes directly. If they require unique styles not covered by Tailwind, create a small, scoped CSS module or use inline styles sparingly for dynamic values.
-   **Avoid Inline Styles for Theming:** Do not use inline styles for theme-dependent properties (e.g., `style={{ color: theme === 'dark' ? 'white' : 'black' }}`) as this bypasses Tailwind's benefits and makes maintenance difficult. Instead, use `dark:` variants or CSS variables.

## 6. Handling Third-Party Components

-   **Check for Theming Support:** Many UI libraries offer their own theming solutions. Prioritize using their built-in dark mode or theming capabilities if available.
-   **Override with Tailwind:** If a third-party component doesn't support theming, you might need to override its styles using Tailwind's `@apply` directive within your `global.css` or by targeting its classes with custom CSS, ensuring you apply `dark:` variants where necessary.
-   **CSS Variables:** For more control, you can sometimes inject CSS variables into the scope of third-party components to control their colors.

## 7. Accessibility Considerations

-   **Color Contrast:** Always ensure sufficient color contrast between text and background in both light and dark themes to meet WCAG guidelines. Tools like Lighthouse can help identify contrast issues.
-   **Focus States:** Ensure interactive elements have clear focus states for keyboard navigation.

By following this guide, developers can contribute to a visually cohesive and theme-adaptable React application, providing a great user experience regardless of their preferred theme setting.
