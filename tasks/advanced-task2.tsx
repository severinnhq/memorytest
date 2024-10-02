"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from 'framer-motion'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import TwoTaskCompModal from '@/components/ui/2TaskCompModal'

interface LetterGridProps {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

const TOTAL_ROUNDS = 1
const QUALIFICATION_THRESHOLD = 1
const GRID_SIZE = 4
const POSITIONS_TO_RECALL = 5

export default function LetterGrid({ onComplete, onUnlockNext }: LetterGridProps) {
  const [grid, setGrid] = useState<string[][]>([])
  const [positions, setPositions] = useState<{ row: number; col: number }[]>([])
  const [userInput, setUserInput] = useState('')
  const [gameState, setGameState] = useState<'memorize' | 'input' | 'completed'>('memorize')
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [fingerprint, setFingerprint] = useState<string | null>(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)

  useEffect(() => {
    const initializeFingerprint = async () => {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      setFingerprint(result.visitorId)
    }

    initializeFingerprint()
  }, [])

  useEffect(() => {
    startRound()
  }, [round])

  const generateTask = () => {
    const newGrid = Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    )
    const newPositions = Array.from({ length: POSITIONS_TO_RECALL }, () => ({
      row: Math.floor(Math.random() * GRID_SIZE),
      col: Math.floor(Math.random() * GRID_SIZE)
    }))
    setGrid(newGrid)
    setPositions(newPositions)
  }

  const startRound = () => {
    generateTask()
    setUserInput('')
    setGameState('memorize')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const sanitizedValue = value.replace(/[^A-Za-z]/g, '').toUpperCase()
    setUserInput(sanitizedValue)
  }

  const handleSubmit = () => {
    const correctAnswer = positions.map(pos => grid[pos.row][pos.col]).join('')
    const isCorrect = correctAnswer === userInput.toUpperCase()
    
    const finalScore = isCorrect ? 1 : 0
    setScore(finalScore)
    setGameState('completed')
    handleTaskCompletion(isCorrect, finalScore)
    if (isCorrect) onUnlockNext()
    
    if (fingerprint) {
      saveResult(fingerprint, finalScore)
    }
  }

  const saveResult = async (visitorId: string, finalScore: number) => {
    try {
      const response = await fetch('/api/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitorId,
          taskId: 'LetterGrid',
          score: finalScore,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to save result')
      }
    } catch (error) {
      console.error('Error saving result:', error)
    }
  }

  const handleTaskCompletion = (success: boolean, finalScore: number) => {
    setScore(finalScore)
    onComplete(success)
    if (success) {
      onUnlockNext()
    }
    if (fingerprint) {
      saveResult(fingerprint, finalScore)
    }
    setShowCompletionModal(true)
  }

  const handleTryAgain = () => {
    setRound(1)
    setScore(0)
    setGameState('memorize')
    setShowCompletionModal(false)
    startRound()
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">Letter Grid</h2>
      <p className="text-center text-gray-600 text-sm">Memorize a 4x4 grid of letters, then recall specific positions.</p>

      {gameState === 'memorize' && (
        <Card className="w-full max-w-md">
          <CardContent className="p-4">
            <div className="grid grid-cols-5 gap-2">
              <div className="w-8"></div>
              {[1, 2, 3, 4].map(num => (
                <div key={`col-${num}`} className="w-12 h-8 flex items-center justify-center font-bold text-gray-600">
                  {num}
                </div>
              ))}
              {grid.map((row, rowIndex) => (
                <React.Fragment key={`row-${rowIndex}`}>
                  <div className="w-8 h-12 flex items-center justify-center font-bold text-gray-600">
                    {rowIndex + 1}
                  </div>
                  {row.map((letter, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-md text-2xl font-bold"
                    >
                      {letter}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {gameState === 'input' && (
        <div className="w-full max-w-md space-y-4">
          <p className="text-center">Recall the letters at the following positions:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {positions.map((pos, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 rounded-md">
                ({pos.row + 1}, {pos.col + 1})
              </span>
            ))}
          </div>
          <Input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Enter letters here (letters only)"
            className="w-full"
            maxLength={POSITIONS_TO_RECALL}
          />
          <Button onClick={handleSubmit} className="w-full">Submit</Button>
        </div>
      )}

      <AnimatePresence>
        {gameState === 'memorize' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <Button onClick={() => setGameState('input')} className="mt-4">
              I'm ready
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <TwoTaskCompModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        success={score >= QUALIFICATION_THRESHOLD}
        onTryAgain={handleTryAgain}
      />
    </div>
  )
}