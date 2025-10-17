import { NextRequest, NextResponse } from 'next/server'
import { blockchainService } from '@/lib/blockchain'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['studentId', 'schoolId', 'recordType', 'recordData']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate record type
    const validRecordTypes = ['RESULT', 'ENROLLMENT', 'CERTIFICATE', 'TRANSCRIPT']
    if (!validRecordTypes.includes(body.recordType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid record type' },
        { status: 400 }
      )
    }

    // Store record on blockchain
    const result = await blockchainService.storeEducationRecord({
      studentId: body.studentId,
      schoolId: body.schoolId,
      recordType: body.recordType,
      recordData: body.recordData
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }

    // Persist blockchain reference in database
    const blockchainRecord = await prisma.blockchainRecord.create({
      data: {
        schoolId: body.schoolId,
        studentId: body.studentId,
        recordType: body.recordType,
        dataHash: result.dataHash as string,
        transactionHash: result.transactionHash as string,
        blockNumber: Number(result.blockNumber),
        contractAddress: process.env.SMART_CONTRACT_ADDRESS as string
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        blockchainRecord,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber
      },
      message: 'Record successfully stored on blockchain'
    }, { status: 201 })

  } catch (error) {
    console.error('Blockchain storage API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to store record on blockchain' },
      { status: 500 }
    )
  }
}
