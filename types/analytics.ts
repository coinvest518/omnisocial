import { ElementType } from 'react';


export interface Metric {
  label: string;
  value: string;
  trend: number;
}

export interface InsightSection {
  title: string;
  metrics: Metric[];
  recommendations: string[];
  icon: ElementType;
}

export interface SectionData {
  industryNews: InsightSection[];
  socialMediaTrends: InsightSection[];
  financialTrends: InsightSection[];
  youtubeMetrics: InsightSection[];
}

export interface TaskTypeSectionProps {
  data: SectionData; // Change this to SectionData
  loading: boolean;
  error: string | null;
}

