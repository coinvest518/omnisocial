import React, { useState } from 'react';
import SearchBar from '../components/webscraper/SearchBar';
import { StatsCards } from '../components/webscraper/StatsCards';
import { SearchResultsList } from '../components/webscraper/SearchResultsList';
import ChartSection from '../components/webscraper/ChartSection';
import TaskTypeSection from '../components/webscraper/TaskTypeSection';
import AISuggestionsSection from '../components/webscraper/AISuggestionsSection';
import { signOut } from "next-auth/react";
import Layout from '@/components/Layout';
import { ChartDataEntry } from '@/services/chartService';

// Define interfaces
interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  views?: number;
  likes?: number;
  shares?: number;
}

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

interface AISuggestion {
  suggestion: string;
  metrics: {
    views: number;
    likes: number;
    shares: number;
    demographics: Demographics;
    sentiment: SentimentAnalysis;
    performance: PerformanceMetrics;
  };
}

export default function WebScraperDashboard() {
  const [userQuery, setUserQuery] = useState('');
  const [searchEngine, setSearchEngine] = useState('google');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [chartData, setChartData] = useState<ChartDataEntry[]>([]);
  const [socialMediaMentions, setSocialMediaMentions] = useState(0);
  const [topTrends, setTopTrends] = useState<string[]>([]);
  const [postCount, setPostCount] = useState(0);
  const [aiSuggestions, setAISuggestions] = useState<AISuggestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchSearchResults = async () => {
    if (!userQuery) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/serpwebscraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery, searchEngine }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch search results');
      }

      const data = await response.json();

      // Process chart data
      const consistentChartData: ChartDataEntry[] = data.chartData.map((item: any) => ({
        content: item.content,
        views: item.views,
        likes: item.likes,
        shares: item.shares,
        comments: item.comments ?? 0,
        engagement: item.engagement ?? 0,
        conversions: item.conversions ?? 0,
      }));

      setChartData(consistentChartData);
      setSearchResults(data.searchResults);
      setSocialMediaMentions(data.socialMediaMentions);
      setTopTrends(data.topTrends);
      setPostCount(data.postCount);

      // Fetch AI Suggestions
      const aiSuggestionsResponse = await fetch('/api/analytics/generate-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: userQuery }),
      });

      if (!aiSuggestionsResponse.ok) {
        const errorData = await aiSuggestionsResponse.json();
        throw new Error(errorData.error || 'Failed to fetch AI suggestions');
      }

      const aiSuggestionsData = await aiSuggestionsResponse.json();
      setAISuggestions(aiSuggestionsData.suggestions);

    } catch (error) {
      console.error('Error fetching search results:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  return (
    <Layout title="" onLogout={handleLogout}>
      <div className="webscraper-dashboard">
        <h1>Web Scraper Dashboard</h1>
        
        <SearchBar
          userQuery={userQuery}
          setUserQuery={setUserQuery}
          searchEngine={searchEngine}
          setSearchEngine={setSearchEngine}
          onSearch={fetchSearchResults}
        />

        <StatsCards
          searchResults={searchResults}
          socialMediaMentions={socialMediaMentions}
          topTrends={topTrends}
          postCount={postCount} 
          queryUrl={''}       
           />

        {chartData.length > 0 && <ChartSection chartData={chartData} />}
        {loading && <div>Loading chart...</div>}
        
        <AISuggestionsSection suggestions={aiSuggestions} />
        <SearchResultsList searchResults={searchResults} />
        <TaskTypeSection data={searchResults} />

        {error && <p className="error-message">{error}</p>}
        {loading && <p>Loading search results...</p>}
      </div>
    </Layout>
  );
}