'use client'

import { PublicLayout } from '@/components/public-layout'
import { SierraLeoneMap } from '@/components/admin/sierra-leone-map'
import { SearchBar } from '@/components/search-bar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, School, TrendingUp, Award } from 'lucide-react'

export default function ExplorePage() {
  return (
    <PublicLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Explore Sierra Leone's Education Data</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Search, filter, and visualize school and student information from across the country.</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <SearchBar placeholder="Search for schools, districts, or students..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">+12% from last year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234,567</div>
              <p className="text-xs text-muted-foreground">+8.5% from last year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">National Pass Rate</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.5%</div>
              <p className="text-xs text-muted-foreground">+3.1% from last year</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Teachers</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,678</div>
              <p className="text-xs text-muted-foreground">+5.2% from last year</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Schools Distribution Map</CardTitle>
          </CardHeader>
          <CardContent>
            <SierraLeoneMap mapId="explore-map" height="h-96" />
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  )
}
