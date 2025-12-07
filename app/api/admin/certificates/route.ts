// Admin Certificates API - List all certificates across institutions
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - List all certificates (admin view)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined
    const institutionId = searchParams.get('institutionId') || undefined

    const skip = (page - 1) * limit

    const where: any = {}
    
    if (status) {
      where.status = status
    }
    
    if (institutionId) {
      where.institutionId = institutionId
    }
    
    if (search) {
      where.OR = [
        { studentName: { contains: search, mode: 'insensitive' } },
        { certificateNo: { contains: search, mode: 'insensitive' } },
        { verificationCode: { contains: search, mode: 'insensitive' } },
        { programName: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        include: {
          institution: {
            select: {
              id: true,
              name: true,
              code: true,
              type: true
            }
          },
          issuedBy: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.certificate.count({ where })
    ])

    return NextResponse.json({
      certificates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Admin certificates API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
