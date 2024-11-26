import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Define proper TypeScript interfaces
interface Demographics {
  ageGroups: Record<string, number>;
  geography: Record<string, number>;
  interests: string[];
}

interface SentimentAnalysis {
  positiveRatio: number;
  sentimentScore: number;
  commentCount: number;
}

interface PerformanceMetrics {
  engagementRate: number;
  conversionRate: number;
  averageTimeSpent: number;
  longTermEngagement: number;
}

interface Metrics {
  views?: number;
  likes?: number;
  shares?: number;
  demographics?: Demographics;
  sentiment?: SentimentAnalysis;
  performance?: PerformanceMetrics;
}

interface AISuggestion {
  suggestion: string;
  metrics?: Metrics;
}

interface AISuggestionsSectionProps {
  suggestions: AISuggestion[];
}

const MetricBadge: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <Badge variant="secondary" className="text-sm">
    {label}: {value}
  </Badge>
);

const SuggestionCard: React.FC<{ suggestion: AISuggestion }> = ({ suggestion }) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="text-lg">{suggestion.suggestion}</CardTitle>
    </CardHeader>
    <CardContent>
      {suggestion.metrics && (
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-2">
            {suggestion.metrics.views !== undefined && <MetricBadge label="Views" value={suggestion.metrics.views} />}
            {suggestion.metrics.likes !== undefined && <MetricBadge label="Likes" value={suggestion.metrics.likes} />}
            {suggestion.metrics.shares !== undefined && <MetricBadge label="Shares" value={suggestion.metrics.shares} />}
          </TabsContent>
          <TabsContent value="sentiment" className="space-y-2">
            {suggestion.metrics.sentiment && (
              <>
                <MetricBadge 
                  label="Positive Ratio" 
                  value={`${(suggestion.metrics.sentiment.positiveRatio * 100).toFixed(1)}%`} 
                />
                <MetricBadge 
                  label="Sentiment Score" 
                  value={suggestion.metrics.sentiment.sentimentScore.toFixed(2)} 
                />
                <MetricBadge 
                  label="Comments" 
                  value={suggestion.metrics.sentiment.commentCount} 
                />
              </>
            )}
          </TabsContent>
          <TabsContent value="performance" className="space-y-2">
            {suggestion.metrics.performance && (
              <>
                <MetricBadge 
                  label="Engagement Rate" 
                  value={`${(suggestion.metrics.performance.engagementRate * 100).toFixed(1)}%`} 
                />
                <MetricBadge 
                  label="Conversion Rate" 
                  value={`${(suggestion.metrics.performance.conversionRate * 100).toFixed(1)}%`} 
                />
                <MetricBadge 
                  label="Avg. Time Spent" 
                  value={`${suggestion.metrics.performance.averageTimeSpent.toFixed(2)}s`} 
                />
                <MetricBadge 
                  label="Long-term Engagement" 
                  value={`${(suggestion.metrics.performance.longTermEngagement * 100).toFixed(1)}%`} 
                />
              </>
            )}
          </TabsContent>
        </Tabs>
      )}
    </CardContent>
  </Card>
);

const AISuggestionsSection: React.FC<AISuggestionsSectionProps> = ({ suggestions = [] }) => {
  if (!suggestions || suggestions.length === 0) {
    return (
      <Card className="p-6 mt-8"> {/* Added mt-8 for top padding */}
        <CardTitle className="text-xl font-bold mb-4">AI Suggestions</CardTitle>
        <CardContent>
          <p className="text-gray-500">No suggestions available at the moment.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-6 mt-8"> {/* Added mt-8 for top padding */}
      <CardTitle className="text-xl font-bold mb-4">AI Suggestions</CardTitle>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((suggestion, index) => (
            <SuggestionCard key={index} suggestion={suggestion} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AISuggestionsSection;

