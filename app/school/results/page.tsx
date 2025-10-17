"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

type ResultItem = {
  id: string
  studentId: string
  schoolId: string
  subjectId: string
  subjectName?: string
  teacherId: string
  term: string
  year: number
  score: number
  grade: string
  remarks?: string
  examType: string
}

async function fetchResults(params: { studentId?: string; subjectId?: string; term?: string; year?: string; limit?: number; offset?: number }) {
  const q = new URLSearchParams()
  if (params.studentId) q.set('studentId', params.studentId)
  if (params.subjectId) q.set('subjectId', params.subjectId)
  if (params.term) q.set('term', params.term)
  if (params.year) q.set('year', params.year)
  q.set('limit', String(params.limit ?? 10))
  q.set('offset', String(params.offset ?? 0))
  const res = await fetch(`/api/results?${q.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch results')
  return res.json() as Promise<{ success: boolean; data: ResultItem[]; pagination: { total: number; limit: number; offset: number } }>
}

async function createResult(payload: any) {
  const res = await fetch('/api/results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create result')
  return res.json()
}

export default function Page() {
  const { toast } = useToast()
  const [filters, setFilters] = useState({ studentId: '', subjectId: '', term: '', year: '' })
  const [offset, setOffset] = useState(0)
  const limit = 10
  const qc = useQueryClient()

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['school-results', { ...filters, offset, limit }],
    queryFn: () => fetchResults({ ...filters, limit, offset, year: filters.year || undefined }),
  })

  const mutate = useMutation({
    mutationFn: createResult,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['school-results'] })
      toast({ title: 'Result saved', description: 'The result has been recorded successfully.' })
    },
    onError: (e: any) => {
      toast({ title: 'Failed to save result', description: e?.message || 'Unknown error', variant: 'destructive' })
    }
  })

  const [form, setForm] = useState({
    studentId: '',
    schoolId: 'sch_001',
    subjectId: '',
    teacherId: '',
    term: 'Term 2',
    year: new Date().getFullYear(),
    score: 0,
    examType: 'Final Exam',
    remarks: '',
    storeOnChain: false,
  })

  const requiredFilled = form.studentId && form.schoolId && form.subjectId && form.teacherId && form.term && form.year && form.score >= 0 && form.score <= 100 && form.examType

  const total = data?.pagination.total ?? 0
  const canPrev = offset > 0
  const canNext = offset + limit < total

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">School • Results</h1>
      <p className="text-sm text-muted-foreground">Record results and optionally store a hash on the blockchain.</p>

      <div className="border rounded p-3 space-y-3">
        <h2 className="font-medium">Filters</h2>
        <div className="grid grid-cols-4 gap-2">
          <input className="border px-2 py-1 rounded" placeholder="Student ID" value={filters.studentId} onChange={e=>{ setFilters({ ...filters, studentId: e.target.value }); setOffset(0) }} />
          <input className="border px-2 py-1 rounded" placeholder="Subject ID" value={filters.subjectId} onChange={e=>{ setFilters({ ...filters, subjectId: e.target.value }); setOffset(0) }} />
          <input className="border px-2 py-1 rounded" placeholder="Term (e.g., Term 2)" value={filters.term} onChange={e=>{ setFilters({ ...filters, term: e.target.value }); setOffset(0) }} />
          <input className="border px-2 py-1 rounded" placeholder="Year (e.g., 2024)" value={filters.year} onChange={e=>{ setFilters({ ...filters, year: e.target.value }); setOffset(0) }} />
        </div>
        <button className="border px-3 py-1 rounded" onClick={()=>refetch()}>Apply</button>
      </div>

      <div className="border rounded">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Student</th>
                <th className="p-2 text-left">Subject</th>
                <th className="p-2 text-left">Term</th>
                <th className="p-2 text-left">Year</th>
                <th className="p-2 text-left">Score</th>
                <th className="p-2 text-left">Grade</th>
                <th className="p-2 text-left">Exam</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td className="p-3" colSpan={7}>Loading...</td></tr>}
              {isError && <tr><td className="p-3 text-red-600" colSpan={7}>Failed to load</td></tr>}
              {data?.data?.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{r.studentId}</td>
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
        <div className="flex justify-between items-center p-2">
          <span className="text-xs text-gray-500">Total: {total}</span>
          <div className="space-x-2">
            <button className="border px-2 py-1 rounded disabled:opacity-50" disabled={!canPrev} onClick={()=>setOffset(Math.max(0, offset - limit))}>Prev</button>
            <button className="border px-2 py-1 rounded disabled:opacity-50" disabled={!canNext} onClick={()=>setOffset(offset + limit)}>Next</button>
          </div>
        </div>
      </div>

      <div className="border rounded p-4 space-y-3">
        <h2 className="font-medium">Record New Result</h2>
        <div className="grid grid-cols-2 gap-2">
          <input className="border px-2 py-1 rounded" placeholder="Student ID" value={form.studentId} onChange={e=>setForm({...form, studentId: e.target.value})} />
          <input className="border px-2 py-1 rounded" placeholder="School ID" value={form.schoolId} onChange={e=>setForm({...form, schoolId: e.target.value})} />
          <input className="border px-2 py-1 rounded" placeholder="Subject ID" value={form.subjectId} onChange={e=>setForm({...form, subjectId: e.target.value})} />
          <input className="border px-2 py-1 rounded" placeholder="Teacher ID" value={form.teacherId} onChange={e=>setForm({...form, teacherId: e.target.value})} />
          <input className="border px-2 py-1 rounded" placeholder="Term" value={form.term} onChange={e=>setForm({...form, term: e.target.value})} />
          <input type="number" className="border px-2 py-1 rounded" placeholder="Year" value={form.year} onChange={e=>setForm({...form, year: Number(e.target.value)})} />
          <input type="number" className="border px-2 py-1 rounded" placeholder="Score" value={form.score} onChange={e=>setForm({...form, score: Number(e.target.value)})} />
          <input className="border px-2 py-1 rounded" placeholder="Exam Type" value={form.examType} onChange={e=>setForm({...form, examType: e.target.value})} />
          <input className="border px-2 py-1 rounded col-span-2" placeholder="Remarks (optional)" value={form.remarks} onChange={e=>setForm({...form, remarks: e.target.value})} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.storeOnChain} onChange={e=>setForm({...form, storeOnChain: e.target.checked})} />
          Store on blockchain
        </label>
        <button
          className="border px-3 py-2 rounded disabled:opacity-50"
          disabled={mutate.isPending || !requiredFilled}
          onClick={() => {
            if (!requiredFilled) {
              toast({ title: 'Invalid fields', description: 'Fill all required fields and ensure score is 0-100.', variant: 'destructive' })
              return
            }
            mutate.mutate(form)
          }}
        >{mutate.isPending ? 'Saving...' : 'Save Result'}</button>
        {!requiredFilled && <p className="text-xs text-muted-foreground">Required: studentId, schoolId, subjectId, teacherId, term, year, score (0-100), examType</p>}
        {mutate.isSuccess && <p className="text-sm text-green-600">Result saved</p>}
      </div>
    </div>
  )
}

