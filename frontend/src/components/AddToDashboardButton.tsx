'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/hooks/use-toast'
import { Plus, Check } from 'lucide-react'

interface AddToDashboardButtonProps {
  agentId: string
  agentName: string
  variant?: 'default' | 'outline'
  size?: 'default' | 'sm' | 'lg'
}

export function AddToDashboardButton({ 
  agentId, 
  agentName, 
  variant = 'outline', 
  size = 'lg' 
}: AddToDashboardButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleAddToDashboard = async () => {
    setIsLoading(true)
    
    try {
      // Simulate API call to add agent to dashboard
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Store in localStorage for now (would be API call in production)
      const dashboardAgents = JSON.parse(localStorage.getItem('dashboardAgents') || '[]')
      if (!dashboardAgents.includes(agentId)) {
        dashboardAgents.push(agentId)
        localStorage.setItem('dashboardAgents', JSON.stringify(dashboardAgents))
      }
      
      setIsAdded(true)
      toast({
        title: "Added to Dashboard",
        description: `${agentName} has been added to your dashboard`,
      })
    } catch (error) {
      toast({
        title: "Failed to add to dashboard",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant={variant} 
      size={size}
      onClick={handleAddToDashboard}
      disabled={isLoading || isAdded}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          Adding...
        </>
      ) : isAdded ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Added to Dashboard
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-2" />
          Add to Dashboard
        </>
      )}
    </Button>
  )
}
