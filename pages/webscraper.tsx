'use client'

import React, { useState } from 'react'
import { signOut } from "next-auth/react"
import axios from 'axios'
import Layout from '@/components/Layout'
import SearchBar from '@/components/webscraper/SearchBar'
import { SearchResultsList } from '@/components/webscraper/SearchResultsList'
import AISuggestionsSection from '@/components/webscraper/AISuggestionsSection'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Search, Lightbulb, List, TrendingUp, BarChart2, DollarSign, Users } from 'lucide-react'

interface SearchResult {
  _id: string;
  title: string;
  link: string;
  snippet: string;
  thumbnail?: string; // Add this property
  duration?: string; // Add this property
  views?: number;
  likes?: number;
  shares?: number;
  socialMediaMentions?: number;
  topTrends?: string[];
  postCount?: number;
  comments?: number;
  engagement?: number;
  conversions?: number;
  publicationDate?: string;
  newsOutlet?: string;
  section?: string;
  keywords?: string[];
  videoLength?: number;
  videoThumbnail?: string;
  type: 'web' | 'video' | 'image' | 'news' | 'youtube' | 'shopping' | 'books'; // Add this property
  price?: number; // Add this property
  author?: string; // Add this property
  channel?: string; // Add this property
}

interface AISuggestion {
  suggestion: string
  metrics: {
    views: number
    likes: number
    shares: number
  }
}

export default function WebScraperDashboard() {
  const [userQuery, setUserQuery] = useState('')
  const [searchEngine, setSearchEngine] = useState('google')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [aiSuggestions, setAISuggestions] = useState<AISuggestion[]>([])
  const [metrics, setMetrics] = useState({
    totalSearches: 0,
    engagementRate: 0,
    activeUsers: 0,
    revenue: 0
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isTrending, setIsTrending] = useState(false)

  const fetchSearchResults = async () => {
    if (!userQuery) {
      setError('Please enter a search term')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await axios.post('/api/serpwebscraper', {
        userQuery,
        searchEngine,
      })

      if (response.status !== 200) {
        throw new Error(response.data.message || 'Failed to fetch search results')
      }
  
      const data = response.data

      // Update metrics with actual scraped data
      setMetrics({
        totalSearches: data.totalSearches || 245,
        engagementRate: data.engagementRate || 12.5,
        activeUsers: data.activeUsers || 1234,
        revenue: data.revenue || 24895
      })

      const metadata: SearchResult[] = data.searchResults.map((result: SearchResult) => ({
        title: result.title,
        link: result.link,
        snippet: result.snippet,
        views: result.views ?? 0,
        likes: result.likes ?? 0,
        shares: result.shares ?? 0,
        socialMediaMentions: result.socialMediaMentions ?? 0,
        topTrends: result.topTrends ?? [],
        postCount: result.postCount ?? 0,
        comments: result.comments ?? 0,
        engagement: result.engagement ?? 0,
        conversions: result.conversions ?? 0,
        publicationDate: result.publicationDate ?? '',
        newsOutlet: result.newsOutlet ?? '',
        section: result.section ?? '',
        keywords: result.keywords ?? [],
        videoLength: result.videoLength ?? 0,
        videoThumbnail: result.videoThumbnail ?? '',
      }))

      setSearchResults(metadata)

      const aiSuggestionsResponse = await axios.post('/api/analytics/generate-suggestions', {
        topic: userQuery,
      }, {
        headers: { 'Content-Type': 'application/json' },
      })

      if (aiSuggestionsResponse.status !== 200) {
        throw new Error(aiSuggestionsResponse.data.error || 'Failed to fetch AI suggestions')
      }

      const aiSuggestionsData = aiSuggestionsResponse.data
      setAISuggestions(aiSuggestionsData.suggestions)

      setIsTrending(data.isTrending)

    } catch (error) {
      console.error('Error fetching search results:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: '/' })
  }

  return (
    <Layout title="Web Scraper Dashboard" onLogout={handleLogout}>
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Metrics Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { 
              icon: <Search className="h-4 w-4 text-muted-foreground" />, 
              title: "Total Searches", 
              value: metrics.totalSearches, 
              change: "+20% from last month" 
            },
            { 
              icon: <Lightbulb className="h-4 w-4 text-muted-foreground" />, 
              title: "AI Suggestions", 
              value: aiSuggestions.length, 
              change: "Generated this session" 
            },
            { 
              icon: <BarChart2 className="h-4 w-4 text-muted-foreground" />, 
              title: "Engagement Rate", 
              value: `${metrics.engagementRate}%`, 
              change: "+2% from last week" 
            },
            { 
              icon: <Users className="h-4 w-4 text-muted-foreground" />, 
              title: "Active Users", 
              value: metrics.activeUsers, 
              change: "+7% from last month" 
            }
          ].map((card, index) => (
            <Card key={index} className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">{card.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Cards - Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Trending Topics Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trending Topics</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{isTrending ? "Yes" : "No"}</div>
              <p className="text-xs text-muted-foreground">Current search status</p>
            </CardContent>
          </Card>

          {/* Revenue Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${metrics.revenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+10% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar Card */}
        <Card>
          <CardHeader>
            <CardTitle>Search</CardTitle>
          </CardHeader>
          <CardContent>
            <SearchBar
              userQuery={userQuery}
              setUserQuery={setUserQuery}
              searchEngine={searchEngine}
              setSearchEngine={setSearchEngine}
              onSearch={async (query, engine) => {
                setUserQuery(query)
                setSearchEngine(engine)
                await fetchSearchResults()
              }}
            />
          </CardContent>
        </Card>

        {/* Loading and Error States */}
        {loading && (
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Loading data...</span>
            </CardContent>
          </Card>
        )}

        {/* Results and Suggestions - Responsive Grid */}
        {!loading && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Search Results
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Explore web search results related to your query.
              </p>
            </CardHeader>
            <CardContent>
              <SearchResultsList searchResults={searchResults} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                AI Suggestions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Discover AI-generated content ideas based on your search query.
              </p>
            </CardHeader>
            <CardContent>
              <AISuggestionsSection suggestions={aiSuggestions} />
            </CardContent>
          </Card>
        </div>
          
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </Layout>
  )
}