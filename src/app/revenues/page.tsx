'use client';

import React from 'react';
import {Card} from '@/components/ui/card';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';

export default function RevenuesPage() {

  return (
    <Card>
      <div className="flex flex-col space-y-4">
        <Label>Category</Label>
        <Input
          type="text"
          placeholder="e.g., Salary"
          disabled
        />
        <Label>Amount</Label>
        <Input
          type="number"
          placeholder="e.g., 5000"
          disabled
        />
      </div>
      <div className="mt-4">
        <ul>
          <li className="flex justify-between items-center py-2 border-b">
            <span>Dummy Revenue Category</span>
            <span>₹0</span>
          </li>
        </ul>
      </div>
    </Card>
  );
}
