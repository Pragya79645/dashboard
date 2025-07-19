"use client";

import { useFavorites } from "@/contexts/favorites-context";
import { mockData } from "@/lib/mock-data";
import { ContentCard } from "@/components/content-card";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const favoriteItems = mockData.filter(item => favorites.includes(item.id));

  return (
    <div className="space-y-6">
      {favoriteItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteItems.map(item => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center p-12 space-y-4">
          <Heart className="w-16 h-16 text-muted-foreground/50" />
          <h3 className="text-xl font-semibold">No Favorites Yet</h3>
          <p className="text-muted-foreground text-center">
            Click the heart icon on any content card to save it here.
          </p>
        </Card>
      )}
    </div>
  );
}
