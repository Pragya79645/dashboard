"use client";

import * as React from "react";
import { useSearchParams } from 'next/navigation';
import { ContentCard } from "@/components/content-card";
import { mockData } from "@/lib/mock-data";
import type { ContentItem } from "@/lib/types";
import { useSettings } from "@/contexts/settings-context";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const { settings } = useSettings();
  const [filteredData, setFilteredData] = React.useState<ContentItem[]>([]);

  React.useEffect(() => {
    const activeCategories = Object.entries(settings)
      .filter(([, value]) => value)
      .map(([key]) => key);

    const newFilteredData = mockData.filter(item => 
      (activeCategories.length === 0 || activeCategories.includes(item.category)) &&
      (searchQuery === '' || item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredData(newFilteredData);
  }, [searchQuery, settings]);

  const trendingItems = mockData.filter(item => item.trending);

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Trending</h2>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {trendingItems.map((item) => (
              <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <ContentCard item={item} isCarouselItem={true} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-14" />
          <CarouselNext className="mr-14" />
        </Carousel>
      </section>

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Your Feed</h2>
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredData.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <Card className="flex items-center justify-center p-12">
            <p className="text-muted-foreground">
              {searchQuery ? `No results for "${searchQuery}".` : "No content to display. Adjust your preferences in Settings."}
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
