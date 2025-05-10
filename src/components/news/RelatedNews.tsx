
import React from "react";
import SectionTitle from "@/components/SectionTitle";
import NewsCardList, { NewsItem } from "@/components/news/NewsCardList";

// Related news data
const relatedNewsData: NewsItem[] = [
  {
    title: "Market Impact of Federal Reserve Policy",
    summary: "Federal Reserve's latest policy decisions cause ripples across markets. Analysts predict how various sectors might respond to the updated interest rate guidance.",
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
    category: "Policy",
    sentiment: "neutral",
    change: "0.0%",
    sector: "Finance"
  },
  {
    title: "Global Trade Tensions Affect Tech Supply Chains",
    summary: "Rising trade tensions between major economies create uncertainty for technology manufacturers. Semiconductor and hardware companies adjust strategies to navigate potential disruptions.",
    imageUrl: "https://images.unsplash.com/photo-1518770660967-a1e626a98165?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
    category: "Global Trade",
    sentiment: "negative",
    change: "-1.8%",
    sector: "Technology"
  },
  {
    title: "Green Energy Infrastructure Investments Surge",
    summary: "Major economies announce increased spending on renewable energy infrastructure. Solar, wind, and grid storage companies see heightened investor interest following policy announcements.",
    imageUrl: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=600&q=80",
    category: "Infrastructure",
    sentiment: "positive",
    change: "+3.4%",
    sector: "Energy"
  }
];

const RelatedNews: React.FC = () => {
  return (
    <div className="mt-8">
      <SectionTitle 
        title="Related News"
        subtitle="Stories connected to your recent activity"
      />
      
      <NewsCardList items={relatedNewsData} keyPrefix="related-" />
    </div>
  );
};

export default RelatedNews;
