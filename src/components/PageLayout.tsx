
import React from "react";
import StarsBackground from "./StarsBackground";
import { useLocation } from "react-router-dom";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isSpacePage = location.pathname === "/space";
  
  return (
    <div className={`bg-black min-h-screen text-white relative overflow-hidden ${isSpacePage ? "flex flex-col justify-center" : ""}`}>
      <StarsBackground />
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
