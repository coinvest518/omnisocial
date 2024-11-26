import { Metadata } from 'next';
import ThumbnailGenerator from '@/components/thumbnailgen'; // Adjust the import path if necessary

export const metadata: Metadata = {
  title: 'YouTube Thumbnail Generator',
  description: 'Generate and analyze YouTube thumbnails from prompts',
};

export default function ThumbnailGeneratorPage() {
  return (
    <div className="container mx-auto py-10">
      <ThumbnailGenerator />
    </div>
  );
}