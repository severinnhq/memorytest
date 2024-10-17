'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Brain,
  HouseIcon,
  Sparkles,
  BookOpen,
  Mail,
  Grid,
  ChevronRight,
  Menu,
  User as UserIcon,
  LogOut,
  Zap,
  Target,
  Lock,
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
  comingSoon?: boolean;
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
  },
  {
    id: 'aspect',
    name: 'Aspect-Based Memory Tasks',
    description: 'Automatic access: Tailored tasks focusing on specific aspects of memory.',
    icon: Zap,
    color: 'from-yellow-400 to-orange-500',
    tasks: 0,
    comingSoon: true
  },
  {
    id: 'detector',
    name: 'Memory Problem Detector AI',
    description: 'Automatic access: AI-powered analysis to identify and improve weak areas of memory.',
    icon: Target,
    color: 'from-green-400 to-teal-500',
    tasks: 0,
    comingSoon: true
  }
]

export default function PremiumTasksHub() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSignOut = () => {
    localStorage.removeItem('user')
    router.push('/')
  }

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="bg-white shadow-md fixed top-0 left-0 right-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Brain className="h-8 w-auto sm:h-10 text-[#4f46e5]" />
                <span className="ml-2 text-2xl font-bold text-[#4f46e5]">Nrglitch</span>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-10 flex-grow justify-center">
              <Link href="/" className="text-base font-medium text-gray-500 hover:text-[#4f46e5] transition-colors duration-200">Home</Link>
              <Link href="/#premium" className="text-base font-medium text-gray-500 hover:text-[#4f46e5] transition-colors duration-200">Premium</Link>
              <Link href="/#our-story" className="text-base font-medium text-gray-500 hover:text-[#4f46e5] transition-colors duration-200">Our Story</Link>
            </nav>
            <div className="hidden md:flex items-center">
              <div className="flex items-center space-x-4">
                <UserIcon className="h-8 w-8 text-[#4f46e5]"  />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#4f46e5]">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
                <Button variant="ghost" onClick={handleSignOut} className="p-1">
                  <LogOut className="h-6 w-6 text-[#4f46e5]" />
                </Button>
              </div>
            </div>
            <div className="md:hidden">
              <Button
                variant="ghost"
                className="inline-flex items-center justify-center p-2 rounded-md text-[#4f46e5] hover:text-[#4f46e5] hover:bg-[#4f46e5]/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4f46e5]"
                onClick={toggleMenu}
              >
                <span className="sr-only">Open menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="md:hidden fixed top-16 left-0 right-0 bg-white z-40 shadow-md"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-[#4f46e5] hover:bg-[#4f46e5]/10" onClick={toggleMenu}>Home</Link>
              <Link href="/#premium" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-[#4f46e5] hover:bg-[#4f46e5]/10" onClick={toggleMenu}>Premium</Link>
              <Link href="/#our-story" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-[#4f46e5] hover:bg-[#4f46e5]/10" onClick={toggleMenu}>Our Story</Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <UserIcon className="h-8 w-8 text-[#4f46e5]" />
                <div className="ml-3">
                  <div className="text-base font-medium text-[#4f46e5]">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
                <Button variant="ghost" onClick={handleSignOut} className="ml-auto p-1">
                  <LogOut className="h-6 w-6 text-[#4f46e5]" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-24 pb-12 px-4 mt-12 mb-12">
        <div className="container mx-auto">
          <motion.h1 
            className="text-4xl font-bold text-center mb-12 mt-16 text-gray-800"
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
                  className={`overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl ${set.comingSoon ? 'opacity-75' : ''}`}
                  onClick={() => !set.comingSoon && router.push(`/${set.id}-tasks`)}
                >
                  <CardHeader className={`bg-gradient-to-r ${set.color} p-6`}>
                    <div className="flex items-center justify-between">
                      <set.icon className="w-12 h-12 text-white" />
                      {set.comingSoon ? (
                        <Lock className="w-6 h-6 text-white" />
                      ) : (
                        <ChevronRight className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <CardTitle className="text-2xl font-bold mb-2 text-gray-800">{set.name}</CardTitle>
                    <CardDescription className="text-gray-600 mb-4">{set.description}</CardDescription>
                    <div className="flex justify-between items-center">
                      {set.comingSoon ? (
                        <span className="text-sm font-semibold text-gray-500">Coming Soon</span>
                      ) : (
                        <span className="text-sm font-semibold text-gray-500">{set.tasks} tasks</span>
                      )}
                      <Button variant="outline" size="sm" disabled={set.comingSoon}>
                        {set.comingSoon ? 'Coming Soon' : 'Start Now'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <footer className="bg-[#4f46e5] text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-8">
            <Link href="/" className="flex items-center">
              <Brain className="h-8 w-auto sm:h-10 text-white" />
              <span className="ml-2 text-2xl font-bold">Nrglitch</span>
            </Link>
            <nav className="flex flex-wrap justify-center gap-6">
              <Link href="/" passHref>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                  <HouseIcon className="h-5 w-5 mr-2" />
                  Home
                </Button>
              </Link>
              <Link href="/#premium" passHref>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Premium
                </Button>
              </Link>
              <Link href="/#our-story" passHref>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Our Story
                </Button>
              </Link>
              <Link href="/#contact" passHref>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact
                </Button>
              </Link>
            </nav>
          </div>
          <div className="mt-8 border-t border-white/20 pt-8 text-center">
            <p className="text-white/80">&copy; 2024 Nrglitch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}