"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

type Student = {
  id: string
  studentId: string
  firstName: string
  lastName: string
  gender: string
  class: string
  currentSchool: string
  currentSchoolId: string
  status: string
}

async function fetchStudents(params: { search?: string; offset?: number; limit?: number }) {
  const q = new URLSearchParams()
  if (params.search) q.set('search', params.search)
  q.set('limit', String(params.limit ?? 10))
  q.set('offset', String(params.offset ?? 0))
  const res = await fetch(`/api/students?${q.toString()}`)
  if (!res.ok) throw new Error('Failed to load students')
  return res.json() as Promise<{ success: boolean; data: Student[]; pagination: { total: number; limit: number; offset: number } }>
}

async function createStudent(payload: any) {
  const res = await fetch('/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error('Failed to create student')
  return res.json()
}

export default function Page() {
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [limit] = useState(10)
  const qc = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['students', { search, offset, limit }],
    queryFn: () => fetchStudents({ search, offset, limit }),
  })

  const mutate = useMutation({
    mutationFn: createStudent,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] })
      toast({ title: 'Student enrolled', description: 'The student has been added successfully.' })
    },
    onError: (e: any) => {
      toast({ title: 'Failed to enroll', description: e?.message || 'Unknown error', variant: 'destructive' })
    }
  })

  const total = data?.pagination.total ?? 0
  const canPrev = offset > 0
  const canNext = offset + limit < total

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE',
    address: '',
    guardianName: '',
    guardianPhone: '',
    currentSchoolId: 'sch_001',
  })

  const requiredFilled = form.firstName && form.lastName && form.dateOfBirth && form.gender && form.guardianName && form.guardianPhone && form.currentSchoolId

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Admin • Students</h1>
      <div className="flex gap-2 items-center">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setOffset(0) }}
          placeholder="Search by name or student ID"
          className="border px-3 py-2 rounded w-64"
        />
        <button
          className="border px-3 py-2 rounded"
          onClick={() => qc.invalidateQueries({ queryKey: ['students'] })}
        >Refresh</button>
      </div>

      <div className="border rounded">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Student ID</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Gender</th>
                <th className="p-2 text-left">Class</th>
                <th className="p-2 text-left">School</th>
                <th className="p-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td className="p-3" colSpan={6}>Loading...</td></tr>
              )}
              {isError && (
                <tr><td className="p-3 text-red-600" colSpan={6}>Failed to load</td></tr>
              )}
              {data?.data?.map((s) => (
                <tr key={s.id} className="border-t">
                  <td className="p-2">{s.studentId}</td>
                  <td className="p-2">{s.firstName} {s.lastName}</td>
                  <td className="p-2">{s.gender}</td>
                  <td className="p-2">{s.class}</td>
                  <td className="p-2">{s.currentSchool}</td>
                  <td className="p-2">{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center p-2">
          <span className="text-xs text-gray-500">Total: {total}</span>
          <div className="space-x-2">
            <button className="border px-2 py-1 rounded disabled:opacity-50" disabled={!canPrev} onClick={() => setOffset(Math.max(0, offset - limit))}>Prev</button>
            <button className="border px-2 py-1 rounded disabled:opacity-50" disabled={!canNext} onClick={() => setOffset(offset + limit)}>Next</button>
          </div>
        </div>
      </div>

      <div className="border rounded p-4 space-y-3">
        <h2 className="font-medium">Enroll New Student</h2>
        <div className="grid grid-cols-2 gap-2">
          <input className="border px-2 py-1 rounded" placeholder="First name" value={form.firstName} onChange={e=>setForm({...form, firstName: e.target.value})} />
          <input className="border px-2 py-1 rounded" placeholder="Last name" value={form.lastName} onChange={e=>setForm({...form, lastName: e.target.value})} />
          <input type="date" className="border px-2 py-1 rounded" value={form.dateOfBirth} onChange={e=>setForm({...form, dateOfBirth: e.target.value})} />
          <select className="border px-2 py-1 rounded" value={form.gender} onChange={e=>setForm({...form, gender: e.target.value})}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          <input className="border px-2 py-1 rounded col-span-2" placeholder="Address" value={form.address} onChange={e=>setForm({...form, address: e.target.value})} />
          <input className="border px-2 py-1 rounded" placeholder="Guardian name" value={form.guardianName} onChange={e=>setForm({...form, guardianName: e.target.value})} />
          <input className="border px-2 py-1 rounded" placeholder="Guardian phone" value={form.guardianPhone} onChange={e=>setForm({...form, guardianPhone: e.target.value})} />
          <input className="border px-2 py-1 rounded" placeholder="Current school ID" value={form.currentSchoolId} onChange={e=>setForm({...form, currentSchoolId: e.target.value})} />
        </div>
        <button
          className="border px-3 py-2 rounded disabled:opacity-50"
          disabled={mutate.isPending || !requiredFilled}
          onClick={() => {
            if (!requiredFilled) {
              toast({ title: 'Missing fields', description: 'Please fill all required fields.', variant: 'destructive' })
              return
            }
            mutate.mutate(form)
          }}
        >{mutate.isPending ? 'Enrolling...' : 'Enroll Student'}</button>
        {!requiredFilled && <p className="text-xs text-muted-foreground">Required: first/last name, DOB, gender, guardian name/phone, school ID</p>}
      </div>
    </div>
  )
}
