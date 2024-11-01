'use client'

import React, { useState, useEffect, useRef } from 'react'
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
  Eye,
  Clock,
  Lightbulb,
  Puzzle,
  Compass,
} from 'lucide-react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

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

interface MemoryAspect {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
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

const memoryAspects: MemoryAspect[] = [
  { id: 'short-term', name: 'Short-term Memory', icon: Zap, color: 'from-yellow-400 to-yellow-600' },
  { id: 'long-term', name: 'Long-term Memory', icon: Clock, color: 'from-red-400 to-red-600' },
  { id: 'working', name: 'Working Memory', icon: Brain, color: 'from-purple-400 to-purple-600' },
  { id: 'semantic', name: 'Semantic Memory', icon: Lightbulb, color: 'from-green-400 to-green-600' },
  { id: 'episodic', name: 'Episodic Memory', icon: Compass, color: 'from-blue-400 to-blue-600' },
  { id: 'procedural', name: 'Procedural Memory', icon: Puzzle, color: 'from-pink-400 to-pink-600' },
  { id: 'sensory', name: 'Sensory Memory', icon: Eye, color: 'from-indigo-400 to-indigo-600' },
  { id: 'prospective', name: 'Prospective Memory', icon: Target, color: 'from-teal-400 to-teal-600' },
]

function AIIcon() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.PI / 4
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.2
    }
  })

  return (
    <group ref={groupRef} scale={1.2}>
      <mesh rotation={[0, 0, 0]} scale={[1, 0.75, 1]}>
        <torusGeometry args={[0.7, 0.02, 16, 100, Math.PI * 2]} />
        <meshStandardMaterial color="#a5b4fc" />
      </mesh>
      <mesh rotation={[0, Math.PI / 2, 0]} scale={[1.2, 0.9, 1.2]}>
        <torusGeometry args={[0.7, 0.02, 16, 100, Math.PI * 2]} />
        <meshStandardMaterial color="#818cf8" />
      </mesh>
      <mesh position={[0.7, 0, 0]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>
      <mesh position={[-0.7, 0, 0]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>
      <mesh position={[0, 0, 0.84]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>
      <mesh position={[0, 0, -0.84]}>
        <sphereGeometry args={[0.08, 32, 32]} />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>
    </group>
  )
}

function AIIconWrapper() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enableZoom={false} />
      <AIIcon />
    </Canvas>
  )
}

function Timer() {
  const targetDate = new Date('2024-11-08T00:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      setTimeLeft(difference > 0 ? difference : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className="flex space-x-4">
      {[
        { value: days, label: 'Days' },
        { value: hours, label: 'Hours' },
        { value: minutes, label: 'Minutes' },
        { value: seconds, label: 'Seconds' }
      ].map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="bg-white rounded-lg shadow-md p-3 w-16 h-16 flex items-center justify-center border border-indigo-200">
            <span className="text-2xl font-bold text-indigo-800">{value.toString().padStart(2, '0')}</span>
          </div>
          <span className="text-sm mt-2 text-indigo-800 font-medium">{label}</span>
        </div>
      ))}
    </div>
  )
}

export default function PremiumTasksHub() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null)
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

  const handleAspectClick = (aspectId: string) => {
    router.push(`/aspect-tasks/${aspectId}`)
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

      <div className="pt-24 pb-12 px-4 mb-12">
        <div className="container mx-auto">
          <motion.h1 
            className="text-4xl font-bold text-center mb-12 mt-24 text-gray-800"
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

          <div className="mt-12 mb-12">
            <h2 className="text-4xl font-bold text-center mt-48 mb-12 text-gray-800">Aspect-Based Memory Tasks</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {memoryAspects.map((aspect) => (
                <motion.div
                  key={aspect.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setHoveredAspect(aspect.id)}
                  onHoverEnd={() => setHoveredAspect(null)}
                  onClick={() => handleAspectClick(aspect.id)}
                  className="relative cursor-pointer"
                >
                  <div className={`bg-gradient-to-br ${aspect.color} rounded-lg p-6 flex flex-col items-center justify-center h-40 transition-all duration-300 shadow-lg`}>
                    <aspect.icon className="w-12 h-12 text-white mb-4" />
                    <h3 className="text-lg font-semibold text-white text-center">{aspect.name}</h3>
                  </div>
                  <AnimatePresence>
                    {hoveredAspect === aspect.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center"
                      >
                        <p className="text-white text-center px-4">
                          Click to start tasks focused on {aspect.name.toLowerCase()}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mt-48">
            <Card className="bg-white text-gray-800 p-8 shadow-2xl max-w-3xl mx-auto rounded-2xl border border-indigo-200">
              <CardContent className="flex flex-col items-center gap-6">
                <div className="w-full h-80 mb-4">
                  <AIIconWrapper />
                </div>
                <CardTitle className="text-3xl font-bold text-center mb-4 text-indigo-800">AI Features Launch</CardTitle>
                <Timer />
              </CardContent>
            </Card>
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