import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function fetchSERPContent(taskType: string): Promise<string> {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/serp`, {
      params: {
        query: `${taskType} content creation guide`,
      },
    });

    // Extract the most relevant snippet from the SERP results
    const snippet = response.data[0]?.snippet || 'No content found.';
    return snippet;
  } catch (error) {
    console.error('Error fetching SERP content:', error);
    throw error;
  }
}

