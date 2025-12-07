// Public Certificate Verification API
import { NextRequest, NextResponse } from 'next/server'
import { certificateService } from '@/lib/certificate-service'

// POST - Verify a certificate (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { verificationCode, certificateNo, organization } = body

    if (!verificationCode && !certificateNo) {
      return NextResponse.json(
        { error: 'Please provide either verificationCode or certificateNo' },
        { status: 400 }
      )
    }

    // Get verifier info from request
    const verifierInfo = {
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      agent: request.headers.get('user-agent') || 'unknown',
      org: organization
    }

    const result = await certificateService.verifyCertificate(
      { verificationCode, certificateNo },
      verifierInfo
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Verify certificate API error:', error)
    return NextResponse.json(
      { 
        valid: false, 
        status: 'ERROR',
        message: 'An error occurred during verification' 
      },
      { status: 500 }
    )
  }
}

// GET - Verify by code in URL (for QR code scanning)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const certNo = searchParams.get('certNo')

    if (!code && !certNo) {
      return NextResponse.json(
        { error: 'Please provide either code or certNo parameter' },
        { status: 400 }
      )
    }

    const verifierInfo = {
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      agent: request.headers.get('user-agent') || 'unknown'
    }

    const result = await certificateService.verifyCertificate(
      code ? { verificationCode: code } : { certificateNo: certNo! },
      verifierInfo
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Verify certificate API error:', error)
    return NextResponse.json(
      { 
        valid: false, 
        status: 'ERROR',
        message: 'An error occurred during verification' 
      },
      { status: 500 }
    )
  }
}
