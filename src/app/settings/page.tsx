
"use client";

import { useSettings } from "@/contexts/settings-context";
import type { NewsCategory, MovieGenreCategory } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BrainCircuit, 
  Landmark, 
  BarChart, 
  Building2, 
  Film, 
  Heart, 
  Microscope, 
  Globe,
  Zap,
  Map,
  Palette,
  Smile,
  Shield,
  FileText,
  Users,
  Sparkles,
  Clock,
  Skull,
  Music,
  Search,
  BookHeart,
  Rocket,
  Tv,
  Target,
  Swords,
  Compass
} from "lucide-react";

const newsCategories: Record<NewsCategory, { label: string; description: string; icon: React.ElementType }> = {
  technology: { label: "Technology", description: "Latest tech news, gadgets, and innovation.", icon: BrainCircuit },
  science: { label: "Science", description: "Scientific discoveries and research.", icon: Microscope },
  business: { label: "Business", description: "Corporate news and market insights.", icon: Building2 },
  health: { label: "Health", description: "Medical news and wellness tips.", icon: Heart },
  sports: { label: "Sports", description: "Sports news, scores, and highlights.", icon: BarChart },
  entertainment: { label: "Entertainment", description: "Movies, TV shows, and celebrity news.", icon: Film },
  general: { label: "General", description: "General news and current events.", icon: Globe },
};

const movieGenres: Record<MovieGenreCategory, { label: string; description: string; icon: React.ElementType }> = {
  action: { label: "Action", description: "High-energy action and adventure films.", icon: Zap },
  adventure: { label: "Adventure", description: "Epic journeys and exploration stories.", icon: Map },
  animation: { label: "Animation", description: "Animated movies for all ages.", icon: Palette },
  comedy: { label: "Comedy", description: "Funny and lighthearted films.", icon: Smile },
  crime: { label: "Crime", description: "Crime thrillers and detective stories.", icon: Shield },
  documentary: { label: "Documentary", description: "Real-life stories and factual content.", icon: FileText },
  drama: { label: "Drama", description: "Character-driven dramatic narratives.", icon: Users },
  family: { label: "Family", description: "Movies suitable for the whole family.", icon: Heart },
  fantasy: { label: "Fantasy", description: "Magical and fantastical adventures.", icon: Sparkles },
  history: { label: "History", description: "Historical dramas and period pieces.", icon: Clock },
  horror: { label: "Horror", description: "Scary and suspenseful horror films.", icon: Skull },
  music: { label: "Music", description: "Musical films and biographical stories.", icon: Music },
  mystery: { label: "Mystery", description: "Mysterious and puzzle-solving stories.", icon: Search },
  romance: { label: "Romance", description: "Romantic comedies and love stories.", icon: BookHeart },
  science_fiction: { label: "Science Fiction", description: "Futuristic and sci-fi adventures.", icon: Rocket },
  tv_movie: { label: "TV Movie", description: "Made-for-television movies.", icon: Tv },
  thriller: { label: "Thriller", description: "Suspenseful and edge-of-seat thrillers.", icon: Target },
  war: { label: "War", description: "War dramas and military stories.", icon: Swords },
  western: { label: "Western", description: "Classic western and frontier stories.", icon: Compass },
};

export default function SettingsPage() {
  const { settings, toggleNewsSetting, toggleMovieSetting } = useSettings();
  
  const enabledNewsCount = Object.values(settings.news).filter(Boolean).length;
  const enabledMovieCount = Object.values(settings.movies).filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6 px-4 sm:px-0">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Content Preferences</h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
          Customize your content experience by selecting your preferred categories for news and movies.
        </p>
      </div>

      <Tabs defaultValue="news" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="news" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>News Preferences</span>
            <Badge variant="secondary" className="text-xs">{enabledNewsCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="movies" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Film className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Movie Preferences</span>
            <Badge variant="secondary" className="text-xs">{enabledMovieCount}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="mt-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                News Categories
              </CardTitle>
              <CardDescription className="text-sm">
                Choose the types of news you want to see on your dashboard. 
                Your preferences will personalize your news feed with live articles from News API.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="text-xs sm:text-sm text-muted-foreground">
                {enabledNewsCount} of {Object.keys(settings.news).length} categories enabled
              </div>
              
              <div className="grid gap-3 sm:gap-4">
                {(Object.keys(settings.news) as NewsCategory[]).map((key) => {
                  const { label, description, icon: Icon } = newsCategories[key];
                  return (
                    <div key={key} className="flex items-center justify-between p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Label htmlFor={`news-${key}`} className="text-sm sm:text-base font-medium cursor-pointer block">
                            {label}
                          </Label>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{description}</p>
                        </div>
                      </div>
                      <Switch
                        id={`news-${key}`}
                        checked={settings.news[key]}
                        onCheckedChange={() => toggleNewsSetting(key)}
                        className="ml-2"
                      />
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> Enable multiple categories to get a diverse mix of news articles. 
                  Your feed updates automatically with fresh content.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movies" className="mt-6">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Film className="w-4 h-4 sm:w-5 sm:h-5" />
                Movie Genres
              </CardTitle>
              <CardDescription className="text-sm">
                Select your favorite movie genres to get personalized recommendations and discover new films you'll love.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="text-xs sm:text-sm text-muted-foreground">
                {enabledMovieCount} of {Object.keys(settings.movies).length} genres enabled
              </div>
              
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                {(Object.keys(settings.movies) as MovieGenreCategory[]).map((key) => {
                  const { label, description, icon: Icon } = movieGenres[key];
                  return (
                    <div key={key} className="flex items-center justify-between p-3 sm:p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                      <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Label htmlFor={`movie-${key}`} className="text-xs sm:text-sm font-medium cursor-pointer block">
                            {label}
                          </Label>
                          <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
                        </div>
                      </div>
                      <Switch
                        id={`movie-${key}`}
                        checked={settings.movies[key]}
                        onCheckedChange={() => toggleMovieSetting(key)}
                        className="ml-2"
                      />
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-muted/50 p-3 sm:p-4 rounded-lg">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  🎬 <strong>Tip:</strong> Your genre preferences will help us recommend movies that match your taste. 
                  You can always change these settings later.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
