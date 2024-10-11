'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { XCircle, ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function PaymentCancelledPage() {
  const router = useRouter()

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4"
      >
        <motion.div variants={itemVariants} className="text-center">
          <XCircle className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Payment Cancelled</h1>
          <p className="text-xl text-gray-600 mb-8">No worries! Your payment was not processed.</p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 mb-8">
          <div className="text-center">
            <ShieldCheck className="w-12 h-12 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Your account is secure</p>
          </div>
          <div className="text-center">
            <HelpCircle className="w-12 h-12 text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Need help? Contact us</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center space-y-4">
          <Button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 w-full"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Return to Home
          </Button>
          <Button
            onClick={() => router.push('/#premium')}
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-full transition-all duration-300 w-full"
          >
            Learn More About Premium
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}