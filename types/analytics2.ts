import { type LucideIcon } from 'lucide-react';

export interface Metric {
  label: string;
  value: string | number;
  trend: number;
}

export interface InsightSection {
  title: string;
  metrics?: Metric[];
  value: string | number;
  change: string;
  changeColor: string;
  recommendations?: string[];
  icon: LucideIcon;
}