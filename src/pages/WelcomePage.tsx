import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { NestLogo } from '../components/common/NestLogo';
import { AtmosphereBackdrop } from '../components/common/AtmosphereBackdrop';
import { StatusPill } from '../components/common/StatusPill';
import { PriorityTag } from '../components/common/PriorityTag';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { Avatar } from '../components/common/Avatar';
import { useTranslation } from '../locales';
import { useTheme } from '../context/ThemeContext';
import { AtmosphereType } from '../types/home';
import { LegalDocId } from '../data/legalDocs';
import { IosInstallBanner } from '../components/pwa/IosInstallPrompt';

const LegalDocsModal = React.lazy(() => import('../components/legal/LegalDocsModal').then(m => ({ default: m.LegalDocsModal })));
import { 
  HeroPenUnderline, 
  PenStar 
} from '../components/common/ControlledImperfection';
import { 
  ArrowRight, 
  ArrowDown, 
  Check, 
  Sparkles, 
  Home, 
  ShoppingBag, 
  PawPrint, 
  GraduationCap, 
  Users, 
  HeartPulse, 
  TrendingUp, 
  Sun, 
  Moon, 
  Paperclip, 
  Clock, 
  Calendar, 
  AlertCircle, 
  RotateCcw, 
  BookOpen, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { ROLE_AVATARS } from '../utils/avatars';

interface WelcomePageProps {
  onEnter: (mode?: 'login' | 'register' | 'code') => void;
}

// Gentle harmonic 3-chord chime on task completion
const playDemoChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [587.33, 739.99, 880.00];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.07);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.07);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + i * 0.07 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.07 + 0.45);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.07);
      osc.stop(ctx.currentTime + i * 0.07 + 0.45);
    });
  } catch {
    // Audio context may be restricted
  }
};

