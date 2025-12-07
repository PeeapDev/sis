-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'WITHDRAWN', 'GRADUATED', 'DEFERRED');

-- CreateEnum
CREATE TYPE "ResultStatus" AS ENUM ('PENDING', 'APPROVED', 'PUBLISHED', 'DISPUTED');

-- CreateEnum
CREATE TYPE "GraduationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CERTIFIED');

-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "ProgramType" NOT NULL,
    "duration" INTEGER NOT NULL,
    "totalCredits" INTEGER NOT NULL DEFAULT 120,
    "department" TEXT,
    "faculty" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 3,
    "semester" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "isCore" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_enrollments" (
    "id" TEXT NOT NULL,
    "institutionId" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "nationalId" TEXT,
    "enrollmentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expectedGraduation" TIMESTAMP(3),
    "currentYear" INTEGER NOT NULL DEFAULT 1,
    "currentSemester" INTEGER NOT NULL DEFAULT 1,
    "status" "EnrollmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "university_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_results" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "semester" INTEGER NOT NULL,
    "score" DOUBLE PRECISION,
    "grade" TEXT,
    "gradePoint" DOUBLE PRECISION,
    "credits" INTEGER NOT NULL,
    "status" "ResultStatus" NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "addedById" TEXT,
    "approvedById" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "graduation_requests" (
    "id" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "totalCredits" INTEGER NOT NULL,
    "cgpa" DOUBLE PRECISION NOT NULL,
    "classOfDegree" TEXT NOT NULL,
    "status" "GraduationStatus" NOT NULL DEFAULT 'PENDING',
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewNotes" TEXT,
    "certificateId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "graduation_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "programs_institutionId_code_key" ON "programs"("institutionId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "courses_programId_code_key" ON "courses"("programId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "university_enrollments_institutionId_studentId_key" ON "university_enrollments"("institutionId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "course_results_enrollmentId_courseId_academicYear_semester_key" ON "course_results"("enrollmentId", "courseId", "academicYear", "semester");

-- CreateIndex
CREATE UNIQUE INDEX "graduation_requests_enrollmentId_key" ON "graduation_requests"("enrollmentId");

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_enrollments" ADD CONSTRAINT "university_enrollments_programId_fkey" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_results" ADD CONSTRAINT "course_results_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "university_enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_results" ADD CONSTRAINT "course_results_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "graduation_requests" ADD CONSTRAINT "graduation_requests_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "university_enrollments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
