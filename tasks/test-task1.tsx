"use client"

import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Delete } from 'lucide-react'

interface TaskResult {
  score: number
  metrics: {
    accuracy: number
    speed: number
    improvement: number
  }
}

const colors = [
  'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
  'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500',
  'bg-lime-500', 'bg-emerald-500', 'bg-sky-500', 'bg-violet-500', 'bg-fuchsia-500'
]

export default function PatternRecallTask({ onComplete }: { onComplete: (result: TaskResult) => void }) {
  const [pattern, setPattern] = useState<string[]>([])
  const [userPattern, setUserPattern] = useState<string[]>([])
  const [stage, setStage] = useState<'memorize' | 'recall' | 'result'>('memorize')
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)

  useEffect(() => {
    if (stage === 'memorize') {
      const newPattern = Array.from({ length: 5 }, () => colors[Math.floor(Math.random() * colors.length)])
      setPattern(newPattern)
    }
  }, [stage])

  const handleColorClick = (color: string) => {
    if (stage === 'recall' && userPattern.length < 5) {
      setUserPattern(prev => [...prev, color])
    }
  }

  const handleReadyClick = () => {
    setStartTime(Date.now())
    setStage('recall')
  }

  const calculateResult = (): TaskResult => {
    const correctCount = pattern.filter((color, index) => color === userPattern[index]).length
    const accuracy = (correctCount / pattern.length) * 100
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

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-lg">Color Recall Challenge</CardTitle>

      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stage === 'memorize' && (
            <>
              <div className="grid grid-cols-5 gap-2">
                {pattern.map((color, index) => (
                  <motion.div
                    key={index}
                    className={`w-12 h-12 rounded-lg ${color}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  />
                ))}
              </div>
              <Button
                onClick={handleReadyClick}
                className="w-full text-white"
                style={{ backgroundColor: '#4f46e5', borderColor: '#4f46e5' }}
              >
                Ready to Recall
              </Button>
            </>
          )}
          {stage === 'recall' && (
            <>
              <div className="grid grid-cols-5 gap-2">
                {colors.map((color, index) => (
                  <Button
                    key={index}
                    className={`w-12 h-12 ${color} transition-all duration-200 ${
                      color === 'bg-red-500' ? 'hover:bg-red-600' : ''
                    } ${color === 'bg-blue-500' ? 'hover:bg-blue-600' : ''} ${
                      color === 'bg-green-500' ? 'hover:bg-green-600' : ''
                    } ${color === 'bg-yellow-500' ? 'hover:bg-yellow-600' : ''} ${
                      color === 'bg-purple-500' ? 'hover:bg-purple-600' : ''
                    } ${color === 'bg-pink-500' ? 'hover:bg-pink-600' : ''} ${
                      color === 'bg-indigo-500' ? 'hover:bg-indigo-600' : ''
                    } ${color === 'bg-teal-500' ? 'hover:bg-teal-600' : ''} ${
                      color === 'bg-orange-500' ? 'hover:bg-orange-600' : ''
                    } ${color === 'bg-cyan-500' ? 'hover:bg-cyan-600' : ''} ${
                      color === 'bg-lime-500' ? 'hover:bg-lime-600' : ''
                    } ${color === 'bg-emerald-500' ? 'hover:bg-emerald-600' : ''} ${
                      color === 'bg-sky-500' ? 'hover:bg-sky-600' : ''
                    } ${color === 'bg-violet-500' ? 'hover:bg-violet-600' : ''} ${
                      color === 'bg-fuchsia-500' ? 'hover:bg-fuchsia-600' : ''
                    }`}
                    onClick={() => handleColorClick(color)}
                    disabled={userPattern.length >= 5}
                  />
                ))}
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex flex-wrap gap-2 mb-4">
                {userPattern.map((color, index) => (
                  <div key={index} className={`w-8 h-8 rounded-lg ${color}`} />
                ))}
                {Array.from({ length: 5 - userPattern.length }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="w-8 h-8 rounded-lg border-2 border-dashed border-gray-300"
                  />
                ))}
              </div>
              <div className="flex justify-between">
                <Button
                  onClick={() => setUserPattern(prev => prev.slice(0, -1))}
                  className="text-white"
                  style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }}
                  disabled={userPattern.length === 0}
                >
                  <Delete className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => {
                    setEndTime(Date.now())
                    setStage('result')
                  }}
                  className="text-white"
                  style={{ backgroundColor: '#4f46e5', borderColor: '#4f46e5' }}
                  disabled={userPattern.length !== 5}
                >
                  Submit
                </Button>
              </div>
            </>
          )}
          {stage === 'result' && (
            <div className="space-y-4">
              <p className="text-xl font-semibold">Your Result:</p>
              <p className="text-3xl font-bold text-center">{calculateResult().score}/100</p>
              <Button
                onClick={() => onComplete(calculateResult())}
                className="w-full text-white"
                style={{ backgroundColor: '#4f46e5', borderColor: '#4f46e5' }}
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