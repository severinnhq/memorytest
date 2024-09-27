import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface Task {
  id: number;
  name: string;
  description: string;
  icon: LucideIcon;
}

interface TaskCardProps {
  task: Task;
  isUnlocked: boolean;
  onClick: () => void;
}

export default function TaskCard({ task, isUnlocked, onClick }: TaskCardProps) {
  const Icon = task.icon

  return (
    <Card 
      className={`cursor-pointer transition-all duration-300 ${isUnlocked ? 'hover:shadow-lg transform hover:-translate-y-1' : 'opacity-50'}`}
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span className="flex items-center gap-2">
            {Icon && <Icon className="w-6 h-6" />}
            {task.name}
          </span>
          {!isUnlocked && <Lock className="text-gray-400" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p>{task.description}</p>
      </CardContent>
    </Card>
  )
}