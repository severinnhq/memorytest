'use client'

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Info, AlertTriangle, Brain, Clock, Book, Calendar, Activity, Eye, Lightbulb } from "lucide-react"
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

type MemoryType = "Short-Term" | "Long-Term" | "Working" | "Semantic" | "Episodic" | "Procedural" | "Sensory" | "Prospective"

interface User {
  _id: string
  name: string
  email: string
  hasPaid: boolean
}

interface Task {
  name: string
  description: string
  execute: () => { content: JSX.Element; answer: string }
  evaluate: (response: string, answer: string, startTime: number, endTime: number) => TaskResult
}

interface TaskResult {
  score: number
  metrics: {
    accuracy: number
    speed: number
    capacity: number
    consistency: number
    improvement: number
  }
}

interface Metrics {
  accuracy: number
  speed: number
  capacity: number
  consistency: number
  improvement: number
}

interface Result {
  type: MemoryType
  rating: number
  metrics: Metrics
  attempts: number
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

const metricDescriptions: Record<keyof Metrics, string> = {
  accuracy: "Measures how correctly you performed the task",
  speed: "Indicates how quickly you completed the task",
  capacity: "Reflects the amount of information you were able to remember",
  consistency: "Shows how stable your performance is across multiple attempts",
  improvement: "Tracks your progress over time"
}

const calculateSpeed = (startTime: number, endTime: number) => {
  const timeTaken = (endTime - startTime) / 1000 // Convert to seconds
  if (timeTaken <= 10) {
    return 100
  } else {
    return Math.max(0, 100 - ((timeTaken - 10) * 2.5)) // Decrease by 2.5% for each second over 10 seconds
  }
}

const createTasks = (): Record<MemoryType, Task> => ({
  "Short-Term": {
    name: "Digit Span Recall",
    description: "Memorize and recall a sequence of digits",
    execute: () => {
      const digits = Array.from({length: 7}, () => Math.floor(Math.random() * 10)).join('')
      return {
        content: (
          <div>
            <p className="mb-4">Memorize these digits: <strong>{digits}</strong></p>
            <p>Take your time to memorize. Click 'Ready' when you're prepared to recall.</p>
          </div>
        ),
        answer: digits
      }
    },
    evaluate: (response, answer, startTime, endTime) => {
      const accuracy = (response.split('').filter((digit, index) => digit === answer[index]).length / answer.length) * 100
      const speed = calculateSpeed(startTime, endTime)
      const capacity = (response.length / answer.length) * 100
      return {
        score: (accuracy + speed + capacity) / 3,
        metrics: {
          accuracy,
          speed,
          capacity,
          consistency: 100,
          improvement: 0
        }
      }
    }
  },
  "Long-Term": {
    name: "Word Pair Association",
    description: "Memorize word pairs and recall the associated word",
    execute: () => {
      const wordPairs = [
        ["dog", "bone"],
        ["sky", "blue"],
        ["apple", "red"],
        ["book", "read"],
        ["car", "drive"]
      ]
      const testPairs = wordPairs.map(pair => pair[0])
      return {
        content: (
          <div>
            <p className="mb-4">Memorize these word pairs:</p>
            <ul className="list-disc list-inside mb-4">
              {wordPairs.map((pair, index) => <li key={index}>{pair.join(" - ")}</li>)}
            </ul>
            <p>Take your time to memorize. Click 'Ready' when you're prepared to recall.</p>
          </div>
        ),
        answer: wordPairs.map(pair => pair[1]).join(',')
      }
    },
    evaluate: (response, answer, startTime, endTime) => {
      const userAnswers = response.toLowerCase().split(',').map(word => word.trim())
      const correctAnswers = answer.split(',')
      const accuracy = userAnswers.reduce((acc, ans, i) => acc + (ans === correctAnswers[i] ? 1 : 0), 0) / correctAnswers.length * 100
      const speed = calculateSpeed(startTime, endTime)
      const capacity = (userAnswers.length / correctAnswers.length) * 100
      return {
        score: (accuracy + speed + capacity) / 3,
        metrics: {
          accuracy,
          speed,
          capacity,
          consistency: 100,
          improvement: 0
        }
      }
    }
  },
  "Working": {
    name: "N-Back Task",
    description: "Identify if the current item matches the one N steps back",
    execute: () => {
      const sequence = Array.from({length: 20}, () => Math.floor(Math.random() * 10))
      const correct = sequence.slice(2).map((num, index) => num === sequence[index] ? 'y' : 'n').join(',')
      return {
        content: (
          <div>
            <p className="mb-4">Memorize this sequence of numbers:</p>
            <p className="mb-4 text-2xl font-bold">{sequence.join(' ')}</p>
            <p>For each number (starting from the third), you'll need to indicate if it matches the number that appeared 2 steps before it.</p>
            <p>Take your time to memorize. Click 'Ready' when you're prepared to start the task.</p>
          </div>
        ),
        answer: correct
      }
    },
    evaluate: (response, answer, startTime, endTime) => {
      const userAnswers = response.toLowerCase().split(',').map(a => a.trim())
      const correctAnswers = answer.split(',')
      const accuracy = userAnswers.reduce((acc, ans, i) => acc + (ans === correctAnswers[i] ? 1 : 0), 0) / correctAnswers.length * 100
      const speed = calculateSpeed(startTime, endTime)
      const capacity = (userAnswers.length / correctAnswers.length) * 100
      return {
        score: (accuracy + speed + capacity) / 3,
        metrics: {
          accuracy,
          speed,
          capacity,
          consistency: 100,
          improvement: 0
        }
      }
    }
  },
  "Semantic": {
    name: "Category Fluency",
    description: "List as many items as possible within a given category",
    execute: () => ({
      content: (
        <div>
          <p className="mb-4">Your task is to list as many animals as you can.</p>
          <p>Take your time to think. Click 'Ready' when you're prepared to start listing animals.</p>
        </div>
      ),
      answer: "20" // Target number of animals
    }),
    evaluate: (response, answer, startTime, endTime) => {
      const animals = new Set(response.toLowerCase().split(',').map(a => a.trim()))
      const accuracy = Math.min(animals.size * 5, 100) // 5 points per animal, max 100
      const speed = calculateSpeed(startTime, endTime)
      const capacity = (animals.size / parseInt(answer)) * 100
      return {
        score: (accuracy + speed + capacity) / 3,
        metrics: {
          accuracy,
          speed,
          capacity,
          consistency: 100,
          improvement: 0
        }
      }
    }
  },
  "Episodic": {
    name: "Story Recall",
    description: "Read a short story and recall its details",
    execute: () => ({
      content: (
        <div>
          <p className="mb-4">Read the following story carefully:</p>
          <p className="mb-4">
            "Sarah woke up early on Saturday morning. She packed her backpack with a water bottle, sunscreen, and a sandwich. 
            At 9:30 AM, she met her friend Tom at the park. They hiked for two hours, reaching the top of Green Hill. 
            There, they enjoyed their lunch while admiring the beautiful view of the lake below."
          </p>
          <p>Take your time to memorize the details. Click 'Ready' when you're prepared to answer questions about the story.</p>
        </div>
      ),
      answer: "Saturday,9:30 AM,Tom,Green Hill,lake"
    }),
    evaluate: (response, answer, startTime, endTime) => {
      const correctAnswers = answer.toLowerCase().split(',')
      const userAnswers = response.toLowerCase().split(',').map(a => a.trim())
      const accuracy = correctAnswers.reduce((acc, ans) => acc + (userAnswers.includes(ans) ? 1 : 0), 0) / correctAnswers.length * 100
      const speed = calculateSpeed(startTime, endTime)
      const capacity = (userAnswers.length / correctAnswers.length) * 100
      return {
        score: (accuracy + speed + capacity) / 3,
        metrics: {
          accuracy,
          speed,
          capacity,
          consistency: 100,
          improvement: 0
        }
      }
    }
  },
  "Procedural": {
    name: "Pattern Replication",
    description: "Replicate a given pattern of key presses",
    execute: () => {
      const pattern = Array.from({length: 5}, () => String.fromCharCode(65 + Math.floor(Math.random() * 26))).join('')
      return {
        content: (
          <div>
            <p className="mb-4">Memorize the following pattern of letters:</p>
            <p className="text-2xl font-bold mb-4">{pattern}</p>
            <p>Take your time to memorize. Click 'Ready' when you're prepared to replicate the pattern.</p>
          </div>
        ),
        answer: pattern
      }
    },
    evaluate: (response, answer, startTime, endTime) => {
      const accuracy = (response.split('').filter((char, index) => char.toUpperCase() === answer[index]).length / answer.length) * 100
      const speed = calculateSpeed(startTime, endTime)
      const capacity = (response.length / answer.length) * 100
      return {
        score: (accuracy + speed + capacity) / 3,
        metrics: {
          accuracy,
          speed,
          capacity,
          consistency: 100,
          improvement: 0
        }
      }
    }
  },
  "Sensory": {
    name: "Visual Grid Recall",
    description: "Recall symbols from a briefly displayed grid",
    execute: () => {
      const symbols = ['@', '#', '$', '%', '&', '*', '+', '=']
      const grid = Array.from({length: 3}, () => 
        Array.from({length: 3}, () => symbols[Math.floor(Math.random() * symbols.length)])
      )
      return {
        content: (
          <div>
            <p className="mb-4">Memorize the following 3x3 grid of symbols:</p>
            <div className="grid grid-cols-3 gap-2 w-32 mx-auto mb-4">
              {grid.flat().map((symbol, index) => (
                <div key={index} className="w-10 h-10 flex items-center justify-center border border-gray-300 text-xl font-bold">
                  {symbol}
                </div>
              ))}
            </div>
            <p>Take your time to memorize. Click 'Ready' when you're prepared to recall the symbols.</p>
          </div>
        ),
        answer: grid.flat().join(',')
      }
    },
    evaluate: (response, answer, startTime, endTime) => {
      const userSymbols = response.split(',').map(s => s.trim())
      const correctSymbols = answer.split(',')
      const accuracy = userSymbols.reduce((acc, sym) => acc + (correctSymbols.includes(sym) ? 1 : 0), 0) / correctSymbols.length * 100
      const speed = calculateSpeed(startTime, endTime)
      const capacity = (userSymbols.length / correctSymbols.length) * 100
      return {
        score: (accuracy + speed + capacity) / 3,
        metrics: {
          accuracy,
          speed,
          capacity,
          consistency: 100,
          improvement: 0
        }
      }
    }
  },
  "Prospective": {
    name: "Delayed Action Task",
    description: "Remember to perform a specific action after a delay",
    execute: () => ({
      content: (
        <div>
          <p className="mb-4">Your task is to remember to type "DONE" when you see the word "BLUE".</p>
          <p>You'll see a series of random words. Click 'Ready' when you're prepared to start the task.</p>
        </div>
      ),
      answer: "DONE"
    }),
    evaluate: (response, answer, startTime, endTime) => {
      const accuracy = response.trim().toUpperCase() === answer ? 100 : 0
      const speed = calculateSpeed(startTime, endTime)
      const capacity = response.trim().toUpperCase() === answer ? 100 : 0
      return {
        score: (accuracy + speed + capacity) / 3,
        metrics: {
          accuracy,
          speed,
          capacity,
          consistency: 100,
          improvement: 0
        }
      }
    }
  }
})

const memoryTypeIcons: Record<MemoryType, React.ReactNode> =   {
  "Short-Term": <Clock className="h-8 w-8 text-purple-500" />,
  "Long-Term": <Brain className="h-8 w-8 text-purple-500" />,
  "Working": <Activity className="h-8 w-8 text-purple-500" />,
  "Semantic": <Book className="h-8 w-8 text-purple-500" />,
  "Episodic": <Calendar className="h-8 w-8 text-purple-500" />,
  "Procedural": <Activity className="h-8 w-8 text-purple-500" />,
  "Sensory": <Eye className="h-8 w-8 text-purple-500" />,
  "Prospective": <Lightbulb className="h-8 w-8 text-purple-500" />
}

export default function MemoryAssessmentSystem() {
  const [results, setResults] = useState<Result[]>([])
  const [currentTask, setCurrentTask] = useState<MemoryType | null>(null)
  const [taskState, setTaskState] = useState<'instructions' | 'memorizing' | 'answering' | 'completed'>('instructions')
  const [taskContent, setTaskContent] = useState<JSX.Element | null>(null)
  const [taskAnswer, setTaskAnswer] = useState<string>('')
  const [userResponse, setUserResponse] = useState('')
  const [taskScore, setTaskScore] = useState<number | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const tasks = createTasks()

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
    setCurrentTask(type)
    setTaskState('instructions')
    setTaskContent(null)
    setTaskAnswer('')
    setUserResponse('')
    setTaskScore(null)
  }

