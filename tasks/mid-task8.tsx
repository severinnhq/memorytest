'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from 'framer-motion'
import { Star, Heart, Triangle, Square, Circle, RotateCcw, CheckCircle, XCircle } from 'lucide-react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface MidTask8Props {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

type Symbol = 'star' | 'heart' | 'triangle' | 'square' | 'circle'
type Sequence = Symbol[]

const SYMBOLS: Symbol[] = ['star', 'heart', 'triangle', 'square', 'circle']
const TOTAL_ROUNDS = 5
const QUALIFICATION_THRESHOLD = 4
const INITIAL_SEQUENCE_LENGTH = 4
const MAX_SEQUENCE_LENGTH = 9
const DISPLAY_TIME = 1000
const PAUSE_TIME = 500

interface TaskCompletionModalProps {
  isOpen: boolean
  onClose: () => void
  success: boolean
  score: number
  totalRounds: number
  qualificationThreshold: number
  onNextTask: () => void
  onTryAgain: () => void
}

function TaskCompletionModal({
  isOpen,
  onClose,
  success,
  score,
  totalRounds,
  qualificationThreshold,
  onNextTask,
  onTryAgain
}: TaskCompletionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {success ? "Congratulations!" : "Nice Try!"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {success ? (
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            ) : (
              <XCircle className="w-16 h-16 mx-auto text-red-500" />
            )}
          </motion.div>
          <p className="mt-2 text-gray-600">
            {success
              ? "Great job! You've completed this task successfully."
              : "Don't worry! Practice makes perfect."}
          </p>
          <p className="mt-2 text-gray-600">
            Your score: {score} / {totalRounds} (Threshold: {qualificationThreshold})
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          {success ? (
            <Button onClick={onNextTask} className="bg-green-500 hover:bg-green-600 text-white">
              Next Task
            </Button>
          ) : (
            <Button onClick={onTryAgain} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white-sm">
              Try Again
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function MidTask8({ onComplete, onUnlockNext }: MidTask8Props) {
  const [sequence, setSequence] = useState<Sequence>([])
  const [userSequence, setUserSequence] = useState<Sequence>([])
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [gameStatus, setGameStatus] = useState<'idle' | 'displaying' | 'input' | 'success' | 'failure' | 'completed'>('idle')
  const [currentStep, setCurrentStep] = useState(0)
  const [fingerprint, setFingerprint] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const initializeFingerprint = async () => {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      setFingerprint(result.visitorId)
    }
    initializeFingerprint()
  }, [])

  const generateSequence = useCallback(() => {
    const length = Math.min(INITIAL_SEQUENCE_LENGTH + round - 1, MAX_SEQUENCE_LENGTH)
    const newSequence: Sequence = Array.from({ length }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)])
    setSequence(newSequence)
    setUserSequence([])
    setGameStatus('displaying')
    setCurrentStep(0)
  }, [round])

  useEffect(() => {
    if (gameStatus === 'idle') {
      generateSequence()
    }
  }, [gameStatus, generateSequence])

  useEffect(() => {
    if (gameStatus === 'displaying') {
      if (currentStep < sequence.length) {
        const timer = setTimeout(() => {
          setCurrentStep(currentStep + 1)
        }, DISPLAY_TIME + PAUSE_TIME)
        return () => clearTimeout(timer)
      } else {
        setGameStatus('input')
        setCurrentStep(0)
      }
    }
  }, [gameStatus, currentStep, sequence])

  const handleSymbolClick = (symbol: Symbol) => {
    if (gameStatus !== 'input') return
    const newUserSequence = [...userSequence, symbol]
    setUserSequence(newUserSequence)

    if (newUserSequence.length === sequence.length) {
      checkSequence(newUserSequence)
    }
  }

  const checkSequence = (userSeq: Sequence) => {
    const isCorrect = userSeq.every((symbol, index) => symbol === sequence[index])

    if (isCorrect) {
      setScore(score + 1)
      setGameStatus('success')
    } else {
      setGameStatus('failure')
    }

    setTimeout(() => {
      if (round < TOTAL_ROUNDS) {
        setRound(round + 1)
        setGameStatus('idle')
      } else {
        setGameStatus('completed')
        setIsModalOpen(true)
        onComplete(score + (isCorrect ? 1 : 0) >= QUALIFICATION_THRESHOLD)
        if (fingerprint) {
          saveResult(fingerprint, score + (isCorrect ? 1 : 0))
        }
      }
    }, 1500)
  }

  const saveResult = async (visitorId: string, finalScore: number) => {
    try {
      const response = await fetch('/api/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId, taskId: 'MidTask8', score: finalScore }),
      })
      if (!response.ok) throw new Error('Failed to save result')
    } catch (error) {
      console.error('Error saving result:', error)
    }
  }

  const handleTryAgain = () => {
    setRound(1)
    setScore(0)
    setGameStatus('idle')
    setIsModalOpen(false)
  }

  const renderSymbol = (symbol: Symbol, size: number) => {
    const props = { size, className: "text-indigo-500" }
    switch (symbol) {
      case 'star': return <Star {...props} />
      case 'heart': return <Heart {...props} />
      case 'triangle': return <Triangle {...props} />
      case 'square': return <Square {...props} />
      case 'circle': return <Circle {...props} />
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">Symbol Sequence Surge</h2>
      <p className="text-center text-gray-600 text-sm">Memorize and recreate the sequence of symbols.</p>

      <div className="h-24 flex items-center justify-center">
        {gameStatus === 'displaying' && currentStep < sequence.length && (
          <motion.div
            key={currentStep}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderSymbol(sequence[currentStep], 64)}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2">
        {SYMBOLS.map((symbol) => (
          <Button
            key={symbol}
            onClick={() => handleSymbolClick(symbol)}
            disabled={gameStatus !== 'input'}
            className="p-2 bg-gray-100 hover:bg-gray-200"
          >
            {renderSymbol(symbol, 32)}
          </Button>
        ))}
      </div>

      <div className="flex justify-center space-x-2 h-8">
        {userSequence.map((symbol, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            {renderSymbol(symbol, 24)}
          </motion.div>
        ))}
      </div>

      <div className="text-lg font-bold text-center h-6">
        {gameStatus === 'displaying' && <span className="text-blue-500">Memorize the sequence!</span>}
        {gameStatus === 'input' && <span className="text-indigo-500">Recreate the sequence</span>}
        {gameStatus === 'success' && <span className="text-green-500">Correct!</span>}
        {gameStatus === 'failure' && <span className="text-red-500">Incorrect</span>}
        {gameStatus === 'completed' && (
          <span className={score >= QUALIFICATION_THRESHOLD ? "text-green-500" : "text-red-500"}>
            {score >= QUALIFICATION_THRESHOLD ? "Task Completed!" : "Try Again"}
          </span>
        )}
      </div>

      <Progress value={(score / TOTAL_ROUNDS) * 100} className="w-full h-2" />

      <div className="flex justify-between items-center text-sm w-full">
        <span className="text-gray-600">Round: {round}/{TOTAL_ROUNDS}</span>
        <span className="text-gray-600">Score: {score}/{TOTAL_ROUNDS}</span>
      </div>

      {gameStatus === 'completed' && score < QUALIFICATION_THRESHOLD && (
        <Button 
          onClick={handleTryAgain}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white"
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Try Again
        </Button>
      )}

      <TaskCompletionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        success={score >= QUALIFICATION_THRESHOLD}
        score={score}
        totalRounds={TOTAL_ROUNDS}
        qualificationThreshold={QUALIFICATION_THRESHOLD}
        onNextTask={onUnlockNext}
        onTryAgain={handleTryAgain}
      />
    </div>
  )
}