"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { AlertTriangle, Brain, Clock, Book, Calendar, Activity, Eye, Lightbulb, CheckCircle, Info, Trash2, Lock, Play, Sparkles, BookOpen, Mail, Menu, User as UserIcon, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CircularProgress } from "@/components/ui/circular-progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// Import your task components
import TestTask1 from "../../tasks/test-task1"
import TestTask2 from "../../tasks/test-task2"
import TestTask3 from "../../tasks/test-task3"
import TestTask4 from "../../tasks/test-task4"
import TestTask5 from "../../tasks/test-task5"
import TestTask6 from "../../tasks/test-task6"
import TestTask7 from "../../tasks/test-task7"
import TestTask8 from "../../tasks/test-task8"

// Type definitions
type MemoryType = "Short-Term" | "Long-Term" | "Working" | "Semantic" | "Episodic" | "Procedural" | "Sensory" | "Prospective"

interface User {
  _id: string
  name: string
  email: string
  hasPaid: boolean
}

interface TaskResult {
  score: number
  metrics: {
    accuracy: number
    speed: number
    itemCount?: number
    uniqueItemCount?: number
  }
}

interface Result {
  type: MemoryType
  history: TaskResult[]
}

// Constants
const memoryTypes: MemoryType[] = [
  "Short-Term",
  "Long-Term",
  "Working",
  "Semantic",
  "Episodic",
  "Procedural",
  "Sensory",
  "Prospective"
]

const metricDescriptions: Record<string, string> = {
  accuracy: "Average accuracy for this memory type",
  speed: "Average speed for this memory type",
}

interface TaskComponent {
  name: string
  description: string
  component: React.ComponentType<{ onComplete: (result: TaskResult) => void }>
  isLocked?: boolean
}

const tasks: Record<MemoryType, TaskComponent> = {
  "Short-Term": {
    name: "Test Task 1",
    description: "Description for Test Task 1",
    component: TestTask1
  },
  "Long-Term": {
    name: "Test Task 2",
    description: "Description for Test Task 2",
    component: TestTask2
  },
  "Working": {
    name: "Test Task 3",
    description: "Description for Test Task 3",
    component: TestTask3
  },
  "Semantic": {
    name: "Test Task 4",
    description: "Description for Test Task 4",
    component: TestTask4
  },
  "Episodic": {
    name: "Test Task 5",
    description: "Description for Test Task 5",
    component: TestTask5
  },
  "Procedural": {
    name: "Test Task 6",
    description: "Description for Test Task 6",
    component: TestTask6
  },
  "Sensory": {
    name: "Test Task 7",
    description: "Description for Test Task 7",
    component: TestTask7,
    isLocked: true
  },
  "Prospective": {
    name: "Test Task 8",
    description: "Description for Test Task 8",
    component: TestTask8,
    isLocked: true
  }
}

const memoryTypeIcons: Record<MemoryType, React.ElementType> = {
  "Short-Term": Clock,
  "Long-Term": Brain,
  "Working": Activity,
  "Semantic": Book,
  "Episodic": Calendar,
  "Procedural": Activity,
  "Sensory": Eye,
  "Prospective": Lightbulb
}

// Helper functions
const calculateSpeed = (completionTime: number): number => {
  if (completionTime <= 4000) {
    return 100
  } else {
    // Calculate percentage, with a minimum of 0%
    return Math.max(0, Math.round((1 - (completionTime - 4000) / 6000) * 100))
  }
}

const calculateAverageMetrics = (results: Result[]) => {
  return results.map(result => {
    const totalAccuracy = result.history.reduce((sum, task) => sum + task.metrics.accuracy, 0)
    const totalSpeed = result.history.reduce((sum, task) => sum + task.metrics.speed, 0)
    const count = result.history.length
    
    return {
      type: result.type,
      averageAccuracy: Math.round(totalAccuracy / count),
      averageSpeed: Math.round(totalSpeed / count)
    }
  })
}

const calculateAverageScoreByType = (results: Result[]) => {
  return results.map(result => {
    const totalScore = result.history.reduce((sum, task) => sum + task.score, 0)
    const averageScore = Math.round(totalScore / result.history.length)
    return {
      type: result.type,
      averageScore: averageScore
    }
  })
}

