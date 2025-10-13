'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  GraduationCap, 
  BarChart3, 
  Map, 
  Search, 
  Shield, 
  Users,
  BookOpen,
  Award,
  Globe,
  Database
} from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

const features = [
  {
    icon: BarChart3,
    title: 'Data Analytics',
    description: 'Comprehensive charts and visualizations of educational data across Sierra Leone'
  },
  {
    icon: Map,
    title: 'Interactive Maps',
    description: 'Geographical visualization of schools, districts, and educational statistics'
  },
  {
    icon: Search,
    title: 'Advanced Search',
    description: 'Powerful search functionality across all educational records and data'
  },
  {
    icon: Users,
    title: 'Multi-Dashboard System',
    description: 'Separate dashboards for admins, schools, and students with role-based access'
  },
  {
    icon: Globe,
    title: 'Inter-School API',
    description: 'Secure API for data exchange between different school information systems'
  },
  {
    icon: Shield,
    title: 'Blockchain Integration',
    description: 'Permanent, tamper-proof storage of educational records on the blockchain'
  }
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sierra-green via-sierra-blue to-sierra-gold">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2"
        >
          <GraduationCap className="h-8 w-8 text-white" />
          <span className="text-xl font-bold text-white">Sierra Leone SIS</span>
        </motion.div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Link href="/auth/login">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              Login
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Sierra Leone
            <br />
            <span className="text-sierra-gold">Education Hub</span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            A comprehensive School Information System for Sierra Leone featuring data analytics, 
            interactive maps, blockchain integration, and seamless inter-school communication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="bg-white text-sierra-blue hover:bg-white/90">
                <Users className="mr-2 h-5 w-5" />
                Access Dashboard
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <Map className="mr-2 h-5 w-5" />
                Explore Data
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4">System Features</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Built with modern technology to serve Sierra Leone's educational ecosystem
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 * index }}
            >
              <Card className="sierra-card text-white h-full hover:bg-white/20 transition-colors">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-sierra-gold mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/80">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Card className="sierra-card text-white">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-4 gap-8 text-center">
                <div>
                  <BookOpen className="h-12 w-12 text-sierra-gold mx-auto mb-4" />
                  <div className="text-3xl font-bold mb-2">2,500+</div>
                  <div className="text-white/80">Schools Connected</div>
                </div>
                <div>
                  <Users className="h-12 w-12 text-sierra-gold mx-auto mb-4" />
                  <div className="text-3xl font-bold mb-2">500K+</div>
                  <div className="text-white/80">Students Tracked</div>
                </div>
                <div>
                  <Award className="h-12 w-12 text-sierra-gold mx-auto mb-4" />
                  <div className="text-3xl font-bold mb-2">1M+</div>
                  <div className="text-white/80">Results Stored</div>
                </div>
                <div>
                  <Database className="h-12 w-12 text-sierra-gold mx-auto mb-4" />
                  <div className="text-3xl font-bold mb-2">100%</div>
                  <div className="text-white/80">Blockchain Secured</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-white/60 border-t border-white/10">
        <p>&copy; 2024 Sierra Leone School Information System. Built for educational excellence.</p>
      </footer>
    </div>
  )
}
