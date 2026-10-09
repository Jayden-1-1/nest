import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHome } from '../../context/HomeContext';
import { useTranslation } from '../../locales';
import { useToast } from '../../context/ToastContext';
import { Avatar } from './Avatar';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Send, Plus, X, MessageSquareHeart } from 'lucide-react';
import { FamilyGratitude } from '../../types/familyFeatures';

export const FamilyGratitudeWidget: React.FC = () => {
  const { user } = useAuth();
  const { currentHome } = useHome();
  const { language, t } = useTranslation();
  const toast = useToast();

  const storageKey = `nest_gratitude_v8_${currentHome?.id || 'main'}`;

  const getInitialNotes = (): FamilyGratitude[] => [];

  const [notes, setNotes] = useState<FamilyGratitude[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return getInitialNotes();
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRecipientId, setSelectedRecipientId] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  const QUICK_TEMPLATES = [
    'Спасибо за вкусный завтрак и обед! 🍳❤️',
    'Спасибо за помощь и добрый совет! 🤝✨',
    'Спасибо за порядок и чистоту в доме! 🧹⭐',
    'Спасибо, что ты есть у нас в семье! 🥰💖',
    'Спасибо за заботу и тёплую поддержку! 🌸🤗',
  ];

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(notes));
  }, [notes, storageKey]);

  const handleSendGratitude = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim()) return;

    const recipient = currentHome?.members.find((m) => m.userId === selectedRecipientId) || currentHome?.members[0];
    const toName = recipient ? recipient.displayName : (language === 'ru' ? 'Семье' : 'Family');
    const toAvatar = recipient?.avatarUrl || '';

    const newNote: FamilyGratitude = {
      id: `grat_${Date.now()}`,
      homeId: currentHome?.id || 'main',
      fromId: user?.id || 'self',
      fromName: user?.displayName || (language === 'ru' ? 'Вы' : 'You'),
      fromAvatar: user?.avatarUrl || '',
      toId: selectedRecipientId || 'all',
      toName,
      toAvatar,
      message: customMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setCustomMessage('');
    setModalOpen(false);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FF6B81', '#FF85A2', '#FFB800', '#0F4CFF'],
    });

    toast.success(language === 'ru' ? 'Сердечко с благодарностью отправлено!' : 'Gratitude note sent!');
  };

  return (
    <div className="bg-surface-container-lowest/85 backdrop-blur-md rounded-3xl border border-surface-container-highest/60 p-6 sm:p-7 shadow-card space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-container-highest/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-rose-500" />
          </div>
          <div>
            <h3 className="font-headline text-base font-bold uppercase tracking-tight text-on-surface">
              {language === 'ru' ? 'Копилка «Спасибо»' : 'Family Gratitude Jar'}
            </h3>
            <span className="font-caption text-[11px] text-secondary">
              {language === 'ru' ? 'Тёплые слова и поддержка близких' : 'Love notes & heartfelt thanks'}
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            if (currentHome && currentHome.members.length > 0) {
              const other = currentHome.members.find((m) => m.userId !== user?.id) || currentHome.members[0];
              setSelectedRecipientId(other.userId);
            }
            setModalOpen(true);
          }}
          className="btn-snappy px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white font-label-caps text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>{language === 'ru' ? 'Сказать спасибо' : 'Say Thanks'}</span>
        </button>
      </div>

      {/* Total Counter Banner */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-indigo-500/10 border border-rose-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span className="font-label-caps text-xs uppercase font-bold tracking-wider text-on-surface">
            {language === 'ru' ? 'Уровень тепла в доме' : 'Home Warmth Level'}
          </span>
        </div>
        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-full bg-surface text-rose-500 shadow-xs">
          {notes.length > 0 ? `${notes.length * 15} ❤️` : '0 ❤️'}
        </span>
      </div>

      {/* Recent Notes Stream */}
      <div className="space-y-2.5">
        {notes.length === 0 ? (
          <div className="py-6 text-center text-secondary text-xs">
            {language === 'ru'
              ? 'В копилке пока пусто. Нажмите «Сказать спасибо», чтобы оставить тёплое слово!'
              : 'Jar is currently empty. Click "Say Thanks" to leave the first note!'}
          </div>
        ) : (
          notes.slice(0, 3).map((n) => (
            <div
              key={n.id}
              className="p-3 rounded-2xl bg-surface-container-low/60 hover:bg-surface-container-low border border-surface-container-highest/60 space-y-1.5 transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-secondary">
                <span className="font-semibold text-on-surface">
                  {n.fromName} → <span className="text-primary">{n.toName}</span>
                </span>
                <span>{new Date(n.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
              </div>
              <p className="text-xs text-on-surface/90 leading-relaxed font-sans">
                {n.message}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Modal: Send Gratitude */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl border border-surface-container-highest p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-2 border-b border-surface-container-highest">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
                <h3 className="font-headline text-lg font-bold uppercase text-on-surface">
                  {language === 'ru' ? 'Сказать спасибо' : 'Send Family Love'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full hover:bg-surface-container text-secondary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendGratitude} className="space-y-3.5">
              
              {/* Recipient */}
              <div className="space-y-1">
                <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                  {language === 'ru' ? 'Кому сказать спасибо' : 'Send To'}
                </label>
                <select
                  value={selectedRecipientId}
                  onChange={(e) => setSelectedRecipientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-surface-container-highest text-xs text-on-surface focus:outline-none"
                >
                  {currentHome?.members.map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.displayName} (@{m.username})
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label className="font-label-caps text-xs uppercase text-secondary tracking-widest block">
                  {language === 'ru' ? 'Текст благодарности' : 'Your Note'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder={language === 'ru' ? 'Напишите тёплые слова...' : 'Write something sweet...'}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container-highest text-xs text-on-surface resize-none focus:outline-none focus:border-primary"
                />
              </div>

              {/* Quick Templates */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-secondary block">
                  {language === 'ru' ? 'Быстрые шаблоны:' : 'Quick ideas:'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {QUICK_TEMPLATES.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCustomMessage(tmpl)}
                      className="px-2 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container text-[11px] text-secondary hover:text-on-surface transition-colors cursor-pointer text-left"
                    >
                      {tmpl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-surface-container-highest">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl font-label-caps text-xs uppercase text-secondary hover:text-on-surface cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-label-caps text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'ru' ? 'Отправить сердечко' : 'Send Gratitude'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
