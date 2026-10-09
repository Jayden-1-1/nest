import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../locales';
import { Share, PlusSquare, Sparkles, X, Smartphone, ArrowRight, Check } from 'lucide-react';
import { NestLogo } from '../common/NestLogo';

export const isIosDevice = () => {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua);
};

export const isStandaloneMode = () => {
  if (typeof window === 'undefined') return false;
  return (
    ('standalone' in window.navigator && Boolean((window.navigator as unknown as { standalone: boolean }).standalone)) ||
    window.matchMedia('(display-mode: standalone)').matches
  );
};

interface IosInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IosInstallModal: React.FC<IosInstallModalProps> = ({ isOpen, onClose }) => {
  const { language } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100050] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-surface-container-lowest dark:bg-[#121522] rounded-t-3xl sm:rounded-3xl border border-surface-container-highest shadow-2xl p-6 sm:p-7 space-y-6 animate-in slide-in-from-bottom duration-300 pb-safe overflow-hidden relative"
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3 border-b border-surface-container-highest/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-[#0F4CFF] p-2 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <NestLogo variant="symbol" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display text-lg font-black tracking-tight text-on-surface uppercase">
                  NEST Web App
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary font-mono text-[10px] font-bold">
                  iOS
                </span>
              </div>
              <p className="font-body-sm text-xs text-secondary mt-0.5">
                {language === 'ru'
                  ? 'Установка на экран «Домой» iPhone'
                  : 'Install to iPhone Home Screen'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-surface-container text-secondary hover:text-on-surface transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Simple Visual Steps */}
        <div className="space-y-3.5">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest/80">
            <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5 shadow-xs">
              <Share className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-label-caps text-[10px] uppercase font-bold tracking-wider text-primary block">
                {language === 'ru' ? 'Шаг 1' : 'Step 1'}
              </span>
              <h4 className="font-headline text-sm font-bold text-on-surface">
                {language === 'ru'
                  ? 'Нажмите кнопку «Поделиться»'
                  : 'Tap the "Share" button'}
              </h4>
              <p className="text-xs text-secondary leading-relaxed">
                {language === 'ru'
                  ? 'В нижней панели Safari найдите значок квадрата со стрелкой вверх.'
                  : 'In the Safari toolbar at the bottom, tap the square with an arrow pointing up.'}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest/80">
            <div className="w-9 h-9 rounded-xl bg-surface-container border border-surface-container-highest flex items-center justify-center text-on-surface shrink-0 mt-0.5 shadow-xs">
              <PlusSquare className="w-4 h-4" />
            </div>
            <div className="space-y-0.5">
              <span className="font-label-caps text-[10px] uppercase font-bold tracking-wider text-secondary font-semibold block">
                {language === 'ru' ? 'Шаг 2' : 'Step 2'}
              </span>
              <h4 className="font-headline text-sm font-bold text-on-surface">
                {language === 'ru'
                  ? 'Выберите «На экран „Домой“»'
                  : 'Select "Add to Home Screen"'}
              </h4>
              <p className="text-xs text-secondary leading-relaxed">
                {language === 'ru'
                  ? 'Прокрутите меню действий вниз до пункта «На экран „Домой“» (значок «+»).'
                  : 'Scroll down the share sheet and tap "Add to Home Screen" (with a "+" icon).'}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest/80">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 shadow-xs">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div className="space-y-0.5">
              <span className="font-label-caps text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 block">
                {language === 'ru' ? 'Шаг 3' : 'Step 3'}
              </span>
              <h4 className="font-headline text-sm font-bold text-on-surface">
                {language === 'ru'
                  ? 'Нажмите «Добавить» в правом верхнем углу'
                  : 'Tap "Add" in the top-right corner'}
              </h4>
              <p className="text-xs text-secondary leading-relaxed">
                {language === 'ru'
                  ? 'Иконка NEST появится на рабочем столе iPhone как полноценное приложение!'
                  : 'The NEST app icon will appear on your iPhone Home Screen.'}
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Pill */}
        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-secondary space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-indigo-400 text-[11px] font-label-caps uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'ru' ? 'Преимущества Web App' : 'Web App Benefits'}</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            {language === 'ru'
              ? 'Работает во весь экран без рамок Safari, сохраняет авторизацию и тему, поддерживает тактильные анимации 60 FPS.'
              : 'Runs full-screen without Safari chrome, preserves device session & theme, 60 FPS smooth animations.'}
          </p>
        </div>

        {/* Footer Actions */}
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-primary text-white font-label-caps text-xs uppercase font-extrabold tracking-wider hover:bg-primary/90 transition-all shadow-md active:scale-98 cursor-pointer"
        >
          {language === 'ru' ? 'Всё понятно' : 'Got It'}
        </button>
      </div>
    </div>
  );
};

export const IosInstallBanner: React.FC = () => {
  const { language } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Check if on iOS and not yet in standalone mode
    if (isIosDevice() && !isStandaloneMode()) {
      const lastDismissed = localStorage.getItem('nest_ios_banner_dismissed_at');
      if (!lastDismissed) {
        setDismissed(false);
      } else {
        const diff = Date.now() - parseInt(lastDismissed, 10);
        // If more than 3 days passed, show banner again
        if (diff > 3 * 24 * 60 * 60 * 1000) {
          setDismissed(false);
        }
      }
    }
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    localStorage.setItem('nest_ios_banner_dismissed_at', Date.now().toString());
  };

  if (dismissed) {
    return <IosInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />;
  }

  return (
    <>
      <div className="fixed bottom-20 left-4 right-4 z-40 md:hidden animate-in slide-in-from-bottom-5 duration-300">
        <div
          onClick={() => setModalOpen(true)}
          className="flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-surface-container-lowest/95 dark:bg-[#121522]/95 backdrop-blur-xl border border-primary/30 shadow-xl cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white shrink-0 shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-headline text-xs font-bold text-on-surface">
                {language === 'ru' ? 'Установить NEST на iPhone' : 'Install NEST on iPhone'}
              </span>
              <span className="block text-[10px] text-secondary">
                {language === 'ru' ? 'Без рамок Safari во весь экран' : 'Full-screen Web App mode'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-primary text-white font-label-caps text-[10px] font-bold uppercase tracking-wider shadow-sm active:scale-95"
            >
              {language === 'ru' ? 'Как?' : 'How?'}
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 rounded-full text-secondary hover:text-on-surface"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <IosInstallModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
