
"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/contexts/favorites-context";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ContentItem } from "@/lib/types";

interface ContentCardProps {
  item: ContentItem;
  isCarouselItem?: boolean;
}

export function ContentCard({ item, isCarouselItem = false }: ContentCardProps) {
  const { isFavoriteNews, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavoriteNews(item.id);
  const [imageError, setImageError] = React.useState(false);

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const cardClasses = cn(
    "flex flex-col h-full w-full overflow-hidden transition-all duration-300 hover:shadow-lg",
    isCarouselItem ? "" : "hover:-translate-y-1"
  );
  
  return (
    <Card className={cardClasses}>
      <CardHeader className="p-0 relative">
        <Link href={item.link}>
          <Image
            src={imageError ? 'https://placehold.co/600x400.png' : item.imageUrl}
            alt={item.title}
            width={600}
            height={400}
            className="w-full object-cover aspect-video"
            data-ai-hint={item.dataAiHint}
            onError={handleImageError}
            unoptimized={imageError}
          />
        </Link>
        <Badge className="absolute top-2 right-2" variant="secondary">{item.category}</Badge>
      </CardHeader>
      <CardContent className="flex-grow p-4 space-y-3">
        <CardTitle className="text-lg leading-snug">
          <Link href={item.link} className="hover:text-primary transition-colors">{item.title}</Link>
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
        {item.publishedAt && (
          <p className="text-xs text-muted-foreground">
            {new Date(item.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={item.authorImageUrl} alt={item.author} />
            <AvatarFallback>{item.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-muted-foreground">{item.author}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
          >
            <Link href={item.link} target="_blank" rel="noopener noreferrer">
              Read More
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={cn("h-5 w-5", favorite ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
