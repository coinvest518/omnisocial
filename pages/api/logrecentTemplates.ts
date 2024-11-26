// pages/api/logrecentTemplates.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]"; // Adjust this import path as necessary

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await dbConnect();

    const session = await getServerSession(req, res, authOptions);
    console.log('Session in API route:', session); // Debugging log

    if (!session || !session.user?.id) {
      console.log('Unauthorized access attempt'); // Debugging log
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { templateId, content } = req.body;

    if (!templateId || !content) {
      return res.status(400).json({ message: 'Template ID and content are required' });
    }

    const user = await User.findById(session.user.id);
    if (!user) {
      console.log('User not found:', session.user.id); // Debugging log
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.credits < 1) {
      return res.status(403).json({ message: 'Insufficient credits' });
    }

    await User.findByIdAndUpdate(session.user.id, {
      $push: {
        templateUsage: {
          templateId,
          content,
          createdAt: new Date(),
        },
      },
    }, { new: true });

    console.log('Template usage logged for user:', session.user.id); // Debugging log
    res.status(200).json({ message: 'Template usage logged successfully' });
  } catch (error) {
    console.error('Error in logrecentTemplates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}