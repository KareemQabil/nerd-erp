# NerdPOS Generic Styling Guide

This guide documents the generic styling system used in the NerdPOS application. It is designed to ensure consistency, maintainability, and ease of refactoring across all screens.

**Source of Truth**: `src/core/theme/nerdpos-styles.ts`

## 1. Core Concepts

The styling system is built around three main exports:

1.  **`NerdPOSLayout`**: Defines structural layout patterns (Page, Header, Stats, Data).
2.  **`NerdPOSStyles`**: Defines component-level styles (Buttons, Cards, Inputs, Badges).
3.  **`NerdPOSColors`**: Defines the color palette and theme variables.

## 2. Layout System (`NerdPOSLayout`)

Use these tokens for high-level structure.

### Page Structure

```tsx
import {
  NerdPOSLayout,
  NerdPOSColors,
} from "../../../core/theme/nerdpos-styles";

<div
  className={NerdPOSLayout.page.container}
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

### Stats Grid

```tsx
<div className={NerdPOSLayout.stats.grid}>
  <div className={NerdPOSStyles.statsCard.base}>{/* Stat Content */}</div>
</div>
```

### Filters & Search

```tsx
<div className={NerdPOSLayout.filters.container}>
  <div className={NerdPOSLayout.filters.searchWrapper}>
    <input className={NerdPOSStyles.input.search} />
  </div>
  <select className={NerdPOSLayout.filters.select}>
    <option>Filter Option</option>
  </select>
</div>
```

### Data Display (Tables & Grids)

**Table:**

```tsx
<div className={NerdPOSLayout.data.tableContainer}>
  <table>
    <thead className={NerdPOSLayout.data.tableHeader}>
      <tr>
        <th className={NerdPOSLayout.data.th}>Header</th>
      </tr>
    </thead>
    <tbody>
      <tr className={NerdPOSLayout.data.tr}>
        <td className={NerdPOSLayout.data.td}>Data</td>
      </tr>
    </tbody>
  </table>
</div>
```

**Grid:**

```tsx
<div className={NerdPOSLayout.data.grid}>{/* Card Items */}</div>
```

## 3. Component Styles (`NerdPOSStyles`)

Use these tokens for individual UI elements.

### Buttons

- **Primary**: `NerdPOSStyles.button.primary` (Cyan background, dark text)
- **Secondary**: `NerdPOSStyles.button.secondary` (Transparent background, border)
- **Ghost**: `NerdPOSStyles.button.ghost` (Transparent, no border)

### Cards

- **Base**: `NerdPOSStyles.card.base` (Glassmorphism effect)
- **Hover**: `NerdPOSStyles.card.hover` (Hover glow)
- **Stats**: `NerdPOSStyles.statsCard.base` (Darker background)

### Inputs

- **Base**: `NerdPOSStyles.input.base`
- **Search**: `NerdPOSStyles.input.search` (Includes padding for icon)

### Badges

- **Success**: `NerdPOSStyles.badge.success`
- **Warning**: `NerdPOSStyles.badge.warning`
- **Error**: `NerdPOSStyles.badge.error`
- **Info**: `NerdPOSStyles.badge.info`

## 4. Color Palette (`NerdPOSColors`)

Access colors directly for inline styles or custom components.

- `NerdPOSColors.background.gradient`: Main page background.
- `NerdPOSColors.brand.primary`: Main Cyan color (#22d3ee).
- `NerdPOSColors.text.primary`: Main text color (#e2e2e6).
- `NerdPOSColors.text.secondary`: Secondary text color (#c2c7ce).

## 5. Refactoring Guide

**Goal**: Replace hardcoded Tailwind classes with generic tokens.

| Component          | **BEFORE** (Hardcoded)                                           | **AFTER** (Generic)                        |
| :----------------- | :--------------------------------------------------------------- | :----------------------------------------- |
| **Page Container** | `className="min-h-screen flex flex-col"`                         | `className={NerdPOSLayout.page.container}` |
| **Page Title**     | `className="text-3xl font-['Almarai'] font-bold text-[#e2e2e6]"` | `className={NerdPOSLayout.header.title}`   |
| **Primary Button** | `className="bg-cyan-400 text-[#00373a] rounded-xl ..."`          | `className={NerdPOSStyles.button.primary}` |
| **Card**           | `className="bg-[rgba(255,255,255,0.05)] border ..."`             | `className={NerdPOSStyles.card.base}`      |
| **Input**          | `className="bg-[rgba(255,255,255,0.05)] border ..."`             | `className={NerdPOSStyles.input.base}`     |

## 6. Helper Functions

- `getFlexJustify(isRTL)`: Returns `flex-end` for RTL, `flex-start` for LTR.
- `getTextAlign(isRTL)`: Returns `right` for RTL, `left` for LTR.
- `getRTLStyle(isRTL, property, side, value)`: Generates dynamic style objects for margins/padding.
