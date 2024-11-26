import mongoose, { Document, Schema } from 'mongoose';

// Interface for TypeScript
interface ITrainingData extends Document {
  source: string; // E.g., 'serpapi', 'brightdata', 'user-generated'
  url?: string; // Optional URL of the content source
  textContent: string; // Text of the content
  mediaUrl?: string; // Optional URL of media (image/video)
  hashtags: string[]; // Array of hashtags
  hooks: string[]; // Hooks or attention-grabbing phrases
  engagementMetrics: { // Engagement details
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
  createdAt: Date; // Creation date of the content
  category: string; // Content category: tech, health, etc.
  aiLabels: string[]; // AI-generated labels
  userGenerated: boolean; // If true, this content was created by app users
}

// Define the schema
const trainingDataSchema = new Schema<ITrainingData>(
  {
    source: {
      type: String,
      required: true,
      enum: ['serpapi', 'brightdata', 'user-generated'], // Example sources
    },
    url: {
      type: String,
      required: false, // Optional for user-generated content
    },
   
    textContent: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String,
      required: false,
    },
    hashtags: {
      type: [String],
      default: [], // Initialize as an empty array
    },
    hooks: {
      type: [String],
      default: [],
    },
    engagementMetrics: {
      likes: { type: Number, default: 0 },
      shares: { type: Number, default: 0 },
      comments: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      default: 'general', // Default category
    },
    aiLabels: {
      type: [String],
      default: [],
    },
    userGenerated: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Create the TrainingData model
const TrainingData =
  mongoose.models.TrainingData ||
  mongoose.model<ITrainingData>('TrainingData', trainingDataSchema);

export default TrainingData;
