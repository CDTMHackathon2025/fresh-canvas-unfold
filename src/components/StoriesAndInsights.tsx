
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrendingCard from "@/components/TrendingCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TrendingItem {
  title: string;
  subtitle: string;
  imageUrl: string;
  trend: string;
  id: string;
}

interface StoriesAndInsightsProps {
  trendingData: TrendingItem[];
  activeTrendingTab: string;
  setActiveTrendingTab: (tab: string) => void;
  onViewDetails?: (id: string) => void;
}

const StoriesAndInsights: React.FC<StoriesAndInsightsProps> = ({
  trendingData,
  activeTrendingTab,
  setActiveTrendingTab,
  onViewDetails
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation effect when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="space-y-6">
      {/* Featured Story */}
      <section className={`mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '100ms' }}>
        <h2 className="text-xl font-bold mb-4">Featured Story</h2>
        <TrendingCard
          title={trendingData[0].title}
          subtitle={trendingData[0].subtitle}
          imageUrl={trendingData[0].imageUrl}
          trend={trendingData[0].trend}
          id={trendingData[0].id}
          onClick={onViewDetails}
        />
      </section>
      
      {/* Trending News */}
      <section className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Trending</h2>
          <Tabs value={activeTrendingTab} onValueChange={setActiveTrendingTab}>
            <TabsList className="bg-gray-800/50 rounded-full">
              <TabsTrigger value="News" className="text-xs rounded-full">News</TabsTrigger>
              <TabsTrigger value="Top Searches" className="text-xs rounded-full">Top Searches</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <ScrollArea className="h-[350px] pb-4">
          <div className="space-y-5">
            {trendingData.slice(1).map((item, index) => (
              <TrendingCard
                key={index}
                title={item.title}
                subtitle={item.subtitle}
                imageUrl={item.imageUrl}
                trend={item.trend}
                id={item.id}
                onClick={onViewDetails}
                className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: `${(index + 3) * 100}ms` }}
              />
            ))}
          </div>
        </ScrollArea>
      </section>
    </div>
  );
};

export default StoriesAndInsights;
