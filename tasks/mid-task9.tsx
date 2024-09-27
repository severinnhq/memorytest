'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

interface MidTask9Props {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

const WORDS = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon']
const TOTAL_ROUNDS = 5
const QUALIFICATION_THRESHOLD = 4
const PAIRS_PER_ROUND = 5
const DISPLAY_TIME = 10000 // Increased to 10 seconds

export default function MidTask9({ onComplete, onUnlockNext }: MidTask9Props) {
  const [wordNumberPairs, setWordNumberPairs] = useState<{ word: string; number: number }[]>([])
  const [sequence, setSequence] = useState<string[]>([])
  const [userInput, setUserInput] = useState('')
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [gameStatus, setGameStatus] = useState<'idle' | 'displaying' | 'input' | 'success' | 'failure' | 'completed'>('idle')
  const [fingerprint, setFingerprint] = useState<string | null>(null)

  useEffect(() => {
    const initializeFingerprint = async () => {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      setFingerprint(result.visitorId)
    }
    initializeFingerprint()
  }, [])

  const generateRound = useCallback(() => {
    const shuffledWords = [...WORDS].sort(() => 0.5 - Math.random()).slice(0, PAIRS_PER_ROUND)
    const numbers = Array.from({ length: PAIRS_PER_ROUND }, (_, i) => i + 1)
    const shuffledNumbers = [...numbers].sort(() => 0.5 - Math.random())
    const newPairs = shuffledWords.map((word, index) => ({
      word,
      number: shuffledNumbers[index]
    }))
    setWordNumberPairs(newPairs)
    const newSequence = [...newPairs].sort(() => 0.5 - Math.random()).map(pair => pair.word)
    setSequence(newSequence)
    setUserInput('')
    setGameStatus('displaying')
  }, [])

  useEffect(() => {
    if (gameStatus === 'idle') {
      generateRound()
    }
  }, [gameStatus, generateRound])

  useEffect(() => {
    if (gameStatus === 'displaying') {
      const timer = setTimeout(() => {
        setGameStatus('input')
      }, DISPLAY_TIME)

      return () => clearTimeout(timer)
    }
  }, [gameStatus])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^1-5]/g, '')
    setUserInput(value)

    if (value.length === PAIRS_PER_ROUND) {
      checkSequence(value)
    }
  }

  const checkSequence = (input: string) => {
    const correctSequence = sequence.map(word => 
      wordNumberPairs.find(pair => pair.word === word)?.number.toString()
    ).join('')

    const isCorrect = input === correctSequence

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
        if (score + (isCorrect ? 1 : 0) >= QUALIFICATION_THRESHOLD) {
          onComplete(true)
          onUnlockNext()
          if (fingerprint) {
            saveResult(fingerprint, score + (isCorrect ? 1 : 0))
          }
        } else {
          onComplete(false)
        }
      }
    }, 1500)
  }

  const saveResult = async (visitorId: string, finalScore: number) => {
    try {
      const response = await fetch('/api/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId, taskId: 'MidTask9', score: finalScore }),
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
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-4 bg-white rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-xl font-bold text-gray-800">Word-Number Match</h2>
      <p className="text-center text-gray-600 text-xs">Remember the word-number pairs and input the number sequence.</p>

      {gameStatus === 'displaying' && (
        <div className="grid grid-cols-1 gap-2 w-full">
          {wordNumberPairs.map(pair => (
            <motion.div
              key={pair.word}
              className="flex justify-between items-center p-2 bg-gray-100 rounded"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-sm">{pair.word}</span>
              <span className="font-bold text-sm">{pair.number}</span>
            </motion.div>
          ))}
        </div>
      )}

      {gameStatus === 'input' && (
        <div className="w-full">
          <p className="text-center mb-2 text-sm">Enter the numbers for this sequence:</p>
          <div className="flex flex-wrap justify-center gap-1 mb-2">
            {sequence.map((word, index) => (
              <motion.div
                key={index}
                className="bg-blue-100 p-1 rounded text-xs"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {word}
              </motion.div>
            ))}
          </div>
          <Input
            type="text"
            placeholder="Enter number sequence"
            value={userInput}
            onChange={handleInputChange}
            maxLength={PAIRS_PER_ROUND}
            className="text-center text-lg"
          />
        </div>
      )}

      <div className="text-sm font-bold text-center h-6">
        {gameStatus === 'displaying' && <span className="text-blue-500">Memorize the pairs!</span>}
        {gameStatus === 'input' && <span className="text-indigo-500">Enter the number sequence</span>}
        {gameStatus === 'success' && <span className="text-green-500">Correct!</span>}
        {gameStatus === 'failure' && <span className="text-red-500">Incorrect</span>}
        {gameStatus === 'completed' && (
          <span className={score >= QUALIFICATION_THRESHOLD ? "text-green-500" : "text-red-500"}>
            {score >= QUALIFICATION_THRESHOLD ? "Task Completed!" : "Try Again"}
          </span>
        )}
      </div>

      <Progress value={(score / TOTAL_ROUNDS) * 100} className="w-full h-2" />

      <div className="flex justify-between items-center text-xs w-full">
        <span className="text-gray-600">Round: {round}/{TOTAL_ROUNDS}</span>
        <span className="text-gray-600">Score: {score}/{TOTAL_ROUNDS}</span>
      </div>

      {gameStatus === 'completed' && score < QUALIFICATION_THRESHOLD && (
        <Button 
          onClick={handleTryAgain}
          className="mt-2 bg-blue-500 hover:bg-blue-600 text-white text-sm"
        >
          <RotateCcw className="mr-2 h-3 w-3" /> Try Again
        </Button>
      )}
    </div>
  )
}