  const executeTask = () => {
    if (currentTask) {
      const { content, answer } = tasks[currentTask].execute()
      setTaskContent(content)
      setTaskAnswer(answer)
      setTaskState('memorizing')
    }
  }

  const readyToAnswer = () => {
    setTaskState('answering')
    setStartTime(Date.now())
  }

  const submitAnswer = () => {
    if (currentTask) {
      const endTime = Date.now()
      const result = tasks[currentTask].evaluate(userResponse, taskAnswer, startTime, endTime)
      setTaskScore(result.score)
      setTaskState('completed')
      updateResults(currentTask, result)
    }
  }

  const updateResults = (type: MemoryType, taskResult: TaskResult) => {
    setResults(prevResults => {
      const existingResult = prevResults.find(r => r.type === type)
      if (existingResult) {
        const newHistory = [...existingResult.history, taskResult]
        const newAttempts = existingResult.attempts + 1
        const newRating = Math.round(newHistory.reduce((sum, result) => sum + result.score, 0) / newAttempts)
        const newMetrics = {
          accuracy: newHistory.reduce((sum, result) => sum + result.metrics.accuracy, 0) / newAttempts,
          speed: newHistory.reduce((sum, result) => sum + result.metrics.speed, 0) / newAttempts,
          capacity: newHistory.reduce((sum, result) => sum + result.metrics.capacity, 0) / newAttempts,
          consistency: calculateConsistency(newHistory),
          improvement: calculateImprovement(newHistory)
        }
        return prevResults.map(r => 
          r.type === type 
            ? {
                ...r,
                rating: newRating,
                metrics: newMetrics,
                attempts: newAttempts,
                history: newHistory
              }
            : r
        )
      } else {
        return [
          ...prevResults,
          {
            type,
            rating: Math.round(taskResult.score),
            metrics: taskResult.metrics,
            attempts: 1,
            history: [taskResult]
          }
        ]
      }
    })
  }

