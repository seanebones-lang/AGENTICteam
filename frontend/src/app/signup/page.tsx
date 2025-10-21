'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/Card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Zap, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    orgName: '',
    email: '',
    password: '',
    confirmPassword: '',
    tier: 'bronze',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Mock registration - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Account Created!",
        description: "Your 14-day free trial has started",
      })
      
      router.push('/dashboard')
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Zap className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">Agent Marketplace</span>
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Start your 14-day free trial. No credit card required.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orgName">Organization Name</Label>
            <Input
              id="orgName"
              type="text"
              placeholder="Acme Inc."
              value={formData.orgName}
              onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
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
            <Label htmlFor="tier">Select Plan</Label>
            <Select value={formData.tier} onValueChange={(value) => setFormData({ ...formData, tier: value })}>
              <SelectTrigger id="tier">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bronze">Bronze - $499/mo</SelectItem>
                <SelectItem value="silver">Silver - $1,499/mo</SelectItem>
                <SelectItem value="gold">Gold - $4,999/mo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Start Free Trial'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
          </span>
          <Link href="/login" className="text-blue-600 hover:underline font-semibold">
            Sign in
          </Link>
        </div>

        <p className="mt-6 text-xs text-center text-gray-600 dark:text-gray-400">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="underline">Privacy Policy</Link>
        </p>
      </Card>
    </div>
  )
}

