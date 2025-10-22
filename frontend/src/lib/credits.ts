// Credit management system

const CREDITS_KEY = 'user_credits'
const INITIAL_CREDITS = 10 // Free trial credits

export interface CreditBalance {
  total: number
  used: number
  remaining: number
  lastUpdated: string
}

export const getCredits = (): CreditBalance => {
  if (typeof window === 'undefined') {
    return { total: 0, used: 0, remaining: 0, lastUpdated: new Date().toISOString() }
  }

  const stored = localStorage.getItem(CREDITS_KEY)
  
  if (!stored) {
    // Initialize with free trial credits
    const initial: CreditBalance = {
      total: INITIAL_CREDITS,
      used: 0,
      remaining: INITIAL_CREDITS,
      lastUpdated: new Date().toISOString()
    }
    localStorage.setItem(CREDITS_KEY, JSON.stringify(initial))
    return initial
  }
  
  return JSON.parse(stored)
}

export const addCredits = (amount: number): CreditBalance => {
  const current = getCredits()
  const updated: CreditBalance = {
    total: current.total + amount,
    used: current.used,
    remaining: current.remaining + amount,
    lastUpdated: new Date().toISOString()
  }
  localStorage.setItem(CREDITS_KEY, JSON.stringify(updated))
  return updated
}

export const useCredits = (amount: number): { success: boolean; balance: CreditBalance } => {
  const current = getCredits()
  
  if (current.remaining < amount) {
    return { success: false, balance: current }
  }
  
  const updated: CreditBalance = {
    total: current.total,
    used: current.used + amount,
    remaining: current.remaining - amount,
    lastUpdated: new Date().toISOString()
  }
  
  localStorage.setItem(CREDITS_KEY, JSON.stringify(updated))
  return { success: true, balance: updated }
}

export const resetCredits = (): CreditBalance => {
  const reset: CreditBalance = {
    total: INITIAL_CREDITS,
    used: 0,
    remaining: INITIAL_CREDITS,
    lastUpdated: new Date().toISOString()
  }
  localStorage.setItem(CREDITS_KEY, JSON.stringify(reset))
  return reset
}

export const getCreditCost = (agentId: string): number => {
  // Standard cost per agent execution
  // Can be customized per agent in the future
  return 3
}

