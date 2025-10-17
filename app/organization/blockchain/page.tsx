"use client"
import { BlockchainRecordsList } from '@/components/blockchain/records-list'

export default function Page() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Organization • Blockchain</h1>
      <p className="text-sm text-muted-foreground">Review org-wide blockchain records.</p>
      <BlockchainRecordsList />
    </div>
  )
}
