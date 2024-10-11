'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { CheckCircle, Zap, Star, Trophy } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Update local storage to reflect the new payment status
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    user.hasPaid = true
    localStorage.setItem('user', JSON.stringify(user))

    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }, [])

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4"
      >
        <motion.div variants={itemVariants} className="text-center">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Awesome! 🎉</h1>
          <p className="text-xl text-gray-600 mb-8">Your payment was successful. Welcome to the premium club!</p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center">
            <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Faster Learning</p>
          </div>
          <div className="text-center">
            <Star className="w-12 h-12 text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Exclusive Content</p>
          </div>
          <div className="text-center">
            <Trophy className="w-12 h-12 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">Achievements</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="text-center">
          <Button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Start Exploring
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}