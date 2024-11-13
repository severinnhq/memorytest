'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Undo2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface WorkingTask3Props {
  onComplete: (success: boolean) => void;
}

const TOTAL_ROUNDS = 5;
const SEQUENCE_LENGTH = 5;
const PLAYBACK_INTERVAL = 1000; // 1 second between each sound
const RECALL_DELAY = 1000; // 1 second delay before allowing recall

const FREQUENCIES = [261.63, 293.66, 329.63, 349.23, 392.00]; // C4, D4, E4, F4, G4
const NOTE_NAMES = ['C', 'D', 'E', 'F', 'G'];

const WorkingTask3: React.FC<WorkingTask3Props> = ({ onComplete }) => {
  const [round, setRound] = useState(0);
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [canRecall, setCanRecall] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    gainNodeRef.current = audioContextRef.current.createGain();
    gainNodeRef.current.connect(audioContextRef.current.destination);
    gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
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
    const newSequence = Array.from({ length: SEQUENCE_LENGTH }, () => Math.floor(Math.random() * FREQUENCIES.length));
    setSequence(newSequence);
    setUserSequence([]);
    setCanRecall(false);
    playSequence(newSequence);
  };

  const playSound = (frequency: number, duration: number) => {
    if (audioContextRef.current && gainNodeRef.current) {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }

      oscillatorRef.current = audioContextRef.current.createOscillator();
      oscillatorRef.current.type = 'sine';
      oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillatorRef.current.connect(gainNodeRef.current);

      gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current.currentTime);
      gainNodeRef.current.gain.linearRampToValueAtTime(1, audioContextRef.current.currentTime + 0.01);
      gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + duration);

      oscillatorRef.current.start();
      oscillatorRef.current.stop(audioContextRef.current.currentTime + duration);
    }
  };

  const playSequence = (seq: number[]) => {
    setIsPlaying(true);
    seq.forEach((freqIndex, index) => {
      setTimeout(() => {
        playSound(FREQUENCIES[freqIndex], 0.5);
        if (index === seq.length - 1) {
          setTimeout(() => {
            setIsPlaying(false);
            setCanRecall(true);
          }, RECALL_DELAY);
        }
      }, index * PLAYBACK_INTERVAL);
    });
  };

  const handleSoundClick = (index: number) => {
    if (!canRecall) return;
    playSound(FREQUENCIES[index], 0.5);
    setUserSequence(prev => [...prev, index]);
  };

  const handleRemoveLastSound = () => {
    if (userSequence.length > 0) {
      setUserSequence(prev => prev.slice(0, -1));
    }
  };

  const handleSubmit = () => {
    const roundScore = sequence.every((freq, index) => freq === userSequence[index]) ? 1 : 0;
    setScores(prev => [...prev, roundScore]);

    if (round + 1 < TOTAL_ROUNDS) {
      setRound(round + 1);
    } else {
      setGameOver(true);
      setShowResult(true);
    }
  };

  const handlePlayAgain = () => {
    if (!isPlaying && canRecall) {
      playSequence(sequence);
    }
  };

  const totalScore = scores.reduce((sum, score) => sum + score, 0);

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Auditory Sequence Recall</h2>
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
                  Listen to the sequence of sounds. After it finishes, recreate the sequence by clicking the keys in the correct order.
                </AlertDescription>
              </Alert>
              <div className="text-center mb-4">
                <p className="text-sm text-gray-500">Round: {round + 1} / {TOTAL_ROUNDS}</p>
                <Progress value={((round + 1) / TOTAL_ROUNDS) * 100} className="mt-2" />
              </div>
              <div className="flex justify-center space-x-1 mb-4">
                {FREQUENCIES.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-12 h-32 bg-white border border-gray-300 rounded-b-lg cursor-pointer ${isPlaying || !canRecall ? 'opacity-50' : ''}`}
                    whileHover={{ y: -5 }}
                    whileTap={{ y: 0 }}
                    onClick={() => handleSoundClick(index)}
                  >
                    <div className="h-full flex items-end justify-center pb-2">
                      <span className="text-sm font-semibold">{NOTE_NAMES[index]}</span>
                    </div>
                  </motion.div>
                ))}
                <motion.div
                  className={`w-12 h-32 bg-gray-100 border border-gray-300 rounded-b-lg cursor-pointer flex items-center justify-center ${isPlaying || !canRecall || userSequence.length === 0 ? 'opacity-50' : ''}`}
                  whileHover={{ y: -5 }}
                  whileTap={{ y: 0 }}
                  onClick={handleRemoveLastSound}
                >
                  <Undo2 className="w-6 h-6 text-gray-600" />
                </motion.div>
              </div>
              <div className="flex justify-between items-center">
                <Button onClick={handlePlayAgain} disabled={isPlaying || !canRecall}>
                  Play Again
                </Button>
                <Button onClick={handleSubmit} disabled={isPlaying || !canRecall || userSequence.length !== SEQUENCE_LENGTH}>
                  Submit Sequence
                </Button>
              </div>
              <div className="text-center text-sm text-gray-500">
                {userSequence.length} / {SEQUENCE_LENGTH} sounds selected
              </div>
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
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4"
              >
                <p className="text-2xl font-bold text-primary">Your score: {totalScore}/5</p>
                <Button onClick={() => onComplete(true)} className="w-full mt-4">Finish</Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default WorkingTask3;