'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
  const [isProcessing, setIsProcessing] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const processPayment = async () => {
      const sessionId = searchParams.get('session_id')
      if (!sessionId) {
        console.error('No session ID found')
        setIsProcessing(false)
        return
      }

      try {
        const response = await fetch('/api/payment-success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        })

        if (response.ok) {
          // Update local storage or state management
          setIsProcessing(false)
        } else {
          console.error('Error processing payment')
          setIsProcessing(false)
        }
      } catch (error) {
        console.error('Error processing payment:', error)
        setIsProcessing(false)
      }
    }

    processPayment()
  }, [searchParams])

  if (isProcessing) {
    return <div>Processing payment...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-8 text-indigo-800">Payment Successful!</h1>
        <p className="mb-8 text-gray-600">
          Thank you for upgrading to MemoryMaster Premium. You now have access to all advanced features.
        </p>
        <Button onClick={() => router.push('/')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Return to Home
        </Button>
      </div>
    </div>
  )
}