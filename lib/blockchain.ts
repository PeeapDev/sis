// Blockchain integration for Sierra Leone SIS
// This module handles storing and retrieving educational records on the blockchain

import Web3 from 'web3'

// Smart contract ABI for educational records
const EDUCATION_RECORD_ABI = [
  {
    "inputs": [
      {"name": "_studentId", "type": "string"},
      {"name": "_schoolId", "type": "string"},
      {"name": "_recordType", "type": "string"},
      {"name": "_dataHash", "type": "string"},
      {"name": "_timestamp", "type": "uint256"}
    ],
    "name": "storeRecord",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "_studentId", "type": "string"}],
    "name": "getStudentRecords",
    "outputs": [
      {
        "components": [
          {"name": "studentId", "type": "string"},
          {"name": "schoolId", "type": "string"},
          {"name": "recordType", "type": "string"},
          {"name": "dataHash", "type": "string"},
          {"name": "timestamp", "type": "uint256"},
          {"name": "blockNumber", "type": "uint256"}
        ],
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "_dataHash", "type": "string"}],
    "name": "verifyRecord",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
]

export class BlockchainService {
  private web3: Web3
  private contract: any
  private account: string

  constructor() {
    // Initialize Web3 with provider (Polygon/Ethereum)
    const providerUrl = process.env.WEB3_PROVIDER_URL || 'https://polygon-mainnet.g.alchemy.com/v2/your-api-key'
    this.web3 = new Web3(new Web3.providers.HttpProvider(providerUrl))
    
    // Initialize contract
    const contractAddress = process.env.SMART_CONTRACT_ADDRESS || '0x...'
    this.contract = new this.web3.eth.Contract(EDUCATION_RECORD_ABI, contractAddress)
    
    // Set account from private key
    const privateKey = process.env.BLOCKCHAIN_PRIVATE_KEY
    if (privateKey) {
      const account = this.web3.eth.accounts.privateKeyToAccount(privateKey)
      this.web3.eth.accounts.wallet.add(account)
      this.account = account.address
    }
  }

  /**
   * Store an educational record on the blockchain
   */
  async storeEducationRecord(data: {
    studentId: string
    schoolId: string
    recordType: 'RESULT' | 'ENROLLMENT' | 'CERTIFICATE' | 'TRANSCRIPT'
    recordData: any
  }): Promise<{
    success: boolean
    transactionHash?: string
    blockNumber?: number
    error?: string
  }> {
    try {
      // Create hash of the record data
      const dataHash = this.web3.utils.keccak256(JSON.stringify(data.recordData))
      const timestamp = Math.floor(Date.now() / 1000)

      // Estimate gas
      const gasEstimate = await this.contract.methods
        .storeRecord(data.studentId, data.schoolId, data.recordType, dataHash, timestamp)
        .estimateGas({ from: this.account })

      // Send transaction
      const transaction = await this.contract.methods
        .storeRecord(data.studentId, data.schoolId, data.recordType, dataHash, timestamp)
        .send({
          from: this.account,
          gas: Math.floor(gasEstimate * 1.2), // Add 20% buffer
          gasPrice: await this.web3.eth.getGasPrice()
        })

      return {
        success: true,
        transactionHash: transaction.transactionHash,
        blockNumber: transaction.blockNumber
      }
    } catch (error) {
      console.error('Blockchain storage error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown blockchain error'
      }
    }
  }

  /**
   * Retrieve all records for a student from the blockchain
   */
  async getStudentRecords(studentId: string): Promise<{
    success: boolean
    records?: Array<{
      studentId: string
      schoolId: string
      recordType: string
      dataHash: string
      timestamp: number
      blockNumber: number
    }>
    error?: string
  }> {
    try {
      const records = await this.contract.methods
        .getStudentRecords(studentId)
        .call()

      return {
        success: true,
        records: records.map((record: any) => ({
          studentId: record.studentId,
          schoolId: record.schoolId,
          recordType: record.recordType,
          dataHash: record.dataHash,
          timestamp: parseInt(record.timestamp),
          blockNumber: parseInt(record.blockNumber)
        }))
      }
    } catch (error) {
      console.error('Blockchain retrieval error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown blockchain error'
      }
    }
  }

  /**
   * Verify if a record exists on the blockchain
   */
  async verifyRecord(recordData: any): Promise<{
    success: boolean
    verified?: boolean
    error?: string
  }> {
    try {
      const dataHash = this.web3.utils.keccak256(JSON.stringify(recordData))
      const verified = await this.contract.methods
        .verifyRecord(dataHash)
        .call()

      return {
        success: true,
        verified
      }
    } catch (error) {
      console.error('Blockchain verification error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown blockchain error'
      }
    }
  }

  /**
   * Get transaction details
   */
  async getTransactionDetails(transactionHash: string): Promise<{
    success: boolean
    transaction?: any
    error?: string
  }> {
    try {
      const transaction = await this.web3.eth.getTransaction(transactionHash)
      const receipt = await this.web3.eth.getTransactionReceipt(transactionHash)

      return {
        success: true,
        transaction: {
          ...transaction,
          receipt
        }
      }
    } catch (error) {
      console.error('Transaction lookup error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown blockchain error'
      }
    }
  }

  /**
   * Generate a certificate hash for blockchain storage
   */
  generateCertificateHash(certificateData: {
    studentId: string
    studentName: string
    schoolId: string
    schoolName: string
    qualification: string
    dateIssued: string
    grades: Array<{ subject: string; grade: string; score: number }>
  }): string {
    return this.web3.utils.keccak256(JSON.stringify(certificateData))
  }

  /**
   * Check blockchain connection status
   */
  async getConnectionStatus(): Promise<{
    connected: boolean
    networkId?: number
    blockNumber?: number
    error?: string
  }> {
    try {
      const networkId = await this.web3.eth.net.getId()
      const blockNumber = await this.web3.eth.getBlockNumber()

      return {
        connected: true,
        networkId: Number(networkId),
        blockNumber: Number(blockNumber)
      }
    } catch (error) {
      console.error('Blockchain connection error:', error)
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown connection error'
      }
    }
  }
}

// Singleton instance
export const blockchainService = new BlockchainService()

// Utility functions
export const utils = {
  /**
   * Format blockchain address for display
   */
  formatAddress: (address: string): string => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  },

  /**
   * Convert timestamp to readable date
   */
  formatTimestamp: (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString()
  },

  /**
   * Generate QR code data for certificate verification
   */
  generateVerificationQR: (transactionHash: string, dataHash: string): string => {
    return JSON.stringify({
      type: 'SL_SIS_CERTIFICATE',
      transactionHash,
      dataHash,
      verifyUrl: `${process.env.NEXTAUTH_URL}/verify/${transactionHash}`
    })
  }
}
