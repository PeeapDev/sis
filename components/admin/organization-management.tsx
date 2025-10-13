'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Building2, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Users,
  Database,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Mock organization data
const organizations = [
  {
    id: 1,
    name: 'Sierra Leone Education Research Institute',
    type: 'Research Organization',
    email: 'research@sis.gov.sl',
    contactPerson: 'Dr. Aminata Kargbo',
    phone: '+232 76 123 456',
    established: '2020-01-15',
    status: 'Active',
    accessLevel: 'National Data Access',
    projects: 12,
    lastLogin: '2024-10-15',
    description: 'Leading research institute focusing on educational policy and outcomes analysis.'
  },
  {
    id: 2,
    name: 'UNICEF Sierra Leone',
    type: 'International Organization',
    email: 'unicef@sis.gov.sl',
    contactPerson: 'Ms. Sarah Johnson',
    phone: '+232 77 234 567',
    established: '2019-06-20',
    status: 'Active',
    accessLevel: 'Regional Data Access',
    projects: 8,
    lastLogin: '2024-10-12',
    description: 'UNICEF country office supporting education initiatives and child welfare programs.'
  },
  {
    id: 3,
    name: 'World Bank Education Team',
    type: 'Development Partner',
    email: 'worldbank@sis.gov.sl',
    contactPerson: 'Mr. David Chen',
    phone: '+232 78 345 678',
    established: '2021-03-10',
    status: 'Pending',
    accessLevel: 'Limited Access',
    projects: 3,
    lastLogin: 'Never',
    description: 'World Bank team working on education sector development and financing.'
  }
]

export function OrganizationManagement() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newOrganization, setNewOrganization] = useState({
    name: '',
    type: '',
    email: '',
    contactPerson: '',
    phone: '',
    description: '',
    accessLevel: ''
  })
  const { toast } = useToast()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-4 w-4" />
      case 'Pending':
        return <Clock className="h-4 w-4" />
      case 'Suspended':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleCreateOrganization = () => {
    if (!newOrganization.name || !newOrganization.email || !newOrganization.type) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      })
      return
    }

    // In a real app, this would make an API call
    toast({
      title: 'Organization Created',
      description: `${newOrganization.name} has been created successfully.`,
    })

    setShowCreateForm(false)
    setNewOrganization({
      name: '',
      type: '',
      email: '',
      contactPerson: '',
      phone: '',
      description: '',
      accessLevel: ''
    })
  }

  const handleApproveOrganization = (orgId: number, orgName: string) => {
    toast({
      title: 'Organization Approved',
      description: `${orgName} has been approved and granted access.`,
    })
  }

  const filteredOrganizations = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         org.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || org.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            Organization Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage research organizations and their data access permissions
          </p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Organization Account
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Organizations</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">2</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold text-yellow-600">1</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-blue-600">23</p>
              </div>
              <Database className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Organizations List */}
      <div className="space-y-4">
        {filteredOrganizations.map((org, index) => (
          <motion.div
            key={org.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{org.name}</h3>
                      <Badge className={getStatusColor(org.status)}>
                        {getStatusIcon(org.status)}
                        <span className="ml-1">{org.status}</span>
                      </Badge>
                      <Badge variant="outline">{org.type}</Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{org.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Contact Person:</span>
                        <div className="font-medium">{org.contactPerson}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <div className="font-medium">{org.email}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Access Level:</span>
                        <div className="font-medium">{org.accessLevel}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Active Projects:</span>
                        <div className="font-medium">{org.projects}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Established: {org.established}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>Last Login: {org.lastLogin}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    {org.status === 'Pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleApproveOrganization(org.id, org.name)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Create Organization Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Create Organization Account</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowCreateForm(false)}>
                  <XCircle className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Organization Name *</Label>
                    <Input
                      id="name"
                      value={newOrganization.name}
                      onChange={(e) => setNewOrganization({...newOrganization, name: e.target.value})}
                      placeholder="Enter organization name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Organization Type *</Label>
                    <Select value={newOrganization.type} onValueChange={(value) => setNewOrganization({...newOrganization, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Research Organization">Research Organization</SelectItem>
                        <SelectItem value="International Organization">International Organization</SelectItem>
                        <SelectItem value="Development Partner">Development Partner</SelectItem>
                        <SelectItem value="NGO">NGO</SelectItem>
                        <SelectItem value="Academic Institution">Academic Institution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newOrganization.email}
                      onChange={(e) => setNewOrganization({...newOrganization, email: e.target.value})}
                      placeholder="organization@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={newOrganization.phone}
                      onChange={(e) => setNewOrganization({...newOrganization, phone: e.target.value})}
                      placeholder="+232 XX XXX XXX"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    value={newOrganization.contactPerson}
                    onChange={(e) => setNewOrganization({...newOrganization, contactPerson: e.target.value})}
                    placeholder="Primary contact person name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="accessLevel">Data Access Level</Label>
                  <Select value={newOrganization.accessLevel} onValueChange={(value) => setNewOrganization({...newOrganization, accessLevel: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select access level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="National Data Access">National Data Access</SelectItem>
                      <SelectItem value="Regional Data Access">Regional Data Access</SelectItem>
                      <SelectItem value="Limited Access">Limited Access</SelectItem>
                      <SelectItem value="Read Only Access">Read Only Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newOrganization.description}
                    onChange={(e) => setNewOrganization({...newOrganization, description: e.target.value})}
                    placeholder="Brief description of the organization and its research focus"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateOrganization} className="bg-purple-600 hover:bg-purple-700">
                  Create Organization
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
