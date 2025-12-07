'use client'

import { useState } from 'react'
import { Search, CheckCircle, XCircle, AlertCircle, Shield, QrCode, Building2, GraduationCap, Calendar, Hash, ExternalLink } from 'lucide-react'

interface VerificationResult {
  valid: boolean
  status: 'VALID' | 'INVALID' | 'REVOKED' | 'NOT_FOUND' | 'ERROR'
  certificate?: {
    certificateNo: string
    studentName: string
    programName: string
    programType: string
    classOfDegree?: string
    cgpa?: number
    graduationDate: string
    institution: {
      name: string
      code: string
      type: string
    }
    status: string
    issuedAt: string
    blockchainVerified: boolean
    transactionHash?: string
  }
  message: string
}

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<VerificationResult | null>(null)
  const [organization, setOrganization] = useState('')

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationCode.trim()) return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          verificationCode: verificationCode.trim().toUpperCase(),
          organization 
        })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        valid: false,
        status: 'ERROR',
        message: 'Failed to verify certificate. Please try again.'
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = () => {
    if (!result) return null
    
    switch (result.status) {
      case 'VALID':
        return <CheckCircle className="w-16 h-16 text-green-500" />
      case 'REVOKED':
        return <XCircle className="w-16 h-16 text-red-500" />
      case 'NOT_FOUND':
        return <AlertCircle className="w-16 h-16 text-yellow-500" />
      default:
        return <XCircle className="w-16 h-16 text-red-500" />
    }
  }

  const getStatusColor = () => {
    if (!result) return ''
    
    switch (result.status) {
      case 'VALID':
        return 'bg-green-50 border-green-200'
      case 'REVOKED':
        return 'bg-red-50 border-red-200'
      case 'NOT_FOUND':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-red-50 border-red-200'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sierra Leone Academic Verification</h1>
                <p className="text-sm text-gray-500">Blockchain-Powered Credential Verification</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <QrCode className="w-4 h-4" />
              <span>Scan QR or Enter Code</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Verify Academic Credentials Instantly
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter the verification code from any certificate issued by accredited institutions 
            in Sierra Leone to confirm its authenticity.
          </p>
        </div>

        {/* Verification Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                  placeholder="Enter 9-character code (e.g., ABC123XYZ)"
                  className="w-full px-4 py-4 text-lg font-mono tracking-wider border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  maxLength={9}
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                The verification code is printed on the certificate or can be scanned from the QR code.
              </p>
            </div>

            <div>
              <label htmlFor="org" className="block text-sm font-medium text-gray-700 mb-2">
                Your Organization (Optional)
              </label>
              <input
                type="text"
                id="org"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g., ABC Company Ltd"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !verificationCode.trim()}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Verify Certificate
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Section */}
        {result && (
          <div className={`rounded-2xl border-2 p-8 ${getStatusColor()} transition-all animate-in fade-in duration-300`}>
            <div className="flex flex-col items-center text-center mb-6">
              {getStatusIcon()}
              <h3 className="text-2xl font-bold mt-4">
                {result.status === 'VALID' && 'Certificate Verified ✓'}
                {result.status === 'REVOKED' && 'Certificate Revoked'}
                {result.status === 'NOT_FOUND' && 'Certificate Not Found'}
                {result.status === 'ERROR' && 'Verification Error'}
                {result.status === 'INVALID' && 'Invalid Certificate'}
              </h3>
              <p className="text-gray-600 mt-2">{result.message}</p>
            </div>

            {result.certificate && (
              <div className="bg-white rounded-xl p-6 mt-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  Certificate Details
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Student Name</p>
                      <p className="font-semibold text-gray-900">{result.certificate.studentName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Program</p>
                      <p className="font-semibold text-gray-900">{result.certificate.programName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Degree Type</p>
                      <p className="font-semibold text-gray-900">{result.certificate.programType.replace('_', ' ')}</p>
                    </div>
                    {result.certificate.classOfDegree && (
                      <div>
                        <p className="text-sm text-gray-500">Classification</p>
                        <p className="font-semibold text-gray-900">{result.certificate.classOfDegree}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Building2 className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Institution</p>
                        <p className="font-semibold text-gray-900">{result.certificate.institution.name}</p>
                        <p className="text-xs text-gray-500">{result.certificate.institution.type}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Graduation Date</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(result.certificate.graduationDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Hash className="w-4 h-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Certificate No.</p>
                        <p className="font-mono text-gray-900">{result.certificate.certificateNo}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blockchain Verification */}
                {result.certificate.blockchainVerified && result.certificate.transactionHash && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-semibold">Blockchain Verified</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      This certificate has been permanently recorded on the Solana blockchain.
                    </p>
                    <a
                      href={`https://explorer.solana.com/tx/${result.certificate.transactionHash}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      View on Solana Explorer
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Tamper-Proof</h3>
            <p className="text-sm text-gray-600">
              Certificates are cryptographically secured on the blockchain, making them impossible to forge.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Verification</h3>
            <p className="text-sm text-gray-600">
              Verify any certificate in seconds, no need to wait for manual confirmation from institutions.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Accredited Institutions</h3>
            <p className="text-sm text-gray-600">
              Only verified universities and colleges can issue certificates through this system.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>Sierra Leone Student Information System</p>
            <p className="mt-1">Powered by Solana Blockchain Technology</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
