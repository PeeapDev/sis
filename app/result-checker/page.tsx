'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  Search, 
  Lock, 
  Unlock, 
  AlertCircle, 
  GraduationCap,
  School,
  ExternalLink,
  Clock,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

// Mock function to validate PIN and get shared history
// TODO: Replace with actual API call
const validatePIN = async (pin: string) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Mock validation - in production, this would check database
  if (pin === '1234567') {
    return {
      valid: true,
      studentName: 'John Doe',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      sharedStages: [
        {
          id: '1',
          grade: 'Primary 1',
          schoolName: 'Freetown Primary School',
          schoolId: 'fps-001',
          schoolGrade: 'A',
          year: '2015',
          averageScore: 85,
          isShared: true
        },
        {
          id: '2',
          grade: 'Primary 2',
          schoolName: 'Freetown Primary School',
          schoolId: 'fps-001',
          schoolGrade: 'A',
          year: '2016',
          averageScore: 87,
          isShared: true
        },
        {
          id: '3',
          grade: 'Primary 3',
          schoolName: 'Freetown Primary School',
          schoolId: 'fps-001',
          schoolGrade: 'A',
          year: '2017',
          averageScore: 89,
          isShared: false // Not shared - will show padlock
        }
      ]
    }
  }
  
  return { valid: false }
}

const schoolGradeColors: Record<string, { bg: string; text: string }> = {
  A: { bg: 'bg-emerald-500', text: 'text-emerald-500' },
  B: { bg: 'bg-blue-500', text: 'text-blue-500' },
  C: { bg: 'bg-yellow-500', text: 'text-yellow-500' },
  D: { bg: 'bg-orange-500', text: 'text-orange-500' }
}

export default function ResultCheckerPage() {
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<any>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (pin.length !== 7) {
      setError('PIN must be exactly 7 digits')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const data = await validatePIN(pin)
      
      if (data.valid) {
        setResult(data)
      } else {
        setError('Invalid PIN or PIN has expired. Please check and try again.')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPin('')
    setResult(null)
    setError('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sierra-green via-sierra-blue to-sierra-gold">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <GraduationCap className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">Sierra Leone SIS</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/auth/login">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Login
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {!result ? (
            /* PIN Entry Form */
            <Card className="sierra-card text-white">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-sierra-gold/20 rounded-full w-fit">
                  <Shield className="h-12 w-12 text-sierra-gold" />
                </div>
                <CardTitle className="text-3xl mb-2">Verify Academic History</CardTitle>
                <CardDescription className="text-white/80">
                  Enter the 7-digit PIN to view shared academic records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Info Alert */}
                <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                  <AlertCircle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800 dark:text-blue-200">
                    This is a secure verification system. Only authorized individuals with a valid PIN can access shared academic information.
                  </AlertDescription>
                </Alert>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="pin" className="text-sm font-medium">
                      Enter 7-Digit PIN
                    </label>
                    <Input
                      id="pin"
                      type="text"
                      maxLength={7}
                      value={pin}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        setPin(value)
                        setError('')
                      }}
                      placeholder="0000000"
                      className="text-center text-2xl tracking-widest font-mono h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                  </div>

                  {error && (
                    <Alert className="border-red-500 bg-red-50 dark:bg-red-900/20">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800 dark:text-red-200">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-sierra-gold text-sierra-blue hover:bg-sierra-gold/90 h-12 text-lg"
                    disabled={loading || pin.length !== 7}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sierra-blue mr-2"></div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-5 w-5" />
                        Verify PIN
                      </>
                    )}
                  </Button>
                </form>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-sm text-white/60 text-center">
                    Don't have a PIN? Contact the student to request access to their academic history.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Results Display */
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Header Card */}
                <Card className="sierra-card text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-500/20 rounded-full">
                          <CheckCircle className="h-8 w-8 text-green-400" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{result.studentName}</h2>
                          <p className="text-white/60">Academic History</p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={handleReset}
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Check Another PIN
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Clock className="h-4 w-4" />
                      <span>
                        Access expires: {result.expiresAt.toLocaleDateString()} at {result.expiresAt.toLocaleTimeString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Shared Stages */}
                <Card className="sierra-card text-white">
                  <CardHeader>
                    <CardTitle>Shared Academic Records</CardTitle>
                    <CardDescription className="text-white/80">
                      {result.sharedStages.filter((s: any) => s.isShared).length} of {result.sharedStages.length} stages shared
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {result.sharedStages.map((stage: any) => (
                        <div
                          key={stage.id}
                          className={`relative border-2 rounded-lg p-4 transition-all ${
                            stage.isShared
                              ? 'border-white/20 bg-white/5 hover:bg-white/10'
                              : 'border-gray-600 bg-gray-800/50 opacity-60'
                          }`}
                        >
                          {/* Padlock Icon for Non-Shared */}
                          {!stage.isShared && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg backdrop-blur-sm">
                              <div className="text-center">
                                <Lock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-400 font-medium">Not Shared</p>
                              </div>
                            </div>
                          )}

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <h3 className="font-bold">{stage.grade}</h3>
                              {stage.isShared && stage.schoolGrade && (
                                <Badge className={`${schoolGradeColors[stage.schoolGrade].bg} text-white text-[9px] h-4`}>
                                  Grade {stage.schoolGrade}
                                </Badge>
                              )}
                            </div>

                            {stage.isShared && (
                              <>
                                <div className="flex items-center gap-1 text-xs text-white/80">
                                  <School className="h-3 w-3" />
                                  <span className="truncate">{stage.schoolName}</span>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                  <span className="text-xs text-white/60">{stage.year}</span>
                                  <span className="text-sm font-bold text-green-400">
                                    {stage.averageScore}%
                                  </span>
                                </div>

                                {stage.schoolId && (
                                  <Link 
                                    href={`/schools/${stage.schoolId}`}
                                    className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors mt-2"
                                  >
                                    View School
                                    <ExternalLink className="h-3 w-3" />
                                  </Link>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Privacy Notice */}
                <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                  <Shield className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    <strong>Privacy Notice:</strong> This information is shared with you under a time-limited access agreement. Please respect the student's privacy and do not share this information without permission.
                  </AlertDescription>
                </Alert>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  )
}
