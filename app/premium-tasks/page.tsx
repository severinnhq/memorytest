'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, HomeIcon as HouseIcon, Sparkles, BookOpen, Mail, Grid, ChevronRight, Menu, UserIcon, LogOut, Zap, Target, Eye, Clock, Lightbulb, Puzzle, Compass, ArrowLeft, CheckCircle2, Lock, Palette, Headphones, Camera, Calendar, FileText, Briefcase, Hand } from 'lucide-react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"
import TaskModal from '@/components/TaskModal'
import TaskDescriptionModal from '@/components/TaskDescriptionModal'

// Import task components
import ShortTermTask1 from '@/tasks/short-term-task1'
import ShortTermTask2 from '@/tasks/short-term-task2'
import ShortTermTask3 from '@/tasks/short-term-task3'
import LongTermTask1 from '@/tasks/long-term-task1'
import LongTermTask2 from '@/tasks/long-term-task2'
import LongTermTask3 from '@/tasks/long-term-task3'
import WorkingTask1 from '@/tasks/working-task1'
import WorkingTask2 from '@/tasks/working-task2'
import WorkingTask3 from '@/tasks/working-task3'
import SemanticTask1 from '@/tasks/semantic-task1'
import SemanticTask2 from '@/tasks/semantic-task2'
import SemanticTask3 from '@/tasks/semantic-task3'
import EpisodicTask1 from '@/tasks/episodic-task1'
import EpisodicTask2 from '@/tasks/episodic-task2'
import EpisodicTask3 from '@/tasks/episodic-task3'
import ProceduralTask1 from '@/tasks/procedural-task1'
import ProceduralTask2 from '@/tasks/procedural-task2'
import ProceduralTask3 from '@/tasks/procedural-task3'
import SensoryTask1 from '@/tasks/sensory-task1'
import SensoryTask2 from '@/tasks/sensory-task2'
import SensoryTask3 from '@/tasks/sensory-task3'

// Type definitions
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
  comingSoon?: boolean;
}

interface Task {
  id: number;
  name: string;
  description: string;
  icon: React.ElementType;
  readinessPhrase: string;
}

// Constants
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
  { id: 'short-term', name: 'Short-term', icon: Zap, color: 'from-yellow-400 to-yellow-600' },
  { id: 'long-term', name: 'Long-term', icon: Clock, color: 'from-red-400 to-red-600' },
  { id: 'working', name: 'Working', icon: Brain, color: 'from-purple-400 to-purple-600' },
  { id: 'semantic', name: 'Semantic', icon: Lightbulb, color: 'from-green-400 to-green-600' },
  { id: 'episodic', name: 'Episodic', icon: Compass, color: 'from-blue-400 to-blue-600' },
  { id: 'procedural', name: 'Procedural', icon: Puzzle, color: 'from-pink-400 to-pink-600' },
  { id: 'sensory', name: 'Sensory', icon: Eye, color: 'from-indigo-400 to-indigo-600' },
  { id: 'prospective', name: 'Prospective', icon: Target, color: 'from-teal-400 to-teal-600', comingSoon: true },
]

