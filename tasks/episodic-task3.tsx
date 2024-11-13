'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Clock, Brain, ArrowLeft, ArrowRight } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from 'next/image'

interface VirtualTourTaskProps {
  onComplete: (success: boolean, score: number) => void;
}

const EXPLORATION_TIME = 120000; // 2 minutes
const RECALL_TIME = 90000; // 1.5 minutes

const LOCATIONS = [
  {
    name: "Grand Library",
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800&q=80",
    description: "A vast room filled with towering bookshelves, ornate reading tables, and a grand chandelier hanging from a domed ceiling.",
    questions: [
      { question: "How many bookshelf rows where visible on the image? (reply with number)", answer: "3" },
      { question: "Was the light on?", answer: "yes" },
    ]
  },
  {
    name: "Zen Garden",
    image: "/zengarden.png",
    description: "A serene Japanese garden with carefully raked sand patterns, moss-covered rocks, and a small wooden bridge over a tranquil pond.",
    questions: [
      { question: "What color was the bridge?", answer: "red" },
      { question: "What was covering some of the rocks?", answer: "moss" },
    ]
  },
  {
    name: "Supercar Garage",
    image: "/lambo.png",
    description: "A sleek, modern garage showcasing a matte gray Lamborghini with sharp angular lines, set against polished floors and dramatic lighting.",
    questions: [
      { question: "What the floor was made of?", answer: "tiles" },
      { question: "Was there another car visible in the background?", answer: "yes" },
    ]
  },
  {
    name: "Ancient Ruins",
    image: "/ancient.png",
    description: "Weathered stone columns and archways from an ancient civilization, with intricate carvings still visible on their surfaces and vegetation growing amidst the ruins.",
    questions: [
      { question: "What ancient architectural features were prominent?", answer: "columns" },
      { question: "What was growing among the ruins?", answer: "vegetation" },
    ]
  },
];

export default function VirtualTourTask({ onComplete }: VirtualTourTaskProps) {
  const [phase, setPhase] = useState<'exploration' | 'recall'>('exploration');
  const [timeLeft, setTimeLeft] = useState(EXPLORATION_TIME);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(
    LOCATIONS.flatMap(location => location.questions.map(() => ''))
  );
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(timer);
          if (phase === 'exploration') {
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

  const handleNavigation = (direction: 'next' | 'prev') => {
    setCurrentLocationIndex((prevIndex) => {
      if (direction === 'next') {
        return (prevIndex + 1) % LOCATIONS.length;
      } else {
        return (prevIndex - 1 + LOCATIONS.length) % LOCATIONS.length;
      }
    });
  };

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = value;
      return newAnswers;
    });
  };

  const handleSubmit = () => {
    handleGameOver();
  };

  const handleGameOver = () => {
    let newScore = 0;
    LOCATIONS.forEach((location, locationIndex) => {
      location.questions.forEach((question, questionIndex) => {
        const overallIndex = locationIndex * 2 + questionIndex;
        if (userAnswers[overallIndex].toLowerCase().includes(question.answer.toLowerCase())) {
          newScore += 1;
        }
      });
    });
    setScore(newScore);
    setGameOver(true);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Virtual Tour Memory Challenge</h2>
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
                  {phase === 'exploration' 
                    ? "Explore the virtual locations and memorize details. You have 2 minutes." 
                    : "Answer questions about the locations you visited. You have 1.5 minutes."}
                </AlertDescription>
              </Alert>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <Progress 
                  value={(timeLeft / (phase === 'exploration' ? EXPLORATION_TIME : RECALL_TIME)) * 100} 
                  className="w-64 h-2" 
                />
                <span className="text-sm font-medium">{Math.ceil(timeLeft / 1000)}s</span>
              </div>
              {phase === 'exploration' ? (
                <div className="space-y-4">
                  <div className="relative w-full h-64">
                    <Image
                      src={LOCATIONS[currentLocationIndex].image}
                      alt={LOCATIONS[currentLocationIndex].name}
                      layout="fill"
                      objectFit="cover"
                      className="rounded-lg"
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-center">{LOCATIONS[currentLocationIndex].name}</h3>
                  <p className="text-sm text-center">{LOCATIONS[currentLocationIndex].description}</p>
                  <div className="flex justify-between mt-4">
                    <Button onClick={() => handleNavigation('prev')} variant="outline">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <Button onClick={() => handleNavigation('next')} variant="outline">
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {LOCATIONS.map((location, locationIndex) => (
                    <div key={locationIndex} className="space-y-4">
                      <h3 className="text-lg font-semibold">{location.name}</h3>
                      {location.questions.map((question, questionIndex) => {
                        const overallIndex = locationIndex * 2 + questionIndex;
                        return (
                          <div key={questionIndex} className="space-y-2">
                            <p className="text-sm font-medium">{question.question}</p>
                            <Input
                              placeholder="Your answer"
                              value={userAnswers[overallIndex]}
                              onChange={(e) => handleAnswerChange(overallIndex, e.target.value)}
                              className="w-full"
                            />
                          </div>
                        );
                      })}
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
                Your Score: {score}/{LOCATIONS.length * 2}
              </p>
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Results:</h4>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="pb-2">Location</th>
                      <th className="pb-2">Question</th>
                      <th className="pb-2">Your Answer</th>
                      <th className="pb-2">Correct Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LOCATIONS.flatMap((location, locationIndex) =>
                      location.questions.map((question, questionIndex) => {
                        const overallIndex = locationIndex * 2 + questionIndex;
                        return (
                          <tr key={`${locationIndex}-${questionIndex}`} className={overallIndex % 2 === 0 ? "bg-secondary" : ""}>
                            <td className="py-1 pr-2">{location.name}</td>
                            <td className="py-1 pr-2">{question.question}</td>
                            <td className={`py-1 pr-2 ${userAnswers[overallIndex].toLowerCase().includes(question.answer.toLowerCase()) ? "text-green-600" : "text-red-600"}`}>
                              {userAnswers[overallIndex] || "Not answered"}
                            </td>
                            <td className="py-1">{question.answer}</td>
                          </tr>
                        );
                      })
                    )}
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