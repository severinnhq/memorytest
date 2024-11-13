'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Clock, Brain, ArrowRight, Check, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SemanticChainChallengeProps {
  onComplete: (success: boolean, score: number) => void;
}

const MEMORIZATION_TIME = 45000; // 45 seconds
const RECALL_TIME = 60000; // 60 seconds

const SEMANTIC_CHAINS = [
  [
    { word: "Dog", emoji: "🐕" },
    { word: "Fur", emoji: "🦱" },
    { word: "Coat", emoji: "🧥" },
    { word: "Winter", emoji: "❄️" },
    { word: "Snow", emoji: "☃️" },
    { word: "White", emoji: "⚪" },
    { word: "Wedding", emoji: "💒" },
    { word: "Ring", emoji: "💍" }
  ],
  [
    { word: "Book", emoji: "📚" },
    { word: "Page", emoji: "📄" },
    { word: "Paper", emoji: "🗒️" },
    { word: "Tree", emoji: "🌳" },
    { word: "Leaf", emoji: "🍃" },
    { word: "Green", emoji: "💚" },
    { word: "Grass", emoji: "🌿" },
    { word: "Lawn", emoji: "🏡" }
  ],
  [
    { word: "Sun", emoji: "☀️" },
    { word: "Hot", emoji: "🔥" },
    { word: "Fire", emoji: "🧯" },
    { word: "Red", emoji: "🔴" },
    { word: "Apple", emoji: "🍎" },
    { word: "Fruit", emoji: "🍓" },
    { word: "Sweet", emoji: "🍬" },
    { word: "Candy", emoji: "🍭" }
  ],
  [
    { word: "Ocean", emoji: "🌊" },
    { word: "Blue", emoji: "🔵" },
    { word: "Sky", emoji: "🌤️" },
    { word: "Cloud", emoji: "☁️" },
    { word: "Soft", emoji: "🧸" },
    { word: "Pillow", emoji: "🛏️" },
    { word: "Sleep", emoji: "😴" },
    { word: "Dream", emoji: "💭" }
  ],
  [
    { word: "Music", emoji: "🎵" },
    { word: "Note", emoji: "🎼" },
    { word: "Write", emoji: "✍️" },
    { word: "Pen", emoji: "🖊️" },
    { word: "Ink", emoji: "🖋️" },
    { word: "Black", emoji: "⚫" },
    { word: "Night", emoji: "🌙" },
    { word: "Star", emoji: "⭐" }
  ]
];

