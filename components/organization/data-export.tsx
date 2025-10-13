'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Download, Database, FileText, Calendar, Filter, Settings } from 'lucide-react'

const dataCategories = [
  {
    id: 'schools',
    name: 'Schools Data',
    description: 'School information, locations, and infrastructure',
    records: '2,847 schools',
    lastUpdated: '2024-10-15',
    size: '15.2 MB'
  },
  {
    id: 'students',
    name: 'Student Records',
    description: 'Student enrollment and demographic data',
    records: '485,392 students',
    lastUpdated: '2024-10-14',
    size: '89.7 MB'
  },
  {
    id: 'teachers',
    name: 'Teacher Information',
    description: 'Teacher qualifications and assignments',
    records: '18,654 teachers',
    lastUpdated: '2024-10-13',
    size: '12.8 MB'
  },
  {
    id: 'results',
    name: 'Academic Results',
    description: 'Examination results and performance data',
    records: '1.2M results',
    lastUpdated: '2024-10-12',
    size: '156.4 MB'
  },
  {
    id: 'infrastructure',
    name: 'Infrastructure Data',
    description: 'School facilities and resource information',
    records: '2,847 facilities',
    lastUpdated: '2024-10-10',
    size: '8.9 MB'
  },
  {
    id: 'attendance',
    name: 'Attendance Records',
    description: 'Student and teacher attendance data',
    records: '2.8M records',
    lastUpdated: '2024-10-15',
    size: '234.1 MB'
  }
]

const exportFormats = [
  { value: 'csv', label: 'CSV (Comma Separated Values)', description: 'Best for spreadsheet applications' },
  { value: 'json', label: 'JSON (JavaScript Object Notation)', description: 'Best for web applications' },
  { value: 'xlsx', label: 'Excel Workbook', description: 'Best for Microsoft Excel' },
  { value: 'xml', label: 'XML (Extensible Markup Language)', description: 'Best for data interchange' }
]

export function DataExport() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [exportFormat, setExportFormat] = useState('')
  const [dateRange, setDateRange] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleExport = async () => {
    if (selectedCategories.length === 0 || !exportFormat) {
      return
    }

    setIsExporting(true)
    
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false)
      // In a real app, this would trigger the actual download
      alert(`Export completed! ${selectedCategories.length} datasets exported as ${exportFormat.toUpperCase()}`)
    }, 3000)
  }

  const getTotalSize = () => {
    return selectedCategories.reduce((total, categoryId) => {
      const category = dataCategories.find(cat => cat.id === categoryId)
      if (category) {
        const size = parseFloat(category.size.replace(' MB', ''))
        return total + size
      }
      return total
    }, 0).toFixed(1)
  }

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="h-5 w-5" />
            <span>Data Export Configuration</span>
          </CardTitle>
          <CardDescription>
            Select datasets and configure export settings for research purposes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Categories Selection */}
          <div>
            <h3 className="text-lg font-medium mb-4">Select Data Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataCategories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedCategories.includes(category.id)
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleCategoryToggle(category.id)}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategoryToggle(category.id)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{category.name}</h4>
                        <Badge variant="outline">{category.size}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{category.records}</span>
                        <span>Updated: {category.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Export Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Export Format</label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue placeholder="Select export format" />
                </SelectTrigger>
                <SelectContent>
                  {exportFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <div>
                        <div className="font-medium">{format.label}</div>
                        <div className="text-xs text-gray-500">{format.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="2024">2024 Academic Year</SelectItem>
                  <SelectItem value="2023">2023 Academic Year</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Export Summary */}
          {selectedCategories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            >
              <h4 className="font-medium text-blue-900 mb-2">Export Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-blue-600">Categories:</span>
                  <div className="font-medium">{selectedCategories.length}</div>
                </div>
                <div>
                  <span className="text-blue-600">Total Size:</span>
                  <div className="font-medium">{getTotalSize()} MB</div>
                </div>
                <div>
                  <span className="text-blue-600">Format:</span>
                  <div className="font-medium">{exportFormat.toUpperCase() || 'Not selected'}</div>
                </div>
                <div>
                  <span className="text-blue-600">Est. Time:</span>
                  <div className="font-medium">~{Math.ceil(parseFloat(getTotalSize()) / 10)} min</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Export Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleExport}
              disabled={selectedCategories.length === 0 || !exportFormat || isExporting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isExporting ? (
                <>
                  <Settings className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Exports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Recent Exports</span>
          </CardTitle>
          <CardDescription>
            Your recent data export history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: 'Schools & Infrastructure Data', date: '2024-10-14', size: '24.1 MB', format: 'CSV', status: 'Completed' },
              { name: 'Student Performance Analysis', date: '2024-10-12', size: '156.4 MB', format: 'JSON', status: 'Completed' },
              { name: 'Teacher Qualification Report', date: '2024-10-10', size: '12.8 MB', format: 'Excel', status: 'Completed' },
              { name: 'Attendance Trends Data', date: '2024-10-08', size: '89.2 MB', format: 'CSV', status: 'Completed' }
            ].map((export_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <Database className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">{export_.name}</div>
                    <div className="text-sm text-gray-500">
                      {export_.date} • {export_.size} • {export_.format}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800">
                    {export_.status}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
