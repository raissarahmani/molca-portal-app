"use client"

import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ProjectCount {
  value: string;
  count: number;
  [key: string]: string | number
}

export default function ProjectType() {
  const [type, setType] = useState<ProjectCount[]>([]);
  const colors: Record<string, string> = {
   ar: "var(--color-blue)",
   vr: "var(--color-yellow)",
   "digital-twin": "var(--color-green)",
   "smart-manufacture": "var(--color-maroon)",
   deck: "var(--color-gray)",
   tool: "var(--color-purple)",
} ;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const {getToken} = useAuth()

  useEffect(() => { 
    const fetchData = async () => {
      try {
        const token = await getToken({ template: "default" });
        if (!token) throw new Error("No token available");
        console.log(token)

        const res = await fetch(`${apiUrl}/analytics/project/type`, {
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
          data: ProjectCount[];
        };
        setType(data.data);
      } catch (error) {
        console.error("Analytics fetch error:", error);
      }
    };

  void fetchData();
  }, [apiUrl, getToken]);

  return (
    <div className="p-5">
      <div className="w-full">
        <p className="font-semibold text-[var(--color-grey)] text-center mb-10">Project Type</p>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              dataKey="count"
              nameKey="value"
              data={type}
              cx="50%"
              cy="50%"
              outerRadius={80}
              labelLine={false}
            >
              {type.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[entry.value.toLowerCase()] ?? "var(--color-text)"}
                />
              ))}
            </Pie>
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
            <Legend 
              verticalAlign="bottom" 
              align="center" 
              wrapperStyle={{ 
                fontSize: "12px", 
                fontWeight: "500", 
                color: "var(--color-grey)", 
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
