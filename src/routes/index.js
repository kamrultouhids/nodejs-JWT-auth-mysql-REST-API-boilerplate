import { Router } from 'express';
import routes from './api';

const router = Router();

router.use('/api', routes);

export default router;
