
import React, { useState } from "react";
import BottomNavigation from "@/components/BottomNavigation";
import Header from "@/components/Header";
import { Rocket, ChartPie, Activity, LineChart, PiggyBank, Target, Star, Briefcase, Bitcoin, Wallet, User } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

const Portfolio = () => {
  // State to manage the investment dialog
  const [isInvestmentOpen, setIsInvestmentOpen] = useState(false);
  
  // Dashboard menu items with icons (updated by removing Risk and Performance)
  const dashboardItems = [
    { name: "Analytics", icon: <Activity className="h-6 w-6" />, path: "/analytics" },
    { name: "Portfolio", icon: <ChartPie className="h-6 w-6" />, path: "/portfolio" },
    { name: "Saving Plans", icon: <PiggyBank className="h-6 w-6" />, path: "/savings" },
    { name: "Goals", icon: <Target className="h-6 w-6" />, path: "/goals" },
    { name: "Recommendations", icon: <Star className="h-6 w-6" />, path: "/recommendations" }
  ];

  // Investment options
  const investmentOptions = [
    { name: "Cash", icon: <Briefcase className="h-12 w-12" />, path: "/cash" },
    { name: "Stock", icon: <ChartPie className="h-12 w-12" />, path: "/stock" },
    { name: "Crypto", icon: <Bitcoin className="h-12 w-12" />, path: "/crypto" }
  ];

  return (
    <>
      <Header activeTab="Trading Space" onTabChange={() => {}} showTabs={false} />
      
      <main className="px-4 mt-0 pb-10 pt-16 relative z-10">
        {/* Space Dashboard - Make it vertically centered in the page */}
        <div className="w-full h-[75vh] flex items-center justify-center relative">
          {/* Orbital Circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Inner orbital circle */}
            <div className="absolute w-[40%] h-[40%] rounded-full border border-white/20 animate-[spin_25s_linear_infinite]"></div>
            
            {/* Middle orbital circle */}
            <div className="absolute w-[60%] h-[60%] rounded-full border border-white/15 animate-[spin_40s_linear_infinite_reverse]"></div>
            
            {/* Outer orbital circle */}
            <div className="absolute w-[80%] h-[80%] rounded-full border border-white/10 animate-[spin_60s_linear_infinite]"></div>
          </div>

          {/* Central Rocket with Dialog */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="z-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 hover:scale-110 cursor-pointer bg-gradient-to-br from-gray-300 to-white rounded-full p-8 shadow-lg hover:shadow-[0_0_30px_8px_rgba(247,115,22,0.6)]">
                <Rocket size={48} className="text-gray-800" />
              </div>
            </DialogTrigger>
            <DialogContent className="bg-black border-gray-700 text-white">
              <DialogHeader>
                <DialogTitle className="text-center text-2xl font-bold mb-6">Your Portfolio</DialogTitle>
              </DialogHeader>
              
              {/* Portfolio Summary Information */}
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-center">$15,742.89</h2>
                <p className="text-green-500 text-center font-medium mt-1">+$243.15 (1.57%) today</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center bg-gray-800/60 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2.5 rounded-full">
                      <Wallet className="h-5 w-5 text-blue-600" />
                    </div>
                    <span>Available Cash</span>
                  </div>
                  <span className="font-medium">$2,850.75</span>
                </div>
                
                <div className="flex justify-between items-center bg-gray-800/60 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2.5 rounded-full">
                      <User className="h-5 w-5 text-purple-600" />
                    </div>
                    <span>Total Invested</span>
                  </div>
                  <span className="font-medium">$12,892.14</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {investmentOptions.map((option) => (
                  <Link 
                    key={option.name}
                    to={option.path} 
                    className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl transition-all duration-300 hover:scale-105 hover:from-gray-700 hover:to-gray-800"
                  >
                    <div className="bg-gradient-to-br from-gray-300 to-white rounded-full p-4 mb-3">
                      {React.cloneElement(option.icon, { className: "text-gray-800" })}
                    </div>
                    <span className="font-medium">{option.name}</span>
                  </Link>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Perfect Circle Container for Navigation Nodes */}
          <div className="absolute w-full h-full">
            {dashboardItems.map((item, index) => {
              // Calculate position in perfect circle
              const totalItems = dashboardItems.length;
              // Start angle from top (270 degrees or -90 degrees in radians)
              const startAngle = -Math.PI / 2;
              // Calculate angle for current item (distribute evenly around the circle)
              const angleStep = (2 * Math.PI) / totalItems;
              const angle = startAngle + (index * angleStep);
              
              // Circle radius as percentage of container
              const radius = 40; 
              
              // Calculate position (center is 50%, 50%)
              const left = 50 + radius * Math.cos(angle);
              const top = 50 + radius * Math.sin(angle);
              
              return (
                <Link 
                  to={item.path} 
                  key={item.name}
                  className="absolute z-10 flex flex-col items-center transition-transform duration-300 hover:scale-125"
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  <div className="bg-gradient-to-br from-gray-300 to-white rounded-full p-3 shadow-lg mb-2 hover:shadow-[0_0_15px_5px_rgba(155,135,245,0.6)]">
                    {React.cloneElement(item.icon, { className: "h-6 w-6 text-gray-800" })}
                  </div>
                  <span className="text-xs font-medium text-white whitespace-nowrap shadow-sm">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      
      <BottomNavigation activePage="space" />
    </>
  );
};

export default Portfolio;
