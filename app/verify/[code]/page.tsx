'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, XCircle, AlertCircle, Shield, Building2, GraduationCap, Calendar, Hash, ExternalLink, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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

export default function VerifyCodePage() {
  const params = useParams()
  const code = params.code as string
  const [loading, setLoading] = useState(true)
  const [result, setResult] = useState<VerificationResult | null>(null)

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(`/api/verify?code=${code}`)
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

    if (code) {
      verify()
    }
  }, [code])

  const getStatusIcon = () => {
    if (!result) return null
    
    switch (result.status) {
      case 'VALID':
        return <CheckCircle className="w-20 h-20 text-green-500" />
      case 'REVOKED':
        return <XCircle className="w-20 h-20 text-red-500" />
      case 'NOT_FOUND':
        return <AlertCircle className="w-20 h-20 text-yellow-500" />
      default:
        return <XCircle className="w-20 h-20 text-red-500" />
    }
  }

  const getStatusBg = () => {
    if (!result) return 'bg-gray-50'
    
    switch (result.status) {
      case 'VALID':
        return 'bg-gradient-to-br from-green-50 to-emerald-100'
      case 'REVOKED':
        return 'bg-gradient-to-br from-red-50 to-rose-100'
      case 'NOT_FOUND':
        return 'bg-gradient-to-br from-yellow-50 to-amber-100'
      default:
        return 'bg-gradient-to-br from-red-50 to-rose-100'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Verifying certificate...</p>
          <p className="text-sm text-gray-500 mt-2">Code: {code}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${getStatusBg()}`}>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/verify" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Verification</span>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <span className="font-semibold text-gray-900">SL Academic Verification</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {result && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Status Header */}
            <div className={`p-8 text-center ${
              result.status === 'VALID' ? 'bg-green-500' :
              result.status === 'REVOKED' ? 'bg-red-500' :
              result.status === 'NOT_FOUND' ? 'bg-yellow-500' : 'bg-red-500'
            }`}>
              <div className="bg-white rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-4">
                {getStatusIcon()}
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                {result.status === 'VALID' && 'Certificate Verified ✓'}
                {result.status === 'REVOKED' && 'Certificate Revoked'}
                {result.status === 'NOT_FOUND' && 'Certificate Not Found'}
                {result.status === 'ERROR' && 'Verification Error'}
                {result.status === 'INVALID' && 'Invalid Certificate'}
              </h1>
              <p className="text-white/90">{result.message}</p>
            </div>

            {/* Certificate Details */}
            {result.certificate && (
              <div className="p-8">
                <div className="space-y-6">
                  {/* Student Info */}
                  <div className="text-center pb-6 border-b">
                    <p className="text-sm text-gray-500 uppercase tracking-wide">This certifies that</p>
                    <h2 className="text-3xl font-bold text-gray-900 mt-2">
                      {result.certificate.studentName}
                    </h2>
                  </div>

                  {/* Program Info */}
                  <div className="text-center pb-6 border-b">
                    <p className="text-sm text-gray-500 uppercase tracking-wide">Has been awarded</p>
                    <h3 className="text-xl font-semibold text-gray-900 mt-2">
                      {result.certificate.programName}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {result.certificate.programType.replace('_', ' ')}
                      {result.certificate.classOfDegree && ` - ${result.certificate.classOfDegree}`}
                    </p>
                    {result.certificate.cgpa && (
                      <p className="text-sm text-gray-500 mt-1">
                        CGPA: {result.certificate.cgpa.toFixed(2)}
                      </p>
                    )}
                  </div>

                  {/* Institution & Date */}
                  <div className="grid grid-cols-2 gap-6 pb-6 border-b">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Issued by</p>
                        <p className="font-semibold text-gray-900">{result.certificate.institution.name}</p>
                        <p className="text-xs text-gray-500">{result.certificate.institution.type}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-blue-600 mt-1" />
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
                  </div>

                  {/* Certificate Number */}
                  <div className="flex items-center justify-between pb-6 border-b">
                    <div className="flex items-center gap-3">
                      <Hash className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Certificate Number</p>
                        <p className="font-mono text-gray-900">{result.certificate.certificateNo}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Verification Code</p>
                      <p className="font-mono font-bold text-blue-600">{code}</p>
                    </div>
                  </div>

                  {/* Blockchain Verification */}
                  {result.certificate.blockchainVerified && result.certificate.transactionHash && (
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <Shield className="w-5 h-5" />
                        <span className="font-semibold">Blockchain Verified</span>
                      </div>
                      <p className="text-sm text-green-600 mb-3">
                        This certificate is permanently recorded on the Solana blockchain and cannot be altered.
                      </p>
                      <a
                        href={`https://explorer.solana.com/tx/${result.certificate.transactionHash}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-800 font-medium"
                      >
                        View Blockchain Record
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-4 text-center text-sm text-gray-500">
              <p>Verified on {new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
        )}

        {/* Verify Another */}
        <div className="mt-8 text-center">
          <Link
            href="/verify"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow text-gray-700 font-medium"
          >
            <Shield className="w-5 h-5" />
            Verify Another Certificate
          </Link>
        </div>
      </main>
    </div>
  )
}
