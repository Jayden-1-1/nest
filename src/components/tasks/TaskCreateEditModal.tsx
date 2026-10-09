import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useHome } from '../../context/HomeContext';
import { useTranslation } from '../../locales';
import { Task, TaskPriority, TaskCategory, SchoolSubject, TaskAttachment } from '../../types/task';
import { 
  X, 
  ChevronDown, 
  ChevronUp, 
  Link, 
  FileText, 
  Plus, 
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  Home,
  ShoppingBag,
  PawPrint,
  GraduationCap,
  Users,
  HeartPulse,
  BookOpen
} from 'lucide-react';
import { formatLocalDate } from '../../utils/date';
import { Avatar } from '../common/Avatar';

interface TaskCreateEditModalProps {
  isOpen: boolean;
  taskToEdit?: Task | null;
  defaultDate?: string;
  onClose: () => void;
}

const CATEGORY_LIST: { id: TaskCategory; icon: React.ElementType }[] = [
  { id: 'CHORES', icon: Home },
  { id: 'SHOPPING', icon: ShoppingBag },
  { id: 'PETS', icon: PawPrint },
  { id: 'SCHOOL', icon: GraduationCap },
  { id: 'FAMILY', icon: Users },
  { id: 'HEALTH', icon: HeartPulse },
  { id: 'OTHER', icon: Sparkles },
];

const SCHOOL_SUBJECTS: SchoolSubject[] = [
  'MATH',
  'LANGUAGES',
  'LITERATURE',
  'SCIENCE',
  'HISTORY',
  'ARTS',
  'OTHER',
];