const SemanticChainChallenge: React.FC<SemanticChainChallengeProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'memorization' | 'recall'>('memorization');
  const [timeLeft, setTimeLeft] = useState(MEMORIZATION_TIME);
  const [chain, setChain] = useState(SEMANTIC_CHAINS[Math.floor(Math.random() * SEMANTIC_CHAINS.length)]);
  const [userInputs, setUserInputs] = useState<string[]>(Array(8).fill(''));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [results, setResults] = useState<('correct' | 'incorrect' | 'misplaced')[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(timer);
          if (phase === 'memorization') {
            setPhase('recall');
            setTimeLeft(RECALL_TIME);
          } else {
            handleGameOver();
          }
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  const handleInputChange = (index: number, value: string) => {
    setUserInputs(prev => prev.map((item, i) => i === index ? value : item));
  };

  const handleSubmit = () => {
    handleGameOver();
  };

  const handleGameOver = () => {
    const newResults: ('correct' | 'incorrect' | 'misplaced')[] = Array(8).fill('incorrect');
    let correctCount = 0;
    let misplacedCount = 0;

    // Check for correct positions first
    userInputs.forEach((input, index) => {
      if (input.toLowerCase().trim() === chain[index].word.toLowerCase()) {
        newResults[index] = 'correct';
        correctCount++;
      }
    });

    // Check for misplaced words
    userInputs.forEach((input, index) => {
      if (newResults[index] !== 'correct') {
        const chainIndex = chain.findIndex(item => 
          item.word.toLowerCase() === input.toLowerCase().trim() && 
          newResults[chain.indexOf(item)] !== 'correct'
        );
        if (chainIndex !== -1) {
          newResults[index] = 'misplaced';
          misplacedCount++;
        }
      }
    });

    setResults(newResults);
    setScore(correctCount * 2 + misplacedCount);
    setGameOver(true);
  };

  const getRating = (score: number) => {
    if (score === 16) return "🏆 Perfect!";
    if (score >= 12) return "🌟 Excellent!";
    if (score >= 8) return "👍 Good job!";
    if (score >= 4) return "🔨 Keep practicing!";
    return "🌱 Room for improvement!";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Semantic Chain Challenge</h2>
        <AnimatePresence mode="wait">
          {!gameOver ? (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm font-medium">Instructions</AlertTitle>
                <AlertDescription className="text-xs">
                  {phase === 'memorization' 
                    ? "Memorize the chain of semantically related words and their emojis. You have 45 seconds." 
                    : "Recall and enter the words in the correct order. You have 60 seconds."}
                </AlertDescription>
              </Alert>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <Progress 
                  value={(timeLeft / (phase === 'memorization' ? MEMORIZATION_TIME : RECALL_TIME)) * 100} 
                  className="w-64 h-2" 
                />
                <span className="text-sm font-medium">{Math.ceil(timeLeft / 1000)}s</span>
              </div>
              {phase === 'memorization' ? (
                <div className="flex flex-wrap justify-center items-center gap-2">
                  {chain.map((item, index) => (
                    <React.Fragment key={index}>
                      <div className="flex items-center justify-center p-2 bg-secondary rounded-md">
                        <span className="text-2xl mr-2">{item.emoji}</span>
                        <span className="text-sm font-medium">{item.word}</span>
                      </div>
                      {index < chain.length - 1 && <ArrowRight className="w-4 h-4" />}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm font-medium w-6">{index + 1}.</span>
                      <Input
                        type="text"
                        placeholder={`Word ${index + 1}`}
                        value={userInputs[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className="text-sm p-2"
                      />
                    </div>
                  ))}
                </div>
              )}
              {phase === 'recall' && (
                <Button onClick={handleSubmit} className="w-full mt-4">Submit Answers</Button>
              )}
            </motion.div>
          ) : (
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
                Your Score: {score}/16
              </p>
              <p className="text-xl">{getRating(score)}</p>
              <div>
                <h4 className="text-lg font-semibold mb-2">Results:</h4>
                <div className="flex flex-wrap justify-center items-center gap-2">
                  {chain.map((item, index) => (
                    <React.Fragment key={index}>
                      <div className={`flex items-center justify-center p-2 rounded-md ${
                        results[index] === 'correct'
                          ? "bg-green-100 text-green-800"
                          : results[index] === 'misplaced'
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        <span className="text-2xl mr-2">{item.emoji}</span>
                        <span className="text-sm font-medium">{item.word}</span>
                      </div>
                      {index < chain.length - 1 && <ArrowRight className="w-4 h-4" />}
                    </React.Fragment>
                  ))}
                </div>
                <div className="mt-4 text-sm">
                  <p>Your answers:</p>
                  <div className="flex flex-wrap justify-center items-center gap-2 mt-2">
                    {userInputs.map((input, index) => (
                      <React.Fragment key={index}>
                        <div className={`flex items-center justify-center p-2 rounded-md ${
                          results[index] === 'correct'
                            ? "bg-green-100 text-green-800"
                            : results[index] === 'misplaced'
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          <span className="text-sm font-medium">{input || "—"}</span>
                        </div>
                        {index < userInputs.length - 1 && <ArrowRight className="w-4 h-4" />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-sm">
                  <p>
                    <Check className="inline-block w-4 h-4 text-green-500 mr-1" />
                    Correct: 2 points
                  </p>
                  <p>
                    <ArrowRight className="inline-block w-4 h-4 text-yellow-500 mr-1" />
                    Misplaced: 1 point
                  </p>
                  <p>
                    <X className="inline-block w-4 h-4 text-red-500 mr-1" />
                    Incorrect: 0 points
                  </p>
                </div>
              </div>
              <Button onClick={() => onComplete(true, score)} className="w-full mt-4">Finish</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default SemanticChainChallenge;