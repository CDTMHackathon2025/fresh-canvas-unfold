import React, { useState } from "react";
import { ArrowLeft, Plus, Edit, Trash2, PiggyBank, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the type for asset types
type AssetType = "ETF" | "Stock" | "Crypto" | "Fund";
type Frequency = "Weekly" | "Monthly" | "Quarterly";

// Type for saving plan
type SavingPlan = {
  id: number;
  name: string;
  assetType: AssetType;
  amount: number;
  frequency: Frequency;
  startDate: string;
  totalInvested: number;
};

// Mock data for saving plans with correct types
const initialSavingPlans: SavingPlan[] = [
  {
    id: 1,
    name: "iShares MSCI World ETF",
    assetType: "ETF",
    amount: 100,
    frequency: "Monthly",
    startDate: "2023-10-15",
    totalInvested: 1200,
  },
  {
    id: 2,
    name: "Apple Inc.",
    assetType: "Stock",
    amount: 45,
    frequency: "Monthly",
    startDate: "2024-01-05",
    totalInvested: 225,
  },
  {
    id: 3,
    name: "Vanguard S&P 500 ETF",
    assetType: "ETF",
    amount: 200,
    frequency: "Monthly",
    startDate: "2023-06-20",
    totalInvested: 2400,
  },
];

const SavingsPlans = () => {
  const [savingPlans, setSavingPlans] = useState<SavingPlan[]>(initialSavingPlans);
  const [currentPlan, setCurrentPlan] = useState<SavingPlan | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Generate a new id for a new plan
  const generateId = () => Math.max(0, ...savingPlans.map((plan) => plan.id)) + 1;

  // Create a new empty plan
  const createNewPlan = () => {
    setCurrentPlan({
      id: generateId(),
      name: "",
      assetType: "ETF",
      amount: 0,
      frequency: "Monthly",
      startDate: new Date().toISOString().split('T')[0],
      totalInvested: 0,
    });
    setIsEditDialogOpen(true);
  };

  // Edit an existing plan
  const editPlan = (plan: SavingPlan) => {
    setCurrentPlan({ ...plan });
    setIsEditDialogOpen(true);
  };

  // Save the current plan (new or edited)
  const savePlan = () => {
    if (!currentPlan) return;

    if (currentPlan.id === 0 || !savingPlans.find(p => p.id === currentPlan.id)) {
      // New plan
      setSavingPlans([...savingPlans, { ...currentPlan, id: generateId() }]);
      toast({
        title: "Saving Plan Created",
        description: `${currentPlan.name} investment plan has been created successfully!`,
      });
    } else {
      // Update existing plan
      setSavingPlans(savingPlans.map(plan => 
        plan.id === currentPlan.id ? currentPlan : plan
      ));
      toast({
        title: "Saving Plan Updated",
        description: `${currentPlan.name} investment plan has been updated successfully!`,
      });
    }
    
    setIsEditDialogOpen(false);
    setCurrentPlan(null);
  };

  // Delete a plan
  const deletePlan = (id: number) => {
    setSavingPlans(savingPlans.filter(plan => plan.id !== id));
    toast({
      title: "Saving Plan Deleted",
      description: "The automatic investment plan has been deleted successfully.",
      variant: "destructive",
    });
  };

  // Handle input changes for the current plan
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentPlan) return;

    const { name, value } = e.target;
    const numericFields = ["amount", "totalInvested"];
    
    setCurrentPlan({
      ...currentPlan,
      [name]: numericFields.includes(name) ? Number(value) : value,
    });
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: any) => {
    if (!currentPlan) return;
    
    setCurrentPlan({
      ...currentPlan,
      [name]: value
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Close the page by going back
  const closePage = () => {
    window.history.back();
  };

  return (
    <div className="bg-black min-h-screen text-white pb-16" onClick={(e) => {
      if (e.target === e.currentTarget) closePage();
    }}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/20">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={() => window.history.back()}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Automatic Investments</h1>
        <div className="w-8"></div> {/* Empty div for flex spacing */}
      </div>

      <div className="p-4">
        {/* Add New Plan Button */}
        <Button 
          onClick={createNewPlan}
          className="w-full mb-6 bg-white hover:bg-white/80 text-black flex items-center justify-center gap-2 py-6"
        >
          <Plus size={20} />
          <span>Add New Investment Plan</span>
        </Button>

        {/* Saving Plans List */}
        <div className="space-y-4">
          {savingPlans.length === 0 ? (
            <Card className="bg-black border border-white/20 text-white">
              <CardContent className="pt-6 text-center">
                <PiggyBank className="mx-auto h-12 w-12 mb-2 text-white/60" />
                <p>No automatic investments yet. Create your first one!</p>
              </CardContent>
            </Card>
          ) : (
            savingPlans.map((plan) => (
              <Card key={plan.id} className="bg-black border border-white/20 text-white">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription className="text-white/60">
                        {plan.assetType} • {formatCurrency(plan.amount)} {plan.frequency.toLowerCase()}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white/10"
                        onClick={() => editPlan(plan)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 hover:text-red-500 hover:bg-red-900/20"
                        onClick={() => deletePlan(plan.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Started on:</span>
                      <span>{new Date(plan.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Total invested:</span>
                      <span className="font-medium">{formatCurrency(plan.totalInvested)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">Next payment:</span>
                      <span>{new Date(new Date().setMonth(new Date().getMonth() + 1)).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-black border border-white/20 text-white">
          <DialogHeader>
            <DialogTitle>
              {currentPlan?.id ? "Edit Investment Plan" : "Create New Investment Plan"}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="name">Asset Name</Label>
              <Input
                id="name"
                name="name"
                value={currentPlan?.name || ""}
                onChange={handleInputChange}
                className="bg-black border-white/30 text-white"
                placeholder="e.g., iShares MSCI World ETF"
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="assetType">Asset Type</Label>
              <Select
                value={currentPlan?.assetType || "ETF"}
                onValueChange={(value: AssetType) => handleSelectChange("assetType", value)}
              >
                <SelectTrigger className="bg-black border-white/30 text-white">
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/30 text-white">
                  <SelectItem value="ETF">ETF</SelectItem>
                  <SelectItem value="Stock">Stock</SelectItem>
                  <SelectItem value="Crypto">Crypto</SelectItem>
                  <SelectItem value="Fund">Fund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="amount">Investment Amount (€)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                value={currentPlan?.amount || 0}
                onChange={handleInputChange}
                className="bg-black border-white/30 text-white"
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={currentPlan?.frequency || "Monthly"}
                onValueChange={(value: Frequency) => handleSelectChange("frequency", value)}
              >
                <SelectTrigger className="bg-black border-white/30 text-white">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-black border-white/30 text-white">
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={currentPlan?.startDate || ""}
                onChange={handleInputChange}
                className="bg-black border-white/30 text-white"
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="totalInvested">Total Invested so far (€)</Label>
              <Input
                id="totalInvested"
                name="totalInvested"
                type="number"
                value={currentPlan?.totalInvested || 0}
                onChange={handleInputChange}
                className="bg-black border-white/30 text-white"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={savePlan} 
              className="bg-white hover:bg-white/80 text-black"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavingsPlans;
