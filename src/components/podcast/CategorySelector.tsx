
import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface CategorySelectorProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ 
  activeCategory, 
  setActiveCategory 
}) => {
  return (
    <div className="mb-6 overflow-x-auto">
      <ToggleGroup 
        type="single" 
        value={activeCategory}
        onValueChange={(value) => value && setActiveCategory(value)}
        className="flex justify-start space-x-2 pb-2"
      >
        <ToggleGroupItem 
          value="portfolio" 
          className="rounded-full text-sm whitespace-nowrap bg-navy/80 text-white hover:bg-navy/70 data-[state=on]:bg-white data-[state=on]:text-navy data-[state=on]:ring-2 data-[state=on]:ring-white"
        >
          Portfolio Insights
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="news" 
          className="rounded-full text-sm whitespace-nowrap bg-navy/80 text-white hover:bg-navy/70 data-[state=on]:bg-white data-[state=on]:text-navy data-[state=on]:ring-2 data-[state=on]:ring-white"
        >
          News
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="education" 
          className="rounded-full text-sm whitespace-nowrap bg-navy/80 text-white hover:bg-navy/70 data-[state=on]:bg-white data-[state=on]:text-navy data-[state=on]:ring-2 data-[state=on]:ring-white"
        >
          Education
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default CategorySelector;
