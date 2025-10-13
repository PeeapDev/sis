import { NextRequest, NextResponse } from 'next/server'

// Mock data for demonstration
const mockSchools = [
  {
    id: 'sch_001',
    name: 'Freetown Secondary School',
    code: 'FSS001',
    district: 'Western Area',
    province: 'Western Area',
    address: '15 Kissy Street, Freetown',
    phone: '+232 22 123 456',
    email: 'info@fss.edu.sl',
    principal: 'Dr. Fatima Sesay',
    established: '1965',
    type: 'PUBLIC',
    level: 'SENIOR_SECONDARY',
    latitude: 8.4657,
    longitude: -13.2317,
    totalStudents: 1247,
    totalTeachers: 45,
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'sch_002',
    name: 'Bo Government School',
    code: 'BGS002',
    district: 'Bo',
    province: 'Southern Province',
    address: 'Government Road, Bo',
    phone: '+232 32 234 567',
    email: 'admin@bgs.edu.sl',
    principal: 'Mr. Abdul Rahman',
    established: '1958',
    type: 'PUBLIC',
    level: 'PRIMARY',
    latitude: 7.9644,
    longitude: -11.7383,
    totalStudents: 856,
    totalTeachers: 32,
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'sch_003',
    name: 'Makeni Technical Institute',
    code: 'MTI003',
    district: 'Bombali',
    province: 'Northern Province',
    address: 'Technical Road, Makeni',
    phone: '+232 71 345 678',
    email: 'info@mti.edu.sl',
    principal: 'Mrs. Mariama Koroma',
    established: '1972',
    type: 'PUBLIC',
    level: 'TECHNICAL',
    latitude: 8.8864,
    longitude: -12.0438,
    totalStudents: 654,
    totalTeachers: 28,
    status: 'ACTIVE',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const district = searchParams.get('district')
    const province = searchParams.get('province')
    const type = searchParams.get('type')
    const level = searchParams.get('level')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let filteredSchools = mockSchools

    // Apply filters
    if (district) {
      filteredSchools = filteredSchools.filter(school => 
        school.district.toLowerCase().includes(district.toLowerCase())
      )
    }

    if (province) {
      filteredSchools = filteredSchools.filter(school => 
        school.province.toLowerCase().includes(province.toLowerCase())
      )
    }

    if (type) {
      filteredSchools = filteredSchools.filter(school => 
        school.type.toLowerCase() === type.toLowerCase()
      )
    }

    if (level) {
      filteredSchools = filteredSchools.filter(school => 
        school.level.toLowerCase() === level.toLowerCase()
      )
    }

    // Apply pagination
    const paginatedSchools = filteredSchools.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedSchools,
      pagination: {
        total: filteredSchools.length,
        limit,
        offset,
        hasMore: offset + limit < filteredSchools.length
      }
    })
  } catch (error) {
    console.error('Error fetching schools:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch schools' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'code', 'district', 'province', 'type', 'level']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check if school code already exists
    const existingSchool = mockSchools.find(school => school.code === body.code)
    if (existingSchool) {
      return NextResponse.json(
        { success: false, error: 'School code already exists' },
        { status: 409 }
      )
    }

    // Create new school
    const newSchool = {
      id: `sch_${Date.now()}`,
      ...body,
      totalStudents: 0,
      totalTeachers: 0,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In a real app, this would be saved to the database
    mockSchools.push(newSchool)

    return NextResponse.json({
      success: true,
      data: newSchool,
      message: 'School created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating school:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create school' },
      { status: 500 }
    )
  }
}
