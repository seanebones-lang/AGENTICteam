'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Mail, 
  CreditCard, 
  Star, 
  Clock, 
  TrendingUp,
  Save,
  Trash2,
  Edit,
  CheckCircle,
  BarChart,
  Zap,
  DollarSign
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://bizbot-api.onrender.com'

interface SavedPrompt {
  id: string
  agent_id: string
  agent_name: string
  prompt: string
  created_at: string
}

interface FavoriteAgent {
  id: string
  name: string
  category: string
  times_used: number
}

export default function ProfilePage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  
  // User data
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    credits: 0,
    tier: 'Starter',
    joined: new Date().toISOString().split('T')[0]
  })
  
  const [editForm, setEditForm] = useState({
    name: '',
    email: ''
  })

  // Analytics data
  const [analytics, setAnalytics] = useState({
    total_executions: 0,
    total_spent: 0,
    success_rate: 0,
    favorite_agent: 'Ticket Resolver',
    avg_response_time: '2.3s'
  })

  // Saved prompts (localStorage for now)
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([])
  const [favoriteAgents, setFavoriteAgents] = useState<FavoriteAgent[]>([])

  // Load saved data from localStorage
  useEffect(() => {
    // Load saved prompts
    const saved = localStorage.getItem('saved_prompts')
    if (saved) {
      setSavedPrompts(JSON.parse(saved))
    }
    
    // Load user profile data
    const savedProfile = localStorage.getItem('user_profile')
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setUserData(profile)
      setEditForm({ name: profile.name, email: profile.email })
    }
    
    // Load favorite agents
    const savedFavorites = localStorage.getItem('favorite_agents')
    if (savedFavorites) {
      setFavoriteAgents(JSON.parse(savedFavorites))
    }
  }, [])
  
  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes
      const updatedData = {
        ...userData,
        name: editForm.name,
        email: editForm.email
      }
      setUserData(updatedData)
      localStorage.setItem('user_profile', JSON.stringify(updatedData))
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully",
      })
    } else {
      // Enter edit mode
      setEditForm({ name: userData.name, email: userData.email })
    }
    setIsEditing(!isEditing)
  }
  
  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({ ...prev, [field]: value }))
  }

  const savePrompt = (agentId: string, agentName: string, prompt: string) => {
    const newPrompt: SavedPrompt = {
      id: Date.now().toString(),
      agent_id: agentId,
      agent_name: agentName,
      prompt: prompt,
      created_at: new Date().toISOString()
    }
    const updated = [...savedPrompts, newPrompt]
    setSavedPrompts(updated)
    localStorage.setItem('saved_prompts', JSON.stringify(updated))
    
    toast({
      title: "Prompt Saved",
      description: "Your prompt has been saved successfully",
    })
  }

  const deletePrompt = (id: string) => {
    const updated = savedPrompts.filter(p => p.id !== id)
    setSavedPrompts(updated)
    localStorage.setItem('saved_prompts', JSON.stringify(updated))
    
    toast({
      title: "Prompt Deleted",
      description: "Prompt removed from saved list",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 dark:text-white">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account, view analytics, and save your favorite prompts
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="prompts">Saved Prompts</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Info */}
              <Card className="lg:col-span-2 p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center dark:text-white">
                  <User className="mr-2 h-5 w-5" />
                  Account Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Name</label>
                    <Input 
                      value={isEditing ? editForm.name : userData.name} 
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      readOnly={!isEditing}
                      placeholder="Enter your name"
                      className={isEditing ? 'border-blue-500 dark:border-blue-600' : ''}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Email</label>
                    <Input 
                      value={isEditing ? editForm.email : userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      readOnly={!isEditing}
                      placeholder="Enter your email"
                      type="email"
                      className={isEditing ? 'border-blue-500 dark:border-blue-600' : ''}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">Member Since</label>
                    <Input value={userData.joined ? new Date(userData.joined).toLocaleDateString() : 'Not set'} readOnly className="bg-gray-50 dark:bg-gray-800" />
                  </div>

                  <Button 
                    variant={isEditing ? "default" : "outline"} 
                    className="w-full"
                    onClick={handleEditToggle}
                  >
                    {isEditing ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                  
                  {isEditing && (
                    <Button 
                      variant="ghost" 
                      className="w-full"
                      onClick={() => {
                        setIsEditing(false)
                        setEditForm({ name: userData.name, email: userData.email })
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Card>

              {/* Quick Stats */}
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center dark:text-white">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Credits
                  </h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {userData.credits}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Available Credits</p>
                    <Button size="sm" className="w-full" asChild>
                      <Link href="/pricing">Get More Credits</Link>
                    </Button>
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center dark:text-white">
                    <Star className="mr-2 h-5 w-5" />
                    Current Plan
                  </h3>
                  <Badge className="text-lg px-4 py-2">{userData.tier}</Badge>
                  <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                    <Link href="/pricing">Upgrade Plan</Link>
                  </Button>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-bold dark:text-white">{analytics.total_executions}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Executions</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="text-3xl font-bold dark:text-white">${analytics.total_spent}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Spent</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <CheckCircle className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-3xl font-bold dark:text-white">{analytics.success_rate}%</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="text-3xl font-bold dark:text-white">{analytics.avg_response_time}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Avg Response</p>
              </Card>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center dark:text-white">
                <TrendingUp className="mr-2 h-5 w-5" />
                Usage Over Time
              </h2>
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">Chart coming soon - Execute agents to see data</p>
              </div>
            </Card>
          </TabsContent>

          {/* Saved Prompts Tab */}
          <TabsContent value="prompts" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center dark:text-white">
                <Save className="mr-2 h-5 w-5" />
                Saved Prompts ({savedPrompts.length})
              </h2>

              {savedPrompts.length === 0 ? (
                <div className="text-center py-12">
                  <Save className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">No saved prompts yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Save prompts from the dashboard or agent pages for quick reuse
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedPrompts.map((prompt) => (
                    <Card key={prompt.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{prompt.agent_name}</Badge>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(prompt.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{prompt.prompt}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePrompt(prompt.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/agents/${prompt.agent_id}`}>Use This Prompt</Link>
                      </Button>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6 flex items-center dark:text-white">
                <Star className="mr-2 h-5 w-5" />
                Favorite Agents
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteAgents.map((agent) => (
                  <Card key={agent.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold dark:text-white">{agent.name}</h3>
                        <Badge variant="outline" className="text-xs mt-1">{agent.category}</Badge>
                      </div>
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Used {agent.times_used} times
                      </span>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/agents/${agent.id}`}>Use Agent</Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

