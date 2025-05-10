
import React from "react";
import { MessageCircle, PieChart, Search, Podcast, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  to: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, to }) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center",
        active ? "text-navy" : "text-muted-foreground"
      )}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

interface BottomNavigationProps {
  activePage?: string;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activePage }) => {
  const location = useLocation();
  const path = location.pathname;
  
  // Determine active page based on path if not explicitly set
  const active = activePage || (
    path === "/updates" ? "updates" :
    path === "/space" ? "space" :
    path === "/discover" ? "discover" :
    path === "/chat" ? "chat" :
    path === "/podcast" ? "podcast" :
    "space"
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 backdrop-blur-lg bg-black/40 border-t border-white/10 flex items-center justify-between px-2 z-10">
      <NavItem
        icon={<RefreshCw size={20} />}
        label="Updates"
        active={active === "updates"}
        to="/updates"
      />
      <NavItem
        icon={<Podcast size={20} />}
        label="Podcast"
        active={active === "podcast"}
        to="/podcast"
      />
      <NavItem
        icon={<PieChart size={20} />}
        label="Space"
        active={active === "space"}
        to="/space"
      />
      <NavItem
        icon={<Search size={20} />}
        label="Discover"
        active={active === "discover"}
        to="/discover"
      />
      <NavItem
        icon={<MessageCircle size={20} />}
        label="Chat"
        active={active === "chat"}
        to="/chat"
      />
    </div>
  );
};

export default BottomNavigation;
