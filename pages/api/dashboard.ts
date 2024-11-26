import { NextApiRequest, NextApiResponse } from 'next';
import { TEMPLATES, } from '../../constants/templates'; // Import your TMP array

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simulate fetching dashboard data based on the TMP array
  const dashboardData = {
    totalTemplates: TEMPLATES.length,
    categoryCounts: getCategoryCounts(),
    recentTemplates: getRecentTemplates(),
    popularCategories: getPopularCategories(),
  };

  res.status(200).json(dashboardData);
}

function getCategoryCounts() {
  const counts: { [key: string]: number } = {};
  TEMPLATES.forEach(template => {
    template.categories.forEach(category => {
      counts[category] = (counts[category] || 0) + 1;
    });
  });
  return counts;
}

function getRecentTemplates(limit = 5) {
  return TEMPLATES.slice(0, limit).map(template => ({
    id: template.id,
    title: template.title,
    description: template.description,
  }));
}

function getPopularCategories(limit = 3) {
  const counts = getCategoryCounts();
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([category, count]) => ({ category, count }));
}