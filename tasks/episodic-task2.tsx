'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Clock, Brain, Newspaper, Tv, Radio, Book } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SourceMemoryTaskProps {
  onComplete: (success: boolean, score: number) => void;
}

const MEMORIZATION_TIME = 60000; // 60 seconds
const RECALL_TIME = 90000; // 90 seconds
const SHUFFLE_INTERVAL = 2000; // 5 seconds

const INFORMATION = [
  { fact: "The Great Wall of China is over 13,000 miles long.", question: "How long is the Great Wall of China?", answer: "13,000 miles", source: "Newspaper" },
  { fact: "The first human heart transplant was performed in 1967.", question: "In what year was the first human heart transplant performed?", answer: "1967", source: "TV Documentary" },
  { fact: "Honey never spoils; archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old.", question: "What property of honey allows it to never spoil?", answer: "never spoils", source: "Radio Show" },
  { fact: "The shortest war in history lasted 38 minutes between Britain and Zanzibar in 1896.", question: "How long did the shortest war in history last?", answer: "38 minutes", source: "History Book" },
  { fact: "A group of flamingos is called a 'flamboyance'.", question: "What is a group of flamingos called?", answer: "flamboyance", source: "Newspaper" },
  { fact: "The world's oldest known living tree is over 5,000 years old.", question: "How old is the world's oldest known living tree?", answer: "5,000 years", source: "TV Documentary" },
  { fact: "Octopuses have three hearts.", question: "How many hearts do octopuses have?", answer: "three", source: "Radio Show" },
  { fact: "The first Olympic Games were held in ancient Greece in 776 BC.", question: "In what year were the first Olympic Games held in ancient Greece?", answer: "776 BC", source: "History Book" },
];

const sourceIcons = {
  "Newspaper": <Newspaper className="w-6 h-6" />,
  "TV Documentary": <Tv className="w-6 h-6" />,
  "Radio Show": <Radio className="w-6 h-6" />,
  "History Book": <Book className="w-6 h-6" />,
};

export default function SourceMemoryTask({ onComplete }: SourceMemoryTaskProps) {
  const [phase, setPhase] = useState<'memorization' | 'recall'>('memorization');
  const [timeLeft, setTimeLeft] = useState(MEMORIZATION_TIME);
  const [shuffledInfo, setShuffledInfo] = useState(() => [...INFORMATION].sort(() => Math.random() - 0.5));
  const [userAnswers, setUserAnswers] = useState<{ answer: string; source: string }[]>(
    INFORMATION.map(() => ({ answer: '', source: '' }))
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

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

  useEffect(() => {
    if (phase === 'memorization') {
      const shuffleTimer = setInterval(() => {
        setShuffledInfo(prev => [...prev].sort(() => Math.random() - 0.5));
      }, SHUFFLE_INTERVAL);

      return () => clearInterval(shuffleTimer);
    }
  }, [phase]);

  const handleAnswerInputChange = (index: number, value: string) => {
    setUserAnswers(prev => prev.map((item, i) => i === index ? { ...item, answer: value } : item));
  };

  const handleSourceChange = (index: number, value: string) => {
    setUserAnswers(prev => prev.map((item, i) => i === index ? { ...item, source: value } : item));
  };

  const handleSubmit = () => {
    handleGameOver();
  };

  const handleGameOver = () => {
    let newScore = 0;
    userAnswers.forEach((answer, index) => {
      if (answer.answer.toLowerCase().includes(INFORMATION[index].answer.toLowerCase())) {
        newScore += 1;
      }
      if (answer.source === INFORMATION[index].source) {
        newScore += 1;
      }
    });
    setScore(newScore);
    setGameOver(true);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Source Memory Challenge</h2>
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
                    ? "Memorize each fact and its source. The facts will shuffle every 5 seconds. You have 60 seconds." 
                    : "Answer the questions and recall the source for each fact. You have 90 seconds."}
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
                <div className="space-y-4">
                  {shuffledInfo.map((item, index) => (
                    <motion.div
                      key={item.fact}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="bg-secondary p-4 rounded-lg flex items-start space-x-4"
                    >
                      {sourceIcons[item.source as keyof typeof sourceIcons]}
                      <div>
                        <p className="text-sm font-medium">{item.fact}</p>
                        <p className="text-xs text-muted-foreground">Source: {item.source}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {INFORMATION.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-sm font-medium">{item.question}</p>
                      <Input
                        placeholder="Your answer"
                        value={userAnswers[index].answer}
                        onChange={(e) => handleAnswerInputChange(index, e.target.value)}
                        className="w-full"
                      />
                      <Select onValueChange={(value) => handleSourceChange(index, value)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Newspaper">Newspaper</SelectItem>
                          <SelectItem value="TV Documentary">TV Documentary</SelectItem>
                          <SelectItem value="Radio Show">Radio Show</SelectItem>
                          <SelectItem value="History Book">History Book</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                  <Button onClick={handleSubmit} className="w-full">Submit Answers</Button>
                </div>
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
                Your Score: {score}/{INFORMATION.length * 2}
              </p>
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Results:</h4>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="pb-2">Question</th>
                      <th className="pb-2">Correct Answer</th>
                      <th className="pb-2">Your Answer</th>
                      <th className="pb-2">Correct Source</th>
                      <th className="pb-2">Your Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {INFORMATION.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-secondary" : ""}>
                        <td className="py-1 pr-2">{item.question}</td>
                        <td className="py-1 pr-2">{item.answer}</td>
                        <td className={`py-1 pr-2 ${userAnswers[index].answer.toLowerCase().includes(item.answer.toLowerCase()) ? "text-green-600" : "text-red-600"}`}>
                          {userAnswers[index].answer || "Not answered"}
                        </td>
                        <td className="py-1 pr-2">{item.source}</td>
                        <td className={`py-1 ${userAnswers[index].source === item.source ? "text-green-600" : "text-red-600"}`}>
                          {userAnswers[index].source || "Not selected"}
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
}