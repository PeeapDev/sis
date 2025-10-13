'use client'

import { DashboardLayout } from '@/components/dashboard-layout'
import { SchoolsMap } from '@/components/admin/schools-map'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

export default function GISPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Schools Geographic Information System (GIS)
            </CardTitle>
            <CardDescription>
              An interactive map of all educational institutions across Sierra Leone. Hover over a school to see its name and click for more details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[70vh]">
              <SchoolsMap />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
