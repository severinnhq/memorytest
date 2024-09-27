'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Square, Hexagon, Octagon } from 'lucide-react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import TaskCompletionModal from '@/components/TaskCompletionModal'

interface DimensionalShiftPuzzleProps {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

const GRID_SIZE = 4
const TOTAL_ROUNDS = 5
const QUALIFICATION_THRESHOLD = 3
const MEMORIZE_TIME = 15 // seconds
const SHAPES = [Square, Hexagon, Octagon]
const COLORS = ['text-red-500', 'text-blue-500', 'text-green-500', 'text-yellow-500']
const DIMENSIONS = ['2D', '3D'] as const

type Cell = {
  shape: typeof SHAPES[number]
  color: string
  dimension: typeof DIMENSIONS[number]
}

type Grid = (Cell | null)[][]

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

export default function DimensionalShiftPuzzle({ onComplete, onUnlockNext }: DimensionalShiftPuzzleProps) {
  const [originalGrid, setOriginalGrid] = useState<Grid>([])
  const [shiftedGrid, setShiftedGrid] = useState<Grid>([])
  const [userGrid, setUserGrid] = useState<Grid>([])
  const [currentRound, setCurrentRound] = useState(1)
  const [score, setScore] = useState(0)
  const [gameStatus, setGameStatus] = useState<'memorize' | 'solve' | 'feedback' | 'completed'>('memorize')
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

  const generateGrid = useCallback((): Grid => {
    return Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => ({
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        dimension: DIMENSIONS[Math.floor(Math.random() * DIMENSIONS.length)]
      }))
    )
  }, [])

  const shiftDimensions = useCallback((grid: Grid): Grid => {
    return grid.map(row =>
      row.map(cell => cell ? {
        ...cell,
        dimension: cell.dimension === '2D' ? '3D' : '2D'
      } : null)
    )
  }, [])

  const startNewRound = useCallback(() => {
    const newGrid = generateGrid()
    setOriginalGrid(newGrid)
    setShiftedGrid(shiftDimensions(newGrid))
    setUserGrid(Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null)))
    setGameStatus('memorize')
    setTimeLeft(MEMORIZE_TIME)
  }, [generateGrid, shiftDimensions])

  useEffect(() => {
    if (currentRound <= TOTAL_ROUNDS) {
      startNewRound()
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
  }, [currentRound, startNewRound, score, fingerprint, onComplete, onUnlockNext])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameStatus === 'memorize' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setGameStatus('solve')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameStatus, timeLeft])

  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== 'solve') return

    setUserGrid(prev => {
      const newGrid = [...prev]
      if (!newGrid[row]) newGrid[row] = []
      const currentCell = newGrid[row][col]
      const originalCell = originalGrid[row][col]

      if (!currentCell && originalCell) {
        newGrid[row][col] = { ...originalCell, dimension: originalCell.dimension === '2D' ? '3D' : '2D' }
      } else {
        newGrid[row][col] = null
      }

      return newGrid
    })
  }

  const handleSubmit = () => {
    const isCorrect = shiftedGrid.every((row, i) =>
      row.every((cell, j) =>
        (cell === null && userGrid[i][j] === null) ||
        (cell !== null && userGrid[i][j] !== null &&
         cell.shape === userGrid[i][j]!.shape &&
         cell.color === userGrid[i][j]!.color &&
         cell.dimension === userGrid[i][j]!.dimension)
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

  const saveResult = async (visitorId: string, finalScore: number) => {
    try {
      const response = await fetch('/api/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitorId,
          taskId: 'DimensionalShiftPuzzle',
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
    startNewRound()
  }

  const handleNextTask = () => {
    onComplete(true)
    setShowCompletionModal(false)
  }

  const renderCell = (cell: Cell | null, onClick?: () => void) => (
    <motion.div
      className={`aspect-square rounded-lg flex items-center justify-center ${cell ? cell.color : 'bg-gray-200'}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {cell && (
        <motion.div
          className={`w-8 h-8 ${cell.dimension === '3D' ? 'opacity-100' : 'opacity-50'}`}
          initial={{ rotateY: cell.dimension === '2D' ? 0 : 180 }}
          animate={{ rotateY: cell.dimension === '2D' ? 0 : 180 }}
          transition={{ duration: 0.5 }}
        >
          <cell.shape />
        </motion.div>
      )}
    </motion.div>
  )

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Dimensional Shift Puzzle</h2>
      
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-2">
          {(gameStatus === 'memorize' ? originalGrid : userGrid).map((row, i) =>
            row.map((cell, j) => renderCell(
              cell,
              gameStatus === 'solve' ? () => handleCellClick(i, j) : undefined
            ))
          )}
        </div>
      </div>

      {gameStatus === 'memorize' && (
        <div className="text-center mb-4">
          <p className="text-lg font-semibold text-indigo-600 mb-2">
            Memorize the grid, then shift dimensions!
          </p>
          <ClockTimer timeLeft={timeLeft} isCountingDown={true} />
        </div>
      )}

      {gameStatus === 'solve' && (
        <>
          <p className="text-lg font-semibold text-indigo-600 mb-4 text-center">
            Recreate the grid with shifted dimensions
          </p>
          <Button onClick={handleSubmit} className="w-full mb-4">Submit Solution</Button>
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