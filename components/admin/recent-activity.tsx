'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Clock, User, School, FileText, Award } from 'lucide-react'

const activities = [
  {
    id: 1,
    type: 'enrollment',
    title: 'New student enrollment',
    description: 'Mohamed Kamara enrolled at Freetown Secondary School',
    time: '2 minutes ago',
    icon: User,
    color: 'bg-blue-500'
  },
  {
    id: 2,
    type: 'result',
    title: 'Exam results uploaded',
    description: 'Term 2 results for Bo Government School have been uploaded',
    time: '15 minutes ago',
    icon: Award,
    color: 'bg-green-500'
  },
  {
    id: 3,
    type: 'school',
    title: 'New school registered',
    description: 'Kailahun Community School added to the system',
    time: '1 hour ago',
    icon: School,
    color: 'bg-purple-500'
  },
  {
    id: 4,
    type: 'report',
    title: 'Monthly report generated',
    description: 'Western Area district performance report is ready',
    time: '2 hours ago',
    icon: FileText,
    color: 'bg-orange-500'
  },
  {
    id: 5,
    type: 'enrollment',
    title: 'Bulk student transfer',
    description: '45 students transferred from Makeni to Port Loko schools',
    time: '3 hours ago',
    icon: User,
    color: 'bg-blue-500'
  }
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>
          Latest updates and changes in the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <div className={`p-2 rounded-full ${activity.color}`}>
                <activity.icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.title}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
