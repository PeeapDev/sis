import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin users
  const adminPassword = await bcrypt.hash('password123', 10)
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@sis.gov.sl' },
    update: {},
    create: {
      email: 'admin@sis.gov.sl',
      password: adminPassword,
      name: 'System Administrator',
      role: 'SUPER_ADMIN',
      adminProfile: {
        create: {
          level: 'NATIONAL',
        }
      }
    }
  })

  const districtAdmin = await prisma.user.upsert({
    where: { email: 'district@sis.gov.sl' },
    update: {},
    create: {
      email: 'district@sis.gov.sl',
      password: adminPassword,
      name: 'District Administrator',
      role: 'DISTRICT_ADMIN',
      adminProfile: {
        create: {
          level: 'DISTRICT',
          district: 'Western Area',
        }
      }
    }
  })

  // Create schools
  const freetownSecondary = await prisma.school.upsert({
    where: { code: 'FSS001' },
    update: {},
    create: {
      name: 'Freetown Secondary School',
      code: 'FSS001',
      address: '15 Kissy Street, Freetown',
      district: 'Western Area',
      province: 'Western Area',
      latitude: 8.4657,
      longitude: -13.2317,
      phone: '+232 22 123 456',
      email: 'info@fss.edu.sl',
      principal: 'Dr. Fatima Sesay',
      established: new Date('1965-01-01'),
      type: 'PUBLIC',
      level: 'SENIOR_SECONDARY',
    }
  })

  const boGovernment = await prisma.school.upsert({
    where: { code: 'BGS002' },
    update: {},
    create: {
      name: 'Bo Government School',
      code: 'BGS002',
      address: 'Government Road, Bo',
      district: 'Bo',
      province: 'Southern Province',
      latitude: 7.9644,
      longitude: -11.7383,
      phone: '+232 32 234 567',
      email: 'admin@bgs.edu.sl',
      principal: 'Mr. Abdul Rahman',
      established: new Date('1958-01-01'),
      type: 'PUBLIC',
      level: 'PRIMARY',
    }
  })

  const makeniTechnical = await prisma.school.upsert({
    where: { code: 'MTI003' },
    update: {},
    create: {
      name: 'Makeni Technical Institute',
      code: 'MTI003',
      address: 'Technical Road, Makeni',
      district: 'Bombali',
      province: 'Northern Province',
      latitude: 8.8864,
      longitude: -12.0438,
      phone: '+232 71 345 678',
      email: 'info@mti.edu.sl',
      principal: 'Mrs. Mariama Koroma',
      established: new Date('1972-01-01'),
      type: 'PUBLIC',
      level: 'TECHNICAL',
    }
  })

  // Create school admin users
  const schoolAdminUser = await prisma.user.upsert({
    where: { email: 'school@sis.gov.sl' },
    update: {},
    create: {
      email: 'school@sis.gov.sl',
      password: adminPassword,
      name: 'School Administrator',
      role: 'SCHOOL_ADMIN',
      schoolAdmin: {
        create: {
          schoolId: freetownSecondary.id,
          role: 'PRINCIPAL'
        }
      }
    }
  })

  // Create student user
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@sis.gov.sl' },
    update: {},
    create: {
      email: 'student@sis.gov.sl',
      password: adminPassword,
      name: 'Demo Student',
      role: 'STUDENT',
    }
  })

  // Create students
  const student1 = await prisma.student.upsert({
    where: { studentId: 'FSS2024001' },
    update: {},
    create: {
      userId: studentUser.id,
      studentId: 'FSS2024001',
      firstName: 'Mohamed',
      lastName: 'Kamara',
      dateOfBirth: new Date('2008-03-15'),
      gender: 'MALE',
      address: '45 Kissy Road, Freetown',
      phone: '+232 76 123 456',
      guardianName: 'Ibrahim Kamara',
      guardianPhone: '+232 77 234 567',
      currentSchoolId: freetownSecondary.id,
      enrollmentDate: new Date('2020-09-01'),
    }
  })

  const student2 = await prisma.student.upsert({
    where: { studentId: 'FSS2024002' },
    update: {},
    create: {
      userId: studentUser.id,
      studentId: 'FSS2024002',
      firstName: 'Aminata',
      lastName: 'Conteh',
      dateOfBirth: new Date('2009-07-22'),
      gender: 'FEMALE',
      address: '12 Hill Station, Freetown',
      phone: '+232 78 345 678',
      guardianName: 'Fatima Conteh',
      guardianPhone: '+232 79 456 789',
      currentSchoolId: freetownSecondary.id,
      enrollmentDate: new Date('2021-09-01'),
    }
  })

  // Create teachers
  const teacher1 = await prisma.teacher.upsert({
    where: { teacherId: 'T001' },
    update: {},
    create: {
      teacherId: 'T001',
      firstName: 'Fatima',
      lastName: 'Sesay',
      email: 'f.sesay@fss.edu.sl',
      phone: '+232 76 123 456',
      schoolId: freetownSecondary.id,
      subjects: ['Mathematics', 'Physics'],
      dateJoined: new Date('2010-09-01'),
    }
  })

  const teacher2 = await prisma.teacher.upsert({
    where: { teacherId: 'T002' },
    update: {},
    create: {
      teacherId: 'T002',
      firstName: 'Abdul',
      lastName: 'Rahman',
      email: 'a.rahman@fss.edu.sl',
      phone: '+232 77 234 567',
      schoolId: freetownSecondary.id,
      subjects: ['English Language', 'Literature'],
      dateJoined: new Date('2015-09-01'),
    }
  })

  // Create subjects
  const mathSubject = await prisma.subject.upsert({
    where: { 
      code_schoolId: {
        code: 'MATH',
        schoolId: freetownSecondary.id
      }
    },
    update: {},
    create: {
      name: 'Mathematics',
      code: 'MATH',
      schoolId: freetownSecondary.id,
      level: 'Secondary',
    }
  })

  const englishSubject = await prisma.subject.upsert({
    where: { 
      code_schoolId: {
        code: 'ENG',
        schoolId: freetownSecondary.id
      }
    },
    update: {},
    create: {
      name: 'English Language',
      code: 'ENG',
      schoolId: freetownSecondary.id,
      level: 'Secondary',
    }
  })

  const physicsSubject = await prisma.subject.upsert({
    where: { 
      code_schoolId: {
        code: 'PHY',
        schoolId: freetownSecondary.id
      }
    },
    update: {},
    create: {
      name: 'Physics',
      code: 'PHY',
      schoolId: freetownSecondary.id,
      level: 'Secondary',
    }
  })

  // Create sample results
  await prisma.result.createMany({
    data: [
      {
        studentId: student1.id,
        schoolId: freetownSecondary.id,
        subjectId: mathSubject.id,
        teacherId: teacher1.id,
        term: 'Term 2',
        year: 2024,
        score: 85,
        grade: 'A',
        remarks: 'Excellent performance',
        examType: 'Final Exam',
      },
      {
        studentId: student1.id,
        schoolId: freetownSecondary.id,
        subjectId: englishSubject.id,
        teacherId: teacher2.id,
        term: 'Term 2',
        year: 2024,
        score: 78,
        grade: 'B+',
        remarks: 'Good progress',
        examType: 'Final Exam',
      },
      {
        studentId: student1.id,
        schoolId: freetownSecondary.id,
        subjectId: physicsSubject.id,
        teacherId: teacher1.id,
        term: 'Term 2',
        year: 2024,
        score: 82,
        grade: 'A-',
        remarks: 'Very good understanding',
        examType: 'Final Exam',
      },
      {
        studentId: student2.id,
        schoolId: freetownSecondary.id,
        subjectId: mathSubject.id,
        teacherId: teacher1.id,
        term: 'Term 2',
        year: 2024,
        score: 76,
        grade: 'B+',
        remarks: 'Good effort',
        examType: 'Final Exam',
      },
    ],
    skipDuplicates: true,
  })

  // Create sample enrollments
  await prisma.enrollment.createMany({
    data: [
      {
        studentId: student1.id,
        schoolId: freetownSecondary.id,
        startDate: new Date('2020-09-01'),
        class: 'Form 5A',
        status: 'ACTIVE',
      },
      {
        studentId: student2.id,
        schoolId: freetownSecondary.id,
        startDate: new Date('2021-09-01'),
        class: 'Form 4B',
        status: 'ACTIVE',
      },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📊 Created:')
  console.log('- 4 users (admin, district admin, school admin, student)')
  console.log('- 3 schools (Freetown Secondary, Bo Government, Makeni Technical)')
  console.log('- 2 students')
  console.log('- 2 teachers')
  console.log('- 3 subjects')
  console.log('- 4 results')
  console.log('- 2 enrollments')
  console.log('\n🔐 Demo login credentials:')
  console.log('- admin@sis.gov.sl / password123 (Super Admin)')
  console.log('- district@sis.gov.sl / password123 (District Admin)')
  console.log('- school@sis.gov.sl / password123 (School Admin)')
  console.log('- student@sis.gov.sl / password123 (Student)')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
