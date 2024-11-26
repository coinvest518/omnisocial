import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function dbConnect() {
  // Check if already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.getClient(); // Return the existing MongoClient
  }

  try {
    // Attempt to connect to the database
    await mongoose.connect(MONGODB_URI as string);
    console.log('MongoDB connected successfully');
    return mongoose.connection.getClient(); // Return the MongoClient instance
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

export default dbConnect;