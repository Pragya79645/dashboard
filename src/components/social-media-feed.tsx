"use client";

import { useState, useMemo } from "react";
import { Search, Hash, User, Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocialMediaCard } from "@/components/social-media-card";
import { 
  mockSocialPosts, 
  popularHashtags, 
  featuredProfiles,
  SocialPost 
} from "@/lib/mock-social-data";
import { cn } from "@/lib/utils";

export function SocialMediaFeed() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  const filteredPosts = useMemo(() => {
    let filtered = mockSocialPosts;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(post =>
        post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by selected hashtags
    if (selectedHashtags.length > 0) {
      filtered = filtered.filter(post =>
        selectedHashtags.some(hashtag =>
          post.hashtags.some(postHashtag =>
            postHashtag.toLowerCase() === hashtag.toLowerCase()
          )
        )
      );
    }

    // Filter by selected profiles
    if (selectedProfiles.length > 0) {
      filtered = filtered.filter(post =>
        selectedProfiles.includes(post.handle)
      );
    }

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter(post => post.platform === activeTab);
    }

    return filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [searchQuery, selectedHashtags, selectedProfiles, activeTab]);

  const toggleHashtag = (hashtag: string) => {
    setSelectedHashtags(prev =>
      prev.includes(hashtag)
        ? prev.filter(h => h !== hashtag)
        : [...prev, hashtag]
    );
  };

  const toggleProfile = (profile: string) => {
    setSelectedProfiles(prev =>
      prev.includes(profile)
        ? prev.filter(p => p !== profile)
        : [...prev, profile]
    );
  };

  const clearFilters = () => {
    setSelectedHashtags([]);
    setSelectedProfiles([]);
    setSearchQuery("");
  };

  const hasActiveFilters = selectedHashtags.length > 0 || selectedProfiles.length > 0 || searchQuery.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-6">
        {/* Main Header Card */}
        <Card className="p-8 border-4 border-border bg-gradient-to-r from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-950 dark:via-purple-950 dark:to-indigo-950 shadow-[8px_8px_0px_0px_rgb(0,0,0)] dark:shadow-[8px_8px_0px_0px_rgb(255,255,255)]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500 text-white rounded-lg border-4 border-border shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)]">
                  <Hash className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-4xl font-black tracking-wider text-foreground uppercase leading-none">
                    Social Media
                  </h1>
                  <h2 className="text-2xl font-bold tracking-wide text-blue-500 uppercase">
                    Feed
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground font-bold text-lg uppercase tracking-wide">
                Discover trending content & connect with creators
              </p>
            </div>
            
            {hasActiveFilters && (
              <div className="flex flex-col gap-3">
                <Badge className="bg-blue-500 text-white border-2 border-border font-bold uppercase tracking-wide self-start">
                  🔥 Filters Active
                </Badge>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="lg"
                  className="border-4 border-border hover:bg-destructive hover:text-destructive-foreground font-bold uppercase tracking-wide shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] hover:shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transition-all"
                >
                  <X className="h-5 w-5 mr-2" />
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Search Bar */}
        <Card className="p-6 border-4 border-border bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/50 dark:to-purple-950/50">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500 text-white rounded border-3 border-border shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:shadow-[2px_2px_0px_0px_rgb(255,255,255)]">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-xl uppercase tracking-wide text-foreground">
                Search & Discover
              </h3>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search posts, users, or hashtags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 border-4 border-border font-bold text-lg shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)] focus:shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:focus:shadow-[6px_6px_0px_0px_rgb(255,255,255)] transition-all"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Platform Tabs */}
      <Card className="p-6 border-4 border-border bg-gradient-to-r from-indigo-50/50 via-purple-50/50 to-blue-50/50 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-blue-950/50">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-500 text-white rounded border-3 border-border shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:shadow-[2px_2px_0px_0px_rgb(255,255,255)]">
              <Filter className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-xl uppercase tracking-wide text-foreground">
              Filter by Platform
            </h3>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 border-4 border-border bg-white dark:bg-gray-800 shadow-[4px_4px_0px_0px_rgb(0,0,0)] dark:shadow-[4px_4px_0px_0px_rgb(255,255,255)]">
              <TabsTrigger 
                value="all" 
                className="font-bold uppercase tracking-wide data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-[2px_2px_0px_0px_rgb(0,0,0)] dark:data-[state=active]:shadow-[2px_2px_0px_0px_rgb(255,255,255)]"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="twitter" 
                className="font-bold uppercase tracking-wide data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-[2px_2px_0px_0px_rgb(0,0,0)]"
              >
                Twitter
              </TabsTrigger>
              <TabsTrigger 
                value="instagram" 
                className="font-bold uppercase tracking-wide data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-[2px_2px_0px_0px_rgb(0,0,0)]"
              >
                Instagram
              </TabsTrigger>
              <TabsTrigger 
                value="facebook" 
                className="font-bold uppercase tracking-wide data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-[2px_2px_0px_0px_rgb(0,0,0)]"
              >
                Facebook
              </TabsTrigger>
              <TabsTrigger 
                value="tiktok" 
                className="font-bold uppercase tracking-wide data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-[2px_2px_0px_0px_rgb(255,255,255)]"
              >
                TikTok
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </Card>

      {/* Filters */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Popular Hashtags */}
        <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:shadow-[6px_6px_0px_0px_rgb(255,255,255)] bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-blue-950 dark:to-purple-950">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500 text-white rounded-lg border-4 border-border shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgb(255,255,255)]">
              <Hash className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-black text-xl uppercase tracking-wide text-foreground">
                Popular Hashtags
              </h3>
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-wide">
                Click to filter posts
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {popularHashtags.map((hashtag) => (
              <Badge
                key={hashtag}
                onClick={() => toggleHashtag(hashtag)}
                className={cn(
                  "cursor-pointer border-3 border-border font-bold uppercase tracking-wide transition-all hover:shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[3px_3px_0px_0px_rgb(255,255,255)] hover:-translate-y-1 px-4 py-2 text-sm",
                  selectedHashtags.includes(hashtag)
                    ? "bg-blue-500 text-white shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgb(255,255,255)]"
                    : "bg-background hover:bg-muted/80"
                )}
              >
                {hashtag}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Featured Profiles */}
        <Card className="p-6 border-4 border-border shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:shadow-[6px_6px_0px_0px_rgb(255,255,255)] bg-gradient-to-br from-blue-50 via-background to-blue-50 dark:from-blue-950 dark:to-blue-950">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500 text-white rounded-lg border-4 border-border shadow-[3px_3px_0px_0px_rgb(0,0,0)]">
              <User className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-black text-xl uppercase tracking-wide text-foreground">
                Featured Profiles
              </h3>
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-wide">
                Follow your favorites
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {featuredProfiles.map((profile) => (
              <Badge
                key={profile}
                onClick={() => toggleProfile(profile)}
                className={cn(
                  "cursor-pointer border-3 border-border font-bold uppercase tracking-wide transition-all hover:shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:hover:shadow-[3px_3px_0px_0px_rgb(255,255,255)] hover:-translate-y-1 px-4 py-2 text-sm",
                  selectedProfiles.includes(profile)
                    ? "bg-blue-500 text-white shadow-[3px_3px_0px_0px_rgb(0,0,0)] dark:shadow-[3px_3px_0px_0px_rgb(255,255,255)]"
                    : "bg-background hover:bg-muted/80"
                )}
              >
                {profile}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Card className="p-6 border-4 border-border bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-950 dark:via-orange-950 dark:to-red-950 shadow-[6px_6px_0px_0px_rgb(0,0,0)] dark:shadow-[6px_6px_0px_0px_rgb(255,255,255)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-500 text-white rounded-lg border-3 border-border shadow-[2px_2px_0px_0px_rgb(0,0,0)]">
              <Filter className="h-5 w-5" />
            </div>
            <div>
              <span className="font-black text-lg uppercase tracking-wide text-foreground">
                Active Filters
              </span>
              <p className="text-sm text-muted-foreground font-bold uppercase tracking-wide">
                Click to remove individual filters
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {selectedHashtags.map((hashtag) => (
              <Badge
                key={hashtag}
                onClick={() => toggleHashtag(hashtag)}
                className="bg-green-500 text-white cursor-pointer border-3 border-border font-bold shadow-[2px_2px_0px_0px_rgb(0,0,0)] hover:shadow-[3px_3px_0px_0px_rgb(0,0,0)] transition-all hover:-translate-y-0.5 px-3 py-2"
              >
                {hashtag}
                <X className="h-4 w-4 ml-2" />
              </Badge>
            ))}
            {selectedProfiles.map((profile) => (
              <Badge
                key={profile}
                onClick={() => toggleProfile(profile)}
                className="bg-blue-500 text-white cursor-pointer border-3 border-border font-bold shadow-[2px_2px_0px_0px_rgb(0,0,0)] hover:shadow-[3px_3px_0px_0px_rgb(0,0,0)] transition-all hover:-translate-y-0.5 px-3 py-2"
              >
                {profile}
                <X className="h-4 w-4 ml-2" />
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {/* Posts Count */}
      <Card className="p-4 border-4 border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary text-primary-foreground rounded border-2 border-border">
              <span className="font-black text-lg">{filteredPosts.length}</span>
            </div>
            <p className="text-foreground font-black text-lg uppercase tracking-wide">
              Posts Found
            </p>
          </div>
          <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
            Updated {new Date().toLocaleTimeString()}
          </div>
        </div>
      </Card>

      {/* Posts Grid */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <SocialMediaCard key={post.id} post={post} />
          ))
        ) : (
          <Card className="col-span-full p-12 border-4 border-border text-center">
            <div className="space-y-4">
              <div className="text-6xl">🔍</div>
              <h3 className="text-xl font-bold uppercase tracking-wide">
                No posts found
              </h3>
              <p className="text-muted-foreground font-medium">
                Try adjusting your filters or search query
              </p>
              <Button
                onClick={clearFilters}
                className="border-2 border-border font-bold uppercase tracking-wide"
              >
                Clear All Filters
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
