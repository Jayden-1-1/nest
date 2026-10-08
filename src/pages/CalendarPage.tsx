import React, { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import { useTranslation } from '../locales';
import { Task } from '../types/task';
import { StatusPill } from '../components/common/StatusPill';
import { PriorityTag } from '../components/common/PriorityTag';
import { PenCircle } from '../components/common/ControlledImperfection';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';

interface CalendarPageProps {
  onOpenCreateTask: () => void;
  onSelectTask: (task: Task) => void;
}

export const CalendarPage: React.FC<CalendarPageProps> = ({
  onOpenCreateTask,
  onSelectTask,
}) => {
  const { tasks } = useTasks();
  const { t, language } = useTranslation();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  // Convert to Monday = 0
  const startOffset = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const setToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  const monthName = currentDate.toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US', { month: 'long', year: 'numeric' }).toUpperCase();
  const weekDays = language === 'ru'
    ? ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']
    : ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  // Tasks for selected date
  const selectedDateTasks = tasks.filter((t) => t.date === selectedDateStr);

  return (
    <div className="w-full space-y-space-xl">
      
      {/* Top Header */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md pb-space-md border-b border-surface-container-highest">
        <div>
          <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
            TEMPORAL CADENCE // CALENDAR
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
            {t.nav.calendar}
          </h1>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={setToday}
            className="px-3 py-1.5 rounded-lg border border-surface-container-highest bg-surface-container-low hover:bg-surface-container font-label-caps text-xs uppercase tracking-wider text-on-surface transition-colors"
          >
            {t.calendar.todayBtn}
          </button>
          <div className="flex items-center bg-surface-container-low rounded-lg border border-surface-container-highest p-0.5">
            <button
              onClick={prevMonth}
              className="p-1 rounded text-secondary hover:text-on-surface hover:bg-surface"
              title={t.calendar.prevMonth}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 rounded text-secondary hover:text-on-surface hover:bg-surface"
              title={t.calendar.nextMonth}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Grid: Calendar on Left, Selected Date Ledger on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        
        {/* Monthly Calendar View */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-space-lg sm:p-space-xl rounded-2xl border border-surface-container-highest shadow-card space-y-space-md">
          
          <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-highest">
            <span className="font-headline text-lg sm:text-xl font-bold uppercase tracking-tight text-on-surface font-mono">
              {monthName}
            </span>
            <span className="font-caption text-xs text-secondary font-mono">
              Q4_CADENCE
            </span>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-label-caps text-[11px] text-secondary tracking-widest py-1 border-b border-surface-container-highest">
            {weekDays.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank leading days */}
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} className="h-14 sm:h-16 rounded-xl opacity-20 bg-surface-container-low" />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const dayTasks = tasks.filter((t) => t.date === dateStr);
              const isSelected = selectedDateStr === dateStr;
              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`relative h-14 sm:h-16 p-1.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'border-primary bg-primary-fixed/20 shadow-sm'
                      : 'border-surface-container-highest hover:bg-surface-container-low'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="relative inline-flex items-center justify-center w-6 h-6">
                      <span className={`font-mono text-xs font-bold ${
                        isSelected ? 'text-primary' : isToday ? 'text-on-surface font-black' : 'text-secondary'
                      }`}>
                        {dayNum}
                      </span>
                      {/* Controlled Imperfection Hand-Drawn Circle on Selected Date */}
                      {isSelected && (
                        <PenCircle className="text-primary scale-125" />
                      )}
                    </div>

                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </div>

                  {/* Task Dots */}
                  {dayTasks.length > 0 && (
                    <div className="flex items-center gap-1 overflow-hidden">
                      {dayTasks.slice(0, 3).map((t) => (
                        <span
                          key={t.id}
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            t.status === 'DONE' ? 'bg-emerald-500' : t.priority === 'HIGH' ? 'bg-error' : 'bg-primary'
                          }`}
                        />
                      ))}
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
        <div className="lg:col-span-5 bg-surface-container-lowest p-space-lg sm:p-space-xl rounded-2xl border border-surface-container-highest shadow-card space-y-space-md">
          <div className="flex items-center justify-between pb-space-sm border-b border-surface-container-highest">
            <div className="flex flex-col">
              <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-wider">
                {t.calendar.selectedDate}
              </span>
              <span className="font-mono text-sm font-semibold text-on-surface mt-0.5">
                {selectedDateStr}
              </span>
            </div>

            <button
              onClick={onOpenCreateTask}
              className="p-1.5 rounded-lg bg-on-surface text-surface hover:bg-primary transition-colors"
              title="Add task for this date"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {selectedDateTasks.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <CalendarIcon className="w-8 h-8 text-secondary mx-auto opacity-50" />
              <p className="font-body-sm text-sm text-secondary">
                {t.calendar.noTasksForDate}
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {selectedDateTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onSelectTask(task)}
                  className="p-3 rounded-xl bg-surface-container-low border border-surface-container-highest hover:bg-surface-container transition-colors cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-label-caps text-[10px] uppercase font-bold text-secondary">
                      {task.subject}
                    </span>
                    <StatusPill status={task.status} size="sm" />
                  </div>

                  <h4 className="font-headline text-sm font-bold text-on-surface">
                    {task.title}
                  </h4>

                  <div className="flex items-center justify-between text-xs text-secondary pt-1 border-t border-surface-container-highest font-caption">
                    <div className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-primary" />
                      <span>{task.isAllDay ? t.common.allDay : task.time || t.common.allDay}</span>
                    </div>
                    <PriorityTag priority={task.priority} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
