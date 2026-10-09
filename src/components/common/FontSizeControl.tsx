import React, { useState, useRef, useEffect } from 'react';
import { useTheme, FontScale } from '../../context/ThemeContext';
import { useTranslation } from '../../locales';
import { Type, Check, Eye } from 'lucide-react';

interface FontOption {
  id: FontScale;
  labelRu: string;
  labelEn: string;
  sizeDesc: string;
  percentage: string;
}

const FONT_OPTIONS: FontOption[] = [
  { id: 'standard', labelRu: 'Обычный', labelEn: 'Standard', sizeDesc: '16px', percentage: '100%' },
  { id: 'medium', labelRu: 'Средний', labelEn: 'Medium', sizeDesc: '18px', percentage: '112%' },
  { id: 'large', labelRu: 'Крупный', labelEn: 'Large (для мамы)', sizeDesc: '20px', percentage: '125%' },
  { id: 'extra', labelRu: 'Максимальный', labelEn: 'Extra Large', sizeDesc: '22.5px', percentage: '140%' },
];

/**
 * Full visual card for Settings & Bottom Sheet
 */
export const FontSizeSettingsCard: React.FC = () => {
  const { fontScale, setFontScale } = useTheme();
  const { language } = useTranslation();

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-surface-container-low border border-surface-container-highest space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
            <Type className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-headline text-sm sm:text-base font-bold text-on-surface">
              {language === 'ru' ? 'Размер шрифта для чтения' : 'Text & Reading Size'}
            </h3>
            <p className="font-caption text-xs text-secondary">
              {language === 'ru'
                ? 'Увеличение текста для мамы и удобного чтения без очков'
                : 'Scale text up for comfort, clarity, and older family members'}
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-primary/10 text-primary border border-primary/20">
          {FONT_OPTIONS.find((o) => o.id === fontScale)?.percentage}
        </span>
      </div>

      {/* 4 Preset Segmented Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {FONT_OPTIONS.map((opt) => {
          const isSelected = fontScale === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setFontScale(opt.id)}
              className={`p-3 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between min-h-[72px] ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-md ring-2 ring-primary/30'
                  : 'bg-surface-container hover:bg-surface-container-high border-surface-container-highest text-on-surface'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold">
                  {language === 'ru' ? opt.labelRu : opt.labelEn}
                </span>
                {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
              </div>
              <div className="flex items-baseline justify-between text-[11px] opacity-80 font-mono mt-1">
                <span>{opt.sizeDesc}</span>
                <span>{opt.percentage}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Live Preview Box */}
      <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container-highest space-y-1.5">
        <div className="flex items-center gap-2 text-xs font-label-caps uppercase tracking-wider text-secondary">
          <Eye className="w-3.5 h-3.5" />
          <span>{language === 'ru' ? 'Образец текста в приложении:' : 'Live Reading Sample:'}</span>
        </div>
        <p className="text-on-surface font-medium leading-relaxed">
          {language === 'ru'
            ? '🧺 Забрать покупки • 18:30 • Легко читается с любого расстояния!'
            : '🧺 Pick up groceries • 18:30 • Clearly visible from any distance!'}
        </p>
      </div>
    </div>
  );
};

/**
 * Compact Quick Header Button with Popover
 */
export const QuickFontScaleButton: React.FC = () => {
  const { fontScale, setFontScale } = useTheme();
  const { language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const activeOption = FONT_OPTIONS.find((o) => o.id === fontScale) || FONT_OPTIONS[0];

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-surface-container-highest bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-all active:scale-95 cursor-pointer"
        title={language === 'ru' ? 'Настроить размер шрифта' : 'Adjust Text Size'}
        aria-label="Adjust font size"
      >
        <span className="font-bold tracking-tight font-serif text-sm">Aa</span>
        <span className="hidden sm:inline text-[11px] text-secondary font-mono">
          {activeOption.percentage}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-2xl bg-surface-container-lowest border border-surface-container-highest shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-surface-container-highest">
            <span className="font-label-caps text-[11px] uppercase tracking-wider text-secondary font-bold">
              {language === 'ru' ? 'Размер текста' : 'Font Size'}
            </span>
            <span className="text-[11px] font-mono text-primary font-bold">
              {activeOption.percentage}
            </span>
          </div>

          <div className="space-y-1">
            {FONT_OPTIONS.map((opt) => {
              const isSelected = fontScale === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setFontScale(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-primary text-white font-bold shadow-sm'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <span>{language === 'ru' ? opt.labelRu : opt.labelEn}</span>
                  <span className={`text-[11px] font-mono ${isSelected ? 'text-white/90' : 'text-secondary'}`}>
                    {opt.percentage}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
