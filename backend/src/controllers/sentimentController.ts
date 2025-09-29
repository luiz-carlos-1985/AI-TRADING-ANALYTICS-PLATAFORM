import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

router.get('/:symbol', async (req: Request, res: Response) => {
  res.json({ message: 'Sentiment analysis endpoint' });
});

export default router;