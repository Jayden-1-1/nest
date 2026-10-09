import React, { useState } from 'react';
import { NestLogo } from '../components/common/NestLogo';
import { AtmosphereBackdrop } from '../components/common/AtmosphereBackdrop';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from '../locales';
import { UserRole } from '../types/user';
import { ALL_AVATARS, ROLE_AVATARS } from '../utils/avatars';
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Sparkles,
  ShieldCheck,
  Home as HomeIcon,
  ArrowRight,
  AlertCircle,
  Hash,
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'code' | 'register' | 'login';
  onBack: () => void;
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onBack, onSuccess }) => {
  const { login, register, loginByCode, isLoading } = useAuth();
  const { atmosphere } = useTheme();
  const { t, language } = useTranslation();

  const [mode, setMode] = useState<'code' | 'register' | 'login'>(initialMode);

  // Code entry form state
  const [homeCode, setHomeCode] = useState('');
  const [codeMemberName, setCodeMemberName] = useState('');
  const [codeRole, setCodeRole] = useState<UserRole>('MEMBER');
  const [codePassword, setCodePassword] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form state
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [homeName, setHomeName] = useState('');
  const [registerRole, setRegisterRole] = useState<UserRole>('OWNER');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState(ROLE_AVATARS[0].url);
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 9) score++;
    if (/[A-Z]/.test(pass) || /[А-Я]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9А-Яа-я]/.test(pass)) score++;
    return score;
  };

  const passwordScore = getPasswordStrength(registerPassword);

  // Handle Join by Code
  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeError(null);
    const cleanCode = homeCode.trim().toUpperCase();
    if (!cleanCode) {
      setCodeError(language === 'ru' ? 'Введите 6-значный код Дома' : 'Enter 6-char Home code');
      return;
    }

    if (!codeMemberName.trim()) {
      setCodeError(language === 'ru' ? 'Укажите ваше имя в семье' : 'Enter your name');
      return;
    }

    const res = await loginByCode(cleanCode, codeMemberName.trim(), codeRole, codePassword);
    if (res.success) {
      onSuccess();
    } else {
      setCodeError(res.error || (language === 'ru' ? 'Неверный код Дома' : 'Invalid Home code'));
    }
  };

  // Handle Real Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError(null);

    if (!displayName.trim()) {
      setRegisterError(language === 'ru' ? 'Пожалуйста, укажите ваше имя' : 'Please enter your name');
      return;
    }
    if (!username.trim()) {
      setRegisterError(language === 'ru' ? 'Пожалуйста, укажите логин (@ник)' : 'Please enter a username');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setRegisterError(language === 'ru' ? 'Введите корректный адрес электронной почты' : 'Please enter a valid email');
      return;
    }
    if (registerPassword.length < 6) {
      setRegisterError(language === 'ru' ? 'Пароль должен содержать не менее 6 символов' : 'Password must be at least 6 characters');
      return;
    }
    if (registerPassword !== confirmPassword) {
      setRegisterError(language === 'ru' ? 'Введённые пароли не совпадают' : 'Passwords do not match');
      return;
    }

    const res = await register({
      displayName: displayName.trim(),
      username: username.trim(),
      email: email.trim(),
      password: registerPassword,
      role: registerRole,
      homeName: homeName.trim() || undefined,
      avatarUrl: selectedAvatarUrl,
    });

    if (res.success) {
      onSuccess();
    } else {
      setRegisterError(res.error || (language === 'ru' ? 'Ошибка регистрации. Попробуйте ещё раз.' : 'Registration error.'));
    }
  };

  // Handle Real Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginIdentifier.trim()) {
      setLoginError(language === 'ru' ? 'Введите адрес почты или логин' : 'Please enter your email or username');
      return;
    }
    if (!loginPassword) {
      setLoginError(language === 'ru' ? 'Введите пароль' : 'Please enter your password');
      return;
    }

    const res = await login(loginIdentifier.trim(), loginPassword);
    if (res.success) {
      onSuccess();
    } else {
      setLoginError(res.error || (language === 'ru' ? 'Неверный логин или пароль' : 'Invalid login credentials'));
    }
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-8 bg-transparent transition-colors">
      <AtmosphereBackdrop atmosphere={atmosphere} />

      <div className="relative z-10 w-full max-w-lg bg-surface-container-lowest/90 dark:bg-surface-container-lowest/85 backdrop-blur-2xl rounded-3xl border border-surface-container-highest/80 p-6 sm:p-8 shadow-2xl space-y-6 transition-all duration-200">
        
        {/* Top Header & Brand */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-label-caps uppercase text-secondary hover:text-on-surface transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.common.back}</span>
          </button>

          <NestLogo height={24} className="h-6 w-auto" />
        </div>

        {/* Mode Selector Segmented Tabs */}
        <div className="p-1 rounded-2xl bg-surface-container-low border border-surface-container-highest grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 rounded-xl text-xs font-label-caps uppercase font-bold tracking-wider transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            {t.auth.login}
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 rounded-xl text-xs font-label-caps uppercase font-bold tracking-wider transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            {language === 'ru' ? 'Создать Дом' : 'New Home'}
          </button>
          <button
            type="button"
            onClick={() => setMode('code')}
            className={`py-2 rounded-xl text-xs font-label-caps uppercase font-bold tracking-wider transition-all cursor-pointer ${
              mode === 'code'
                ? 'bg-surface text-primary shadow-sm'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            {language === 'ru' ? 'По коду' : 'By Code'}
          </button>
        </div>

        {/* ======================================================== */}
        {/* MODE 1: REAL LOGIN FORM */}
        {/* ======================================================== */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="space-y-1">
              <h2 className="font-headline text-xl sm:text-2xl font-bold uppercase tracking-tight text-on-surface">
                {t.auth.login}
              </h2>
              <p className="font-caption text-xs text-secondary">
                {language === 'ru'
                  ? 'Войдите в ваш зарегистрированный семейный дом'
                  : 'Enter your registered family sanctuary'}
              </p>
            </div>

            {/* Email or Username */}
            <div className="space-y-1">
              <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                {language === 'ru' ? 'Почта или логин (@ник)' : 'Email or @username'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="name@example.com или @username"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-sm text-on-surface font-mono"
                />
                <User className="w-4 h-4 text-secondary absolute left-3 top-3" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                  {t.auth.password}
                </label>
              </div>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-sm text-on-surface font-mono"
                />
                <Lock className="w-4 h-4 text-secondary absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-2.5 text-secondary hover:text-on-surface transition-colors cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-error-container/20 border border-error/30 flex items-center gap-2 text-error text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-primary text-white font-label-caps text-xs uppercase tracking-wider font-bold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isLoading ? t.common.loading : t.auth.login}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Switch mode links */}
            <div className="pt-2 text-center space-y-2">
              <p className="text-xs text-secondary">
                {language === 'ru' ? 'Ещё нет аккаунта?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-primary hover:underline cursor-pointer"
                >
                  {language === 'ru' ? 'Создать свой Дом' : 'Create Home'}
                </button>
              </p>
              <p className="text-xs text-secondary">
                {language === 'ru' ? 'Получили код от семьи?' : 'Received a family invite code?'}{' '}
                <button
                  type="button"
                  onClick={() => setMode('code')}
                  className="font-bold text-on-surface hover:text-primary cursor-pointer"
                >
                  {language === 'ru' ? 'Войти по коду' : 'Join by code'}
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* MODE 2: REAL REGISTRATION & HOME PROVISIONING */}
        {/* ======================================================== */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[75vh] overflow-y-auto pr-1">
            <div className="space-y-1">
              <h2 className="font-headline text-xl sm:text-2xl font-bold uppercase tracking-tight text-on-surface">
                {language === 'ru' ? 'Создать Семейный Дом' : 'Create Family Sanctuary'}
              </h2>
              <p className="font-caption text-xs text-secondary">
                {language === 'ru'
                  ? 'Зарегистрируйте аккаунт и получите уникальный код для всей семьи'
                  : 'Register account and get unique home code for family members'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Display Name */}
              <div className="space-y-1">
                <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                  {language === 'ru' ? 'Ваше имя в семье *' : 'Your Name *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={language === 'ru' ? 'Мария, Александр...' : 'Sarah, John...'}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-xs text-on-surface font-sans"
                  />
                  <User className="w-3.5 h-3.5 text-secondary absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Username */}
              <div className="space-y-1">
                <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                  {language === 'ru' ? 'Логин (@ник) *' : 'Username *'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/^@/, ''))}
                    placeholder="maria_home"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-xs text-on-surface font-mono"
                  />
                  <Hash className="w-3.5 h-3.5 text-secondary absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                {language === 'ru' ? 'Электронная почта *' : 'Email Address *'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="family@example.com"
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-xs text-on-surface font-mono"
                />
                <Mail className="w-3.5 h-3.5 text-secondary absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Home Name */}
            <div className="space-y-1">
              <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                {language === 'ru' ? 'Название вашего Дома' : 'Home Name'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={homeName}
                  onChange={(e) => setHomeName(e.target.value)}
                  placeholder={language === 'ru' ? 'Наш Семейный Дом, Уютный Очаг...' : 'Our Family Home'}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-xs text-on-surface font-sans"
                />
                <HomeIcon className="w-3.5 h-3.5 text-secondary absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Role in Family */}
            <div className="space-y-1">
              <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                {language === 'ru' ? 'Ваша роль в доме' : 'Your Family Role'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'OWNER' as UserRole, label: language === 'ru' ? 'Владелец' : 'Owner', desc: language === 'ru' ? 'Создатель' : 'Creator' },
                  { id: 'PARENT' as UserRole, label: language === 'ru' ? 'Родитель' : 'Parent', desc: language === 'ru' ? 'Наставник' : 'Guide' },
                  { id: 'MEMBER' as UserRole, label: language === 'ru' ? 'Участник' : 'Member', desc: language === 'ru' ? 'Дети/родные' : 'Member' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRegisterRole(r.id)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      registerRole === r.id
                        ? 'bg-primary/10 border-primary text-primary font-bold'
                        : 'bg-surface-container-low border-surface-container-highest text-secondary hover:text-on-surface'
                    }`}
                  >
                    <span className="block text-xs font-semibold">{r.label}</span>
                    <span className="block text-[10px] text-secondary">{r.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Selector from SVG collection */}
            <div className="space-y-1.5">
              <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                {language === 'ru' ? 'Выберите аватар' : 'Choose Avatar'}
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 p-2 rounded-2xl bg-surface-container-low border border-surface-container-highest">
                {ALL_AVATARS.map((av) => {
                  const isSelected = selectedAvatarUrl === av.url;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatarUrl(av.url)}
                      className={`relative p-1 rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface scale-105'
                          : 'opacity-70 hover:opacity-100 hover:scale-102'
                      }`}
                      title={av.name}
                    >
                      <img src={av.url} alt={av.name} className="w-8 h-8 rounded-lg object-cover" />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-primary text-white rounded-full flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                  {t.auth.password} *
                </label>
                <div className="relative">
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-xs text-on-surface font-mono"
                  />
                  <Lock className="w-3.5 h-3.5 text-secondary absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-2.5 top-2.5 text-secondary hover:text-on-surface cursor-pointer"
                  >
                    {showRegisterPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                  {language === 'ru' ? 'Повторите пароль *' : 'Confirm Password *'}
                </label>
                <div className="relative">
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-xs text-on-surface font-mono"
                  />
                  <Lock className="w-3.5 h-3.5 text-secondary absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            {/* Password strength indicator */}
            {registerPassword && (
              <div className="space-y-1">
                <div className="flex gap-1 h-1.5 w-full">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <div
                      key={lvl}
                      className={`h-full flex-1 rounded-full transition-all ${
                        passwordScore >= lvl
                          ? passwordScore >= 4
                            ? 'bg-emerald-500'
                            : passwordScore >= 2
                              ? 'bg-amber-500'
                              : 'bg-error'
                          : 'bg-surface-container-highest'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-secondary">
                  {passwordScore <= 1
                    ? (language === 'ru' ? 'Слишком простой пароль' : 'Too weak')
                    : passwordScore <= 3
                      ? (language === 'ru' ? 'Средняя надёжность' : 'Moderate')
                      : (language === 'ru' ? 'Отличный надёжный пароль' : 'Strong password')}
                </span>
              </div>
            )}

            {registerError && (
              <div className="p-3 rounded-xl bg-error-container/20 border border-error/30 flex items-center gap-2 text-error text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{registerError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-primary text-white font-label-caps text-xs uppercase tracking-wider font-bold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? t.common.loading : (language === 'ru' ? 'Создать Дом и войти' : 'Create Home & Sign In')}</span>
            </button>

            <div className="pt-1 text-center">
              <p className="text-xs text-secondary">
                {language === 'ru' ? 'Уже есть аккаунт?' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-primary hover:underline cursor-pointer"
                >
                  {t.auth.login}
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* MODE 3: JOIN BY CODE FORM */}
        {/* ======================================================== */}
        {mode === 'code' && (
          <form onSubmit={handleCodeSubmit} className="space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="space-y-1">
              <h2 className="font-headline text-xl sm:text-2xl font-bold uppercase tracking-tight text-on-surface">
                {language === 'ru' ? 'Вход по коду Дома' : 'Join by Home Code'}
              </h2>
              <p className="font-caption text-xs text-secondary">
                {language === 'ru'
                  ? 'Введите 6-значный код приглашения, полученный от создателя Дома'
                  : 'Enter the 6-character invitation code from your family creator'}
              </p>
            </div>

            {/* Code Input */}
            <div className="space-y-1">
              <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                {language === 'ru' ? 'Код приглашения *' : 'Invite Code *'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={10}
                  value={homeCode}
                  onChange={(e) => setHomeCode(e.target.value.toUpperCase())}
                  placeholder="NEST01"
                  className="w-full pl-9 pr-3 py-3 rounded-2xl bg-surface-container-low border-2 border-surface-container-highest focus:border-primary focus:outline-none text-center font-mono text-xl font-bold tracking-widest text-on-surface uppercase"
                />
                <KeyRound className="w-5 h-5 text-secondary absolute left-3.5 top-3.5" />
              </div>
            </div>

            {/* Member Name */}
            <div className="space-y-1">
              <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                {language === 'ru' ? 'Ваше имя в семье *' : 'Your Name *'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={codeMemberName}
                  onChange={(e) => setCodeMemberName(e.target.value)}
                  placeholder={language === 'ru' ? 'Александр, Бабушка, Сын...' : 'Alex, Mom, Son...'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-sm text-on-surface font-sans"
                />
                <User className="w-4 h-4 text-secondary absolute left-3 top-3" />
              </div>
            </div>

            {/* Member Role */}
            <div className="space-y-1">
              <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                {language === 'ru' ? 'Роль в семье' : 'Role in Family'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'PARENT' as UserRole, label: language === 'ru' ? 'Родитель / Наставник' : 'Parent / Guide' },
                  { id: 'MEMBER' as UserRole, label: language === 'ru' ? 'Участник Дома' : 'Family Member' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setCodeRole(r.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      codeRole === r.id
                        ? 'bg-primary/10 border-primary text-primary font-bold'
                        : 'bg-surface-container-low border-surface-container-highest text-secondary hover:text-on-surface'
                    }`}
                  >
                    <span className="text-xs font-semibold">{r.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {codeError && (
              <div className="p-3 rounded-xl bg-error-container/20 border border-error/30 flex items-center gap-2 text-error text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{codeError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-primary text-white font-label-caps text-xs uppercase tracking-wider font-bold hover:bg-primary/90 active:scale-[0.98] transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isLoading ? t.common.loading : (language === 'ru' ? 'Присоединиться к семье' : 'Join Family')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center">
              <p className="text-xs text-secondary">
                {language === 'ru' ? 'Хотите создать свой собственный Дом?' : 'Want to create your own home?'}{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-primary hover:underline cursor-pointer"
                >
                  {language === 'ru' ? 'Регистрация нового Дома' : 'Register New Home'}
                </button>
              </p>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
