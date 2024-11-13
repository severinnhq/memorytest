'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LongTermTask2Props {
  onComplete: (success: boolean) => void;
}

const IMAGE_COUNT = 10;
const DISPLAY_DURATION = 30000; // 30 seconds to memorize images
const DELAY_DURATION = 30000; // 30 seconds delay before recognition test
const TOTAL_ROUNDS = 3;

const allImages = [
  { id: 1, url: "https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?w=200&h=200&fit=crop&q=80" },
  { id: 2, url: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop&q=80" },
  { id: 3, url: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=200&h=200&fit=crop&q=80" },
  { id: 4, url: "https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=200&h=200&fit=crop&q=80" },
  { id: 5, url: "https://images.unsplash.com/photo-1519052537078-e6302a4968d4?w=200&h=200&fit=crop&q=80" },
  { id: 6, url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop&q=80" },
  { id: 7, url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&h=200&fit=crop&q=80" },
  { id: 8, url: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=200&h=200&fit=crop&q=80" },
  { id: 9, url: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=200&h=200&fit=crop&q=80" },
  { id: 10, url: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=200&h=200&fit=crop&q=80" },
  { id: 11, url: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=200&h=200&fit=crop&q=80" },
  { id: 12, url: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=200&h=200&fit=crop&q=80" },
  { id: 13, url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&h=200&fit=crop&q=80" },
  { id: 14, url: "https://images.unsplash.com/photo-1518155317743-a8ff43ea6a5f?w=200&h=200&fit=crop&q=80" },
  { id: 15, url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop&q=80" },
  { id: 16, url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200&h=200&fit=crop&q=80" },
  { id: 17, url: "https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=200&h=200&fit=crop&q=80" },
  { id: 18, url: "https://images.unsplash.com/photo-1531325082793-ca7c9db6a4c1?w=200&h=200&fit=crop&q=80" },
  { id: 19, url: "https://images.unsplash.com/photo-1497752531616-c3afd9760a11?w=200&h=200&fit=crop&q=80" },
  { id: 20, url: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=200&h=200&fit=crop&q=80" },
  { id: 21, url: "https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?w=200&h=200&fit=crop&q=80" },
  { id: 22, url: "https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=200&h=200&fit=crop&q=80" },
  { id: 23, url: "https://images.unsplash.com/photo-1506891536236-3e07892564b7?w=200&h=200&fit=crop&q=80" },
  { id: 24, url: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=200&h=200&fit=crop&q=80" },
  { id: 25, url: "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?w=200&h=200&fit=crop&q=80" },
  { id: 26, url: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=200&h=200&fit=crop&q=80" },
  { id: 27, url: "https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=200&h=200&fit=crop&q=80" },
  { id: 28, url: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=200&h=200&fit=crop&q=80" },
  { id: 29, url: "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=200&h=200&fit=crop&q=80" },
  { id: 30, url: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=200&h=200&fit=crop&q=80" },
];

const LongTermTask2: React.FC<LongTermTask2Props> = ({ onComplete }) => {
  const [currentImages, setCurrentImages] = useState<typeof allImages>([]);
  const [testImages, setTestImages] = useState<typeof allImages>([]);
  const [userSelections, setUserSelections] = useState<number[]>([]);
  const [showImages, setShowImages] = useState(false);
  const [showTest, setShowTest] = useState(false);
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
    const shuffled = [...allImages].sort(() => 0.5 - Math.random());
    const newImages = shuffled.slice(0, IMAGE_COUNT);
    setCurrentImages(newImages);
    setShowImages(true);
    setCountdown(DISPLAY_DURATION / 1000);

    setTimeout(() => {
      setShowImages(false);
      setCountdown(DELAY_DURATION / 1000);
      setTimeout(() => {
        const seenImages = newImages.slice(0, 5);
        const newTestImages = shuffled.slice(IMAGE_COUNT, IMAGE_COUNT + 5);
        const allTestImages = [...seenImages, ...newTestImages].sort(() => 0.5 - Math.random());
        setTestImages(allTestImages);
        setUserSelections([]);
        setShowTest(true);
        setCountdown(0);
      }, DELAY_DURATION);
    }, DISPLAY_DURATION);
  };

  const handleImageSelection = (imageId: number) => {
    setUserSelections(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleSubmit = () => {
    const correctSelections = testImages
      .filter(img => currentImages.some(currentImg => currentImg.id === img.id))
      .map(img => img.id);
    
    const correctCount = userSelections.filter(id => correctSelections.includes(id)).length;
    const incorrectCount = userSelections.length - correctCount;
    const missedCount = correctSelections.length - correctCount;

    const roundScore = correctCount - (incorrectCount + missedCount);
    setScore(score + roundScore);

    if (round + 1 < TOTAL_ROUNDS) {
      setRound(round + 1);
      setShowTest(false);
    } else {
      setGameOver(true);
    }
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Picture Recognition</h2>
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
            {showImages && (
              <div className="mb-4">
                <p className="text-center mb-2">Memorize these images:</p>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {currentImages.map((image) => (
                      <div key={image.id} className="flex flex-col items-center">
                        <img src={image.url} alt={`Memorize image ${image.id}`} className="w-32 h-32 object-cover rounded-md" />
                        <span className="mt-2 text-sm text-gray-500">Image {image.id}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
            {showTest && (
              <div className="mb-4 space-y-4">
                <p className="text-center mb-2">Select the images you've seen before:</p>
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {testImages.map((image) => (
                      <div key={image.id} className="flex flex-col items-center">
                        <div className="relative">
                          <img src={image.url} alt={`Test image ${image.id}`} className="w-32 h-32 object-cover rounded-md" />
                          <Checkbox
                            id={`image-${image.id}`}
                            checked={userSelections.includes(image.id)}
                            onCheckedChange={() => handleImageSelection(image.id)}
                            className="absolute top-2 right-2 bg-white"
                          />
                        </div>
                        <label htmlFor={`image-${image.id}`} className="mt-2 text-sm text-gray-500">Image {image.id}</label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
            <Button onClick={handleSubmit} className="w-full mt-4" disabled={!showTest}>
              {showTest ? 'Submit Answers' : 'Memorizing...'}
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
            <p className="text-lg mb-4">Your final score: {score}</p>
            <Button onClick={() => onComplete(true)} className="w-full">Finish</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default LongTermTask2;