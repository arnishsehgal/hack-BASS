"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface MaterialTradeoffChartProps {
  data: {
    material: string;
    strengthScore: number;
    costScore: number;
  }[];
}

const chartConfig = {
  strengthScore: {
    label: "Strength",
    color: "hsl(var(--primary))",
  },
  costScore: {
    label: "Cost-Effectiveness",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const MaterialTradeoffChart: React.FC<MaterialTradeoffChartProps> = ({ data }) => {
  return (
    <ChartContainer config={chartConfig} className="w-full h-[300px]">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 10]} />
          <YAxis dataKey="material" type="category" width={80} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: 'hsla(var(--muted), 0.5)' }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Legend content={<ChartLegendContent />} />
          <Bar dataKey="strengthScore" name="Strength" fill="var(--color-strengthScore)" radius={4} />
          <Bar dataKey="costScore" name="Cost-Effectiveness" fill="var(--color-costScore)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default MaterialTradeoffChart;
