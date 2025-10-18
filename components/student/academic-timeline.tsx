'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Award, Calendar, MapPin, BookOpen, TrendingUp, Users, ZoomIn, ZoomOut, Maximize2, Move, ExternalLink, School, Share2 } from 'lucide-react'
import Link from 'next/link'
import { ShareHistoryDialog } from './share-history-dialog'

type StageType = 'start' | 'continuation' | 'transfer' | 'jss' | 'sss'

type SchoolGrade = 'A' | 'B' | 'C' | 'D'

interface AcademicStage {
  id: string
  level: string
  grade: string
  schoolName: string
  schoolId?: string // ID to link to school details page
  schoolGrade?: SchoolGrade // A, B, C, or D grade school
  schoolLogo?: string // School badge/logo URL
  type: StageType
  year: string
  term: string
  averageScore?: number
  subjects?: { name: string; score: number; grade: string }[]
  attendance?: number
  achievements?: string[]
  teachers?: string[]
  transferReason?: string
  isCompleted: boolean // Track if stage is achieved
  isCurrent?: boolean // Track current stage
}

const schoolGradeColors: Record<SchoolGrade, { bg: string; text: string; border: string }> = {
  A: { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500' },
  B: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500' },
  C: { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500' },
  D: { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500' }
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

// Complete academic path from Nursery to College (all stages)
const completeAcademicPath: AcademicStage[] = [
  // Nursery
  { id: 'n1', level: 'Nursery', grade: 'Nursery 1', schoolName: 'TBD', type: 'start', year: 'TBD', term: '', isCompleted: false },
  { id: 'n2', level: 'Nursery', grade: 'Nursery 2', schoolName: 'TBD', type: 'start', year: 'TBD', term: '', isCompleted: false },
  // Primary
  { id: 'p1', level: 'Primary', grade: 'Primary 1', schoolName: 'TBD', type: 'start', year: 'TBD', term: '', isCompleted: false },
  { id: 'p2', level: 'Primary', grade: 'Primary 2', schoolName: 'TBD', type: 'start', year: 'TBD', term: '', isCompleted: false },
  { id: 'p3', level: 'Primary', grade: 'Primary 3', schoolName: 'TBD', type: 'start', year: 'TBD', term: '', isCompleted: false },
  { id: 'p4', level: 'Primary', grade: 'Primary 4', schoolName: 'TBD', type: 'start', year: 'TBD', term: '', isCompleted: false },
  { id: 'p5', level: 'Primary', grade: 'Primary 5', schoolName: 'TBD', type: 'start', year: 'TBD', term: '', isCompleted: false },
  { id: 'p6', level: 'Primary', grade: 'Primary 6', schoolName: 'TBD', type: 'start', year: 'TBD', term: '', isCompleted: false },
  // JSS
  { id: 'j1', level: 'JSS', grade: 'JSS 1', schoolName: 'TBD', type: 'jss', year: 'TBD', term: '', isCompleted: false },
  { id: 'j2', level: 'JSS', grade: 'JSS 2', schoolName: 'TBD', type: 'jss', year: 'TBD', term: '', isCompleted: false },
  { id: 'j3', level: 'JSS', grade: 'JSS 3', schoolName: 'TBD', type: 'jss', year: 'TBD', term: '', isCompleted: false },
  // SSS
  { id: 's1', level: 'SSS', grade: 'SSS 1', schoolName: 'TBD', type: 'sss', year: 'TBD', term: '', isCompleted: false },
  { id: 's2', level: 'SSS', grade: 'SSS 2', schoolName: 'TBD', type: 'sss', year: 'TBD', term: '', isCompleted: false },
  { id: 's3', level: 'SSS', grade: 'SSS 3', schoolName: 'TBD', type: 'sss', year: 'TBD', term: '', isCompleted: false },
  // College/University
  { id: 'c1', level: 'College', grade: 'Year 1', schoolName: 'TBD', type: 'continuation', year: 'TBD', term: '', isCompleted: false },
  { id: 'c2', level: 'College', grade: 'Year 2', schoolName: 'TBD', type: 'continuation', year: 'TBD', term: '', isCompleted: false },
  { id: 'c3', level: 'College', grade: 'Year 3', schoolName: 'TBD', type: 'continuation', year: 'TBD', term: '', isCompleted: false },
  { id: 'c4', level: 'College', grade: 'Year 4', schoolName: 'TBD', type: 'continuation', year: 'TBD', term: '', isCompleted: false },
]

// Mock data - student's actual progress (replace with real data)
const mockAcademicHistory: AcademicStage[] = [
  {
    id: '1',
    level: 'Primary',
    grade: 'Primary 1',
    schoolName: 'Freetown Primary School',
    schoolId: 'fps-001',
    schoolGrade: 'A',
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
    achievements: ['Best Student Award', 'Perfect Attendance'],
    isCompleted: true
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
    attendance: 98,
    isCompleted: true
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
    attendance: 96,
    isCompleted: true
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
    attendance: 97,
    isCompleted: true
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
    attendance: 94,
    isCompleted: true
  },
  {
    id: '6',
    level: 'Primary',
    grade: 'Primary 6',
    schoolName: 'Freetown Primary School',
    schoolId: 'fps-001',
    schoolGrade: 'A',
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
    achievements: ['Valedictorian', 'Mathematics Excellence Award'],
    isCompleted: true
  },
  {
    id: '7',
    level: 'JSS',
    grade: 'JSS 1',
    schoolName: 'Bo Government Secondary School',
    schoolId: 'bgss-002',
    schoolGrade: 'B',
    type: 'jss',
    year: '2021',
    term: 'Term 1-3',
    averageScore: 86,
    attendance: 96,
    isCompleted: true
  },
  {
    id: '8',
    level: 'JSS',
    grade: 'JSS 2',
    schoolName: 'Makeni Secondary School',
    schoolId: 'mss-003',
    schoolGrade: 'A',
    type: 'transfer',
    year: '2022',
    term: 'Term 1-3',
    averageScore: 84,
    transferReason: 'Family relocation to Makeni',
    attendance: 93,
    isCompleted: true
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
    achievements: ['BECE Qualifier'],
    isCompleted: true
  },
  {
    id: '10',
    level: 'SSS',
    grade: 'SSS 1',
    schoolName: 'Kenema High School',
    schoolId: 'khs-004',
    schoolGrade: 'B',
    type: 'sss',
    year: '2024',
    term: 'Term 1-3',
    averageScore: 88,
    attendance: 97,
    isCompleted: true
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
    attendance: 98,
    isCompleted: true
  },
  {
    id: '12',
    level: 'SSS',
    grade: 'SSS 3',
    schoolName: 'Freetown International School',
    schoolId: 'fis-005',
    schoolGrade: 'A',
    type: 'transfer',
    year: '2026',
    term: 'Term 1 (Current)',
    averageScore: 90,
    transferReason: 'Scholarship opportunity',
    attendance: 100,
    achievements: ['Merit Scholarship Recipient'],
    isCompleted: false,
    isCurrent: true
  }
]

export function AcademicTimeline() {
  const [selectedStage, setSelectedStage] = useState<AcademicStage | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [zoom, setZoom] = useState(0.8)
  const [isPanning, setIsPanning] = useState(false)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [startPan, setStartPan] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.4))
  const handleResetZoom = () => {
    setZoom(0.8)
    setPanOffset({ x: 0, y: 0 })
  }

  // Figma-style mouse wheel zoom and scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      // Check if mouse is over the container
      const rect = container.getBoundingClientRect()
      const isOverContainer = 
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom

      if (!isOverContainer) return

      // Stop event from bubbling to parent elements and prevent browser zoom
      e.stopPropagation()
      e.stopImmediatePropagation()
      e.preventDefault()
      
      if (e.ctrlKey || e.metaKey) {
        // Figma-style zoom: zoom towards cursor position
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        
        // Calculate zoom delta
        const delta = e.deltaY * -0.001
        const newZoom = Math.min(Math.max(zoom + delta, 0.4), 1.5)
        const zoomRatio = newZoom / zoom
        
        // Adjust pan to zoom towards cursor
        setPanOffset(prev => ({
          x: mouseX - (mouseX - prev.x) * zoomRatio,
          y: mouseY - (mouseY - prev.y) * zoomRatio
        }))
        
        setZoom(newZoom)
      } else {
        // Pan horizontally with normal scroll
        setPanOffset(prev => ({
          x: prev.x - e.deltaX - e.deltaY,
          y: prev.y
        }))
      }
    }

    // Add to document to catch it early
    document.addEventListener('wheel', handleWheel, { passive: false, capture: true })
    return () => document.removeEventListener('wheel', handleWheel, { capture: true } as any)
  }, [zoom])

  // Panning handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsPanning(true)
      setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  // Find the current stage index
  const currentStageIndex = mockAcademicHistory.findIndex(s => s.isCurrent)
  const lastCompletedIndex = currentStageIndex >= 0 ? currentStageIndex : mockAcademicHistory.length - 1

  // Merge complete path with actual progress
  // Mark all stages before current as completed
  const mergedHistory = completeAcademicPath.map((pathStage, index) => {
    const completedStage = mockAcademicHistory.find(
      s => s.level === pathStage.level && s.grade === pathStage.grade
    )
    
    // If we found actual data, use it
    if (completedStage) {
      return completedStage
    }
    
    // If this stage comes before the current stage, mark it as completed
    // (student must have passed through it to reach current stage)
    if (index < lastCompletedIndex) {
      return {
        ...pathStage,
        isCompleted: true,
        schoolName: 'Completed',
        year: 'Past'
      }
    }
    
    // Otherwise it's a future stage
    return pathStage
  })

  // Group stages by level for flowchart layout
  const groupedStages = mergedHistory.reduce((acc, stage) => {
    if (!acc[stage.level]) {
      acc[stage.level] = []
    }
    acc[stage.level].push(stage)
    return acc
  }, {} as Record<string, AcademicStage[]>)

  const levels = Object.keys(groupedStages)

  return (
    <div className="space-y-6">
      {/* Share Button */}
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-4">
          {Object.entries(stageColors).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${value.bg}`}></div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{value.label}</span>
            </div>
          ))}
        </div>
        <Button 
          onClick={() => setShareDialogOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share History
        </Button>
      </div>

      {/* Flowchart Container */}
      <Card className="overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black relative">
        <CardContent className="p-0">
          {/* Floating Zoom Controls */}
          <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 bg-black/80 backdrop-blur-sm rounded-lg p-2 shadow-xl border border-gray-700">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleZoomIn} 
              disabled={zoom >= 1.5}
              className="h-8 w-8 p-0 text-white hover:bg-gray-700"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <div className="text-xs font-bold text-center text-white px-1">
              {Math.round(zoom * 100)}%
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleZoomOut} 
              disabled={zoom <= 0.4}
              className="h-8 w-8 p-0 text-white hover:bg-gray-700"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="border-t border-gray-700 my-1"></div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleResetZoom}
              className="h-8 w-8 p-0 text-white hover:bg-gray-700"
              title="Reset View"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Pan Hint */}
          <div className="absolute bottom-4 left-4 z-30 bg-black/80 backdrop-blur-sm rounded-lg px-3 py-2 shadow-xl border border-gray-700">
            <div className="flex items-center gap-2 text-xs text-gray-300">
              <Move className="h-3 w-3" />
              <span>Drag to pan • Scroll to move • Ctrl+Scroll to zoom</span>
            </div>
          </div>

          <div 
            ref={containerRef}
            className="overflow-hidden relative isolate"
            style={{ 
              cursor: isPanning ? 'grabbing' : 'grab',
              height: '600px',
              contain: 'layout style paint'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <div 
              className="relative p-8 min-h-[600px]"
              style={{ 
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`,
                transformOrigin: 'top left',
                transition: isPanning ? 'none' : 'transform 0.3s ease',
                minWidth: 'max-content'
              }}
            >
              {/* Flowchart Levels */}
              <div className="flex gap-16 items-start">
                {levels.map((level, levelIndex) => {
                  const stages = groupedStages[level]
                  const levelColor = stageColors[stages[0].type]
                  const hasCurrentStage = stages.some(s => s.isCurrent)
                  
                  return (
                    <div key={level} className="relative">
                      {/* Level Container with distinct blinking for current level */}
                      <div className={`${levelColor.border} border-2 rounded-2xl p-6 bg-black/40 backdrop-blur-sm min-w-[280px] ${
                        hasCurrentStage ? 'animate-[pulse_2s_ease-in-out_infinite] shadow-2xl shadow-cyan-500/50' : ''
                      }`}>
                        {/* Level Header */}
                        <div className="mb-6 pb-3 border-b border-gray-800">
                          <h3 className={`text-lg font-bold flex items-center gap-2 ${
                            hasCurrentStage ? 'text-cyan-400' : 'text-white'
                          }`}>
                            <div className={`w-3 h-3 rounded-full ${hasCurrentStage ? 'bg-cyan-400 animate-ping' : levelColor.bg}`}></div>
                            {level}
                            {hasCurrentStage && (
                              <Badge className="ml-2 bg-cyan-500 text-white text-[10px] animate-pulse">
                                ACTIVE
                              </Badge>
                            )}
                          </h3>
                        </div>

                        {/* Stages in this level */}
                        <div className="space-y-4">
                          {stages.map((stage, stageIndex) => {
                            const color = stageColors[stage.type]
                            const isTransfer = stage.type === 'transfer'
                            const isInactive = !stage.isCompleted && !stage.isCurrent
                            const isCurrent = stage.isCurrent

                            return (
                              <motion.div
                                key={stage.id}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ 
                                  opacity: 1, 
                                  scale: isInactive ? 0.85 : 1,
                                  height: isInactive ? 'auto' : 'auto'
                                }}
                                transition={{ duration: 0.5, delay: (levelIndex * 0.2) + (stageIndex * 0.1) }}
                              >
                                <motion.button
                                  whileHover={{ scale: isInactive ? 0.85 : 1.05, y: isInactive ? 0 : -2 }}
                                  whileTap={{ scale: isInactive ? 0.85 : 0.98 }}
                                  onClick={() => !isInactive && setSelectedStage(stage)}
                                  disabled={isInactive}
                                  className={`relative w-full border-2 rounded-lg transition-all duration-500 group text-left
                                    ${isInactive 
                                      ? 'border-gray-700 bg-gradient-to-br from-gray-900 to-black opacity-30 cursor-not-allowed p-3' 
                                      : isCurrent
                                        ? `${color.border} bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-2xl animate-pulse p-4`
                                        : `${color.border} bg-gradient-to-br from-gray-800 to-gray-900 hover:shadow-2xl p-4`
                                    }`}
                                >
                                  {/* Transfer Badge */}
                                  {isTransfer && !isInactive && (
                                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10">
                                      TRANSFER
                                    </div>
                                  )}

                                  {/* Current Badge */}
                                  {isCurrent && (
                                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg z-10 animate-pulse">
                                      CURRENT
                                    </div>
                                  )}

                                  {isInactive ? (
                                    // Minimal view for inactive stages
                                    <div className="flex items-center justify-center py-1">
                                      <div className="text-center">
                                        <h4 className="font-bold text-xs text-gray-600">
                                          {stage.grade}
                                        </h4>
                                        <div className="w-2 h-2 rounded-full bg-gray-700 mx-auto mt-1"></div>
                                      </div>
                                    </div>
                                  ) : (
                                    // Full view for completed/current stages
                                    <motion.div 
                                      className="space-y-2"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      {/* Grade */}
                                      <div className="flex items-center justify-between">
                                        <h4 className="font-bold text-sm text-white">
                                          {stage.grade}
                                        </h4>
                                        <div className={`w-2 h-2 rounded-full ${color.bg}`}></div>
                                      </div>

                                      {/* School Name with Link and Grade Badge */}
                                      <div className="flex items-center gap-2">
                                        {stage.schoolId ? (
                                          <Link 
                                            href={`/schools/${stage.schoolId}`}
                                            className="flex items-center gap-1 text-xs text-gray-300 hover:text-cyan-400 transition-colors group flex-1 truncate"
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <School className="h-3 w-3 flex-shrink-0" />
                                            <span className="truncate">{stage.schoolName}</span>
                                            <ExternalLink className="h-2.5 w-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                                          </Link>
                                        ) : (
                                          <div className="flex items-center gap-1 text-xs text-gray-300 flex-1 truncate">
                                            <School className="h-3 w-3 flex-shrink-0" />
                                            <span className="truncate">{stage.schoolName}</span>
                                          </div>
                                        )}
                                        {stage.schoolGrade && (
                                          <Badge 
                                            className={`${schoolGradeColors[stage.schoolGrade].bg} text-white text-[9px] px-1.5 py-0 h-4 flex-shrink-0`}
                                          >
                                            Grade {stage.schoolGrade}
                                          </Badge>
                                        )}
                                      </div>

                                      {/* Year and Score */}
                                      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                                        <span className="text-[10px] text-gray-400">
                                          {stage.year}
                                        </span>
                                        {stage.averageScore && (
                                          <span className={`text-xs font-bold ${color.text}`}>
                                            {stage.averageScore}%
                                          </span>
                                        )}
                                      </div>
                                    </motion.div>
                                  )}

                                  {/* Hover Glow */}
                                  {!isInactive && (
                                    <div className={`absolute inset-0 ${color.bg} opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300`}></div>
                                  )}
                                </motion.button>

                                {/* Connector to next stage in same level */}
                                {stageIndex < stages.length - 1 && (
                                  <div className="flex justify-center my-2">
                                    <div className={`w-0.5 h-6 ${color.bg} rounded-full shadow-md`}></div>
                                  </div>
                                )}

                                {/* Transfer connector to next level */}
                                {stageIndex === stages.length - 1 && levelIndex < levels.length - 1 && (
                                  <div className="absolute -right-12 top-1/2 transform -translate-y-1/2 z-10">
                                    <svg width="48" height="48" viewBox="0 0 48 48" className={stage.type === 'transfer' ? 'text-red-500' : 'text-gray-500'}>
                                      <defs>
                                        <marker
                                          id={`arrowhead-${stage.id}`}
                                          markerWidth="10"
                                          markerHeight="10"
                                          refX="9"
                                          refY="3"
                                          orient="auto"
                                        >
                                          <polygon points="0 0, 10 3, 0 6" fill="currentColor" />
                                        </marker>
                                      </defs>
                                      <path
                                        d="M 8 24 L 40 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        fill="none"
                                        strokeDasharray={stage.type === 'transfer' ? '4 4' : 'none'}
                                        markerEnd={`url(#arrowhead-${stage.id})`}
                                      />
                                    </svg>
                                  </div>
                                )}
                              </motion.div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Arrow to next level */}
                      {levelIndex < levels.length - 1 && (
                        <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 z-20">
                          <svg width="32" height="32" viewBox="0 0 32 32" className="text-gray-500">
                            <path
                              d="M4 16 L24 16 M24 16 L18 10 M24 16 L18 22"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Start Node */}
              <div className="absolute -left-20 top-1/2 transform -translate-y-1/2">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-full shadow-2xl flex items-center justify-center border-4 border-green-400">
                  <span className="text-white font-bold text-[10px]">START</span>
                </div>
                <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <svg width="24" height="24" viewBox="0 0 24 24" className="text-green-500">
                    <path
                      d="M4 12 L18 12 M18 12 L13 7 M18 12 L13 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
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
                    <School className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">School</p>
                      <div className="flex items-center gap-2">
                        {selectedStage.schoolId ? (
                          <Link 
                            href={`/schools/${selectedStage.schoolId}`}
                            className="font-semibold text-gray-900 dark:text-white hover:text-cyan-500 transition-colors flex items-center gap-1"
                          >
                            {selectedStage.schoolName}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Link>
                        ) : (
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {selectedStage.schoolName}
                          </p>
                        )}
                        {selectedStage.schoolGrade && (
                          <Badge className={`${schoolGradeColors[selectedStage.schoolGrade].bg} text-white text-xs`}>
                            Grade {selectedStage.schoolGrade} School
                          </Badge>
                        )}
                      </div>
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

      {/* Share History Dialog */}
      <ShareHistoryDialog 
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        academicHistory={mockAcademicHistory}
      />
    </div>
  )
}
