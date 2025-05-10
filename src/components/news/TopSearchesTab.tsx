
import React from "react";
import SectionTitle from "@/components/SectionTitle";
import NewsCardList, { NewsItem } from "@/components/news/NewsCardList";

// Top searches data
const topSearchesData: NewsItem[] = [
  {
    title: "AI Computing Revolution",
    summary: "Artificial intelligence stocks surge as new chip architectures promise 10x performance gains. Investors flock to semiconductor leaders and AI infrastructure providers.",
    imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
    category: "Tech Sector",
    sentiment: "positive",
    change: "+12.3%",
    sector: "Technology"
  },
  {
    title: "Renewable Energy Boom",
    summary: "Clean energy stocks rally as new government incentives boost sector outlook. Solar and wind power companies see increased institutional investment.",
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
    category: "Energy",
    sentiment: "positive",
    change: "+8.7%",
    sector: "Clean Energy"
  },
  {
    title: "Banking Sector Concerns",
    summary: "Regional banks face pressure amid new regulatory challenges and changing interest rate landscape. Analysts recommend caution with small-cap financial institutions.",
    imageUrl: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
    category: "Finance",
    sentiment: "negative",
    change: "-3.5%",
    sector: "Banking"
  },
  {
    title: "Healthcare Innovation",
    summary: "Biotech companies report breakthrough in cancer treatment technologies. New FDA approvals accelerate the path to commercialization for several promising therapies.",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
    category: "Healthcare",
    sentiment: "positive",
    change: "+5.1%",
    sector: "Biotech"
  },
  {
    title: "Supply Chain Evolution",
    summary: "Global logistics firms implement AI to optimize supply chains and reduce costs. New technologies promise to address ongoing challenges in global trade networks.",
    imageUrl: "https://images.unsplash.com/photo-1589293992743-f1e6a3586f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
    category: "Logistics",
    sentiment: "positive",
    change: "+2.8%",
    sector: "Industrial"
  },
];

const TopSearchesTab: React.FC = () => {
  return (
    <div>
      <SectionTitle 
        title="Top Searches" 
      />
      
      <NewsCardList items={topSearchesData} />
    </div>
  );
};

export default TopSearchesTab;
