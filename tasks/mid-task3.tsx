"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { CheckCircle, XCircle, X } from 'lucide-react'
import TaskCompletionModal from '@/components/TaskCompletionModal'

interface MidTask3Props {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FED766', '#8A4FFF', '#FF8C42', '#E84855', '#3FEEE6']

const INITIAL_SEQUENCE_LENGTH = 3
const MAX_SEQUENCE_LENGTH = 8
const MEMORIZE_TIME = 10 // 10 seconds to memorize
const TOTAL_ROUNDS = 3
const QUALIFICATION_THRESHOLD = 3

const generateSequence = (length: number) => {
  return Array.from({ length }, () => colors[Math.floor(Math.random() * colors.length)])
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export default function MidTask3({ onComplete, onUnlockNext }: MidTask3Props) {
  const [sequence, setSequence] = useState<string[]>([])
  const [userSequence, setUserSequence] = useState<string[]>([])
  const [showSequence, setShowSequence] = useState(false)
  const [gameState, setGameState] = useState<'memorize' | 'recall' | 'result'>('memorize')
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [sequenceLength, setSequenceLength] = useState(INITIAL_SEQUENCE_LENGTH)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [timeLeft, setTimeLeft] = useState(MEMORIZE_TIME)
  const [fingerprint, setFingerprint] = useState<string | null>(null)
  const [animateScore, setAnimateScore] = useState(false)
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

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState === 'memorize') {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            setShowSequence(false)
            setGameState('recall')
            return MEMORIZE_TIME
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameState])

  const startRound = () => {
    const newSequence = generateSequence(sequenceLength)
    setSequence(newSequence)
    setShowSequence(true)
    setGameState('memorize')
    setUserSequence([])
    setFeedback(null)
    setTimeLeft(MEMORIZE_TIME)
  }

  const handleColorClick = (color: string) => {
    if (gameState !== 'recall') return
    const newUserSequence = [...userSequence, color]
    setUserSequence(newUserSequence)
    if (newUserSequence.length === sequence.length) {
      handleSequenceComplete(newUserSequence)
    }
  }

  const handleRemoveColor = (index: number) => {
    setUserSequence(prev => prev.filter((_, i) => i !== index))
  }

  const handleSequenceComplete = (completedSequence: string[] = userSequence) => {
    const correct = completedSequence.length === sequence.length && 
                    completedSequence.every((color, index) => color === sequence[index])
    setFeedback(correct ? 'correct' : 'incorrect')
    
    if (correct) {
      setAnimateScore(true)
      setScore(prev => prev + 1)
    }
    
    setTimeout(() => {
      setFeedback(null)
      setAnimateScore(false)
      if (round === TOTAL_ROUNDS) {
        const finalScore = score + (correct ? 1 : 0)
        handleTaskCompletion(finalScore >= QUALIFICATION_THRESHOLD, finalScore)
      } else {
        if (correct) {
          setSequenceLength(prev => Math.min(prev + 1, MAX_SEQUENCE_LENGTH))
        }
        setRound(prev => prev + 1)
      }
    }, 1500)
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
    setSequenceLength(INITIAL_SEQUENCE_LENGTH)
    setGameState('memorize')
    setShowCompletionModal(false)
    startRound()
  }

  const handleNextTask = () => {
    onComplete(true)
    setShowCompletionModal(false)
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
          taskId: 'MidTask3',
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

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center text-indigo-800">Color Sequence Memory</h2>
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
      
      <div className="mb-6 h-24 flex items-center justify-center">
        <AnimatePresence>
          {showSequence && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex space-x-2"
            >
              {sequence.map((color, index) => (
                <motion.div
                  key={index}
                  className="w-12 h-12 rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 360 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {gameState === 'memorize' && (
        <div className="text-center">
          <p className="text-lg font-semibold text-indigo-600 mb-2">Memorize the color sequence!</p>
          <div className="flex items-center justify-center">
            <span role="img" aria-label="clock" className="text-3xl mr-2">⏰</span>
            <span className="text-2xl font-bold text-indigo-600">{timeLeft}s</span>
          </div>
        </div>
      )}

      {gameState === 'recall' && (
        <div className="space-y-4">
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {userSequence.map((color, index) => (
              <div key={index} className="relative">
                <div
                  className="w-10 h-10 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <button
                  onClick={() => handleRemoveColor(index)}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {colors.map((color) => (
              <Button
                key={color}
                onClick={() => handleColorClick(color)}
                className="w-full h-12 rounded-full transition-transform hover:scale-105"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <p className="text-center text-lg font-semibold text-indigo-600">
            Select the colors in the correct order
          </p>
        </div>
      )}

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