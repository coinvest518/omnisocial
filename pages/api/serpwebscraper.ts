import axios from 'axios';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import { combinedModels } from '../../models/combinedModels';
import { analyzeSentiment } from '../../utils/metrics'; 



interface SearchResult {
  title: string;
  link: string;
  snippet: string;
  views: number;
  likes: number;
  shares: number;
  socialMediaMentions: number;
  topTrends: string[];
  postCount: number;
  comments: number;
  engagement: number;
  conversions: number;
  publicationDate: string;
  newsOutlet: string;
  section: string;
  keywords: string[];
  videoLength: number;
  videoThumbnail: string;
}

interface SerpApiResponse {
  searchResults: SearchResult[];
  chartData: {
    content: string;
    views: number;
    likes: number;
    shares: number;
  }[];
  socialMediaMentions: number;
  topTrends: string[];
  postCount?: number;
  sectionData: {
    industryNews: SearchResult[];
    socialMediaTrends: SearchResult[];
    financialTrends: SearchResult[];
    youtubeMetrics: SearchResult[];
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SerpApiResponse | { message: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userQuery, searchEngine } = req.body; // Get apiEndpoint from body

  if (!userQuery) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'You must be logged in to perform this action.' });
  }

  try {
    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.credits < 1) {
      return res.status(403).json({ message: 'Insufficient credits' });
    }

    let apiUrl = `https://serpapi.com/search?api_key=${process.env.NEXT_PUBLIC_SERPAPI_API_KEY}&q=${encodeURIComponent(userQuery)}&engine=${searchEngine}`;

    if (searchEngine === 'google_trends') {
      apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/proxy/trends?topic=${encodeURIComponent(
        userQuery
      )}`;
    }


    const response = await axios.get(apiUrl);

    const searchResults: SearchResult[] = response.data.organic_results.map((result: any) => {
      // Custom section classification
      let section = '';
      const title = (result.title || '').toLowerCase();
      const snippet = (result.snippet || '').toLowerCase();
    
      if (title.includes('finance') || title.includes('stock') || 
          snippet.includes('stock') || snippet.includes('market') || 
          snippet.includes('investment')) {
        section = 'financialTrends';
      } else if (title.includes('social media') || 
                 snippet.includes('twitter') || snippet.includes('facebook') || 
                 snippet.includes('instagram') || snippet.includes('linkedin')) {
        section = 'socialMediaTrends';
      } else if (title.includes('youtube') || title.includes('video') || 
                 snippet.includes('video') || snippet.includes('streaming')) {
        section = 'youtubeMetrics';
      } else {
        section = 'industryNews';
      }
    
      return {
        title: result.title,
        link: result.link,
        snippet: result.snippet,
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 500),
        shares: Math.floor(Math.random() * 200),
        comments: Math.floor(Math.random() * 100),
        engagement: Math.random(),
        conversions: Math.floor(Math.random() * 50),
        socialMediaMentions: 0,
        topTrends: [],
        postCount: 0,
        publicationDate: result.publication_date || '', // Populate new fields
        newsOutlet: result.news_outlet || '',
        section: section, // Set the computed section here
        keywords: result.keywords || [],
        videoLength: result.video_length || 0,
        videoThumbnail: result.video_thumbnail || ''
      };
    });

    const chartData = searchResults.slice(0, 5).map(result => ({
      content: result.title.substring(0, 20),
      views: result.views || 0,
      likes: result.likes || 0,
      shares: result.shares || 0
    }));

    const socialMediaMentions = searchResults.reduce((sum, result) => sum + (result.socialMediaMentions || 0), 0);
    const topTrends = searchResults.flatMap(result => result.topTrends || []).filter(Boolean).slice(0, 5);
    const postCount = searchResults.length;

  // Analyze sentiment for each result
for (const result of searchResults) {
  const sentiment = await analyzeSentiment(result.snippet);
  result.engagement = sentiment.sentimentScore; // Use sentimentScore instead of score
}

    await User.findByIdAndUpdate(session.user.id, { $inc: { credits: -1 } });

    await combinedModels.TrainingData.create({
      source: 'serpapi',
      textContent: JSON.stringify(searchResults),
      userGenerated: false,
      hashtags: [],
      hooks: [],
      engagementMetrics: {
        likes: 0,
        shares: 0,
        comments: 0,
        views: 0,
      },
      category: 'general',
      aiLabels: [],
    });


    // Creating sectionData based on searchResults
    const sectionData = {
      industryNews: searchResults.filter(result => result.section === 'industryNews'),
      socialMediaTrends: searchResults.filter(result => result.section === 'socialMediaTrends'),
      financialTrends: searchResults.filter(result => result.section === 'financialTrends'),
      youtubeMetrics: searchResults.filter(result => result.section === 'youtubeMetrics'),
    };

    const transformedData = searchResults.map((result) => ({
      ...result,
      socialMediaMentions: result.socialMediaMentions,
      topTrends: result.topTrends
    }));

    res.status(200).json({
      searchResults: transformedData,
      chartData,
      socialMediaMentions,
      topTrends,
      postCount,
      sectionData, // Include sectionData in the response
    });
  } catch (error) {
    console.error('SERP API error:', error);
    res.status(500).json({ message: 'Error fetching search results' });
  }
}