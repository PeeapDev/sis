// University Courses API
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - List courses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const programId = searchParams.get('programId')

    const where: any = {}
    if (programId) where.programId = programId

    const courses = await prisma.course.findMany({
      where,
      include: {
        program: true
      },
      orderBy: [{ year: 'asc' }, { semester: 'asc' }, { code: 'asc' }]
    })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error('List courses error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { programId, code, name, credits, semester, year, isCore, description } = body

    if (!programId || !code || !name) {
      return NextResponse.json(
        { error: 'Missing required fields: programId, code, name' },
        { status: 400 }
      )
    }

    const course = await prisma.course.create({
      data: {
        programId,
        code,
        name,
        credits: credits || 3,
        semester: semester || 1,
        year: year || 1,
        isCore: isCore !== false,
        description
      },
      include: { program: true }
    })

    return NextResponse.json({
      success: true,
      message: 'Course created successfully',
      course
    })
  } catch (error) {
    console.error('Create course error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
