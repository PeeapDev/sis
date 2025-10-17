"use client"

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

type ResultItem = {
  id: string
  studentId: string
  subjectId: string
  subjectName?: string
  term: string
  year: number
  score: number
  grade: string
  examType: string
}

async function fetchResults(params: { studentId: string; term?: string; year?: string; limit?: number; offset?: number }) {
  const q = new URLSearchParams()
  q.set('studentId', params.studentId)
  if (params.term) q.set('term', params.term)
  if (params.year) q.set('year', params.year)
  q.set('limit', String(params.limit ?? 10))
  q.set('offset', String(params.offset ?? 0))
  const res = await fetch(`/api/results?${q.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch results')
  return res.json() as Promise<{ success: boolean; data: ResultItem[]; pagination: { total: number; limit: number; offset: number } }>
}

export default function Page() {
  const [studentId, setStudentId] = useState('')
  const [term, setTerm] = useState('')
  const [year, setYear] = useState('')
  const [offset, setOffset] = useState(0)
  const limit = 10

  useEffect(() => {
    // Try to prefill from localStorage user if present
    try {
      const userData = localStorage.getItem('user')
      const parsed = userData ? JSON.parse(userData) : null
      if (parsed?.studentId) setStudentId(parsed.studentId)
    } catch {}
  }, [])

  useEffect(() => { setOffset(0) }, [studentId, term, year])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['student-results', { studentId, term, year, offset, limit }],
    queryFn: () => fetchResults({ studentId, term: term || undefined, year: year || undefined, limit, offset }),
    enabled: Boolean(studentId)
  })

  const total = data?.pagination.total ?? 0
  const canPrev = offset > 0
  const canNext = offset + limit < total

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Student • Results</h1>
      <p className="text-sm text-muted-foreground">View your academic results.</p>

      <div className="border rounded p-3 space-y-3">
        <h2 className="font-medium">Filters</h2>
        <div className="grid grid-cols-3 gap-2">
          <input className="border px-2 py-1 rounded" placeholder="Student ID" value={studentId} onChange={e=>setStudentId(e.target.value)} />
          <input className="border px-2 py-1 rounded" placeholder="Term (e.g., Term 2)" value={term} onChange={e=>setTerm(e.target.value)} />
          <input className="border px-2 py-1 rounded" placeholder="Year (e.g., 2024)" value={year} onChange={e=>setYear(e.target.value)} />
        </div>
        <button className="border px-3 py-1 rounded" onClick={()=>refetch()} disabled={!studentId}>Apply</button>
      </div>

      <div className="border rounded">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Subject</th>
                <th className="p-2 text-left">Term</th>
                <th className="p-2 text-left">Year</th>
                <th className="p-2 text-left">Score</th>
                <th className="p-2 text-left">Grade</th>
                <th className="p-2 text-left">Exam</th>
              </tr>
            </thead>
            <tbody>
              {!studentId && <tr><td className="p-3" colSpan={6}>Enter your Student ID to view results</td></tr>}
              {studentId && isLoading && <tr><td className="p-3" colSpan={6}>Loading...</td></tr>}
              {studentId && isError && <tr><td className="p-3 text-red-600" colSpan={6}>Failed to load</td></tr>}
              {studentId && data?.data?.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.subjectName ?? r.subjectId}</td>
                  <td className="p-2">{r.term}</td>
                  <td className="p-2">{r.year}</td>
                  <td className="p-2">{r.score}</td>
                  <td className="p-2">{r.grade}</td>
                  <td className="p-2">{r.examType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {studentId && (
          <div className="flex justify-between items-center p-2">
            <span className="text-xs text-gray-500">Total: {total}</span>
            <div className="space-x-2">
              <button className="border px-2 py-1 rounded disabled:opacity-50" disabled={!canPrev} onClick={()=>setOffset(Math.max(0, offset - limit))}>Prev</button>
              <button className="border px-2 py-1 rounded disabled:opacity-50" disabled={!canNext} onClick={()=>setOffset(offset + limit)}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

