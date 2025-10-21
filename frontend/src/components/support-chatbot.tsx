'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  HelpCircle,
  ExternalLink,
  Phone,
  Mail
} from 'lucide-react'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  options?: ChatOption[]
}

interface ChatOption {
  label: string
  action: 'message' | 'link' | 'contact'
  value: string
}

const initialBotMessage: Message = {
  id: '1',
  type: 'bot',
  content: "Hi! I'm here to help you with Agentic AI Solutions. What can I assist you with today?",
  timestamp: new Date(),
  options: [
    { label: "Getting Started", action: "message", value: "getting_started" },
    { label: "Account Issues", action: "message", value: "account_issues" },
    { label: "Agent Problems", action: "message", value: "agent_problems" },
    { label: "Billing Questions", action: "message", value: "billing" },
    { label: "Talk to Human", action: "contact", value: "human" }
  ]
}

const chatResponses: Record<string, Message> = {
  getting_started: {
    id: 'getting_started',
    type: 'bot',
    content: "Great! Here's how to get started:\n\n1. **Create Account** - Sign up with your email\n2. **Choose Plan** - Start with our free tier\n3. **Deploy Agent** - Browse our marketplace and activate your first agent\n\nWould you like help with any specific step?",
    timestamp: new Date(),
    options: [
      { label: "Sign Up Help", action: "link", value: "/signup" },
      { label: "View Plans", action: "link", value: "/pricing" },
      { label: "Browse Agents", action: "link", value: "/agents" },
      { label: "Back to Menu", action: "message", value: "main_menu" }
    ]
  },
  account_issues: {
    id: 'account_issues',
    type: 'bot',
    content: "I can help with common account issues:\n\n**Login Problems:**\n• Check email/password spelling\n• Try password reset\n• Clear browser cache\n\n**Email Verification:**\n• Check spam folder\n• Request new verification\n• Add support@bizbot.store to contacts\n\nWhat specific issue are you having?",
    timestamp: new Date(),
    options: [
      { label: "Reset Password", action: "link", value: "/login" },
      { label: "Contact Support", action: "contact", value: "email" },
      { label: "Back to Menu", action: "message", value: "main_menu" }
    ]
  },
  agent_problems: {
    id: 'agent_problems',
    type: 'bot',
    content: "Let me help with agent execution issues:\n\n**Agent Not Responding:**\n• Check internet connection\n• Verify sufficient credits\n• Try simpler task first\n\n**Poor Responses:**\n• Be more specific in instructions\n• Provide more context\n• Break complex tasks into steps\n• Test in playground first\n\nWhich issue matches your situation?",
    timestamp: new Date(),
    options: [
      { label: "Try Playground", action: "link", value: "/playground" },
      { label: "Check Credits", action: "link", value: "/dashboard" },
      { label: "Contact Support", action: "contact", value: "human" },
      { label: "Back to Menu", action: "message", value: "main_menu" }
    ]
  },
  billing: {
    id: 'billing',
    type: 'bot',
    content: "I can help with billing questions:\n\n**Payment Issues:**\n• Verify card details\n• Check with your bank\n• Try different payment method\n\n**Credits Not Updating:**\n• Wait 2-3 minutes and refresh\n• Check billing history\n• Verify payment processed\n\n**Plans & Pricing:**\n• Free: 10 executions/month\n• Pro: Unlimited + priority\n• Enterprise: Custom solutions\n\nWhat billing question do you have?",
    timestamp: new Date(),
    options: [
      { label: "View Pricing", action: "link", value: "/pricing" },
      { label: "Check Billing", action: "link", value: "/dashboard" },
      { label: "Payment Support", action: "contact", value: "email" },
      { label: "Back to Menu", action: "message", value: "main_menu" }
    ]
  },
  main_menu: initialBotMessage
}

export function SupportChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([initialBotMessage])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = inputValue
    
    // Add user message
    addMessage({
      type: 'user',
      content: userMessage
    })

    // Show bot typing
    setIsTyping(true)
    setInputValue('')

    try {
      // Call Claude API for intelligent response
      const response = await fetch('/api/support-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_history: messages.slice(-5) // Send last 5 messages for context
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      
      setIsTyping(false)
      
      // Add Claude's response
      addMessage({
        type: 'bot',
        content: data.response,
        options: data.suggested_actions || []
      })

    } catch (error) {
      setIsTyping(false)
      console.error('Chat error:', error)
      
      // Fallback to keyword matching if API fails
      const input = userMessage.toLowerCase()
      let fallbackResponse: Message

      if (input.includes('start') || input.includes('begin') || input.includes('new')) {
        fallbackResponse = chatResponses.getting_started
      } else if (input.includes('login') || input.includes('account') || input.includes('password')) {
        fallbackResponse = chatResponses.account_issues
      } else if (input.includes('agent') || input.includes('execute') || input.includes('run')) {
        fallbackResponse = chatResponses.agent_problems
      } else if (input.includes('pay') || input.includes('bill') || input.includes('credit') || input.includes('price')) {
        fallbackResponse = chatResponses.billing
      } else {
        fallbackResponse = {
          id: 'fallback',
          type: 'bot',
          content: "I'm having trouble connecting to my smart response system right now. Let me help you with these options:",
          timestamp: new Date(),
          options: [
            { label: "Getting Started", action: "message", value: "getting_started" },
            { label: "Account Issues", action: "message", value: "account_issues" },
            { label: "Agent Problems", action: "message", value: "agent_problems" },
            { label: "Talk to Human", action: "contact", value: "human" }
          ]
        }
      }

      addMessage(fallbackResponse)
    }
  }

  const handleOptionClick = (option: ChatOption) => {
    if (option.action === 'message') {
      const response = chatResponses[option.value]
      if (response) {
        addMessage(response)
      }
    } else if (option.action === 'link') {
      window.open(option.value, '_blank')
    } else if (option.action === 'contact') {
      if (option.value === 'human') {
        addMessage({
          type: 'bot',
          content: "I'll connect you with our support team. Choose your preferred contact method:",
          options: [
            { label: "📧 Email Support", action: "contact", value: "email" },
            { label: "📞 Phone Support", action: "contact", value: "phone" },
            { label: "💬 Live Chat", action: "contact", value: "chat" }
          ]
        })
      } else if (option.value === 'email') {
        window.open('mailto:support@bizbot.store?subject=Support Request from Chatbot', '_blank')
      } else if (option.value === 'phone') {
        window.open('tel:+18176759898', '_blank')
      } else if (option.value === 'chat') {
        addMessage({
          type: 'bot',
          content: "Live chat is currently available! Our average response time is 2 minutes. You can start a live chat session from our main support page.",
          options: [
            { label: "Open Live Chat", action: "link", value: "/support#contact" }
          ]
        })
      }
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
          <Card className="h-[500px] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                <div>
                  <h3 className="font-semibold">AI Support Assistant</h3>
                  <p className="text-xs text-blue-100">Powered by Claude • Expert knowledge</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-lg p-3 ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{message.content}</p>
                    </div>
                    
                    {/* Options */}
                    {message.options && (
                      <div className="mt-2 space-y-1">
                        {message.options.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleOptionClick(option)}
                            className="w-full justify-start text-xs h-8"
                          >
                            {option.action === 'link' && <ExternalLink className="h-3 w-3 mr-1" />}
                            {option.action === 'contact' && <HelpCircle className="h-3 w-3 mr-1" />}
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500 mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  
                  <div className={`flex-shrink-0 ${message.type === 'user' ? 'order-1 mr-2' : 'order-2 ml-2'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                    }`}>
                      {message.type === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        <Bot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by Claude AI • Can help with any platform question
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
