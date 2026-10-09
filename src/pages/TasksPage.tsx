import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { useTranslation } from '../locales';
import { Task, TaskCategory } from '../types/task';
import { StatusPill } from '../components/common/StatusPill';
import { PriorityTag } from '../components/common/PriorityTag';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { Avatar } from '../components/common/Avatar';
import { ContextualEmptyState } from '../components/common/ContextualEmptyState';
import { PenStar } from '../components/common/ControlledImperfection';
import { formatLocalDate } from '../utils/date';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Calendar, 
  Clock, 
  Check, 
  Filter,
  Grid,
  ListFilter
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
  const { t, language } = useTranslation();

  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'matrix' | 'cards'>('matrix');

  const todayStr = formatLocalDate(new Date());

  const categories: { id: string; label: string }[] = [
    { id: 'ALL', label: t.tasks.filterCategory || t.common.all },
    { id: 'CHORES', label: t.categories.CHORES },
    { id: 'SHOPPING', label: t.categories.SHOPPING },
    { id: 'PETS', label: t.categories.PETS },
    { id: 'SCHOOL', label: t.categories.SCHOOL },
    { id: 'FAMILY', label: t.categories.FAMILY },
    { id: 'HEALTH', label: t.categories.HEALTH },
    { id: 'OTHER', label: t.categories.OTHER },
  ];

  const isTaskOverdue = (task: Task) => task.status === 'OVERDUE' || (task.date < todayStr && task.status !== 'DONE');

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Tab filter
      if (activeTab === 'TODAY' && task.date !== todayStr) return false;
      if (activeTab === 'UPCOMING' && task.date <= todayStr) return false;
      if (activeTab === 'DONE' && task.status !== 'DONE') return false;
      if (activeTab === 'OVERDUE' && !isTaskOverdue(task)) return false;

      // Category filter
      if (categoryFilter !== 'ALL' && task.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchCategory = (task.category || '').toLowerCase().includes(q);
        const matchSubject = (task.subject || '').toLowerCase().includes(q);
        const matchAssignee = task.assigneeName.toLowerCase().includes(q);
        const matchDesc = task.description.toLowerCase().includes(q);
        if (!matchTitle && !matchCategory && !matchSubject && !matchAssignee && !matchDesc) return false;
      }

      return true;
    });
  }, [tasks, activeTab, categoryFilter, searchQuery, todayStr]);

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
              {language === 'ru' ? 'СЕМЕЙНЫЙ РЕЕСТР' : 'FAMILY TASK REGISTER'}
            </span>
            <PenStar className="w-3.5 h-3.5 text-primary" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
            {t.tasks.allTasks}
          </h1>
          <p className="font-body-md text-secondary mt-1 text-sm">
            {language === 'ru' 
              ? 'Повседневные дела, уроки, списки покупок и совместные планы вашей семьи.' 
              : 'Everyday household chores, homework, shopping lists, and shared family plans.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-surface-container-low border border-surface-container-highest text-secondary">
            <button
              onClick={() => setViewMode('matrix')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'matrix' ? 'bg-surface-container text-on-surface shadow-sm' : 'hover:text-on-surface'
              }`}
              title="Matrix Ledger View"
            >
              <ListFilter className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'cards' ? 'bg-surface-container text-on-surface shadow-sm' : 'hover:text-on-surface'
              }`}
              title="Stationery Cards View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          {/* New Task Button */}
          <button
            onClick={onOpenCreateTask}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-label-caps text-xs uppercase tracking-wider font-bold hover:bg-primary/90 transition-all shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t.tasks.newTaskButton}</span>
          </button>
        </div>
      </section>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Status / Horizon Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-label-caps font-semibold uppercase tracking-wider whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low text-secondary hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-surface-container text-secondary'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Category dropdown */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="w-4 h-4 text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.tasks.searchPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-xs text-on-surface font-body-sm"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-surface-container-low border border-surface-container-highest text-xs text-secondary font-label-caps uppercase focus:border-primary focus:outline-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List / View */}
      {filteredTasks.length === 0 ? (
        <ContextualEmptyState type="tasks" onAction={onOpenCreateTask} />
      ) : viewMode === 'matrix' ? (
        /* Matrix Ledger View */
        <div className="bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl border border-surface-container-highest/60 overflow-hidden shadow-card">
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
                      className={`mt-1 w-5 h-5 rounded-lg flex items-center justify-center border transition-all shrink-0 cursor-pointer ${
                        isTaskDone
                          ? 'bg-primary border-primary text-white shadow-sm'
                          : 'border-outline hover:border-primary'
                      }`}
                    >
                      {isTaskDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>
                    <div className="flex flex-col min-w-0">
                      <span className={`font-headline text-base tracking-tight font-semibold truncate ${
                        isTaskDone ? 'line-through text-secondary' : 'text-on-surface'
                      }`}>
                        {task.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <CategoryBadge 
                          category={task.category || 'CHORES'} 
                          schoolSubject={task.schoolSubject} 
                          size="xs" 
                        />
                        <span className="text-[11px] text-secondary flex items-center gap-1 truncate">
                          · {task.assigneeName}
                        </span>
                      </div>
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
                className="p-space-lg bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl border border-surface-container-highest/60 shadow-card hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col justify-between gap-space-md"
              >
                <div className="space-y-space-sm">
                  <div className="flex items-center justify-between gap-2">
                    <CategoryBadge 
                      category={task.category || 'CHORES'} 
                      schoolSubject={task.schoolSubject} 
                      size="sm" 
                    />
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
                  <div className="flex items-center gap-2">
                    <Avatar 
                      src={task.assigneeAvatar} 
                      name={task.assigneeName} 
                      size="xs" 
                      ring={true} 
                    />
                    <div className="flex items-center gap-1 text-secondary font-mono text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-primary" />
                      <span>{task.isAllDay ? t.common.allDay : task.time || task.date}</span>
                    </div>
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
