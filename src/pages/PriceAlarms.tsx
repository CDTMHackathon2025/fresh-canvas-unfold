import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/sonner";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { useNavigate } from "react-router-dom";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BellRing, Trash2, DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Define our form schema
const formSchema = z.object({
  ticker: z.string().min(1, {
    message: "Ticker symbol is required",
  }),
  targetPrice: z.string().min(1, {
    message: "Target price is required",
  }),
  autoTrade: z.boolean().default(false),
  tradeAction: z.enum(["none", "buy", "sell"]).default("none"),
  quantity: z.string().optional(),
});

type PriceAlert = {
  id: string;
  ticker: string;
  targetPrice: string;
  currentPrice: string;
  isAboveTarget: boolean;
  createdAt: Date;
  autoTrade: boolean;
  tradeAction: "none" | "buy" | "sell";
  quantity: string;
  executed: boolean;
};

const PriceAlarms = () => {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: "1",
      ticker: "AAPL",
      targetPrice: "200.00",
      currentPrice: "197.50",
      isAboveTarget: false,
      createdAt: new Date(),
      autoTrade: false,
      tradeAction: "none",
      quantity: "",
      executed: false,
    },
    {
      id: "2",
      ticker: "TSLA",
      targetPrice: "250.00",
      currentPrice: "252.30",
      isAboveTarget: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      autoTrade: true,
      tradeAction: "sell",
      quantity: "10",
      executed: false,
    },
    {
      id: "3",
      ticker: "MSFT",
      targetPrice: "400.00",
      currentPrice: "390.85",
      isAboveTarget: false,
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      autoTrade: true,
      tradeAction: "buy",
      quantity: "5",
      executed: false,
    },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ticker: "",
      targetPrice: "",
      autoTrade: false,
      tradeAction: "none",
      quantity: "",
    },
  });

  // Add event listener for click outside to close
  useEffect(() => {
    const handlePageClick = (e: MouseEvent) => {
      // Navigate back if clicking directly on the background (not on form elements)
      if (
        e.target instanceof HTMLElement && 
        e.target.classList.contains('black-background')
      ) {
        navigate(-1);
      }
    };

    document.addEventListener('click', handlePageClick);
    return () => {
      document.removeEventListener('click', handlePageClick);
    };
  }, [navigate]);

  // Watch the autoTrade value to conditionally render fields
  const autoTradeEnabled = form.watch("autoTrade");

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Create new alert
    const newAlert: PriceAlert = {
      id: Date.now().toString(),
      ticker: values.ticker.toUpperCase(),
      targetPrice: values.targetPrice,
      currentPrice: (parseFloat(values.targetPrice) * (Math.random() * 0.2 + 0.9)).toFixed(2),
      isAboveTarget: Math.random() > 0.5,
      createdAt: new Date(),
      autoTrade: values.autoTrade,
      tradeAction: values.tradeAction,
      quantity: values.quantity || "",
      executed: false,
    };

    setAlerts([newAlert, ...alerts]);
    form.reset();
    
    const actionDescription = values.autoTrade 
      ? `You will be notified and ${values.tradeAction === 'buy' ? 'buy' : 'sell'} ${values.quantity} shares automatically when ${values.ticker.toUpperCase()} reaches $${values.targetPrice}`
      : `You will be notified when ${values.ticker.toUpperCase()} reaches $${values.targetPrice}`;
    
    toast.success("Price alert created", {
      description: actionDescription,
    });
  }

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.success("Price alert removed");
  };

  const executeAutoTrade = (alert: PriceAlert) => {
    // Simulate executing the trade
    setAlerts(alerts.map(a => {
      if (a.id === alert.id) {
        return { ...a, executed: true };
      }
      return a;
    }));

    const action = alert.tradeAction === 'buy' ? 'bought' : 'sold';
    toast.success(`Auto-trade executed`, {
      description: `Successfully ${action} ${alert.quantity} shares of ${alert.ticker} at $${alert.currentPrice}`,
    });
  };

  return (
    <div className="black-background bg-black min-h-screen pb-16 animate-fade-in text-white">
      <Header activeTab="Price Alerts" onTabChange={() => {}} showTabs={false} />

      <div className="container px-4 py-6 pt-20 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-white">Set Price Alerts</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mb-8" onClick={(e) => e.stopPropagation()}>
            <FormField
              control={form.control}
              name="ticker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Stock, ETF, or Crypto</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. AAPL, TSLA, MSFT" {...field} className="bg-gray-900 text-white border-gray-700" />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Target Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="200.00" {...field} className="bg-gray-900 text-white border-gray-700" />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="autoTrade"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-gray-700 p-4 bg-gray-900">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="border-gray-500"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-white">Automatic Trading</FormLabel>
                    <FormDescription className="text-gray-400">
                      Automatically buy or sell when price target is reached
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {autoTradeEnabled && (
              <>
                <FormField
                  control={form.control}
                  name="tradeAction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Action</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-gray-900 text-white border-gray-700">
                            <SelectValue placeholder="Select action" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-gray-900 text-white border-gray-700">
                          <SelectItem value="buy">Buy</SelectItem>
                          <SelectItem value="sell">Sell</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="10" {...field} className="bg-gray-900 text-white border-gray-700" />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-200">
              <BellRing className="mr-2 h-4 w-4" />
              Create Alert
            </Button>
          </form>
        </Form>

        <div className="divide-y divide-gray-700" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-xl font-semibold mb-4 text-white">Your Price Alerts</h2>
          {alerts.length === 0 ? (
            <p className="py-8 text-center text-gray-400">
              No price alerts set. Create your first alert above.
            </p>
          ) : (
            <div className="space-y-6">
              {alerts.map((alert) => (
                <div key={alert.id} className="py-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-medium text-white">{alert.ticker}</span>
                      <span className="text-sm text-gray-400">
                        Target: ${alert.targetPrice}
                      </span>
                      {alert.autoTrade && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          alert.tradeAction === 'buy' ? 'bg-gray-700 text-green-400' : 'bg-gray-700 text-red-400'
                        }`}>
                          Auto {alert.tradeAction === 'buy' ? 'Buy' : 'Sell'}: {alert.quantity} shares
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAlert(alert.id)}
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">
                      Current: ${alert.currentPrice}
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        alert.isAboveTarget ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {alert.isAboveTarget
                        ? `$${(
                            parseFloat(alert.currentPrice) -
                            parseFloat(alert.targetPrice)
                          ).toFixed(2)} above target`
                        : `$${(
                            parseFloat(alert.targetPrice) -
                            parseFloat(alert.currentPrice)
                          ).toFixed(2)} below target`}
                    </span>
                  </div>

                  <Slider
                    value={[
                      (parseFloat(alert.currentPrice) / parseFloat(alert.targetPrice)) * 100,
                    ]}
                    disabled={true}
                    className="mt-2"
                  />

                  {alert.autoTrade && !alert.executed && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => executeAutoTrade(alert)}
                      className="mt-2 w-full border-gray-700 text-black hover:bg-gray-800 hover:text-white"
                    >
                      {alert.tradeAction === 'buy' ? (
                        <><TrendingUp className="mr-2 h-4 w-4 text-green-400" /> Simulate Auto Buy</>
                      ) : (
                        <><TrendingDown className="mr-2 h-4 w-4 text-red-400" /> Simulate Auto Sell</>
                      )}
                    </Button>
                  )}

                  {alert.autoTrade && alert.executed && (
                    <div className="mt-2 text-sm text-center py-1 bg-gray-800 rounded-md text-white">
                      <DollarSign className="inline-block h-4 w-4 mr-1" />
                      {alert.tradeAction === 'buy' ? 'Purchase' : 'Sale'} executed at ${alert.currentPrice}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation activePage="" />
    </div>
  );
};

export default PriceAlarms;
