import React, { useState } from 'react';
import { NestLogo } from '../common/NestLogo';
import { useHome } from '../../context/HomeContext';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../locales';
import { AtmosphereType } from '../../types/home';
import { ChevronDown, Moon, Sun, Globe, Sparkles, User, Plus, LogOut, Check, Search } from 'lucide-react';

interface AppHeaderProps {
  onOpenCreateHome: () => void;
  onOpenJoinHome: () => void;
  onNavigate: (route: string) => void;
  onOpenCommandPalette?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenCreateHome,
  onOpenJoinHome,
  onNavigate,
  onOpenCommandPalette,
}) => {
  const { currentHome, allHomes, switchHome, currentUserRole } = useHome();
  const { user, switchDemoUser, logout } = useAuth();
  const { theme, setTheme, atmosphere, setAtmosphere, isDark } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  const [homeDropdownOpen, setHomeDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [atmosphereOpen, setAtmosphereOpen] = useState(false);

  const atmospheres: AtmosphereType[] = ['Clouds', 'Midnight', 'Sunset', 'Ocean', 'Aurora'];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-surface/90 backdrop-blur-md border-b border-surface-container-highest transition-colors">
      <div className="w-full h-full px-margin-mobile md:px-margin flex items-center justify-between">
        
        {/* Left: Brand & Home Switcher */}
        <div className="flex items-center gap-space-md lg:gap-space-lg">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-space-sm hover:opacity-90 transition-opacity focus:outline-none"
            title="NEST Digital Home"
          >
            <NestLogo variant="wordmark" className="h-6 w-auto" />
          </button>

          <span className="hidden md:inline-block w-px h-4 bg-outline-variant/40" />

          {/* Home Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setHomeDropdownOpen(!homeDropdownOpen);
                setUserDropdownOpen(false);
                setAtmosphereOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-container-low hover:bg-surface-container transition-colors text-left"
            >
              <div className="flex flex-col">
                <span className="font-label-caps text-[11px] font-bold tracking-wider uppercase text-on-surface truncate max-w-[140px] sm:max-w-[200px]">
                  {currentHome?.name || t.common.appName}
                </span>
                {currentUserRole && (
                  <span className="font-caption text-[10px] text-secondary tracking-widest uppercase">
                    {t.roles[currentUserRole]}
                  </span>
                )}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-secondary shrink-0" />
            </button>

            {homeDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-popover border border-surface-container-highest py-2 z-50">
                <div className="px-3 py-1 text-[10px] font-label-caps uppercase text-secondary tracking-widest border-b border-surface-container-highest mb-1">
                  {t.nav.switchHome}
                </div>
                {allHomes.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      switchHome(h.id);
                      setHomeDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 flex items-center justify-between text-left hover:bg-surface-container transition-colors ${
                      h.id === currentHome?.id ? 'bg-surface-container font-semibold text-primary' : 'text-on-surface'
                    }`}
                  >
                    <div>
                      <div className="font-body-md text-body-sm">{h.name}</div>
                      <div className="font-caption text-[10px] text-secondary">{h.atmosphere}</div>
                    </div>
                    {h.id === currentHome?.id && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}

                <div className="border-t border-surface-container-highest mt-1 pt-1">
                  <button
                    onClick={() => {
                      setHomeDropdownOpen(false);
                      onOpenCreateHome();
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2 text-left font-caption text-caption text-primary hover:bg-surface-container transition-colors font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.nav.createHome}</span>
                  </button>
                  <button
                    onClick={() => {
                      setHomeDropdownOpen(false);
                      onOpenJoinHome();
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2 text-left font-caption text-caption text-on-surface-variant hover:bg-surface-container transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>{t.nav.joinHome}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Controls & Persona Switcher */}
        <div className="flex items-center gap-space-sm sm:gap-space-md">
          
          {/* Quick Search / Command Palette Trigger */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-surface-container-low hover:bg-surface-container transition-all text-secondary hover:text-on-surface text-caption font-caption"
              title="Search and commands (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-secondary" />
              <span className="hidden lg:inline text-[11px] font-label-caps uppercase">{t.common.search}</span>
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.2 text-[9px] font-mono uppercase bg-surface-container-highest/60 rounded text-secondary border border-surface-container-highest">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Atmosphere Picker Button */}
          <div className="relative">
            <button
              onClick={() => {
                setAtmosphereOpen(!atmosphereOpen);
                setHomeDropdownOpen(false);
                setUserDropdownOpen(false);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-surface-container-low hover:bg-surface-container transition-colors text-secondary hover:text-on-surface font-caption text-caption"
              title={t.atmospheres.title}
            >
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="hidden sm:inline font-label-caps text-[11px] uppercase tracking-wider">{atmosphere}</span>
            </button>

            {atmosphereOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-surface-container-lowest rounded-xl shadow-popover border border-surface-container-highest py-2 z-50">
                <div className="px-3 py-1 text-[10px] font-label-caps uppercase text-secondary tracking-widest border-b border-surface-container-highest mb-1">
                  {t.atmospheres.title}
                </div>
                {atmospheres.map((atm) => (
                  <button
                    key={atm}
                    onClick={() => {
                      setAtmosphere(atm);
                      setAtmosphereOpen(false);
                    }}
                    className={`w-full px-3 py-2 flex items-center justify-between text-left hover:bg-surface-container transition-colors font-body-sm text-body-sm ${
                      atmosphere === atm ? 'text-primary font-bold' : 'text-on-surface'
                    }`}
                  >
                    <span>{t.atmospheres[atm]}</span>
                    {atmosphere === atm && <Check className="w-4 h-4 text-primary" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
            className="px-2 py-1 rounded-md bg-surface-container-low hover:bg-surface-container transition-colors font-label-caps text-[11px] font-bold text-on-surface uppercase tracking-wider"
            title="Toggle Language"
          >
            {language.toUpperCase()}
          </button>

          {/* Theme Mode Switcher */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className="p-1.5 rounded-md bg-surface-container-low hover:bg-surface-container transition-colors text-secondary hover:text-on-surface"
            title={isDark ? "Switch to Warm Paper" : "Switch to Midnight"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <span className="w-px h-4 bg-outline-variant/40" />

          {/* User Persona & Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setUserDropdownOpen(!userDropdownOpen);
                setHomeDropdownOpen(false);
                setAtmosphereOpen(false);
              }}
              className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-primary/20 transition-all focus:outline-none"
            >
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-surface-container-highest"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User className="w-4 h-4" />
                </div>
              )}
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-xl shadow-popover border border-surface-container-highest py-2 z-50">
                <div className="px-3 py-2 border-b border-surface-container-highest">
                  <div className="font-headline-sm text-body-md font-bold text-on-surface">{user?.displayName}</div>
                  <div className="font-caption text-caption text-secondary">@{user?.username} · {user?.email}</div>
                </div>

                {/* Quick Persona Switcher */}
                <div className="px-3 pt-2 pb-1 text-[10px] font-label-caps uppercase text-secondary tracking-widest">
                  {t.auth.demoAccount}
                </div>
                <button
                  onClick={() => {
                    switchDemoUser('alexey');
                    setUserDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 flex items-center justify-between text-left text-body-sm hover:bg-surface-container ${
                    user?.username === 'alexey' ? 'text-primary font-semibold' : 'text-on-surface'
                  }`}
                >
                  <span>{t.auth.alexey}</span>
                  {user?.username === 'alexey' && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
                <button
                  onClick={() => {
                    switchDemoUser('elena');
                    setUserDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 flex items-center justify-between text-left text-body-sm hover:bg-surface-container ${
                    user?.username === 'elena' ? 'text-primary font-semibold' : 'text-on-surface'
                  }`}
                >
                  <span>{t.auth.elena}</span>
                  {user?.username === 'elena' && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>
                <button
                  onClick={() => {
                    switchDemoUser('dmitry');
                    setUserDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-1.5 flex items-center justify-between text-left text-body-sm hover:bg-surface-container ${
                    user?.username === 'dmitry' ? 'text-primary font-semibold' : 'text-on-surface'
                  }`}
                >
                  <span>{t.auth.dmitry}</span>
                  {user?.username === 'dmitry' && <Check className="w-3.5 h-3.5 text-primary" />}
                </button>

                <div className="border-t border-surface-container-highest mt-2 pt-1">
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onNavigate('profile');
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2 text-left font-caption text-caption text-on-surface hover:bg-surface-container"
                  >
                    <User className="w-4 h-4 text-secondary" />
                    <span>{t.nav.profile}</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-3 py-2 flex items-center gap-2 text-left font-caption text-caption text-error hover:bg-error-container/20"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t.nav.logout}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
