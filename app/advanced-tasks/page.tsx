"use client"

import React, { useState, useEffect } from 'react'
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
import AdvancedTask1 from '../../tasks/advanced-task1'
import AdvancedTask2 from '../../tasks/advanced-task2'
import AdvancedTask3 from '../../tasks/advanced-task3'
import AdvancedTask4 from '../../tasks/advanced-task4'
import AdvancedTask5 from '../../tasks/advanced-task5'
import TaskModal from '@/components/TaskModal'
import TaskDescriptionModal from '@/components/TaskDescriptionModal'

interface Task {
  id: number;
  name: string;
  description: string;
  icon: React.ElementType;
  readinessPhrase: string;
}

const tasks: Task[] = [
  { id: 1, name: "Complex Pattern Recognition", description: "Identify and recreate intricate visual patterns with varying elements and rules.", icon: Brain, readinessPhrase: "Ready to challenge your pattern recognition skills?" },
  { id: 2, name: "Multi-Modal Memory Challenge", description: "Memorize and recall information across visual, auditory, and spatial domains simultaneously.", icon: Layers, readinessPhrase: "Prepared to test your multi-modal memory?" },
  { id: 3, name: "Adaptive N-Back Task", description: "A dynamic working memory task that adjusts difficulty based on your performance.", icon: Zap, readinessPhrase: "Ready to push your working memory to its limits?" },
  { id: 4, name: "Spatial-Temporal Sequence Reconstruction", description: "Memorize and reconstruct complex sequences of objects in both space and time.", icon: Grid, readinessPhrase: "Prepared for a spatial-temporal memory challenge?" },
  { id: 5, name: "Dynamic Memory Matrix", description: "Memorize and manipulate a multi-dimensional matrix of changing information.", icon: Box, readinessPhrase: "Ready to tackle a dynamic memory challenge?" }
]

const STORAGE_KEY = 'advancedTasksUnlockedLevels'

interface TaskCardProps {
  task: Task;
  isUnlocked: boolean;
  onClick: () => void;
}

function TaskCard({ task, isUnlocked, onClick }: TaskCardProps) {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${
        isUnlocked ? 'cursor-pointer' : 'opacity-50'
      }`}
      onClick={isUnlocked ? onClick : undefined}
    >
      <div className="flex items-center justify-between mb-4">
        <task.icon className="w-10 h-10 text-indigo-600" />
        {!isUnlocked && <Lock className="w-6 h-6 text-gray-400" />}
        {isUnlocked && <CheckCircle2 className="w-6 h-6 text-green-500" />}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{task.name}</h3>
      <p className="text-gray-600 text-sm">{task.description}</p>
    </div>
  )
}

export default function AdvancedTasksPage() {
  const [unlockedLevels, setUnlockedLevels] = useState<number>(1)
  const [isClient, setIsClient] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

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
          Advanced Memory Master
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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