'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { motion } from 'framer-motion'
import { Square, Circle, Triangle, Star } from 'lucide-react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import TaskCompletionModal from '@/components/TaskCompletionModal'

interface MultiDimensionalMemoryMatrixProps {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

const shapes = [
  { name: 'Square', component: Square },
  { name: 'Circle', component: Circle },
  { name: 'Triangle', component: Triangle },
  { name: 'Star', component: Star },
]

const colors = ['red', 'blue', 'green', 'yellow']
const gridSize = 3
const memorizeTime = 15000
const maxAttempts = 3

type MatrixCell = {
  shape: typeof shapes[number]
  color: string
  number: number
}

export default function MultiDimensionalMemoryMatrix({ onComplete, onUnlockNext }: MultiDimensionalMemoryMatrixProps) {
  const [matrix, setMatrix] = useState<MatrixCell[][]>([])
  const [userMatrix, setUserMatrix] = useState<Partial<MatrixCell>[][]>([])
  const [phase, setPhase] = useState<'memorize' | 'recall' | 'result'>('memorize')
  const [attempts, setAttempts] = useState(0)
  const [timeLeft, setTimeLeft] = useState(memorizeTime / 1000)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [selectionType, setSelectionType] = useState<'shape' | 'color' | 'number'>('shape')
  const [fingerprint, setFingerprint] = useState<string | null>(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [score, setScore] = useState(0)  // Add this line to track the score

  useEffect(() => {
    const initializeFingerprint = async () => {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      setFingerprint(result.visitorId)
    }

    initializeFingerprint()
  }, [])

  useEffect(() => {
    if (phase === 'memorize') {
      const newMatrix = Array.from({ length: gridSize }, () =>
        Array.from({ length: gridSize }, () => ({
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          number: Math.floor(Math.random() * 4) + 1,
        }))
      )
      setMatrix(newMatrix)
      setUserMatrix(Array.from({ length: gridSize }, () => Array(gridSize).fill({})))
      const countdown = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdown)
            setPhase('recall')
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(countdown)
    }
  }, [phase])

  const handleCellClick = (row: number, col: number) => {
    if (phase !== 'recall') return
    setSelectedCell({ row, col })
  }

  const handleSelection = (selection: string) => {
    if (!selectedCell) return
    const { row, col } = selectedCell
    setUserMatrix(prev => {
      const newMatrix = [...prev]
      if (selectionType === 'shape') {
        newMatrix[row][col] = { ...newMatrix[row][col], shape: shapes.find(s => s.name === selection) }
      } else if (selectionType === 'color') {
        newMatrix[row][col] = { ...newMatrix[row][col], color: selection }
      } else {
        newMatrix[row][col] = { ...newMatrix[row][col], number: parseInt(selection) }
      }
      return newMatrix
    })
    setSelectionType(prev => {
      if (prev === 'shape') return 'color'
      if (prev === 'color') return 'number'
      setSelectedCell(null)
      return 'shape'
    })
  }

  const handleSubmit = () => {
    const correct = matrix.every((row, i) =>
      row.every((cell, j) =>
        cell.shape.name === userMatrix[i][j].shape?.name &&
        cell.color === userMatrix[i][j].color &&
        cell.number === userMatrix[i][j].number
      )
    )
    if (correct) {
      // Perfect completion
      setScore(maxAttempts)  // Set the score to maximum
      onComplete(true)
      onUnlockNext()
      if (fingerprint) {
        saveResult(fingerprint, maxAttempts)
      }
      setShowCompletionModal(true)
    } else {
      setAttempts(prev => prev + 1)
      if (attempts + 1 >= maxAttempts) {
        // Failed all attempts
        setScore(0)  // Set the score to 0
        onComplete(false)
        if (fingerprint) {
          saveResult(fingerprint, 0)
        }
        setShowCompletionModal(true)
      } else {
        setScore(maxAttempts - attempts - 1)  // Set the score based on remaining attempts
        setUserMatrix(Array.from({ length: gridSize }, () => Array(gridSize).fill({})))
        setPhase('memorize')
        setTimeLeft(memorizeTime / 1000)
        setShowCompletionModal(true)
      }
    }
  }

  const handleTryAgain = () => {
    setAttempts(0)
    setPhase('memorize')
    setTimeLeft(memorizeTime / 1000)
    setUserMatrix(Array.from({ length: gridSize }, () => Array(gridSize).fill({})))
    setShowCompletionModal(false)
  }

  const saveResult = async (visitorId: string, score: number) => {
    try {
      const response = await fetch('/api/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitorId,
          taskId: 'MidTask4',
          score,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to save result')
      }
    } catch (error) {
      console.error('Error saving result:', error)
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-800">Multi-Dimensional Memory Matrix</h2>
     
      {phase === 'memorize' && (
        <div className="mb-4">
          <p className="text-center text-lg mb-2">Memorize the pattern</p>
          <div className="flex items-center justify-center space-x-2 text-2xl font-bold mb-4">
            <span role="img" aria-label="clock" className="text-3xl">⏰</span>
            <span>{`${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {matrix.map((row, i) =>
              row.map((cell, j) => (
                <div key={`${i}-${j}`} className="aspect-square flex items-center justify-center bg-white rounded-lg shadow">
                  <cell.shape.component className={`w-8 h-8 text-${cell.color}-500`} />
                  <span className="absolute text-xs font-bold">{cell.number}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {phase === 'recall' && (
        <div>
          <p className="text-center text-lg mb-4">Recreate the matrix by selecting the correct shape, color, and number for each cell</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {userMatrix.map((row, i) =>
              row.map((cell, j) => (
                <motion.div
                  key={`${i}-${j}`}
                  className={`aspect-square flex items-center justify-center bg-white rounded-lg shadow cursor-pointer ${
                    selectedCell?.row === i && selectedCell?.col === j ? 'ring-2 ring-indigo-500' : ''
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCellClick(i, j)}
                >
                  {cell.shape && <cell.shape.component className={`w-8 h-8 ${cell.color ? `text-${cell.color}-500` : ''}`} />}
                  {cell.number && <span className="absolute text-xs font-bold">{cell.number}</span>}
                </motion.div>
              ))
            )}
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Select {selectionType}:</h3>
            <div className="flex flex-wrap gap-2">
              {selectionType === 'shape' && shapes.map(shape => (
                <Button key={shape.name} onClick={() => handleSelection(shape.name)} variant="outline">
                  <shape.component className="w-6 h-6" />
                </Button>
              ))}
              {selectionType === 'color' && colors.map(color => (
                <Button key={color} onClick={() => handleSelection(color)} variant="outline" className={`bg-${color}-500 w-8 h-8`} />
              ))}
              {selectionType === 'number' && Array.from({ length: 4 }, (_, i) => i + 1).map(num => (
                <Button key={num} onClick={() => handleSelection(num.toString())} variant="outline">
                  {num}
                </Button>
              ))}
            </div>
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={userMatrix.some(row => row.some(cell => !cell.shape || !cell.color || !cell.number))}
            className="w-full"
          >
            Submit
          </Button>
        </div>
      )}
      {attempts > 0 && (
        <TaskCompletionModal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          success={score === maxAttempts}
          score={score}
          totalRounds={maxAttempts}
          qualificationThreshold={maxAttempts}
          onNextTask={() => onComplete(true)}
          onTryAgain={handleTryAgain}
        />
      )}
    </div>
  )
}