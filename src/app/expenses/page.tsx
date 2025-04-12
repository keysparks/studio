'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Separator} from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {Home, PlusCircle} from "lucide-react";
import Link from "next/link";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([{category: 'Groceries', amount: 500}]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);

  const handleAddExpense = () => {
    if (category && amount > 0) {
      setExpenses([...expenses, {category, amount: parseFloat(amount.toString())}]);
      setCategory('');
      setAmount(0);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex items-center justify-between p-4 bg-background border-b">
        <span className="font-bold text-lg">BudgetWise</span>
        <div className="absolute top-2 right-4">
          <Avatar>
            <AvatarImage src="https://picsum.photos/50/50" alt="User Avatar"/>
            <AvatarFallback>FS</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <div className="container mx-auto p-4 flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
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
    </div>
  );
}
