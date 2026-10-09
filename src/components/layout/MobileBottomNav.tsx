import React from 'react';
import { useTranslation } from '../../locales';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  User 
} from 'lucide-react';

interface MobileBottomNavProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentRoute, onNavigate }) => {
  const { t } = useTranslation();

  const tabs = [
    { id: 'home', label: t.nav.home, icon: LayoutDashboard },
    { id: 'tasks', label: t.nav.tasks, icon: CheckSquare },
    { id: 'calendar', label: t.nav.calendar, icon: CalendarIcon },
    { id: 'progress', label: t.nav.progress, icon: TrendingUp },
    { id: 'profile', label: t.nav.profile, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-surface/90 backdrop-blur-xl border-t border-surface-container-highest md:hidden select-none transition-colors">
      <div className="flex items-center justify-around h-16 px-space-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentRoute === tab.id;

          return (
            <button
              key={tab.id}
              data-tutorial-target={`nav-${tab.id}`}
              onClick={() => onNavigate(tab.id)}
              className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 transition-all duration-150 active:scale-90 select-none ${
                isActive ? 'text-primary' : 'text-secondary hover:text-on-surface'
              }`}
            >
              <Icon className="w-5 h-5 leading-none transition-transform" />
              <span className="font-label-caps text-[10px] mt-1 tracking-wider uppercase font-semibold">
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-[2.5px] rounded-full bg-primary transition-all" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
