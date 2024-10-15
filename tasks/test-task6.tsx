"use client"

import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'

interface TaskResult {
  score: number
  metrics: {
    accuracy: number
    speed: number
    improvement: number
  }
}

const GRID_SIZE = 5
const MOVES = 8
const MOVE_DELAY = 1000 // Increased to 1000ms (1 second) for slower moves

export default function MemoryMazeTask({ onComplete }: { onComplete: (result: TaskResult) => void }) {
  const [position, setPosition] = useState({ x: 2, y: 2 })
  const [moves, setMoves] = useState<string[]>([])
  const [userMoves, setUserMoves] = useState<string[]>([])
  const [stage, setStage] = useState<'start' | 'memorize' | 'recall' | 'result'>('start')
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [showMoves, setShowMoves] = useState(false)

  const generateMoves = () => {
    const newMoves: string[] = []
    let currentPosition = { x: 2, y: 2 }

    for (let i = 0; i < MOVES; i++) {
      const possibleMoves = ['up', 'down', 'left', 'right'].filter(move => {
        if (move === 'up' && currentPosition.y > 0) return true
        if (move === 'down' && currentPosition.y < GRID_SIZE - 1) return true
        if (move === 'left' && currentPosition.x > 0) return true
        if (move === 'right' && currentPosition.x < GRID_SIZE - 1) return true
        return false
      })

      const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
      newMoves.push(randomMove)

      switch (randomMove) {
        case 'up': currentPosition.y--; break
        case 'down': currentPosition.y++; break
        case 'left': currentPosition.x--; break
        case 'right': currentPosition.x++; break
      }
    }

    return newMoves
  }

  useEffect(() => {
    if (stage === 'memorize' && showMoves) {
      const newMoves = generateMoves()
      setMoves(newMoves)
      let currentPosition = { x: 2, y: 2 }
      
      const animateMoves = (index = 0) => {
        if (index < newMoves.length) {
          const move = newMoves[index]
          switch (move) {
            case 'up': currentPosition.y--; break
            case 'down': currentPosition.y++; break
            case 'left': currentPosition.x--; break
            case 'right': currentPosition.x++; break
          }
          setPosition({...currentPosition})
          setTimeout(() => animateMoves(index + 1), MOVE_DELAY)
        } else {
          setTimeout(() => {
            setPosition({ x: 2, y: 2 })
            setStage('recall')
            setStartTime(Date.now())
          }, MOVE_DELAY)
        }
      }
      
      animateMoves()
    }
  }, [stage, showMoves])

  const handleMove = (direction: string) => {
    if (stage === 'recall' && userMoves.length < MOVES) {
      setUserMoves(prev => [...prev, direction])
      switch (direction) {
        case 'up': setPosition(prev => ({ ...prev, y: Math.max(0, prev.y - 1) })); break
        case 'down': setPosition(prev => ({ ...prev, y: Math.min(GRID_SIZE - 1, prev.y + 1) })); break
        case 'left': setPosition(prev => ({ ...prev, x: Math.max(0, prev.x - 1) })); break
        case 'right': setPosition(prev => ({ ...prev, x: Math.min(GRID_SIZE - 1, prev.x + 1) })); break
      }
    }
  }

  const calculateResult = (): TaskResult => {
    const correctMoves = moves.filter((move, index) => move === userMoves[index]).length
    const accuracy = (correctMoves / MOVES) * 100
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
        <CardTitle className="text-lg">Memory Maze</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stage === 'start' && (
            <Button
              onClick={() => {
                setStage('memorize')
                setTimeout(() => setShowMoves(true), 1000)
              }}
              className="w-full text-white"
              style={{ backgroundColor: '#4f46e5', borderColor: '#4f46e5' }}
            >
              Start Game
            </Button>
          )}
          {(stage === 'memorize' || stage === 'recall') && (
            <div className="grid grid-cols-5 gap-2 mb-4">
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                const x = index % GRID_SIZE
                const y = Math.floor(index / GRID_SIZE)
                return (
                  <motion.div
                    key={index}
                    className={`w-12 h-12 rounded-lg ${
                      x === position.x && y === position.y ? '' : 'bg-gray-200'
                    }`}
                    style={x === position.x && y === position.y ? { backgroundColor: '#4f46e5' } : {}}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.01 }}
                  />
                )
              })}
            </div>
          )}
          {stage === 'recall' && (
            <>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div></div>
                <Button onClick={() => handleMove('up')} className="text-[#4f46e5] bg-white hover:bg-gray-100 border border-[#4f46e5]">
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <div></div>
                <Button onClick={() => handleMove('left')} className="text-[#4f46e5] bg-white hover:bg-gray-100 border border-[#4f46e5]">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
                <Button onClick={() => handleMove('down')} className="text-[#4f46e5] bg-white hover:bg-gray-100 border border-[#4f46e5]">
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button onClick={() => handleMove('right')} className="text-[#4f46e5] bg-white hover:bg-gray-100 border border-[#4f46e5]">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex justify-between">
                <Button
                  onClick={() => {
                    setUserMoves([])
                    setPosition({ x: 2, y: 2 })
                  }}
                  className="text-white bg-red-500 hover:bg-red-600"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  RESET
                </Button>
                <Button
                  onClick={() => {
                    setEndTime(Date.now())
                    setStage('result')
                  }}
                  className="text-white"
                  style={{ backgroundColor: '#4f46e5', borderColor: '#4f46e5' }}
                  disabled={userMoves.length !== MOVES}
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