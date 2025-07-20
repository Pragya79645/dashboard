
"use client";

import { useSettings } from "@/contexts/settings-context";
import type { ContentCategory } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { BrainCircuit, Landmark, BarChart } from "lucide-react";

const categoryDetails: Record<ContentCategory, { label: string; description: string; icon: React.ElementType }> = {
  tech: { label: "Tech", description: "Latest news from the world of technology.", icon: BrainCircuit },
  finance: { label: "Finance", description: "Market updates and financial news.", icon: Landmark },
  sports: { label: "Sports", description: "Scores, highlights, and sports news.", icon: BarChart },
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
        </CardContent>
      </Card>
    </div>
  );
}
