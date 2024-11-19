'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface WorkingTask1Props {
  onComplete: (success: boolean) => void;
}

const TOTAL_ROUNDS = 5;

const generateMathProblem = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  const operation = Math.random() < 0.5 ? '+' : '-';
  const result = operation === '+' ? num1 + num2 : num1 - num2;
  return { problem: `${num1} ${operation} ${num2} = ?`, result };
};

const generateLetter = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[Math.floor(Math.random() * letters.length)];
};

const WorkingTask1: React.FC<WorkingTask1Props> = ({ onComplete }) => {
  const [round, setRound] = useState(0);
  const [mathProblem, setMathProblem] = useState({ problem: '', result: 0 });
  const [userMathAnswer, setUserMathAnswer] = useState('');
  const [letter, setLetter] = useState('');
  const [showMath, setShowMath] = useState(true);
  const [showLetter, setShowLetter] = useState(false);
  const [pairs, setPairs] = useState<{ letter: string; result: number }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [userRecallLetters, setUserRecallLetters] = useState('');
  const [userRecallNumbers, setUserRecallNumbers] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (round < TOTAL_ROUNDS) {
      startNewRound();
    } else {
      setGameOver(true);
    }
  }, [round]);

  const startNewRound = () => {
    const newMathProblem = generateMathProblem();
    setMathProblem(newMathProblem);
    const newLetter = generateLetter();
    setLetter(newLetter);
    setPairs(prev => [...prev, { letter: newLetter, result: newMathProblem.result }]);
    setShowMath(true);
    setShowLetter(false);
    setUserMathAnswer('');
  };

  const handleMathSubmit = () => {
    setShowMath(false);
    setShowLetter(true);
  };

  const handleContinue = () => {
    if (round + 1 < TOTAL_ROUNDS) {
      setRound(round + 1);
    } else {
      setGameOver(true);
    }
  };

  const handleRecallSubmit = () => {
    const recalledLetters = userRecallLetters.toUpperCase().split('');
    const recalledNumbers = userRecallNumbers.split(',').map(num => parseInt(num.trim()));
    
    let correctPairs = 0;
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
      if (recalledLetters[i] === pairs[i]?.letter && recalledNumbers[i] === pairs[i]?.result) {
        correctPairs++;
      }
    }
    
    setScore(correctPairs);
    setShowResult(true);
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Operation Span Task</h2>
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
                  Solve the math problem, then remember the letter shown. Click continue when ready for the next round.
                </AlertDescription>
              </Alert>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500">Round: {round + 1} / {TOTAL_ROUNDS}</p>
                <Progress value={((round + 1) / TOTAL_ROUNDS) * 100} className="mt-2" />
              </div>
              {showMath && (
                <div className="space-y-4">
                  <p className="text-center text-2xl font-bold">{mathProblem.problem}</p>
                  <Input
                    type="number"
                    value={userMathAnswer}
                    onChange={(e) => setUserMathAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    className="text-center"
                  />
                  <Button onClick={handleMathSubmit} className="w-full">Submit Answer</Button>
                </div>
              )}
              {showLetter && (
                <div className="space-y-4">
                  <div className="flex justify-center items-center h-32 text-6xl font-bold">
                    {letter}
                  </div>
                  <Button onClick={handleContinue} className="w-full">Continue</Button>
                </div>
              )}
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
            <p className="text-xl font-bold mb-4">Task Completed!</p>
            <p className="text-lg mb-4">Now, please recall all the letters and numbers you saw, in order:</p>
            <Input
              value={userRecallLetters}
              onChange={(e) => setUserRecallLetters(e.target.value)}
              placeholder="Enter the letters (e.g., ABCDE)"
              className="text-center mb-2"
              maxLength={TOTAL_ROUNDS}
            />
            <Input
              value={userRecallNumbers}
              onChange={(e) => setUserRecallNumbers(e.target.value)}
              placeholder="Enter the numbers (e.g., 5, 7, 3, 9, 2)"
              className="text-center"
            />
            <Button onClick={handleRecallSubmit} className="w-full">Submit Recall</Button>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <p className="text-2xl font-bold text-primary">Your score: {score}/5</p>
                <Button onClick={() => onComplete(true)} className="w-full mt-4">Finish</Button>
              </motion.div>
            )}
          </motion.div> 
        )}
      </AnimatePresence>
    </Card>
  );
};

export default WorkingTask1;