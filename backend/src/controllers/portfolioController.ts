import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  res.json({ message: 'Portfolio endpoint' });
});

export default router;