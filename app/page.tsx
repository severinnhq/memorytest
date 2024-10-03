"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Brain, Zap, Trophy, ArrowRight, Sparkles } from 'lucide-react'

interface Task {
  name: string
  description: string
  readinessPhrase: string
}

interface User {
  name?: string
  email: string
}

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState<Task | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      console.log('Retrieved user data:', parsedUser)
    }
  }, [])

  const features = [
    { icon: Brain, title: "Cognitive Training", description: "Enhance your memory and cognitive abilities" },
    { icon: Zap, title: "Quick Sessions", description: "Improve in just minutes a day" },
    { icon: Trophy, title: "Track Progress", description: "Monitor your improvement over time" },
  ]

  const tasks = [
    {
      name: "Mid-Level Task",
      description: "This task is designed to challenge your memory at an intermediate level.",
      readinessPhrase: "Are you ready to take on a mid-level memory challenge?"
    },
    {
      name: "Advanced Task",
      description: "This task will push your memory skills to their limits.",
      readinessPhrase: "Are you prepared for an advanced memory challenge?"
    }
  ]

  const openModal = (task: Task) => {
    setCurrentTask(task)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentTask(null)
  }

  const handleTaskSubmit = () => {
    console.log("Task submitted:", currentTask?.name)
    closeModal()
    // Here you would typically navigate to the task page or start the task
  }

  const handleSignOut = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <header className="p-6 bg-white bg-opacity-90 backdrop-blur-sm sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-indigo-800">MemoryMaster</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-indigo-600 font-medium">
                  Welcome, {user.name || user.email.split('@')[0]}
                </span>
                <Button variant="ghost" onClick={handleSignOut} className="text-indigo-600 hover:text-indigo-800">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/signin" passHref>
                <Button variant="ghost" className="text-indigo-600 hover:text-indigo-800">
                  Sign In
                </Button>
              </Link>
            )}
          </motion.div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-5xl font-extrabold text-indigo-800 mb-4">
              Unlock Your Mind&apos;s Potential
            </h2>
            <p className="text-xl text-indigo-600 mb-8">
              Challenge yourself with our memory enhancement tasks and watch your cognitive abilities soar!
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white py-6 px-8 text-lg rounded-full"
              onClick={() => openModal(tasks[0])}
            >
              Start Mid-Level Tasks <ArrowRight className="ml-2" />
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white py-6 px-8 text-lg rounded-full"
              onClick={() => openModal(tasks[1])}
            >
              Start Advanced Tasks <Sparkles className="ml-2" />
            </Button>
          </motion.div>
        </section>

        <section className="mb-16">
          <h3 className="text-3xl font-bold text-center text-indigo-800 mb-8">Why Choose MemoryMaster?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <feature.icon className="w-12 h-12 text-indigo-600 mb-2" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl font-bold text-indigo-800 mb-4">Ready to Begin Your Journey?</h3>
            <p className="text-xl text-indigo-600 mb-8">
              Start enhancing your memory today and unlock your full potential!
            </p>
            <Button className="bg-green-600 hover:bg-green-700 text-white py-6 px-12 text-xl rounded-full">
              Get Started Now
            </Button>
          </motion.div>
        </section>
      </main>

      <footer className="bg-indigo-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2024 MemoryMaster. All rights reserved.</p>
          <nav className="flex gap-6 mt-4 md:mt-0">
            <Link href="/about" className="hover:text-indigo-300">About</Link>
            <Link href="/contact" className="hover:text-indigo-300">Contact</Link>
            <Link href="/privacy" className="hover:text-indigo-300">Privacy Policy</Link>
          </nav>
        </div>
      </footer>

      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentTask?.name}</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{currentTask?.description}</p>
          </div>
          <div className="mt-4 bg-blue-50 rounded-lg p-4">
            <p className="text-blue-700 text-center font-medium">
              {currentTask?.readinessPhrase}
            </p>
          </div>
          <div className="mt-4">
            <Button onClick={handleTaskSubmit} className="w-full">  
              I&apos;m Ready
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}