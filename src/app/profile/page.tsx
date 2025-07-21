"use client";

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Globe, 
  Edit3, 
  Save, 
  LogOut, 
  Sparkles,
  Camera,
  Settings,
  Heart,
  Film,
  Newspaper,
  Palette,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/auth-context';
import { useSettings } from '@/contexts/settings-context';
import { NewsCategory, MovieGenreCategory } from '@/lib/types';
import { cn } from '@/lib/utils';

const AVATAR_OPTIONS = [
  '👤', '👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨', '👨‍🔬', '👩‍🔬', 
  '👨‍🚀', '👩‍🚀', '👨‍🎭', '👩‍🎭', '🧑‍💼', '👨‍🏫', '👩‍🏫',
  '🦸‍♂️', '🦸‍♀️', '🧙‍♂️', '🧙‍♀️', '🎯', '🎨', '🎭', '🎪', '🎬', '🎮'
];

const NEWS_CATEGORIES: { value: NewsCategory; label: string; icon: string }[] = [
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'science', label: 'Science', icon: '🔬' },
  { value: 'business', label: 'Business', icon: '💼' },
  { value: 'health', label: 'Health', icon: '🏥' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎭' },
  { value: 'general', label: 'General', icon: '📰' },
];

const MOVIE_GENRES: { value: MovieGenreCategory; label: string; icon: string }[] = [
  { value: 'action', label: 'Action', icon: '💥' },
  { value: 'adventure', label: 'Adventure', icon: '🗺️' },
  { value: 'animation', label: 'Animation', icon: '🎨' },
  { value: 'comedy', label: 'Comedy', icon: '😂' },
  { value: 'crime', label: 'Crime', icon: '🔍' },
  { value: 'documentary', label: 'Documentary', icon: '📹' },
  { value: 'drama', label: 'Drama', icon: '🎭' },
  { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { value: 'fantasy', label: 'Fantasy', icon: '🧙‍♂️' },
  { value: 'history', label: 'History', icon: '📜' },
  { value: 'horror', label: 'Horror', icon: '👻' },
  { value: 'music', label: 'Music', icon: '🎵' },
  { value: 'mystery', label: 'Mystery', icon: '🔍' },
  { value: 'romance', label: 'Romance', icon: '💕' },
  { value: 'science_fiction', label: 'Sci-Fi', icon: '🚀' },
  { value: 'thriller', label: 'Thriller', icon: '😱' },
  { value: 'war', label: 'War', icon: '⚔️' },
  { value: 'western', label: 'Western', icon: '🤠' },
];

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ProfilePageContent />
    </Suspense>
  );
}

function ProfilePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, updateProfile, logout, isAuthenticated } = useAuth();
  const { settings, toggleNewsSetting, toggleMovieSetting } = useSettings();
  const [isEditing, setIsEditing] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isOnboarding, setIsOnboarding] = React.useState(false);
  const [showWelcome, setShowWelcome] = React.useState(false);
  const [editData, setEditData] = React.useState({
    name: '',
    bio: '',
    avatar: '👤',
    newsCategories: [] as string[],
    movieGenres: [] as string[],
  });

  // Check if user is new (joined within last 7 days)
  React.useEffect(() => {
    if (user?.joinedDate) {
      const joinedDate = new Date(user.joinedDate);
      const now = new Date();
      const daysDiff = Math.floor((now.getTime() - joinedDate.getTime()) / (1000 * 60 * 60 * 24));
      setShowWelcome(daysDiff <= 7);
    }
  }, [user]);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    if (user) {
      setEditData({
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
        newsCategories: user.newsCategories,
        movieGenres: user.movieGenres,
      });

      // Check if this is onboarding
      const onboardingParam = searchParams.get('onboarding');
      if (onboardingParam === 'true' || !user.isOnboarded) {
        setIsOnboarding(true);
        setIsEditing(true);
      }
    }
  }, [user, isAuthenticated, router, searchParams]);

  const handleSave = () => {
    if (!user) return;

    updateProfile({
      ...editData,
      isOnboarded: true,
    });

    // Sync with settings context
    editData.newsCategories.forEach(category => {
      if (!settings.news[category as NewsCategory]) {
        toggleNewsSetting(category as NewsCategory);
      }
    });

    editData.movieGenres.forEach(genre => {
      if (!settings.movies[genre as MovieGenreCategory]) {
        toggleMovieSetting(genre as MovieGenreCategory);
      }
    });

    setIsEditing(false);
    setIsOnboarding(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);

    // Remove onboarding param from URL
    if (searchParams.get('onboarding')) {
      router.replace('/profile');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/signin');
  };

  const toggleNewsCategory = (category: string) => {
    setEditData(prev => ({
      ...prev,
      newsCategories: prev.newsCategories.includes(category)
        ? prev.newsCategories.filter(c => c !== category)
        : [...prev.newsCategories, category]
    }));
  };

  const toggleMovieGenre = (genre: string) => {
    setEditData(prev => ({
      ...prev,
      movieGenres: prev.movieGenres.includes(genre)
        ? prev.movieGenres.filter(g => g !== genre)
        : [...prev.movieGenres, genre]
    }));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-indigo-900/10">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl border-3 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {isOnboarding ? 'Welcome! Complete Your Profile' : 'My Profile'}
              </h1>
              <p className="text-muted-foreground font-medium">
                {isOnboarding ? 'Customize your content experience' : 'Manage your account and preferences'}
              </p>
            </div>
          </div>
          
          {!isOnboarding && (
            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="border-3 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] font-bold uppercase tracking-wide"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  className="border-3 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] font-bold uppercase tracking-wide bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              )}
              
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="border-3 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] font-bold uppercase tracking-wide"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <Alert className="border-3 border-green-500 bg-green-50 dark:bg-green-900/20">
            <Sparkles className="h-4 w-4" />
            <AlertDescription className="font-medium text-green-800 dark:text-green-200">
              Profile updated successfully! 🎉
            </AlertDescription>
          </Alert>
        )}

        {/* Welcome Banner for New Users */}
        {showWelcome && !isOnboarding && (
          <Card className="p-6 border-4 border-green-500 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-900/30 dark:to-teal-900/30 shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)] relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowWelcome(false)}
              className="absolute top-4 right-4 h-8 w-8 p-0 hover:bg-green-200 dark:hover:bg-green-800"
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-6xl">{user.avatar}</div>
              <div className="flex-1 text-center sm:text-left space-y-3">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-wider text-green-800 dark:text-green-200">
                    Welcome to Content Canvas, {user.name}! 🎉
                  </h3>
                  <p className="text-green-700 dark:text-green-300 font-medium">
                    Complete your profile to get the most personalized content experience
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <Button
                    onClick={() => setIsEditing(true)}
                    size="sm"
                    className="border-3 border-green-600 bg-green-600 hover:bg-green-700 shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] font-bold uppercase tracking-wide"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    onClick={() => router.push('/settings')}
                    size="sm"
                    variant="outline"
                    className="border-3 border-green-600 shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] font-bold uppercase tracking-wide"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize Preferences
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Info */}
          <div className="lg:col-span-1">
            <Card className="border-4 border-border shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)]">
              <CardHeader className="border-b-4 border-border bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
                <CardTitle className="flex items-center gap-2 font-black uppercase tracking-wide">
                  <User className="w-5 h-5" />
                  Basic Info
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Avatar */}
                <div className="text-center space-y-4">
                  <div className="text-6xl">{isEditing ? editData.avatar : user.avatar}</div>
                  {isEditing && (
                    <div className="w-full max-w-sm mx-auto">
                      <Label className="text-sm font-bold uppercase tracking-wide flex items-center justify-center gap-2 mb-3">
                        <Camera className="w-4 h-4" />
                        Choose Avatar
                      </Label>
                      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                        {AVATAR_OPTIONS.map((avatar) => (
                          <button
                            key={avatar}
                            type="button"
                            onClick={() => setEditData(prev => ({ ...prev, avatar }))}
                            className={cn(
                              "text-lg sm:text-xl md:text-2xl p-1.5 sm:p-2 rounded-lg border-2 hover:border-primary transition-all flex items-center justify-center aspect-square",
                              editData.avatar === avatar
                                ? "border-primary bg-primary/10 shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:shadow-[2px_2px_0px_0px_rgb(255,255,255)]"
                                : "border-border hover:bg-gray-50 dark:hover:bg-gray-800"
                            )}
                          >
                            {avatar}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Scroll to see more options
                      </p>
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wide">Name</Label>
                  {isEditing ? (
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="border-3 border-border font-medium"
                    />
                  ) : (
                    <p className="font-medium text-lg">{user.name}</p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <p className="font-medium text-muted-foreground">{user.email}</p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wide">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      value={editData.bio}
                      onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      className="border-3 border-border font-medium resize-none"
                      rows={3}
                    />
                  ) : (
                    <p className="font-medium text-muted-foreground">
                      {user.bio || 'No bio provided'}
                    </p>
                  )}
                </div>

                {/* Joined Date */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold uppercase tracking-wide flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </Label>
                  <p className="font-medium text-muted-foreground">
                    {new Date(user.joinedDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preferences */}
          <div className="lg:col-span-2 space-y-6">
            {/* News Preferences */}
            <Card className="border-4 border-border shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)]">
              <CardHeader className="border-b-4 border-border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30">
                <CardTitle className="flex items-center gap-2 font-black uppercase tracking-wide">
                  <Newspaper className="w-5 h-5" />
                  News Preferences
                </CardTitle>
                <CardDescription className="font-medium">
                  Select the news categories you're interested in
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {NEWS_CATEGORIES.map((category) => {
                    const isSelected = isEditing 
                      ? editData.newsCategories.includes(category.value)
                      : user.newsCategories.includes(category.value);
                    
                    return (
                      <Button
                        key={category.value}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => isEditing && toggleNewsCategory(category.value)}
                        disabled={!isEditing}
                        className={cn(
                          "h-auto p-4 flex flex-col items-center gap-2 border-3 border-border font-bold uppercase tracking-wide",
                          isSelected && "shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)]"
                        )}
                      >
                        <span className="text-2xl">{category.icon}</span>
                        <span className="text-xs">{category.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Movie Preferences */}
            <Card className="border-4 border-border shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)]">
              <CardHeader className="border-b-4 border-border bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30">
                <CardTitle className="flex items-center gap-2 font-black uppercase tracking-wide">
                  <Film className="w-5 h-5" />
                  Movie Preferences
                </CardTitle>
                <CardDescription className="font-medium">
                  Choose your favorite movie genres
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {MOVIE_GENRES.map((genre) => {
                    const isSelected = isEditing 
                      ? editData.movieGenres.includes(genre.value)
                      : user.movieGenres.includes(genre.value);
                    
                    return (
                      <Button
                        key={genre.value}
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        onClick={() => isEditing && toggleMovieGenre(genre.value)}
                        disabled={!isEditing}
                        className={cn(
                          "h-auto p-3 flex flex-col items-center gap-2 border-3 border-border font-bold uppercase tracking-wide",
                          isSelected && "shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)]"
                        )}
                      >
                        <span className="text-xl">{genre.icon}</span>
                        <span className="text-xs text-center">{genre.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Onboarding Actions */}
            {isOnboarding && (
              <Card className="border-4 border-green-500 bg-green-50 dark:bg-green-900/20 shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)]">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="text-4xl">🎉</div>
                  <div>
                    <h3 className="font-black text-lg uppercase tracking-wide text-green-800 dark:text-green-200">
                      You're All Set!
                    </h3>
                    <p className="text-green-700 dark:text-green-300 font-medium">
                      Complete your profile to get personalized content recommendations
                    </p>
                  </div>
                  <Button
                    onClick={handleSave}
                    className="border-3 border-green-600 bg-green-600 hover:bg-green-700 shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] font-bold uppercase tracking-wide"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Start Exploring
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
