import React, { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useHome } from '../../context/HomeContext';
import { useTranslation } from '../../locales';
import { Task, TaskPriority, TaskAttachment } from '../../types/task';
import { X, ChevronDown, ChevronUp, Paperclip, Link, FileText, Plus } from 'lucide-react';

interface TaskCreateEditModalProps {
  isOpen: boolean;
  taskToEdit?: Task | null;
  onClose: () => void;
}

export const TaskCreateEditModal: React.FC<TaskCreateEditModalProps> = ({
  isOpen,
  taskToEdit,
  onClose,
}) => {
  const { createTask, updateTask } = useTasks();
  const { currentHome } = useHome();
  const { t, language } = useTranslation();

  const [title, setTitle] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [subject, setSubject] = useState('');
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
      setSubject(taskToEdit.subject);
      setDate(taskToEdit.date);
      setTime(taskToEdit.time || '');
      setIsAllDay(taskToEdit.isAllDay);
      setPriority(taskToEdit.priority);
      setDescription(taskToEdit.description);
      setAttachments(taskToEdit.attachments);
      setShowMoreOptions(Boolean(taskToEdit.description || taskToEdit.attachments.length > 0));
    } else {
      setTitle('');
      setAssigneeId(currentHome?.members[0]?.userId || '');
      setSubject(language === 'ru' ? 'Математика' : 'Mathematics');
      setDate(new Date().toISOString().split('T')[0]);
      setTime('');
      setIsAllDay(true);
      setPriority('MEDIUM');
      setDescription('');
      setAttachments([]);
      setShowMoreOptions(false);
    }
  }, [taskToEdit, currentHome, language]);

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

  if (!isOpen) return null;

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

    const defaultSubject = language === 'ru' ? 'Общее' : 'General';

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        description: description.trim(),
        assigneeId,
        subject: subject.trim() || defaultSubject,
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
        subject: subject.trim() || defaultSubject,
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-modal border border-surface-container-highest overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-surface-container-highest">
          <div className="flex items-center gap-2">
            <span className="font-label-caps text-xs tracking-wider uppercase text-primary font-bold">
              {taskToEdit ? t.tasks.editTask : t.tasks.createTask}
            </span>
            <span className="text-outline-variant font-mono text-xs">/ INTENTION</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* 1. What needs to be done? */}
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
              placeholder="Exercise 347–350, Reading Monograph, Lab Report..."
              className="w-full px-4 py-3 rounded-lg bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-on-surface font-headline-sm text-base font-semibold"
            />
          </div>

          {/* 2 & 3. Assign to & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label-caps text-[11px] uppercase text-secondary tracking-widest block mb-1.5">
                2. {t.tasks.assignTo} <span className="text-primary">*</span>
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-on-surface font-body-sm"
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
                3. {t.common.subject}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Mathematics, Chemistry, Art..."
                className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-on-surface font-body-sm"
              />
            </div>
          </div>

          {/* 4 & 5. When & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-label-caps text-[11px] uppercase text-secondary tracking-widest block mb-1.5">
                4. {t.tasks.when}
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-on-surface font-body-sm"
                />
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer font-caption text-caption text-secondary">
                    <input
                      type="checkbox"
                      checked={isAllDay}
                      onChange={(e) => setIsAllDay(e.target.checked)}
                      className="rounded text-primary focus:ring-0"
                    />
                    <span>{t.common.allDay}</span>
                  </label>
                  {!isAllDay && (
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="px-2 py-1 rounded bg-surface-container-low border border-surface-container-highest text-xs font-mono text-on-surface"
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="font-label-caps text-[11px] uppercase text-secondary tracking-widest block mb-1.5">
                5. {t.common.priority}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['LOW', 'MEDIUM', 'HIGH'] as TaskPriority[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-2 px-1 rounded-lg border text-center font-label-caps text-[10px] uppercase font-bold tracking-wider transition-all ${
                      priority === p
                        ? p === 'HIGH'
                          ? 'border-error bg-error/10 text-error'
                          : 'border-primary bg-primary-fixed/30 text-primary'
                        : 'border-surface-container-highest text-secondary hover:bg-surface-container-low'
                    }`}
                  >
                    {t.priorities[p]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* MORE OPTIONS ACCORDION */}
          <div className="pt-2 border-t border-surface-container-highest">
            <button
              type="button"
              onClick={() => setShowMoreOptions(!showMoreOptions)}
              className="flex items-center gap-1.5 font-label-caps text-[11px] uppercase tracking-wider text-secondary hover:text-on-surface transition-colors py-1"
            >
              <span>{showMoreOptions ? t.common.fewerOptions : t.common.moreOptions}</span>
              {showMoreOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showMoreOptions && (
              <div className="space-y-4 pt-3 animate-in fade-in duration-150">
                <div>
                  <label className="font-label-caps text-[11px] uppercase text-secondary tracking-widest block mb-1.5">
                    {t.tasks.descriptionPlaceholder}
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Key proof steps, constraints, references..."
                    className="w-full px-3 py-2.5 rounded-lg bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-on-surface font-body-sm resize-none"
                  />
                </div>

                {/* Attachments Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-label-caps text-[11px] uppercase text-secondary tracking-widest">
                      {t.tasks.attachments}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddLink(!showAddLink)}
                      className="flex items-center gap-1 text-[11px] font-caption text-primary hover:underline"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{t.tasks.addAttachment}</span>
                    </button>
                  </div>

                  {/* Add Link Input Box */}
                  {showAddLink && (
                    <div className="p-3 mb-2 rounded-lg bg-surface-container border border-surface-container-highest space-y-2">
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-surface-container-lowest text-xs text-on-surface border border-surface-container-highest"
                      />
                      <input
                        type="text"
                        placeholder="Title (optional)"
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded bg-surface-container-lowest text-xs text-on-surface border border-surface-container-highest"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddLink(false)}
                          className="px-2 py-1 text-xs text-secondary"
                        >
                          {t.common.cancel}
                        </button>
                        <button
                          type="button"
                          onClick={handleAddLink}
                          className="px-3 py-1 rounded bg-primary text-white text-xs font-semibold"
                        >
                          {t.common.add}
                        </button>
                      </div>
                    </div>
                  )}

                  {attachments.length > 0 && (
                    <div className="space-y-1.5">
                      {attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between p-2 rounded bg-surface-container-low border border-surface-container-highest text-xs"
                        >
                          <div className="flex items-center gap-2 truncate">
                            {att.type === 'link' ? <Link className="w-3.5 h-3.5 text-primary" /> : <FileText className="w-3.5 h-3.5 text-secondary" />}
                            <span className="truncate text-on-surface">{att.title}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id)}
                            className="text-secondary hover:text-error ml-2"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-highest">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-label-caps text-xs uppercase tracking-wider text-secondary hover:text-on-surface"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-6 py-2.5 rounded-lg bg-on-surface text-surface font-label-caps text-xs uppercase tracking-wider font-semibold hover:bg-primary transition-colors disabled:opacity-50"
            >
              {taskToEdit ? t.common.save : t.tasks.publish}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
