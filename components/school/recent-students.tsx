'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, Eye, Edit, MoreHorizontal } from 'lucide-react'

const recentStudents = [
  {
    id: 'FSS2024001',
    name: 'Mohamed Kamara',
    class: 'Form 5A',
    enrollmentDate: '2024-01-15',
    status: 'Active',
    gpa: 3.8,
    lastActivity: '2 hours ago'
  },
  {
    id: 'FSS2024002',
    name: 'Aminata Conteh',
    class: 'Form 4B',
    enrollmentDate: '2024-01-15',
    status: 'Active',
    gpa: 3.6,
    lastActivity: '1 day ago'
  },
  {
    id: 'FSS2024003',
    name: 'Ibrahim Sesay',
    class: 'Form 3A',
    enrollmentDate: '2024-01-16',
    status: 'Active',
    gpa: 3.2,
    lastActivity: '3 hours ago'
  },
  {
    id: 'FSS2024004',
    name: 'Fatima Bangura',
    class: 'Form 6A',
    enrollmentDate: '2024-01-16',
    status: 'Active',
    gpa: 3.9,
    lastActivity: '5 hours ago'
  },
  {
    id: 'FSS2024005',
    name: 'Abdul Kargbo',
    class: 'Form 2B',
    enrollmentDate: '2024-01-17',
    status: 'Active',
    gpa: 3.4,
    lastActivity: '1 day ago'
  }
]

export function RecentStudents() {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200'
      case 'suspended': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return 'text-green-600'
    if (gpa >= 3.0) return 'text-blue-600'
    if (gpa >= 2.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Recent Student Activity
        </CardTitle>
        <CardDescription>
          Latest student enrollments and activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentStudents.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-sierra-green text-white">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {student.name}
                  </h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      ID: {student.id}
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {student.class}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className={`text-sm font-semibold ${getGPAColor(student.gpa)}`}>
                    GPA: {student.gpa}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {student.lastActivity}
                  </div>
                </div>
                
                <Badge className={getStatusColor(student.status)}>
                  {student.status}
                </Badge>
                
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Button variant="outline">
            View All Students
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
