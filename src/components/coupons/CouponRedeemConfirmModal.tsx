import React, { useState } from 'react';
import { Coupon } from '../../types/coupon';
import { useCoupons } from '../../context/CouponContext';
import { useTranslation } from '../../locales';
import { COUPON_THEMES_CONFIG } from '../../data/defaultCoupons';
import { CouponIllustration } from './CouponIllustrations';
import { X, Check, ShieldAlert, Sparkles } from 'lucide-react';

interface CouponRedeemConfirmModalProps {
  coupon: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CouponRedeemConfirmModal: React.FC<CouponRedeemConfirmModalProps> = ({
  coupon,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { redeemCoupon } = useCoupons();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  if (!isOpen || !coupon) return null;

  const themeConfig = COUPON_THEMES_CONFIG[coupon.themeId] || COUPON_THEMES_CONFIG.play_all_night;

  const title = coupon.isCustom 
    ? (coupon.customTitle || '') 
    : ((t.coupons as Record<string, string>)[coupon.titleKey] || coupon.titleKey);

  const description = coupon.isCustom 
    ? (coupon.customDesc || '') 
    : ((t.coupons as Record<string, string>)[coupon.descKey] || coupon.descKey);

  const handleConfirm = async () => {
    setLoading(true);
    const res = await redeemCoupon(coupon.id);
    setLoading(false);
    if (res.success) {
      onSuccess();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto scroll-touch bg-surface-container-lowest dark:bg-[#161a28] rounded-3xl border border-surface-container-highest shadow-2xl p-6 relative animate-in zoom-in-95 duration-200"
      >
        {/* Glow */}
        <div
          className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: themeConfig.accentColor }}
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-label-caps text-xs uppercase font-extrabold tracking-wider text-on-surface">
              {t.coupons.confirmRedeemTitle}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-container text-secondary hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Ticket mini preview */}
        <div className="my-5 space-y-4">
          <div className="w-full h-36 rounded-2xl overflow-hidden border border-surface-container-highest bg-black/40 shadow-inner">
            <CouponIllustration themeId={coupon.themeId} alt={title} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="font-display text-lg font-bold text-on-surface uppercase tracking-tight">
                {title}
              </h4>
              <span className="font-mono text-xs text-secondary font-bold">№ {coupon.code}</span>
            </div>
            <p className="font-body-sm text-xs text-secondary leading-relaxed">
              {description}
            </p>
          </div>

          {coupon.themeId === 'play_all_night' && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
              <p className="leading-tight">{t.coupons.playAllNightDesc}</p>
            </div>
          )}

          <p className="text-xs text-secondary/80 font-caption italic text-center">
            {t.coupons.confirmRedeemDesc}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 rounded-xl border border-surface-container-highest text-secondary hover:text-on-surface hover:bg-surface-container font-label-caps text-xs uppercase font-bold transition-all cursor-pointer"
          >
            {t.coupons.cancelButton}
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-label-caps text-xs uppercase font-extrabold shadow-lg shadow-primary/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{t.coupons.confirmButton}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
