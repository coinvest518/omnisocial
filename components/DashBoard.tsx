'use client'

import React, { useState, useEffect } from 'react';
import {
  FaCreditCard, FaListAlt, FaChartPie,
} from 'react-icons/fa';
import { getRecentTemplates, getUserCredits, getUserData } from '@/services/userService';
import { useSession } from 'next-auth/react';
import { TEMPLATES, Template as ImportedTemplate } from '@/constants/templates';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Search, Trash2, Edit2, Save, X, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

interface ContentSection {
  id: string;
  content: string;
  isEditing: boolean;
}

interface Hashtag {
  _id: string;
  tag: string;
}

interface Thumbnail {
  _id: string;
  url: string;

}

interface TemplateUsage extends Omit<ImportedTemplate, 'content'> {
  _id: string;
  templateId: string;
  content: ContentSection[];
  createdAt: Date;
  updatedAt?: Date;
  tags?: string[];
  views?: number;
}

interface RawTemplateUsage extends Omit<TemplateUsage, 'content'> {
  content: string;
}

interface DashboardData {
  totalTemplates: number;
  categoryCounts: { [key: string]: number };
  recentTemplates: TemplateUsage[];
  popularCategories: { category: string; count: number }[];
  credits: number;
}

export default function UserDashboard() {
  const { data: session, } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    totalTemplates: 0,
    categoryCounts: {},
    recentTemplates: [],
    popularCategories: [],
    credits: 0,
  });
  const [selectedTab, setSelectedTab] = useState<string>('overview');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userHashtags, setUserHashtags] = useState<Hashtag[]>([]);
  const [userThumbnails, setUserThumbnails] = useState<Thumbnail[]>([]);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [templatesData, credits, userDataResponse] = await Promise.all([
          getRecentTemplates(),
          getUserCredits(),
          session?.user?.id ? getUserData() : Promise.resolve(null),
        ]);

        const recentTemplates: TemplateUsage[] = (templatesData as RawTemplateUsage[]).map(template => ({
          ...template,
          createdAt: new Date(template.createdAt || 0),
          templateId: template.templateId || template._id || 'unknown',
          content: template.content.split('\n\n').map((content, index) => ({
            id: `${template._id}-${index}`,
            content: content.trim(),
            isEditing: false,
          })),
        }));

        const categoryCounts = calculateCategoryCounts(recentTemplates);

        setDashboardData({
          totalTemplates: TEMPLATES.length,
          recentTemplates,
          categoryCounts,
          popularCategories: calculatePopularCategories(recentTemplates),
          credits,
        });

        if (userDataResponse) {
          setUserData(userDataResponse);
          // Update dashboard credits with potentially more accurate value from userData
          setUserHashtags(userDataResponse.hashtags || []);
          setUserThumbnails(userDataResponse.thumbnails || []);
          setDashboardData(prev => ({ ...prev, credits: userDataResponse.credits }));
      }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [session]);

  const calculateCategoryCounts = (templates: TemplateUsage[]) => {
    const counts: { [key: string]: number } = {};
    TEMPLATES.forEach(template => {
      if (template.categories) {
        template.categories.forEach(category => {
          counts[category] = (counts[category] || 0) + 1;
        });
      }
    });
    return counts;
  };

  const calculatePopularCategories = (templates: TemplateUsage[]) => {
    const categoryCounts = calculateCategoryCounts(templates);
    return Object.entries(categoryCounts)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const handleContentEdit = (templateId: string, sectionId: string, newContent: string) => {
    setDashboardData(prev => ({
      ...prev,
      recentTemplates: prev.recentTemplates.map(template =>
        template._id === templateId
          ? {
            ...template,
            content: template.content.map(section =>
              section.id === sectionId
                ? { ...section, content: newContent }
                : section
            ),
          }
          : template
      ),
    }));
  };

  const handleDeleteTemplateUsage = async (usageId: string) => {
    try {
      const response = await fetch(`/api/deleteTemplateUsage?usageId=${usageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting template usage:", errorData.message);
        return;
      }

      setDashboardData(prevData => ({
        ...prevData,
        recentTemplates: prevData.recentTemplates.filter(usage => usage._id !== usageId),
      }));

    } catch (error) {
      console.error("Error deleting template usage:", error);
    }
  };

  const toggleSectionEdit = (templateId: string, sectionId: string) => {
    setDashboardData(prev => ({
      ...prev,
      recentTemplates: prev.recentTemplates.map(template =>
        template._id === templateId
          ? {
            ...template,
            content: template.content.map(section =>
              section.id === sectionId
                ? { ...section, isEditing: !section.isEditing }
                : section
            ),
          }
          : template
      ),
    }));
  };

  const filteredTemplates = dashboardData.recentTemplates.filter(template =>
    (!filterCategory || (template.categories && template.categories.includes(filterCategory))) &&
    (!searchTerm || template.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Mock data for the usage chart
 

  const RenderOverviewTab = () => {
    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!session?.user) {
      return <div>User not logged in.</div>;
    }

    if (!userData) {
      return <div>No user data found.</div>;
    }

    return (
      <>
        <div className="max-w-7xl mx-auto"> {/* Or max-w-screen, max-w-5xl, etc. */}

        <Card>
          <CardHeader>
            <CardTitle>Your Hashtags</CardTitle>
          </CardHeader>
          <CardContent>
            {userHashtags.length > 0 ? (
              <div className="flex flex-wrap gap-2 overflow-x-auto">
              {userHashtags.map((hashtag: { _id: React.Key | null | undefined; tag: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; }) => (
                  <Badge key={hashtag._id} variant="secondary" className="text-sm py-1 px-2">
                    {hashtag.tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p>No hashtags generated yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Artwork</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto ">
          {userThumbnails.map((thumbnail: { _id: React.Key | null | undefined; url: string | StaticImport; }) => (
                <div key={thumbnail._id} className="relative w-full h-48">
                  <Image
                    src={thumbnail.url}
                    alt="Generated Thumbnail"
                    fill
                    sizes="100vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              ))}
            </div>
            {userThumbnails.length === 0 && <p>No artwork generated yet.</p>}
          </CardContent>
        </Card>
        </div>
      </>
    );
  };

  const RenderTemplatesTab = () => (
    <div>
      <div className="flex flex-col h-full">
      <div className="flex space-x-2 mb-4">
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter Category" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(dashboardData.categoryCounts).map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 overflow-hidden">
      {filteredTemplates.map(usage => {
          const template = TEMPLATES.find(t => t.id === usage.templateId);

          return (
            <Card key={usage._id} className="mb-4">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    {template ? (
                      <>
                        <CardTitle>{template.title}</CardTitle>
                        {template.categories && (
                          <p className="text-sm text-muted-foreground">{template.categories.join(', ')}</p>
                        )}
                      </>
                    ) : (
                      <p>Template not found</p>
                    )}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteTemplateUsage(usage._id)}>
                    <Trash2 className="text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {usage.content.map((section) => (
                  <div key={section.id} className="mb-4">
                    {section.isEditing ? (
                      <div className="space-y-2">
                        <Textarea
                          value={section.content}
                          onChange={(e) => handleContentEdit(usage._id, section.id, e.target.value)}
                          rows={3}
                          className="w-full"
                        />
                        <div className="flex justify-end space-x-2">
                          <Button size="sm" onClick={() => toggleSectionEdit(usage._id, section.id)}>
                            <X className="w-4 h-4 mr-2" /> Cancel
                          </Button>
                          <Button size="sm" onClick={() => toggleSectionEdit(usage._id, section.id)}>
                            <Save className="w-4 h-4 mr-2" /> Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="group relative">
                        <p className="text-sm text-muted-foreground mb-2">
                          {section.content}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => toggleSectionEdit(usage._id, section.id)}
                        >
                          <Edit2 className="w-4 h-4 mr-2" /> Edit
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
<div className="p-6 flex flex-col h-screen max-h-screen overflow-hidden">
<div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/">
          <Button><Plus className="w-4 h-4 mr-2" /> New Template</Button>
        </Link>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview">
            <FaChartPie className="mr-2" /> Overview
          </TabsTrigger>
          <TabsTrigger value="templates">
            <FaListAlt className="mr-2" /> Templates
          </TabsTrigger>
          <TabsTrigger value="credits">
            <FaCreditCard className="mr-2" /> Credits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="flex-1 overflow-auto">
          <RenderOverviewTab />
        </TabsContent>
        <TabsContent value="templates" className="flex-1 overflow-auto">
          <RenderTemplatesTab />
        </TabsContent>
        <TabsContent value="credits" className="flex-1 overflow-auto">
          <Card>
            <CardHeader>
              <CardTitle>Credit Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manage and purchase additional credits here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
