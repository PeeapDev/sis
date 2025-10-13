'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { BookOpen, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const subjectData = [
  {
    subject: 'Mathematics',
    currentScore: 85,
    previousScore: 82,
    average: 78,
    grade: 'A',
    trend: 'up',
    assignments: 12,
    completed: 11
  },
  {
    subject: 'English Language',
    currentScore: 78,
    previousScore: 76,
    average: 75,
    grade: 'B+',
    trend: 'up',
    assignments: 10,
    completed: 10
  },
  {
    subject: 'Physics',
    currentScore: 82,
    previousScore: 80,
    average: 73,
    grade: 'A-',
    trend: 'up',
    assignments: 8,
    completed: 7
  },
  {
    subject: 'Chemistry',
    currentScore: 76,
    previousScore: 75,
    average: 71,
    grade: 'B+',
    trend: 'up',
    assignments: 9,
    completed: 8
  },
  {
    subject: 'Biology',
    currentScore: 88,
    previousScore: 87,
    average: 82,
    grade: 'A',
    trend: 'up',
    assignments: 11,
    completed: 11
  },
  {
    subject: 'History',
    currentScore: 74,
    previousScore: 76,
    average: 70,
    grade: 'B',
    trend: 'down',
    assignments: 7,
    completed: 6
  }
]

export function SubjectPerformance() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800 border-green-200'
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800 border-blue-200'
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Subject Performance Analysis
          </CardTitle>
          <CardDescription>
            Detailed breakdown of your performance across all subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {subjectData.map((subject, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {subject.subject}
                    </h3>
                    <Badge className={getGradeColor(subject.grade)}>
                      {subject.grade}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(subject.trend)}
                    <span className="text-2xl font-bold text-sierra-green">
                      {subject.currentScore}%
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Performance Progress */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Current Score</span>
                      <span className="font-medium">{subject.currentScore}%</span>
                    </div>
                    <Progress value={subject.currentScore} className="h-2" />
                  </div>

                  {/* Comparison with Average */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Class Average</span>
                      <span className="font-medium">{subject.average}%</span>
                    </div>
                    <Progress value={subject.average} className="h-2 opacity-60" />
                  </div>

                  {/* Assignment Completion */}
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Assignments</span>
                      <span className="font-medium">{subject.completed}/{subject.assignments}</span>
                    </div>
                    <Progress 
                      value={(subject.completed / subject.assignments) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Previous: {subject.previousScore}% 
                    <span className={`ml-2 ${
                      subject.currentScore > subject.previousScore 
                        ? 'text-green-600' 
                        : subject.currentScore < subject.previousScore 
                        ? 'text-red-600' 
                        : 'text-gray-600'
                    }`}>
                      ({subject.currentScore > subject.previousScore ? '+' : ''}
                      {subject.currentScore - subject.previousScore})
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Above average by {subject.currentScore - subject.average}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-sierra-green">
                {Math.round(subjectData.reduce((sum, s) => sum + s.currentScore, 0) / subjectData.length)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Overall Average</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sierra-blue">
                {subjectData.filter(s => s.grade.startsWith('A')).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">A Grades</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sierra-gold">
                {subjectData.filter(s => s.trend === 'up').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Improving</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round(subjectData.reduce((sum, s) => sum + (s.completed / s.assignments), 0) / subjectData.length * 100)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
