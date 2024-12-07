import mongoose, { Document, Schema } from 'mongoose';

// Interface for User Interaction
interface IUserInteraction extends Document {
  userId: string;
  actionType: 'search' | 'api_call' | 'page_view' | 'click' | 'form_interaction' | 'purchase' | 'contentsuggestion' | 'template_usage';
  details: Record<string, any>;
  query?: string;
  timestamp: Date;
  metadata: {
    ipAddress: string;
    userAgent: string;
    location: {
      country: string;
      city: string;
    };
    deviceType: string;
  };
  context: Record<string, any>;
}

// User Interaction Schema
const UserInteractionSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  actionType: {
    type: String,
    enum: [
      'search', 
      'api_call', 
      'page_view', 
      'click', 
      'form_interaction', 
      'purchase',
      'template_usage',
      'contentsuggestion'
    ],
    required: true
  },
  details: {
    type: Schema.Types.Mixed,
    default: {}
  },
  query: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    location: {
      country: String,
      city: String
    },
    deviceType: String
  },
  context: {
    type: Schema.Types.Mixed,
    default: {}
  }
});

// Interface for Training Data
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

// Training Data Schema
const TrainingDataSchema = new Schema<ITrainingData>(
  {
    source: {
      type: String,
      required: true,
      enum: ['serpapi', 'brightdata', 'user-generated', 'contentsuggestion'], // Added 'content_suggestion'
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

// Create the models
const UserInteraction = mongoose.models.UserInteraction || mongoose.model<IUserInteraction>('UserInteraction', UserInteractionSchema);
const TrainingData = mongoose.models.TrainingData || mongoose.model<ITrainingData>('TrainingData', TrainingDataSchema);

// Export the models as a combined object
export const combinedModels = { UserInteraction, TrainingData };

export { UserInteraction, TrainingData };