'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X, Award, Calendar, MapPin, BookOpen, TrendingUp, Users, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'

type StageType = 'start' | 'continuation' | 'transfer' | 'jss' | 'sss'

interface AcademicStage {
  id: string
  level: string
  grade: string
  schoolName: string
  type: StageType
  year: string
  term: string
  averageScore?: number
  subjects?: { name: string; score: number; grade: string }[]
  attendance?: number
  achievements?: string[]
  teachers?: string[]
  transferReason?: string
}

const stageColors: Record<StageType, { bg: string; border: string; text: string; label: string }> = {
  start: {
    bg: 'bg-green-500',
    border: 'border-green-500',
    text: 'text-green-600',
    label: 'Initial Start'
  },
  continuation: {
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    text: 'text-blue-600',
    label: 'Continuation'
  },
  transfer: {
    bg: 'bg-red-500',
    border: 'border-red-500',
    text: 'text-red-600',
    label: 'Transfer'
  },
  jss: {
    bg: 'bg-blue-600',
    border: 'border-blue-600',
    text: 'text-blue-700',
    label: 'JSS'
  },
  sss: {
    bg: 'bg-orange-500',
    border: 'border-orange-500',
    text: 'text-orange-600',
    label: 'SSS'
  }
}

// Mock data - replace with real student data
const mockAcademicHistory: AcademicStage[] = [
  {
    id: '1',
    level: 'Primary',
    grade: 'Primary 1',
    schoolName: 'Freetown Primary School',
    type: 'start',
    year: '2015',
    term: 'Term 1-3',
    averageScore: 85,
    subjects: [
      { name: 'Mathematics', score: 88, grade: 'A' },
      { name: 'English', score: 82, grade: 'B' },
      { name: 'Science', score: 85, grade: 'A' }
    ],
    attendance: 95,
    achievements: ['Best Student Award', 'Perfect Attendance']
  },
  {
    id: '2',
    level: 'Primary',
    grade: 'Primary 2',
    schoolName: 'Freetown Primary School',
    type: 'start',
    year: '2016',
    term: 'Term 1-3',
    averageScore: 87,
    attendance: 98
  },
  {
    id: '3',
    level: 'Primary',
    grade: 'Primary 3',
    schoolName: 'Freetown Primary School',
    type: 'start',
    year: '2017',
    term: 'Term 1-3',
    averageScore: 89,
    attendance: 96
  },
  {
    id: '4',
    level: 'Primary',
    grade: 'Primary 4',
    schoolName: 'Freetown Primary School',
    type: 'start',
    year: '2018',
    term: 'Term 1-3',
    averageScore: 90,
    attendance: 97
  },
  {
    id: '5',
    level: 'Primary',
    grade: 'Primary 5',
    schoolName: 'Freetown Primary School',
    type: 'start',
    year: '2019',
    term: 'Term 1-3',
    averageScore: 88,
    attendance: 94
  },
  {
    id: '6',
    level: 'Primary',
    grade: 'Primary 6',
    schoolName: 'Freetown Primary School',
    type: 'start',
    year: '2020',
    term: 'Term 1-3',
    averageScore: 91,
    subjects: [
      { name: 'Mathematics', score: 92, grade: 'A' },
      { name: 'English', score: 90, grade: 'A' },
      { name: 'Science', score: 91, grade: 'A' }
    ],
    attendance: 99,
    achievements: ['Valedictorian', 'Mathematics Excellence Award']
  },
  {
    id: '7',
    level: 'JSS',
    grade: 'JSS 1',
    schoolName: 'Bo Government Secondary School',
    type: 'jss',
    year: '2021',
    term: 'Term 1-3',
    averageScore: 86,
    attendance: 96
  },
  {
    id: '8',
    level: 'JSS',
    grade: 'JSS 2',
    schoolName: 'Makeni Secondary School',
    type: 'transfer',
    year: '2022',
    term: 'Term 1-3',
    averageScore: 84,
    transferReason: 'Family relocation to Makeni',
    attendance: 93
  },
  {
    id: '9',
    level: 'JSS',
    grade: 'JSS 3',
    schoolName: 'Makeni Secondary School',
    type: 'transfer',
    year: '2023',
    term: 'Term 1-3',
    averageScore: 87,
    subjects: [
      { name: 'Mathematics', score: 89, grade: 'A' },
      { name: 'English', score: 85, grade: 'A' },
      { name: 'Science', score: 88, grade: 'A' },
      { name: 'Social Studies', score: 86, grade: 'A' }
    ],
    attendance: 95,
    achievements: ['BECE Qualifier']
  },
  {
    id: '10',
    level: 'SSS',
    grade: 'SSS 1',
    schoolName: 'Kenema High School',
    type: 'sss',
    year: '2024',
    term: 'Term 1-3',
    averageScore: 88,
    attendance: 97
  },
  {
    id: '11',
    level: 'SSS',
    grade: 'SSS 2',
    schoolName: 'Kenema High School',
    type: 'sss',
    year: '2025',
    term: 'Term 1-2',
    averageScore: 89,
    attendance: 98
  },
  {
    id: '12',
    level: 'SSS',
    grade: 'SSS 3',
    schoolName: 'Freetown International School',
    type: 'transfer',
    year: '2026',
    term: 'Term 1 (Current)',
    averageScore: 90,
    transferReason: 'Scholarship opportunity',
    attendance: 100,
    achievements: ['Merit Scholarship Recipient']
  }
]

