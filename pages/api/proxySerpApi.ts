import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { topic } = req.query; // Get the topic from the query parameters
  console.log("Topic from query:", topic); // Log the topic

  const apiKey = process.env.NEXT_PUBLIC_SERPAPI_API_KEY; // Ensure this is the correct key
  if (!apiKey) {
    return res.status(500).json({ error: "API key is not defined" });
  }

  const topicString = Array.isArray(topic) ? topic[0] : topic; // Ensure topic is a string
  if (!topicString) {
    return res.status(400).json({ error: "Topic is required" }); // Handle missing topic
  }

  const url = `https://serpapi.com/search.json?engine=google_trends&q=${encodeURIComponent(topicString)}&data_type=TIMESERIES&api_key=${apiKey}`; // Adjusted URL

  try {
    console.log("Fetching URL:", url); // Log the URL being fetched
    const response = await fetch(url);
    const data = await response.json();
    console.log("API Response Data:", data); // Log the entire response data

    // Check if the response indicates success
    if (data.search_metadata.status !== "Success") {
      console.error("API Error:", data.search_metadata.error);
      return res.status(500).json({ error: data.search_metadata.error });
    }

    // Ensure trending_searches is defined and is an array
    if (!data.trending_searches || !Array.isArray(data.trending_searches)) {
      console.warn("No valid trending searches found, returning an empty array."); // Log a warning
      return res.status(200).json([]); // Return an empty array instead of throwing an error
    }

    // Filter the trending searches based on the user's topic query
    const filteredTrends = data.trending_searches.filter((trend: any) =>
      trend.query.toLowerCase().includes((topic as string).toLowerCase())
    );

    // Return the filtered trends
    res.status(200).json(filteredTrends);
  } catch (error) {
    console.error("Error fetching data from SerpAPI:", error);
    res.status(500).json({ error: "Failed to fetch data from SerpAPI" });
  }
}