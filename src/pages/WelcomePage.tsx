import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { NestLogo } from '../components/common/NestLogo';
import { AtmosphereBackdrop } from '../components/common/AtmosphereBackdrop';
import { useTranslation } from '../locales';
import { useTheme } from '../context/ThemeContext';
import { AtmosphereType } from '../types/home';
import { 
  HeroPenUnderline, 
  PenStar, 
  PenCircle, 
  MarkerHighlight 
} from '../components/common/ControlledImperfection';
import { 
  ArrowRight, 
  ArrowDown, 
  Check, 
  CheckSquare, 
  Square, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Layers, 
  Flame, 
  TrendingUp, 
  Sun, 
  Moon, 
  Globe, 
  Paperclip, 
  MessageSquare,
  Clock
} from 'lucide-react';

interface WelcomePageProps {
  onEnter: () => void;
  onExploreDemo: (persona: 'alexey' | 'elena' | 'dmitry') => void;
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

export const WelcomePage: React.FC<WelcomePageProps> = ({ onEnter, onExploreDemo }) => {
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme, atmosphere, setAtmosphere, isDark } = useTheme();

  // Section 3: Interactive Demo Task State
  const [demoTaskDone, setDemoTaskDone] = useState(false);
  const [demoFeedbackMessage, setDemoFeedbackMessage] = useState<string | null>(null);

  // Section 4: Selected Role State
  const [activeRoleTab, setActiveRoleTab] = useState<'OWNER' | 'PARENT' | 'MEMBER'>('OWNER');

