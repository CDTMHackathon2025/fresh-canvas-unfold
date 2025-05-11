
import React, { useState, useEffect, useRef, TouchEvent } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/ui/chart";
import { 
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";
import { Calendar, ChartBar, ArrowLeft, Info, FileText, ExternalLink, ChevronDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// Sample stocks data - this would come from your API in a real app
const stocks = [
  { 
    ticker: "AAPL",
    companyName: "Apple Inc.",
    category: "Technology",
  },
  { 
    ticker: "MSFT",
    companyName: "Microsoft",
    category: "Technology", 
  },
  { 
    ticker: "GOOGL",
    companyName: "Alphabet",
    category: "Technology",
  },
  { 
    ticker: "AMZN",
    companyName: "Amazon",
    category: "E-Commerce",
  },
  { 
    ticker: "BTC",
    companyName: "Bitcoin",
    category: "Cryptocurrency",
  },
  { 
    ticker: "ETH",
    companyName: "Ethereum",
    category: "Cryptocurrency",
  }
];

// Sample performance data for different time periods
const performanceData = {
  day: [
    { time: "9:30", price: 185.2 },
    { time: "10:30", price: 186.4 },
    { time: "11:30", price: 185.8 },
    { time: "12:30", price: 187.2 },
    { time: "13:30", price: 186.9 },
    { time: "14:30", price: 188.3 },
    { time: "15:30", price: 189.5 },
    { time: "16:00", price: 190.2 },
  ],
  week: [
    { time: "Mon", price: 183.5 },
    { time: "Tue", price: 185.4 },
    { time: "Wed", price: 184.2 },
    { time: "Thu", price: 186.7 },
    { time: "Fri", price: 190.2 },
  ],
  month: [
    { time: "Week 1", price: 178.3 },
    { time: "Week 2", price: 182.6 },
    { time: "Week 3", price: 185.2 },
    { time: "Week 4", price: 190.2 },
  ],
  year: [
    { time: "Jan", price: 150.2 },
    { time: "Feb", price: 155.8 },
    { time: "Mar", price: 162.4 },
    { time: "Apr", price: 158.9 },
    { time: "May", price: 165.3 },
    { time: "Jun", price: 172.1 },
    { time: "Jul", price: 178.6 },
    { time: "Aug", price: 175.2 },
    { time: "Sep", price: 180.4 },
    { time: "Oct", price: 185.7 },
    { time: "Nov", price: 182.3 },
    { time: "Dec", price: 190.2 },
  ],
};

// Sample financial data
const financialData = {
  revenue: [
    { year: "2020", value: 74.2 },
    { year: "2021", value: 87.6 },
    { year: "2022", value: 96.3 },
    { year: "2023", value: 108.9 },
    { year: "2024 (Est.)", value: 115.2 },
  ],
  earnings: [
    { year: "2020", value: 16.8 },
    { year: "2021", value: 21.2 },
    { year: "2022", value: 24.6 },
    { year: "2023", value: 28.3 },
    { year: "2024 (Est.)", value: 30.5 },
  ],
};

// Sample market share data
const marketShareData = [
  { name: "Company", value: 28 },
  { name: "Competitor A", value: 22 },
  { name: "Competitor B", value: 18 },
  { name: "Competitor C", value: 15 },
  { name: "Others", value: 17 },
];

const StockDetails = () => {
  const { ticker } = useParams();
  const navigate = useNavigate();
  const [activeTimeframe, setActiveTimeframe] = useState("day");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const stockCardRef = useRef<HTMLDivElement>(null);
  
  // Find the index of the current stock in our stocks array
  useEffect(() => {
    const index = stocks.findIndex(stock => stock.ticker.toLowerCase() === ticker?.toLowerCase());
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [ticker]);

  // Handle touch start
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
    setSwiping(true);
  };
  
  // Handle touch move
  const handleTouchMove = (e: TouchEvent) => {
    if (!swiping) return;
    
    setTouchEnd(e.targetTouches[0].clientY);
    
    // Calculate the direction
    if (touchStart - e.targetTouches[0].clientY > 50) {
      setSwipeDirection('down');
    } else if (touchStart - e.targetTouches[0].clientY < -50) {
      setSwipeDirection('up');
    }
  };
  
  // Handle touch end
  const handleTouchEnd = () => {
    if (!swiping) return;
    
    // Minimum swipe distance
    const minSwipeDistance = 50;
    
    if (touchStart - touchEnd > minSwipeDistance && swipeDirection === 'down') {
      // Swiped up (for next stock)
      handleNextStock();
    }
    
    if (touchStart - touchEnd < -minSwipeDistance && swipeDirection === 'up') {
      // Swiped down (for previous stock)
      handlePrevStock();
    }
    
    setSwiping(false);
    setSwipeDirection(null);
  };
  
  const handleNextStock = () => {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= stocks.length) {
      nextIndex = 0;
    }
    navigate(`/stock/${stocks[nextIndex].ticker}`);
    
    // Show toast notification
    toast({
      title: "Next Stock",
      description: `Viewing ${stocks[nextIndex].companyName}`,
    });
  };
  
  const handlePrevStock = () => {
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = stocks.length - 1;
    }
    navigate(`/stock/${stocks[prevIndex].ticker}`);
    
    // Show toast notification
    toast({
      title: "Previous Stock",
      description: `Viewing ${stocks[prevIndex].companyName}`,
    });
  };

  // Generate mock stock data for the current selected stock
  const generateStockData = (ticker: string | undefined) => {
    const stock = stocks.find(s => s.ticker.toLowerCase() === ticker?.toLowerCase()) || 
                 { ticker: "AAPL", companyName: "Apple Inc.", category: "Technology" };
    
    // For Apple-Stocks specific case from updates page
    const isAppleStocksFromUpdates = ticker === "Apple-Stocks";
    
    return {
      companyName: isAppleStocksFromUpdates ? "Apple Inc." : (stock?.companyName || "Unknown Company"),
      ticker: isAppleStocksFromUpdates ? "AAPL" : (stock?.ticker || "UNKN"),
      price: 190.22 + Math.random() * 10 - 5,
      change: "+2.35",
      changePercent: "+1.25%",
      category: isAppleStocksFromUpdates ? "Technology" : (stock?.category || "Stocks"),
      sentiment: "positive",
      companyInfo: {
        name: isAppleStocksFromUpdates ? "Apple Inc." : (stock?.companyName || "Unknown Company"),
        description: `${isAppleStocksFromUpdates ? "Apple Inc." : (stock?.companyName || "This company")} is a leading ${isAppleStocksFromUpdates ? "technology" : (stock?.category?.toLowerCase() || "technology")} firm specializing in innovative solutions across various sectors. With a global presence and strong market position, they continue to drive industry standards and deliver exceptional shareholder value through consistent growth and strategic acquisitions.`,
        sector: isAppleStocksFromUpdates ? "Technology" : (stock?.category || "Technology"),
        headquarters: isAppleStocksFromUpdates ? "Cupertino, California" : (
                     stock?.ticker === "AAPL" ? "Cupertino, California" : 
                     stock?.ticker === "MSFT" ? "Redmond, Washington" : 
                     stock?.ticker === "GOOGL" ? "Mountain View, California" : 
                     stock?.ticker === "AMZN" ? "Seattle, Washington" : 
                     stock?.ticker === "BTC" || stock?.ticker === "ETH" ? "Decentralized" : "Unknown"),
        founded: isAppleStocksFromUpdates ? "1976" : (
                 stock?.ticker === "AAPL" ? "1976" : 
                 stock?.ticker === "MSFT" ? "1975" : 
                 stock?.ticker === "GOOGL" ? "1998" : 
                 stock?.ticker === "AMZN" ? "1994" : 
                 stock?.ticker === "BTC" ? "2009" : 
                 stock?.ticker === "ETH" ? "2015" : "Unknown"),
        employees: isAppleStocksFromUpdates ? "154,000+" : (
                   stock?.ticker === "AAPL" ? "154,000+" : 
                   stock?.ticker === "MSFT" ? "221,000+" : 
                   stock?.ticker === "GOOGL" ? "156,000+" : 
                   stock?.ticker === "AMZN" ? "1,540,000+" : 
                   stock?.ticker === "BTC" || stock?.ticker === "ETH" ? "Decentralized Network" : "Unknown"),
        ceo: isAppleStocksFromUpdates ? "Tim Cook" : (
             stock?.ticker === "AAPL" ? "Tim Cook" : 
             stock?.ticker === "MSFT" ? "Satya Nadella" : 
             stock?.ticker === "GOOGL" ? "Sundar Pichai" : 
             stock?.ticker === "AMZN" ? "Andy Jassy" : 
             stock?.ticker === "BTC" || stock?.ticker === "ETH" ? "None (Decentralized)" : "Unknown"),
        website: isAppleStocksFromUpdates ? "apple.com" : (
                 stock?.ticker === "AAPL" ? "apple.com" : 
                 stock?.ticker === "MSFT" ? "microsoft.com" : 
                 stock?.ticker === "GOOGL" ? "google.com" : 
                 stock?.ticker === "AMZN" ? "amazon.com" : 
                 stock?.ticker === "BTC" ? "bitcoin.org" : 
                 stock?.ticker === "ETH" ? "ethereum.org" : "example.com")
      },
      relatedNews: [
        {
          title: isAppleStocksFromUpdates ? "Apple Inc. to Announce Q2 Earnings Next Week" : `${stock?.ticker || "Stock"} to Announce Q2 Earnings Next Week`,
          date: "May 10, 2025",
          source: "Financial Times",
          summary: isAppleStocksFromUpdates ? "Analysts expect strong performance following recent product launches and market expansion." : 
                  `Analysts expect strong performance following recent ${stock?.ticker === "BTC" || stock?.ticker === "ETH" ? "market trends" : "product launches"} and market expansion.`,
          imageUrl: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=600&q=80",
          fullArticleUrl: "https://example.com/article1"
        },
        {
          title: isAppleStocksFromUpdates ? "Apple Inc. Considers Strategic Acquisition in Expanding Market" : 
                 `${stock?.ticker || "Company"} Considers Strategic ${stock?.ticker === "BTC" || stock?.ticker === "ETH" ? "Partnership" : "Acquisition"} in Expanding Market`,
          date: "May 5, 2025",
          source: "Bloomberg",
          summary: `Sources familiar with the matter suggest negotiations are in advanced stages for a major market expansion.`,
          imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=600&q=80",
          fullArticleUrl: "https://example.com/article2"
        },
        {
          title: isAppleStocksFromUpdates ? "Industry Analysis: What Apple's Recent Moves Mean for the Tech Sector" : 
                 `Industry Analysis: What ${stock?.ticker || "Company"}'s Recent Moves Mean for the Sector`,
          date: "April 28, 2025",
          source: "Wall Street Journal",
          summary: "Experts weigh in on how recent strategic decisions could impact the broader market landscape.",
          imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&h=600&q=80",
          fullArticleUrl: "https://example.com/article3"
        },
      ]
    };
  };

  const stockData = generateStockData(ticker);
  
  const isPositive = true; // Could be dynamically determined based on stock performance
  const sentimentColor = isPositive ? "text-green-500" : "text-red-500";
  const chartColor = isPositive ? "#22c55e" : "#ef4444";
  const gradientColor = isPositive ? "#22c55e" : "#ef4444";

  if (!ticker) {
    navigate('/');
    return null;
  }
  
  // Determine if it's the first or last stock
  const isFirstStock = currentIndex === 0;
  const isLastStock = currentIndex === stocks.length - 1;
  
  return (
    <div 
      className="min-h-screen relative z-10 bg-black"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={stockCardRef}
    >
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-black border-b border-gray-700 px-4 py-3 flex items-center">
        <Link to="/" className="mr-4">
          <Button variant="ghost" size="icon" className="rounded-full text-white">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white">{stockData.companyName}</h1>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-white">{stockData.ticker}</span>
            <span className="text-gray-400">{stockData.category}</span>
            <span className={sentimentColor}>{stockData.changePercent}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="px-4 pb-24 text-white">
        {/* Price and Chart section */}
        <section className="py-6 space-y-6">
          <div className="flex justify-between items-baseline">
            <h2 className="text-3xl font-bold">${stockData.price.toFixed(2)}</h2>
            <div className={`${sentimentColor} text-xl font-medium`}>
              {stockData.change} ({stockData.changePercent})
            </div>
          </div>
          
          {/* Chart */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              {["day", "week", "month", "year"].map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={activeTimeframe === timeframe ? "default" : "outline"}
                  onClick={() => setActiveTimeframe(timeframe)}
                  className={`text-xs h-9 ${
                    activeTimeframe === timeframe 
                    ? "bg-gray-700/50 text-white" 
                    : "bg-transparent text-white border-gray-700 hover:bg-gray-700/30"
                  }`}
                >
                  {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
                </Button>
              ))}
            </div>
            
            <Card className="p-4 h-[300px] bg-black border border-gray-700">
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData[activeTimeframe as keyof typeof performanceData]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={gradientColor} stopOpacity={0.2}/>
                        <stop offset="95%" stopColor={gradientColor} stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                    <XAxis dataKey="time" axisLine={false} tickLine={false} stroke="#999" />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      domain={['auto', 'auto']}
                      tickFormatter={(value) => `$${value}`}
                      stroke="#999"
                    />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, "Price"]}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke={chartColor} 
                      strokeWidth={2} 
                      fillOpacity={1} 
                      fill="url(#colorPrice)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </section>
        
        {/* Company info section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-white" />
            <h2 className="text-xl font-bold">Company Information</h2>
          </div>
          
          <Card className="p-5 bg-black border border-gray-700">
            <h3 className="font-semibold mb-3 text-white">About {stockData.companyInfo.name}</h3>
            <p className="text-gray-400 mb-6">{stockData.companyInfo.description}</p>
            
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-sm text-gray-400">Sector</p>
                <p className="font-medium text-white">{stockData.companyInfo.sector}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Headquarters</p>
                <p className="font-medium text-white">{stockData.companyInfo.headquarters}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Founded</p>
                <p className="font-medium text-white">{stockData.companyInfo.founded}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Employees</p>
                <p className="font-medium text-white">{stockData.companyInfo.employees}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">CEO</p>
                <p className="font-medium text-white">{stockData.companyInfo.ceo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Website</p>
                <a href="#" className="font-medium text-blue-400 flex items-center">
                  {stockData.companyInfo.website}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          </Card>
        </section>
        
        {/* Financial Performance */}
        <section className="space-y-6 mt-8">
          <div className="flex items-center gap-2">
            <ChartBar className="h-5 w-5 text-white" />
            <h2 className="text-xl font-bold">Financial Performance</h2>
          </div>

          <Tabs defaultValue="revenue" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 bg-gray-700/50">
              <TabsTrigger value="revenue" className="text-white data-[state=active]:bg-black data-[state=active]:text-white">Revenue</TabsTrigger>
              <TabsTrigger value="earnings" className="text-white data-[state=active]:bg-black data-[state=active]:text-white">Earnings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revenue" className="mt-0">
              <Card className="p-4 h-[250px] bg-black border border-gray-700">
                <div className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialData.revenue} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} stroke="#999" />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tickFormatter={(value) => `$${value}B`}
                        stroke="#999"
                      />
                      <Tooltip 
                        formatter={(value) => [`$${value}B`, "Revenue"]}
                      />
                      <Bar dataKey="value" fill="#666" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>
            
            <TabsContent value="earnings" className="mt-0">
              <Card className="p-4 h-[250px] bg-black border border-gray-700">
                <div className="h-full w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financialData.earnings} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                      <XAxis dataKey="year" axisLine={false} tickLine={false} stroke="#999" />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tickFormatter={(value) => `$${value}B`}
                        stroke="#999"
                      />
                      <Tooltip 
                        formatter={(value) => [`$${value}B`, "Earnings"]}
                      />
                      <Bar dataKey="value" fill="#666" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Related News Section */}
        <section className="space-y-6 mt-8">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-white" />
            <h2 className="text-xl font-bold">Related News</h2>
          </div>
          
          <div className="space-y-6">
            {stockData.relatedNews.map((news: any, index: number) => (
              <Card key={index} className="overflow-hidden bg-black border border-gray-700">
                <div className="h-40 overflow-hidden">
                  <img 
                    src={news.imageUrl} 
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-white">{news.title}</h3>
                  <div className="flex items-center text-xs text-gray-400 mt-1 mb-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{news.date} • {news.source}</span>
                  </div>
                  <p className="text-sm text-gray-400">{news.summary}</p>
                  <div className="flex justify-end mt-3">
                    <a 
                      href={news.fullArticleUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm flex items-center text-blue-400"
                    >
                      Read more <ArrowLeft className="h-4 w-4 ml-1 rotate-180" />
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Swipe indicator */}
      <div className="fixed bottom-4 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-black/70 text-white text-xs px-4 py-2 rounded-full flex items-center">
          <ChevronDown className="h-4 w-4 mr-1" />
          Swipe down for next stock
        </div>
      </div>
      
      {/* Position Indicator */}
      <div className="fixed bottom-16 right-4 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
        {currentIndex + 1}/{stocks.length}
      </div>
    </div>
  );
};

export default StockDetails;
