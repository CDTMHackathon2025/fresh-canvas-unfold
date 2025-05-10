import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AssetCard from "@/components/AssetCard";
import SectionTitle from "@/components/SectionTitle";

interface SearchSectionProps {
  searchQuery: string;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ searchQuery, favorites, onToggleFavorite }) => {
  // Mock data for stocks
  const stocksData = [
    {
      id: "stock-1",
      name: "Apple Inc.",
      ticker: "AAPL",
      price: 182.63,
      change: "+1.25",
      changePercent: "+0.69",
      imageUrl: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
      type: "stock" as const
    },
    {
      id: "stock-2",
      name: "Microsoft Corporation",
      ticker: "MSFT",
      price: 396.51,
      change: "+3.75",
      changePercent: "+0.95",
      imageUrl: "https://images.unsplash.com/photo-1633419461186-7d40a38105ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
      type: "stock" as const
    },
    {
      id: "stock-3",
      name: "Tesla Inc",
      ticker: "TSLA",
      price: 215.72,
      change: "-2.33",
      changePercent: "-1.07",
      imageUrl: "https://images.unsplash.com/photo-1620413825361-c10b9d99f126?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
      type: "stock" as const
    },
    {
      id: "stock-4",
      name: "Nvidia Corporation",
      ticker: "NVDA",
      price: 875.28,
      change: "+12.36",
      changePercent: "+1.43",
      imageUrl: "https://images.unsplash.com/photo-1563770660941-671a3fac6e62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
      type: "stock" as const
    },
  ];

  // Mock data for ETFs
  const etfsData = [
    {
      id: "etf-1",
      name: "Vanguard S&P 500 ETF",
      ticker: "VOO",
      price: 446.89,
      change: "+1.75",
      changePercent: "+0.39",
      imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
      type: "etf" as const
    },
    {
      id: "etf-2",
      name: "iShares Core S&P 500 ETF",
      ticker: "IVV",
      price: 452.06,
      change: "+1.82",
      changePercent: "+0.40",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
      type: "etf" as const
    },
    {
      id: "etf-3",
      name: "ARK Innovation ETF",
      ticker: "ARKK",
      price: 48.15,
      change: "-0.33",
      changePercent: "-0.68",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
      type: "etf" as const
    },
  ];

  // Mock data for crypto
  const cryptoData = [
    {
      id: "crypto-1",
      name: "Bitcoin",
      ticker: "BTC",
      price: 62854.21,
      change: "+1243.59",
      changePercent: "+2.02",
      imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
      type: "crypto" as const
    },
    {
      id: "crypto-2",
      name: "Ethereum",
      ticker: "ETH",
      price: 3421.76,
      change: "+45.24",
      changePercent: "+1.34",
      imageUrl: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
      type: "crypto" as const
    },
    {
      id: "crypto-3",
      name: "Solana",
      ticker: "SOL",
      price: 143.28,
      change: "-2.51",
      changePercent: "-1.72",
      imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
      type: "crypto" as const
    },
  ];

  // Filter data based on search query
  const filterData = (data: any[]) => {
    if (!searchQuery) return data;
    
    return data.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.ticker.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredStocks = filterData(stocksData);
  const filteredETFs = filterData(etfsData);
  const filteredCryptos = filterData(cryptoData);

  return (
    <div>
      <Tabs defaultValue="stocks" className="w-full">
        <div className="border-b mb-4">
          <TabsList className="w-full flex justify-between bg-transparent p-0">
            <TabsTrigger 
              value="stocks" 
              className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Stocks
            </TabsTrigger>
            <TabsTrigger 
              value="etfs" 
              className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              ETFs
            </TabsTrigger>
            <TabsTrigger 
              value="crypto" 
              className="flex-1 py-3 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Crypto
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="stocks">
          {filteredStocks.length > 0 ? (
            <div className="space-y-4">
              {filteredStocks.map(stock => (
                <AssetCard
                  key={stock.id}
                  asset={stock}
                  isFavorite={favorites.includes(stock.id)}
                  onToggleFavorite={() => onToggleFavorite(stock.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No stocks found matching your search.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="etfs">
          {filteredETFs.length > 0 ? (
            <div className="space-y-4">
              {filteredETFs.map(etf => (
                <AssetCard
                  key={etf.id}
                  asset={etf}
                  isFavorite={favorites.includes(etf.id)}
                  onToggleFavorite={() => onToggleFavorite(etf.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No ETFs found matching your search.
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="crypto">
          {filteredCryptos.length > 0 ? (
            <div className="space-y-4">
              {filteredCryptos.map(crypto => (
                <AssetCard
                  key={crypto.id}
                  asset={crypto}
                  isFavorite={favorites.includes(crypto.id)}
                  onToggleFavorite={() => onToggleFavorite(crypto.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No cryptocurrencies found matching your search.
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SearchSection;
