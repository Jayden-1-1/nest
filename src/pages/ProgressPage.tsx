import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useTranslation } from '../locales';
import { PenUnderline, PenStar } from '../components/common/ControlledImperfection';
import { CheckCircle2, Flame, TrendingUp, BarChart2, Layers } from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { tasks } = useTasks();
  const { t } = useTranslation();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group by subjects
  const subjectMap: Record<string, { total: number; completed: number }> = {};
  tasks.forEach((t) => {
    if (!subjectMap[t.subject]) {
      subjectMap[t.subject] = { total: 0, completed: 0 };
    }
    subjectMap[t.subject].total += 1;
    if (t.status === 'DONE') subjectMap[t.subject].completed += 1;
  });

  return (
    <div className="w-full space-y-space-xl">
      
      {/* Top Header */}
      <section className="pb-space-md border-b border-surface-container-highest">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest">
            HUMAN TELEMETRY // TELEMETRY_02
          </span>
          <PenStar className="w-3.5 h-3.5 text-primary" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
          {t.progress.title}
        </h1>
        <p className="font-body-md text-secondary text-sm mt-1 max-w-xl">
          {t.progress.subtitle}
        </p>
      </section>

      {/* Primary Metrics Row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
        
        {/* Metric 1: Completion Velocity */}
        <div className="p-space-xl bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl border border-surface-container-highest/60 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-xs uppercase text-secondary font-bold tracking-widest">
              {t.progress.completionRate}
            </span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>

          <div className="my-4">
            <div className="relative inline-block">
              <span className="font-display text-5xl font-extrabold text-on-surface tracking-tight leading-none block">
                {completionRate}%
              </span>
              <PenUnderline className="text-primary w-full h-3 -bottom-2" />
            </div>
            <p className="font-caption text-xs text-secondary mt-3">
              {completedTasks} / {totalTasks} {t.progress.horizonFinalizedPattern}
            </p>
          </div>

          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Active Day Streak */}
        <div className="p-space-xl bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl border border-surface-container-highest/60 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-xs uppercase text-secondary font-bold tracking-widest">
              {t.progress.currentStreak}
            </span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>

          <div className="my-4">
            <div className="relative inline-block">
              <span className="font-display text-5xl font-extrabold text-on-surface tracking-tight leading-none block">
                12 <span className="text-xl font-normal text-secondary font-mono">{t.progress.daysUnit}</span>
              </span>
            </div>
            <p className="font-caption text-xs text-secondary mt-3">
              {t.progress.steadyRhythm}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <span key={i} className="flex-1 h-1.5 rounded-full bg-emerald-500" />
            ))}
          </div>
        </div>

        {/* Metric 3: Completed Count */}
        <div className="p-space-xl bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl border border-surface-container-highest/60 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-xs uppercase text-secondary font-bold tracking-widest">
              {t.progress.completedCount}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="my-4">
            <span className="font-display text-5xl font-extrabold text-on-surface tracking-tight leading-none block">
              {completedTasks < 10 ? `0${completedTasks}` : completedTasks}
            </span>
            <p className="font-caption text-xs text-secondary mt-3">
              {t.progress.verifiedAchievements}
            </p>
          </div>

          <div className="text-[11px] font-mono text-primary uppercase font-bold">
            CONFIRMED_TELEMETRY
          </div>
        </div>

      </section>

      {/* Subject Distribution Breakdown */}
      <section className="bg-surface-container-lowest/85 backdrop-blur-md p-space-xl rounded-3xl border border-surface-container-highest/60 shadow-card space-y-space-md">
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-highest">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-on-surface">
              {t.progress.subjectDistribution}
            </h3>
          </div>
          <span className="font-caption text-xs text-secondary font-mono">
            SUBJECT_CADENCE
          </span>
        </div>

        <div className="space-y-4">
          {Object.entries(subjectMap).map(([subject, stats]) => {
            const percent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

            return (
              <div key={subject} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-headline font-bold text-on-surface">{subject}</span>
                  <span className="font-mono text-secondary">
                    {stats.completed}/{stats.total} ({percent}%)
                  </span>
                </div>
                <div className="w-full bg-surface-container-low h-2 rounded-full overflow-hidden border border-surface-container-highest">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-space-md border-t border-surface-container-highest text-caption text-secondary/70 italic text-xs">
          {t.progress.monographNote}
        </div>
      </section>

    </div>
  );
};
