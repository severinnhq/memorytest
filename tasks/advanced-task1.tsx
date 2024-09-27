"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'

interface AdvancedTask1Props {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

const GRID_SIZE = 4
const SEQUENCE_LENGTH = 25
const N_BACK = 3
const INTERVAL = 2500 // 2.5 seconds between stimuli

export default function AdvancedTask1({ onComplete, onUnlockNext }: AdvancedTask1Props) {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'completed'>('ready')
  const [sequence, setSequence] = useState<number[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)

  const generateSequence = useCallback(() => {
    const newSequence = Array.from({ length: SEQUENCE_LENGTH }, () => Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE)))
    setSequence(newSequence)
  }, [])

  const handleStart = () => {
    setGameState('playing')
    generateSequence()
    setCurrentIndex(0)
    setScore(0)
    setTotalAttempts(0)
  }

  const handleResponse = (isMatch: boolean) => {
    if (currentIndex >= N_BACK) {
      setTotalAttempts(prev => prev + 1)
      const actualMatch = sequence[currentIndex] === sequence[currentIndex - N_BACK]
      if (isMatch === actualMatch) {
        setScore(prev => prev + 1)
      }
    }
    if (currentIndex < SEQUENCE_LENGTH - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      endGame()
    }
  }

  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setTimeout(() => {
        if (currentIndex < SEQUENCE_LENGTH - 1) {
          setCurrentIndex(prev => prev + 1)
        } else {
          endGame()
        }
      }, INTERVAL)
      return () => clearTimeout(timer)
    }
  }, [gameState, currentIndex])

  const endGame = () => {
    setGameState('completed')
    const accuracy = totalAttempts > 0 ? score / totalAttempts : 0
    const success = accuracy >= 0.7 // 70% accuracy threshold
    if (success) {
      onUnlockNext()
    }
    onComplete(success)
  }

  return (
    <div className="space-y-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
      <h2 className="text-2xl font-bold text-center text-indigo-800 mb-4">Advanced Visual N-Back</h2>
      {gameState === 'ready' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center"
        >
          <p className="text-xl font-semibold mb-4 text-indigo-800">Ready for the Visual N-Back challenge?</p>
          <p className="text-md mb-4 text-gray-600">
            Remember the position from 3 steps back. 
            Press 'Match' if the current position is the same as 3 steps ago.
          </p>
          <Button 
            onClick={handleStart} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Start Challenge
          </Button>
        </motion.div>
      )}
      {gameState === 'playing' && (
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2 aspect-square">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
              <div 
                key={index} 
                className={`aspect-square rounded-lg ${
                  index === sequence[currentIndex] ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={() => handleResponse(true)} className="bg-green-500 hover:bg-green-600">
              Match
            </Button>
            <Button onClick={() => handleResponse(false)} className="bg-red-500 hover:bg-red-600">
              No Match
            </Button>
          </div>
          <p className="text-center text-gray-600">
            Score: {score} / {totalAttempts}
          </p>
        </div>
      )}
      {gameState === 'completed' && (
        <div className="text-center">
          <p className="text-xl font-semibold mb-4 text-indigo-800">
            Challenge Complete!
          </p>
          <p className="text-lg text-gray-600 mb-4">
            Accuracy: {((score / totalAttempts) * 100).toFixed(2)}%
          </p>
          <p className="text-xl font-semibold mb-4 text-indigo-800">
            {(score / totalAttempts >= 0.7) 
              ? "Congratulations! You've mastered the Advanced Visual N-Back task!" 
              : "Great effort! Keep practicing to improve your score."}
          </p>
          <Button
            onClick={() => setGameState('ready')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  )
}