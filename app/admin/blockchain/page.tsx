"use client"
import { BlockchainRecordsList } from '@/components/blockchain/records-list'

export default function Page() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Admin • Blockchain</h1>
      <p className="text-sm text-muted-foreground">Search and view blockchain records across the system.</p>
      <BlockchainRecordsList />
    </div>
  )
}
