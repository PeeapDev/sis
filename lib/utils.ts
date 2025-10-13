import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-SL', {
    style: 'currency',
    currency: 'SLL',
  }).format(amount)
}

export function calculateGPA(results: { score: number }[]) {
  if (results.length === 0) return 0
  
  const totalPoints = results.reduce((sum, result) => {
    // Convert percentage to 4.0 scale
    const gpaPoint = (result.score / 100) * 4
    return sum + gpaPoint
  }, 0)
  
  return Math.round((totalPoints / results.length) * 100) / 100
}

export function getGradeFromScore(score: number): string {
  if (score >= 90) return 'A+'
  if (score >= 85) return 'A'
  if (score >= 80) return 'A-'
  if (score >= 75) return 'B+'
  if (score >= 70) return 'B'
  if (score >= 65) return 'B-'
  if (score >= 60) return 'C+'
  if (score >= 55) return 'C'
  if (score >= 50) return 'C-'
  if (score >= 45) return 'D+'
  if (score >= 40) return 'D'
  return 'F'
}

export function generateStudentId(schoolCode: string, year: number): string {
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `${schoolCode}${year}${randomNum}`
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^(\+232|232)?[0-9]{8}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}
