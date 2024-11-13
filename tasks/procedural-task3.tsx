'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Brain, Play, Square, Trash2 } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface RhythmRecallTaskProps {
  onComplete: (success: boolean, score: number) => void;
}

const ROUNDS = 3;
const MAX_SEQUENCE_LENGTH = 8;
const NOTES = ['C', 'D', 'E', 'F', 'G', 'A'];

export default function RhythmRecallTask({ onComplete }: RhythmRecallTaskProps) {
  const [sequences, setSequences] = useState<number[][]>([]);
  const [userSequences, setUserSequences] = useState<number[][]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctSequences, setCorrectSequences] = useState<boolean[]>([false, false, false]);
  const audioContext = useRef<AudioContext | null>(null);
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    generateSequences();

    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current);
      }
    };
  }, []);

  const generateSequences = () => {
    const newSequences = Array.from({ length: ROUNDS }, (_, round) =>
      Array.from(
        { length: Math.min(round + 3, MAX_SEQUENCE_LENGTH) },
        () => Math.floor(Math.random() * 6)
      )
    );
    setSequences(newSequences);
  };

  const playSound = (index: number) => {
    if (audioContext.current) {
      const frequency = 220 * Math.pow(2, index / 12); // A3 (220Hz) as base frequency
      const oscillator = audioContext.current.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContext.current.currentTime);
      
      const gainNode = audioContext.current.createGain();
      gainNode.gain.setValueAtTime(0, audioContext.current.currentTime);
      gainNode.gain.linearRampToValueAtTime(1, audioContext.current.currentTime + 0.01);
      gainNode.gain.linearRampToValueAtTime(0, audioContext.current.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.current.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.current.currentTime + 0.3);
    }
  };

  const playSequence = async () => {
    if (!sequences[currentRound]) return;
    setIsPlaying(true);
    for (let i = 0; i < sequences[currentRound].length; i++) {
      playTimeoutRef.current = setTimeout(() => {
        playSound(sequences[currentRound][i]);
        if (i === sequences[currentRound].length - 1) {
          setIsPlaying(false);
        }
      }, i * 500);
    }
  };

  const handleButtonClick = (index: number) => {
    if (isPlaying) return;
    
    playSound(index);
    setUserSequences(prev => {
      const newSequences = [...prev];
      if (!newSequences[currentRound]) {
        newSequences[currentRound] = [];
      }
      newSequences[currentRound] = [...newSequences[currentRound], index];
      return newSequences;
    });
  };

  const handleDelete = () => {
    setUserSequences(prev => {
      const newSequences = [...prev];
      if (newSequences[currentRound] && newSequences[currentRound].length > 0) {
        newSequences[currentRound] = newSequences[currentRound].slice(0, -1);
      }
      return newSequences;
    });
  };

  const handleSubmit = () => {
    if (!sequences[currentRound] || !userSequences[currentRound] || 
        userSequences[currentRound].length !== sequences[currentRound].length) return;

    const correct = userSequences[currentRound].every((num, i) => num === sequences[currentRound][i]);
    setCorrectSequences(prev => {
      const newCorrectSequences = [...prev];
      newCorrectSequences[currentRound] = correct;
      return newCorrectSequences;
    });

    if (currentRound < ROUNDS - 1) {
      setCurrentRound(prev => prev + 1);
    } else {
      setGameOver(true);
    }
  };

  if (gameOver) {
    const finalScore = correctSequences.filter(Boolean).length;
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
            <h2 className="text-2xl font-bold">Rhythm Recall Completed!</h2>
            <p className="text-3xl font-bold text-primary">
              Your Score: {finalScore}/3
            </p>
            <p className="text-sm">
              You correctly recreated {finalScore} sequences out of 3.
            </p>
            <Button onClick={() => onComplete(true, finalScore)} className="w-full mt-4">Finish</Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  const currentSequence = sequences[currentRound] || [];
  const currentUserSequence = userSequences[currentRound] || [];

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Rhythm Recall</h2>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRound}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Listen to the sequence and repeat it by clicking the buttons.
              </AlertDescription>
            </Alert>
            <div className="text-sm font-medium text-center">
              Round: {currentRound + 1} / {ROUNDS}
            </div>
            <Progress 
              value={(currentUserSequence.length / currentSequence.length) * 100} 
              className="w-full" 
            />
            <div className="grid grid-cols-3 gap-4">
              {NOTES.map((note, index) => (
                <Button
                  key={index}
                  onClick={() => handleButtonClick(index)}
                  disabled={isPlaying}
                  className="h-16 text-xl font-bold"
                  variant="outline"
                >
                  {note}
                </Button>
              ))}
            </div>
            <div className="flex justify-between gap-4">
              <Button
                onClick={playSequence}
                disabled={isPlaying}
                className="flex-1"
                variant="default"
              >
                {isPlaying ? <Square className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                {isPlaying ? 'Playing...' : 'Play Sequence'}
              </Button>
              <Button
                onClick={handleDelete}
                disabled={isPlaying || currentUserSequence.length === 0}
                className="flex-1"
                variant="outline"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
            <Button
              onClick={handleSubmit}
              disabled={isPlaying || currentUserSequence.length !== currentSequence.length}
              className="w-full"
              variant="default"
            >
              Submit
            </Button>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}