
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StockCardProps {
  companyName: string;
  ticker: string;
  price: number;
  change: number;
  changePercentage: number;
  logoUrl: string;
  imageUrl: string;
}

const StockCard: React.FC<StockCardProps> = ({
  companyName,
  ticker,
  price,
  change,
  changePercentage,
  logoUrl,
  imageUrl,
}) => {
  const isPositive = change >= 0;
  
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm border mb-4">
      <div className="image-overlay h-36">
        <img 
          src={imageUrl} 
          alt={companyName} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <div className="flex items-center">
            <div className="bg-white rounded-full h-8 w-8 flex items-center justify-center mr-2">
              <img src={logoUrl} alt={`${ticker} logo`} className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-shadow">{companyName}</h3>
              <p className="text-xs text-white/90 text-shadow">{ticker}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-bold">${price}</span>
          </div>
          
          <div className={`flex items-center ${isPositive ? 'text-profit' : 'text-loss'}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="font-medium">
              {changePercentage}%
            </span>
          </div>
        </div>
        
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          Quarterly earnings exceeded expectations, with revenue growth driven by expansion in new markets.
        </p>
      </div>
    </div>
  );
};

export default StockCard;
