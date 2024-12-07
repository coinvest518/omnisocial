import { NextApiRequest, NextApiResponse } from 'next';

export async function extractKeywordsFromUrl(url: string): Promise<string[]> {
  // Implementation for keyword extraction (if needed)
  return [];
}

export async function fetchTrendingTopicsFromUrl(searchTerm: string, apiKey: string): Promise<any[]> {
  if (!apiKey) {
    throw new Error("API key is not defined");
  }

  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const url = `https://serpapi.com/search.json?engine=google_trends&q=${encodedSearchTerm}&data_type=TIMESERIES&api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.search_metadata.status !== "Success") {
      console.error("API Error:", data.search_metadata.error);
      return [];
    }

    if (!data.trending_searches || !Array.isArray(data.trending_searches)) {
      console.warn("No valid trending searches found, returning an empty array.");
      return [];
    }

    return data.trending_searches.filter((trend: any) =>
      trend.query.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error("Error fetching data from SerpAPI:", error);
    throw error;
  }
}

// This function is not needed in the client-side component
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // ... (previous implementation)
// }

