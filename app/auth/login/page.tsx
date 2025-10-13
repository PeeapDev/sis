'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GraduationCap, Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const demoAccounts = [
    {
      email: 'admin@sis.gov.sl',
      password: 'password123',
      role: 'SUPER_ADMIN',
      name: 'System Administrator',
      redirect: '/admin/dashboard',
      description: 'Full system access',
      color: 'bg-red-500'
    },
    {
      email: 'district@sis.gov.sl',
      password: 'password123',
      role: 'DISTRICT_ADMIN',
      name: 'District Administrator',
      redirect: '/admin/dashboard',
      description: 'District-level management',
      color: 'bg-orange-500'
    },
    {
      email: 'school@sis.gov.sl',
      password: 'password123',
      role: 'SCHOOL_ADMIN',
      name: 'School Administrator',
      redirect: '/school/dashboard',
      description: 'School management',
      color: 'bg-blue-500'
    },
    {
      email: 'student@sis.gov.sl',
      password: 'password123',
      role: 'STUDENT',
      name: 'Demo Student',
      redirect: '/student/dashboard',
      description: 'Student portal access',
      color: 'bg-green-500'
    },
    {
      email: 'research@sis.gov.sl',
      password: 'password123',
      role: 'ORGANIZATION',
      name: 'Research Organization',
      redirect: '/organization/dashboard',
      description: 'Research & analytics access',
      color: 'bg-purple-500'
    }
  ]

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    setIsLoading(true)
    setEmail(account.email)
    setPassword(account.password)
    setRole(account.role)

    setTimeout(() => {
      // Store user data in localStorage for demo
      localStorage.setItem('user', JSON.stringify({
        email: account.email,
        role: account.role,
        name: account.name,
      }))
      
      toast({
        title: 'Login Successful',
        description: `Welcome ${account.name}!`,
      })
      
      router.push(account.redirect)
      setIsLoading(false)
    }, 1000)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Demo authentication
      const accountsMap = demoAccounts.reduce((acc, account) => {
        acc[account.email] = account
        return acc
      }, {} as Record<string, typeof demoAccounts[0]>)

      const account = accountsMap[email]
      
      if (account && password === 'password123') {
        // Store user data in localStorage for demo
        localStorage.setItem('user', JSON.stringify({
          email,
          role: account.role,
          name: account.name,
        }))
        
        toast({
          title: 'Login Successful',
          description: `Welcome to Sierra Leone SIS!`,
        })
        
        router.push(account.redirect)
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid credentials. Try demo accounts.',
          variant: 'destructive',
        })
      }
      
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sierra-green via-sierra-blue to-sierra-gold flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="sierra-card text-white">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <GraduationCap className="h-12 w-12 text-sierra-gold" />
            </div>
            <CardTitle className="text-2xl">Sierra Leone SIS</CardTitle>
            <CardDescription className="text-white/80">
              Sign in to access the School Information System
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-white/60" />
                    ) : (
                      <Eye className="h-4 w-4 text-white/60" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STUDENT">Student</SelectItem>
                    <SelectItem value="TEACHER">Teacher</SelectItem>
                    <SelectItem value="SCHOOL_ADMIN">School Admin</SelectItem>
                    <SelectItem value="DISTRICT_ADMIN">District Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">System Admin</SelectItem>
                    <SelectItem value="ORGANIZATION">Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-sierra-gold hover:bg-sierra-gold/90 text-sierra-blue"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="text-center text-sm text-white/60">
                <p className="font-semibold mb-3">Quick Demo Login:</p>
                <div className="grid grid-cols-1 gap-2">
                  {demoAccounts.map((account, index) => (
                    <motion.button
                      key={account.email}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleDemoLogin(account)}
                      disabled={isLoading}
                      className={`
                        w-full p-3 rounded-lg text-left transition-all duration-200
                        bg-white/10 hover:bg-white/20 border border-white/20
                        disabled:opacity-50 disabled:cursor-not-allowed
                        group
                      `}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${account.color}`}></div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-white group-hover:text-sierra-gold transition-colors">
                            {account.name}
                          </div>
                          <div className="text-xs text-white/60">
                            {account.description}
                          </div>
                        </div>
                        <div className="text-xs text-white/40">
                          Click to login
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
                <p className="text-xs text-sierra-gold mt-3">
                  All accounts use password: password123
                </p>
              </div>
              
              <div className="text-center">
                <Link href="/" className="text-sm text-sierra-gold hover:underline">
                  Back to Home
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
