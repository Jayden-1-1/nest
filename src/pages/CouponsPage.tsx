import React, { useState } from 'react';
import { useCoupons } from '../context/CouponContext';
import { useHome } from '../context/HomeContext';
import { useTranslation } from '../locales';
import { Coupon } from '../types/coupon';
import { CouponTicket } from '../components/coupons/CouponTicket';
import { CouponRedeemConfirmModal } from '../components/coupons/CouponRedeemConfirmModal';
import { CouponDetailModal } from '../components/coupons/CouponDetailModal';
import { CouponCreateModal } from '../components/coupons/CouponCreateModal';
import { 
  Ticket, 
  Plus, 
  RotateCcw, 
  Sparkles, 
  Smile, 
  HeartHandshake, 
  History,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';

type CouponFilterTab = 'ALL' | 'KIDS' | 'PARENTS' | 'HISTORY';

export const CouponsPage: React.FC = () => {
  const { coupons, canManageCoupons, canRedeemCoupon, resetAllCoupons } = useCoupons();
  const { currentHome, currentUserRole } = useHome();
  const { t, language } = useTranslation();

  const [currentTab, setCurrentTab] = useState<CouponFilterTab>('ALL');

  // Modals
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [confirmModalCoupon, setConfirmModalCoupon] = useState<Coupon | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Filter logic
  const filteredCoupons = coupons.filter((c) => {
    if (currentTab === 'HISTORY') {
      return c.status === 'USED';
    }
    if (currentTab === 'KIDS') {
      return c.targetRole === 'CHILD';
    }
    if (currentTab === 'PARENTS') {
      return c.targetRole === 'PARENT';
    }
    return true;
  });

  const availableCount = coupons.filter((c) => c.status === 'AVAILABLE').length;
  const usedCount = coupons.filter((c) => c.status === 'USED').length;

  const handleResetConfirm = () => {
    if (window.confirm(t.coupons.resetConfirm)) {
      resetAllCoupons();
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* =========================================================================
          SECTION 1 — EDITORIAL HEADER SANCTUARY
          ========================================================================= */}
      <section className="relative w-full p-6 sm:p-8 bg-surface-container-lowest/85 backdrop-blur-xl rounded-3xl border border-surface-container-highest/80 shadow-card overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Meta Edition Tags */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-secondary">
              <span className="font-label-caps tracking-widest text-primary uppercase font-bold px-2 py-0.5 rounded-md bg-primary-fixed/30 border border-primary/20">
                {language === 'ru' ? 'СЕМЕЙНЫЕ ПРИВИЛЕГИИ' : 'FAMILY PRIVILEGES'}
              </span>
              <span className="text-outline-variant">/</span>
              <span className="font-label-caps tracking-wider text-on-surface uppercase font-bold">
                {currentHome?.name || t.common.appName}
              </span>
              <span className="text-outline-variant">/</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container border border-surface-container-highest text-primary font-caption text-[10px] uppercase font-bold">
                <Ticket className="w-3 h-3 text-primary" />
                <span>{availableCount} {language === 'ru' ? 'доступно' : 'available'}</span>
              </span>
            </div>

            {/* Title */}
            <div>
              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-on-surface leading-tight select-none">
                {t.coupons.pageTitle}
              </h1>
            </div>

            {/* Description */}
            <p className="font-body-sm sm:font-body-md text-secondary text-xs sm:text-sm leading-relaxed max-w-xl">
              {t.coupons.pageSubtitle}
            </p>
          </div>

          {/* Action buttons (Parents only) */}
          {canManageCoupons && (
            <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="btn-snappy group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-on-surface text-surface rounded-2xl shadow-card hover:bg-primary hover:text-white transition-all active:scale-95 cursor-pointer font-label-caps text-xs tracking-wider uppercase font-bold"
              >
                <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                <span>{t.coupons.createCoupon}</span>
              </button>

              {usedCount > 0 && (
                <button
                  onClick={handleResetConfirm}
                  className="btn-snappy inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-container border border-surface-container-highest rounded-2xl text-secondary hover:text-on-surface hover:bg-surface-container-high transition-all text-xs font-label-caps uppercase font-semibold cursor-pointer"
                  title="Восстановить использованные купоны для новой недели"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.coupons.resetWeek}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — FILTER TABS & COUNTERS
          ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-container-highest pb-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          {[
            { id: 'ALL' as const, label: t.coupons.tabAll, icon: Sparkles, count: coupons.length },
            { id: 'KIDS' as const, label: t.coupons.tabKids, icon: Smile, count: coupons.filter(c => c.targetRole === 'CHILD').length },
            { id: 'PARENTS' as const, label: t.coupons.tabParents, icon: HeartHandshake, count: coupons.filter(c => c.targetRole === 'PARENT').length },
            { id: 'HISTORY' as const, label: t.coupons.tabHistory, icon: History, count: usedCount },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-label-caps text-xs uppercase font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-surface-container-highest text-secondary'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION 3 — TICKETS GRID
          ========================================================================= */}
      {filteredCoupons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {filteredCoupons.map((coupon) => (
            <CouponTicket
              key={coupon.id}
              coupon={coupon}
              onSelect={(c) => setSelectedCoupon(c)}
              onRequestRedeem={(c) => setConfirmModalCoupon(c)}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-surface-container-lowest/50 border border-surface-container-highest/60 space-y-3">
          <Ticket className="w-10 h-10 text-secondary/40 mx-auto" />
          <h3 className="font-display text-base font-bold uppercase text-on-surface">
            {language === 'ru' ? 'Нет билетов в этом разделе' : 'No tickets in this section'}
          </h3>
          <p className="font-body-sm text-xs text-secondary max-w-sm mx-auto">
            {currentTab === 'HISTORY' 
              ? (language === 'ru' ? 'Вы ещё не погасили ни одного купона. Выберите доступный билет выше!' : 'No coupons redeemed yet. Pick an available ticket above!')
              : (language === 'ru' ? 'Создайте новый купон с помощью кнопки вверху страницы.' : 'Create a new coupon using the button above.')}
          </p>
        </div>
      )}

      {/* =========================================================================
          MODALS
          ========================================================================= */}
      <CouponRedeemConfirmModal
        isOpen={Boolean(confirmModalCoupon)}
        coupon={confirmModalCoupon}
        onClose={() => setConfirmModalCoupon(null)}
        onSuccess={() => setConfirmModalCoupon(null)}
      />

      <CouponDetailModal
        isOpen={Boolean(selectedCoupon)}
        coupon={selectedCoupon}
        onClose={() => setSelectedCoupon(null)}
        onRedeem={(c) => setConfirmModalCoupon(c)}
        canRedeem={selectedCoupon ? canRedeemCoupon(selectedCoupon) : false}
      />

      <CouponCreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
};