const midLevelTasks: { [key: string]: Task[] } = {
  'short-term': [
    { id: 1, name: "Digit Span", description: "Memorize and recall a sequence of digits in the correct order.", icon: Grid, readinessPhrase: "Ready to test your short-term memory?" },
    { id: 2, name: "Visual Pattern", description: "Remember and reproduce a visual pattern of colored squares.", icon: Palette, readinessPhrase: "Prepared to challenge your visual memory?" },
    { id: 3, name: "Word List", description: "Recall a list of words in the correct order after a brief presentation.", icon: FileText, readinessPhrase: "Ready to exercise your verbal memory?" },
  ],
  'long-term': [
    { id: 1, name: "Fact Recall", description: "Answer questions about previously learned facts after a delay.", icon: Lightbulb, readinessPhrase: "Ready to test your long-term memory retrieval?" },
    { id: 2, name: "Picture Recognition", description: "Identify previously seen images among new ones after a delay.", icon: Camera, readinessPhrase: "Prepared to challenge your visual long-term memory?" },
    { id: 3, name: "Story Recall", description: "Retell a story you heard earlier, including as many details as possible.", icon: BookOpen, readinessPhrase: "Ready to exercise your narrative memory?" },
  ],
  'working': [
    { id: 1, name: "Operation Span Task", description: "Solve math problems while remembering letters, then recall the sequence of letters and math results.", icon: Brain, readinessPhrase: "Ready to challenge your working memory?" },
    { id: 2, name: "Grid Pattern Recall", description: "Memorize and recreate patterns on a grid while ignoring visual distractions.", icon: Grid, readinessPhrase: "Prepared to test your mental juggling skills?" },
    { id: 3, name: "Auditory Sequence Recall", description: "Listen to a sequence of musical notes and recreate it by tapping the correct keys in order.", icon: Headphones, readinessPhrase: "Ready to exercise your spatial working memory?" },
  ],
  'semantic': [
    { id: 1, name: "Random Category Word Recall", description: "Memorize words from a random category and recall them to test your semantic memory.", icon: Lightbulb, readinessPhrase: "Ready to test your semantic memory retrieval?" },
    { id: 2, name: "Semantic Chain Challenge", description: "Memorize and recall a sequence of semantically related words and emojis to test your cognitive abilities.", icon: FileText, readinessPhrase: "Prepared to challenge your vocabulary knowledge?" },
    { id: 3, name: "Fact Verification", description: "Quickly determine if presented statements are true or false based on general knowledge.", icon: CheckCircle2, readinessPhrase: "Ready to exercise your semantic memory speed?" },
  ],
  'episodic': [
    { id: 1, name: "Event Recall", description: "Recall specific details about a previously described event or personal experience.", icon: Calendar, readinessPhrase: "Ready to test your episodic memory?" },
    { id: 2, name: "Source Memory", description: "Remember not just the information, but where or how you learned it.", icon: Compass, readinessPhrase: "Prepared to challenge your source memory?" },
    { id: 3, name: "Virtual Tour", description: "Navigate a virtual environment and later recall specific details about the locations visited.", icon: Eye, readinessPhrase: "Ready to exercise your spatial episodic memory?" },
  ],
  'procedural': [
    { id: 1, name: "Color Sequence Memory", description: "Memorize and reproduce progressively longer sequences of colored buttons to test your procedural memory skills.", icon: Puzzle, readinessPhrase: "Ready to test your procedural memory?" },
    { id: 2, name: "Mirror Tracing", description: "Trace a shape while only being able to see your hand and the shape in a mirror.", icon: Palette, readinessPhrase: "Prepared to challenge your motor learning?" },
    { id: 3, name: "Rhythm Reproduction", description: "Listen to and then reproduce a rhythmic pattern by tapping.", icon: Headphones, readinessPhrase: "Ready to exercise your auditory-motor memory?" },
  ],
  'sensory': [
    { id: 1, name: "Visual Pattern Recall", description: "Test your visual memory by observing and recreating colorful grid patterns of increasing complexity.", icon: Headphones, readinessPhrase: "Ready to test your auditory sensory memory?" },
    { id: 2, name: "Tactile Pattern Memory", description: "Memorize and reproduce patterns of touch points on a shape diagram to test your tactile memory and spatial awareness.", icon: Hand, readinessPhrase: "Prepared to challenge your tactile memory?" },
    { id: 3, name: "Iconic Memory", description: "Report details from a briefly flashed visual array.", icon: Eye, readinessPhrase: "Ready to exercise your visual sensory memory?" },
  ],
  'prospective': [
    { id: 1, name: "Time-Based Task", description: "Remember to perform an action after a specific amount of time has passed.", icon: Clock, readinessPhrase: "Ready to test your time-based prospective memory?" },
    { id: 2, name: "Event-Based Task", description: "Remember to perform an action when a specific event occurs.", icon: Calendar, readinessPhrase: "Prepared to challenge your event-based prospective memory?" },
    { id: 3, name: "Intention Retention", description: "Maintain and execute a series of intended actions over a period of time.", icon: Briefcase, readinessPhrase: "Ready to exercise your intention retention skills?" },
  ],
}

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
  const [timeLeft, setTimeLeft] = useState(0)
  const targetDate = new Date('2024-11-16T00:00:00').getTime()

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const difference = targetDate - now
      setTimeLeft(difference > 0 ? difference : 0)
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

  return (
    <div className="flex justify-center items-center space-x-3 sm:space-x-4 md:space-x-6">
      {[
        { value: days, label: 'Days' },
        { value: hours, label: 'Hours' },
        { value: minutes, label: 'Minutes' },
        { value: seconds, label: 'Seconds' }
      ].map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="bg-indigo-100 rounded-lg shadow p-2 sm:p-3 w-14 sm:w-16 md:w-20 h-14 sm:h-16 md:h-20 flex items-center justify-center">
            <span className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold text-indigo-800">{value.toString().padStart(2, '0')}</span>
          </div>
          <span className="text-[10px] sm:text-xs md:text-sm mt-1 text-indigo-600 font-medium">{label}</span>
        </div>
      ))}
    </div>
  )
}

