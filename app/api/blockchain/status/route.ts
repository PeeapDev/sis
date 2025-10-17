import { NextRequest, NextResponse } from 'next/server'
import { blockchainService } from '@/lib/blockchain'
import { prisma } from '@/lib/prisma'
import { getBlockchainConfigStatus } from '@/lib/env'

export async function GET(request: NextRequest) {
  try {
    // Get blockchain connection status
    const connectionStatus = await blockchainService.getConnectionStatus()
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
          connected: connectionStatus.connected,
          networkId: connectionStatus.networkId,
          currentBlock: connectionStatus.blockNumber,
          contractAddress: connectionStatus.contractAddress,
          providerConfigured: config.providerConfigured,
          accountConfigured: config.accountConfigured,
          contractConfigured: config.contractConfigured,
          missingConfig: config.missing
        },
        features: {
          storeRecords: connectionStatus.connected && Boolean(process.env.SMART_CONTRACT_ADDRESS) && Boolean(process.env.BLOCKCHAIN_PRIVATE_KEY),
          verifyRecords: Boolean(process.env.WEB3_PROVIDER_URL),
          retrieveRecords: Boolean(process.env.WEB3_PROVIDER_URL),
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
        ? 'Blockchain service is operational' 
        : 'Blockchain service is not available'
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('Blockchain status API error:', error)
    return NextResponse.json({
      success: false,
      data: {
        blockchain: {
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
