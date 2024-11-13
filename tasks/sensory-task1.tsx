'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Brain } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface VisualPatternRecallTaskProps {
  onComplete: (success: boolean, score: number) => void;
}

const GRID_SIZE = 4;
const ROUNDS = 3;
const COLORS = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

export default function VisualPatternRecallTask({ onComplete }: VisualPatternRecallTaskProps) {
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [isDisplaying, setIsDisplaying] = useState(true);
  const [round, setRound] = useState(0);
  const [correctPatterns, setCorrectPatterns] = useState<boolean[]>([false, false, false]);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (round < ROUNDS) {
      generatePattern();
    } else {
      setGameOver(true);
    }
  }, [round]);

  const generatePattern = () => {
    const newPattern = Array.from({ length: GRID_SIZE * GRID_SIZE }, () =>
      Math.random() < 0.4 ? Math.floor(Math.random() * COLORS.length) : -1
    );
    setPattern(newPattern);
    setUserPattern(Array(GRID_SIZE * GRID_SIZE).fill(-1));
    setIsDisplaying(true);
  };

  const handleReady = () => {
    setIsDisplaying(false);
  };

  const handleCellClick = (index: number) => {
    if (isDisplaying) return;
    setUserPattern(prev => {
      const newPattern = [...prev];
      if (newPattern[index] === -1) {
        newPattern[index] = 0;
      } else if (newPattern[index] < COLORS.length - 1) {
        newPattern[index]++;
      } else {
        newPattern[index] = -1;
      }
      return newPattern;
    });
  };

  const handleSubmit = () => {
    const correct = pattern.every((cell, index) => cell === userPattern[index]);
    setCorrectPatterns(prev => {
      const newCorrectPatterns = [...prev];
      newCorrectPatterns[round] = correct;
      return newCorrectPatterns;
    });
    setRound(prev => prev + 1);
  };

  if (gameOver) {
    const score = correctPatterns.filter(Boolean).length;
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-4"
          >
            <Brain className="w-16 h-16 mx-auto text-primary" />
            <h2 className="text-2xl font-bold">Visual Pattern Recall Completed!</h2>
            <p className="text-3xl font-bold text-primary">
              Your Score: {score}/3
            </p>
            <p className="text-sm">
              You correctly recalled {score} patterns out of 3.
            </p>
            <Button onClick={() => onComplete(true, score)} className="w-full mt-4">Finish</Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Visual Pattern Recall</h2>
        <AnimatePresence mode="wait">
          <motion.div
            key={round}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {isDisplaying 
                  ? "Memorize the pattern, then click 'Ready' to start." 
                  : "Recreate the pattern by clicking on the cells. Click again to change colors or remove."}
              </AlertDescription>
            </Alert>
            <div className="text-sm font-medium text-center">
              Round: {round + 1} / {ROUNDS}
            </div>
            <Progress value={(round / ROUNDS) * 100} className="w-full" />
            <div className="grid grid-cols-4 gap-2">
              {(isDisplaying ? pattern : userPattern).map((cell, index) => (
                <motion.button
                  key={index}
                  className={`w-16 h-16 rounded-md ${
                    cell === -1 ? 'bg-gray-200' : COLORS[cell]
                  }`}
                  onClick={() => handleCellClick(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isDisplaying}
                  aria-label={`Cell ${index + 1}`}
                />
              ))}
            </div>
            {isDisplaying ? (
              <Button
                onClick={handleReady}
                className="w-full"
                variant="default"
              >
                Ready
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="w-full"
                variant="default"
              >
                Submit
              </Button>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}