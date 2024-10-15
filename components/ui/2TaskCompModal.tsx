import React from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from 'lucide-react'

interface TwoTaskCompModalProps {
  isOpen: boolean
  onClose: () => void
  success: boolean
  onTryAgain: () => void
}

export default function TwoTaskCompModal({
  isOpen,
  onClose,
  success,
  onTryAgain
}: TwoTaskCompModalProps) {
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
        </div>
        <div className="mt-6 flex justify-center">
          <Button onClick={onTryAgain} className="bg-[#4f46e5] hover:bg-[#4338ca] text-white">
            Try Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}