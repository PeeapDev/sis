// Solana blockchain integration for Sierra Leone SIS
// This module handles storing and retrieving educational records on Solana

import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import bs58 from 'bs58'
import crypto from 'crypto'

// Network endpoints
const NETWORKS = {
  'devnet': 'https://api.devnet.solana.com',
  'testnet': 'https://api.testnet.solana.com',
  'mainnet-beta': 'https://api.mainnet-beta.solana.com',
}

export type SolanaNetwork = keyof typeof NETWORKS

export class SolanaService {
  private connection: Connection
  private payer?: Keypair
  private network: SolanaNetwork
  private programId: PublicKey

  constructor() {
    // Get network from env or default to devnet
    this.network = (process.env.SOLANA_NETWORK as SolanaNetwork) || 'devnet'
    const rpcUrl = process.env.SOLANA_RPC_URL || NETWORKS[this.network]
    
    this.connection = new Connection(rpcUrl, 'confirmed')

    // Initialize program ID from env
    const programIdStr = process.env.SOLANA_PROGRAM_ID || 'CpWHMiZzwQqanVxQxx1DD4GvQzxovP9xtUSu8sz1dg6e'
    this.programId = new PublicKey(programIdStr)

    // Initialize payer wallet from private key
    const privateKey = process.env.SOLANA_PRIVATE_KEY
    if (privateKey) {
      try {
        // Support both base58 and JSON array formats
        if (privateKey.startsWith('[')) {
          const secretKey = new Uint8Array(JSON.parse(privateKey))
          this.payer = Keypair.fromSecretKey(secretKey)
        } else {
          const secretKey = bs58.decode(privateKey)
          this.payer = Keypair.fromSecretKey(secretKey)
        }
      } catch (error) {
        console.error('Failed to parse Solana private key:', error)
      }
    }
  }

