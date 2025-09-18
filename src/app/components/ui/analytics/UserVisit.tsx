"use client"

import Dropdown from "@/app/components/ui/dropdown";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface TimeRange {
  date: string;
  value: number;
}

export default function UserVisit() {
  const [usersByRange, setUsersByRange] = useState<TimeRange[]>([]);
  const [value, setValue] = useState('')
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {getToken} = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken({ template: "default" });
        if (!token) throw new Error("No token available");
        console.log(token)

        const res = await fetch(`${apiUrl}/analytics/user-visits?range=${value || "daily"}`, {
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
          data: TimeRange[];
        };
        setUsersByRange(data.data);
      } catch (error) {
        console.error("Analytics fetch error:", error);
      }
    };

    void fetchData();
  }, [apiUrl, getToken, value]);

  const options = [
    {name: "Daily", value: "daily"},
    {name: "Weekly", value: "weekly"},
    {name: "Monthly", value: "monthly"},
  ]

  return (
    <div className="p-5">
      <div className="w-full">
        <p className="font-semibold text-[var(--color-grey)] text-center">Page View</p>
        <div className="bg-[var(--color-grey-light)] w-25 text-[var(--color-base)]">
          <Dropdown 
            options={options}
            value={value}
            onChange={(e) => setValue(e.target.value)} 
          />
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={usersByRange} margin={{ top: 25, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              height={20}
              tick={{ fill: "var(--color-base)", fontSize: 12 }}
            />
            <YAxis 
              domain={[0, 'dataMax']} 
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
            <Line type="monotone" dataKey="value" stroke="var(--color-purple)" activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
