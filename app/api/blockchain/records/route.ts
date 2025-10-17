import { NextRequest, NextResponse } from 'next/server'

// Mock data for demo purposes (when database is not available)
const mockRecords = [
  {
    id: '1',
    schoolId: 'SCH001',
    studentId: 'STU12345',
    recordType: 'RESULT',
    dataHash: '0x8f3e9c2a1b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f',
    transactionHash: '5KJp3F2mWXfE4vN9qRtYzLhBnPxCwDaGsUjVkMbHgTrE',
    blockNumber: 245678901,
    contractAddress: 'SoLXmN9PqRtYzLhBnPxCwDaGsUjVkMbHgTrE3F2mWXfE',
    createdAt: new Date('2024-10-15T10:30:00Z').toISOString()
  },
  {
    id: '2',
    schoolId: 'SCH002',
    studentId: 'STU67890',
    recordType: 'ENROLLMENT',
    dataHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    transactionHash: '7MNp5H4nYZgF6wP0rSuAzMiCoPyDxEbHtVlWnOcIhUsF',
    blockNumber: 245678902,
    contractAddress: 'SoLXmN9PqRtYzLhBnPxCwDaGsUjVkMbHgTrE3F2mWXfE',
    createdAt: new Date('2024-10-16T14:20:00Z').toISOString()
  },
  {
    id: '3',
    schoolId: 'SCH001',
    studentId: 'STU11111',
    recordType: 'CERTIFICATE',
    dataHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
    transactionHash: '9PQr7J6pABhG8xQ2tTvBzNjDpQzEyFcIuWmXoPdJiVtG',
    blockNumber: 245678903,
    contractAddress: 'SoLXmN9PqRtYzLhBnPxCwDaGsUjVkMbHgTrE3F2mWXfE',
    createdAt: new Date('2024-10-17T09:15:00Z').toISOString()
  },
  {
    id: '4',
    schoolId: 'SCH003',
    studentId: 'STU22222',
    recordType: 'TRANSCRIPT',
    dataHash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
    transactionHash: '2RSt9L8qBCiH0yR4uUwCzOkEqRzFzGdJvXnYpQeKjWuH',
    blockNumber: 245678904,
    contractAddress: 'SoLXmN9PqRtYzLhBnPxCwDaGsUjVkMbHgTrE3F2mWXfE',
    createdAt: new Date('2024-10-17T16:45:00Z').toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId') || undefined
    const schoolId = searchParams.get('schoolId') || undefined
    const recordType = searchParams.get('recordType') || undefined
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100)
    const offset = parseInt(searchParams.get('offset') || '0')

    // Filter mock records based on query parameters
    let filteredRecords = [...mockRecords]
    
    if (studentId) {
      filteredRecords = filteredRecords.filter(r => r.studentId === studentId)
    }
    if (schoolId) {
      filteredRecords = filteredRecords.filter(r => r.schoolId === schoolId)
    }
    if (recordType) {
      filteredRecords = filteredRecords.filter(r => r.recordType === recordType)
    }

    const total = filteredRecords.length
    const records = filteredRecords.slice(offset, offset + limit)

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
