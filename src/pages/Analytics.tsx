
import React, { useState } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChartPie } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChartContainer } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ['#9b87f5', '#4AD8C5', '#FEC6A1', '#D3E4FD', '#FFDEE2'];

const Analytics = () => {
  const navigate = useNavigate();

  const positionsData = [
    { name: 'AAPL', value: 35 },
    { name: 'NVDA', value: 25 },
    { name: 'MSFT', value: 20 },
    { name: 'GOOG', value: 12 },
    { name: 'AMZN', value: 8 }
  ];

  const sectorsData = [
    { name: 'Technology', value: 47 },
    { name: 'Healthcare', value: 18 },
    { name: 'Consumer', value: 15 },
    { name: 'Financials', value: 12 },
    { name: 'Other', value: 8 }
  ];

  const typesData = [
    { name: 'Stocks', value: 65 },
    { name: 'ETFs', value: 20 },
    { name: 'Bonds', value: 10 },
    { name: 'Crypto', value: 5 }
  ];

  const geographicData = [
    { name: 'United States', value: 68 },
    { name: 'Europe', value: 17 },
    { name: 'Asia', value: 12 },
    { name: 'Other', value: 3 }
  ];

  return (
    <div className="pb-20 min-h-screen text-white relative z-10">
      <Header activeTab="Analytics" onTabChange={() => {}} showTabs={false} />
      
      <main className="px-4 mt-24 pb-16">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full mr-2"
            onClick={() => navigate("/space")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Analytics</h1>
        </div>
        
        <Tabs defaultValue="geographical" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 rounded-xl">
            <TabsTrigger value="geographical" className="text-xs sm:text-sm">
              Geographical
            </TabsTrigger>
            <TabsTrigger value="positions" className="text-xs sm:text-sm">
              Positions
            </TabsTrigger>
            <TabsTrigger value="sectors" className="text-xs sm:text-sm">
              Sectors
            </TabsTrigger>
            <TabsTrigger value="investment-types" className="text-xs sm:text-sm">
              Types
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="geographical" className="mt-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">Geographic Distribution</h2>
              <ChartContainer className="h-[300px] w-full mt-4" config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={geographicData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={3}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {geographicData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span>United States</span>
                  <span className="font-semibold">68%</span>
                </div>
                <div className="flex justify-between">
                  <span>Europe</span>
                  <span className="font-semibold">17%</span>
                </div>
                <div className="flex justify-between">
                  <span>Asia</span>
                  <span className="font-semibold">12%</span>
                </div>
                <div className="flex justify-between">
                  <span>Other</span>
                  <span className="font-semibold">3%</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="positions" className="mt-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">Position Analysis</h2>
              <ChartContainer className="h-[300px] w-full mt-4" config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={positionsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={3}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {positionsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 space-y-2">
                {positionsData.map((position, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-gray-800/50">
                    <span>{position.name}</span>
                    <span className="font-semibold">{position.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sectors" className="mt-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">Sector Distribution</h2>
              <ChartContainer className="h-[300px] w-full mt-4" config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sectorsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={3}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {sectorsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 space-y-3">
                {sectorsData.map((sector, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{sector.name}</span>
                    <span className="font-semibold">{sector.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="investment-types" className="mt-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-5 border border-gray-800">
              <h2 className="text-lg font-semibold mb-4">Investment Types</h2>
              <ChartContainer className="h-[300px] w-full mt-4" config={{}}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={typesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      fill="#8884d8"
                      paddingAngle={3}
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {typesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 space-y-3">
                {typesData.map((type, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{type.name}</span>
                    <span className="font-semibold">{type.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation activePage="space" />
    </div>
  );
};

export default Analytics;
