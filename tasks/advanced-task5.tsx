"use client"

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, Paintbrush } from 'lucide-react'
import TwoTaskCompModal from '@/components/ui/2TaskCompModal'

interface VisualSequenceEncodingChallengeProps {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

const GRID_SIZE = 3

type Color = 'transparent' | 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange'

interface CellData {
  number: number
  color: Color
}

const colors: Color[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange']

const colorClasses: Record<Color, string> = {
  transparent: 'bg-transparent',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
}

interface ColorPickerProps {
  onColorSelect: (color: Color) => void
  onClose: () => void
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onColorSelect, onClose }) => {
  return (
    <div className="absolute top-full left-0 mt-2 bg-gray-100 rounded-lg shadow-lg p-3 z-10 w-36">
      <div className="grid grid-cols-3 gap-2">
        {colors.map((color) => (
          <button
            key={color}
            className={`w-6 h-6 rounded-md ${colorClasses[color]} border border-gray-300 hover:border-gray-500 transition-colors duration-200`}
            onClick={() => {
              onColorSelect(color)
              onClose()
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function VisualSequenceEncodingChallenge({ onComplete, onUnlockNext }: VisualSequenceEncodingChallengeProps) {
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [pattern, setPattern] = useState<CellData[][]>([])
  const [userPattern, setUserPattern] = useState<CellData[][]>([])
  const [showPattern, setShowPattern] = useState(true)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [animateScore, setAnimateScore] = useState(false)
  const [activeColorPicker, setActiveColorPicker] = useState<{ row: number; col: number } | null>(null)
  const [success, setSuccess] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  const generatePattern = useCallback(() => {
    const newPattern: CellData[][] = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        number: Math.floor(Math.random() * 10),
        color: colors[Math.floor(Math.random() * colors.length)]
      }))
    )
    setPattern(newPattern)
    setUserPattern(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill({ number: -1, color: 'transparent' })))
  }, [])

  useEffect(() => {
    generatePattern()
  }, [generatePattern])

  const handleStart = () => {
    setShowPattern(false)
  }

  const handleInputChange = (row: number, col: number, value: string) => {
    if (showPattern) return
    const newUserPattern = [...userPattern]
    newUserPattern[row][col] = { 
      ...newUserPattern[row][col],
      number: value === '' ? -1 : parseInt(value, 10)
    }
    setUserPattern(newUserPattern)
  }

  const handleColorChange = (row: number, col: number, color: Color) => {
    if (showPattern) return
    const newUserPattern = [...userPattern]
    newUserPattern[row][col] = { 
      ...newUserPattern[row][col],
      color: color
    }
    setUserPattern(newUserPattern)
  }

  const handleSubmit = () => {
    const isCorrect = pattern.every((row, rowIndex) =>
      row.every((cell, colIndex) =>
        cell.number === userPattern[rowIndex][colIndex].number && cell.color === userPattern[rowIndex][colIndex].color
      )
    )

    setFeedback(isCorrect ? 'correct' : 'incorrect')
    setSuccess(isCorrect)
    
    if (isCorrect) {
      setAnimateScore(true)
    }

    setTimeout(() => {
      setFeedback(null)
      setAnimateScore(false)
      setShowCompletionModal(true)
      onComplete(isCorrect)
      if (isCorrect) {
        onUnlockNext()
      }
    }, 1500)
  }

  const handleTryAgain = () => {
    setShowCompletionModal(false)
    generatePattern()
    setShowPattern(true)
  }

  const renderGrid = (cells: CellData[][]) => (
    <div ref={gridRef} className="grid grid-cols-3 gap-2">
      {cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} className="relative">
            <motion.div
              className={`w-20 h-20 ${colorClasses[cell.color]} border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer ${showPattern || cell.color !== 'transparent' ? 'text-white' : 'text-gray-800'} font-bold text-3xl relative`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPattern ? (
                cell.number
              ) : (
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={cell.number === -1 ? '' : cell.number}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (value.length === 1 && /^[0-9]$/.test(value))) {
                      handleInputChange(rowIndex, colIndex, value);
                    }
                  }}
                  className={`w-full h-full bg-transparent text-center ${cell.color === 'transparent' ? 'text-gray-800' : 'text-white'} text-3xl font-bold focus:outline-none`}
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield',
                  }}
                />
              )}
              {!showPattern && (
                <button
                  className="absolute top-1 right-1 p-1 bg-gray-200 rounded-md shadow-md hover:bg-gray-300 transition-colors duration-200"
                  onClick={() => setActiveColorPicker({ row: rowIndex, col: colIndex })}
                >
                  <Paintbrush className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </motion.div>
            {activeColorPicker?.row === rowIndex && activeColorPicker?.col === colIndex && (
              <ColorPicker
                onColorSelect={(color) => handleColorChange(rowIndex, colIndex, color)}
                onClose={() => setActiveColorPicker(null)}
              />
            )}
          </div>
        ))
      )}
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6  rounded-xl shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-gray-800">Number Maze</h2>
      <p className="text-center text-gray-600 text-sm">
        Memorize the pattern of numbers and colors, then recreate it!
      </p>

      <div className="flex justify-between items-center w-full text-sm">
        <div className="font-semibold text-indigo-600">Challenge</div>
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
        </div>
      </div>

      {showPattern ? (
        <>
          {renderGrid(pattern)}
          <Button 
            onClick={handleStart}
            className="px-6 py-3 bg-indigo-600 text-white   hover:bg-indigo-700 transition-colors duration-200"
          >
            I memorized, let's start!
          </Button>
        </>
      ) : (
        <>
          {renderGrid(userPattern)}
          <Button 
            onClick={handleSubmit}
            className="px-6 py-3 bg-indigo-600 text-white   hover:bg-indigo-700 transition-colors duration-200"
          >
            Submit
          </Button>
        </>
      )}

      <TwoTaskCompModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        success={success}
        onTryAgain={handleTryAgain}
      />
    </div>
  )
}