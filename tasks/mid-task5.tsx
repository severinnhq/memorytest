'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import TaskCompletionModal from '@/components/TaskCompletionModal'

interface MidTask5Props {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

const GRID_SIZE = 5
const TOTAL_ROUNDS = 3
const QUALIFICATION_THRESHOLD = 3
const MAX_SEQUENCE_LENGTH = 12

const DIRECTIONS = [
  { name: 'Up', icon: ArrowUp, value: [-1, 0] },
  { name: 'Down', icon: ArrowDown, value: [1, 0] },
  { name: 'Left', icon: ArrowLeft, value: [0, -1] },
  { name: 'Right', icon: ArrowRight, value: [0, 1] },
]

type MazeItem = {
  direction: number
}

export default function MidTask5({ onComplete, onUnlockNext }: MidTask5Props) {
  const [sequence, setSequence] = useState<MazeItem[]>([])
  const [userSequence, setUserSequence] = useState<MazeItem[]>([])
  const [currentPosition, setCurrentPosition] = useState<[number, number]>([2, 2])
  const [round, setRound] = useState(1)
  const [correctRounds, setCorrectRounds] = useState(0)
  const [gamePhase, setGamePhase] = useState<'idle' | 'showing' | 'input' | 'feedback' | 'completed'>('idle')
  const [message, setMessage] = useState('')
  const [isCorrect, setIsCorrect] = useState(true)
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
    if (gamePhase === 'idle') {
      startNewRound()
    }
  }, [gamePhase, round])

  const startNewRound = useCallback(() => {
    const newSequence: MazeItem[] = []
    let position: [number, number] = [2, 2]

    for (let i = 0; i < Math.min(4 + round * 2, MAX_SEQUENCE_LENGTH); i++) {
      let validDirections = DIRECTIONS.filter((_, index) => {
        const [dy, dx] = DIRECTIONS[index].value
        const newY = position[0] + dy
        const newX = position[1] + dx
        return newY >= 0 && newY < GRID_SIZE && newX >= 0 && newX < GRID_SIZE
      })

      if (validDirections.length === 0) break

      const randomDirection = Math.floor(Math.random() * validDirections.length)
      const chosenDirection = DIRECTIONS.findIndex(d => d === validDirections[randomDirection])

      newSequence.push({ direction: chosenDirection })
      const [dy, dx] = DIRECTIONS[chosenDirection].value
      position = [position[0] + dy, position[1] + dx]
    }

    setSequence(newSequence)
    setUserSequence([])
    setCurrentPosition([2, 2])
    setGamePhase('showing')
    showSequence(newSequence)
  }, [round])

  const showSequence = async (seq: MazeItem[]) => {
    let position: [number, number] = [2, 2]
    for (let item of seq) {
      await new Promise<void>(resolve => setTimeout(resolve, 800))
      const [dy, dx] = DIRECTIONS[item.direction].value
      position = [
        Math.max(0, Math.min(GRID_SIZE - 1, position[0] + dy)),
        Math.max(0, Math.min(GRID_SIZE - 1, position[1] + dx))
      ]
      setCurrentPosition(position)
    }
    await new Promise<void>(resolve => setTimeout(resolve, 1000))
    setCurrentPosition([2, 2])
    setGamePhase('input')
  }

  const handleMove = (direction: number) => {
    if (gamePhase !== 'input') return

    const [dy, dx] = DIRECTIONS[direction].value
    const newY = currentPosition[0] + dy
    const newX = currentPosition[1] + dx

    if (newY < 0 || newY >= GRID_SIZE || newX < 0 || newX >= GRID_SIZE) {
      return // Invalid move, do nothing
    }

    const newUserSequence = [...userSequence, { direction }]
    setUserSequence(newUserSequence)
    setCurrentPosition([newY, newX])

    if (newUserSequence.length === sequence.length) {
      const isCorrect = newUserSequence.every((item, index) => 
        item.direction === sequence[index].direction
      )

      setGamePhase('feedback')
      setIsCorrect(isCorrect)
      if (isCorrect) {
        setCorrectRounds(prev => prev + 1)
        setMessage("Correct! Well done.")
      } else {
        setMessage("Incorrect sequence. Try to remember better next time.")
      }

      if (round < TOTAL_ROUNDS) {
        setTimeout(() => {
          setRound(prevRound => prevRound + 1)
          setGamePhase('idle')
        }, 2000)
      } else {
        setTimeout(() => {
          const finalScore = correctRounds + (isCorrect ? 1 : 0)
          if (finalScore >= QUALIFICATION_THRESHOLD) {
            setMessage("Congratulations! You've completed the task successfully.")
            setGamePhase('completed')
            onComplete(true)
            onUnlockNext()
            if (fingerprint) {
              saveResult(fingerprint, finalScore)
            }
          } else {
            setMessage("You didn't reach the required score. Try again!")
            setGamePhase('completed')
            onComplete(false)
          }
          setShowCompletionModal(true)
        }, 2000)
      }
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
          taskId: 'MidTask5',
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
    setRound(1)
    setCorrectRounds(0)
    setGamePhase('idle')
    setMessage('')
    setShowCompletionModal(false)
  }

  const handleNextTask = () => {
    onComplete(true)
    setShowCompletionModal(false)
  }

  const isValidMove = (direction: number) => {
    const [dy, dx] = DIRECTIONS[direction].value
    const newY = currentPosition[0] + dy
    const newX = currentPosition[1] + dx
    return newY >= 0 && newY < GRID_SIZE && newX >= 0 && newX < GRID_SIZE
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Memory Maze</h2>
      <div className="mb-6">
        <div className="grid grid-cols-5 gap-1 mb-4">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const row = Math.floor(index / GRID_SIZE)
            const col = index % GRID_SIZE
            return (
              <motion.div
                key={index}
                className={`aspect-square rounded-md ${
                  row === currentPosition[0] && col === currentPosition[1]
                    ? 'bg-indigo-500'
                    : 'bg-gray-200'
                }`}
                initial={false}
                animate={{
                  scale: row === currentPosition[0] && col === currentPosition[1] ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            )
          })}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {DIRECTIONS.map((direction, index) => (
            <motion.button
              key={index}
              className={`p-4 rounded-full text-white ${
                isValidMove(index) ? 'bg-indigo-500' : 'bg-gray-400 cursor-not-allowed'
              }`}
              whileHover={isValidMove(index) ? { scale: 1.05 } : {}}
              whileTap={isValidMove(index) ? { scale: 0.95 } : {}}
              onClick={() => handleMove(index)}
              disabled={gamePhase !== 'input' || !isValidMove(index)}
            >
              {React.createElement(direction.icon, { size: 24 })}
            </motion.button>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {gamePhase === 'feedback' && !isCorrect && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded"
            role="alert"
          >
            <div className="flex items-center">
              <AlertCircle className="mr-2" />
              <p>{message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div 
        className="text-xl font-semibold mb-6 text-gray-700 text-center h-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {gamePhase === 'idle' && "Get ready for the next sequence..."}
        {gamePhase === 'showing' && "Memorize the sequence"}
        {gamePhase === 'input' && "Reproduce the sequence"}
        {gamePhase === 'feedback' && isCorrect && message}
        {gamePhase === 'completed' && message}
      </motion.div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-600 font-semibold">Round: {round}/{TOTAL_ROUNDS}</span>
        <span className="text-gray-600 font-semibold">Correct: {correctRounds}/{Math.max(0, round - 1)}</span>
      </div>
      <Progress value={(correctRounds / TOTAL_ROUNDS) * 100} className="w-full mb-6" />
      {gamePhase === 'completed' && (
        <TaskCompletionModal
          isOpen={showCompletionModal}
          onClose={() => setShowCompletionModal(false)}
          success={correctRounds >= QUALIFICATION_THRESHOLD}
          score={correctRounds}
          totalRounds={TOTAL_ROUNDS}
          onNextTask={handleNextTask}
          onTryAgain={handleTryAgain}
        />
      )}
    </div>
  )
}