"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Circle, Square, Triangle, Star, Heart, X } from 'lucide-react'
import TaskCompletionModal from '@/components/TaskCompletionModal'

interface VisualSequenceEncodingChallengeProps {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

const TOTAL_ROUNDS = 3
const QUALIFICATION_THRESHOLD = 3
const MEMORIZE_TIME = 10 // 10 seconds to memorize
const MIN_SEQUENCE_LENGTH = 4
const MAX_SEQUENCE_LENGTH = 5
const GRID_SIZE = 5

type Shape = 'circle' | 'square' | 'triangle' | 'star' | 'heart'
type Color = 'red' | 'blue' | 'green'

interface VisualElement {
  shape: Shape
  color: Color
  position: [number, number]
}

const shapes: Record<Shape, React.ElementType> = {
  circle: Circle,
  square: Square,
  triangle: Triangle,
  star: Star,
  heart: Heart,
}

const colors: Color[] = ['red', 'blue', 'green']

const colorClasses: Record<Color, string> = {
  red: 'text-red-500 hover:text-red-600 hover:bg-red-100',
  blue: 'text-blue-500 hover:text-blue-600 hover:bg-blue-100',
  green: 'text-green-500 hover:text-green-600 hover:bg-green-100',
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export default function VisualSequenceEncodingChallenge({ onComplete, onUnlockNext }: VisualSequenceEncodingChallengeProps) {
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [sequence, setSequence] = useState<VisualElement[]>([])
  const [userSequence, setUserSequence] = useState<VisualElement[]>([])
  const [showSequence, setShowSequence] = useState(true)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [animateScore, setAnimateScore] = useState(false)
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null)
  const [timeLeft, setTimeLeft] = useState(MEMORIZE_TIME)

  const generateSequence = useCallback(() => {
    const sequenceLength = Math.floor(Math.random() * (MAX_SEQUENCE_LENGTH - MIN_SEQUENCE_LENGTH + 1)) + MIN_SEQUENCE_LENGTH
    const newSequence: VisualElement[] = Array.from({ length: sequenceLength }, () => ({
      shape: Object.keys(shapes)[Math.floor(Math.random() * Object.keys(shapes).length)] as Shape,
      color: colors[Math.floor(Math.random() * colors.length)],
      position: [Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)]
    }))
    setSequence(newSequence)
    setUserSequence([])
    setShowSequence(true)
    setSelectedCell(null)
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

  const handleCellClick = (row: number, col: number) => {
    if (showSequence) return
    setSelectedCell([row, col])
  }

  const handleIconSelect = (shape: Shape, color: Color) => {
    if (showSequence || !selectedCell) return

    const newUserSequence = [
      ...userSequence.filter(el => el.position[0] !== selectedCell[0] || el.position[1] !== selectedCell[1]),
      { shape, color, position: selectedCell }
    ]
    setUserSequence(newUserSequence)
    setSelectedCell(null)
  }

  const handleRemoveIcon = (row: number, col: number) => {
    setUserSequence(userSequence.filter(el => el.position[0] !== row || el.position[1] !== col))
  }

  const handleSubmit = () => {
    const isCorrect = sequence.every((element, index) => {
      const userElement = userSequence.find(
        ue => ue.position[0] === element.position[0] && ue.position[1] === element.position[1]
      )
      return userElement && userElement.shape === element.shape && userElement.color === element.color
    }) && sequence.length === userSequence.length

    setFeedback(isCorrect ? 'correct' : 'incorrect')
    
    if (isCorrect) {
      setAnimateScore(true)
      setScore((prevScore) => prevScore + 1)
    }

    setTimeout(() => {
      setFeedback(null)
      setAnimateScore(false)
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

  const renderGrid = (elements: VisualElement[]) => (
    <div className="grid grid-cols-5 gap-1">
      {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
        const row = Math.floor(index / GRID_SIZE)
        const col = index % GRID_SIZE
        const element = elements.find(e => e.position[0] === row && e.position[1] === col)

        return (
          <motion.div
            key={index}
            className={`w-12 h-12 border ${selectedCell && selectedCell[0] === row && selectedCell[1] === col ? 'border-indigo-500' : 'border-gray-300'} rounded-md flex items-center justify-center cursor-pointer ${element ? 'bg-gray-100' : 'hover:bg-gray-50'} relative`}
            onClick={() => handleCellClick(row, col)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {element && (
              <>
                {React.createElement(shapes[element.shape], {
                  className: `w-8 h-8 ${colorClasses[element.color]}`,
                })}
                {!showSequence && (
                  <motion.button
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveIcon(row, col)
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                )}
              </>
            )}
          </motion.div>
        )
      })}
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6 bg-white rounded-xl shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">Visual Sequence Encoding</h2>
      <p className="text-center text-gray-600">
        Memorize {sequence.length} shapes, colors, and positions, then recreate the sequence!
      </p>

      <div className="flex justify-between items-center w-full">
        <div className="font-semibold text-indigo-600">Round {round}/{TOTAL_ROUNDS}</div>
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
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </motion.div>
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div 
            key={score}
            initial={{ scale: 1 }}
            animate={{ scale: animateScore ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5 }}
            className="font-semibold text-indigo-600"
          >
            Score: {score}/{TOTAL_ROUNDS}
          </motion.div>
        </div>
      </div>

      {showSequence && (
        <div className="text-center mb-2">
          <p className="font-semibold text-primary mb-1">Memorize the sequence!</p>
          <div className="flex items-center justify-center">
            <span role="img" aria-label="clock" className="text-xl mr-1">⏰</span>
            <span className="text-xl font-bold text-primary">{formatTime(timeLeft)}</span>
          </div>
        </div>
      )}

      {renderGrid(showSequence ? sequence : userSequence)}

      {!showSequence && (
        <div className="flex flex-col items-center space-y-4 w-full">
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 p-6 rounded-xl shadow-lg w-full max-w-sm">
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(shapes).map(([shape, ShapeIcon]) => (
                <div key={shape} className="flex flex-col items-center space-y-2">
                  {colors.map(color => (
                    <motion.button
                      key={`${shape}-${color}`}
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClasses[color]} bg-white shadow-md border-2 border-gray-200`}
                      whileHover={{ scale: 1.1, boxShadow: "0px 0px 12px rgba(79, 70, 229, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleIconSelect(shape as Shape, color)}
                    >
                      <ShapeIcon className="w-7 h-7" />
                    </motion.button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <Button 
            onClick={handleSubmit}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white  hover:from-indigo-700 hover:to-purple-700 transition-all duration-300  font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Submit Sequence
          </Button>
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