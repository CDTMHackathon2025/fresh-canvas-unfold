
import React, { useEffect, useState } from "react";
import PortfolioSummary from "@/components/PortfolioSummary";
import PortfolioPerformanceChart from "@/components/PortfolioPerformanceChart";

interface TodayContentProps {
  portfolioData: {
    balance: number;
    change: number;
    changePercentage: number;
  };
  chartData: Array<{
    name: string;
    value: number;
  }>;
  stocksData: Array<{
    companyName: string;
    ticker: string;
    price: number;
    change: number;
    changePercentage: number;
    logoUrl: string;
    imageUrl: string;
  }>;
  activeStockTab: string;
  setActiveStockTab: (tab: string) => void;
}

const TodayContent: React.FC<TodayContentProps> = ({
  portfolioData,
  chartData,
  stocksData,
  activeStockTab,
  setActiveStockTab
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation effect when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="space-y-6 text-white">
      <div className={`mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '100ms' }}>
        <h1 className="text-2xl font-bold mb-4">Your Portfolio</h1>
        <PortfolioSummary {...portfolioData} />
      </div>
      
      <div className={`my-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
        <h2 className="text-lg font-semibold mb-3">Performance Overview</h2>
        <PortfolioPerformanceChart chartData={chartData} />
      </div>
      
      <div className={`mt-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
        <h2 className="text-lg font-semibold mb-3">Your Investments (1D)</h2>
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-sm overflow-hidden border border-gray-800">
          <table className="w-full">
            <thead className="bg-gray-800/50 text-xs text-gray-400">
              <tr>
                <th className="py-3 px-4 text-left">Stock</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-right">1D Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {stocksData.map((stock, index) => (
                <tr key={index} className="hover:bg-gray-800/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 flex-shrink-0 mr-3">
                        <img src={stock.logoUrl} alt={stock.ticker} className="h-full w-full rounded-full" />
                      </div>
                      <div>
                        <p className="font-medium">{stock.ticker}</p>
                        <p className="text-xs text-gray-400">{stock.companyName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium">${stock.price.toFixed(2)}</span>
                  </td>
                  <td className={`py-3 px-4 text-right ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    <div className="flex items-center justify-end">
                      {stock.change >= 0 ? (
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                          </svg>
                          {stock.changePercentage.toFixed(2)}%
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                          {Math.abs(stock.changePercentage).toFixed(2)}%
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TodayContent;
