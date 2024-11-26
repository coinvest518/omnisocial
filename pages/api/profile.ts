// pages/api/profile.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect'; // Ensure this path is correct
import User from '../../models/User'; // Adjust the path as necessary
import { getSession } from 'next-auth/react'; // Import getSession from next-auth
import { Session } from 'next-auth'; // Import Session type

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect(); // Connect to the database

  if (req.method === 'GET') {
    // Get the session from the request
    const session: Session | null = await getSession({ req });

    if (!session || !session.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // Use the user ID from the session
      const user = await User.findById(session.user.id); // Access user ID from session

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return user data (excluding password)
      res.status(200).json({
        email: user.email,
        credits: user.credits,
        thumbnails: user.thumbnails, // Include thumbnails
        hashtags: user.hashtags,     // Include hashtags      
        subscription: user.subscription, // Include subscription
        });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
