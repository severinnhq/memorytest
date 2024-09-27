import React from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function TaskModal({ isOpen, onClose, children }: TaskModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
        {children}
      </DialogContent>
    </Dialog>
  )
}