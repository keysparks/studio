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
    <div className="flex h-full">
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger/>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Link href="/" className="w-full">
                <SidebarMenuButton>
                  <Home className="mr-2 h-4 w-4"/>
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/revenues" className="w-full">
                <SidebarMenuButton>
                  <PlusCircle className="mr-2 h-4 w-4"/>
                  <span>Add Revenue</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <Link href="/expenses" className="w-full">
                <SidebarMenuButton>
                  <PlusCircle className="mr-2 h-4 w-4"/>
                  <span>Add Expense</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
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
