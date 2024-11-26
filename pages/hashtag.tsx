import { Metadata } from 'next'
import DynamicHashtagGenerator from '@/components/hashtaggen'

export const metadata: Metadata = {
  title: 'Dynamic Hashtag Generator',
  description: 'Generate and analyze hashtags for your social media content',
}

export default function HashtagGeneratorPage() {
  return (
    <div className="container mx-auto py-10">
      <DynamicHashtagGenerator />
    </div>
  )
}