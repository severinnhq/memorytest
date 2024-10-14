"use client"

import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronUp } from 'lucide-react'

interface TaskResult {
  score: number
  metrics: {
    accuracy: number
    speed: number
    improvement: number
  }
}

const GRID_SIZE = 4
const QUESTIONS_PER_TASK = 3

const allEmojis = [
  '💼', '📊', '📈', '📉', '💡', '🗓️', '📝', '✅', '📌', '🎯', '🏆', '💰',
  '📱', '💻', '⏰', '📅', '📨', '📤', '📥', '🔍', '🔐', '🔑', '📁', '🗄️',
  '🖨️', '🖥️', '💾', '📇', '🗂️', '📎', '📏', '✂️', '🗃️', '📆', '🕰️', '📋'
]

export default function Component({ onComplete = () => {} }: { onComplete?: (result: TaskResult) => void }) {
  const [stage, setStage] = useState<'start' | 'memorize' | 'question' | 'result'>('start')
  const [grid, setGrid] = useState<string[][]>([])
  const [currentQuestions, setCurrentQuestions] = useState<{ row: number; col: number; }[]>([])
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [questionCount, setQuestionCount] = useState(0)
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [taskEmojis, setTaskEmojis] = useState<string[]>([])
  const [result, setResult] = useState<TaskResult | null>(null)
  const [isResultOpen, setIsResultOpen] = useState(false)

  useEffect(() => {
    const shuffled = [...allEmojis].sort(() => 0.5 - Math.random())
    setTaskEmojis(shuffled.slice(0, 16))
  }, [])

  const generateGrid = () => {
    return Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => taskEmojis[Math.floor(Math.random() * taskEmojis.length)])
    )
  }

  const startTask = () => {
    const newGrid = generateGrid()
    setGrid(newGrid)
    setStage('memorize')
    setStartTime(Date.now())
  }

  const startQuestions = () => {
    setStage('question')
    setQuestionCount(0)
    askQuestions()
  }

  const askQuestions = () => {
    const newQuestions = Array(3).fill(null).map(() => ({
      row: Math.floor(Math.random() * GRID_SIZE),
      col: Math.floor(Math.random() * GRID_SIZE)
    }))
    setCurrentQuestions(newQuestions)
    setUserAnswers([])
  }

  const handleAnswer = (answer: string, index: number) => {
    const newUserAnswers = [...userAnswers]
    newUserAnswers[index] = answer
    setUserAnswers(newUserAnswers)
  }

  const handleSubmit = () => {
    if (userAnswers.length !== 3) return

    let newScore = score
    userAnswers.forEach((answer, index) => {
      const correctAnswer = grid[currentQuestions[index].row][currentQuestions[index].col]
      if (answer === correctAnswer) {
        newScore++
      }
    })
    setScore(newScore)

    setQuestionCount(questionCount + 1)
    if (questionCount + 1 < QUESTIONS_PER_TASK) {
      askQuestions()
    } else {
      setEndTime(Date.now())
      const finalResult = calculateResult()
      setResult(finalResult)
      setStage('result')
      onComplete(finalResult)
    }
  }

  const calculateResult = (): TaskResult => {
    const accuracy = (score / (QUESTIONS_PER_TASK * 3)) * 100
    const speed = Math.max(0, 100 - ((endTime - startTime) / 1000))
    return {
      score: Math.round((accuracy + speed) / 2),
      metrics: {
        accuracy,
        speed,
        improvement: 0 // Placeholder value as we don't track multiple attempts
      }
    }
  }

  const renderGrid = (small: boolean = false) => (
    <div className={`grid grid-cols-4 gap-1 mb-4 ${small ? 'w-48 h-48' : ''}`}>
      {grid.flat().map((emoji, index) => {
        const row = Math.floor(index / GRID_SIZE)
        const col = index % GRID_SIZE
        const isCurrentQuestion = currentQuestions.some(q => q.row === row && q.col === col)
        return (
          <motion.div
            key={index}
            className={`flex items-center justify-center text-2xl font-bold bg-white border-2 border-gray-300 rounded ${
              small ? 'w-10 h-10' : 'w-16 h-16'
            } ${isCurrentQuestion ? 'bg-primary text-primary-foreground' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {(small && isCurrentQuestion) ? '?' : emoji}
          </motion.div>
        )
      })}
    </div>
  )

  const EmojiSelect = ({ onSelect, value }: { onSelect: (emoji: string) => void, value: string }) => (
    <Select onValueChange={onSelect} value={value}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an emoji" />
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-[200px] w-[180px] p-2">
          <div className="grid grid-cols-4 gap-2">
            {taskEmojis.map((emoji) => (
              <SelectItem key={emoji} value={emoji} className="flex items-center justify-center p-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded">
                <span className="text-lg">{emoji}</span>
              </SelectItem>
            ))}
          </div>
        </ScrollArea>
      </SelectContent>
    </Select>
  )

  const CircleDiagram = ({ percentage }: { percentage: number }) => (
    <div className="relative w-48 h-48">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle
          className="text-gray-200 stroke-current"
          strokeWidth="10"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
        ></circle>
        <circle
          className="text-primary stroke-current"
          strokeWidth="10"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="40"
          fill="transparent"
          strokeDasharray={`${percentage * 2.51327}, 251.327`}
          transform="rotate(-90 50 50)"
        ></circle>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-4xl font-bold">{Math.round(percentage)}%</span>
      </div>
    </div>
  )

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Emoji Recall Grid</CardTitle>
        <CardDescription>Memorize the emojis and their positions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stage === 'start' && (
            <div className="space-y-4">
              <p className="text-lg">You will see a 4x4 grid of business and productivity emojis. Try to remember as many as you can!</p>
              <Button
                onClick={startTask}
                className="w-full"
              >
                Start Task
              </Button>
            </div>
          )}
          {stage === 'memorize' && (
            <div className="space-y-4">
              {renderGrid()}
              <Button
                onClick={startQuestions}
                className="w-full"
              >
                I'm Ready
              </Button>
            </div>
          )}
          {stage === 'question' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium text-lg">Recall the following cells:</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Which ones are they?</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2">
                    {renderGrid(true)}
                  </PopoverContent>
                </Popover>
              </div>
              {currentQuestions.map((question, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Label className="w-1/2 text-right">Row {question.row + 1}, Column {question.col + 1}:</Label>
                  <EmojiSelect onSelect={(emoji) => handleAnswer(emoji, index)} value={userAnswers[index] || ''} />
                </div>
              ))}
              <Button
                onClick={handleSubmit}
                className="w-full mt-4"
                disabled={userAnswers.filter(Boolean).length !== 3}
              >
                Submit Answers
              </Button>
            </div>
          )}
          {stage === 'result' && result && (
            <div className="space-y-3">
              <p className="text-2xl font-semibold text-primary">Task Completed!</p>
              <Collapsible open={isResultOpen} onOpenChange={setIsResultOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full text-[0.9rem]">
                    {isResultOpen ? 'Hide' : 'Show'} Results
                    {isResultOpen ? <ChevronUp className="w-5 h-5 ml-2" /> : <ChevronDown className="w-5 h-5 ml-2" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <div className="text-center mb-4">
                    <CircleDiagram percentage={result.score} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span>Accuracy:</span>
                      <span>{Math.round(result.metrics.accuracy)}%</span>
                    </div>
                    <Progress value={result.metrics.accuracy} className="w-full" />
                    <div className="flex justify-between items-center">
                      <span>Speed:</span>
                      <span>{Math.round(result.metrics.speed)}%</span>
                    </div>
                    <Progress value={result.metrics.speed} className="w-full" />
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <Button
                onClick={() => {
                  onComplete(result)
                  setUserAnswers([])
                  setQuestionCount(0)
                  setStage('start')
                  setIsResultOpen(false)
                }}
                className="w-full mt-3"
              >
                Back to Dashboard
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}