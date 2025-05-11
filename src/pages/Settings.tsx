
import React, { useState } from "react";
import { ArrowLeft, Wallet, CreditCard, BellRing, Shield, HelpCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <>
      <Header activeTab="Settings" onTabChange={() => {}} showTabs={false} />
      
      <main className="container max-w-md mx-auto px-4 pt-24 pb-20">
        <div className="space-y-6 animate-fade-in text-white">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full"
              onClick={handleBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
          
          <div className="space-y-6">
            {/* Account Information */}
            <div className="bg-gray-800/60 p-4 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-gradient-to-br from-purple-500 to-blue-600 h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold">
                  JD
                </div>
                <div>
                  <h2 className="font-semibold text-lg">John Doe</h2>
                  <p className="text-gray-400 text-sm">john.doe@example.com</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-700/50 hover:text-white"
              >
                Edit Profile
              </Button>
            </div>
            
            {/* Bank Information */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Bank Information</h2>
              <div className="bg-gray-800/60 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2.5 rounded-full">
                        <Wallet className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Chase Bank</p>
                        <p className="text-sm text-gray-400">**** **** **** 4589</p>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">Primary</span>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2.5 rounded-full">
                        <CreditCard className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium">Bank of America</p>
                        <p className="text-sm text-gray-400">**** **** **** 7123</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">Set Primary</Button>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full mt-3 bg-gray-800/80 hover:bg-gray-700 text-gray-300"
                variant="outline"
              >
                Connect New Bank Account
              </Button>
            </div>
            
            {/* Preferences */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Preferences</h2>
              <div className="bg-gray-800/60 rounded-xl overflow-hidden space-y-1">
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <BellRing className="h-5 w-5 text-gray-400" />
                    <span>Notifications</span>
                  </div>
                  <Switch 
                    checked={notifications} 
                    onCheckedChange={setNotifications}
                    className="data-[state=checked]:bg-mint"
                  />
                </div>
                <Separator className="bg-gray-700" />
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-gray-400" />
                    <span>Dark Mode</span>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                    className="data-[state=checked]:bg-mint"
                  />
                </div>
              </div>
            </div>
            
            {/* Support & Help */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Support & Help</h2>
              <div className="bg-gray-800/60 rounded-xl overflow-hidden space-y-1">
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-gray-400" />
                    <span>Help Center</span>
                  </div>
                </div>
                <Separator className="bg-gray-700" />
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <LogOut className="h-5 w-5 text-gray-400" />
                    <span className="text-red-500">Log Out</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <BottomNavigation activePage="space" />
    </>
  );
};

export default Settings;
