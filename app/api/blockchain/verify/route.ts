import { NextRequest, NextResponse } from 'next/server'
import { blockchainService } from '@/lib/blockchain'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.recordData && !body.transactionHash) {
      return NextResponse.json(
        { success: false, error: 'Either recordData or transactionHash is required' },
        { status: 400 }
      )
    }

    let verificationResult

    if (body.recordData) {
      // Verify by record data
      verificationResult = await blockchainService.verifyRecord(body.recordData)
    } else {
      // Verify by transaction hash
      const transactionResult = await blockchainService.getTransactionDetails(body.transactionHash)
      if (!transactionResult.success) {
        return NextResponse.json(
          { success: false, error: 'Transaction not found' },
          { status: 404 }
        )
      }
      
      verificationResult = {
        success: true,
        verified: transactionResult.transaction.receipt.status === '0x1',
        transactionDetails: transactionResult.transaction
      }
    }

    if (!verificationResult.success) {
      return NextResponse.json(
        { success: false, error: verificationResult.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      verified: verificationResult.verified,
      data: {
        verified: verificationResult.verified,
        timestamp: new Date().toISOString(),
        ...(verificationResult.transactionDetails && {
          transactionDetails: verificationResult.transactionDetails
        })
      },
      message: verificationResult.verified 
        ? 'Record verified successfully on blockchain' 
        : 'Record not found on blockchain'
    })

  } catch (error) {
    console.error('Blockchain verification API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify record on blockchain' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const transactionHash = searchParams.get('transactionHash')

    if (!studentId && !transactionHash) {
      return NextResponse.json(
        { success: false, error: 'Either studentId or transactionHash is required' },
        { status: 400 }
      )
    }

    if (studentId) {
      // Get all records for a student
      const result = await blockchainService.getStudentRecords(studentId)
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: result.records,
        message: `Found ${result.records?.length || 0} blockchain records for student`
      })
    }

    if (transactionHash) {
      // Get specific transaction details
      const result = await blockchainService.getTransactionDetails(transactionHash)
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: result.transaction,
        message: 'Transaction details retrieved successfully'
      })
    }

  } catch (error) {
    console.error('Blockchain verification GET API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve blockchain data' },
      { status: 500 }
    )
  }
}
