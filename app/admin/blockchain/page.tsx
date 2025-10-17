"use client"
import { motion } from 'framer-motion'
import { BlockchainRecordsList } from '@/components/blockchain/records-list'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Shield } from 'lucide-react'

export default function Page() {
  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6 h-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ paddingTop: 0 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-sierra-green/10 rounded-lg">
            <Shield className="h-6 w-6 text-sierra-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blockchain Records</h1>
            <p className="text-gray-600 dark:text-gray-400">Search and view blockchain records across the system.</p>
          </div>
        </div>

        {/* Records List */}
        <BlockchainRecordsList />
      </motion.div>
    </DashboardLayout>
  )
}
