'use client'

import { motion } from 'framer-motion'
import { StudentLayout } from '@/components/student/student-layout'
import { AcademicTimeline } from '@/components/student/academic-timeline'
import { GraduationCap } from 'lucide-react'

export default function Page() {
  return (
    <StudentLayout>
      <motion.div 
        className="space-y-6 h-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ paddingTop: 0 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-sierra-blue/10 rounded-lg">
            <GraduationCap className="h-6 w-6 text-sierra-blue" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Academic History</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your complete educational journey from inception to present
            </p>
          </div>
        </div>

        {/* Academic Timeline */}
        <AcademicTimeline />
      </motion.div>
    </StudentLayout>
  )
}
