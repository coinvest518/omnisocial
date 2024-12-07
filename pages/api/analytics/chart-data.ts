// pages/api/analytics/chart-data.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { ChartDataEntry, ChartDataParams } from '@/services/chartService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    { chartData: ChartDataEntry[]; metrics: any } | { message: string }
  >
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const params: ChartDataParams = req.body;
    let chartData: ChartDataEntry[] = [];


    if (params.dataSource === 'serpApi') {
      const serpResponse = await fetch(
        `/api/proxySerpApi/serp?query=${encodeURIComponent(String(params.query))}`
      );
      if (!serpResponse.ok) {
        throw new Error('Failed to fetch SerpAPI data');
      }
      const serpData = await serpResponse.json();
    
      chartData = serpData.map((item: any) => ({
        content: item.keyword || item.query,
        views: item.searchVolume || 0,
        likes: item.likes || 0,
        shares: item.shares || 0,
        comments: item.comments || 0,
        engagement: item.engagement || 0,
        conversions: item.conversions || 0,
      }));
    }

    // Check the data source based on the provided parameter
    if (params.dataSource === 'googleTrends') {
      // Fetch Google Trends data (replace with your actual logic)
      const trendsResponse = await fetch(
        `/api/proxySerpApi?topic=${encodeURIComponent(String(params.query))}`
      );
      if (!trendsResponse.ok) {
        throw new Error('Failed to fetch Google Trends data');
      }
      const trendsData = await trendsResponse.json();

      chartData = trendsData.map((trend: any) => ({
        content: trend.query,
        views: trend.average_monthly_searches || 0,
        likes: 0, // Google Trends doesn't provide likes
        shares: 0, // Google Trends doesn't provide shares
        comments: 0, // Google Trends doesn't provide comments
        engagement: 0, // Calculate engagement based on your logic
        conversions: 0, // Google Trends doesn't provide conversions
      }));
    } else if (params.dataSource === 'serpApi'){
        //make call to the regular serpapi and get correct data and fill in accordingly
    } else {
      // Default or other data source (e.g., your database)
       // ... your default logic to fetch chart data ...
      const days = params.timeRange === '7d' ? 7 : params.timeRange === '30d' ? 30 : 90;
      chartData = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - i - 1));
        return {
          content: date.toISOString().split('T')[0],
          views: Math.floor(Math.random() * 1000) + 100,
          likes: Math.floor(Math.random() * 500) + 50,
          shares: Math.floor(Math.random() * 200) + 20,
          comments: Math.floor(Math.random() * 100) + 10,
          engagement: Math.floor(Math.random() * 80) + 20,
          conversions: Math.floor(Math.random() * 50) + 5,
        };
      });
    }
    

    // Calculate metrics (adapt as needed for your data)
    const totalViews = chartData.reduce((sum, entry) => sum + entry.views, 0);
    const averageEngagement =
      chartData.reduce((sum, entry) => sum + (entry.engagement || 0), 0) /
      chartData.length; // Handle cases where engagement might be undefined


    return res.status(200).json({
      chartData,
      metrics: {
        totalViews,
        averageEngagement,
        // ... other metrics you want to calculate
      },
    });
  } catch (error) {
    console.error('Error in chart data API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

