import { NextRequest, NextResponse } from 'next/server'

// Mock data for demonstration
const mockStudents = [
  {
    id: 'std_001',
    studentId: 'FSS2024001',
    firstName: 'Mohamed',
    lastName: 'Kamara',
    dateOfBirth: '2008-03-15',
    gender: 'MALE',
    address: '45 Kissy Road, Freetown',
    phone: '+232 76 123 456',
    guardianName: 'Ibrahim Kamara',
    guardianPhone: '+232 77 234 567',
    currentSchoolId: 'sch_001',
    currentSchool: 'Freetown Secondary School',
    class: 'Form 5A',
    enrollmentDate: '2020-09-01',
    status: 'ACTIVE',
    gpa: 3.8,
    totalResults: 45,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'std_002',
    studentId: 'FSS2024002',
    firstName: 'Aminata',
    lastName: 'Conteh',
    dateOfBirth: '2009-07-22',
    gender: 'FEMALE',
    address: '12 Hill Station, Freetown',
    phone: '+232 78 345 678',
    guardianName: 'Fatima Conteh',
    guardianPhone: '+232 79 456 789',
    currentSchoolId: 'sch_001',
    currentSchool: 'Freetown Secondary School',
    class: 'Form 4B',
    enrollmentDate: '2021-09-01',
    status: 'ACTIVE',
    gpa: 3.6,
    totalResults: 32,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'std_003',
    studentId: 'BGS2024001',
    firstName: 'Ibrahim',
    lastName: 'Sesay',
    dateOfBirth: '2010-11-08',
    gender: 'MALE',
    address: '8 New Road, Bo',
    phone: '+232 76 567 890',
    guardianName: 'Abdul Sesay',
    guardianPhone: '+232 77 678 901',
    currentSchoolId: 'sch_002',
    currentSchool: 'Bo Government School',
    class: 'Primary 6',
    enrollmentDate: '2018-09-01',
    status: 'ACTIVE',
    gpa: 3.2,
    totalResults: 28,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const schoolId = searchParams.get('schoolId')
    const class_ = searchParams.get('class')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filteredStudents = mockStudents

    // Apply filters
    if (schoolId) {
      filteredStudents = filteredStudents.filter(student => 
        student.currentSchoolId === schoolId
      )
    }

    if (class_) {
      filteredStudents = filteredStudents.filter(student => 
        student.class.toLowerCase().includes(class_.toLowerCase())
      )
    }

    if (status) {
      filteredStudents = filteredStudents.filter(student => 
        student.status.toLowerCase() === status.toLowerCase()
      )
    }

    if (search) {
      filteredStudents = filteredStudents.filter(student => 
        student.firstName.toLowerCase().includes(search.toLowerCase()) ||
        student.lastName.toLowerCase().includes(search.toLowerCase()) ||
        student.studentId.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Apply pagination
    const paginatedStudents = filteredStudents.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedStudents,
      pagination: {
        total: filteredStudents.length,
        limit,
        offset,
        hasMore: offset + limit < filteredStudents.length
      }
    })
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch students' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'guardianName', 'guardianPhone', 'currentSchoolId']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Generate student ID (in real app, this would be more sophisticated)
    const schoolCode = body.currentSchoolId.slice(-3)
    const year = new Date().getFullYear()
    const sequence = String(mockStudents.length + 1).padStart(3, '0')
    const studentId = `${schoolCode}${year}${sequence}`

    // Create new student
    const newStudent = {
      id: `std_${Date.now()}`,
      studentId,
      ...body,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      gpa: 0,
      totalResults: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In a real app, this would be saved to the database
    mockStudents.push(newStudent)

    return NextResponse.json({
      success: true,
      data: newStudent,
      message: 'Student enrolled successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating student:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to enroll student' },
      { status: 500 }
    )
  }
}
