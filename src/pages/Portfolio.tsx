
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
  const navigate = useNavigate();
  const isVisible = useAnimatedVisibility({ delay: 300 });

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
        <TodayContent />
      </main>
      
      <BottomNavigation activePage="space" />
    </div>
  );
};

export default Portfolio;
