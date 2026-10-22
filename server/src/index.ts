import { app } from './app.js';
import { ENV } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { setServers } from "node:dns";


async function bootstrap() {
  try {
    setServers(["8.8.8.8", "8.8.4.4"]);
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB successfully.');

    const server = app.listen(ENV.PORT, '0.0.0.0', () => {
      console.log(`Portfolio CMS API running on port ${ENV.PORT} (0.0.0.0) [${ENV.NODE_ENV}]`);
    });

    const shutdown = async (signal: string) => {
      console.log(`Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        console.log('HTTP server closed.');
        await disconnectDB();
        console.log('MongoDB disconnected.');
        process.exit(0);
      });

      // Force close if graceful shutdown hangs
      setTimeout(() => {
        console.error('Forcing shutdown after timeout.');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();