  const handleToggleDemoTask = () => {
    const nextState = !demoTaskDone;
    setDemoTaskDone(nextState);

    if (nextState) {
      playDemoChime();
      confetti({
        particleCount: 38,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#0F4CFF', '#00D1FF', '#FFE7C2'],
      });
      setDemoFeedbackMessage(t.welcome.interactiveTaskDoneFeedback);
    } else {
      setDemoFeedbackMessage(t.welcome.interactiveTaskUndoFeedback);
    }

    setTimeout(() => {
      setDemoFeedbackMessage(null);
    }, 3500);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const atmospheresList: AtmosphereType[] = ['Clouds', 'Midnight', 'Sunset', 'Ocean', 'Aurora'];

  return (
    <div className="min-h-screen w-full relative flex flex-col bg-background text-on-surface antialiased transition-colors selection:bg-primary/20 selection:text-primary">
      
      {/* Dynamic environmental aura */}
      <AtmosphereBackdrop atmosphere={atmosphere} />

      {/* Top Floating Glass Header */}
      <header className="sticky top-0 z-40 w-full h-16 bg-surface/80 backdrop-blur-md border-b border-surface-container-highest/60 transition-colors">
        <div className="max-w-6xl mx-auto h-full px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NestLogo variant="wordmark" className="h-6 w-auto" />
            <span className="hidden sm:inline-block w-px h-3.5 bg-outline-variant/40" />
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest text-secondary">
              FAMILY OS 2026
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
              className="px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container font-label-caps text-[11px] font-bold text-on-surface uppercase tracking-wider transition-colors"
              title="Toggle Language"
            >
              {language.toUpperCase()}
            </button>

            {/* Dark/Warm Theme Switcher */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="p-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-secondary hover:text-on-surface transition-colors"
              title={isDark ? "Switch to Warm Paper" : "Switch to Midnight"}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            <span className="w-px h-4 bg-outline-variant/40" />

            {/* Sign In CTA */}
            <button
              onClick={onEnter}
              className="px-4 py-1.5 rounded-xl bg-on-surface text-surface hover:bg-primary transition-all font-label-caps text-xs uppercase tracking-wider font-bold shadow-sm"
            >
              {t.auth.login}
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          SECTION 1 — HERO
          ========================================================================= */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <div className="my-auto max-w-4xl space-y-8 animate-in fade-in duration-500">
          
          {/* Release Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-surface-container-highest text-primary font-mono text-xs shadow-xs">
            <span className="font-label-caps uppercase tracking-widest font-bold">
              {t.welcome.heroTag}
            </span>
            <PenStar className="w-3.5 h-3.5 text-primary" />
          </div>

          {/* Hero Headline */}
          <div className="space-y-3">
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-on-surface leading-[1.04]">
              {t.welcome.heroTitle}
            </h1>
            <HeroPenUnderline className="text-primary w-56 sm:w-80 h-4" />
          </div>

          {/* Subtitle */}
          <p className="font-body-lg text-secondary text-lg sm:text-2xl max-w-2xl leading-relaxed">
            {t.welcome.heroSubtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onEnter}
              className="px-8 py-4 rounded-2xl bg-on-surface text-surface hover:bg-primary font-label-caps text-sm uppercase tracking-wider font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-card active:scale-[0.98]"
            >
              <span>{t.welcome.ctaCreate}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onEnter}
              className="px-6 py-4 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container-highest text-on-surface font-label-caps text-sm uppercase tracking-wider font-semibold transition-all active:scale-[0.98]"
            >
              <span>{t.welcome.ctaJoin}</span>
            </button>
          </div>

          {/* Demo personas quick launch */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <span className="font-caption text-xs text-secondary font-mono uppercase tracking-wider">
              {t.welcome.orTestPersonas}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onExploreDemo('alexey')}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-surface-container-highest text-xs font-semibold text-on-surface transition-all active:scale-95"
              >
                Alexey ({t.roles.MEMBER})
              </button>
              <button
                onClick={() => onExploreDemo('elena')}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-surface-container-highest text-xs font-semibold text-on-surface transition-all active:scale-95"
              >
                Elena ({t.roles.OWNER})
              </button>
              <button
                onClick={() => onExploreDemo('dmitry')}
                className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container border border-surface-container-highest text-xs font-semibold text-on-surface transition-all active:scale-95"
              >
                Dmitry ({t.roles.PARENT})
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Cue Indicator */}
        <div className="pt-8 pb-4 flex flex-col items-center justify-center">
          <button
            onClick={() => scrollToSection('what-is-home')}
            className="group flex flex-col items-center gap-2 text-secondary hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="font-label-caps text-[11px] font-bold tracking-widest uppercase group-hover:text-primary transition-colors">
              {t.welcome.exploreNest}
            </span>
            <div className="p-2 rounded-full bg-surface-container-low group-hover:bg-surface-container border border-surface-container-highest animate-bounce transition-all">
              <ArrowDown className="w-4 h-4 text-primary" />
            </div>
          </button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — WHAT IS A HOME?
          ========================================================================= */}
      <section id="what-is-home" className="py-20 sm:py-28 border-t border-surface-container-highest/60 bg-surface-container-lowest/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
          
          <div className="space-y-4 max-w-2xl">
            <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase block">
              {t.welcome.whatIsHomeTag}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-on-surface">
              {t.welcome.whatIsHomeTitle}
            </h2>
            <p className="font-body-lg text-secondary text-base sm:text-lg leading-relaxed">
              {t.welcome.whatIsHomeDesc}
            </p>
          </div>

