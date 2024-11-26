import { useState } from 'react';
import { fetchSERPContent } from '../lib/serpapi';

export function useAIContent() {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async (taskType: string) => {
    setLoading(true);
    setError(null);
    try {
      const serpContent = await fetchSERPContent(taskType);
      setContent(serpContent);
    } catch (err) {
      setError('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  return { content, loading, error, fetchContent };
}

