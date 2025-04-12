'use client';

import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Separator} from '@/components/ui/separator';
import {PlusCircle} from "lucide-react";
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
            
            
              {expenses.map((expense, index) => (
                <li key={index} className="flex justify-between items-center py-2 border-b">
                  <span>{expense.category}</span>
                  <span>₹{expense.amount}</span>
                </li>
              ))}
            
          
        
      
    
  );
}




