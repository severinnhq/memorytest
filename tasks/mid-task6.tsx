"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import TwoTaskCompModal from '@/components/ui/2TaskCompModal'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

interface TemporalMosaicReconstructionProps {
  onComplete: (success: boolean) => void
  onUnlockNext: () => void
}

const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-orange-500']
const GRID_SIZE = 3
const DISPLAY_TIME = 1000 // 1 second per square
const PAUSE_TIME = 500 // 0.5 second pause between squares

type MosaicTile = {
  color: string
  order: number
}

export default function TemporalMosaicReconstruction({ onComplete, onUnlockNext }: TemporalMosaicReconstructionProps) {
  const [mosaic, setMosaic] = useState<MosaicTile[][]>([])
  const [userMosaic, setUserMosaic] = useState<MosaicTile[][]>([])
  const [gameStatus, setGameStatus] = useState<'showing' | 'input' | 'feedback'>('showing')
  const [showCompletionModal, setShowCompletionModal] = useState(false)
  const [fingerprint, setFingerprint] = useState<string | null>(null)
  const [currentDisplayIndex, setCurrentDisplayIndex] = useState(-1)
  const [nextOrderNumber, setNextOrderNumber] = useState(1)

  useEffect(() => {
    const initializeFingerprint = async () => {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      setFingerprint(result.visitorId)
    }

    initializeFingerprint()
  }, [])

  const generateMosaic = useCallback((): MosaicTile[][] => {
    const totalTiles = GRID_SIZE * GRID_SIZE
    const tiles = Array.from({ length: totalTiles }, (_, index) => ({
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      order: index
    }))
    const shuffled = tiles.sort(() => Math.random() - 0.5)
    return Array.from({ length: GRID_SIZE }, (_, i) => shuffled.slice(i * GRID_SIZE, (i + 1) * GRID_SIZE))
  }, [])

  const startGame = useCallback(() => {
    const newMosaic = generateMosaic()
    setMosaic(newMosaic)
    setUserMosaic(newMosaic.map(row => row.map(tile => ({ ...tile, order: -1 }))))
    setGameStatus('showing')
    setCurrentDisplayIndex(-1)
    setNextOrderNumber(1)
  }, [generateMosaic])

  useEffect(() => {
    startGame()
  }, [startGame])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (gameStatus === 'showing') {
      if (currentDisplayIndex < mosaic.flat().length - 1) {
        timer = setTimeout(() => {
          setCurrentDisplayIndex(prevIndex => prevIndex + 1)
        }, DISPLAY_TIME + PAUSE_TIME)
      } else if (currentDisplayIndex === mosaic.flat().length - 1) {
        timer = setTimeout(() => {
          setGameStatus('input')
          setCurrentDisplayIndex(-1)
        }, DISPLAY_TIME + PAUSE_TIME)
      }
    }
    return () => clearTimeout(timer)
  }, [gameStatus, currentDisplayIndex, mosaic])

  const handleTileClick = (rowIndex: number, colIndex: number) => {
    if (gameStatus !== 'input') return

    setUserMosaic(prevMosaic => {
      const newMosaic = [...prevMosaic]
      if (newMosaic[rowIndex][colIndex].order === -1) {
        newMosaic[rowIndex][colIndex] = { ...newMosaic[rowIndex][colIndex], order: nextOrderNumber - 1 }
        setNextOrderNumber(prev => prev + 1)
      }
      return newMosaic
    })
  }

  const handleSubmit = () => {
    const flatMosaic = mosaic.flat().sort((a, b) => a.order - b.order)
    const flatUserMosaic = userMosaic.flat().filter(tile => tile.order !== -1).sort((a, b) => a.order - b.order)
    
    const correct = flatMosaic.length === flatUserMosaic.length &&
      flatMosaic.every((tile, index) => tile.color === flatUserMosaic[index].color)

    if (correct) {
      endGame(true)
    } else {
      endGame(false)
    }
  }

  const endGame = (success: boolean) => {
    if (success) {
      onComplete(true)
      onUnlockNext()
    } else {
      setShowCompletionModal(true)
      onComplete(false)
    }
    if (fingerprint) {
      saveResult(fingerprint, success ? 1 : 0)
    }
  }

  const handleTryAgain = () => {
    setShowCompletionModal(false)
    startGame()
  }

  const handleReset = () => {
    setUserMosaic(mosaic.map(row => row.map(tile => ({ ...tile, order: -1 }))))
    setNextOrderNumber(1)
  }

  const saveResult = async (visitorId: string, score: number) => {
    try {
      const response = await fetch('/api/save-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          visitorId,
          taskId: 'TemporalMosaicReconstruction',
          score,
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
    <div className="bg-background rounded-xl shadow-lg p-6 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-4 text-primary text-center">Temporal Mosaic Reconstruction</h2>
      
      <div className="mb-4">
        <p className="text-sm font-semibold text-primary mb-2 text-center">
          {gameStatus === 'showing' ? 'Memorize the order of colors!' : 
           gameStatus === 'input' ? 'Reconstruct the mosaic!' : 'Feedback'}
        </p>
        <Progress value={(nextOrderNumber - 1) / (GRID_SIZE * GRID_SIZE) * 100} className="mb-4" />
        <div className="grid gap-2 mb-4" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}>
          {mosaic.map((row, rowIndex) =>
            row.map((tile, colIndex) => (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                className={`w-full aspect-square rounded-md ${tile.color} ${gameStatus === 'input' && userMosaic[rowIndex][colIndex].order === -1 ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                animate={gameStatus === 'showing' && currentDisplayIndex === tile.order ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
                onClick={() => handleTileClick(rowIndex, colIndex)}
                disabled={gameStatus !== 'input' || userMosaic[rowIndex][colIndex].order !== -1}
              >
                {gameStatus === 'input' && userMosaic[rowIndex][colIndex].order !== -1 && (
                  <span className="text-white font-bold">{userMosaic[rowIndex][colIndex].order + 1}</span>
                )}
              </motion.button>
            ))
          )}
        </div>
        <div className="flex justify-between mb-4">
          {gameStatus === 'input' && (
            <>
              <Button onClick={handleSubmit} className="w-1/2 mr-2">Submit</Button>
              <Button onClick={handleReset} className="w-1/2 ml-2" variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </>
          )}
        </div>
      </div>

      <AnimatePresence>
        {gameStatus === 'feedback' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center items-center mt-2"
          >
            <CheckCircle className="w-6 h-6 text-green-500" />
          </motion.div>
        )}
      </AnimatePresence>

      <TwoTaskCompModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        success={false}
        onTryAgain={handleTryAgain}
      />
    </div>
  )
}