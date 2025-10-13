'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { School, MapPin, Calendar, CheckCircle, Clock, Eye } from 'lucide-react'

interface SchoolRecord {
  school: string
  period: string
  level: string
  status: string
  district: string
}

interface SchoolHistoryProps {
  schools: SchoolRecord[]
}

export function SchoolHistory({ schools }: SchoolHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'current': return 'bg-green-100 text-green-800 border-green-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'transferred': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'current': return <Clock className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      default: return <School className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <School className="h-5 w-5" />
          Educational Journey
        </CardTitle>
        <CardDescription>
          Complete history of schools attended throughout your academic career
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {schools.map((school, index) => (
            <div key={index} className="relative">
              {/* Timeline connector */}
              {index < schools.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200 dark:bg-gray-700"></div>
              )}
              
              <div className="flex items-start space-x-4">
                {/* Timeline dot */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                  school.status === 'Current' 
                    ? 'bg-sierra-green text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {getStatusIcon(school.status)}
                </div>
                
                {/* School details */}
                <div className="flex-1 min-w-0">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {school.school}
                        </h3>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-1" />
                            {school.period}
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-1" />
                            {school.district}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mt-3">
                          <Badge variant="secondary">
                            {school.level} Education
                          </Badge>
                          <Badge className={getStatusColor(school.status)}>
                            {school.status}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Records
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-sierra-green">
              {schools.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Schools Attended
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-sierra-blue">
              {new Date().getFullYear() - 2014}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Years in Education
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-sierra-gold">
              2
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Education Levels
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
