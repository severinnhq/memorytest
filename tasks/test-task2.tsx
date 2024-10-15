"use client"

import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Shuffle, ArrowLeft, ArrowRight } from 'lucide-react'

interface Person {
  id: number
  name: string
  image: string
}

interface TaskResult {
  score: number
  metrics: {
    accuracy: number
    speed: number
    improvement: number
  }
}

const allPeople: Person[] = [
  { id: 1, name: "Alice", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 2, name: "Bob", image: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 3, name: "Charlie", image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 4, name: "Diana", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 5, name: "Ethan", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 6, name: "Fiona", image: "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 7, name: "George", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 8, name: "Hannah", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 9, name: "Ian", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 10, name: "Julia", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 11, name: "Kevin", image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 12, name: "Laura", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 13, name: "Michael", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 14, name: "Natalie", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 15, name: "Oliver", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 16, name: "Patricia", image: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 17, name: "Quentin", image: "https://images.unsplash.com/photo-1562124638-724e13052daf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 18, name: "Rachel", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 19, name: "Samuel", image: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
  { id: 20, name: "Tina", image: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" },
]

const PEOPLE_PER_GAME = 8

export default function LongTermMemoryTask({ onComplete }: { onComplete: (result: TaskResult) => void }) {
  const [stage, setStage] = useState<'learn' | 'wait' | 'recall' | 'result'>('learn')
  const [currentPersonIndex, setCurrentPersonIndex] = useState<number>(0)
  const [gamePeople, setGamePeople] = useState<Person[]>([])
  const [shuffledPeople, setShuffledPeople] = useState<Person[]>([])
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({})
  const [startTime, setStartTime] = useState(0)
  const [endTime, setEndTime] = useState(0)
  const [timer, setTimer] = useState(30)

  useEffect(() => {
    if (stage === 'learn') {
      const selectedPeople = selectRandomPeople(allPeople, PEOPLE_PER_GAME)
      setGamePeople(selectedPeople)
      setShuffledPeople(shuffleArray([...selectedPeople]))
      setCurrentPersonIndex(0)
    } else if (stage === 'recall') {
      setShuffledPeople(shuffleArray([...gamePeople]))
      setStartTime(Date.now())
    }
  }, [stage])

  useEffect(() => {
    if (stage === 'wait') {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval)
            setStage('recall')
            return 30
          }
          return prevTimer - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [stage])

  const selectRandomPeople = (people: Person[], count: number) => {
    const shuffled = [...people].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  const shuffleArray = (array: Person[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  const handleNextPerson = () => {
    if (currentPersonIndex < gamePeople.length - 1) {
      setCurrentPersonIndex(currentPersonIndex + 1)
    } else {
      setStage('wait')
    }
  }

  const handlePreviousPerson = () => {
    if (currentPersonIndex > 0) {
      setCurrentPersonIndex(currentPersonIndex - 1)
    }
  }

  const handleInputChange = (id: number, value: string) => {
    setUserAnswers(prev => ({ ...prev, [id]: value }))
  }

  const calculateResult = (): TaskResult => {
    const correctCount = gamePeople.filter(p => p.name.toLowerCase() === userAnswers[p.id]?.toLowerCase()).length
    const accuracy = (correctCount / gamePeople.length) * 100
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
        <CardTitle className="text-lg">Face It!</CardTitle>

      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stage === 'learn' && (
            <>
              {gamePeople.length > 0 && (
                <motion.div
                  key={gamePeople[currentPersonIndex].id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col items-center space-y-4"
                >
                  <img src={gamePeople[currentPersonIndex].image} alt={gamePeople[currentPersonIndex].name} className="w-32 h-32 rounded-full object-cover" />
                  <p className="text-2xl font-bold">{gamePeople[currentPersonIndex].name}</p>
                  <p className="text-lg">Person {currentPersonIndex + 1} of {PEOPLE_PER_GAME}</p>
                </motion.div>
              )}
              <div className="flex justify-between mt-4">
                <Button
                  onClick={handlePreviousPerson}
                  disabled={currentPersonIndex === 0}
                  className="flex-1 mr-2 text-white"
                  
                  style={{ backgroundColor: '#4f46e5', borderColor: '#4f46e5' }}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleNextPerson}
                  className="flex-1 ml-2 text-white"
                  style={{ backgroundColor: '#4f46e5', borderColor: '#4f46e5' }}
                >
                  {currentPersonIndex === PEOPLE_PER_GAME - 1 ? 'Start Test' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </>
          )}
          {stage === 'wait' && (
            <div className="text-center">
              <p className="text-xl font-semibold">Please wait for {timer} seconds...</p>
              <p className="text-6xl mt-4">⏰</p>
              <p className="text-lg mt-2">We'll test your memory soon!</p>
            </div>
          )}
          {stage === 'recall' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                {shuffledPeople.map((person) => (
                  <div key={person.id} className="flex flex-col items-center space-y-2">
                    <img src={person.image} alt="Person" className="w-24 h-24 rounded-full object-cover" />
                    <Input
                      type="text"
                      placeholder="Enter name"
                      value={userAnswers[person.id] || ''}
                      onChange={(e) => handleInputChange(person.id, e.target.value)}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
              <Button
                onClick={() => {
                  setEndTime(Date.now())
                  setStage('result')
                }}
                className="w-full mt-4 text-white"
                style={{ backgroundColor: '#4f46e5', borderColor: '#4f46e5' }}
              >
                Submit
              </Button>
            </>
          )}
          {stage === 'result' && (
            <div className="space-y-4">
              <p className="text-xl font-semibold">Your Result:</p>
              <p className="text-3xl font-bold text-center">{calculateResult().score}/100</p>
              <Button
                onClick={() => onComplete(calculateResult())}
                className="w-full text-white"
                style={{ backgroundColor: '#4f46e5', borderColor: '#4f46e5' }}
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