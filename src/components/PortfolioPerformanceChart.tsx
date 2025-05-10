
import React from "react";
import { ChartContainer } from "@/components/ui/chart";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface PortfolioPerformanceChartProps {
  chartData: Array<{
    name: string;
    value: number;
  }>;
}

const PortfolioPerformanceChart: React.FC<PortfolioPerformanceChartProps> = ({ chartData }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-800">
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4AD8C5" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="#4AD8C5" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} stroke="#888" />
          <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `$${value}`} stroke="#888" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#111', borderColor: '#333' }}
            labelStyle={{ color: '#fff' }}
            itemStyle={{ color: '#4AD8C5' }}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#4AD8C5" 
            strokeWidth={2} 
            fillOpacity={1} 
            fill="url(#colorValue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioPerformanceChart;
