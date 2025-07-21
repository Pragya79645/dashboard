'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import type { RootState } from '../store';
import type { MovieState } from '../lib/types';
import { 
  fetchPopularMovies, 
  fetchTrendingMovies, 
  fetchUpcomingMovies, 
  fetchTopRatedMovies,
  setCurrentPage 
} from '../store/movieSlice';
import { MovieGrid } from './movie-grid';
import { MovieSearch } from './movie-search';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Film, TrendingUp, Calendar, Star, Search, Clapperboard } from 'lucide-react';
import { Movie } from '../lib/types';
import { useFavorites } from '../contexts/favorites-context';
import { toast } from '../hooks/use-toast';

export function MoviesPage() {
  const dispatch = useAppDispatch();
  const moviesState = useAppSelector((state: RootState) => state.movies) as MovieState;
  const { 
    popular, 
    trending, 
    upcoming, 
    topRated, 
    searchResults, 
    loading, 
    error, 
    currentPage, 
    totalPages, 
    searchQuery 
  } = moviesState;

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const [activeTab, setActiveTab] = useState('popular');
  const [retryCount, setRetryCount] = useState(0);

  // Create a Set of favorite movie IDs for quick lookup
  const favoriteMovieIds = new Set(favorites.map((movie: Movie) => movie.id));

  // Function to load initial data with retry logic
  const loadInitialData = useCallback(() => {
    dispatch(fetchPopularMovies(1));
    dispatch(fetchTrendingMovies(1));
    dispatch(fetchUpcomingMovies(1));
    dispatch(fetchTopRatedMovies(1));
  }, [dispatch]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Auto-switch to search tab when there's a search query
  useEffect(() => {
    if (searchQuery && searchQuery.trim()) {
      setActiveTab('search');
    }
  }, [searchQuery]);

  // Retry function for when there are errors
  const handleRetry = useCallback(() => {
    setRetryCount(prev => prev + 1);
    loadInitialData();
  }, [loadInitialData]);

  const handleLoadMore = useCallback((category: string) => {
    const nextPage = currentPage + 1;
    dispatch(setCurrentPage(nextPage));

    switch (category) {
      case 'popular':
        dispatch(fetchPopularMovies(nextPage));
        break;
      case 'trending':
        dispatch(fetchTrendingMovies(nextPage));
        break;
      case 'upcoming':
        dispatch(fetchUpcomingMovies(nextPage));
        break;
      case 'top-rated':
        dispatch(fetchTopRatedMovies(nextPage));
        break;
    }
  }, [dispatch, currentPage]);

  const handleAddToFavorites = useCallback((movie: Movie) => {
    if (favoriteMovieIds.has(movie.id)) {
      removeFromFavorites(movie.id);
      toast({
        title: "Removed from favorites",
        description: `${movie.title} has been removed from your favorites.`,
      });
    } else {
      addToFavorites(movie);
      toast({
        title: "Added to favorites",
        description: `${movie.title} has been added to your favorites.`,
      });
    }
  }, [favoriteMovieIds, addToFavorites, removeFromFavorites]);

  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      setActiveTab('search');
      // The actual search is handled by the MovieSearch component through Redux
      // This ensures the search tab is activated when a search is performed
    }
  }, []);

  if (error) {
    const isNetworkError = error.includes('Request timed out') || 
                          error.includes('Network error') || 
                          error.includes('ERR_CONNECTION_TIMED_OUT');
    
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="flex flex-col items-center justify-center p-8 sm:p-12 space-y-6 border-4 border-border shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:shadow-[6px_6px_0px_0px_rgb(255,255,255)] bg-gradient-to-br from-red-50 via-background to-red-50 dark:from-red-950 dark:to-red-950">
          <div className="p-6 bg-red-500 text-white rounded-full border-4 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)]">
            <Film className="w-12 h-12 sm:w-16 sm:h-16" />
          </div>
          <div className="text-center space-y-3">
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wide text-destructive">
              {isNetworkError ? 'Connection Problem' : 'Error Loading Movies'}
            </h2>
            <p className="text-muted-foreground text-center text-sm sm:text-base max-w-md font-bold uppercase tracking-wide">{error}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleRetry}
              className="border-4 border-border font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] hover:shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transition-all bg-red-500 hover:bg-red-600 text-white"
            >
              {retryCount > 0 ? `🔄 Retry (${retryCount})` : '🔄 Try Again'}
            </Button>
            {isNetworkError && (
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
                className="border-4 border-border font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] hover:shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transition-all"
              >
                🔃 Refresh Page
              </Button>
            )}
          </div>
          {isNetworkError && (
            <Card className="p-4 border-2 border-border bg-muted/50">
              <div className="text-sm text-muted-foreground space-y-1 font-bold uppercase tracking-wide">
                <p>• Check your internet connection</p>
                <p>• The movie database might be temporarily unavailable</p>
                <p>• Try refreshing the page or waiting a moment</p>
              </div>
            </Card>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <Card className="p-8 border-4 border-border bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-950 dark:via-purple-950 dark:to-indigo-950 shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)] mx-4 sm:mx-0">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 text-white rounded-lg border-4 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)]">
                <Clapperboard className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-wider text-foreground uppercase leading-none">
                  Movie
                </h1>
                <h2 className="text-2xl font-bold tracking-wide text-blue-500 uppercase">
                  Explorer
                </h2>
              </div>
            </div>
            <p className="text-muted-foreground font-bold text-lg uppercase tracking-wide">
              Discover popular, trending & upcoming movies
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-500 text-white border-2 border-border font-bold uppercase tracking-wide">
                🎬 {popular.length + trending.length + upcoming.length + topRated.length} Movies Loaded
              </Badge>
            </div>
            {loading && popular.length === 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-bold uppercase tracking-wide">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                Loading Latest Movies...
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2">
              <Badge 
                variant="outline" 
                className="border-2 border-blue-500 text-blue-500 font-bold uppercase tracking-wide bg-background"
              >
                🔥 {popular.length} Popular
              </Badge>
              <Badge 
                variant="outline" 
                className="border-2 border-purple-500 text-purple-500 font-bold uppercase tracking-wide bg-background"
              >
                📈 {trending.length} Trending
              </Badge>
              <Badge 
                variant="outline" 
                className="border-2 border-indigo-500 text-indigo-500 font-bold uppercase tracking-wide bg-background"
              >
                🗓️ {upcoming.length} Upcoming
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Search Section */}
      <Card className="p-6 border-4 border-border bg-gradient-to-r from-background via-primary/5 to-background mx-4 sm:mx-0">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary text-primary-foreground rounded border-2 border-border">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-xl uppercase tracking-wide text-foreground">
              Search Movies
            </h3>
          </div>
          <MovieSearch onSearch={handleSearch} />
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-4 sm:px-0">
        <Card className="p-6 border-4 border-border bg-gradient-to-r from-background via-primary/5 to-background">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary text-primary-foreground rounded border-2 border-border">
                <Film className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-xl uppercase tracking-wide text-foreground">
                Browse Categories
              </h3>
            </div>
            <TabsList className="grid w-full grid-cols-5 border-4 border-border bg-muted shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] p-1 gap-1 h-auto">
              <TabsTrigger 
                value="popular" 
                className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-tight px-1 py-1 min-h-[2.5rem] data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:data-[state=active]:shadow-[2px_2px_0px_0px_rgb(255,255,255)]"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <Film className="w-3 h-3" />
                  <span>Pop</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="trending" 
                className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-tight px-1 py-1 min-h-[2.5rem] data-[state=active]:bg-purple-500 data-[state=active]:text-white data-[state=active]:shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:data-[state=active]:shadow-[2px_2px_0px_0px_rgb(255,255,255)]"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>Trend</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="upcoming" 
                className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-tight px-1 py-1 min-h-[2.5rem] data-[state=active]:bg-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:data-[state=active]:shadow-[2px_2px_0px_0px_rgb(255,255,255)]"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <Calendar className="w-3 h-3" />
                  <span>Soon</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="top-rated" 
                className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-tight px-1 py-1 min-h-[2.5rem] data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:data-[state=active]:shadow-[2px_2px_0px_0px_rgb(255,255,255)]"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <Star className="w-3 h-3" />
                  <span>Top</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="search" 
                className="flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-tight px-1 py-1 min-h-[2.5rem] data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:data-[state=active]:shadow-[2px_2px_0px_0px_rgb(255,255,255)]"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <Search className="w-3 h-3" />
                  <span>Find</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
        </Card>

        <TabsContent value="popular" className="mt-12 sm:mt-8">
          <MovieGrid
            movies={popular}
            loading={loading}
            title="Popular Movies"
            onLoadMore={() => handleLoadMore('popular')}
            hasMore={currentPage < totalPages}
            onAddToFavorites={handleAddToFavorites}
            favoriteMovieIds={favoriteMovieIds}
            keyPrefix="popular"
          />
        </TabsContent>

        <TabsContent value="trending" className="mt-12 sm:mt-8">
          <MovieGrid
            movies={trending}
            loading={loading}
            title="Trending Movies"
            onLoadMore={() => handleLoadMore('trending')}
            hasMore={currentPage < totalPages}
            onAddToFavorites={handleAddToFavorites}
            favoriteMovieIds={favoriteMovieIds}
            keyPrefix="trending"
          />
        </TabsContent>

        <TabsContent value="upcoming" className="mt-12 sm:mt-8">
          <MovieGrid
            movies={upcoming}
            loading={loading}
            title="Upcoming Movies"
            onLoadMore={() => handleLoadMore('upcoming')}
            hasMore={currentPage < totalPages}
            onAddToFavorites={handleAddToFavorites}
            favoriteMovieIds={favoriteMovieIds}
            keyPrefix="upcoming"
          />
        </TabsContent>

        <TabsContent value="top-rated" className="mt-12 sm:mt-8">
          <MovieGrid
            movies={topRated}
            loading={loading}
            title="Top Rated Movies"
            onLoadMore={() => handleLoadMore('top-rated')}
            hasMore={currentPage < totalPages}
            onAddToFavorites={handleAddToFavorites}
            favoriteMovieIds={favoriteMovieIds}
            keyPrefix="top-rated"
          />
        </TabsContent>

        <TabsContent value="search" className="mt-12 sm:mt-8">
          {searchQuery ? (
            <div className="space-y-4">
              <Card className="p-4 border-4 border-border bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 text-white rounded border-2 border-border">
                    <Search className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide text-foreground">
                    Search Results for "{searchQuery}"
                  </h2>
                  <Badge className="bg-green-500 text-white border-2 border-border font-bold">
                    {searchResults.length} Found
                  </Badge>
                </div>
              </Card>
              <MovieGrid
                movies={searchResults}
                loading={loading}
                title=""
                onLoadMore={() => {
                  // Handle search pagination if needed
                }}
                hasMore={false}
                onAddToFavorites={handleAddToFavorites}
                favoriteMovieIds={favoriteMovieIds}
                keyPrefix="search"
              />
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center p-8 sm:p-12 space-y-4 border-4 border-border shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:shadow-[6px_6px_0px_0px_rgb(255,255,255)] bg-gradient-to-br from-green-50 via-background to-green-50 dark:from-green-950 dark:to-green-950">
              <div className="p-4 bg-green-500 text-white rounded-full border-4 border-border shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgb(255,255,255)]">
                <Search className="w-12 h-12 sm:w-16 sm:h-16" />
              </div>
              <h3 className="text-lg sm:text-xl font-black uppercase tracking-wide">No Search Query</h3>
              <p className="text-muted-foreground text-center text-sm sm:text-base font-bold uppercase tracking-wide">
                Enter a movie title to search our database
              </p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
