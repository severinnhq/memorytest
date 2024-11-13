'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Clock, Brain, Check, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FactVerificationTaskProps {
  onComplete: (success: boolean, score: number) => void;
}

const TASK_TIME = 60000; // 60 seconds

const FACTS = [
  { statement: "The Great Wall of China is visible from space.", isTrue: false },
  { statement: "Water boils at 100 degrees Celsius at sea level.", isTrue: true },
  { statement: "The capital of Australia is Sydney.", isTrue: false },
  { statement: "Diamonds are made from compressed coal.", isTrue: false },
  { statement: "The human body has 206 bones.", isTrue: true },
  { statement: "Mount Everest is the tallest mountain in the world.", isTrue: true },
  { statement: "The Mona Lisa was painted by Leonardo da Vinci.", isTrue: true },
  { statement: "Pluto is considered a planet in our solar system.", isTrue: false },
  { statement: "The Eiffel Tower is located in London.", isTrue: false },
  { statement: "The chemical symbol for gold is Au.", isTrue: true },
  { statement: "Humans can hear better than dogs.", isTrue: false },
  { statement: "The Earth is flat.", isTrue: false },
  { statement: "The Nile is the longest river in the world.", isTrue: true },
  { statement: "Bats are blind.", isTrue: false },
  { statement: "The human brain is fully developed by age 25.", isTrue: true }
];

const FactVerificationTask: React.FC<FactVerificationTaskProps> = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(TASK_TIME);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(boolean | null)[]>(Array(10).fill(null));
  const [gameOver, setGameOver] = useState(false);

  const shuffledFacts = React.useMemo(() => FACTS.sort(() => Math.random() - 0.5).slice(0, 10), []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(timer);
          handleGameOver();
          return 0;
        }
        return prevTime - 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (answer: boolean) => {
    const isCorrect = answer === shuffledFacts[currentFactIndex].isTrue;
    setScore((prevScore) => (isCorrect ? prevScore + 1 : prevScore));
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentFactIndex] = answer;
      return newAnswers;
    });

    if (currentFactIndex < shuffledFacts.length - 1) {
      setCurrentFactIndex((prevIndex) => prevIndex + 1);
    } else {
      handleGameOver();
    }
  };

  const handleGameOver = () => {
    setGameOver(true);
  };

  const getRating = (score: number) => {
    if (score === 10) return "🏆 Perfect! You're a knowledge master!";
    if (score >= 8) return "🌟 Excellent! Your general knowledge is impressive!";
    if (score >= 6) return "👍 Good job! You know your facts well!";
    if (score >= 4) return "🔨 Not bad! Keep learning and improving!";
    return "🌱 Room for improvement! Keep expanding your knowledge!";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Fact Verification Challenge</h2>
        <AnimatePresence mode="wait">
          {!gameOver ? (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-sm font-medium">Instructions</AlertTitle>
                <AlertDescription className="text-xs">
                  Determine if each statement is true or false. You have 60 seconds to answer as many as you can.
                </AlertDescription>
              </Alert>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <Progress 
                  value={(timeLeft / TASK_TIME) * 100} 
                  className="w-64 h-2" 
                />
                <span className="text-sm font-medium">{Math.ceil(timeLeft / 1000)}s</span>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold">Statement {currentFactIndex + 1} of 10</h3>
              </div>
              <div className="bg-secondary p-4 rounded-md mb-4">
                <p className="text-center text-lg">{shuffledFacts[currentFactIndex].statement}</p>
              </div>
              <div className="flex justify-center space-x-4">
                <Button 
                  onClick={() => handleAnswer(true)}
                  className="w-24 bg-green-500 hover:bg-green-600"
                >
                  True
                </Button>
                <Button 
                  onClick={() => handleAnswer(false)}
                  className="w-24 bg-red-500 hover:bg-red-600"
                >
                  False
                </Button>
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
              <Brain className="w-16 h-16 mx-auto text-primary" />
              <p className="text-xl font-bold">Challenge Completed!</p>
              <p className="text-2xl font-bold text-primary">
                Your Score: {score}/10
              </p>
              <p className="text-xl">{getRating(score)}</p>
              <div>
                <h4 className="text-lg font-semibold mb-2">Results:</h4>
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left">Statement</th>
                      <th>Correct</th>
                      <th>Your Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shuffledFacts.map((fact, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-secondary" : ""}>
                        <td className="text-left py-2 px-1">{fact.statement}</td>
                        <td className="py-2 px-1">
                          <span className={fact.isTrue ? "text-green-500" : "text-red-500"}>
                            {fact.isTrue ? "True" : "False"}
                          </span>
                        </td>
                        <td className="py-2 px-1">
                          {userAnswers[index] === null ? (
                            <span className="text-gray-500">-</span>
                          ) : userAnswers[index] === fact.isTrue ? (
                            <Check className="text-green-500 w-5 h-5 mx-auto" />
                          ) : (
                            <X className="text-red-500 w-5 h-5 mx-auto" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button onClick={() => onComplete(true, score)} className="w-full mt-4">Finish</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default FactVerificationTask;