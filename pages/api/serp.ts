import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const SERP_API_KEY = process.env.SERPAPI_API_KEY;
const SERP_API_URL = 'https://serpapi.com/search.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Query parameter is required' });
  }

  try {
    const response = await axios.get(SERP_API_URL, {
      params: {
        q: query,
        api_key: SERP_API_KEY,
        engine: 'google',
      },
    });

    const serpResults = response.data.organic_results.map((result: any) => ({
      title: result.title,
      link: result.link,
      snippet: result.snippet,
    }));

    res.status(200).json(serpResults);
  } catch (error) {
    console.error('Error fetching SERP results:', error);
    res.status(500).json({ message: 'Error fetching SERP results' });
  }
}

