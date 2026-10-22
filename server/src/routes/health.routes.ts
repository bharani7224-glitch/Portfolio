import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/live', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

router.get('/ready', (_req: Request, res: Response) => {
  const isDbReady = mongoose.connection.readyState === 1;

  if (isDbReady) {
    res.status(200).json({
      status: 'ready',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } else {
    res.status(503).json({
      status: 'unavailable',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
    });
  }
});

export default router;
