// routes/api.ts
import { Router, Request, Response } from 'express';
import { combinedModels } from '../models/combinedModels'; // Update import to combined models

const router = Router();

router.post('/track-interaction', async (req: Request, res: Response) => {
  try {
    const { actionType, details, timestamp } = req.body;
    
    const interaction = new combinedModels.UserInteraction({
      userId: req.user ? req.user.id : 'anonymous',
      actionType,
      details,
      timestamp: new Date(timestamp)
    });

    await interaction.save();
    res.status(200).json({ message: 'Interaction tracked' });
  } catch (error) {
    res.status(500).json({ error: 'Tracking failed' });
  }
});

export default router;