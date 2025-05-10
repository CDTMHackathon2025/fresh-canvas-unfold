
import React from "react";
import SectionTitle from "@/components/SectionTitle";
import AssetCard from "@/components/AssetCard";

interface FavoritesSectionProps {
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({ favorites, onToggleFavorite }) => {
  // Combined mock data from all asset types
  const allAssets = [
    // Stocks
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
    // ETFs
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
    // Cryptos
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
  
  // Filter to show only favorited assets
  const favoriteAssets = allAssets.filter(asset => favorites.includes(asset.id));

  return (
    <div>
      <SectionTitle title="Your Favorites" />
      
      {favoriteAssets.length > 0 ? (
        <div className="space-y-4">
          {favoriteAssets.map(asset => (
            <AssetCard
              key={asset.id}
              asset={asset}
              isFavorite={true}
              onToggleFavorite={() => onToggleFavorite(asset.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-4">
          <p className="text-gray-500 mb-2">You haven't added any favorites yet</p>
          <p className="text-gray-400 text-sm">Browse stocks, ETFs and crypto assets, and tap the heart icon to add them to your favorites</p>
        </div>
      )}
    </div>
  );
};

export default FavoritesSection;
