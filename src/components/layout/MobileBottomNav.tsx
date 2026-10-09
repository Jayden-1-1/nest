import React, { useState } from 'react';
import { useTranslation } from '../../locales';
import { useTasks } from '../../context/TaskContext';
import { useCoupons } from '../../context/CouponContext';
import { useTheme } from '../../context/ThemeContext';
import { formatLocalDate } from '../../utils/date';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  Ticket, 
  Menu,
  StickyNote,
  ShoppingBag,
  TrendingUp,
  History,
  Users,
  Settings as SettingsIcon,
  User,
  X,
  Smartphone,
  Moon,
  Sun,
  Sparkles
} from 'lucide-react';
import { IosInstallModal, isIosDevice, isStandaloneMode } from '../pwa/IosInstallPrompt';

interface MobileBottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentRoute, onNavigate }) => {
  const { t, language, setLanguage } = useTranslation();
  const { tasks } = useTasks();
  const { coupons } = useCoupons();
  const { isDark, setTheme, atmosphere, setAtmosphere, fontScale, setFontScale, deviceInfo } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);

  const todayStr = formatLocalDate(new Date());
  const pendingTasksCount = tasks.filter((task) => task.date === todayStr && task.status !== 'DONE').length;
  const availableCouponsCount = coupons.filter((coupon) => coupon.status === 'AVAILABLE').length;

  const mainTabs = [
    { id: 'home', label: t.nav.home, icon: LayoutDashboard },
    { 
      id: 'tasks', 
      label: t.nav.tasks, 
      icon: CheckSquare, 
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined 
    },
    { id: 'calendar', label: t.nav.calendar, icon: CalendarIcon },
    { 
      id: 'coupons', 
      label: t.nav.coupons, 
      icon: Ticket, 
      badge: availableCouponsCount > 0 ? availableCouponsCount : undefined 
    },
  ];

  const moreMenuItems = [
    { id: 'fridge', label: t.nav.fridge, icon: StickyNote, desc: language === 'ru' ? 'Семейные записки' : 'Family notes' },
    { id: 'shopping', label: t.nav.shopping, icon: ShoppingBag, desc: language === 'ru' ? 'Список покупок' : 'Grocery list' },
    { id: 'progress', label: t.nav.progress, icon: TrendingUp, desc: language === 'ru' ? 'Аналитика и серии' : 'Streaks & analytics' },
    { id: 'activity', label: t.nav.activity, icon: History, desc: language === 'ru' ? 'Хроника событий' : 'Activity log' },
    { id: 'members', label: t.nav.members, icon: Users, desc: language === 'ru' ? 'Участники семьи' : 'Family circle' },
    { id: 'profile', label: t.nav.profile, icon: User, desc: language === 'ru' ? 'Личный профиль' : 'My profile' },
    { id: 'settings', label: t.nav.settings, icon: SettingsIcon, desc: language === 'ru' ? 'Настройки Дома' : 'Sanctuary settings' },
  ];

  const handleSelectMoreItem = (id: string) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  const isMoreRouteActive = moreMenuItems.some((item) => item.id === currentRoute);

  return (
    <>
      {/* =========================================================================
          MAIN IPHONE BOTTOM NAVIGATION BAR (FIXED, SAFE-AREA AWARE)
          ========================================================================= */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-surface/90 dark:bg-[#0E1019]/90 backdrop-blur-2xl border-t border-surface-container-highest/70 md:hidden select-none transition-colors">
        <div className="flex items-center justify-around h-16 px-1">
          {mainTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentRoute === tab.id;

            return (
              <button
                key={tab.id}
                data-tutorial-target={`nav-${tab.id}`}
                onClick={() => onNavigate(tab.id)}
                className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-all duration-150 active:scale-90 select-none ${
                  isActive ? 'text-primary' : 'text-secondary hover:text-on-surface'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 leading-none transition-transform" />
                  {typeof tab.badge === 'number' && tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-primary text-white text-[9px] font-mono font-bold flex items-center justify-center shadow-xs">
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </span>
                  )}
                </div>
                <span className="font-label-caps text-[10px] mt-1 tracking-wider uppercase font-bold">
                  {tab.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-6 h-[2.5px] rounded-full bg-primary transition-all" />
                )}
              </button>
            );
          })}

          {/* 5th Tab: Menu / More */}
          <button
            onClick={() => setMenuOpen(true)}
            className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[48px] py-1 transition-all duration-150 active:scale-90 select-none ${
              isMoreRouteActive || menuOpen ? 'text-primary' : 'text-secondary hover:text-on-surface'
            }`}
          >
            <div className="relative">
              <Menu className="w-5 h-5 leading-none transition-transform" />
              {isMoreRouteActive && (
                <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
            <span className="font-label-caps text-[10px] mt-1 tracking-wider uppercase font-bold">
              {language === 'ru' ? 'Меню' : 'Menu'}
            </span>
            {(isMoreRouteActive || menuOpen) && (
              <span className="absolute bottom-1 w-6 h-[2.5px] rounded-full bg-primary transition-all" />
            )}
          </button>
        </div>
      </nav>

      {/* =========================================================================
          NATIVE IOS STYLE BOTTOM SHEET MENU
          ========================================================================= */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-[100010] flex items-end justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-200 md:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-h-[85vh] bg-surface-container-lowest dark:bg-[#121522] rounded-t-3xl border-t border-surface-container-highest shadow-2xl p-5 space-y-5 animate-in slide-in-from-bottom duration-300 pb-safe overflow-y-auto scroll-touch relative"
          >
            {/* iOS Pull-down Handle */}
            <div className="w-10 h-1.5 rounded-full bg-surface-container-highest mx-auto opacity-70" />

            {/* Menu Header */}
            <div className="flex items-center justify-between border-b border-surface-container-highest/60 pb-3">
              <div>
                <h3 className="font-display text-base font-black uppercase tracking-tight text-on-surface">
                  {language === 'ru' ? 'Разделы NEST' : 'NEST Sections'}
                </h3>
                <span className="text-[11px] text-secondary">
                  {language === 'ru' ? 'Все инструменты семейного Дома' : 'All family sanctuary tools'}
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-secondary hover:text-on-surface cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sections Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {moreMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectMoreItem(item.id)}
                    className={`flex items-start gap-3 p-3 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer ${
                      isActive
                        ? 'bg-primary/10 border-primary text-primary font-bold shadow-sm'
                        : 'bg-surface-container-low/70 border-surface-container-highest/80 hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isActive ? 'bg-primary text-white' : 'bg-surface-container text-secondary'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block font-headline text-xs font-bold truncate">
                        {item.label}
                      </span>
                      <span className="block text-[10px] text-secondary truncate mt-0.5">
                        {item.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Font Size Controls for Mom & Family */}
            <div className="pt-2 border-t border-surface-container-highest/60 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-label-caps uppercase text-secondary">
                <span className="font-bold">{language === 'ru' ? 'Размер шрифта для чтения' : 'Text Reading Size'}</span>
                <span className="font-mono text-primary font-bold">
                  {fontScale === 'standard' ? '100%' : fontScale === 'medium' ? '112%' : fontScale === 'large' ? '125%' : '140%'}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'standard', label: 'Обычный', tag: 'A' },
                  { id: 'medium', label: 'Средний', tag: 'A+' },
                  { id: 'large', label: 'Крупный', tag: 'A++' },
                  { id: 'extra', label: 'Макс', tag: 'A+++' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setFontScale(s.id as any)}
                    className={`py-2 px-1 rounded-xl text-center font-bold text-xs transition-all active:scale-95 cursor-pointer ${
                      fontScale === s.id
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface-container-low border border-surface-container-highest text-secondary'
                    }`}
                  >
                    <span className="block text-[11px]">{s.tag}</span>
                    <span className="block text-[9px] font-normal truncate mt-0.5">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick System Settings Row */}
            <div className="pt-2 border-t border-surface-container-highest/60 flex items-center justify-between gap-2">
              {/* Language Toggle */}
              <button
                onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-surface-container-low border border-surface-container-highest font-label-caps text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-on-surface active:scale-95"
              >
                <span>Язык: {language.toUpperCase()}</span>
              </button>

              {/* Theme Mode Toggle */}
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-surface-container-low border border-surface-container-highest font-label-caps text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-on-surface active:scale-95"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
                <span>{isDark ? 'Светлая' : 'Тёмная'}</span>
              </button>
            </div>

            {/* Device Model Info Badge */}
            <div className="px-3 py-2 rounded-xl bg-surface-container-low/60 border border-surface-container-highest/60 flex items-center justify-between text-[11px] text-secondary">
              <span className="flex items-center gap-1.5 font-medium">
                <Smartphone className="w-3.5 h-3.5 text-primary" />
                <span className="truncate max-w-[170px]">{deviceInfo.modelName}</span>
              </span>
              <span className="font-mono text-[10px] text-primary font-bold">
                {deviceInfo.isStandalone ? 'Web App' : deviceInfo.screenCutout === 'dynamic-island' ? 'Dynamic Island' : 'Mobile'}
              </span>
            </div>

            {/* Install Web App CTA Button */}
            {isIosDevice() && !isStandaloneMode() && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setInstallModalOpen(true);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-primary/15 border border-primary/30 text-primary font-label-caps text-xs uppercase font-extrabold flex items-center justify-center gap-2 active:scale-98 cursor-pointer shadow-sm"
              >
                <Smartphone className="w-4 h-4" />
                <span>{language === 'ru' ? 'Установить Web App на iPhone' : 'Install iPhone Web App'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* PWA Install Modal */}
      <IosInstallModal isOpen={installModalOpen} onClose={() => setInstallModalOpen(false)} />
    </>
  );
};
