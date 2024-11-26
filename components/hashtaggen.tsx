'use client'

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Copy, Search, TrendingUp, CreditCard } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import Layout from '@/components/Layout'; // Import the Layout component

interface Hashtag {
  tag: string;
  score: number;
  volume: number;
  trend: { day: number; value: number }[];
}

export default function ImprovedHashtagGenerator() {
  const [topic, setTopic] = useState('');
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [trendingHashtags, setTrendingHashtags] = useState<Hashtag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTrendingLoading, setIsTrendingLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: session } = useSession();
  const router = useRouter();


    const fetchTrendingHashtags = async () => {
      setIsTrendingLoading(true);
      try {
        const response = await fetch('/api/trending-hashtags');
        console.log('Response Status:', response.status);
        if (!response.ok) {
          throw new Error('Failed to fetch trending hashtags');
        }
        const data = await response.json();
        console.log('Fetched Trending Hashtags:', data);
        setTrendingHashtags(data);
      } catch (error) {
        console.error('Error fetching trending hashtags:', error);
      } finally {
        setIsTrendingLoading(false);
      }
    };

   

  const generateHashtagSuggestions = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-hashtags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });
      if (!response.ok) {
        const errorMessage = await response.text(); // Get error message from response
        throw new Error(`Failed to generate hashtags: ${errorMessage}`);
      }
      const data = await response.json();
      setHashtags(data.hashtags); // Adjusted to match the response structure
    } catch (error) {
      console.error('Error generating hashtags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hashtags.map(h => h.tag).join(' '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredTrendingHashtags = trendingHashtags.filter(hashtag =>
    hashtag.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Omni Hashtag Generator" onLogout={() => {/* Handle logout */}}> 

    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Omni Social AI Hashtag Generator</CardTitle>
        <CardDescription>Generate and analyze relevant hashtags with real-time data insights</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-6">
          <Input
            placeholder="Enter a topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={generateHashtagSuggestions} disabled={isLoading || topic.length <= 2}>
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
        </div>
        <Button onClick={fetchTrendingHashtags} disabled={isTrendingLoading} className="flex items-center">
            {isTrendingLoading ? 'Loading Trending...' : 'Fetch Trending Hashtags'}
            <CreditCard className="ml-2 h-4 w-4" /> {/* Add the credit card icon */}
            <span className="ml-1 text-sm">3 Credits</span> {/* Display the credit cost */}
          </Button>
          
        
        <Tabs defaultValue="generated" className="w-full"style={{ marginTop: '20px' }}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="generated" className="flex-1">
              Generated Hashtags
              <CreditCard className="ml-2 h-4 w-4"/><span>1 Credit</span></TabsTrigger>
            <TabsTrigger value="trending" className="flex-1">
              <TrendingUp className="w-4 h-4 mr-2" />Trending Hashtags
            </TabsTrigger>
          </TabsList>
          <TabsContent value="generated">
            {hashtags.length > 0 ? (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {hashtags.map((hashtag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-1 px-2">
                      {hashtag.tag}
                    </Badge>
                  ))}
                </div>
                <Button onClick={copyToClipboard} className="w-full">
                  {copied ? 'Copied!' : 'Copy All Hashtags'}
                  <Copy className="ml-2 h-4 w-4" />
                </Button>
                <div className="space-y-4">
                  {hashtags.map((hashtag, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-lg">{hashtag.tag}</span>
                        <Badge variant="outline" className="ml-2">
                          Score: {hashtag.score}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">
                        Volume: {hashtag.volume.toLocaleString()} posts
                      </div>
                      <ChartContainer
                        config={{
                          trend: {
                            label: "Trend",
                            color: "hsl(var(--chart-1))",
                          },
                        }}
                        className="h-[100px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={hashtag.trend}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke="var(--color-trend)" strokeWidth={2} dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Enter a topic to generate hashtags
              </div>
            )}
          </TabsContent>

          <TabsContent value="trending">
            <div className="mb-4">
              <div className="relative">
                <Input
                  placeholder="Search trending hashtags"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
            </div>
            <div className="space-y-4">
              {filteredTrendingHashtags.map((hashtag, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-lg">{hashtag.tag}</span>
                    <Badge variant="outline" className="ml-2">
                      Score: {hashtag.score}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    Volume: {hashtag.volume.toLocaleString()} posts
                  </div>
                  <ChartContainer
                    config={{
                      trend: {
                        label: "Trend",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[100px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={hashtag.trend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke="var(--color-trend)" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Credits remaining: {session?.user?.credits || 0}
        </p>
        <div className="flex items-center text-sm text-gray-500">
          <AlertCircle className="mr-1 h-4 w-4" />
          Data is based on estimated trends
        </div>
      </CardFooter>
    </Card>
    </Layout>

  );
}
