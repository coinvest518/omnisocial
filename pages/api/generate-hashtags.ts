import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user?.id) {
        return res.status(401).json({ error: 'You must be logged in to generate hashtags.' });
    }

    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
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

        const apiKey = process.env.SERPAPI_API_KEY; // Get SerpApi API key from environment variables
        if (!apiKey) {
            throw new Error('SERPAPI_API_KEY environment variable not set');
        }

        // Make the API request to SerpApi to get related searches
        const response = await axios.get('https://serpapi.com/search', {
            params: {
                q: topic, // Use the topic provided in the request
                api_key: apiKey,
                engine: 'google', // Using Google search engine
                hl: 'en', // Language
                gl: 'us', // Country (can be customized)
            }
        });

        // Check if the response contains the expected data
        if (!response.data || !response.data.related_searches) {
            throw new Error('Invalid response structure from SerpAPI');
        }

        // Process the response to extract generated hashtags
        const relatedSearches = response.data.related_searches || [];
        const generatedHashtags = relatedSearches.map((item: any) => ({
            tag: `#${item.query.replace(/\s+/g, '')}`,
            score: Math.round(Math.random() * 25 + 75), // Example score, replace with actual logic if needed
            volume: Math.round(Math.random() * 500000 + 300000), // Example volume, replace with actual logic if needed
            trend: Array(5).fill(0).map((_, day) => ({ day: day + 1, value: Math.round(Math.random() * 25 + 75) })) // Example trend data
        }));

        // Update user credits and log usage
        await User.findByIdAndUpdate(session.user.id, {
            $inc: { credits: -1 },
            $push: { 
                hashtags: generatedHashtags.map((hashtag: { tag: any; }) => ({ tag: hashtag.tag, createdAt: new Date() })) // Push hashtags to correct array
              },
            }, { new: true });
        

        return res.status(200).json({ hashtags: generatedHashtags });
    } catch (error) {
        console.error('Error generating hashtags:', error);
        return res.status(500).json({ error: 'Failed to generate hashtags' });
    }
}
