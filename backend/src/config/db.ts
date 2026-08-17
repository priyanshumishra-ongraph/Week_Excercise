import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected! Reconnecting...');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
