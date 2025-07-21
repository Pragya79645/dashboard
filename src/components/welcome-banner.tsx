"use client";

import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';
import { Sparkles, User, Settings, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function WelcomeBanner() {
  const { user } = useAuth();
  const router = useRouter();

  // Don't show for users who have completed onboarding
  if (!user || user.isOnboarded) {
    return null;
  }

  return (
    <Alert className="border-4 border-purple-500 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)]">
      <Sparkles className="h-5 w-5 text-purple-600" />
      <AlertDescription className="ml-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="font-black text-lg uppercase tracking-wide text-purple-800 dark:text-purple-200 mb-2">
              🎉 Welcome to Content Canvas, {user.name}!
            </h3>
            <p className="text-purple-700 dark:text-purple-300 font-medium">
              Complete your profile to get personalized content recommendations and unlock all features.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => router.push('/profile?onboarding=true')}
              className="border-3 border-purple-600 bg-purple-600 hover:bg-purple-700 shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] font-bold uppercase tracking-wide text-white"
            >
              <User className="w-4 h-4 mr-2" />
              Complete Profile
            </Button>
            
            <Button
              variant="outline"
              onClick={() => router.push('/settings')}
              className="border-3 border-purple-600 shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] font-bold uppercase tracking-wide text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            >
              <Settings className="w-4 h-4 mr-2" />
              Preferences
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}

export function QuickStatsCard() {
  const { user } = useAuth();

  if (!user) return null;

  const joinedDaysAgo = Math.floor(
    (new Date().getTime() - new Date(user.joinedDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="border-4 border-border shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)]">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{user.avatar}</div>
          <div className="flex-1">
            <h3 className="font-black text-lg uppercase tracking-wide">
              Welcome back, {user.name}!
            </h3>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                Member for {joinedDaysAgo === 0 ? 'today' : `${joinedDaysAgo} days`}
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                {user.newsCategories.length} news interests
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                {user.movieGenres.length} movie genres
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
