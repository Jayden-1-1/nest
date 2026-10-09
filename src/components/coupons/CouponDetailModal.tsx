import React from 'react';
import { Coupon } from '../../types/coupon';
import { useTranslation } from '../../locales';
import { COUPON_THEMES_CONFIG } from '../../data/defaultCoupons';
import { CouponIllustration } from './CouponIllustrations';
import { X, Sparkles, Check, Clock, ShieldAlert } from 'lucide-react';

interface CouponDetailModalProps {
  coupon: Coupon | null;
  isOpen: boolean;
  onClose: () => void;
  onRedeem: (coupon: Coupon) => void;
  canRedeem: boolean;
}

export const CouponDetailModal: React.FC<CouponDetailModalProps> = ({
  coupon,
  isOpen,
  onClose,
  onRedeem,
  canRedeem,
}) => {
  const { t, language } = useTranslation();

  if (!isOpen || !coupon) return null;

  const themeConfig = COUPON_THEMES_CONFIG[coupon.themeId] || COUPON_THEMES_CONFIG.play_all_night;

  const title = coupon.isCustom 
    ? (coupon.customTitle || '') 
    : ((t.coupons as Record<string, string>)[coupon.titleKey] || coupon.titleKey);

  const description = coupon.isCustom 
    ? (coupon.customDesc || '') 
    : ((t.coupons as Record<string, string>)[coupon.descKey] || coupon.descKey);

  const isAvailable = coupon.status === 'AVAILABLE';
  const isUsed = coupon.status === 'USED';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-surface-container-lowest dark:bg-[#161a28] rounded-3xl border border-surface-container-highest shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200"
      >
        {/* Glow */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: themeConfig.accentColor }}
        />

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-surface-container-highest">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-label-caps uppercase font-bold tracking-wider ${themeConfig.badgeBg} ${themeConfig.badgeText}`}
            >
              № {coupon.code}
            </span>
            <span className="font-caption text-xs text-secondary">
              {coupon.targetRole === 'CHILD' ? (language === 'ru' ? 'Для детей' : 'For Children') : (language === 'ru' ? 'Для родителей' : 'For Parents')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-container text-secondary hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Large Artwork Canvas */}
        <div className="relative w-full h-52 bg-black/50 border-b border-surface-container-highest flex items-center justify-center overflow-hidden">
          <CouponIllustration themeId={coupon.themeId} alt={title} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[11px] font-mono text-white/90 font-bold border border-white/10 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>ORIGINAL NEST TICKET</span>
          </div>
        </div>

        {/* Content details */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-display text-2xl font-bold text-on-surface uppercase tracking-tight mb-2">
              {title}
            </h3>
            <p className="font-body-md text-sm text-secondary leading-relaxed">
              {description}
            </p>
          </div>

          {/* Special terms for 'Play All Night' */}
          {coupon.themeId === 'play_all_night' && (
            <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
              <div>
                <b className="font-semibold block mb-0.5">{language === 'ru' ? 'Условия активации:' : 'Terms of Activation:'}</b>
                <span>{t.coupons.playAllNightDesc}</span>
              </div>
            </div>
          )}

          {/* Used details */}
          {isUsed && (
            <div className="p-3 rounded-xl bg-surface-container border border-surface-container-highest text-xs font-mono text-secondary space-y-1">
              <div>{t.coupons.statusUsed}: <b>{coupon.redeemedByName}</b></div>
              {coupon.redeemedAt && (
                <div>{t.coupons.redeemedAt}: {new Date(coupon.redeemedAt).toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US')}</div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border border-surface-container-highest text-secondary hover:text-on-surface hover:bg-surface-container font-label-caps text-xs uppercase font-bold transition-all cursor-pointer"
            >
              {language === 'ru' ? 'Закрыть' : 'Close'}
            </button>

            {isAvailable && (
              <button
                onClick={() => {
                  onClose();
                  onRedeem(coupon);
                }}
                disabled={!canRedeem}
                className={`flex-1 py-3.5 rounded-xl font-label-caps text-xs uppercase font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  canRedeem
                    ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/25 active:scale-95'
                    : 'bg-surface-container text-secondary/60 cursor-not-allowed border border-surface-container-highest'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{t.coupons.redeemAction}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
