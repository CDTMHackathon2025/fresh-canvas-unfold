
import React, { useState, useEffect } from "react";
import { ArrowLeft, Calculator, Target, Plus, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";

type CalculationResult = {
  interestRate: number;
  totalSavings: number;
  interestEarned: number;
  monthlyContributions: number;
  goalMet: boolean;
};

type Goal = {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string;
  monthlySaving: number;
  interestRate: number;
  totalSavings: number;
};

const Goals = () => {
  const [targetAmount, setTargetAmount] = useState<number>(10000);
  const [targetDate, setTargetDate] = useState<string>("");
  const [monthlySaving, setMonthlySaving] = useState<number>(100);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [goalName, setGoalName] = useState<string>("");
  const [savedGoals, setSavedGoals] = useState<Goal[]>([]);
  const { toast } = useToast();

  // Set default target date (2 years from now)
  useEffect(() => {
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
    setTargetDate(twoYearsFromNow.toISOString().split('T')[0]);
    
    // Load saved goals from localStorage
    const storedGoals = localStorage.getItem('financialGoals');
    if (storedGoals) {
      setSavedGoals(JSON.parse(storedGoals));
    }
  }, []);
  
  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('financialGoals', JSON.stringify(savedGoals));
  }, [savedGoals]);

  // Calculate required interest rate
  const calculateRequiredInterest = () => {
    if (!targetDate || targetAmount <= 0 || monthlySaving <= 0) {
      toast({
        title: "Invalid inputs",
        description: "Please provide valid target amount, date, and monthly savings.",
        variant: "destructive"
      });
      return;
    }

    const today = new Date();
    const goalDate = new Date(targetDate);
    
    if (goalDate <= today) {
      toast({
        title: "Invalid date",
        description: "Target date must be in the future.",
        variant: "destructive"
      });
      return;
    }

    // Calculate months between now and target date
    const monthsDiff = (goalDate.getFullYear() - today.getFullYear()) * 12 + 
                       (goalDate.getMonth() - today.getMonth());
    
    if (monthsDiff <= 0) {
      toast({
        title: "Invalid date",
        description: "Target date must be at least a month in the future.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate total savings from monthly contributions
    const totalContributions = monthlySaving * monthsDiff;
    
    // If total contributions already exceed the target amount
    if (totalContributions >= targetAmount) {
      setCalculationResult({
        interestRate: 0,
        totalSavings: totalContributions,
        interestEarned: 0,
        monthlyContributions: totalContributions,
        goalMet: true
      });
      
      toast({
        title: "Goal analysis complete",
        description: "Your monthly contributions alone will exceed your goal! No additional return needed.",
      });
      return;
    }
    
    // Binary search to find the required annual interest rate
    let low = 0;
    let high = 100;
    let mid;
    let totalAmount;
    
    // Precision to 0.01%
    while (high - low > 0.01) {
      mid = (high + low) / 2;
      const monthlyRate = mid / 100 / 12;
      
      // Formula for future value of a series of payments
      totalAmount = 0;
      for (let i = 0; i < monthsDiff; i++) {
        totalAmount += monthlySaving;
        totalAmount *= (1 + monthlyRate);
      }
      
      if (totalAmount > targetAmount) {
        high = mid;
      } else {
        low = mid;
      }
    }
    
    const requiredRate = (high + low) / 2;
    
    setCalculationResult({
      interestRate: parseFloat(requiredRate.toFixed(2)),
      totalSavings: parseFloat(totalAmount.toFixed(2)),
      interestEarned: parseFloat((totalAmount - monthlySaving * monthsDiff).toFixed(2)),
      monthlyContributions: monthlySaving * monthsDiff,
      goalMet: true
    });
    
    toast({
      title: "Goal analysis complete",
      description: `You'll need approximately ${requiredRate.toFixed(2)}% annual return to reach your goal.`,
    });
  };
  
  // Add current goal to saved goals list
  const saveGoal = () => {
    if (!calculationResult) {
      toast({
        title: "No calculation",
        description: "Please calculate the required interest rate first.",
        variant: "destructive"
      });
      return;
    }

    if (!goalName.trim()) {
      toast({
        title: "Missing name",
        description: "Please name your goal.",
        variant: "destructive"
      });
      return;
    }

    const newGoal = {
      id: Date.now().toString(),
      name: goalName,
      targetAmount,
      targetDate,
      monthlySaving,
      interestRate: calculationResult.interestRate,
      totalSavings: calculationResult.totalSavings,
    };

    setSavedGoals([...savedGoals, newGoal]);
    
    // Reset fields for a new goal entry
    setGoalName("");
    
    toast({
      title: "Goal saved",
      description: `"${goalName}" has been added to your goals list.`
    });
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Delete a goal from the list
  const deleteGoal = (id: string) => {
    setSavedGoals(savedGoals.filter(goal => goal.id !== id));
    toast({
      title: "Goal deleted",
      description: "Goal has been removed from your list."
    });
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
        <h1 className="text-xl font-bold">Financial Goals</h1>
        <div className="w-8"></div> {/* Empty div for flex spacing */}
      </div>

      <div className="p-4 max-w-md mx-auto">
        {/* MOVED: Saved Goals List to top of page */}
        {savedGoals.length > 0 && (
          <Card className="bg-black border border-white/20 text-white mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Your Saved Goals
              </CardTitle>
              <CardDescription className="text-white/60">
                Track your financial targets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedGoals.map(goal => (
                <div key={goal.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{goal.name}</h3>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-white/60 hover:text-white hover:bg-white/10 h-6 w-6 p-0"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      ✕
                    </Button>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <p>Target: {formatCurrency(goal.targetAmount)} by {new Date(goal.targetDate).toLocaleDateString()}</p>
                    <p>Monthly investment: {formatCurrency(goal.monthlySaving)}</p>
                    <p>Required return: {goal.interestRate}% annually</p>
                  </div>
                  
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-3">
                    <div 
                      className="h-full bg-gradient-to-r from-white/40 to-white/60"
                      style={{ 
                        width: `${Math.min(100, (goal.totalSavings / goal.targetAmount) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="bg-black border border-white/20 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Set Your Financial Goal
            </CardTitle>
            <CardDescription className="text-white/60">
              Define a target amount and when you want to achieve it
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goalName">Goal Name</Label>
              <Input
                id="goalName"
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="bg-black border-white/30 text-white"
                placeholder="New Car, House Down Payment, etc."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetAmount">Target Amount (€)</Label>
              <Input
                id="targetAmount"
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="bg-black border-white/30 text-white"
                placeholder="10000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetDate">Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="bg-black border-white/30 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="monthlySaving">Monthly Investment (€)</Label>
              <Input
                id="monthlySaving"
                type="number"
                value={monthlySaving}
                onChange={(e) => setMonthlySaving(Number(e.target.value))}
                className="bg-black border-white/30 text-white"
                placeholder="100"
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-2 items-stretch">
            <Button 
              onClick={calculateRequiredInterest} 
              className="w-full bg-white hover:bg-white/80 text-black flex items-center justify-center gap-2"
            >
              <Calculator size={18} />
              Calculate Required Return
            </Button>
          </CardFooter>
        </Card>
        
        {calculationResult && (
          <Card className="bg-black border border-white/20 text-white mt-6">
            <CardHeader>
              <CardTitle>Goal Analysis Results</CardTitle>
              <CardDescription className="text-white/60">
                Based on your inputs and calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-xl font-bold text-center mb-1">
                  {calculationResult.interestRate}% <span className="text-sm font-normal">annual return needed</span>
                </p>
                <p className="text-white/60 text-center text-sm">
                  to reach {formatCurrency(targetAmount)} by {new Date(targetDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className="space-y-2 mt-4">
                <div className="flex justify-between">
                  <span className="text-white/60">Total contributions:</span>
                  <span>{formatCurrency(calculationResult.monthlyContributions)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Interest earned:</span>
                  <span>{formatCurrency(calculationResult.interestEarned)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total savings at goal date:</span>
                  <span>{formatCurrency(calculationResult.totalSavings)}</span>
                </div>
              </div>
              
              <div className="h-4 bg-white/10 rounded-full overflow-hidden mt-2">
                <div 
                  className="h-full bg-gradient-to-r from-white/40 to-white/60"
                  style={{ 
                    width: `${Math.min(100, (calculationResult.totalSavings / targetAmount) * 100)}%` 
                  }}
                ></div>
              </div>

              <Button 
                onClick={saveGoal} 
                className="w-full mt-4 bg-black border border-white hover:bg-white/10 text-white flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Add Goal to List
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Goals;
