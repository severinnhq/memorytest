"use client"

import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowRight, Plus, Minus, X, Divide } from 'lucide-react'

interface TaskResult {
  score: number
  metrics: {
    accuracy: number
    speed: number
  }
}

export default function WorkingMemoryTask({ onComplete }: { onComplete: (result: TaskResult) => void }) {
  const [stage, setStage] = useState<'instruction' | 'present' | 'recall' | 'result'>('instruction')
  const [numbers, setNumbers] = useState<number[]>([])
  const [operations, setOperations] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)

  const generateTask = () => {
    const newNumbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 9) + 1)
    const newOperations = Array.from({ length: 6 }, () => {
      const rand = Math.random()
      if (rand < 0.25) return 'add'
      if (rand < 0.5) return 'subtract'
      if (rand < 0.75) return 'multiply'
      return 'divide'
    })
    setNumbers(newNumbers)
    setOperations(newOperations)
  }

  useEffect(() => {
    if (stage === 'present') {
      generateTask()
      setCurrentIndex(0)
    } else if (stage === 'recall') {
      setStartTime(Date.now())
    }
  }, [stage])

  const handleNextNumber = () => {
    if (currentIndex < numbers.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setStage('recall')
    }
  }

  const handleInputChange = (index: number, value: string) => {
    const newAnswers = [...userAnswers]
    newAnswers[index] = parseFloat(value) || 0
    setUserAnswers(newAnswers)
  }

  const calculateResult = (): TaskResult => {
    const correctAnswers = numbers.map((num, index) => {
      switch (operations[index]) {
        case 'add': return num + 2
        case 'subtract': return num - 1
        case 'multiply': return num * 2
        case 'divide': return num / 2
        default: return num
      }
    })
    const correctCount = userAnswers.filter((answer, index) => 
      Math.abs(answer - correctAnswers[index]) < 0.01
    ).length
    const accuracy = (correctCount / numbers.length) * 100
    const speed = Math.max(0, 100 - ((endTime - startTime) / 1000))

    return {
      score: Math.round((accuracy + speed) / 2),
      metrics: {
        accuracy,
        speed
      }
    }
  }

  const getOperationSymbol = (operation: string) => {
    switch (operation) {
      case 'add': return <Plus className="text-green-500" size={48} />
      case 'subtract': return <Minus className="text-red-500" size={48} />
      case 'multiply': return <X className="text-blue-500" size={48} />
      case 'divide': return <Divide className="text-yellow-500" size={48} />
      default: return null
    }
  }

  const getOperationInstruction = (operation: string) => {
    switch (operation) {
      case 'add': return 'Add 2'
      case 'subtract': return 'Subtract 1'
      case 'multiply': return 'Multiply by 2'
      case 'divide': return 'Divide by 2'
      default: return ''
    }
  }

  const getOperationNumber = (operation: string) => {
    switch (operation) {
      case 'add': return '2'
      case 'subtract': return '1'
      case 'multiply': return '2'
      case 'divide': return '2'
      default: return ''
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">

      <CardContent>
        <div className="space-y-4 pt-6 pb-6">
          {stage === 'instruction' && (
            <div className="text-center space-y-4 ">
              <div className="space-y-2 ">

               
                <ul className="list-none space-y-2 mt-4 pt-6 pb-3">
                  <li><span className="font-bold text-green-500">+</span> Add 2 to the number</li>
                  <li><span className="font-bold text-red-500">-</span> Subtract 1 from the number</li>
                  <li><span className="font-bold text-blue-500">×</span> Multiply the number by 2</li>
                  <li><span className="font-bold text-yellow-500">÷</span> Divide the number by 2</li>
                </ul>
                <p className="text-md mt-4 pb-3">
                  Your goal: Calculate and memorize the result of each operation. Ready to put your working memory to the test?
                </p>
              </div>
              <Button
                onClick={() => setStage('present')}
                className="w-full text-white bg-[#4f46e5] hover:bg-[#4f46e5]/90"
              >
                Start the Challenge
              </Button>
            </div>
          )}
          {stage === 'present' && (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="text-6xl font-bold flex items-center space-x-4">
                <span>{numbers[currentIndex]}</span>
                <span>{getOperationSymbol(operations[currentIndex])}</span>
                <span>{getOperationNumber(operations[currentIndex])}</span>
              </div>
              <p className="text-xl mt-4">
                {getOperationInstruction(operations[currentIndex])}
              </p>
              <p className="text-lg mt-2">
                Number {currentIndex + 1} of {numbers.length}
              </p>
              <Button
                onClick={handleNextNumber}
                className="w-full text-white bg-[#4f46e5] hover:bg-[#4f46e5]/90 mt-4"
              >
                {currentIndex === numbers.length - 1 ? 'Start Recall' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          )}
          {stage === 'recall' && (
            <>
              <p className="text-xl font-semibold mb-4">Enter the results in order:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {numbers.map((_, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="font-semibold">#{index + 1}:</span>
                    <Input
                      type="number"
                      step="0.01"
                      value={userAnswers[index] || ''}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      inputMode="decimal"
                    />
                  </div>
                ))}
              </div>
              <Button
                onClick={() => {
                  setEndTime(Date.now())
                  setStage('result')
                }}
                className="w-full mt-4 text-white bg-[#4f46e5] hover:bg-[#4f46e5]/90"
              >
                Submit
              </Button>
            </>
          )}
          {stage === 'result' && (
            <div className="space-y-4">
              <p className="text-xl font-semibold">Your Result:</p>
              <p className="text-3xl font-bold text-center">{calculateResult().score}/100</p>
              <Button
                onClick={() => onComplete(calculateResult())}
                className="w-full text-white bg-[#4f46e5] hover:bg-[#4f46e5]/90"
              >
                Finish
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}