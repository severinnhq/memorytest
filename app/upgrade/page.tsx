'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { loadStripe } from '@stripe/stripe-js'

interface User {
  _id: string;
  name: string;
  email: string;
  hasPaid: boolean;
}

export default function UpgradePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push('/auth')
    }
  }, [router])

  const handleUpgrade = async () => {
    if (!user) {
      console.error('No user found')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: user._id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const { sessionId } = await response.json()

      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId })
        if (error) {
          throw error
        }
      } else {
        throw new Error('Failed to load Stripe')
      }
    } catch (error) {
      console.error('Error in upgrade process:', error)
      // Here you might want to show an error message to the user
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="text-2xl font-bold text-indigo-600">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-800">Upgrade to MemoryMaster Premium</h1>
        <p className="text-center mb-8 text-gray-600">
          Unlock advanced features and take your memory training to the next level!
        </p>
        <div className="flex justify-center">
          <Button 
            onClick={handleUpgrade} 
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isLoading ? 'Processing...' : 'Upgrade Now'}
          </Button>
        </div>
      </div>
    </div>
  )
}