// Certificate Service for Academic Credential Verification
import { prisma } from './prisma'
import { SolanaService } from './solana'
import crypto from 'crypto'
import QRCode from 'qrcode'

const solanaService = new SolanaService()

// Generate a unique verification code (e.g., "ABC123XYZ")
function generateVerificationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Exclude confusing chars
  let code = ''
  for (let i = 0; i < 9; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// Generate certificate number (e.g., "USL-2024-00001")
function generateCertificateNo(institutionCode: string, year: number, sequence: number): string {
  return `${institutionCode}-${year}-${String(sequence).padStart(5, '0')}`
}

// Hash certificate data for blockchain storage
function hashCertificateData(data: any): string {
  const normalized = JSON.stringify(data, Object.keys(data).sort())
  return crypto.createHash('sha256').update(normalized).digest('hex')
}

export interface IssueCertificateInput {
  institutionId: string
  issuedById: string
  studentName: string
  studentId?: string
  dateOfBirth?: Date
  nationalId?: string
  programName: string
  programType: 'CERTIFICATE' | 'DIPLOMA' | 'ASSOCIATE_DEGREE' | 'BACHELORS' | 'MASTERS' | 'DOCTORATE' | 'PROFESSIONAL'
  classOfDegree?: string
  cgpa?: number
  graduationDate: Date
  startDate?: Date
  endDate?: Date
  metadata?: any
}

export interface VerifyCertificateResult {
  valid: boolean
  status: 'VALID' | 'INVALID' | 'REVOKED' | 'NOT_FOUND' | 'ERROR'
  certificate?: {
    certificateNo: string
    studentName: string
    programName: string
    programType: string
    classOfDegree?: string
    cgpa?: number
    graduationDate: Date
    institution: {
      name: string
      code: string
      type: string
    }
    status: string
    issuedAt: Date
    blockchainVerified: boolean
    transactionHash?: string
  }
  message: string
}

export class CertificateService {
  
  // Issue a new certificate
  async issueCertificate(input: IssueCertificateInput): Promise<{
    success: boolean
    certificate?: any
    error?: string
  }> {
    try {
      // Get institution
      const institution = await prisma.institution.findUnique({
        where: { id: input.institutionId }
      })
      
      if (!institution) {
        return { success: false, error: 'Institution not found' }
      }

      // Get issuer
      const issuer = await prisma.institutionUser.findUnique({
        where: { id: input.issuedById },
        include: { user: true }
      })

      if (!issuer || !issuer.canIssue) {
        return { success: false, error: 'User not authorized to issue certificates' }
      }

      // Generate certificate number
      const year = input.graduationDate.getFullYear()
      const count = await prisma.certificate.count({
        where: {
          institutionId: input.institutionId,
          graduationDate: {
            gte: new Date(year, 0, 1),
            lt: new Date(year + 1, 0, 1)
          }
        }
      })
      const certificateNo = generateCertificateNo(institution.code, year, count + 1)
      
      // Generate verification code
      let verificationCode = generateVerificationCode()
      // Ensure uniqueness
      while (await prisma.certificate.findUnique({ where: { verificationCode } })) {
        verificationCode = generateVerificationCode()
      }

      // Create data hash for blockchain
      const certData = {
        certificateNo,
        studentName: input.studentName,
        studentId: input.studentId,
        programName: input.programName,
        programType: input.programType,
        classOfDegree: input.classOfDegree,
        cgpa: input.cgpa,
        graduationDate: input.graduationDate.toISOString(),
        institutionCode: institution.code,
        institutionName: institution.name
      }
      const dataHash = hashCertificateData(certData)

      // Create certificate in database
      const certificate = await prisma.certificate.create({
        data: {
          certificateNo,
          verificationCode,
          studentName: input.studentName,
          studentId: input.studentId,
          dateOfBirth: input.dateOfBirth,
          nationalId: input.nationalId,
          programName: input.programName,
          programType: input.programType,
          classOfDegree: input.classOfDegree,
          cgpa: input.cgpa,
          graduationDate: input.graduationDate,
          startDate: input.startDate,
          endDate: input.endDate,
          institutionId: input.institutionId,
          issuedById: input.issuedById,
          dataHash,
          blockchainStatus: 'PENDING',
          metadata: input.metadata
        },
        include: {
          institution: true,
          issuedBy: { include: { user: true } }
        }
      })

      // Store on blockchain (async, don't wait)
      this.storeOnBlockchain(certificate.id, certData).catch(err => {
        console.error('Blockchain storage failed:', err)
      })

      return { success: true, certificate }
    } catch (error) {
      console.error('Issue certificate error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to issue certificate' 
      }
    }
  }

  // Store certificate on Solana blockchain
  private async storeOnBlockchain(certificateId: string, certData: any): Promise<void> {
    try {
      const result = await solanaService.issueCertificate({
        certificateNo: certData.certificateNo,
        studentId: certData.studentId || '',
        studentName: certData.studentName,
        programName: certData.programName,
        graduationYear: new Date(certData.graduationDate).getFullYear(),
        classOfDegree: certData.classOfDegree || '',
        cgpa: certData.cgpa || 0
      })

      if (result.success && result.signature) {
        await prisma.certificate.update({
          where: { id: certificateId },
          data: {
            transactionHash: result.signature,
            blockchainStatus: 'CONFIRMED'
          }
        })
      } else {
        await prisma.certificate.update({
          where: { id: certificateId },
          data: { blockchainStatus: 'FAILED' }
        })
      }
    } catch (error) {
      console.error('Blockchain storage error:', error)
      await prisma.certificate.update({
        where: { id: certificateId },
        data: { blockchainStatus: 'FAILED' }
      })
    }
  }

  // Verify a certificate
  async verifyCertificate(
    query: { verificationCode?: string; certificateNo?: string },
    verifierInfo?: { ip?: string; agent?: string; org?: string }
  ): Promise<VerifyCertificateResult> {
    try {
      const certificate = await prisma.certificate.findFirst({
        where: query.verificationCode 
          ? { verificationCode: query.verificationCode }
          : { certificateNo: query.certificateNo },
        include: {
          institution: true
        }
      })

      // Log verification attempt
      const method = query.verificationCode ? 'VERIFICATION_CODE' : 'CERTIFICATE_NO'
      
      if (!certificate) {
        await this.logVerification(null, method, 'NOT_FOUND', verifierInfo)
        return {
          valid: false,
          status: 'NOT_FOUND',
          message: 'Certificate not found. Please check the verification code or certificate number.'
        }
      }

      // Check if revoked
      if (certificate.status === 'REVOKED') {
        await this.logVerification(certificate.id, method, 'REVOKED', verifierInfo)
        return {
          valid: false,
          status: 'REVOKED',
          certificate: this.formatCertificateResponse(certificate),
          message: `This certificate was revoked on ${certificate.revokedAt?.toLocaleDateString()}. Reason: ${certificate.revokedReason || 'Not specified'}`
        }
      }

      // Check if suspended
      if (certificate.status === 'SUSPENDED') {
        await this.logVerification(certificate.id, method, 'INVALID', verifierInfo)
        return {
          valid: false,
          status: 'INVALID',
          certificate: this.formatCertificateResponse(certificate),
          message: 'This certificate is currently suspended pending review.'
        }
      }

      // Valid certificate
      await this.logVerification(certificate.id, method, 'VALID', verifierInfo)
      return {
        valid: true,
        status: 'VALID',
        certificate: this.formatCertificateResponse(certificate),
        message: 'Certificate verified successfully. This is an authentic credential.'
      }
    } catch (error) {
      console.error('Verify certificate error:', error)
      return {
        valid: false,
        status: 'ERROR',
        message: 'An error occurred during verification. Please try again.'
      }
    }
  }

  private formatCertificateResponse(cert: any) {
    return {
      certificateNo: cert.certificateNo,
      studentName: cert.studentName,
      programName: cert.programName,
      programType: cert.programType,
      classOfDegree: cert.classOfDegree,
      cgpa: cert.cgpa,
      graduationDate: cert.graduationDate,
      institution: {
        name: cert.institution.name,
        code: cert.institution.code,
        type: cert.institution.type
      },
      status: cert.status,
      issuedAt: cert.createdAt,
      blockchainVerified: cert.blockchainStatus === 'CONFIRMED',
      transactionHash: cert.transactionHash
    }
  }

  private async logVerification(
    certificateId: string | null,
    method: string,
    result: string,
    verifierInfo?: { ip?: string; agent?: string; org?: string }
  ) {
    if (certificateId) {
      await prisma.verificationLog.create({
        data: {
          certificateId,
          method: method as any,
          result: result as any,
          verifierIp: verifierInfo?.ip,
          verifierAgent: verifierInfo?.agent,
          verifierOrg: verifierInfo?.org
        }
      })
    }
  }

  // Revoke a certificate
  async revokeCertificate(
    certificateId: string,
    revokedById: string,
    reason: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const certificate = await prisma.certificate.findUnique({
        where: { id: certificateId }
      })

      if (!certificate) {
        return { success: false, error: 'Certificate not found' }
      }

      if (certificate.status === 'REVOKED') {
        return { success: false, error: 'Certificate is already revoked' }
      }

      // Check if user can revoke
      const revoker = await prisma.institutionUser.findFirst({
        where: {
          id: revokedById,
          institutionId: certificate.institutionId,
          canRevoke: true
        }
      })

      if (!revoker) {
        return { success: false, error: 'User not authorized to revoke certificates' }
      }

      await prisma.certificate.update({
        where: { id: certificateId },
        data: {
          status: 'REVOKED',
          revokedAt: new Date(),
          revokedReason: reason,
          revokedById
        }
      })

      return { success: true }
    } catch (error) {
      console.error('Revoke certificate error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to revoke certificate' 
      }
    }
  }

  // Generate QR code for certificate
  async generateQRCode(certificateId: string, baseUrl: string): Promise<string | null> {
    try {
      const certificate = await prisma.certificate.findUnique({
        where: { id: certificateId }
      })

      if (!certificate) return null

      const verifyUrl = `${baseUrl}/verify/${certificate.verificationCode}`
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })

      // Update certificate with QR code URL
      await prisma.certificate.update({
        where: { id: certificateId },
        data: { qrCodeUrl: qrDataUrl }
      })

      return qrDataUrl
    } catch (error) {
      console.error('Generate QR code error:', error)
      return null
    }
  }

  // Get certificates for an institution
  async getInstitutionCertificates(
    institutionId: string,
    options?: {
      page?: number
      limit?: number
      status?: string
      search?: string
    }
  ) {
    const page = options?.page || 1
    const limit = options?.limit || 20
    const skip = (page - 1) * limit

    const where: any = { institutionId }
    
    if (options?.status) {
      where.status = options.status
    }
    
    if (options?.search) {
      where.OR = [
        { studentName: { contains: options.search, mode: 'insensitive' } },
        { certificateNo: { contains: options.search, mode: 'insensitive' } },
        { verificationCode: { contains: options.search, mode: 'insensitive' } }
      ]
    }

    const [certificates, total] = await Promise.all([
      prisma.certificate.findMany({
        where,
        include: {
          institution: true,
          issuedBy: { include: { user: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.certificate.count({ where })
    ])

    return {
      certificates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  }

  // Get verification statistics
  async getVerificationStats(institutionId?: string) {
    const where = institutionId ? { certificate: { institutionId } } : {}
    
    const [total, valid, invalid, revoked] = await Promise.all([
      prisma.verificationLog.count({ where }),
      prisma.verificationLog.count({ where: { ...where, result: 'VALID' } }),
      prisma.verificationLog.count({ where: { ...where, result: 'INVALID' } }),
      prisma.verificationLog.count({ where: { ...where, result: 'REVOKED' } })
    ])

    // Get recent verifications
    const recent = await prisma.verificationLog.findMany({
      where,
      include: { certificate: { include: { institution: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return {
      total,
      valid,
      invalid,
      revoked,
      recent
    }
  }
}

export const certificateService = new CertificateService()
