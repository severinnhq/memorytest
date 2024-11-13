'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Brain, Eye } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface VisualPatternTaskProps {
  onComplete: (success: boolean, score: number) => void;
}

const GRID_SIZE = 5;
const PATTERN_CELLS = 7;
const ROUNDS = 3;
const FLASH_DURATION = 250; // milliseconds
const MAX_FLASHES_PER_ROUND = 2;

export default function VisualPatternTask({ onComplete }: VisualPatternTaskProps) {
  const [pattern, setPattern] = useState<boolean[]>([]);
  const [userPattern, setUserPattern] = useState<boolean[]>([]);
  const [isFlashing, setIsFlashing] = useState(false);
  const [round, setRound] = useState(0);
  const [correctCompletions, setCorrectCompletions] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [flashesUsed, setFlashesUsed] = useState(0);

  useEffect(() => {
    if (round < ROUNDS) {
      generatePattern();
      setFlashesUsed(0);
    } else {
      setGameOver(true);
    }
  }, [round]);

  const generatePattern = () => {
    const newPattern = Array(GRID_SIZE * GRID_SIZE).fill(false);
    for (let i = 0; i < PATTERN_CELLS; i++) {
      let index;
      do {
        index = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
      } while (newPattern[index]);
      newPattern[index] = true;
    }
    setPattern(newPattern);
    setUserPattern(Array(GRID_SIZE * GRID_SIZE).fill(false));
  };

  const handleFlash = () => {
    if (flashesUsed < MAX_FLASHES_PER_ROUND) {
      setIsFlashing(true);
      setFlashesUsed(prev => prev + 1);
      setTimeout(() => {
        setIsFlashing(false);
      }, FLASH_DURATION);
    }
  };

  const handleCellClick = (index: number) => {
    if (isFlashing) return;
    setUserPattern(prev => {
      const newPattern = [...prev];
      newPattern[index] = !newPattern[index];
      return newPattern;
    });
  };

  const handleSubmit = () => {
    const isCorrect = pattern.every((cell, index) => cell === userPattern[index]);
    if (isCorrect) {
      setCorrectCompletions(prev => prev + 1);
    }
    setRound(prev => prev + 1);
  };

  if (gameOver) {
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
            <h2 className="text-2xl font-bold">Visual Pattern Task Completed!</h2>
            <p className="text-3xl font-bold text-primary">
              Your Score: {correctCompletions}/3
            </p>
            <p className="text-sm">
              You correctly completed {correctCompletions} out of 3 rounds.
            </p>
            <Button onClick={() => onComplete(true, correctCompletions)} className="w-full mt-4">Finish</Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Visual Pattern Task</h2>
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
                Click 'Flash Pattern' to briefly display the pattern, then recreate what you saw. You have {MAX_FLASHES_PER_ROUND - flashesUsed} flashes left this round.
              </AlertDescription>
            </Alert>
            <div className="text-sm font-medium text-center">
              Round: {round + 1} / {ROUNDS}
            </div>
            <Progress value={(round / ROUNDS) * 100} className="w-full" />
            <div className="grid grid-cols-5 gap-1 aspect-square">
              {(isFlashing ? pattern : userPattern).map((cell, index) => (
                <motion.button
                  key={index}
                  className={`w-full aspect-square rounded ${
                    cell ? 'bg-primary' : 'bg-secondary'
                  }`}
                  onClick={() => handleCellClick(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isFlashing}
                  aria-label={`Cell ${index + 1}`}
                  role="checkbox"
                  aria-checked={cell}
                />
              ))}
            </div>
            <div className="flex justify-between">
              <Button
                onClick={handleFlash}
                className="flex-1 mr-2"
                variant="outline"
                disabled={isFlashing || flashesUsed >= MAX_FLASHES_PER_ROUND}
              >
                <Eye className="w-4 h-4 mr-2" />
                Flash Pattern ({MAX_FLASHES_PER_ROUND - flashesUsed} left)
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 ml-2"
                variant="default"
                disabled={isFlashing}
              >
                Submit
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}