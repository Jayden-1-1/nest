import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHome } from '../context/HomeContext';
import { useTasks } from '../context/TaskContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { useTranslation } from '../locales';
import { Task } from '../types/task';
import { AtmosphereType } from '../types/home';
import { StatusPill } from '../components/common/StatusPill';
import { PriorityTag } from '../components/common/PriorityTag';
import { Avatar } from '../components/common/Avatar';
import { NestLogo } from '../components/common/NestLogo';
import { formatLocalDate } from '../utils/date';
import { 
  HeroPenUnderline, 
  PenStar, 
  PenCircle,
  MarkerHighlight 
} from '../components/common/ControlledImperfection';
import { 
  Plus, 
  Play, 
  Pause, 
  Check, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Users,
  Copy,
  History,
  TrendingUp,
  MessageSquare,
  Flame,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface DashboardPageProps {
  onOpenCreateTask: () => void;
  onSelectTask: (task: Task) => void;
  onNavigate: (route: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenCreateTask,
  onSelectTask,
  onNavigate,
}) => {
  const { user } = useAuth();
  const { currentHome, currentUserRole, isOwner, updateHome } = useHome();
  const { tasks, toggleTaskStatus, activity } = useTasks();
  const { atmosphere, setAtmosphere } = useTheme();
  const toast = useToast();
  const { t, language } = useTranslation();

  // Focus Session Timer (25 minutes)
  const [focusActive, setFocusActive] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  const [copiedInvite, setCopiedInvite] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (focusActive && focusSeconds > 0) {
      interval = setInterval(() => {
        setFocusSeconds((prev) => prev - 1);
      }, 1000);
    } else if (focusSeconds === 0) {
      setFocusActive(false);
      toast.success('Focus session completed! Take a mindful rest.');
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusActive, focusSeconds, toast]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const todayStr = formatLocalDate(new Date());
  const todayTasks = tasks.filter((task) => task.date === todayStr);
  const completedToday = todayTasks.filter((task) => task.status === 'DONE').length;
  const remainingToday = todayTasks.length - completedToday;
  const completionRate = todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0;

  // Next up task (first in-progress or todo task)
  const nextUpTask =
    todayTasks.find((task) => task.status === 'IN_PROGRESS') ||
    todayTasks.find((task) => task.status === 'TODO') ||
    todayTasks[0] ||
    tasks.find((task) => task.status !== 'DONE') ||
    tasks[0];

  const currentDateFormatted = new Date().toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).toUpperCase();

  const currentHour = new Date().getHours();
  const greetingText =
    currentHour < 12
      ? t.dashboard.greetingMorning
      : currentHour < 18
        ? t.dashboard.greetingDay
        : t.dashboard.greetingEvening;

  const handleCopyInvite = async () => {
    if (!currentHome) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(currentHome.inviteCode);
      } else {
        const input = document.createElement('input');
        input.value = currentHome.inviteCode;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopiedInvite(true);
      toast.success(t.common.copied);
      setTimeout(() => setCopiedInvite(false), 2000);
    } catch {
      toast.info(`Invite Code: ${currentHome.inviteCode}`);
    }
  };

  const atmospheresList: AtmosphereType[] = ['Clouds', 'Midnight', 'Sunset', 'Ocean', 'Aurora'];

  return (
    <div className="w-full space-y-8 sm:space-y-12 animate-in fade-in duration-300">
      
      {/* =========================================================================
          SECTION 1 — EDITORIAL SANCTUARY BRAND BANNER
          ========================================================================= */}
      <section className="relative w-full p-6 sm:p-8 bg-surface-container-lowest/85 backdrop-blur-xl rounded-3xl border border-surface-container-highest/80 shadow-card overflow-hidden">
        {/* Ambient subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-4 max-w-2xl">
            
            {/* Top metadata edition tags */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-secondary">
              <span className="font-label-caps tracking-widest text-primary uppercase font-bold px-2 py-0.5 rounded-md bg-primary-fixed/30 border border-primary/20">
                DIGITAL SANCTUARY // MONOGRAPH
              </span>
              <span className="text-outline-variant">/</span>
              <span className="font-label-caps tracking-wider text-on-surface uppercase font-bold">
                {currentHome?.name || t.common.appName}
              </span>
              <span className="text-outline-variant">/</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container border border-surface-container-highest text-primary font-caption text-[10px] uppercase font-bold">
                <Sparkles className="w-2.5 h-2.5 text-primary" />
                {atmosphere}
              </span>
            </div>

            {/* Official NEST Wordmark & Brand Lockup */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <NestLogo variant="wordmark" className="h-8 sm:h-9 w-auto" />
                <span className="text-outline-variant font-mono text-sm hidden sm:inline">|</span>
                <span className="font-label-caps text-xs sm:text-sm uppercase tracking-[0.2em] text-secondary font-bold hidden sm:inline">
                  {t.welcome.heroTag}
                </span>
                <PenStar className="w-4 h-4 text-primary shrink-0" />
              </div>
              <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-on-surface leading-tight select-none">
                {greetingText}, {user?.displayName || "ALEXEY"}.
              </h1>
              <HeroPenUnderline className="text-primary w-48 sm:w-64 h-3.5" />
            </div>

            {/* Editorial description */}
            <p className="font-body-sm sm:font-body-md text-secondary text-xs sm:text-sm leading-relaxed max-w-xl">
              {language === 'ru' 
                ? 'Ваше суверенное цифровое пространство для согласованности семейного ритма, ежедневных намерений и спокойного совместного движения вперед.' 
                : 'A sovereign digital sanctuary for family cadence, everyday intentions, and steady collective progress.'}
            </p>
          </div>

          {/* Quick Snappy Youth Action Buttons */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
            <button
              onClick={onOpenCreateTask}
              className="btn-snappy group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-on-surface text-surface rounded-2xl shadow-card hover:bg-primary transition-all active:scale-95 cursor-pointer font-label-caps text-xs tracking-wider uppercase font-bold"
            >
              <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
              <span>{t.dashboard.recordIntention}</span>
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setFocusActive(!focusActive)}
                className="btn-snappy flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-low hover:bg-surface-container border border-surface-container-highest text-on-surface rounded-2xl text-xs font-semibold cursor-pointer active:scale-95"
              >
                {focusActive ? <Pause className="w-3.5 h-3.5 text-amber-500" /> : <Play className="w-3.5 h-3.5 text-primary" />}
                <span className="font-mono">{focusActive ? formatTimer(focusSeconds) : '25:00'}</span>
                <span className="font-label-caps text-[11px] uppercase text-secondary">
                  {focusActive ? t.dashboard.pauseFocus : t.dashboard.beginFocus}
                </span>
              </button>

              <button
                onClick={handleCopyInvite}
                className="btn-snappy inline-flex items-center justify-center gap-2 px-3.5 py-3 bg-surface-container-low hover:bg-surface-container border border-surface-container-highest text-on-surface rounded-2xl transition-all text-xs font-semibold cursor-pointer active:scale-95"
                title="Copy Home Invite Code"
              >
                {copiedInvite ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-secondary" />}
                <span className="font-mono text-xs">{currentHome?.inviteCode || 'NEST01'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Horizon Quick Bar */}
        <div className="mt-6 pt-4 border-t border-surface-container-highest/60 flex flex-wrap items-center justify-between gap-y-2 text-secondary font-caption text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold tracking-wider text-on-surface uppercase font-mono">
              {currentDateFormatted}
            </span>
            <span className="text-outline-variant font-mono">/</span>
            <span className="uppercase tracking-wider">
              {t.dashboard.cadenceSteady}
            </span>
            <span className="text-outline-variant font-mono">/</span>
            <span className="font-label-caps uppercase text-primary font-bold">
              {t.dashboard.cycleActive}
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span>{todayTasks.length} {t.dashboard.tasksToday}</span>
            <span>·</span>
            <span className="text-primary font-bold">{completionRate}% {t.common.completed}</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — HERO SPREADS: DAILY HORIZON & NEXT UP SPOTLIGHT
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Card: Daily Horizon Counter */}
        <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl shadow-card border border-surface-container-highest/60 relative overflow-hidden">
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="font-label-caps text-xs tracking-widest uppercase text-secondary block mb-1 font-bold">
                {t.dashboard.dailyHorizon}
              </span>
              <div className="relative inline-flex items-baseline gap-2 mt-1">
                <span className="font-display text-5xl sm:text-6xl font-extrabold text-on-surface tracking-tight leading-none">
                  {todayTasks.length < 10 ? `0${todayTasks.length}` : todayTasks.length}
                </span>
                <span className="font-headline text-lg sm:text-xl text-on-surface uppercase tracking-tight font-bold">
                  {t.dashboard.tasksToday}
                </span>
                <div className="absolute -top-3 -right-6 text-primary">
                  <PenStar className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center shrink-0">
              <svg className="w-16 h-16 sm:w-20 sm:h-20 transform -rotate-90" viewBox="0 0 64 64">
                <circle
                  className="text-surface-container-highest"
                  cx="32"
                  cy="32"
                  fill="none"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
                <circle
                  className="text-primary transition-all duration-700 ease-out"
                  cx="32"
                  cy="32"
                  fill="none"
                  r="26"
                  stroke="currentColor"
                  strokeDasharray="163.36"
                  strokeDashoffset={163.36 - (163.36 * completionRate) / 100}
                  strokeLinecap="round"
                  strokeWidth="3.5"
                />
              </svg>
              <span className="absolute font-label-caps text-xs sm:text-sm text-on-surface font-bold">
                {completionRate}%
              </span>
            </div>
          </div>

          {/* Bottom horizon stats bar */}
          <div className="mt-8 pt-4 border-t border-surface-container-highest/60 flex flex-col gap-3">
            <div className="flex justify-between items-center font-caption text-xs text-secondary">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-on-surface font-semibold">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  0{completedToday} {t.common.completed}
                </span>
                <span className="text-outline-variant">·</span>
                <span className="flex items-center gap-1.5 text-secondary">
                  <span className="w-2 h-2 rounded-full bg-surface-container-highest" />
                  0{remainingToday} {t.common.remaining}
                </span>
              </div>
              <span className="font-label-caps tracking-wider uppercase text-on-surface font-mono font-semibold">
                {t.dashboard.quotaVelocity}: 1.2 t/h
              </span>
            </div>
            
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.max(completionRate, 4)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Card: Next Up Spotlight */}
        {nextUpTask ? (
          <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl shadow-card border border-surface-container-highest/60 relative">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-label-caps text-xs uppercase tracking-widest text-primary font-bold">
                    {t.dashboard.nextUp}
                  </span>
                  <span className="font-caption text-xs text-secondary font-mono">
                    / #01 {t.dashboard.slot}
                  </span>
                </div>
                <StatusPill status={nextUpTask.status} size="sm" />
              </div>

              <div className="mt-2 cursor-pointer group" onClick={() => onSelectTask(nextUpTask)}>
                <span className="font-label-caps text-xs tracking-widest uppercase text-secondary font-bold block">
                  {nextUpTask.subject}
                </span>
                <h2 className="font-headline text-xl sm:text-2xl text-on-surface tracking-tight mt-1 font-bold group-hover:text-primary transition-colors">
                  {nextUpTask.title}
                </h2>
                {nextUpTask.description && (
                  <p className="font-body-sm text-xs text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                    {nextUpTask.description}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-surface-container-highest/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-secondary font-caption text-xs">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono">{nextUpTask.isAllDay ? t.common.allDay : nextUpTask.time || t.common.allDay}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFocusActive(!focusActive)}
                  className={`px-3.5 py-2 rounded-xl font-label-caps text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                    focusActive
                      ? 'bg-on-surface text-surface'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {focusActive ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{focusActive ? `${t.dashboard.pauseFocus} (${formatTimer(focusSeconds)})` : t.dashboard.beginFocus}</span>
                </button>

                <button
                  onClick={() => toggleTaskStatus(nextUpTask.id)}
                  title={t.dashboard.markDone}
                  className="p-2 rounded-xl bg-primary text-white hover:bg-primary-container transition-transform active:scale-90 shadow-sm"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-8 bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl shadow-card border border-surface-container-highest/60 text-center">
            <Sparkles className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-headline text-lg font-bold text-on-surface">{t.tasks.emptyTitle}</h3>
            <p className="font-body-sm text-secondary text-sm mt-1">{t.dashboard.noTasksToday}</p>
          </div>
        )}

      </section>

      {/* =========================================================================
          SECTION 3 — TODAY'S CYCLE SEQUENCE (EDITORIAL MATRIX)
          ========================================================================= */}
      <section className="w-full bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl border border-surface-container-highest/60 p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-baseline justify-between border-b border-surface-container-highest/60 pb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-headline text-xl uppercase tracking-tight text-on-surface font-bold">
              {t.dashboard.editorialMatrix}
            </h3>
            <span className="font-caption text-xs text-secondary tracking-widest uppercase font-mono">
              / {t.dashboard.cycleSequence}
            </span>
          </div>

          <button
            onClick={() => onNavigate('tasks')}
            className="flex items-center gap-1 font-label-caps text-xs uppercase text-primary font-bold hover:underline"
          >
            <span>{t.tasks.allTasks} ({tasks.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Matrix Header Row */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-4 py-2 font-label-caps text-[11px] uppercase tracking-wider text-secondary border-b border-surface-container-highest/40">
          <span className="col-span-1">{t.tasks.taskNumber}</span>
          <span className="col-span-5 lg:col-span-6">{t.tasks.descriptor}</span>
          <span className="col-span-2">{t.tasks.schedule}</span>
          <span className="col-span-2">{t.common.status}</span>
          <span className="col-span-2 lg:col-span-1 text-right">{t.common.priority}</span>
        </div>

        {/* Matrix Rows */}
        <div className="flex flex-col divide-y divide-surface-container-highest/30">
          {todayTasks.length === 0 ? (
            <div className="py-8 text-center text-secondary font-body-sm text-sm">
              <p>{t.dashboard.noTasksToday}</p>
            </div>
          ) : (
            todayTasks.slice(0, 5).map((task, idx) => {
              const isTaskDone = task.status === 'DONE';

              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="group grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 items-center px-4 py-3.5 hover:bg-surface-container-low/60 transition-colors duration-150 cursor-pointer rounded-xl"
                >
                  {/* No. */}
                  <div className="sm:col-span-1 font-caption text-xs text-secondary group-hover:text-primary font-mono transition-colors flex items-center justify-between sm:justify-start">
                    <span>0{idx + 1}</span>
                    <div className="sm:hidden">
                      <StatusPill status={task.status} size="sm" />
                    </div>
                  </div>

                  {/* Descriptor */}
                  <div className="sm:col-span-5 lg:col-span-6 flex flex-col">
                    <span className={`font-headline text-base tracking-tight font-semibold ${isTaskDone ? 'line-through text-outline' : 'text-on-surface'}`}>
                      {task.title}
                    </span>
                    <span className="font-caption text-xs text-secondary">
                      {task.subject} · {task.assigneeName}
                    </span>
                  </div>

                  {/* Schedule */}
                  <div className="sm:col-span-2 font-caption text-xs text-secondary flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-secondary shrink-0" />
                    <span>{task.isAllDay ? t.common.allDay : task.time || t.common.allDay}</span>
                  </div>

                  {/* Status */}
                  <div className="hidden sm:block sm:col-span-2">
                    <StatusPill status={task.status} size="sm" />
                  </div>

                  {/* Priority */}
                  <div className="sm:col-span-2 lg:col-span-1 sm:text-right">
                    <PriorityTag priority={task.priority} size="sm" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4 — PEOPLE IN THE HOME & RECENT ACTIVITY
          ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: People in the Home Roster */}
        <div className="lg:col-span-6 bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl border border-surface-container-highest/60 p-6 sm:p-8 shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-surface-container-highest/60 pb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h3 className="font-headline text-lg uppercase tracking-tight text-on-surface font-bold">
                {t.nav.members} ({currentHome?.members.length || 0})
              </h3>
            </div>

            <button
              onClick={() => onNavigate('members')}
              className="font-label-caps text-xs uppercase text-primary font-bold hover:underline"
            >
              {t.common.all}
            </button>
          </div>

          <div className="space-y-3">
            {currentHome?.members.map((member) => {
              const isSelf = member.userId === user?.id;
              return (
                <div
                  key={member.userId}
                  className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low/50 hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={member.avatarUrl}
                      name={member.displayName}
                      size="md"
                      ring={true}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-headline font-bold text-sm text-on-surface">
                          {member.displayName}
                        </span>
                        {isSelf && (
                          <span className="font-label-caps text-[9px] px-1.5 py-0.2 rounded bg-surface-container text-secondary uppercase font-semibold">
                            {t.common.you}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-secondary">
                        @{member.username}
                      </span>
                    </div>
                  </div>

                  <span className="font-label-caps text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-surface-container text-secondary">
                    {t.roles[member.role]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Recent Family Activity Feed */}
        <div className="lg:col-span-6 bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl border border-surface-container-highest/60 p-6 sm:p-8 shadow-card space-y-5">
          <div className="flex items-center justify-between border-b border-surface-container-highest/60 pb-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <h3 className="font-headline text-lg uppercase tracking-tight text-on-surface font-bold">
                {t.nav.activity}
              </h3>
            </div>

            <button
              onClick={() => onNavigate('activity')}
              className="font-label-caps text-xs uppercase text-primary font-bold hover:underline"
            >
              {t.common.all}
            </button>
          </div>

          <div className="space-y-3">
            {activity.length === 0 ? (
              <p className="py-6 text-center text-secondary text-xs font-mono">No recent activity</p>
            ) : (
              activity.slice(0, 4).map((evt) => (
                <div
                  key={evt.id}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-surface-container-low/50"
                >
                  <Avatar
                    src={evt.actorAvatar}
                    name={evt.actorName}
                    size="sm"
                    ring={true}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-on-surface font-medium leading-relaxed">
                      <span className="font-bold">{evt.actorName}</span>{' '}
                      {evt.type === 'task_completed' && 'completed'}
                      {evt.type === 'task_created' && 'created intention'}
                      {evt.type === 'task_revision' && 'requested revision for'}
                      {evt.type === 'comment_added' && 'commented on'}{' '}
                      <span className="font-semibold text-primary">{evt.taskTitle || 'task'}</span>
                    </p>
                    <span className="font-mono text-[10px] text-secondary mt-0.5 block">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </section>

      {/* =========================================================================
          SECTION 5 — LIVE ATMOSPHERE PREVIEWS & CONTROLS
          ========================================================================= */}
      <section className="bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl border border-surface-container-highest/60 p-6 sm:p-8 shadow-card space-y-4">
        <div className="flex items-center justify-between border-b border-surface-container-highest/60 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h3 className="font-headline text-lg uppercase tracking-tight text-on-surface font-bold">
              {t.atmospheres.title}
            </h3>
          </div>
          <span className="font-caption text-xs text-secondary">
            Continuous 60 FPS canvas environment
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
          {atmospheresList.map((atm) => {
            const isCurrent = atmosphere === atm;
            return (
              <button
                key={atm}
                onClick={() => {
                  setAtmosphere(atm);
                  if (isOwner) updateHome({ atmosphere: atm });
                  toast.info(`Atmosphere shifted to ${t.atmospheres[atm]}`);
                }}
                className={`btn-snappy p-3.5 rounded-2xl border text-left transition-all duration-150 flex flex-col justify-between gap-3 cursor-pointer ${
                  isCurrent
                    ? 'bg-surface-container border-primary ring-2 ring-primary/30 shadow-card scale-102'
                    : 'bg-surface-container-low/70 border-surface-container-highest hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-label-caps text-xs font-bold uppercase tracking-wider text-on-surface">
                    {t.atmospheres[atm]}
                  </span>
                  {isCurrent && <Check className="w-3.5 h-3.5 text-primary" />}
                </div>

                {/* Atmosphere swatch */}
                <div className="h-4 w-full rounded-md overflow-hidden shadow-inner">
                  {atm === 'Clouds' && <div className="w-full h-full bg-gradient-to-r from-[#FAF8F4] to-[#EAEFFF]" />}
                  {atm === 'Midnight' && <div className="w-full h-full bg-gradient-to-r from-[#151928] to-[#06080E]" />}
                  {atm === 'Sunset' && <div className="w-full h-full bg-gradient-to-r from-[#FB923C] to-[#BE185D]" />}
                  {atm === 'Ocean' && <div className="w-full h-full bg-gradient-to-r from-[#0284C7] to-[#0A192F]" />}
                  {atm === 'Aurora' && <div className="w-full h-full bg-gradient-to-r from-[#10B981] via-[#06B6D4] to-[#8B5CF6]" />}
                </div>
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );
};
