'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Building2
} from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { StatsCards } from '@/components/admin/stats-cards'
import { EnrollmentChart } from '@/components/admin/enrollment-chart'
import { PerformanceChart } from '@/components/admin/performance-chart'
import { SchoolsMap } from '@/components/admin/schools-map'
import { RecentActivity } from '@/components/admin/recent-activity'
import { SearchBar } from '@/components/search-bar'
import { OrganizationManagement } from '@/components/admin/organization-management'

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [selectedDistrict, setSelectedDistrict] = useState('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState('year')

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const stats = [
    {
      title: 'Total Schools',
      value: '2,847',
      change: '+12%',
      trend: 'up' as const,
      icon: School,
      color: 'text-blue-600'
    },
    {
      title: 'Total Students',
      value: '1,234,567',
      change: '+8.5%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-green-600'
    },
    {
      title: 'Teachers',
      value: '45,678',
      change: '+5.2%',
      trend: 'up' as const,
      icon: GraduationCap,
      color: 'text-purple-600'
    },
    {
      title: 'Pass Rate',
      value: '78.5%',
      change: '+3.1%',
      trend: 'up' as const,
      icon: Award,
      color: 'text-orange-600'
    }
  ]

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-8 h-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ paddingTop: 0 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user?.name || 'Administrator'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" className="bg-sierra-green hover:bg-sierra-green/90">
              <Calendar className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar placeholder="Search schools, students, or districts..." />

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schools">Schools</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="maps">Maps</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <EnrollmentChart />
              <PerformanceChart />
            </div>
            
            {/* Additional Overview Content */}
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    District Performance
                  </CardTitle>
                  <CardDescription>Top performing districts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { district: 'Western Area', score: '85.2%', change: '+2.1%' },
                      { district: 'Bo District', score: '78.9%', change: '+1.8%' },
                      { district: 'Kenema', score: '76.4%', change: '+3.2%' },
                      { district: 'Makeni', score: '74.1%', change: '+1.5%' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{item.district}</span>
                        <div className="text-right">
                          <div className="font-bold text-green-600">{item.score}</div>
                          <div className="text-xs text-green-500">{item.change}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Recent Enrollments
                  </CardTitle>
                  <CardDescription>Latest student registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { school: 'Freetown Secondary', students: 45, date: 'Today' },
                      { school: 'Bo Government School', students: 32, date: 'Yesterday' },
                      { school: 'Makeni Technical', students: 28, date: '2 days ago' },
                      { school: 'Kenema High School', students: 19, date: '3 days ago' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <div>
                          <div className="font-medium">{item.school}</div>
                          <div className="text-xs text-gray-500">{item.date}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-blue-600">+{item.students}</div>
                          <div className="text-xs text-gray-500">students</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-orange-600" />
                    Subject Rankings
                  </CardTitle>
                  <CardDescription>Best performing subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { subject: 'Mathematics', score: '82.1%', trend: 'up' },
                      { subject: 'English Language', score: '79.8%', trend: 'up' },
                      { subject: 'Science', score: '76.5%', trend: 'down' },
                      { subject: 'Social Studies', score: '74.2%', trend: 'up' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                        <span className="font-medium">{item.subject}</span>
                        <div className="text-right">
                          <div className="font-bold text-orange-600">{item.score}</div>
                          <div className={`text-xs ${item.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                            {item.trend === 'up' ? '↗' : '↘'} {item.trend}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    Upcoming Events
                  </CardTitle>
                  <CardDescription>Important dates and deadlines</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { event: 'WASSCE Examinations', date: 'Nov 15, 2024', type: 'Exam', color: 'bg-red-100 text-red-800' },
                      { event: 'Teacher Training Workshop', date: 'Nov 20, 2024', type: 'Training', color: 'bg-blue-100 text-blue-800' },
                      { event: 'School Infrastructure Review', date: 'Dec 1, 2024', type: 'Review', color: 'bg-green-100 text-green-800' },
                      { event: 'Term 1 Results Submission', date: 'Dec 15, 2024', type: 'Deadline', color: 'bg-orange-100 text-orange-800' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{item.event}</div>
                          <div className="text-sm text-gray-500">{item.date}</div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.color}`}>
                          {item.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <RecentActivity />
            </div>
          </TabsContent>

          <TabsContent value="schools" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Public Schools</p>
                      <p className="text-2xl font-bold text-blue-600">2,156</p>
                    </div>
                    <School className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Private Schools</p>
                      <p className="text-2xl font-bold text-green-600">691</p>
                    </div>
                    <Building2 className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">New This Month</p>
                      <p className="text-2xl font-bold text-purple-600">12</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg. Students</p>
                      <p className="text-2xl font-bold text-orange-600">434</p>
                    </div>
                    <Users className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5" />
                    Recent School Registrations
                  </CardTitle>
                  <CardDescription>
                    Newly registered schools in the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'Kailahun Community School', district: 'Kailahun', type: 'Public', date: '2024-10-14' },
                      { name: 'Port Loko Technical Institute', district: 'Port Loko', type: 'Technical', date: '2024-10-12' },
                      { name: 'Moyamba Girls Secondary', district: 'Moyamba', type: 'Public', date: '2024-10-10' },
                      { name: 'Bonthe Islamic School', district: 'Bonthe', type: 'Private', date: '2024-10-08' }
                    ].map((school, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div>
                          <div className="font-medium">{school.name}</div>
                          <div className="text-sm text-gray-500">{school.district} District</div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            school.type === 'Public' ? 'bg-blue-100 text-blue-800' :
                            school.type === 'Private' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {school.type}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">{school.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Schools by Province
                  </CardTitle>
                  <CardDescription>
                    Distribution across Sierra Leone provinces
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { province: 'Western Area', schools: 847, percentage: 29.8 },
                      { province: 'Northern Province', schools: 692, percentage: 24.3 },
                      { province: 'Southern Province', schools: 658, percentage: 23.1 },
                      { province: 'Eastern Province', schools: 650, percentage: 22.8 }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.province}</span>
                          <span className="text-sm text-gray-600">{item.schools} schools</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-sierra-green h-2 rounded-full transition-all duration-300"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">{item.percentage}% of total</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">National Pass Rate</p>
                      <p className="text-2xl font-bold text-green-600">78.5%</p>
                    </div>
                    <Award className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Top Performers</p>
                      <p className="text-2xl font-bold text-blue-600">12,456</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Improvement</p>
                      <p className="text-2xl font-bold text-purple-600">+3.1%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Exams Taken</p>
                      <p className="text-2xl font-bold text-orange-600">89,234</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Academic Performance Trends
                  </CardTitle>
                  <CardDescription>Performance over the last 5 years</CardDescription>
                </CardHeader>
                <CardContent>
                  <PerformanceChart />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Subject Performance
                  </CardTitle>
                  <CardDescription>Average scores by subject</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { subject: 'Mathematics', score: 82.1, color: 'bg-blue-500' },
                      { subject: 'English Language', score: 79.8, color: 'bg-green-500' },
                      { subject: 'Science', score: 76.5, color: 'bg-purple-500' },
                      { subject: 'Social Studies', score: 74.2, color: 'bg-orange-500' },
                      { subject: 'French', score: 71.8, color: 'bg-red-500' }
                    ].map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.subject}</span>
                          <span className="text-sm font-bold">{item.score}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${item.color} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${item.score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-600" />
                    Top Performing Schools
                  </CardTitle>
                  <CardDescription>Highest achieving schools this term</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { school: 'Freetown Secondary School', score: '92.4%', rank: 1 },
                      { school: 'Bo Government School', score: '89.7%', rank: 2 },
                      { school: 'Makeni Technical Institute', score: '87.2%', rank: 3 },
                      { school: 'Kenema High School', score: '85.8%', rank: 4 }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                        <div className="flex items-center space-x-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            item.rank === 1 ? 'bg-yellow-500' :
                            item.rank === 2 ? 'bg-gray-400' :
                            item.rank === 3 ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>
                            {item.rank}
                          </div>
                          <span className="font-medium text-sm">{item.school}</span>
                        </div>
                        <span className="font-bold text-yellow-600">{item.score}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-600" />
                    Grade Distribution
                  </CardTitle>
                  <CardDescription>Student grade breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { grade: 'A (90-100%)', count: 12456, percentage: 18.2, color: 'bg-green-500' },
                      { grade: 'B (80-89%)', count: 18734, percentage: 27.4, color: 'bg-blue-500' },
                      { grade: 'C (70-79%)', count: 22145, percentage: 32.4, color: 'bg-yellow-500' },
                      { grade: 'D (60-69%)', count: 10234, percentage: 15.0, color: 'bg-orange-500' },
                      { grade: 'F (Below 60%)', count: 4789, percentage: 7.0, color: 'bg-red-500' }
                    ].map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span className="font-medium">{item.grade}</span>
                          <span>{item.count} students</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${item.color} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500">{item.percentage}%</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    Regional Performance
                  </CardTitle>
                  <CardDescription>Performance by province</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { region: 'Western Area', score: 85.2, trend: '+2.1%' },
                      { region: 'Northern Province', score: 78.9, trend: '+1.8%' },
                      { region: 'Southern Province', score: 76.4, trend: '+3.2%' },
                      { region: 'Eastern Province', score: 74.1, trend: '+1.5%' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-purple-50 rounded">
                        <span className="font-medium">{item.region}</span>
                        <div className="text-right">
                          <div className="font-bold text-purple-600">{item.score}%</div>
                          <div className="text-xs text-green-500">{item.trend}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-6">
            <OrganizationManagement />
          </TabsContent>

          <TabsContent value="maps" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Schools Geographic Distribution
                </CardTitle>
                <CardDescription>
                  Interactive map showing schools across Sierra Leone
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SchoolsMap />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  )
}
