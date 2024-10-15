"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from 'framer-motion'
import { Square, Circle, Triangle, Star, Hexagon, Diamond, Octagon, Heart, Minus, Plus, X, ArrowRight, Delete, CheckCircle, XCircle } from 'lucide-react'
import TaskCompletionModal from '@/components/TaskCompletionModal'

interface AdvancedTask3Props {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

type Shape = 'square' | 'circle' | 'triangle' | 'star' | 'hexagon' | 'diamond' | 'octagon' | 'heart' | 'minus' | 'plus' | 'x' | 'arrow'
type Color = 'red' | 'blue' | 'yellow' | 'green'
type SequenceItem = { shape: Shape; color: Color }

const shapes: Record<Shape, React.ElementType> = {
  square: Square,
  circle: Circle,
  triangle: Triangle,
  star: Star,
  hexagon: Hexagon,
  diamond: Diamond,
  octagon: Octagon,
  heart: Heart,
  minus: Minus,
  plus: Plus,
  x: X,
  arrow: ArrowRight,
}

const colors: Color[] = ['red', 'blue', 'yellow', 'green']
const shapeTypes: Record<Color, Shape[]> = {
  red: ['square', 'circle', 'triangle'],
  blue: ['star', 'hexagon', 'diamond'],
  yellow: ['octagon', 'heart', 'minus'],
  green: ['plus', 'x', 'arrow'],
}

const colorGradients: Record<Color, string> = {
  red: 'bg-gradient-to-br from-red-400 to-red-600',
  blue: 'bg-gradient-to-br from-blue-400 to-blue-600',
  yellow: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
  green: 'bg-gradient-to-br from-green-400 to-green-600',
}

const TOTAL_ROUNDS = 5
const QUALIFICATION_THRESHOLD = 4
const MEMORIZE_TIME = 5 // 5 seconds to memorize
const SEQUENCE_LENGTH = 4 // 4-digit long sequence

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export default function AdvancedTask3({ onComplete, onUnlockNext }: AdvancedTask3Props) {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [sequence, setSequence] = useState<SequenceItem[]>([])
  const [userSequence, setUserSequence] = useState<SequenceItem[]>([])
  const [showSequence, setShowSequence] = useState(true)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [animateScore, setAnimateScore] = useState(false)
  const [timeLeft, setTimeLeft] = useState(MEMORIZE_TIME)

  const generateSequence = useCallback(() => {
    const newSequence: SequenceItem[] = Array.from({ length: SEQUENCE_LENGTH }, () => {
      const color = colors[Math.floor(Math.random() * colors.length)]
      const shape = shapeTypes[color][Math.floor(Math.random() * shapeTypes[color].length)]
      return { shape, color }
    })
    setSequence(newSequence)
    setUserSequence([])
    setShowSequence(true)
    setTimeLeft(MEMORIZE_TIME)
  }, [])

  useEffect(() => {
    generateSequence()
  }, [generateSequence])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (showSequence) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            setShowSequence(false)
            return MEMORIZE_TIME
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [showSequence])

  const handleItemClick = (item: SequenceItem) => {
    if (showSequence || userSequence.length >= SEQUENCE_LENGTH) return

    const newUserSequence = [...userSequence, item]
    setUserSequence(newUserSequence)

    if (newUserSequence.length === SEQUENCE_LENGTH) {
      const isCorrect = newUserSequence.every((item, index) => 
        item.shape === sequence[index].shape && item.color === sequence[index].color
      )

      setFeedback(isCorrect ? 'correct' : 'incorrect')
      
      if (isCorrect) {
        setAnimateScore(true)
      }

      setTimeout(() => {
        setFeedback(null)
        setAnimateScore(false)
        if (isCorrect) {
          setScore((prevScore) => prevScore + 1)
        }
        if (round < TOTAL_ROUNDS) {
          setRound((prevRound) => prevRound + 1)
          generateSequence()
        } else {
          setShowCompletionModal(true)
          onComplete(score + (isCorrect ? 1 : 0) >= QUALIFICATION_THRESHOLD)
          if (score + (isCorrect ? 1 : 0) >= QUALIFICATION_THRESHOLD) {
            onUnlockNext()
          }
        }
      }, 1500)
    }
  }

  const handleDelete = () => {
    setUserSequence((prev) => prev.slice(0, -1))
  }

  const ShapeComponent: React.FC<{ item: SequenceItem }> = ({ item }) => {
    const ShapeIcon = shapes[item.shape]
    return (
      <motion.div
        whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(0,0,0,0.2)' }}
        whileTap={{ scale: 0.95 }}
        className={`w-20 h-20 flex items-center justify-center rounded-2xl cursor-pointer ${colorGradients[item.color]} shadow-lg`}
        onClick={() => handleItemClick(item)}
      >
        <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
          <ShapeIcon className="w-12 h-12 text-white drop-shadow-md" />
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-gradient-to-br  rounded-xl shadow-md max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">Advanced Sequence Recall</h2>
      <p className="text-center text-gray-600 text-sm">
        Remember the sequence of 4 shapes and colors, then recreate it! Each color has unique shapes.
      </p>

      <div className="mb-4 flex justify-between items-center w-full">
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

      {showSequence && (
        <div className="text-center">
          <p className="text-lg font-semibold text-primary mb-2">Memorize the sequence!</p>
          <div className="flex items-center justify-center">
            <span role="img" aria-label="clock" className="text-3xl mr-2">⏰</span>
            <span className="text-2xl font-bold text-primary">{formatTime(timeLeft)}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-6">
        {showSequence ? (
          sequence.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <ShapeComponent item={item} />
            </motion.div>
          ))
        ) : (
          colors.map((color) => (
            <div key={color} className="flex flex-col space-y-4">
              {shapeTypes[color].map((shape) => (
                <ShapeComponent
                  key={`${shape}-${color}`}
                  item={{ shape, color }}
                />
              ))}
            </div>
          ))
        )}
      </div>

      {!showSequence && (
        <div className="mt-6 flex flex-col items-center space-y-4">
          <div className="flex flex-wrap justify-center gap-3 items-center">
            {userSequence.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`w-12 h-12 flex items-center justify-center rounded-lg ${colorGradients[item.color]} shadow-md`}
              >
                {React.createElement(shapes[item.shape], { className: "w-8 h-8 text-white drop-shadow-sm" })}
              </motion.div>
            ))}
            {Array.from({ length: SEQUENCE_LENGTH - userSequence.length }).map((_, index) => (
              <motion.div
                key={`empty-${index}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-300 shadow-inner"
              >
                <X className="w-8 h-8 text-gray-400" />
              </motion.div>
            ))}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              disabled={userSequence.length === 0}
              className="ml-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Delete className="w-5 h-5 text-gray-700" />
            </motion.button>
          </div>
        </div>
      )}

      <TaskCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        success={score >= QUALIFICATION_THRESHOLD}
        score={score}
        totalRounds={TOTAL_ROUNDS}
        qualificationThreshold={QUALIFICATION_THRESHOLD}
        onNextTask={onUnlockNext}
        onTryAgain={() => {
          setScore(0)
          setRound(1)
          setShowCompletionModal(false)
          generateSequence()
        }}
      />
    </div>
  )
}