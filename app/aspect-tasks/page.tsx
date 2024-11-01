'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Brain, Clock, Cog, Book, Calendar, Footprints, Eye, Lightbulb } from 'lucide-react'

interface MemoryType {
  title: string;
  description: string;
  icon: React.ElementType;
  tasks: string[];
}

const memoryTypes: MemoryType[] = [
  {
    title: "Short-term Memory",
    description: "Holds information for a brief period",
    icon: Clock,
    tasks: [
      "Remember a phone number for a few seconds",
      "Recall the last sentence you read",
      "Remember a list of items someone just told you"
    ]
  },
  {
    title: "Long-term Memory",
    description: "Stores information for extended periods",
    icon: Brain,
    tasks: [
      "Recall your childhood home",
      "Name the capital cities of countries",
      "Describe a significant life event from years ago"
    ]
  },
  {
    title: "Working Memory",
    description: "Manipulates information for cognitive tasks",
    icon: Cog,
    tasks: [
      "Solve a math problem in your head",
      "Follow multi-step verbal instructions",
      "Rearrange a list of words alphabetically without writing"
    ]
  },
  {
    title: "Semantic Memory",
    description: "Stores general knowledge and facts",
    icon: Book,
    tasks: [
      "Define common words",
      "Explain how photosynthesis works",
      "Name the planets in our solar system"
    ]
  },
  {
    title: "Episodic Memory",
    description: "Recalls specific personal experiences",
    icon: Calendar,
    tasks: [
      "Describe your last birthday celebration",
      "Recall what you ate for dinner yesterday",
      "Remember details of a recent vacation"
    ]
  },
  {
    title: "Procedural Memory",
    description: "Stores skills and procedures",
    icon: Footprints,
    tasks: [
      "Tie your shoelaces without thinking",
      "Type on a keyboard without looking",
      "Ride a bicycle after years of not riding"
    ]
  },
  {
    title: "Sensory Memory",
    description: "Briefly retains sensory information",
    icon: Eye,
    tasks: [
      "Recall the color of a flash that just appeared",
      "Remember the last sound you heard",
      "Describe the texture of an object you just touched"
    ]
  },
  {
    title: "Prospective Memory",
    description: "Remembers to perform future tasks",
    icon: Lightbulb,
    tasks: [
      "Remember to take medication at a specific time",
      "Recall to buy milk on your way home",
      "Remember to call a friend on their birthday"
    ]
  }
]

export default function MemoryAspects() {
  const [selectedType, setSelectedType] = useState<MemoryType | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">Aspects of Memory</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {memoryTypes.map((type, index) => (
          <Card 
            key={index} 
            className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            onClick={() => setSelectedType(type)}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-xl font-semibold">{type.title}</CardTitle>
                <type.icon className="w-6 h-6 text-blue-500" />
              </div>
              <CardDescription>{type.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={selectedType !== null} onOpenChange={() => setSelectedType(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedType?.icon && <selectedType.icon className="w-6 h-6 text-blue-500" />}
              {selectedType?.title}
            </DialogTitle>
            <DialogDescription>{selectedType?.description}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Tasks to Exercise This Memory Type:</h4>
            <ul className="list-disc pl-5 space-y-2">
              {selectedType?.tasks.map((task, index) => (
                <li key={index} className="text-sm">{task}</li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}