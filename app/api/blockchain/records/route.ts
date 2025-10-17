import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId') || undefined
    const schoolId = searchParams.get('schoolId') || undefined
    const recordType = searchParams.get('recordType') || undefined
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')
    const sort = (searchParams.get('sort') || 'createdAt:desc').split(':')
    const [sortField, sortOrder] = [sort[0] as 'createdAt' | 'blockNumber', (sort[1] as 'asc' | 'desc') || 'desc']

    const where: any = {}
    if (studentId) where.studentId = studentId
    if (schoolId) where.schoolId = schoolId
    if (recordType) where.recordType = recordType

    const [total, records] = await Promise.all([
      prisma.blockchainRecord.count({ where }),
      prisma.blockchainRecord.findMany({
        where,
        orderBy: { [sortField]: sortOrder },
        skip: offset,
        take: limit
      })
    ])

    return NextResponse.json({
      success: true,
      data: records,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })
  } catch (error) {
    console.error('Blockchain records API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blockchain records' },
      { status: 500 }
    )
  }
}
