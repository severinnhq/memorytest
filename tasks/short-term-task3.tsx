'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface ShortTermTask3Props {
  onComplete: (success: boolean) => void;
}

const WORD_LIST_LENGTH = 5;
const DISPLAY_DURATION = 5000;
const TOTAL_ROUNDS = 3;

const allWords = [
  'apple', 'book', 'cat', 'dog', 'elephant', 'frog', 'guitar', 'house', 'ice', 'jacket',
  'kite', 'lemon', 'moon', 'nest', 'orange', 'pencil', 'queen', 'robot', 'sun', 'tree',
  'umbrella', 'violin', 'water', 'xylophone', 'yacht', 'zebra', 'balloon', 'candle',
  'dolphin', 'eagle', 'flower', 'giraffe', 'hammer', 'island', 'jungle', 'koala',
  'lighthouse', 'mountain', 'notebook', 'octopus', 'penguin', 'quilt', 'rainbow', 'star',
  'turtle', 'unicorn', 'volcano', 'waterfall', 'x-ray', 'yoyo', 'zeppelin'
];

const ShortTermTask3: React.FC<ShortTermTask3Props> = ({ onComplete }) => {
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string[]>(Array(WORD_LIST_LENGTH).fill(''));
  const [showWords, setShowWords] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (round < TOTAL_ROUNDS) {
      startNewRound();
    } else if (round === TOTAL_ROUNDS && !gameOver) {
      setGameOver(true);
    }
  }, [round]);

  const startNewRound = () => {
    const newWords = getRandomWords(WORD_LIST_LENGTH);
    setCurrentWords(newWords);
    setUserInput(Array(WORD_LIST_LENGTH).fill(''));
    setShowWords(true);
    setTimeout(() => {
      setShowWords(false);
    }, DISPLAY_DURATION);
  };

  const getRandomWords = (count: number) => {
    const shuffled = [...allWords].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const handleInputChange = (index: number, value: string) => {
    const newUserInput = [...userInput];
    newUserInput[index] = value.toLowerCase();
    setUserInput(newUserInput);
  };

  const handleSubmit = () => {
    const correct = userInput.every((word, index) => word === currentWords[index]);
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
      <h2 className="text-2xl font-bold mb-4 text-center">Word List Memory</h2>
      <AnimatePresence mode="wait">
        {!gameOver ? (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <p className="mb-4 text-center">Round {round + 1} of {TOTAL_ROUNDS}</p>
            {showWords ? (
              <div className="mb-4">
                <p className="text-center mb-2">Memorize these words:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {currentWords.map((word, index) => (
                    <motion.span
                      key={index}
                      className="text-lg font-semibold"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mb-4 space-y-2">
                <p className="text-center mb-2">Enter the words in order:</p>
                {userInput.map((word, index) => (
                  <Input
                    key={index}
                    type="text"
                    value={word}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    placeholder={`Word ${index + 1}`}
                  />
                ))}
              </div>
            )}
            <Button onClick={handleSubmit} className="w-full" disabled={showWords}>
              {showWords ? 'Memorizing...' : 'Submit'}
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
            <p className="text-xl font-bold mb-4">
              Task Completed!
            </p>
            <p className="text-lg mb-4">Your final score: {score} out of {TOTAL_ROUNDS}</p>
            <Button onClick={() => onComplete(true)} className="w-full">Finish</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ShortTermTask3;