const TaskCard: React.FC<{
  task: Task;
  onClick: () => void;
  borderColor: string;
}> = ({ task, onClick, borderColor }) => {
  const Icon = task.icon
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 h-[280px] flex flex-col hover:shadow-xl hover:-translate-y-1 cursor-pointer"
      style={{ borderLeft: `4px solid ${borderColor}` }}
      whileHover={{ scale: 1.03 }}
      onClick={onClick}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-indigo-600">{task.name}</div>
          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
        </div>
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-indigo-100 rounded-full">
            <Icon className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <div className="text-gray-600 text-sm mb-4 flex-grow h-[72px] overflow-hidden">
          {task.description}
        </div>
        <div className="text-indigo-500 text-sm font-semibold mt-auto">
          Click to start
        </div>
      </div>
    </motion.div>
  )
}

export default function PremiumTasksHub() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredAspect, setHoveredAspect] = useState<string | null>(null)
  const [selectedAspect, setSelectedAspect] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
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
    const aspect = memoryAspects.find(a => a.id === aspectId)
    if (aspect && !aspect.comingSoon) {
      setSelectedAspect(aspectId)
    }
  }

  const handleBackToAspects = () => {
    setSelectedAspect(null)
  }

  const handleTaskCompletion = (success: boolean) => {
    if (success) {
      setSelectedTask(null)
      setIsTaskModalOpen(false)
    }
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsDescriptionModalOpen(true)
  }

  const handleTaskStart = () => {
    setIsDescriptionModalOpen(false)
    setIsTaskModalOpen(true)
  }

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false)
    setSelectedTask(null)
  }

  const renderTaskComponent = (task: Task) => {
    if (selectedAspect === 'short-term' && task.id === 1) {
      return <ShortTermTask1 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'short-term' && task.id === 2) {
      return <ShortTermTask2 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'short-term' && task.id === 3) {
      return <ShortTermTask3 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'long-term' && task.id === 1) {
      return <LongTermTask1 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'long-term' && task.id === 2) {
      return <LongTermTask2 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'long-term' && task.id === 3) {
      return <LongTermTask3 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'working' && task.id === 1) {
      return <WorkingTask1 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'working' && task.id === 2) {
      return <WorkingTask2 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'working' && task.id === 3) {
      return <WorkingTask3 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'semantic' && task.id === 1) {
      return <SemanticTask1 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'semantic' && task.id === 2) {
      return <SemanticTask2 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'semantic' && task.id === 3) {
      return <SemanticTask3 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'episodic' && task.id === 1) {
      return <EpisodicTask1 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'episodic' && task.id === 2) {
      return <EpisodicTask2 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'episodic' && task.id === 3) {
      return <EpisodicTask3 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'procedural' && task.id === 1) {
      return <ProceduralTask1 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'procedural' && task.id === 2) {
      return <ProceduralTask2 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'procedural' && task.id === 3) {
      return <ProceduralTask3 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'sensory' && task.id === 1) {
      return <SensoryTask1 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'sensory' && task.id === 2) {
      return <SensoryTask2 onComplete={handleTaskCompletion} />
    } else if (selectedAspect === 'sensory' && task.id === 3) {
      return <SensoryTask3 onComplete={handleTaskCompletion} />
    }

    // For all other tasks
    return (
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-indigo-800">{task.name}</h2>
        <p className="mb-4 text-gray-700">{task.description}</p>
        <p className="text-gray-600">This task is not yet implemented.</p>
        <Button onClick={() => handleTaskCompletion(true)}>Complete Task (Demo)</Button>
      </div>
    )
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
                <Brain className="h-8 w-auto sm:h-10 text-[#4f46e5]" aria-hidden="true" />
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
                <UserIcon className="h-8 w-8 text-[#4f46e5]" aria-hidden="true" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#4f46e5]">{user.name}</span>
                  <span className="text-xs text-gray-500">{user.email}</span>
                </div>
                <Button variant="ghost" onClick={handleSignOut} className="p-1">
                  <LogOut className="h-6 w-6 text-[#4f46e5]" aria-hidden="true" />
                  <span className="sr-only">Sign out</span>
                </Button>
              </div>
            </div>
            <div className="md:hidden">
              <Button
                variant="ghost"
                className="inline-flex items-center justify-center p-2 rounded-md text-[#4f46e5] hover:text-[#4f46e5] hover:bg-[#4f46e5]/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#4f46e5]"
                onClick={toggleMenu}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
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
            id="mobile-menu"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-[#4f46e5] hover:bg-[#4f46e5]/10" onClick={toggleMenu}>Home</Link>
              <Link href="/#premium" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-[#4f46e5] hover:bg-[#4f46e5]/10" onClick={toggleMenu}>Premium</Link>
              <Link href="/#our-story" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-[#4f46e5] hover:bg-[#4f46e5]/10" onClick={toggleMenu}>Our Story</Link>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-5">
                <UserIcon className="h-8 w-8 text-[#4f46e5]" aria-hidden="true" />
                <div className="ml-3">
                  <div className="text-base font-medium text-[#4f46e5]">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
                <Button variant="ghost" onClick={handleSignOut} className="ml-auto p-1">
                  <LogOut className="h-6 w-6 text-[#4f46e5]" aria-hidden="true" />
                  <span className="sr-only">Sign out</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-24 pb-12 px-4 mb-12">
        <div className="container mx-auto">
          <motion.h1 
            className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 mt-16 sm:mt-24 text-gray-800"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Premium Memory Tasks Hub
          </motion.h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
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
                  <CardHeader className={`bg-gradient-to-r ${set.color} p-4 sm:p-6`}>
                    <div className="flex items-center justify-between">
                      <set.icon className="w-8 h-8 sm:w-12 sm:h-12 text-white" aria-hidden="true" />
                      {set.comingSoon ? (
                        <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
                      ) : (
                        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <CardTitle className="text-xl sm:text-2xl font-bold mb-2 text-gray-800">{set.name}</CardTitle>
                    <CardDescription className="text-sm sm:text-base text-gray-600 mb-4">{set.description}</CardDescription>
                    <div className="flex justify-between items-center">
                      {set.comingSoon ? (
                        <span className="text-xs sm:text-sm font-semibold text-gray-500">Coming Soon</span>
                      ) : (
                        <span className="text-xs sm:text-sm font-semibold text-gray-500">{set.tasks} tasks</span>
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

          {!selectedAspect ? (
            <section className="mt-12 mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mt-32 sm:mt-48 mb-8 sm:mb-12 text-gray-800">Aspect-Based Memory Tasks</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                {memoryAspects.map((aspect) => (
                  <motion.div
                    key={aspect.id}
                    whileHover={{ scale: aspect.comingSoon ? 1 : 1.05 }}
                    whileTap={{ scale: aspect.comingSoon ? 1 : 0.95 }}
                    onHoverStart={() => setHoveredAspect(aspect.id)}
                    onHoverEnd={() => setHoveredAspect(null)}
                    onClick={() => !aspect.comingSoon && handleAspectClick(aspect.id)}
                    className={`relative ${aspect.comingSoon ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className={`bg-gradient-to-br ${aspect.color} rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center h-32 sm:h-40 transition-all duration-300 shadow-lg ${aspect.comingSoon ? 'opacity-50' : ''}`}>
                      <aspect.icon className="w-8 h-8 sm:w-12 sm:h-12 text-white mb-2 sm:mb-4" aria-hidden="true" />
                      <h3 className="text-sm sm:text-lg font-semibold text-white text-center">{aspect.name}</h3>
                      {aspect.comingSoon && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    <AnimatePresence>
                      {hoveredAspect === aspect.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          className="absolute inset-0 bg-black bg-opacity-70 rounded-lg flex items-center justify-center"
                        >
                          <p className="text-white text-center text-xs sm:text-sm px-2 sm:px-4">
                            {aspect.comingSoon
                              ? `${aspect.name} tasks coming soon!`
                              : `Click to start tasks focused on ${aspect.name.toLowerCase()}`}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </section>
          ) : (
            <section className="mt-48 mb-12 container mx-auto px-4">
              <div className="flex flex-col items-center mb-12">
                <div className="w-full flex justify-between items-center mb-6">
                  <Button
                    variant="outline"
                    onClick={handleBackToAspects}
                    className="flex items-center gap-2 bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-50 transition-all duration-300 shadow-md hover:shadow-lg px-6 py-3 rounded-full"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-semibold">Back to Memory Hub</span>
                  </Button>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800">
                  {selectedAspect.charAt(0).toUpperCase() + selectedAspect.slice(1)} Memory Tasks
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                  {midLevelTasks[selectedAspect].map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TaskCard
                        task={task}
                        onClick={() => handleTaskClick(task)}
                        borderColor={memoryAspects.find(a => a.id === selectedAspect)?.color.split(' ')[1] || '#4f46e5'}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          )}

          <section className="mt-32 sm:mt-48">
            <Card className="bg-white text-gray-800 p-6 sm:p-8 shadow-2xl max-w-5xl mx-auto rounded-2xl border border-indigo-200">
              <CardContent className="flex flex-col items-center gap-4 sm:gap-6">
                <div className="w-full h-60 sm:h-80 mb-2 sm:mb-4">
                  <AIIconWrapper />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-bold text-center mb-2 sm:mb-4 text-indigo-800">AI Features Launch</CardTitle>
                <Timer />
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      <footer className="bg-[#4f46e5] text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-8">
            <Link href="/" className="flex items-center">
              <Brain className="h-8 w-auto sm:h-10 text-white" aria-hidden="true" />
              <span className="ml-2 text-2xl font-bold">Nrglitch</span>
            </Link>
            <nav className="flex flex-wrap justify-center gap-6">
              <Link href="/" passHref>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                  <HouseIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Home
                </Button>
              </Link>
              <Link href="/#premium" passHref>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                  <Sparkles className="h-5 w-5 mr-2" aria-hidden="true" />
                  Premium
                </Button>
              </Link>
              <Link href="/#our-story" passHref>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                  <BookOpen className="h-5 w-5 mr-2" aria-hidden="true" />
                  Our Story
                </Button>
              </Link>
              <Link href="/#contact" passHref>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                  <Mail className="h-5 w-5 mr-2" aria-hidden="true" />
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

      {selectedTask && (
        <TaskDescriptionModal
          isOpen={isDescriptionModalOpen}
          onClose={() => setIsDescriptionModalOpen(false)}
          onSubmit={handleTaskStart}
          task={selectedTask}
        />
      )}
      {selectedTask && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={handleCloseTaskModal}
        >
          {renderTaskComponent(selectedTask)}
        </TaskModal>
      )}
    </div>
  )
}