          {/* Conceptual Hierarchy Flow: HOME ↓ People ↓ Tasks ↓ Progress */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            
            {/* Step 1: HOME */}
            <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-highest space-y-3 relative group hover:border-primary/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-mono font-bold text-sm">
                01
              </div>
              <h3 className="font-label-caps text-base font-bold uppercase tracking-wider text-on-surface">
                {t.welcome.flowHome}
              </h3>
              <p className="font-body-sm text-xs text-secondary leading-relaxed">
                A sovereign digital sanctuary with custom atmosphere, shared invite codes, and zero outside interference.
              </p>
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-outline-variant">
                <ArrowRight className="w-5 h-5 text-secondary" />
              </div>
            </div>

            {/* Step 2: PEOPLE */}
            <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-highest space-y-3 relative group hover:border-primary/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-mono font-bold text-sm">
                02
              </div>
              <h3 className="font-label-caps text-base font-bold uppercase tracking-wider text-on-surface">
                {t.welcome.flowPeople}
              </h3>
              <p className="font-body-sm text-xs text-secondary leading-relaxed">
                Parents, mentors, and members collaborate seamlessly with granular roles and revision loops.
              </p>
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-outline-variant">
                <ArrowRight className="w-5 h-5 text-secondary" />
              </div>
            </div>

            {/* Step 3: TASKS */}
            <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-highest space-y-3 relative group hover:border-primary/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-mono font-bold text-sm">
                03
              </div>
              <h3 className="font-label-caps text-base font-bold uppercase tracking-wider text-on-surface">
                {t.welcome.flowTasks}
              </h3>
              <p className="font-body-sm text-xs text-secondary leading-relaxed">
                Stationery-inspired assignments with subject colorways, dates, attachments, and focused feedback.
              </p>
              <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-outline-variant">
                <ArrowRight className="w-5 h-5 text-secondary" />
              </div>
            </div>

            {/* Step 4: PROGRESS */}
            <div className="p-6 rounded-2xl bg-surface-container-low border border-surface-container-highest space-y-3 group hover:border-primary/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-mono font-bold text-sm">
                04
              </div>
              <h3 className="font-label-caps text-base font-bold uppercase tracking-wider text-on-surface">
                {t.welcome.flowProgress}
              </h3>
              <p className="font-body-sm text-xs text-secondary leading-relaxed">
                Quiet completion telemetry, streak momentum, and milestone velocity celebrating steady family habits.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3 — TASKS SHOWCASE (INTERACTIVE)
          ========================================================================= */}
      <section className="py-20 sm:py-28 border-t border-surface-container-highest/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left copy */}
            <div className="lg:col-span-5 space-y-6">
              <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase block">
                {t.welcome.tasksShowcaseTag}
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-on-surface">
                {t.welcome.tasksShowcaseTitle}
              </h2>
              <p className="font-body-lg text-secondary text-base sm:text-lg leading-relaxed">
                {t.welcome.tasksShowcaseDesc}
              </p>

              <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-highest flex items-start gap-3 text-xs text-secondary font-mono">
                <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>
                  Tap the circular checkbox on the demo ledger card to hear the harmonic audio chime and see instant state synchronization.
                </span>
              </div>
            </div>

