// Design tokens for AU Direction Sign Studio
export const TOKENS = {
  spacing: [4, 8, 12, 16, 24, 32, 48],
  radius: { 
    sm: 8, 
    md: 12 
  },
  shadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
  },
  typeScale: [12, 14, 16, 20, 24, 32, 40, 56],
  color: {
    primary: '#0B6B4D',
    accent: '#2D6AE3',
    success: '#139A43',
    warning: '#F59E0B',
    danger: '#DC2626',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      600: '#4B5563',
      900: '#111827'
    }
  }
} as const

// Sign-specific tokens
export const SIGN_TOKENS = {
  // Font sizes in Emod (mm at 1:1 scale)
  fontSizes: {
    primary: { min: 180, default: 240, max: 360 },
    secondary: { min: 120, default: 180, max: 240 },
    tertiary: { min: 80, default: 120, max: 180 }
  },
  // Spacing multipliers (relative to font height H)
  spacingMultipliers: {
    lineGap: [0.5, 0.75, 1.0, 1.25],
    interElement: [0.5, 0.75, 1.0, 1.5],
    interGroup: [1.0, 1.5, 2.0, 2.5, 3.0]
  },
  // Board dimensions (mm)
  boardSizes: {
    G1Wide: { width: 3800, height: 1400 },
    G1Narrow: { width: 1800, height: 2400 },
    G2: { width: 2400, height: 1200 },
    G3: { width: 1800, height: 900 }
  }
} as const

export type TokenColorKey = keyof typeof TOKENS.color

