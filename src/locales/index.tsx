import React, { createContext, useContext, useState, useEffect } from 'react';
import { en } from './en';
import { ru } from './ru';
import { AppLanguage } from '../types/user';

type TranslationType = typeof en;

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: TranslationType;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('nest_language') as AppLanguage;
    return saved === 'ru' || saved === 'en' ? saved : 'ru'; // Russian default or saved
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('nest_language', lang);
  };

  const t = language === 'ru' ? (ru as unknown as TranslationType) : en;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
