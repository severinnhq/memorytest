"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { CheckCircle, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import TwoTaskCompModal from '@/components/ui/2TaskCompModal'

interface DigitSymbolSubstitutionProps {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

const TOTAL_ROUNDS = 1
const QUALIFICATION_THRESHOLD = 1
const SEQUENCE_LENGTH = 10

export default function DigitSymbolSubstitution({ onComplete, onUnlockNext }: DigitSymbolSubstitutionProps) {
  const [pairs, setPairs] = useState<{ symbol: string; digit: number }[]>([])
  const [sequence, setSequence] = useState<string[]>([])
  const [userInput, setUserInput] = useState('')
  const [gameState, setGameState] = useState<'memorize' | 'input' | 'result' | 'completed'>('memorize')
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

  const generateTask = () => {
    const symbols = ['@', '#', '$', '%', '&', '*', '=', '+', '?', '!', '^', '~']
    const digits = [1, 2, 3, 4, 5, 6, 7, 8]
    const shuffledSymbols = symbols.sort(() => Math.random() - 0.5).slice(0, 8)
    const shuffledDigits = digits.sort(() => Math.random() - 0.5)
    
    const newPairs = shuffledSymbols.map((symbol, index) => ({ symbol, digit: shuffledDigits[index] }))
    const newSequence = Array.from({length: SEQUENCE_LENGTH}, () => shuffledSymbols[Math.floor(Math.random() * shuffledSymbols.length)])
    
    setPairs(newPairs)
    setSequence(newSequence)
  }

  const startRound = () => {
    generateTask()
    setUserInput('')
    setGameState('memorize')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value)
  }

  const handleSubmit = () => {
    const correctAnswer = sequence.map(symbol => 
      pairs.find(pair => pair.symbol === symbol)?.digit
    ).join('')
    
    const parsedUserInput = userInput.replace(/[^0-8]/g, '')
    
    const isCorrect = correctAnswer === parsedUserInput
    setFeedback(isCorrect ? 'correct' : 'incorrect')
    
    if (isCorrect) {
      setAnimateScore(true)
    }
    
    setTimeout(() => {
      setFeedback(null)
      setAnimateScore(false)
      const finalScore = isCorrect ? 1 : 0
      setScore(finalScore)
      setGameState('completed')
      handleTaskCompletion(isCorrect, finalScore)
      if (isCorrect) onUnlockNext()
      
      if (fingerprint) {
        saveResult(fingerprint, finalScore)
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
          taskId: 'DigitSymbolSubstitution',
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
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center text-indigo-800">Digit-Symbol Substitution</h2>
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
      
      {gameState === 'memorize' && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Memorize these pairs:</h3>
            <div className="grid grid-cols-4 gap-2">
              {pairs.map(({ symbol, digit }) => (
                <div key={symbol} className="text-center">
                  <span className="text-2xl font-bold">{symbol}</span>
                  <span className="text-lg"> = </span>
                  <span className="text-2xl font-bold">{digit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {gameState === 'input' && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Enter the corresponding digits:</h3>
          <div className="flex flex-wrap justify-center mb-2">
            {sequence.map((symbol, index) => (
              <span key={index} className="text-2xl font-bold mx-1">{symbol}</span>
            ))}
          </div>
          <Input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            placeholder="Enter digits here (spaces and commas allowed)"
            className="w-full mb-2"
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
              Let's go 🚀
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