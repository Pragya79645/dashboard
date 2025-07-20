'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Film, TrendingUp, Calendar, Star } from 'lucide-react';
import { Movie } from '../lib/types';
import { useFavorites } from '../contexts/favorites-context';
import { toast } from '../hooks/use-toast';

export function MoviesPage() {
  const dispatch = useAppDispatch();
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
  } = useAppSelector((state) => state.movies);

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const [activeTab, setActiveTab] = useState('popular');

  // Create a Set of favorite movie IDs for quick lookup
  const favoriteMovieIds = new Set(favorites.map((movie: Movie) => movie.id));

  // Load initial data
  useEffect(() => {
    dispatch(fetchPopularMovies(1));
    dispatch(fetchTrendingMovies(1));
    dispatch(fetchUpcomingMovies(1));
    dispatch(fetchTopRatedMovies(1));
  }, [dispatch]);

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
    }
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive mb-2">Error Loading Movies</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Movie Explorer</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover popular, trending, and upcoming movies. Search by title and filter by your preferences.
        </p>
      </div>

      {/* Search */}
      <MovieSearch onSearch={handleSearch} />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="popular" className="flex items-center gap-2">
            <Film className="w-4 h-4" />
            Popular
            <Badge variant="secondary">{popular.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Trending
            <Badge variant="secondary">{trending.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Upcoming
            <Badge variant="secondary">{upcoming.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="top-rated" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Top Rated
            <Badge variant="secondary">{topRated.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            Search Results
            {searchQuery && <Badge variant="secondary">{searchResults.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="popular" className="mt-8">
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

        <TabsContent value="trending" className="mt-8">
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

        <TabsContent value="upcoming" className="mt-8">
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

        <TabsContent value="top-rated" className="mt-8">
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

        <TabsContent value="search" className="mt-8">
          {searchQuery ? (
            <MovieGrid
              movies={searchResults}
              loading={loading}
              title={`Search Results for "${searchQuery}"`}
              onLoadMore={() => {
                // Handle search pagination if needed
              }}
              hasMore={false}
              onAddToFavorites={handleAddToFavorites}
              favoriteMovieIds={favoriteMovieIds}
              keyPrefix="search"
            />
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No search query</h3>
              <p className="text-sm text-muted-foreground">Enter a movie title to search</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
