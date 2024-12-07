
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import axios from 'axios'



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('Received request to /api/trending-hashtags');
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user?.id) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await dbConnect();
    const user = await User.findById(session.user.id);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    if (user.credits < 1) {
        return res.status(403).json({ error: 'Insufficient credits' });
    }
    const apiKey = process.env.NEXT_PUBLIC_SERPAPI_API_KEY; // Get SerpApi API key from environment variables
    if (!apiKey) {
      throw new Error('SERPAPI_API_KEY environment variable not set');
    }

    // Make the API request to SerpApi to get trending hashtags
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: 'trending hashtags', // You can adjust the query if needed
        api_key: apiKey,
        engine: 'google', // Using Google search engine
        hl: 'en', // Language
        gl: 'us', // Country (can be customized)
      }
    });

    // Check if the response contains the expected data
    if (!response.data || !response.data.organic_results) {
        throw new Error('Invalid response structure from SerpAPI');
    }

    // Process the response to extract trending hashtags
    const trendingHashtags = response.data.organic_results.slice(0, 5).map((item: any) => {
        return {
            tag: `#${item.title.replace(/\s+/g, '')}`, // Create a hashtag from the title
            score: Math.round(Math.random() * 100), // Example score, replace with actual logic if needed
            volume: Math.round(Math.random() * 10000), // Example volume, replace with actual logic if needed
            trend: Array(5).fill(0).map((_, day) => ({ day: day + 1, value: Math.round(Math.random() * 100) })) // Example trend data
        };
    });

     // Update user credits and log usage
     await User.findByIdAndUpdate(session.user.id, {
        $inc: { credits: -3 },
        $push: {
            hashtags: trendingHashtags.map((hashtag: { tag: any; }) => ({ tag: hashtag.tag, createdAt: new Date() })) //Corrected to hashtags: generatedHashtags.map(...)
          },
        }, { new: true });
        
    

    console.log('Trending Hashtags:', trendingHashtags);
    res.status(200).json(trendingHashtags); // Send back to client
} catch (error) {
    console.error('Error fetching trending hashtags:', error);
    res.status(500).json({ error: 'Error fetching trending hashtags' });
}
}