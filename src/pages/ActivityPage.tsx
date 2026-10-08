import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useTranslation } from '../locales';
import { 
  CheckCircle2, 
  RotateCcw, 
  PlusCircle, 
  Edit, 
  MessageSquare, 
  UserPlus, 
  ShieldAlert,
  History
} from 'lucide-react';
import { Avatar } from '../components/common/Avatar';

export const ActivityPage: React.FC = () => {
  const { activity } = useTasks();
  const { t } = useTranslation();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'task_completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'task_revision':
        return <RotateCcw className="w-4 h-4 text-amber-600" />;
      case 'task_created':
        return <PlusCircle className="w-4 h-4 text-primary" />;
      case 'comment_added':
        return <MessageSquare className="w-4 h-4 text-primary" />;
      case 'member_joined':
        return <UserPlus className="w-4 h-4 text-primary" />;
      case 'role_changed':
        return <ShieldAlert className="w-4 h-4 text-purple-600" />;
      default:
        return <Edit className="w-4 h-4 text-secondary" />;
    }
  };

  return (
    <div className="w-full space-y-space-xl">
      
      {/* Top Header */}
      <section className="pb-space-md border-b border-surface-container-highest">
        <span className="font-label-caps text-xs text-primary font-bold uppercase tracking-widest block mb-1">
          CHRONOLOGY // LEDGER
        </span>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-on-surface">
          {t.activity.title}
        </h1>
        <p className="font-body-md text-secondary text-sm mt-1">
          {t.activity.subtitle}
        </p>
      </section>

      {activity.length === 0 ? (
        <div className="p-space-2xl bg-surface-container-low rounded-2xl border border-surface-container-highest text-center space-y-2">
          <History className="w-8 h-8 text-secondary mx-auto opacity-50" />
          <p className="font-body-sm text-secondary text-sm">{t.activity.empty}</p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-surface-container-highest">
          {activity.map((event) => (
            <div key={event.id} className="relative flex items-start gap-4 group">
              
              {/* Dot / Icon */}
              <div className="absolute -left-6 mt-1 w-5 h-5 rounded-full bg-surface-container-low border border-surface-container-highest flex items-center justify-center shrink-0">
                {getEventIcon(event.type)}
              </div>

              {/* Event Content Box */}
              <div className="flex-1 p-space-md bg-surface-container-lowest/85 backdrop-blur-md rounded-2xl border border-surface-container-highest/60 shadow-card space-y-1.5 hover:bg-surface-container-low transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Avatar
                      src={event.actorAvatar}
                      name={event.actorName}
                      size="xs"
                      ring={true}
                    />
                    <span className="font-semibold text-on-surface">{event.actorName}</span>
                    <span className="text-secondary font-mono text-[11px]">
                      // {t.activity.types?.[event.type as keyof typeof t.activity.types] || event.type.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-secondary">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {event.taskTitle && (
                  <h4 className="font-headline text-sm font-bold text-on-surface">
                    {event.taskTitle}
                  </h4>
                )}

                {event.details && (
                  <p className="font-body-sm text-xs text-secondary leading-relaxed">
                    {event.details}
                  </p>
                )}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
