"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { Movie, ContentItem } from '../lib/types';

interface FavoritesContextType {
  favorites: Movie[];
  favoriteNews: ContentItem[];
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  addFavorite: (item: ContentItem) => void;
  removeFavorite: (itemId: string) => void;
  isFavoriteNews: (itemId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useLocalStorage<Movie[]>('movie-favorites', []);
  const [favoriteNews, setFavoriteNews] = useLocalStorage<ContentItem[]>('news-favorites', []);

  const addToFavorites = (movie: Movie) => {
    if (!favorites.some(fav => fav.id === movie.id)) {
      setFavorites([...favorites, movie]);
    }
  };

  const removeFromFavorites = (movieId: number) => {
    setFavorites(favorites.filter(movie => movie.id !== movieId));
  };

  const isFavorite = (movieId: number) => {
    return favorites.some(movie => movie.id === movieId);
  };

  const addFavorite = (item: ContentItem) => {
    if (!favoriteNews.some(fav => fav.id === item.id)) {
      setFavoriteNews([...favoriteNews, item]);
    }
  };

  const removeFavorite = (itemId: string) => {
    setFavoriteNews(favoriteNews.filter(item => item.id !== itemId));
  };

  const isFavoriteNews = (itemId: string) => {
    return favoriteNews.some(item => item.id === itemId);
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      favoriteNews,
      addToFavorites, 
      removeFromFavorites, 
      isFavorite,
      addFavorite,
      removeFavorite,
      isFavoriteNews
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
