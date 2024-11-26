import { NextApiRequest, NextApiResponse } from 'next';
import { generateContentSuggestions, getTopicMetrics, DEFAULT_METRICS } from '../../../utils/metrics';
import { AISuggestion } from '../../../types/gentypes';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    return res.status(200).json({ suggestions: results });
  } catch (error) {
    console.error('Error processing suggestion request:', error instanceof Error ? error.message : error);
    return res.status(500).json({
      error: 'Failed to process request',
      suggestions: [] // Return empty array instead of null
    });
  }
}

