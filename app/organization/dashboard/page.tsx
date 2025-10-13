'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Users, 
  GraduationCap, 
  TrendingUp, 
  MapPin,
  Search,
  Download,
  Filter,
  Calendar,
  School,
  Award,
  BookOpen,
  Database,
  FileText,
  PieChart,
  Activity
} from 'lucide-react'
import { OrganizationLayout } from '@/components/organization/organization-layout'
import { ResearchStatsCards } from '@/components/organization/research-stats-cards'
import { DataVisualization } from '@/components/organization/data-visualization'
import { ResearchReports } from '@/components/organization/research-reports'
import { DataExport } from '@/components/organization/data-export'

// Mock organization data
const organizationData = {
  name: 'Sierra Leone Education Research Institute',
  type: 'Research Organization',
  established: '2020',
  focus: 'Educational Analytics & Policy Research',
  accessLevel: 'National Data Access',
  activeProjects: 12,
  completedReports: 45,
  dataPoints: '2.4M+'
}

export default function OrganizationDashboard() {
  const [user, setUser] = useState<any>(null)
  const [selectedTimeRange, setSelectedTimeRange] = useState('year')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const researchStats = [
    {
      title: 'Active Research Projects',
      value: '12',
      change: '+3 this month',
      trend: 'up',
      icon: Activity,
      color: 'text-purple-600'
    },
    {
      title: 'Data Points Analyzed',
      value: '2.4M+',
      change: '+150K this month',
      trend: 'up',
      icon: Database,
      color: 'text-blue-600'
    },
    {
      title: 'Research Reports',
      value: '45',
      change: '+5 this quarter',
      trend: 'up',
      icon: FileText,
      color: 'text-green-600'
    },
    {
      title: 'Schools Analyzed',
      value: '2,847',
      change: 'Complete coverage',
      trend: 'neutral',
      icon: School,
      color: 'text-orange-600'
    }
  ]

  const recentProjects = [
    {
      title: 'Rural Education Access Study',
      status: 'In Progress',
      progress: 75,
      deadline: '2024-12-15',
      lead: 'Dr. Aminata Kargbo'
    },
    {
      title: 'Gender Parity in STEM Education',
      status: 'In Progress',
      progress: 60,
      deadline: '2024-11-30',
      lead: 'Prof. Mohamed Sesay'
    },
    {
      title: 'Post-COVID Learning Recovery',
      status: 'Completed',
      progress: 100,
      deadline: '2024-10-01',
      lead: 'Dr. Fatima Conteh'
    }
  ]

  return (
    <OrganizationLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900"
            >
              Research Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 mt-2"
            >
              Welcome back, {user?.name || 'Research Organization'}
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center space-x-4 mt-4 lg:mt-0"
          >
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter Data
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </motion.div>
        </div>

        {/* Organization Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{organizationData.name}</CardTitle>
                  <CardDescription className="text-white/80">
                    {organizationData.type} • Est. {organizationData.established}
                  </CardDescription>
                </div>
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {organizationData.accessLevel}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-white/90">{organizationData.focus}</p>
              <div className="flex items-center space-x-6 mt-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Activity className="h-4 w-4" />
                  <span>{organizationData.activeProjects} Active Projects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>{organizationData.completedReports} Reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span>{organizationData.dataPoints} Data Points</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <ResearchStatsCards stats={researchStats} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="export">Data Export</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            <DataVisualization />
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-5 w-5" />
                    <span>Active Research Projects</span>
                  </CardTitle>
                  <CardDescription>
                    Current research initiatives and their progress
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentProjects.map((project, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{project.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Lead: {project.lead} • Deadline: {project.deadline}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="w-32 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{project.progress}%</span>
                          </div>
                        </div>
                        <Badge 
                          variant={project.status === 'Completed' ? 'default' : 'secondary'}
                          className={project.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {project.status}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ResearchReports />
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <DataExport />
          </TabsContent>
        </Tabs>
      </div>
    </OrganizationLayout>
  )
}
