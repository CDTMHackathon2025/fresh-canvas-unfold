
import React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PodcastEpisodeProps {
  id: number;
  title: string;
  host: string;
  duration: string;
  category: string;
  imageUrl: string;
  isActive: boolean;
  onPlay: (id: number) => void;
}

const PodcastEpisode: React.FC<PodcastEpisodeProps> = ({
  id,
  title,
  host,
  duration,
  category,
  imageUrl,
  isActive,
  onPlay
}) => {
  const getCategoryLabel = (cat: string) => {
    return cat === "portfolio" ? "Portfolio Insights" : 
           cat === "news" ? "News" : "Education";
  };

  return (
    <div 
      className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
        isActive 
          ? "bg-navy/70 border border-white/60" 
          : "bg-black/60 backdrop-blur-sm border border-gray-800"
      }`}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-16 h-16 rounded-lg object-cover"
      />
      <div className="ml-3 flex-1">
        <h3 className={`font-medium ${isActive ? "text-white" : "text-white"}`}>
          {title}
        </h3>
        <p className={`text-sm ${isActive ? "text-gray-200" : "text-gray-300"}`}>
          {host} • {duration}
        </p>
        <span className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${
          isActive ? "bg-white/20 text-white" : "bg-gray-700 text-gray-200"
        }`}>
          {getCategoryLabel(category)}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className={`rounded-full ${
          isActive 
            ? "bg-white text-navy hover:bg-white/90 ring-2 ring-white/60" 
            : "bg-white/20 hover:bg-white/30 text-white"
        }`}
        onClick={() => onPlay(id)}
      >
        <Play className={`h-4 w-4 ${isActive ? "text-navy" : "text-white"}`} />
      </Button>
    </div>
  );
};

export default PodcastEpisode;
