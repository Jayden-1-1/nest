import React, { useState } from 'react';
import { useCoupons } from '../../context/CouponContext';
import { useTranslation } from '../../locales';
import { Coupon } from '../../types/coupon';
import { CouponTicket } from './CouponTicket';
import { CouponRedeemConfirmModal } from './CouponRedeemConfirmModal';
import { CouponDetailModal } from './CouponDetailModal';
import { Ticket, ArrowRight, Sparkles } from 'lucide-react';

interface FamilyCouponsWidgetProps {
  onNavigateToCoupons: () => void;
}

export const FamilyCouponsWidget: React.FC<FamilyCouponsWidgetProps> = ({
  onNavigateToCoupons,
}) => {
  const { coupons, canRedeemCoupon } = useCoupons();
  const { t, language } = useTranslation();

  const [confirmModalCoupon, setConfirmModalCoupon] = useState<Coupon | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);

  const availableCoupons = coupons.filter((c) => c.status === 'AVAILABLE').slice(0, 2);

  return (
    <section className="bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl border border-surface-container-highest/60 p-6 sm:p-8 shadow-card space-y-6">
      <div className="flex items-center justify-between border-b border-surface-container-highest/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-lg uppercase tracking-tight text-on-surface font-extrabold flex items-center gap-2">
              <span>{t.coupons.pageTitle}</span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-[10px] font-bold">
                {coupons.filter(c => c.status === 'AVAILABLE').length} {language === 'ru' ? 'активно' : 'active'}
              </span>
            </h3>
            <p className="font-body-sm text-xs text-secondary mt-0.5">
              {language === 'ru' ? 'Билеты на вечерние радости, любимые блюда и отдых.' : 'Privilege tickets for cozy evenings, favorite treats, and rest.'}
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToCoupons}
          className="btn-snappy hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label-caps text-xs uppercase font-bold transition-all cursor-pointer"
        >
          <span>{language === 'ru' ? 'Все билеты' : 'All Tickets'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2 Featured Tickets in 2-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {availableCoupons.map((coupon) => (
          <CouponTicket
            key={coupon.id}
            coupon={coupon}
            onSelect={(c) => setSelectedCoupon(c)}
          />
        ))}
      </div>

      <div className="sm:hidden pt-2">
        <button
          onClick={onNavigateToCoupons}
          className="btn-snappy w-full py-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-primary font-label-caps text-xs uppercase font-bold flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{language === 'ru' ? 'Открыть все семейные купоны' : 'Open All Family Coupons'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Modals */}
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
    </section>
  );
};
