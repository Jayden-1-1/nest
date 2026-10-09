import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { useHome } from '../context/HomeContext';
import { useTranslation } from '../locales';
import { Task } from '../types/task';
import { StatusPill } from '../components/common/StatusPill';
import { PriorityTag } from '../components/common/PriorityTag';
import { CategoryBadge } from '../components/common/CategoryBadge';
import { PenCircle } from '../components/common/ControlledImperfection';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Plus, 
  Check, 
  CheckCircle2, 
  Circle, 
  Filter
} from 'lucide-react';
import { getCalendarMatrix, formatLocalDate } from '../utils/date';

interface CalendarPageProps {
  onOpenCreateTask: (defaultDate?: string) => void;
  onSelectTask: (task: Task) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({
  onOpenCreateTask,
  onSelectTask,
}) => {
  const { tasks, toggleTaskStatus } = useTasks();
  const { canCreateTasks } = useHome();
  const { t, language } = useTranslation();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => formatLocalDate(new Date()));
  const [ledgerFilter, setLedgerFilter] = useState<'ALL' | 'PENDING' | 'DONE'>('ALL');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const matrixDays = useMemo(() => {
    return getCalendarMatrix(year, month);
  }, [year, month]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const setToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(formatLocalDate(today));
  };

  const monthName = currentDate.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', {
    month: 'long',
    year: 'numeric'
  }).toUpperCase();

  const weekDays = language === 'ru'
    ? ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
    : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  // Tasks for selected date
  const selectedDateAllTasks = tasks.filter((t) => t.date === selectedDateStr);
  const selectedDateFilteredTasks = selectedDateAllTasks.filter((t) => {
    if (ledgerFilter === 'DONE') return t.status === 'DONE';
    if (ledgerFilter === 'PENDING') return t.status !== 'DONE';
    return true;
  });

  const handleCellClick = (cellDateStr: string, isPrev: boolean, isNext: boolean, cellYear: number, cellMonth: number) => {
    setSelectedDateStr(cellDateStr);
    if (isPrev || isNext) {
      setCurrentDate(new Date(cellYear, cellMonth, 1));
    }
  };

  return (
    <div className="w-full space-y-space-xl animate-in fade-in duration-200">
      
      {/* Top Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md pb-space-md border-b border-surface-container-highest">
        <div>
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
            {language === 'ru' ? 'ВРЕМЕННОЙ РИТМ // КАЛЕНДАРЬ' : 'TEMPORAL CADENCE // CALENDAR'}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
            {t.nav.calendar}
          </h1>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={setToday}
            className="px-3.5 py-1.5 rounded-lg border border-surface-container-highest bg-surface-container-low hover:bg-surface-container font-label-caps text-xs uppercase tracking-wider text-on-surface transition-all active:scale-95"
          >
            {t.calendar.todayBtn}
          </button>
          <div className="flex items-center bg-surface-container-low rounded-lg border border-surface-container-highest p-0.5">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded text-secondary hover:text-on-surface hover:bg-surface transition-colors active:scale-90"
              title={t.calendar.prevMonth}
              aria-label={t.calendar.prevMonth}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded text-secondary hover:text-on-surface hover:bg-surface transition-colors active:scale-90"
              title={t.calendar.nextMonth}
              aria-label={t.calendar.nextMonth}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid: Calendar on Left, Selected Date Ledger on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        
        {/* Monthly Calendar View */}
        <div className="lg:col-span-7 bg-surface-container-lowest/85 backdrop-blur-md p-space-lg sm:p-space-xl rounded-3xl border border-surface-container-highest/60 shadow-card space-y-space-md">
          
          <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-highest">
            <span className="font-headline text-lg sm:text-xl font-bold uppercase tracking-tight text-on-surface font-mono">
              {monthName}
            </span>
            <span className="font-caption text-xs text-secondary font-mono">
              {year} // {language.toUpperCase()}
            </span>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-label-caps text-[11px] text-secondary tracking-widest py-1 border-b border-surface-container-highest">
            {weekDays.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Complete 35 / 42 Calendar Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {matrixDays.map((cell) => {
              const dayTasks = tasks.filter((t) => t.date === cell.dateStr);
              const isSelected = selectedDateStr === cell.dateStr;
              const hasTasks = dayTasks.length > 0;
              const allDone = hasTasks && dayTasks.every((t) => t.status === 'DONE');

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => handleCellClick(cell.dateStr, cell.isPrevMonth, cell.isNextMonth, cell.year, cell.month)}
                  className={`relative h-14 sm:h-16 p-1.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-150 active:scale-[0.98] select-none ${
                    isSelected
                      ? 'border-primary bg-primary-fixed/25 shadow-sm ring-1 ring-primary/40'
                      : cell.isCurrentMonth
                      ? 'border-surface-container-highest hover:bg-surface-container-low hover:border-outline-variant/60'
                      : 'border-surface-container-highest/50 bg-surface-container-lowest/40 opacity-40 hover:opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="relative inline-flex items-center justify-center w-6 h-6">
                      <span className={`font-mono text-xs font-bold ${
                        isSelected 
                          ? 'text-primary' 
                          : cell.isToday 
                          ? 'text-on-surface font-black' 
                          : cell.isCurrentMonth 
                          ? 'text-on-surface' 
                          : 'text-secondary'
                      }`}>
                        {cell.dayNumber}
                      </span>
                      {/* Controlled Imperfection Hand-Drawn Circle on Selected Date */}
                      {isSelected && (
                        <PenCircle className="text-primary scale-125" />
                      )}
                    </div>

                    {cell.isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary ring-2 ring-primary-fixed" />
                    )}
                  </div>

                  {/* Task Indicators */}
                  {hasTasks && (
                    <div className="flex items-center gap-1 overflow-hidden">
                      {allDone ? (
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      ) : (
                        dayTasks.slice(0, 3).map((t) => (
                          <span
                            key={t.id}
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              t.status === 'DONE' 
                                ? 'bg-emerald-500' 
                                : t.priority === 'HIGH' 
                                ? 'bg-error' 
                                : 'bg-primary'
                            }`}
                          />
                        ))
                      )}
                      {dayTasks.length > 3 && (
                        <span className="text-[9px] font-mono text-secondary">+{dayTasks.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

        {/* Selected Date Task List */}
        <div className="lg:col-span-5 bg-surface-container-lowest/85 backdrop-blur-md p-space-lg sm:p-space-xl rounded-3xl border border-surface-container-highest/60 shadow-card space-y-space-md">
          
          <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-highest">
            <div className="flex flex-col">
              <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-wider">
                {t.calendar.selectedDate}
              </span>
              <span className="font-mono text-sm font-semibold text-on-surface mt-0.5">
                {selectedDateStr}
              </span>
            </div>

            {canCreateTasks && (
              <button
                onClick={() => onOpenCreateTask(selectedDateStr)}
                className="p-2 rounded-xl bg-on-surface text-surface hover:bg-primary transition-all active:scale-95 shadow-sm"
                title="Add task for this date"
                aria-label="Add task for this date"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Chips if tasks exist */}
          {selectedDateAllTasks.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              {(['ALL', 'PENDING', 'DONE'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLedgerFilter(mode)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-label-caps uppercase font-bold tracking-wider transition-colors ${
                    ledgerFilter === mode
                      ? 'bg-on-surface text-surface'
                      : 'bg-surface-container-low text-secondary hover:text-on-surface'
                  }`}
                >
                  {mode === 'ALL' && `${t.common.all} (${selectedDateAllTasks.length})`}
                  {mode === 'PENDING' && `${t.common.active} (${selectedDateAllTasks.filter((t) => t.status !== 'DONE').length})`}
                  {mode === 'DONE' && `${t.common.completed} (${selectedDateAllTasks.filter((t) => t.status === 'DONE').length})`}
                </button>
              ))}
            </div>
          )}

          {selectedDateFilteredTasks.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-surface-container-low border border-surface-container-highest flex items-center justify-center text-primary mx-auto shadow-inner">
                <CalendarIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-1">
                <span className="font-label-caps text-xs text-secondary uppercase tracking-widest font-mono">
                  {language === 'ru' ? 'СВОБОДНЫЙ ДЕНЬ' : 'FREE DAY'}
                </span>
                <p className="font-body-sm text-sm text-secondary">
                  {t.calendar.noTasksForDate}
                </p>
              </div>
              {canCreateTasks && (
                <button
                  onClick={() => onOpenCreateTask(selectedDateStr)}
                  className="btn-snappy px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-highest border border-surface-container-highest text-primary font-label-caps text-xs uppercase tracking-wider font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'ru' ? 'Запланировать задачу' : 'Schedule task'}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {selectedDateFilteredTasks.map((task) => {
                const isCompleted = task.status === 'DONE';

                return (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl bg-surface-container-low border border-surface-container-highest hover:bg-surface-container transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-center justify-between">
                      <CategoryBadge 
                        category={task.category || 'CHORES'} 
                        schoolSubject={task.schoolSubject} 
                        size="xs" 
                      />
                      <StatusPill status={task.status} size="sm" />
                    </div>

                    <div className="flex items-start gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskStatus(task.id);
                        }}
                        className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-outline-variant hover:border-primary text-transparent'
                        }`}
                        title={isCompleted ? t.tasks.markIncomplete : t.tasks.markCompleted}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </button>

                      <h4 
                        onClick={() => onSelectTask(task)}
                        className={`font-headline text-sm font-bold flex-1 transition-colors group-hover:text-primary ${
                          isCompleted ? 'text-secondary line-through' : 'text-on-surface'
                        }`}
                      >
                        {task.title}
                      </h4>
                    </div>

                    <div 
                      onClick={() => onSelectTask(task)}
                      className="flex items-center justify-between text-xs text-secondary pt-1 border-t border-surface-container-highest font-caption"
                    >
                      <div className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-primary" />
                        <span>{task.isAllDay ? t.common.allDay : task.time || t.common.allDay}</span>
                      </div>
                      <PriorityTag priority={task.priority} size="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
