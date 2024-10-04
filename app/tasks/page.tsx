'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain,
  Grid,
  Palette,
  Box,
  Music,
  SwitchCamera,
  Clock,
  ArrowLeft,
  Lock,
  CheckCircle2
} from 'lucide-react'

interface User {
  _id: string;
  name: string;
  email: string;
  hasPaid: boolean;
}

interface Task {
  id: number;
  name: string;
  description: string;
  icon: React.ElementType;
  readinessPhrase: string;
}

const tasks: Task[] = [
  { id: 1, name: "Dual N-Back", description: "Simultaneously remember visual and auditory stimuli N steps back.", icon: Brain, readinessPhrase: "Prepared to challenge your mind?" },
  { id: 2, name: "Visual Pattern Recall", description: "Memorize and select the correct cells in a grid pattern, choosing each cell only once.", icon: Grid, readinessPhrase: "Ready to test your precise visual memory?" },
  { id: 3, name: "Symbol Sequence Association", description: "Memorize symbol-color pairs and recall them in a timed sequence.", icon: Palette, readinessPhrase: "Ready to test your association skills?" },
  { id: 4, name: "Multi-Dimensional Memory Matrix", description: "Memorize and recall a 3x3 grid of shapes, colors, and numbers.", icon: Grid, readinessPhrase: "Ready for a compact multi-dimensional memory challenge?" },
  { id: 5, name: "3D Memory Maze", description: "Navigate a 3D maze, memorizing symbols and their locations, then recall the path and symbols in order.", icon: Box, readinessPhrase: "Ready to explore the depths of your spatial memory?" },
  { id: 6, name: "Auditory Sequence Mastery", description: "Remember and reproduce complex rhythms and tone sequences.", icon: Music, readinessPhrase: "Set to tune your auditory memory?" },
  { id: 7, name: "Multitasking Memory Challenge", description: "Switch between multiple memory tasks while maintaining accuracy.", icon: SwitchCamera, readinessPhrase: "Prepared to juggle mental tasks?" },
  { id: 8, name: "Time Distortion Perception", description: "Estimate time intervals while engaged in memory tasks.", icon: Clock, readinessPhrase: "Ready to bend your perception of time?" },
]

const STORAGE_KEY = 'unlockedLevels'

const TaskCard: React.FC<{
  task: Task;
  isUnlocked: boolean;
  onClick: () => void;
}> = ({ task, isUnlocked, onClick }) => {
  const Icon = task.icon
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 h-[280px] flex flex-col ${
        isUnlocked ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' : 'opacity-50'
      }`}
      whileHover={isUnlocked ? { scale: 1.03 } : {}}
      onClick={isUnlocked ? onClick : undefined}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-indigo-600">{task.name}</div>
          {isUnlocked ? (
            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
          ) : (
            <Lock className="w-6 h-6 text-gray-400 flex-shrink-0" />
          )}
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
          {isUnlocked ? 'Click to start' : 'Locked'}
        </div>
      </div>
    </motion.div>
  )
}

export default function TasksPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [unlockedLevels, setUnlockedLevels] = useState<number>(1)
  const [isClient, setIsClient] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        if (!parsedUser.hasPaid) {
          router.push('/upgrade')
        }
      } else {
        router.push('/auth')
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    setIsClient(true)
    const storedLevels = sessionStorage.getItem(STORAGE_KEY)
    setUnlockedLevels(storedLevels ? parseInt(storedLevels) : 1)
  }, [])

  useEffect(() => {
    if (isClient) {
      sessionStorage.setItem(STORAGE_KEY, unlockedLevels.toString())
    }
  }, [unlockedLevels, isClient])

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    // For now, we'll just log the selected task. In the future, this is where you'd open a modal or navigate to the task page.
    console.log('Selected task:', task)
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="text-2xl font-bold text-indigo-600">Loading...</div>
    </div>
  }

  if (!user || !user.hasPaid) {
    return null // This will prevent the page content from flashing before redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <Link href="/" passHref>
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
          Memory Master Tasks
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <TaskCard
                  task={task}
                  isUnlocked={isClient && task.id <= unlockedLevels}
                  onClick={() => isClient && task.id <= unlockedLevels && handleTaskClick(task)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}