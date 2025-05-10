
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PortfolioSummaryProps {
  balance: number;
  change: number;
  changePercentage: number;
}

const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  balance,
  change,
  changePercentage,
}) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm text-white rounded-3xl p-5 border border-gray-800">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-sm font-medium text-gray-300">Portfolio Balance</h3>
        <span className="bg-gray-800/60 py-1 px-3 rounded-full text-xs font-medium">Today</span>
      </div>
      
      <div className="mt-2">
        <h2 className="text-3xl font-bold">${balance.toLocaleString()}</h2>
        
        <div className="flex items-center mt-2">
          <div className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            <span className="font-semibold">
              ${Math.abs(change).toLocaleString()} ({changePercentage}%)
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-300">Stocks</span>
          <span className="text-white">66%</span>
        </div>
        <Progress value={66} className="h-1 bg-gray-800" indicatorClassName="bg-mint" />
        
        <div className="flex justify-between text-xs mb-1 mt-3">
          <span className="text-gray-300">ETFs</span>
          <span className="text-white">34%</span>
        </div>
        <Progress value={34} className="h-1 bg-gray-800" indicatorClassName="bg-white/60" />
      </div>
    </div>
  );
};

export default PortfolioSummary;
