import React, { useState, useEffect, useCallback } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useAppDispatch, useAppSelector } from '../hooks/useRedux';
import { searchMovies, discoverMovies, setSearchQuery, setFilters, clearSearchResults, fetchGenres } from '../store/movieSlice';
import { MovieFilters } from '../lib/types';

interface MovieSearchProps {
  onSearch?: (query: string) => void;
}

export function MovieSearch({ onSearch }: MovieSearchProps) {
  const dispatch = useAppDispatch();
  const { searchQuery, filters, genres } = useAppSelector((state) => state.movies);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [localFilters, setLocalFilters] = useState<MovieFilters>(filters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Load genres on component mount
  useEffect(() => {
    if (genres.length === 0) {
      dispatch(fetchGenres());
    }
  }, [dispatch, genres.length]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localQuery.trim()) {
        dispatch(setSearchQuery(localQuery));
        dispatch(searchMovies({ query: localQuery, page: 1 }));
        onSearch?.(localQuery);
      } else if (searchQuery) {
        dispatch(clearSearchResults());
        dispatch(setSearchQuery(''));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localQuery, dispatch, onSearch, searchQuery]);

  const handleFilterChange = useCallback((newFilters: Partial<MovieFilters>) => {
    const updatedFilters = { ...localFilters, ...newFilters };
    setLocalFilters(updatedFilters);
    dispatch(setFilters(updatedFilters));
  }, [localFilters, dispatch]);

  const applyFilters = () => {
    if (localFilters.genres.length > 0 || localFilters.year || localFilters.sortBy !== 'popularity.desc') {
      dispatch(discoverMovies({ filters: localFilters, page: 1 }));
    }
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    const defaultFilters: MovieFilters = {
      genres: [],
      sortBy: 'popularity.desc',
    };
    setLocalFilters(defaultFilters);
    dispatch(setFilters(defaultFilters));
    dispatch(clearSearchResults());
  };

  const handleGenreToggle = (genreId: number, checked: boolean) => {
    const newGenres = checked
      ? [...localFilters.genres, genreId]
      : localFilters.genres.filter(id => id !== genreId);
    handleFilterChange({ genres: newGenres });
  };

  const hasActiveFilters = localFilters.genres.length > 0 || 
                          localFilters.year || 
                          localFilters.sortBy !== 'popularity.desc';

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          type="text"
          placeholder="Search for movies..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {localQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => {
              setLocalQuery('');
              dispatch(clearSearchResults());
              dispatch(setSearchQuery(''));
            }}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                  {localFilters.genres.length + (localFilters.year ? 1 : 0)}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filters</h4>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Sort By</Label>
                <Select
                  value={localFilters.sortBy}
                  onValueChange={(value) => handleFilterChange({ sortBy: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity.desc">Most Popular</SelectItem>
                    <SelectItem value="vote_average.desc">Highest Rated</SelectItem>
                    <SelectItem value="release_date.desc">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Release Year</Label>
                <Input
                  type="number"
                  placeholder="e.g., 2024"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={localFilters.year || ''}
                  onChange={(e) => handleFilterChange({ 
                    year: e.target.value ? parseInt(e.target.value) : undefined 
                  })}
                />
              </div>

              {/* Genres */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Genres</Label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {genres.map((genre) => (
                    <div key={genre.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`genre-${genre.id}`}
                        checked={localFilters.genres.includes(genre.id)}
                        onCheckedChange={(checked) => 
                          handleGenreToggle(genre.id, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`genre-${genre.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {genre.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={applyFilters} className="flex-1">
                  Apply Filters
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Active Genre Filters */}
        {localFilters.genres.map((genreId) => {
          const genre = genres.find(g => g.id === genreId);
          return genre ? (
            <Badge
              key={genreId}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {genre.name}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleGenreToggle(genreId, false)}
              />
            </Badge>
          ) : null;
        })}

        {/* Year Filter */}
        {localFilters.year && (
          <Badge variant="secondary" className="flex items-center gap-1">
            {localFilters.year}
            <X
              className="w-3 h-3 cursor-pointer"
              onClick={() => handleFilterChange({ year: undefined })}
            />
          </Badge>
        )}
      </div>
    </div>
  );
}
