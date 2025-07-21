"use client";

import { formatDistanceToNow } from "date-fns";
import { 
  Heart, 
  Share2, 
  Verified, 
  Hash,
  Twitter,
  Instagram,
  Facebook,
  Music
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SocialPost } from "@/lib/mock-social-data";
import { cn } from "@/lib/utils";

interface SocialMediaCardProps {
  post: SocialPost;
}

const platformIcons = {
  twitter: Twitter,
  instagram: Instagram,
  facebook: Facebook,
  tiktok: Music,
};

const platformColors = {
  twitter: "bg-blue-500",
  instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
  facebook: "bg-blue-600",
  tiktok: "bg-black",
};

const platformTextColors = {
  twitter: "text-blue-600",
  instagram: "text-purple-600",
  facebook: "text-blue-600",
  tiktok: "text-black",
};

export function SocialMediaCard({ post }: SocialMediaCardProps) {
  const PlatformIcon = platformIcons[post.platform];
  const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });

  return (
    <Card className={cn(
      "p-6 border-4 border-border bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-indigo-900/30 transition-all duration-200 hover:shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[8px_8px_0px_0px_rgb(255,255,255)] hover:-translate-y-1 hover:-translate-x-1"
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4 p-3 bg-white/50 dark:bg-gray-800/50 border-2 border-border rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-3 border-border shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgb(255,255,255)]">
            <AvatarImage src={post.profileImage} alt={post.username} />
            <AvatarFallback className="bg-blue-500 text-white font-bold">
              {post.username.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-black text-foreground text-lg tracking-wide">
                {post.username}
              </h3>
              {post.verified && (
                <Verified className="h-5 w-5 text-blue-500 fill-current" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={cn("text-sm font-bold", platformTextColors[post.platform])}>
                {post.handle}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                {timeAgo}
              </span>
            </div>
          </div>
        </div>
        <div className={cn(
          "p-2 rounded-lg border-3 border-border shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgb(255,255,255)]",
          platformColors[post.platform]
        )}>
          <PlatformIcon className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <p className="text-foreground leading-relaxed text-base">
          {post.content}
        </p>
      </div>

      {/* Hashtags */}
      {post.hashtags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {post.hashtags.map((hashtag) => (
              <Badge
                key={hashtag}
                variant="outline"
                className="border-2 border-border bg-blue-50 dark:bg-blue-950 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer font-bold uppercase tracking-wide shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:shadow-[2px_2px_0px_0px_rgb(255,255,255)]"
              >
                <Hash className="h-3 w-3 mr-1" />
                {hashtag.replace('#', '')}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t-2 border-border">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-red-500 font-bold uppercase tracking-wide"
          >
            <Heart className="h-4 w-4 mr-2" />
            {post.likes.toLocaleString()}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary font-bold uppercase tracking-wide"
          >
            <Share2 className="h-4 w-4 mr-2" />
            {post.shares.toLocaleString()}
          </Button>
        </div>
        <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
          {post.platform.toUpperCase()}
        </div>
      </div>
    </Card>
  );
}
