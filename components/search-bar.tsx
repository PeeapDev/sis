'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Search, X, School, Users, FileText, MapPin } from 'lucide-react'

interface SearchBarProps {
  placeholder?: string
}

const mockSearchResults = [
  {
    id: 1,
    type: 'school',
    title: 'Freetown Secondary School',
    description: 'Western Area • 1,200 students • 85% pass rate',
    icon: School
  },
  {
    id: 2,
    type: 'student',
    title: 'Mohamed Kamara',
    description: 'Student ID: FSS2024001 • Grade 10 • Bo Government School',
    icon: Users
  },
  {
    id: 3,
    type: 'district',
    title: 'Western Area District',
    description: '245 schools • 125,000 students • 82% average performance',
    icon: MapPin
  },
  {
    id: 4,
    type: 'report',
    title: 'Q3 Performance Report',
    description: 'Academic performance analysis for July-September 2024',
    icon: FileText
  }
]

export function SearchBar({ placeholder = "Search..." }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const handleSearch = (value: string) => {
    setQuery(value)
    if (value.length > 2) {
      // Simulate search results
      const filtered = mockSearchResults.filter(item =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
      )
      setResults(filtered)
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'school': return 'text-blue-600'
      case 'student': return 'text-green-600'
      case 'district': return 'text-purple-600'
      case 'report': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10 h-12 text-base"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="flex items-center space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                  onClick={() => {
                    // Handle result selection
                    console.log('Selected:', result)
                    setIsOpen(false)
                  }}
                >
                  <result.icon className={`h-5 w-5 ${getTypeColor(result.type)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {result.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {result.description}
                    </p>
                  </div>
                  <div className="text-xs text-gray-400 capitalize">
                    {result.type}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results */}
      {isOpen && query.length > 2 && results.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardContent className="p-4 text-center text-gray-500 dark:text-gray-400">
            No results found for "{query}"
          </CardContent>
        </Card>
      )}
    </div>
  )
}
