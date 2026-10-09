import { Coupon, CouponThemeId, CouponThemeConfig } from '../types/coupon';

export const COUPON_THEMES_CONFIG: Record<CouponThemeId, CouponThemeConfig> = {
  play_all_night: {
    id: 'play_all_night',
    accentColor: '#6366F1', // Indigo / Electric Blue
    badgeBg: 'bg-indigo-500/15',
    badgeText: 'text-indigo-400',
    borderAccent: 'border-indigo-500/40',
    gradientOverlay: 'from-indigo-950/40 via-transparent to-transparent',
  },
  favorite_snacks: {
    id: 'favorite_snacks',
    accentColor: '#F97316', // Orange
    badgeBg: 'bg-orange-500/15',
    badgeText: 'text-orange-400',
    borderAccent: 'border-orange-500/40',
    gradientOverlay: 'from-orange-950/40 via-transparent to-transparent',
  },
  choose_movie: {
    id: 'choose_movie',
    accentColor: '#DC2626', // Deep Red
    badgeBg: 'bg-red-500/15',
    badgeText: 'text-red-400',
    borderAccent: 'border-red-500/40',
    gradientOverlay: 'from-red-950/40 via-transparent to-transparent',
  },
  favorite_dinner: {
    id: 'favorite_dinner',
    accentColor: '#16A34A', // Leafy Green
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400',
    borderAccent: 'border-emerald-500/40',
    gradientOverlay: 'from-emerald-950/40 via-transparent to-transparent',
  },
  special_surprise: {
    id: 'special_surprise',
    accentColor: '#0D9488', // Teal
    badgeBg: 'bg-teal-500/15',
    badgeText: 'text-teal-400',
    borderAccent: 'border-teal-500/40',
    gradientOverlay: 'from-teal-950/40 via-transparent to-transparent',
  },
  massage_mom: {
    id: 'massage_mom',
    accentColor: '#E11D48', // Rose / Burgundy
    badgeBg: 'bg-rose-500/15',
    badgeText: 'text-rose-400',
    borderAccent: 'border-rose-500/40',
    gradientOverlay: 'from-rose-950/40 via-transparent to-transparent',
  },
  coffee_break: {
    id: 'coffee_break',
    accentColor: '#B45309', // Coffee Amber
    badgeBg: 'bg-amber-500/15',
    badgeText: 'text-amber-400',
    borderAccent: 'border-amber-500/40',
    gradientOverlay: 'from-amber-950/40 via-transparent to-transparent',
  },
  dinner_no_cook: {
    id: 'dinner_no_cook',
    accentColor: '#059669', // Forest Emerald
    badgeBg: 'bg-emerald-500/15',
    badgeText: 'text-emerald-400',
    borderAccent: 'border-emerald-500/40',
    gradientOverlay: 'from-emerald-950/40 via-transparent to-transparent',
  },
  relaxing_evening: {
    id: 'relaxing_evening',
    accentColor: '#9333EA', // Plum / Purple
    badgeBg: 'bg-purple-500/15',
    badgeText: 'text-purple-400',
    borderAccent: 'border-purple-500/40',
    gradientOverlay: 'from-purple-950/40 via-transparent to-transparent',
  },
  household_help: {
    id: 'household_help',
    accentColor: '#0284C7', // Sky / Mint
    badgeBg: 'bg-sky-500/15',
    badgeText: 'text-sky-400',
    borderAccent: 'border-sky-500/40',
    gradientOverlay: 'from-sky-950/40 via-transparent to-transparent',
  },
};

export const DEFAULT_COUPONS: Coupon[] = [
  // Child coupons
  {
    id: 'cp_play_all_night',
    code: 'NST-8001',
    themeId: 'play_all_night',
    titleKey: 'playAllNight',
    descKey: 'playAllNightDesc',
    targetRole: 'CHILD',
    category: 'PRIVILEGE',
    status: 'AVAILABLE',
  },
  {
    id: 'cp_favorite_snacks',
    code: 'NST-8002',
    themeId: 'favorite_snacks',
    titleKey: 'favoriteSnacks',
    descKey: 'favoriteSnacksDesc',
    targetRole: 'CHILD',
    category: 'FOOD',
    status: 'AVAILABLE',
  },
  {
    id: 'cp_choose_movie',
    code: 'NST-8003',
    themeId: 'choose_movie',
    titleKey: 'chooseMovie',
    descKey: 'chooseMovieDesc',
    targetRole: 'CHILD',
    category: 'ENTERTAINMENT',
    status: 'AVAILABLE',
  },
  {
    id: 'cp_favorite_dinner',
    code: 'NST-8004',
    themeId: 'favorite_dinner',
    titleKey: 'favoriteDinner',
    descKey: 'favoriteDinnerDesc',
    targetRole: 'CHILD',
    category: 'FOOD',
    status: 'AVAILABLE',
  },
  {
    id: 'cp_special_surprise',
    code: 'NST-8005',
    themeId: 'special_surprise',
    titleKey: 'specialSurprise',
    descKey: 'specialSurpriseDesc',
    targetRole: 'CHILD',
    category: 'PRIVILEGE',
    status: 'AVAILABLE',
  },

  // Parent coupons
  {
    id: 'cp_massage_mom',
    code: 'NST-9001',
    themeId: 'massage_mom',
    titleKey: 'massageMom',
    descKey: 'massageMomDesc',
    targetRole: 'PARENT',
    category: 'CARE',
    status: 'AVAILABLE',
  },
  {
    id: 'cp_coffee_break',
    code: 'NST-9002',
    themeId: 'coffee_break',
    titleKey: 'coffeeBreak',
    descKey: 'coffeeBreakDesc',
    targetRole: 'PARENT',
    category: 'REST',
    status: 'AVAILABLE',
  },
  {
    id: 'cp_dinner_no_cook',
    code: 'NST-9003',
    themeId: 'dinner_no_cook',
    titleKey: 'dinnerNoCook',
    descKey: 'dinnerNoCookDesc',
    targetRole: 'PARENT',
    category: 'REST',
    status: 'AVAILABLE',
  },
  {
    id: 'cp_relaxing_evening',
    code: 'NST-9004',
    themeId: 'relaxing_evening',
    titleKey: 'relaxingEvening',
    descKey: 'relaxingEveningDesc',
    targetRole: 'PARENT',
    category: 'REST',
    status: 'AVAILABLE',
  },
];
