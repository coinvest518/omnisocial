import axios from 'axios';

// Define interfaces for type safety
interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
  description: string;
}

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  public_metrics: {
    retweet_count: number;
    reply_count: number;
    like_count: number;
    quote_count: number;
    impression_count?: number;
  };
  attachments?: {
    media_keys?: string[];
  };
  entities?: {
    hashtags?: Array<{ tag: string }>;
    mentions?: Array<{ username: string }>;
  };
}

interface MediaEntity {
  media_key: string;
  type: 'photo' | 'video' | 'animated_gif';
  url?: string;
  preview_image_url?: string;
}

interface TwitterMetricsResponse {
  data: Tweet[];
  includes?: {
    users?: TwitterUser[];
    media?: MediaEntity[];
  };
  meta?: {
    result_count: number;
    next_token?: string;
  };
}

class TwitterMetricsFetcher {
  private baseUrl = 'https://api.twitter.com/2';
  private bearerToken: string;

  constructor(bearerToken: string) {
    this.bearerToken = bearerToken;
  }

  private getHeaders() {
    return {
      'Authorization': `Bearer ${this.bearerToken}`,
      'Content-Type': 'application/json'
    };
  }

  /**
   * Fetch top-performing tweets for a specific user
   * @param username Twitter username to fetch tweets from
   * @param options Optional parameters to customize the search
   */
  async fetchTopPerformingTweets(username: string, options: {
    maxTweets?: number;
    minLikes?: number;
    minRetweets?: number;
    timeframe?: 'day' | 'week' | 'month';
  } = {}): Promise<Tweet[]> {
    const {
      maxTweets = 10,
      minLikes = 0,
      minRetweets = 0,
      timeframe = 'week'
    } = options;

    // Calculate the start time based on timeframe
    const startTime = new Date();
    switch (timeframe) {
      case 'day':
        startTime.setDate(startTime.getDate() - 1);
        break;
      case 'week':
        startTime.setDate(startTime.getDate() - 7);
        break;
      case 'month':
        startTime.setMonth(startTime.getMonth() - 1);
        break;
    }

    try {
      const response = await axios.get<TwitterMetricsResponse>(`${this.baseUrl}/tweets/search/recent`, {
        headers: this.getHeaders(),
        params: {
          query: `from:${username}`,
          'tweet.fields': 'public_metrics,created_at,entities,attachments',
          'user.fields': 'public_metrics,profile_image_url',
          'expansions': 'author_id,attachments.media_keys',
          'max_results': maxTweets,
          'start_time': startTime.toISOString()
        }
      });

      // Filter tweets based on performance metrics
      return (response.data.data || []).filter(tweet => 
        tweet.public_metrics.like_count >= minLikes && 
        tweet.public_metrics.retweet_count >= minRetweets
      );
    } catch (error) {
      console.error('Error fetching top performing tweets:', error);
      throw error;
    }
  }

  /**
   * Fetch user insights for content strategy
   * @param username Twitter username to analyze
   */
  async fetchUserInsights(username: string): Promise<{
    userProfile: TwitterUser;
    contentInsights: {
      avgLikesPerTweet: number;
      avgRetweetsPerTweet: number;
      topHashtags: string[];
      engagementRate: number;
    }
  }> {
    try {
      const response = await axios.get<TwitterMetricsResponse>(`${this.baseUrl}/tweets/search/recent`, {
        headers: this.getHeaders(),
        params: {
          query: `from:${username}`,
          'tweet.fields': 'public_metrics,entities',
          'user.fields': 'public_metrics,profile_image_url,description',
          'max_results': 100
        }
      });

      const userData = response.data.includes?.users?.[0];
      const userTweets = response.data.data || [];

      if (!userData) {
        throw new Error('User not found');
      }

      // Calculate engagement metrics
      const totalLikes = userTweets.reduce((sum, tweet) => sum + tweet.public_metrics.like_count, 0);
      const totalRetweets = userTweets.reduce((sum, tweet) => sum + tweet.public_metrics.retweet_count, 0);
      
      // Extract top hashtags
      const hashtagCounts: Record<string, number> = {};
      userTweets.forEach(tweet => {
        tweet.entities?.hashtags?.forEach(hashtag => {
          hashtagCounts[hashtag.tag] = (hashtagCounts[hashtag.tag] || 0) + 1;
        });
      });

      const topHashtags = Object.entries(hashtagCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag]) => tag);

      return {
        userProfile: userData,
        contentInsights: {
          avgLikesPerTweet: totalLikes / userTweets.length,
          avgRetweetsPerTweet: totalRetweets / userTweets.length,
          topHashtags,
          engagementRate: (totalLikes + totalRetweets) / (userTweets.length * userData.public_metrics.followers_count)
        }
      };
    } catch (error) {
      console.error('Error fetching user insights:', error);
      throw error;
    }
  }

  /**
   * Generate content ideas based on trending topics
   * @param options Options to customize trending topic search
   */
  async fetchTrendingTopics(options: {
    location?: string;
    maxTopics?: number;
  } = {}): Promise<string[]> {
    const { location = 'global', maxTopics = 10 } = options;

    try {
      const response = await axios.get<{hashtags: string[]}>(`${this.baseUrl}/trends`, {
        headers: this.getHeaders(),
        params: {
          location,
          max_results: maxTopics
        }
      });

      return response.data.hashtags;
    } catch (error) {
      console.error('Error fetching trending topics:', error);
      throw error;
    }
  }
}

// Export for use in other parts of the application
export {
    TwitterMetricsFetcher
};
    export type {
        Tweet,
        TwitterUser
    };

// Example usage in a Next.js API route or server-side function
export async function getTwitterContentInsights(username: string) {
  const fetcher = new TwitterMetricsFetcher(process.env.TWITTER_BEARER_TOKEN!);
  
  try {
    // Fetch top performing tweets
    const topTweets = await fetcher.fetchTopPerformingTweets(username, {
      maxTweets: 20,
      minLikes: 10,
      timeframe: 'week'
    });

    // Fetch user insights
    const userInsights = await fetcher.fetchUserInsights(username);

    // Fetch trending topics
    const trendingTopics = await fetcher.fetchTrendingTopics();

    return {
      topTweets,
      userInsights,
      trendingTopics
    };
  } catch (error) {
    console.error('Error fetching Twitter content insights:', error);
    throw error;
  }
}