import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const sessionId = req.query.session_id as string;

  if (!sessionId) {
    console.error('Missing session ID');
    return res.status(400).json({ error: 'Missing session ID' });
  }

  try {
    await dbConnect(); // Connect to MongoDB

    // Retrieve the Stripe session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if metadata exists
    if (!session.metadata) {
      console.error('Metadata missing from the session:', session);
      return res.status(400).json({ error: 'Metadata missing from session' });
    }

    const userId = session.metadata.userId;
    const planName = session.metadata.planName;

    if (!userId || !planName) {
      console.error(`Invalid metadata: userId=${userId}, planName=${planName}`);
      return res.status(400).json({ error: 'Invalid session metadata' });
    }

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      console.error(`User not found with ID: ${userId}`);
      return res.status(404).json({ error: 'User not found' });
    }

    // Determine credits based on the plan
    const creditsMap: Record<string, number> = {
      'Basic': 10,
      'Standard': 25,
      'Pro': 55,
      'Enterprise': 150,
    };

    const creditsToAdd = creditsMap[planName] || 0;
    if (creditsToAdd === 0) {
      console.error(`Unknown plan: ${planName}`);
      return res.status(400).json({ error: 'Invalid plan name' });
    }

    // Update user credits
    await User.findByIdAndUpdate(
        userId,
        { $inc: { credits: creditsToAdd } },
        { new: true }
      );
    console.log(`User ${userId} credits updated. New credits: ${user.credits}`);

    // Redirect to the dashboard
    return res.redirect(302, '/dashboard');

  } catch (error) {
    console.error('Error in checkout success handler:', error);
    return res.status(500).json({ error: 'Failed to process checkout' });
  }
}
