'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Brain, Trash2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ProceduralMemoryTaskProps {
  onComplete: (success: boolean, score: number) => void;
}

const ROUNDS = [
  { sequenceLength: 5 },
  { sequenceLength: 6 },
  { sequenceLength: 7 },
];

const COLORS = ['red', 'blue', 'green', 'yellow'];

export default function ProceduralMemoryTask({ onComplete }: ProceduralMemoryTaskProps) {
  const [phase, setPhase] = useState<'display' | 'input'>('display');
  const [round, setRound] = useState(0);
  const [sequence, setSequence] = useState<string[]>([]);
  const [userSequence, setUserSequence] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctSequences, setCorrectSequences] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (round < ROUNDS.length) {
      const newSequence = Array.from({ length: ROUNDS[round].sequenceLength }, () => COLORS[Math.floor(Math.random() * COLORS.length)]);
      setSequence(newSequence);
      setPhase('display');
      setCurrentIndex(0);
      setUserSequence([]);
    } else {
      setGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    if (phase === 'display' && currentIndex < sequence.length - 1) {
      const timer = setTimeout(() => {
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase, currentIndex, sequence]);

  const handleButtonClick = (color: string) => {
    if (phase === 'input') {
      const newUserSequence = [...userSequence, color];
      setUserSequence(newUserSequence);
      if (newUserSequence.length === sequence.length) {
        handleRoundEnd(newUserSequence);
      }
    }
  };

  const handleDelete = () => {
    setUserSequence(prev => prev.slice(0, -1));
  };

  const handleReady = () => {
    setPhase('input');
  };

  const handleRoundEnd = (finalUserSequence: string[]) => {
    const isCorrect = sequence.every((color, index) => color === finalUserSequence[index]);
    if (isCorrect) {
      setCorrectSequences(prev => prev + 1);
    }
    if (round + 1 < ROUNDS.length) {
      setRound(prevRound => prevRound + 1);
    } else {
      setGameOver(true);
    }
  };

  const colorToTailwind = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
  };

  if (gameOver) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-4"
          >
            <Brain className="w-16 h-16 mx-auto text-primary" />
            <p className="text-xl font-bold">Challenge Completed!</p>
            <p className="text-2xl font-bold text-primary">
              Your Score: {correctSequences}/3
            </p>
            <p className="text-sm">
              You correctly reproduced {correctSequences} out of 3 sequences.
            </p>
            <Button onClick={() => onComplete(true, correctSequences)} className="w-full mt-4">Finish</Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Procedural Memory Challenge</h2>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${round}-${phase}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-sm font-medium">Instructions</AlertTitle>
              <AlertDescription className="text-xs">
                {phase === 'display' 
                  ? `Memorize the sequence of ${sequence.length} colored buttons. The sequence will be shown progressively.` 
                  : `Reproduce the sequence by clicking the buttons in order.`}
              </AlertDescription>
            </Alert>
            <div className="text-sm font-medium text-center">Round {round + 1}/3</div>
            <div className="grid grid-cols-2 gap-4">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-full h-16 ${colorToTailwind[color as keyof typeof colorToTailwind]} transition-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
                  onClick={() => handleButtonClick(color)}
                  disabled={phase === 'display'}
                >
                  <span className="sr-only">{color}</span>
                </button>
              ))}
            </div>
            {phase === 'display' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex justify-center items-center space-x-2">
                  {sequence.slice(0, currentIndex + 1).map((color, index) => (
                    <div key={index} className={`w-8 h-8 rounded-full ${colorToTailwind[color as keyof typeof colorToTailwind]}`}></div>
                  ))}
                </div>
                {currentIndex === sequence.length - 1 && (
                  <Button onClick={handleReady} className="mt-4">
                    Ready
                  </Button>
                )}
              </div>
            )}
            {phase === 'input' && (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex justify-center items-center space-x-2">
                  {userSequence.map((color, index) => (
                    <div key={index} className={`w-4 h-4 rounded-full ${colorToTailwind[color as keyof typeof colorToTailwind]}`}></div>
                  ))}
                </div>
                <Button onClick={handleDelete} disabled={userSequence.length === 0} variant="outline">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}