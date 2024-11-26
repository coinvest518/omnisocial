import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SearchResult } from '../../types/searchtypes';
import AIContentWindow from './AIContentWindow';
import { IconType } from 'react-icons';
import { FaBlog, FaShareAlt, FaNewspaper, FaStar } from 'react-icons/fa';

interface TaskTypeSectionProps {
  data: SearchResult[];
}

interface TaskType {
  type: string;
  metrics: string[];
  requirements: string[];
  icon: IconType;
}

const taskTypes: TaskType[] = [
  {
    type: 'Blog Post',
    metrics: ['Views', 'Comments', 'Shares', 'Read Time'],
    requirements: ['Title', 'Content', 'Meta Description', 'Keywords'],
    icon: FaBlog,
  },
  {
    type: 'Social Media Post',
    metrics: ['Likes', 'Shares', 'Comments', 'Engagement Rate'],
    requirements: ['Caption', 'Hashtags', 'Media Type', 'Keywords'],
    icon: FaShareAlt,
  },
  {
    type: 'Article',
    metrics: ['Page Views', 'Time on Page', 'Backlinks', 'Citations'],
    requirements: ['Headline', 'Body', 'Sources', 'Author'],
    icon: FaNewspaper,
  },
  {
    type: 'Product Review',
    metrics: ['Helpful Votes', 'Purchase Rate', 'Rating', 'Comments'],
    requirements: ['Product Details', 'Pros/Cons', 'Rating', 'Images'],
    icon: FaStar,
  }
];

export default function TaskTypeSection({ data }: TaskTypeSectionProps) {
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch user query from URL
  const userQuery = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('query') : null;

  const fetchContent = async (taskType: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer HUGGINGFACE_API_KEY`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: `${taskType} ${userQuery}` }),
      });

      const data = await response.json();
      const generatedContent = data.generated_text || 'No content generated.';

      // Deduct credits and store the generated content
      const userResponse = await fetch('/api/deduct-credits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskType,
          content: generatedContent,
        }),
      });

      if (!userResponse.ok) {
        throw new Error('Failed to deduct credits or store content');
      }

      setContent(generatedContent);
    } catch (err) {
      setError('Failed to fetch content');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskClick = async (taskType: string) => {
    setSelectedTask(taskType);
    await fetchContent(taskType);
    setIsDialogOpen(true);
  };

  // Add this useEffect to fetch content when the component mounts or userQuery changes
  useEffect(() => {
    if (userQuery && selectedTask) {
      fetchContent(selectedTask);
    }
  }, [userQuery, selectedTask]); // Dependencies

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Task Types</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {taskTypes.map((task, index) => (
            <div key={index} className={`p-4 border rounded-lg bg-card ${selectedTask === task.type ? 'border-blue-500' : ''}`}>
              <task.icon className="h-6 w-6 mb-2" />
              <h3 className="font-semibold text-lg mb-2">{task.type}</h3>
              
              <div className="mb-4">
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Key Metrics:</h4>
                <ul className="text-sm list-disc list-inside">
                  {task.metrics.map((metric, idx) => (
                    <li key={idx}>{metric}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-sm text-muted-foreground mb-1">Requirements:</h4>
                <ul className="text-sm list-disc list-inside">
                  {task.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>

              <Dialog open={isDialogOpen && selectedTask === task.type} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => handleTaskClick(task.type)}>Learn More</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{task.type}</DialogTitle>
                  </DialogHeader>
                  <AIContentWindow
                    content={content}
                    loading={loading}
                    error={error}
                  />
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

