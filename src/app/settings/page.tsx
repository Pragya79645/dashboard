
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
    <div className="max-w-6xl mx-auto space-y-8 px-4 sm:px-0">
      {/* Enhanced Header with Neobrutalist Design */}
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase bg-primary text-primary-foreground px-8 py-4 border-4 border-border shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)] transform -rotate-1">
            Content Preferences
          </h1>
          {/* Decorative accent blocks */}
          <div className="absolute -top-3 -right-3 w-6 h-6 bg-secondary border-3 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] transform rotate-12"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-accent border-3 border-border shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgb(255,255,255)] transform -rotate-12"></div>
        </div>
        <div className="max-w-2xl mx-auto bg-muted border-4 border-border p-6 shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transform rotate-1">
          <p className="text-muted-foreground text-sm sm:text-base font-semibold uppercase tracking-wide">
            🎯 Customize your content experience by selecting your preferred categories for news and movies.
          </p>
        </div>
      </div>

      <Tabs defaultValue="news" className="w-full">
        {/* Enhanced Tabs List */}
        <TabsList className="grid w-full grid-cols-2 p-2 bg-muted border-4 border-border shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:shadow-[6px_6px_0px_0px_rgb(255,255,255)]">
          <TabsTrigger value="news" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-3 data-[state=active]:border-border data-[state=active]:shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:data-[state=active]:shadow-[3px_3px_0px_0px_rgb(255,255,255)] transition-all duration-200 hover:translate-x-[-1px] hover:translate-y-[-1px]">
            <Globe className="w-4 h-6" />
            <span>News Feed</span>
            <Badge variant="secondary" className="text-xs font-black border-2 border-border shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:shadow-[2px_2px_0px_0px_rgb(255,255,255)]">{enabledNewsCount}</Badge>
          </TabsTrigger>
          <TabsTrigger value="movies" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground data-[state=active]:border-3 data-[state=active]:border-border data-[state=active]:shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:data-[state=active]:shadow-[3px_3px_0px_0px_rgb(255,255,255)] transition-all duration-200 hover:translate-x-[-1px] hover:translate-y-[-1px]">
            <Film className="w-4 h-6" />
            <span>Movie Picks</span>
            <Badge variant="secondary" className="text-xs font-black border-2 border-border shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:shadow-[2px_2px_0px_0px_rgb(255,255,255)]">{enabledMovieCount}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="mt-8">
          <Card className="border-4 border-border shadow-[12px_12px_0px_0px_rgb(0,0,0)] dark:shadow-[12px_12px_0px_0px_rgb(255,255,255)] transform -rotate-1 hover:rotate-0 transition-transform duration-300">
            <CardHeader className="pb-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-b-4 border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-black uppercase tracking-wider">
                  <div className="p-2 bg-primary border-3 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)]">
                    <Globe className="w-6 h-6 text-primary-foreground" />
                  </div>
                  News Categories
                </CardTitle>
                <div className="bg-accent text-accent-foreground px-4 py-6 border-3 border-border font-black text-sm uppercase shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgb(255,255,255)] transform rotate-3">
                  {enabledNewsCount}/{Object.keys(settings.news).length} Active
                </div>
              </div>
              <CardDescription className="text-sm font-semibold mt-4 bg-muted border-l-4 border-primary pl-4 py-2">
                🚀 Choose the types of news you want to see on your dashboard. 
                Your preferences will personalize your news feed with live articles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">              
              <div className="grid gap-4">
                {(Object.keys(settings.news) as NewsCategory[]).map((key, index) => {
                  const { label, description, icon: Icon } = newsCategories[key];
                  const isEnabled = settings.news[key];
                  
                  // Define color variants for rotation
                  const colorVariants = [
                    { bg: 'bg-primary/10', iconBg: 'bg-primary', iconText: 'text-primary-foreground' },
                    { bg: 'bg-secondary/10', iconBg: 'bg-secondary', iconText: 'text-secondary-foreground' },
                    { bg: 'bg-accent/10', iconBg: 'bg-accent', iconText: 'text-accent-foreground' }
                  ];
                  const colorSet = colorVariants[index % colorVariants.length];
                  
                  return (
                    <div key={key} className={`group relative flex items-center justify-between p-4 border-3 border-border transition-all duration-200 hover:shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[6px_6px_0px_0px_rgb(255,255,255)] hover:translate-x-[-2px] hover:translate-y-[-2px] ${isEnabled ? `${colorSet.bg} shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)]` : 'bg-card hover:bg-muted/50'}`}>
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className={`p-2 border-3 border-border shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgb(255,255,255)] ${isEnabled ? colorSet.iconBg : 'bg-muted'} transition-all duration-200 group-hover:rotate-3`}>
                          <Icon className={`w-5 h-5 ${isEnabled ? colorSet.iconText : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Label htmlFor={`news-${key}`} className="text-base font-bold cursor-pointer block uppercase tracking-wide">
                            {label}
                          </Label>
                          <p className="text-sm text-muted-foreground font-medium mt-1">{description}</p>
                        </div>
                      </div>
                      <div className="relative">
                        <Switch
                          id={`news-${key}`}
                          checked={isEnabled}
                          onCheckedChange={() => toggleNewsSetting(key)}
                          className={`ml-4 border-3 border-border shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:shadow-[2px_2px_0px_0px_rgb(255,255,255)] transition-colors duration-200 ${
                            isEnabled 
                              ? 'data-[state=checked]:bg-primary' 
                              : 'bg-destructive data-[state=unchecked]:bg-destructive hover:bg-destructive/80'
                          }`}
                        />
                        {isEnabled ? (
                          <div className="absolute -top-2 -right-2 w-3 h-3 bg-accent border-2 border-border animate-pulse"></div>
                        ) : (
                          <div className="absolute -top-2 -right-2 w-3 h-3 bg-destructive border-2 border-border animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transform rotate-1">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💡</div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-foreground">
                      Pro Tip!
                    </p>
                    <p className="text-sm text-muted-foreground font-medium mt-1">
                      Enable multiple categories to get a diverse mix of news articles. 
                      Your feed updates automatically with fresh content.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="movies" className="mt-8">
          <Card className="border-4 border-border shadow-[12px_12px_0px_0px_rgb(0,0,0)] dark:shadow-[12px_12px_0px_0px_rgb(255,255,255)] transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <CardHeader className="pb-6 bg-gradient-to-r from-secondary/10 via-accent/10 to-primary/10 border-b-4 border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl font-black uppercase tracking-wider">
                  <div className="p-2 bg-secondary border-3 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)]">
                    <Film className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  Movie Genres
                </CardTitle>
                <div className="bg-primary text-primary-foreground px-4 py-2 border-3 border-border font-black text-sm uppercase shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgb(255,255,255)] transform -rotate-3">
                  {enabledMovieCount}/{Object.keys(settings.movies).length} Genres
                </div>
              </div>
              <CardDescription className="text-sm font-semibold mt-4 bg-muted border-l-4 border-secondary pl-4 py-2">
                🎬 Select your favorite movie genres to get personalized recommendations and discover new films you'll love.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {(Object.keys(settings.movies) as MovieGenreCategory[]).map((key, index) => {
                  const { label, description, icon: Icon } = movieGenres[key];
                  const isEnabled = settings.movies[key];
                  
                  // Define color variants for rotation  
                  const colorVariants = [
                    { bg: 'bg-secondary/10', iconBg: 'bg-secondary', iconText: 'text-secondary-foreground' },
                    { bg: 'bg-accent/10', iconBg: 'bg-accent', iconText: 'text-accent-foreground' },
                    { bg: 'bg-primary/10', iconBg: 'bg-primary', iconText: 'text-primary-foreground' }
                  ];
                  const colorSet = colorVariants[index % colorVariants.length];
                  
                  return (
                    <div key={key} className={`group relative flex items-center justify-between p-4 border-3 border-border transition-all duration-200 hover:shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[6px_6px_0px_0px_rgb(255,255,255)] hover:translate-x-[-2px] hover:translate-y-[-2px] ${isEnabled ? `${colorSet.bg} shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)]` : 'bg-card hover:bg-muted/50'}`}>
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`p-2 border-3 border-border shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgb(255,255,255)] ${isEnabled ? colorSet.iconBg : 'bg-muted'} transition-all duration-200 group-hover:rotate-3`}>
                          <Icon className={`w-4 h-4 ${isEnabled ? colorSet.iconText : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Label htmlFor={`movie-${key}`} className="text-sm font-bold cursor-pointer block uppercase tracking-wide">
                            {label}
                          </Label>
                          <p className="text-xs text-muted-foreground font-medium mt-1 line-clamp-2">{description}</p>
                        </div>
                      </div>
                      <div className="relative">
                        <Switch
                          id={`movie-${key}`}
                          checked={isEnabled}
                          onCheckedChange={() => toggleMovieSetting(key)}
                          className={`ml-2 border-3 border-border shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:shadow-[2px_2px_0px_0px_rgb(255,255,255)] transition-colors duration-200 ${
                            isEnabled 
                              ? 'data-[state=checked]:bg-secondary' 
                              : 'bg-destructive data-[state=unchecked]:bg-destructive hover:bg-destructive/80'
                          }`}
                        />
                        {isEnabled ? (
                          <div className="absolute -top-2 -right-2 w-3 h-3 bg-primary border-2 border-border animate-pulse"></div>
                        ) : (
                          <div className="absolute -top-2 -right-2 w-3 h-3 bg-destructive border-2 border-border animate-pulse"></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-gradient-to-r from-secondary/20 via-accent/20 to-primary/20 p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transform -rotate-1">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">🎬</div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-wide text-foreground">
                      Movie Magic!
                    </p>
                    <p className="text-sm text-muted-foreground font-medium mt-1">
                      Your genre preferences will help us recommend movies that match your taste. 
                      You can always change these settings later.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
