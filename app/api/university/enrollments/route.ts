// University Enrollments API
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST - Enroll a student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      institutionId,
      programId,
      studentName,
      studentId,
      email,
      phone,
      dateOfBirth,
      nationalId,
      expectedGraduation
    } = body

    if (!institutionId || !programId || !studentName || !studentId) {
      return NextResponse.json(
        { error: 'Missing required fields: institutionId, programId, studentName, studentId' },
        { status: 400 }
      )
    }

    // Check if student ID already exists
    const existing = await prisma.universityEnrollment.findUnique({
      where: {
        institutionId_studentId: { institutionId, studentId }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Student with this ID already enrolled' },
        { status: 400 }
      )
    }

    const enrollment = await prisma.universityEnrollment.create({
      data: {
        institutionId,
        programId,
        studentName,
        studentId,
        email,
        phone,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        nationalId,
        expectedGraduation: expectedGraduation ? new Date(expectedGraduation) : undefined
      },
      include: {
        program: {
          include: { institution: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Student enrolled successfully',
      enrollment
    })
  } catch (error) {
    console.error('Enroll student error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - List enrollments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const institutionId = searchParams.get('institutionId')
    const programId = searchParams.get('programId')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    if (institutionId) where.institutionId = institutionId
    if (programId) where.programId = programId
    if (status) where.status = status
    if (search) {
      where.OR = [
        { studentName: { contains: search, mode: 'insensitive' } },
        { studentId: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }

    const enrollments = await prisma.universityEnrollment.findMany({
      where,
      include: {
        program: {
          include: { institution: true }
        },
        results: {
          include: { course: true }
        },
        graduationRequest: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ enrollments })
  } catch (error) {
    console.error('List enrollments error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
