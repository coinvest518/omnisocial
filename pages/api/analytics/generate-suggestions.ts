
import { NextApiRequest, NextApiResponse } from 'next';
import { generateContentSuggestions, getTopicMetrics, DEFAULT_METRICS } from '../../../utils/metrics';
import { AISuggestion } from '../../../types/gentypes';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { combinedModels } from '../../../models/combinedModels';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.id) {
    return res.status(401).json({ error: 'You must be logged in to perform this action.' });
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

    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    // Truncate topic to prevent API errors
    const truncatedTopic = topic.slice(0, 100);

    // Generate content suggestions
    const suggestions = await generateContentSuggestions(truncatedTopic);

    // Process each suggestion with proper error handling
    const results: AISuggestion[] = await Promise.all(
      suggestions.map(async (suggestion) => {
        try {
          const metrics = await getTopicMetrics(suggestion);
          return {
            suggestion,
            metrics: metrics || DEFAULT_METRICS
          };
        } catch (error) {
          console.error(`Error processing suggestion: ${suggestion}`, error instanceof Error ? error.message : error);
          return {
            suggestion,
            metrics: DEFAULT_METRICS
          };
        }
      })
    );

    // Deduct credits and store trained data
    await User.findByIdAndUpdate(session.user.id, { $inc: { credits: -1 } });
    console.log('Creating TrainingData with:', {
      source: 'contentsuggestion',
      textContent: JSON.stringify(results),
      userGenerated: false,
      hashtags: [],
      hooks: [],
      engagementMetrics: {
        likes: 0,
        shares: 0,
        comments: 0,
        views: 0,
      },
      category: 'suggestions',
      aiLabels: [],
    });
    await combinedModels.TrainingData.create({
      source: 'contentsuggestion',
      textContent: JSON.stringify(results),
      userGenerated: false,
      hashtags: [],
      hooks: [],
      engagementMetrics: {
        likes: 0,
        shares: 0,
        comments: 0,
        views: 0,
      },
      category: 'suggestions',
      aiLabels: [],
    });

    return res.status(200).json({ suggestions: results });
  } catch (error) {
    console.error('Error processing suggestion request:', error instanceof Error ? error.message : error);
    return res.status(500).json({
      error: 'Failed to process request',
      suggestions: []
    });
  }
}

