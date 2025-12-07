'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Eye, XCircle, CheckCircle, Clock, AlertCircle, QrCode, Building2, ExternalLink, Download, FileText } from 'lucide-react'

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
    id: string
    name: string
    code: string
  }
}

interface Institution {
  id: string
  name: string
  code: string
  type: string
  isVerified: boolean
  _count: { certificates: number }
}

export default function AdminCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [showIssueModal, setShowIssueModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [institutionFilter, setInstitutionFilter] = useState('')
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null)

  // Form state for issuing new certificate
  const [formData, setFormData] = useState({
    institutionId: '',
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
    fetchInstitutions()
    fetchCertificates()
  }, [])

  useEffect(() => {
    fetchCertificates()
  }, [searchTerm, statusFilter, institutionFilter])

  const fetchInstitutions = async () => {
    try {
      const response = await fetch('/api/institutions')
      if (response.ok) {
        const data = await response.json()
        setInstitutions(data.institutions || [])
      }
    } catch (error) {
      console.error('Failed to fetch institutions:', error)
    }
  }

  const fetchCertificates = async () => {
    setLoading(true)
    try {
      // Fetch all certificates from all institutions
      const response = await fetch('/api/admin/certificates?' + new URLSearchParams({
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(institutionFilter && { institutionId: institutionFilter })
      }))
      
      if (response.ok) {
        const data = await response.json()
        setCertificates(data.certificates || [])
      } else {
        // If admin endpoint doesn't exist, fetch from regular endpoint
        setCertificates([])
      }
    } catch (error) {
      console.error('Failed to fetch certificates:', error)
      setCertificates([])
    } finally {
      setLoading(false)
    }
  }

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.institutionId) {
      alert('Please select an institution')
      return
    }
    setIssuing(true)

    try {
      const response = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          cgpa: formData.cgpa ? parseFloat(formData.cgpa) : undefined
        })
      })

      if (response.ok) {
        const data = await response.json()
        setShowIssueModal(false)
        setFormData({
          institutionId: '',
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
        alert(`Certificate issued successfully!\nVerification Code: ${data.certificate?.verificationCode || 'N/A'}`)
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
          <h1 className="text-2xl font-bold text-white">Certificate Management</h1>
          <p className="text-gray-400">Issue and manage blockchain-verified academic certificates</p>
        </div>
        <button
          onClick={() => setShowIssueModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Issue Certificate
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Total Certificates</p>
          <p className="text-2xl font-bold text-white">{certificates.length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-400">{certificates.filter(c => c.status === 'ACTIVE').length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Revoked</p>
          <p className="text-2xl font-bold text-red-400">{certificates.filter(c => c.status === 'REVOKED').length}</p>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <p className="text-gray-400 text-sm">Institutions</p>
          <p className="text-2xl font-bold text-blue-400">{institutions.length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, certificate no, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={institutionFilter}
          onChange={(e) => setInstitutionFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Institutions</option>
          {institutions.map(inst => (
            <option key={inst.id} value={inst.id}>{inst.name}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="REVOKED">Revoked</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </div>

      {/* Certificates Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900 border-b border-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Certificate</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Institution</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Program</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  Loading certificates...
                </td>
              </tr>
            ) : certificates.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  <div className="flex flex-col items-center">
                    <Building2 className="w-12 h-12 text-gray-600 mb-3" />
                    <p className="text-lg font-medium text-gray-300">No certificates found</p>
                    <p className="text-sm text-gray-500 mt-1">Click &quot;Issue Certificate&quot; to create one</p>
                  </div>
                </td>
              </tr>
            ) : (
              certificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-mono text-sm font-medium text-white">{cert.certificateNo}</p>
                      <p className="text-xs text-blue-400">Code: {cert.verificationCode}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-white">{cert.studentName}</p>
                    {cert.studentId && <p className="text-xs text-gray-400">ID: {cert.studentId}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-white">{cert.institution?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-400">{cert.institution?.code || ''}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-white">{cert.programName}</p>
                    <p className="text-xs text-gray-400">{cert.programType?.replace('_', ' ')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      {getStatusBadge(cert.status)}
                      {getBlockchainBadge(cert.blockchainStatus)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/30 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.open(`/verify/${cert.verificationCode}`, '_blank')}
                        className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-900/30 rounded-lg transition-colors"
                        title="Verify"
                      >
                        <QrCode className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => window.open(`/certificate/${cert.id}`, '_blank')}
                        className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-900/30 rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      {cert.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleRevoke(cert.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Issue New Certificate</h2>
              <p className="text-gray-400">Fill in the details to issue a blockchain-verified certificate</p>
            </div>
            
            <form onSubmit={handleIssueCertificate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Institution *</label>
                <select
                  required
                  value={formData.institutionId}
                  onChange={(e) => setFormData({ ...formData, institutionId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select institution</option>
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>{inst.name} ({inst.code})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="Full name as on certificate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Student ID</label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="University student ID"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Program Name *</label>
                <input
                  type="text"
                  required
                  value={formData.programName}
                  onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bachelor of Science in Computer Science"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Program Type *</label>
                  <select
                    required
                    value={formData.programType}
                    onChange={(e) => setFormData({ ...formData, programType: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">Class of Degree</label>
                  <select
                    value={formData.classOfDegree}
                    onChange={(e) => setFormData({ ...formData, classOfDegree: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-300 mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="5"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 3.75"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Graduation Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.graduationDate}
                    onChange={(e) => setFormData({ ...formData, graduationDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowIssueModal(false)}
                  className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={issuing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 transition-colors flex items-center gap-2"
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
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Certificate Details</h2>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-2 hover:bg-gray-700 rounded-lg text-gray-400"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Certificate No.</p>
                  <p className="font-mono font-medium text-white">{selectedCert.certificateNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Verification Code</p>
                  <p className="font-mono font-bold text-blue-400">{selectedCert.verificationCode}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-400">Student Name</p>
                <p className="font-medium text-white">{selectedCert.studentName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Institution</p>
                <p className="font-medium text-white">{selectedCert.institution?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Program</p>
                <p className="font-medium text-white">{selectedCert.programName}</p>
                <p className="text-sm text-gray-400">{selectedCert.programType?.replace('_', ' ')}</p>
              </div>
              {selectedCert.classOfDegree && (
                <div>
                  <p className="text-sm text-gray-400">Classification</p>
                  <p className="font-medium text-white">{selectedCert.classOfDegree}</p>
                </div>
              )}
              <div className="flex gap-4">
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  {getStatusBadge(selectedCert.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-400">Blockchain</p>
                  {getBlockchainBadge(selectedCert.blockchainStatus)}
                </div>
              </div>
              {selectedCert.transactionHash && (
                <div>
                  <p className="text-sm text-gray-400">Transaction Hash</p>
                  <a
                    href={`https://explorer.solana.com/tx/${selectedCert.transactionHash}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:underline font-mono break-all flex items-center gap-1"
                  >
                    {selectedCert.transactionHash.slice(0, 20)}...
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-700 bg-gray-900/50 flex justify-end gap-3">
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
