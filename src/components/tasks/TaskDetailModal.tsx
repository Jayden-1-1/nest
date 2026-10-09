import React, { useState } from 'react';
import { Task } from '../../types/task';
import { useTasks } from '../../context/TaskContext';
import { useHome } from '../../context/HomeContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../locales';
import { StatusPill } from '../common/StatusPill';
import { PriorityTag } from '../common/PriorityTag';
import { Avatar } from '../common/Avatar';
import { CategoryBadge } from '../common/CategoryBadge';
import { 
  X, 
  Check, 
  RotateCcw, 
  AlertCircle, 
  MessageSquare, 
  Send, 
  ExternalLink, 
  FileText, 
  Edit3, 
  Trash2, 
  Calendar, 
  Clock, 
  User 
} from 'lucide-react';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
}) => {
  const { toggleTaskStatus, requestRevision, addComment, deleteTask } = useTasks();
  const { isOwner, isParent } = useHome();
  const { user } = useAuth();
  const { t, language } = useTranslation();

  const [commentText, setCommentText] = useState('');
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const isCompleted = task.status === 'DONE';

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(task.id, commentText.trim());
    setCommentText('');
  };

  const handleRevisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionNote.trim()) return;
    requestRevision(task.id, revisionNote.trim());
    setShowRevisionInput(false);
    setRevisionNote('');
  };

  const handleDelete = () => {
    if (window.confirm(t.tasks.deleteConfirm)) {
      deleteTask(task.id);
      onClose();
    }
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl shadow-modal border-t sm:border border-surface-container-highest overflow-hidden max-h-[90vh] sm:max-h-[92vh] flex flex-col pb-safe animate-bottom-sheet sm:animate-none">
        
        {/* iOS Drag Handle on Mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 bg-outline-variant/60 rounded-full" />
        </div>

        {/* Top Action Bar */}
        <div className="flex items-center justify-between px-6 pt-3 sm:pt-5 pb-3 border-b border-surface-container-highest">
          <div className="flex items-center gap-2">
            <CategoryBadge 
              category={task.category || 'CHORES'} 
              schoolSubject={task.schoolSubject} 
              size="sm" 
            />
            <span className="text-outline-variant">/</span>
            <StatusPill status={task.status} size="sm" />
            <PriorityTag priority={task.priority} size="sm" />
          </div>

          <div className="flex items-center gap-2">
            {(isOwner || isParent) && (
              <>
                <button
                  onClick={() => { onClose(); onEdit(task); }}
                  className="p-1.5 rounded-md text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
                  title={t.common.edit}
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 rounded-md text-secondary hover:text-error hover:bg-error-container/20 transition-colors"
                  title={t.common.delete}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-secondary hover:text-on-surface hover:bg-surface-container transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto scroll-touch flex-1">
          
          {/* Title & Description */}
          <div>
            <h2 className="font-headline-md text-2xl font-bold text-on-surface tracking-tight">
              {task.title}
            </h2>
            {task.description && (
              <p className="mt-2 font-body-md text-secondary leading-relaxed whitespace-pre-line">
                {task.description}
              </p>
            )}
          </div>

          {/* Revision Banner if status is NEEDS_REVISION */}
          {task.status === 'NEEDS_REVISION' && task.revisionNote && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1">
              <div className="flex items-center gap-2 font-label-caps text-xs uppercase font-bold tracking-wider">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{t.statuses.NEEDS_REVISION}</span>
              </div>
              <p className="font-body-sm text-sm">{task.revisionNote}</p>
            </div>
          )}

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-surface-container-low border border-surface-container-highest font-caption text-xs">
            <div>
              <span className="text-secondary block mb-0.5">{t.common.assignee}</span>
              <div className="font-semibold text-on-surface flex items-center gap-1.5 truncate">
                <Avatar
                  src={task.assigneeAvatar}
                  name={task.assigneeName}
                  size="xs"
                  ring={true}
                />
                <span className="truncate">{task.assigneeName}</span>
              </div>
            </div>

            <div>
              <span className="text-secondary block mb-0.5">{t.common.date}</span>
              <div className="font-semibold text-on-surface flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-secondary" />
                <span>{task.date}</span>
              </div>
            </div>

            <div>
              <span className="text-secondary block mb-0.5">{t.common.time}</span>
              <div className="font-semibold text-on-surface flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-secondary" />
                <span>{task.isAllDay ? t.common.allDay : task.time || t.common.allDay}</span>
              </div>
            </div>

            <div>
              <span className="text-secondary block mb-0.5">{t.common.author}</span>
              <div className="font-semibold text-on-surface truncate">
                {task.creatorName}
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          {task.attachments.length > 0 && (
            <div className="space-y-2">
              <span className="font-label-caps text-xs uppercase tracking-widest text-secondary block">
                {t.tasks.attachments} ({task.attachments.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {task.attachments.map((att) => (
                  <a
                    key={att.id}
                    href={att.url || '#'}
                    target={att.url ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-surface-container-low border border-surface-container-highest flex items-center justify-between text-xs hover:bg-surface-container transition-colors group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {att.type === 'link' ? (
                        <ExternalLink className="w-3.5 h-3.5 text-primary shrink-0" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-secondary shrink-0" />
                      )}
                      <span className="truncate text-on-surface font-medium">{att.title}</span>
                    </div>
                    {att.size && <span className="text-secondary font-mono text-[10px] ml-2 shrink-0">{att.size}</span>}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Primary Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {(!isOwner && !isParent && task.assigneeId && user && task.assigneeId !== user.id) ? (
              <div className="flex-1 py-3 px-4 rounded-xl bg-surface-container-low border border-surface-container-highest text-secondary text-xs font-label-caps uppercase tracking-wider text-center font-semibold">
                {language === 'ru' ? `Назначена: ${task.assigneeName}` : `Assigned to: ${task.assigneeName}`}
              </div>
            ) : (
              <button
                onClick={() => toggleTaskStatus(task.id)}
                className={`flex-1 py-3 px-5 rounded-xl font-label-caps text-xs uppercase tracking-wider font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.99] ${
                  isCompleted
                    ? 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    : 'bg-primary text-white hover:bg-primary-container shadow-sm'
                }`}
              >
                {isCompleted ? (
                  <>
                    <RotateCcw className="w-4 h-4" />
                    <span>{t.tasks.markIncomplete}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{t.tasks.markCompleted}</span>
                  </>
                )}
              </button>
            )}

            {/* Parent / Owner Revision Control */}
            {(isOwner || isParent) && !isCompleted && (
              <button
                type="button"
                onClick={() => setShowRevisionInput(!showRevisionInput)}
                className="py-3 px-4 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300 font-label-caps text-xs uppercase tracking-wider font-semibold hover:bg-amber-100/50 transition-colors"
              >
                {t.tasks.requestRevision}
              </button>
            )}
          </div>

          {/* Revision Explanation Form */}
          {showRevisionInput && (
            <form onSubmit={handleRevisionSubmit} className="p-4 rounded-xl bg-surface-container-low border border-surface-container-highest space-y-3 animate-in fade-in">
              <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                {t.tasks.revisionPrompt}
              </label>
              <textarea
                required
                rows={2}
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                placeholder={t.tasks.revisionPlaceholder}
                className="w-full px-3 py-2 rounded-lg bg-surface-container-lowest border border-surface-container-highest text-sm text-on-surface focus:outline-none focus:border-primary resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRevisionInput(false)}
                  className="px-3 py-1.5 text-xs text-secondary"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 text-white font-label-caps text-xs uppercase tracking-wider font-semibold hover:bg-amber-700"
                >
                  {t.tasks.submitRevision}
                </button>
              </div>
            </form>
          )}

          {/* Comments Discussion Section */}
          <div className="pt-4 border-t border-surface-container-highest space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <span className="font-label-caps text-xs uppercase tracking-widest text-secondary font-bold">
                {t.tasks.comments} ({task.comments.length})
              </span>
            </div>

            {/* Comment List */}
            {task.comments.length > 0 ? (
              <div className="space-y-3">
                {task.comments.map((comm) => (
                  <div key={comm.id} className="p-3 rounded-xl bg-surface-container-low border border-surface-container-highest space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <Avatar
                          src={comm.authorAvatar}
                          name={comm.authorName}
                          size="xs"
                          ring={true}
                        />
                        <span className="font-semibold text-on-surface">{comm.authorName}</span>
                      </div>
                      <span className="text-[10px] text-secondary font-mono">
                        {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="font-body-sm text-sm text-on-surface pl-5">{comm.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-caption text-xs text-secondary italic">{t.tasks.noComments}</p>
            )}

            {/* Post Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t.tasks.addComment}
                className="flex-1 px-4 py-2.5 rounded-lg bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-sm text-on-surface"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2.5 rounded-lg bg-on-surface text-surface hover:bg-primary transition-colors disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
