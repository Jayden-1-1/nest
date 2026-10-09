export type CouponTargetRole = 'CHILD' | 'PARENT' | 'ALL';

export type CouponCategory = 
  | 'PRIVILEGE'
  | 'ENTERTAINMENT'
  | 'CARE'
  | 'FOOD'
  | 'REST'
  | 'CUSTOM';

export type CouponThemeId =
  | 'play_all_night'
  | 'favorite_snacks'
  | 'choose_movie'
  | 'favorite_dinner'
  | 'special_surprise'
  | 'massage_mom'
  | 'coffee_break'
  | 'dinner_no_cook'
  | 'relaxing_evening'
  | 'household_help';

export type CouponStatus = 
  | 'AVAILABLE' 
  | 'TASK_PENDING' 
  | 'USED' 
  | 'EXPIRED';

export interface CouponThemeConfig {
  id: CouponThemeId;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  borderAccent: string;
  gradientOverlay: string;
}

export interface Coupon {
  id: string;
  code: string; // e.g. "NST-7749"
  themeId: CouponThemeId;
  titleKey: string;
  descKey: string;
  targetRole: CouponTargetRole;
  category: CouponCategory;
  status: CouponStatus;
  redeemedBy?: string;
  redeemedByName?: string;
  redeemedAt?: string;
  expiresAt?: string;
  linkedTaskId?: string;
  isCustom?: boolean;
  customTitle?: string;
  customDesc?: string;
  customAccentColor?: string;
}
