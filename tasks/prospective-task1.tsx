'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, Brain, ShoppingCart, Apple, Beef, Fish, Carrot } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface AdvancedEventBasedProspectiveMemoryTaskProps {
  onComplete: (success: boolean, score: number) => void;
}

const TASK_DURATION = 180; // 3 minutes
const ITEM_DISPLAY_TIME = 1500; // 1.5 seconds
const TARGET_ITEMS = {
  fruits: ['Apple', 'Banana', 'Orange'],
  vegetables: ['Carrot', 'Broccoli', 'Spinach'],
  proteins: ['Chicken', 'Beef', 'Fish'],
  dairy: ['Milk', 'Cheese', 'Yogurt']
};
const ALL_ITEMS = [
  ...TARGET_ITEMS.fruits, ...TARGET_ITEMS.vegetables, ...TARGET_ITEMS.proteins, ...TARGET_ITEMS.dairy,
  'Pasta', 'Rice', 'Bread', 'Cereal', 'Eggs', 'Tomato', 'Potato', 'Onion', 'Garlic', 'Lemon'
];

const CATEGORIES = ['fruits', 'vegetables', 'proteins', 'dairy'];

export default function AdvancedEventBasedProspectiveMemoryTask({ onComplete }: AdvancedEventBasedProspectiveMemoryTaskProps) {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentItem, setCurrentItem] = useState('');
  const [currentCategory, setCurrentCategory] = useState('');
  const [score, setScore] = useState(0);
  const [missedTargets, setMissedTargets] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [distractionNumber, setDistractionNumber] = useState(0);
  const [distractionResult, setDistractionResult] = useState<number | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!showInstructions && !gameOver) {
      interval = setInterval(() => {
        setTimeElapsed((prevTime) => {
          if (prevTime >= TASK_DURATION) {
            clearInterval(interval);
            setGameOver(true);
            return TASK_DURATION;
          }
          return prevTime + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showInstructions, gameOver]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (!showInstructions && !gameOver) {
      timeout = setTimeout(displayNewItem, ITEM_DISPLAY_TIME);
    }
    return () => clearTimeout(timeout);
  }, [currentItem, showInstructions, gameOver]);

  const displayNewItem = () => {
    const newItem = ALL_ITEMS[Math.floor(Math.random() * ALL_ITEMS.length)];
    setCurrentItem(newItem);
    setCurrentCategory(CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)]);
    if (Object.values(TARGET_ITEMS).some(category => category.includes(newItem))) {
      setTimeout(() => {
        setMissedTargets((prev) => prev + 1);
      }, ITEM_DISPLAY_TIME);
    }
    setDistractionNumber(Math.floor(Math.random() * 10) + 1);
    setDistractionResult(null);
  };

  const handleAction = (action: 'add' | 'skip') => {
    const isTargetItem = TARGET_ITEMS[currentCategory as keyof typeof TARGET_ITEMS]?.includes(currentItem);
    if ((action === 'add' && isTargetItem) || (action === 'skip' && !isTargetItem)) {
      setScore((prevScore) => prevScore + 1);
      if (isTargetItem) setMissedTargets((prev) => Math.max(0, prev - 1));
    } else {
      setScore((prevScore) => Math.max(0, prevScore - 1));
    }
    displayNewItem();
  };

  const handleDistraction = (result: number) => {
    setDistractionResult(result);
    if (result === distractionNumber + 1) {
      setScore((prevScore) => prevScore + 2);
    } else {
      setScore((prevScore) => Math.max(0, prevScore - 1));
    }
  };

  const startTask = () => {
    setShowInstructions(false);
    displayNewItem();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fruits': return <Apple className="w-6 h-6" />;
      case 'vegetables': return <Carrot className="w-6 h-6" />;
      case 'proteins': return <Beef className="w-6 h-6" />;
      case 'dairy': return <Fish className="w-6 h-6" />;
      default: return null;
    }
  };

  if (gameOver) {
    const totalTargets = score + missedTargets;
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
            <h2 className="text-2xl font-bold">Advanced Event-Based Prospective Memory Task Completed!</h2>
            <p className="text-3xl font-bold text-primary">
              Your Score: {score}/{totalTargets}
            </p>
            <p className="text-sm">
              You correctly responded to {score} items out of {totalTargets} opportunities.
            </p>
            <Button onClick={() => onComplete(true, score)} className="w-full mt-4">Finish</Button>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  if (showInstructions) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Advanced Event-Based Prospective Memory Task</h2>
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="mb-2">In this task, you will see various grocery items along with a category.</p>
              <p className="mb-2">Your job is to click &quot;Add to Cart&quot; when the item matches its category:</p>
              <ul className="list-disc list-inside mb-2">
                <li>Fruits: Apple, Banana, Orange</li>
                <li>Vegetables: Carrot, Broccoli, Spinach</li>
                <li>Proteins: Chicken, Beef, Fish</li>
                <li>Dairy: Milk, Cheese, Yogurt</li>
              </ul>
              <p className="mb-2">Click &quot;Skip&quot; for non-matching items.</p>
              <p className="mb-2">Additionally, solve the simple addition problem below the item.</p>
              <p>The task will last for 3 minutes. Try to be as accurate as possible!</p>
            </AlertDescription>
          </Alert>
          <Button onClick={startTask} className="w-full">Start Task</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Advanced Event-Based Prospective Memory Task</h2>
        <AnimatePresence mode="wait">
          <motion.div
            key="task"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Time Remaining: {TASK_DURATION - timeElapsed}s</span>
              <span>Score: {score}</span>
            </div>
            <Progress value={(timeElapsed / TASK_DURATION) * 100} className="w-full" />
            <div className="flex flex-col items-center justify-center h-32 space-y-2">
              <Badge variant="outline" className="text-lg px-2 py-1">
                {getCategoryIcon(currentCategory)}
                <span className="ml-2">{currentCategory}</span>
              </Badge>
              <motion.p
                key={currentItem}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="text-3xl font-bold"
              >
                {currentItem}
              </motion.p>
              <div className="text-lg">
                {distractionNumber} + 1 = 
                <input 
                  type="number" 
                  className="w-12 ml-2 p-1 border rounded"
                  value={distractionResult === null ? '' : distractionResult}
                  onChange={(e) => handleDistraction(parseInt(e.target.value))}
                />
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <Button
                onClick={() => handleAction('skip')}
                className="flex-1"
                variant="outline"
              >
                Skip
              </Button>
              <Button
                onClick={() => handleAction('add')}
                className="flex-1"
                variant="default"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}