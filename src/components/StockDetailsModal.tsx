
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ArrowRight, Calendar, ChartBar, FileText, Info } from "lucide-react";

interface StockPerformance {
  day: string;
  week: string;
  month: string;
  year: string;
  chart: string;
}

interface CompanyInfo {
  name: string;
  description: string;
  sector: string;
  headquarters: string;
  founded: string;
  employees: string;
  ceo: string;
  website: string;
}

interface RelatedNews {
  title: string;
  date: string;
  source: string;
  summary: string;
}

interface StockDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  ticker?: string;
  category: string;
  sentiment: "positive" | "negative" | "neutral";
  change: string;
  performance: StockPerformance;
  companyInfo: CompanyInfo;
  relatedNews: RelatedNews[];
}

const StockDetailsModal: React.FC<StockDetailsModalProps> = ({
  isOpen,
  onClose,
  title,
  ticker,
  category,
  sentiment,
  change,
  performance,
  companyInfo,
  relatedNews
}) => {
  const sentimentColor = 
    sentiment === "positive" ? "text-green-500" : 
    sentiment === "negative" ? "text-red-500" : 
    "text-gray-500";

  const displayName = ticker ? `${companyInfo.name} (${ticker})` : companyInfo.name;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-black text-white border border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center justify-between">
            <span>{displayName}</span>
            <span className={sentimentColor}>{change}</span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {category} • {companyInfo.sector}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="performance" className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4 bg-gray-700/50">
            <TabsTrigger value="performance" className="flex items-center gap-1 text-white data-[state=active]:bg-black data-[state=active]:text-white">
              <ChartBar className="h-4 w-4" /> Performance
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-1 text-white data-[state=active]:bg-black data-[state=active]:text-white">
              <Info className="h-4 w-4" /> Company
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-1 text-white data-[state=active]:bg-black data-[state=active]:text-white">
              <FileText className="h-4 w-4" /> News
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 bg-black border border-gray-700">
                <div className="text-sm text-gray-400">24h Change</div>
                <div className={`text-lg font-semibold ${sentimentColor}`}>{performance.day}</div>
              </Card>
              <Card className="p-3 bg-black border border-gray-700">
                <div className="text-sm text-gray-400">Week</div>
                <div className={`text-lg font-semibold ${sentimentColor}`}>{performance.week}</div>
              </Card>
              <Card className="p-3 bg-black border border-gray-700">
                <div className="text-sm text-gray-400">Month</div>
                <div className={`text-lg font-semibold ${sentimentColor}`}>{performance.month}</div>
              </Card>
              <Card className="p-3 bg-black border border-gray-700">
                <div className="text-sm text-gray-400">Year</div>
                <div className={`text-lg font-semibold ${sentimentColor}`}>{performance.year}</div>
              </Card>
            </div>
            
            <Card className="p-4 bg-black border border-gray-700">
              <h3 className="text-sm font-medium mb-2 text-white">Performance Chart</h3>
              <div className="bg-gray-800/30 rounded-md h-[200px] flex items-center justify-center">
                <span className="text-gray-400">Chart visualization would appear here</span>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="company" className="space-y-4">
            <Card className="p-4 bg-black border border-gray-700">
              <h3 className="font-semibold mb-2 text-white">About {companyInfo.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{companyInfo.description}</p>
              
              <div className="space-y-2">
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-400">Sector</span>
                  <span className="text-white">{companyInfo.sector}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-400">Headquarters</span>
                  <span className="text-white">{companyInfo.headquarters}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-400">Founded</span>
                  <span className="text-white">{companyInfo.founded}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-400">Employees</span>
                  <span className="text-white">{companyInfo.employees}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-400">CEO</span>
                  <span className="text-white">{companyInfo.ceo}</span>
                </div>
                <div className="grid grid-cols-2 text-sm">
                  <span className="text-gray-400">Website</span>
                  <span className="text-blue-400 underline">{companyInfo.website}</span>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="news" className="space-y-3">
            {relatedNews.map((news, index) => (
              <Card key={index} className="p-3 bg-black border border-gray-700">
                <h4 className="font-medium text-sm text-white">{news.title}</h4>
                <div className="flex items-center text-xs text-gray-400 mt-1 mb-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{news.date} • {news.source}</span>
                </div>
                <p className="text-xs text-gray-400">{news.summary}</p>
                <div className="flex justify-end mt-2">
                  <div className="text-xs flex items-center text-blue-400 cursor-pointer">
                    Read more <ArrowRight className="h-3 w-3 ml-1" />
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default StockDetailsModal;
