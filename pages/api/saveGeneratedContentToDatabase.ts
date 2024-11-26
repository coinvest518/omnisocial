// /pages/api/saveGeneratedContent.ts
import { NextApiRequest, NextApiResponse } from 'next';
import TrainingData from '@/models/trainingData'; // MongoDB Schema

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { contentData } = req.body; // Expecting contentData in the request body

      const newTrainingData = new TrainingData(contentData); // Create a new entry
      await newTrainingData.save(); // Save to MongoDB

      res.status(200).json({ success: true, message: 'Content saved successfully' });
    } catch (error) {
      console.error('Error saving generated content:', error);
      res.status(500).json({ success: false, message: 'Failed to save content' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
