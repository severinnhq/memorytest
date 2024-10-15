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
import MidTask1 from '@/tasks/mid-task1'
import MidTask2 from '@/tasks/mid-task2'
import MidTask3 from '@/tasks/mid-task3'
import MidTask4 from '@/tasks/mid-task4'
import MidTask5 from '@/tasks/mid-task5'
import MidTask6 from '@/tasks/mid-task6'
import MidTask7 from '@/tasks/mid-task7'
import MidTask8 from '@/tasks/mid-task8'
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
  { id: 1, name: "Grid Genius", description: "Recreate a 3x3 grid pattern across 3 rounds. Nail 3/3 to move on!", icon: Grid, readinessPhrase: "Prepared to challenge your mind?" },
  { id: 2, name: "Memory Maestro", description: "Fill in missing digits from sequences across 3 rounds, with the challenge growing each time!", icon: Brain, readinessPhrase: "Ready to test your precise visual memory?" },
  { id: 3, name: "Shade Shuffler", description: "Recreate color patterns through 3 tricky rounds—watch out for those sneaky shades!", icon: SwitchCamera, readinessPhrase: "Ready to test your association skills?" },
  { id: 4, name: "Color Crafter", description: "Recreate color patterns on a 4x4 grid—3 flawless rounds to succeed!", icon: Palette, readinessPhrase: "Ready for a compact multi-dimensional memory challenge?" },
  { id: 5, name: "Purple Jumper", description: "Track the jumping purple square on a 5x5 grid through 3 rounds and recreate its path!", icon: Grid, readinessPhrase: "Ready to explore the depths of your spatial memory?" },
  { id: 6, name: "Sequence Spark", description: "Watch the 9 squares light up in random order—recreate the sequence perfectly to succeed!", icon: Box, readinessPhrase: "Set to tune your auditory memory?" },
  { id: 7, name: "Shape Shifter", description: "Recreate the sequence of colorful shapes across 5 rounds—4 out of 5 is your ticket forward!", icon: ArrowLeft, readinessPhrase: "Prepared to juggle mental tasks?" },
  { id: 8, name: "Pattern Perfection", description: "Spot and recreate patterns made from 5 identical icons—watch out, it gets trickier with each round!", icon: Box, readinessPhrase: "Ready to bend your perception of time?" },
]

const STORAGE_KEY = 'unlockedMidLevels'

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

export default function MidTasksPage() {
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
        return <MidTask1 onComplete={handleTaskCompletion} onUnlockNext={() => handleUnlockNext(task.id)} />
      case 2:
        return <MidTask2 onComplete={handleTaskCompletion} onUnlockNext={() => handleUnlockNext(task.id)} />
      case 3:
        return <MidTask3 onComplete={handleTaskCompletion} onUnlockNext={() => handleUnlockNext(task.id)} />
      case 4:
        return <MidTask4 onComplete={handleTaskCompletion} onUnlockNext={() => handleUnlockNext(task.id)} />
      case 5:
        return <MidTask5 onComplete={handleTaskCompletion} onUnlockNext={() => handleUnlockNext(task.id)} />
      case 6:
        return <MidTask6 onComplete={handleTaskCompletion} onUnlockNext={() => handleUnlockNext(task.id)} />
      case 7:
        return <MidTask7 onComplete={handleTaskCompletion} onUnlockNext={() => handleUnlockNext(task.id)} />
      case 8:
        return <MidTask8 onComplete={handleTaskCompletion} onUnlockNext={() => handleUnlockNext(task.id)} />
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
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Hub
            </Button>
          </Link>
        </div>
        <motion.h1 
          className="text-5xl font-bold text-center mb-12 text-indigo-800"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Mid-Level Memory Master
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