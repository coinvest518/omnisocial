import axios from 'axios';

interface YouTubeChannelData {
  channelName: string;
  subscriberCount: number;
  totalVideoCount: number;
  totalViews: number;
}

interface YouTubeVideoData {
  videoTitle: string;
  views: number;
  likes: number;
  comments: number;
  shares?: number;
  estimatedRevenue?: number;
}

export const fetchChannelData = async (accessToken: string): Promise<{
  channelInfo: YouTubeChannelData;
  videos: YouTubeVideoData[];
} | null> => {
  try {
    // Fetch channel statistics
    const channelResponse = await axios.get(
      'https://www.googleapis.com/youtube/v3/channels',
      {
        params: {
          part: 'snippet,statistics',
          mine: true,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const channelData = channelResponse.data.items[0];
    const channelInfo: YouTubeChannelData = {
      channelName: channelData.snippet.title,
      subscriberCount: parseInt(channelData.statistics.subscriberCount),
      totalVideoCount: parseInt(channelData.statistics.videoCount),
      totalViews: parseInt(channelData.statistics.viewCount),
    };

    // Fetch recent videos
    const videosResponse = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          part: 'snippet',
          channelId: channelData.id,
          type: 'video',
          order: 'date',
          maxResults: 10,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const videoIds = videosResponse.data.items.map((item: any) => item.id.videoId);

    // Fetch video statistics
    const videoStatsResponse = await axios.get(
      'https://www.googleapis.com/youtube/v3/videos',
      {
        params: {
          part: 'statistics',
          id: videoIds.join(','),
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const videos: YouTubeVideoData[] = videoStatsResponse.data.items.map((item: any) => ({
      videoTitle: videosResponse.data.items.find((video: any) => video.id.videoId === item.id).snippet.title,
      views: parseInt(item.statistics.viewCount),
      likes: parseInt(item.statistics.likeCount),
      comments: parseInt(item.statistics.commentCount),
      // Note: shares and estimatedRevenue are not available through the YouTube API
      // You might need to use YouTube Analytics API for more detailed metrics
    }));

    return { channelInfo, videos };
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return null;
  }
};