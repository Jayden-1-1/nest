import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { useTranslation } from '../locales';
import { Task, TaskStatus } from '../types/task';
import { StatusPill } from '../components/common/StatusPill';
import { PriorityTag } from '../components/common/PriorityTag';
import { PenUnderline, PenStar } from '../components/common/ControlledImperfection';
import { 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  Check, 
  CheckCircle2, 
  Filter, 
  LayoutGrid, 
  ListFilter, 
  User 
} from 'lucide-react';

interface TasksPageProps {
  onOpenCreateTask: () => void;
  onSelectTask: (task: Task) => void;
}

type FilterTab = 'ALL' | 'TODAY' | 'UPCOMING' | 'DONE' | 'OVERDUE';

export const TasksPage: React.FC<TasksPageProps> = ({
  onOpenCreateTask,
  onSelectTask,
}) => {
  const { tasks, toggleTaskStatus } = useTasks();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');

  const todayStr = new Date().toISOString().split('T')[0];

  // Distinct subjects
  const subjects = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => set.add(t.subject));
    return ['ALL', ...Array.from(set)];
  }, [tasks]);

  const isTaskOverdue = (task: Task) => task.status === 'OVERDUE' || (task.date < todayStr && task.status !== 'DONE');

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Tab filter
      if (activeTab === 'TODAY' && task.date !== todayStr) return false;
      if (activeTab === 'UPCOMING' && task.date <= todayStr) return false;
      if (activeTab === 'DONE' && task.status !== 'DONE') return false;
      if (activeTab === 'OVERDUE' && !isTaskOverdue(task)) return false;

      // Subject filter
      if (subjectFilter !== 'ALL' && task.subject !== subjectFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchSubject = task.subject.toLowerCase().includes(q);
        const matchAssignee = task.assigneeName.toLowerCase().includes(q);
        const matchDesc = task.description.toLowerCase().includes(q);
        if (!matchTitle && !matchSubject && !matchAssignee && !matchDesc) return false;
      }

      return true;
    });
  }, [tasks, activeTab, subjectFilter, searchQuery, todayStr]);

  const tabs: { id: FilterTab; label: string; count: number }[] = [
    { id: 'ALL', label: t.tasks.allTasks, count: tasks.length },
    { id: 'TODAY', label: t.tasks.todayTasks, count: tasks.filter((t) => t.date === todayStr).length },
    { id: 'UPCOMING', label: t.tasks.upcomingTasks, count: tasks.filter((t) => t.date > todayStr).length },
    { id: 'DONE', label: t.tasks.doneTasks, count: tasks.filter((t) => t.status === 'DONE').length },
    { id: 'OVERDUE', label: t.tasks.overdueTasks, count: tasks.filter(isTaskOverdue).length },
  ];

  return (
    <div className="w-full space-y-space-lg">
      
      {/* Top Header & Search Controls */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-space-md pb-space-md border-b border-surface-container-highest">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest">
              REGISTER // MONOGRAPH
            </span>
            <PenStar className="w-3.5 h-3.5 text-primary" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
            {t.nav.tasks}
          </h1>
        </div>

        <div className="flex items-center gap-space-sm">
          {/* View mode toggle */}
          <div className="flex items-center bg-surface-container-low rounded-lg p-0.5 border border-surface-container-highest">
            <button
              onClick={() => setViewMode('matrix')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'matrix' ? 'bg-surface text-primary shadow-sm' : 'text-secondary'}`}
              title="Matrix Ledger View"
            >
              <ListFilter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-md transition-colors ${viewMode === 'cards' ? 'bg-surface text-primary shadow-sm' : 'text-secondary'}`}
              title="Cards Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* New Task CTA */}
          <button
            onClick={onOpenCreateTask}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-on-surface text-surface font-label-caps text-xs uppercase tracking-wider font-bold hover:bg-primary transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>{t.tasks.newTaskButton}</span>
          </button>
        </div>
      </section>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-md border-b border-surface-container-highest pb-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-label-caps text-xs uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-on-surface text-surface font-bold shadow-sm'
                  : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
              }`}
            >
              {tab.label} <span className="opacity-70 font-mono text-[10px] ml-1">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Search & Subject dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.tasks.searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-xs text-on-surface font-body-sm"
            />
          </div>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container-low border border-surface-container-highest text-xs text-secondary font-label-caps uppercase"
          >
            {subjects.map((sub) => (
              <option key={sub} value={sub}>
                {sub === 'ALL' ? t.common.all : sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List / View */}
      {filteredTasks.length === 0 ? (
        <div className="p-space-2xl bg-surface-container-low rounded-2xl border border-surface-container-highest text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-primary mx-auto opacity-70" />
          <h3 className="font-headline text-xl font-bold text-on-surface uppercase">{t.tasks.emptyTitle}</h3>
          <p className="font-body-sm text-secondary text-sm max-w-sm mx-auto">{t.tasks.emptyDesc}</p>
          <button
            onClick={onOpenCreateTask}
            className="mt-2 px-4 py-2 rounded-lg bg-primary text-white font-label-caps text-xs uppercase tracking-wider font-semibold"
          >
            {t.tasks.createFirst}
          </button>
        </div>
      ) : viewMode === 'matrix' ? (
        /* Matrix Ledger View */
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-highest overflow-hidden shadow-card">
          <div className="hidden sm:grid grid-cols-12 gap-space-md px-space-md py-space-sm font-label-caps text-label-caps uppercase tracking-wider text-secondary border-b border-surface-container-highest bg-surface-container-low">
            <span className="col-span-1">{t.tasks.taskNumber}</span>
            <span className="col-span-5 lg:col-span-6">{t.tasks.descriptor}</span>
            <span className="col-span-2">{t.tasks.schedule}</span>
            <span className="col-span-2">{t.common.status}</span>
            <span className="col-span-2 lg:col-span-1 text-right">{t.common.priority}</span>
          </div>

          <div className="divide-y divide-surface-container-highest">
            {filteredTasks.map((task, idx) => {
              const isTaskDone = task.status === 'DONE';

              return (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="group grid grid-cols-1 sm:grid-cols-12 gap-space-sm sm:gap-space-md items-center px-space-md py-space-md hover:bg-surface-container-low transition-colors duration-150 cursor-pointer"
                >
                  <div className="sm:col-span-1 font-caption text-caption text-secondary group-hover:text-primary font-mono flex items-center justify-between sm:justify-start">
                    <span>0{idx + 1}</span>
                    <div className="sm:hidden">
                      <StatusPill status={task.status} size="sm" />
                    </div>
                  </div>

                  <div className="sm:col-span-5 lg:col-span-6 flex items-start gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTaskStatus(task.id);
                      }}
                      className={`mt-1 w-4 h-4 rounded-sm flex items-center justify-center border transition-colors shrink-0 ${
                        isTaskDone
                          ? 'bg-primary border-primary text-white'
                          : 'border-outline hover:border-primary'
                      }`}
                    >
                      {isTaskDone && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                    <div className="flex flex-col min-w-0">
                      <span className={`font-headline text-base tracking-tight font-semibold truncate ${
                        isTaskDone ? 'line-through text-secondary' : 'text-on-surface'
                      }`}>
                        {task.title}
                      </span>
                      <span className="font-caption text-caption text-secondary">
                        {task.subject} · {task.assigneeName}
                      </span>
                    </div>
                  </div>

                  <div className="sm:col-span-2 font-caption text-caption text-secondary flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{task.isAllDay ? t.common.allDay : task.time || task.date}</span>
                  </div>

                  <div className="hidden sm:block sm:col-span-2">
                    <StatusPill status={task.status} size="sm" />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-1 sm:text-right">
                    <PriorityTag priority={task.priority} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Cards Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {filteredTasks.map((task) => {
            const isTaskDone = task.status === 'DONE';

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="p-space-lg bg-surface-container-lowest rounded-2xl border border-surface-container-highest shadow-card hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-space-md"
              >
                <div className="space-y-space-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-xs uppercase tracking-widest text-secondary font-bold">
                      {task.subject}
                    </span>
                    <PriorityTag priority={task.priority} size="sm" />
                  </div>

                  <h3 className={`font-headline text-lg font-bold tracking-tight ${isTaskDone ? 'line-through text-secondary' : 'text-on-surface'}`}>
                    {task.title}
                  </h3>

                  {task.description && (
                    <p className="font-body-sm text-body-sm text-secondary line-clamp-2 leading-relaxed">
                      {task.description}
                    </p>
                  )}
                </div>

                <div className="pt-space-md border-t border-surface-container-highest flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-secondary font-mono">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span>{task.isAllDay ? t.common.allDay : task.time || task.date}</span>
                  </div>

                  <StatusPill status={task.status} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
