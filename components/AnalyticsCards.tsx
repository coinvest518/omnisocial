import React, { useState } from 'react';
import { Activity, TrendingUp, Users, Target } from 'lucide-react';
import { InsightSection } from '../types/analytics2';
import { Button } from "@/components/ui/button";


interface AnalyticsCardsProps {
  chartData: {
    date: Date; // Add date field for trend calculation
    views: number;
    likes: number;
    shares: number;
    comments?: number;  // Add optional comments
    conversions: number;
    cost?: number; // Add optional cost for conversions
  }[];
  loading?: boolean;
}

// Helper function to calculate trends
const calculateTrend = (data: number[]): number => {
  if (data.length < 2) return 0;
  const first = data[0];
  const last = data[data.length - 1];
  return ((last - first) / first) * 100;
};

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ chartData = [], loading }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());


  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(title)) {
        newSet.delete(title);
      } else {
        newSet.add(title);
      }
      return newSet;
    });
  };

  const toggleAll = () => {
    if (expandedSections.size === analyticsCards.length) {
      setExpandedSections(new Set());
    } else {
      setExpandedSections(new Set(analyticsCards.map(card => card.title)));
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

    
  

 
  if (loading) { /* ... */ }

  if (chartData.length === 0) { /* ... */ }

  // 1. Calculate Totals:
  const totalViews = chartData.reduce((sum, item) => sum + item.views, 0);
  const totalLikes = chartData.reduce((sum, item) => sum + item.likes, 0);
  const totalShares = chartData.reduce((sum, item) => sum + item.shares, 0);
  const totalComments = chartData.reduce((sum, item) => sum + (item.comments || 0), 0);
  const totalConversions = chartData.reduce((sum, item) => sum + item.conversions, 0);
  const totalCost = chartData.reduce((sum, item) => sum + (item.cost || 0), 0);

  // 2. Data Arrays for Trends:
  const viewsData = chartData.map(item => item.views);
  const likesData = chartData.map(item => item.likes);
  const sharesData = chartData.map(item => item.shares); // Add sharesData
  const commentsData = chartData.map(item => item.comments || 0); // Add commentsData
  const conversionsData = chartData.map(item => item.conversions); // Add conversionsData
  const costData = chartData.map(item => item.cost || 0); // Add costData


  // 3. Calculate Trends:
  const viewsTrend = calculateTrend(viewsData);
  const likesTrend = calculateTrend(likesData);
  const sharesTrend = calculateTrend(sharesData); // Calculate sharesTrend
  const commentsTrend = calculateTrend(commentsData); // Calculate commentsTrend
  const conversionsTrend = calculateTrend(conversionsData); // Calculate conversionsTrend
  const costTrend = calculateTrend(costData); // Calculate costTrend

  // 4. Calculate Metrics (Using the newly calculated totals):
  const avgEngagement = ((totalLikes + totalShares + totalComments) / totalViews) * 100 || 0;
  const conversionRate = (totalConversions / totalViews) * 100 || 0;
  const costPerConversion = totalCost / totalConversions || 0;

  // Dynamic Metrics Function
  const getMetrics = (title: string): { label: string; value: number | string; trend: number }[] => {
    switch (title) {
      case 'Total Views':
        return [
          { label: 'Daily Average', value: Math.round(totalViews / chartData.length), trend: viewsTrend },
          { label: 'Peak Views', value: Math.max(...viewsData), trend: viewsTrend }, // Use viewsData for peak
        ];
      case 'Engagement Rate':
        return [
          { label: 'Comments', value: `${((totalComments / totalViews) * 100).toFixed(2)}%`, trend: commentsTrend},
          { label: 'Shares', value: `${((totalShares / totalViews) * 100).toFixed(2)}%`, trend: sharesTrend },
        ];
        case 'Total Likes':
        return [
          { label: 'Like Rate', value: `${((totalLikes / totalViews) * 100).toFixed(2)}%`, trend: likesTrend },
          { label: 'Daily Average', value: Math.round(totalLikes / chartData.length), trend: likesTrend },
        ];
      case 'Conversion Rate':
        return [
          { label: 'Total Conversions', value: totalConversions, trend: conversionsTrend },
          { label: 'Cost per Conversion', value: costPerConversion.toFixed(2) , trend: costTrend },  // Use calculated costPerConversion
        ];
      // ... other cases for different metrics
      default:
        return [];
    }
  };

  const analyticsCards: InsightSection[] = [
    {
      icon: Activity,
      title: 'Total Views',
      value: totalViews,
      change: `${viewsTrend.toFixed(1)}%`,
      changeColor: viewsTrend > 0 ? 'text-green-500' : 'text-red-500',
      metrics: getMetrics('Total Views'),
      recommendations: [
        'Post content during peak hours to maximize visibility',
        'Analyze top-performing content for insights',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Engagement Rate',
      value: `${(avgEngagement * 100).toFixed(2)}%`,
      change: '+8.3%',
      changeColor: 'text-green-500',
      metrics: [
        { label: 'Comments', value: `${((totalLikes / totalViews) * 100).toFixed(2)}%`, trend: 3.1 },
        { label: 'Shares', value: `${((totalShares / totalViews) * 100).toFixed(2)}%`, trend: 6.5 },
      ],
      recommendations: [
        'Encourage user interactions through questions or polls',
        'Respond promptly to comments to boost engagement',
      ],
    },
    {
      icon: Users,
      title: 'Total Likes',
      value: totalLikes,
      change: '+15.7%',
      changeColor: 'text-green-500',
      metrics: [
        { label: 'Like Rate', value: `${((totalLikes / totalViews) * 100).toFixed(2)}%`, trend: 2.8 },
        { label: 'Daily Average', value: Math.round(totalLikes / chartData.length), trend: 4.3 },
      ],
      recommendations: [
        'Create more content similar to your most-liked posts',
        'Experiment with different types of content to see what resonates',
      ],
    },
    {
      icon: Target,
      title: 'Conversion Rate',
      value: `${(conversionRate * 100).toFixed(2)}%`,
      change: '+5.2%',
      changeColor: 'text-green-500',
      metrics: [
        { label: 'Total Conversions', value: chartData.reduce((sum, item) => sum + item.conversions, 0), trend: 7.2 },
        { label: 'Cost per Conversion', value: '$2.34', trend: -3.1 },
      ],
      recommendations: [
        'Optimize your call-to-action placement and wording',
        'A/B test different landing pages to improve conversion rates',
      ],
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={toggleAll} variant="outline">
          {expandedSections.size === analyticsCards.length ? 'Collapse All' : 'Expand All'}
        </Button>
      </div>
      
    </div>
  );
};

export default AnalyticsCards;

