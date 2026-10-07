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

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    return (localStorage.getItem('nest_theme') as AppTheme) || 'system';
  });

  const [atmosphere, setAtmosphereState] = useState<AtmosphereType>(() => {
    return (localStorage.getItem('nest_atmosphere') as AtmosphereType) || 'Clouds';
  });

  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      let activeIsDark = false;
      if (theme === 'system') {
        activeIsDark = mediaQuery.matches;
      } else {
        activeIsDark = theme === 'dark';
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
  }, [theme]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('nest_theme', newTheme);
  };

  const setAtmosphere = (newAtmosphere: AtmosphereType) => {
    setAtmosphereState(newAtmosphere);
    localStorage.setItem('nest_atmosphere', newAtmosphere);
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
