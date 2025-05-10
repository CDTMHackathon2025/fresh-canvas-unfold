import React, { useState } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import TodayContent from "@/components/TodayContent";

const PortfolioPage = () => {
  // State for active tabs
  const [activeStockTab, setActiveStockTab] = useState("Today");
  
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
    },
    {
      companyName: "Alphabet Inc.",
      ticker: "GOOGL",
      price: 129.08,
      change: 1.42,
      changePercentage: 1.11,
      logoUrl: "https://logo.clearbit.com/abc.xyz",
      imageUrl: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    },
    {
      companyName: "Tesla, Inc.",
      ticker: "TSLA",
      price: 235.76,
      change: -3.25,
      changePercentage: -1.36,
      logoUrl: "https://logo.clearbit.com/tesla.com",
      imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    },
    {
      companyName: "NVIDIA Corporation",
      ticker: "NVDA",
      price: 421.32,
      change: 8.94,
      changePercentage: 2.17,
      logoUrl: "https://logo.clearbit.com/nvidia.com",
      imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&q=80"
    }
  ];
  
  return (
    <>
      <Header activeTab="Portfolio" onTabChange={() => {}} showTabs={false} />
      
      {/* Added pt-16 for header spacing, keeping pb-20 for bottom nav */}
      <main className="container max-w-md mx-auto px-4 pt-16 pb-20">
        <TodayContent
          portfolioData={portfolioData}
          chartData={chartData}
          stocksData={stocksData}
          activeStockTab={activeStockTab}
          setActiveStockTab={setActiveStockTab}
        />
      </main>
      
      <BottomNavigation activePage="space" />
    </>
  );
};

export default PortfolioPage;
