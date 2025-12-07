// Seed script for Academic Credential Verification System
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Academic Credential Verification System...')

  // Create demo institutions
  const usl = await prisma.institution.upsert({
    where: { code: 'USL' },
    update: {},
    create: {
      name: 'University of Sierra Leone',
      code: 'USL',
      type: 'UNIVERSITY',
      address: 'Mount Aureol',
      city: 'Freetown',
      country: 'Sierra Leone',
      phone: '+232-22-226-481',
      email: 'info@usl.edu.sl',
      website: 'https://usl.edu.sl',
      accreditationNo: 'MBSSE/HE/001',
      isVerified: true
    }
  })
  console.log('✅ Created University of Sierra Leone')

  const njala = await prisma.institution.upsert({
    where: { code: 'NJALA' },
    update: {},
    create: {
      name: 'Njala University',
      code: 'NJALA',
      type: 'UNIVERSITY',
      address: 'Njala Campus',
      city: 'Bo',
      country: 'Sierra Leone',
      phone: '+232-32-123-456',
      email: 'info@njala.edu.sl',
      website: 'https://njala.edu.sl',
      accreditationNo: 'MBSSE/HE/002',
      isVerified: true
    }
  })
  console.log('✅ Created Njala University')

  const limkokwing = await prisma.institution.upsert({
    where: { code: 'LUCT' },
    update: {},
    create: {
      name: 'Limkokwing University of Creative Technology',
      code: 'LUCT',
      type: 'UNIVERSITY',
      address: 'New England',
      city: 'Freetown',
      country: 'Sierra Leone',
      phone: '+232-22-234-567',
      email: 'info@limkokwing.edu.sl',
      website: 'https://limkokwing.net',
      accreditationNo: 'MBSSE/HE/003',
      isVerified: true
    }
  })
  console.log('✅ Created Limkokwing University')

  // Create demo admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.upsert({
    where: { email: 'registrar@usl.edu.sl' },
    update: {},
    create: {
      email: 'registrar@usl.edu.sl',
      password: hashedPassword,
      name: 'Dr. John Kamara',
      role: 'INSTITUTION_ADMIN'
    }
  })
  console.log('✅ Created admin user: registrar@usl.edu.sl / admin123')

  // Link admin to USL
  await prisma.institutionUser.upsert({
    where: {
      institutionId_userId: {
        institutionId: usl.id,
        userId: adminUser.id
      }
    },
    update: {},
    create: {
      institutionId: usl.id,
      userId: adminUser.id,
      role: 'REGISTRAR',
      canIssue: true,
      canRevoke: true
    }
  })
  console.log('✅ Linked admin to USL as Registrar')

  // Create demo certificates
  const certificates = [
    {
      certificateNo: 'USL-2024-00001',
      verificationCode: 'ABC123XYZ',
      studentName: 'Mohamed Bangura',
      studentId: 'USL/2020/CS/001',
      programName: 'Bachelor of Science in Computer Science',
      programType: 'BACHELORS' as const,
      classOfDegree: 'First Class Honours',
      cgpa: 4.75,
      graduationDate: new Date('2024-07-15'),
      institutionId: usl.id,
      blockchainStatus: 'CONFIRMED' as const,
      dataHash: 'abc123def456'
    },
    {
      certificateNo: 'USL-2024-00002',
      verificationCode: 'DEF456GHI',
      studentName: 'Fatmata Sesay',
      studentId: 'USL/2020/BUS/045',
      programName: 'Bachelor of Business Administration',
      programType: 'BACHELORS' as const,
      classOfDegree: 'Second Class Upper',
      cgpa: 3.85,
      graduationDate: new Date('2024-07-15'),
      institutionId: usl.id,
      blockchainStatus: 'CONFIRMED' as const,
      dataHash: 'ghi789jkl012'
    },
    {
      certificateNo: 'NJALA-2024-00001',
      verificationCode: 'JKL789MNO',
      studentName: 'Ibrahim Conteh',
      studentId: 'NJU/2019/AGR/023',
      programName: 'Bachelor of Science in Agriculture',
      programType: 'BACHELORS' as const,
      classOfDegree: 'Second Class Lower',
      cgpa: 3.25,
      graduationDate: new Date('2024-06-20'),
      institutionId: njala.id,
      blockchainStatus: 'CONFIRMED' as const,
      dataHash: 'mno345pqr678'
    },
    {
      certificateNo: 'LUCT-2024-00001',
      verificationCode: 'PQR012STU',
      studentName: 'Aminata Koroma',
      studentId: 'LUCT/2021/DES/012',
      programName: 'Diploma in Graphic Design',
      programType: 'DIPLOMA' as const,
      classOfDegree: 'Distinction',
      cgpa: 3.90,
      graduationDate: new Date('2024-05-30'),
      institutionId: limkokwing.id,
      blockchainStatus: 'PENDING' as const,
      dataHash: 'stu901vwx234'
    }
  ]

  for (const cert of certificates) {
    await prisma.certificate.upsert({
      where: { certificateNo: cert.certificateNo },
      update: {},
      create: cert
    })
    console.log(`✅ Created certificate: ${cert.certificateNo} for ${cert.studentName}`)
  }

  // Create a revoked certificate for demo
  await prisma.certificate.upsert({
    where: { certificateNo: 'USL-2023-00099' },
    update: {},
    create: {
      certificateNo: 'USL-2023-00099',
      verificationCode: 'REV999XXX',
      studentName: 'John Doe',
      studentId: 'USL/2019/LAW/099',
      programName: 'Bachelor of Laws',
      programType: 'BACHELORS',
      classOfDegree: 'Third Class',
      cgpa: 2.50,
      graduationDate: new Date('2023-07-15'),
      institutionId: usl.id,
      blockchainStatus: 'CONFIRMED',
      dataHash: 'revoked123',
      status: 'REVOKED',
      revokedAt: new Date('2024-01-15'),
      revokedReason: 'Academic misconduct discovered after graduation'
    }
  })
  console.log('✅ Created revoked certificate demo')

  console.log('\n🎉 Seeding completed!')
  console.log('\n📋 Demo Verification Codes:')
  console.log('   ABC123XYZ - Valid (Mohamed Bangura, USL)')
  console.log('   DEF456GHI - Valid (Fatmata Sesay, USL)')
  console.log('   JKL789MNO - Valid (Ibrahim Conteh, Njala)')
  console.log('   PQR012STU - Valid (Aminata Koroma, Limkokwing)')
  console.log('   REV999XXX - Revoked (John Doe, USL)')
  console.log('\n🔐 Admin Login:')
  console.log('   Email: registrar@usl.edu.sl')
  console.log('   Password: admin123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
