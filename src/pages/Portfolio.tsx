
import React, { useState } from "react";
import { Rocket, LineChart, BarChart4, PiggyBank, Target, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Card } from "@/components/ui/card";
import { useAnimatedVisibility } from "@/hooks/useAnimatedVisibility";
import TodayContent from "@/components/TodayContent";
import AnimatedNode from "@/components/AnimatedNode";

const Portfolio = () => {
  const [activeTab, setActiveTab] = useState("Space");
  const [activeStockTab, setActiveStockTab] = useState("Today");
  const navigate = useNavigate();
  const isVisible = useAnimatedVisibility({ delay: 300 });

  // Sample portfolio data
  const portfolioData = {
    balance: 15742.89,
    change: 243.15,
    changePercentage: 1.57
  };
  
  // Sample chart data for portfolio performance
  const chartData = [
    { name: 'Jan', value: 12000 },
    { name: 'Feb', value: 12800 },
    { name: 'Mar', value: 12400 },
    { name: 'Apr', value: 13200 },
    { name: 'May', value: 14500 },
    { name: 'Jun', value: 14800 },
    { name: 'Jul', value: 15300 },
    { name: 'Aug', value: 15100 },
    { name: 'Sep', value: 15500 },
    { name: 'Oct', value: 15742 }
  ];
  
  // Sample stocks data
  const stocksData = [
    {
      companyName: "Apple Inc.",
      ticker: "AAPL",
      price: 178.42,
      change: 2.35,
      changePercentage: 1.33,
      logoUrl: "https://logo.clearbit.com/apple.com",
      imageUrl: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    },
    {
      companyName: "Microsoft Corporation",
      ticker: "MSFT",
      price: 348.10,
      change: 5.76,
      changePercentage: 1.68,
      logoUrl: "https://logo.clearbit.com/microsoft.com",
      imageUrl: "https://images.unsplash.com/photo-1642059893618-146beb03f331?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    },
    {
      companyName: "Amazon.com, Inc.",
      ticker: "AMZN",
      price: 126.11,
      change: -0.93,
      changePercentage: -0.73,
      logoUrl: "https://logo.clearbit.com/amazon.com",
      imageUrl: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div className="pb-20 min-h-screen text-white relative z-10">
      <Header activeTab={activeTab} onTabChange={setActiveTab} showTabs={true} />
      
      <main className="px-4 mt-4 pb-16">
        {/* Trading Space Visualization */}
        <div className={`mb-8 transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <h2 className="text-xl font-bold mb-6 text-center">Trading Space</h2>
          
          <div className="relative h-[400px] flex items-center justify-center">
            {/* Trading nodes */}
            <div className="absolute top-1/4 left-[15%]">
              <AnimatedNode 
                title="Portfolio" 
                icon={<BarChart4 className="text-mint h-6 w-6" />} 
                route="/portfolio"
                glowColor="rgba(74, 216, 197, 0.6)"
              />
            </div>
            
            <div className="absolute top-1/2 left-[30%] transform -translate-y-1/2">
              <AnimatedNode 
                title="Savings Plans" 
                icon={<PiggyBank className="text-mint h-6 w-6" />} 
                route="/savings"
                glowColor="rgba(132, 204, 22, 0.6)"
              />
            </div>
            
            <div className="absolute bottom-1/4 left-[20%]">
              <AnimatedNode 
                title="Goals" 
                icon={<Target className="text-mint h-6 w-6" />} 
                route="/goals"
                glowColor="rgba(234, 88, 12, 0.6)"
              />
            </div>
            
            {/* Swapped positions: Recommendations now on top right, Analytics on bottom right */}
            <div className="absolute top-1/4 right-[15%]">
              <AnimatedNode 
                title="Recommendations" 
                icon={<Star className="text-mint h-6 w-6" />} 
                route="/recommendations"
                glowColor="rgba(251, 191, 36, 0.6)"
              />
            </div>
            
            <div className="absolute bottom-1/4 right-[20%]">
              <AnimatedNode 
                title="Analytics" 
                icon={<LineChart className="text-mint h-6 w-6" />} 
                route="/analytics"
                glowColor="rgba(56, 189, 248, 0.6)"
              />
            </div>
            
            {/* Central rocket */}
            <div 
              onClick={() => navigate("/space")}
              className="cursor-pointer transition-all duration-300 transform hover:scale-110"
            >
              <div className="rounded-full bg-navy p-8 rocket-glow">
                <Rocket className="text-mint h-12 w-12" />
              </div>
              <div className="text-center mt-2">
                <span className="font-medium text-sm">My Portfolio</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Today's Highlights */}
        <TodayContent 
          portfolioData={portfolioData}
          chartData={chartData}
          stocksData={stocksData}
          activeStockTab={activeStockTab}
          setActiveStockTab={setActiveStockTab}
        />
      </main>
      
      <BottomNavigation activePage="space" />
    </div>
  );
};

export default Portfolio;
