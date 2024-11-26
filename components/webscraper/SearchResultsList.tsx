import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from 'lucide-react'
import { SearchResult } from '../../types/searchtypes';

interface SearchResultsListProps {
  searchResults: SearchResult[];
}

export function SearchResultsList({ searchResults }: SearchResultsListProps) {
  if (searchResults.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-muted-foreground">No results found. Try adjusting your search terms.</p>
      </div>
    );
  }

  return (
    <div className="py-6"> {/* Added padding to the top and bottom */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {searchResults.map((result, index) => (
          <Card key={index} className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg font-semibold line-clamp-2">{result.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">{result.snippet}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Badge variant="secondary" className="text-xs">
                {new URL(result.link).hostname}
              </Badge>
              <Button variant="outline" size="sm" asChild>
                <a href={result.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  Visit <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

