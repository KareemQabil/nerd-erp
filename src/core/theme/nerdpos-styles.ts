/**
 * NerdPOS Design System - Unified Styles
 * Based on POS Screen Design
 */

export const NerdPOSColors = {
  // Background
  background: {
    primary: '#023047',
    gradient: 'linear-gradient(180deg, #023047 0%, #012030 50%, #001219 100%)',
    card: 'rgba(255,255,255,0.05)',
    cardHover: 'rgba(255,255,255,0.08)',
    surface: '#1a1c1e',
    surfaceAlt: '#2a2d32',
  },
  
  // Brand
  brand: {
    primary: '#22d3ee', // Cyan
    primaryDark: '#0891b2',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#22d3ee',
    purple: '#8b5cf6',
  },
  
  // Text
  text: {
    primary: '#e2e2e6',
    secondary: '#c2c7ce',
    disabled: '#7a7f85',
    muted: '#9ca3af',
  },
  
  // Borders
  border: {
    default: 'rgba(255,255,255,0.1)',
    hover: 'rgba(34,211,238,0.5)',
    focus: '#22d3ee',
    subtle: 'rgba(255,255,255,0.05)',
  },
  
  // Special
  badge: {
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
    platinum: '#E5E4E2',
  },
};

export const NerdPOSRadius = {
  xs: '6px',
  sm: '8px',
  md: '10px',
  lg: '12px',
  xl: '16px',
  xxl: '20px',
};

export const NerdPOSSpacing = {
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
};

export const NerdPOSTypography = {
  fontFamily: {
    arabic: "'Almarai', sans-serif",
    numbers: "'Inter', sans-serif",
    english: "'Inter', sans-serif",
  },
  fontSize: {
    xs: '10px',
    sm: '12px',
    base: '14px',
    lg: '16px',
    xl: '18px',
    xxl: '20px',
    '3xl': '24px',
    '4xl': '28px',
    '5xl': '32px',
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
    base: `bg-[rgba(255,255,255,0.05)] backdrop-blur-sm border border-[rgba(255,255,255,0.1)] rounded-xl`,
    hover: `hover:border-cyan-400/50 hover:shadow-lg transition-all`,
    active: `border-cyan-400 bg-[rgba(34,211,238,0.1)]`,
  },
  
  // Stats card (like dashboard cards)
  statsCard: {
    base: `bg-[#2a2d32] border border-[rgba(255,255,255,0.1)] rounded-xl p-6`,
    gradient: `bg-gradient-to-br from-[#2a2d32] to-[#1a1c1e] border border-[rgba(255,255,255,0.1)] rounded-xl p-6`,
  },
  
  // Button styles
  button: {
    primary: `bg-cyan-400 text-[#00373a] rounded-xl font-['Almarai'] font-bold transition-all hover:bg-cyan-300 active:scale-95`,
    secondary: `bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[#e2e2e6] rounded-xl font-['Almarai'] hover:border-cyan-400/50 transition-all`,
    ghost: `bg-transparent text-[#c2c7ce] rounded-xl font-['Almarai'] hover:bg-[rgba(255,255,255,0.05)] transition-all`,
  },
  
  // Input styles
  input: {
    base: `bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-[#e2e2e6] placeholder:text-[#c2c7ce] font-['Almarai'] focus:outline-none focus:border-cyan-400/50 transition-all`,
    search: `w-full h-12 px-4 pr-12 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] rounded-xl text-base text-[#e2e2e6] placeholder:text-[#c2c7ce] font-['Almarai'] focus:outline-none focus:border-cyan-400/50 transition-all`,
  },
  
  // Badge styles
  badge: {
    success: `bg-green-500/20 border border-green-500/30 text-green-400 rounded-lg px-3 py-1 text-sm font-['Almarai']`,
    warning: `bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-lg px-3 py-1 text-sm font-['Almarai']`,
    error: `bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg px-3 py-1 text-sm font-['Almarai']`,
    info: `bg-cyan-400/20 border border-cyan-400/30 text-cyan-400 rounded-lg px-3 py-1 text-sm font-['Almarai']`,
    gold: `bg-[#FFD700]/20 border border-[#FFD700]/30 text-[#FFD700] rounded-lg px-3 py-1 text-sm font-['Almarai']`,
  },
  
  // Avatar styles
  avatar: {
    base: `rounded-full flex items-center justify-center font-['Almarai'] font-bold`,
    sizes: {
      sm: 'w-8 h-8 text-sm',
      md: 'w-12 h-12 text-lg',
      lg: 'w-16 h-16 text-xl',
      xl: 'w-20 h-20 text-2xl',
    },
  },
};

// Helper function to get background gradient
export const getBackgroundGradient = () => NerdPOSColors.background.gradient;

// Helper function to get card style
export const getCardStyle = (variant: 'default' | 'stats' | 'gradient' = 'default') => {
  switch (variant) {
    case 'stats':
      return NerdPOSStyles.statsCard.base;
    case 'gradient':
      return NerdPOSStyles.statsCard.gradient;
    default:
      return NerdPOSStyles.card.base;
  }
};

// Helper function for RTL-aware spacing
export const getRTLStyle = (isRTL: boolean, property: 'margin' | 'padding', side: 'left' | 'right', value: string) => {
  const actualSide = isRTL ? (side === 'left' ? 'right' : 'left') : side;
  return { [`${property}${actualSide.charAt(0).toUpperCase()}${actualSide.slice(1)}`]: value };
};

// Helper for text alignment
export const getTextAlign = (isRTL: boolean): 'left' | 'right' => isRTL ? 'right' : 'left';

// Helper for flex justify
export const getFlexJustify = (isRTL: boolean): 'flex-start' | 'flex-end' => isRTL ? 'flex-end' : 'flex-start';
