import React, { useState } from 'react';
import { Movie } from '../lib/types';
import { getImageUrl } from '../services/tmdbApi';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Star, Calendar, Heart } from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface MovieCardProps {
  movie: Movie;
  onAddToFavorites?: (movie: Movie) => void;
  isFavorite?: boolean;
}

export function MovieCard({ 
  movie, 
  onAddToFavorites, 
  isFavorite = false 
}: MovieCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 bg-card">
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={getImageUrl(movie.poster_path)}
          alt={movie.title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
            <div className="w-16 h-16 bg-muted-foreground/20 rounded"></div>
          </div>
        )}
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          {onAddToFavorites && (
            <Button
              size="sm"
              variant={isFavorite ? "destructive" : "secondary"}
              onClick={() => onAddToFavorites(movie)}
              className="flex items-center gap-1"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              {isFavorite ? 'Saved' : 'Save'}
            </Button>
          )}
        </div>

        {/* Rating badge */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="flex items-center gap-1 bg-black/70 text-white">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {movie.vote_average.toFixed(1)}
          </Badge>
        </div>
      </div>

      {/* Movie Info */}
      <CardHeader className="pb-2">
        <h3 className="font-semibold text-lg leading-tight line-clamp-2" title={movie.title}>
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {formatDate(movie.release_date)}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isExpanded ? movie.overview : truncateText(movie.overview, 120)}
        </p>
      </CardContent>

      <CardFooter className="pt-2 flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex-1">
              Read More
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{movie.title}</DialogTitle>
              <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(movie.release_date)}
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {movie.vote_average.toFixed(1)}
                </Badge>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w780')}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm leading-relaxed">{movie.overview}</p>
              <div className="flex gap-2">
                {onAddToFavorites && (
                  <Button
                    variant={isFavorite ? "destructive" : "outline"}
                    onClick={() => onAddToFavorites(movie)}
                    className="flex items-center gap-2"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
