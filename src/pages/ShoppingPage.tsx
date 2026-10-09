import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useHome } from '../context/HomeContext';
import { useTranslation } from '../locales';
import { useToast } from '../context/ToastContext';
import { ShoppingItem, GroceryCategory } from '../types/familyFeatures';
import { Avatar } from '../components/common/Avatar';
import confetti from 'canvas-confetti';
import {
  Plus,
  ShoppingCart,
  Check,
  Trash2,
  Filter,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Package,
  Layers,
  CheckCircle2,
  Circle,
  X,
  User,
} from 'lucide-react';

const CATEGORY_META: Record<
  GroceryCategory,
  { labelRu: string; labelEn: string; icon: string; color: string }
> = {
  PRODUCE: { labelRu: 'Овощи и фрукты', labelEn: 'Produce', icon: '🥦', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30' },
  DAIRY: { labelRu: 'Молочные продукты', labelEn: 'Dairy', icon: '🥛', color: 'text-sky-500 bg-sky-500/10 border-sky-500/30' },
  MEAT: { labelRu: 'Мясо и рыба', labelEn: 'Meat & Fish', icon: '🥩', color: 'text-rose-500 bg-rose-500/10 border-rose-500/30' },
  PANTRY: { labelRu: 'Бакалея и выпечка', labelEn: 'Pantry & Bakery', icon: '🍞', color: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
  SNACKS: { labelRu: 'Напитки и перекусы', labelEn: 'Snacks & Drinks', icon: '🧃', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30' },
  HOUSEHOLD: { labelRu: 'Дом и бытовая химия', labelEn: 'Household', icon: '🧼', color: 'text-teal-500 bg-teal-500/10 border-teal-500/30' },
  PHARMACY: { labelRu: 'Аптека и здоровье', labelEn: 'Pharmacy', icon: '💊', color: 'text-purple-500 bg-purple-500/10 border-purple-500/30' },
  OTHER: { labelRu: 'Разное', labelEn: 'Other', icon: '📦', color: 'text-stone-500 bg-stone-500/10 border-stone-500/30' },
};

const PRESETS: { title: string; category: GroceryCategory; unit: string }[] = [
  { title: 'Свежий хлеб', category: 'PANTRY', unit: 'шт' },
  { title: 'Молоко 3.2%', category: 'DAIRY', unit: 'бут' },
  { title: 'Яйца С0', category: 'DAIRY', unit: 'дес' },
  { title: 'Сыр', category: 'DAIRY', unit: 'уп' },
  { title: 'Бананы', category: 'PRODUCE', unit: 'кг' },
  { title: 'Сливочное масло 82.5%', category: 'DAIRY', unit: 'пач' },
  { title: 'Яблоки', category: 'PRODUCE', unit: 'кг' },
  { title: 'Кофе в зёрнах', category: 'PANTRY', unit: 'уп' },
  { title: 'Зубная паста', category: 'PHARMACY', unit: 'тюб' },
  { title: 'Салфетки бумажные', category: 'HOUSEHOLD', unit: 'уп' },
];

export const ShoppingPage: React.FC = () => {
  const { user } = useAuth();
  const { currentHome } = useHome();
  const { t, language } = useTranslation();
  const toast = useToast();

  const storageKey = `nest_shopping_items_v8_${currentHome?.id || 'main'}`;

  // Initial starter grocery items (empty by default)
  const getInitialItems = (): ShoppingItem[] => [];

  const [items, setItems] = useState<ShoppingItem[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return getInitialItems();
  });

  // Filter state
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [filterView, setFilterView] = useState<'all' | 'pending' | 'completed'>('all');

  // Quick Add State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GroceryCategory>('PRODUCE');
  const [newQuantity, setNewQuantity] = useState(1);
  const [newUnit, setNewUnit] = useState('шт');
  const [newAssignee, setNewAssignee] = useState('');

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  const totalItems = items.length;
  const completedCount = items.filter((i) => i.isCompleted).length;
  const pendingCount = totalItems - completedCount;
  const completionRate = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

  // Add Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ShoppingItem = {
      id: `shop_${Date.now()}`,
      homeId: currentHome?.id || 'main',
      title: newTitle.trim(),
      category: newCategory,
      quantity: Number(newQuantity) || 1,
      unit: newUnit.trim() || 'шт',
      isCompleted: false,
      creatorId: user?.id || 'user',
      creatorName: user?.displayName || 'Член семьи',
      assigneeName: newAssignee.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    setItems((prev) => [newItem, ...prev]);
    setNewTitle('');
    toast.success(language === 'ru' ? `«${newItem.title}» добавлено в список` : 'Item added');
  };

  // Add from Preset Strip
  const handleAddPreset = (preset: { title: string; category: GroceryCategory; unit: string }) => {
    const newItem: ShoppingItem = {
      id: `shop_${Date.now()}`,
      homeId: currentHome?.id || 'main',
      title: preset.title,
      category: preset.category,
      quantity: 1,
      unit: preset.unit,
      isCompleted: false,
      creatorId: user?.id || 'user',
      creatorName: user?.displayName || 'Член семьи',
      createdAt: new Date().toISOString(),
    };

    setItems((prev) => [newItem, ...prev]);
    toast.success(language === 'ru' ? `«${preset.title}» добавлено` : 'Preset added');
  };

  // Toggle Item Complete
  const handleToggleComplete = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextState = !item.isCompleted;
        if (nextState) {
          confetti({
            particleCount: 20,
            spread: 40,
            origin: { y: 0.8 },
          });
        }
        return {
          ...item,
          isCompleted: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
        };
      })
    );
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast.info(language === 'ru' ? 'Товар удален из списка' : 'Item removed');
  };

  // Clear Completed
  const handleClearCompleted = () => {
    if (completedCount === 0) return;
    setItems((prev) => prev.filter((i) => !i.isCompleted));
    toast.success(language === 'ru' ? 'Купленные товары очищены' : 'Purchased items cleared');
  };

  // Filtered List
  const filteredItems = items.filter((item) => {
    if (filterView === 'pending' && item.isCompleted) return false;
    if (filterView === 'completed' && !item.isCompleted) return false;
    if (activeCategoryFilter !== 'ALL' && item.category !== activeCategoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-container-highest/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛒</span>
            <h1 className="font-headline text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-on-surface">
              {language === 'ru' ? 'Семейный Список Покупок' : 'Family Shopping List'}
            </h1>
          </div>
          <p className="font-caption text-xs sm:text-sm text-secondary mt-1">
            {language === 'ru'
              ? 'Совместные покупки в магазине в реальном времени. Отмечайте купленное в один клик'
              : 'Real-time family grocery coordination. Check off bought items in one click'}
          </p>
        </div>

        {completedCount > 0 && (
          <button
            onClick={handleClearCompleted}
            className="px-4 py-2.5 rounded-xl border border-surface-container-highest hover:bg-error-container/20 hover:text-error text-secondary font-label-caps text-xs uppercase font-semibold transition-all cursor-pointer self-start sm:self-auto"
          >
            {language === 'ru' ? `Очистить купленные (${completedCount})` : `Clear bought (${completedCount})`}
          </button>
        )}
      </div>

      {/* Progress & Stats Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-surface-container-lowest/80 backdrop-blur-md border border-surface-container-highest/80 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-xs uppercase text-secondary font-bold tracking-wider">
              {language === 'ru' ? 'Прогресс покупок' : 'Shopping Progress'}
            </span>
            <span className="font-mono text-sm font-bold text-primary">
              {completedCount} / {totalItems} ({completionRate}%)
            </span>
          </div>
          <div className="h-2.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0 sm:pl-6 sm:border-l border-surface-container-highest">
          <div>
            <span className="font-headline text-2xl font-bold text-on-surface">{pendingCount}</span>
            <span className="font-caption text-xs text-secondary block">{language === 'ru' ? 'нужно купить' : 'remaining'}</span>
          </div>
          <div>
            <span className="font-headline text-2xl font-bold text-emerald-500">{completedCount}</span>
            <span className="font-caption text-xs text-secondary block">{language === 'ru' ? 'куплено' : 'bought'}</span>
          </div>
        </div>
      </div>

      {/* QUICK 1-CLICK PRESETS STRIP */}
      <div className="space-y-2">
        <span className="font-label-caps text-[11px] uppercase text-secondary tracking-widest block font-bold">
          {language === 'ru' ? 'Быстрое добавление в 1 клик' : 'Quick 1-Click Add'}
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleAddPreset(preset)}
              className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container-high border border-surface-container-highest text-xs font-medium text-on-surface transition-all active:scale-95 flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs hover:border-primary/40"
            >
              <Plus className="w-3.5 h-3.5 text-primary" />
              <span>{preset.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* INLINE QUICK ADD FORM */}
      <form onSubmit={handleAddItem} className="p-4 sm:p-5 rounded-2xl bg-surface-container-low/70 border border-surface-container-highest/80 space-y-3">
        <span className="font-label-caps text-[11px] uppercase text-primary font-bold tracking-wider block">
          {language === 'ru' ? 'Добавить товар в список' : 'Add custom item'}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          {/* Title */}
          <div className="sm:col-span-5">
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={language === 'ru' ? 'Что нужно купить? (хлеб, яблоки, порошок...)' : 'What to buy?'}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface border border-surface-container-highest focus:border-primary focus:outline-none text-xs text-on-surface"
            />
          </div>

          {/* Category */}
          <div className="sm:col-span-3">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as GroceryCategory)}
              className="w-full px-3 py-2.5 rounded-xl bg-surface border border-surface-container-highest focus:border-primary focus:outline-none text-xs text-on-surface"
            >
              {(Object.keys(CATEGORY_META) as GroceryCategory[]).map((cat) => (
                <option key={cat} value={cat}>
                  {CATEGORY_META[cat].icon} {language === 'ru' ? CATEGORY_META[cat].labelRu : CATEGORY_META[cat].labelEn}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity & Unit */}
          <div className="sm:col-span-2 flex gap-1">
            <input
              type="number"
              min="1"
              value={newQuantity}
              onChange={(e) => setNewQuantity(Number(e.target.value))}
              className="w-1/2 px-2.5 py-2.5 rounded-xl bg-surface border border-surface-container-highest focus:border-primary focus:outline-none text-xs text-on-surface font-mono text-center"
            />
            <input
              type="text"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              placeholder="шт"
              className="w-1/2 px-2 py-2.5 rounded-xl bg-surface border border-surface-container-highest focus:border-primary focus:outline-none text-xs text-on-surface text-center"
            />
          </div>

          {/* Submit */}
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-primary text-white font-label-caps text-xs uppercase font-bold tracking-wider hover:bg-primary/90 transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t.common.add}</span>
            </button>
          </div>
        </div>
      </form>

      {/* FILTER & VIEW TOGGLES */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* State filters (All / Pending / Done) */}
        <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl border border-surface-container-highest self-start">
          {[
            { id: 'all', label: language === 'ru' ? 'Все' : 'All' },
            { id: 'pending', label: language === 'ru' ? `Нужно (${pendingCount})` : `Pending (${pendingCount})` },
            { id: 'completed', label: language === 'ru' ? `Куплено (${completedCount})` : `Done (${completedCount})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterView(f.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-label-caps uppercase font-bold transition-all cursor-pointer ${
                filterView === f.id
                  ? 'bg-surface text-primary shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveCategoryFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-label-caps uppercase font-semibold transition-all cursor-pointer shrink-0 ${
              activeCategoryFilter === 'ALL'
                ? 'bg-primary text-white'
                : 'bg-surface-container-low text-secondary hover:text-on-surface'
            }`}
          >
            {language === 'ru' ? 'Все категории' : 'All categories'}
          </button>
          {(Object.keys(CATEGORY_META) as GroceryCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-label-caps uppercase font-semibold transition-all cursor-pointer shrink-0 flex items-center gap-1 ${
                activeCategoryFilter === cat
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-low text-secondary hover:text-on-surface'
              }`}
            >
              <span>{CATEGORY_META[cat].icon}</span>
              <span>{language === 'ru' ? CATEGORY_META[cat].labelRu : CATEGORY_META[cat].labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* SHOPPING ITEMS LIST */}
      {filteredItems.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-surface-container-lowest/70 border border-surface-container-highest space-y-3">
          <div className="text-4xl">🛍️</div>
          <h3 className="font-headline text-lg font-bold uppercase text-on-surface">
            {language === 'ru' ? 'Список покупок пуст' : 'Shopping list empty'}
          </h3>
          <p className="text-xs text-secondary max-w-sm mx-auto">
            {language === 'ru'
              ? 'Используйте кнопки быстрого добавления выше или введите товар вручную.'
              : 'Use the quick 1-click presets above or type a custom item.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => {
            const meta = CATEGORY_META[item.category] || CATEGORY_META.OTHER;
            return (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3 ${
                  item.isCompleted
                    ? 'bg-surface-container-lowest/50 border-surface-container-highest/60 opacity-60'
                    : 'bg-surface-container-lowest/90 border-surface-container-highest/80 shadow-xs hover:border-primary/40'
                }`}
              >
                {/* Left: Checkbox & Name */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    onClick={() => handleToggleComplete(item.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      item.isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-surface-container-highest hover:border-primary bg-surface'
                    }`}
                  >
                    {item.isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
                  </button>

                  <div className="min-w-0 flex-1">
                    <span
                      className={`font-headline text-sm font-semibold block truncate ${
                        item.isCompleted ? 'line-through text-secondary' : 'text-on-surface'
                      }`}
                    >
                      {item.title}
                    </span>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${meta.color}`}>
                        {meta.icon} {language === 'ru' ? meta.labelRu : meta.labelEn}
                      </span>
                      {item.assigneeName && (
                        <span className="text-[10px] text-secondary flex items-center gap-1 font-mono">
                          <User className="w-3 h-3 text-secondary" />
                          <span>{item.assigneeName}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Quantity Badge & Delete */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-2.5 py-1 rounded-xl bg-surface-container text-xs font-mono font-bold text-on-surface">
                    {item.quantity} {item.unit}
                  </span>

                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-1.5 rounded-lg text-secondary hover:text-error hover:bg-error-container/20 transition-colors cursor-pointer"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
