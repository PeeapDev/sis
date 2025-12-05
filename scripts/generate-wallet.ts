// Script to generate a new Solana wallet for development
import { Keypair } from '@solana/web3.js'
import bs58 from 'bs58'

const keypair = Keypair.generate()

console.log('\n🔑 New Solana Wallet Generated\n')
console.log('=' .repeat(60))
console.log('\n📍 Public Key (Wallet Address):')
console.log(keypair.publicKey.toBase58())
console.log('\n🔐 Private Key (Base58 - add to SOLANA_PRIVATE_KEY in .env):')
console.log(bs58.encode(keypair.secretKey))
console.log('\n⚠️  Keep your private key secure! Never share it publicly.')
console.log('\n📋 Add this to your .env.local file:')
console.log(`SOLANA_PRIVATE_KEY="${bs58.encode(keypair.secretKey)}"`)
console.log('\n🪂 To get devnet SOL, visit:')
console.log(`https://faucet.solana.com/?address=${keypair.publicKey.toBase58()}`)
console.log('\nOr use the airdrop API endpoint: POST /api/blockchain/airdrop')
console.log('=' .repeat(60))