// TaskCard component
const TaskCard: React.FC<{
  type: MemoryType
  task: TaskComponent
  onClick: () => void
}> = ({ type, task, onClick }) => {
  const Icon = memoryTypeIcons[type]
  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg ${task.isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      whileHover={{ scale: task.isLocked ? 1 : 1.02 }}
      onClick={task.isLocked ? undefined : onClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-indigo-100 rounded-full">
            <Icon className="w-6 h-6 text-indigo-600" />
          </div>
          {task.isLocked ? (
            <Lock className="w-5 h-5 text-gray-500" />
          ) : (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.name}</h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{task.description}</p>
        <div className={`text-sm font-medium ${task.isLocked ? 'text-gray-400' : 'text-indigo-600'}`}>
          {task.isLocked ? 'Coming Soon' : 'Start Task'}
        </div>
      </div>
    </motion.div>
  )
}

export default function MemoryAssessmentSystem() {
  const [results, setResults] = useState<Result[]>([])
  const [currentTask, setCurrentTask] = useState<MemoryType | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      const storedResults = localStorage.getItem(`memoryResults_${parsedUser._id}`)
      if (storedResults) {
        setResults(JSON.parse(storedResults))
      }
    } else {
      const sessionResults = sessionStorage.getItem('memoryResults')
      if (sessionResults) {
        setResults(JSON.parse(sessionResults))
      }
    }
  }, [])

  useEffect(() => {
    if (user && results.length > 0) {
      localStorage.setItem(`memoryResults_${user._id}`, JSON.stringify(results))
    } else if (!user && results.length > 0) {
      sessionStorage.setItem('memoryResults', JSON.stringify(results))
    }
  }, [results, user])

  const startTask = (type: MemoryType) => {
    if (!tasks[type].isLocked) {
      setCurrentTask(type)
      setIsModalOpen(true)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setCurrentTask(null)
  }

  const updateResults = (type: MemoryType, taskResult: TaskResult) => {
    setResults(prevResults => {
      const existingResult = prevResults.find(r => r.type === type)
      if (existingResult) {
        const newMetrics = {
          type: type,
          history: [...existingResult.history, {
            score: taskResult.score,
            metrics: {
              accuracy: taskResult.metrics.accuracy,
              speed: calculateSpeed(taskResult.metrics.speed),
              itemCount: taskResult.metrics.itemCount,
              uniqueItemCount: taskResult.metrics.uniqueItemCount,
            }
          }]
        }
        return prevResults.map(r => 
          r.type === type 
            ? newMetrics
            : r
        )
      } else {
        const newMetrics = {
          type: type,
          history: [{
            score: taskResult.score,
            metrics: {
              accuracy: taskResult.metrics.accuracy,
              speed: calculateSpeed(taskResult.metrics.speed),
              itemCount: taskResult.metrics.itemCount,
              uniqueItemCount: taskResult.metrics.uniqueItemCount,
            }
          }]
        }
        return [...prevResults, newMetrics]
      }
    })
    closeModal()
  }

  const clearProgress = () => {
    setResults([])
    if (user) {
      localStorage.removeItem(`memoryResults_${user._id}`)
    } else {
      sessionStorage.removeItem('memoryResults')
    }
  }

  const clearMemoryTypeData = (type: MemoryType) => {
    setResults(prevResults => prevResults.filter(r => r.type !== type))
  }

  const averageMetrics = calculateAverageMetrics(results)
  const averageScoresByType = calculateAverageScoreByType(results)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleStartTest = () => {
    // Implement the logic to start the test
    console.log("Starting the test...")
  }

  const handleSignIn = () => {
  // Redirect to the auth page
  window.location.href = '/auth';
}

  const handleSignOut = () => {
    if (user) {
      // Save current results to localStorage before signing out
      localStorage.setItem(`memoryResults_${user._id}`, JSON.stringify(results))
    }
    setUser(null)
    localStorage.removeItem('user')
    setResults([])
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
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
              <a href="" className="text-base font-medium text-gray-500 hover:text-[#4f46e5] transition-colors duration-200">Test My Memory</a>
              <a href="#premium" className="text-base font-medium text-gray-500 hover:text-[#4f46e5] transition-colors duration-200">Premium</a>
              <a href="#our-story" className="text-base font-medium text-gray-500 hover:text-[#4f46e5] transition-colors duration-200">Our Story</a>
            </nav>
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <UserIcon className="h-8 w-8 text-[#4f46e5]"  />
                  <div className="flex  flex-col">
                    <span className="text-sm font-medium text-[#4f46e5]">{user.name}</span>
                    <span className="text-xs text-gray-500">{user.email}</span>
                  </div>
                  <Button variant="ghost" onClick={handleSignOut} className="p-1">
                    <LogOut className="h-6 w-6 text-[#4f46e5]" />
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={handleSignIn} className="border-[#4f46e5] text-[#4f46e5]">
                  <UserIcon className="h-5 w-5 mr-2" />
                  Sign In
                </Button>
              )}
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

      {/* Mobile menu */}
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
              <a href="" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-[#4f46e5] hover:bg-[#4f46e5]/10" onClick={toggleMenu}>Test My Memory</a>
              <a href="#premium" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-[#4f46e5] hover:bg-[#4f46e5]/10" onClick={toggleMenu}>Premium</a>
              <a href="#our-story" className="block px-3 py-2 rounded-md text-base font-medium text-gray-500 hover:text-[#4f46e5] hover:bg-[#4f46e5]/10" onClick={toggleMenu}>Our Story</a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
              {user ? (
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
              ) : (
                <div className="px-5">
                  <Button variant="outline" onClick={handleSignIn} className="w-full justify-center border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5] hover:text-white">
                    <UserIcon className="mr-2 h-5 w-5" />
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="container mx-auto p-4 pt-24 flex-grow">
        <h1 className="text-3xl font-bold mb-6">Memory Assessment System</h1>
        
        <Tabs defaultValue="task">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="task">Task</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <Card>
              <CardHeader>
                <CardTitle>Memory Performance Dashboard</CardTitle>
                <CardDescription>View your performance across different memory types</CardDescription>
              </CardHeader>
              <CardContent>
                {results.length === 0 ? (
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <p className="text-lg text-gray-600">No tasks completed yet. Complete tasks to see your performance here.</p>
                    <Image
                      src="/placeholder.svg?height=300&width=500"
                      alt="No tasks completed"
                      width={500}
                      height={300}
                      className="rounded-lg shadow-md max-w-full h-auto"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {averageMetrics.map((metric) => (
                      <Card key={metric.type} className="w-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">
                            {metric.type} Memory
                          </CardTitle>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete {metric.type} data</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete your {metric.type} memory data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => clearMemoryTypeData(metric.type as MemoryType)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col items-center space-y-4">
                            <div className="flex justify-between items-center w-full">
                              <div className="flex flex-col items-center">
                                <CircularProgress 
                                  value={metric.averageAccuracy}
                                  label="Accuracy" 
                                />
                                <TooltipProvider delayDuration={0}>
                                  <UITooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="w-4 h-4 mt-1 text-gray-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{metricDescriptions.accuracy}</p>
                                    </TooltipContent>
                                  </UITooltip>
                                </TooltipProvider>
                              </div>
                              <div className="flex flex-col items-center">
                                <CircularProgress 
                                  value={metric.averageSpeed}
                                  label="Speed" 
                                />
                                <TooltipProvider delayDuration={0}>
                                  <UITooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="w-4 h-4 mt-1 text-gray-400 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{metricDescriptions.speed}</p>
                                    </TooltipContent>
                                  </UITooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {results.length > 0 && (
              <>
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                    <CardDescription>Your average memory performance by task type</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={averageScoresByType}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="averageScore" stroke="#4f46e5" name="Average Score" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
    
                <div className="mt-6 flex justify-end">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <AlertTriangle className="mr-2 h-4 w-4" />
                        Clear All Progress
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete all your memory assessment progress and ratings.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={clearProgress}>
                          Yes, clear all progress
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="task">
            <Card>
              <CardHeader>
                <CardTitle>Memory Tasks</CardTitle>
                <CardDescription>Select a task to assess your memory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  <AnimatePresence>
                    {memoryTypes.map((type) => (
                      <motion.div
                        key={type}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TaskCard
                          type={type}
                          task={tasks[type]}
                          onClick={() => startTask(type)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{currentTask ? tasks[currentTask].name : 'Memory Task'}</DialogTitle>
              <DialogDescription>
                {currentTask ? tasks[currentTask].description : 'Complete the task to assess your memory.'}
              </DialogDescription>
            </DialogHeader>
            {currentTask && (
              <div className="py-4">
                {React.createElement(tasks[currentTask].component, {
                  onComplete: (result: TaskResult) => updateResults(currentTask, result)
                })}
              </div>
            )}
            <DialogFooter>
              {/* Add any additional footer content if needed */}
            </DialogFooter>
          </DialogContent>  
        </Dialog>
      </div>

      {/* Footer */}
      <footer className="bg-[#4f46e5] text-white py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-8">
            <Link href="/" className="flex items-center">
              <Brain className="h-8 w-auto sm:h-10 text-white" />
              <span className="ml-2 text-2xl font-bold">Nrglitch</span>
            </Link>
            <nav className="flex flex-wrap justify-center gap-6">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20" onClick={handleStartTest}>
                <Play className="h-5 w-5 mr-2" />
                Start the Test
              </Button>
              <Link href="#premium" passHref>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Premium
                </Button>
              </Link>
              <Link href="#our-story" passHref>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Our Story
                </Button>
              </Link>
              <Link href="#contact" passHref>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/20">
                  <Mail className="h-5 w-5 mr-2" />
                  Contact
                </Button>
              </Link>
            </nav>
          </div>
          <div className="mt-8 border-t border-white/20 pt-8 text-center">
            <p className="text-white/80">&copy; 2023 Nrglitch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}