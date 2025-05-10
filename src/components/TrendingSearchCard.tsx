
import React from "react";
import { Play, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface TrendingSearchCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  change: string; 
  isPositive: boolean;
  category: string;
}

const TrendingSearchCard: React.FC<TrendingSearchCardProps> = ({
  title,
  subtitle,
  imageUrl,
  change,
  isPositive,
  category
}) => {
  const changeColor = isPositive ? "text-green-500" : "text-red-500";
  
  // Generate ticker for the link
  const ticker = `${title}-${category}`;

  return (
    <Card className="relative h-[180px] w-full rounded-xl overflow-hidden border-0 shadow-md mb-3">
      <div className="absolute inset-0">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
            {category}
          </span>
          <span className={`${changeColor} bg-white/20 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full`}>
            {change}
          </span>
        </div>
        
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-white/80 text-xs line-clamp-2 mb-2">{subtitle}</p>
        
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="icon" className="rounded-full bg-white/20 hover:bg-white/30">
            <Play className="h-3 w-3 text-white" />
          </Button>
          
          <Link 
            to={`/stock/${ticker}`}
            className="flex items-center text-white/70 text-xs hover:text-white"
          >
            <span className="mr-1">View details</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default TrendingSearchCard;
