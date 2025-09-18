"use client"

import Dropdown from "@/app/components/ui/dropdown";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface RankingItem {
  value: string;
  count: number;
}

export default function UserVisit() {
  const [rankingByType, setRankingByType] = useState<RankingItem[]>([]);
  const [value, setValue] = useState('')
  const [order, setOrder] = useState('')
  const options = [
    {name: "Daily", value: "daily"},
    {name: "Weekly", value: "weekly"},
    {name: "Monthly", value: "monthly"},
  ]
  const sortby = [
    {name: "Highest", value: "desc"},
    {name: "Lowest", value: "asc"},
  ]
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {getToken} = useAuth()

  useEffect(() => { 
    const fetchData = async () => {
      try {
        const token = await getToken({ template: "default" });
        if (!token) throw new Error("No token available");
        console.log(token)

        const res = await fetch(`${apiUrl}/analytics/view-project/title?range=${value || "daily"}&order=${order || "desc"}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Failed to fetch data");

        const data = await res.json() as {
          code: string;
          status: number;
          message: string;
          data: RankingItem[];
        };
        setRankingByType(data.data);
      } catch (error) {
        console.error("Analytics fetch error:", error);
      }
    };

  void fetchData();
  }, [apiUrl, getToken, value, order]);

  return (
    <div className="p-5">
      <div className="w-full">
        <p className="font-semibold text-[var(--color-grey)] text-center">Project Visit By Title</p>
        <div className="flex flex-row justify-between">
          <div className="bg-[var(--color-grey-light)] w-25 text-[var(--color-base)]">
            <Dropdown 
              options={options}
              value={value}
              onChange={(e) => setValue(e.target.value)} 
            />
          </div>
          <div className="bg-[var(--color-grey-light)] w-25 text-[var(--color-base)]">
            <Dropdown 
              options={sortby}
              value={order}
              onChange={(e) => setOrder(e.target.value)} 
            />
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={rankingByType} margin={{ top: 25, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="value" 
              height={20}
              interval={0} 
              textAnchor="middle"
              tick={{ fill: "var(--color-base)", fontSize: 10 }}
              tickFormatter={(val: string) => {
                return val.length > 5 ? val.slice(0, 5) + "…" : val;
              }}
            />
            <YAxis 
              width={40}
              tick={{ fill: "var(--color-base)", fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "var(--color-purple-light)",
                borderRadius: "8px",
                border: "1px solid var(--color-grey-light)",
                padding: "5px",
                fontSize: "12px",
                color: "var(--color-grey)",
              }}
            />
            <Bar 
              dataKey="count" 
              fill="var(--color-purple)" 
              radius={[10, 10, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
