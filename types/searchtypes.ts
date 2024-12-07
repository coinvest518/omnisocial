export interface SearchResult {

    _id: string;
    title: string;
    link: string;
    snippet: string;
    thumbnail?: string; // Add this property
    duration?: string; // Add this property
    views?: number;
    likes?: number;
    shares?: number;
    socialMediaMentions?: number;
    topTrends?: string[];
    postCount?: number;
    comments?: number;
    engagement?: number;
    conversions?: number;
    publicationDate?: string;
    newsOutlet?: string;
    section?: string;
    keywords?: string[];
    videoLength?: number;
    videoThumbnail?: string;
    type: 'web' | 'video' | 'image' | 'news' | 'youtube' | 'shopping' | 'books'; // Add this property
    price?: number; // Add this property
    author?: string; // Add this property
    channel?: string; // Add this property
  }
  