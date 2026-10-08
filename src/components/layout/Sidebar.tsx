import React from 'react';
import { useTranslation } from '../../locales';
import { useTasks } from '../../context/TaskContext';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  History, 
  Users, 
  Settings as SettingsIcon 
} from 'lucide-react';

import { formatLocalDate } from '../../utils/date';

interface SidebarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRoute, onNavigate }) => {
  const { t } = useTranslation();
  const { tasks } = useTasks();

  const todayStr = formatLocalDate(new Date());
  const pendingCount = tasks.filter((t) => t.date === todayStr && t.status !== 'DONE').length;

  const navItems = [
    { id: 'home', label: t.nav.home, icon: LayoutDashboard },
    { id: 'tasks', label: t.nav.tasks, icon: CheckSquare, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: 'calendar', label: t.nav.calendar, icon: CalendarIcon },
    { id: 'progress', label: t.nav.progress, icon: TrendingUp },
    { id: 'activity', label: t.nav.activity, icon: History },
    { id: 'members', label: t.nav.members, icon: Users },
    { id: 'settings', label: t.nav.settings, icon: SettingsIcon },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-surface/75 dark:bg-surface/70 backdrop-blur-xl border-r border-surface-container-highest/60 z-40 flex flex-col justify-between py-space-lg px-space-md select-none transition-colors">
      <div className="flex flex-col gap-space-xl">
        <div className="px-space-sm">
          <span className="font-label-caps text-label-caps text-secondary uppercase tracking-widest block">
            Navigation
          </span>
        </div>

        <nav className="flex flex-col gap-space-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative flex items-center justify-between px-space-sm py-2.5 rounded-lg transition-colors font-body-sm text-body-sm uppercase tracking-wider text-left ${
                  isActive
                    ? 'bg-surface-container-high text-on-surface font-semibold shadow-sm'
                    : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
                }`}
              >
                <div className="flex items-center gap-space-sm">
                  <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-primary' : 'text-secondary'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-fixed text-primary font-mono">
                    {item.badge < 10 ? `0${item.badge}` : item.badge}
                  </span>
                )}

                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Footer Metadata */}
      <div className="border-t border-surface-container-highest pt-space-md px-space-sm flex flex-col gap-space-xs">
        <div className="flex items-center justify-between text-secondary font-caption text-caption">
          <span className="font-label-caps text-label-caps uppercase font-semibold">System</span>
          <span className="font-mono text-[11px] text-primary font-bold">v2.9.0-CANONICAL</span>
        </div>
        <div className="font-caption text-caption text-secondary/70">
          Editorial Architectural OS
        </div>
      </div>
    </aside>
  );
};