export const TaskCreateEditModal: React.FC<TaskCreateEditModalProps> = ({
  isOpen,
  taskToEdit,
  defaultDate,
  onClose,
}) => {
  const { createTask, updateTask } = useTasks();
  const { currentHome, canCreateTasks, isOwner, isParent } = useHome();
  const { t, language } = useTranslation();
  const canManage = canCreateTasks || isOwner || isParent;

  const [title, setTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [category, setCategory] = useState<TaskCategory>('CHORES');
  const [schoolSubject, setSchoolSubject] = useState<SchoolSubject>('MATH');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isAllDay, setIsAllDay] = useState(true);
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [description, setDescription] = useState('');
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Attachments state
  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [showAddLink, setShowAddLink] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setAssigneeId(taskToEdit.assigneeId);
      setCategory(taskToEdit.category || 'CHORES');
      setSchoolSubject(taskToEdit.schoolSubject || 'MATH');
      setDate(taskToEdit.date);
      setTime(taskToEdit.time || '');
      setIsAllDay(taskToEdit.isAllDay);
      setPriority(taskToEdit.priority);
      setDescription(taskToEdit.description);
      setAttachments(taskToEdit.attachments || []);
      setShowMoreOptions(Boolean(taskToEdit.description || (taskToEdit.attachments && taskToEdit.attachments.length > 0)));
    } else {
      setTitle('');
      setAssigneeId(currentHome?.members[0]?.userId || '');
      setCategory('CHORES');
      setSchoolSubject('MATH');
      setDate(defaultDate || formatLocalDate(new Date()));
      setTime('');
      setIsAllDay(true);
      setPriority('MEDIUM');
      setDescription('');
      setAttachments([]);
      setShowMoreOptions(false);
    }
  }, [taskToEdit, currentHome, defaultDate]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && !canManage) {
      onClose();
    }
  }, [isOpen, canManage, onClose]);

  if (!isOpen || !canManage) return null;

  const handleAddLink = () => {
    if (!newLinkUrl.trim()) return;
    const att: TaskAttachment = {
      id: `att_${Date.now()}`,
      type: 'link',
      title: newLinkTitle.trim() || newLinkUrl.trim(),
      url: newLinkUrl.trim(),
      createdAt: new Date().toISOString(),
    };
    setAttachments([...attachments, att]);
    setNewLinkUrl('');
    setNewLinkTitle('');
    setShowAddLink(false);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assigneeId) return;

    const categoryLabel = t.categories?.[category] || category;

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        assigneeId,
        category,
        schoolSubject: category === 'SCHOOL' ? schoolSubject : undefined,
        subject: categoryLabel,
        date,
        time: isAllDay ? '' : time,
        isAllDay,
        priority,
        attachments,
      });
    } else {
      createTask({
        title: title.trim(),
        description: description.trim(),
        category,
        schoolSubject: category === 'SCHOOL' ? schoolSubject : undefined,
        subject: categoryLabel,
        assigneeId,
        date,
        time: isAllDay ? '' : time,
        isAllDay,
        priority,
        attachments,
      });
    }

    onClose();
  };

  const members = currentHome?.members || [];

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-t-3xl sm:rounded-2xl shadow-modal border-t sm:border border-surface-container-highest overflow-hidden max-h-[90vh] flex flex-col pb-safe animate-bottom-sheet sm:animate-none">
        
        {/* iOS Drag Handle on Mobile */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 bg-outline-variant/60 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-3 sm:pt-6 pb-4 border-b border-surface-container-highest">
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-xs tracking-wider uppercase text-primary font-bold">
              {taskToEdit ? t.tasks.editTask : t.tasks.createTask}
            </span>
            <span className="text-outline-variant font-mono text-xs">/ NEST</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto scroll-touch flex-1">
          
          {/* 1. Title */}
          <div>
            <label className="font-label-caps text-[11px] uppercase text-secondary tracking-widest block mb-1.5">
              1. {t.tasks.quickAddPrompt} <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.tasks.titlePlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-on-surface font-headline-sm text-base font-semibold transition-all"
            />
          </div>

          {/* 2. Family Category Selector */}
          <div>
            <label className="font-label-caps text-[11px] uppercase text-secondary tracking-widest block mb-2">
              2. {t.tasks.selectCategory} <span className="text-primary">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CATEGORY_LIST.map(({ id, icon: Icon }) => {
                const isSelected = category === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setCategory(id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-sm ring-1 ring-primary'
                        : 'bg-surface-container-low hover:bg-surface-container border-surface-container-highest text-secondary hover:text-on-surface'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{t.categories?.[id] || id}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[11px] text-secondary font-mono">
              {t.categoriesDesc?.[category]}
            </p>
          </div>

          {/* 3. Context-Aware School Subject (ONLY shown when School & Learning is selected) */}
          {category === 'SCHOOL' && (
            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary shrink-0" />
                <label className="font-label-caps text-[11px] uppercase text-primary font-bold tracking-wider">
                  {t.tasks.selectSchoolSubject}
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SCHOOL_SUBJECTS.map((sub) => {
                  const isSelected = schoolSubject === sub;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSchoolSubject(sub)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-all ${
                        isSelected
                          ? 'bg-primary/20 border-primary text-primary font-semibold'
                          : 'bg-surface-container-low border-surface-container-highest text-secondary hover:text-on-surface'
                      }`}
                    >
                      {t.schoolSubjects?.[sub] || sub}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Assignee & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label-caps text-[11px] uppercase text-secondary tracking-widest block mb-1.5">
                3. {t.tasks.assignTo} <span className="text-primary">*</span>
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-on-surface font-body-sm font-medium"
              >
                {members.map((m) => (
                  <option key={m.userId} value={m.userId}>
                    {m.displayName} ({t.roles[m.role]})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-label-caps text-[11px] uppercase text-secondary tracking-widest block mb-1.5">
                4. {t.common.priority}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['LOW', 'MEDIUM', 'HIGH'] as TaskPriority[]).map((p) => {
                  const isSelected = priority === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`py-2 px-2 rounded-xl text-xs font-bold font-label-caps uppercase text-center border transition-all ${
                        isSelected
                          ? p === 'HIGH'
                            ? 'bg-error-container text-on-error-container border-error'
                            : p === 'MEDIUM'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                          : 'bg-surface-container-low border-surface-container-highest text-secondary hover:text-on-surface'
                      }`}
                    >
                      {t.priorities[p]}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 5. Date & Time */}
          <div>
            <label className="font-label-caps text-[11px] uppercase text-secondary tracking-widest block mb-1.5">
              5. {t.tasks.when}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-on-surface font-body-sm"
              />

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer font-caption text-xs text-secondary select-none">
                  <input
                    type="checkbox"
                    checked={isAllDay}
                    onChange={(e) => setIsAllDay(e.target.checked)}
                    className="rounded text-primary focus:ring-0 w-4 h-4"
                  />
                  <span>{t.common.allDay}</span>
                </label>
                {!isAllDay && (
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-highest text-xs font-mono text-on-surface"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Accordion for More Options (Description & Attachments) */}
          <div className="pt-2 border-t border-surface-container-highest">
            <button
              type="button"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="flex items-center justify-between w-full py-2 text-xs font-label-caps uppercase tracking-wider text-secondary hover:text-on-surface"
            >
              <span>{showMoreOptions ? t.common.fewerOptions : t.common.moreOptions}</span>
              {showMoreOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showMoreOptions && (
              <div className="mt-3 space-y-4 animate-in fade-in duration-200">
                {/* Description */}
                <div>
                  <label className="font-label-caps text-[11px] uppercase text-secondary tracking-widest block mb-1">
                    {t.tasks.descriptor}
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t.tasks.descriptionPlaceholder}
                    className="w-full px-3 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-on-surface font-body-sm text-sm"
                  />
                </div>

                {/* Attachments */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="font-label-caps text-[11px] uppercase text-secondary tracking-widest">
                      {t.tasks.attachments}
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowAddLink(!showAddLink)}
                      className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{t.tasks.addAttachment}</span>
                    </button>
                  </div>

                  {/* Add Link Input */}
                  {showAddLink && (
                    <div className="p-3 mb-3 rounded-xl bg-surface-container-low border border-surface-container-highest space-y-2">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-surface-container-highest text-xs text-on-surface"
                      />
                      <input
                        type="text"
                        placeholder={t.tasks.attachmentTitlePlaceholder}
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest border border-surface-container-highest text-xs text-on-surface"
                      />
                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddLink(false)}
                          className="px-2.5 py-1 text-xs text-secondary hover:text-on-surface"
                        >
                          {t.common.cancel}
                        </button>
                        <button
                          type="button"
                          onClick={handleAddLink}
                          className="px-3 py-1 text-xs bg-primary text-white rounded-md font-semibold"
                        >
                          {t.common.add}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Existing Attachments list */}
                  {attachments.length > 0 && (
                    <div className="space-y-1.5">
                      {attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-surface-container-highest text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Link className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="truncate font-medium text-on-surface">{att.title}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id)}
                            className="text-secondary hover:text-error p-1 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-surface-container-highest">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-surface-container-highest text-xs font-semibold text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !assigneeId}
              className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold tracking-wide uppercase hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {taskToEdit ? t.common.save : t.tasks.publish}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
