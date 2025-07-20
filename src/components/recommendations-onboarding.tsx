"use client";

import React from 'react';
import { useFavorites } from '@/contexts/favorites-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, TrendingUp, ArrowRight } from 'lucide-react';

export const RecommendationsOnboarding: React.FC = () => {
  const { favorites, favoriteNews, movieRecommendations, newsRecommendations } = useFavorites();

  const totalFavorites = favorites.length + favoriteNews.length;
  const totalRecommendations = movieRecommendations.length + newsRecommendations.length;

  // Don't show if user already has recommendations
  if (totalRecommendations > 0) {
    return null;
  }

  // Don't show if user has no favorites but has been using the app
  if (totalFavorites === 0) {
    return (
      <Card className="w-full border-dashed border-2 border-muted">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <Heart className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Get Personalized Recommendations</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            Start liking movies and articles to get AI-powered recommendations tailored just for you!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => window.location.href = '/movies'}
              className="flex items-center gap-2"
            >
              Browse Movies
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => window.location.href = '/test-recommendations'}
              variant="outline"
              className="flex items-center gap-2"
            >
              Try Demo
              <TrendingUp className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show if user has favorites but no recommendations yet
  return (
    <Card className="w-full bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Recommendations Loading
          <Badge variant="secondary" className="ml-auto">
            {totalFavorites} favorites
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Great! You have {favorites.length} favorite movies and {favoriteNews.length} saved articles. 
            Your personalized recommendations are being generated and will appear here soon.
          </p>
          <div className="flex flex-wrap gap-2">
            {favorites.length > 0 && (
              <Badge variant="outline" className="text-xs">
                📱 {favorites.length} movies saved
              </Badge>
            )}
            {favoriteNews.length > 0 && (
              <Badge variant="outline" className="text-xs">
                📰 {favoriteNews.length} articles saved
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => window.location.href = '/favorites'}
              variant="outline"
              size="sm"
            >
              View Favorites
            </Button>
            <Button
              onClick={() => window.location.href = '/test-recommendations'}
              variant="outline"
              size="sm"
            >
              Add More Content
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