export function AcademicTimeline() {
  const [selectedStage, setSelectedStage] = useState<AcademicStage | null>(null)
  const [zoom, setZoom] = useState(1)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5))
  const handleResetZoom = () => setZoom(1)

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex items-center justify-between">
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4">
          {Object.entries(stageColors).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${value.bg}`}></div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{value.label}</span>
            </div>
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 0.5}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 2}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleResetZoom}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Timeline Tree Container */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-auto max-h-[800px] bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            <div 
              className="relative py-12 px-8 min-h-[600px]"
              style={{ 
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.3s ease'
              }}
            >
              {/* Vertical Trunk Line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gradient-to-b from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-400 transform -translate-x-1/2 rounded-full shadow-lg"></div>

              {/* Timeline Stages */}
              <div className="relative space-y-8">
                {mockAcademicHistory.map((stage, index) => {
                  const color = stageColors[stage.type]
                  const prevStage = index > 0 ? mockAcademicHistory[index - 1] : null
                  const isTransfer = stage.type === 'transfer'
                  const isNewLevel = prevStage && stage.level !== prevStage.level

                  return (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="relative"
                    >
                      {/* Branch Line */}
                      <div className="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-0">
                        <div className={`${color.bg} h-1 w-32 rounded-full shadow-md`}></div>
                      </div>

                      {/* Stage Card */}
                      <div className="relative flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.08, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedStage(stage)}
                          className={`relative z-10 ${color.border} border-4 rounded-xl p-4 min-w-[280px] shadow-xl 
                            bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-300 group`}
                        >
                          {/* Transfer Badge */}
                          {isTransfer && (
                            <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                              TRANSFER
                            </div>
                          )}

                          {/* New Level Badge */}
                          {isNewLevel && !isTransfer && (
                            <div className={`absolute -top-3 -right-3 ${color.bg} text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg`}>
                              NEW LEVEL
                            </div>
                          )}

                          <div className="space-y-2">
                            {/* Grade */}
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {stage.grade}
                              </h3>
                              <div className={`w-4 h-4 rounded-full ${color.bg}`}></div>
                            </div>

                            {/* School Name */}
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {stage.schoolName}
                            </p>

                            {/* Year and Score */}
                            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {stage.year}
                              </span>
                              {stage.averageScore && (
                                <span className={`text-sm font-bold ${color.text}`}>
                                  {stage.averageScore}%
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Hover Effect */}
                          <div className={`absolute inset-0 ${color.bg} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`}></div>
                        </motion.button>
                      </div>

                      {/* Connecting Line to Next Stage */}
                      {index < mockAcademicHistory.length - 1 && (
                        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full h-8 w-2 bg-gradient-to-b from-gray-400 to-transparent dark:from-gray-600 rounded-b-full"></div>
                      )}
                    </motion.div>
                  )
                })}
              </div>

              {/* Tree Root */}
              <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-800 rounded-full shadow-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-xs">START</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedStage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelectedStage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${stageColors[selectedStage.type].bg}`}></div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {selectedStage.grade}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedStage.year} • {selectedStage.term}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedStage(null)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 space-y-6">
                {/* School Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">School</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {selectedStage.schoolName}
                      </p>
                    </div>
                  </div>

                  {selectedStage.transferReason && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        Transfer Reason: {selectedStage.transferReason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Performance Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Average Score</p>
                      </div>
                      <p className="text-3xl font-bold text-green-600">
                        {selectedStage.averageScore}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                      </div>
                      <p className="text-3xl font-bold text-blue-600">
                        {selectedStage.attendance}%
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Subjects */}
                {selectedStage.subjects && selectedStage.subjects.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Subject Performance
                    </h3>
                    <div className="space-y-2">
                      {selectedStage.subjects.map((subject, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <span className="font-medium">{subject.name}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {subject.score}%
                            </span>
                            <span className={`px-2 py-1 rounded text-sm font-bold ${
                              subject.grade === 'A' ? 'bg-green-100 text-green-800' :
                              subject.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {subject.grade}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {selectedStage.achievements && selectedStage.achievements.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      Achievements
                    </h3>
                    <div className="space-y-2">
                      {selectedStage.achievements.map((achievement, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <Award className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium">{achievement}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
