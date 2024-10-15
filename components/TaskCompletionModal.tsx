import React from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from 'lucide-react'

interface TaskCompletionModalProps {
  isOpen: boolean
  onClose: () => void
  success: boolean
  score: number
  totalRounds?: number
  qualificationThreshold?: number
  onNextTask?: () => void
  onTryAgain?: () => void
}

export default function TaskCompletionModal({
  isOpen,
  onClose,
  success,
  score,
  totalRounds,
  qualificationThreshold,
  onNextTask,
  onTryAgain
}: TaskCompletionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {success ? "Congratulations!" : "Nice Try!"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            {success ? (
              <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
            ) : (
              <XCircle className="w-16 h-16 mx-auto text-red-500" />
            )}
          </motion.div>
          <p className="mt-2 text-gray-600">
            {success
              ? "Great job! You've completed this task successfully."
              : "Don't worry! Practice makes perfect."}
          </p>
          <p className="mt-2 text-gray-600">
            Your score: {score} {totalRounds ? `/ ${totalRounds}` : ''}
            {qualificationThreshold && ` (Threshold: ${qualificationThreshold})`}
          </p>
        </div>
        <div className="mt-6 flex justify-center">
          {success && onNextTask ? (
            <Button onClick={onNextTask} className="bg-green-500 hover:bg-green-600 text-white">
              Next Task
            </Button>
          ) : (
            <Button onClick={onTryAgain} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white">
              Try Again
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}