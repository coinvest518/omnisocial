// pages/api/serp.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios'; // You'll need to install axios

// Define the structure of search results
interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  views: number;
  likes: number;
  shares: number;
  socialMediaMentions: number; // Add new fields here
  topTrends: string[];          // And here for any other metrics you need.
  postCount: number
}

// Define the API response structure
interface SerpApiResponse {
  searchResults: SearchResult[];
  chartData: {
    content: string;
    views: number;
    likes: number;
    shares: number;

  }[];
  socialMediaMentions: number; // New field for total mentions
  topTrends: string[];          // and top trends
  postCount?: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SerpApiResponse | { message: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userQuery, searchEngine } = req.body;

  if (!userQuery) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    // Replace this with your actual SERP API provider (e.g., Serpapi, Serper, etc.)
    const apiKey = process.env.SERPAPI_API_KEY;
    const apiUrl = `https://serpapi.com/search?api_key=${apiKey}&q=${encodeURIComponent(userQuery)}&engine=${searchEngine}`;
    
    const response = await axios.get(apiUrl);


    
    
    // Transform the API response into our expected format
    const searchResults: SearchResult[] = response.data.organic_results.map((result: any) => ({
      title: result.title,
      link: result.link,
      snippet: result.snippet,
      // You might need to add logic to fetch views/likes/shares
      views: Math.floor(Math.random() * 1000),
      likes: Math.floor(Math.random() * 500),
      shares: Math.floor(Math.random() * 200)
    }));

    // Generate chart data
    const chartData = searchResults.slice(0, 5).map(result => ({
      content: result.title.substring(0, 20), // Truncate title for chart
      views: result.views || 0,
      likes: result.likes || 0,
      shares: result.shares || 0
    }));


     // Calculate or fetch additional metrics based on your requirements
     const socialMediaMentions = searchResults.reduce((sum, result) => sum + (result.socialMediaMentions || 0), 0);  // Placeholder calculation. Replace with your actual logic.
     const topTrends = searchResults.flatMap(result => result.topTrends || []).filter(Boolean).slice(0, 5); // Extracts, deduplicates, and limits to top 5. Replace with actual trend extraction
     const postCount = searchResults.length

     // Transform the data to include these metrics
     const transformedData = searchResults.map((result) => ({
        ...result, // Include original fields
        socialMediaMentions: result.socialMediaMentions, // Add new metric to individual result if available
        topTrends: result.topTrends // And any other calculated metric.
    }));

    res.status(200).json({ searchResults: transformedData,
        chartData,
        socialMediaMentions,
        topTrends,
        postCount });
  } catch (error) {
    console.error('SERP API error:', error);
    res.status(500).json({ message: 'Error fetching search results' });
  }
}