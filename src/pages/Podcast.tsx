
import React, { useState } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import PodcastPlayer from "@/components/podcast/PodcastPlayer";
import CategorySelector from "@/components/podcast/CategorySelector";
import PodcastList from "@/components/podcast/PodcastList";
import { podcastsData } from "@/data/podcastData";

const Podcast = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCategory, setActiveCategory] = useState("portfolio");
  const [activeEpisode, setActiveEpisode] = useState<number | null>(null);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleEpisodePlay = (id: number) => {
    setActiveEpisode(id);
  };

  return (
    <div className="pb-20 min-h-screen animate-fade-in">
      <Header activeTab="Financial Podcasts" onTabChange={() => {}} showTabs={false} />
      
      {/* Increased top padding from pt-16 to pt-20 to add more space */}
      <main className="px-4 pt-20 mt-6 pb-16">
        <CategorySelector 
          activeCategory={activeCategory} 
          setActiveCategory={setActiveCategory} 
        />
        
        <PodcastPlayer 
          isPlaying={isPlaying} 
          togglePlayPause={togglePlayPause} 
        />
        
        <PodcastList 
          podcasts={podcastsData}
          activeEpisode={activeEpisode}
          activeCategory={activeCategory}
          onEpisodePlay={handleEpisodePlay}
        />
      </main>
      
      <BottomNavigation activePage="podcast" />
    </div>
  );
};

export default Podcast;
