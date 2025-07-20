
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
    "flex flex-col h-full w-full overflow-hidden transition-all duration-150 shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)] border-4 border-border hover:shadow-[12px_12px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[12px_12px_0px_0px_rgb(255,255,255)]",
    isCarouselItem ? "" : "hover:translate-x-[-4px] hover:translate-y-[-4px]"
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
        <Badge className="absolute top-2 right-2 text-xs font-bold" variant="secondary">{item.category}</Badge>
      </CardHeader>
      <CardContent className="flex-grow p-4 sm:p-5 space-y-3 min-h-0">
        <CardTitle className="text-sm sm:text-base lg:text-lg leading-tight line-clamp-2 font-bold">
          <Link href={item.link} className="hover:text-primary transition-colors">{item.title}</Link>
        </CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">{item.description}</p>
        {item.publishedAt && (
          <p className="text-xs text-muted-foreground font-medium">
            {new Date(item.publishedAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        )}
      </CardContent>
      <CardFooter className="p-4 sm:p-5 flex justify-between items-center gap-3 border-t border-border/50">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
            <AvatarImage src={item.authorImageUrl} alt={item.author} />
            <AvatarFallback className="text-xs font-bold">{item.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-muted-foreground truncate">{item.author}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-xs sm:text-sm px-3 sm:px-4 font-bold"
          >
            <Link href={item.link} target="_blank" rel="noopener noreferrer">
              <span className="hidden sm:inline">Read More</span>
              <span className="sm:hidden">Read</span>
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFavoriteClick}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            className="h-9 w-9 flex-shrink-0"
          >
            <Heart className={cn("h-4 w-4 sm:h-5 sm:w-5", favorite ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
