
import React from "react";
import { Bell, UserRound, Settings, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  showTabs?: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, showTabs = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleBellClick = () => {
    navigate("/price-alerts");
  };
  
  const handleBackClick = () => {
    navigate("/space");
  };
  
  const handleSettingsClick = () => {
    navigate("/settings");
  };
  
  // Check if we should show the back button
  // We want to show it on price-alerts and portfolio pages
  const showBackButton = ["/price-alerts", "/portfolio"].includes(location.pathname);
  
  return (
    <header className="flex justify-between items-center p-4 fixed top-0 left-0 right-0 z-20 backdrop-blur-lg bg-black/40 border-b border-white/10">
      <div className="flex items-center">
        {showBackButton && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full mr-3"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        {showTabs ? (
          <div className="flex bg-gray-200 rounded-full p-1">
            {["Related News", "Top Searches"].map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  activeTab === tab
                    ? "bg-black text-white font-medium"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        ) : (
          <h1 className="text-xl font-semibold">{activeTab}</h1>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full relative"
          onClick={handleBellClick}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-mint rounded-full"></span>
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full cursor-pointer">
              <UserRound className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <Card className="border-0">
              <CardContent className="p-0">
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">John Doe</p>
                      <p className="text-sm text-gray-500">john.doe@example.com</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    onClick={handleSettingsClick}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default Header;