  const calculateConsistency = (history: TaskResult[]) => {
    if (history.length < 2) return 100
    const accuracies = history.map(result => result.metrics.accuracy)
    const mean = accuracies.reduce((sum, acc) => sum + acc, 0) / accuracies.length
    const variance = accuracies.reduce((sum, acc) => sum + Math.pow(acc - mean, 2), 0) / accuracies.length
    const standardDeviation = Math.sqrt(variance)
    return Math.max(0, 100 - standardDeviation)
  }

  const calculateImprovement = (history: TaskResult[]) => {
    if (history.length < 2) return 0
    const firstScore = history[0].score
    const lastScore = history[history.length - 1].score
    return Math.max(0, ((lastScore - firstScore) / firstScore) * 100)
  }

  const clearProgress = () => {
    setResults([])
    if (user) {
      localStorage.removeItem(`memoryResults_${user._id}`)
    } else {
      sessionStorage.removeItem('memoryResults')
    }
  }

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {results.map((result) => (
                    <Card key={result.type}>
                      <CardHeader>
                        <CardTitle>{result.type} Memory</CardTitle>
                        <CardDescription>Rating: {result.rating}/100</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap justify-center gap-6">
                          {Object.entries(result.metrics).map(([metric, value]) => (
                            <div key={metric} className="flex flex-col items-center">
                              <CircularProgress value={value} label={metric} />
                              <TooltipProvider>
                                <UITooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="h-4 w-4 mt-2 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{metricDescriptions[metric as keyof Metrics]}</p>
                                  </TooltipContent>
                                </UITooltip>
                              </TooltipProvider>
                            </div>
                          ))}
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
                  <CardDescription>Your memory performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={results}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="type" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="rating" stroke="#4f46e5" name="Rating" />
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
              {!currentTask ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {memoryTypes.map((type) => (
                    <Card key={type} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => startTask(type)}>
                      <CardHeader>
                        <CardTitle className="text-lg text-purple-600">{type}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-center mb-4">
                          {memoryTypeIcons[type]}
                        </div>
                        <p className="text-sm text-gray-600">{tasks[type].description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-semibold mb-2">{tasks[currentTask].name}</h3>
                  <p className="mb-4">{tasks[currentTask].description}</p>
                  {taskState === 'instructions' && (
                    <Button onClick={executeTask} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white">Start Task</Button>
                  )}
                  {taskState === 'memorizing' && (
                    <div>
                      {taskContent}
                      <Button onClick={readyToAnswer} className="mt-4 bg-[#4f46e5] hover:bg-[#4338ca] text-white">Ready</Button>
                    </div>
                  )}
                  {taskState === 'answering' && (
                    <div>
                      <Input
                        type="text"
                        placeholder="Enter your answer"
                        value={userResponse}
                        onChange={(e) => setUserResponse(e.target.value)}
                        className="mb-4"
                      />
                      <Button onClick={submitAnswer} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white">Submit Answer</Button>
                    </div>
                  )}
                  {taskState === 'completed' && (
                    <div>
                      <p className="text-green-600 mb-2">
                        Task completed! Your score: {taskScore !== null ? `${taskScore.toFixed(2)}/100` : 'N/A'}
                      </p>
                      <Button onClick={() => setCurrentTask(null)} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white">Choose Another Task</Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}