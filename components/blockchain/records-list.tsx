"use client"

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'

type RecordItem = {
  id: string
  studentId: string | null
  schoolId: string
  recordType: string
  dataHash: string
  transactionHash: string
  blockNumber: number
  contractAddress: string
  createdAt: string
}

type Response = {
  success: boolean
  data: RecordItem[]
  pagination: { total: number; limit: number; offset: number; hasMore: boolean }
}

async function fetchRecords(params: { studentId?: string; schoolId?: string; recordType?: string; limit: number; offset: number; sort?: string }) {
  const q = new URLSearchParams()
  if (params.studentId) q.set('studentId', params.studentId)
  if (params.schoolId) q.set('schoolId', params.schoolId)
  if (params.recordType) q.set('recordType', params.recordType)
  if (params.sort) q.set('sort', params.sort)
  q.set('limit', String(params.limit))
  q.set('offset', String(params.offset))
  const res = await fetch(`/api/blockchain/records?${q.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch blockchain records')
  return res.json() as Promise<Response>
}

export function BlockchainRecordsList({ defaultStudentId = '', defaultSchoolId = '' }: { defaultStudentId?: string; defaultSchoolId?: string }) {
  const { toast } = useToast()
  const [studentId, setStudentId] = useState(defaultStudentId)
  const [schoolId, setSchoolId] = useState(defaultSchoolId)
  const [recordType, setRecordType] = useState<string>('')
  const [offset, setOffset] = useState(0)
  const limit = 10
  const explorer = process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || ''

  const [openHash, setOpenHash] = useState<string | null>(null)
  const { data: txData, isLoading: txLoading, isError: txError } = useQuery({
    queryKey: ['tx-details', openHash],
    queryFn: async () => {
      const res = await fetch(`/api/blockchain/tx?hash=${openHash}`)
      if (!res.ok) throw new Error('Failed to load transaction')
      return res.json() as Promise<{ success: boolean; data: any }>
    },
    enabled: Boolean(openHash),
  })

  useEffect(() => { setOffset(0) }, [studentId, schoolId, recordType])

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['bc-records', { studentId, schoolId, recordType, offset, limit }],
    queryFn: () => fetchRecords({ studentId: studentId || undefined, schoolId: schoolId || undefined, recordType: recordType || undefined, limit, offset, sort: 'createdAt:desc' })
  })

  const total = data?.pagination.total ?? 0
  const canPrev = offset > 0
  const canNext = offset + limit < total

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2 items-center">
        <input className="border px-2 py-1 rounded" placeholder="Student ID" value={studentId} onChange={(e)=>setStudentId(e.target.value)} />
        <input className="border px-2 py-1 rounded" placeholder="School ID" value={schoolId} onChange={(e)=>setSchoolId(e.target.value)} />
        <select className="border px-2 py-1 rounded" value={recordType} onChange={(e)=>setRecordType(e.target.value)}>
          <option value="">All Types</option>
          <option value="RESULT">RESULT</option>
          <option value="ENROLLMENT">ENROLLMENT</option>
          <option value="CERTIFICATE">CERTIFICATE</option>
          <option value="TRANSCRIPT">TRANSCRIPT</option>
        </select>
        <button className="border px-3 py-1 rounded" onClick={()=>refetch()}>Search</button>
      </div>

      <div className="border rounded">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 text-left">Created</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Student</th>
                <th className="p-2 text-left">School</th>
                <th className="p-2 text-left">Block</th>
                <th className="p-2 text-left">Txn</th>
                <th className="p-2 text-left">Hash</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td className="p-3" colSpan={7}>Loading...</td></tr>}
              {isError && <tr><td className="p-3 text-red-600" colSpan={7}>Failed to load</td></tr>}
              {data?.data?.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-2">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="p-2">{r.recordType}</td>
                  <td className="p-2">{r.studentId ?? '-'}</td>
                  <td className="p-2">{r.schoolId}</td>
                  <td className="p-2">{r.blockNumber}</td>
                  <td className="p-2 truncate max-w-[200px]" title={r.transactionHash}>
                    {explorer ? (
                      <a className="text-sky-600 hover:underline" href={`${explorer.replace(/\/$/, '')}/tx/${r.transactionHash}`} target="_blank" rel="noreferrer">
                        {r.transactionHash.slice(0, 10)}...
                      </a>
                    ) : (
                      r.transactionHash.slice(0, 10) + '...'
                    )}
                  </td>
                  <td className="p-2 truncate max-w-[200px]" title={r.dataHash}>{r.dataHash.slice(0,14)}...</td>
                  <td className="p-2">
                    <button
                      className="border px-2 py-1 rounded"
                      onClick={() => setOpenHash(r.transactionHash)}
                    >View receipt</button>
                  </td>
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

      {/* Receipt Modal */}
      {openHash && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={()=>setOpenHash(null)}>
          <div className="bg-white dark:bg-gray-900 rounded shadow max-w-2xl w-full p-4" onClick={(e)=>e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Transaction Receipt</h3>
              <button className="border px-2 py-1 rounded" onClick={()=>setOpenHash(null)}>Close</button>
            </div>
            {txLoading && <p className="text-sm">Loading...</p>}
            {txError && (
              <p className="text-sm text-red-600">Failed to load transaction</p>
            )}
            {txData?.success && (
              <div className="space-y-2">
                {explorer && (
                  <a className="text-sky-600 hover:underline" href={`${explorer.replace(/\/$/, '')}/tx/${openHash}`} target="_blank" rel="noreferrer">Open in Explorer</a>
                )}
                <pre className="text-xs overflow-auto max-h-96 bg-gray-50 dark:bg-gray-800 p-2 rounded">
{JSON.stringify(txData.data, null, 2)}
                </pre>
              </div>
            )}
            {!txLoading && !txData?.success && (
              <p className="text-sm text-red-600">No transaction data available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
