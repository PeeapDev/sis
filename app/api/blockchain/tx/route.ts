import { NextRequest, NextResponse } from 'next/server'
import { solanaService, solanaUtils } from '@/lib/solana'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const signature = searchParams.get('hash') || searchParams.get('signature')

    if (!signature) {
      return NextResponse.json({ success: false, error: 'Missing transaction signature' }, { status: 400 })
    }

    // Get real transaction details from Solana
    const result = await solanaService.getTransactionDetails(signature)
    
    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: result.error || 'Transaction not found' 
      }, { status: 404 })
    }

    const network = process.env.SOLANA_NETWORK || 'devnet'

    return NextResponse.json({ 
      success: true, 
      data: {
        ...result.transaction,
        explorerUrl: solanaUtils.getExplorerUrl(signature, network as any)
      }
    })
  } catch (error) {
    console.error('GET /api/blockchain/tx error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
