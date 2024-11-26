'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Search, MessageCircle, TrendingUp, FileText } from 'lucide-react';
import React, { useState, useEffect } from "react";
import { HfInference } from '@huggingface/inference';

export type SearchResult = any;

interface StatsCardsProps {
  queryUrl: string; // Added for the query URL
  searchResults: SearchResult[];
  socialMediaMentions: number;
  topTrends: string[];
  postCount: number;
}

export function StatsCards({
  queryUrl,
  searchResults,
  socialMediaMentions,
  topTrends,
  postCount,
}: StatsCardsProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const [percentageChange, setPercentageChange] = useState(0);
  const [sentiment, setSentiment] = useState<string | null>(null);

  const hf = new HfInference(process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || '');

  useEffect(() => {
    // Mock percentage change calculation
    const newPercentageChange = Math.floor(Math.random() * 100);
    setPercentageChange(newPercentageChange);

    // Fetch sentiment analysis using Hugging Face API
    const fetchSentiment = async () => {
      try {
        const response = await hf.textClassification({
          inputs: `Analyze the sentiment of content at: ${queryUrl}`,
          model: 'distilbert-base-uncased-finetuned-sst-2-english',
        });

        if (response && response[0]) {
          setSentiment(response[0].label); // Set sentiment
        }
      } catch (error) {
        console.error('Error fetching sentiment:', error);
        setSentiment('Unknown'); // Handle failure gracefully
      }
    };

    if (queryUrl) {
      fetchSentiment();
    }
  }, [queryUrl, searchResults.length, socialMediaMentions, topTrends.length, postCount]);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-6">
      <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.1 }}>
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Results</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{searchResults.length}</div>
            <p className="text-xs text-muted-foreground">+{percentageChange}% from last month</p>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.2 }}>
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social Mentions</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{socialMediaMentions}</div>
            <p className="text-xs text-muted-foreground">+{percentageChange}% from last month</p>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.3 }}>
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Trends</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 h-[60px] overflow-y-auto mb-2">
              {topTrends.map((trend, index) => (
                <Badge key={index} variant="secondary">{trend}</Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">+{percentageChange}% from last month</p>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.5, delay: 0.4 }}>
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sentiment Analysis</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sentiment || 'Loading...'}</div>
            <p className="text-xs text-muted-foreground">
              Sentiment based on content from the URL
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
