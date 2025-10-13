'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  GraduationCap, 
  Award, 
  Calendar,
  BookOpen,
  TrendingUp,
  UserPlus,
  FileText,
  Upload,
  Download
} from 'lucide-react'
import { SchoolLayout } from '@/components/school/school-layout'
import { SchoolStatsCards } from '@/components/school/school-stats-cards'
import { StudentEnrollmentChart } from '@/components/school/student-enrollment-chart'
import { ClassPerformanceChart } from '@/components/school/class-performance-chart'
import { RecentStudents } from '@/components/school/recent-students'
import { TeachersList } from '@/components/school/teachers-list'

// Mock school data
const schoolData = {
  name: 'Freetown Secondary School',
  code: 'FSS001',
  district: 'Western Area',
  principal: 'Dr. Fatima Sesay',
  established: '1965',
  type: 'Public Secondary',
  totalStudents: 1247,
  totalTeachers: 45,
  totalClasses: 18,
  passRate: 85.2
}

export default function SchoolDashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const stats = [
    {
      title: 'Total Students',
      value: schoolData.totalStudents.toLocaleString(),
      change: '+5.2%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      title: 'Teachers',
      value: schoolData.totalTeachers.toString(),
      change: '+2',
      trend: 'up',
      icon: GraduationCap,
      color: 'text-green-600'
    },
    {
      title: 'Classes',
      value: schoolData.totalClasses.toString(),
      change: '0%',
      trend: 'neutral',
      icon: BookOpen,
      color: 'text-purple-600'
    },
    {
      title: 'Pass Rate',
      value: `${schoolData.passRate}%`,
      change: '+3.1%',
      trend: 'up',
      icon: Award,
      color: 'text-orange-600'
    }
  ]

  return (
    <SchoolLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              School Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {schoolData.name} • {schoolData.district}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload Results
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button size="sm" className="bg-sierra-green hover:bg-sierra-green/90">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* School Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">School Code</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{schoolData.code}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Principal</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{schoolData.principal}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Established</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{schoolData.established}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Type</h3>
                <Badge variant="secondary">{schoolData.type}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <SchoolStatsCards stats={stats} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <StudentEnrollmentChart />
              <ClassPerformanceChart />
            </div>
            <RecentStudents />
          </TabsContent>

          <TabsContent value="students" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student Management
                </CardTitle>
                <CardDescription>
                  Manage student enrollment, records, and academic progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  Student management interface will be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="space-y-6">
            <TeachersList />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Academic Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ClassPerformanceChart />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Subject Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    Subject performance analysis will be shown here
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SchoolLayout>
  )
}
