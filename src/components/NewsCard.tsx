
import React from "react";
import { Play, Volume2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface NewsCardProps {
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  sentiment: "positive" | "negative" | "neutral";
  change: string;
  sector: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  summary,
  imageUrl,
  category,
  sentiment,
  change,
  sector,
}) => {
  const sentimentColor = 
    sentiment === "positive" ? "text-green-500" : 
    sentiment === "negative" ? "text-red-500" : 
    "text-gray-500";
  
  // Generate ticker from title for the link
  const ticker = `${title.split(" ")[0]}-${category}`;

  return (
    <Card className="relative h-[480px] w-full rounded-xl overflow-hidden border-0 shadow-none mb-6">
      <div className="absolute inset-0">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent flex flex-col justify-end p-5">
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
              {category}
            </span>
            <span className={`${sentimentColor} bg-white/20 backdrop-blur-sm text-xs font-medium px-3 py-1.5 rounded-full`}>
              {change}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          <p className="text-white/80 text-sm mb-6 line-clamp-3">{summary}</p>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="rounded-full bg-white/20 hover:bg-white/30">
                <Play className="h-4 w-4 text-white" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full bg-white/20 hover:bg-white/30">
                <Volume2 className="h-4 w-4 text-white" />
              </Button>
            </div>
            
            <Link 
              to={`/stock/${ticker}`}
              className="flex items-center bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-full text-white/90 text-sm hover:text-white"
            >
              <span className="mr-2">View details</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="sm" className="text-xs bg-white/10 hover:bg-white/20 text-white rounded-full px-4">
            Follow Story
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;
