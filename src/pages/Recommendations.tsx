
import React, { useState } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Recommendations = () => {
  const [activeTab, setActiveTab] = useState("Recommendations");
  const navigate = useNavigate();

  return (
    <div className="pb-20 min-h-screen text-white relative z-10">
      <Header activeTab={activeTab} onTabChange={setActiveTab} showTabs={false} />
      
      <main className="px-4 mt-24 pb-16"> {/* Changed mt-16 to mt-24 for more top spacing */}
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full mr-2"
            onClick={() => navigate("/space")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Recommendations</h1>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4">Top Picks For You</h2>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      <img src={rec.imageUrl} alt={rec.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{rec.ticker}</p>
                      <p className="text-xs text-gray-400">{rec.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${rec.price}</p>
                    <p className={`text-xs ${rec.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {rec.change >= 0 ? "+" : ""}{rec.change}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-gray-800">
            <h2 className="text-lg font-semibold mb-4">Based on Your Portfolio</h2>
            <div className="space-y-4">
              {portfolioRecommendations.map((rec, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                      <img src={rec.imageUrl} alt={rec.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{rec.ticker}</p>
                      <p className="text-xs text-gray-400">{rec.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <div className="p-1 px-2 bg-gray-700 rounded-md">
                        <p className="text-xs">{rec.sector}</p>
                      </div>
                      <p className="text-sm font-semibold">${rec.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation activePage="space" />
    </div>
  );
};

// Mock data for recommendations
const recommendations = [
  {
    name: "Apple Inc.",
    ticker: "AAPL",
    price: "178.42",
    change: 1.25,
    imageUrl: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
  },
  {
    name: "Nvidia Corporation",
    ticker: "NVDA",
    price: "1024.15",
    change: 2.38,
    imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80"
  },
  {
    name: "Tesla, Inc.",
    ticker: "TSLA",
    price: "182.43",
    change: -0.87,
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&h=200&q=80"
  },
  {
    name: "Amazon.com, Inc.",
    ticker: "AMZN",
    price: "186.25",
    change: 1.13,
    imageUrl: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
  }
];

// Mock data for portfolio-based recommendations
const portfolioRecommendations = [
  {
    name: "Microsoft Corporation",
    ticker: "MSFT",
    price: "416.32",
    sector: "Tech",
    imageUrl: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
  },
  {
    name: "Taiwan Semiconductor",
    ticker: "TSM",
    price: "153.87",
    sector: "Semiconductors",
    imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
  },
  {
    name: "Advanced Micro Devices",
    ticker: "AMD",
    price: "146.29",
    sector: "Semiconductors",
    imageUrl: "https://images.unsplash.com/photo-1628518744404-7adb236363cb?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80"
  }
];

export default Recommendations;
