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
import Link from "next/link";

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

  const generateInsights = async () => {
    try {
      const totalIncome = revenues.reduce((sum, revenue) => sum + revenue.amount, 0);
      const input = {
        income: parseFloat(totalIncome.toString()),
        expenses: expenses,
        revenues: revenues,
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
  const totalIncome = revenues.reduce((sum, revenue) => sum + revenue.amount, 0);
  const remainingBudget = totalIncome - totalExpenses;

  const pieChartData = expenses.map((expense, index) => ({
    name: expense.category,
    value: expense.amount,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
       <h1 className="text-2xl font-bold text-center">BudgetWise</h1>
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
              <Button asChild>
                <Link href="/revenues">Add Revenue</Link>
              </Button>
              <Button asChild>
                <Link href="/expenses">Add Expense</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          
          
          
            <Button onClick={generateInsights}>Generate Insights</Button>
            {insights.length > 0 && (
              <ul className="mt-4">
                {insights.map((insight, index) => (
                  <li key={index} className="py-2 border-b">{insight}</li>
                ))}
              </ul>
            )}
          
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




