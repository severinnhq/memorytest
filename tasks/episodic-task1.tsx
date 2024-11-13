'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, Clock, Brain, BookOpen } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from 'next/image'

interface EventRecallTaskProps {
  onComplete: (success: boolean, score: number) => void;
}

const READING_TIME = 45000; // 45 seconds
const RECALL_TIME = 90000; // 90 seconds

const EVENTS = [
  {
    title: "A Day at the Beach",
    story: `Last Saturday, Sarah and her friends went to Sunny Cove Beach. They arrived at 10 AM with colorful umbrellas. Tom built a sandcastle, while Sarah played volleyball. At 2 PM, they saw dolphins jumping. Sarah found a starfish while swimming. As the sun set at 6 PM, they left for ice cream.`,
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=640&q=80",
    questions: [
      { question: "What was the beach's name?", answer: "Sunny Cove Beach" },
      { question: "What time did they arrive?", answer: "10 AM" },
      { question: "What did Tom build?", answer: "Sandcastle" },
      { question: "What game did Sarah play?", answer: "Volleyball" },
      { question: "What sea creature did Sarah find?", answer: "Starfish" }
    ]
  },
  {
    title: "An Adventure in the Mountains",
    story: `On a crisp autumn morning, Alex and his dog Max set out to hike Mount Evergreen. They began at 8 AM, carrying a backpack with snacks and water. Halfway up, they encountered a family of deer. At the summit, Alex took photos of the breathtaking view. They found a hidden waterfall on the descent and returned home by 4 PM, tired but happy.`,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=640&q=80",
    questions: [
      { question: "What was the name of the mountain?", answer: "Mount Evergreen" },
      { question: "What time did they start hiking?", answer: "8 AM" },
      { question: "What animals did they encounter?", answer: "Deer" },
      { question: "What did Alex do at the summit?", answer: "Took photos" },
      { question: "What did they discover on the way down?", answer: "Waterfall" }
    ]
  },
  {
    title: "A Night at the Museum",
    story: `Emily visited the City Museum for a special night event. She arrived at 7 PM and first explored the dinosaur exhibit. At 8:30 PM, she attended a planetarium show about black holes. Later, she tried virtual reality painting in the interactive art section. The highlight was seeing a rare meteorite at 10 PM. Emily left at 11 PM, feeling inspired and full of new knowledge.`,
    image: "https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=640&q=80",
    questions: [
      { question: "What was the name of the museum?", answer: "City Museum" },
      { question: "What time did Emily arrive?", answer: "7 PM" },
      { question: "What was the planetarium show about?", answer: "Black holes" },
      { question: "What did Emily try in the interactive art section?", answer: "Virtual reality painting" },
      { question: "What rare object did Emily see at 10 PM?", answer: "Meteorite" }
    ]
  }
];

export default function EventRecallTask({ onComplete }: EventRecallTaskProps) {
  const [phase, setPhase] = useState<'reading' | 'recall'>('reading');
  const [timeLeft, setTimeLeft] = useState(READING_TIME);
  const [event, setEvent] = useState(EVENTS[Math.floor(Math.random() * EVENTS.length)]);
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(event.questions.length).fill(''));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1000) {
          clearInterval(timer);
          if (phase === 'reading') {
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
    setUserAnswers(prev => prev.map((item, i) => i === index ? value : item));
  };

  const handleSubmit = () => {
    handleGameOver();
  };

  const handleGameOver = () => {
    const correctAnswers = userAnswers.filter((answer, index) => 
      answer.toLowerCase().trim() === event.questions[index].answer.toLowerCase()
    );
    setScore(correctAnswers.length);
    setGameOver(true);
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent className="p-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Event Recall Challenge</h2>
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
                  {phase === 'reading' 
                    ? "Read the story carefully. You have 45 seconds to memorize the details." 
                    : "Answer the questions about the story. You have 90 seconds to recall the details."}
                </AlertDescription>
              </Alert>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-4 h-4 text-primary" />
                <Progress 
                  value={(timeLeft / (phase === 'reading' ? READING_TIME : RECALL_TIME)) * 100} 
                  className="w-48 h-2" 
                />
                <span className="text-sm font-medium">{Math.ceil(timeLeft / 1000)}s</span>
              </div>
              {phase === 'reading' ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-center">{event.title}</h3>
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative w-full h-32 max-w-sm">
                      <Image
                        src={event.image}
                        alt="Event illustration"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="bg-secondary p-4 rounded-lg w-full">
                      <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-sm leading-relaxed">{event.story}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-center">Questions</h3>
                  {event.questions.map((q, index) => (
                    <div key={index} className="space-y-1">
                      <label htmlFor={`question-${index}`} className="text-sm font-medium">
                        {q.question}
                      </label>
                      <Input
                        id={`question-${index}`}
                        type="text"
                        placeholder="Your answer"
                        value={userAnswers[index]}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        className="w-full text-sm"
                      />
                    </div>
                  ))}
                  <div className="flex justify-center">
                    <Button onClick={handleSubmit} className="w-40 mt-4">Submit Answers</Button>
                  </div>
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
                Your Score: {score}/{event.questions.length}
              </p>
              <div className="mt-4">
                <h4 className="text-lg font-semibold mb-2">Results:</h4>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr>
                      <th className="pb-2">Question</th>
                      <th className="pb-2">Your Answer</th>
                      <th className="pb-2">Correct Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {event.questions.map((q, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-secondary" : ""}>
                        <td className="py-1 pr-2">{q.question}</td>
                        <td className={`py-1 pr-2 ${userAnswers[index].toLowerCase().trim() === q.answer.toLowerCase() ? "text-green-600" : "text-red-600"}`}>
                          {userAnswers[index] || "Not answered"}
                        </td>
                        <td className="py-1">{q.answer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button onClick={() => onComplete(true, score)} className="w-40 mt-4">Finish</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}