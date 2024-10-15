"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import TaskCompletionModal from '@/components/TaskCompletionModal'
import { CheckCircle, XCircle } from 'lucide-react'

interface MidTask1Props {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

const GRID_SIZE = 3
const SEQUENCE_LENGTH = 5
const DISPLAY_TIME = 1000
const TOTAL_ROUNDS = 3
const QUALIFICATION_THRESHOLD = 3

export default function MidTask1({ onComplete, onUnlockNext }: MidTask1Props) {
  const [sequence, setSequence] = useState<number[]>([])
  const [userSequence, setUserSequence] = useState<number[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showSequence, setShowSequence] = useState(false)
  const [gameState, setGameState] = useState<'showing' | 'input' | 'result' | 'completed'>('showing')
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [fingerprint, setFingerprint] = useState<string | null>(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [animateScore, setAnimateScore] = useState(false)

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

  const generateSequence = () => {
    const newSequence: number[] = []
    const availablePositions = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i)
    
    for (let i = 0; i < SEQUENCE_LENGTH; i++) {
      const randomIndex = Math.floor(Math.random() * availablePositions.length)
      const position = availablePositions[randomIndex]
      newSequence.push(position)
      availablePositions.splice(randomIndex, 1)
    }
    
    setSequence(newSequence)
  }

  const startRound = () => {
    generateSequence()
    setUserSequence([])
    setCurrentIndex(0)
    setShowSequence(true)
    setGameState('showing')
  }

  useEffect(() => {
    if (showSequence) {
      const timer = setTimeout(() => {
        if (currentIndex < SEQUENCE_LENGTH - 1) {
          setCurrentIndex(currentIndex + 1)
        } else {
          setShowSequence(false)
          setGameState('input')
          setCurrentIndex(0)
        }
      }, DISPLAY_TIME)
      return () => clearTimeout(timer)
    }
  }, [showSequence, currentIndex])

  const handleCellClick = (index: number) => {
    if (gameState !== 'input') return
    setUserSequence([...userSequence, index])
    if (userSequence.length + 1 === SEQUENCE_LENGTH) {
      checkSequence([...userSequence, index])
    }
  }

  const checkSequence = (completedSequence: number[]) => {
    const correct = completedSequence.every((num, index) => num === sequence[index])
    setFeedback(correct ? 'correct' : 'incorrect')
    
    if (correct) {
      setAnimateScore(true)
      // Remove the immediate score increment from here
    }
    
    setTimeout(() => {
      setFeedback(null)
      setAnimateScore(false)
      if (round < TOTAL_ROUNDS) {
        setRound(round + 1)
        if (correct) {
          setScore(prevScore => prevScore + 1) // Increment score here, only if correct
        }
      } else {
        const finalScore = score + (correct ? 1 : 0)
        const success = finalScore === TOTAL_ROUNDS
        setGameState('completed')
        handleTaskCompletion(success, finalScore)
        if (success) onUnlockNext()
        
        if (fingerprint) {
          saveResult(fingerprint, finalScore)
        }
      }
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
          taskId: 'MidTask1',
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
    setScore(finalScore) // Update the score state with the final score
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
    setGameState('showing')
    setShowCompletionModal(false)
  }

  const handleNextTask = () => {
    onComplete(true)
    setShowCompletionModal(false)
  }

  useEffect(() => {
    if (gameState === 'completed') {
      setShowCompletionModal(true)
    }
  }, [gameState])

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center text-black-800">Visual Pattern Memory</h2>
      <div className="mb-4 flex justify-between items-center">
        <div className="text-lg font-semibold text-indigo-600">Round {round}/{TOTAL_ROUNDS}</div>
        <div className="flex items-center">
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, x: feedback === 'correct' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: feedback === 'correct' ? 20 : -20 }}
                transition={{ duration: 0.5 }}
                className="mr-2"
              >
                {feedback === 'correct' ? (
                  <motion.div
                    animate={animateScore ? { x: 20, opacity: 0, scale: 0.5 } : {}}
                    transition={{ duration: 1 }}
                  >
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </motion.div>
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div 
            key={score}
            initial={{ scale: 1 }}
            animate={{ scale: animateScore ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5 }}
            className="text-lg font-semibold text-indigo-600"
          >
            Score: {score}/{TOTAL_ROUNDS}
          </motion.div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-4">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
          <motion.div
            key={index}
            className={`w-20 h-20 border-2 border-gray-300 rounded-md flex items-center justify-center cursor-pointer
              ${gameState === 'input' ? 'hover:bg-indigo-100' : ''}`}
            onClick={() => handleCellClick(index)}
            animate={{
              backgroundColor: showSequence && sequence[currentIndex] === index ? '#4F46E5' : '#FFFFFF'
            }}
            transition={{ duration: 0.3 }}
          >
            {gameState === 'input' && userSequence.includes(index) && (
              <div className="w-4 h-4 bg-indigo-500 rounded-full" />
            )}
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {gameState === 'showing' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-lg font-semibold text-indigo-600"
          >
            Memorize the pattern!
          </motion.p>
        )}
        {gameState === 'input' && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-lg font-semibold text-indigo-600"
          >
            Reproduce the pattern
          </motion.p>
        )}
        {gameState === 'completed' && (
          <TaskCompletionModal
            isOpen={showCompletionModal}
            onClose={() => setShowCompletionModal(false)}
            success={score === TOTAL_ROUNDS}
            score={score}
            totalRounds={TOTAL_ROUNDS}
            onNextTask={handleNextTask}
            onTryAgain={handleTryAgain}
          />
        )}
      </AnimatePresence>
    </div>
  )
}