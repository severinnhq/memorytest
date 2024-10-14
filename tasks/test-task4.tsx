"use client"

import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { X } from 'lucide-react'

interface TaskResult {
  score: number
  metrics: {
    accuracy: number
    speed: number
    improvement: number
  }
}

const topics = [
  { name: 'Fruits', words: [
    { text: 'Apple', emoji: '🍎' },
    { text: 'Banana', emoji: '🍌' },
    { text: 'Orange', emoji: '🍊' },
    { text: 'Grape', emoji: '🍇' },
    { text: 'Mango', emoji: '🥭' },
    { text: 'Pineapple', emoji: '🍍' },
    { text: 'Strawberry', emoji: '🍓' },
    { text: 'Kiwi', emoji: '🥝' }
  ]},
  { name: 'Countries', words: [
    { text: 'France', emoji: '🇫🇷' },
    { text: 'Japan', emoji: '🇯🇵' },
    { text: 'Brazil', emoji: '🇧🇷' },
    { text: 'Egypt', emoji: '🇪🇬' },
    { text: 'Canada', emoji: '🇨🇦' },
    { text: 'India', emoji: '🇮🇳' },
    { text: 'Australia', emoji: '🇦🇺' },
    { text: 'Mexico', emoji: '🇲🇽' }
  ]},
  { name: 'Animals', words: [
    { text: 'Lion', emoji: '🦁' },
    { text: 'Elephant', emoji: '🐘' },
    { text: 'Giraffe', emoji: '🦒' },
    { text: 'Penguin', emoji: '🐧' },
    { text: 'Dolphin', emoji: '🐬' },
    { text: 'Kangaroo', emoji: '🦘' },
    { text: 'Tiger', emoji: '🐯' },
    { text: 'Koala', emoji: '🐨' }
  ]},
  { name: 'Professions', words: [
    { text: 'Doctor', emoji: '👨‍⚕️' },
    { text: 'Teacher', emoji: '👩‍🏫' },
    { text: 'Engineer', emoji: '👷' },
    { text: 'Chef', emoji: '👨‍🍳' },
    { text: 'Pilot', emoji: '👨‍✈️' },
    { text: 'Artist', emoji: '👨‍🎨' },
    { text: 'Lawyer', emoji: '⚖️' },
    { text: 'Scientist', emoji: '🔬' }
  ]},
  { name: 'Sports', words: [
    { text: 'Soccer', emoji: '⚽' },
    { text: 'Basketball', emoji: '🏀' },
    { text: 'Tennis', emoji: '🎾' },
    { text: 'Swimming', emoji: '🏊' },
    { text: 'Volleyball', emoji: '🏐' },
    { text: 'Golf', emoji: '⛳' },
    { text: 'Cricket', emoji: '🏏' },
    { text: 'Skiing', emoji: '⛷️' }
  ]},
  { name: 'Colors', words: [
    { text: 'Red', emoji: '🔴' },
    { text: 'Blue', emoji: '🔵' },
    { text: 'Green', emoji: '🟢' },
    { text: 'Yellow', emoji: '🟡' },
    { text: 'Purple', emoji: '🟣' },
    { text: 'Orange', emoji: '🟠' },
    { text: 'Pink', emoji: '🎀' },
    { text: 'Brown', emoji: '🟤' }
  ]},
  { name: 'Instruments', words: [
    { text: 'Piano', emoji: '🎹' },
    { text: 'Guitar', emoji: '🎸' },
    { text: 'Violin', emoji: '🎻' },
    { text: 'Drums', emoji: '🥁' },
    { text: 'Flute', emoji: '🎶' },
    { text: 'Saxophone', emoji: '🎷' },
    { text: 'Trumpet', emoji: '🎺' },
    { text: 'Cello', emoji: '🪕' }
  ]},
  { name: 'Planets', words: [
    { text: 'Mercury', emoji: '☿' },
    { text: 'Venus', emoji: '♀' },
    { text: 'Earth', emoji: '🌎' },
    { text: 'Mars', emoji: '♂' },
    { text: 'Jupiter', emoji: '♃' },
    { text: 'Saturn', emoji: '♄' },
    { text: 'Uranus', emoji: '⛢' },
    { text: 'Neptune', emoji: '♆' }
  ]}
]

const getRandomTopic = () => topics[Math.floor(Math.random() * topics.length)]

