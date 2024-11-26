import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import dbConnect from '../../lib/dbConnect'; // Adjust the path as necessary
import User from '../../models/User';
import TrainedData from '../../models/trainedData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
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

    // Extract taskType and content from the request body
    const { taskType, content } = req.body;

    // Deduct credits and update user data
    await User.findByIdAndUpdate(session.user.id, { 
      $inc: { credits: -1, totalScrapes: 1 }, // Increment total scrapes
      $push: {
        scrapeHistory: {
          taskType,
          content, // Store the generated content
          createdAt: new Date(),
        },
      },
    });

    // Store the trained data
    await TrainedData.create({
      userId: session.user.id,
      taskType,
      content,
    });

    return res.status(200).json({ message: 'Credits deducted and content stored successfully.' });
  } catch (error) {
    console.error('Error deducting credits or storing content:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}