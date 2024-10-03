'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const updatePaymentStatus = async () => {
      const sessionId = searchParams.get('session_id')
      if (!sessionId) {
        setError('No session ID found')
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/payment-success', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId }),
        })

        if (!response.ok) {
          throw new Error('Failed to update payment status')
        }

        // Update local storage
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        user.hasPaid = true
        localStorage.setItem('user', JSON.stringify(user))

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    updatePaymentStatus()
  }, [searchParams])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <h1 className="text-4xl font-bold text-indigo-600 mb-4">Payment Successful!</h1>
      <p className="text-xl text-gray-600 mb-8">Thank you for upgrading to MemoryMaster Premium.</p>
      <Button onClick={() => router.push('/')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
        Return to Home
      </Button>
    </div>
  )
}