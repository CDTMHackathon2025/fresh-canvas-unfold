
import React from "react";
import { Card } from "@/components/ui/card";

// Define the investment data structure 
interface CountryInvestment {
  countryCode: string;
  countryName: string;
  investmentPercentage: number;
  color: string;
}

interface InvestmentMapProps {
  investments: CountryInvestment[];
}

const InvestmentMap: React.FC<InvestmentMapProps> = ({ investments }) => {
  return (
    <Card className="overflow-hidden rounded-xl border-none shadow-sm">
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">Global Portfolio Distribution</h3>
        <p className="text-sm text-muted-foreground mb-4">Investments by country</p>
        
        <div className="relative h-[300px] w-full bg-[#1A1F2C] rounded-lg overflow-hidden">
          {/* World Map SVG */}
          <svg className="w-full h-full" viewBox="0 0 980 500" preserveAspectRatio="xMidYMid meet">
            {/* North America */}
            <path d="M230,210 L180,210 L160,230 L150,250 L210,250 L240,230 Z" 
                  className={`${getCountryClass('US', investments)} stroke-[#222222] hover:opacity-80 cursor-pointer transition-opacity`} />
            
            {/* South America */}
            <path d="M320,300 L350,290 L360,320 L330,340 L310,320 Z" 
                  className={`${getCountryClass('BR', investments)} stroke-[#222222] hover:opacity-80 cursor-pointer transition-opacity`} />
            
            {/* Europe */}
            <path d="M480,180 L500,170 L530,180 L520,200 L500,210 L470,200 Z" 
                  className={`${getCountryClass('EU', investments)} stroke-[#222222] hover:opacity-80 cursor-pointer transition-opacity`} />
            
            {/* Africa */}
            <path d="M460,250 L490,240 L520,260 L510,290 L470,290 L450,270 Z" 
                  className={`fill-[#8E9196] stroke-[#222222] hover:opacity-80 cursor-pointer transition-opacity`} />
            
            {/* Russia */}
            <path d="M550,170 L650,170 L670,190 L600,210 L540,190 Z" 
                  className={`fill-[#8E9196] stroke-[#222222] hover:opacity-80 cursor-pointer transition-opacity`} />
            
            {/* Middle East */}
            <path d="M560,220 L590,210 L610,230 L590,250 L560,240 Z" 
                  className={`fill-[#8E9196] stroke-[#222222] hover:opacity-80 cursor-pointer transition-opacity`} />
            
            {/* India */}
            <path d="M620,240 L650,240 L660,260 L630,270 L610,260 Z" 
                  className={`${getCountryClass('IN', investments)} stroke-[#222222] hover:opacity-80 cursor-pointer transition-opacity`} />
            
            {/* China */}
            <path d="M650,200 L700,200 L720,220 L700,240 L650,230 Z" 
                  className={`${getCountryClass('CN', investments)} stroke-[#222222] hover:opacity-80 cursor-pointer transition-opacity`} />
            
            {/* Japan */}
            <path d="M730,190 L740,200 L730,210 L720,200 Z" 
                  className={`${getCountryClass('JP', investments)} stroke-[#222222] hover:opacity-80 cursor-pointer transition-opacity`} />
            
            {/* Australia */}
            <path d="M720,320 L750,320 L760,340 L740,350 L720,340 Z" 
                  className={`fill-[#8E9196] stroke-[#222222] hover:opacity-80 cursor-pointer transition-opacity`} />
          </svg>
          
          {/* Indicators for investment amounts */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-1">
            {investments.map((investment) => (
              <div key={investment.countryCode} className="flex items-center gap-2">
                <div style={{ backgroundColor: investment.color }} className="w-3 h-3 rounded-full"></div>
                <span className="text-xs font-medium text-white">{investment.countryName}: {investment.investmentPercentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

// Helper function to determine country fill color based on investment data
function getCountryClass(countryCode: string, investments: CountryInvestment[]): string {
  const investment = investments.find(inv => inv.countryCode === countryCode);
  if (investment) {
    return `fill-[${investment.color}]`;
  }
  return "fill-[#8E9196]";
}

export default InvestmentMap;
