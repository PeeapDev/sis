'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCard {
  title: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  icon: React.ComponentType<any>
  color: string
}

interface ResearchStatsCardsProps {
  stats: StatCard[]
}

export function ResearchStatsCards({ stats }: ResearchStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="flex items-center text-sm">
                {stat.trend === 'up' && (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                )}
                {stat.trend === 'down' && (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                {stat.trend === 'neutral' && (
                  <Minus className="h-4 w-4 text-gray-500 mr-1" />
                )}
                <span className={`
                  ${stat.trend === 'up' ? 'text-green-600' : ''}
                  ${stat.trend === 'down' ? 'text-red-600' : ''}
                  ${stat.trend === 'neutral' ? 'text-gray-600' : ''}
                `}>
                  {stat.change}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
