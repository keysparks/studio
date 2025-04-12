'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import {Separator} from '@/components/ui/separator';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/hooks/use-toast';
import {getSpendingInsights} from '@/ai/flows/spending-insights';
import {Slider} from '@/components/ui/slider';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const initialExpenses = [
  {category: 'Groceries', amount: 500},
  {category: 'Rent', amount: 1500},
  {category: 'Utilities', amount: 200},
  {category: 'Transportation', amount: 300},
  {category: 'Entertainment', amount: 200},
];

export default function Home() {
  const [income, setIncome] = useState(5000);
  const [expenses, setExpenses] = useState(initialExpenses);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [budgetGoals, setBudgetGoals] = useState([{category: 'Groceries', amount: 400}]);
  const [insights, setInsights] = useState<string[]>([]);
  const {toast} = useToast();

  const handleAddExpense = () => {
    if (category && amount > 0) {
      setExpenses([...expenses, {category, amount: parseFloat(amount.toString())}]);
      setCategory('');
      setAmount(0);
    }
  };

  const handleAddBudgetGoal = () => {
    if (category && amount > 0) {
      setBudgetGoals([...budgetGoals, {category, amount: parseFloat(amount.toString())}]);
      setCategory('');
      setAmount(0);
    }
  };

  const generateInsights = async () => {
    try {
      const input = {
        income: parseFloat(income.toString()),
        expenses: expenses,
        budgetGoals: budgetGoals,
      };
      const result = await getSpendingInsights(input);
      setInsights(result.insights);
      toast({
        title: 'AI Insights Generated',
        description: 'Check the insights section for personalized suggestions.',
      });
    } catch (error: any) {
      console.error('Error generating insights:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate AI insights. Please try again.',
      });
    }
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = income - totalExpenses;

  const pieChartData = expenses.map((expense, index) => ({
    name: expense.category,
    value: expense.amount,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Overview</CardTitle>
          <CardDescription>A summary of your financial status.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Income</Label>
            <Input
              type="number"
              value={income}
              onChange={e => setIncome(parseFloat(e.target.value))}
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
          <CardHeader>
            <CardTitle>Spending Chart</CardTitle>
            <CardDescription>Visualize your expenses.</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
            <CardDescription>Categorize and track your expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Input
                type="text"
                placeholder="e.g., Groceries"
                value={category}
                onChange={e => setCategory(e.target.value)}
              />
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="e.g., 50"
                value={amount}
                onChange={e => setAmount(parseFloat(e.target.value))}
              />
              <Button onClick={handleAddExpense}>Add Expense</Button>
            </div>
            <ul className="mt-4">
              {expenses.map((expense, index) => (
                <li key={index} className="flex justify-between items-center py-2 border-b">
                  <span>{expense.category}</span>
                  <span>₹{expense.amount}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Goals</CardTitle>
          <CardDescription>Set and track your budget goals.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Input
              type="text"
              placeholder="e.g., Groceries"
              value={category}
              onChange={e => setCategory(e.target.value)}
            />
            <Label>Amount</Label>
            <Input
              type="number"
              placeholder="e.g., 400"
              value={amount}
              onChange={e => setAmount(parseFloat(e.target.value))}
            />
            <Button onClick={handleAddBudgetGoal}>Add Budget Goal</Button>
          </div>
          <ul className="mt-4">
            {budgetGoals.map((goal, index) => (
              <li key={index} className="flex justify-between items-center py-2 border-b">
                <span>{goal.category}</span>
                <span>₹{goal.amount}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI Spending Insights</CardTitle>
          <CardDescription>Get personalized insights based on your spending patterns.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={generateInsights}>Generate Insights</Button>
          {insights.length > 0 && (
            <ul className="mt-4">
              {insights.map((insight, index) => (
                <li key={index} className="py-2 border-b">{insight}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
