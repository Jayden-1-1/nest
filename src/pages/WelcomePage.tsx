import React from 'react';
import { NestLogo } from '../components/common/NestLogo';
import { useTranslation } from '../locales';
import { HeroPenUnderline, PenStar, MarkerHighlight } from '../components/common/ControlledImperfection';
import { ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface WelcomePageProps {
  onEnter: () => void;
  onExploreDemo: (persona: 'alexey' | 'elena' | 'dmitry') => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onEnter, onExploreDemo }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full flex flex-col justify-between p-margin-mobile sm:p-margin relative overflow-hidden">
      
      {/* Top Header */}
      <header className="flex items-center justify-between">
        <NestLogo variant="wordmark" className="h-7 w-auto" />
        <button
          onClick={onEnter}
          className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface font-label-caps text-xs uppercase tracking-wider font-semibold transition-colors"
        >
          {t.auth.login}
        </button>
      </header>

      {/* Hero Poster Spreads */}
      <main className="my-auto py-12 max-w-4xl mx-auto w-full space-y-8">
        
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-mono text-xs">
            <span className="font-label-caps uppercase tracking-widest font-bold">MONOGRAPH EDITION // RELEASE 2026.10</span>
            <PenStar className="w-4 h-4 text-primary" />
          </div>

          <div className="relative">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold uppercase tracking-tight text-on-surface leading-[1.05]">
              {t.auth.welcomeTitle}
            </h1>
            <HeroPenUnderline className="text-primary w-48 sm:w-64 h-4 mt-2" />
          </div>

          <p className="font-body-lg text-secondary text-lg sm:text-xl max-w-2xl leading-relaxed pt-2">
            {t.auth.welcomeSubtitle}
          </p>
        </div>

        {/* Primary CTA and Demo Personas */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
          <button
            onClick={onEnter}
            className="px-8 py-4 rounded-xl bg-on-surface text-surface font-label-caps text-sm uppercase tracking-wider font-bold hover:bg-primary transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{t.auth.register}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <span className="text-xs text-secondary font-mono text-center sm:text-left">{t.welcome.orTestPersonas}</span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onExploreDemo('alexey')}
              className="px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container border border-surface-container-highest text-xs font-semibold text-on-surface transition-colors"
            >
              Alexey ({t.roles.MEMBER})
            </button>
            <button
              onClick={() => onExploreDemo('elena')}
              className="px-3.5 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container border border-surface-container-highest text-xs font-semibold text-on-surface transition-colors"
            >
              Elena ({t.roles.OWNER})
            </button>
          </div>
        </div>

        {/* Editorial Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-surface-container-highest">
          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-highest space-y-1">
            <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-wider block">{t.welcome.pillar1Title}</span>
            <p className="font-body-sm text-xs text-secondary leading-relaxed">
              {t.welcome.pillar1Desc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-highest space-y-1">
            <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-wider block">{t.welcome.pillar2Title}</span>
            <p className="font-body-sm text-xs text-secondary leading-relaxed">
              {t.welcome.pillar2Desc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-surface-container-low border border-surface-container-highest space-y-1">
            <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-wider block">{t.welcome.pillar3Title}</span>
            <p className="font-body-sm text-xs text-secondary leading-relaxed">
              {t.welcome.pillar3Desc}
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between text-caption text-xs text-secondary font-mono pt-4 border-t border-surface-container-highest">
        <span>NEST Architectural OS · 2026</span>
        <span>WCAG 2.1 AAA Compliant</span>
      </footer>

    </div>
  );
};
