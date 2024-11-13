'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface LongTermTask1Props {
  onComplete: (success: boolean) => void;
}

const FACT_COUNT = 5;
const DISPLAY_DURATION = 20000; // 20 seconds to memorize facts
const DELAY_DURATION = 30000; // 30 seconds delay before questions
const TOTAL_ROUNDS = 3;

const facts = [
  { fact: "The Great Wall of China is over 13,000 miles long.", question: "How long is the Great Wall of China?", answer: "over 13,000 miles" },
  { fact: "The Eiffel Tower was completed in 1889.", question: "In what year was the Eiffel Tower completed?", answer: "1889" },
  { fact: "The human body has 206 bones.", question: "How many bones are in the human body?", answer: "206" },
  { fact: "Mount Everest is 29,029 feet tall.", question: "How tall is Mount Everest?", answer: "29,029 feet" },
  { fact: "The Amazon River is approximately 4,000 miles long.", question: "What is the approximate length of the Amazon River?", answer: "4,000 miles" },
  { fact: "The Mona Lisa was painted by Leonardo da Vinci.", question: "Who painted the Mona Lisa?", answer: "Leonardo da Vinci" },
  { fact: "The speed of light is approximately 186,282 miles per second.", question: "What is the approximate speed of light?", answer: "186,282 miles per second" },
  { fact: "The first moon landing occurred in 1969.", question: "In what year did the first moon landing occur?", answer: "1969" },
  { fact: "The Statue of Liberty was a gift from France to the United States.", question: "Which country gifted the Statue of Liberty to the United States?", answer: "France" },
  { fact: "The human brain weighs about 3 pounds.", question: "What is the approximate weight of the human brain?", answer: "3 pounds" }
];

const LongTermTask1: React.FC<LongTermTask1Props> = ({ onComplete }) => {
  const [currentFacts, setCurrentFacts] = useState<typeof facts>([]);
  const [currentQuestions, setCurrentQuestions] = useState<typeof facts>([]);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(FACT_COUNT).fill(''));
  const [showFacts, setShowFacts] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (round < TOTAL_ROUNDS) {
      startNewRound();
    } else if (round === TOTAL_ROUNDS && !gameOver) {
      setGameOver(true);
    }
  }, [round]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const startNewRound = () => {
    const shuffled = [...facts].sort(() => 0.5 - Math.random());
    const newFacts = shuffled.slice(0, FACT_COUNT);
    setCurrentFacts(newFacts);
    setCurrentQuestions(newFacts);
    setUserAnswers(Array(FACT_COUNT).fill(''));
    setShowFacts(true);
    setCountdown(DISPLAY_DURATION / 1000);

    setTimeout(() => {
      setShowFacts(false);
      setCountdown(DELAY_DURATION / 1000);
      setTimeout(() => {
        setShowQuestions(true);
        setCountdown(0);
      }, DELAY_DURATION);
    }, DISPLAY_DURATION);
  };

  const handleInputChange = (index: number, value: string) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[index] = value;
    setUserAnswers(newUserAnswers);
  };

  const handleSubmit = () => {
    const correct = userAnswers.filter((answer, index) => 
      answer.toLowerCase().trim() === currentQuestions[index].answer.toLowerCase().trim()
    ).length;
    setScore(score + correct);
    if (round + 1 < TOTAL_ROUNDS) {
      setRound(round + 1);
      setShowQuestions(false);
    } else {
      setGameOver(true);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Fact Recall</h2>
      <AnimatePresence mode="wait">
        {!gameOver ? (
          <motion.div
            key="game"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <p className="mb-4 text-center">Round {round + 1} of {TOTAL_ROUNDS}</p>
            {countdown > 0 && (
              <p className="text-center mb-2">Time remaining: {countdown} seconds</p>
            )}
            {showFacts && (
              <div className="mb-4">
                <p className="text-center mb-2">Memorize these facts:</p>
                <ul className="list-disc pl-5 space-y-2">
                  {currentFacts.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {item.fact}
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
            {showQuestions && (
              <div className="mb-4 space-y-4">
                <p className="text-center mb-2">Answer these questions:</p>
                {currentQuestions.map((item, index) => (
                  <div key={index}>
                    <p className="font-semibold mb-1">{item.question}</p>
                    <Input
                      type="text"
                      value={userAnswers[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      placeholder="Your answer"
                    />
                  </div>
                ))}
              </div>
            )}
            <Button onClick={handleSubmit} className="w-full mt-4" disabled={!showQuestions}>
              {showQuestions ? 'Submit Answers' : 'Memorizing...'}
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
            <p className="text-lg mb-4">Your final score: {score} out of {TOTAL_ROUNDS * FACT_COUNT}</p>
            <Button onClick={() => onComplete(true)} className="w-full">Finish</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default LongTermTask1;