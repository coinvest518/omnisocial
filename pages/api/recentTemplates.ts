// pages/api/recent-templates.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import { getSession } from 'next-auth/react';
import { TEMPLATES } from '../../constants/templates'; // Import your TEMPLATES array

interface TemplateUsage {
  _id: string;
  templateId: string;
  content: string;
  createdAt: Date;
  // ... other properties of templateUsage
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  if (req.method === 'GET') {
    const session = await getSession({ req });

    if (!session || !session.user.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const user = await User.findById(session.user.id).select('templateUsage');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const recentTemplateUsage = user.templateUsage
      .sort(
        (a: { createdAt: Date }, b: { createdAt: Date }) =>
          b.createdAt.getTime() - a.createdAt.getTime()
      )
      .slice(0, 20);

      // Map over recentTemplateUsage to get full template details
      const recentTemplates = recentTemplateUsage.map((usage: TemplateUsage) => {
        const template = TEMPLATES.find(t => t.id === usage.templateId);
        if (!template) console.warn(`Template not found for ID: ${usage.templateId}`);

        return {
          ...template,
          id: usage._id.toString(), // Include MongoDB ObjectId as id
          content: usage.content,   // Ensure content is passed
          templateId: usage.templateId,
          createdAt: usage.createdAt,
          title: template?.title || 'Unknown Title',
          description: template?.description || 'No description available',
        };
      });

      res.status(200).json(recentTemplates);
    } catch (error) {
      console.error('Error fetching recent templates:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // ...
  }
}
