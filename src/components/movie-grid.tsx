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
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-muted-foreground mb-2">No movies found</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && (
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[2/3] bg-muted rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-full"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {onLoadMore && hasMore && !loading && (
        <div className="flex justify-center pt-8">
          <Button onClick={onLoadMore} variant="outline" size="lg">
            Load More Movies
          </Button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loading && movies.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading more movies...
          </div>
        </div>
      )}
    </div>
  );
}
