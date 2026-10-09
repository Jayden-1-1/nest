import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Coupon, CouponThemeId, CouponCategory, CouponTargetRole } from '../types/coupon';
import { DEFAULT_COUPONS } from '../data/defaultCoupons';
import { useHome } from './HomeContext';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useTasks } from './TaskContext';
import { formatLocalDate } from '../utils/date';

interface CreateCouponData {
  title: string;
  description: string;
  themeId: CouponThemeId;
  targetRole: CouponTargetRole;
  category: CouponCategory;
  customAccentColor?: string;
  createTaskOnRedeem?: boolean;
}

interface CouponContextType {
  coupons: Coupon[];
  redeemCoupon: (couponId: string) => Promise<{ success: boolean; taskCreated?: boolean; error?: string }>;
  createCustomCoupon: (data: CreateCouponData) => boolean;
  deleteCoupon: (couponId: string) => boolean;
  resetAllCoupons: () => void;
  resetCoupon: (couponId: string) => void;
  canRedeemCoupon: (coupon: Coupon) => boolean;
  canManageCoupons: boolean;
}

const CouponContext = createContext<CouponContextType | undefined>(undefined);

export const CouponProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentHome, isOwner, isParent, currentUserRole } = useHome();
  const { user } = useAuth();
  const toast = useToast();
  const { createTask } = useTasks();

  const homeId = currentHome?.id || 'default_home';
  const storageKey = `nest_coupons_v8_${homeId}`;

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_COUPONS;
  });

  // Sync with current home changes
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCoupons(parsed);
          return;
        }
      }
    } catch {
      // Fallback
    }
    setCoupons(DEFAULT_COUPONS);
  }, [storageKey]);

  // Persist to storage
  const saveCoupons = (newCoupons: Coupon[]) => {
    setCoupons(newCoupons);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newCoupons));
    } catch {
      // Storage error handled silently
    }
  };

  const canManageCoupons = isOwner || isParent;

  const canRedeemCoupon = (coupon: Coupon): boolean => {
    if (coupon.status === 'USED' || coupon.status === 'EXPIRED') return false;

    // Parents and Owners can redeem parent coupons and all family coupons
    if (coupon.targetRole === 'PARENT') {
      return isOwner || isParent;
    }

    // Children can redeem CHILD coupons and ALL coupons
    if (coupon.targetRole === 'CHILD') {
      return currentUserRole === 'MEMBER' || isOwner || isParent;
    }

    return true;
  };

  const redeemCoupon = async (
    couponId: string
  ): Promise<{ success: boolean; taskCreated?: boolean; error?: string }> => {
    const coupon = coupons.find((c) => c.id === couponId);
    if (!coupon) {
      return { success: false, error: 'Coupon not found' };
    }

    if (coupon.status === 'USED') {
      return { success: false, error: 'Coupon already used' };
    }

    if (!canRedeemCoupon(coupon)) {
      toast.error('У вас нет прав для погашения этого купона.');
      return { success: false, error: 'Permission denied' };
    }

    try {
      const now = new Date().toISOString();
      let linkedTaskId: string | undefined = undefined;
      let taskCreated = false;

      // If user is parent/owner and the coupon involves care/service, optionally generate a task
      if (canManageCoupons && (coupon.themeId === 'massage_mom' || coupon.themeId === 'dinner_no_cook' || coupon.themeId === 'household_help')) {
        try {
          const assigneeId = currentHome?.members.find((m) => m.role === 'MEMBER')?.userId || user?.id || '';
          const task = createTask({
            title: `Купон: ${coupon.customTitle || coupon.titleKey}`,
            description: coupon.customDesc || `Погашен купон ${coupon.code}`,
            category: 'FAMILY',
            assigneeId,
            date: formatLocalDate(new Date()),
            priority: 'HIGH',
          });
          if (task) {
            linkedTaskId = task.id;
            taskCreated = true;
          }
        } catch {
          // Task creation is optional for coupons
        }
      }

      // Update coupon state
      const updatedCoupons = coupons.map((c) => {
        if (c.id === couponId) {
          return {
            ...c,
            status: taskCreated ? ('TASK_PENDING' as const) : ('USED' as const),
            redeemedBy: user?.id,
            redeemedByName: user?.displayName || 'Участник Дома',
            redeemedAt: now,
            linkedTaskId,
          };
        }
        return c;
      });

      saveCoupons(updatedCoupons);

      // Snappy celebration confetti
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#6366F1', '#EC4899', '#F59E0B', '#10B981'],
        });
      } catch {
        // Confetti non-fatal
      }

      return { success: true, taskCreated };
    } catch (err) {
      return { success: false, error: String(err) };
    }
  };

  const createCustomCoupon = (data: CreateCouponData): boolean => {
    if (!canManageCoupons) {
      toast.error('Только родители и владелец Дома могут создавать новые купоны.');
      return false;
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newCoupon: Coupon = {
      id: `cp_custom_${Date.now()}`,
      code: `NST-${randomNum}`,
      themeId: data.themeId,
      titleKey: data.title,
      descKey: data.description,
      isCustom: true,
      customTitle: data.title,
      customDesc: data.description,
      customAccentColor: data.customAccentColor,
      targetRole: data.targetRole,
      category: data.category,
      status: 'AVAILABLE',
    };

    saveCoupons([newCoupon, ...coupons]);
    toast.success('Новый семейный купон успешно создан!');
    return true;
  };

  const deleteCoupon = (couponId: string): boolean => {
    if (!canManageCoupons) {
      toast.error('Только родители могут удалять купоны.');
      return false;
    }

    saveCoupons(coupons.filter((c) => c.id !== couponId));
    toast.info('Купон удалён.');
    return true;
  };

  const resetAllCoupons = () => {
    if (!canManageCoupons) {
      toast.error('Только родители могут сбрасывать купоны.');
      return;
    }

    const reset = coupons.map((c) => ({
      ...c,
      status: 'AVAILABLE' as const,
      redeemedBy: undefined,
      redeemedByName: undefined,
      redeemedAt: undefined,
      linkedTaskId: undefined,
    }));

    saveCoupons(reset);
    toast.success('Все купоны восстановлены для новой недели!');
  };

  const resetCoupon = (couponId: string) => {
    if (!canManageCoupons) {
      toast.error('Только родители могут восстанавливать купоны.');
      return;
    }

    const updated = coupons.map((c) => {
      if (c.id === couponId) {
        return {
          ...c,
          status: 'AVAILABLE' as const,
          redeemedBy: undefined,
          redeemedByName: undefined,
          redeemedAt: undefined,
          linkedTaskId: undefined,
        };
      }
      return c;
    });

    saveCoupons(updated);
    toast.info('Купон снова доступен для использования.');
  };

  return (
    <CouponContext.Provider
      value={{
        coupons,
        redeemCoupon,
        createCustomCoupon,
        deleteCoupon,
        resetAllCoupons,
        resetCoupon,
        canRedeemCoupon,
        canManageCoupons,
      }}
    >
      {children}
    </CouponContext.Provider>
  );
};

export const useCoupons = () => {
  const context = useContext(CouponContext);
  if (!context) {
    throw new Error('useCoupons must be used within a CouponProvider');
  }
  return context;
};
