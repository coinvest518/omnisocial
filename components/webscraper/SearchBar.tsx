'use client'

import React, { Dispatch, SetStateAction } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Loader2 } from 'lucide-react'
import { motion } from "framer-motion"

interface SearchBarProps {
  userQuery: string;
  setUserQuery: Dispatch<SetStateAction<string>>;
  searchEngine: string;
  setSearchEngine: Dispatch<SetStateAction<string>>;
  onSearch: () => Promise<void>;
}

const SearchBar: React.FC<SearchBarProps> = ({
  userQuery,
  setUserQuery,
  searchEngine,
  setSearchEngine,
  onSearch,
}) => {
  const [isSearching, setIsSearching] = React.useState(false)

  const handleSearch = async () => {
    setIsSearching(true)
    await onSearch()
    setIsSearching(false)
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
          placeholder="Enter your search query"
          className="pr-10"
        />
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <Select value={searchEngine} onValueChange={setSearchEngine}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Select search engine" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="google">Google</SelectItem>
          <SelectItem value="bing">Bing</SelectItem>
          <SelectItem value="yahoo">Yahoo</SelectItem>
          <SelectItem value="yandex">Yandex</SelectItem>
          <SelectItem value="duckduckgo">DuckDuckGo</SelectItem>

        </SelectContent>
      </Select>
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

