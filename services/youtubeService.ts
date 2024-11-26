// services/youtubeService.ts
import { google } from 'googleapis';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

export async function getYouTubeStats(channelId: string) {
  try {
    const response = await youtube.channels.list({
      part: ['statistics'],
      id: [channelId],
    });

    return response.data.items?.[0]?.statistics;
  } catch (error) {
    console.error('Error fetching YouTube stats:', error);
    throw error;
  }
}