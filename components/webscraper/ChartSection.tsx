'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChartDataEntry {
  content: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagement: number;
  conversions: number;
}

interface ChartConfig {
  [key: string]: {
    label: string;
    color: string;
  };
}

interface AnalyticsChartProps {
  chartData: ChartDataEntry[];
}

// Chart configurations
const chartConfig: ChartConfig = {
  views: { label: "Views", color: "hsl(var(--chart-1))" },
  likes: { label: "Likes", color: "hsl(var(--chart-2))" },
  shares: { label: "Shares", color: "hsl(var(--chart-3))" },
  //
};

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ chartData }) => {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [metrics, setMetrics] = useState<string[]>(['views', 'likes', 'shares']);
  const [displayData, setDisplayData] = useState<ChartDataEntry[]>([]);

  const generatePlaceholderData = (): ChartDataEntry[] => {
    const data: ChartDataEntry[] = [];
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;

    for (let i = 0; i < days; i++) {
      data.push({
        content: `Day ${i + 1}`,
        views: Math.floor(Math.random() * 1000) + 100,
        likes: Math.floor(Math.random() * 100) + 10,
        shares: Math.floor(Math.random() * 50) + 5,
        comments: Math.floor(Math.random() * 30) + 3,
        engagement: Math.random() * 0.1 + 0.01,
        conversions: Math.floor(Math.random() * 10) + 1,
      });
    }

    return data;
  };

  const initialDisplayData = useMemo(() => {
    return chartData && chartData.length > 0 ? chartData : generatePlaceholderData();
  }, [chartData]);

  useEffect(() => {
    setDisplayData(initialDisplayData);
  }, [initialDisplayData, timeRange]);

  const renderChart = () => {
    const ChartComponent = chartType === 'bar' ? BarChart : LineChart;
    const DataComponent = (chartType === "bar" ? Bar : Line) as React.ElementType;

    return (
      <ChartContainer config={chartConfig}>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={displayData} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
              <CartesianGrid
                horizontal={false}
                stroke="hsl(var(--border))"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="content"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                fontSize={10}
                interval={'preserveStartEnd'}
              />
              <YAxis
                type="number"
                axisLine={false}
                tickLine={false}
                fontSize={10}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              <Legend />
              {metrics.map((metric) => (
                <DataComponent
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  name={chartConfig[metric].label}
                  stroke={chartConfig[metric].color}
                  fill={chartType === 'bar' ? chartConfig[metric].color : 'transparent'}
                  strokeWidth={chartType === 'line' ? 2 : 0}
                />
              ))}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </ChartContainer>
    );
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Content Performance Analytics</CardTitle>
            <CardDescription className="text-sm">
              Track your content metrics over time
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Select value={chartType} onValueChange={(value: 'bar' | 'line') => setChartType(value)}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Chart Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeRange} onValueChange={(value: '7d' | '30d' | '90d') => setTimeRange(value)}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
                <SelectItem value="90d">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.entries(chartConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setMetrics(prev =>
                prev.includes(key)
                  ? prev.filter(m => m !== key)
                  : [...prev, key]
              )}
              className={`px-2 py-1 rounded-full text-xs transition-colors ${
                metrics.includes(key)
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              {config.label}
            </button>
          ))}
        </div>
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default AnalyticsChart;