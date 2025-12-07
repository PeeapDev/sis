import { NextRequest, NextResponse } from 'next/server'
import { SolanaService } from '@/lib/solana'
import { prisma } from '@/lib/prisma'

const solanaService = new SolanaService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      certificateNo, 
      studentId, 
      studentName, 
      programName, 
      graduationYear, 
      classOfDegree, 
      cgpa 
    } = body

    // Validate required fields for certificate issuance
    if (!certificateNo || !studentId || !studentName || !programName || !graduationYear || !classOfDegree || cgpa === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields for certificate issuance' },
        { status: 400 }
      )
    }

    // Issue certificate on Solana
    const result = await solanaService.issueCertificate({
      certificateNo,
      studentId,
      studentName,
      programName,
      graduationYear,
      classOfDegree,
      cgpa,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to issue certificate on Solana' },
        { status: 500 }
      )
    }

    // Save certificate record to database
    const blockchainRecord = await prisma.blockchainRecord.create({
      data: {
        studentId,
        schoolId: 'SIS_DEFAULT', // TODO: get from context
        recordType: 'CERTIFICATE',
        dataHash: certificateNo, // TODO: compute proper hash
        transactionHash: result.signature!,
        blockNumber: result.slot || 0,
        contractAddress: process.env.SOLANA_PROGRAM_ID || 'Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcfkg486z765hjV',
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Certificate issued successfully on Solana',
      record: blockchainRecord,
      explorerUrl: `https://explorer.solana.com/tx/${result.signature}?cluster=devnet`,
    })

  } catch (error) {
    console.error('Issue certificate error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
