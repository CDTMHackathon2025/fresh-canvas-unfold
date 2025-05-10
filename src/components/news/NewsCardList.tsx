
import React from "react";
import NewsCard from "@/components/NewsCard";

export interface NewsItem {
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  sentiment: "positive" | "negative" | "neutral";
  change: string;
  sector: string;
}

interface NewsCardListProps {
  items: NewsItem[];
  keyPrefix?: string;
}

const NewsCardList: React.FC<NewsCardListProps> = ({ items, keyPrefix = "" }) => {
  return (
    <div className="space-y-4 pb-4">
      {items.map((item, index) => (
        <NewsCard 
          key={`${keyPrefix}${index}`} 
          {...item} 
        />
      ))}
    </div>
  );
};

export default NewsCardList;
