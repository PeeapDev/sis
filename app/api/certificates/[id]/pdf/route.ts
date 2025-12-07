// Certificate PDF Generation API
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import QRCode from 'qrcode'

// GET - Generate PDF data for a certificate
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const certificate = await prisma.certificate.findUnique({
      where: { id },
      include: {
        institution: true
      }
    })

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    // Generate QR code as data URL
    const verifyUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/verify/${certificate.verificationCode}`
    const qrCodeDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 150,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    })

    // Return certificate data for PDF generation on client
    return NextResponse.json({
      certificate: {
        certificateNo: certificate.certificateNo,
        verificationCode: certificate.verificationCode,
        studentName: certificate.studentName,
        programName: certificate.programName,
        programType: certificate.programType,
        classOfDegree: certificate.classOfDegree,
        cgpa: certificate.cgpa,
        graduationDate: certificate.graduationDate,
        institution: {
          name: certificate.institution.name,
          code: certificate.institution.code,
          address: certificate.institution.address,
          city: certificate.institution.city
        },
        issuedAt: certificate.createdAt,
        blockchainVerified: certificate.blockchainStatus === 'CONFIRMED',
        transactionHash: certificate.transactionHash
      },
      qrCode: qrCodeDataUrl,
      verifyUrl
    })
  } catch (error) {
    console.error('Generate PDF data error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
