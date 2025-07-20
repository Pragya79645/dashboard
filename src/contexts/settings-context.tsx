
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { ContentCategory } from '@/lib/types';

export type Settings = Record<ContentCategory, boolean>;

const defaultSettings: Settings = {
  tech: true,
  finance: true,
  sports: true,
};

interface SettingsContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  toggleSetting: (category: ContentCategory) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<Settings>('content-settings', defaultSettings);

  const toggleSetting = (category: ContentCategory) => {
    setSettings({
      ...settings,
      [category]: !settings[category],
    });
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, toggleSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
