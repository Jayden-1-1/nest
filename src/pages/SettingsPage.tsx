import React, { useState } from 'react';
import { useHome } from '../context/HomeContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../locales';
import { AtmosphereType } from '../types/home';
import { AppTheme, AppLanguage } from '../types/user';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Sparkles, 
  Globe, 
  Bell, 
  Shield, 
  Home as HomeIcon, 
  Trash2, 
  LogOut, 
  Check, 
  AlertTriangle,
  Compass,
  Smartphone
} from 'lucide-react';
import { FontSizeSettingsCard } from '../components/common/FontSizeControl';

interface SettingsPageProps {
  onReplayTutorial?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onReplayTutorial }) => {
  const { currentHome, isOwner, updateHome, deleteHome, leaveHome } = useHome();
  const { user, updateProfile, logout } = useAuth();
  const { theme, setTheme, atmosphere, setAtmosphere, deviceInfo } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'appearance' | 'language' | 'notifications' | 'privacy' | 'home' | 'account'>('appearance');

  const [homeName, setHomeName] = useState(currentHome?.name || '');
  const [homeSaveSuccess, setHomeSaveSuccess] = useState(false);

  const atmospheres: { type: AtmosphereType; label: string; desc: string }[] = [
    { type: 'Clouds', label: t.atmospheres.Clouds, desc: t.atmospheres.descClouds },
    { type: 'Midnight', label: t.atmospheres.Midnight, desc: t.atmospheres.descMidnight },
    { type: 'Sunset', label: t.atmospheres.Sunset, desc: t.atmospheres.descSunset },
    { type: 'Ocean', label: t.atmospheres.Ocean, desc: t.atmospheres.descOcean },
    { type: 'Aurora', label: t.atmospheres.Aurora, desc: t.atmospheres.descAurora },
  ];

  const handleUpdateHomeName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeName.trim()) return;
    updateHome({ name: homeName.trim() });
    setHomeSaveSuccess(true);
    setTimeout(() => setHomeSaveSuccess(false), 2000);
  };

  const handleDeleteHome = () => {
    if (!currentHome) return;
    if (window.confirm(t.settings.homeSettings.deleteHomeConfirm)) {
      deleteHome(currentHome.id);
    }
  };

  const handleLeaveHome = () => {
    if (!currentHome) return;
    if (window.confirm(t.settings.homeSettings.leaveHomeConfirm)) {
      leaveHome(currentHome.id);
    }
  };

  const toggleNotification = (key: keyof NonNullable<typeof user>['notifications']) => {
    if (!user) return;
    updateProfile({
      notifications: {
        ...user.notifications,
        [key]: !user.notifications[key],
      },
    });
  };

  const togglePrivacy = (key: keyof NonNullable<typeof user>['privacy']) => {
    if (!user) return;
    updateProfile({
      privacy: {
        ...user.privacy,
        [key]: !user.privacy[key],
      },
    });
  };

  return (
    <div className="w-full space-y-space-xl max-w-4xl">
      
      {/* Top Header */}
      <section className="pb-space-md border-b border-surface-container-highest">
        <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
          {language === 'ru' ? 'ПАРАМЕТРЫ ДОМА // НАСТРОЙКИ' : 'SANCTUARY PREFERENCES // SETTINGS'}
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
          {t.settings.title}
        </h1>
      </section>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-surface-container-highest pb-2">
        {(['appearance', 'language', 'notifications', 'privacy', 'home', 'account'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-lg font-label-caps text-xs uppercase tracking-wider transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'bg-on-surface text-surface font-bold shadow-sm'
                : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
            }`}
          >
            {t.settings.tabs[tab]}
          </button>
        ))}
      </div>

      {/* Settings Content Panels */}
      <div className="p-space-xl bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl border border-surface-container-highest/60 shadow-card space-y-6">
        
        {/* 1. APPEARANCE */}
        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-headline text-lg font-bold text-on-surface mb-1">
                {t.settings.appearance.theme}
              </h3>
              <p className="font-caption text-xs text-secondary mb-4">
                Choose between warm paper daylight or deep midnight dark mode.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'light' as AppTheme, label: t.settings.appearance.light, icon: Sun },
                  { id: 'dark' as AppTheme, label: t.settings.appearance.dark, icon: Moon },
                  { id: 'system' as AppTheme, label: t.settings.appearance.system, icon: Monitor },
                ].map((th) => {
                  const Icon = th.icon;
                  const isSelected = theme === th.id;
                  return (
                    <button
                      key={th.id}
                      onClick={() => setTheme(th.id)}
                      className={`p-4 rounded-xl border text-left flex flex-col justify-between h-24 transition-all ${
                        isSelected
                          ? 'border-primary bg-primary-fixed/20 ring-1 ring-primary'
                          : 'border-surface-container-highest hover:bg-surface-container-low'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-secondary'}`} />
                      <div className="flex items-center justify-between">
                        <span className="font-label-caps text-xs uppercase font-bold text-on-surface">{th.label}</span>
                        {isSelected && <Check className="w-4 h-4 text-primary" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-surface-container-highest">
              <h3 className="font-headline text-lg font-bold text-on-surface mb-1">
                {t.settings.appearance.homeAtmosphere}
              </h3>
              <p className="font-caption text-xs text-secondary mb-4">
                Calibrated ambient background environments designed to recede behind content.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {atmospheres.map((atm) => {
                  const isSelected = atmosphere === atm.type;
                  return (
                    <button
                      key={atm.type}
                      onClick={() => {
                        setAtmosphere(atm.type);
                        if (isOwner) updateHome({ atmosphere: atm.type });
                      }}
                      className={`p-3.5 rounded-xl border text-left flex items-start justify-between transition-all ${
                        isSelected
                          ? 'border-primary bg-primary-fixed/20 ring-1 ring-primary'
                          : 'border-surface-container-highest hover:bg-surface-container-low'
                      }`}
                    >
                      <div>
                        <span className="font-headline font-bold text-sm text-on-surface block">{atm.label}</span>
                        <span className="font-caption text-xs text-secondary leading-relaxed mt-0.5 block">{atm.desc}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-primary shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Scaling Card (Senior Accessibility & Mom's Reading Comfort) */}
            <div className="pt-6 border-t border-surface-container-highest">
              <FontSizeSettingsCard />
            </div>

            {/* Device Model Recognition & Safe-Area Adaptation Status */}
            <div className="pt-6 border-t border-surface-container-highest space-y-3">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-primary stroke-[2.5]" />
                <h4 className="font-headline text-sm sm:text-base font-bold text-on-surface">
                  {language === 'ru' ? 'Распознавание устройства и экрана' : 'Device Recognition & Adaptation'}
                </h4>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-highest grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-label-caps text-secondary tracking-wider block">
                    {language === 'ru' ? 'Модель устройства' : 'Device Model'}
                  </span>
                  <span className="font-bold text-on-surface text-sm block mt-0.5">
                    {deviceInfo.modelName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-label-caps text-secondary tracking-wider block">
                    {language === 'ru' ? 'Вырез экрана' : 'Screen Cutout'}
                  </span>
                  <span className="font-semibold text-primary block mt-0.5 capitalize">
                    {deviceInfo.screenCutout === 'dynamic-island'
                      ? 'Dynamic Island'
                      : deviceInfo.screenCutout === 'notch'
                      ? 'Apple Notch'
                      : deviceInfo.screenCutout === 'punch-hole'
                      ? 'Android Punch Hole'
                      : 'Стандартный'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-label-caps text-secondary tracking-wider block">
                    {language === 'ru' ? 'Режим запуска' : 'Display Mode'}
                  </span>
                  <span className="font-medium text-on-surface block mt-0.5">
                    {deviceInfo.isStandalone ? '📱 Web App (Экран "Домой")' : '🌐 Вкладка браузера'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-label-caps text-secondary tracking-wider block">
                    {language === 'ru' ? 'Безопасные отступы' : 'Safe Insets'}
                  </span>
                  <span className="font-mono text-secondary block mt-0.5">
                    {deviceInfo.recommendedTopInset}px top / {deviceInfo.recommendedBottomInset}px btm
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. LANGUAGE */}
        {activeTab === 'language' && (
          <div className="space-y-4">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-1">
              {t.settings.language.currentLanguage}
            </h3>
            <p className="font-caption text-xs text-secondary mb-4">
              NEST is fully localized in Russian and English with editorial terminology.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
              {[
                { id: 'ru' as AppLanguage, label: t.settings.language.russian, sub: 'Русский интерфейс' },
                { id: 'en' as AppLanguage, label: t.settings.language.english, sub: 'English Interface' },
              ].map((lang) => {
                const isSelected = language === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => setLanguage(lang.id)}
                    className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-primary bg-primary-fixed/20 ring-1 ring-primary'
                        : 'border-surface-container-highest hover:bg-surface-container-low'
                    }`}
                  >
                    <div>
                      <span className="font-headline font-bold text-sm text-on-surface block">{lang.label}</span>
                      <span className="font-caption text-xs text-secondary">{lang.sub}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. NOTIFICATIONS */}
        {activeTab === 'notifications' && user && (
          <div className="space-y-4">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-1">
              {t.settings.tabs.notifications}
            </h3>
            <p className="font-caption text-xs text-secondary mb-4">
              Configure which moments trigger discreet editorial reminders.
            </p>

            <div className="space-y-3">
              {[
                { key: 'newTask' as const, label: t.settings.notifications.newTask },
                { key: 'comment' as const, label: t.settings.notifications.comment },
                { key: 'invite' as const, label: t.settings.notifications.invite },
                { key: 'overdueTask' as const, label: t.settings.notifications.overdueTask },
                { key: 'deadlineSoon' as const, label: t.settings.notifications.deadlineSoon },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-surface-container-highest cursor-pointer hover:bg-surface-container transition-colors"
                >
                  <span className="font-body-sm text-sm text-on-surface font-medium">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={user.notifications[item.key]}
                    onChange={() => toggleNotification(item.key)}
                    className="w-4 h-4 rounded text-primary focus:ring-0"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 4. PRIVACY */}
        {activeTab === 'privacy' && user && (
          <div className="space-y-4">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-1">
              {t.settings.tabs.privacy}
            </h3>
            <p className="font-caption text-xs text-secondary mb-4">
              Maintain control over your visibility within the family dwelling.
            </p>

            <div className="space-y-3">
              {[
                { key: 'showActivity' as const, label: t.settings.privacy.showActivity },
                { key: 'allowDirectInvites' as const, label: t.settings.privacy.allowDirectInvites },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-surface-container-highest cursor-pointer hover:bg-surface-container transition-colors"
                >
                  <span className="font-body-sm text-sm text-on-surface font-medium">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={user.privacy[item.key]}
                    onChange={() => togglePrivacy(item.key)}
                    className="w-4 h-4 rounded text-primary focus:ring-0"
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {/* 5. HOME SETTINGS */}
        {activeTab === 'home' && currentHome && (
          <div className="space-y-6">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-1">
              {t.settings.tabs.home}
            </h3>

            {isOwner ? (
              <form onSubmit={handleUpdateHomeName} className="space-y-3 max-w-md">
                <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                  {t.settings.homeSettings.homeName}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={homeName}
                    onChange={(e) => setHomeName(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-sm text-on-surface font-headline font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-lg bg-on-surface text-surface font-label-caps text-xs uppercase tracking-wider font-semibold hover:bg-primary transition-colors"
                  >
                    {t.common.save}
                  </button>
                </div>
                {homeSaveSuccess && (
                  <p className="text-xs text-emerald-600 font-medium">Home details saved successfully.</p>
                )}
              </form>
            ) : (
              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-highest">
                <span className="font-label-caps text-xs uppercase text-secondary block mb-1">Current Home</span>
                <span className="font-headline text-lg font-bold text-on-surface">{currentHome.name}</span>
              </div>
            )}

            {/* Interactive Spotlight Tutorial Replay */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-highest space-y-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-primary" />
                <span className="font-headline text-sm sm:text-base font-bold text-on-surface uppercase tracking-tight">
                  {language === 'ru' ? 'Интерактивный тур // Гид по NEST' : 'Interactive Walkthrough // NEST Guide'}
                </span>
              </div>
              <p className="font-body-sm text-xs text-secondary leading-relaxed">
                {language === 'ru'
                  ? 'Запустите интерактивный тур с реальной подсветкой элементов интерфейса, чтобы освежить в памяти структуру Дома, роли участников и цикл доработки.'
                  : 'Start the interactive spotlight tour to refresh your memory on sanctuary layout, roles, and the revision workflow.'}
              </p>
              {onReplayTutorial && (
                <button
                  type="button"
                  onClick={onReplayTutorial}
                  className="btn-snappy px-4 py-2.5 rounded-xl bg-primary text-white font-label-caps text-xs uppercase tracking-wider font-bold shadow-sm hover:opacity-95 flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Compass className="w-4 h-4" />
                  <span>{language === 'ru' ? 'Повторить обучение' : 'Replay tutorial'}</span>
                </button>
              )}
            </div>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-surface-container-highest space-y-3">
              <span className="font-label-caps text-xs uppercase font-bold tracking-widest text-error block">
                {t.settings.homeSettings.dangerZone}
              </span>

              <div className="flex flex-wrap items-center gap-3">
                {isOwner ? (
                  <button
                    type="button"
                    onClick={handleDeleteHome}
                    className="px-4 py-2 rounded-lg border border-error/30 text-error hover:bg-error-container/20 font-label-caps text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t.settings.homeSettings.deleteHome}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleLeaveHome}
                    className="px-4 py-2 rounded-lg border border-error/30 text-error hover:bg-error-container/20 font-label-caps text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.settings.homeSettings.leaveHome}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 6. ACCOUNT */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-1">
              {t.settings.tabs.account}
            </h3>

            <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-highest space-y-2">
              <span className="font-label-caps text-xs uppercase text-secondary tracking-widest block font-bold">
                Tier: Architectural Standard (Unrestricted)
              </span>
              <p className="font-body-sm text-xs text-secondary leading-relaxed">
                NEST architectural tier includes unlimited tasks, multiple homes, full activity chronicle, and collaborative discussion without paywalls.
              </p>
            </div>

            <div className="pt-4 border-t border-surface-container-highest flex items-center justify-between">
              <span className="font-caption text-xs text-secondary">Logged in as {user?.email}</span>
              <button
                type="button"
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-surface-container hover:bg-error-container/20 text-error font-label-caps text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.nav.logout}</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
