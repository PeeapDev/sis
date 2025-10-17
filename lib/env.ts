export type BlockchainConfigStatus = {
  providerConfigured: boolean
  accountConfigured: boolean
  contractConfigured: boolean
  missing: string[]
}

export function getBlockchainConfigStatus(): BlockchainConfigStatus {
  const missing: string[] = []
  const providerConfigured = Boolean(process.env.WEB3_PROVIDER_URL)
  const accountConfigured = Boolean(process.env.BLOCKCHAIN_PRIVATE_KEY)
  const contractConfigured = Boolean(process.env.SMART_CONTRACT_ADDRESS)

  if (!providerConfigured) missing.push('WEB3_PROVIDER_URL')
  if (!accountConfigured) missing.push('BLOCKCHAIN_PRIVATE_KEY')
  if (!contractConfigured) missing.push('SMART_CONTRACT_ADDRESS')

  return { providerConfigured, accountConfigured, contractConfigured, missing }
}
