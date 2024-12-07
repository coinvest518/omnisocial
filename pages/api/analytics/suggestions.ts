// pages/api/analytics/generate-suggestions.js
import OpenAI from 'openai';
import { HfInference } from '@huggingface/inference';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

export default async function handler(req: { method: string; body: { topic: any; section: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; sentiment?: { positiveRatio: any; sentimentScore: any; commentCount: number; }; suggestions?: any; }): void; new(): any; }; }; }) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, section } = req.body;

  if (!topic || typeof topic !== 'string' || topic.length === 0) {
    return res.status(400).json({ error: 'Topic is required and must be a non-empty string' });
  }

  if (!section || typeof section !== 'string' || section.length === 0) {
    return res.status(400).json({ error: 'Section is required and must be a non-empty string' });
  }

  try {
    // Fetch sentiment analysis from Hugging Face
    const sentiment = await hf.textClassification({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: topic
    });

    const firstResult = sentiment[0];
    const score = firstResult?.score ?? 0;
    const label = firstResult?.label ?? 'NEGATIVE';

    // Generate content suggestions using OpenAI based on the section
    let systemMessage = "You are a content strategy expert. Generate 4 unique content ideas related to the given topic. Make them specific and actionable. Keep each suggestion under 100 characters to comply with API limits.";
    
    // Customize the prompt based on the section
    if (section === "Industry News & Updates") {
      systemMessage += " Focus on recent developments and news articles.";
    } else if (section === "Social Media Trends") {
      systemMessage += " Focus on trending topics and engagement strategies.";
    } else if (section === "Financial Trends & Advice") {
      systemMessage += " Focus on market analysis and investment strategies.";
    } else if (section === "YouTube Metrics & Analytics") {
      systemMessage += " Focus on video performance and audience engagement.";
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: `Generate 4 unique content ideas related to: ${topic}` }
      ],
      model: "gpt-3.5-turbo",
    });

    const suggestions = completion.choices[0].message.content
      ?.split('\n')
      .filter(Boolean)
      .map(suggestion => suggestion.slice(0, 100)) || [];

    const response = {
      sentiment: {
        positiveRatio: label === 'POSITIVE' ? score : 1 - score,
        sentimentScore: label === 'POSITIVE' ? score : -score,
        commentCount: 1
      },
      suggestions: suggestions.slice(0, 4)
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error generating suggestions or fetching sentiment:', error);
    res.status(500).json({ error: 'Failed to generate content suggestions or fetch sentiment data' });
  }
}
