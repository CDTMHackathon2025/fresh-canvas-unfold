
import React from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  tabs?: string[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ 
  title, 
  subtitle, 
  tabs, 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-end mb-1">
        <div>
          {!tabs && <h2 className="text-xl font-bold">{title}</h2>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      
      {tabs && tabs.length > 0 && (
        <div className="flex overflow-x-auto mb-4 -mx-4 px-4 py-1">
          <div className="flex bg-gray-200 rounded-full p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange && onTabChange(tab)}
                className={`px-6 py-2 rounded-full text-sm transition-colors ${
                  activeTab === tab
                    ? "bg-coral text-white font-medium"
                    : "text-gray-700 hover:bg-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionTitle;
