import mongoose from 'mongoose';
import { ENV } from './env.js';

let isConnected = false;

export async function connectDB(uri: string = ENV.MONGODB_URI): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    isConnected = true;
    return mongoose;
  }

  try {
    mongoose.set('strictQuery', true);

    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });

    isConnected = true;

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      isConnected = false;
      console.warn('MongoDB disconnected. Retrying...');
    });

    return connection;
  } catch (error) {
    isConnected = false;
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isConnected = false;
  }
}
