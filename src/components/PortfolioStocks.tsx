
import React from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import SectionTitle from "@/components/SectionTitle";
import StockCard from "@/components/StockCard";

interface StockData {
  companyName: string;
  ticker: string;
  price: number;
  change: number;
  changePercentage: number;
  logoUrl: string;
  imageUrl: string;
}

interface PortfolioStocksProps {
  stocksData: StockData[];
  activeStockTab: string;
  setActiveStockTab: (tab: string) => void;
}

const PortfolioStocks: React.FC<PortfolioStocksProps> = ({ 
  stocksData,
  activeStockTab, 
  setActiveStockTab 
}) => {
  return (
    <div>
      <SectionTitle 
        title="Your Portfolio"
        subtitle="May 10, 2025" 
        tabs={["Today", "This Week", "This Month"]}
        activeTab={activeStockTab}
        onTabChange={setActiveStockTab}
      />
      
      <Tabs value={activeStockTab} className="w-full">
        <TabsContent value="Today" className="mt-0">
          <div className="space-y-4 animate-fade-in">
            {stocksData.map((stock, index) => (
              <StockCard key={index} {...stock} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="This Week" className="mt-0">
          <div className="space-y-4 animate-fade-in">
            {stocksData.slice().reverse().map((stock, index) => (
              <StockCard key={index} {...stock} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="This Month" className="mt-0">
          <div className="space-y-4 animate-fade-in">
            {stocksData.slice(1).map((stock, index) => (
              <StockCard key={index} {...stock} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioStocks;
