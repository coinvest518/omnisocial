import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ExternalLink,
  Eye,
  ThumbsUp,
  Share2,
  MessageCircle,
  TrendingUp,
  Calendar,
  Tag,
  PlayCircle,

  Image,
  Book,
  Globe,
  Newspaper,
  Video
} from 'lucide-react'

import { SearchResult } from '../../types/searchtypes';




export function SearchResultsList({
  searchResults,
  onResultClick
}: {
  searchResults: SearchResult[];
  onResultClick?: (result: SearchResult) => void;
}) {



  const [expandedResult, setExpandedResult] = useState<number | null>(null);

  const renderResultIcon = (type: SearchResult['type']) => {
    const iconProps = { className: "h-5 w-5 text-muted-foreground" };
    const iconMap = {
      'web': <Globe {...iconProps} />,
      'video': <Video {...iconProps} />,
      'image': <Image {...iconProps} />,
      'news': <Newspaper {...iconProps} />,
      'youtube': <PlayCircle {...iconProps} />,
      'shopping': <Tag {...iconProps} />,
      'books': <Book {...iconProps} />
    };
    return iconMap[type] || <Globe {...iconProps} />;
  };

  const handleResultClick = (result: SearchResult) => {
    onResultClick?.(result);
  };

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">No results found. Try adjusting your search terms.</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {searchResults.map((result, index) => (
          <Card
            key={index}
            className="flex flex-col hover:shadow-lg transition-shadow duration-300"
            onClick={() => handleResultClick(result)}
          >
            {/* Thumbnail or Media Preview */}
            {result.thumbnail && (
              <div className="relative">
                <img
                  src={result.thumbnail}
                  alt={result.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {result.duration && (
                  <Badge variant="secondary" className="absolute bottom-2 right-2">
                    {result.duration}
                  </Badge>
                )}
              </div>
            )}

            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold line-clamp-2 flex items-center gap-2">
                {renderResultIcon(result.type)}
                {result.title}
              </CardTitle>
              {(result.channel || result.newsOutlet) && (
                <Badge variant={result.channel ? "outline" : "secondary"}>
                  {result.channel || result.newsOutlet}
                </Badge>
              )}
            </CardHeader>

            <CardContent className="flex-grow">
              {result.snippet && (
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                  {result.snippet}
                </p>
              )}

              {/* Detailed Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {result.views !== undefined && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                    <span>{result.views.toLocaleString()} Views</span>
                  </div>
                )}
                {result.likes !== undefined && (
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3 text-muted-foreground" />
                    <span>{result.likes.toLocaleString()} Likes</span>
                  </div>
                )}
                {result.shares !== undefined && (
                  <div className="flex items-center gap-1">
                    <Share2 className="h-3 w-3 text-muted-foreground" />
                    <span>{result.shares.toLocaleString()} Shares</span>
                  </div>
                )}
                {result.comments !== undefined && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3 text-muted-foreground" />
                    <span>{result.comments.toLocaleString()} Comments</span>
                  </div>
                )}
                {result.publicationDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span>{result.publicationDate}</span>
                  </div>
                )}

                {/* Type-Specific Metrics */}
                {result.type === 'shopping' && result.price !== undefined && (
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <span>${result.price.toFixed(2)}</span>
                  </div>
                )}
                {result.type === 'books' && result.author && (
                  <div className="flex items-center gap-1">
                    <Book className="h-3 w-3 text-muted-foreground" />
                    <span>{result.author}</span>
                  </div>
                )}
              </div>

              {/* Additional Details Toggle */}
              {(result.keywords || result.section) && (
                <div className="mt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedResult(expandedResult === index ? null : index);
                    }}
                    className="w-full text-xs"
                  >
                    {expandedResult === index ? 'Hide Details' : 'Show More'}
                  </Button>
                </div>
              )}
            </CardContent>

            {/* Expanded Details */}
            {expandedResult === index && (
              <CardContent className="border-t text-xs">
                {result.keywords && (
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-wrap gap-1">
                      {result.keywords.map((keyword, kidx) => (
                        <Badge key={kidx} variant="outline" className="text-[0.6rem]">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {result.section && (
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span>{result.section}</span>
                  </div>
                )}
                {result.publicationDate && (
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>{new Date(result.publicationDate).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            )}

            <CardFooter className="mt-auto flex justify-between items-center">
              <Badge variant="secondary" className="text-xs">
                {new URL(result.link).hostname}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(result.link, '_blank', 'noopener,noreferrer');
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default SearchResultsList;