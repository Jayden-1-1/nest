import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useTranslation } from '../locales';
import { TaskCategory } from '../types/task';
import { PenUnderline, PenStar } from '../components/common/ControlledImperfection';
import { CategoryBadge, CATEGORY_ICONS, CATEGORY_COLORS } from '../components/common/CategoryBadge';
import { CheckCircle2, Flame, TrendingUp, Layers, HeartHandshake, Sparkles } from 'lucide-react';

export const ProgressPage: React.FC = () => {
  const { tasks } = useTasks();
  const { t, language } = useTranslation();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'DONE').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group by categories
  const categoryMap: Partial<Record<TaskCategory, { total: number; completed: number }>> = {};
  tasks.forEach((task) => {
    const cat = task.category || 'CHORES';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { total: 0, completed: 0 };
    }
    categoryMap[cat]!.total += 1;
    if (task.status === 'DONE') categoryMap[cat]!.completed += 1;
  });

  return (
    <div className="w-full space-y-space-xl">
      
      {/* Top Header */}
      <section className="pb-space-md border-b border-surface-container-highest">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest">
            {language === 'ru' ? 'СЕМЕЙНЫЙ ПРОГРЕСС // ДИНАМИКА' : 'FAMILY PROGRESS // TELEMETRY'}
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
        
        {/* Metric 1: Completion Rate */}
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
              <PenUnderline className="text-primary w-full h-2.5 mt-1" />
            </div>
          </div>

          <div className="text-xs text-secondary leading-relaxed">
            {completedTasks} из {totalTasks} {language === 'ru' ? 'задач закрыто' : 'tasks completed'}
          </div>
        </div>

        {/* Metric 2: Streak */}
        <div className="p-space-xl bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl border border-surface-container-highest/60 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-xs uppercase text-secondary font-bold tracking-widest">
              {t.progress.currentStreak}
            </span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>

          <div className="my-4">
            <span className="font-display text-5xl font-extrabold text-on-surface tracking-tight leading-none block">
              12
            </span>
            <span className="font-label-caps text-xs text-secondary uppercase font-bold tracking-wider mt-1 block">
              {t.progress.daysUnit}
            </span>
          </div>

          <div className="text-xs text-secondary leading-relaxed">
            {t.progress.steadyRhythm}
          </div>
        </div>

        {/* Metric 3: Family Teamwork */}
        <div className="p-space-xl bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl border border-surface-container-highest/60 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-xs uppercase text-secondary font-bold tracking-widest">
              {language === 'ru' ? 'СОГЛАСИЕ В ДОМЕ' : 'FAMILY HARMONY'}
            </span>
            <HeartHandshake className="w-4 h-4 text-emerald-500" />
          </div>

          <div className="my-4">
            <span className="font-display text-5xl font-extrabold text-on-surface tracking-tight leading-none block text-emerald-600 dark:text-emerald-400">
              100%
            </span>
            <span className="font-label-caps text-xs text-secondary uppercase font-bold tracking-wider mt-1 block">
              {language === 'ru' ? 'ВЗАИМНАЯ ПОДДЕРЖКА' : 'MUTUAL SUPPORT'}
            </span>
          </div>

          <div className="text-xs text-secondary leading-relaxed">
            {t.progress.monographNote}
          </div>
        </div>

      </section>

      {/* Category Distribution Breakdown */}
      <section className="bg-surface-container-lowest/85 backdrop-blur-md p-space-xl rounded-3xl border border-surface-container-highest/60 shadow-card space-y-space-md">
        <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-highest">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="font-headline text-lg font-bold uppercase tracking-tight text-on-surface">
              {t.progress.categoryDistribution}
            </h3>
          </div>
          <span className="font-caption text-xs text-secondary font-mono">
            FAMILY_CADENCE
          </span>
        </div>

        <div className="space-y-4">
          {(Object.keys(categoryMap) as TaskCategory[]).map((cat) => {
            const stats = categoryMap[cat]!;
            const percent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
            const Icon = CATEGORY_ICONS[cat] || Sparkles;

            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="font-headline font-bold text-on-surface">
                      {t.categories?.[cat] || cat}
                    </span>
                  </div>
                  <span className="font-mono text-secondary">
                    {stats.completed}/{stats.total} ({percent}%)
                  </span>
                </div>
                <div className="w-full bg-surface-container-low h-2.5 rounded-full overflow-hidden border border-surface-container-highest">
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
