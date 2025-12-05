import { NextRequest, NextResponse } from 'next/server'
import { solanaService, solanaUtils } from '@/lib/solana'
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

    // Store record on Solana blockchain
    const result = await solanaService.storeEducationRecord({
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
    const network = process.env.SOLANA_NETWORK || 'devnet'
    const blockchainRecord = await prisma.blockchainRecord.create({
      data: {
        schoolId: body.schoolId,
        studentId: body.studentId,
        recordType: body.recordType,
        dataHash: result.dataHash as string,
        transactionHash: result.signature as string,
        blockNumber: Number(result.slot),
        contractAddress: `solana:${network}` // Store network info instead of contract address
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        blockchainRecord,
        signature: result.signature,
        slot: result.slot,
        explorerUrl: solanaUtils.getExplorerUrl(result.signature as string, network as any)
      },
      message: 'Record successfully stored on Solana blockchain'
    }, { status: 201 })

  } catch (error) {
    console.error('Blockchain storage API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to store record on Solana blockchain' },
      { status: 500 }
    )
  }
}
