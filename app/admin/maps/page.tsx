'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { MapPin, Plus, Upload, Download, Edit, Trash2, Save, X } from 'lucide-react'

interface School {
  id: number
  name: string
  district: string
  province: string
  type: string
  latitude: number
  longitude: number
  students: number
  teachers: number
  performance: number
  status: 'active' | 'inactive'
}

const mockSchools: School[] = [
  {
    id: 1,
    name: "Freetown Secondary School",
    district: "Western Area",
    province: "Western Area",
    type: "Secondary",
    latitude: 8.4657,
    longitude: -13.2317,
    students: 1200,
    teachers: 45,
    performance: 85,
    status: 'active'
  },
  {
    id: 2,
    name: "Bo Government School",
    district: "Bo",
    province: "Southern Province",
    type: "Primary",
    latitude: 7.9644,
    longitude: -11.7383,
    students: 800,
    teachers: 32,
    performance: 78,
    status: 'active'
  },
  {
    id: 3,
    name: "Makeni Technical Institute",
    district: "Bombali",
    province: "Northern Province",
    type: "Technical",
    latitude: 8.8864,
    longitude: -12.0438,
    students: 650,
    teachers: 28,
    performance: 72,
    status: 'active'
  },
  {
    id: 4,
    name: "Kenema Community School",
    district: "Kenema",
    province: "Eastern Province",
    type: "Community",
    latitude: 7.8767,
    longitude: -11.1900,
    students: 950,
    teachers: 38,
    performance: 68,
    status: 'active'
  }
]

export default function SchoolDataManagementPage() {
  const [schools, setSchools] = useState<School[]>(mockSchools)
  const [editingSchool, setEditingSchool] = useState<School | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const [newSchool, setNewSchool] = useState({
    name: '',
    district: '',
    province: '',
    type: '',
    latitude: '',
    longitude: '',
    students: '',
    teachers: '',
    performance: ''
  })

  const handleAddSchool = () => {
    if (newSchool.name && newSchool.latitude && newSchool.longitude) {
      const school: School = {
        id: Math.max(...schools.map(s => s.id)) + 1,
        name: newSchool.name,
        district: newSchool.district,
        province: newSchool.province,
        type: newSchool.type,
        latitude: parseFloat(newSchool.latitude),
        longitude: parseFloat(newSchool.longitude),
        students: parseInt(newSchool.students) || 0,
        teachers: parseInt(newSchool.teachers) || 0,
        performance: parseInt(newSchool.performance) || 0,
        status: 'active'
      }
      setSchools([...schools, school])
      setNewSchool({
        name: '', district: '', province: '', type: '', latitude: '', longitude: '', students: '', teachers: '', performance: ''
      })
      setIsAddingNew(false)
    }
  }

  const handleDeleteSchool = (id: number) => {
    setSchools(schools.filter(s => s.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              School Data Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage school locations and information for the interactive map
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        <Tabs defaultValue="manage" className="space-y-6">
          <TabsList>
            <TabsTrigger value="manage">Manage Schools</TabsTrigger>
            <TabsTrigger value="add">Add New School</TabsTrigger>
            <TabsTrigger value="api">API Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Schools Database ({schools.length} schools)
                </CardTitle>
                <CardDescription>
                  Manage existing school locations and data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schools.map((school) => (
                    <div key={school.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{school.name}</h3>
                          <Badge variant={school.status === 'active' ? 'default' : 'secondary'}>
                            {school.status}
                          </Badge>
                          <Badge variant="outline">{school.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {school.district}, {school.province} • 
                          Lat: {school.latitude}, Lng: {school.longitude} • 
                          {school.students} students, {school.teachers} teachers
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteSchool(school.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Add New School
                </CardTitle>
                <CardDescription>
                  Manually add a new school to the database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="school-name">School Name *</Label>
                    <Input
                      id="school-name"
                      value={newSchool.name}
                      onChange={(e) => setNewSchool({...newSchool, name: e.target.value})}
                      placeholder="Enter school name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="school-type">School Type</Label>
                    <Select value={newSchool.type} onValueChange={(value) => setNewSchool({...newSchool, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Primary">Primary</SelectItem>
                        <SelectItem value="Secondary">Secondary</SelectItem>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Community">Community</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      value={newSchool.district}
                      onChange={(e) => setNewSchool({...newSchool, district: e.target.value})}
                      placeholder="Enter district"
                    />
                  </div>
                  <div>
                    <Label htmlFor="province">Province</Label>
                    <Select value={newSchool.province} onValueChange={(value) => setNewSchool({...newSchool, province: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Western Area">Western Area</SelectItem>
                        <SelectItem value="Northern Province">Northern Province</SelectItem>
                        <SelectItem value="Southern Province">Southern Province</SelectItem>
                        <SelectItem value="Eastern Province">Eastern Province</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="latitude">Latitude *</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={newSchool.latitude}
                      onChange={(e) => setNewSchool({...newSchool, latitude: e.target.value})}
                      placeholder="e.g., 8.4657"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">Longitude *</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={newSchool.longitude}
                      onChange={(e) => setNewSchool({...newSchool, longitude: e.target.value})}
                      placeholder="e.g., -13.2317"
                    />
                  </div>
                  <div>
                    <Label htmlFor="students">Number of Students</Label>
                    <Input
                      id="students"
                      type="number"
                      value={newSchool.students}
                      onChange={(e) => setNewSchool({...newSchool, students: e.target.value})}
                      placeholder="e.g., 1200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teachers">Number of Teachers</Label>
                    <Input
                      id="teachers"
                      type="number"
                      value={newSchool.teachers}
                      onChange={(e) => setNewSchool({...newSchool, teachers: e.target.value})}
                      placeholder="e.g., 45"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddSchool}>
                    <Save className="h-4 w-4 mr-2" />
                    Add School
                  </Button>
                  <Button variant="outline" onClick={() => setNewSchool({
                    name: '', district: '', province: '', type: '', latitude: '', longitude: '', students: '', teachers: '', performance: ''
                  })}>
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>API Integration</CardTitle>
                <CardDescription>
                  Connect to external APIs to import school data automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="api-endpoint">API Endpoint URL</Label>
                  <Input
                    id="api-endpoint"
                    placeholder="https://api.example.com/schools"
                  />
                </div>
                <div>
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your API key"
                  />
                </div>
                <div>
                  <Label htmlFor="mapping">Field Mapping</Label>
                  <Textarea
                    id="mapping"
                    placeholder="Configure how API fields map to our database fields..."
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button>Test Connection</Button>
                  <Button variant="outline">Import Data</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
