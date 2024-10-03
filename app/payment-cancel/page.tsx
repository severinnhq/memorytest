'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export default function PaymentCancelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-8 text-indigo-800">Payment Cancelled</h1>
        <p className="mb-8 text-gray-600">
          Your payment was cancelled. If you change your mind, you can always upgrade later.
        </p>
        <Button onClick={() => router.push('/')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
          Return to Home
        </Button>
      </div>
    </div>
  )
}