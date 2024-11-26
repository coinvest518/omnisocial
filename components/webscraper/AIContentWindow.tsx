import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface AIContentWindowProps {
  content: string | null;
  loading: boolean;
  error: string | null;
}

export default function AIContentWindow({ content, loading, error }: AIContentWindowProps) {
  if (loading) {
    return <Skeleton className="w-full h-64" />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!content) {
    return null;
  }

  return (
    <Tabs defaultValue="layout1">
      <TabsList>
        <TabsTrigger value="layout1">Layout 1</TabsTrigger>
        <TabsTrigger value="layout2">Layout 2</TabsTrigger>
        <TabsTrigger value="layout3">Layout 3</TabsTrigger>
        <TabsTrigger value="layout4">Layout 4</TabsTrigger>
      </TabsList>
      <TabsContent value="layout1">
        <div className="prose max-w-none">
          <h2>Task Overview</h2>
          <p>{content}</p>
        </div>
      </TabsContent>
      <TabsContent value="layout2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Key Points</h3>
            <ul className="list-disc list-inside">
              {content.split('. ').map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Additional Info</h3>
            <p>{content}</p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="layout3">
        <div className="flex flex-col space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <p>{content.slice(0, 100)}...</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Detailed Explanation</h3>
            <p>{content}</p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="layout4">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Task Breakdown</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-2">Main Content</h3>
              <p>{content}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Quick Tips</h3>
              <ul className="list-disc list-inside">
                {content.split('. ').slice(0, 3).map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

