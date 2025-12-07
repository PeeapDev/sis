// Certificate Revocation API
import { NextRequest, NextResponse } from 'next/server'
import { certificateService } from '@/lib/certificate-service'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Revoke a certificate
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { reason } = body

    if (!reason) {
      return NextResponse.json(
        { error: 'Revocation reason is required' },
        { status: 400 }
      )
    }

    // Get certificate to find institution
    const certificate = await prisma.certificate.findUnique({
      where: { id }
    })

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      )
    }

    // Get user's institution role
    const institutionUser = await prisma.institutionUser.findFirst({
      where: {
        userId: (session.user as any).id,
        institutionId: certificate.institutionId,
        canRevoke: true
      }
    })

    if (!institutionUser) {
      return NextResponse.json(
        { error: 'You are not authorized to revoke certificates for this institution' },
        { status: 403 }
      )
    }

    const result = await certificateService.revokeCertificate(
      id,
      institutionUser.id,
      reason
    )

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Certificate revoked successfully'
    })
  } catch (error) {
    console.error('Revoke certificate API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
