import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHome } from '../context/HomeContext';
import { useTranslation } from '../locales';
import { useToast } from '../context/ToastContext';
import { FridgeNote, NoteColor, NoteMagnet, NoteTag } from '../types/familyFeatures';
import { Avatar } from '../components/common/Avatar';
import confetti from 'canvas-confetti';
import {
  Plus,
  Pin,
  PinOff,
  Trash2,
  Smile,
  Heart,
  Sparkles,
  Search,
  Filter,
  Check,
  X,
  MessageCircle,
  Clock,
  Edit2,
} from 'lucide-react';

const COLOR_CLASSES: Record<NoteColor, { bg: string; border: string; text: string; dot: string }> = {
  yellow: {
    bg: 'bg-amber-100/90 dark:bg-amber-950/70',
    border: 'border-amber-300 dark:border-amber-700/60',
    text: 'text-amber-950 dark:text-amber-100',
    dot: 'bg-amber-400',
  },
  mint: {
    bg: 'bg-emerald-100/90 dark:bg-emerald-950/70',
    border: 'border-emerald-300 dark:border-emerald-700/60',
    text: 'text-emerald-950 dark:text-emerald-100',
    dot: 'bg-emerald-400',
  },
  lavender: {
    bg: 'bg-purple-100/90 dark:bg-purple-950/70',
    border: 'border-purple-300 dark:border-purple-700/60',
    text: 'text-purple-950 dark:text-purple-100',
    dot: 'bg-purple-400',
  },
  peach: {
    bg: 'bg-orange-100/90 dark:bg-orange-950/70',
    border: 'border-orange-300 dark:border-orange-700/60',
    text: 'text-orange-950 dark:text-orange-100',
    dot: 'bg-orange-400',
  },
  sky: {
    bg: 'bg-sky-100/90 dark:bg-sky-950/70',
    border: 'border-sky-300 dark:border-sky-700/60',
    text: 'text-sky-950 dark:text-sky-100',
    dot: 'bg-sky-400',
  },
};

const MAGNET_OPTIONS: NoteMagnet[] = ['📌', '❤️', '🥑', '🍕', '⭐', '🐱', '🔑', '☕'];

const AVAILABLE_REACTIONS = ['❤️', '👍', '👏', '😂', '🧁', '⭐'];

