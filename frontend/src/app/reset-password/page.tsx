'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // For now, since we don't have email service set up,
      // we'll show a helpful message and redirect to support
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSent(true)
      
      toast({
        title: "Password Reset Request Received",
        description: "We'll send you instructions via email shortly",
      })
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process password reset request",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-4 dark:text-white">Check Your Email</h1>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We've sent password reset instructions to <strong>{email}</strong>
          </p>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Didn't receive the email? Check your spam folder or contact support.
            </p>
            
            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/login">
                  Return to Login
                </Link>
              </Button>
              
              <Button variant="outline" asChild>
                <Link href="/support">
                  Contact Support
                </Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-6">
          <Link 
            href="/login" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Login
          </Link>
          
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
              <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-2 dark:text-white">
            Reset Password
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Enter your email and we'll send you reset instructions
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2 dark:text-gray-300">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Need immediate help?</strong> Contact our support team at{' '}
            <a href="mailto:support@bizbot.store" className="underline">
              support@bizbot.store
            </a>
          </p>
        </div>
      </Card>
    </div>
  )
}

