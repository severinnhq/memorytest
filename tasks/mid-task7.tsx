'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from 'framer-motion'
import { Square, Circle, Triangle, CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface MidTask7Props {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

type Shape = 'square' | 'circle' | 'triangle'
type Color = 'red' | 'blue' | 'green' | 'yellow'
type SequenceItem = { shape: Shape; color: Color }

const SHAPES: Shape[] = ['square', 'circle', 'triangle']
const COLORS: Color[] = ['red', 'blue', 'green', 'yellow']
const TOTAL_ROUNDS = 5
const QUALIFICATION_THRESHOLD = 4
const INITIAL_SEQUENCE_LENGTH = 3
const MAX_SEQUENCE_LENGTH = 7
const DISPLAY_TIME = 1000

export default function MidTask7({ onComplete, onUnlockNext }: MidTask7Props) {
  const [sequence, setSequence] = useState<SequenceItem[]>([])
  const [userSequence, setUserSequence] = useState<SequenceItem[]>([])
  const [round, setRound] = useState(1)
  const [score, setScore] = useState(0)
  const [gameStatus, setGameStatus] = useState<'idle' | 'displaying' | 'input' | 'success' | 'failure' | 'completed'>('idle')
  const [currentIndex, setCurrentIndex] = useState(0)
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
    const newSequence: SequenceItem[] = Array.from({ length }, () => ({
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    }))
    setSequence(newSequence)
    setUserSequence([])
    setGameStatus('displaying')
    setCurrentIndex(0)
  }, [round])

  useEffect(() => {
    if (gameStatus === 'idle') {
      generateSequence()
    }
  }, [gameStatus, generateSequence])

  useEffect(() => {
    if (gameStatus === 'displaying') {
      if (currentIndex < sequence.length) {
        const timer = setTimeout(() => {
          setCurrentIndex(currentIndex + 1)
        }, DISPLAY_TIME)
        return () => clearTimeout(timer)
      } else {
        setGameStatus('input')
        setCurrentIndex(0)
      }
    }
  }, [gameStatus, currentIndex, sequence])

  const handleItemClick = (item: SequenceItem) => {
    if (gameStatus !== 'input') return
    const newUserSequence = [...userSequence, item]
    setUserSequence(newUserSequence)

    if (newUserSequence.length === sequence.length) {
      checkSequence(newUserSequence)
    }
  }

  const checkSequence = (userSeq: SequenceItem[]) => {
    const isCorrect = userSeq.every((item, index) => 
      item.shape === sequence[index].shape && item.color === sequence[index].color
    )

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
        const finalScore = score + (isCorrect ? 1 : 0)
        if (finalScore >= QUALIFICATION_THRESHOLD) {
          onComplete(true)
          onUnlockNext()
          if (fingerprint) {
            saveResult(fingerprint, finalScore)
          }
        } else {
          onComplete(false)
          setIsModalOpen(true)
        }
      }
    }, 1500)
  }

  const saveResult = async (visitorId: string, finalScore: number) => {
    try {
      const response = await fetch('/api/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId, taskId: 'MidTask7', score: finalScore }),
      })
      if (!response.ok) throw new Error('Failed to save result')
    } catch (error) {
      console.error('Error saving result:', error)
    }
  }

  const renderShape = (shape: Shape, color: Color, size: number) => {
    const shapeProps = { size, className: `text-${color}-500` }
    switch (shape) {
      case 'square': return <Square {...shapeProps} />
      case 'circle': return <Circle {...shapeProps} />
      case 'triangle': return <Triangle {...shapeProps} />
    }
  }

  const handleTryAgain = () => {
    setRound(1)
    setScore(0)
    setGameStatus('idle')
    setIsModalOpen(false)
  }

  return (
    <div className="flex flex-col items-center justify-center p-2 space-y-2 bg-white rounded-lg shadow-md max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold text-black-800 text-center">Sequence Sculptor</h2>
      <p className="text-center text-black-600 text-sm">Memorize and recreate the sequence.</p>
      
      <div className="h-16 flex items-center justify-center">
        {gameStatus === 'displaying' && currentIndex < sequence.length && (
          <motion.div
            key={currentIndex}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            {renderShape(sequence[currentIndex].shape, sequence[currentIndex].color, 48)}
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 p-2 bg-gray-100 rounded-lg">
        {SHAPES.map(shape => (
          COLORS.map(color => (
            <motion.button
              key={`${shape}-${color}`}
              className="w-14 h-14 rounded-md flex items-center justify-center bg-white shadow-sm"
              onClick={() => handleItemClick({ shape, color })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={gameStatus !== 'input'}
            >
              {renderShape(shape, color, 28)}
            </motion.button>
          ))
        ))}
      </div>

      <div className="flex justify-center h-8">
        {userSequence.map((item, index) => (
          <motion.div key={index} initial={{ scale: 0 }} animate={{ scale: 1 }} className="mx-1">
            {renderShape(item.shape, item.color, 24)}
          </motion.div>
        ))}
      </div>

      <div className="text-sm font-bold text-center h-4">
        {gameStatus === 'displaying' && <span className="text-blue-500">Memorize!</span>}
        {gameStatus === 'input' && <span className="text-indigo-500">Recreate</span>}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              Nice Try!
            </DialogTitle>
          </DialogHeader>
          <div className="mt-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
              <XCircle className="w-20 h-20 mx-auto text-red-500" />
            </motion.div>
            <p className="mt-4 text-md text-gray-700">
              Don't worry! Practice makes perfect. Keep trying to improve your memory.
            </p>
            <p className="mt-2 text-xl font-semibold text-gray-800">
              Your Score: {score}/{TOTAL_ROUNDS}
            </p>
          </div>
          <div className="mt-8 flex justify-center">
            <Button 
              onClick={handleTryAgain}
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-6 py-2 text-sm"
            >
              Try Again
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}