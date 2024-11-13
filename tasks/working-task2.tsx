'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AdvancedWorkingTaskProps {
  onComplete: (success: boolean) => void;
}

const GRID_SIZE = 6;
const TOTAL_ROUNDS = 5;
const PATTERN_DISPLAY_TIME = 5000; // 5 seconds
const CELLS_TO_HIGHLIGHT = [4, 5, 6, 7, 8]; // Increasing difficulty per round
const DISTRACTION_INTERVAL = 500; // 0.5 seconds

const AdvancedWorkingTask: React.FC<AdvancedWorkingTaskProps> = ({ onComplete }) => {
  const [round, setRound] = useState(0);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [showPattern, setShowPattern] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [distractionCell, setDistractionCell] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/click.mp3');
    audioRef.current.load();
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (round < TOTAL_ROUNDS) {
      startNewRound();
    } else {
      setGameOver(true);
      setShowResult(true);
    }
  }, [round]);

  const startNewRound = () => {
    const newPattern = generatePattern(CELLS_TO_HIGHLIGHT[round]);
    setPattern(newPattern);
    setUserPattern([]);
    setShowPattern(true);
    
    // Start distraction animation
    const distractionInterval = setInterval(() => {
      setDistractionCell(Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE)));
    }, DISTRACTION_INTERVAL);

    setTimeout(() => {
      setShowPattern(false);
      clearInterval(distractionInterval);
      setDistractionCell(null);
    }, PATTERN_DISPLAY_TIME);
  };

  const generatePattern = (cellCount: number) => {
    const newPattern: number[] = [];
    while (newPattern.length < cellCount) {
      const cell = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
      if (!newPattern.includes(cell)) {
        newPattern.push(cell);
      }
    }
    return newPattern;
  };

  const handleCellClick = (index: number) => {
    if (showPattern) return;
    setUserPattern(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(error => console.error('Audio playback failed', error));
        }
        return [...prev, index];
      }
    });
  };

  const handleSubmit = () => {
    const correctCells = pattern.filter(cell => userPattern.includes(cell));
    const incorrectCells = userPattern.filter(cell => !pattern.includes(cell));
    const roundScore = correctCells.length === pattern.length && incorrectCells.length === 0 ? 1 : 0;
    
    setScores(prev => [...prev, roundScore]);

    if (round + 1 < TOTAL_ROUNDS) {
      setRound(round + 1);
    } else {
      setGameOver(true);
      setShowResult(true);
    }
  };

  const totalScore = scores.reduce((sum, score) => sum + score, 0);

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Advanced Spatial Memory Challenge</h2>
      <AnimatePresence mode="wait">
        {!gameOver ? (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Instructions</AlertTitle>
                <AlertDescription>
                  Memorize the highlighted cells in the grid while ignoring distractions. After they disappear, recreate the pattern exactly. Take your time to ensure accuracy.
                </AlertDescription>
              </Alert>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500">Round: {round + 1} / {TOTAL_ROUNDS}</p>
                <Progress value={((round + 1) / TOTAL_ROUNDS) * 100} className="mt-2" />
              </div>
              <div className="grid grid-cols-6 gap-1 mb-4">
                {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-10 h-10 border border-gray-300 rounded-md cursor-pointer ${
                      showPattern && pattern.includes(index) ? 'bg-blue-500' :
                      !showPattern && userPattern.includes(index) ? 'bg-green-500' :
                      distractionCell === index ? 'bg-red-300' : ''
                    }`}
                    onClick={() => handleCellClick(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                ))}
              </div>
              <Button onClick={handleSubmit} className="w-full" disabled={showPattern}>
                {showPattern ? 'Memorizing...' : 'Submit Pattern'}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-4"
          >
            <p className="text-xl font-bold mb-4">Challenge Completed!</p>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <p className="text-2xl font-bold text-primary">Your score: {totalScore} / 5</p>
                <p className="text-lg mt-2">
                  You correctly recreated {totalScore} out of 5 patterns.
                </p>
                <Button onClick={() => onComplete(true)} className="w-full mt-4">Finish</Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default AdvancedWorkingTask;