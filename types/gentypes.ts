export interface Demographics {
    ageGroups: { [key: string]: number };
    geography: { [key: string]: number };
    interests: string[];
  }
  
  export interface SentimentAnalysis {
    positiveRatio: number;
    sentimentScore: number;
    commentCount: number;
  }
  
  export interface PerformanceMetrics {
    views: number;
    likes: number;
    shares: number;
    engagementRate: number;
    conversionRate: number;
    averageTimeSpent: number;
    longTermEngagement: number;
  }
  
  export interface Metrics {
    views: number;
    likes?: number;
    shares?: number;
    demographics?: Demographics;
    sentiment?: SentimentAnalysis;
    performance?: PerformanceMetrics;
  }
  
  export interface AISuggestion {
    suggestion: string;
    metrics?: Metrics;
  }