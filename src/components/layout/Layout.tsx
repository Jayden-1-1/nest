import React, { useState, useEffect } from 'react';
import { AppHeader } from './AppHeader';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { AtmosphereBackdrop } from '../common/AtmosphereBackdrop';
import { CommandPalette } from '../common/CommandPalette';
import { IosInstallBanner } from '../pwa/IosInstallPrompt';
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
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen w-full relative flex flex-col bg-transparent text-on-surface antialiased transition-colors selection:bg-primary/20 selection:text-primary">
      
      {/* Dynamic 60 FPS Atmospheric Backdrop */}
      <AtmosphereBackdrop atmosphere={atmosphere} />

      {/* Top Header */}
      <AppHeader
        onNavigate={onNavigate}
        onOpenCreateHome={onOpenCreateHome}
        onOpenJoinHome={onOpenJoinHome}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
      />

      {/* Desktop Editorial Sidebar */}
      <div className="hidden md:block relative z-20">
        <Sidebar currentRoute={currentRoute} onNavigate={onNavigate} />
      </div>

      {/* Main Content Area */}
      <div className="w-full pt-[calc(4rem+env(safe-area-inset-top,0px))] md:pl-64 flex-1 flex flex-col relative z-10">
        <main className="w-full flex-1 px-margin-mobile sm:px-margin-tablet lg:px-margin py-space-lg sm:py-space-xl pb-[calc(6rem+env(safe-area-inset-bottom,0px))] md:pb-16 max-w-7xl mx-auto">
          {children}
        </main>
      </div>

      {/* iPhone Mobile Bottom Navigation */}
      <MobileBottomNav currentRoute={currentRoute} onNavigate={onNavigate} />

      {/* iOS iPhone Web App Install Prompt Banner */}
      <IosInstallBanner />

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={onNavigate}
        onOpenCreateHome={onOpenCreateHome}
        onOpenJoinHome={onOpenJoinHome}
      />

    </div>
  );
};

