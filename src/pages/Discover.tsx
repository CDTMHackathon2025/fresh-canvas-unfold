
import React, { useState } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import SearchSection from "@/components/SearchSection";
import FavoritesSection from "@/components/FavoritesSection";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const Discover = () => {
  // State for active tabs - defaulting to Search since we've removed News and Top Searches
  const [activeMainTab, setActiveMainTab] = useState("Search");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  // Handle adding/removing favorites
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(item => item !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <PageLayout>
      <div className="pb-20 min-h-screen animate-fade-in">
        <Header activeTab={activeMainTab} onTabChange={setActiveMainTab} showTabs={false} />
        
        <div className="px-4 py-3 sticky top-0 z-10 bg-black/50 backdrop-blur-sm shadow-md pt-24">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search stocks, ETFs, crypto..."
              className="pr-10 bg-gray-800/70 border-gray-700 text-white placeholder:text-gray-400 rounded-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>
        
        <main className="px-4 mt-2 pb-16">
          <Tabs value={activeMainTab} className="w-full">
            <TabsContent value="Search" className="mt-0 animate-fade-in">
              <SearchSection 
                searchQuery={searchQuery} 
                favorites={favorites} 
                onToggleFavorite={toggleFavorite} 
              />
            </TabsContent>
            <TabsContent value="Favorites" className="mt-0 animate-fade-in">
              <FavoritesSection 
                favorites={favorites} 
                onToggleFavorite={toggleFavorite} 
              />
            </TabsContent>
          </Tabs>
        </main>
        
        <BottomNavigation activePage="discover" />
      </div>
    </PageLayout>
  );
};

export default Discover;
