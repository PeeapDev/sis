'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, CheckCircle, Clock, AlertCircle, GraduationCap, BookOpen, Users, ChevronDown, ChevronUp, Check } from 'lucide-react'

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
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)
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

  const toggleExpand = (id: string) => {
    setExpandedStudent(expandedStudent === id ? null : id)
  }

  const handleApproveResults = async (resultIds: string[], action: 'approve' | 'publish') => {
    try {
      const response = await fetch('/api/university/results', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultIds, action })
      })

      if (response.ok) {
        fetchEnrollments()
        alert(`Results ${action === 'approve' ? 'approved' : 'published'} successfully!`)
      } else {
        const error = await response.json()
        alert(error.error || `Failed to ${action} results`)
      }
    } catch (error) {
      alert(`Failed to ${action} results`)
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
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Results Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Add and manage student course results</p>
      </div>

      {/* Stats - Clean cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <Users className="w-10 h-10 text-blue-500 mb-4" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{enrollments.length}</p>
          <p className="text-gray-500 mt-1">Students</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <BookOpen className="w-10 h-10 text-green-500 mb-4" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {enrollments.reduce((acc, e) => acc + e.results.length, 0)}
          </p>
          <p className="text-gray-500 mt-1">Results Entered</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <Clock className="w-10 h-10 text-yellow-500 mb-4" />
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {enrollments.reduce((acc, e) => acc + e.results.filter(r => r.status === 'PENDING').length, 0)}
          </p>
          <p className="text-gray-500 mt-1">Pending Approval</p>
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
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-sm"
          />
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading students...</p>
          </div>
        ) : enrollments.length === 0 ? (
          <div className="p-16 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl font-medium text-gray-700 dark:text-gray-300">No students found</p>
            <p className="text-gray-500 mt-2">Enroll students first to add results</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {enrollments.map((enrollment) => (
              <div key={enrollment.id}>
                {/* Student Row */}
                <div 
                  className="p-6 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  onClick={() => toggleExpand(enrollment.id)}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {enrollment.studentName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{enrollment.studentName}</h3>
                      <p className="text-gray-500">{enrollment.studentId}</p>
                      <p className="text-sm text-gray-400">{enrollment.program.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center px-4">
                      <p className="text-xs text-gray-400 uppercase">Year</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{enrollment.currentYear}</p>
                    </div>
                    <div className="text-center px-4">
                      <p className="text-xs text-gray-400 uppercase">Courses</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{enrollment.results.length}</p>
                    </div>
                    <div className="text-center px-4">
                      <p className="text-xs text-gray-400 uppercase">CGPA</p>
                      <p className="text-xl font-bold text-blue-600">{calculateCGPA(enrollment.results)}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); openAddResultModal(enrollment); }}
                      className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Result
                    </button>
                    {expandedStudent === enrollment.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expandable Results */}
                {expandedStudent === enrollment.id && enrollment.results.length > 0 && (
                  <div className="px-6 pb-6">
                    {/* Approve All Button */}
                    {enrollment.results.some(r => r.status === 'PENDING') && (
                      <div className="mb-4 flex gap-3">
                        <button
                          onClick={() => handleApproveResults(
                            enrollment.results.filter(r => r.status === 'PENDING').map(r => r.id),
                            'approve'
                          )}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          <Check className="w-4 h-4" />
                          Approve All Pending
                        </button>
                        <button
                          onClick={() => handleApproveResults(
                            enrollment.results.filter(r => r.status === 'PENDING').map(r => r.id),
                            'publish'
                          )}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Publish All Pending
                        </button>
                      </div>
                    )}
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Course</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Year</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Score</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Grade</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">GP</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Credits</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Status</th>
                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {enrollment.results.map((result) => (
                            <tr key={result.id} className="hover:bg-gray-100 dark:hover:bg-gray-800/50">
                              <td className="px-4 py-4">
                                <p className="font-medium text-gray-900 dark:text-white">{result.course.code}</p>
                                <p className="text-sm text-gray-500">{result.course.name}</p>
                              </td>
                              <td className="px-4 py-4 text-gray-600 dark:text-gray-400">{result.academicYear}</td>
                              <td className="px-4 py-4 text-center font-semibold text-gray-900 dark:text-white">{result.score}</td>
                              <td className="px-4 py-4 text-center">
                                <span className={`text-lg font-bold ${
                                  result.grade === 'A' ? 'text-green-600' :
                                  result.grade.startsWith('B') ? 'text-blue-600' :
                                  result.grade.startsWith('C') ? 'text-yellow-600' :
                                  result.grade === 'F' ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                  {result.grade}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-center text-gray-900 dark:text-white">{result.gradePoint.toFixed(1)}</td>
                              <td className="px-4 py-4 text-center text-gray-600 dark:text-gray-400">{result.course.credits}</td>
                              <td className="px-4 py-4 text-center">{getStatusBadge(result.status)}</td>
                              <td className="px-4 py-4 text-center">
                                {result.status === 'PENDING' && (
                                  <button
                                    onClick={() => handleApproveResults([result.id], 'publish')}
                                    className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 text-sm font-medium"
                                  >
                                    Approve
                                  </button>
                                )}
                                {result.status === 'APPROVED' && (
                                  <button
                                    onClick={() => handleApproveResults([result.id], 'publish')}
                                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm font-medium"
                                  >
                                    Publish
                                  </button>
                                )}
                                {result.status === 'PUBLISHED' && (
                                  <span className="text-gray-400 text-sm">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {expandedStudent === enrollment.id && enrollment.results.length === 0 && (
                  <div className="px-6 pb-6">
                    <div className="bg-gray-50 dark:bg-gray-900/30 rounded-xl p-8 text-center border border-gray-200 dark:border-gray-700">
                      <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-500">No results recorded yet</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Result Modal */}
      {showAddModal && selectedEnrollment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Course Result</h2>
              <p className="text-gray-500">For: {selectedEnrollment.studentName}</p>
            </div>
            
            <form onSubmit={handleAddResult} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Course *</label>
                <select
                  required
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Academic Year</label>
                  <select
                    required
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2024/2025">2024/2025</option>
                    <option value="2023/2024">2023/2024</option>
                    <option value="2022/2023">2022/2023</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Semester</label>
                  <select
                    required
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Score (0-100) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={formData.score}
                  onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 text-lg"
                  placeholder="Enter score (0-100)"
                />
              </div>

              <div className="flex justify-end gap-3 pt-5 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2 shadow-sm"
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
