"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle2, XCircle, CheckSquare } from "lucide-react"

const allTodoItems = [
  "Buy organic avocados",
  "Schedule dentist appointment",
  "Finish reading 'The Great Gatsby'",
  "Pay electricity bill",
  "Call mom for her birthday",
  "Submit quarterly report",
  "Book flight tickets to Paris",
  "Renew gym membership",
  "Update resume",
  "Plant herb garden",
  "Clean out garage",
  "Start learning Spanish",
  "Buy new running shoes",
  "Organize digital photos",
  "Schedule car maintenance"
]

const generalQuestions = [
  {
    question: "What is the capital of Spain?",
    options: ["Madrid", "Barcelona", "Seville"],
    correctAnswer: "Madrid"
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Mars", "Venus", "Jupiter"],
    correctAnswer: "Mars"
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean"],
    correctAnswer: "Pacific Ocean"
  },
  {
    question: "Who painted the Mona Lisa?",
    options: ["Leonardo da Vinci", "Michelangelo", "Raphael"],
    correctAnswer: "Leonardo da Vinci"
  },
  {
    question: "What is the chemical symbol for gold?",
    options: ["Au", "Ag", "Fe"],
    correctAnswer: "Au"
  }
]

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateTodoQuestions(todoList: string[]) {
  return todoList.map((item, index) => {
    const otherItems = allTodoItems.filter(t => t !== item);
    const similarItem = otherItems.find(t => t.split(' ')[0] === item.split(' ')[0]);
    const randomItem = shuffleArray(otherItems.filter(t => t !== similarItem))[0];
    
    const options = shuffleArray([
      item,
      similarItem || shuffleArray(otherItems)[0],
      randomItem
    ]);

    return {
      type: 'todo',
      question: `What was item #${index + 1} on the to-do list?`,
      options: options,
      correctAnswer: item
    };
  });
}

export default function DeceptiveMemoryTask() {
  const [stage, setStage] = useState<'start' | 'todo' | 'questions' | 'end'>('start')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [todoList, setTodoList] = useState<string[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [todoQuestionCount, setTodoQuestionCount] = useState(0)

  useEffect(() => {
    const newTodoList = shuffleArray([...allTodoItems]).slice(0, 10)
    setTodoList(newTodoList)
    const todoQuestions = generateTodoQuestions(newTodoList)
    const shuffledGeneralQuestions = shuffleArray([...generalQuestions])
    
    const questionSequence = [
      todoQuestions[0],
      shuffledGeneralQuestions[0],
      todoQuestions[1],
      shuffledGeneralQuestions[1],
      todoQuestions[2],
      shuffledGeneralQuestions[2],
      todoQuestions[3],
      shuffledGeneralQuestions[3],
      todoQuestions[4]
    ]
    
    setQuestions(questionSequence)
  }, [])

  const handleStart = () => {
    setStage('todo')
  }

  const handleTodoMemorized = () => {
    setStage('questions')
  }

  const handleAnswerSubmit = () => {
    if (questions[currentQuestionIndex].type === 'todo') {
      if (selectedAnswer === questions[currentQuestionIndex].correctAnswer) {
        setScore(score + 1)
      }
      setTodoQuestionCount(prev => prev + 1)
    }
    setShowResult(true)
    setTimeout(() => {
      setShowResult(false)
      setSelectedAnswer(null)
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        setStage('end')
      }
    }, 2000)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Deceptive Memory Task</CardTitle>
        <CardDescription>Test your memory with this tricky task!</CardDescription>
        {stage === 'questions' && (
          <div className="text-sm font-medium text-muted-foreground">
            To-do related questions: {todoQuestionCount} / 5
          </div>
        )}
      </CardHeader>
      <CardContent>
        {stage === 'start' && (
          <div className="space-y-4">
            <p>You will be shown a to-do list. Memorize it, then answer questions about the list and some general knowledge questions.</p>
            <Button onClick={handleStart} className="w-full">Start Task</Button>
          </div>
        )}

        {stage === 'todo' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Memorize this to-do list:</h3>
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 shadow-lg">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {todoList.map((item, index) => (
                    <li key={index} className="flex items-center space-x-3 text-lg">
                      <CheckSquare className="h-6 w-6 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Button onClick={handleTodoMemorized} className="w-full mt-6">I've memorized the list</Button>
          </div>
        )}

        {stage === 'questions' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{questions[currentQuestionIndex].question}</h3>
            <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer}>
              {questions[currentQuestionIndex].options.map((option: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
            <Button onClick={handleAnswerSubmit} disabled={!selectedAnswer || showResult} className="w-full">
              Submit Answer
            </Button>
            {showResult && (
              <div className={`flex items-center ${selectedAnswer === questions[currentQuestionIndex].correctAnswer ? 'text-green-500' : 'text-red-500'}`}>
                {selectedAnswer === questions[currentQuestionIndex].correctAnswer ? (
                  <><CheckCircle2 className="mr-2" /> Correct!</>
                ) : (
                  <><XCircle className="mr-2" /> Incorrect. The correct answer was: {questions[currentQuestionIndex].correctAnswer}</>
                )}
              </div>
            )}
          </div>
        )}

        {stage === 'end' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Task Completed!</h3>
            <p className="text-xl">Your final score: {score} out of 5</p>
            <Button onClick={() => {
              setStage('start')
              setCurrentQuestionIndex(0)
              setScore(0)
              setSelectedAnswer(null)
              setShowResult(false)
              setTodoQuestionCount(0)
              const newTodoList = shuffleArray([...allTodoItems]).slice(0, 10)
              setTodoList(newTodoList)
              const todoQuestions = generateTodoQuestions(newTodoList)
              const shuffledGeneralQuestions = shuffleArray([...generalQuestions])
              const questionSequence = [
                todoQuestions[0],
                shuffledGeneralQuestions[0],
                todoQuestions[1],
                shuffledGeneralQuestions[1],
                todoQuestions[2],
                shuffledGeneralQuestions[2],
                todoQuestions[3],
                shuffledGeneralQuestions[3],
                todoQuestions[4]
              ]
              setQuestions(questionSequence)
            }} className="w-full">Restart Task</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}