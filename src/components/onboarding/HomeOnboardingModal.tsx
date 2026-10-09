import React, { useState, useEffect } from 'react';
import { Home } from '../../types/home';
import { UserRole } from '../../types/user';
import { useTranslation } from '../../locales';
import { 
  Home as HomeIcon, 
  CheckSquare, 
  Calendar, 
  TrendingUp, 
  Users, 
  History, 
  Settings, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Lock,
  CheckCircle2,
  Paperclip,
  Flame,
  Award
} from 'lucide-react';

export interface OnboardingState {
  isOpen: boolean;
  mode: 'creator' | 'joined';
  home?: Home;
  userRole?: UserRole;
  inviterName?: string;
}

interface HomeOnboardingModalProps {
  state: OnboardingState;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const HomeOnboardingModal: React.FC<HomeOnboardingModalProps> = ({
  state,
  onClose,
  onNavigateToTab,
}) => {
  const { t, language } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (state.isOpen) {
      setCurrentStep(0);
    }
  }, [state.isOpen]);

  if (!state.isOpen) return null;

  const { mode, home, userRole = 'MEMBER', inviterName = language === 'ru' ? 'Создатель Дома' : 'Home Creator' } = state;

  // Walkthrough steps for Creator mode
  const creatorSteps = [
    {
      id: 'welcome',
      icon: <HomeIcon className="w-8 h-8 text-primary" />,
      tag: language === 'ru' ? '01 // ВАША РЕЗИДЕНЦИЯ' : '01 // YOUR SANCTUARY',
      title: language === 'ru' ? 'Добро пожаловать домой.' : 'Welcome home.',
      description: language === 'ru'
        ? `Пространство «${home?.name || 'Мой Дом'}» успешно создано. Здесь вы можете организовывать задачи, приглашать близких и видеть всё происходящее в одном спокойном месте.`
        : `Space "${home?.name || 'My Home'}" is ready. Here you can organize everyday tasks, invite loved ones, and see everything happening in one serene place.`,
      highlight: language === 'ru' ? 'Ваш HOME принадлежит вам' : 'Your HOME belongs to you',
      highlightDetail: language === 'ru' 
        ? 'Полная изоляция от посторонних. Никакой рекламы и скрытых трекеров.' 
        : 'Zero outside interference. Zero ads and no behavioral tracking.',
      previewKey: 'home',
    },
    {
      id: 'tasks',
      icon: <CheckSquare className="w-8 h-8 text-emerald-500" />,
      tag: language === 'ru' ? '02 // ЗАДАЧИ И ПОРУЧЕНИЯ' : '02 // TASKS & CADENCE',
      title: language === 'ru' ? 'Тактильные карточки задач' : 'Tactile task cards',
      description: language === 'ru'
        ? 'Создавайте задачи, назначайте исполнителей, прикрепляйте учебные материалы и сканы решений. При необходимости работу можно вернуть на доработку с поясняющим комментарием.'
        : 'Create assignments, set assignees, attach worksheets, PDFs, and scans. If a solution needs refinement, send it for revision with focused guidance.',
      highlight: language === 'ru' ? 'Вдохновлено премиальной канцелярией' : 'Stationery-inspired cards',
      highlightDetail: language === 'ru'
        ? 'Чёткие сроки, приоритеты и гармоничные звуковые отклики при выполнении.'
        : 'Clear deadlines, priority colorways, and harmonic acoustic chimes.',
      previewKey: 'tasks',
    },
    {
      id: 'calendar',
      icon: <Calendar className="w-8 h-8 text-sky-500" />,
      tag: language === 'ru' ? '03 // ГОРИЗОНТ И РАСПИСАНИЕ' : '03 // CALENDAR & HORIZON',
      title: language === 'ru' ? 'Календарный горизонт' : 'Calendar horizon',
      description: language === 'ru'
        ? 'Планируйте расписание на недели вперёд. Выбирайте любой день, чтобы мгновенно просмотреть назначенные дела или запланировать новое событие.'
        : 'Plan your family schedule weeks ahead. Select any day to immediately view the daily task register or schedule an upcoming milestone.',
      highlight: language === 'ru' ? 'Контроль дедлайнов без тревоги' : 'Overdue awareness without anxiety',
      highlightDetail: language === 'ru'
        ? 'Просроченные задачи мягко акцентируются без навязчивого визуального шума.'
        : 'Timely reminders and clear visual indicators for overdue assignments.',
      previewKey: 'calendar',
    },
    {
      id: 'progress',
      icon: <TrendingUp className="w-8 h-8 text-amber-500" />,
      tag: language === 'ru' ? '04 // ТЕЛЕМЕТРИЯ ПРОГРЕССА' : '04 // PROGRESS TELEMETRY',
      title: language === 'ru' ? 'Честная семейная аналитика' : 'Honest household telemetry',
      description: language === 'ru'
        ? 'Наблюдайте динамику завершения, серии продуктивных дней и баланс по предметам. Всё основано на стабильном ритме семьи, а не токсичной геймификации.'
        : 'Track weekly completion velocity, daily streak momentum, and subject balance. Grounded in steady human rhythm, not stressful gamification.',
      highlight: language === 'ru' ? 'Устойчивые семейные привычки' : 'Steady family habits',
      highlightDetail: language === 'ru'
        ? 'Празднуйте совместные успехи и укрепляйте самостоятельность учеников.'
        : 'Celebrate shared milestones and encourage autonomous focus.',
      previewKey: 'progress',
    },
    {
      id: 'members',
      icon: <Users className="w-8 h-8 text-indigo-500" />,
      tag: language === 'ru' ? '05 // БЛИЗКИЙ КРУГ' : '05 // INNER CIRCLE',
      title: language === 'ru' ? 'Приглашайте участников по коду' : 'Invite participants by code',
      description: language === 'ru'
        ? `Короткий код вашего Дома: ${home?.inviteCode || 'NEST01'}. Отправьте его родным или ученикам. Вы сами распределяете роли: Владелец, Родитель или Участник.`
        : `Your private Home code is ${home?.inviteCode || 'NEST01'}. Share it with family members. You control granular roles: Owner, Parent, or Member.`,
      highlight: language === 'ru' ? 'Гранулярные права доступа' : 'Granular access control',
      highlightDetail: language === 'ru'
        ? 'Родители могут проверять задания, а участники концентрируются на делах.'
        : 'Parents manage and review assignments, while members focus on execution.',
      previewKey: 'members',
    },
    {
      id: 'atmosphere',
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      tag: language === 'ru' ? '06 // АТМОСФЕРА И НАСТРОЕНИЕ' : '06 // ATMOSPHERE & AMBIENCE',
      title: language === 'ru' ? 'Живая атмосфера пространства' : 'Living digital atmosphere',
      description: language === 'ru'
        ? 'Выбирайте настроение для своего Дома: Полночь, Облака, Закат, Океан или Северное сияние. Фон меняется динамически на всех устройствах семьи.'
        : 'Tailor your sanctuary mood: Midnight, Clouds, Sunset, Ocean, or Aurora. The background breathes harmoniously across all devices in your home.',
      highlight: language === 'ru' ? '5 уникальных визуальных миров' : '5 curated ambient backdrops',
      highlightDetail: language === 'ru'
        ? 'От глубокого ночного обсидиана до тактильной светлой бумаги.'
        : 'From celestial obsidian to warm tactile daytime alabaster.',
      previewKey: 'settings',
    },
  ];

  // Steps for Joined mode
  const joinedSteps = [
    {
      id: 'welcome-joined',
      icon: <HomeIcon className="w-8 h-8 text-primary" />,
      tag: language === 'ru' ? 'ВСТУПЛЕНИЕ В ДОМ' : 'JOINED SANCTUARY',
      title: language === 'ru' 
        ? `Добро пожаловать в ${home?.name || 'Дом'}.` 
        : `Welcome to ${home?.name || 'Home'}.`,
      description: language === 'ru'
        ? `Вы присоединились к семейному пространству, созданному организатором (${inviterName}). Здесь уже настроена атмосфера «${home?.atmosphere || 'Облака'}».`
        : `You have joined the household sanctuary created by ${inviterName}. Set to the "${home?.atmosphere || 'Clouds'}" atmosphere.`,
      highlight: language === 'ru' 
        ? `Ваша роль: ${t.roles[userRole]}` 
        : `Your Role: ${t.roles[userRole]}`,
      highlightDetail: userRole === 'PARENT' 
        ? (language === 'ru' 
            ? 'Как Родитель, вы можете создавать поручения, принимать выполненные задания и оставлять замечания.' 
            : 'As a Parent, you can create assignments, inspect submitted work, and request revisions.')
        : (language === 'ru'
            ? 'Как Участник, вы фокусируетесь на назначенных вам задачах, отмечаете их выполнение и прикрепляете решения.'
            : 'As a Member, you focus on your assigned tasks, mark progress, and attach solutions.'),
    },
    {
      id: 'joined-overview',
      icon: <CheckSquare className="w-8 h-8 text-emerald-500" />,
      tag: language === 'ru' ? 'ЧТО ВАС ЖДЁТ В ЭТОМ ДОМЕ' : 'WHAT AWAITS YOU HERE',
      title: language === 'ru' ? 'Ваш личный фокус и расписание' : 'Your personal cadence',
      description: language === 'ru'
        ? 'В разделе «Задачи» вы увидите всё, что назначено вам. В «Календаре» отображаются сроки на месяц, а в «Хронике» фиксируются все события Дома.'
        : 'In "Tasks" you will find everything assigned to you. "Calendar" shows monthly deadlines, and "Chronicle" logs all home activity.',
      highlight: language === 'ru' ? '100% приватность пространства' : '100% private haven',
      highlightDetail: language === 'ru'
        ? 'Доступ открыт только участникам этого Дома. Никаких посторонних.'
        : 'Accessible strictly to verified household members.',
    },
  ];

  const activeSteps = mode === 'creator' ? creatorSteps : joinedSteps;
  const step = activeSteps[currentStep] || activeSteps[0];
  const isLastStep = currentStep === activeSteps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onClose();
      if (mode === 'creator' && onNavigateToTab) {
        onNavigateToTab('tasks');
      }
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-3xl border border-surface-container-highest shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Top Progress & Close Bar */}
        <div className="p-6 pb-4 border-b border-surface-container-highest flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-xs text-primary font-bold tracking-widest uppercase">
              {step.tag}
            </span>
            <span className="text-secondary font-mono text-xs">
              ({currentStep + 1}/{activeSteps.length})
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            title={language === 'ru' ? 'Пропустить гид' : 'Skip walkthrough'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators */}
        <div className="w-full bg-surface-container-highest h-1 flex">
          {activeSteps.map((_, i) => (
            <div
              key={i}
              className={`h-full flex-1 transition-all duration-300 ${
                i <= currentStep ? 'bg-primary' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Step Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-surface-container border border-surface-container-highest flex items-center justify-center shadow-sm">
            {step.icon}
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-on-surface">
              {step.title}
            </h2>
            <p className="font-body-lg text-secondary text-sm sm:text-base leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Highlight Trust Card */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container-highest space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-on-surface uppercase font-label-caps tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>{step.highlight}</span>
            </div>
            <p className="font-body-sm text-xs text-secondary leading-relaxed pl-6">
              {step.highlightDetail}
            </p>
          </div>

        </div>

        {/* Bottom Actions Bar */}
        <div className="p-6 pt-4 border-t border-surface-container-highest bg-surface-container-low/40 flex items-center justify-between gap-4">
          
          {/* Back button or Skip */}
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="btn-snappy px-4 py-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container-highest text-secondary hover:text-on-surface font-label-caps text-xs uppercase tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{language === 'ru' ? 'Назад' : 'Back'}</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-3 py-2 text-secondary hover:text-on-surface font-label-caps text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              {language === 'ru' ? 'Пропустить' : 'Skip'}
            </button>
          )}

          {/* Next / Finish Button */}
          <button
            onClick={handleNext}
            className="btn-snappy px-6 py-3 rounded-2xl bg-on-surface text-surface hover:bg-primary transition-all font-label-caps text-xs uppercase tracking-wider font-bold shadow-card active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <span>
              {isLastStep
                ? (language === 'ru' ? 'Перейти в Дом' : 'Enter Home')
                : (language === 'ru' ? 'Далее' : 'Continue')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>
    </div>
  );
};
