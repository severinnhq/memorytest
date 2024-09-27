"use client"

import React, { useState, useEffect } from 'react'
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
  Lightbulb,
  Eye,
  ArrowLeft,
  Lock,
  CheckCircle2
} from 'lucide-react'
import AdvancedTask1 from '@/tasks/advanced-task1'
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
  { id: 1, name: "Advanced N-Back", description: "Test your working memory with a challenging N-Back task involving shapes and positions.", icon: Brain, readinessPhrase: "Ready to push your working memory to the limit?" },
  { id: 2, name: "Complex Pattern Recognition", description: "Identify complex visual patterns under time pressure.", icon: Grid, readinessPhrase: "Prepared to spot intricate patterns?" },
  { id: 3, name: "Multisensory Integration", description: "Remember and recall combinations of visual and auditory cues.", icon: Palette, readinessPhrase: "Ready to sync your senses?" },
  { id: 4, name: "Adaptive Working Memory", description: "Test your working memory capacity with an adaptive challenge.", icon: Brain, readinessPhrase: "Prepared to discover your memory limits?" },
  { id: 5, name: "Spatial-Temporal Reasoning", description: "Predict outcomes of complex spatial transformations.", icon: Box, readinessPhrase: "Ready to navigate space and time in your mind?" },
  { id: 6, name: "Abstract Rule Learning", description: "Identify and apply hidden rules in various contexts.", icon: Lightbulb, readinessPhrase: "Prepared to uncover abstract patterns?" },
  { id: 7, name: "Dynamic Category Switching", description: "Rapidly switch between different categorization rules.", icon: SwitchCamera, readinessPhrase: "Ready to flex your mental agility?" },
  { id: 8, name: "Interference Control", description: "Inhibit automatic responses in the face of conflicting information.", icon: Eye, readinessPhrase: "Prepared to resist mental interference?" },
  { id: 9, name: "Probabilistic Sequence Learning", description: "Predict items in sequences with complex probabilistic patterns.", icon: Clock, readinessPhrase: "Ready to anticipate the unpredictable?" },
  { id: 10, name: "Cognitive Flexibility", description: "Rapidly shift between multiple cognitive tasks and rules.", icon: Brain, readinessPhrase: "Prepared for the ultimate mental juggling act?" },
]

const STORAGE_KEY = 'unlockedAdvancedLevels'

export default function AdvancedTasksPage() {
  const [unlockedLevels, setUnlockedLevels] = useState<number>(1)
  const [isClient, setIsClient] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const storedLevels = localStorage.getItem(STORAGE_KEY)
    setUnlockedLevels(storedLevels ? parseInt(storedLevels) : 1)
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem(STORAGE_KEY, unlockedLevels.toString())
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
      localStorage.setItem(STORAGE_KEY, newLevel.toString())
      return newLevel
    })
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsDescriptionModalOpen(true)
  }

  const handleStartTask = () => {
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
      // Add cases for other advanced tasks as they are implemented
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
          onSubmit={handleStartTask}  // Changed from onReady to onSubmit
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