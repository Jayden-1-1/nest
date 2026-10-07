import React from 'react';
import { AppHeader } from './AppHeader';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { AtmosphereBackdrop } from '../common/AtmosphereBackdrop';
import { useTheme } from '../../context/ThemeContext';

interface LayoutProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  onOpenCreateHome: () => void;
  onOpenJoinHome: () => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  currentRoute,
  onNavigate,
  onOpenCreateHome,
  onOpenJoinHome,
  children,
}) => {
  const { atmosphere } = useTheme();

  return (
    <div className="min-h-screen w-full relative flex flex-col bg-background text-on-surface antialiased transition-colors">
      
      {/* Subtle Environmental Backdrop */}
      <AtmosphereBackdrop atmosphere={atmosphere} />

      {/* Top Header */}
      <AppHeader
        onNavigate={onNavigate}
        onOpenCreateHome={onOpenCreateHome}
        onOpenJoinHome={onOpenJoinHome}
      />

      {/* Desktop Editorial Sidebar */}
      <div className="hidden md:block">
        <Sidebar currentRoute={currentRoute} onNavigate={onNavigate} />
      </div>

      {/* Main Content Area */}
      <div className="w-full pt-16 md:pl-64 flex-1 flex flex-col">
        <main className="w-full flex-1 px-margin-mobile sm:px-margin-tablet lg:px-margin py-space-lg sm:py-space-xl pb-24 md:pb-16 max-w-7xl mx-auto">
          {children}
        </main>
      </div>

      {/* iPhone Mobile Bottom Navigation */}
      <MobileBottomNav currentRoute={currentRoute} onNavigate={onNavigate} />

    </div>
  );
};
