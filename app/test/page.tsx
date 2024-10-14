"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { AlertTriangle, Brain, Clock, Book, Calendar, Activity, Eye, Lightbulb, CheckCircle, Info, Trash2, Lock } from "lucide-react"
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

import TestTask1 from "../../tasks/test-task1"
import TestTask2 from "../../tasks/test-task2"
import TestTask3 from "../../tasks/test-task3"
import TestTask4 from "../../tasks/test-task4"
import TestTask5 from "../../tasks/test-task5"
import TestTask6 from "../../tasks/test-task6"
import TestTask7 from "../../tasks/test-task7"
import TestTask8 from "../../tasks/test-task8"

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
};

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

const TaskCard: React.FC<{
  type: MemoryType;
  task: TaskComponent;
  onClick: () => void;
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

const calculateAverageMetrics = (results: Result[]) => {
  return results.map(result => {
    const totalAccuracy = result.history.reduce((sum, task) => sum + task.metrics.accuracy, 0);
    const totalSpeed = result.history.reduce((sum, task) => sum + task.metrics.speed, 0);
    const count = result.history.length;
    
    return {
      type: result.type,
      averageAccuracy: Math.round(totalAccuracy / count),
      averageSpeed: Math.round(totalSpeed / count)
    };
  });
};

const calculateAverageScoreByType = (results: Result[]) => {
  return results.map(result => {
    const totalScore = result.history.reduce((sum, task) => sum + task.score, 0);
    const averageScore = Math.round(totalScore / result.history.length);
    return {
      type: result.type,
      averageScore: averageScore
    };
  });
};

const calculateSpeed = (completionTime: number) => {
  if (completionTime <= 4000) {
    return 100;
  } else {
    // Calculate percentage, with a minimum of 0%
    return Math.max(0, Math.round((1 - (completionTime - 4000) / 6000) * 100));
  }
}

export default function MemoryAssessmentSystem() {
  const [results, setResults] = useState<Result[]>([])
  const [currentTask, setCurrentTask] = useState<MemoryType | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  useEffect(() => {
    if (user) {
      const storedResults = localStorage.getItem(`memoryResults_${user._id}`)
      if (storedResults) {
        setResults(JSON.parse(storedResults))
      }
    } else {
      const sessionResults = sessionStorage.getItem('memoryResults')
      if (sessionResults) {
        setResults(JSON.parse(sessionResults))
      }
    }
  }, [user])

  useEffect(() => {
    if (results.length > 0) {
      if (user) {
        localStorage.setItem(`memoryResults_${user._id}`, JSON.stringify(results))
      } else {
        sessionStorage.setItem('memoryResults', JSON.stringify(results))
      }
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


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Memory Assessment System</h1>
      
      <Tabs defaultValue="dashboard">
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
                <p>No tasks completed yet. Complete tasks to see your performance here.</p>
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
                        <div className="flex flex-col items-center  space-y-4">
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
                        <YAxis  domain={[0, 100]} />
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
                      initial={{ opacity: 0, y: 20  }}
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
  )
}