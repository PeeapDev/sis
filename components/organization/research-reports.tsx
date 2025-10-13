'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Eye, Calendar, User } from 'lucide-react'

const reports = [
  {
    title: 'Sierra Leone Education Sector Analysis 2024',
    description: 'Comprehensive analysis of educational outcomes and infrastructure development across all provinces.',
    author: 'Dr. Aminata Kargbo',
    date: '2024-10-15',
    status: 'Published',
    category: 'Annual Report',
    downloads: 1247,
    pages: 156
  },
  {
    title: 'Gender Parity in STEM Education',
    description: 'Research on gender representation in Science, Technology, Engineering, and Mathematics education.',
    author: 'Prof. Mohamed Sesay',
    date: '2024-09-28',
    status: 'Published',
    category: 'Research Study',
    downloads: 892,
    pages: 89
  },
  {
    title: 'Post-COVID Learning Recovery Assessment',
    description: 'Impact assessment of COVID-19 on learning outcomes and recovery strategies implementation.',
    author: 'Dr. Fatima Conteh',
    date: '2024-10-01',
    status: 'Published',
    category: 'Impact Study',
    downloads: 1156,
    pages: 124
  },
  {
    title: 'Rural Education Access Initiative',
    description: 'Evaluation of rural education access programs and their effectiveness in remote areas.',
    author: 'Dr. Ibrahim Kamara',
    date: '2024-08-20',
    status: 'Published',
    category: 'Policy Brief',
    downloads: 734,
    pages: 67
  },
  {
    title: 'Teacher Training Program Effectiveness',
    description: 'Assessment of teacher training programs and their impact on educational quality.',
    author: 'Prof. Mariama Koroma',
    date: '2024-11-05',
    status: 'Draft',
    category: 'Research Study',
    downloads: 0,
    pages: 98
  },
  {
    title: 'Digital Learning Infrastructure Report',
    description: 'Analysis of digital learning infrastructure and technology adoption in schools.',
    author: 'Dr. Abdul Rahman',
    date: '2024-11-12',
    status: 'In Review',
    category: 'Technical Report',
    downloads: 0,
    pages: 112
  }
]

export function ResearchReports() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'bg-green-100 text-green-800'
      case 'Draft':
        return 'bg-yellow-100 text-yellow-800'
      case 'In Review':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Annual Report':
        return 'bg-purple-100 text-purple-800'
      case 'Research Study':
        return 'bg-blue-100 text-blue-800'
      case 'Impact Study':
        return 'bg-orange-100 text-orange-800'
      case 'Policy Brief':
        return 'bg-green-100 text-green-800'
      case 'Technical Report':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Research Reports Library</span>
          </CardTitle>
          <CardDescription>
            Access published research reports and ongoing studies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {report.title}
                      </h3>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <Badge variant="outline" className={getCategoryColor(report.category)}>
                        {report.category}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {report.description}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{report.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{report.date}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{report.pages} pages</span>
                      </div>
                      {report.downloads > 0 && (
                        <div className="flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>{report.downloads} downloads</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    {report.status === 'Published' && (
                      <Button size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">45</div>
              <p className="text-sm text-gray-600">Total Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">38</div>
              <p className="text-sm text-gray-600">Published</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">5</div>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">12.4K</div>
              <p className="text-sm text-gray-600">Total Downloads</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
