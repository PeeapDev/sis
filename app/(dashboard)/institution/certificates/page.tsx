'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Filter, Download, Eye, XCircle, CheckCircle, Clock, AlertCircle, QrCode } from 'lucide-react'

interface Certificate {
  id: string
  certificateNo: string
  verificationCode: string
  studentName: string
  studentId?: string
  programName: string
  programType: string
  classOfDegree?: string
  cgpa?: number
  graduationDate: string
  status: string
  blockchainStatus: string
  transactionHash?: string
  createdAt: string
  institution: {
    name: string
    code: string
  }
}

export default function InstitutionCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)

  // Form state for issuing new certificate
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    programName: '',
    programType: 'BACHELORS',
    classOfDegree: '',
    cgpa: '',
    graduationDate: '',
    dateOfBirth: '',
    nationalId: ''
  })
  const [issuing, setIssuing] = useState(false)

  useEffect(() => {
    fetchCertificates()
  }, [searchTerm, statusFilter])

  const fetchCertificates = async () => {
    try {
      // In real app, get institutionId from session
      const params = new URLSearchParams({
        institutionId: 'demo-institution',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter })
      })
      
      const response = await fetch(`/api/certificates?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCertificates(data.certificates || [])
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIssuing(true)

    try {
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institutionId: 'demo-institution', // In real app, get from session
          ...formData,
          cgpa: formData.cgpa ? parseFloat(formData.cgpa) : undefined
        })
      })

      if (response.ok) {
        setShowIssueModal(false)
        setFormData({
          studentName: '',
          studentId: '',
          programName: '',
          programType: 'BACHELORS',
          classOfDegree: '',
          cgpa: '',
          graduationDate: '',
          dateOfBirth: '',
          nationalId: ''
        })
        fetchCertificates()
        alert('Certificate issued successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to issue certificate')
      }
    } catch (error) {
      alert('Failed to issue certificate')
    } finally {
      setIssuing(false)
    }
  }

  const handleRevoke = async (certId: string) => {
    const reason = prompt('Enter reason for revocation:')
    if (!reason) return

    try {
      const response = await fetch(`/api/certificates/${certId}/revoke`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })

      if (response.ok) {
        fetchCertificates()
        alert('Certificate revoked successfully')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to revoke certificate')
      }
    } catch (error) {
      alert('Failed to revoke certificate')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Active</span>
      case 'REVOKED':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1"><XCircle className="w-3 h-3" /> Revoked</span>
      case 'SUSPENDED':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Suspended</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>
    }
  }

  const getBlockchainBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">On-Chain ✓</span>
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>
      case 'FAILED':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Failed</span>
      default:
        return null
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificate Management</h1>
          <p className="text-gray-500">Issue and manage academic certificates</p>
        </div>
        <button
          onClick={() => setShowIssueModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Issue Certificate
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, certificate no, or verification code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="REVOKED">Revoked</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Certificates Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blockchain</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading certificates...
                </td>
              </tr>
            ) : certificates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No certificates found. Click "Issue Certificate" to create one.
                </td>
              </tr>
            ) : (
              certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-mono text-sm font-medium text-gray-900">{cert.certificateNo}</p>
                      <p className="text-xs text-gray-500">Code: {cert.verificationCode}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{cert.studentName}</p>
                    {cert.studentId && <p className="text-xs text-gray-500">ID: {cert.studentId}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{cert.programName}</p>
                    <p className="text-xs text-gray-500">{cert.programType.replace('_', ' ')}</p>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(cert.status)}</td>
                  <td className="px-6 py-4">{getBlockchainBadge(cert.blockchainStatus)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.open(`/verify/${cert.verificationCode}`, '_blank')}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="View QR Code"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      {cert.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleRevoke(cert.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Revoke"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Issue Certificate Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Issue New Certificate</h2>
              <p className="text-gray-500">Fill in the details to issue a new academic certificate</p>
            </div>
            
            <form onSubmit={handleIssueCertificate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Full name as on certificate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="University student ID"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program Name *</label>
                <input
                  type="text"
                  required
                  value={formData.programName}
                  onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bachelor of Science in Computer Science"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program Type *</label>
                  <select
                    required
                    value={formData.programType}
                    onChange={(e) => setFormData({ ...formData, programType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CERTIFICATE">Certificate</option>
                    <option value="DIPLOMA">Diploma</option>
                    <option value="ASSOCIATE_DEGREE">Associate Degree</option>
                    <option value="BACHELORS">Bachelor&apos;s Degree</option>
                    <option value="MASTERS">Master&apos;s Degree</option>
                    <option value="DOCTORATE">Doctorate</option>
                    <option value="PROFESSIONAL">Professional Certification</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class of Degree</label>
                  <select
                    value={formData.classOfDegree}
                    onChange={(e) => setFormData({ ...formData, classOfDegree: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select classification</option>
                    <option value="First Class Honours">First Class Honours</option>
                    <option value="Second Class Upper">Second Class Upper</option>
                    <option value="Second Class Lower">Second Class Lower</option>
                    <option value="Third Class">Third Class</option>
                    <option value="Pass">Pass</option>
                    <option value="Distinction">Distinction</option>
                    <option value="Merit">Merit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="5"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 3.75"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.graduationDate}
                    onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">National ID</label>
                  <input
                    type="text"
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="National ID number"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={issuing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors flex items-center gap-2"
                >
                  {issuing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Issuing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Issue Certificate
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Certificate Details Modal */}
      {selectedCert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Certificate Details</h2>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Certificate No.</p>
                  <p className="font-mono font-medium">{selectedCert.certificateNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Verification Code</p>
                  <p className="font-mono font-bold text-blue-600">{selectedCert.verificationCode}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Student Name</p>
                <p className="font-medium">{selectedCert.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Program</p>
                <p className="font-medium">{selectedCert.programName}</p>
                <p className="text-sm text-gray-500">{selectedCert.programType.replace('_', ' ')}</p>
              </div>
              {selectedCert.classOfDegree && (
                <div>
                  <p className="text-sm text-gray-500">Classification</p>
                  <p className="font-medium">{selectedCert.classOfDegree}</p>
                </div>
              )}
              <div className="flex gap-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  {getStatusBadge(selectedCert.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Blockchain</p>
                  {getBlockchainBadge(selectedCert.blockchainStatus)}
                </div>
              </div>
              {selectedCert.transactionHash && (
                <div>
                  <p className="text-sm text-gray-500">Transaction Hash</p>
                  <a
                    href={`https://explorer.solana.com/tx/${selectedCert.transactionHash}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline font-mono break-all"
                  >
                    {selectedCert.transactionHash}
                  </a>
                </div>
              )}
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => window.open(`/verify/${selectedCert.verificationCode}`, '_blank')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                View Public Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
