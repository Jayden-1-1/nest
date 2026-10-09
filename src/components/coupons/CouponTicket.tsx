import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Coupon } from '../../types/coupon';
import { COUPON_THEMES_CONFIG } from '../../data/defaultCoupons';
import { CouponIllustration } from './CouponIllustrations';
import { useCoupons } from '../../context/CouponContext';
import { useTranslation } from '../../locales';
import { Sparkles, Check, Clock, ShieldAlert, RotateCcw, Trash2, Scissors } from 'lucide-react';

interface CouponTicketProps {
  coupon: Coupon;
  onSelect?: (coupon: Coupon) => void;
  onRequestRedeem?: (coupon: Coupon) => void;
  showActions?: boolean;
}

// Synthesize an authentic paper tear rustle + heavy stamp thump via Web Audio API
const playTearSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // 1. Paper tear noise burst
    const bufferSize = Math.floor(ctx.sampleRate * 0.16);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.45));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.Q.setValueAtTime(1.8, ctx.currentTime);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.16);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();

    // 2. Heavy ink stamp thump (at 380ms)
    setTimeout(() => {
      try {
        const osc = ctx.createOscillator();
        const stampGain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.14);
        stampGain.gain.setValueAtTime(0.22, ctx.currentTime);
        stampGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
        osc.connect(stampGain);
        stampGain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.14);
      } catch {
        // audio context fallback
      }
    }, 380);
  } catch {
    // audio context may be blocked by browser
  }
};

