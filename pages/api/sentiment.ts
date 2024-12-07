// pages/api/sentiment.js
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY);

export default async function handler(req: { method: string; body: { text: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { error?: string; positiveRatio?: number; sentimentScore?: number; commentCount?: number; }): void; new(): any; }; }; }) {
    // Check if the request method is POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { text } = req.body;

    // Validate input
    if (!text || typeof text !== 'string' || text.length === 0) {
        return res.status(400).json({ error: 'Text is required and must be a non-empty string' });
    }

    try {
        // Call Hugging Face API for sentiment analysis
        const sentiment = await hf.textClassification({
            model: 'distilbert-base-uncased-finetuned-sst-2-english', // Specify the model
            inputs: text
        });

        const firstResult = sentiment[0];

        // Handle potential undefined values from the Hugging Face API response
        const score = firstResult?.score ?? 0;
        const label = firstResult?.label ?? 'NEGATIVE';

        // Construct the response object
        const response = {
            positiveRatio: label === 'POSITIVE' ? score : 1 - score,
            sentimentScore: label === 'POSITIVE' ? score : -score,
            commentCount: 1 // Assuming one comment for the analysis
        };

        // Send the response back to the client
        res.status(200).json(response);
    } catch (error) {
        console.error('Error with Hugging Face API:', (error as Error).message);
        res.status(500).json({ error: 'Error fetching sentiment data' });
    }
}
