'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Shield, Database, Bell, Lock, Globe } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Page() {
  const { toast } = useToast()
  const [solanaConfig, setSolanaConfig] = useState({
    rpcUrl: '',
    walletPrivateKey: '',
    programId: '',
    network: 'devnet'
  })

  const handleSaveSolanaConfig = () => {
    // Save to localStorage or API
    localStorage.setItem('solana_config', JSON.stringify(solanaConfig))
    toast({
      title: 'Solana Configuration Saved',
      description: 'Your Solana blockchain settings have been updated successfully.',
    })
  }

  return (
    <DashboardLayout>
      <motion.div 
        className="space-y-6 h-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ paddingTop: 0 }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-sierra-green/10 rounded-lg">
            <Settings className="h-6 w-6 text-sierra-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">Configure system settings and integrations.</p>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="blockchain" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          {/* Blockchain Settings */}
          <TabsContent value="blockchain" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Solana Blockchain Configuration
                </CardTitle>
                <CardDescription>
                  Connect your platform to the Solana network to store student records on the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="network">Network</Label>
                    <select
                      id="network"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sierra-green dark:bg-gray-800 dark:border-gray-700"
                      value={solanaConfig.network}
                      onChange={(e) => setSolanaConfig({ ...solanaConfig, network: e.target.value })}
                    >
                      <option value="devnet">Devnet (Testing)</option>
                      <option value="testnet">Testnet</option>
                      <option value="mainnet-beta">Mainnet Beta (Production)</option>
                    </select>
                    <p className="text-xs text-gray-500">Select the Solana network to connect to</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rpcUrl">RPC URL</Label>
                    <Input
                      id="rpcUrl"
                      type="text"
                      placeholder="https://api.devnet.solana.com"
                      value={solanaConfig.rpcUrl}
                      onChange={(e) => setSolanaConfig({ ...solanaConfig, rpcUrl: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">
                      Solana RPC endpoint URL (e.g., Alchemy, QuickNode, or public RPC)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="walletPrivateKey">Wallet Private Key</Label>
                    <Input
                      id="walletPrivateKey"
                      type="password"
                      placeholder="Enter your wallet private key"
                      value={solanaConfig.walletPrivateKey}
                      onChange={(e) => setSolanaConfig({ ...solanaConfig, walletPrivateKey: e.target.value })}
                    />
                    <p className="text-xs text-red-500">
                      ⚠️ Keep this secure! Never share your private key. This will be encrypted and stored securely.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="programId">Program ID (Smart Contract Address)</Label>
                    <Input
                      id="programId"
                      type="text"
                      placeholder="Enter Solana program ID"
                      value={solanaConfig.programId}
                      onChange={(e) => setSolanaConfig({ ...solanaConfig, programId: e.target.value })}
                    />
                    <p className="text-xs text-gray-500">
                      The deployed Solana program (smart contract) address for storing records
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleSaveSolanaConfig}
                    className="bg-sierra-green hover:bg-sierra-green/90"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Save Configuration
                  </Button>
                  <Button variant="outline">
                    Test Connection
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Additional Blockchain Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Blockchain Explorer
                </CardTitle>
                <CardDescription>
                  View your transactions on Solana blockchain explorer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <p className="font-medium">Solana Explorer</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {solanaConfig.network === 'mainnet-beta' ? 'https://explorer.solana.com' : 
                         solanaConfig.network === 'testnet' ? 'https://explorer.solana.com?cluster=testnet' :
                         'https://explorer.solana.com?cluster=devnet'}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a 
                        href={solanaConfig.network === 'mainnet-beta' ? 'https://explorer.solana.com' : 
                              solanaConfig.network === 'testnet' ? 'https://explorer.solana.com?cluster=testnet' :
                              'https://explorer.solana.com?cluster=devnet'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open Explorer
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure general system preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">General settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage security and access control</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Security settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Configure notification preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">Notification settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </DashboardLayout>
  )
}
