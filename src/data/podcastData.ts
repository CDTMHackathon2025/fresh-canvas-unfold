
export interface PodcastData {
  id: number;
  title: string;
  host: string;
  duration: string;
  category: string;
  imageUrl: string;
}

// Sample podcasts data with categories - reordered to put Mastering Stocks at the top
export const podcastsData: PodcastData[] = [
  {
    id: 7,
    title: "Mastering Stocks, ETFs & Crypto: A Complete Guide",
    host: "Alex Morgan",
    duration: "52:15",
    category: "education",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 1,
    title: "Market Insights with Jane Smith",
    host: "Jane Smith",
    duration: "32:45",
    category: "news",
    imageUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    title: "Everything I Need to Know About Taxes",
    host: "Sarah Williams",
    duration: "28:15",
    category: "education",
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 4,
    title: "Your Portfolio Performance Analysis",
    host: "David Chen",
    duration: "35:10",
    category: "portfolio",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 5,
    title: "Breaking Market News",
    host: "Emma Wilson",
    duration: "22:30",
    category: "news",
    imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 6,
    title: "Investing 101: Basics for Beginners",
    host: "Robert Taylor",
    duration: "45:00",
    category: "education",
    imageUrl: "https://images.unsplash.com/photo-1491336477066-31156b5e4f35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  }
];
