'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain,
  Grid,
  Layers,
  Box,
  Zap,
  ArrowLeft,
  Lock,
  CheckCircle2
} from 'lucide-react'
import AdvancedTask1 from '@/tasks/advanced-task1'
import AdvancedTask2 from '@/tasks/advanced-task2'
import AdvancedTask3 from '@/tasks/advanced-task3'
import AdvancedTask4 from '@/tasks/advanced-task4'
import AdvancedTask5 from '@/tasks/advanced-task5'
import TaskModal from '@/components/TaskModal'
import TaskDescriptionModal from '@/components/TaskDescriptionModal'

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
  { id: 1, name: "Symbol Sync", description: "Memorize pairs of symbols and recreate the sequence—show your memory skills!", icon: Brain, readinessPhrase: "Ready to challenge your pattern recognition skills?" },
  { id: 2, name: "Grid Recall", description: "Memorize the letters in a 4x4 grid and recall specific positions—can you remember them all?", icon: Grid, readinessPhrase: "Prepared to test your multi-modal memory?" },
  { id: 3, name: "Icon Imitator", description: "Memorize a sequence of 4 random icons and reproduce it from 12 similar options!", icon: Zap, readinessPhrase: "Ready to push your working memory to its limits?" },
  { id: 4, name: "Gridlock: Icon Edition", description: "Can you escape the gridlock? Memorize the colorful icons in a 5x5 grid and recreate the pattern!", icon: Layers, readinessPhrase: "Prepared for a spatial-temporal memory challenge?" },
  { id: 5, name: "Colorful Number Maze", description: "Navigate through a 3x3 layout of colorful cells filled with random numbers and recreate the sequence!", icon: Box, readinessPhrase: "Ready to tackle a dynamic memory challenge?" }
]

const STORAGE_KEY = 'advancedTasksUnlockedLevels'

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

export default function AdvancedTasksPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [unlockedLevels, setUnlockedLevels] = useState<number>(1)
  const [isClient, setIsClient] = useState(false)
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

  const handleTaskCompletion = (success: boolean) => {
    if (success) {
      setSelectedTask(null)
      setIsTaskModalOpen(false)
    }
  }

  const handleUnlockNext = (completedTaskId: number) => {
    setUnlockedLevels(prev => {
      const newLevel = Math.min(Math.max(prev, completedTaskId + 1), tasks.length)
      sessionStorage.setItem(STORAGE_KEY, newLevel.toString())
      return newLevel
    })
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
    switch (task.id) {
      case 1:
        return <AdvancedTask1 onComplete={handleTaskCompletion} onUnlockNext={() => handleUnlockNext(task.id)} />
      case 2:
        return <AdvancedTask2 onComplete={handleTaskCompletion} onUnlockNext={() => handleUnlockNext(task.id)} />
      case 3:
        return <AdvancedTask3 onComplete={handleTaskCompletion} onUnlockNext={() => handleUnlockNext(task.id)} />
      case 4:
        return <AdvancedTask4 onComplete={handleTaskCompletion} onUnlockNext={() => handleUnlockNext(task.id)} />
      case 5:
        return <AdvancedTask5 onComplete={handleTaskCompletion} onUnlockNext={() => handleUnlockNext(task.id)} />
      default:
        return (
          <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">{task.name}</h2>
            <p className="mb-4 text-gray-700">{task.description}</p>
            <p className="text-gray-600">This task is not yet implemented.</p>
          </div>
        )
    }
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
          <Link href="/premium-tasks" passHref>
            <Button variant="outline" className="flex items-center gap-2 bg-white text-indigo-600 border-indigo-600 hover:bg-indigo-50 transition-all duration-300 shadow-md hover:shadow-lg px-6 py-3 rounded-full"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-semibold">Back to Hub</span>
            </Button>
          </Link>
        </div>
        <motion.h1 
          className="text-5xl font-bold text-center mb-12 text-indigo-800"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Advanced Memory Master
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