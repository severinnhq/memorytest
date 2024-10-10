'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentSuccess() {
  const [updateStatus, setUpdateStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const updatePaymentStatus = async () => {
      try {
        const sessionId = searchParams.get('session_id')
        if (!sessionId) {
          throw new Error('Session ID not found')
        }

        const response = await fetch(`/api/payment-success?session_id=${sessionId}`)
        const data = await response.json()

        if (response.ok) {
          setUpdateStatus('success')
          // Update local storage
          const userJson = localStorage.getItem('user')
          if (userJson) {
            const user = JSON.parse(userJson)
            user.hasPaid = true
            localStorage.setItem('user', JSON.stringify(user))
          }
        } else {
          throw new Error(data.error || 'Failed to update payment status')
        }
      } catch (error: unknown) {
        console.error('Error updating payment status:', error)
        setUpdateStatus('error')
        setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred')
      }
    }

    updatePaymentStatus()
  }, [searchParams])

  const handleContinue = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Payment Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {updateStatus === 'loading' && <p className="text-center">Updating payment status...</p>}
          {updateStatus === 'success' && (
            <>
              <p className="text-center text-green-600">Payment successful and status updated!</p>
              <Button onClick={handleContinue} className="w-full">
                Continue to Dashboard
              </Button>
            </>
          )}
          {updateStatus === 'error' && (
            <>
              <p className="text-center text-red-600">Failed to update payment status: {errorMessage}</p>
              <p className="text-center">Please contact support with this error message.</p>
              <Button onClick={handleContinue} className="w-full">
                Return to Dashboard
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}