import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

router.get('/analysis', async (req: Request, res: Response) => {
  res.json({ message: 'News analysis endpoint' });
});

export default router;