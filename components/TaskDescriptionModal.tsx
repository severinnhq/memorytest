import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TaskDescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
  task: {
    name: string
    description: string
    readinessPhrase: string
  } | null
}

export default function TaskDescriptionModal({
  isOpen,
  onClose,
  onSubmit,
  task
}: TaskDescriptionModalProps) {
  if (!task) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task.name}</DialogTitle>
        </DialogHeader>
        <div className="mt-2">
          <p className="text-sm text-gray-500">{task.description}</p>
        </div>
        <div className="mt-4 bg-blue-50 rounded-lg p-4">
          <p className="text-blue-700 text-center font-medium">
            {task.readinessPhrase}
          </p>
        </div>
        <div className="mt-4">
          <Button onClick={onSubmit} className="w-full">  
            I&apos;m Ready
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}