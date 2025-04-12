'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Separator} from '@/components/ui/separator';
import {PlusCircle} from "lucide-react";
import Link from "next/link";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

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
            
            
              {revenues.map((revenue, index) => (
                <li key={index} className="flex justify-between items-center py-2 border-b">
                  <span>{revenue.category}</span>
                  <span>₹{revenue.amount}</span>
                </li>
              ))}
            
          
        
      
    
  );
}


