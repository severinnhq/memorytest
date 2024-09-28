'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'
import TwoTaskCompModal from '@/components/ui/2TaskCompModal'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

interface PatternRecognitionAndReconstructionProps {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

const gridSize = 4
const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500']
const defaultColor = 'bg-gray-200'
const levels = [
  { patternSize: 4, displayTime: 10000 },
  { patternSize: 5, displayTime: 10000 },
  { patternSize: 5, displayTime: 10000 },
]

const MEMORIZE_TIME = 10 // 10 seconds to memorize

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export default function PatternRecognitionAndReconstruction({ onComplete, onUnlockNext }: PatternRecognitionAndReconstructionProps) {
  const [pattern, setPattern] = useState<string[][]>([])
  const [userPattern, setUserPattern] = useState<string[][]>([])
  const [isDisplaying, setIsDisplaying] = useState(false)
  const [currentLevel, setCurrentLevel] = useState(0)
  const [gameState, setGameState] = useState<'displaying' | 'input' | 'complete'>('displaying')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [animateScore, setAnimateScore] = useState(false)
  const [score, setScore] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState(MEMORIZE_TIME)
  const [fingerprint, setFingerprint] = useState<string | null>(null)

  useEffect(() => {
    const initializeFingerprint = async () => {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      setFingerprint(result.visitorId)
    }

    initializeFingerprint()
  }, [])

  const generatePattern = (patternSize: number) => {
    const newPattern = Array.from({ length: gridSize }, () => Array(gridSize).fill(defaultColor))
    let coloredCells = 0
    while (coloredCells < patternSize) {
      const row = Math.floor(Math.random() * gridSize)
      const col = Math.floor(Math.random() * gridSize)
      if (newPattern[row][col] === defaultColor) {
        newPattern[row][col] = colors[Math.floor(Math.random() * colors.length)]
        coloredCells++
      }
    }
    return newPattern
  }

  const startGame = () => {
    const newPattern = generatePattern(levels[currentLevel].patternSize)
    setPattern(newPattern)
    setUserPattern(Array.from({ length: gridSize }, () => Array(gridSize).fill(defaultColor)))
    setGameState('displaying')
    setFeedback(null)
    setTimeLeft(MEMORIZE_TIME)
  }

  const displayPattern = async () => {
    setIsDisplaying(true)
    await new Promise(resolve => setTimeout(resolve, levels[currentLevel].displayTime))
    setIsDisplaying(false)
    setGameState('input')
  }

  useEffect(() => {
    startGame()
  }, [])

  useEffect(() => {
    if (gameState === 'displaying') {
      displayPattern()
    }
  }, [gameState, pattern])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameState === 'displaying') {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            setIsDisplaying(false)
            setGameState('input')
            return MEMORIZE_TIME
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [gameState])

  const handleCellClick = (row: number, col: number) => {
    if (gameState !== 'input') return

    setUserPattern(prevPattern => {
      const newPattern = [...prevPattern]
      newPattern[row] = [...newPattern[row]]
      
      if (newPattern[row][col] === defaultColor) {
        newPattern[row][col] = colors[0]
      } else {
        const currentColorIndex = colors.indexOf(newPattern[row][col])
        if (currentColorIndex === colors.length - 1) {
          newPattern[row][col] = defaultColor
        } else {
          newPattern[row][col] = colors[currentColorIndex + 1]
        }
      }
      
      return newPattern
    })
  }

  const checkPattern = () => {
    const isCorrect = pattern.every((row, i) =>
      row.every((cell, j) => cell === userPattern[i][j])
    )

    setFeedback(isCorrect ? "Correct!" : "Incorrect. Try the next pattern!")
    
    if (isCorrect) {
      setAnimateScore(true)
      setScore(prevScore => prevScore + 1)
    }

    setTimeout(() => {
      setFeedback(null)
      setAnimateScore(false)
      
      if (currentLevel === levels.length - 1) {
        setGameState('complete')
        const finalScore = score + (isCorrect ? 1 : 0)
        onComplete(finalScore === levels.length)
        if (finalScore === levels.length) {
          onUnlockNext()
        } else {
          setIsModalOpen(true)
        }
        setFeedback(`Game complete! Your final score: ${finalScore} out of ${levels.length}`)
        if (fingerprint) {
          saveResult(fingerprint, finalScore)
        }
      } else {
        setCurrentLevel(prev => prev + 1)
        startGame()
      }
    }, 1500)
  }

  const handleTryAgain = () => {
    setIsModalOpen(false)
    setCurrentLevel(0)
    setScore(0)
    startGame()
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
          taskId: 'PatternRecognitionAndReconstruction',
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
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-primary">Pattern Recognition and Reconstruction</h2>
      <p className="text-center mb-4">
        Memorize the pattern and recreate it accurately. 3 levels, increasing difficulty.
      </p>

      <div className="mb-4 flex justify-between items-center">
        <div className="text-lg font-semibold text-primary">Level: {currentLevel + 1}/{levels.length}</div>
        <div className="flex items-center">
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, x: feedback === "Correct!" ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: feedback === "Correct!" ? 20 : -20 }}
                transition={{ duration: 0.5 }}
                className="mr-2"
              >
                {feedback === "Correct!" ? (
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
            key={currentLevel}
            initial={{ scale: 1 }}
            animate={{ scale: animateScore ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5 }}
            className="text-lg font-semibold text-primary"
          >
            Score: {score}/{currentLevel}
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1 mb-6">
        {(isDisplaying ? pattern : userPattern).map((row, i) =>
          row.map((cell, j) => (
            <motion.div
              key={`${i}-${j}`}
              className={`aspect-square rounded-sm ${cell}`}
              onClick={() => handleCellClick(i, j)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          ))
        )}
      </div>

      {gameState === 'displaying' && (
        <div className="text-center">
          <p className="text-lg font-semibold text-primary mb-2">Memorize the pattern!</p>
          <div className="flex items-center justify-center">
            <span role="img" aria-label="clock" className="text-3xl mr-2">⏰</span>
            <span className="text-2xl font-bold text-primary">{formatTime(timeLeft)}</span>
          </div>
        </div>
      )}

      {gameState === 'input' && (
        <>
          <div className="text-center text-lg font-semibold mb-4">
            Recreate the pattern
          </div>
          <p className="text-center text-sm mb-4">
            Click to cycle through colors. Click again on the last color to unselect.
          </p>
          <Button onClick={checkPattern} className="w-full">
            Submit Pattern
          </Button>
        </>
      )}

      {gameState === 'complete' && (
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">Game Complete!</h3>
          <p>Your final score: {score}/{levels.length}</p>
        </div>
      )}

      <TwoTaskCompModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        success={false}
        onTryAgain={handleTryAgain}
      />
    </div>
  )
}