'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Square, Circle, Triangle } from 'lucide-react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import TaskCompletionModal from '@/components/TaskCompletionModal'

interface RotatingShapesSequenceProps {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

const GRID_SIZE = 3
const TOTAL_ROUNDS = 5
const QUALIFICATION_THRESHOLD = 3
const SEQUENCE_LENGTH = 3
const MEMORIZE_TIME = 5 // seconds per pattern
const SHAPES = [Square, Circle, Triangle]
const COLORS = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500']
const ROTATIONS = [0, 90, 180, 270]

type Cell = {
  shape: typeof SHAPES[number]
  color: string
  rotation: number
}

type Pattern = Cell[][]

function ClockTimer({ timeLeft, isCountingDown }: { timeLeft: number; isCountingDown: boolean }) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex items-center justify-center space-x-2 text-2xl font-bold mb-4">
      <span role="img" aria-label="clock" className="text-3xl">
        {isCountingDown ? '⏰' : '🕰️'}
      </span>
      <span>{formatTime(timeLeft)}</span>
    </div>
  )
}

export default function RotatingShapesSequence({ onComplete, onUnlockNext }: RotatingShapesSequenceProps) {
  const [sequence, setSequence] = useState<Pattern[]>([])
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0)
  const [userPattern, setUserPattern] = useState<Pattern>([])
  const [currentRound, setCurrentRound] = useState(1)
  const [score, setScore] = useState(0)
  const [gameStatus, setGameStatus] = useState<'memorize' | 'recall' | 'feedback' | 'completed'>('memorize')
  const [fingerprint, setFingerprint] = useState<string | null>(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [timeLeft, setTimeLeft] = useState(MEMORIZE_TIME)

  useEffect(() => {
    const initializeFingerprint = async () => {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      setFingerprint(result.visitorId)
    }

    initializeFingerprint()
  }, [])

  const generatePattern = useCallback((): Pattern => {
    return Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => ({
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: ROTATIONS[Math.floor(Math.random() * ROTATIONS.length)]
      }))
    )
  }, [])

  const generateSequence = useCallback(() => {
    const newSequence = Array.from({ length: SEQUENCE_LENGTH }, generatePattern)
    setSequence(newSequence)
    setCurrentPatternIndex(0)
    setUserPattern(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null)))
    setGameStatus('memorize')
    setTimeLeft(MEMORIZE_TIME)
  }, [generatePattern])

  useEffect(() => {
    if (currentRound <= TOTAL_ROUNDS) {
      generateSequence()
    } else {
      setGameStatus('completed')
      setShowCompletionModal(true)
      onComplete(score >= QUALIFICATION_THRESHOLD)
      if (score >= QUALIFICATION_THRESHOLD) {
        onUnlockNext()
      }
      if (fingerprint) {
        saveResult(fingerprint, score)
      }
    }
  }, [currentRound, generateSequence, score, fingerprint, onComplete, onUnlockNext])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameStatus === 'memorize' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            if (currentPatternIndex < SEQUENCE_LENGTH - 1) {
              setCurrentPatternIndex(prev => prev + 1)
              return MEMORIZE_TIME
            } else {
              setGameStatus('recall')
              return 0
            }
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameStatus, timeLeft, currentPatternIndex])

  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== 'recall') return

    setUserPattern(prev => {
      const newPattern = [...prev]
      if (!newPattern[row]) newPattern[row] = []
      const currentCell = newPattern[row][col]
      const currentShapeIndex = currentCell ? SHAPES.indexOf(currentCell.shape) : -1
      const currentColorIndex = currentCell ? COLORS.indexOf(currentCell.color) : -1
      const currentRotationIndex = currentCell ? ROTATIONS.indexOf(currentCell.rotation) : -1
      
      const nextShapeIndex = (currentShapeIndex + 1) % SHAPES.length
      const nextColorIndex = (currentColorIndex + 1) % COLORS.length
      const nextRotationIndex = (currentRotationIndex + 1) % ROTATIONS.length

      newPattern[row][col] = {
        shape: SHAPES[nextShapeIndex],
        color: COLORS[nextColorIndex],
        rotation: ROTATIONS[nextRotationIndex]
      }
      return newPattern
    })
  }

  const handleSubmit = () => {
    const expectedPattern = generateNextPattern(sequence)
    const isCorrect = expectedPattern.every((row, i) =>
      row.every((cell, j) =>
        userPattern[i] && userPattern[i][j] &&
        cell.shape === userPattern[i][j].shape &&
        cell.color === userPattern[i][j].color &&
        cell.rotation === userPattern[i][j].rotation
      )
    )
    setFeedback(isCorrect ? 'correct' : 'incorrect')

    if (isCorrect) {
      setScore(prevScore => prevScore + 1)
    }

    setTimeout(() => {
      setCurrentRound(prevRound => prevRound + 1)
      setFeedback(null)
    }, 1500)
  }

  const generateNextPattern = (patterns: Pattern[]): Pattern => {
    const lastPattern = patterns[patterns.length - 1]
    return lastPattern.map(row =>
      row.map(cell => ({
        shape: SHAPES[(SHAPES.indexOf(cell.shape) + 1) % SHAPES.length],
        color: COLORS[(COLORS.indexOf(cell.color) + 1) % COLORS.length],
        rotation: (cell.rotation + 90) % 360
      }))
    )
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
          taskId: 'RotatingShapesSequence',
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

  const handleTryAgain = () => {
    setCurrentRound(1)
    setScore(0)
    setShowCompletionModal(false)
    generateSequence()
  }

  const handleNextTask = () => {
    onComplete(true)
    setShowCompletionModal(false)
  }

  const renderCell = (cell: Cell | null, onClick?: () => void) => (
    <motion.div
      className="aspect-square rounded-lg flex items-center justify-center bg-gray-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {cell && (
        <motion.div
          className={`w-8 h-8 ${cell.color}`}
          style={{ transform: `rotate(${cell.rotation}deg)` }}
        >
          <cell.shape />
        </motion.div>
      )}
    </motion.div>
  )

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Rotating Shapes Sequence</h2>
      
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-2">
          {(gameStatus === 'memorize' && sequence[currentPatternIndex] ? sequence[currentPatternIndex] : userPattern).map((row, i) =>
            row.map((cell, j) => renderCell(
              cell,
              gameStatus === 'recall' ? () => handleCellClick(i, j) : undefined
            ))
          )}
        </div>
      </div>

      {gameStatus === 'memorize' && (
        <div className="text-center mb-4">
          <p className="text-lg font-semibold text-indigo-600 mb-2">
            Memorize pattern {currentPatternIndex + 1} of {SEQUENCE_LENGTH}
          </p>
          <ClockTimer timeLeft={timeLeft} isCountingDown={true} />
        </div>
      )}

      {gameStatus === 'recall' && (
        <>
          <p className="text-lg font-semibold text-indigo-600 mb-4 text-center">
            Create the next pattern in the sequence
          </p>
          <Button onClick={handleSubmit} className="w-full mb-4">Submit Pattern</Button>
        </>
      )}

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`flex justify-center items-center mt-4 ${
              feedback === 'correct' ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {feedback === 'correct' ? (
              <CheckCircle className="w-6 h-6 mr-2" />
            ) : (
              <XCircle className="w-6 h-6 mr-2" />
            )}
            {feedback === 'correct' ? 'Correct!' : 'Incorrect'}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-6">
        <Progress value={(score / TOTAL_ROUNDS) * 100} className="w-full mb-2" />
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">Round: {currentRound}/{TOTAL_ROUNDS}</span>
          <span className="text-gray-600">Score: {score}/{TOTAL_ROUNDS}</span>
        </div>
      </div>

      <TaskCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        success={score >= QUALIFICATION_THRESHOLD}
        score={score}
        totalRounds={TOTAL_ROUNDS}
        onNextTask={handleNextTask}
        onTryAgain={handleTryAgain}
      />
    </div>
  )
}