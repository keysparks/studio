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

export default function RevenuesPage() {
  const [revenues, setRevenues] = useState([{category: 'Salary', amount: 5000}]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);

  const handleAddRevenue = () => {
    if (category && amount > 0) {
      setRevenues([...revenues, {category, amount: parseFloat(amount.toString())}]);
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
            <CardTitle>Revenues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Input
                type="text"
                placeholder="e.g., Salary"
                value={category}
                onChange={e => setCategory(e.target.value)}
              />
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="e.g., 5000"
                value={amount}
                onChange={e => setAmount(parseFloat(e.target.value))}
              />
              <Button onClick={handleAddRevenue}>Add Revenue</Button>
            </div>
            <ul className="mt-4">
              {revenues.map((revenue, index) => (
                <li key={index} className="flex justify-between items-center py-2 border-b">
                  <span>{revenue.category}</span>
                  <span>₹{revenue.amount}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
