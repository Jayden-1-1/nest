import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppTheme } from '../types/user';
import { AtmosphereType } from '../types/home';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  atmosphere: AtmosphereType;
  setAtmosphere: (atmosphere: AtmosphereType) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const isDarkAtmosphere = (atmo: AtmosphereType) => atmo !== 'Clouds';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [atmosphere, setAtmosphereState] = useState<AtmosphereType>(() => {
    return (localStorage.getItem('nest_atmosphere') as AtmosphereType) || 'Midnight';
  });

  const [theme, setThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('nest_theme') as AppTheme;
    if (saved) return saved;
    return 'dark'; // Default to dark for Midnight atmosphere
  });

  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      let activeIsDark = true;
      const atmoIsDark = isDarkAtmosphere(atmosphere);

      if (theme === 'dark') {
        activeIsDark = true;
      } else if (theme === 'light') {
        // If atmosphere is Midnight/Ocean/Sunset/Aurora, the canvas is dark,
        // so we must enforce dark typography contrast so text is clearly visible on the background
        activeIsDark = atmoIsDark ? true : false;
      } else {
        // system
        activeIsDark = atmoIsDark || mediaQuery.matches;
      }

      setIsDark(activeIsDark);
      if (activeIsDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme, atmosphere]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('nest_theme', newTheme);
  };

  const setAtmosphere = (newAtmosphere: AtmosphereType) => {
    setAtmosphereState(newAtmosphere);
    localStorage.setItem('nest_atmosphere', newAtmosphere);

    // Automatically align theme with atmosphere so text contrast is never lost
    if (newAtmosphere === 'Clouds') {
      setThemeState('light');
      localStorage.setItem('nest_theme', 'light');
    } else {
      setThemeState('dark');
      localStorage.setItem('nest_theme', 'dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, atmosphere, setAtmosphere, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
