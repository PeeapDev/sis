// Certificate API - Issue and List Certificates
import { NextRequest, NextResponse } from 'next/server'
import { certificateService } from '@/lib/certificate-service'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Issue a new certificate
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      institutionId,
      studentName,
      studentId,
      dateOfBirth,
      nationalId,
      programName,
      programType,
      classOfDegree,
      cgpa,
      graduationDate,
      startDate,
      endDate,
      metadata
    } = body

    // Validate required fields
    if (!institutionId || !studentName || !programName || !programType || !graduationDate) {
      return NextResponse.json(
        { error: 'Missing required fields: institutionId, studentName, programName, programType, graduationDate' },
        { status: 400 }
      )
    }

    // Get user's institution role
    const institutionUser = await prisma.institutionUser.findFirst({
      where: {
        userId: session.user.id,
        institutionId,
        canIssue: true
      }
    })

    if (!institutionUser) {
      return NextResponse.json(
        { error: 'You are not authorized to issue certificates for this institution' },
        { status: 403 }
      )
    }

    const result = await certificateService.issueCertificate({
      institutionId,
      issuedById: institutionUser.id,
      studentName,
      studentId,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      nationalId,
      programName,
      programType,
      classOfDegree,
      cgpa,
      graduationDate: new Date(graduationDate),
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      metadata
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    // Generate QR code
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    await certificateService.generateQRCode(result.certificate.id, baseUrl)

    return NextResponse.json({
      success: true,
      message: 'Certificate issued successfully',
      certificate: result.certificate
    })
  } catch (error) {
    console.error('Issue certificate API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - List certificates for an institution
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const institutionId = searchParams.get('institutionId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined

    if (!institutionId) {
      return NextResponse.json(
        { error: 'institutionId is required' },
        { status: 400 }
      )
    }

    // Verify user has access to this institution
    const institutionUser = await prisma.institutionUser.findFirst({
      where: {
        userId: session.user.id,
        institutionId
      }
    })

    if (!institutionUser) {
      return NextResponse.json(
        { error: 'You do not have access to this institution' },
        { status: 403 }
      )
    }

    const result = await certificateService.getInstitutionCertificates(institutionId, {
      page,
      limit,
      status,
      search
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('List certificates API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
