import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  CheckSquare, 
  User, 
  Calendar, 
  BarChart3, 
  Settings, 
  Sparkles, 
  Sun, 
  Moon, 
  Globe, 
  Plus, 
  ArrowRight, 
  Command, 
  X,
  StickyNote,
  ShoppingBag
} from 'lucide-react';
import { useHome } from '../../context/HomeContext';
import { useTasks } from '../../context/TaskContext';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from '../../locales';
import { AtmosphereType } from '../../types/home';
import { Avatar } from './Avatar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (route: string) => void;
  onOpenCreateTask?: () => void;
  onOpenCreateHome?: () => void;
  onOpenJoinHome?: () => void;
  onSelectTask?: (taskId: string) => void;
}

interface PaletteItem {
  id: string;
  category: 'tasks' | 'commands' | 'members';
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenCreateTask,
  onOpenCreateHome,
  onOpenJoinHome,
  onSelectTask,
}) => {
  const { currentHome, allHomes, switchHome, canCreateTasks } = useHome();
  const { tasks } = useTasks();
  const { theme, setTheme, atmosphere, setAtmosphere, isDark } = useTheme();
  const { language, setLanguage, t } = useTranslation();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build searchable items
  const items: PaletteItem[] = useMemo(() => {
    const list: PaletteItem[] = [];

    // 1. Navigation & Quick Commands
    if (canCreateTasks) {
      list.push({
        id: 'cmd_create_task',
        category: 'commands',
        title: t.palette.createTask,
        subtitle: t.tasks.allTasks,
        icon: <Plus className="w-4 h-4 text-primary" />,
        action: () => {
          onClose();
          if (onOpenCreateTask) {
            onOpenCreateTask();
          } else {
            onNavigate('tasks');
          }
        },
      });
    }

    list.push({
      id: 'cmd_nav_calendar',
      category: 'commands',
      title: t.palette.viewCalendar,
      subtitle: t.nav.calendar,
      icon: <Calendar className="w-4 h-4 text-primary" />,
      action: () => {
        onClose();
        onNavigate('calendar');
      },
    });

    list.push({
      id: 'cmd_nav_fridge',
      category: 'commands',
      title: language === 'ru' ? 'Семейный Холодильник & Заметки' : 'Fridge & Sticky Notes',
      subtitle: t.nav.fridge,
      icon: <StickyNote className="w-4 h-4 text-primary" />,
      action: () => {
        onClose();
        onNavigate('fridge');
      },
    });

    list.push({
      id: 'cmd_nav_shopping',
      category: 'commands',
      title: language === 'ru' ? 'Список покупок' : 'Shopping List',
      subtitle: t.nav.shopping,
      icon: <ShoppingBag className="w-4 h-4 text-primary" />,
      action: () => {
        onClose();
        onNavigate('shopping');
      },
    });

    list.push({
      id: 'cmd_nav_progress',
      category: 'commands',
      title: t.palette.viewProgress,
      subtitle: t.nav.progress,
      icon: <BarChart3 className="w-4 h-4 text-primary" />,
      action: () => {
        onClose();
        onNavigate('progress');
      },
    });

    list.push({
      id: 'cmd_nav_members',
      category: 'commands',
      title: t.palette.viewMembers,
      subtitle: t.nav.members,
      icon: <User className="w-4 h-4 text-primary" />,
      action: () => {
        onClose();
        onNavigate('members');
      },
    });

    list.push({
      id: 'cmd_nav_settings',
      category: 'commands',
      title: t.palette.openSettings,
      subtitle: t.nav.settings,
      icon: <Settings className="w-4 h-4 text-primary" />,
      action: () => {
        onClose();
        onNavigate('settings');
      },
    });

    // Theme & Atmosphere controls
    list.push({
      id: 'cmd_toggle_theme',
      category: 'commands',
      title: t.palette.toggleTheme,
      subtitle: isDark ? 'Warm Paper' : 'Midnight Studio',
      icon: isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-primary" />,
      action: () => {
        setTheme(isDark ? 'light' : 'dark');
        onClose();
      },
    });

    list.push({
      id: 'cmd_toggle_lang',
      category: 'commands',
      title: t.palette.toggleLanguage,
      subtitle: language === 'ru' ? 'English' : 'Русский',
      icon: <Globe className="w-4 h-4 text-primary" />,
      action: () => {
        setLanguage(language === 'ru' ? 'en' : 'ru');
        onClose();
      },
    });

    // Atmosphere presets
    const atmospheres: AtmosphereType[] = ['Clouds', 'Midnight', 'Sunset', 'Ocean', 'Aurora'];
    atmospheres.forEach((atm) => {
      list.push({
        id: `cmd_atm_${atm}`,
        category: 'commands',
        title: `${t.palette.switchAtmosphere}: ${t.atmospheres[atm]}`,
        subtitle: atm,
        icon: <Sparkles className="w-4 h-4 text-primary" />,
        action: () => {
          setAtmosphere(atm);
          onClose();
        },
      });
    });

    // Other Homes
    allHomes.forEach((home) => {
      if (home.id !== currentHome?.id) {
        list.push({
          id: `cmd_switch_home_${home.id}`,
          category: 'commands',
          title: `${t.nav.switchHome}: ${home.name}`,
          subtitle: home.atmosphere,
          icon: <Command className="w-4 h-4 text-secondary" />,
          action: () => {
            switchHome(home.id);
            onClose();
          },
        });
      }
    });

    // 2. Members in current home
    if (currentHome) {
      currentHome.members.forEach((m) => {
        list.push({
          id: `member_${m.userId}`,
          category: 'members',
          title: m.displayName,
          subtitle: `@${m.username} · ${t.roles[m.role]}`,
          icon: (
            <Avatar 
              src={m.avatarUrl} 
              name={m.displayName} 
              size="xs" 
              ring={false} 
            />
          ),
          action: () => {
            onClose();
            onNavigate('members');
          },
        });
      });
    }

    // 3. Current home tasks
    tasks.forEach((task) => {
      list.push({
        id: `task_${task.id}`,
        category: 'tasks',
        title: task.title,
        subtitle: `${task.subject} · ${task.status === 'DONE' ? t.common.completed : t.common.active}`,
        icon: <CheckSquare className={`w-4 h-4 ${task.status === 'DONE' ? 'text-primary' : 'text-secondary'}`} />,
        action: () => {
          onClose();
          if (onSelectTask) {
            onSelectTask(task.id);
          } else {
            onNavigate('tasks');
          }
        },
      });
    });

    return list;
  }, [
    t, 
    tasks, 
    currentHome, 
    allHomes, 
    isDark, 
    language, 
    onClose, 
    onNavigate, 
    onOpenCreateTask, 
    onSelectTask, 
    setTheme, 
    setLanguage, 
    setAtmosphere, 
    switchHome
  ]);

  // Filter items by query
  const filteredItems = useMemo(() => {
    if (!query.trim()) {
      // Default: show quick commands first, then members, then a few tasks
      return items.slice(0, 15);
    }
    const q = query.toLowerCase().trim();
    return items.filter((item) => {
      return (
        item.title.toLowerCase().includes(q) ||
        (item.subtitle && item.subtitle.toLowerCase().includes(q))
      );
    });
  }, [items, query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(filteredItems.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(filteredItems.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-popover overflow-hidden flex flex-col max-h-[75vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-surface-container-highest bg-surface-container-low/50">
          <Search className="w-5 h-5 text-secondary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.palette.searchPlaceholder}
            className="flex-1 bg-transparent border-none text-on-surface text-body-md placeholder:text-outline focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded hover:bg-surface-container text-secondary hover:text-on-surface transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono uppercase bg-surface-container rounded border border-surface-container-highest text-secondary">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div 
          ref={listRef} 
          className="flex-1 overflow-y-auto p-2 divide-y divide-surface-container-highest/40"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-secondary font-body-sm">
              <p>{t.palette.noResults} "{query}"</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={item.id}
                    data-active={isSelected}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all ${
                      isSelected
                        ? 'bg-surface-container text-on-surface shadow-sm translate-x-0.5'
                        : 'text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-surface-container-highest' : 'bg-surface-container'}`}>
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className={`font-body-md text-sm truncate ${isSelected ? 'font-semibold text-primary' : 'text-on-surface'}`}>
                          {item.title}
                        </div>
                        {item.subtitle && (
                          <div className="font-caption text-[11px] text-secondary truncate">
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <ArrowRight className="w-4 h-4 text-primary shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-surface-container-highest bg-surface-container-lowest text-[11px] font-caption text-secondary flex items-center justify-between">
          <span>{t.palette.shortcutsHint}</span>
          <span className="font-mono text-[10px] text-outline">NEST OS</span>
        </div>
      </div>
    </div>
  );
};
