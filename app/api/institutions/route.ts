// Institutions API
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - List institutions (public for verification, filtered for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const verified = searchParams.get('verified')
    const type = searchParams.get('type')

    const where: any = {}
    
    if (verified === 'true') {
      where.isVerified = true
    }
    
    if (type) {
      where.type = type
    }

    const institutions = await prisma.institution.findMany({
      where,
      select: {
        id: true,
        name: true,
        code: true,
        type: true,
        city: true,
        country: true,
        logo: true,
        isVerified: true,
        _count: {
          select: { certificates: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ institutions })
  } catch (error) {
    console.error('List institutions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new institution (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const userRole = (session.user as any).role
    if (!['SUPER_ADMIN', 'NATIONAL_ADMIN', 'INSTITUTION_ADMIN'].includes(userRole)) {
      return NextResponse.json(
        { error: 'Only administrators can create institutions' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      code,
      type,
      address,
      city,
      country,
      phone,
      email,
      website,
      logo,
      accreditationNo
    } = body

    // Validate required fields
    if (!name || !code || !type || !address || !city) {
      return NextResponse.json(
        { error: 'Missing required fields: name, code, type, address, city' },
        { status: 400 }
      )
    }

    // Check if code already exists
    const existing = await prisma.institution.findUnique({
      where: { code }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Institution with this code already exists' },
        { status: 400 }
      )
    }

    const institution = await prisma.institution.create({
      data: {
        name,
        code: code.toUpperCase(),
        type,
        address,
        city,
        country: country || 'Sierra Leone',
        phone,
        email,
        website,
        logo,
        accreditationNo,
        isVerified: userRole === 'SUPER_ADMIN' // Auto-verify if created by super admin
      }
    })

    // Add creator as institution admin
    await prisma.institutionUser.create({
      data: {
        institutionId: institution.id,
        userId: (session.user as any).id,
        role: 'ADMIN',
        canIssue: true,
        canRevoke: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Institution created successfully',
      institution
    })
  } catch (error) {
    console.error('Create institution API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
