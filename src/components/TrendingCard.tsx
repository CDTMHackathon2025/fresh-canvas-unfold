
import React from 'react';
import { ArrowRight } from 'lucide-react';

interface TrendingCardProps {
  title: string;
  subtitle: string;
  imageUrl: string;
  trend: string;
  id?: string;
  onClick?: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const TrendingCard: React.FC<TrendingCardProps> = ({
  title,
  subtitle,
  imageUrl,
  trend,
  id = "trending-item",
  onClick,
  className = "",
  style = {}
}) => {
  const handleClick = () => {
    if (onClick && id) {
      onClick(id);
    }
  };

  return (
    <div 
      className={`rounded-xl overflow-hidden relative h-[280px] w-full shadow-lg cursor-pointer ${className}`}
      onClick={handleClick}
      style={style}
    >
      {/* Image with gradient overlay */}
      <div className="absolute inset-0 image-overlay">
        <img
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-end bg-gradient-to-t from-black via-black/50 to-transparent">
        <div>
          <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold rounded-full bg-white/20 backdrop-blur-sm text-white">
            {trend}
          </span>
          <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
          <p className="text-xs text-white/80 mb-3">{subtitle}</p>
          
          <div className="flex justify-end">
            <div className="flex items-center bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-full text-white/90 text-xs">
              <span className="mr-1">View details</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendingCard;
