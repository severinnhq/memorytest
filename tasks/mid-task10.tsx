'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from 'framer-motion'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

interface MidTask10Props {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

const MEMORIZE_TIME = 10 // 10 seconds to memorize

export default function MidTask10({ onComplete, onUnlockNext }: MidTask10Props) {
  const [scene, setScene] = useState<string[][]>([])
  const [changedCell, setChangedCell] = useState<[number, number] | null>(null)
  const [userGuess, setUserGuess] = useState<[number, number] | null>(null)
  const [level, setLevel] = useState(1)
  const [gameStatus, setGameStatus] = useState<'idle' | 'showing' | 'hiding' | 'changed' | 'input' | 'success' | 'failure'>('idle')
  const [progress, setProgress] = useState(0)
  const [fingerprint, setFingerprint] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(MEMORIZE_TIME)

  useEffect(() => {
    const initializeFingerprint = async () => {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      setFingerprint(result.visitorId)
    }

    initializeFingerprint()
  }, [])

  const generateScene = useCallback(() => {
    const size = Math.min(3 + Math.floor(level / 2), 8)
    const newScene = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => ['🟥', '🟦', '🟩', '🟨'][Math.floor(Math.random() * 4)])
    )
    setScene(newScene)
    setGameStatus('showing')
    setTimeLeft(MEMORIZE_TIME)
  }, [level])

  useEffect(() => {
    if (gameStatus === 'idle') {
      generateScene()
    }
  }, [gameStatus, generateScene])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (gameStatus === 'showing') {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer)
            setGameStatus('hiding')
            return MEMORIZE_TIME
          }
          return prevTime - 1
        })
      }, 1000)
    } else if (gameStatus === 'hiding') {
      timer = setTimeout(() => {
        const row = Math.floor(Math.random() * scene.length)
        const col = Math.floor(Math.random() * scene[0].length)
        const newColor = ['🟥', '🟦', '🟩', '🟨'].find(color => color !== scene[row][col])
        const newScene = scene.map(r => [...r])
        newScene[row][col] = newColor!
        setScene(newScene)
        setChangedCell([row, col])
        setGameStatus('changed')
      }, 2000)
    } else if (gameStatus === 'changed') {
      timer = setTimeout(() => {
        setGameStatus('input')
      }, 1000)
    }

    return () => {
      clearInterval(timer)
      clearTimeout(timer)
    }
  }, [gameStatus, scene])

  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== 'input') return
    setUserGuess([row, col])
    if (changedCell && changedCell[0] === row && changedCell[1] === col) {
      setGameStatus('success')
      setProgress((prevProgress) => Math.min(prevProgress + 20, 100))
      if (progress + 20 >= 100) {
        onComplete(true)
        onUnlockNext()
        if (fingerprint) {
          saveResult(fingerprint, level)
        }
      } else {
        setTimeout(() => {
          setLevel(level + 1)
          setGameStatus('idle')
        }, 1500)
      }
    } else {
      setGameStatus('failure')
      setTimeout(() => {
        setGameStatus('idle')
      }, 1500)
    }
  }

  const saveResult = async (visitorId: string, finalLevel: number) => {
    try {
      const response = await fetch('/api/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitorId,
          taskId: 'MidTask10',
          score: finalLevel,
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
    <div className="flex flex-col items-center justify-center p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Visual Change Detection</h2>
      <p className="mb-4">Identify the cell that changed color</p>
      {gameStatus === 'showing' && (
        <div className="flex items-center justify-center space-x-2 text-2xl font-bold">
          <span role="img" aria-label="clock" className="text-3xl">⏰</span>
          <span>{`${Math.floor(timeLeft / 60).toString().padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`}</span>
        </div>
      )}
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${scene.length}, minmax(0, 1fr))` }}>
        {scene.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <motion.button
              key={`${rowIndex}-${colIndex}`}
              className={`w-12 h-12 rounded ${gameStatus === 'hiding' ? 'bg-gray-400' : ''}`}
              style={gameStatus !== 'hiding' ? { backgroundColor: cell === '🟥' ? 'red' : cell === '🟦' ? 'blue' : cell === '🟩' ? 'green' : 'yellow' } : {}}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              disabled={gameStatus !== 'input'}
            />
          ))
        )}
      </div>
      <div className="text-xl font-bold mb-2">
        {gameStatus === 'showing' && "Memorize the pattern"}
        {gameStatus === 'hiding' && "Pattern hidden"}
        {gameStatus === 'changed' && "Spot the change!"}
        {gameStatus === 'input' && "Click on the changed cell"}
        {gameStatus === 'success' && "Correct! Well done!"}
        {gameStatus === 'failure' && "Incorrect. Try again!"}
      </div>
      <Progress value={progress} className="w-full" />
      <p>Level: {level}</p>
    </div>
  )
}