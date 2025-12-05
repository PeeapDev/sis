import { NextRequest, NextResponse } from 'next/server'
import { solanaService } from '@/lib/solana'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const amount = body.amount || 1

    // Request airdrop
    const result = await solanaService.requestAirdrop(amount)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        signature: result.signature,
        amount,
        message: `Successfully airdropped ${amount} SOL`
      }
    })

  } catch (error) {
    console.error('Airdrop API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to request airdrop' },
      { status: 500 }
    )
  }
}
