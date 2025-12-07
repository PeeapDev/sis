// Graduation Processing API - For Registrar to issue certificates
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { certificateService } from '@/lib/certificate-service'

// Calculate class of degree from CGPA
function calculateClassOfDegree(cgpa: number): string {
  if (cgpa >= 3.6) return 'First Class Honours'
  if (cgpa >= 3.0) return 'Second Class Upper'
  if (cgpa >= 2.4) return 'Second Class Lower'
  if (cgpa >= 2.0) return 'Third Class'
  if (cgpa >= 1.0) return 'Pass'
  return 'Fail'
}

// Calculate CGPA from results
async function calculateCGPA(enrollmentId: string): Promise<{ cgpa: number; totalCredits: number }> {
  const results = await prisma.courseResult.findMany({
    where: {
      enrollmentId,
      status: { in: ['APPROVED', 'PUBLISHED'] }
    }
  })

  if (results.length === 0) {
    return { cgpa: 0, totalCredits: 0 }
  }

  let totalPoints = 0
  let totalCredits = 0

  for (const result of results) {
    if (result.gradePoint !== null) {
      totalPoints += result.gradePoint * result.credits
      totalCredits += result.credits
    }
  }

  const cgpa = totalCredits > 0 ? totalPoints / totalCredits : 0
  return { cgpa: Math.round(cgpa * 100) / 100, totalCredits }
}

// POST - Create graduation request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { enrollmentId } = body

    if (!enrollmentId) {
      return NextResponse.json(
        { error: 'enrollmentId is required' },
        { status: 400 }
      )
    }

    // Check enrollment exists
    const enrollment = await prisma.universityEnrollment.findUnique({
      where: { id: enrollmentId },
      include: { program: true }
    })

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 })
    }

    // Check if already has graduation request
    const existing = await prisma.graduationRequest.findUnique({
      where: { enrollmentId }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Graduation request already exists', request: existing },
        { status: 400 }
      )
    }

    // Calculate CGPA
    const { cgpa, totalCredits } = await calculateCGPA(enrollmentId)
    const classOfDegree = calculateClassOfDegree(cgpa)

    // Create graduation request
    const graduationRequest = await prisma.graduationRequest.create({
      data: {
        enrollmentId,
        totalCredits,
        cgpa,
        classOfDegree,
        status: 'PENDING'
      },
      include: {
        enrollment: {
          include: { program: true }
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Graduation request created',
      graduationRequest
    })
  } catch (error) {
    console.error('Create graduation request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - List graduation requests
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const institutionId = searchParams.get('institutionId')

    const where: any = {}
    if (status) where.status = status
    if (institutionId) {
      where.enrollment = { institutionId }
    }

    const requests = await prisma.graduationRequest.findMany({
      where,
      include: {
        enrollment: {
          include: {
            program: {
              include: { institution: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ requests })
  } catch (error) {
    console.error('List graduation requests error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH - Process graduation request (Approve & Issue Certificate)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { requestId, action, reviewedById, reviewNotes, institutionId, issuedById } = body

    if (!requestId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: requestId, action' },
        { status: 400 }
      )
    }

    const graduationRequest = await prisma.graduationRequest.findUnique({
      where: { id: requestId },
      include: {
        enrollment: {
          include: { program: true }
        }
      }
    })

    if (!graduationRequest) {
      return NextResponse.json({ error: 'Graduation request not found' }, { status: 404 })
    }

    if (action === 'reject') {
      await prisma.graduationRequest.update({
        where: { id: requestId },
        data: {
          status: 'REJECTED',
          reviewedById,
          reviewedAt: new Date(),
          reviewNotes
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Graduation request rejected'
      })
    }

    if (action === 'approve') {
      // Update graduation request
      await prisma.graduationRequest.update({
        where: { id: requestId },
        data: {
          status: 'APPROVED',
          reviewedById,
          reviewedAt: new Date(),
          reviewNotes
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Graduation request approved. Ready for certificate issuance.'
      })
    }

    if (action === 'issue_certificate') {
      if (!institutionId || !issuedById) {
        return NextResponse.json(
          { error: 'institutionId and issuedById required for certificate issuance' },
          { status: 400 }
        )
      }

      // Issue certificate
      const certResult = await certificateService.issueCertificate({
        institutionId,
        issuedById,
        studentName: graduationRequest.enrollment.studentName,
        studentId: graduationRequest.enrollment.studentId,
        dateOfBirth: graduationRequest.enrollment.dateOfBirth || undefined,
        nationalId: graduationRequest.enrollment.nationalId || undefined,
        programName: graduationRequest.enrollment.program.name,
        programType: graduationRequest.enrollment.program.type as any,
        classOfDegree: graduationRequest.classOfDegree,
        cgpa: graduationRequest.cgpa,
        graduationDate: new Date()
      })

      if (!certResult.success) {
        return NextResponse.json(
          { error: certResult.error || 'Failed to issue certificate' },
          { status: 500 }
        )
      }

      // Update graduation request with certificate ID
      await prisma.graduationRequest.update({
        where: { id: requestId },
        data: {
          status: 'CERTIFIED',
          certificateId: certResult.certificate?.id
        }
      })

      // Update enrollment status
      await prisma.universityEnrollment.update({
        where: { id: graduationRequest.enrollmentId },
        data: { status: 'GRADUATED' }
      })

      return NextResponse.json({
        success: true,
        message: 'Certificate issued successfully',
        certificate: certResult.certificate
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Process graduation request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
