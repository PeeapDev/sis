// Seed script for University Academic System
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🎓 Seeding University Academic System...')

  // Get USL institution
  const usl = await prisma.institution.findUnique({
    where: { code: 'USL' }
  })

  if (!usl) {
    console.log('❌ USL institution not found. Run seed-credentials.ts first.')
    return
  }

  // Create Computer Science Program
  const csProgram = await prisma.program.upsert({
    where: {
      institutionId_code: {
        institutionId: usl.id,
        code: 'BSC-CS'
      }
    },
    update: {},
    create: {
      institutionId: usl.id,
      name: 'Bachelor of Science in Computer Science',
      code: 'BSC-CS',
      type: 'BACHELORS',
      duration: 4,
      totalCredits: 120,
      department: 'Computer Science',
      faculty: 'Faculty of Pure and Applied Sciences'
    }
  })
  console.log('✅ Created BSc Computer Science program')

  // Create Business Admin Program
  const busProgram = await prisma.program.upsert({
    where: {
      institutionId_code: {
        institutionId: usl.id,
        code: 'BBA'
      }
    },
    update: {},
    create: {
      institutionId: usl.id,
      name: 'Bachelor of Business Administration',
      code: 'BBA',
      type: 'BACHELORS',
      duration: 4,
      totalCredits: 120,
      department: 'Business Administration',
      faculty: 'Faculty of Social Sciences'
    }
  })
  console.log('✅ Created BBA program')

  // Create CS Courses
  const csCourses = [
    { code: 'CS101', name: 'Introduction to Programming', credits: 3, year: 1, semester: 1 },
    { code: 'CS102', name: 'Data Structures', credits: 3, year: 1, semester: 2 },
    { code: 'CS201', name: 'Object-Oriented Programming', credits: 3, year: 2, semester: 1 },
    { code: 'CS202', name: 'Database Systems', credits: 3, year: 2, semester: 2 },
    { code: 'CS301', name: 'Software Engineering', credits: 3, year: 3, semester: 1 },
    { code: 'CS302', name: 'Computer Networks', credits: 3, year: 3, semester: 2 },
    { code: 'CS401', name: 'Artificial Intelligence', credits: 3, year: 4, semester: 1 },
    { code: 'CS402', name: 'Final Year Project', credits: 6, year: 4, semester: 2 },
    { code: 'MATH101', name: 'Calculus I', credits: 3, year: 1, semester: 1 },
    { code: 'MATH102', name: 'Linear Algebra', credits: 3, year: 1, semester: 2 },
  ]

  for (const course of csCourses) {
    await prisma.course.upsert({
      where: {
        programId_code: {
          programId: csProgram.id,
          code: course.code
        }
      },
      update: {},
      create: {
        programId: csProgram.id,
        ...course
      }
    })
  }
  console.log('✅ Created 10 CS courses')

  // Create demo students
  const students = [
    {
      studentId: 'USL/2021/CS/001',
      studentName: 'Abubakar Kamara',
      email: 'abubakar.k@usl.edu.sl',
      currentYear: 4,
      currentSemester: 1
    },
    {
      studentId: 'USL/2022/CS/015',
      studentName: 'Mariama Sesay',
      email: 'mariama.s@usl.edu.sl',
      currentYear: 3,
      currentSemester: 1
    },
    {
      studentId: 'USL/2023/CS/042',
      studentName: 'Ibrahim Conteh',
      email: 'ibrahim.c@usl.edu.sl',
      currentYear: 2,
      currentSemester: 1
    }
  ]

  for (const student of students) {
    const enrollment = await prisma.universityEnrollment.upsert({
      where: {
        institutionId_studentId: {
          institutionId: usl.id,
          studentId: student.studentId
        }
      },
      update: {},
      create: {
        institutionId: usl.id,
        programId: csProgram.id,
        ...student
      }
    })

    // Add some results for the first student (final year)
    if (student.studentId === 'USL/2021/CS/001') {
      const courses = await prisma.course.findMany({
        where: { programId: csProgram.id }
      })

      const results = [
        { courseCode: 'CS101', score: 85, academicYear: '2021/2022', semester: 1 },
        { courseCode: 'MATH101', score: 78, academicYear: '2021/2022', semester: 1 },
        { courseCode: 'CS102', score: 82, academicYear: '2021/2022', semester: 2 },
        { courseCode: 'MATH102', score: 75, academicYear: '2021/2022', semester: 2 },
        { courseCode: 'CS201', score: 88, academicYear: '2022/2023', semester: 1 },
        { courseCode: 'CS202', score: 90, academicYear: '2022/2023', semester: 2 },
        { courseCode: 'CS301', score: 86, academicYear: '2023/2024', semester: 1 },
        { courseCode: 'CS302', score: 84, academicYear: '2023/2024', semester: 2 },
      ]

      for (const result of results) {
        const course = courses.find(c => c.code === result.courseCode)
        if (course) {
          const gradeInfo = calculateGrade(result.score)
          await prisma.courseResult.upsert({
            where: {
              enrollmentId_courseId_academicYear_semester: {
                enrollmentId: enrollment.id,
                courseId: course.id,
                academicYear: result.academicYear,
                semester: result.semester
              }
            },
            update: {},
            create: {
              enrollmentId: enrollment.id,
              courseId: course.id,
              academicYear: result.academicYear,
              semester: result.semester,
              score: result.score,
              grade: gradeInfo.grade,
              gradePoint: gradeInfo.gradePoint,
              credits: course.credits,
              status: 'PUBLISHED'
            }
          })
        }
      }
      console.log(`✅ Added 8 results for ${student.studentName}`)
    }
  }
  console.log('✅ Created 3 demo students')

  console.log('\n🎉 University seeding completed!')
  console.log('\n📋 Demo Students:')
  console.log('   - Abubakar Kamara (USL/2021/CS/001) - Year 4, has results')
  console.log('   - Mariama Sesay (USL/2022/CS/015) - Year 3')
  console.log('   - Ibrahim Conteh (USL/2023/CS/042) - Year 2')
}

function calculateGrade(score: number): { grade: string; gradePoint: number } {
  if (score >= 70) return { grade: 'A', gradePoint: 4.0 }
  if (score >= 65) return { grade: 'B+', gradePoint: 3.5 }
  if (score >= 60) return { grade: 'B', gradePoint: 3.0 }
  if (score >= 55) return { grade: 'C+', gradePoint: 2.5 }
  if (score >= 50) return { grade: 'C', gradePoint: 2.0 }
  if (score >= 45) return { grade: 'D', gradePoint: 1.5 }
  if (score >= 40) return { grade: 'E', gradePoint: 1.0 }
  return { grade: 'F', gradePoint: 0.0 }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
