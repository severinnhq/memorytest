'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Clock, Brain, Check, X } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface RandomCategoryWordRecallProps {
  onComplete: (success: boolean, score: number) => void;
}

const MEMORIZATION_TIME = 30000; // 30 seconds

const CATEGORIES = [
  {
    name: "At the Beach",
    words: [
      { word: "Sunscreen", emoji: "🧴" },
      { word: "Waves", emoji: "🌊" },
      { word: "Sandcastle", emoji: "🏰" },
      { word: "Seagull", emoji: "🦅" },
      { word: "Umbrella", emoji: "⛱️" },
      { word: "Surfboard", emoji: "🏄" },
      { word: "Shells", emoji: "🐚" },
      { word: "Lifeguard", emoji: "🛟" }
    ]
  },
  {
    name: "In the Kitchen",
    words: [
      { word: "Spatula", emoji: "🥄" },
      { word: "Recipe", emoji: "📖" },
      { word: "Oven", emoji: "🔥" },
      { word: "Ingredients", emoji: "🥕" },
      { word: "Apron", emoji: "👨‍🍳" },
      { word: "Blender", emoji: "🍹" },
      { word: "Cutting board", emoji: "🔪" },
      { word: "Timer", emoji: "⏲️" }
    ]
  },
  {
    name: "At the Office",
    words: [
      { word: "Deadline", emoji: "⏰" },
      { word: "Presentation", emoji: "📊" },
      { word: "Conference", emoji: "🗣️" },
      { word: "Colleague", emoji: "👥" },
      { word: "Project", emoji: "📁" },
      { word: "Email", emoji: "📧" },
      { word: "Meeting", emoji: "🤝" },
      { word: "Coffee break", emoji: "☕" }
    ]
  },
  {
    name: "In the Garden",
    words: [
      { word: "Fertilizer", emoji: "💩" },
      { word: "Pruning", emoji: "✂️" },
      { word: "Compost", emoji: "🍂" },
      { word: "Seedling", emoji: "🌱" },
      { word: "Trowel", emoji: "🧑‍🌾" },
      { word: "Watering can", emoji: "🚿" },
      { word: "Butterfly", emoji: "🦋" },
      { word: "Wheelbarrow", emoji: "🛠️" }
    ]
  },
  {
    name: "At the Gym",
    words: [
      { word: "Dumbbell", emoji: "🏋️" },
      { word: "Treadmill", emoji: "🏃" },
      { word: "Yoga mat", emoji: "🧘" },
      { word: "Protein shake", emoji: "🥤" },
      { word: "Towel", emoji: "🧼" },
      { word: "Locker", emoji: "🔐" },
      { word: "Trainer", emoji: "👟" },
      { word: "Stopwatch", emoji: "⏱️" }
    ]
  },
  {
    name: "At the Airport",
    words: [
      { word: "Passport", emoji: "🛂" },
      { word: "Luggage", emoji: "🧳" },
      { word: "Boarding pass", emoji: "🎫" },
      { word: "Security check", emoji: "🚨" },
      { word: "Duty-free", emoji: "🛍️" },
      { word: "Gate", emoji: "🚪" },
      { word: "Delay", emoji: "⏳" },
      { word: "Jet lag", emoji: "😴" }
    ]
  },
  {
    name: "In the Classroom",
    words: [
      { word: "Textbook", emoji: "📚" },
      { word: "Whiteboard", emoji: "📝" },
      { word: "Calculator", emoji: "🧮" },
      { word: "Backpack", emoji: "🎒" },
      { word: "Pencil case", emoji: "🖊️" },
      { word: "Report card", emoji: "📊" },
      { word: "Homework", emoji: "📓" },
      { word: "Bell", emoji: "🔔" }
    ]
  },
  {
    name: "At the Zoo",
    words: [
      { word: "Elephant", emoji: "🐘" },
      { word: "Zookeeper", emoji: "🧑‍🦱" },
      { word: "Enclosure", emoji: "🏞️" },
      { word: "Feeding time", emoji: "🍖" },
      { word: "Binoculars", emoji: "🔭" },
      { word: "Souvenir", emoji: "🧸" },
      { word: "Map", emoji: "🗺️" },
      { word: "Petting zoo", emoji: "🐐" }
    ]
  }
];

const RandomCategoryWordRecall: React.FC<RandomCategoryWordRecallProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'memorization' | 'recall'>('memorization');
  const [timeLeft, setTimeLeft] = useState(MEMORIZATION_TIME);
  const [category, setCategory] = useState(CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]);
  const [userInputs, setUserInputs] = useState<string[]>(Array(8).fill(''));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 'memorization') {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1000) {
            clearInterval(timer);
            setPhase('recall');
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [phase]);

  const handleInputChange = (index: number, value: string) => {
    setUserInputs(prev => prev.map((item, i) => i === index ? value : item));
  };

  const handleSubmit = () => {
    const lowerCaseInputs = userInputs.map(input => input.toLowerCase().trim());
    const correctAnswers = category.words.map(wordObj => 
      lowerCaseInputs.includes(wordObj.word.toLowerCase())
    );
    setResults(correctAnswers);
    setScore(correctAnswers.filter(Boolean).length);
    setGameOver(true);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Random Category Word Recall Challenge</h2>
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
                    ? "Memorize the words and emojis in the given category. You have 30 seconds." 
                    : "Recall and enter the words for the category. Take your time, there's no time limit."}
                </AlertDescription>
              </Alert>
              {phase === 'memorization' && (
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <Progress 
                    value={(timeLeft / MEMORIZATION_TIME) * 100} 
                    className="w-64 h-2" 
                  />
                  <span className="text-sm font-medium">{Math.ceil(timeLeft / 1000)}s</span>
                </div>
              )}
              <div className="text-center">
                <h3 className="text-lg font-semibold">{category.name}</h3>
              </div>
              {phase === 'memorization' ? (
                <div className="grid grid-cols-4 gap-2">
                  {category.words.map((wordObj, index) => (
                    <div key={index} className="flex flex-col items-center p-2 bg-secondary rounded-md">
                      <span className="text-2xl mb-1">{wordObj.emoji}</span>
                      <span className="text-xs text-center">{wordObj.word}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
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
                Your Score: {score}/8
              </p>
              <div>
                <h4 className="text-lg font-semibold mb-2">Results:</h4>
                <ul className="grid grid-cols-2 gap-2 text-sm">
                  {category.words.map((wordObj, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{wordObj.emoji} {wordObj.word}</span>
                      {results[index] ? (
                        <Check className="text-green-500 w-5 h-5" />
                      ) : (
                        <X className="text-red-500 w-5 h-5" />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <Button onClick={() => onComplete(true, score)} className="w-full mt-4">Finish</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default RandomCategoryWordRecall;