export const CouponTicket: React.FC<CouponTicketProps> = ({
  coupon,
  onSelect,
  onRequestRedeem,
  showActions = true,
}) => {
  const { redeemCoupon, canRedeemCoupon, canManageCoupons, resetCoupon, deleteCoupon } = useCoupons();
  const { t, language } = useTranslation();

  const [isTearing, setIsTearing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const themeConfig = COUPON_THEMES_CONFIG[coupon.themeId] || COUPON_THEMES_CONFIG.play_all_night;

  // Localized Title & Description
  const title = coupon.isCustom 
    ? (coupon.customTitle || '') 
    : ((t.coupons as Record<string, string>)[coupon.titleKey] || coupon.titleKey);

  const description = coupon.isCustom 
    ? (coupon.customDesc || '') 
    : ((t.coupons as Record<string, string>)[coupon.descKey] || coupon.descKey);

  // Category translation
  const categoryLabel = (() => {
    switch (coupon.category) {
      case 'PRIVILEGE': return t.coupons.categoryPrivilege;
      case 'ENTERTAINMENT': return t.coupons.categoryEntertainment;
      case 'CARE': return t.coupons.categoryCare;
      case 'FOOD': return t.coupons.categoryFood;
      case 'REST': return t.coupons.categoryRest;
      case 'CUSTOM': return t.coupons.categoryCustom;
      default: return t.coupons.categoryPrivilege;
    }
  })();

  const isAvailable = coupon.status === 'AVAILABLE';
  const isUsed = coupon.status === 'USED';
  const isPending = coupon.status === 'TASK_PENDING';
  const isExpired = coupon.status === 'EXPIRED';

  const userCanRedeem = canRedeemCoupon(coupon);

  const handleRedeemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAvailable || isSubmitting || isTearing) return;

    if (onRequestRedeem) {
      onRequestRedeem(coupon);
      return;
    }

    // Direct redeem with realistic tear-off animation
    performTearAndRedeem();
  };

  const performTearAndRedeem = async () => {
    if (isSubmitting || isTearing) return;
    setIsSubmitting(true);
    setIsTearing(true);

    playTearSound();

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { x: 0.85, y: 0.5 },
        colors: ['#0F4CFF', '#8B5CF6', '#EC4899', '#F59E0B'],
      });
    } catch {
      // ignore
    }

    // Wait for the realistic tear-off animation (600ms)
    setTimeout(async () => {
      const res = await redeemCoupon(coupon.id);
      setIsSubmitting(false);
      if (!res.success) {
        setIsTearing(false);
      }
    }, 600);
  };

  return (
    <div
      onClick={() => onSelect?.(coupon)}
      className={`group relative flex flex-col md:flex-row w-full bg-surface-container-lowest dark:bg-[#121522] rounded-2xl md:rounded-3xl border ${
        themeConfig.borderAccent
      } shadow-md hover:shadow-xl transition-all duration-300 select-none overflow-hidden cursor-pointer md:min-h-[200px] ${
        isUsed ? 'opacity-85 grayscale-[15%]' : ''
      }`}
      role="article"
      aria-label={`Coupon ${title} - ${coupon.code}`}
    >
      {/* Visual Ambient Underglow */}
      <div
        className="absolute -top-16 -left-16 w-52 h-52 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: themeConfig.accentColor }}
      />

      {/* =========================================================================
          MAIN TICKET BODY (LEFT & CENTER: ARTWORK + EDITORIAL DETAILS)
          ========================================================================= */}
      <div className="flex-1 flex flex-col sm:flex-row gap-3.5 sm:gap-4 p-3.5 sm:p-4.5 relative z-10 min-w-0">
        
        {/* Left Artwork Banner (Elongated Landscape Vignette) */}
        <div className="w-full sm:w-48 md:w-52 h-36 sm:h-auto min-h-[140px] rounded-xl sm:rounded-2xl overflow-hidden shrink-0 relative bg-black/40 border border-white/10 shadow-inner group/art flex items-center justify-center">
          <CouponIllustration
            themeId={coupon.themeId}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/art:scale-105"
          />
          
          {/* Subtle Corner Notch on artwork */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-mono text-white/90 font-bold border border-white/10 flex items-center gap-1 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 text-amber-300" />
            <span>NEST TICKET</span>
          </div>

          <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[9px] font-mono text-white/80 font-semibold border border-white/10">
            <span>№ {coupon.code}</span>
          </div>
        </div>

        {/* Center Editorial Info */}
        <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
          <div>
            {/* Ticket Header: Category Pill & Serial ID */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-label-caps uppercase font-bold tracking-wider ${themeConfig.badgeBg} ${themeConfig.badgeText}`}
                >
                  {categoryLabel}
                </span>
                {coupon.targetRole === 'CHILD' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-caption bg-surface-container text-secondary font-medium">
                    {language === 'ru' ? 'Детям' : 'For Kids'}
                  </span>
                )}
                {coupon.targetRole === 'PARENT' && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-caption bg-surface-container text-secondary font-medium">
                    {language === 'ru' ? 'Родителям' : 'For Parents'}
                  </span>
                )}
              </div>

              <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-secondary/70">
                <span>№</span>
                <span className="font-bold tracking-widest text-on-surface">{coupon.code}</span>
              </div>
            </div>

            {/* Title & Description */}
            <h3 className="font-display text-base sm:text-lg font-black text-on-surface uppercase tracking-tight mb-1 group-hover:text-primary transition-colors line-clamp-1 sm:line-clamp-2">
              {title}
            </h3>
            <p className="font-body-sm text-secondary text-xs sm:text-[13px] leading-relaxed line-clamp-2 sm:line-clamp-3">
              {description}
            </p>
          </div>

          {/* Parental Approval Warning for 'Play All Night' */}
          {coupon.themeId === 'play_all_night' && isAvailable && (
            <div className="mt-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-caption">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-indigo-400" />
              <span className="leading-tight">{t.coupons.requiresApproval}</span>
            </div>
          )}

          {/* Used Metadata note if redeemed */}
          {isUsed && coupon.redeemedByName && (
            <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-secondary/80 border-t border-surface-container-highest/60 pt-1.5">
              <span>{t.coupons.usedBy}: <b className="text-on-surface">{coupon.redeemedByName}</b></span>
              {coupon.redeemedAt && (
                <span>{new Date(coupon.redeemedAt).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          PERFORATION LINE WITH AUTHENTIC CUTOUT NOTCHES & SCISSORS ICON
          ========================================================================= */}
      <div className="relative flex md:flex-col items-center justify-between py-1 md:py-0 px-2 md:px-0 shrink-0">
        {/* Top Semicircle Cutout */}
        <div className="hidden md:block absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-surface border border-surface-container-highest/80 shadow-inner z-20" />
        
        {/* Vertical Dashed Perforation Line */}
        <div className="w-full md:w-px md:h-full border-b md:border-b-0 md:border-l-2 border-dashed border-surface-container-highest/80 my-1 md:my-0 opacity-70" />
        
        {/* Small Center Scissors Notch */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-surface-container-low border border-surface-container-highest items-center justify-center text-secondary/50 text-[10px] z-20 shadow-xs">
          <Scissors className="w-2.5 h-2.5" />
        </div>

        {/* Bottom Semicircle Cutout */}
        <div className="hidden md:block absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-surface border border-surface-container-highest/80 shadow-inner z-20" />
      </div>

      {/* =========================================================================
          DETACHABLE STUB / SIDE STRIP (RIGHT ON DESKTOP, BOTTOM ON MOBILE)
          ========================================================================= */}
      <div
        className={`relative z-10 w-full md:w-44 flex flex-col justify-between items-center p-3.5 md:p-4.5 bg-surface-container-low/70 dark:bg-[#151926] shrink-0 border-t md:border-t-0 md:border-l border-surface-container-highest/30 origin-bottom-right transition-all duration-500 ${
          isTearing ? 'animate-tear-stub pointer-events-none' : ''
        }`}
      >
        {/* Stub Header: Serial Code Barcode Graphic */}
        <div className="w-full flex flex-col items-center gap-1 mb-2 md:mb-0">
          <span className="font-label-caps text-[9px] uppercase tracking-widest text-secondary font-bold">
            {t.coupons.stubLabel}
          </span>
          {/* Faux Barcode lines */}
          <div className="flex items-center gap-[2.5px] h-6 opacity-60">
            <span className="w-[1.5px] h-full bg-on-surface" />
            <span className="w-[3px] h-full bg-on-surface" />
            <span className="w-[1px] h-full bg-on-surface" />
            <span className="w-[2.5px] h-full bg-on-surface" />
            <span className="w-[3.5px] h-full bg-on-surface" />
            <span className="w-[1px] h-full bg-on-surface" />
            <span className="w-[2px] h-full bg-on-surface" />
            <span className="w-[4px] h-full bg-on-surface" />
            <span className="w-[1.5px] h-full bg-on-surface" />
          </div>
          <span className="font-mono text-[10px] text-secondary tracking-widest">
            {coupon.code}
          </span>
        </div>

        {/* Stub State Display / Redemption Button */}
        <div className="w-full flex flex-col items-center justify-center my-2 md:my-auto">
          {/* AVAILABLE STATE */}
          {isAvailable && showActions && (
            <button
              onClick={handleRedeemClick}
              disabled={!userCanRedeem || isSubmitting || isTearing}
              className={`w-full py-2.5 px-3 rounded-xl font-label-caps text-[11px] uppercase tracking-wider font-extrabold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${
                userCanRedeem
                  ? 'bg-primary text-white hover:bg-primary/90 active:scale-95 shadow-primary/20'
                  : 'bg-surface-container text-secondary/60 cursor-not-allowed border border-surface-container-highest'
              }`}
              title={userCanRedeem ? t.coupons.redeemAction : t.coupons.requiresApproval}
            >
              {isSubmitting || isTearing ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{t.coupons.redeemAction}</span>
                </>
              )}
            </button>
          )}

          {/* TASK PENDING STATE */}
          {isPending && (
            <div className="flex flex-col items-center gap-1 text-center">
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-label-caps text-[10px] uppercase font-bold flex items-center gap-1">
                <Clock className="w-3 h-3 animate-spin" />
                <span>{t.coupons.statusPending}</span>
              </span>
              <span className="text-[10px] font-caption text-secondary mt-1">
                {t.coupons.createdTaskNotice}
              </span>
            </div>
          )}

          {/* EXPIRED STATE */}
          {isExpired && (
            <div className="px-2 py-0.5 rounded-full bg-surface-container border border-surface-container-highest text-secondary font-label-caps text-[10px] uppercase font-bold">
              {t.coupons.statusExpired}
            </div>
          )}

          {/* USED STAMP (Authentic Ink Stamp slammed at -12deg) */}
          {isUsed && (
            <div className="relative py-1">
              <div
                className="transform -rotate-12 border-2 border-dashed border-rose-600 dark:border-rose-500 rounded-lg px-2.5 py-1 text-rose-600 dark:text-rose-400 font-display font-black text-xs sm:text-sm uppercase tracking-widest shadow-sm select-none animate-stamp-slam bg-rose-500/10 backdrop-blur-xs"
                style={{
                  textShadow: '0 0 1px rgba(225, 29, 72, 0.4)',
                }}
              >
                {t.coupons.statusUsed}
              </div>
            </div>
          )}
        </div>

        {/* Parent Management Controls (Reset / Delete) */}
        {canManageCoupons && (
          <div className="w-full flex items-center justify-end gap-1.5 pt-2 border-t border-surface-container-highest/40 mt-1">
            {isUsed && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  resetCoupon(coupon.id);
                }}
                className="p-1 rounded-md text-secondary hover:text-primary hover:bg-surface-container transition-colors"
                title="Восстановить купон"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            {coupon.isCustom && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteCoupon(coupon.id);
                }}
                className="p-1 rounded-md text-secondary hover:text-rose-500 hover:bg-surface-container transition-colors"
                title="Удалить купон"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
