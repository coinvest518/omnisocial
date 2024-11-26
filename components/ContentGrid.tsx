'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ScrapedData {
  title: string
  description: string
  content: string
  images: string[]
  keywords: string[]
}

export default function ContentGrid() {
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null)

  useEffect(() => {
    // Fetch saved scraped data from local storage or API
    const savedData = localStorage.getItem('scrapedData')
    if (savedData) {
      setScrapedData(JSON.parse(savedData))
    }
  }, [])

  const handleEdit = (field: keyof ScrapedData, value: string | string[]) => {
    if (scrapedData) {
      const updatedData = { ...scrapedData, [field]: value }
      setScrapedData(updatedData)
      localStorage.setItem('scrapedData', JSON.stringify(updatedData))
    }
  }

  if (!scrapedData) {
    return <div>No scraped data available. Please enter a URL to scrape.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full p-2 border rounded"
            value={scrapedData.title}
            onChange={(e) => handleEdit('title', e.target.value)}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full p-2 border rounded"
            value={scrapedData.description}
            onChange={(e) => handleEdit('description', e.target.value)}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full p-2 border rounded"
            value={scrapedData.content}
            onChange={(e) => handleEdit('content', e.target.value)}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="grid" className="w-full">
            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
            <TabsContent value="grid">
              <div className="grid grid-cols-3 gap-2">
                {scrapedData.images.map((image, index) => (
                  <img key={index} src={image} alt={`Scraped image ${index}`} className="w-full h-auto" />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="list">
              <ul>
                {scrapedData.images.map((image, index) => (
                  <li key={index}>{image}</li>
                ))}
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            className="w-full p-2 border rounded"
            value={scrapedData.keywords.join(', ')}
            onChange={(e) => handleEdit('keywords', e.target.value.split(', '))}
          />
        </CardContent>
      </Card>
    </div>
  )
}

