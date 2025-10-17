'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  GraduationCap, 
  Award, 
  Calendar,
  BookOpen,
  TrendingUp,
  School,
  MapPin,
  Download,
  Eye
} from 'lucide-react'
import { StudentLayout } from '@/components/student/student-layout'
import { ResultsChart } from '@/components/student/results-chart'
import { SchoolHistory } from '@/components/student/school-history'
import { SubjectPerformance } from '@/components/student/subject-performance'

// Mock student data
const studentData = {
  id: 'SL2024001',
  name: 'Aminata Conteh',
  currentSchool: 'Freetown Secondary School',
  class: 'Form 5',
  district: 'Western Area',
  enrollmentDate: '2020-09-01',
  avatar: null,
  gpa: 3.2,
  rank: 15,
  totalStudents: 120
}

const recentResults = [
  { subject: 'Mathematics', score: 85, grade: 'A', term: 'Term 2', year: 2024 },
  { subject: 'English Language', score: 78, grade: 'B+', term: 'Term 2', year: 2024 },
  { subject: 'Physics', score: 82, grade: 'A-', term: 'Term 2', year: 2024 },
  { subject: 'Chemistry', score: 76, grade: 'B+', term: 'Term 2', year: 2024 },
  { subject: 'Biology', score: 88, grade: 'A', term: 'Term 2', year: 2024 },
]

const schoolHistory = [
  {
    school: 'Freetown Secondary School',
    period: '2020 - Present',
    level: 'Secondary',
    status: 'Current',
    district: 'Western Area'
  },
  {
    school: 'Model Primary School',
    period: '2014 - 2020',
    level: 'Primary',
    status: 'Completed',
    district: 'Western Area'
  }
]

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  return (
    <StudentLayout>
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
              Student Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {studentData.name}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Transcript
            </Button>
            <Button size="sm" className="bg-sierra-green hover:bg-sierra-green/90">
              <Eye className="h-4 w-4 mr-2" />
              View Certificate
            </Button>
          </div>
        </div>

        {/* Student Profile Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-sierra-green rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {studentData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {studentData.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Student ID: {studentData.id}
                </p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <School className="h-3 w-3" />
                    {studentData.currentSchool}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {studentData.class}
                  </Badge>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {studentData.district}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-sierra-green">
                  {studentData.gpa}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  GPA
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Rank: {studentData.rank}/{studentData.totalStudents}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="results" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="results">Academic Results</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="history">School History</TabsTrigger>
            <TabsTrigger value="blockchain">Certificates</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Recent Results
                  </CardTitle>
                  <CardDescription>
                    Your latest academic performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentResults.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {result.subject}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {result.term} {result.year}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-sierra-green">
                            {result.score}%
                          </div>
                          <Badge variant="secondary">{result.grade}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Chart */}
              <ResultsChart />
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <SubjectPerformance />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <SchoolHistory schools={schoolHistory} />
          </TabsContent>

          <TabsContent value="blockchain" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Blockchain Certificates
                </CardTitle>
                <CardDescription>
                  Your verified educational certificates stored on the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      Blockchain Integration Coming Soon
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Your certificates will be permanently stored on the blockchain for verification
                    </p>
                    <Button variant="outline" disabled>
                      View Blockchain Records
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </StudentLayout>
  )
}
