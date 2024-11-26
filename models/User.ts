import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';



interface WebhookData {
  tuneId: string;
  status: string;
  images: string[];
}

interface IThumbnail {
  url: string;
  createdAt: Date;
}

interface IHashtag {
  tag: string;
  createdAt: Date;
}

// Interface for TypeScript
interface IUser extends Document {
  email: string;
  password: string;
  credits: number;
  thumbnails: IThumbnail[]; // Use the IThumbnail interface
  hashtags: IHashtag[]; 
  subscription: string;  // Track the user's subscription plan
  subscriptionStartDate: Date;  // Date when the subscription started
  subscriptionEndDate: Date;  // Date when the subscription ends
  webhookData: WebhookData[];  // Array to store webhook data

  templateUsage: Array<{
    templateId: string;
    content: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
  totalScrapes: number; // Total number of scrapes performed
  scrapeHistory: IScrapeData[]; // History of scraping activities
}

// Interface for Scrape Data
interface IScrapeData {
  taskType: string; // Type of task performed
  createdAt: Date; // Date when the scrape was performed
  content: string; // Content generated from the scrape
}

// Define the user schema
const userSchema = new Schema<IUser>(
  {

    
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // Normalize email to lowercase
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    credits: {
      type: Number,
      default: 10, // Default credits value when a user is created, but can be updated based on subscription
    },
    thumbnails: [
      {
        url: {
          type: String,
          required: true, // Ensure URL is required
        },
        createdAt: {
          type: Date,
          default: Date.now, // Default to the current date
        },
      },
    ],

    
    hashtags: [
      {
        tag: {
          type: String,
          required: true, // Ensure tag is required
        },
        createdAt: {
          type: Date,
          default: Date.now, // Default to the current date
        },
      },
    ],
    subscription: {
      type: String,
      enum: ['Basic', 'Standard', 'Pro', 'Enterprise'],
      default: 'Basic', // Default plan when the user is created
    },
    subscriptionStartDate: {
      type: Date,
      default: Date.now, // Default to the current date
    },
    subscriptionEndDate: {
      type: Date,
      required: false, // You can set this when the subscription is renewed or ends
    },
    webhookData: {
      type: [{ // Changed to an object with a type array
        tuneId: { type: String, required: true },
        status: String,
        images: [String],
      }],
      default: [], //  This is the key change: Initialize as empty array
    },
    

    
    templateUsage: [
      {
        templateId: {
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
    ],
    totalScrapes: {
      type: Number,
      default: 0, // Initialize to 0
    },
    scrapeHistory: [
      {
        taskType: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now, // Default to the current date
        },
        content: {
          type: String,
          required: true, // Store the content generated from the scrape
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Pre-save hook to hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Create the User model if it does not already exist (for hot reloading support in development)
const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
