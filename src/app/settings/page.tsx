"use client";

import { useSettings } from "@/contexts/settings-context";
import type { ContentCategory } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Newspaper, Film, Music, Users } from "lucide-react";

const categoryDetails: Record<ContentCategory, { label: string; description: string; icon: React.ElementType }> = {
  news: { label: "News", description: "Latest headlines and articles.", icon: Newspaper },
  movies: { label: "Movies", description: "Film reviews and trailers.", icon: Film },
  music: { label: "Music", description: "Album releases and artist news.", icon: Music },
  social: { label: "Social", description: "Trending posts and updates.", icon: Users },
};

export default function SettingsPage() {
  const { settings, toggleSetting } = useSettings();

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Content Preferences</CardTitle>
          <CardDescription>
            Choose the type of content you want to see on your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.keys(settings).map((key) => {
            const category = key as ContentCategory;
            const { label, description, icon: Icon } = categoryDetails[category];
            return (
              <div key={category} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-start gap-4">
                   <Icon className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <Label htmlFor={category} className="text-base font-medium">
                      {label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
                <Switch
                  id={category}
                  checked={settings[category]}
                  onCheckedChange={() => toggleSetting(category)}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
