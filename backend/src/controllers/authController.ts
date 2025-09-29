import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  res.json({ message: 'Login endpoint' });
});

router.post('/register', async (req: Request, res: Response) => {
  res.json({ message: 'Register endpoint' });
});

export default router;