import { NextRequest, NextResponse } from 'next/server'
import { solanaService } from '@/lib/solana'
import { prisma } from '@/lib/prisma'
import { getBlockchainConfigStatus } from '@/lib/env'

export async function GET(request: NextRequest) {
  try {
    // Get Solana connection status
    const connectionStatus = await solanaService.getConnectionStatus()
    const config = getBlockchainConfigStatus()

    // Fetch statistics from DB
    const [totalRecordsStored, studentsWithRecordsAgg, schoolsConnectedAgg, lastRecord] = await Promise.all([
      prisma.blockchainRecord.count(),
      prisma.blockchainRecord.groupBy({ by: ['studentId'], _count: { studentId: true }, where: { studentId: { not: null } } }),
      prisma.blockchainRecord.groupBy({ by: ['schoolId'], _count: { schoolId: true } }),
      prisma.blockchainRecord.findFirst({ orderBy: { createdAt: 'desc' } })
    ])

    const response = {
      success: true,
      data: {
        blockchain: {
          type: 'solana',
          connected: connectionStatus.connected,
          network: connectionStatus.network,
          currentSlot: connectionStatus.slot,
          walletAddress: connectionStatus.walletAddress,
          balance: connectionStatus.balance,
          providerConfigured: config.providerConfigured,
          accountConfigured: config.accountConfigured,
          missingConfig: config.missing
        },
        features: {
          storeRecords: connectionStatus.connected && Boolean(process.env.SOLANA_PRIVATE_KEY),
          verifyRecords: connectionStatus.connected,
          retrieveRecords: connectionStatus.connected,
          certificateGeneration: true,
          qrCodeVerification: true
        },
        statistics: {
          totalRecordsStored,
          totalStudentsWithRecords: studentsWithRecordsAgg.length,
          totalSchoolsConnected: schoolsConnectedAgg.length,
          lastRecordStored: lastRecord ? {
            id: lastRecord.id,
            studentId: lastRecord.studentId,
            schoolId: lastRecord.schoolId,
            recordType: lastRecord.recordType,
            blockNumber: lastRecord.blockNumber,
            createdAt: lastRecord.createdAt
          } : null
        }
      },
      message: connectionStatus.connected 
        ? 'Solana blockchain service is operational' 
        : 'Solana blockchain service is not available'
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Blockchain status API error:', error)
    return NextResponse.json({
      success: false,
      data: {
        blockchain: {
          type: 'solana',
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        },
        features: {
          storeRecords: false,
          verifyRecords: false,
          retrieveRecords: false,
          certificateGeneration: false,
          qrCodeVerification: false
        }
      },
      error: 'Failed to get blockchain status'
    }, { status: 500 })
  }
}
