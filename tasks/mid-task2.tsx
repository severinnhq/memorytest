"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle } from 'lucide-react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import TaskCompletionModal from '@/components/TaskCompletionModal'

interface MidTask2Props {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

const SEQUENCE_LENGTH = 5
const DISPLAY_TIME = 5000
const HIDE_TIME = 2000
const TOTAL_ROUNDS = 3
const QUALIFICATION_THRESHOLD = 2

const generateSequences = (count: number) => {
  return Array.from({ length: count }, () =>
    Array.from({ length: SEQUENCE_LENGTH }, () => Math.floor(Math.random() * 10))
  )
}

export default function MidTask2({ onComplete, onUnlockNext }: MidTask2Props) {
  const [sequences, setSequences] = useState<number[][]>([])
  const [missingDigitIndices, setMissingDigitIndices] = useState<number[]>([])
  const [userInput, setUserInput] = useState<string[]>([])
  const [showSequences, setShowSequences] = useState(false)
  const [gameState, setGameState] = useState<'memorize' | 'hide' | 'guess' | 'result' | 'completed'>('memorize')
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [fingerprint, setFingerprint] = useState<string | null>(null)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
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

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState === 'memorize') {
      timer = setTimeout(() => {
        setShowSequences(false)
        setGameState('hide')
      }, DISPLAY_TIME)
    } else if (gameState === 'hide') {
      timer = setTimeout(() => {
        const newMissingDigitIndices = sequences.map(() => Math.floor(Math.random() * SEQUENCE_LENGTH))
        setMissingDigitIndices(newMissingDigitIndices)
        setGameState('guess')
      }, HIDE_TIME)
    }
    return () => clearTimeout(timer)
  }, [gameState, sequences])

  const startRound = () => {
    const sequenceCount = round === 1 ? 2 : round === 2 ? 3 : 4
    const newSequences = generateSequences(sequenceCount)
    setSequences(newSequences)
    setShowSequences(true)
    setGameState('memorize')
    setUserInput(Array(sequenceCount).fill(''))
    setFeedback(null)
  }

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return // Only allow single digit or empty string

    const newUserInput = [...userInput]
    newUserInput[index] = value
    setUserInput(newUserInput)
  }

  const handleSubmit = () => {
    const correct = userInput.every((input, index) => 
      parseInt(input) === sequences[index][missingDigitIndices[index]]
    )
    setFeedback(correct ? 'correct' : 'incorrect')
    
    if (correct) {
      setAnimateScore(true)
      setScore(prevScore => prevScore + 1)
    }
    
    setTimeout(() => {
      setFeedback(null)
      setAnimateScore(false)
      if (round === TOTAL_ROUNDS) {
        handleTaskCompletion(score + (correct ? 1 : 0) >= QUALIFICATION_THRESHOLD, score + (correct ? 1 : 0))
      } else {
        setRound(prevRound => prevRound + 1)
      }
    }, 1500)
  }

  const handleTaskCompletion = (success: boolean, finalScore: number) => {
    setGameState('completed')
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
          taskId: 'MidTask2',
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
      <h2 className="text-2xl font-bold mb-4 text-center text-indigo-800">Missing Digit Memory</h2>
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
      
      <div className="space-y-2 mb-4">
        {sequences.map((sequence, sequenceIndex) => (
          <motion.div
            key={sequenceIndex}
            className="bg-indigo-100 p-2 rounded-lg text-center flex items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: sequenceIndex * 0.1 }}
          >
            {sequence.map((digit, digitIndex) => (
              <React.Fragment key={digitIndex}>
                {gameState === 'guess' && digitIndex === missingDigitIndices[sequenceIndex] ? (
                  <div className="w-8 h-8 mx-1 relative">
                    <Input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={userInput[sequenceIndex]}
                      onChange={(e) => handleInputChange(sequenceIndex, e.target.value)}
                      className="w-full h-full text-center text-xl font-bold p-0 absolute inset-0"
                      maxLength={1}
                    />
                  </div>
                ) : (
                  <span className="w-8 h-8 inline-flex items-center justify-center text-2xl font-bold text-indigo-800 mx-1">
                    {gameState === 'memorize' || (gameState === 'guess' && digitIndex !== missingDigitIndices[sequenceIndex]) ? digit : '_'}
                  </span>
                )}
              </React.Fragment>
            ))}
          </motion.div>
        ))}
      </div>

      {gameState === 'memorize' && (
        <p className="text-center text-lg font-semibold text-indigo-600 mb-4">
          Memorize the sequences! ({sequences.length} sequence{sequences.length > 1 ? 's' : ''})
        </p>
      )}

      {gameState === 'hide' && (
        <p className="text-center text-lg font-semibold text-indigo-600 mb-4">Get ready...</p>
      )}

      {gameState === 'guess' && (
        <>
          <p className="text-center text-lg font-semibold text-indigo-600 mb-4">
            Fill in the missing digit for each sequence!
          </p>
          <Button onClick={handleSubmit} className="w-full">Submit</Button>
        </>
      )}

      <TaskCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        success={score >= QUALIFICATION_THRESHOLD}
        score={score}
        totalRounds={TOTAL_ROUNDS}
        qualificationThreshold={QUALIFICATION_THRESHOLD}
        onNextTask={handleNextTask}
        onTryAgain={handleTryAgain}
      />
    </div>
  )
}