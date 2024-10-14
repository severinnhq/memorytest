'use client'

import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface TaskResult {
  score: number
  metrics: {
    accuracy: number
    speed: number
    improvement: number
  }
}

interface Event {
  description: string
  details: string[]
  questions: {
    question: string
    options: string[]
    correctAnswer: string
  }[]
}

const events: Event[] = [
  {
    description: "A day at the art gallery",
    details: [
      "You visited the 'Illusions of Reality' exhibition on a Tuesday",
      "There were 5 main rooms in the gallery, each with a different theme",
      "The central piece was a large mirror installation called 'Reflections of Time'",
      "You overheard a guide mention 'trompe l'oeil' and 'anamorphosis' techniques",
      "A painting of fruit by artist J. Smith looked incredibly realistic",
      "One sculpture by artist M. Johnson seemed to change shape as you walked around it",
      "The exit led to a gift shop with optical illusion toys and books",
      "The gallery's cafe served a special 'Dali-inspired' menu that day"
    ],
    questions: [
      {
        question: "What day of the week did you visit the gallery?",
        options: ["Monday", "Tuesday", "Wednesday", "Thursday"],
        correctAnswer: "Tuesday"
      },
      {
        question: "How many rooms were mentioned in total, including the gift shop and cafe?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "7"
      },
      {
        question: "What was the name of the central mirror installation?",
        options: ["Mirrors of Perception", "Reflections of Time", "Infinite Illusions", "Temporal Echoes"],
        correctAnswer: "Reflections of Time"
      },
      {
        question: "Which TWO artistic techniques were mentioned by the guide?",
        options: ["Trompe l'oeil and Cubism", "Surrealism and Anamorphosis", "Trompe l'oeil and Anamorphosis", "Impressionism and Pointillism"],
        correctAnswer: "Trompe l'oeil and Anamorphosis"
      },
      {
        question: "Who was the artist of the realistic fruit painting?",
        options: ["J. Smith", "M. Johnson", "P. Cezanne", "G. Morandi"],
        correctAnswer: "J. Smith"
      },
      {
        question: "What was unique about M. Johnson's sculpture?",
        options: ["It was very large", "It changed color", "It made sounds", "It seemed to change shape"],
        correctAnswer: "It seemed to change shape"
      },
      {
        question: "Which item was NOT mentioned as being sold in the gift shop?",
        options: ["Optical illusion toys", "Books", "Posters", "Postcards"],
        correctAnswer: "Posters"
      },
      {
        question: "What was special about the cafe's menu that day?",
        options: ["It was Picasso-inspired", "It was Dali-inspired", "It was Monet-inspired", "It was Van Gogh-inspired"],
        correctAnswer: "It was Dali-inspired"
      }
    ]
  },
  // ... (other events remain unchanged)
]

