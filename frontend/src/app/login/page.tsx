'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/Card'
import { Zap, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Check if user exists in localStorage (simple auth for now)
      const savedProfile = localStorage.getItem('user_profile')
      
      if (savedProfile) {
        const profile = JSON.parse(savedProfile)
        
        // Simple email match (no password validation for demo)
        if (profile.email && profile.email.toLowerCase() === formData.email.toLowerCase()) {
          // Store auth token
          localStorage.setItem('auth_token', 'demo-token-' + Date.now())
          localStorage.setItem('user_email', formData.email)
          
          toast({
            title: "Login Successful",
            description: `Welcome back, ${profile.name || formData.email}!`,
          })
          
          router.push('/console')
          return
        }
      }
      
      // If no profile found, try backend API
      try {
        const { apiService } = await import('@/lib/api')
        const response = await apiService.login(formData.email, formData.password)
        
        localStorage.setItem('auth_token', response.access_token)
        localStorage.setItem('user_email', formData.email)
        localStorage.setItem('user_data', JSON.stringify(response.user))
        
        toast({
          title: "Login Successful",
          description: `Welcome back!`,
        })
        
        router.push('/console')
      } catch (apiError) {
        // Backend not available or user not found
        throw new Error("No account found with this email. Please sign up first.")
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid email or password. If you just paid, try signing up with the same email.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-bold">Agent Marketplace</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/reset-password"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
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

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{' '}
          </span>
          <Link href="/signup" className="text-blue-600 hover:underline font-semibold">
            Sign up
          </Link>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            <strong>Just completed payment?</strong> You'll need to sign up first to create your account, then your credits will be added.
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-400 mt-2">
            Need help? Contact <a href="mailto:support@bizbot.store" className="underline">support@bizbot.store</a>
          </p>
        </div>

        {/* Demo credentials removed for production security */}
      </Card>
    </div>
  )
}

