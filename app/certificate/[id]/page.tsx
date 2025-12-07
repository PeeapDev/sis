'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { Download, Printer, Shield, ExternalLink } from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface CertificateData {
  certificateNo: string
  verificationCode: string
  studentName: string
  programName: string
  programType: string
  classOfDegree?: string
  cgpa?: number
  graduationDate: string
  institution: {
    name: string
    code: string
    address: string
    city: string
  }
  issuedAt: string
  blockchainVerified: boolean
  transactionHash?: string
}

export default function CertificatePage() {
  const params = useParams()
  const id = params.id as string
  const [certificate, setCertificate] = useState<CertificateData | null>(null)
  const [qrCode, setQrCode] = useState<string>('')
  const [verifyUrl, setVerifyUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const certificateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const response = await fetch(`/api/certificates/${id}/pdf`)
        if (response.ok) {
          const data = await response.json()
          setCertificate(data.certificate)
          setQrCode(data.qrCode)
          setVerifyUrl(data.verifyUrl)
        }
      } catch (error) {
        console.error('Failed to fetch certificate:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchCertificate()
    }
  }, [id])

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return
    setDownloading(true)

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`Certificate-${certificate?.certificateNo}.pdf`)
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Failed to generate PDF')
    } finally {
      setDownloading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading certificate...</p>
        </div>
      </div>
    )
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Certificate not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Action Buttons - Hidden in print */}
      <div className="max-w-5xl mx-auto px-4 mb-6 print:hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Certificate Preview</h1>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
              {downloading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Certificate - Printable Area */}
      <div className="max-w-5xl mx-auto px-4">
        <div
          ref={certificateRef}
          className="bg-white shadow-2xl print:shadow-none"
          style={{ aspectRatio: '297/210' }} // A4 Landscape
        >
          {/* Certificate Content */}
          <div className="h-full p-8 relative overflow-hidden">
            {/* Decorative Border */}
            <div className="absolute inset-4 border-4 border-double border-amber-600 pointer-events-none" />
            <div className="absolute inset-6 border border-amber-400 pointer-events-none" />

            {/* Corner Decorations */}
            <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-amber-600" />
            <div className="absolute top-8 right-8 w-16 h-16 border-r-4 border-t-4 border-amber-600" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-l-4 border-b-4 border-amber-600" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-amber-600" />

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-between py-8 px-12">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-3xl font-serif font-bold text-amber-800 tracking-wide">
                  {certificate.institution.name}
                </h1>
                <p className="text-gray-600 mt-1">{certificate.institution.city}, Sierra Leone</p>
                <div className="mt-4 w-24 h-1 bg-amber-600 mx-auto" />
              </div>

              {/* Title */}
              <div className="text-center -mt-4">
                <p className="text-lg text-gray-600 italic">This is to certify that</p>
                <h2 className="text-4xl font-serif font-bold text-gray-900 mt-2 mb-2">
                  {certificate.studentName}
                </h2>
                <p className="text-lg text-gray-600 italic">has successfully completed the requirements for the degree of</p>
                <h3 className="text-2xl font-serif font-semibold text-amber-800 mt-3">
                  {certificate.programName}
                </h3>
                {certificate.classOfDegree && (
                  <p className="text-xl font-medium text-gray-700 mt-2">
                    with <span className="font-semibold">{certificate.classOfDegree}</span>
                  </p>
                )}
                {certificate.cgpa && (
                  <p className="text-gray-600 mt-1">
                    CGPA: {certificate.cgpa.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Footer */}
              <div className="w-full">
                <div className="flex items-end justify-between">
                  {/* Left - Date & Signatures */}
                  <div className="text-center">
                    <div className="w-40 border-t border-gray-400 pt-1">
                      <p className="text-sm text-gray-600">Date of Graduation</p>
                      <p className="font-medium">
                        {new Date(certificate.graduationDate).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Center - QR Code */}
                  <div className="text-center">
                    {qrCode && (
                      <div className="flex flex-col items-center">
                        <img src={qrCode} alt="Verification QR Code" className="w-24 h-24" />
                        <p className="text-xs text-gray-500 mt-1">Scan to verify</p>
                        <p className="text-xs font-mono font-bold text-blue-600">{certificate.verificationCode}</p>
                      </div>
                    )}
                  </div>

                  {/* Right - Certificate Number */}
                  <div className="text-center">
                    <div className="w-40 border-t border-gray-400 pt-1">
                      <p className="text-sm text-gray-600">Certificate No.</p>
                      <p className="font-mono font-medium text-sm">{certificate.certificateNo}</p>
                    </div>
                  </div>
                </div>

                {/* Blockchain Verification Badge */}
                {certificate.blockchainVerified && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-green-700">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs">Blockchain Verified on Solana</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Info - Hidden in print */}
      <div className="max-w-5xl mx-auto px-4 mt-6 print:hidden">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Verification Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-blue-600">Verification Code</p>
              <p className="font-mono font-bold text-blue-900">{certificate.verificationCode}</p>
            </div>
            <div>
              <p className="text-blue-600">Verify Online</p>
              <a href={verifyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:underline flex items-center gap-1">
                {verifyUrl} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            {certificate.transactionHash && (
              <div>
                <p className="text-blue-600">Blockchain Transaction</p>
                <a
                  href={`https://explorer.solana.com/tx/${certificate.transactionHash}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-900 hover:underline flex items-center gap-1 font-mono text-xs"
                >
                  {certificate.transactionHash.slice(0, 20)}... <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  )
}
