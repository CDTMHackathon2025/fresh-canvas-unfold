
import React from "react";
import PodcastEpisode, { PodcastEpisodeProps } from "./PodcastEpisode";

interface PodcastData {
  id: number;
  title: string;
  host: string;
  duration: string;
  category: string;
  imageUrl: string;
}

interface PodcastListProps {
  podcasts: PodcastData[];
  activeEpisode: number | null;
  activeCategory: string;
  onEpisodePlay: (id: number) => void;
}

const PodcastList: React.FC<PodcastListProps> = ({ 
  podcasts, 
  activeEpisode, 
  activeCategory,
  onEpisodePlay 
}) => {
  // Filter podcasts based on selected category
  const filteredPodcasts = podcasts.filter(podcast => podcast.category === activeCategory);
  
  const getCategoryTitle = () => {
    return activeCategory === "portfolio" ? "Portfolio Insights" :
           activeCategory === "news" ? "Latest News" : "Educational Content";
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-white">
        {getCategoryTitle()}
      </h2>
      
      <div className="space-y-4">
        {filteredPodcasts.map((podcast) => (
          <PodcastEpisode 
            key={podcast.id}
            {...podcast}
            isActive={activeEpisode === podcast.id}
            onPlay={onEpisodePlay}
          />
        ))}
      </div>
    </>
  );
};

export default PodcastList;
