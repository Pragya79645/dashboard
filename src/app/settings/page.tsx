
"use client";

import { useSettings } from "@/contexts/settings-context";
import type { ContentCategory } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BrainCircuit, Landmark, BarChart, Building2, Film, Heart, Microscope, Globe } from "lucide-react";

const categoryDetails: Record<ContentCategory, { label: string; description: string; icon: React.ElementType }> = {
  tech: { label: "Technology", description: "Latest news from the world of technology.", icon: BrainCircuit },
  finance: { label: "Finance", description: "Market updates and financial news.", icon: Landmark },
  sports: { label: "Sports", description: "Scores, highlights, and sports news.", icon: BarChart },
  business: { label: "Business", description: "Corporate news and business insights.", icon: Building2 },
  entertainment: { label: "Entertainment", description: "Movies, TV shows, and celebrity news.", icon: Film },
  health: { label: "Health", description: "Medical news and health tips.", icon: Heart },
  science: { label: "Science", description: "Scientific discoveries and research.", icon: Microscope },
  general: { label: "General", description: "General news and current events.", icon: Globe },
};

export default function SettingsPage() {
  const { settings, toggleSetting } = useSettings();
  const enabledCount = Object.values(settings).filter(Boolean).length;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Preferences</CardTitle>
          <CardDescription>
            Choose the type of content you want to see on your dashboard. 
            Your preferences are automatically saved and will personalize your news feed with live articles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-muted-foreground">
            {enabledCount} of {Object.keys(settings).length} categories enabled
          </div>
          
          {(Object.keys(settings) as ContentCategory[]).map((key) => {
            const { label, description, icon: Icon } = categoryDetails[key];
            return (
              <div key={key} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-start gap-4">
                   <Icon className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <Label htmlFor={key} className="text-base font-medium">
                      {label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{description}</p>
                  </div>
                </div>
                <Switch
                  id={key}
                  checked={settings[key]}
                  onCheckedChange={() => toggleSetting(key)}
                />
              </div>
            );
          })}
          
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Tip:</strong> Enable multiple categories to get a diverse mix of news articles. 
              Your feed updates automatically every 5 minutes with fresh content from News API.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
