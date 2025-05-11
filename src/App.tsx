
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import Index from "./pages/Index";
import Portfolio from "./pages/Portfolio";
import PortfolioPage from "./pages/PortfolioPage";
import StockDetails from "./pages/StockDetails";
import NotFound from "./pages/NotFound";
import Chat from "./pages/Chat";
import Discover from "./pages/Discover";
import Podcast from "./pages/Podcast";
import PriceAlarms from "./pages/PriceAlarms";
import SavingsPlans from "./pages/SavingsPlans";
import Goals from "./pages/Goals";
import Recommendations from "./pages/Recommendations";
import Analytics from "./pages/Analytics";
import ViewDetails from "./pages/ViewDetails";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/space" replace />} />
            <Route path="/updates" element={<Index />} />
            <Route path="/space" element={<Portfolio />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/stock/:ticker" element={<StockDetails />} />
            <Route path="/details/:id" element={<ViewDetails />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/podcast" element={<Podcast />} />
            <Route path="/price-alerts" element={<PriceAlarms />} />
            <Route path="/savings" element={<SavingsPlans />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/cash" element={<NotFound />} />
            <Route path="/stock" element={<NotFound />} />
            <Route path="/crypto" element={<NotFound />} />
            <Route path="/performance" element={<NotFound />} />
            <Route path="/risk" element={<NotFound />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
