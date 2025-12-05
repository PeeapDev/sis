import { NextRequest, NextResponse } from 'next/server'
import { solanaService, solanaUtils } from '@/lib/solana'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.signature && !body.transactionHash) {
      return NextResponse.json(
        { success: false, error: 'Transaction signature is required' },
        { status: 400 }
      )
    }

    const signature = body.signature || body.transactionHash

    // Verify transaction on Solana
    const verificationResult = await solanaService.verifyRecord(signature, body.expectedHash)

    if (!verificationResult.success) {
      return NextResponse.json(
        { success: false, error: verificationResult.error },
        { status: 500 }
      )
    }

    const network = process.env.SOLANA_NETWORK || 'devnet'

    return NextResponse.json({
      success: true,
      verified: verificationResult.verified,
      data: {
        verified: verificationResult.verified,
        signature,
        recordData: verificationResult.recordData,
        explorerUrl: solanaUtils.getExplorerUrl(signature, network as any),
        timestamp: new Date().toISOString()
      },
      message: verificationResult.verified 
        ? 'Record verified successfully on Solana blockchain' 
        : 'Record not found on Solana blockchain'
    })

  } catch (error) {
    console.error('Blockchain verification API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to verify record on Solana blockchain' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId')
    const signature = searchParams.get('signature') || searchParams.get('transactionHash')

    if (!studentId && !signature) {
      return NextResponse.json(
        { success: false, error: 'Either studentId or signature is required' },
        { status: 400 }
      )
    }

    const network = process.env.SOLANA_NETWORK || 'devnet'

    if (studentId) {
      // Get all records for a student from database
      const records = await prisma.blockchainRecord.findMany({
        where: { studentId },
        orderBy: { createdAt: 'desc' }
      })

      const recordsWithUrls = records.map(record => ({
        ...record,
        explorerUrl: solanaUtils.getExplorerUrl(record.transactionHash, network as any)
      }))

      return NextResponse.json({
        success: true,
        data: recordsWithUrls,
        message: `Found ${records.length} blockchain records for student`
      })
    }

    if (signature) {
      // Get specific transaction details from Solana
      const result = await solanaService.getTransactionDetails(signature)
      
      if (!result.success) {
        return NextResponse.json(
          { success: false, error: result.error },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          ...result.transaction,
          explorerUrl: solanaUtils.getExplorerUrl(signature, network as any)
        },
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
