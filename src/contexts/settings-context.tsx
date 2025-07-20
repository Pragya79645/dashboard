
"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { ContentCategory, NewsCategory, MovieGenreCategory } from '@/lib/types';

export type NewsSettings = Record<NewsCategory, boolean>;
export type MovieSettings = Record<MovieGenreCategory, boolean>;

export interface Settings {
  news: NewsSettings;
  movies: MovieSettings;
  // Legacy support for existing content categories
  content: Record<ContentCategory, boolean>;
}

const defaultNewsSettings: NewsSettings = {
  technology: true,
  science: true,
  business: true,
  health: false,
  sports: true,
  entertainment: false,
  general: false,
};

const defaultMovieSettings: MovieSettings = {
  action: true,
  adventure: true,
  animation: false,
  comedy: true,
  crime: false,
  documentary: false,
  drama: true,
  family: false,
  fantasy: false,
  history: false,
  horror: false,
  music: false,
  mystery: false,
  romance: false,
  science_fiction: true,
  tv_movie: false,
  thriller: false,
  war: false,
  western: false,
};

const defaultContentSettings: Record<ContentCategory, boolean> = {
  tech: true,
  finance: true,
  sports: true,
  business: false,
  entertainment: false,
  health: false,
  science: false,
  general: false,
};

const defaultSettings: Settings = {
  news: defaultNewsSettings,
  movies: defaultMovieSettings,
  content: defaultContentSettings,
};

interface SettingsContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  toggleNewsSetting: (category: NewsCategory) => void;
  toggleMovieSetting: (category: MovieGenreCategory) => void;
  toggleContentSetting: (category: ContentCategory) => void;
  // Legacy support
  toggleSetting: (category: ContentCategory) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<Settings>('user-preferences', defaultSettings);

  const toggleNewsSetting = (category: NewsCategory) => {
    setSettings({
      ...settings,
      news: {
        ...settings.news,
        [category]: !settings.news[category],
      },
    });
  };

  const toggleMovieSetting = (category: MovieGenreCategory) => {
    setSettings({
      ...settings,
      movies: {
        ...settings.movies,
        [category]: !settings.movies[category],
      },
    });
  };

  const toggleContentSetting = (category: ContentCategory) => {
    setSettings({
      ...settings,
      content: {
        ...settings.content,
        [category]: !settings.content[category],
      },
    });
  };

  // Legacy support for existing code
  const toggleSetting = (category: ContentCategory) => {
    toggleContentSetting(category);
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      setSettings, 
      toggleNewsSetting, 
      toggleMovieSetting, 
      toggleContentSetting,
      toggleSetting 
    }}>
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
