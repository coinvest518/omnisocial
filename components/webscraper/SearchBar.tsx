'use client'

import React, { useState, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Loader2, Info } from 'lucide-react'
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SearchBarProps {
  userQuery: string;
  setUserQuery: React.Dispatch<React.SetStateAction<string>>;
  searchEngine: string;
  setSearchEngine: React.Dispatch<React.SetStateAction<string>>;
  onSearch: (query: string, engine: string, apiEndpoint: string) => Promise<void>;
}

const SearchBar: React.FC<SearchBarProps> = ({ userQuery, setUserQuery, searchEngine, setSearchEngine, onSearch }) => { // Receive props

  const [apiEndpoint, setApiEndpoint] = useState('/search')
  const [isSearching, setIsSearching] = useState(false)
  const [placeholder, setPlaceholder] = useState('Enter your search query')
  const [queryInfo, setQueryInfo] = useState('')

  useEffect(() => {
    updatePlaceholderAndInfo()
  }, [apiEndpoint])

  const handleSearch = async () => {
    if (userQuery.trim() === "") return;
    setIsSearching(true)
    await onSearch(userQuery, searchEngine, apiEndpoint)
    setIsSearching(false)
  }

  const handleApiEndpointChange = (value: string) => {
    setApiEndpoint(value)
    updateSearchEngine(value)
    updatePlaceholderAndInfo()
  }

  const updateSearchEngine = (endpoint: string) => {
    if (endpoint.includes('google_trends')) {
      setSearchEngine('google_trends')
    } else if (endpoint.includes('finance')) {
      setSearchEngine('google_finance')
    } else if (endpoint.includes('youtube')) {
      setSearchEngine('youtube')
    } else {
      setSearchEngine('google')
    }
  }

  const updatePlaceholderAndInfo = () => {
    switch (apiEndpoint) {
      case '/search?engine=google_trends':
        setPlaceholder('Enter keywords (e.g., coffee,tea,soda)')
        setQueryInfo('Use commas to separate multiple keywords')
        break;
      case '/search?engine=google_finance':
        setPlaceholder('Enter stock symbol (e.g., AAPL)')
        setQueryInfo('Enter a valid stock symbol')
        break;
      case '/search?engine=youtube':
        setPlaceholder('Enter YouTube search query')
        setQueryInfo('Enter any search term for YouTube')
        break;
      default:
        setPlaceholder('Enter your search query')
        setQueryInfo('Enter any search term')
    }
  }

  return (
    <motion.div 
      className="flex flex-col md:flex-row gap-4 items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex-grow w-full md:w-auto">
        <Input
          type="text"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder={placeholder}
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <Select value={apiEndpoint} onValueChange={handleApiEndpointChange}>
        <SelectTrigger className="w-full md:w-[200px]">
          <SelectValue placeholder="Select API endpoint" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="/search">General Search</SelectItem>
          <SelectItem value="/search?engine=google_trends">Google Trends</SelectItem>
          <SelectItem value="/search?engine=google_finance">Google Finance</SelectItem>
          <SelectItem value="/search?engine=youtube">YouTube</SelectItem>
        </SelectContent>
      </Select>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon">
              <Info className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{queryInfo}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Button onClick={handleSearch} disabled={isSearching}>
        {isSearching ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="mr-2 h-4 w-4" />
            Search
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default SearchBar;