export default function SemanticMemoryTask({ onComplete }: { onComplete: (result: TaskResult) => void }) {
  const [currentTopic, setCurrentTopic] = useState<typeof topics[0] | null>(null)
  const [userWords, setUserWords] = useState<string[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [stage, setStage] = useState<'memorize' | 'recall' | 'result'>('memorize')
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)

  useEffect(() => {
    if (stage === 'memorize') {
      setCurrentTopic(getRandomTopic())
    }
  }, [stage])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value)
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentInput.trim() && userWords.length < 8) {
      setUserWords(prev => [...prev, currentInput.trim()])
      setCurrentInput('')
    }
  }

  const handleReadyClick = () => {
    setStartTime(Date.now())
    setStage('recall')
  }

  const calculateResult = (): TaskResult => {
    if (!currentTopic) return { score: 0, metrics: { accuracy: 0, speed: 0, improvement: 0 } }
    
    const correctCount = userWords.filter(word => 
      currentTopic.words.some(topicWord => topicWord.text.toLowerCase() === word.toLowerCase())
    ).length
    const accuracy = (correctCount / currentTopic.words.length) * 100
    const speed = Math.max(0, 100 - ((endTime - startTime) / 1000))

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
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-[#4f46e5]">Semantic Memory Task</CardTitle>
        <CardDescription>Memorize and recall 8 words related to a given topic</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stage === 'memorize' && currentTopic && (
            <>
              <p className="text-xl font-semibold text-center mb-4 text-[#4f46e5]">
                Topic: {currentTopic.name}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {currentTopic.words.map((word, index) => (
                  <motion.div
                    key={index}
                    className="bg-white text-black p-2 rounded-lg text-center min-h-[60px] flex flex-col items-center justify-center shadow-md"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <span className="text-2xl mb-1">{word.emoji}</span>
                    <span className="text-sm break-words">{word.text}</span>
                  </motion.div>
                ))}
              </div>
              <Button
                onClick={handleReadyClick}
                className="w-full mt-4 bg-[#4f46e5] hover:bg-[#4338ca] text-white"
              >
                Ready to Recall
              </Button>
            </>
          )}
          {stage === 'recall' && currentTopic && (
            <>
              <p className="text-xl font-semibold text-center mb-4 text-[#4f46e5]">
                Recall words related to: {currentTopic.name}
              </p>
              <form onSubmit={handleInputSubmit} className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Type a word"
                    value={currentInput}
                    onChange={handleInputChange}
                    className="flex-grow"
                  />
                  <Button type="submit" disabled={!currentInput.trim() || userWords.length >= 8} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white">
                    Add
                  </Button>
                </div>
              </form>
              <div className="flex flex-wrap gap-2 mt-4">
                {userWords.map((word, index) => (
                  <div key={index} className="bg-white text-black p-2 rounded-lg flex items-center shadow-md">
                    <span className="text-sm break-words">{word}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 h-5 w-5 text-[#4f46e5] hover:bg-[#4f46e5] hover:text-white"
                      onClick={() => setUserWords(prev => prev.filter((_, i) => i !== index))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <p className="text-[#4f46e5]">{userWords.length} / 8 words</p>
                <Button
                  onClick={() => {
                    setEndTime(Date.now())
                    setStage('result')
                  }}
                  disabled={userWords.length !== 8}
                  className="bg-[#4f46e5] hover:bg-[#4338ca] text-white"
                >
                  Submit
                </Button>
              </div>
            </>
          )}
          {stage === 'result' && (
            <div className="space-y-4">
              <p className="text-xl font-semibold text-[#4f46e5]">Your Result:</p>
              <p className="text-3xl font-bold text-center text-[#4f46e5]">{calculateResult().score}/100</p>
              <div className="space-y-2">
                <p className="font-semibold text-[#4f46e5]">Correct words:</p>
                <ul className="list-disc list-inside">
                  {userWords.filter(word => 
                    currentTopic?.words.some(topicWord => topicWord.text.toLowerCase() === word.toLowerCase())
                  ).map((word, index) => (
                    <li key={index} className="text-black">
                      {word} {currentTopic?.words.find(w => w.text.toLowerCase() === word.toLowerCase())?.emoji}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                onClick={() => {
                  onComplete(calculateResult())
                  setCurrentTopic(getRandomTopic())
                  setUserWords([])
                  setStage('memorize')
                }}
                className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white"
              >
                Play Again
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}