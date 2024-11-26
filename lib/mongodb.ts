// lib/mongodb.ts
import mongoose from 'mongoose';

// Ensure that the MongoDB URI is defined in the environment variables
const uri = process.env.MONGODB_URI;

// Ensure that the URI is defined
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

// Declare a global variable for the connection
declare global {
  var _mongoosePromise: Promise<typeof mongoose> | undefined;
}

let mongoosePromise: Promise<typeof mongoose> | undefined;

// Check if we are in development mode
if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable to preserve the Mongoose connection
  if (!global._mongoosePromise) {
    mongoosePromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no server is selected
    }).catch((error) => {
      console.error('Mongoose connection error in development:', error);
      throw new Error('Failed to connect to MongoDB');
    });
    global._mongoosePromise = mongoosePromise;
  }
  mongoosePromise = global._mongoosePromise; // Assign the global promise to mongoosePromise
} else {
  // In production mode, create a new connection for each request
  mongoosePromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if no server is selected
  }).catch((error) => {
    console.error('Mongoose connection error in production:', error);
    throw new Error('Failed to connect to MongoDB');
  });
}

// Export the Mongoose promise for use in other parts of the application
export default mongoosePromise;