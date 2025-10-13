import { NextRequest, NextResponse } from 'next/server'

// Mock data for demonstration
const mockResults = [
  {
    id: 'res_001',
    studentId: 'std_001',
    schoolId: 'sch_001',
    subjectId: 'sub_001',
    subjectName: 'Mathematics',
    teacherId: 'tch_001',
    teacherName: 'Dr. Fatima Sesay',
    term: 'Term 2',
    year: 2024,
    score: 85,
    grade: 'A',
    remarks: 'Excellent performance',
    examType: 'Final Exam',
    createdAt: '2024-06-15T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z'
  },
  {
    id: 'res_002',
    studentId: 'std_001',
    schoolId: 'sch_001',
    subjectId: 'sub_002',
    subjectName: 'English Language',
    teacherId: 'tch_002',
    teacherName: 'Mr. Abdul Rahman',
    term: 'Term 2',
    year: 2024,
    score: 78,
    grade: 'B+',
    remarks: 'Good progress',
    examType: 'Final Exam',
    createdAt: '2024-06-15T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z'
  },
  {
    id: 'res_003',
    studentId: 'std_001',
    schoolId: 'sch_001',
    subjectId: 'sub_003',
    subjectName: 'Physics',
    teacherId: 'tch_001',
    teacherName: 'Dr. Fatima Sesay',
    term: 'Term 2',
    year: 2024,
    score: 82,
    grade: 'A-',
    remarks: 'Very good understanding',
    examType: 'Final Exam',
    createdAt: '2024-06-15T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z'
  },
  {
    id: 'res_004',
    studentId: 'std_002',
    schoolId: 'sch_001',
    subjectId: 'sub_001',
    subjectName: 'Mathematics',
    teacherId: 'tch_001',
    teacherName: 'Dr. Fatima Sesay',
    term: 'Term 2',
    year: 2024,
    score: 76,
    grade: 'B+',
    remarks: 'Good effort',
    examType: 'Final Exam',
    createdAt: '2024-06-15T00:00:00Z',
    updatedAt: '2024-06-15T00:00:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const schoolId = searchParams.get('schoolId')
    const subjectId = searchParams.get('subjectId')
    const term = searchParams.get('term')
    const year = searchParams.get('year')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filteredResults = mockResults

    // Apply filters
    if (studentId) {
      filteredResults = filteredResults.filter(result => 
        result.studentId === studentId
      )
    }

    if (schoolId) {
      filteredResults = filteredResults.filter(result => 
        result.schoolId === schoolId
      )
    }

    if (subjectId) {
      filteredResults = filteredResults.filter(result => 
        result.subjectId === subjectId
      )
    }

    if (term) {
      filteredResults = filteredResults.filter(result => 
        result.term.toLowerCase() === term.toLowerCase()
      )
    }

    if (year) {
      filteredResults = filteredResults.filter(result => 
        result.year === parseInt(year)
      )
    }

    // Apply pagination
    const paginatedResults = filteredResults.slice(offset, offset + limit)

    // Calculate statistics
    const stats = {
      totalResults: filteredResults.length,
      averageScore: filteredResults.length > 0 
        ? Math.round(filteredResults.reduce((sum, r) => sum + r.score, 0) / filteredResults.length * 100) / 100
        : 0,
      highestScore: filteredResults.length > 0 
        ? Math.max(...filteredResults.map(r => r.score))
        : 0,
      lowestScore: filteredResults.length > 0 
        ? Math.min(...filteredResults.map(r => r.score))
        : 0
    }

    return NextResponse.json({
      success: true,
      data: paginatedResults,
      stats,
      pagination: {
        total: filteredResults.length,
        limit,
        offset,
        hasMore: offset + limit < filteredResults.length
      }
    })
  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch results' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['studentId', 'schoolId', 'subjectId', 'teacherId', 'term', 'year', 'score', 'examType']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate score range
    if (body.score < 0 || body.score > 100) {
      return NextResponse.json(
        { success: false, error: 'Score must be between 0 and 100' },
        { status: 400 }
      )
    }

    // Calculate grade based on score
    const getGrade = (score: number): string => {
      if (score >= 90) return 'A+'
      if (score >= 85) return 'A'
      if (score >= 80) return 'A-'
      if (score >= 75) return 'B+'
      if (score >= 70) return 'B'
      if (score >= 65) return 'B-'
      if (score >= 60) return 'C+'
      if (score >= 55) return 'C'
      if (score >= 50) return 'C-'
      if (score >= 45) return 'D+'
      if (score >= 40) return 'D'
      return 'F'
    }

    // Check for duplicate result
    const existingResult = mockResults.find(result => 
      result.studentId === body.studentId &&
      result.subjectId === body.subjectId &&
      result.term === body.term &&
      result.year === body.year &&
      result.examType === body.examType
    )

    if (existingResult) {
      return NextResponse.json(
        { success: false, error: 'Result already exists for this student, subject, term, and exam type' },
        { status: 409 }
      )
    }

    // Create new result
    const newResult = {
      id: `res_${Date.now()}`,
      ...body,
      grade: getGrade(body.score),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In a real app, this would be saved to the database
    mockResults.push(newResult)

    return NextResponse.json({
      success: true,
      data: newResult,
      message: 'Result recorded successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating result:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record result' },
      { status: 500 }
    )
  }
}
