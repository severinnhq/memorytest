'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Brain } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface TactilePatternRecognitionProps {
  onComplete: (success: boolean, score: number) => void;
}

const ROUNDS = 3;
const TOUCH_POINTS = 20;
const PATTERN_LENGTH = 6;

const bodyPoints = [
  { x: 50, y: 5 },   // Head top
  { x: 50, y: 15 },  // Forehead
  { x: 40, y: 15 },  // Left eye
  { x: 60, y: 15 },  // Right eye
  { x: 50, y: 25 },  // Nose
  { x: 50, y: 35 },  // Mouth
  { x: 30, y: 40 },  // Left Shoulder
  { x: 70, y: 40 },  // Right Shoulder
  { x: 50, y: 50 },  // Chest
  { x: 20, y: 60 },  // Left Elbow
  { x: 80, y: 60 },  // Right Elbow
  { x: 50, y: 70 },  // Stomach
  { x: 10, y: 80 },  // Left Hand
  { x: 90, y: 80 },  // Right Hand
  { x: 40, y: 75 },  // Left Hip
  { x: 60, y: 75 },  // Right Hip
  { x: 35, y: 85 },  // Left Knee
  { x: 65, y: 85 },  // Right Knee
  { x: 30, y: 95 },  // Left Foot
  { x: 70, y: 95 },  // Right Foot
];

export default function TactilePatternRecognition({ onComplete }: TactilePatternRecognitionProps) {
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<'display' | 'input'>('display');
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
    const newPattern = Array.from({ length: PATTERN_LENGTH }, () => Math.floor(Math.random() * TOUCH_POINTS));
    setPattern(newPattern);
    setUserPattern([]);
    setPhase('display');
  };

  const handleReady = () => {
    setPhase('input');
  };

  const handlePointClick = (index: number) => {
    if (phase !== 'input') return;
    setUserPattern(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else if (prev.length < PATTERN_LENGTH) {
        return [...prev, index];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    const correct = pattern.every(point => userPattern.includes(point)) && pattern.length === userPattern.length;
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
            <h2 className="text-2xl font-bold">Tactile Pattern Recognition Completed!</h2>
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
        <h2 className="text-2xl font-bold mb-4 text-center">Tactile Pattern Recognition</h2>
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
                {phase === 'display' 
                  ? "Memorize the pattern of touches, then click 'Ready' when you're prepared to recreate it." 
                  : "Click on the body to reproduce the pattern of touches."}
              </AlertDescription>
            </Alert>
            <div className="text-sm font-medium text-center">
              Round: {round + 1} / {ROUNDS}
            </div>
            <Progress value={(round / ROUNDS) * 100} className="w-full" />
            <div className="relative w-64 h-96 mx-auto bg-gray-200 rounded-lg">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M50 5 L30 40 L20 60 L10 80 L30 95 L70 95 L90 80 L80 60 L70 40 Z" fill="none" stroke="black" strokeWidth="1" />
                <circle cx="50" cy="15" r="10" fill="none" stroke="black" strokeWidth="1" />
                {bodyPoints.map((point, index) => (
                  <motion.circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="2.5"
                    fill={
                      (phase === 'display' && pattern.includes(index)) ||
                      (phase === 'input' && userPattern.includes(index))
                        ? "red"
                        : "transparent"
                    }
                    stroke="black"
                    strokeWidth="1"
                    className="cursor-pointer"
                    onClick={() => handlePointClick(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </svg>
            </div>
            {phase === 'display' ? (
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
                disabled={userPattern.length !== PATTERN_LENGTH}
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