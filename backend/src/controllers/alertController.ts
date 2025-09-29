import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  res.json({ message: 'Create alert endpoint' });
});

export default router;