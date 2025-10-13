import { NextRequest, NextResponse } from 'next/server'
import { blockchainService } from '@/lib/blockchain'

export async function GET(request: NextRequest) {
  try {
    // Get blockchain connection status
    const connectionStatus = await blockchainService.getConnectionStatus()

    const response = {
      success: true,
      data: {
        blockchain: {
          connected: connectionStatus.connected,
          networkId: connectionStatus.networkId,
          currentBlock: connectionStatus.blockNumber,
          contractAddress: process.env.SMART_CONTRACT_ADDRESS,
          providerUrl: process.env.WEB3_PROVIDER_URL ? 'Connected' : 'Not configured'
        },
        features: {
          storeRecords: connectionStatus.connected,
          verifyRecords: connectionStatus.connected,
          retrieveRecords: connectionStatus.connected,
          certificateGeneration: true,
          qrCodeVerification: true
        },
        statistics: {
          // In a real application, these would come from your database
          totalRecordsStored: 0,
          totalStudentsWithRecords: 0,
          totalSchoolsConnected: 0,
          lastRecordStored: null
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
