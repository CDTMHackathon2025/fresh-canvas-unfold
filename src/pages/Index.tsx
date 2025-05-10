import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import StoriesAndInsights from "@/components/StoriesAndInsights";
import NewsTab from "@/components/news/NewsTab";
import TopSearchesTab from "@/components/news/TopSearchesTab";

const Index = () => {
  const navigate = useNavigate();
  // State for active tabs
  const [activeMainTab, setActiveMainTab] = useState("Related News");
  const [activeTrendingTab, setActiveTrendingTab] = useState("Related News");
  
  // Mock data for trending
  const trendingData = [
    {
      title: "Clean Energy",
      subtitle: "Renewable stocks surge 15%. Experts predict continued growth as global demand for sustainable energy solutions increases.",
      imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80",
      trend: "Top searches",
      id: "clean-energy-1"
    },
    {
      title: "AI Revolution",
      subtitle: "Tech giants lead innovation with breakthrough AI developments affecting market valuations across multiple sectors.",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80",
      trend: "Trending",
      id: "ai-revolution-1"
    },
    {
      title: "Commodities",
      subtitle: "Gold reaches new high amid economic uncertainty. Analysts recommend portfolio diversification with precious metals.",
      imageUrl: "https://images.unsplash.com/photo-1589218436275-85aca5b81eaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80",
      trend: "Market movers",
      id: "commodities-1"
    },
    {
      title: "Healthcare Innovation",
      subtitle: "Biotech stocks rally following breakthrough treatment announcements. Investment opportunities in medical technology sector.",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80",
      trend: "Sector focus",
      id: "healthcare-1"
    },
    {
      title: "Global Supply Chain",
      subtitle: "Logistics companies benefit from supply chain restructuring. New shipping routes open potential for trade expansion.",
      imageUrl: "https://images.unsplash.com/photo-1589293992743-f1e6a3586f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&h=300&q=80",
      trend: "Economic impact",
      id: "supply-chain-1"
    },
  ];

  const handleViewDetails = (id: string) => {
    navigate(`/details/${id}`);
  };

  return (
    <div className="pb-20 min-h-screen text-white relative z-10">
      <Header activeTab={activeMainTab} onTabChange={setActiveMainTab} showTabs={true} />
      
      <main className="px-4 mt-4 pb-16">
        <Tabs value={activeMainTab} className="w-full">
          <TabsContent value="Related News" className="mt-0 animate-fade-in">
            <NewsTab />
          </TabsContent>
          
          <TabsContent value="Top Searches" className="mt-0 animate-fade-in">
            <TopSearchesTab />
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation activePage="updates" />
    </div>
  );
};

export default Index;
