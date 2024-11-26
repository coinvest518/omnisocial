import mongoose, { Document, Schema } from 'mongoose';

// Interface for TypeScript
interface ITrainedData extends Document {
  userId: string; // Reference to the user who generated this data
  taskType: string; // Type of task performed (e.g., Blog Post, Article)
  content: string; // The content generated
  createdAt: Date; // Creation date of the content
}

// Define the schema
const trainedDataSchema = new Schema<ITrainedData>(
  {
    userId: {
      type: String,
      required: true,
    },
    taskType: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Create the TrainedData model
const TrainedData =
  mongoose.models.TrainedData ||
  mongoose.model<ITrainedData>('TrainedData', trainedDataSchema);

export default TrainedData; 