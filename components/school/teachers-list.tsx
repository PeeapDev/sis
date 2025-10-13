'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { GraduationCap, Mail, Phone, BookOpen, Users, Plus } from 'lucide-react'

const teachers = [
  {
    id: 'T001',
    name: 'Dr. Fatima Sesay',
    email: 'f.sesay@fss.edu.sl',
    phone: '+232 76 123 456',
    subjects: ['Mathematics', 'Physics'],
    classes: ['Form 5A', 'Form 6A'],
    students: 85,
    experience: '15 years',
    qualification: 'PhD Mathematics',
    status: 'Active'
  },
  {
    id: 'T002',
    name: 'Mr. Abdul Rahman',
    email: 'a.rahman@fss.edu.sl',
    phone: '+232 77 234 567',
    subjects: ['English Language', 'Literature'],
    classes: ['Form 3B', 'Form 4A'],
    students: 78,
    experience: '8 years',
    qualification: 'MA English Literature',
    status: 'Active'
  },
  {
    id: 'T003',
    name: 'Mrs. Mariama Koroma',
    email: 'm.koroma@fss.edu.sl',
    phone: '+232 78 345 678',
    subjects: ['Chemistry', 'Biology'],
    classes: ['Form 4B', 'Form 5B'],
    students: 92,
    experience: '12 years',
    qualification: 'MSc Chemistry',
    status: 'Active'
  },
  {
    id: 'T004',
    name: 'Mr. Joseph Kamara',
    email: 'j.kamara@fss.edu.sl',
    phone: '+232 79 456 789',
    subjects: ['History', 'Geography'],
    classes: ['Form 2A', 'Form 3A'],
    students: 65,
    experience: '6 years',
    qualification: 'BA History',
    status: 'Active'
  },
  {
    id: 'T005',
    name: 'Ms. Adama Bangura',
    email: 'a.bangura@fss.edu.sl',
    phone: '+232 76 567 890',
    subjects: ['French', 'Art'],
    classes: ['Form 1A', 'Form 2B'],
    students: 58,
    experience: '4 years',
    qualification: 'BA French Studies',
    status: 'On Leave'
  }
]

export function TeachersList() {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'on leave': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Teaching Staff
            </CardTitle>
            <CardDescription>
              Manage teachers, subjects, and class assignments
            </CardDescription>
          </div>
          <Button size="sm" className="bg-sierra-green hover:bg-sierra-green/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-sierra-blue text-white">
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {teacher.name}
                      </h3>
                      <Badge className={getStatusColor(teacher.status)}>
                        {teacher.status}
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Mail className="h-4 w-4 mr-2" />
                          {teacher.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <Phone className="h-4 w-4 mr-2" />
                          {teacher.phone}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm">
                          <span className="font-medium text-gray-900 dark:text-white">Qualification:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">{teacher.qualification}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium text-gray-900 dark:text-white">Experience:</span>
                          <span className="ml-2 text-gray-600 dark:text-gray-400">{teacher.experience}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4 text-sierra-green" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Subjects</div>
                          <div className="flex space-x-1">
                            {teacher.subjects.map((subject, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {subject}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-sierra-blue" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">Classes</div>
                          <div className="flex space-x-1">
                            {teacher.classes.map((cls, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {cls}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Teaching {teacher.students} students across {teacher.classes.length} classes
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-center">
          <Button variant="outline">
            Load More Teachers
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
