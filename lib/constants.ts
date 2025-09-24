export const APP_CONFIG = {
  name: "TelcoX",
  description: "Plataforma de Autogestión de Telecomunicaciones",
  version: "1.0.0",
  author: "TelcoX Development Team",
  repository: "https://github.com/telcox/platform",
  support: "support@telcox.com",
} as const

export const API_ENDPOINTS = {
  customer: "/api/customer",
  refresh: "/api/customer",
} as const

export const REFRESH_INTERVALS = {
  auto: 30000, // 30 seconds
  manual: 500, // 500ms delay for manual refresh
} as const

export const ANIMATION_DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  loading: 800,
} as const

export const CONSUMPTION_THRESHOLDS = {
  low: 25,
  medium: 75,
  high: 90,
} as const

export const NOTIFICATION_DURATIONS = {
  success: 3000,
  error: 5000,
  info: 4000,
  warning: 4000,
} as const

export const COLORS = {
  primary: "oklch(0.7 0.15 180)",
  secondary: "oklch(0.269 0 0)",
  accent: "oklch(0.8 0.12 165)",
  destructive: "oklch(0.577 0.245 27.325)",
  success: "oklch(0.7 0.15 180)",
  warning: "oklch(0.828 0.189 84.429)",
} as const

export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const

export const STORAGE_KEYS = {
  theme: "telcox-theme",
  lastUpdate: "telcox-last-update",
  userPreferences: "telcox-preferences",
} as const
