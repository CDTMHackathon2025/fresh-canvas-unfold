
import React, { useEffect, useState } from "react";
import { Shield, Star, PiggyBank, DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const FinancialInsights = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Animation effect when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Sample data for each section
  const riskData = {
    score: 65,
    level: "Moderate",
    diversification: 72,
    volatility: 48,
    suggestion: "Consider rebalancing your tech exposure"
  };
  
  const recommendationsData = [
    { title: "Tech ETFs", reason: "Align with your growth goals", potential: "+12.5%" },
    { title: "Reduce Cash Position", reason: "Beat inflation", potential: "+3.2%" },
    { title: "Bonds Allocation", reason: "Stabilize portfolio", potential: "+5.1%" }
  ];
  
  const savingsPlansData = [
    { name: "Retirement", progress: 68, target: "$500,000", current: "$340,000" },
    { name: "Home Purchase", progress: 45, target: "$120,000", current: "$54,000" }
  ];
  
  const cashData = {
    available: "$12,450",
    emergency: "$8,500",
    invested: "$142,750",
    ratio: 8.7,
    suggestion: "Your cash position is slightly high"
  };

  return (
    <div className="space-y-6">
      {/* Risk Section */}
      <Card className={`p-4 border-none shadow-sm transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '100ms' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Shield className="h-5 w-5 text-orange-600" />
          </div>
          <h3 className="font-semibold text-lg">Risk Profile</h3>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium">Risk Score: {riskData.score}/100</span>
            <span className="text-sm font-medium text-orange-600">{riskData.level}</span>
          </div>
          <Progress value={riskData.score} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Diversification</p>
            <div className="flex items-center gap-2">
              <Progress value={riskData.diversification} className="h-1.5 flex-1" />
              <span className="text-xs font-medium">{riskData.diversification}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Volatility</p>
            <div className="flex items-center gap-2">
              <Progress value={riskData.volatility} className="h-1.5 flex-1" />
              <span className="text-xs font-medium">{riskData.volatility}%</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 border-t pt-3 border-gray-100">
          <span className="font-medium">Insight:</span> {riskData.suggestion}
        </p>
      </Card>
      
      {/* Recommendations Section */}
      <Card className={`p-4 border-none shadow-sm transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Star className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="font-semibold text-lg">Recommendations</h3>
          </div>
          <button className="text-xs text-indigo-600 font-medium flex items-center">
            View All <ArrowRight className="h-3 w-3 ml-1" />
          </button>
        </div>
        
        <div className="space-y-3">
          {recommendationsData.map((item, index) => (
            <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div>
                <h4 className="font-medium text-sm">{item.title}</h4>
                <p className="text-xs text-gray-600">{item.reason}</p>
              </div>
              <span className="text-sm font-medium text-emerald-600">{item.potential}</span>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Savings Plans Section */}
      <Card className={`p-4 border-none shadow-sm transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <PiggyBank className="h-5 w-5 text-emerald-600" />
          </div>
          <h3 className="font-semibold text-lg">Savings Plans</h3>
        </div>
        
        <div className="space-y-4">
          {savingsPlansData.map((plan, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{plan.name}</span>
                <span className="text-xs text-gray-600">
                  {plan.current} / {plan.target}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={plan.progress} className="h-2 flex-1" />
                <span className="text-xs font-medium">{plan.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Cash Position Section */}
      <Card className={`p-4 border-none shadow-sm transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg">Cash Position</h3>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mb-4">
          <div>
            <p className="text-xs text-gray-600">Available Cash</p>
            <p className="text-lg font-bold">{cashData.available}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600">Emergency Fund</p>
            <p className="text-lg font-bold">{cashData.emergency}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-600">Invested Assets</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold">{cashData.invested}</p>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {cashData.ratio}:1 Ratio
              </span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-100 pt-3">
          <div className="flex gap-2 items-start">
            <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
            <p className="text-sm text-gray-700">{cashData.suggestion}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default FinancialInsights;
