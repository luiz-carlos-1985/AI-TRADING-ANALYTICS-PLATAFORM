import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

router.get('/prices', async (req: Request, res: Response) => {
  res.json({ message: 'Crypto prices endpoint' });
});

export default router;