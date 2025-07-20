import React from 'react';
import { Movie } from '../lib/types';
import { MovieCard } from './movie-card';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';

interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
  title?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  onAddToFavorites?: (movie: Movie) => void;
  favoriteMovieIds?: Set<number>;
  keyPrefix?: string;
}

export function MovieGrid({
  movies,
  loading = false,
  title,
  onLoadMore,
  hasMore = false,
  onAddToFavorites,
  favoriteMovieIds = new Set(),
  keyPrefix = 'movie',
}: MovieGridProps) {
  if (movies.length === 0 && !loading) {
    return (
      <div className="text-center py-8 sm:py-12">
        <h3 className="text-base sm:text-lg font-medium text-muted-foreground mb-2">No movies found</h3>
        <p className="text-xs sm:text-sm text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {title && (
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight px-4 sm:px-0">{title}</h2>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-0">
        {movies.map((movie, index) => (
          <MovieCard
            key={`${keyPrefix}-${movie.id}-${index}`}
            movie={movie}
            onAddToFavorites={onAddToFavorites}
            isFavorite={favoriteMovieIds.has(movie.id)}
          />
        ))}
      </div>

      {/* Loading indicators */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-0">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[2/3] bg-muted rounded-lg mb-2 sm:mb-4"></div>
              <div className="space-y-1 sm:space-y-2">
                <div className="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
                <div className="h-2 sm:h-3 bg-muted rounded w-1/2"></div>
                <div className="h-2 sm:h-3 bg-muted rounded w-full"></div>
                <div className="h-2 sm:h-3 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {onLoadMore && hasMore && !loading && (
        <div className="flex justify-center pt-6 sm:pt-8 px-4 sm:px-0">
          <Button onClick={onLoadMore} variant="outline" size="lg" className="w-full sm:w-auto">
            Load More Movies
          </Button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loading && movies.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading more movies...
          </div>
        </div>
      )}
    </div>
  );
}
