import { NextRequest, NextResponse } from 'next/server'
import { blockchainService } from '@/lib/blockchain'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hash = searchParams.get('hash')

    if (!hash) {
      return NextResponse.json({ success: false, error: 'Missing transaction hash' }, { status: 400 })
    }

    const result = await blockchainService.getTransactionDetails(hash)
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || 'Failed to fetch transaction' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.transaction })
  } catch (error) {
    console.error('GET /api/blockchain/tx error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
