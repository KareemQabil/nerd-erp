/**
 * NerdPOS Design System - Unified Styles
 * Based on POS Screen Design
 */

export const NerdPOSColors = {
  // Background
  background: {
    primary: "var(--background)",
    gradient: "var(--bg-gradient)",
    card: "var(--surface-overlay)",
    cardHover: "var(--surface-overlay)",
    surface: "var(--surface)",
    surfaceAlt: "var(--surface-variant)",
  },

  // Brand
  brand: {
    primary: "var(--primary)",
    primaryDark: "var(--primary-container)",
    success: "var(--success)",
    warning: "var(--warning)",
    error: "var(--error)",
    info: "var(--info)",
    purple: "#8b5cf6", // Keeping as specific accent
  },

  // Text
  text: {
    primary: "var(--on-background)",
    secondary: "var(--on-surface-variant)",
    disabled: "var(--outline)",
    muted: "var(--outline-variant)",
  },

  // Borders
  border: {
    default: "var(--border-subtle)",
    hover: "var(--primary)",
    focus: "var(--primary)",
    subtle: "var(--border-subtle)",
  },

  // Special
  badge: {
    gold: "#FFD700",
    silver: "#C0C0C0",
    bronze: "#CD7F32",
    platinum: "#E5E4E2",
  },
};

export const NerdPOSRadius = {
  xs: "6px",
  sm: "8px",
  md: "10px",
  lg: "12px",
  xl: "16px",
  xxl: "20px",
};

export const NerdPOSSpacing = {
  xs: "8px",
  sm: "12px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  xxl: "48px",
};

export const NerdPOSTypography = {
  fontFamily: {
    arabic: "'Almarai', sans-serif",
    numbers: "'Inter', sans-serif",
    english: "'Inter', sans-serif",
  },
  fontSize: {
    xs: "10px",
    sm: "12px",
    base: "14px",
    lg: "16px",
    xl: "18px",
    xxl: "20px",
    "3xl": "24px",
    "4xl": "28px",
    "5xl": "32px",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

// Preset Styles for Common Components
export const NerdPOSStyles = {
  // Card styles (like POS product cards and customer cards)
  card: {
    base: `bg-surface-overlay backdrop-blur-sm border border-border-subtle rounded-xl`,
    hover: `hover:border-primary/50 hover:shadow-lg transition-all`,
    active: `border-primary bg-primary/10`,
  },

  // Stats card (like dashboard cards)
  statsCard: {
    base: `bg-surface-variant border border-border-subtle rounded-xl p-6`,
    gradient: `bg-linear-to-br from-surface-variant to-surface border border-border-subtle rounded-xl p-6`,
  },

  // Button styles
  button: {
    primary: `bg-primary text-on-primary rounded-xl font-['Almarai'] font-bold transition-all hover:bg-primary/90 active:scale-95`,
    secondary: `bg-surface-overlay border border-border-subtle text-on-background rounded-xl font-['Almarai'] hover:border-primary/50 transition-all`,
    ghost: `bg-transparent text-text-secondary rounded-xl font-['Almarai'] hover:bg-surface-overlay transition-all`,
  },

  // Input styles
  input: {
    base: `bg-surface-overlay border border-border-subtle rounded-xl text-on-background placeholder:text-text-muted font-['Almarai'] focus:outline-none focus:border-primary/50 transition-all`,
    search: `w-full h-12 px-4 pr-12 bg-surface-overlay border border-border-subtle rounded-xl text-base text-on-background placeholder:text-text-muted font-['Almarai'] focus:outline-none focus:border-primary/50 transition-all`,
  },

  // Badge styles
  badge: {
    success: `bg-success/20 border border-success/30 text-success rounded-lg px-3 py-1 text-sm font-['Almarai']`,
    warning: `bg-warning/20 border border-warning/30 text-warning rounded-lg px-3 py-1 text-sm font-['Almarai']`,
    error: `bg-error/20 border border-error/30 text-error rounded-lg px-3 py-1 text-sm font-['Almarai']`,
    info: `bg-info/20 border border-info/30 text-info rounded-lg px-3 py-1 text-sm font-['Almarai']`,
    gold: `bg-[#FFD700]/20 border border-[#FFD700]/30 text-[#FFD700] rounded-lg px-3 py-1 text-sm font-['Almarai']`,
  },

  // Avatar styles
  avatar: {
    base: `rounded-full flex items-center justify-center font-['Almarai'] font-bold`,
    sizes: {
      sm: "w-8 h-8 text-sm",
      md: "w-12 h-12 text-lg",
      lg: "w-16 h-16 text-xl",
      xl: "w-20 h-20 text-2xl",
    },
  },
};

// Helper function to get background gradient
export const getBackgroundGradient = () => NerdPOSColors.background.gradient;

// Helper function to get card style
export const getCardStyle = (
  variant: "default" | "stats" | "gradient" = "default"
) => {
  switch (variant) {
    case "stats":
      return NerdPOSStyles.statsCard.base;
    case "gradient":
      return NerdPOSStyles.statsCard.gradient;
    default:
      return NerdPOSStyles.card.base;
  }
};

// Helper function for RTL-aware spacing
export const getRTLStyle = (
  isRTL: boolean,
  property: "margin" | "padding",
  side: "left" | "right",
  value: string
) => {
  const actualSide = isRTL ? (side === "left" ? "right" : "left") : side;
  return {
    [`${property}${actualSide.charAt(0).toUpperCase()}${actualSide.slice(1)}`]:
      value,
  };
};

// Helper for text alignment
export const getTextAlign = (isRTL: boolean): "left" | "right" =>
  isRTL ? "right" : "left";

// Helper for flex justify
export const getFlexJustify = (isRTL: boolean): "flex-start" | "flex-end" =>
  isRTL ? "flex-end" : "flex-start";

export const NerdPOSLayout = {
  page: {
    container: `min-h-screen flex flex-col transition-colors duration-300 bg-background text-on-background`,
    content: `flex-1 flex flex-col`,
    main: `flex-1 px-6 py-4 overflow-auto`,
  },
  header: {
    container: `border-b border-border-subtle px-6 py-6 transition-all`,
    wrapper: `flex items-center justify-between mb-6`,
    title: `text-3xl font-['Almarai'] font-bold text-on-background mb-1`,
    subtitle: `text-sm font-['Almarai'] text-text-secondary`,
    actions: `flex gap-3`,
  },
  stats: {
    grid: `grid grid-cols-2 md:grid-cols-4  gap-3 mb-6`,
    card: `p-4 rounded-xl border transition-all duration-200 hover:scale-105`,
  },
  filters: {
    container: `flex gap-3 items-center mb-6`,
    searchWrapper: `flex-1 relative`,
    select: `px-4 py-3 bg-surface-overlay border border-border-subtle rounded-xl text-on-background font-['Almarai'] focus:outline-none focus:border-primary/50 transition-colors cursor-pointer`,
  },
  data: {
    grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`,
    tableContainer: `bg-surface-overlay rounded-2xl border border-border-subtle overflow-hidden`,
    tableHeader: `bg-surface-overlay`,
    th: `px-4 py-3 text-sm font-['Almarai'] font-bold text-on-background`,
    tr: `border-t border-border-subtle hover:bg-surface-overlay transition-colors`,
    td: `px-4 py-4`,
    emptyState: `flex items-center justify-center h-full min-h-[400px]`,
  },
};
