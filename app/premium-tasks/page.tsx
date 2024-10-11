'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Brain,
  Grid,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react'

interface User {
  _id: string;
  name: string;
  email: string;
  hasPaid: boolean;
}

interface TaskSet {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  tasks: number;
}

const taskSets: TaskSet[] = [
  {
    id: 'mid',
    name: 'Mid-Level Memory Master',
    description: 'Enhance your memory skills with these intermediate-level tasks.',
    icon: Grid,
    color: 'from-cyan-500 to-blue-500',
    tasks: 8
  },
  {
    id: 'advanced',
    name: 'Advanced Memory Master',
    description: 'Push your cognitive limits with these challenging memory tasks.',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    tasks: 5
  }
]

export default function PremiumTasksHub() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        if (!parsedUser.hasPaid) {
          router.push('/#premium')
        }
      } else {
        router.push('/auth')
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="text-2xl font-bold text-indigo-600">Loading...</div>
      </div>
    )
  }

  if (!user || !user.hasPaid) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/#premium" passHref>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        <motion.h1 
          className="text-5xl font-bold text-center mb-12 text-indigo-800"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Premium Memory Tasks Hub
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {taskSets.map((set) => (
            <motion.div
              key={set.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl`}
                onClick={() => router.push(`/${set.id}-tasks`)}
              >
                <CardHeader className={`bg-gradient-to-r ${set.color} p-6`}>
                  <div className="flex items-center justify-between">
                    <set.icon className="w-12 h-12 text-white" />
                    <ChevronRight className="w-6 h-6 text-white" />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-2xl font-bold mb-2 text-gray-800">{set.name}</CardTitle>
                  <CardDescription className="text-gray-600 mb-4">{set.description}</CardDescription>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-gray-500">{set.tasks} tasks</span>
                    <Button variant="outline" size="sm">
                      Start Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}