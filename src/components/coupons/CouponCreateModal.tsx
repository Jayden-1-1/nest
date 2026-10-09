import React, { useState } from 'react';
import { CouponThemeId, CouponTargetRole, CouponCategory } from '../../types/coupon';
import { useCoupons } from '../../context/CouponContext';
import { useTranslation } from '../../locales';
import { COUPON_THEMES_CONFIG } from '../../data/defaultCoupons';
import { CouponIllustration } from './CouponIllustrations';
import { X, Plus, Sparkles, Check } from 'lucide-react';

interface CouponCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_THEMES: { id: CouponThemeId; labelRu: string; labelEn: string }[] = [
  { id: 'household_help', labelRu: 'Помощь по дому', labelEn: 'Household Help' },
  { id: 'play_all_night', labelRu: 'Играть всю ночь', labelEn: 'Play All Night' },
  { id: 'favorite_snacks', labelRu: 'Любимые снеки', labelEn: 'Favorite Snacks' },
  { id: 'choose_movie', labelRu: 'Выбор фильма', labelEn: 'Choose Movie' },
  { id: 'favorite_dinner', labelRu: 'Любимый ужин', labelEn: 'Favorite Dinner' },
  { id: 'special_surprise', labelRu: 'Особенный сюрприз', labelEn: 'Special Surprise' },
  { id: 'massage_mom', labelRu: 'Массаж маме', labelEn: 'Massage for Mom' },
  { id: 'coffee_break', labelRu: 'Кофе и отдых', labelEn: 'Coffee & Break' },
  { id: 'dinner_no_cook', labelRu: 'Ужин без готовки', labelEn: 'Dinner Without Cooking' },
  { id: 'relaxing_evening', labelRu: 'Вечер отдыха', labelEn: 'Relaxing Evening' },
];

export const CouponCreateModal: React.FC<CouponCreateModalProps> = ({ isOpen, onClose }) => {
  const { createCustomCoupon } = useCoupons();
  const { t, language } = useTranslation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [themeId, setThemeId] = useState<CouponThemeId>('household_help');
  const [targetRole, setTargetRole] = useState<CouponTargetRole>('CHILD');
  const [category, setCategory] = useState<CouponCategory>('PRIVILEGE');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const success = createCustomCoupon({
      title: title.trim(),
      description: description.trim(),
      themeId,
      targetRole,
      category,
      customAccentColor: COUPON_THEMES_CONFIG[themeId].accentColor,
    });

    if (success) {
      setTitle('');
      setDescription('');
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
        className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-surface-container-lowest dark:bg-[#161a28] rounded-3xl border border-surface-container-highest shadow-2xl p-6 relative animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-container-highest">
          <div>
            <h3 className="font-display text-lg font-bold text-on-surface uppercase tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              <span>{t.coupons.createModalTitle}</span>
            </h3>
            <p className="font-body-sm text-xs text-secondary mt-0.5">
              {t.coupons.createModalSubtitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-container text-secondary hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          
          {/* Theme selector with vector thumbnail previews */}
          <div>
            <label className="block text-xs font-label-caps uppercase font-bold text-secondary mb-2">
              {t.coupons.themeSelectLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 border border-surface-container-highest rounded-2xl bg-surface-container-low/40">
              {AVAILABLE_THEMES.map((theme) => {
                const isSelected = themeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setThemeId(theme.id)}
                    className={`relative flex flex-col items-center p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/30 bg-primary/10'
                        : 'border-surface-container-highest hover:bg-surface-container hover:border-outline'
                    }`}
                  >
                    <div className="w-full h-14 rounded-lg overflow-hidden bg-black/40 mb-1 border border-white/5">
                      <CouponIllustration themeId={theme.id} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] font-caption leading-tight text-center text-on-surface line-clamp-1">
                      {language === 'ru' ? theme.labelRu : theme.labelEn}
                    </span>
                    {isSelected && (
                      <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-primary text-white flex items-center justify-center text-[9px]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recipient Target Role */}
          <div>
            <label className="block text-xs font-label-caps uppercase font-bold text-secondary mb-2">
              {t.coupons.targetRoleLabel}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'CHILD' as const, label: t.coupons.roleChild },
                { id: 'PARENT' as const, label: t.coupons.roleParent },
                { id: 'ALL' as const, label: t.coupons.roleAll },
              ].map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setTargetRole(role.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-label-caps uppercase font-bold transition-all cursor-pointer text-center ${
                    targetRole === role.id
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'border-surface-container-highest text-secondary hover:bg-surface-container'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-label-caps uppercase font-bold text-secondary mb-1.5">
              {t.coupons.titleLabel} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={language === 'ru' ? 'например: Прогулка в парк без телефона' : 'e.g. Park walk without phones'}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-highest text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-label-caps uppercase font-bold text-secondary mb-1.5">
              {t.coupons.descLabel} *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={language === 'ru' ? 'Опишите условия, когда и как можно погасить этот билет...' : 'Describe terms and redemption details...'}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-highest text-sm text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border border-surface-container-highest text-secondary hover:text-on-surface hover:bg-surface-container font-label-caps text-xs uppercase font-bold transition-all cursor-pointer"
            >
              {t.coupons.cancelButton}
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !description.trim()}
              className="flex-1 py-3.5 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-label-caps text-xs uppercase font-extrabold shadow-lg shadow-primary/25 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{t.coupons.createSubmit}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
