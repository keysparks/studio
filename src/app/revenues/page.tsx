"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";

export default function RevenuesPage() {
  const [date, setDate] = React.useState<Date>();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission here
    console.log("Form submitted");
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div>
          <Label htmlFor="category" className="font-bold">
            Category
          </Label>
          <Input type="text" id="category" required />
        </div>
        <div>
          <Label htmlFor="amount" className="font-bold">
            Amount
          </Label>
          <Input type="number" id="amount" required />
        </div>
        <div>
          <Label htmlFor="date" className="font-bold">
            Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[240px] pl-3 text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="username" className="font-bold">Username</Label>
          <Input type="text" id="username" required />
        </div>
        <Button type="submit">Add Revenue</Button>
      </form>
    </Card>
  );
}
