'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ShortTermTask2Props {
  onComplete: (success: boolean) => void;
}

const GRID_SIZE = 4;
const PATTERN_DURATION = 4000;
const TOTAL_ROUNDS = 3;

const ShortTermTask2: React.FC<ShortTermTask2Props> = ({ onComplete }) => {
  const [pattern, setPattern] = useState<boolean[]>([]);
  const [userPattern, setUserPattern] = useState<boolean[]>([]);
  const [showPattern, setShowPattern] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (round < TOTAL_ROUNDS) {
      generatePattern();
    } else if (round === TOTAL_ROUNDS && !gameOver) {
      setGameOver(true);
    }
  }, [round]);

  const generatePattern = () => {
    const newPattern = Array(GRID_SIZE * GRID_SIZE).fill(false).map(() => Math.random() < 0.4);
    setPattern(newPattern);
    setUserPattern(Array(GRID_SIZE * GRID_SIZE).fill(false));
    setShowPattern(true);
    setTimeout(() => {
      setShowPattern(false);
    }, PATTERN_DURATION);
  };

  const handleCellClick = (index: number) => {
    if (showPattern) return;
    const newUserPattern = [...userPattern];
    newUserPattern[index] = !newUserPattern[index];
    setUserPattern(newUserPattern);
  };

  const handleSubmit = () => {
    const correct = pattern.every((cell, index) => cell === userPattern[index]);
    if (correct) {
      setScore(score + 1);
    }
    if (round + 1 < TOTAL_ROUNDS) {
      setRound(round + 1);
    } else {
      setGameOver(true);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Visual Pattern Memory</h2>
      <AnimatePresence mode="wait">
        {!gameOver ? (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <p className="mb-4 text-center">Round {round + 1} of {TOTAL_ROUNDS}</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {pattern.map((cell, index) => (
                <motion.div
                  key={index}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-md cursor-pointer ${
                    showPattern
                      ? cell
                        ? 'bg-blue-500'
                        : 'bg-gray-200'
                      : userPattern[index]
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                  onClick={() => handleCellClick(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                />
              ))}
            </div>
            <Button onClick={handleSubmit} className="w-full" disabled={showPattern}>
              {showPattern ? 'Memorize the pattern' : 'Submit'}
            </Button>
          </motion.div>
        ) : (
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
            <p className="text-lg mb-4 text-gray-700">Your final score: {score} out of {TOTAL_ROUNDS}</p>
            <Button onClick={() => onComplete(score > 0)} className="w-full">Finish</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ShortTermTask2;