export const FridgePage: React.FC = () => {
  const { user } = useAuth();
  const { currentHome } = useHome();
  const { t, language } = useTranslation();
  const toast = useToast();

  const storageKey = `nest_fridge_notes_v8_${currentHome?.id || 'main'}`;

  // Initial starter notes (empty by default)
  const getInitialNotes = (): FridgeNote[] => [];

  const [notes, setNotes] = useState<FridgeNote[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return getInitialNotes();
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pinned' | NoteTag>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<FridgeNote | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formColor, setFormColor] = useState<NoteColor>('yellow');
  const [formMagnet, setFormMagnet] = useState<NoteMagnet>('📌');
  const [formTag, setFormTag] = useState<NoteTag>('reminder');
  const [formPinned, setFormPinned] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes, storageKey]);

  const handleOpenAddModal = (note?: FridgeNote) => {
    if (note) {
      setEditingNote(note);
      setFormTitle(note.title);
      setFormContent(note.content);
      setFormColor(note.color);
      setFormMagnet(note.magnet);
      setFormTag(note.tag);
      setFormPinned(note.isPinned);
    } else {
      setEditingNote(null);
      setFormTitle('');
      setFormContent('');
      setFormColor('yellow');
      setFormMagnet('📌');
      setFormTag('reminder');
      setFormPinned(false);
    }
    setModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() && !formContent.trim()) return;

    if (editingNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingNote.id
            ? {
                ...n,
                title: formTitle.trim(),
                content: formContent.trim(),
                color: formColor,
                magnet: formMagnet,
                tag: formTag,
                isPinned: formPinned,
                updatedAt: new Date().toISOString(),
              }
            : n
        )
      );
      toast.success(language === 'ru' ? 'Записка обновлена' : 'Note updated');
    } else {
      const newNote: FridgeNote = {
        id: `note_${Date.now()}`,
        homeId: currentHome?.id || 'main',
        title: formTitle.trim() || (language === 'ru' ? 'Записка' : 'Note'),
        content: formContent.trim(),
        color: formColor,
        magnet: formMagnet,
        tag: formTag,
        isPinned: formPinned,
        authorId: user?.id || 'unknown',
        authorName: user?.displayName || 'Член семьи',
        authorAvatar: user?.avatarUrl || '',
        reactions: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setNotes((prev) => [newNote, ...prev]);
      toast.success(language === 'ru' ? 'Записка прикреплена на холодильник!' : 'Note attached to fridge!');
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.7 },
      });
    }

    setModalOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    toast.info(language === 'ru' ? 'Записка снята с холодильника' : 'Note removed');
  };

  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n))
    );
  };

  const handleReact = (noteId: string, emoji: string) => {
    if (!user) return;
    setNotes((prev) =>
      prev.map((n) => {
        if (n.id !== noteId) return n;
        const currentReactions = { ...n.reactions };
        const users = currentReactions[emoji] || [];
        if (users.includes(user.id)) {
          // Remove reaction
          currentReactions[emoji] = users.filter((u) => u !== user.id);
          if (currentReactions[emoji].length === 0) {
            delete currentReactions[emoji];
          }
        } else {
          // Add reaction
          currentReactions[emoji] = [...users, user.id];
        }
        return { ...n, reactions: currentReactions };
      })
    );
  };

  const filteredNotes = notes.filter((n) => {
    if (activeFilter === 'pinned' && !n.isPinned) return false;
    if (activeFilter !== 'all' && activeFilter !== 'pinned' && n.tag !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.authorName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container-highest/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧊</span>
            <h1 className="font-headline text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-on-surface">
              {language === 'ru' ? 'Семейный Холодильник & Стикеры' : 'Family Fridge & Sticky Notes'}
            </h1>
          </div>
          <p className="font-caption text-xs sm:text-sm text-secondary mt-1">
            {language === 'ru'
              ? 'Тёплые записки на магнитах, напоминания, важные дела и сообщения для всей семьи'
              : 'Magnet sticky notes, reminders, family plans, and quick messages for the family'}
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="btn-snappy px-5 py-3 rounded-2xl bg-primary text-white font-label-caps text-xs uppercase tracking-wider font-bold shadow-md hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{language === 'ru' ? 'Повесить записку' : 'Add Sticky Note'}</span>
        </button>
      </div>

      {/* Control Strip: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ru' ? 'Поиск по запискам...' : 'Search notes...'}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-surface-container-low border border-surface-container-highest text-xs text-on-surface placeholder-secondary focus:outline-none focus:border-primary"
          />
          <Search className="w-4 h-4 text-secondary absolute left-3 top-2.5" />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: language === 'ru' ? 'Все' : 'All' },
            { id: 'pinned', label: language === 'ru' ? '📌 Закреплённые' : '📌 Pinned' },
            { id: 'reminder', label: language === 'ru' ? '⏰ Напоминания' : '⏰ Reminders' },
            { id: 'urgent', label: language === 'ru' ? '⚡ Срочно' : '⚡ Urgent' },
            { id: 'idea', label: language === 'ru' ? '💡 Идеи' : '💡 Ideas' },
            { id: 'general', label: language === 'ru' ? '📝 Заметки' : '📝 Notes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-label-caps text-[11px] uppercase tracking-wider font-semibold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-surface-container-low hover:bg-surface-container text-secondary hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* FRIDGE BOARD GRID */}
      {filteredNotes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-surface-container-lowest/70 border border-surface-container-highest space-y-3">
          <div className="text-4xl">🧊</div>
          <h3 className="font-headline text-lg font-bold uppercase text-on-surface">
            {language === 'ru' ? 'На холодильнике чисто!' : 'Fridge is clear!'}
          </h3>
          <p className="text-xs text-secondary max-w-sm mx-auto">
            {language === 'ru'
              ? 'Нажмите «Повесить записку», чтобы оставить тёплое послание или напоминание для семьи.'
              : 'Click "Add Sticky Note" to leave a warm message or reminder for your family.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
          {filteredNotes.map((note, index) => {
            const colorCfg = COLOR_CLASSES[note.color] || COLOR_CLASSES.yellow;
            // Slight organic alternating rotation for tactile real-life fridge vibe
            const rotationDegree = index % 4 === 0 ? '-rotate-1' : index % 4 === 1 ? 'rotate-1' : index % 4 === 2 ? '-rotate-0.5' : 'rotate-0.5';

            return (
              <div
                key={note.id}
                className={`group relative p-5 rounded-2xl border ${colorCfg.bg} ${colorCfg.border} shadow-lg hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1 hover:rotate-0 ${rotationDegree} flex flex-col justify-between min-h-[220px]`}
              >
                {/* Top Magnet Badge */}
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                  <span className="text-2xl filter drop-shadow-md select-none cursor-default animate-bounce-subtle">
                    {note.magnet}
                  </span>
                </div>

                {/* Top Actions: Pin & Delete */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => handleTogglePin(note.id)}
                    title={note.isPinned ? 'Открепить' : 'Закрепить'}
                    className={`p-1 rounded-lg transition-colors cursor-pointer ${
                      note.isPinned ? 'text-primary font-bold' : 'text-secondary/50 hover:text-on-surface'
                    }`}
                  >
                    <Pin className={`w-4 h-4 ${note.isPinned ? 'fill-primary' : ''}`} />
                  </button>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenAddModal(note)}
                      className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 text-secondary hover:text-on-surface cursor-pointer"
                      title="Редактировать"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 rounded-lg hover:bg-error/20 text-secondary hover:text-error cursor-pointer"
                      title="Снять с холодильника"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Note Body */}
                <div className="my-3 space-y-1.5">
                  <h4 className={`font-headline font-bold text-base leading-snug ${colorCfg.text}`}>
                    {note.title}
                  </h4>
                  <p className={`font-sans text-xs sm:text-sm leading-relaxed whitespace-pre-wrap opacity-90 ${colorCfg.text}`}>
                    {note.content}
                  </p>
                </div>

                {/* Note Footer: Author & Reactions */}
                <div className="pt-3 border-t border-black/10 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] opacity-75 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Avatar src={note.authorAvatar} name={note.authorName} size="xs" ring={false} />
                      <span className="font-semibold truncate max-w-[110px]">{note.authorName}</span>
                    </div>
                    <span>
                      {new Date(note.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Reaction Bar */}
                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    {/* Render active reactions */}
                    {Object.entries(note.reactions || {}).map(([emoji, users]) => {
                      if (!users || users.length === 0) return null;
                      const hasReacted = user && users.includes(user.id);
                      return (
                        <button
                          key={emoji}
                          onClick={() => handleReact(note.id, emoji)}
                          className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 border transition-all cursor-pointer ${
                            hasReacted
                              ? 'bg-primary/20 border-primary font-bold text-primary scale-105'
                              : 'bg-black/5 dark:bg-white/5 border-transparent hover:bg-black/10'
                          }`}
                        >
                          <span>{emoji}</span>
                          <span className="text-[10px] font-mono">{users.length}</span>
                        </button>
                      );
                    })}

                    {/* Quick Add Reaction Dropdown / Picker */}
                    <div className="flex items-center gap-0.5 opacity-60 hover:opacity-100 transition-opacity">
                      {AVAILABLE_REACTIONS.slice(0, 3).map((em) => (
                        <button
                          key={em}
                          onClick={() => handleReact(note.id, em)}
                          className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-xs transition-transform hover:scale-125 cursor-pointer"
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: ADD / EDIT STICKY NOTE */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-3xl border border-surface-container-highest p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-surface-container-highest">
              <div className="flex items-center gap-2">
                <span className="text-xl">{formMagnet}</span>
                <h3 className="font-headline text-lg font-bold uppercase text-on-surface">
                  {editingNote
                    ? (language === 'ru' ? 'Редактировать записку' : 'Edit Note')
                    : (language === 'ru' ? 'Новая записка на холодильник' : 'New Fridge Note')}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-surface-container text-secondary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              
              {/* Note Title */}
              <div className="space-y-1">
                <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                  {language === 'ru' ? 'Заголовок записки' : 'Title'}
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={language === 'ru' ? 'например: Не забудьте ключи! 🔑' : 'e.g. Remember keys! 🔑'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-sm text-on-surface font-sans"
                />
              </div>

              {/* Note Content */}
              <div className="space-y-1">
                <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                  {language === 'ru' ? 'Текст послания' : 'Message'}
                </label>
                <textarea
                  rows={3}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder={language === 'ru' ? 'Подробности, добрые слова или список...' : 'Details, warm wishes...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest focus:border-primary focus:outline-none text-sm text-on-surface font-sans resize-none"
                />
              </div>

              {/* Color Choice */}
              <div className="space-y-1.5">
                <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                  {language === 'ru' ? 'Цвет стикера' : 'Sticky Color'}
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {(['yellow', 'mint', 'lavender', 'peach', 'sky'] as NoteColor[]).map((clr) => (
                    <button
                      key={clr}
                      type="button"
                      onClick={() => setFormColor(clr)}
                      className={`h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                        COLOR_CLASSES[clr].bg
                      } ${COLOR_CLASSES[clr].border} ${
                        formColor === clr ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface scale-105' : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {formColor === clr && <Check className="w-4 h-4 text-on-surface" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Magnet Choice */}
              <div className="space-y-1.5">
                <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                  {language === 'ru' ? 'Магнит' : 'Magnet'}
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {MAGNET_OPTIONS.map((mag) => (
                    <button
                      key={mag}
                      type="button"
                      onClick={() => setFormMagnet(mag)}
                      className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border transition-all cursor-pointer ${
                        formMagnet === mag
                          ? 'bg-primary/10 border-primary ring-2 ring-primary/30 scale-110 shadow-sm'
                          : 'bg-surface-container-low border-surface-container-highest hover:bg-surface-container'
                      }`}
                    >
                      {mag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tag & Pin */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="font-label-caps text-[11px] uppercase text-secondary tracking-widest block mb-1">
                    {language === 'ru' ? 'Категория' : 'Category'}
                  </label>
                  <select
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value as NoteTag)}
                    className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-highest text-xs text-on-surface focus:outline-none"
                  >
                    <option value="reminder">{language === 'ru' ? '⏰ Напоминание' : 'Reminder'}</option>
                    <option value="urgent">{language === 'ru' ? '⚡ Срочно' : 'Urgent'}</option>
                    <option value="idea">{language === 'ru' ? '💡 Идея' : 'Idea'}</option>
                    <option value="general">{language === 'ru' ? '📌 Обычная' : 'General'}</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="formPinned"
                    checked={formPinned}
                    onChange={(e) => setFormPinned(e.target.checked)}
                    className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
                  />
                  <label htmlFor="formPinned" className="text-xs font-semibold text-on-surface cursor-pointer select-none">
                    {language === 'ru' ? 'Закрепить сверху' : 'Pin to top'}
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface-container-highest">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-label-caps text-xs uppercase text-secondary hover:text-on-surface cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-label-caps text-xs uppercase font-bold tracking-wider hover:bg-primary/90 transition-all cursor-pointer shadow-md"
                >
                  {editingNote
                    ? (language === 'ru' ? 'Сохранить изменения' : 'Save Changes')
                    : (language === 'ru' ? 'Повесить на холодильник' : 'Attach Note')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
