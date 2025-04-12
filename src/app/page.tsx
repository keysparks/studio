"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { IndianRupee } from "lucide-react"; // Import the IndianRupee icon

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

type Revenue = {
  category: string;
  amount: number;
  date: Date;
  username?: string;
};

type Expense = {
  category: string;
  amount: number;
  date: Date;
  username?: string;
};

function DashboardOverview() {
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetGoals, setBudgetGoals] = useState([
    { category: "Groceries", amount: 400 },
  ]);
  const { toast } = useToast();
  const [openRevenueDialog, setOpenRevenueDialog] = useState(false);
  const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
  const [newRevenueCategory, setNewRevenueCategory] = useState("");
  const [newRevenueAmount, setNewRevenueAmount] = useState<number | "">("");
  const [newExpenseCategory, setNewExpenseCategory] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState<number | "">("");
  const [revenueDate, setRevenueDate] = useState<Date | undefined>(new Date());
  const [expenseDate, setExpenseDate] = useState<Date | undefined>(new Date());
  const [username, setUsername] = useState("");

  const handleAddRevenue = async () => {
    if (newRevenueCategory && newRevenueAmount !== "" && revenueDate && username) {
      try {
        const response = await fetch("/api/revenues", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: newRevenueCategory,
            amount: parseFloat(newRevenueAmount.toString()),
            date: revenueDate,
            username: username,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add revenue");
        }

        const newRevenue = await response.json();
        setRevenues([...revenues, newRevenue]); // Assuming API returns the added revenue
        setNewRevenueCategory("");
        setNewRevenueAmount("");
        setRevenueDate(undefined);
        setUsername("");
        setOpenRevenueDialog(false);

        toast({
          title: "Revenue Added",
          description: "Your revenue has been successfully added.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please fill in all revenue details.",
        variant: "destructive",
      });
    }
  };


  const handleAddExpense = async () => {
    if (newExpenseCategory && newExpenseAmount !== "" && expenseDate && username) {
      try {
        const response = await fetch("/api/expenses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: newExpenseCategory,
            amount: parseFloat(newExpenseAmount.toString()),
            date: expenseDate,
            username: username,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add expense");
        }

        const newExpense = await response.json();
        setExpenses([...expenses, newExpense]); // Assuming API returns the added expense
        setNewExpenseCategory("");
        setNewExpenseAmount("");
        setExpenseDate(undefined);
        setUsername("");
        setOpenExpenseDialog(false);

        toast({
          title: "Expense Added",
          description: "Your expense has been successfully added.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Please fill in all expense details.",
        variant: "destructive",
      });
    }
  };

  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );
  const totalIncome = revenues.reduce(
    (sum, revenue) => sum + revenue.amount,
    0,
  );
  const remainingBudget = totalIncome - totalExpenses;

  const pieChartData = expenses.map((expense, index) => ({
    name: expense.category,
    value: expense.amount,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardDescription>A summary of your financial status.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Income</Label>
            <div className="relative">
              <IndianRupee className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="number"
                value={totalIncome}
                readOnly
                className="pl-8"
              />
            </div>
          </div>
          <div>
            <Label>Total Expenses</Label>
            <div className="relative">
              <IndianRupee className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="number"
                value={totalExpenses}
                readOnly
                className="pl-8"
              />
            </div>
          </div>
          <div>
            <Label>Remaining Budget</Label>
            <div className="relative">
              <IndianRupee className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="number"
                value={remainingBudget}
                readOnly
                className="pl-8"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => (
                  <>
                    <IndianRupee className="mr-1 inline-block h-3 w-3" />
                    {value.toLocaleString()}
                  </>
                )}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="flex justify-around">
        <Dialog open={openRevenueDialog} onOpenChange={setOpenRevenueDialog}>
          <DialogTrigger asChild>
            <Button variant="default" style={{ backgroundColor: "#008080", color: "white" }}>Add Revenue</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Revenue</DialogTitle>
              <DialogDescription>
                Enter the details for the new revenue.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="revenue-username" className="text-right">
                  User Name
                </Label>
                <Input
                  type="text"
                  id="revenue-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="revenue-category" className="text-right">
                  Category
                </Label>
                <Input
                  type="text"
                  id="revenue-category"
                  value={newRevenueCategory}
                  onChange={(e) => setNewRevenueCategory(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="revenue-amount" className="text-right">
                  Amount
                </Label>
                <div className="relative col-span-3">
                  <IndianRupee className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="number"
                    id="revenue-amount"
                    value={newRevenueAmount}
                    onChange={(e) =>
                      setNewRevenueAmount(
                        e.target.value === "" ? "" : parseFloat(e.target.value),
                      )
                    }
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="revenue-date" className="text-right">
                  Date
                </Label>
                <DatePicker
                  id="revenue-date"
                  selected={revenueDate}
                  onSelect={setRevenueDate}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button type="submit" onClick={handleAddRevenue}>
              Add Revenue
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={openExpenseDialog} onOpenChange={setOpenExpenseDialog}>
          <DialogTrigger asChild>
            <Button variant="default" style={{ backgroundColor: "#008080", color: "white" }}>Add Expense</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
              <DialogDescription>
                Enter the details for the new expense.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expense-username" className="text-right">
                  User Name
                </Label>
                <Input
                  type="text"
                  id="expense-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="col-span-3"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expense-category" className="text-right">
                  Category
                </Label>
                <Input
                  type="text"
                  id="expense-category"
                  value={newExpenseCategory}
                  onChange={(e) => setNewExpenseCategory(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expense-amount" className="text-right">
                  Amount
                </Label>
                <div className="relative col-span-3">
                  <IndianRupee className="absolute left-2.5 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="number"
                    id="expense-amount"
                    value={newExpenseAmount}
                    onChange={(e) =>
                      setNewExpenseAmount(
                        e.target.value === "" ? "" : parseFloat(e.target.value),
                      )
                    }
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expense-date" className="text-right">
                  Date
                </Label>
                <DatePicker
                  id="expense-date"
                  selected={expenseDate}
                  onSelect={setExpenseDate}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button type="submit" onClick={handleAddExpense}>
              Add Expense
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardOverview />;
}
"
