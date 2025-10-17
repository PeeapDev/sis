import { NextRequest, NextResponse } from 'next/server'

// Mock transaction details for demo
const mockTransactionDetails: Record<string, any> = {
  '5KJp3F2mWXfE4vN9qRtYzLhBnPxCwDaGsUjVkMbHgTrE': {
    signature: '5KJp3F2mWXfE4vN9qRtYzLhBnPxCwDaGsUjVkMbHgTrE',
    slot: 245678901,
    blockTime: 1697365800,
    confirmationStatus: 'finalized',
    err: null,
    memo: 'Student Result Record - STU12345',
    fee: 5000,
    status: 'Success',
    programId: 'SoLXmN9PqRtYzLhBnPxCwDaGsUjVkMbHgTrE3F2mWXfE',
    accounts: ['7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU', 'SoLXmN9PqRtYzLhBnPxCwDaGsUjVkMbHgTrE3F2mWXfE'],
    data: {
      recordType: 'RESULT',
      studentId: 'STU12345',
      schoolId: 'SCH001',
      dataHash: '0x8f3e9c2a1b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f'
    }
  },
  '7MNp5H4nYZgF6wP0rSuAzMiCoPyDxEbHtVlWnOcIhUsF': {
    signature: '7MNp5H4nYZgF6wP0rSuAzMiCoPyDxEbHtVlWnOcIhUsF',
    slot: 245678902,
    blockTime: 1697452200,
    confirmationStatus: 'finalized',
    err: null,
    memo: 'Student Enrollment Record - STU67890',
    fee: 5000,
    status: 'Success',
    programId: 'SoLXmN9PqRtYzLhBnPxCwDaGsUjVkMbHgTrE3F2mWXfE',
    accounts: ['8yLYuh3DX98e08UKTEqcC6kCfRvA94UZSktqB9pthBtV', 'SoLXmN9PqRtYzLhBnPxCwDaGsUjVkMbHgTrE3F2mWXfE'],
    data: {
      recordType: 'ENROLLMENT',
      studentId: 'STU67890',
      schoolId: 'SCH002',
      dataHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hash = searchParams.get('hash')

    if (!hash) {
      return NextResponse.json({ success: false, error: 'Missing transaction hash' }, { status: 400 })
    }

    // Return mock transaction details
    const transaction = mockTransactionDetails[hash] || {
      signature: hash,
      slot: 245678900,
      blockTime: Date.now() / 1000,
      confirmationStatus: 'finalized',
      err: null,
      memo: 'Blockchain Record',
      fee: 5000,
      status: 'Success',
      programId: 'SoLXmN9PqRtYzLhBnPxCwDaGsUjVkMbHgTrE3F2mWXfE',
      accounts: ['DefaultAccountAddress'],
      data: {
        recordType: 'UNKNOWN',
        note: 'Mock transaction data for demo purposes'
      }
    }

    return NextResponse.json({ success: true, data: transaction })
  } catch (error) {
    console.error('GET /api/blockchain/tx error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
