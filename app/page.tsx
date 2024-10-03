'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Zap, Trophy, LogOut } from 'lucide-react'

export default function Home() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/auth')
  }

  const features = [
    { icon: Brain, title: 'Memory Game', description: 'Engage in fun and challenging memory exercises' },
    { icon: Zap, title: 'Quick Recall', description: 'Improve your ability to quickly recall information' },
    { icon: Trophy, title: 'Track Progress', description: 'Monitor your improvement over time' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <header className="p-6 bg-white bg-opacity-90 backdrop-blur-sm sticky top-0 z-10">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-indigo-600">
            MemoryMaster
          </Link>
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
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link href="/auth" passHref>
                <Button variant="ghost" className="text-indigo-600 hover:text-indigo-800">
                  Sign In / Sign Up
                </Button>
              </Link>
            )}
          </motion.div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold text-center text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Welcome to MemoryMaster
          </h1>
          <p className="mt-5 text-xl text-center text-gray-500">
            Enhance your memory and cognitive skills with our engaging exercises and games.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-indigo-600" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {user ? (
            <Link href="/games" passHref>
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Start Training
              </Button>
            </Link>
          ) : (
            <Link href="/auth" passHref>
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Get Started
              </Button>
            </Link>
          )}
        </motion.div>
      </main>
    </div>
  )
}