// services/chartService.ts

export interface ChartDataEntry {
  content: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagement: number;
  conversions: number;
}

export interface EnhancedChartDataEntry extends ChartDataEntry {
  channelContext?: {
    name: string;
    totalSubscribers: number;
    totalVideos: number;
    totalChannelViews: number;
  };
}

export interface ChartDataParams {
  timeRange: '7d' | '30d' | '90d';
  metrics?: string[];
  contentType?: string;
}

export interface ChartDataResponse {
  chartData: EnhancedChartDataEntry[];
  metrics: {
    totalViews: number;
    averageEngagement: number;
    timeRange: string;
    lastUpdated: string;
  };
}

export const fetchChartData = async (params: ChartDataParams): Promise<ChartDataResponse> => {
  try {
    const response = await fetch('/api/analytics/chart-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch chart data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching chart data:', error);
    throw error;
  }
};

export const aggregateChartData = (
  data: EnhancedChartDataEntry[],
  groupBy: 'day' | 'week' | 'month'
): Record<string, EnhancedChartDataEntry> => {
  return data.reduce<Record<string, EnhancedChartDataEntry>>((acc, entry) => {
    const key = groupBy === 'day' ? entry.content : `GroupKey-${groupBy}`;
    if (!acc[key]) {
      acc[key] = { ...entry };
    } else {
      acc[key].views += entry.views;
      acc[key].likes += entry.likes;
      acc[key].shares += entry.shares;
      acc[key].comments += entry.comments;
      acc[key].engagement += entry.engagement;
      acc[key].conversions += entry.conversions;
    }
    return acc;
  }, {});
};

export const calculateGrowthRate = (data: EnhancedChartDataEntry[], metric: keyof EnhancedChartDataEntry) => {
  if (data.length < 2) return 0;

  const oldValue = data[0][metric] as number;
  const newValue = data[data.length - 1][metric] as number;

  return ((newValue - oldValue) / oldValue) * 100;
};

export const getMetricStats = (data: EnhancedChartDataEntry[], metric: keyof EnhancedChartDataEntry) => {
  const values = data.map(entry => entry[metric] as number);
  return {
    average: values.reduce((a, b) => a + b, 0) / values.length,
    max: Math.max(...values),
    min: Math.min(...values),
    total: values.reduce((a, b) => a + b, 0),
  };
};