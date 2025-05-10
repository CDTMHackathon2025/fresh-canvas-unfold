import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Heart, Bitcoin, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Asset {
  id: string;
  name: string;
  ticker: string;
  price: number;
  change: string;
  changePercent: string;
  imageUrl: string;
  type: "stock" | "etf" | "crypto";
}

interface AssetCardProps {
  asset: Asset;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset, isFavorite, onToggleFavorite }) => {
  const { name, ticker, price, change, changePercent, imageUrl, type } = asset;
  const isPositive = !change.startsWith("-");

  const typeColors = {
    stock: "bg-blue-100 text-blue-800",
    etf: "bg-purple-100 text-purple-800",
    crypto: "bg-amber-100 text-amber-800"
  };

  // Function to render the appropriate icon based on ticker
  const renderBrandIcon = () => {
    // If there's a custom image URL available, use it
    if (imageUrl && imageUrl !== "") {
      return <img src={imageUrl} alt={name} className="w-full h-full object-cover" />;
    }
    
    // Otherwise use a default icon based on asset type
    return (
      <div className="w-full h-full flex items-center justify-center">
        {type === "crypto" ? (
          <Bitcoin className="h-6 w-6 text-amber-600" />
        ) : (
          <DollarSign className="h-6 w-6 text-blue-600" />
        )}
      </div>
    );
  };

  return (
    <Card className="flex items-center p-3 relative">
      <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0 bg-gray-100">
        {renderBrandIcon()}
      </div>
      
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-base truncate">{name}</h3>
          <Badge className={`${typeColors[type]} text-xs`}>
            {type.toUpperCase()}
          </Badge>
        </div>
        <p className="text-sm text-gray-500">{ticker}</p>
      </div>
      
      <div className="flex flex-col items-end ml-2">
        <div className="font-medium">${price.toLocaleString()}</div>
        <div className={`flex items-center text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {isPositive ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1" />
          )}
          <span>{changePercent}</span>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className={`absolute top-2 right-2 h-7 w-7 rounded-full ${isFavorite ? 'text-red-500' : 'text-gray-400'}`}
        onClick={onToggleFavorite}
      >
        <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
      </Button>
    </Card>
  );
};

export default AssetCard;