export default function EpisodicMemoryTask({ onComplete }: { onComplete: (result: TaskResult) => void }) {
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null)
  const [stage, setStage] = useState<'memorize' | 'recall' | 'result'>('memorize')
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isResultOpen, setIsResultOpen] = useState(false)

  useEffect(() => {
    if (stage === 'memorize') {
      setCurrentEvent(events[Math.floor(Math.random() * events.length)])
    }
  }, [stage])

  const handleReadyClick = () => {
    setStartTime(Date.now())
    setStage('recall')
  }

  const handleAnswerChange = (answer: string) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[currentQuestionIndex] = answer
      return newAnswers
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (currentEvent?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setEndTime(Date.now())
      setStage('result')
    }
  }

  const calculateResult = (): TaskResult => {
    if (!currentEvent) return { score: 0, metrics: { accuracy: 0, speed: 0, improvement: 0 } }
    
    const correctCount = userAnswers.filter((answer, index) => 
      answer === currentEvent.questions[index].correctAnswer
    ).length
    const accuracy = (correctCount / currentEvent.questions.length) * 100
    const speed = Math.max(0, 100 - ((endTime - startTime) / 1000 / currentEvent.questions.length))

    return {
      score: Math.round((accuracy + speed) / 2),
      metrics: {
        accuracy,
        speed,
        improvement: 0 // Placeholder value as we don't track multiple attempts
      }
    }
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-primary text-2xl">Deceptive Episodic Memory Task</CardTitle>
        <CardDescription className="text-base">Remember the details carefully. Watch out for tricky questions!</CardDescription>
      </CardHeader>
      <CardContent className="py-3">
        <div className="space-y-1">
          {stage === 'memorize' && currentEvent && (
            <>
              <p className="text-lg font-semibold text-center mb-2 text-primary">
                Event: {currentEvent.description}
              </p>
              <div className="grid gap-2 max-h-[40vh] overflow-y-auto pr-2">
                {currentEvent.details.map((detail, index) => (
                  <motion.div
                    key={index}
                    className="bg-secondary text-secondary-foreground p-3 rounded-lg shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <span className="text-sm leading-tight">{detail}</span>
                  </motion.div>
                ))}
              </div>
              <Button
                onClick={handleReadyClick}
                className="w-full mt-3 text-[0.9rem] bg-[#4f46e5] hover:bg-[#4338ca]"
              >
                I'm Ready to Recall
              </Button>
            </>
          )}
          {stage === 'recall' && currentEvent && (
            <>
              <p className="text-lg font-semibold text-center mb-2 text-primary">
                Question {currentQuestionIndex + 1} of {currentEvent.questions.length}
              </p>
              <div className="space-y-2">
                <Label className="text-primary text-base">{currentEvent.questions[currentQuestionIndex].question}</Label>
                <RadioGroup onValueChange={handleAnswerChange} value={userAnswers[currentQuestionIndex]}>
                  {currentEvent.questions[currentQuestionIndex].options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`q${currentQuestionIndex}-option${optionIndex}`} />
                      <Label htmlFor={`q${currentQuestionIndex}-option${optionIndex}`} className="text-base">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <Button
                onClick={handleNextQuestion}
                className="w-full mt-3 text-[0.9rem] bg-[#4f46e5] hover:bg-[#4338ca]"
                disabled={!userAnswers[currentQuestionIndex]}
              >
                {currentQuestionIndex < currentEvent.questions.length - 1 ? 'Next Question' : 'Finish'}
              </Button>
            </>
          )}
          {stage === 'result' && currentEvent && (
            <div className="space-y-3">
              <p className="text-2xl font-semibold text-primary">Task Completed!</p>
              <Collapsible open={isResultOpen} onOpenChange={setIsResultOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full text-[0.9rem]">
                    {isResultOpen ? 'Hide' : 'Show'} Results
                    {isResultOpen ? <ChevronUp className="w-5 h-5 ml-2" /> : <ChevronDown className="w-5 h-5 ml-2" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-3">
                  <p className="text-4xl font-bold text-center text-primary mb-4">{calculateResult().score}/100</p>
                  <p className="font-semibold text-primary text-lg mb-2">Correct Answers:</p>
                  <div className="h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                    <div className="space-y-2">
                      {currentEvent.questions.map((q, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-md shadow-sm text-sm ${
                            userAnswers[index] === q.correctAnswer
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          <p className="font-medium">{q.question}</p>
                          <p>Correct: {q.correctAnswer}</p>
                          {userAnswers[index] !== q.correctAnswer && (
                            <p className="mt-1">
                              <AlertTriangle className="inline-block w-4 h-4 mr-1" />
                              Your answer: {userAnswers[index]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
              <Button
                onClick={() => {
                  onComplete(calculateResult())
                  setUserAnswers([])
                  setCurrentQuestionIndex(0)
                  setStage('memorize')
                  setIsResultOpen(false)
                }}
                className="w-full mt-3 text-[0.9rem] bg-[#4f46e5] hover:bg-[#4338ca]"
              >
                Finish
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}