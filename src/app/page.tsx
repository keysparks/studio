'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import {Separator} from '@/components/ui/separator';
import {useToast} from '@/hooks/use-toast';
import {getSpendingInsights} from '@/ai/flows/spending-insights';
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const initialExpenses = [
  {category: 'Groceries', amount: 500},
  {category: 'Rent', amount: 1500},
  {category: 'Utilities', amount: 200},
  {category: 'Transportation', amount: 300},
  {category: 'Entertainment', amount: 200},
];

function DashboardOverview() {
  const [revenues, setRevenues] = useState([{category: 'Salary', amount: 5000}]);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [budgetGoals, setBudgetGoals] = useState([{category: 'Groceries', amount: 400}]);
  const [insights, setInsights] = useState<string[]>([]);
  const {toast} = useToast();
  const [openRevenueDialog, setOpenRevenueDialog] = useState(false);
  const [openExpenseDialog, setOpenExpenseDialog] = useState(false);
  const [newRevenueCategory, setNewRevenueCategory] = useState('');
  const [newRevenueAmount, setNewRevenueAmount] = useState<number | ''>('');
  const [newExpenseCategory, setNewExpenseCategory] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState<number | ''>('');

  const handleAddRevenue = () => {
    if (newRevenueCategory && newRevenueAmount !== '') {
      setRevenues([...revenues, {
        category: newRevenueCategory,
        amount: parseFloat(newRevenueAmount.toString()),
      }]);
      setNewRevenueCategory('');
      setNewRevenueAmount('');
      setOpenRevenueDialog(false);
    }
  };

  const handleAddExpense = () => {
    if (newExpenseCategory && newExpenseAmount !== '') {
      setExpenses([...expenses, {
        category: newExpenseCategory,
        amount: parseFloat(newExpenseAmount.toString()),
      }]);
      setNewExpenseCategory('');
      setNewExpenseAmount('');
      setOpenExpenseDialog(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = revenues.reduce((sum, revenue) => sum + revenue.amount, 0);
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
            <Input
              type="number"
              value={totalIncome}
              readOnly
            />
          </div>
          <div>
            <Label>Total Expenses</Label>
            <Input type="number" value={totalExpenses} readOnly />
          </div>
          <div>
            <Label>Remaining Budget</Label>
            <Input type="number" value={remainingBudget} readOnly />
          </div>
        </CardContent>
      </Card>

      <Separator/>

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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                  ))}
                </Pie>
                <Tooltip/>
                <Legend/>
              </PieChart>
            </ResponsiveContainer>
          
          <CardContent>
            <div className="flex justify-around">
              <Dialog open={openRevenueDialog} onOpenChange={setOpenRevenueDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">Add Revenue</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Revenue</DialogTitle>
                    <DialogDescription>Enter the details for the new revenue.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="revenue-category" className="text-right">
                        Category
                      </Label>
                      <Input
                        type="text"
                        id="revenue-category"
                        value={newRevenueCategory}
                        onChange={e => setNewRevenueCategory(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="revenue-amount" className="text-right">
                        Amount
                      </Label>
                      <Input
                        type="number"
                        id="revenue-amount"
                        value={newRevenueAmount}
                        onChange={e => setNewRevenueAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button type="submit" onClick={handleAddRevenue}>Add Revenue</Button>
                </DialogContent>
              </Dialog>

              <Dialog open={openExpenseDialog} onOpenChange={setOpenExpenseDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">Add Expense</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Expense</DialogTitle>
                    <DialogDescription>Enter the details for the new expense.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="expense-category" className="text-right">
                        Category
                      </Label>
                      <Input
                        type="text"
                        id="expense-category"
                        value={newExpenseCategory}
                        onChange={e => setNewExpenseCategory(e.target.value)}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="expense-amount" className="text-right">
                        Amount
                      </Label>
                      <Input
                        type="number"
                        id="expense-amount"
                        value={newExpenseAmount}
                        onChange={e => setNewExpenseAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <Button type="submit" onClick={handleAddExpense}>Add Expense</Button>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    
      
      <DashboardOverview/>
    
  );
}

