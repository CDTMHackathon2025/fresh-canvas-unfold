
import React, { useState } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import StockDetailsModal from "@/components/StockDetailsModal";

const ViewDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data for the view details page
  const detailsData = {
    title: "Clean Energy Revolution",
    summary: "Renewable energy stocks surge as global demand for sustainable energy solutions increases. Analysts predict continued growth in this sector over the next decade.",
    category: "Market Trend",
    date: "May 10, 2025",
    author: "Financial Analyst Team",
    imageUrl: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&h=800&q=80",
    relatedStocks: [
      {
        name: "Green Power Co.",
        ticker: "GPC",
        change: "+5.3%",
        sentiment: "positive" as const
      },
      {
        name: "Solar Tech Inc.",
        ticker: "STI",
        change: "+3.8%",
        sentiment: "positive" as const
      },
      {
        name: "Battery Storage",
        ticker: "BST",
        change: "-1.2%",
        sentiment: "negative" as const
      }
    ],
    content: "The renewable energy sector has seen significant growth in recent months, with major companies investing billions in green technology. Wind and solar power installations have doubled year over year, and government incentives continue to drive adoption.\n\nInvestors seeking long-term growth opportunities are increasingly looking to clean energy stocks as a way to capitalize on this global shift. ESG-focused funds have reported record inflows, particularly from millennial investors concerned about climate impact.\n\nAnalysts at major firms have raised their price targets for several key players in the space, citing improved technology, decreasing costs of production, and supportive regulatory environments across major markets."
  };

  // State for stock modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<null | {
    title: string;
    ticker: string;
    category: string;
    sentiment: "positive" | "negative" | "neutral";
    change: string;
  }>(null);

  const handleStockClick = (stock: any) => {
    setSelectedStock({
      title: stock.name,
      ticker: stock.ticker,
      category: "Energy",
      sentiment: stock.sentiment,
      change: stock.change
    });
    setIsModalOpen(true);
  };

  // Mock data for stock details modal
  const stockModalData = {
    performance: {
      day: "+2.3%",
      week: "+5.7%",
      month: "+12.4%",
      year: "+43.2%",
      chart: ""
    },
    companyInfo: {
      name: selectedStock?.title || "",
      description: "A leading provider of renewable energy solutions focused on innovation and sustainability.",
      sector: "Energy",
      headquarters: "San Francisco, CA",
      founded: "2005",
      employees: "1,243",
      ceo: "Jane Smith",
      website: "www.example.com"
    },
    relatedNews: [
      {
        title: "Green Power Co. announces new solar farm project",
        date: "May 8, 2025",
        source: "Financial Times",
        summary: "The company secured $500M in funding for a new 300MW solar installation in Nevada."
      },
      {
        title: "Q1 Earnings exceed analyst expectations",
        date: "May 1, 2025",
        source: "Bloomberg",
        summary: "Revenue grew 27% year-over-year, with gross margins improving by 3 percentage points."
      }
    ]
  };

  return (
    <div className="pb-20 min-h-screen text-white relative z-10 bg-black">
      <Header activeTab="Details" onTabChange={() => {}} showTabs={false} />
      
      <main className="px-4 mt-24 pb-16">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full mr-2"
            onClick={() => navigate("/updates")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">View Details</h1>
        </div>

        <div className="relative h-64 w-full rounded-xl overflow-hidden mb-6">
          <img 
            src={detailsData.imageUrl} 
            alt={detailsData.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-5">
            <div className="mt-auto">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  {detailsData.category}
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  {detailsData.date}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-1">{detailsData.title}</h2>
              <p className="text-sm text-white/70">By {detailsData.author}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue={activeTab} className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-gray-700/50 rounded-xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="related-stocks">Related Stocks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="mt-6 animate-fade-in">
            <div className="bg-black border border-gray-700 rounded-xl p-5">
              <h2 className="text-lg font-semibold mb-2 text-white">Summary</h2>
              <p className="text-gray-300 mb-6">{detailsData.summary}</p>
              
              <h2 className="text-lg font-semibold mb-2 text-white">Analysis</h2>
              <p className="text-gray-300 whitespace-pre-line">{detailsData.content}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="related-stocks" className="mt-6 animate-fade-in">
            <div className="space-y-3">
              {detailsData.relatedStocks.map((stock, index) => (
                <Card 
                  key={index} 
                  className="p-4 bg-black border border-gray-700 hover:bg-gray-900 transition-colors cursor-pointer"
                  onClick={() => handleStockClick(stock)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-white">{stock.name}</h3>
                      <p className="text-sm text-gray-400">{stock.ticker}</p>
                    </div>
                    <span className={stock.sentiment === "positive" ? "text-green-500 font-semibold" : "text-red-500 font-semibold"}>
                      {stock.change}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {selectedStock && (
        <StockDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedStock.title}
          ticker={selectedStock.ticker}
          category={selectedStock.category}
          sentiment={selectedStock.sentiment}
          change={selectedStock.change}
          performance={stockModalData.performance}
          companyInfo={stockModalData.companyInfo}
          relatedNews={stockModalData.relatedNews}
        />
      )}
      
      <BottomNavigation activePage="updates" />
    </div>
  );
};

export default ViewDetails;
