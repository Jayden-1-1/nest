import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from '../../locales';
import { useTheme } from '../../context/ThemeContext';
import { 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  HelpCircle,
  Eye,
  MapPin,
  Zap,
  MousePointer
} from 'lucide-react';

export interface SpotlightTutorialProps {
  isOpen: boolean;
  mode: 'creator' | 'joined';
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
  onOpenCreateTask?: () => void;
}

interface StepDefinition {
  id: string;
  targetSelector: string;
  fallbackTab?: string;
  badgeRu: string;
  badgeEn: string;
  titleRu: string;
  titleEn: string;
  whatRu: string;
  whatEn: string;
  whereRu: string;
  whereEn: string;
  whyRu: string;
  whyEn: string;
  whatHappensRu: string;
  whatHappensEn: string;
}

export const SpotlightTutorial: React.FC<SpotlightTutorialProps> = ({
  isOpen,
  mode,
  onClose,
  onNavigateToTab,
  onOpenCreateTask,
}) => {
  const { language } = useTranslation();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);

  // Creator Steps (9 Steps)
  const creatorSteps: StepDefinition[] = [
    {
      id: 'home-switcher',
      targetSelector: '[data-tutorial-target="home-switcher"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 01 / 09 · РЕЗИДЕНЦИЯ',
      badgeEn: 'STEP 01 / 09 · RESIDENCE',
      titleRu: 'Это ваш HOME',
      titleEn: 'This is your HOME',
      whatRu: 'Переключатель цифровых резиденций и пространств семьи',
      whatEn: 'Digital sanctuary switcher & family space menu',
      whereRu: 'В левом верхнем углу интерфейса',
      whereEn: 'Top-left corner of the header bar',
      whyRu: 'Позволяет переключаться между пространствами семьи, создавать новые дома или вступать по приглашению.',
      whyEn: 'Allows switching between family spaces, creating new homes, or joining with an invite code.',
      whatHappensRu: 'Раскрывает список всех ваших Домов с их индивидуальными атмосферами и ролями.',
      whatHappensEn: 'Opens the list of all your Homes with their individual atmospheres and roles.',
    },
    {
      id: 'invite-code',
      targetSelector: '[data-tutorial-target="invite-code-box"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 02 / 09 · БЛИЗКИЙ КРУГ',
      badgeEn: 'STEP 02 / 09 · INNER CIRCLE',
      titleRu: 'Код приглашения в Дом',
      titleEn: 'Sanctuary invite code',
      whatRu: 'Приватный 6-значный ключ доступа к Дому',
      whatEn: 'Private 6-character sanctuary access key',
      whereRu: 'В верхней панели дашборда рядом с таймером',
      whereEn: 'In the dashboard header next to focus timer',
      whyRu: 'Полная изоляция от посторонних. Никаких публичных ссылок — только те, кому вы лично передали код, войдут в Дом.',
      whyEn: 'Complete isolation from outsiders. Zero public links — only those you give the code to can enter.',
      whatHappensRu: 'Копирует код в буфер обмена для быстрой отправки родным через мессенджер.',
      whatHappensEn: 'Copies the code to clipboard to share with your family members via messenger.',
    },
    {
      id: 'create-task',
      targetSelector: '[data-tutorial-target="create-task-btn"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 03 / 09 · ПОРУЧЕНИЯ',
      badgeEn: 'STEP 03 / 09 · ASSIGNMENTS',
      titleRu: 'Создайте первую задачу',
      titleEn: 'Create your first intention',
      whatRu: 'Кнопка «Записать намерение» / Создание задачи',
      whatEn: '"Record intention" action button',
      whereRu: 'Главная контрастная кнопка действия на дашборде',
      whereEn: 'Primary high-contrast button on the dashboard',
      whyRu: 'Фиксация учебных заданий, домашних поручений и совместных семейных планов.',
      whyEn: 'Capturing academic assignments, chores, and shared family goals.',
      whatHappensRu: 'Открывает тактильную форму с выбором предмета, дедлайна, исполнителя и прикреплением файлов.',
      whatHappensEn: 'Opens tactile dialog with subject colorway, deadline, assignee, and file attachments.',
    },
    {
      id: 'task-card',
      targetSelector: '[data-tutorial-target="task-card-first"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 04 / 09 · ТАКТИЛЬНОСТЬ',
      badgeEn: 'STEP 04 / 09 · TACTILITY',
      titleRu: 'Карточка задачи и цикл доработки',
      titleEn: 'Task card & revision loop',
      whatRu: 'Интерактивная карточка в фокус-блоке Next Up',
      whatEn: 'Interactive tactile card in Next Up spotlight',
      whereRu: 'В центральном блоке ежедневного горизонта',
      whereEn: 'In the central daily horizon section',
      whyRu: 'Содержит статус, таймер фокусировки, сканы решений и возможность вернуть на доработку с комментарием.',
      whyEn: 'Holds status, focus timer, attached solution scans, and the gentle revision loop.',
      whatHappensRu: 'Клик открывает подробную карточку задачи, а отметка чекбокса воспроизводит гармоничный аккорд.',
      whatHappensEn: 'Clicking opens detailed modal; checking completes the task with a harmonic chime.',
    },
    {
      id: 'nav-calendar',
      targetSelector: '[data-tutorial-target="nav-calendar"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 05 / 09 · РАСПИСАНИЕ',
      badgeEn: 'STEP 05 / 09 · SCHEDULE',
      titleRu: 'Календарный горизонт',
      titleEn: 'Calendar horizon',
      whatRu: 'Месячная и недельная сетка планирования',
      whatEn: 'Monthly & weekly schedule grid',
      whereRu: 'В боковом меню навигации (или нижнем меню на мобильных)',
      whereEn: 'In the sidebar navigation menu (or bottom bar on mobile)',
      whyRu: 'Равномерно распределяет нагрузку на недели вперёд, наглядно отделяя учебные дни от дней отдыха.',
      whyEn: 'Evenly balances academic workload, separating busy days from designated rest days.',
      whatHappensRu: 'Переводит в интерактивный календарь с фильтрацией по дням и цветовыми маркерами.',
      whatHappensEn: 'Navigates to interactive calendar with day filter and color-coded priority dots.',
    },
    {
      id: 'nav-progress',
      targetSelector: '[data-tutorial-target="nav-progress"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 06 / 09 · ТЕЛЕМЕТРИЯ',
      badgeEn: 'STEP 06 / 09 · TELEMETRY',
      titleRu: 'Телеметрия прогресса и серии',
      titleEn: 'Progress telemetry & streaks',
      whatRu: 'Аналитика результативности и привычек',
      whatEn: 'Velocity & habit streak analytics',
      whereRu: 'В боковом меню навигации и круговом индикаторе дашборда',
      whereEn: 'In sidebar navigation and circular horizon gauge',
      whyRu: 'Честная статистика без токсичного давления: процент выполнения (88%) и серии без пропусков (14 дней).',
      whyEn: 'Honest statistics without stressful gamification: 88% completion and 14-day streak.',
      whatHappensRu: 'Открывает подробные графики предметного баланса и темпа завершения.',
      whatHappensEn: 'Opens deep analytics of subject balance and completion cadence.',
    },
    {
      id: 'nav-activity',
      targetSelector: '[data-tutorial-target="nav-activity"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 07 / 09 · ЛЕТОПИСЬ',
      badgeEn: 'STEP 07 / 09 · CHRONICLE',
      titleRu: 'Семейная летопись (Activity)',
      titleEn: 'Family chronicle (Activity)',
      whatRu: 'Хронологический журнал всех событий Дома',
      whatEn: 'Chronological event ledger of your Home',
      whereRu: 'В меню навигации',
      whereEn: 'In sidebar navigation',
      whyRu: 'Полная прозрачность: кто сдал задание, кто оставил комментарий и когда работа была принята.',
      whyEn: 'Complete transparency: who submitted work, who left guidance, and when it was approved.',
      whatHappensRu: 'Показывает непрерывную ленту жизни семьи в реальном времени.',
      whatHappensEn: 'Displays the living, continuous feed of family interactions in real time.',
    },
    {
      id: 'atmosphere-control',
      targetSelector: '[data-tutorial-target="atmosphere-control"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 08 / 09 · АТМОСФЕРА',
      badgeEn: 'STEP 08 / 09 · ATMOSPHERE',
      titleRu: 'Живая атмосфера пространства',
      titleEn: 'Living digital atmosphere',
      whatRu: 'Кнопка выбора природной атмосферы',
      whatEn: 'Atmosphere switcher button',
      whereRu: 'В правом верхнем углу панели управления',
      whereEn: 'In top-right header controls',
      whyRu: '5 природных фонов (Облака, Полночь, Закат, Океан, Северное сияние), синхронизированных на всех экранах семьи.',
      whyEn: '5 curated generative environments (Clouds, Midnight, Sunset, Ocean, Aurora), synced for the family.',
      whatHappensRu: 'Мгновенно меняет живую симуляцию Canvas 60 FPS на фоне интерфейса.',
      whatHappensEn: 'Instantly transitions the smooth 60 FPS generative Canvas backdrop.',
    },
    {
      id: 'nav-settings',
      targetSelector: '[data-tutorial-target="nav-settings"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 09 / 09 · НАСТРОЙКИ',
      badgeEn: 'STEP 09 / 09 · PREFERENCES',
      titleRu: 'Параметры и повтор обучения',
      titleEn: 'Settings & tutorial replay',
      whatRu: 'Раздел системных настроек',
      whatEn: 'System settings & preferences section',
      whereRu: 'Нижний пункт бокового меню',
      whereEn: 'Bottom item of the navigation menu',
      whyRu: 'Управление темами, звуковыми откликами, приватностью и возможность в любой момент перезапустить этот тур.',
      whyEn: 'Configure themes, acoustic chimes, privacy rules, and replay this interactive walkthrough anytime.',
      whatHappensRu: 'Позволяет персонализировать параметры или повторить обучение кнопкой «Повторить обучение».',
      whatHappensEn: 'Lets you customize preferences or restart the tour with "Replay tutorial".',
    },
  ];

  // Joined Member Steps (8 Steps)
  const joinedSteps: StepDefinition[] = [
    {
      id: 'home-switcher',
      targetSelector: '[data-tutorial-target="home-switcher"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 01 / 08 · РЕЗИДЕНЦИЯ',
      badgeEn: 'STEP 01 / 08 · SANCTUARY',
      titleRu: 'Ваше семейное пространство',
      titleEn: 'Your family sanctuary',
      whatRu: 'Приватное цифровое пространство Дома',
      whatEn: 'Private sanctuary space of your Home',
      whereRu: 'В левом верхнем углу интерфейса',
      whereEn: 'Top-left corner of the header',
      whyRu: 'Вы находитесь в закрытом пространстве, куда вас пригласили. Ваши задачи и диалоги защищены от внешнего мира.',
      whyEn: 'You are inside a secure space you were invited to. All your tasks and discussions are strictly private.',
      whatHappensRu: 'Показывает статус подключения к Дому.',
      whatHappensEn: 'Displays connection status and Home name.',
    },
    {
      id: 'user-role-badge',
      targetSelector: '[data-tutorial-target="user-role-badge"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 02 / 08 · РОЛЬ И ПРАВА',
      badgeEn: 'STEP 02 / 08 · ROLE & ACCESS',
      titleRu: 'Ваша роль: Участник Дома',
      titleEn: 'Your role: Family Member',
      whatRu: 'Бейдж вашей текущей роли в Доме',
      whatEn: 'Badge indicating your role in this Home',
      whereRu: 'Под названием Дома в верхнем меню',
      whereEn: 'Under the Home name in header',
      whyRu: 'У вас есть доступ к выполнению назначенных задач, отправке решений родителям и участию в обсуждениях.',
      whyEn: 'You can complete assigned intentions, submit solutions to parents, and take part in comments.',
      whatHappensRu: 'Определяет ваши полномочия без лишней административной нагрузки.',
      whatHappensEn: 'Defines your permissions, keeping your focus on execution.',
    },
    {
      id: 'task-card',
      targetSelector: '[data-tutorial-target="task-card-first"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 03 / 08 · ВЫПОЛНЕНИЕ',
      badgeEn: 'STEP 03 / 08 · EXECUTION',
      titleRu: 'Ваши поручения и сдача решений',
      titleEn: 'Your assignments & solutions',
      whatRu: 'Карточка задачи в блоке Next Up',
      whatEn: 'Task card in Next Up slot',
      whereRu: 'В центре дашборда',
      whereEn: 'In the center of the dashboard',
      whyRu: 'Здесь отображаются назначенные вам дела. Вы можете отмечать статус и прикреплять сканы решений.',
      whyEn: 'Shows what has been assigned to you. You can update progress and attach worksheets or scans.',
      whatHappensRu: 'После завершения задание отправляется на проверку родителю.',
      whatHappensEn: 'Completing sends the assignment for parental review.',
    },
    {
      id: 'nav-calendar',
      targetSelector: '[data-tutorial-target="nav-calendar"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 04 / 08 · ГОРИЗОНТ',
      badgeEn: 'STEP 04 / 08 · HORIZON',
      titleRu: 'Ваш календарь и дедлайны',
      titleEn: 'Your calendar & deadlines',
      whatRu: 'Календарный горизонт по дням',
      whatEn: 'Day-by-day calendar schedule',
      whereRu: 'В боковом меню навигации',
      whereEn: 'In the sidebar navigation menu',
      whyRu: 'Помогает видеть предстоящие дедлайны по предметам и заранее готовиться к урокам.',
      whyEn: 'Helps anticipate upcoming deadlines and prepare for classes in advance.',
      whatHappensRu: 'Открывает дневной реестр со всеми запланированными делами.',
      whatHappensEn: 'Opens the daily schedule with all planned intentions.',
    },
    {
      id: 'nav-progress',
      targetSelector: '[data-tutorial-target="nav-progress"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 05 / 08 · ПРИВЫЧКИ',
      badgeEn: 'STEP 05 / 08 · HABITS',
      titleRu: 'Личный прогресс и серии дней',
      titleEn: 'Personal progress & streaks',
      whatRu: 'Счётчик продуктивных дней (Streak)',
      whatEn: 'Productive day streak counter',
      whereRu: 'В меню навигации и на дашборде',
      whereEn: 'In navigation and on dashboard',
      whyRu: 'Показывает непрерывную серию активных дней. Формирует уверенность в своих силах.',
      whyEn: 'Shows your unbroken streak of active days, building confidence and steady rhythm.',
      whatHappensRu: 'Фиксирует каждый день с выполненными намерениями.',
      whatHappensEn: 'Records every day with verified completed tasks.',
    },
    {
      id: 'nav-activity',
      targetSelector: '[data-tutorial-target="nav-activity"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 06 / 08 · ХРОНИКА',
      badgeEn: 'STEP 06 / 08 · CHRONICLE',
      titleRu: 'Семейная хроника событий',
      titleEn: 'Family event chronicle',
      whatRu: 'Лента активности всего Дома',
      whatEn: 'Sanctuary-wide activity feed',
      whereRu: 'В боковом меню навигации',
      whereEn: 'In the navigation sidebar',
      whyRu: 'Вы видите замечания родителей, подтверждения выполненных работ и изменения в задачах.',
      whyEn: 'You see parents feedback, task approvals, and comments in one clear place.',
      whatHappensRu: 'Обеспечивает открытый и уважительный диалог в семье.',
      whatHappensEn: 'Ensures open, respectful family communication.',
    },
    {
      id: 'nav-members',
      targetSelector: '[data-tutorial-target="nav-members"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 07 / 08 · БЛИЗКИЕ',
      badgeEn: 'STEP 07 / 08 · MEMBERS',
      titleRu: 'Круг участников Дома',
      titleEn: 'Inner circle roster',
      whatRu: 'Список всех членов вашей семьи',
      whatEn: 'Roster of all family members',
      whereRu: 'В боковом меню',
      whereEn: 'In the sidebar menu',
      whyRu: 'Показывает, кто ещё состоит в Доме и какие роли занимает.',
      whyEn: 'Shows who else is in this sanctuary and what roles they hold.',
      whatHappensRu: 'Отображает аватары и статусы близких.',
      whatHappensEn: 'Displays avatars and statuses of loved ones.',
    },
    {
      id: 'user-profile',
      targetSelector: '[data-tutorial-target="user-profile"]',
      fallbackTab: 'home',
      badgeRu: 'ШАГ 08 / 08 · ПЕРСОНАЛИЗАЦИЯ',
      badgeEn: 'STEP 08 / 08 · PROFILE',
      titleRu: 'Ваш профиль и повтор тура',
      titleEn: 'Your profile & replay tour',
      whatRu: 'Кнопка профиля и настроек',
      whatEn: 'Profile & preferences menu',
      whereRu: 'В правом верхнем углу интерфейса',
      whereEn: 'In top-right corner of header',
      whyRu: 'Выбирайте персональный аватар, переключайте язык (RU/EN) или запускайте этот тур заново.',
      whyEn: 'Select custom avatar, toggle language, or replay this tutorial anytime.',
      whatHappensRu: 'Сохраняет ваши персональные предпочтения.',
      whatHappensEn: 'Saves your personal preferences.',
    },
  ];

  const steps = mode === 'creator' ? creatorSteps : joinedSteps;
  const currentStep = steps[currentStepIndex] || steps[0];

  // Locate target DOM element
  const updateTargetRect = useCallback(() => {
    if (!isOpen) return;
    const el = document.querySelector(currentStep.targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
    } else {
      setTargetRect(null);
    }
  }, [isOpen, currentStep.targetSelector]);

  // Handle step change
  useEffect(() => {
    if (!isOpen) return;

    // Navigate to fallback tab if specified
    if (currentStep.fallbackTab && onNavigateToTab) {
      onNavigateToTab(currentStep.fallbackTab);
    }

    // Give DOM a frame to settle, then measure
    const timer = setTimeout(() => {
      updateTargetRect();
    }, 80);

    return () => clearTimeout(timer);
  }, [isOpen, currentStepIndex, currentStep, onNavigateToTab, updateTargetRect]);

  // Listen to resize and scroll
  useEffect(() => {
    if (!isOpen) return;

    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect, true);

    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect, true);
    };
  }, [isOpen, updateTargetRect]);

  // Calculate Popover Position
  useEffect(() => {
    if (!isOpen) return;

    const viewportW = window.innerWidth;
    const viewportH = window.innerHeight;
    const popoverW = Math.min(420, viewportW - 32);
    const popoverH = 340; // estimated max height

    if (!targetRect) {
      // Centered fallback
      setPopoverPos({
        top: Math.max(80, (viewportH - popoverH) / 2),
        left: (viewportW - popoverW) / 2,
      });
      return;
    }

    let top = 0;
    let left = 0;

    // Determine smart placement relative to target
    const spaceBelow = viewportH - targetRect.bottom;
    const spaceAbove = targetRect.top;
    const spaceRight = viewportW - targetRect.right;
    const spaceLeft = targetRect.left;

    if (spaceRight >= popoverW + 24) {
      // Position to the right
      left = targetRect.right + 20;
      top = Math.max(76, Math.min(targetRect.top - 20, viewportH - popoverH - 24));
    } else if (spaceBelow >= popoverH + 24) {
      // Position below
      top = targetRect.bottom + 20;
      left = Math.max(16, Math.min(targetRect.left, viewportW - popoverW - 16));
    } else if (spaceAbove >= popoverH + 24) {
      // Position above
      top = targetRect.top - popoverH - 20;
      left = Math.max(16, Math.min(targetRect.left, viewportW - popoverW - 16));
    } else if (spaceLeft >= popoverW + 24) {
      // Position to the left
      left = targetRect.left - popoverW - 20;
      top = Math.max(76, Math.min(targetRect.top - 20, viewportH - popoverH - 24));
    } else {
      // Clamp comfortably in center-bottom
      top = Math.max(76, Math.min(viewportH - popoverH - 24, targetRect.bottom + 16));
      left = (viewportW - popoverW) / 2;
    }

    // Safety boundary clamping
    left = Math.max(16, Math.min(left, viewportW - popoverW - 16));
    top = Math.max(76, Math.min(top, viewportH - popoverH - 16));

    setPopoverPos({ top, left });
  }, [isOpen, targetRect]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    try {
      localStorage.setItem('nest_tutorial_completed', 'true');
    } catch {
      // LocalStorage access may be restricted
    }
    onClose();
  };

  // Curved Arrow SVG calculation
  const renderCurvedArrow = () => {
    if (!targetRect || !popoverPos) return null;

    const pW = popoverRef.current ? popoverRef.current.offsetWidth : 400;
    const pH = popoverRef.current ? popoverRef.current.offsetHeight : 320;

    const pBox = {
      left: popoverPos.left,
      top: popoverPos.top,
      right: popoverPos.left + pW,
      bottom: popoverPos.top + pH,
      cx: popoverPos.left + pW / 2,
      cy: popoverPos.top + pH / 2,
    };

    const tBox = {
      left: targetRect.left,
      top: targetRect.top,
      right: targetRect.right,
      bottom: targetRect.bottom,
      cx: targetRect.left + targetRect.width / 2,
      cy: targetRect.top + targetRect.height / 2,
    };

    // Calculate closest boundary anchor points
    let startX = pBox.cx;
    let startY = pBox.cy;
    let endX = tBox.cx;
    let endY = tBox.cy;

    if (pBox.left > tBox.right) {
      // Popover is to the right of target
      startX = pBox.left;
      startY = Math.min(Math.max(tBox.cy, pBox.top + 30), pBox.bottom - 30);
      endX = tBox.right + 6;
      endY = tBox.cy;
    } else if (pBox.right < tBox.left) {
      // Popover is to the left of target
      startX = pBox.right;
      startY = Math.min(Math.max(tBox.cy, pBox.top + 30), pBox.bottom - 30);
      endX = tBox.left - 6;
      endY = tBox.cy;
    } else if (pBox.top > tBox.bottom) {
      // Popover is below target
      startX = pBox.cx;
      startY = pBox.top;
      endX = tBox.cx;
      endY = tBox.bottom + 6;
    } else {
      // Popover is above target
      startX = pBox.cx;
      startY = pBox.bottom;
      endX = tBox.cx;
      endY = tBox.top - 6;
    }

    // Bezier control points for a smooth organic curve
    const dx = endX - startX;
    const dy = endY - startY;
    const cx1 = startX + dx * 0.25;
    const cy1 = startY + dy * 0.75;
    const cx2 = startX + dx * 0.75;
    const cy2 = startY + dy * 0.25;

    // Arrow tangent angle
    const angle = Math.atan2(endY - cy2, endX - cx2);
    const arrowLen = 14;
    const p1X = endX;
    const p1Y = endY;
    const p2X = endX - arrowLen * Math.cos(angle - 0.45);
    const p2Y = endY - arrowLen * Math.sin(angle - 0.45);
    const p3X = endX - arrowLen * Math.cos(angle + 0.45);
    const p3Y = endY - arrowLen * Math.sin(angle + 0.45);

    return (
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-[105]">
        <defs>
          <filter id="arrow-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#0F4CFF" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Animated fluid trajectory path */}
        <path
          d={`M ${startX} ${startY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${endX} ${endY}`}
          fill="none"
          stroke="#0F4CFF"
          strokeWidth="2.5"
          strokeDasharray="6 4"
          filter="url(#arrow-glow)"
          className="animate-pulse"
        />

        {/* Arrow head pointing at exact target */}
        <polygon
          points={`${p1X},${p1Y} ${p2X},${p2Y} ${p3X},${p3Y}`}
          fill="#0F4CFF"
          stroke="#FFFFFF"
          strokeWidth="1"
          filter="url(#arrow-glow)"
        />

        {/* Start dot on popover */}
        <circle cx={startX} cy={startY} r="4" fill="#0F4CFF" />
      </svg>
    );
  };

  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] select-none">
      
      {/* 1. SVG Cutout Mask for Dark Backdrop & Spotlight Ring */}
      <svg className="fixed inset-0 w-full h-full pointer-events-none z-[101]">
        <defs>
          <mask id="tutorial-spotlight-mask">
            {/* White area covers entire screen (visible) */}
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            
            {/* Black cutout reveals target element underneath */}
            {targetRect && (
              <rect
                x={targetRect.left - 6}
                y={targetRect.top - 6}
                width={targetRect.width + 12}
                height={targetRect.height + 12}
                rx="14"
                ry="14"
                fill="black"
              />
            )}
          </mask>
        </defs>

        {/* Dim Overlay with Cutout */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(8, 12, 22, 0.76)"
          mask="url(#tutorial-spotlight-mask)"
        />

        {/* Glowing Spotlight Focus Rings around Target */}
        {targetRect && (
          <g>
            <rect
              x={targetRect.left - 6}
              y={targetRect.top - 6}
              width={targetRect.width + 12}
              height={targetRect.height + 12}
              rx="14"
              ry="14"
              fill="none"
              stroke="#0F4CFF"
              strokeWidth="2.5"
              className="animate-pulse"
            />
            <rect
              x={targetRect.left - 10}
              y={targetRect.top - 10}
              width={targetRect.width + 20}
              height={targetRect.height + 20}
              rx="18"
              ry="18"
              fill="none"
              stroke="#0F4CFF"
              strokeWidth="1"
              strokeOpacity="0.35"
            />
          </g>
        )}
      </svg>

      {/* 2. Curved Directional Arrow */}
      {renderCurvedArrow()}

      {/* 3. The Interactive Popover Card */}
      {popoverPos && (
        <div
          ref={popoverRef}
          style={{
            top: `${popoverPos.top}px`,
            left: `${popoverPos.left}px`,
            width: 'min(420px, calc(100vw - 32px))',
          }}
          className="fixed z-[110] p-6 sm:p-7 rounded-3xl bg-surface-container-lowest/95 dark:bg-[#0B101E]/95 backdrop-blur-2xl border-2 border-primary/40 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto text-on-surface"
        >
          {/* Top Tag & Close/Skip Button */}
          <div className="flex items-center justify-between gap-2 border-b border-surface-container-highest/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-primary">
                {language === 'ru' ? currentStep.badgeRu : currentStep.badgeEn}
              </span>
            </div>

            <button
              onClick={handleComplete}
              className="p-1 rounded-lg text-secondary hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
              title={language === 'ru' ? 'Закрыть обучение' : 'Close tutorial'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title */}
          <div>
            <h3 className="font-headline text-lg sm:text-xl font-extrabold uppercase tracking-tight text-on-surface">
              {language === 'ru' ? currentStep.titleRu : currentStep.titleEn}
            </h3>
          </div>

          {/* 4-Item Context Breakdown: WHAT, WHERE, WHY, WHAT HAPPENS */}
          <div className="space-y-2.5 text-xs">
            
            {/* ЧТО (WHAT) */}
            <div className="p-2.5 rounded-xl bg-surface-container-low/70 dark:bg-surface-container-high/40 border border-surface-container-highest/70 flex items-start gap-2.5">
              <Eye className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-label-caps text-[10px] font-bold uppercase tracking-wider text-primary block">
                  {language === 'ru' ? 'ЧТО ЭТО:' : 'WHAT IT IS:'}
                </span>
                <p className="text-on-surface font-medium leading-relaxed">
                  {language === 'ru' ? currentStep.whatRu : currentStep.whatEn}
                </p>
              </div>
            </div>

            {/* ГДЕ (WHERE) */}
            <div className="p-2.5 rounded-xl bg-surface-container-low/70 dark:bg-surface-container-high/40 border border-surface-container-highest/70 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-label-caps text-[10px] font-bold uppercase tracking-wider text-sky-500 block">
                  {language === 'ru' ? 'ГДЕ НАХОДИТСЯ:' : 'LOCATION:'}
                </span>
                <p className="text-secondary leading-relaxed">
                  {language === 'ru' ? currentStep.whereRu : currentStep.whereEn}
                </p>
              </div>
            </div>

            {/* ЗАЧЕМ (WHY) */}
            <div className="p-2.5 rounded-xl bg-surface-container-low/70 dark:bg-surface-container-high/40 border border-surface-container-highest/70 flex items-start gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-label-caps text-[10px] font-bold uppercase tracking-wider text-amber-500 block">
                  {language === 'ru' ? 'ЗАЧЕМ НАЖИМАТЬ:' : 'WHY USE IT:'}
                </span>
                <p className="text-secondary leading-relaxed">
                  {language === 'ru' ? currentStep.whyRu : currentStep.whyEn}
                </p>
              </div>
            </div>

            {/* ЧТО ПРОИЗОЙДЁТ (WHAT HAPPENS) */}
            <div className="p-2.5 rounded-xl bg-surface-container-low/70 dark:bg-surface-container-high/40 border border-surface-container-highest/70 flex items-start gap-2.5">
              <Zap className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-label-caps text-[10px] font-bold uppercase tracking-wider text-emerald-500 block">
                  {language === 'ru' ? 'ЧТО ПРОИЗОЙДЁТ:' : 'WHAT HAPPENS:'}
                </span>
                <p className="text-secondary leading-relaxed">
                  {language === 'ru' ? currentStep.whatHappensRu : currentStep.whatHappensEn}
                </p>
              </div>
            </div>

          </div>

          {/* Progress dots bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1.5">
              {steps.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentStepIndex 
                      ? 'w-6 bg-primary' 
                      : idx < currentStepIndex 
                        ? 'w-2 bg-primary/40' 
                        : 'w-2 bg-surface-container-highest'
                  }`}
                  title={`Step ${idx + 1}`}
                />
              ))}
            </div>

            <span className="font-mono text-[10px] text-secondary">
              {currentStepIndex + 1} / {steps.length}
            </span>
          </div>

          {/* Action Navigation Buttons */}
          <div className="pt-2 border-t border-surface-container-highest/60 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentStepIndex === 0}
                className={`btn-snappy px-3 py-2 rounded-xl border border-surface-container-highest font-label-caps text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  currentStepIndex === 0 
                    ? 'opacity-40 cursor-not-allowed text-secondary' 
                    : 'text-on-surface hover:bg-surface-container'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{language === 'ru' ? 'Назад' : 'Back'}</span>
              </button>

              <button
                onClick={handleComplete}
                className="btn-snappy px-3 py-2 rounded-xl text-secondary hover:text-on-surface font-label-caps text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                {language === 'ru' ? 'Пропустить' : 'Skip'}
              </button>
            </div>

            <button
              onClick={handleNext}
              className="btn-snappy px-5 py-2.5 rounded-xl bg-primary text-white font-label-caps text-xs uppercase tracking-wider font-bold shadow-md hover:opacity-95 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>
                {isLastStep 
                  ? (language === 'ru' ? 'Завершить тур' : 'Finish tour') 
                  : (language === 'ru' ? 'Далее' : 'Next')}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
