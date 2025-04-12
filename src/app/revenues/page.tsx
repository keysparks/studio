"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";

interface Revenue {
  category: string;
  amount: number; // Change to number
  date: string;
  username: string;
}

export default function RevenuesPage() {
  const [data, setData] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/revenues");
        if (!response.ok) {
          throw new Error("Failed to fetch revenues");
        }
        const jsonData: Revenue[] = (await response.json()).map((item: any) => ({
          category: item.category,
          amount: item.amount,
          date: new Date(item.date), // Parse date string to Date object
          username: item.username,
        }));


        setData(jsonData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns: ColumnDef<Revenue>[] = [
    { accessorKey: "category", header: "Category" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "date", header: "Date", cell: ({ row }) => format(new Date(row.getValue("date")), "PPP") },
    { accessorKey: "username", header: "Username" },
  ];

  return (
    <Card>
      {loading ? (<p>Loading revenues...</p>) : error ? (<p>Error: {error}</p>) : (<DataTable columns={columns} data={data} />)}
    </Card>
  );
}
