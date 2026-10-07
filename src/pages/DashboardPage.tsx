import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHome } from '../context/HomeContext';
import { useTasks } from '../context/TaskContext';
import { useTranslation } from '../locales';
import { Task } from '../types/task';
import { StatusPill } from '../components/common/StatusPill';
import { PriorityTag } from '../components/common/PriorityTag';
import { HeroPenUnderline, PenStar, PenCircle } from '../components/common/ControlledImperfection';
import { 
  Plus, 
  Play, 
  Pause, 
  Check, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
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
  const { currentHome } = useHome();
  const { tasks, toggleTaskStatus } = useTasks();
  const { t } = useTranslation();

  // Focus Session Timer (25 minutes)
  const [focusActive, setFocusActive] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (focusActive && focusSeconds > 0) {
      interval = setInterval(() => {
        setFocusSeconds((prev) => prev - 1);
      }, 1000);
    } else if (focusSeconds === 0) {
      setFocusActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [focusActive, focusSeconds]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter((task) => task.date === todayStr);
  const completedToday = todayTasks.filter((task) => task.status === 'DONE').length;
  const remainingToday = todayTasks.length - completedToday;
  const completionRate = todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0;

  // Next up task (first in-progress or todo task)
  const nextUpTask = todayTasks.find((task) => task.status === 'IN_PROGRESS') ||
    todayTasks.find((task) => task.status === 'TODO') ||
    todayTasks[0] ||
    tasks[0];

  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).toUpperCase();

  return (
    <div className="w-full space-y-space-xl">
      
      {/* Editorial Header Section */}
      <section className="relative w-full pb-space-lg border-b border-surface-container-highest">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-space-lg">
          <div className="flex flex-col">
            
            {/* Meta Edition Stamp */}
            <div className="flex items-center gap-space-sm mb-space-xs font-mono text-[11px] text-secondary">
              <span className="font-label-caps text-label-caps tracking-widest text-secondary uppercase font-semibold">
                {t.dashboard.bulletinEdition}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="font-label-caps text-label-caps tracking-widest text-secondary uppercase">
                {currentHome?.name || "NEST"}
              </span>
            </div>

            {/* Greeting & Name */}
            <span className="font-label-caps text-label-caps uppercase tracking-[0.22em] text-on-surface-variant mb-1 font-bold">
              {t.dashboard.greetingEvening}
            </span>

            <div className="relative inline-block">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-on-surface uppercase leading-none select-none">
                {user?.displayName || "ALEXEY"}.
              </h1>
              <HeroPenUnderline className="absolute -bottom-3 left-1 w-36 sm:w-44 h-3 text-primary" />
            </div>

            {/* Date line & cadence */}
            <div className="flex flex-wrap items-center gap-x-space-md gap-y-1 mt-space-lg text-secondary font-caption text-caption">
              <span className="font-bold tracking-wider text-on-surface uppercase font-mono">
                {currentDateFormatted}
              </span>
              <span className="text-outline-variant font-mono">/</span>
              <span className="uppercase tracking-wider">
                {t.dashboard.cadenceSteady}
              </span>
              <span className="text-outline-variant font-mono">/</span>
              <span className="font-label-caps text-label-caps uppercase text-primary font-bold">
                {t.dashboard.cycleActive}
              </span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="flex items-center gap-space-md">
            <button
              onClick={onOpenCreateTask}
              className="group relative inline-flex items-center gap-space-sm px-space-lg py-3 bg-on-surface text-surface rounded-xl shadow-sm hover:bg-primary transition-all duration-200 active:scale-95"
            >
              <Plus className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
              <span className="font-label-caps text-xs tracking-wider uppercase font-bold">
                {t.dashboard.recordIntention}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Hero Dual Spreads: Horizon & Next Up Spotlight */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
        
        {/* Left Card: Daily Horizon Counter */}
        <div className="lg:col-span-7 flex flex-col justify-between p-space-xl bg-surface-container-low rounded-2xl shadow-card border border-surface-container-highest/60 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-label-caps text-label-caps tracking-widest uppercase text-secondary block mb-space-xs font-bold">
                {t.dashboard.dailyHorizon}
              </span>
              <div className="relative inline-flex items-baseline gap-space-sm mt-1">
                <span className="font-display text-5xl sm:text-6xl font-extrabold text-on-surface tracking-tight leading-none">
                  {todayTasks.length < 10 ? `0${todayTasks.length}` : todayTasks.length}
                </span>
                <span className="font-headline text-lg sm:text-xl text-on-surface uppercase tracking-tight font-bold">
                  {t.dashboard.tasksToday}
                </span>
                {/* 4-point spark notation */}
                <div className="absolute -top-3 -right-6 text-primary">
                  <PenStar className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Circular Progress Gauge */}
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
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
              <span className="absolute font-label-caps text-xs text-on-surface font-bold">
                {completionRate}%
              </span>
            </div>
          </div>

          {/* Bottom horizon stats bar */}
          <div className="mt-space-xl pt-space-md border-t border-surface-container-highest flex flex-col gap-space-sm">
            <div className="flex justify-between items-center font-caption text-caption text-secondary">
              <div className="flex items-center gap-space-md">
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
              <span className="font-label-caps text-label-caps tracking-wider uppercase text-on-surface-variant font-mono">
                {t.dashboard.quotaVelocity}: 1.2 t/h
              </span>
            </div>
            
            <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(completionRate, 5)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Right Card: Next Up Spotlight */}
        {nextUpTask ? (
          <div className="lg:col-span-5 flex flex-col justify-between p-space-xl bg-surface-container-lowest rounded-2xl shadow-card border border-surface-container-highest relative">
            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="font-label-caps text-label-caps uppercase tracking-widest text-primary font-bold">
                    {t.dashboard.nextUp}
                  </span>
                  <span className="font-caption text-caption text-secondary font-mono">
                    / #01 {t.dashboard.slot}
                  </span>
                </div>
                <StatusPill status={nextUpTask.status} size="sm" />
              </div>

              <div className="mt-space-sm cursor-pointer" onClick={() => onSelectTask(nextUpTask)}>
                <span className="font-label-caps text-label-caps tracking-widest uppercase text-secondary font-bold block">
                  {nextUpTask.subject}
                </span>
                <h2 className="font-headline text-xl sm:text-2xl text-on-surface tracking-tight mt-1 font-bold hover:text-primary transition-colors">
                  {nextUpTask.title}
                </h2>
                {nextUpTask.description && (
                  <p className="font-body-sm text-body-sm text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                    {nextUpTask.description}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-space-xl pt-space-md border-t border-surface-container-highest flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-secondary font-caption text-caption">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono">{nextUpTask.isAllDay ? t.common.allDay : nextUpTask.time || t.common.allDay}</span>
              </div>

              <div className="flex items-center gap-space-sm">
                <button
                  onClick={() => setFocusActive(!focusActive)}
                  className={`px-space-md py-2 rounded-lg font-label-caps text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors ${
                    focusActive
                      ? 'bg-on-surface text-surface'
                      : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  {focusActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{focusActive ? `Focus (${formatTimer(focusSeconds)})` : t.dashboard.beginFocus}</span>
                </button>

                <button
                  onClick={() => toggleTaskStatus(nextUpTask.id)}
                  title={t.dashboard.markDone}
                  className="p-2 rounded-lg bg-primary text-white hover:bg-primary-container transition-transform active:scale-90"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-space-xl bg-surface-container-lowest rounded-2xl shadow-card border border-surface-container-highest text-center">
            <Sparkles className="w-8 h-8 text-primary mb-2" />
            <h3 className="font-headline text-lg font-bold text-on-surface">{t.tasks.emptyTitle}</h3>
            <p className="font-body-sm text-secondary text-sm mt-1">{t.dashboard.noTasksToday}</p>
          </div>
        )}

      </section>

      {/* Section: Editorial Matrix (Today's Cycle Sequence) */}
      <section className="w-full pt-space-md pb-space-xl">
        <div className="flex items-baseline justify-between mb-space-md border-b border-surface-container-highest pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <h3 className="font-headline text-xl uppercase tracking-tight text-on-surface font-bold">
              {t.dashboard.editorialMatrix}
            </h3>
            <span className="font-caption text-caption text-secondary tracking-widest uppercase font-mono">
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
        <div className="hidden sm:grid grid-cols-12 gap-space-md px-space-md py-space-sm font-label-caps text-label-caps uppercase tracking-wider text-secondary border-b border-surface-container-highest">
          <span className="col-span-1">{t.tasks.taskNumber}</span>
          <span className="col-span-5 lg:col-span-6">{t.tasks.descriptor}</span>
          <span className="col-span-2">{t.tasks.schedule}</span>
          <span className="col-span-2">{t.common.status}</span>
          <span className="col-span-2 lg:col-span-1 text-right">{t.common.priority}</span>
        </div>

        {/* Matrix Rows */}
        <div className="flex flex-col">
          {todayTasks.slice(0, 5).map((task, idx) => {
            const isTaskDone = task.status === 'DONE';

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="group grid grid-cols-1 sm:grid-cols-12 gap-space-sm sm:gap-space-md items-center px-space-md py-space-md border-b border-surface-container-high hover:bg-surface-container-low transition-colors duration-150 cursor-pointer rounded-lg sm:rounded-none"
              >
                {/* No. */}
                <div className="sm:col-span-1 font-caption text-caption text-secondary group-hover:text-primary font-mono transition-colors flex items-center justify-between sm:justify-start">
                  <span>0{idx + 1}</span>
                  <div className="sm:hidden">
                    <StatusPill status={task.status} size="sm" />
                  </div>
                </div>

                {/* Descriptor */}
                <div className="sm:col-span-5 lg:col-span-6 flex flex-col">
                  <span className={`font-headline text-base tracking-tight font-semibold ${isTaskDone ? 'line-through text-secondary' : 'text-on-surface'}`}>
                    {task.title}
                  </span>
                  <span className="font-caption text-caption text-secondary">
                    {task.subject} · {task.assigneeName}
                  </span>
                </div>

                {/* Schedule */}
                <div className="sm:col-span-2 font-caption text-caption text-on-surface-variant flex items-center gap-1">
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
          })}
        </div>
      </section>

    </div>
  );
};
