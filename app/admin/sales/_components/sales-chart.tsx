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
    <ChartContainer config={chartConfig} className="h-[220px] sm:h-[280px] md:h-[300px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 8, left: 8, bottom: 0 }}
      >
        <CartesianGrid vertical={false} strokeOpacity={0.15} strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={55}
          tick={{ fontSize: 11 }}
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
