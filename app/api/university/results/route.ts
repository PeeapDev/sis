// University Results API - For Lecturers to add grades
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Grade calculation helper
function calculateGradePoint(score: number): { grade: string; gradePoint: number } {
  if (score >= 70) return { grade: 'A', gradePoint: 4.0 }
  if (score >= 65) return { grade: 'B+', gradePoint: 3.5 }
  if (score >= 60) return { grade: 'B', gradePoint: 3.0 }
  if (score >= 55) return { grade: 'C+', gradePoint: 2.5 }
  if (score >= 50) return { grade: 'C', gradePoint: 2.0 }
  if (score >= 45) return { grade: 'D', gradePoint: 1.5 }
  if (score >= 40) return { grade: 'E', gradePoint: 1.0 }
  return { grade: 'F', gradePoint: 0.0 }
}

// POST - Add/Update course result (Lecturer)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { enrollmentId, courseId, academicYear, semester, score, remarks } = body

    if (!enrollmentId || !courseId || !academicYear || semester === undefined || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: enrollmentId, courseId, academicYear, semester, score' },
        { status: 400 }
      )
    }

    // Get course credits
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Calculate grade
    const { grade, gradePoint } = calculateGradePoint(score)

    // Upsert result
    const result = await prisma.courseResult.upsert({
      where: {
        enrollmentId_courseId_academicYear_semester: {
          enrollmentId,
          courseId,
          academicYear,
          semester
        }
      },
      update: {
        score,
        grade,
        gradePoint,
        remarks,
        status: 'PENDING'
      },
      create: {
        enrollmentId,
        courseId,
        academicYear,
        semester,
        score,
        grade,
        gradePoint,
        credits: course.credits,
        remarks,
        status: 'PENDING'
      },
      include: {
        course: true,
        enrollment: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Result added successfully',
      result
    })
  } catch (error) {
    console.error('Add result error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - List results (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const enrollmentId = searchParams.get('enrollmentId')
    const courseId = searchParams.get('courseId')
    const academicYear = searchParams.get('academicYear')
    const status = searchParams.get('status')
    const institutionId = searchParams.get('institutionId')

    const where: any = {}
    
    if (enrollmentId) where.enrollmentId = enrollmentId
    if (courseId) where.courseId = courseId
    if (academicYear) where.academicYear = academicYear
    if (status) where.status = status
    if (institutionId) {
      where.enrollment = { institutionId }
    }

    const results = await prisma.courseResult.findMany({
      where,
      include: {
        course: true,
        enrollment: {
          include: {
            program: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('List results error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Approve results (HOD/Dean)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { resultIds, action, approvedById } = body

    if (!resultIds || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: resultIds, action' },
        { status: 400 }
      )
    }

    const newStatus = action === 'approve' ? 'APPROVED' : action === 'publish' ? 'PUBLISHED' : 'DISPUTED'

    await prisma.courseResult.updateMany({
      where: { id: { in: resultIds } },
      data: {
        status: newStatus,
        approvedById,
        approvedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: `Results ${action}d successfully`
    })
  } catch (error) {
    console.error('Update results error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
