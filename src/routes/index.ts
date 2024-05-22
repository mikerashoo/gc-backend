import { Router } from 'express';   
import db from '../lib/db';

const router = Router();

router.get('/users', async (req, res) => {
  const users = await db.user.findMany();
  res.json(users);
});
 

export default router;
