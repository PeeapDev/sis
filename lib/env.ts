export type BlockchainConfigStatus = {
  providerConfigured: boolean
  accountConfigured: boolean
  networkConfigured: boolean
  missing: string[]
}

export function getBlockchainConfigStatus(): BlockchainConfigStatus {
  const missing: string[] = []
  const providerConfigured = Boolean(process.env.SOLANA_RPC_URL || process.env.SOLANA_NETWORK)
  const accountConfigured = Boolean(process.env.SOLANA_PRIVATE_KEY)
  const networkConfigured = Boolean(process.env.SOLANA_NETWORK)

  if (!providerConfigured) missing.push('SOLANA_RPC_URL or SOLANA_NETWORK')
  if (!accountConfigured) missing.push('SOLANA_PRIVATE_KEY')

  return { providerConfigured, accountConfigured, networkConfigured, missing }
}
