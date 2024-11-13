'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LongTermTask3Props {
  onComplete: (success: boolean) => void;
}

const STORY_DISPLAY_DURATION = 60000; // 60 seconds to read the story
const DELAY_DURATION = 30000; // 30 seconds delay before retelling
const TOTAL_ROUNDS = 3;

const stories = [
  {
    title: "The Lost Key",
    content: "On a crisp autumn morning, Sarah realized she had lost her house key. She retraced her steps through the park, crunching leaves underfoot. Near the old oak tree, a squirrel caught her eye. It was holding something shiny – her key! Sarah approached slowly, speaking softly. The squirrel dropped the key and scampered away. Relieved, Sarah headed home, vowing to be more careful and appreciating the unexpected kindness of nature.",
    keyDetails: ["Sarah", "lost house key", "autumn morning", "park", "crunching leaves", "old oak tree", "squirrel", "shiny object", "speaking softly", "squirrel dropped key", "headed home", "vowed to be more careful", "appreciated nature's kindness"]
  },
  {
    title: "The Midnight Painter",
    content: "In a quiet town, rumors spread of a mysterious artist who only worked at midnight. Curious, Tom stayed up late one night. As the clock struck twelve, he saw a figure in the town square. Under the moonlight, the artist created a stunning mural of the town's history. When dawn broke, the artist vanished, leaving behind a masterpiece. The town celebrated the anonymous gift, and Tom kept the artist's secret, understanding the magic of midnight creativity.",
    keyDetails: ["quiet town", "mysterious artist", "worked at midnight", "Tom stayed up late", "clock struck twelve", "figure in town square", "moonlight", "mural of town's history", "artist vanished at dawn", "masterpiece left behind", "town celebrated", "anonymous gift", "Tom kept the secret", "magic of midnight creativity"]
  },
  {
    title: "The Talking Plant",
    content: "Emma received an unusual plant for her birthday. One morning, she was startled to hear it speak! The plant, named Fernie, shared wisdom from its travels around the world as a seed. Emma learned about distant lands and cultures. She kept Fernie's ability a secret, cherishing their daily chats. As Emma cared for Fernie, she noticed her own knowledge and empathy growing, much like the plant's leaves reaching for the sun.",
    keyDetails: ["Emma", "unusual plant", "birthday gift", "plant spoke", "named Fernie", "shared wisdom", "travels as a seed", "distant lands and cultures", "kept ability secret", "daily chats", "Emma's knowledge grew", "empathy increased", "plant's leaves reaching for sun"]
  }
];

const LongTermTask3: React.FC<LongTermTask3Props> = ({ onComplete }) => {
  const [currentStory, setCurrentStory] = useState<(typeof stories)[0] | null>(null);
  const [userRetelling, setUserRetelling] = useState('');
  const [showStory, setShowStory] = useState(false);
  const [showRetelling, setShowRetelling] = useState(false);
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
    const newStory = stories[round];
    setCurrentStory(newStory);
    setShowStory(true);
    setCountdown(STORY_DISPLAY_DURATION / 1000);

    setTimeout(() => {
      setShowStory(false);
      setCountdown(DELAY_DURATION / 1000);
      setTimeout(() => {
        setShowRetelling(true);
        setCountdown(0);
      }, DELAY_DURATION);
    }, STORY_DISPLAY_DURATION);
  };

  const handleRetellingChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserRetelling(event.target.value);
  };

  const handleSubmit = () => {
    if (currentStory) {
      const detailsFound = currentStory.keyDetails.filter(detail => 
        userRetelling.toLowerCase().includes(detail.toLowerCase())
      );
      const roundScore = Math.round((detailsFound.length / currentStory.keyDetails.length) * 100);
      setScore(score + roundScore);
    }

    if (round + 1 < TOTAL_ROUNDS) {
      setRound(round + 1);
      setShowRetelling(false);
      setUserRetelling('');
    } else {
      setGameOver(true);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Story Recall</h2>
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
              <p className="text-center mb-2" aria-live="polite">Time remaining: {countdown} seconds</p>
            )}
            {showStory && currentStory && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2 text-center">{currentStory.title}</h3>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <p className="text-gray-700">{currentStory.content}</p>
                </ScrollArea>
              </div>
            )}
            {showRetelling && (
              <div className="mb-4 space-y-4">
                <p className="text-center mb-2">Retell the story you just read, including as many details as possible:</p>
                <Textarea
                  value={userRetelling}
                  onChange={handleRetellingChange}
                  placeholder="Type your retelling here..."
                  className="h-[200px]"
                />
              </div>
            )}
            <Button onClick={handleSubmit} className="w-full mt-4" disabled={!showRetelling}>
              {showRetelling ? 'Submit Retelling' : 'Reading...'}
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
            <p className="text-lg mb-4">Your average score: {Math.round(score / TOTAL_ROUNDS)}%</p>
            <Button onClick={() => onComplete(true)} className="w-full">Finish</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default LongTermTask3;