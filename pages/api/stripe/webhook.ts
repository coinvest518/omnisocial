import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import User from '../../../models/User';
import dbConnect from '../../../lib/dbConnect';
import { IncomingMessage } from 'http';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!; // Use the correct webhook secret

// Function to read the raw body
const buffer = (req: IncomingMessage) => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', (err) => reject(err));
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const buf = await buffer(req); // Use the defined buffer function
  const sig = req.headers['stripe-signature']!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (error: unknown) {
    console.log('Error in webhook verification:', error);
    return res.status(400).send(`Webhook Error: ${error}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const planName = session.metadata?.planName;

      // Connect to the database
      await dbConnect();

      const user = await User.findById(userId);
      if (!user) {
        console.log('User not found:', userId);
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user with the new subscription and credits
      let creditsToAdd = 0;
      switch (planName) {
        case 'Basic':
          creditsToAdd = 10;
          break;
        case 'Standard':
          creditsToAdd = 25;
          break;
        case 'Pro':
          creditsToAdd = 55;
          break;
        case 'Enterprise':
          creditsToAdd = 150;
          break;
      }

      const subscriptionEndDate = new Date();
      subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + 1); // Example for 1-month duration

      await User.findByIdAndUpdate(userId, {
        $set: {
          subscription: planName,
          credits: creditsToAdd,
          subscriptionStartDate: new Date(),
          subscriptionEndDate: subscriptionEndDate,
        },
      }, { new: true });

      console.log(`Subscription updated for user: ${userId}, Plan: ${planName}, Credits: ${creditsToAdd}`);
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}
