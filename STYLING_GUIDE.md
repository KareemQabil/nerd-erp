# NerdPOS Generic Styling Guide

This guide documents the generic styling system used in the NerdPOS application. It is designed to ensure consistency, maintainability, and ease of refactoring across all screens, supporting multiple themes (Light, Dark, Luxury).

**Source of Truth**:

1. `src/index.css` (Theme Variables & Tailwind Configuration)
2. `src/core/theme/nerdpos-styles.ts` (Shared Component Styles)

## 1. Core Concepts

The styling system is built around a **Semantic Theming** approach:

1.  **CSS Variables**: Defined in `src/index.css`, these control the actual colors for each theme.
2.  **Tailwind Configuration**: The `@theme` block in `src/index.css` maps these variables to Tailwind utilities (e.g., `bg-primary` maps to `var(--primary)`).
3.  **`NerdPOSStyles`**: A TypeScript object in `nerdpos-styles.ts` that provides pre-configured Tailwind class strings for common components, ensuring they use the semantic classes.

## 2. Color System

We use semantic names for colors rather than describing their appearance.

### Brand Colors

- `primary`: Main brand color (Cyan in Dark, Teal in Light, Gold in Luxury).
- `secondary`: Secondary brand color.
- `tertiary`: Accent color.

### UI Colors

- `background`: The main page background.
- `surface`: Card and panel backgrounds.
- `surface-variant`: Alternative surface color.
- `surface-overlay`: Semi-transparent overlay for glassmorphism effects.
- `outline`: Border colors.

### Text Colors

- `text-primary`: High-emphasis text (`--on-background`).
- `text-secondary`: Medium-emphasis text (`--on-surface-variant`).
- `text-muted`: Low-emphasis text (`--outline`).

### Status Colors

- `success`: Green/Success state.
- `warning`: Orange/Warning state.
- `error`: Red/Error state.
- `info`: Blue/Info state.

## 3. Layout System (`NerdPOSLayout`)

Use these tokens for high-level structure.

### Page Structure

```tsx
import {
  NerdPOSLayout,
  NerdPOSColors,
} from "../../../core/theme/nerdpos-styles";

<div
  className={NerdPOSLayout.page.container}
  // Background is handled by the class now, but inline style can still use the variable if needed
  style={{ background: NerdPOSColors.background.gradient }}
>
  <MainNavigation />
  <div className={NerdPOSLayout.page.content}>{/* Content goes here */}</div>
</div>;
```

### Headers

```tsx
<div className={NerdPOSLayout.header.wrapper}>
  <div>
    <h1 className={NerdPOSLayout.header.title}>Page Title</h1>
    <p className={NerdPOSLayout.header.subtitle}>Page Subtitle</p>
  </div>
  <div className={NerdPOSLayout.header.actions}>{/* Action Buttons */}</div>
</div>
```

## 4. Component Styles (`NerdPOSStyles`)

Use these tokens for individual UI elements. They automatically adapt to the active theme.

### Buttons

- **Primary**: `NerdPOSStyles.button.primary`
  - _Uses_: `bg-primary`, `text-on-primary`
- **Secondary**: `NerdPOSStyles.button.secondary`
  - _Uses_: `bg-surface-overlay`, `border-border-subtle`, `text-text-primary`
- **Ghost**: `NerdPOSStyles.button.ghost`
  - _Uses_: `text-text-secondary`, `hover:bg-surface-overlay`

### Cards

- **Base**: `NerdPOSStyles.card.base`
  - _Uses_: `bg-surface-overlay`, `border-border-subtle`
- **Stats**: `NerdPOSStyles.statsCard.base`
  - _Uses_: `bg-surface-variant`

### Inputs

- **Base**: `NerdPOSStyles.input.base`
  - _Uses_: `bg-surface-overlay`, `text-text-primary`, `placeholder:text-text-muted`

### Badges

- **Success**: `NerdPOSStyles.badge.success`
  - _Uses_: `bg-success/20`, `text-success`
- **Warning**: `NerdPOSStyles.badge.warning`
- **Error**: `NerdPOSStyles.badge.error`

## 5. Refactoring Guide

**Goal**: Replace hardcoded hex values and specific color names with semantic tokens.

| Component          | **BEFORE** (Hardcoded)           | **AFTER** (Generic)    |
| :----------------- | :------------------------------- | :--------------------- |
| **Text Color**     | `text-[#e2e2e6]`                 | `text-text-primary`    |
| **Secondary Text** | `text-[#c2c7ce]`                 | `text-text-secondary`  |
| **Brand Text**     | `text-cyan-400`                  | `text-primary`         |
| **Background**     | `bg-[#023047]`                   | `bg-background`        |
| **Card Bg**        | `bg-[rgba(255,255,255,0.05)]`    | `bg-surface-overlay`   |
| **Border**         | `border-[rgba(255,255,255,0.1)]` | `border-border-subtle` |
| **Success Text**   | `text-green-400`                 | `text-success`         |

## 6. Adding New Themes

To add a new theme:

1.  Open `src/index.css`.
2.  Add a new block for the theme:
    ```css
    [data-theme="new-theme"] {
      --primary: ...;
      --on-primary: ...;
      /* ... define all required variables */
    }
    ```
3.  The application will automatically pick up the new colors without changing any TypeScript code.
