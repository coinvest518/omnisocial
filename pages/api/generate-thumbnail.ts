// pages/api/generate-thumbnail.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import dbConnect from '../../lib/dbConnect'; // Adjust the path as necessary
import User from '../../models/User';



// You can choose different models. Here are some options:
// - "stabilityai/stable-diffusion-xl-base-1.0"
// - "runwayml/stable-diffusion-v1-5"
// - "CompVis/stable-diffusion-v1-4"
const MODELS = {
  "stable-diffusion-xl": "stabilityai/stable-diffusion-xl-base-1.0",
  "stable-diffusion-v1-5": "runwayml/stable-diffusion-v1-5",
  "stable-diffusion-v1-4": "CompVis/stable-diffusion-v1-4",
}; 

type ModelId = keyof typeof MODELS;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user?.id) {
    return res.status(401).json({ error: 'You must be logged in to generate thumbnails.' });
  }


  try {
    await dbConnect(); 
    const user = await User.findById(session.user.id);

    const { prompt, modelId }: { prompt: string; modelId: ModelId } = req.body; // Specify the types here
    const huggingfaceApiKey = process.env.HUGGINGFACE_API_KEY;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
  }

    if (user.credits < 1) {
      return res.status(403).json({ error: 'Insufficient credits' });
  }

    if (!huggingfaceApiKey) {
      throw new Error('HUGGINGFACE_API_KEY is not configured');
    }

      // Validate the model ID
      const selectedModel = MODELS[modelId];
      if (!selectedModel) {
        throw new Error('Invalid model ID provided');
      }

    // Call Hugging Face API
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${selectedModel}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${huggingfaceApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            width: 1280,
            height: 720,
            num_inference_steps: 30,
            guidance_scale: 7.5,
          }
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate image');
    }

    // Hugging Face returns the image directly as a blob
    const imageBlob = await response.blob();
    
    // Convert blob to base64
    const imageBuffer = await imageBlob.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

   
    // Store the generated thumbnail and hashtags in the database
    await User.findByIdAndUpdate(session.user.id, {
       $inc: { credits: -1 },
      $push: {
        thumbnails: { url: imageUrl, createdAt: new Date() }, // Assuming you have a thumbnails array in your User model
        hashtags: { tag: prompt.replace(/\s+/g, ''), createdAt: new Date() } // Store hashtags based on the prompt
      }
    });

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    return res.status(500).json({ 
      error: 'Failed to generate thumbnail', 
      details: error instanceof Error ? error.message : String(error) // Safely access the error message
    });
  }
}