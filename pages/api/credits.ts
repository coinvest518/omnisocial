// pages/api/credits.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    const session = await getSession({ req });

    if (!session || !session.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const user = await User.findById(session.user.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return updated credits
      res.status(200).json({ credits: user.credits });
    } catch (error) {
      console.error('Error fetching user credits:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
