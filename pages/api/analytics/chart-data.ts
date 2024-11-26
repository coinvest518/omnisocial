// pages/api/analytics/chart-data.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { ChartDataEntry, ChartDataParams } from '@/services/chartService';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const params: ChartDataParams = req.body;
    
    // Here you would typically:
    // 1. Connect to your database
    // 2. Query the analytics data based on params
    // 3. Process and aggregate the data
    
    // For now, we'll generate sample data
    const days = params.timeRange === '7d' ? 7 : params.timeRange === '30d' ? 30 : 90;
    const chartData: ChartDataEntry[] = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      
      return {
        content: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 1000) + 100,
        likes: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 200) + 20,
        comments: Math.floor(Math.random() * 100) + 10,
        engagement: Math.floor(Math.random() * 80) + 20,
        conversions: Math.floor(Math.random() * 50) + 5
      };
    });

    // Calculate some additional metrics
    const totalViews = chartData.reduce((sum, entry) => sum + entry.views, 0);
    const averageEngagement = chartData.reduce((sum, entry) => sum + entry.engagement, 0) / days;

    return res.status(200).json({
      chartData,
      metrics: {
        totalViews,
        averageEngagement,
        timeRange: params.timeRange,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error in chart data API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}