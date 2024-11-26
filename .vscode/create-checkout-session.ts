import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import Stripe from 'stripe';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Validate HTTP Method
    if (req.method !== 'POST') {
      return res.status(405).end('Method Not Allowed');
    }

    // Get User Session
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user?.id) {
      return res.status(401).json({ error: 'You must be logged in to buy credits.' });
    }

    // Validate Request Body
    const { priceId, planName } = req.body;
    if (!priceId || !planName) {
      return res.status(400).json({ error: 'Missing required parameters: priceId and planName' });
    }

    // Connect to MongoDB
    await dbConnect();

    // Retrieve User from Database
    const user = await User.findById(session.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      metadata: {
        userId: session.user.id,
        planName: planName,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL}/api/stripe/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL}/dashboard`,
      client_reference_id: session.user.id,
    });

    // Check if Checkout Session URL was created
    if (!checkoutSession.id) {
      return res.status(500).json({ error: 'Failed to create checkout session URL' });
    }

    // Return Checkout Session URL to Client
    return res.status(200).json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
