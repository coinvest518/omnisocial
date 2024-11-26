// pages/api/deleteTemplateUsage.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/dbConnect';
import User from '../../models/User';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const usageId = req.query.usageId as string;
    if (!usageId) {
      return res.status(400).json({ message: 'usageId is required' });
    }


    const user = await User.findByIdAndUpdate(session.user.id, {
      $pull: { templateUsage: { _id: usageId } } // Remove the matching usage entry
    }, {new: true});

    if(!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (!user.templateUsage.find((usage: { _id: { toString: () => string; }; })=> usage._id.toString() === usageId.toString())) {
        return res.status(404).json({message: 'Template usage record not found or user does not have permission to delete this record.'});
    }

    return res.status(200).json({ message: 'Template usage deleted successfully' });
  } catch (error) {
    console.error('Error deleting template usage:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

