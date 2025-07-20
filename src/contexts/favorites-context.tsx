"use client";

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import { Movie, ContentItem, MovieRecommendation, NewsRecommendation } from '../lib/types';
import { recommendationsApi } from '../services/recommendationsApi';

interface FavoritesContextType {
  favorites: Movie[];
  favoriteNews: ContentItem[];
  movieRecommendations: MovieRecommendation[];
  newsRecommendations: NewsRecommendation[];
  addToFavorites: (movie: Movie) => Promise<void>;
  removeFromFavorites: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  addFavorite: (item: ContentItem) => Promise<void>;
  removeFavorite: (itemId: string) => void;
  isFavoriteNews: (itemId: string) => boolean;
  getRecommendationsForMovie: (movieId: number) => MovieRecommendation | undefined;
  getRecommendationsForNews: (articleId: string) => NewsRecommendation | undefined;
  clearOldRecommendations: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useLocalStorage<Movie[]>('movie-favorites', []);
  const [favoriteNews, setFavoriteNews] = useLocalStorage<ContentItem[]>('news-favorites', []);
  const [movieRecommendations, setMovieRecommendations] = useLocalStorage<MovieRecommendation[]>('movie-recommendations', []);
  const [newsRecommendations, setNewsRecommendations] = useLocalStorage<NewsRecommendation[]>('news-recommendations', []);

  const addToFavorites = useCallback(async (movie: Movie) => {
    if (!favorites.some(fav => fav.id === movie.id)) {
      setFavorites([...favorites, movie]);
      
      // Get recommendations for this movie
      try {
        const recommendations = await recommendationsApi.getMovieRecommendations(movie);
        if (recommendations.movies.length > 0) {
          // Remove any existing recommendations for this movie
          const filtered = movieRecommendations.filter(rec => rec.basedOnMovieId !== movie.id);
          setMovieRecommendations([...filtered, recommendations]);
        }
      } catch (error) {
        console.error('Failed to fetch movie recommendations:', error);
      }
    }
  }, [favorites, movieRecommendations, setFavorites, setMovieRecommendations]);

  const removeFromFavorites = useCallback((movieId: number) => {
    setFavorites(favorites.filter(movie => movie.id !== movieId));
    // Optionally remove recommendations for this movie
    setMovieRecommendations(movieRecommendations.filter(rec => rec.basedOnMovieId !== movieId));
  }, [favorites, movieRecommendations, setFavorites, setMovieRecommendations]);

  const isFavorite = useCallback((movieId: number) => {
    return favorites.some(movie => movie.id === movieId);
  }, [favorites]);

  const addFavorite = useCallback(async (item: ContentItem) => {
    if (!favoriteNews.some(fav => fav.id === item.id)) {
      setFavoriteNews([...favoriteNews, item]);
      console.log('Added news article to favorites:', item.title);
      
      // Get recommendations for this news article
      try {
        console.log('Fetching recommendations for news article:', item.title);
        const recommendations = await recommendationsApi.getNewsRecommendations(item);
        console.log('Received recommendations:', recommendations);
        
        // Always add the recommendation record, even if it has no articles
        // Remove any existing recommendations for this article
        const filtered = newsRecommendations.filter(rec => rec.basedOnArticleId !== item.id);
        setNewsRecommendations([...filtered, recommendations]);
        console.log('Updated news recommendations, total count:', filtered.length + 1);
      } catch (error) {
        console.error('Failed to fetch news recommendations:', error);
        
        // Create a basic recommendation record even on error
        const basicRecommendation = {
          id: `news-rec-${item.id}-${Date.now()}`,
          articles: [],
          basedOnArticleId: item.id,
          basedOnArticleTitle: item.title,
          basedOnCategory: item.category,
          createdAt: new Date().toISOString(),
        };
        
        const filtered = newsRecommendations.filter(rec => rec.basedOnArticleId !== item.id);
        setNewsRecommendations([...filtered, basicRecommendation]);
      }
    }
  }, [favoriteNews, newsRecommendations, setFavoriteNews, setNewsRecommendations]);

  const removeFavorite = useCallback((itemId: string) => {
    setFavoriteNews(favoriteNews.filter(item => item.id !== itemId));
    // Optionally remove recommendations for this article
    setNewsRecommendations(newsRecommendations.filter(rec => rec.basedOnArticleId !== itemId));
  }, [favoriteNews, newsRecommendations, setFavoriteNews, setNewsRecommendations]);

  const isFavoriteNews = useCallback((itemId: string) => {
    return favoriteNews.some(item => item.id === itemId);
  }, [favoriteNews]);

  const getRecommendationsForMovie = useCallback((movieId: number): MovieRecommendation | undefined => {
    return movieRecommendations.find(rec => rec.basedOnMovieId === movieId);
  }, [movieRecommendations]);

  const getRecommendationsForNews = useCallback((articleId: string): NewsRecommendation | undefined => {
    return newsRecommendations.find(rec => rec.basedOnArticleId === articleId);
  }, [newsRecommendations]);

  const clearOldRecommendations = useCallback(() => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    // Only update if there are actually old recommendations to remove
    const oldMovieRecs = movieRecommendations.filter(rec => new Date(rec.createdAt) <= oneWeekAgo);
    const oldNewsRecs = newsRecommendations.filter(rec => new Date(rec.createdAt) <= oneWeekAgo);
    
    if (oldMovieRecs.length > 0) {
      const filteredMovieRecs = movieRecommendations.filter(rec => new Date(rec.createdAt) > oneWeekAgo);
      setMovieRecommendations(filteredMovieRecs);
    }
    
    if (oldNewsRecs.length > 0) {
      const filteredNewsRecs = newsRecommendations.filter(rec => new Date(rec.createdAt) > oneWeekAgo);
      setNewsRecommendations(filteredNewsRecs);
    }
  }, [movieRecommendations, newsRecommendations, setMovieRecommendations, setNewsRecommendations]);

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      favoriteNews,
      movieRecommendations,
      newsRecommendations,
      addToFavorites, 
      removeFromFavorites, 
      isFavorite,
      addFavorite,
      removeFavorite,
      isFavoriteNews,
      getRecommendationsForMovie,
      getRecommendationsForNews,
      clearOldRecommendations
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