            {/* Right: Live Interactive Task Card */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center">
              <div className="w-full max-w-lg space-y-4">
                
                {/* The Interactive Stationery Card */}
                <div 
                  className={`relative p-6 sm:p-8 rounded-3xl border transition-all duration-300 shadow-card ${
                    demoTaskDone 
                      ? 'bg-surface-container-low border-primary/40 ring-2 ring-primary/20' 
                      : 'bg-surface-container-lowest border-surface-container-highest hover:border-surface-container-highest/90'
                  }`}
                >
                  {/* Top Bar: Subject Badge & Priority Tag */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-label-caps font-bold tracking-wider uppercase bg-[#E8EEFF] text-[#0038D1] dark:bg-[#1E293B] dark:text-[#93C5FD]">
                      {t.welcome.interactiveTaskBadge}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-label-caps font-bold tracking-wider uppercase bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                        {t.priorities.HIGH}
                      </span>
                      <span className="font-caption text-[11px] text-secondary font-mono">
                        {t.welcome.interactiveTaskDue}
                      </span>
                    </div>
                  </div>

                  {/* Title & Interactive Toggle */}
                  <div className="flex items-start gap-4">
                    <button
                      onClick={handleToggleDemoTask}
                      className={`mt-1 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer ${
                        demoTaskDone
                          ? 'bg-primary border-primary text-white scale-105 shadow-sm'
                          : 'border-outline-variant hover:border-primary text-transparent'
                      }`}
                      title="Toggle completion"
                      aria-label="Toggle demo task status"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>

                    <div className="flex-1 space-y-2">
                      <h4 className={`font-headline text-lg sm:text-xl font-bold transition-all ${
                        demoTaskDone ? 'line-through text-outline' : 'text-on-surface'
                      }`}>
                        {t.welcome.interactiveTaskTitle}
                      </h4>
                      <p className="font-body-sm text-xs text-secondary leading-relaxed">
                        Complete chapters on trigonometric substitution, angle conversions, and coordinate graphs. Submit scanned worksheet.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Metadata Ledger */}
                  <div className="mt-6 pt-4 border-t border-surface-container-highest flex items-center justify-between text-xs text-secondary">
                    <div className="flex items-center gap-4 font-caption text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Paperclip className="w-3.5 h-3.5 text-outline" />
                        <span>1 PDF</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-outline" />
                        <span>2 Notes</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-caption text-[10px] uppercase font-mono text-outline">
                        {t.roles.PARENT}
                      </span>
                      <img 
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80" 
                        alt="Elena" 
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-surface-container-highest" 
                      />
                    </div>
                  </div>
                </div>

                {/* Real-time micro feedback pill */}
                {demoFeedbackMessage && (
                  <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-primary text-white text-xs font-semibold shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{demoFeedbackMessage}</span>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — PEOPLE & ROLES
          ========================================================================= */}
      <section className="py-20 sm:py-28 border-t border-surface-container-highest/60 bg-surface-container-lowest/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
          
          <div className="space-y-4 max-w-2xl">
            <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase block">
              {t.welcome.peopleTag}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-on-surface">
              {t.welcome.peopleTitle}
            </h2>
            <p className="font-body-lg text-secondary text-base sm:text-lg leading-relaxed">
              {t.welcome.peopleDesc}
            </p>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* OWNER */}
            <div 
              onClick={() => setActiveRoleTab('OWNER')}
              className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer ${
                activeRoleTab === 'OWNER'
                  ? 'bg-surface-container-low border-primary ring-2 ring-primary/20 shadow-card'
                  : 'bg-surface-container-lowest border-surface-container-highest hover:border-outline'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-label-caps font-bold tracking-wider uppercase bg-primary/10 text-primary">
                  {t.welcome.roleOwnerTitle}
                </span>
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-2">
                Home Guardian
              </h3>
              <p className="font-body-sm text-sm text-secondary leading-relaxed mb-6">
                {t.welcome.roleOwnerDesc}
              </p>
              <div className="space-y-2 pt-4 border-t border-surface-container-highest text-xs font-mono text-secondary">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span>Manage invites & security</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span>Set environmental atmosphere</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span>Assign parental privileges</span>
                </div>
              </div>
            </div>

            {/* PARENT */}
            <div 
              onClick={() => setActiveRoleTab('PARENT')}
              className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer ${
                activeRoleTab === 'PARENT'
                  ? 'bg-surface-container-low border-primary ring-2 ring-primary/20 shadow-card'
                  : 'bg-surface-container-lowest border-surface-container-highest hover:border-outline'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-label-caps font-bold tracking-wider uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {t.welcome.roleParentTitle}
                </span>
                <Users className="w-5 h-5 text-amber-500" />
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-2">
                Curator & Mentor
              </h3>
              <p className="font-body-sm text-sm text-secondary leading-relaxed mb-6">
                {t.welcome.roleParentDesc}
              </p>
              <div className="space-y-2 pt-4 border-t border-surface-container-highest text-xs font-mono text-secondary">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-500" />
                  <span>Create & schedule assignments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-500" />
                  <span>Request revisions with feedback</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-amber-500" />
                  <span>Audit family completion velocity</span>
                </div>
              </div>
            </div>

            {/* MEMBER */}
            <div 
              onClick={() => setActiveRoleTab('MEMBER')}
              className={`p-6 sm:p-8 rounded-3xl border transition-all cursor-pointer ${
                activeRoleTab === 'MEMBER'
                  ? 'bg-surface-container-low border-primary ring-2 ring-primary/20 shadow-card'
                  : 'bg-surface-container-lowest border-surface-container-highest hover:border-outline'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-label-caps font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {t.welcome.roleMemberTitle}
                </span>
                <CheckSquare className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-headline text-xl font-bold text-on-surface mb-2">
                Focused Learner
              </h3>
              <p className="font-body-sm text-sm text-secondary leading-relaxed mb-6">
                {t.welcome.roleMemberDesc}
              </p>
              <div className="space-y-2 pt-4 border-t border-surface-container-highest text-xs font-mono text-secondary">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Check off assigned priorities</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Upload work attachments & proof</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Build personal focus streaks</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5 — PROGRESS TELEMETRY
          ========================================================================= */}
      <section className="py-20 sm:py-28 border-t border-surface-container-highest/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
          
          <div className="space-y-4 max-w-2xl">
            <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase block">
              {t.welcome.progressTag}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-on-surface">
              {t.welcome.progressTitle}
            </h2>
            <p className="font-body-lg text-secondary text-base sm:text-lg leading-relaxed">
              {t.welcome.progressDesc}
            </p>
          </div>

          {/* Telemetry Visual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Metric 1 */}
            <div className="p-8 rounded-3xl bg-surface-container-lowest border border-surface-container-highest shadow-card space-y-4">
              <span className="font-label-caps text-xs uppercase tracking-wider text-secondary font-bold">
                {t.welcome.statCompletedLabel}
              </span>
              <div className="font-display text-5xl sm:text-6xl font-extrabold text-on-surface">
                {t.welcome.statCompletedRate}
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[88%] rounded-full transition-all duration-1000" />
              </div>
              <span className="font-caption text-xs text-secondary font-mono block">
                +12% compared to last cycle
              </span>
            </div>

            {/* Metric 2 */}
            <div className="p-8 rounded-3xl bg-surface-container-lowest border border-surface-container-highest shadow-card space-y-4">
              <span className="font-label-caps text-xs uppercase tracking-wider text-secondary font-bold">
                {t.welcome.statStreakLabel}
              </span>
              <div className="flex items-center gap-3">
                <div className="font-display text-4xl sm:text-5xl font-extrabold text-on-surface">
                  {t.welcome.statStreak}
                </div>
                <Flame className="w-8 h-8 text-amber-500 fill-amber-500/20 shrink-0" />
              </div>
              <div className="flex items-center gap-1.5 pt-2">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div 
                    key={day} 
                    className="flex-1 h-3 rounded-md bg-amber-500/80" 
                    title={`Day ${day} Active`}
                  />
                ))}
              </div>
              <span className="font-caption text-xs text-secondary font-mono block">
                Consistent daily habits maintained
              </span>
            </div>

            {/* Metric 3 */}
            <div className="p-8 rounded-3xl bg-surface-container-lowest border border-surface-container-highest shadow-card space-y-4">
              <span className="font-label-caps text-xs uppercase tracking-wider text-secondary font-bold">
                {t.welcome.statWeeklyDoneLabel}
              </span>
              <div className="font-display text-5xl sm:text-6xl font-extrabold text-on-surface">
                {t.welcome.statWeeklyDone}
              </div>
              <div className="flex items-center gap-2 text-primary text-xs font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>On track for weekly household goals</span>
              </div>
              <span className="font-caption text-xs text-secondary font-mono block">
                4 milestones remaining before Sunday
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6 — ATMOSPHERE (INTERACTIVE SELECTOR)
          ========================================================================= */}
      <section className="py-20 sm:py-28 border-t border-surface-container-highest/60 bg-surface-container-lowest/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
          
          <div className="space-y-4 max-w-2xl">
            <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase block">
              {t.welcome.atmosphereTag}
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-on-surface">
              {t.welcome.atmosphereTitle}
            </h2>
            <p className="font-body-lg text-secondary text-base sm:text-lg leading-relaxed">
              {t.welcome.atmosphereDesc}
            </p>
          </div>

          {/* Interactive Atmosphere Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {atmospheresList.map((atm) => {
              const isActive = atmosphere === atm;
              return (
                <button
                  key={atm}
                  onClick={() => setAtmosphere(atm)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-6 ${
                    isActive
                      ? 'bg-surface-container border-primary ring-2 ring-primary/30 shadow-card scale-102'
                      : 'bg-surface-container-lowest border-surface-container-highest hover:border-outline'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-xs font-bold uppercase tracking-wider text-on-surface">
                      {t.atmospheres[atm]}
                    </span>
                    {isActive && <Check className="w-4 h-4 text-primary" />}
                  </div>

                  {/* Visual atmosphere token */}
                  <div className="space-y-2">
                    <div className="h-6 w-full rounded-lg overflow-hidden flex shadow-inner">
                      {atm === 'Clouds' && (
                        <div className="w-full h-full bg-gradient-to-r from-[#FDFBF7] via-[#FFF3D6] to-[#EAEFFF]" />
                      )}
                      {atm === 'Midnight' && (
                        <div className="w-full h-full bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#312E81]" />
                      )}
                      {atm === 'Sunset' && (
                        <div className="w-full h-full bg-gradient-to-r from-[#FED7AA] via-[#FB923C] to-[#BE185D]" />
                      )}
                      {atm === 'Ocean' && (
                        <div className="w-full h-full bg-gradient-to-r from-[#0284C7] via-[#0F4CFF] to-[#0369A1]" />
                      )}
                      {atm === 'Aurora' && (
                        <div className="w-full h-full bg-gradient-to-r from-[#10B981] via-[#06B6D4] to-[#6366F1]" />
                      )}
                    </div>
                    <span className="font-caption text-[11px] text-secondary font-mono block">
                      {atm}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 7 — FINAL CTA & FOOTER
          ========================================================================= */}
      <section className="py-24 sm:py-32 border-t border-surface-container-highest/60 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-surface-container-highest text-primary font-mono text-xs">
            <span className="font-label-caps uppercase tracking-widest font-bold">
              {t.welcome.finalCtaTag}
            </span>
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-4xl sm:text-6xl font-extrabold uppercase tracking-tight text-on-surface">
              {t.welcome.finalCtaTitle}
            </h2>
            <p className="font-body-lg text-secondary text-base sm:text-xl max-w-xl mx-auto leading-relaxed">
              {t.welcome.finalCtaSubtitle}
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnter}
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-on-surface text-surface hover:bg-primary font-label-caps text-sm uppercase tracking-wider font-bold transition-all duration-200 flex items-center justify-center gap-3 shadow-card active:scale-[0.98]"
            >
              <span>{t.welcome.finalCtaBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onEnter}
              className="w-full sm:w-auto px-8 py-5 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-surface-container-highest text-on-surface font-label-caps text-sm uppercase tracking-wider font-semibold transition-all active:scale-[0.98]"
            >
              <span>{t.welcome.finalCtaSignIn}</span>
            </button>
          </div>

        </div>

        {/* Global Footer */}
        <footer className="max-w-6xl mx-auto px-4 sm:px-8 pt-20 mt-20 border-t border-surface-container-highest/60 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-secondary">
          <div className="flex items-center gap-3">
            <NestLogo variant="wordmark" className="h-5 w-auto" />
            <span>· Architectural Family OS 2026</span>
          </div>

          <div className="flex items-center gap-6">
            <span>WCAG 2.1 AAA Compliant</span>
            <span>Zero Data Leakage Guarantee</span>
          </div>
        </footer>
      </section>

    </div>
  );
};
