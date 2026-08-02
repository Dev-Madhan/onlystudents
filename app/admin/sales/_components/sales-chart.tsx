"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  revenue: {
    label: "Revenue (₹)",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function SalesChart({ data }: { data: { name: string; total: number }[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart accessibilityLayer data={data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeOpacity={0.15} strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar 
          dataKey="total" 
          fill="var(--color-revenue)" 
          radius={[4, 4, 0, 0]} 
          maxBarSize={48} 
        />
      </BarChart>
    </ChartContainer>
  );
}
