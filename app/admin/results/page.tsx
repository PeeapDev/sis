'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, CheckCircle, Clock, AlertCircle, GraduationCap, BookOpen, Users } from 'lucide-react'

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

export default function AdminResultsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Form state
  const [formData, setFormData] = useState({
    enrollmentId: '',
    courseId: '',
    academicYear: '2024/2025',
    semester: 1,
    score: ''
  })
  const [submitting, setSubmitting] = useState(false)

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
        alert(`Result added: ${data.result?.grade} (${data.result?.gradePoint} GP)`)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Published</span>
      case 'APPROVED':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Approved</span>
      case 'PENDING':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>
      case 'DISPUTED':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Disputed</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>
    }
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Results Management</h1>
          <p className="text-gray-400">Add and manage student course results</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-gray-400 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-white">{enrollments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-gray-400 text-sm">Results Entered</p>
              <p className="text-2xl font-bold text-white">
                {enrollments.reduce((acc, e) => acc + e.results.length, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-purple-400" />
            <div>
              <p className="text-gray-400 text-sm">Ready to Graduate</p>
              <p className="text-2xl font-bold text-white">
                {enrollments.filter(e => e.currentYear >= 4).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Students List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-gray-400">Loading students...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="bg-gray-800 rounded-xl p-12 text-center border border-gray-700">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-lg font-medium text-gray-300">No students found</p>
            <p className="text-sm text-gray-500 mt-1">Enroll students first to add results</p>
          </div>
        ) : (
          enrollments.map((enrollment) => (
            <div key={enrollment.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              {/* Student Header */}
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {enrollment.studentName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{enrollment.studentName}</h3>
                    <p className="text-sm text-gray-400">{enrollment.studentId} • {enrollment.program.name}</p>
                    <p className="text-xs text-gray-500">{enrollment.program.institution.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-400">CGPA</p>
                    <p className="text-xl font-bold text-white">{calculateCGPA(enrollment.results)}</p>
                  </div>
                  <button
                    onClick={() => openAddResultModal(enrollment)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Result
                  </button>
                </div>
              </div>

              {/* Results Table */}
              {enrollment.results.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Course</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Year</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Score</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Grade</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">GP</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Credits</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {enrollment.results.map((result) => (
                        <tr key={result.id} className="hover:bg-gray-750">
                          <td className="px-4 py-3">
                            <p className="text-white font-medium">{result.course.code}</p>
                            <p className="text-xs text-gray-400">{result.course.name}</p>
                          </td>
                          <td className="px-4 py-3 text-gray-300">{result.academicYear} S{result.semester}</td>
                          <td className="px-4 py-3 text-white font-medium">{result.score}</td>
                          <td className="px-4 py-3">
                            <span className={`font-bold ${
                              result.grade === 'A' ? 'text-green-400' :
                              result.grade.startsWith('B') ? 'text-blue-400' :
                              result.grade.startsWith('C') ? 'text-yellow-400' :
                              result.grade === 'F' ? 'text-red-400' : 'text-gray-400'
                            }`}>
                              {result.grade}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-white">{result.gradePoint.toFixed(1)}</td>
                          <td className="px-4 py-3 text-gray-300">{result.course.credits}</td>
                          <td className="px-4 py-3">{getStatusBadge(result.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {enrollment.results.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No results recorded yet
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Result Modal */}
      {showAddModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Add Course Result</h2>
              <p className="text-gray-400">For: {selectedEnrollment.studentName}</p>
            </div>
            
            <form onSubmit={handleAddResult} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Course *</label>
                <select
                  required
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select course</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name} ({course.credits} credits)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Academic Year *</label>
                  <select
                    required
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2023/2024">2023/2024</option>
                    <option value="2022/2023">2022/2023</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Semester *</label>
                  <select
                    required
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Score (0-100) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter score"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Add Result
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
