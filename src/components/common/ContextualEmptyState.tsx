import React from 'react';
import { useTranslation } from '../../locales';
import { 
  CheckSquare, 
  Users, 
  History, 
  Calendar, 
  Plus, 
  Copy, 
  ShieldCheck, 
  Check, 
  Sparkles 
} from 'lucide-react';

export type EmptyStateType = 'tasks' | 'members' | 'activity' | 'calendar';

interface ContextualEmptyStateProps {
  type: EmptyStateType;
  onAction?: () => void;
  inviteCode?: string;
  onCopyInvite?: () => void;
  copiedInvite?: boolean;
}

export const ContextualEmptyState: React.FC<ContextualEmptyStateProps> = ({
  type,
  onAction,
  inviteCode,
  onCopyInvite,
  copiedInvite,
}) => {
  const { language } = useTranslation();

  const configs: Record<
    EmptyStateType,
    {
      icon: React.ReactNode;
      tag: string;
      title: string;
      description: string;
      trustNote: string;
      actionText?: string;
      actionIcon?: React.ReactNode;
    }
  > = {
    tasks: {
      icon: <CheckSquare className="w-10 h-10 text-emerald-500 animate-pulse" />,
      tag: language === 'ru' ? 'РЕЕСТР ЗАДАЧ // ЧИСТЫЙ ГОРИЗОНТ' : 'TASK REGISTER // CLEAR HORIZON',
      title: language === 'ru' ? 'Задач пока нет.' : 'No tasks yet.',
      description: onAction
        ? (language === 'ru'
            ? 'Ваш дневной горизонт чист. Создайте первое домашнее поручение или учебную цель для участников Дома.'
            : 'Your daily horizon is clear. Create the first household assignment or study goal for your home members.')
        : (language === 'ru'
            ? 'Ваш дневной горизонт чист. Родители назначат вам домашние дела и школьные уроки — они сразу появятся здесь.'
            : 'Your daily horizon is clear. Tasks and homework assigned by parents will appear here.'),
      trustNote: language === 'ru'
        ? 'Все задачи изолированы внутри Дома и видны только его участникам.'
        : 'All assignments are strictly private to this household.',
      actionText: language === 'ru' ? 'Создать первую задачу' : 'Create first task',
      actionIcon: <Plus className="w-4 h-4" />,
    },
    members: {
      icon: <Users className="w-10 h-10 text-indigo-500 animate-pulse" />,
      tag: language === 'ru' ? 'БЛИЗКИЙ КРУГ // ПРИГЛАШЕНИЕ' : 'INNER CIRCLE // INVITATION',
      title: language === 'ru' ? 'Здесь пока никого нет.' : 'No one else is here yet.',
      description: language === 'ru'
        ? 'Пригласите родителей, наставников или учеников в свой Дом с помощью короткого кода, чтобы двигаться в общем ритме.'
        : 'Invite parents, tutors, or students to your HOME using the private code to coordinate together.',
      trustNote: language === 'ru'
        ? 'Доступ возможен только по вашему прямому приглашению.'
        : 'Access is granted solely via your direct invite code.',
      actionText: language === 'ru' ? 'Скопировать код Дома' : 'Copy Home code',
      actionIcon: copiedInvite ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />,
    },
    activity: {
      icon: <History className="w-10 h-10 text-primary animate-pulse" />,
      tag: language === 'ru' ? 'ХРОНИКА ДОМА // НАЧАЛО ИСТОРИИ' : 'HOUSEHOLD CHRONICLE // GENESIS',
      title: language === 'ru' ? 'Хроника пока чиста.' : 'No activity yet.',
      description: language === 'ru'
        ? 'Каждое важное действие — создание задач, сдача работ, комментарии и смена ролей — будет бережно зафиксировано в этой ленте.'
        : 'Every milestone — created tasks, submitted work, discussions, and role assignments — will be quietly recorded here.',
      trustNote: language === 'ru'
        ? 'История хранится локально и не передаётся внешним сервисам.'
        : 'History is maintained locally with zero external profiling.',
      actionText: language === 'ru' ? 'Создать первую запись' : 'Create first activity',
      actionIcon: <Plus className="w-4 h-4" />,
    },
    calendar: {
      icon: <Calendar className="w-10 h-10 text-sky-500 animate-pulse" />,
      tag: language === 'ru' ? 'ДНЕВНОЙ РАСЧЁТ // СВОБОДНЫЙ ДЕНЬ' : 'DAILY HORIZON // FREE DAY',
      title: language === 'ru' ? 'На этот день задач нет.' : 'No tasks on this date.',
      description: language === 'ru'
        ? 'На выбранную дату ничего не запланировано. Назначьте задачу или оставьте день свободным для спокойного отдыха.'
        : 'Nothing is scheduled for this date. Add an assignment or keep the day open for rest.',
      trustNote: language === 'ru'
        ? 'Сроки и расписание видны только участникам Дома.'
        : 'Schedules are visible only to verified members.',
      actionText: language === 'ru' ? 'Запланировать задачу на этот день' : 'Schedule task for this day',
      actionIcon: <Plus className="w-4 h-4" />,
    },
  };

  const config = configs[type];

  return (
    <div className="w-full p-8 sm:p-12 bg-surface-container-lowest/80 backdrop-blur-md rounded-3xl border border-surface-container-highest shadow-card flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
      
      {/* Icon Badge */}
      <div className="w-20 h-20 rounded-3xl bg-surface-container-low border border-surface-container-highest flex items-center justify-center shadow-inner">
        {config.icon}
      </div>

      {/* Tag & Titles */}
      <div className="space-y-2 max-w-md">
        <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block">
          {config.tag}
        </span>
        <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-on-surface">
          {config.title}
        </h3>
        <p className="font-body-md text-sm sm:text-base text-secondary leading-relaxed">
          {config.description}
        </p>
      </div>

      {/* Special Invite Code Box for Members empty state */}
      {type === 'members' && inviteCode && (
        <div className="p-4 rounded-2xl bg-surface-container border border-surface-container-highest flex items-center gap-4">
          <div className="space-y-0.5 text-left">
            <span className="font-caption text-[10px] font-mono uppercase text-secondary block">
              {language === 'ru' ? 'Код приглашения:' : 'Invite code:'}
            </span>
            <span className="font-mono text-xl font-bold tracking-widest text-primary">
              {inviteCode}
            </span>
          </div>

          <button
            onClick={onCopyInvite}
            className="btn-snappy px-4 py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-highest border border-surface-container-highest font-label-caps text-xs uppercase font-bold text-on-surface flex items-center gap-2 cursor-pointer"
          >
            {copiedInvite ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">{language === 'ru' ? 'Скопировано' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-secondary" />
                <span>{language === 'ru' ? 'Копировать' : 'Copy'}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Action Button */}
      {config.actionText && onAction && type !== 'members' && (
        <button
          onClick={onAction}
          className="btn-snappy px-6 py-3.5 rounded-2xl bg-on-surface text-surface hover:bg-primary font-label-caps text-xs uppercase tracking-wider font-bold shadow-card active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
        >
          {config.actionIcon}
          <span>{config.actionText}</span>
        </button>
      )}

      {/* Trust Signal Badge */}
      <div className="pt-2 flex items-center gap-2 text-xs font-mono text-secondary">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
        <span>{config.trustNote}</span>
      </div>

    </div>
  );
};
