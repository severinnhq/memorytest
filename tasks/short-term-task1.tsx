  'use client'

  import React, { useState, useEffect } from 'react'
  import { Button } from "@/components/ui/button"
  import { Input } from "@/components/ui/input"
  import { motion, AnimatePresence } from 'framer-motion'

  interface ShortTermTask1Props {
    onComplete: (success: boolean) => void;
  }

  export default function ShortTermTask1({ onComplete }: ShortTermTask1Props) {
    const [round, setRound] = useState(1)
    const [sequence, setSequence] = useState<number[]>([])
    const [userInput, setUserInput] = useState<string>('')
    const [stage, setStage] = useState<'memorize' | 'recall' | 'result'>('memorize')
    const [timeLeft, setTimeLeft] = useState(5)
    const [score, setScore] = useState(0)

    useEffect(() => {
      if (stage === 'memorize') {
        setSequence(generateSequence())
        setTimeLeft(5)
        const timer = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              clearInterval(timer)
              setStage('recall')
              return 0
            }
            return prevTime - 1
          })
        }, 1000)
        return () => clearInterval(timer)
      }
    }, [stage, round])

    const generateSequence = () => {
      return Array.from({ length: 5 }, () => Math.floor(Math.random() * 10))
    }

    const handleSubmit = () => {
      const userSequence = userInput.split('').map(Number)
      const isCorrect = userSequence.every((num, index) => num === sequence[index])
      
      if (isCorrect) {
        setScore(score + 1)
      }

      if (round < 3) {
        setRound(round + 1)
        setStage('memorize')
        setUserInput('')
      } else {
        setStage('result')
      }
    }

    const handleFinish = () => {
      onComplete(score > 0)
    }

    return (
      <div className="flex flex-col items-center justify-center p-4 space-y-4 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4 text-black-800">Digit Span Task</h2>
        {stage !== 'result' && (
          <div className="text-lg font-semibold text-black-600 mb-4">
            Round {round} of 3
          </div>
        )}
        <AnimatePresence mode="wait">
          {stage === 'memorize' && (
            <motion.div
              key={`memorize-${round}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <p className="mb-4 text-gray-700">Memorize the following sequence:</p>
              <div className="text-4xl font-bold mb-4 text-indigo-600">
                {sequence.join(' ')}
              </div>
              <p className="text-gray-600">Time left: {timeLeft} seconds</p>
            </motion.div>
          )}
          {stage === 'recall' && (
            <motion.div
              key={`recall-${round}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center w-full"
            >
              <p className="mb-4 text-gray-700">Enter the sequence you memorized:</p>
              <Input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="mb-4"
                maxLength={5}
              />
              <Button onClick={handleSubmit} className="w-full">Submit</Button>
            </motion.div>
          )}
          {stage === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <p className="text-xl font-bold mb-4 text-indigo-800">
                Task Completed!
              </p>
              <p className="text-lg mb-4 text-gray-700">Your final score: {score} out of 3</p>
              <Button onClick={handleFinish} className="w-full">Finish</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }