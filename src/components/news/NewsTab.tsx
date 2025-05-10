
import React from "react";
import SectionTitle from "@/components/SectionTitle";
import NewsCardList, { NewsItem } from "@/components/news/NewsCardList";

// News data focusing on stocks, ETFs, and crypto
const newsData: NewsItem[] = [
  {
    title: "Apple Stock Surges on AI Development Announcement",
    summary: "Apple shares jumped 8% following the company's announcement of a new AI platform that will be integrated across all Apple devices, potentially opening new revenue streams.",
    imageUrl: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
    category: "Stocks",
    sentiment: "positive",
    change: "+8.2%",
    sector: "Technology"
  },
  {
    title: "Vanguard S&P 500 ETF Reaches All-Time High",
    summary: "The popular Vanguard S&P 500 ETF (VOO) hit a record high as strong corporate earnings and economic data continue to drive market optimism despite inflation concerns.",
    imageUrl: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
    category: "ETFs",
    sentiment: "positive",
    change: "+1.7%",
    sector: "Index Funds"
  },
  {
    title: "Bitcoin Breaks $80,000 After Institutional Adoption Wave",
    summary: "Bitcoin surged past $80,000 for the first time as major financial institutions announced new cryptocurrency investment products and services targeting mainstream investors.",
    imageUrl: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
    category: "Crypto",
    sentiment: "positive",
    change: "+12.3%",
    sector: "Cryptocurrency"
  },
  {
    title: "Clean Energy ETF Gains Following Climate Policy Shift",
    summary: "The iShares Global Clean Energy ETF (ICLN) rose significantly after several key nations announced enhanced emissions targets and renewable energy subsidies at the climate summit.",
    imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
    category: "ETFs",
    sentiment: "positive",
    change: "+6.2%",
    sector: "Clean Energy"
  },
  {
    title: "Nvidia Stock Split Announced Amid AI Chip Demand",
    summary: "Nvidia announced a 10-for-1 stock split as shares continue to surge on unprecedented demand for AI chips, making the stock more accessible to retail investors.",
    imageUrl: "https://images.unsplash.com/photo-1563770660941-671a3fac6e62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
    category: "Stocks",
    sentiment: "positive",
    change: "+5.8%",
    sector: "Semiconductors"
  },
  {
    title: "Ethereum Price Volatility Following Protocol Update",
    summary: "Ethereum experienced significant price swings after implementing its latest protocol upgrade, with analysts divided on the long-term implications for transaction fees and network capacity.",
    imageUrl: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
    category: "Crypto",
    sentiment: "neutral",
    change: "-2.4%",
    sector: "Cryptocurrency"
  },
  {
    title: "ARK Innovation ETF Rebounds on Disruptive Tech Rally",
    summary: "Cathie Wood's flagship ARK Innovation ETF (ARKK) posted its best week in months as speculative technology stocks regained favor among investors seeking exposure to disruptive technologies.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
    category: "ETFs",
    sentiment: "positive",
    change: "+9.6%",
    sector: "Disruptive Tech"
  },
  {
    title: "Tesla Stock Dips After Production Challenges Report",
    summary: "Tesla shares fell after the company acknowledged supply chain constraints affecting production targets for its newest vehicle models, prompting analysts to revise delivery forecasts.",
    imageUrl: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
    category: "Stocks",
    sentiment: "negative",
    change: "-4.2%",
    sector: "Automotive"
  }
];

const NewsTab: React.FC = () => {
  return (
    <div>
      <SectionTitle title="Related Financial News" />
      <NewsCardList items={newsData} />
    </div>
  );
};

export default NewsTab;