  /**
   * Generate a hash of the record data
   */
  private hashData(data: any): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex')
  }

  /**
   * Issue a certificate on-chain via the SIS Certificate Program
   * This creates a structured certificate record on Solana
   */
  async issueCertificate(data: {
    certificateNo: string
    studentId: string
    studentName: string
    programName: string
    graduationYear: number
    classOfDegree: string
    cgpa: number
  }): Promise<{
    success: boolean
    signature?: string
    slot?: number
    error?: string
  }> {
    // Placeholder implementation until program is deployed
    try {
      if (!this.payer) {
        return { success: false, error: 'Solana wallet not configured. Set SOLANA_PRIVATE_KEY.' }
      }

      // TODO: Implement actual program call using Anchor client
      // For now, fall back to memo-based storage
      const memoData = JSON.stringify({
        type: 'SL_SIS_CERTIFICATE',
        ...data,
        issuedBy: this.payer.publicKey.toString(),
        issuedAt: Date.now(),
      })

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: this.payer.publicKey,
          toPubkey: this.payer.publicKey,
          lamports: 0,
        })
      )

      const MEMO_PROGRAM_ID = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr')
      transaction.add({
        keys: [{ pubkey: this.payer.publicKey, isSigner: true, isWritable: false }],
        programId: MEMO_PROGRAM_ID,
        data: Buffer.from(memoData),
      })

      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.payer],
        { commitment: 'confirmed' }
      )

      const txDetails = await this.connection.getTransaction(signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0,
      })

      return {
        success: true,
        signature,
        slot: txDetails?.slot,
      }
    } catch (error) {
      console.error('Certificate issuance error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown Solana error',
      }
    }
  }

  /**
   * Verify a record exists on Solana by checking the transaction
   */
  async verifyRecord(signature: string, expectedHash?: string): Promise<{
    success: boolean
    verified?: boolean
    recordData?: any
    error?: string
  }> {
    try {
      const tx = await this.connection.getTransaction(signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0,
      })

      if (!tx) {
        return { success: true, verified: false }
      }

      // Parse memo from transaction logs
      const memoLog = tx.meta?.logMessages?.find(log => log.includes('SL_SIS_RECORD'))
      
      if (memoLog) {
        // Extract JSON from memo log
        const jsonMatch = memoLog.match(/\{.*\}/)
        if (jsonMatch) {
          const recordData = JSON.parse(jsonMatch[0])
          
          // If expected hash provided, verify it matches
          if (expectedHash && recordData.dataHash !== expectedHash) {
            return { success: true, verified: false, recordData }
          }
          
          return { success: true, verified: true, recordData }
        }
      }

      return { success: true, verified: true }
    } catch (error) {
      console.error('Solana verification error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown verification error',
      }
    }
  }

  /**
   * Get transaction details
   */
  async getTransactionDetails(signature: string): Promise<{
    success: boolean
    transaction?: any
    error?: string
  }> {
    try {
      const tx = await this.connection.getTransaction(signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0,
      })

      if (!tx) {
        return { success: false, error: 'Transaction not found' }
      }

      return {
        success: true,
        transaction: {
          signature,
          slot: tx.slot,
          blockTime: tx.blockTime,
          fee: tx.meta?.fee,
          status: tx.meta?.err ? 'failed' : 'success',
          logs: tx.meta?.logMessages,
        },
      }
    } catch (error) {
      console.error('Transaction lookup error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Check Solana connection status
   */
  async getConnectionStatus(): Promise<{
    connected: boolean
    network: string
    slot?: number
    walletAddress?: string
    balance?: number
    error?: string
  }> {
    try {
      const slot = await this.connection.getSlot()
      
      let balance: number | undefined
      if (this.payer) {
        balance = await this.connection.getBalance(this.payer.publicKey)
      }

      return {
        connected: true,
        network: this.network,
        slot,
        walletAddress: this.payer?.publicKey.toBase58(),
        balance: balance ? balance / LAMPORTS_PER_SOL : undefined,
      }
    } catch (error) {
      console.error('Solana connection error:', error)
      return {
        connected: false,
        network: this.network,
        error: error instanceof Error ? error.message : 'Unknown connection error',
      }
    }
  }

  /**
   * Request airdrop (devnet/testnet only)
   */
  async requestAirdrop(amount: number = 1): Promise<{
    success: boolean
    signature?: string
    error?: string
  }> {
    try {
      if (this.network === 'mainnet-beta') {
        return { success: false, error: 'Airdrop not available on mainnet' }
      }

      if (!this.payer) {
        return { success: false, error: 'Wallet not configured' }
      }

      const signature = await this.connection.requestAirdrop(
        this.payer.publicKey,
        amount * LAMPORTS_PER_SOL
      )

      await this.connection.confirmTransaction(signature, 'confirmed')

      return { success: true, signature }
    } catch (error) {
      console.error('Airdrop error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Airdrop failed',
      }
    }
  }

  /**
   * Generate a new keypair (for creating test wallets)
   */
  static generateKeypair(): { publicKey: string; privateKey: string } {
    const keypair = Keypair.generate()
    return {
      publicKey: keypair.publicKey.toBase58(),
      privateKey: bs58.encode(keypair.secretKey),
    }
  }
}

// Singleton instance
export const solanaService = new SolanaService()

// Utility functions
export const solanaUtils = {
  /**
   * Format Solana address for display
   */
  formatAddress: (address: string): string => {
    if (!address) return ''
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  },

  /**
   * Get explorer URL for transaction
   */
  getExplorerUrl: (signature: string, network: SolanaNetwork = 'devnet'): string => {
    const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`
    return `https://explorer.solana.com/tx/${signature}${cluster}`
  },

  /**
   * Get explorer URL for address
   */
  getAddressExplorerUrl: (address: string, network: SolanaNetwork = 'devnet'): string => {
    const cluster = network === 'mainnet-beta' ? '' : `?cluster=${network}`
    return `https://explorer.solana.com/address/${address}${cluster}`
  },
}
