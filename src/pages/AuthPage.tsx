import React, { useState } from 'react';
import { NestLogo } from '../components/common/NestLogo';
import { AtmosphereBackdrop } from '../components/common/AtmosphereBackdrop';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../locales';
import { HeroPenUnderline, PenStar } from '../components/common/ControlledImperfection';
import { ArrowLeft, User, Mail, Lock, Check } from 'lucide-react';

interface AuthPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onBack, onSuccess }) => {
  const { login, register, switchDemoUser } = useAuth();
  const { atmosphere } = useTheme();
  const { t } = useTranslation();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      if (!displayName.trim() || !username.trim() || !email.trim()) return;
      await register({ displayName, username, email });
    } else {
      if (!email.trim()) return;
      await login(email);
    }
    onSuccess();
  };

  const handleSelectPersona = (persona: 'alexey' | 'elena' | 'dmitry') => {
    switchDemoUser(persona);
    onSuccess();
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-8 bg-transparent transition-colors">
      <AtmosphereBackdrop atmosphere={atmosphere} />
      <div className="relative z-10 w-full max-w-md bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl border border-surface-container-highest/80 p-6 sm:p-8 shadow-card space-y-6">
        
        {/* Back and Brand */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-label-caps uppercase text-secondary hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.common.back}</span>
          </button>
          <NestLogo variant="wordmark" className="h-5 w-auto" />
        </div>

        {/* Header */}
        <div className="space-y-1">
          <h2 className="font-headline text-2xl font-bold uppercase tracking-tight text-on-surface">
            {isRegister ? t.auth.register : t.auth.login}
          </h2>
          <p className="font-caption text-xs text-secondary">
            {isRegister ? t.auth.joinSanctuary : t.auth.enterHome}
          </p>
        </div>

        {/* Quick Demo Persona Switcher */}
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-highest space-y-2">
          <span className="font-label-caps text-[10px] uppercase text-primary font-bold tracking-widest block">
            {t.auth.demoAccount}
          </span>
          <div className="grid grid-cols-1 gap-1.5">
            <button
              type="button"
              onClick={() => handleSelectPersona('alexey')}
              className="p-2 rounded-lg bg-surface hover:bg-surface-container border border-surface-container-highest flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-2">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&fit=crop" alt="" className="w-5 h-5 rounded-full object-cover" />
                <span className="text-xs font-semibold text-on-surface">{t.auth.alexey}</span>
              </div>
              <span className="font-label-caps text-[10px] uppercase text-secondary">{t.roles.MEMBER}</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectPersona('elena')}
              className="p-2 rounded-lg bg-surface hover:bg-surface-container border border-surface-container-highest flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center gap-2">
                <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&fit=crop" alt="" className="w-5 h-5 rounded-full object-cover" />
                <span className="text-xs font-semibold text-on-surface">{t.auth.elena}</span>
              </div>
              <span className="font-label-caps text-[10px] uppercase text-primary font-bold">{t.roles.OWNER}</span>
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block mb-1">
                  {t.auth.displayName}
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alexey Miller"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-sm text-on-surface"
                />
              </div>

              <div>
                <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block mb-1">
                  {t.auth.username}
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="alexey"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-sm text-on-surface font-mono"
                />
              </div>
            </>
          )}

          <div>
            <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block mb-1">
              {t.auth.email}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alexey@nest.family"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-sm text-on-surface font-mono"
            />
          </div>

          <div>
            <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block mb-1">
              {t.auth.password}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-lg bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-sm text-on-surface"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-on-surface text-surface font-label-caps text-xs uppercase tracking-wider font-bold hover:bg-primary transition-colors shadow-sm"
          >
            {isRegister ? t.auth.register : t.auth.login}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="text-center pt-2 border-t border-surface-container-highest">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="font-caption text-xs text-primary hover:underline"
          >
            {isRegister ? t.auth.switchLogin : t.auth.switchRegister}
          </button>
        </div>

      </div>
    </div>
  );
};