export const WelcomePage: React.FC<WelcomePageProps> = ({ onEnter }) => {
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme, atmosphere, setAtmosphere, isDark } = useTheme();

  // Interactive Demo Task State
  const [demoTaskDone, setDemoTaskDone] = useState(false);
  const [demoFeedbackMessage, setDemoFeedbackMessage] = useState<string | null>(null);

  // Selected Role State
  const [activeRoleTab, setActiveRoleTab] = useState<'OWNER' | 'PARENT' | 'MEMBER'>('OWNER');

  // Selected Calendar Demo Day
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<'today' | 'tomorrow' | 'sunday'>('today');

  // Legal Document Modal State
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [selectedLegalDoc, setSelectedLegalDoc] = useState<LegalDocId>('privacy-guarantee');

  const openLegalDoc = (id: LegalDocId) => {
    setSelectedLegalDoc(id);
    setLegalModalOpen(true);
  };

  const handleToggleDemoTask = () => {
    const nextState = !demoTaskDone;
    setDemoTaskDone(nextState);

    if (nextState) {
      playDemoChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#0F4CFF', '#00D1FF', '#10B981', '#FFB800'],
      });
      setDemoFeedbackMessage(t.welcome.interactiveTaskDoneFeedback);
    } else {
      setDemoFeedbackMessage(t.welcome.interactiveTaskUndoFeedback);
    }

    setTimeout(() => {
      setDemoFeedbackMessage(null);
    }, 3500);
  };

  const atmospheresList: { id: AtmosphereType; name: string; desc: string }[] = [
    { id: 'Midnight', name: t.welcome.atmoMidnightName, desc: t.welcome.atmoMidnightDesc },
    { id: 'Clouds', name: t.welcome.atmoCloudsName, desc: t.welcome.atmoCloudsDesc },
    { id: 'Sunset', name: t.welcome.atmoSunsetName, desc: t.welcome.atmoSunsetDesc },
    { id: 'Ocean', name: t.welcome.atmoOceanName, desc: t.welcome.atmoOceanDesc },
    { id: 'Aurora', name: t.welcome.atmoAuroraName, desc: t.welcome.atmoAuroraDesc },
  ];

  return (
    <div className="relative min-h-screen text-on-surface selection:bg-primary/20 selection:text-primary transition-colors duration-300 font-sans pb-20">
      
      {/* Dynamic Generative Atmosphere Canvas Backdrop (Fixed in background z-0) */}
      <AtmosphereBackdrop atmosphere={atmosphere} />

      {/* TOP STICKY NAVIGATION BAR (Explicit relative z-40) */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-surface/85 dark:bg-surface/85 border-b border-surface-container-highest/70 transition-colors pt-safe">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          
          {/* Logo 1: Single header branding */}
          <div className="flex items-center gap-3">
            <NestLogo height={26} className="h-6.5 w-auto" />
            <span className="font-headline text-sm font-bold tracking-tight text-on-surface hidden sm:inline">
              {t.welcome.headerBrand}
            </span>
          </div>

          {/* Quick Section Nav */}
          <nav className="hidden lg:flex items-center gap-6 font-label-caps text-xs uppercase tracking-wider text-secondary">
            <a href="#what-is-nest" className="hover:text-primary transition-colors">
              {language === 'ru' ? 'Что такое NEST' : 'What is NEST'}
            </a>
            <a href="#family-home" className="hover:text-primary transition-colors">
              {language === 'ru' ? 'Семья и роли' : 'Family & Roles'}
            </a>
            <a href="#tasks" className="hover:text-primary transition-colors">
              {language === 'ru' ? 'Задачи' : 'Tasks'}
            </a>
            <a href="#calendar" className="hover:text-primary transition-colors">
              {language === 'ru' ? 'Календарь' : 'Calendar'}
            </a>
            <a href="#progress" className="hover:text-primary transition-colors">
              {language === 'ru' ? 'Прогресс' : 'Progress'}
            </a>
            <a href="#atmosphere" className="hover:text-primary transition-colors">
              {language === 'ru' ? 'Атмосферы' : 'Atmosphere'}
            </a>
          </nav>

          {/* Controls: Language, Theme, and Sign In */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
              className="px-2.5 py-1 rounded-lg border border-surface-container-highest bg-surface-container-low text-xs font-mono font-bold text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              title="Switch language"
            >
              {language === 'ru' ? 'EN' : 'RU'}
            </button>

            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-1.5 rounded-lg border border-surface-container-highest bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => onEnter('login')}
              className="px-4 py-1.5 rounded-xl text-xs font-semibold font-label-caps uppercase tracking-wider text-secondary hover:text-on-surface transition-colors cursor-pointer"
            >
              {t.auth.login}
            </button>

            <button
              onClick={() => onEnter('register')}
              className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold font-label-caps uppercase tracking-wider hover:bg-primary/90 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              {t.welcome.ctaCreate}
            </button>
          </div>

        </div>
      </header>

      {/* MAIN CONTENT (Explicit relative z-10 on top of the atmosphere) */}
      <main className="relative z-10 space-y-20 sm:space-y-28 pt-4">

        {/* =========================================================================
            SECTION 1 — HERO
            ========================================================================= */}
        <section className="relative min-h-[calc(100vh-5rem)] flex flex-col justify-between max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto">
            
            {/* Left Column: Hero Narrative & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Logo 2 / Branding block: NEST System */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest/80 dark:bg-surface-container-lowest/80 backdrop-blur-md border border-surface-container-highest text-primary font-mono text-xs font-semibold tracking-wider">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>{t.welcome.heroBrand}</span>
              </div>

              <div>
                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase text-on-surface leading-[1.05]">
                  <span className="relative inline-block whitespace-nowrap">
                    <span>{t.welcome.heroTitlePart1}</span>
                    <HeroPenUnderline className="absolute left-0 -bottom-1 sm:-bottom-2 w-full h-2.5 sm:h-3.5 text-primary" />
                  </span>{' '}
                  <span>{t.welcome.heroTitlePart2}</span>
                </h1>
              </div>

              <p className="font-body-lg text-secondary text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl">
                {t.welcome.heroSubtitle}
              </p>

              {/* Primary Calls to Action */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onEnter('register')}
                  className="relative overflow-hidden group px-8 py-4 rounded-2xl bg-primary text-white font-label-caps text-sm uppercase tracking-wider font-extrabold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/30 active:scale-[0.98] flex items-center gap-2.5 cursor-pointer"
                >
                  <span className="relative z-10">{t.welcome.ctaCreate}</span>
                  <ArrowRight className="relative z-10 w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none transition-transform" />
                </button>

                <button
                  onClick={() => onEnter('code')}
                  className="px-7 py-4 rounded-2xl bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 hover:bg-surface-container border border-surface-container-highest text-on-surface font-label-caps text-sm uppercase tracking-wider font-bold transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer backdrop-blur-md hover:border-primary/40"
                >
                  <Home className="w-4 h-4 text-primary" />
                  <span>{t.welcome.ctaJoin}</span>
                </button>
              </div>

              {/* Direct Auth Navigation & Trust Badges */}
              <div className="pt-4 border-t border-surface-container-highest/70 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-secondary font-medium">
                  <span>{language === 'ru' ? 'Уже есть семья в NEST?' : 'Already have a Home?'}</span>
                  <button
                    onClick={() => onEnter('login')}
                    className="font-bold text-primary hover:underline uppercase tracking-wider font-label-caps text-[11px] cursor-pointer"
                  >
                    {language === 'ru' ? 'Войти в аккаунт' : 'Sign In'}
                  </button>
                  <span className="text-surface-container-highest">·</span>
                  <button
                    onClick={() => onEnter('code')}
                    className="font-bold text-on-surface hover:text-primary uppercase tracking-wider font-label-caps text-[11px] cursor-pointer"
                  >
                    {language === 'ru' ? 'Войти по коду' : 'Join by Code'}
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-mono text-secondary">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{language === 'ru' ? 'Защищённое семейное пространство' : 'Protected Family Space'}</span>
                </div>
              </div>

            </div>

            {/* Right Column: Live Interface Preview Card (Real Family Tasks) */}
            <div className="lg:col-span-5 flex justify-center relative">
              {/* Floating Badge 1 (Top Left) */}
              <div className="absolute -top-4 -left-4 z-20 hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-xl border border-surface-container-highest shadow-xl animate-float">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-label-caps text-xs font-bold text-on-surface">
                  {language === 'ru' ? 'Ритм семьи · +25 ⭐️' : 'Family Rhythm · +25 ⭐️'}
                </span>
              </div>

              {/* Floating Badge 2 (Bottom Right) */}
              <div className="absolute -bottom-4 -right-4 z-20 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-surface-container-lowest/95 backdrop-blur-xl border border-surface-container-highest shadow-xl animate-float-delayed">
                <span className="text-base">🎟️</span>
                <div className="text-left">
                  <span className="block font-label-caps text-[9px] uppercase font-bold text-indigo-400">
                    {language === 'ru' ? 'Семейный билет' : 'Family Privilege'}
                  </span>
                  <span className="block font-display text-xs font-black text-on-surface">
                    {language === 'ru' ? 'Играть всю ночь' : 'Play All Night'}
                  </span>
                </div>
              </div>

              {/* Ambient Underglow behind Preview Card */}
              <div className="absolute inset-4 bg-primary/15 rounded-3xl blur-3xl -z-10 animate-pulse pointer-events-none" />

              <div className="w-full max-w-md bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 backdrop-blur-2xl rounded-3xl p-6 sm:p-7 border border-surface-container-highest/80 shadow-2xl space-y-4 hover:shadow-primary/10 transition-shadow">
                
                <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-label-caps text-xs uppercase tracking-wider font-bold text-on-surface">
                      {t.welcome.heroPreviewBadge}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-secondary">
                    {t.common.today}
                  </span>
                </div>

                {/* Sample Task 1: Chores (Interactive with tactile completion chime & confetti) */}
                <div
                  onClick={handleToggleDemoTask}
                  className={`p-3.5 rounded-2xl border transition-all duration-300 space-y-2 cursor-pointer select-none ${
                    demoTaskDone
                      ? 'bg-emerald-500/10 border-emerald-500/40 shadow-sm'
                      : 'bg-surface-container-low/70 border-surface-container-highest/80 hover:border-primary/50'
                  }`}
                  role="button"
                  tabIndex={0}
                  title={language === 'ru' ? 'Нажмите, чтобы попробовать завершить задачу!' : 'Click to try completing a task!'}
                >
                  <div className="flex items-center justify-between">
                    <CategoryBadge category="CHORES" size="xs" />
                    {demoTaskDone ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-label-caps text-[10px] font-bold flex items-center gap-1 animate-in zoom-in-75">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>{t.common.completed}</span>
                      </span>
                    ) : (
                      <PriorityTag priority="HIGH" size="sm" />
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center transition-colors ${
                        demoTaskDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-surface-container-highest bg-surface-container hover:border-primary'
                      }`}>
                        {demoTaskDone && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div>
                        <h4 className={`font-headline font-bold text-sm transition-all ${
                          demoTaskDone ? 'line-through text-secondary' : 'text-on-surface'
                        }`}>
                          {t.welcome.sampleTask1Title}
                        </h4>
                        <p className="text-[11px] text-secondary line-clamp-1 mt-0.5">
                          {t.welcome.sampleTask1Desc}
                        </p>
                      </div>
                    </div>
                    <Avatar src={ROLE_AVATARS[2].url} name={t.welcome.alexeyName} size="xs" ring={true} />
                  </div>
                </div>

                {demoFeedbackMessage && (
                  <div className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-caption text-center animate-in fade-in zoom-in-95 duration-200">
                    {demoFeedbackMessage}
                  </div>
                )}

                {/* Sample Task 2: Groceries */}
                <div className="p-3.5 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <CategoryBadge category="SHOPPING" size="xs" />
                    <PriorityTag priority="MEDIUM" size="sm" />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-headline font-bold text-sm text-on-surface">
                        {t.welcome.sampleTask2Title}
                      </h4>
                      <p className="text-[11px] text-secondary line-clamp-1 mt-0.5">
                        {t.welcome.sampleTask2Desc}
                      </p>
                    </div>
                    <Avatar src={ROLE_AVATARS[2].url} name={t.welcome.alexeyName} size="xs" ring={true} />
                  </div>
                </div>

                {/* Sample Task 3: Pets */}
                <div className="p-3.5 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <CategoryBadge category="PETS" size="xs" />
                    <StatusPill status="DONE" size="sm" />
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-headline font-bold text-sm line-through text-secondary">
                        {t.welcome.sampleTask3Title}
                      </h4>
                      <p className="text-[11px] text-secondary line-clamp-1 mt-0.5">
                        {t.welcome.sampleTask3Desc}
                      </p>
                    </div>
                    <Avatar src={ROLE_AVATARS[2].url} name={t.welcome.alexeyName} size="xs" ring={true} />
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <a
                    href="#what-is-nest"
                    className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline font-label-caps uppercase tracking-wider"
                  >
                    <span>{language === 'ru' ? 'Как устроен NEST' : 'How NEST works'}</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            </div>

          </div>

        </section>

        {/* =========================================================================
            SECTION 2 — WHAT IS NEST? (Plain language + Before/After)
            ========================================================================= */}
        <section id="what-is-nest" className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 backdrop-blur-2xl border border-surface-container-highest/80 shadow-2xl space-y-8">
            
            {/* Header directly inside card */}
            <div className="space-y-3 pb-6 border-b border-surface-container-highest/60">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase block">
                {t.welcome.whatIsNestTag}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
                {t.welcome.whatIsNestTitle}
              </h2>
              <p className="font-body-md text-secondary text-sm sm:text-base leading-relaxed max-w-3xl">
                {t.welcome.whatIsNestDesc}
              </p>
            </div>

            {/* Visual Comparison: Before (Chaos) vs After (NEST Harmony) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* The Before Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-error-container/15 border border-error/30 backdrop-blur-md space-y-4">
                <div className="flex items-center gap-2.5 text-error">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <h3 className="font-headline font-bold text-base uppercase tracking-wide">
                    {t.welcome.beforeTitle}
                  </h3>
                </div>
                <p className="text-xs text-secondary italic">
                  {t.welcome.beforeSubtitle}
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-secondary">
                  <li className="flex items-start gap-2.5">
                    <span className="text-error font-bold shrink-0">✕</span>
                    <span>{t.welcome.beforeP1}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-error font-bold shrink-0">✕</span>
                    <span>{t.welcome.beforeP2}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-error font-bold shrink-0">✕</span>
                    <span>{t.welcome.beforeP3}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-error font-bold shrink-0">✕</span>
                    <span>{t.welcome.beforeP4}</span>
                  </li>
                </ul>
              </div>

              {/* The After Card (NEST) */}
              <div className="p-6 sm:p-7 rounded-2xl bg-primary/10 border border-primary/30 backdrop-blur-md space-y-4">
                <div className="flex items-center gap-2.5 text-primary">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <h3 className="font-headline font-bold text-base uppercase tracking-wide">
                    {t.welcome.afterTitle}
                  </h3>
                </div>
                <p className="text-xs text-secondary italic">
                  {t.welcome.afterSubtitle}
                </p>
                <ul className="space-y-3 text-xs sm:text-sm text-on-surface">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5 stroke-[3]" />
                    <span>{t.welcome.afterP1}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5 stroke-[3]" />
                    <span>{t.welcome.afterP2}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5 stroke-[3]" />
                    <span>{t.welcome.afterP3}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5 stroke-[3]" />
                    <span>{t.welcome.afterP4}</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 3 — YOUR FAMILY HOME (Our Family Home & Roles)
            ========================================================================= */}
        <section id="family-home" className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 backdrop-blur-2xl border border-surface-container-highest/80 shadow-2xl space-y-8">
            
            {/* Header directly inside card */}
            <div className="space-y-3 pb-6 border-b border-surface-container-highest/60">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase block">
                {t.welcome.familyHomeTag}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
                {t.welcome.familyHomeTitle}
              </h2>
              <p className="font-body-md text-secondary text-sm sm:text-base leading-relaxed max-w-3xl">
                {t.welcome.familyHomeDesc}
              </p>
            </div>

            {/* Interactive Role Switcher Tabs */}
            <div className="flex justify-start sm:justify-center">
              <div className="p-1 rounded-2xl bg-surface-container-low border border-surface-container-highest flex gap-1">
                <button
                  onClick={() => setActiveRoleTab('OWNER')}
                  className={`px-4 sm:px-6 py-2.5 rounded-xl font-label-caps text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeRoleTab === 'OWNER'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  {t.welcome.roleOwnerTitle}
                </button>
                <button
                  onClick={() => setActiveRoleTab('PARENT')}
                  className={`px-4 sm:px-6 py-2.5 rounded-xl font-label-caps text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeRoleTab === 'PARENT'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  {t.welcome.roleParentTitle}
                </button>
                <button
                  onClick={() => setActiveRoleTab('MEMBER')}
                  className={`px-4 sm:px-6 py-2.5 rounded-xl font-label-caps text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeRoleTab === 'MEMBER'
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-secondary hover:text-on-surface'
                  }`}
                >
                  {t.welcome.roleMemberTitle}
                </button>
              </div>
            </div>

            {/* Active Role Feature Detail Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest/80">
              {activeRoleTab === 'OWNER' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                  <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
                    <Avatar
                      src={ROLE_AVATARS[0].url}
                      name={t.welcome.elenaName}
                      size="xl"
                      ring={true}
                    />
                    <h3 className="font-headline font-bold text-lg text-on-surface">
                      {t.welcome.roleOwnerSubtitle}
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-label-caps text-xs font-bold uppercase">
                      {t.roles.OWNER}
                    </span>
                  </div>
                  <div className="md:col-span-8 space-y-3.5">
                    <p className="text-secondary text-sm sm:text-base leading-relaxed">
                      {t.welcome.roleOwnerDesc}
                    </p>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-on-surface pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary shrink-0 stroke-[3]" />
                        <span>{t.welcome.roleOwnerF1}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary shrink-0 stroke-[3]" />
                        <span>{t.welcome.roleOwnerF2}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary shrink-0 stroke-[3]" />
                        <span>{t.welcome.roleOwnerF3}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeRoleTab === 'PARENT' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                  <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
                    <Avatar
                      src={ROLE_AVATARS[1].url}
                      name={t.welcome.dmitryName}
                      size="xl"
                      ring={true}
                    />
                    <h3 className="font-headline font-bold text-lg text-on-surface">
                      {t.welcome.roleParentSubtitle}
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 font-label-caps text-xs font-bold uppercase">
                      {t.roles.PARENT}
                    </span>
                  </div>
                  <div className="md:col-span-8 space-y-3.5">
                    <p className="text-secondary text-sm sm:text-base leading-relaxed">
                      {t.welcome.roleParentDesc}
                    </p>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-on-surface pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary shrink-0 stroke-[3]" />
                        <span>{t.welcome.roleParentF1}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary shrink-0 stroke-[3]" />
                        <span>{t.welcome.roleParentF2}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary shrink-0 stroke-[3]" />
                        <span>{t.welcome.roleParentF3}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {activeRoleTab === 'MEMBER' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center animate-in fade-in duration-300">
                  <div className="md:col-span-4 flex flex-col items-center text-center space-y-3">
                    <Avatar
                      src={ROLE_AVATARS[2].url}
                      name={t.welcome.alexeyName}
                      size="xl"
                      ring={true}
                    />
                    <h3 className="font-headline font-bold text-lg text-on-surface">
                      {t.welcome.roleMemberSubtitle}
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-label-caps text-xs font-bold uppercase">
                      {t.roles.MEMBER}
                    </span>
                  </div>
                  <div className="md:col-span-8 space-y-3.5">
                    <p className="text-secondary text-sm sm:text-base leading-relaxed">
                      {t.welcome.roleMemberDesc}
                    </p>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-on-surface pt-2">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary shrink-0 stroke-[3]" />
                        <span>{t.welcome.roleMemberF1}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary shrink-0 stroke-[3]" />
                        <span>{t.welcome.roleMemberF2}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-primary shrink-0 stroke-[3]" />
                        <span>{t.welcome.roleMemberF3}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 4 — TASKS FOR REAL LIFE (Interactive Demo + Real Chores)
            ========================================================================= */}
        <section id="tasks" className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 backdrop-blur-2xl border border-surface-container-highest/80 shadow-2xl space-y-8">
            
            {/* Header directly inside card */}
            <div className="space-y-3 pb-6 border-b border-surface-container-highest/60">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase block">
                {t.welcome.tasksForLifeTag}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
                {t.welcome.tasksForLifeTitle}
              </h2>
              <p className="font-body-md text-secondary text-sm sm:text-base leading-relaxed max-w-3xl">
                {t.welcome.tasksForLifeDesc}
              </p>
            </div>

            {/* Interactive Demo Task Card */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-xl space-y-3">
                <span className="text-xs font-mono text-secondary block text-center">
                  {t.welcome.interactiveDemoPrompt}
                </span>

                <div 
                  className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 backdrop-blur-xl shadow-card ${
                    demoTaskDone 
                      ? 'bg-surface-container-low/90 border-primary ring-2 ring-primary/20' 
                      : 'bg-surface-container-low/70 border-surface-container-highest/80 hover:border-surface-container-highest'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <CategoryBadge category="CHORES" size="sm" />
                    <div className="flex items-center gap-2">
                      <PriorityTag priority="HIGH" size="sm" />
                      <span className="font-caption text-xs text-secondary font-mono">
                        {t.welcome.demoTaskDue}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <button
                      onClick={handleToggleDemoTask}
                      className={`mt-1 w-7 h-7 rounded-xl border-2 flex items-center justify-center transition-all cursor-pointer ${
                        demoTaskDone
                          ? 'bg-primary border-primary text-white scale-105 shadow-sm'
                          : 'border-outline hover:border-primary text-transparent'
                      }`}
                      title="Toggle demo task status"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>

                    <div className="flex-1 space-y-1.5">
                      <h4 className={`font-headline text-lg sm:text-xl font-bold transition-all ${
                        demoTaskDone ? 'line-through text-secondary' : 'text-on-surface'
                      }`}>
                        {t.welcome.demoTaskTitle}
                      </h4>
                      <p className="font-body-sm text-xs sm:text-sm text-secondary leading-relaxed">
                        {t.welcome.demoTaskDesc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-surface-container-highest/60 flex items-center justify-between text-xs text-secondary">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-mono text-[11px]">
                        <Paperclip className="w-3.5 h-3.5 text-primary" />
                        <span>{language === 'ru' ? 'Чек-лист порядка' : 'Tidy checklist'}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-caption text-[11px] uppercase font-mono">
                        {t.roles.MEMBER}
                      </span>
                      <Avatar src={ROLE_AVATARS[2].url} name={t.welcome.alexeyName} size="xs" ring={true} />
                    </div>
                  </div>
                </div>

                {demoFeedbackMessage && (
                  <div className="py-2.5 px-4 rounded-xl bg-primary text-white text-xs font-semibold text-center shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
                    {demoFeedbackMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Real Family Tasks Grid (Chores, Shopping, Pets, Homework, Dinner) */}
            <div className="space-y-4 pt-4">
              <h3 className="font-headline font-bold text-lg uppercase tracking-wide text-on-surface">
                {language === 'ru' ? 'Реальные примеры дел в Семейном Доме' : 'Real Task Examples in Our Family Home'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Task 1: Groceries */}
                <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest/70 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <CategoryBadge category="SHOPPING" size="xs" />
                    <PriorityTag priority="MEDIUM" size="sm" />
                  </div>
                  <h4 className="font-headline font-bold text-sm text-on-surface">
                    {t.welcome.sampleTask2Title}
                  </h4>
                  <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                    {t.welcome.sampleTask2Desc}
                  </p>
                  <div className="pt-2 border-t border-surface-container-highest/50 flex items-center justify-between text-xs text-secondary">
                    <span>{t.common.today} · 17:00</span>
                    <Avatar src={ROLE_AVATARS[2].url} name={t.welcome.alexeyName} size="xs" ring={false} />
                  </div>
                </div>

                {/* Task 2: Math Homework */}
                <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest/70 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <CategoryBadge category="SCHOOL" schoolSubject="MATH" size="xs" />
                    <StatusPill status="NEEDS_REVISION" size="sm" />
                  </div>
                  <h4 className="font-headline font-bold text-sm text-on-surface">
                    {t.welcome.sampleTask4Title}
                  </h4>
                  <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                    {t.welcome.sampleTask4Desc}
                  </p>
                  <div className="pt-2 border-t border-surface-container-highest/50 flex items-center justify-between text-xs text-secondary">
                    <span>{t.common.today} · 16:00</span>
                    <Avatar src={ROLE_AVATARS[2].url} name={t.welcome.alexeyName} size="xs" ring={false} />
                  </div>
                </div>

                {/* Task 3: Plants */}
                <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest/70 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <CategoryBadge category="CHORES" size="xs" />
                    <StatusPill status="DONE" size="sm" />
                  </div>
                  <h4 className="font-headline font-bold text-sm line-through text-secondary">
                    {t.welcome.sampleTask5Title}
                  </h4>
                  <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                    {t.welcome.sampleTask5Desc}
                  </p>
                  <div className="pt-2 border-t border-surface-container-highest/50 flex items-center justify-between text-xs text-secondary">
                    <span>{t.common.today} · 11:00</span>
                    <Avatar src={ROLE_AVATARS[2].url} name={t.welcome.alexeyName} size="xs" ring={false} />
                  </div>
                </div>

                {/* Task 4: Dinner */}
                <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest/70 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <CategoryBadge category="FAMILY" size="xs" />
                    <PriorityTag priority="MEDIUM" size="sm" />
                  </div>
                  <h4 className="font-headline font-bold text-sm text-on-surface">
                    {t.welcome.sampleTask6Title}
                  </h4>
                  <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                    {t.welcome.sampleTask6Desc}
                  </p>
                  <div className="pt-2 border-t border-surface-container-highest/50 flex items-center justify-between text-xs text-secondary">
                    <span>{t.common.today} · 19:30</span>
                    <Avatar src={ROLE_AVATARS[2].url} name={t.welcome.alexeyName} size="xs" ring={false} />
                  </div>
                </div>

                {/* Task 5: Pets */}
                <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest/70 space-y-2.5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <CategoryBadge category="PETS" size="xs" />
                    <PriorityTag priority="HIGH" size="sm" />
                  </div>
                  <h4 className="font-headline font-bold text-sm text-on-surface">
                    {t.welcome.sampleTask3Title}
                  </h4>
                  <p className="text-xs text-secondary leading-relaxed line-clamp-2">
                    {t.welcome.sampleTask3Desc}
                  </p>
                  <div className="pt-2 border-t border-surface-container-highest/50 flex items-center justify-between text-xs text-secondary">
                    <span>{t.common.allDay}</span>
                    <Avatar src={ROLE_AVATARS[2].url} name={t.welcome.alexeyName} size="xs" ring={false} />
                  </div>
                </div>

                {/* Revision Loop Callout Card */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300 font-bold text-xs uppercase tracking-wide">
                      <RotateCcw className="w-4 h-4" />
                      <span>{t.welcome.revisionLoopTitle}</span>
                    </div>
                    <p className="text-xs text-secondary mt-1.5 leading-relaxed">
                      {t.welcome.revisionLoopDesc}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] text-amber-700 dark:text-amber-300 font-semibold block pt-1">
                    // {language === 'ru' ? 'Обучение через поддержку' : 'Growth through encouragement'}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 5 — CALENDAR (Realistic Dates & Scheduled Days)
            ========================================================================= */}
        <section id="calendar" className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 backdrop-blur-2xl border border-surface-container-highest/80 shadow-2xl space-y-8">
            
            {/* Header directly inside card */}
            <div className="space-y-3 pb-6 border-b border-surface-container-highest/60">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase block">
                {t.welcome.calendarTag}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
                {t.welcome.calendarTitle}
              </h2>
              <p className="font-body-md text-secondary text-sm sm:text-base leading-relaxed max-w-3xl">
                {t.welcome.calendarDesc}
              </p>
            </div>

            {/* Interactive Day Selection */}
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container-highest/60">
                <span className="font-label-caps text-xs uppercase tracking-wider text-secondary font-bold">
                  {t.welcome.calendarSelectDayPrompt}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCalendarDay('today')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-label-caps uppercase transition-all cursor-pointer ${
                      selectedCalendarDay === 'today'
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface-container-low text-secondary hover:text-on-surface'
                    }`}
                  >
                    {t.welcome.calendarDayToday}
                  </button>
                  <button
                    onClick={() => setSelectedCalendarDay('tomorrow')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-label-caps uppercase transition-all cursor-pointer ${
                      selectedCalendarDay === 'tomorrow'
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface-container-low text-secondary hover:text-on-surface'
                    }`}
                  >
                    {t.welcome.calendarDayTomorrow}
                  </button>
                  <button
                    onClick={() => setSelectedCalendarDay('sunday')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-label-caps uppercase transition-all cursor-pointer ${
                      selectedCalendarDay === 'sunday'
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-surface-container-low text-secondary hover:text-on-surface'
                    }`}
                  >
                    {t.welcome.calendarDaySunday}
                  </button>
                </div>
              </div>

              {/* Schedule View for Selected Day */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {selectedCalendarDay === 'today' && (
                  <>
                    <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest space-y-2">
                      <div className="flex items-center justify-between">
                        <CategoryBadge category="CHORES" size="xs" />
                        <span className="text-xs font-mono text-secondary">11:00</span>
                      </div>
                      <h4 className="font-headline font-bold text-sm text-on-surface">{t.welcome.sampleTask5Title}</h4>
                      <span className="text-xs text-secondary flex items-center gap-1.5 pt-1">
                        <Avatar src={ROLE_AVATARS[2].url} name={t.welcome.alexeyName} size="xs" ring={false} />
                        <span>{t.welcome.alexeyName}</span>
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest space-y-2">
                      <div className="flex items-center justify-between">
                        <CategoryBadge category="SCHOOL" schoolSubject="MATH" size="xs" />
                        <span className="text-xs font-mono text-secondary">16:00</span>
                      </div>
                      <h4 className="font-headline font-bold text-sm text-on-surface">{t.welcome.sampleTask4Title}</h4>
                      <span className="text-xs text-secondary flex items-center gap-1.5 pt-1">
                        <Avatar src={ROLE_AVATARS[2].url} name={t.welcome.alexeyName} size="xs" ring={false} />
                        <span>{t.welcome.alexeyName}</span>
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest space-y-2">
                      <div className="flex items-center justify-between">
                        <CategoryBadge category="SHOPPING" size="xs" />
                        <span className="text-xs font-mono text-secondary">17:00</span>
                      </div>
                      <h4 className="font-headline font-bold text-sm text-on-surface">{t.welcome.sampleTask2Title}</h4>
                      <span className="text-xs text-secondary flex items-center gap-1.5 pt-1">
                        <Avatar src={ROLE_AVATARS[2].url} name={t.welcome.alexeyName} size="xs" ring={false} />
                        <span>{t.welcome.alexeyName}</span>
                      </span>
                    </div>
                  </>
                )}

                {selectedCalendarDay === 'tomorrow' && (
                  <>
                    <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest space-y-2">
                      <div className="flex items-center justify-between">
                        <CategoryBadge category="CHORES" size="xs" />
                        <span className="text-xs font-mono text-secondary">10:00</span>
                      </div>
                      <h4 className="font-headline font-bold text-sm text-on-surface">
                        {language === 'ru' ? 'Стирка спортивной формы' : 'Laundry sports uniform'}
                      </h4>
                      <span className="text-xs text-secondary flex items-center gap-1.5 pt-1">
                        <Avatar src={ROLE_AVATARS[0].url} name={t.welcome.elenaName} size="xs" ring={false} />
                        <span>{t.welcome.elenaName}</span>
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest space-y-2">
                      <div className="flex items-center justify-between">
                        <CategoryBadge category="SCHOOL" schoolSubject="LANGUAGES" size="xs" />
                        <span className="text-xs font-mono text-secondary">15:00</span>
                      </div>
                      <h4 className="font-headline font-bold text-sm text-on-surface">
                        {language === 'ru' ? 'Английский: чтение главы 3' : 'English: Read Chapter 3'}
                      </h4>
                      <span className="text-xs text-secondary flex items-center gap-1.5 pt-1">
                        <Avatar src={ROLE_AVATARS[2].url} name={t.welcome.alexeyName} size="xs" ring={false} />
                        <span>{t.welcome.alexeyName}</span>
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest space-y-2">
                      <div className="flex items-center justify-between">
                        <CategoryBadge category="PETS" size="xs" />
                        <span className="text-xs font-mono text-secondary">18:00</span>
                      </div>
                      <h4 className="font-headline font-bold text-sm text-on-surface">
                        {language === 'ru' ? 'Визит к ветеринару (осмотр)' : 'Vet routine checkup'}
                      </h4>
                      <span className="text-xs text-secondary flex items-center gap-1.5 pt-1">
                        <Avatar src={ROLE_AVATARS[1].url} name={t.welcome.dmitryName} size="xs" ring={false} />
                        <span>{t.welcome.dmitryName}</span>
                      </span>
                    </div>
                  </>
                )}

                {selectedCalendarDay === 'sunday' && (
                  <>
                    <div className="p-4 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest space-y-2 md:col-span-2">
                      <div className="flex items-center justify-between">
                        <CategoryBadge category="FAMILY" size="xs" />
                        <span className="text-xs font-mono text-primary font-bold">{t.common.allDay}</span>
                      </div>
                      <h4 className="font-headline font-bold text-sm text-on-surface">
                        {language === 'ru' ? 'Семейный выезд в парк и пикник' : 'Family park trip and picnic'}
                      </h4>
                      <p className="text-xs text-secondary">
                        {language === 'ru' ? 'Общий день отдыха: отключение всех школьных уведомлений.' : 'Shared relaxation day: all school alerts disabled.'}
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex flex-col justify-center text-center">
                      <span className="font-headline font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                        {language === 'ru' ? 'День без домашних уроков' : 'Zero Homework Day'}
                      </span>
                      <span className="text-xs text-secondary mt-1">
                        {language === 'ru' ? 'Время для живого общения' : 'Time for family connection'}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Explanation of benefits */}
              <div className="pt-4 border-t border-surface-container-highest/60 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-secondary">
                <div className="space-y-1">
                  <span className="font-bold text-on-surface block">01 // {language === 'ru' ? 'Равномерная нагрузка' : 'Even pacing'}</span>
                  <p>{t.welcome.calendarSyncItem1}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-on-surface block">02 // {language === 'ru' ? 'Дни отдыха' : 'Rest days'}</span>
                  <p>{t.welcome.calendarSyncItem2}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-on-surface block">03 // {language === 'ru' ? 'Взаимная ясность' : 'Mutual visibility'}</span>
                  <p>{t.welcome.calendarSyncItem3}</p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 6 — PROGRESS (Human Understandable, Not Raw Charts)
            ========================================================================= */}
        <section id="progress" className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 backdrop-blur-2xl border border-surface-container-highest/80 shadow-2xl space-y-8">
            
            {/* Header directly inside card */}
            <div className="space-y-3 pb-6 border-b border-surface-container-highest/60">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase block">
                {t.welcome.progressTag}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
                {t.welcome.progressTitle}
              </h2>
              <p className="font-body-md text-secondary text-sm sm:text-base leading-relaxed max-w-3xl">
                {t.welcome.progressDesc}
              </p>
            </div>

            {/* Labeled Sample Preview Box */}
            <div className="space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest/60 text-xs">
                <span className="font-label-caps uppercase font-bold text-primary flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>{t.welcome.progressExampleNotice}</span>
                </span>
                <span className="text-secondary font-mono text-[11px]">
                  {language === 'ru' ? 'НЕДЕЛЬНЫЙ ЦИКЛ' : 'WEEKLY CYCLE'}
                </span>
              </div>

              {/* 3 Metric Cards with Plain Language Explanations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Card 1: 80% */}
                <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-highest space-y-2.5">
                  <span className="font-label-caps text-xs text-secondary font-bold uppercase tracking-wider block">
                    {t.welcome.progressStatRateTitle}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl sm:text-5xl font-extrabold text-primary">
                      {t.welcome.progressStatRate}
                    </span>
                    <span className="text-xs text-secondary font-mono">
                      (8 / 10)
                    </span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    {t.welcome.progressStatRateDesc}
                  </p>
                </div>

                {/* Card 2: Streak */}
                <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-highest space-y-2.5">
                  <span className="font-label-caps text-xs text-secondary font-bold uppercase tracking-wider block">
                    {t.welcome.progressStatStreakTitle}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-4xl sm:text-5xl font-extrabold text-amber-500">
                      {t.welcome.progressStatStreak}
                    </span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed">
                    {t.welcome.progressStatStreakDesc}
                  </p>
                </div>

                {/* Card 3: Categories Breakdown */}
                <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container-highest space-y-2.5">
                  <span className="font-label-caps text-xs text-secondary font-bold uppercase tracking-wider block">
                    {t.welcome.progressStatCategories}
                  </span>
                  <div className="space-y-2 text-xs pt-1">
                    <div className="flex items-center justify-between text-on-surface">
                      <span className="flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{t.welcome.progressChoresVal}</span>
                      </span>
                      <span className="font-bold">4 / 4</span>
                    </div>
                    <div className="flex items-center justify-between text-on-surface">
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-primary" />
                        <span>{t.welcome.progressSchoolVal}</span>
                      </span>
                      <span className="font-bold">3 / 4</span>
                    </div>
                    <div className="flex items-center justify-between text-on-surface">
                      <span className="flex items-center gap-1.5">
                        <PawPrint className="w-3.5 h-3.5 text-rose-500" />
                        <span>{t.welcome.progressPetsVal}</span>
                      </span>
                      <span className="font-bold">1 / 2</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* What this means narrative box */}
              <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-highest text-xs text-secondary space-y-1">
                <h4 className="font-bold text-on-surface text-sm">
                  {t.welcome.progressMeaningTitle}
                </h4>
                <p className="leading-relaxed">
                  {t.welcome.progressMeaningDesc}
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 7 — ACTIVITY AND COLLABORATION (Live Timeline & Revision Loop)
            ========================================================================= */}
        <section id="activity" className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 backdrop-blur-2xl border border-surface-container-highest/80 shadow-2xl space-y-8">
            
            {/* Header directly inside card */}
            <div className="space-y-3 pb-6 border-b border-surface-container-highest/60">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase block">
                {t.welcome.activityTag}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
                {t.welcome.activityTitle}
              </h2>
              <p className="font-body-md text-secondary text-sm sm:text-base leading-relaxed max-w-3xl">
                {t.welcome.activityDesc}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-headline font-bold text-base text-on-surface uppercase tracking-wide">
                {t.welcome.activityTimelineTitle}
              </h3>

              {/* Timeline Events */}
              <div className="space-y-3">
                
                {/* Event 1 */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest">
                  <Avatar src={ROLE_AVATARS[2].url} name={t.welcome.actEvent1Actor} size="sm" ring={true} />
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-on-surface">
                        {t.welcome.actEvent1Actor} <span className="font-normal text-secondary">{t.welcome.actEvent1Action}</span> «{t.welcome.actEvent1Target}»
                      </span>
                      <span className="text-secondary font-mono text-[10px]">{t.welcome.actEvent1Time}</span>
                    </div>
                    <p className="text-secondary">{t.welcome.actEvent1Note}</p>
                  </div>
                </div>

                {/* Event 2 */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest">
                  <Avatar src={ROLE_AVATARS[0].url} name={t.welcome.actEvent2Actor} size="sm" ring={true} />
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-on-surface">
                        {t.welcome.actEvent2Actor} <span className="font-normal text-secondary">{t.welcome.actEvent2Action}</span> «{t.welcome.actEvent2Target}»
                      </span>
                      <span className="text-secondary font-mono text-[10px]">{t.welcome.actEvent2Time}</span>
                    </div>
                    <p className="text-secondary italic">{t.welcome.actEvent2Note}</p>
                  </div>
                </div>

                {/* Event 3 */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                  <Avatar src={ROLE_AVATARS[1].url} name={t.welcome.actEvent3Actor} size="sm" ring={true} />
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-on-surface">
                        {t.welcome.actEvent3Actor} <span className="text-amber-700 dark:text-amber-300 font-bold">{t.welcome.actEvent3Action}</span> «{t.welcome.actEvent3Target}»
                      </span>
                      <span className="text-secondary font-mono text-[10px]">{t.welcome.actEvent3Time}</span>
                    </div>
                    <p className="text-secondary">{t.welcome.actEvent3Note}</p>
                  </div>
                </div>

                {/* Event 4 */}
                <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest">
                  <Avatar src={ROLE_AVATARS[2].url} name={t.welcome.actEvent4Actor} size="sm" ring={true} />
                  <div className="flex-1 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-on-surface">
                        {t.welcome.actEvent4Actor} <span className="font-normal text-secondary">{t.welcome.actEvent4Action}</span> «{t.welcome.actEvent4Target}»
                      </span>
                      <span className="text-secondary font-mono text-[10px]">{t.welcome.actEvent4Time}</span>
                    </div>
                    <p className="text-secondary">{t.welcome.actEvent4Note}</p>
                  </div>
                </div>

              </div>

              {/* Trust Benefit Callout */}
              <div className="pt-3 border-t border-surface-container-highest/60 text-xs text-secondary">
                <span className="font-bold text-on-surface block mb-1">
                  {t.welcome.actTrustBenefitTitle}
                </span>
                <p className="leading-relaxed">
                  {t.welcome.actTrustBenefitDesc}
                </p>
              </div>

            </div>

          </div>
        </section>

        {/* =========================================================================
            SECTION 8 — MAKE IT YOURS (5 Living Atmospheres Live Switcher)
            ========================================================================= */}
        <section id="atmosphere" className="scroll-mt-20 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 backdrop-blur-2xl border border-surface-container-highest/80 shadow-2xl space-y-8">
            
            {/* Header directly inside card */}
            <div className="space-y-3 pb-6 border-b border-surface-container-highest/60">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase block">
                {t.welcome.atmosphereTag}
              </span>
              <h2 className="font-display text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
                {t.welcome.atmosphereTitle}
              </h2>
              <p className="font-body-md text-secondary text-sm sm:text-base leading-relaxed max-w-3xl">
                {t.welcome.atmosphereDesc}
              </p>
            </div>

            {/* Interactive Live Switcher */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              {atmospheresList.map((atmo) => {
                const isActive = atmosphere === atmo.id;

                return (
                  <button
                    key={atmo.id}
                    onClick={() => setAtmosphere(atmo.id)}
                    className={`p-5 rounded-2xl text-left border transition-all cursor-pointer backdrop-blur-xl flex flex-col justify-between h-44 group ${
                      isActive
                        ? 'bg-primary text-white border-primary shadow-xl scale-[1.02] ring-2 ring-primary/40'
                        : 'bg-surface-container-low hover:bg-surface-container border-surface-container-highest text-on-surface'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className={`font-mono text-[10px] uppercase font-bold tracking-wider ${
                        isActive ? 'text-white/80' : 'text-primary'
                      }`}>
                        {isActive ? `✓ ${t.welcome.atmosphereActiveLabel}` : atmo.id}
                      </span>
                      <h3 className="font-headline font-bold text-base">
                        {atmo.name}
                      </h3>
                    </div>

                    <p className={`text-[11px] leading-relaxed ${
                      isActive ? 'text-white/90' : 'text-secondary'
                    }`}>
                      {atmo.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <p className="text-center text-xs text-secondary font-mono max-w-xl mx-auto pt-2">
              {t.welcome.atmosphereEngineDesc}
            </p>

          </div>
        </section>

        {/* =========================================================================
            SECTION 9 — FINAL ACTION & LEGAL TRANSPARENCY
            ========================================================================= */}
        <section id="start" className="scroll-mt-20 max-w-4xl mx-auto px-4 sm:px-8 text-center">
          <div className="p-8 sm:p-14 rounded-3xl bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 backdrop-blur-2xl border border-surface-container-highest/80 shadow-2xl space-y-8">
            
            <div className="space-y-3">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase block">
                {t.welcome.finalActionTag}
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-on-surface">
                {t.welcome.finalActionTitle}
              </h2>
              <p className="font-body-lg text-secondary text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
                {t.welcome.finalActionDesc}
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onEnter('register')}
                className="px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-primary text-white font-label-caps text-sm uppercase tracking-wider font-extrabold hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/30 active:scale-[0.98] flex items-center gap-3 cursor-pointer"
              >
                <span>{t.welcome.finalCtaCreate}</span>
                <ArrowRight className="w-5 h-5 stroke-[3]" />
              </button>

              <button
                onClick={() => onEnter('code')}
                className="px-7 sm:px-9 py-4 sm:py-5 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container-highest text-on-surface font-label-caps text-sm uppercase tracking-wider font-bold transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4 text-primary" />
                <span>{t.welcome.finalCtaJoin}</span>
              </button>
            </div>

            {/* Legal Documents Direct Links */}
            <div className="pt-8 border-t border-surface-container-highest/60 space-y-3">
              <h4 className="font-label-caps text-xs uppercase tracking-widest text-secondary font-bold">
                {t.welcome.legalSectionTitle}
              </h4>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                <button
                  onClick={() => openLegalDoc('privacy-guarantee')}
                  className="text-secondary hover:text-primary transition-colors underline underline-offset-4 cursor-pointer"
                >
                  {t.welcome.legalDocPrivacy}
                </button>
                <span className="text-outline-variant">·</span>
                <button
                  onClick={() => openLegalDoc('terms-of-service')}
                  className="text-secondary hover:text-primary transition-colors underline underline-offset-4 cursor-pointer"
                >
                  {t.welcome.legalDocTerms}
                </button>
                <span className="text-outline-variant">·</span>
                <button
                  onClick={() => openLegalDoc('privacy-policy')}
                  className="text-secondary hover:text-primary transition-colors underline underline-offset-4 cursor-pointer"
                >
                  {t.welcome.legalDocRoles}
                </button>
                <span className="text-outline-variant">·</span>
                <button
                  onClick={() => openLegalDoc('security')}
                  className="text-secondary hover:text-primary transition-colors underline underline-offset-4 cursor-pointer"
                >
                  {t.welcome.legalDocSecurity}
                </button>
              </div>
              <p className="text-[11px] text-secondary font-mono pt-2">
                {t.welcome.footerCopyright} {t.welcome.footerTagline}
              </p>
            </div>

          </div>
        </section>

      </main>

      {/* Legal Documents Modal */}
      <React.Suspense fallback={null}>
        <LegalDocsModal
          isOpen={legalModalOpen}
          initialDocId={selectedLegalDoc}
          onClose={() => setLegalModalOpen(false)}
        />
      </React.Suspense>

      {/* iOS iPhone Web App Install Prompt Banner */}
      <IosInstallBanner />

    </div>
  );
};
