import OpenAI from 'openai';
import { HfInference } from '@huggingface/inference';
import { SentimentAnalysis, Metrics, PerformanceMetrics } from '../types/gentypes';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export const DEFAULT_METRICS: Metrics = {
  views: 0,
  likes: 0,
  shares: 0,
  demographics: {
    ageGroups: {},
    geography: {},
    interests: []
  },
  sentiment: {
    positiveRatio: 0.5,
    sentimentScore: 0,
    commentCount: 0
  },
  performance: {
    views: 0,
    likes: 0,
    shares: 0,
    engagementRate: 0,
    conversionRate: 0,
    averageTimeSpent: 0,
    longTermEngagement: 0
  }
};

export async function generateContentSuggestions(topic: string): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a content strategy expert. Generate 4 unique content ideas related to the given topic. Make them specific and actionable. Keep each suggestion under 100 characters to comply with API limits."
        },
        {
          role: "user",
          content: `Generate 4 unique content ideas related to: ${topic}`
        }
      ],
      model: "gpt-3.5-turbo",
    });

    const suggestions = completion.choices[0].message.content
      ?.split('\n')
      .filter(Boolean)
      .map(suggestion => suggestion.slice(0, 100))
      || [];

    return suggestions.slice(0, 4);
  } catch (error) {
    console.error('Error generating content suggestions:', error instanceof Error ? error.message : error);
    throw new Error('Failed to generate content suggestions');
  }
}

export async function getTopicMetrics(topic: string): Promise<Metrics> {
  try {
    if (!topic || topic.length > 100) {
      throw new Error('Invalid topic length');
    }

    const sentiment = await analyzeSentiment(topic);
    const suggestions = await generateContentSuggestions(topic);
    const historicalMetrics = await fetchHistoricalMetrics(topic);

    
    // Create custom metrics based on sentiment and suggestions
    const performance: PerformanceMetrics = {
        views: historicalMetrics.averageViewsPerSuggestion * suggestions.length,
        likes: historicalMetrics.averageLikesPerSuggestion * suggestions.length,
        shares: historicalMetrics.averageSharesPerSuggestion * suggestions.length,
        engagementRate: (sentiment.positiveRatio * 100) / suggestions.length, // Adjust if you have historical data
        conversionRate: sentiment.positiveRatio,
        averageTimeSpent: historicalMetrics.averageTimeSpent, // From historical data
        longTermEngagement: historicalMetrics.longTermEngagement, // Proxy metric
      };

    return {
        views: performance.views,
        demographics: DEFAULT_METRICS.demographics, // Keep default demographics as we are not fetching them
      sentiment,
      performance
    };



  } catch (error) {
    console.error('Error fetching topic metrics:', error instanceof Error ? error.message : error);
    return DEFAULT_METRICS;
  }
}

async function fetchHistoricalMetrics(topic: string): Promise<{
  averageViewsPerSuggestion: number;
  averageLikesPerSuggestion: number;
  averageSharesPerSuggestion: number;
  averageTimeSpent: number;
  longTermEngagement: number;
}> {
  // Example: Replace with actual API call or database query
  return {
    averageViewsPerSuggestion: 150, // Average views per suggestion from historical data
    averageLikesPerSuggestion: 30,  // Average likes per suggestion from historical data
    averageSharesPerSuggestion: 10, // Average shares per suggestion from historical data
    averageTimeSpent: 7,            // Average time spent in minutes
    longTermEngagement: 50,         // Long-term engagement metric
  };
}

export async function analyzeSentiment(text: string): Promise<SentimentAnalysis> {
  try {
    const sentiment = await hf.textClassification({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: text
    });

    const firstResult = sentiment[0];

    // Handle potential undefined values from the Hugging Face API response
    const score = firstResult?.score ?? 0;
    const label = firstResult?.label ?? 'NEGATIVE';

    return {
      positiveRatio: label === 'POSITIVE' ? score : 1 - score,
      sentimentScore: label === 'POSITIVE' ? score : -score,
      commentCount: 1 // Assuming one comment for the analysis
    };
  } catch (error) {
    console.warn('Failed to analyze sentiment, using defaults:', error instanceof Error ? error.message : error);
    return { positiveRatio: 0.5, sentimentScore: 0, commentCount: 0 }; // Ensure this returns a valid SentimentAnalysis object
  }
}