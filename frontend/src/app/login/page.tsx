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
      // Mock authentication - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate successful login
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      })
      
      router.push('/dashboard')
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
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
            <Zap className="h-8 w-8 text-blue-600" />
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
                href="/forgot-password"
                className="text-sm text-blue-600 hover:underline"
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

        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            Demo Credentials (Mock Mode)
          </p>
          <div className="text-xs space-y-1 font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded">
            <p>Email: demo@example.com</p>
            <p>Password: demo123</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

