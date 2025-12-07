'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, CheckCircle, Clock, Upload, Users, BookOpen, GraduationCap, FileSpreadsheet, X } from 'lucide-react'

interface Enrollment {
  id: string
  studentName: string
  studentId: string
  email?: string
  currentYear: number
  currentSemester: number
  status: string
  program: {
    id: string
    name: string
    code: string
    institution: {
      id: string
      name: string
      code: string
    }
  }
  results: CourseResult[]
}

interface CourseResult {
  id: string
  courseId: string
  academicYear: string
  semester: number
  score: number
  grade: string
  gradePoint: number
  status: string
  course: {
    id: string
    code: string
    name: string
    credits: number
  }
}

interface Course {
  id: string
  code: string
  name: string
  credits: number
  semester: number
  year: number
}

export default function LecturerResultsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string>('')

  // Form state
  const [formData, setFormData] = useState({
    enrollmentId: '',
    courseId: '',
    academicYear: '2024/2025',
    semester: 1,
    score: ''
  })
  const [submitting, setSubmitting] = useState(false)

  // Bulk upload state
  const [bulkResults, setBulkResults] = useState<Array<{
    studentId: string
    score: string
    studentName?: string
    enrollmentId?: string
  }>>([])

  useEffect(() => {
    fetchEnrollments()
    fetchAllCourses()
  }, [])

  useEffect(() => {
    fetchEnrollments()
  }, [searchTerm])

  const fetchEnrollments = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.set('search', searchTerm)
      
      const response = await fetch(`/api/university/enrollments?${params}`)
      if (response.ok) {
        const data = await response.json()
        setEnrollments(data.enrollments || [])
      }
    } catch (error) {
      console.error('Failed to fetch enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllCourses = async () => {
    try {
      const response = await fetch('/api/university/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    }
  }

  const fetchCourses = async (programId: string) => {
    try {
      const response = await fetch(`/api/university/courses?programId=${programId}`)
      if (response.ok) {
        const data = await response.json()
        setCourses(data.courses || [])
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    }
  }

  const handleAddResult = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.enrollmentId || !formData.courseId || !formData.score) {
      alert('Please fill all required fields')
      return
    }
    setSubmitting(true)

    try {
      const response = await fetch('/api/university/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          score: parseFloat(formData.score)
        })
      })

      if (response.ok) {
        const data = await response.json()
        setShowAddModal(false)
        setFormData({
          enrollmentId: '',
          courseId: '',
          academicYear: '2024/2025',
          semester: 1,
          score: ''
        })
        fetchEnrollments()
        alert(`Result added successfully!\nGrade: ${data.result?.grade} (${data.result?.gradePoint} GP)`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to add result')
      }
    } catch (error) {
      alert('Failed to add result')
    } finally {
      setSubmitting(false)
    }
  }

  const openAddResultModal = (enrollment: Enrollment) => {
    setSelectedEnrollment(enrollment)
    setFormData({
      ...formData,
      enrollmentId: enrollment.id
    })
    fetchCourses(enrollment.program.id)
    setShowAddModal(true)
  }

  const openBulkUploadModal = () => {
    setBulkResults([])
    setSelectedCourse('')
    setShowBulkModal(true)
  }

  const handleBulkSubmit = async () => {
    if (!selectedCourse || bulkResults.length === 0) {
      alert('Please select a course and add student results')
      return
    }

    setSubmitting(true)
    let successCount = 0
    let failCount = 0

    for (const result of bulkResults) {
      if (!result.enrollmentId || !result.score) continue

      try {
        const response = await fetch('/api/university/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            enrollmentId: result.enrollmentId,
            courseId: selectedCourse,
            academicYear: formData.academicYear,
            semester: formData.semester,
            score: parseFloat(result.score)
          })
        })

        if (response.ok) {
          successCount++
        } else {
          failCount++
        }
      } catch {
        failCount++
      }
    }

    setSubmitting(false)
    setShowBulkModal(false)
    fetchEnrollments()
    alert(`Bulk upload complete!\nSuccess: ${successCount}\nFailed: ${failCount}`)
  }

  const addBulkRow = () => {
    setBulkResults([...bulkResults, { studentId: '', score: '' }])
  }

  const updateBulkRow = (index: number, field: string, value: string) => {
    const updated = [...bulkResults]
    updated[index] = { ...updated[index], [field]: value }
    
    // Auto-find enrollment by student ID
    if (field === 'studentId') {
      const enrollment = enrollments.find(e => e.studentId === value)
      if (enrollment) {
        updated[index].studentName = enrollment.studentName
        updated[index].enrollmentId = enrollment.id
      } else {
        updated[index].studentName = undefined
        updated[index].enrollmentId = undefined
      }
    }
    
    setBulkResults(updated)
  }

  const removeBulkRow = (index: number) => {
    setBulkResults(bulkResults.filter((_, i) => i !== index))
  }

  const getGradeFromScore = (score: number): { grade: string; color: string } => {
    if (score >= 70) return { grade: 'A', color: 'text-green-600' }
    if (score >= 65) return { grade: 'B+', color: 'text-blue-600' }
    if (score >= 60) return { grade: 'B', color: 'text-blue-500' }
    if (score >= 55) return { grade: 'C+', color: 'text-yellow-600' }
    if (score >= 50) return { grade: 'C', color: 'text-yellow-500' }
    if (score >= 45) return { grade: 'D', color: 'text-orange-500' }
    if (score >= 40) return { grade: 'E', color: 'text-orange-600' }
    return { grade: 'F', color: 'text-red-600' }
  }

  const calculateCGPA = (results: CourseResult[]) => {
    const approvedResults = results.filter(r => ['APPROVED', 'PUBLISHED'].includes(r.status))
    if (approvedResults.length === 0) return 'N/A'
    
    let totalPoints = 0
    let totalCredits = 0
    approvedResults.forEach(r => {
      totalPoints += r.gradePoint * r.course.credits
      totalCredits += r.course.credits
    })
    
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 'N/A'
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Published</span>
      case 'APPROVED':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Approved</span>
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">Pending</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lecturer Dashboard</h1>
              <p className="text-gray-500">Manage student course results</p>
            </div>
            <button
              onClick={openBulkUploadModal}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileSpreadsheet className="w-5 h-5" />
              Bulk Upload Results
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Stats - Simplified */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <Users className="w-8 h-8 text-blue-500 mb-3" />
            <p className="text-3xl font-bold text-gray-900">{enrollments.length}</p>
            <p className="text-sm text-gray-500 mt-1">Students</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <BookOpen className="w-8 h-8 text-green-500 mb-3" />
            <p className="text-3xl font-bold text-gray-900">
              {enrollments.reduce((acc, e) => acc + e.results.length, 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Results</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <Clock className="w-8 h-8 text-yellow-500 mb-3" />
            <p className="text-3xl font-bold text-gray-900">
              {enrollments.reduce((acc, e) => acc + e.results.filter(r => r.status === 'PENDING').length, 0)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Pending</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <GraduationCap className="w-8 h-8 text-purple-500 mb-3" />
            <p className="text-3xl font-bold text-gray-900">
              {enrollments.filter(e => e.currentYear >= 4).length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Final Year</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-lg">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
          </div>
        </div>

        {/* Students List */}
        <div className="space-y-4">
          {loading ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Loading students...</p>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl font-medium text-gray-700">No students found</p>
              <p className="text-gray-500 mt-2">Students will appear here once enrolled</p>
            </div>
          ) : (
            enrollments.map((enrollment) => (
              <div key={enrollment.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Student Header */}
                <div className="p-6 border-b bg-gradient-to-r from-blue-50 to-white flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {enrollment.studentName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{enrollment.studentName}</h3>
                      <p className="text-sm text-gray-500">{enrollment.studentId}</p>
                      <p className="text-xs text-gray-400">{enrollment.program.name} • Year {enrollment.currentYear}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">CGPA</p>
                      <p className="text-2xl font-bold text-blue-600">{calculateCGPA(enrollment.results)}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Courses</p>
                      <p className="text-2xl font-bold text-gray-700">{enrollment.results.length}</p>
                    </div>
                    <button
                      onClick={() => openAddResultModal(enrollment)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Plus className="w-5 h-5" />
                      Add Result
                    </button>
                  </div>
                </div>

                {/* Results Table */}
                {enrollment.results.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Course</th>
                          <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Academic Year</th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">GP</th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Credits</th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {enrollment.results.map((result) => (
                          <tr key={result.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <p className="font-medium text-gray-900">{result.course.code}</p>
                              <p className="text-sm text-gray-500">{result.course.name}</p>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{result.academicYear} • Sem {result.semester}</td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-lg font-semibold text-gray-900">{result.score}</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`text-lg font-bold ${getGradeFromScore(result.score).color}`}>
                                {result.grade}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center text-gray-700 font-medium">{result.gradePoint.toFixed(1)}</td>
                            <td className="px-6 py-4 text-center text-gray-600">{result.course.credits}</td>
                            <td className="px-6 py-4 text-center">{getStatusBadge(result.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400">
                    <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>No results recorded yet</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Add Single Result Modal */}
      {showAddModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Add Course Result</h2>
              <p className="text-gray-500">Student: {selectedEnrollment.studentName}</p>
            </div>
            
            <form onSubmit={handleAddResult} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                <select
                  required
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name} ({course.credits} cr)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                  <select
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2023/2024">2023/2024</option>
                    <option value="2022/2023">2022/2023</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Score (0-100) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Enter score"
                />
                {formData.score && (
                  <p className="mt-1 text-sm">
                    Grade: <span className={`font-bold ${getGradeFromScore(parseFloat(formData.score)).color}`}>
                      {getGradeFromScore(parseFloat(formData.score)).grade}
                    </span>
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Save Result
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">Bulk Upload Results</h2>
              <p className="text-gray-500">Add results for multiple students at once</p>
            </div>
            
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Course Selection */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course *</label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>
                        {course.code} - {course.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                  <select
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2023/2024">2023/2024</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>
              </div>

              {/* Results Table */}
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Student ID</th>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500">Student Name</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">Score</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500">Grade</th>
                      <th className="px-4 py-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {bulkResults.map((row, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={row.studentId}
                            onChange={(e) => updateBulkRow(index, 'studentId', e.target.value)}
                            placeholder="USL/2021/CS/001"
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <span className={row.studentName ? 'text-gray-900' : 'text-gray-400 italic'}>
                            {row.studentName || 'Enter valid ID'}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={row.score}
                            onChange={(e) => updateBulkRow(index, 'score', e.target.value)}
                            placeholder="0-100"
                            className="w-20 px-2 py-1 border rounded text-sm text-center"
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          {row.score && (
                            <span className={`font-bold ${getGradeFromScore(parseFloat(row.score)).color}`}>
                              {getGradeFromScore(parseFloat(row.score)).grade}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => removeBulkRow(index)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={addBulkRow}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Row
              </button>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkSubmit}
                disabled={submitting || !selectedCourse || bulkResults.length === 0}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload {bulkResults.filter(r => r.enrollmentId && r.score).length} Results
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
